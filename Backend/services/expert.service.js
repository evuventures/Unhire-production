import { Project } from "../models/project.model.js";
import User from "../models/user.model.js";
import { createNotification } from "./notification.service.js";

/**
 * Get available projects for experts to claim
 * @param {String} category - Optional category filter
 * @returns {Array} List of available projects
 */
export const getAvailableProjectsService = async (category = null) => {
    const query = {
        status: { $in: ["active", "unassigned"] },
        assignedExpert: null,
    };

    if (category) {
        query.category = category;
    }

    const projects = await Project.find(query)
        .populate("clientId", "name email")
        .sort({ createdAt: -1 });

    return projects;
};

/**
 * Claim a project for an expert (atomic operation)
 * @param {String} projectId - Project ID
 * @param {String} expertId - Expert User ID
 * @returns {Object} Updated project
 */
export const claimProjectService = async (projectId, expertId) => {
    // Use findOneAndUpdate with conditions to ensure atomic operation
    // This prevents race conditions when multiple experts try to claim simultaneously
    const project = await Project.findOneAndUpdate(
        {
            _id: projectId,
            assignedExpert: null, // Only claim if not already assigned
            status: { $in: ["active", "unassigned"] },
        },
        {
            $set: {
                assignedExpert: expertId,
                assignedAt: new Date(),
                status: "in_progress",
            },
        },
        { new: true, runValidators: true }
    ).populate("clientId assignedExpert", "name email role");

    if (!project) {
        throw new Error("Project is already claimed or not available");
    }

    // Notify the expert about the assignment
    await createNotification(
        expertId,
        "project_assigned",
        `You have claimed project "${project.title}". You have 3 hours to submit your draft.`,
        project._id
    );

    return project;
};

/**
 * Submit draft for a claimed project
 * @param {String} projectId - Project ID
 * @param {String} expertId - Expert User ID
 * @param {Object} draftData - { content, url }
 * @returns {Object} Updated project
 */
export const submitDraftService = async (projectId, expertId, draftData) => {
    const project = await Project.findOne({
        _id: projectId,
        assignedExpert: expertId,
        status: "in_progress",
    });

    if (!project) {
        throw new Error("Project not found, not assigned to you, or already submitted");
    }

    // Check if project has timed out (3 hours = 180 minutes)
    const assignedTime = new Date(project.assignedAt).getTime();
    const currentTime = Date.now();
    const threeHours = 3 * 60 * 60 * 1000;

    if (currentTime - assignedTime > threeHours) {
        project.status = "timeout";
        await project.save();
        throw new Error("Project submission deadline has passed");
    }

    // Update project with draft
    project.draftContent = draftData.content || null;
    project.draftUrl = draftData.url || null;
    project.submittedAt = new Date();
    project.draftSubmitted = true;
    project.draftStatus = "pending_review";
    project.status = "submitted";

    await project.save();
    await project.populate("clientId assignedExpert", "name email role");

    // Notify the client about the draft submission
    if (project.clientId) {
        await createNotification(
            project.clientId._id || project.clientId,
            "draft_submitted",
            `Expert has submitted a draft for your project "${project.title}". Please review.`,
            project._id
        );
    }

    return project;
};

/**
 * Get all projects claimed by an expert
 * @param {String} expertId - Expert User ID
 * @returns {Array} List of expert's projects with time remaining
 */
export const getExpertProjectsService = async (expertId) => {
    const projects = await Project.find({
        assignedExpert: expertId,
    })
        .populate("clientId", "name email")
        .sort({ assignedAt: -1 });

    // Calculate remaining time for each project
    const projectsWithTime = projects.map((project) => {
        const projectObj = project.toObject();

        if (project.status === "in_progress" && project.assignedAt) {
            const assignedTime = new Date(project.assignedAt).getTime();
            const expiryTime = assignedTime + 3 * 60 * 60 * 1000; // 3 hours
            const now = Date.now();
            let remainingMs = expiryTime - now;

            if (remainingMs < 0) remainingMs = 0;

            projectObj.remainingTime = {
                hours: Math.floor(remainingMs / (1000 * 60 * 60)),
                minutes: Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((remainingMs % (1000 * 60)) / 1000),
                totalMs: remainingMs,
            };
        }

        return projectObj;
    });

    return projectsWithTime;
};

/**
 * Get expert profile with stats
 * @param {String} expertId - Expert User ID
 * @returns {Object} Expert profile with stats
 */
export const getExpertProfileService = async (expertId) => {
    const expert = await User.findById(expertId).select("-password");

    if (!expert || expert.role !== "expert") {
        throw new Error("Expert not found");
    }

    // Get project statistics
    const totalClaimed = await Project.countDocuments({
        assignedExpert: expertId,
    });

    const completedProjects = await Project.countDocuments({
        assignedExpert: expertId,
        status: "completed",
    });

    const inProgressProjects = await Project.countDocuments({
        assignedExpert: expertId,
        status: "in_progress",
    });

    const submittedProjects = await Project.countDocuments({
        assignedExpert: expertId,
        status: "submitted",
    });

    return {
        expert: expert.toObject(),
        stats: {
            totalClaimed,
            completedProjects,
            inProgressProjects,
            submittedProjects,
        },
    };
};
