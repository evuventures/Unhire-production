import { Project } from "../models/project.model.js";
import User from "../models/user.model.js";
import { createNotification } from "./notification.service.js";
import {
    sendDraftApprovalEmail,
    sendDraftRejectionEmail,
    sendProjectExpirationEmail,
    sendProjectAssignmentEmail
} from "./email.service.js";

const MAX_ATTEMPTS = 3;

/**
 * Approve a submitted draft
 * @param {String} projectId - Project ID
 * @param {String} clientId - Client User ID (for verification)
 * @returns {Object} Updated project
 */
export const approveDraftService = async (projectId, clientId) => {
    const project = await Project.findOne({
        _id: projectId,
        clientId: clientId,
        status: "submitted",
        draftSubmitted: true,
    });

    if (!project) {
        throw new Error("Project not found, not yours, or no draft to review");
    }

    // Update project status
    project.draftStatus = "accepted";
    project.status = "completed";
    await project.save();

    // Notify the expert
    await createNotification(
        project.assignedExpert,
        "draft_approved",
        `Your draft for "${project.title}" has been approved! The project is now complete.`,
        project._id
    );

    // Send email (fetch expert object — assignedExpert is unpopulated ObjectId here)
    const expert = await User.findById(project.assignedExpert);
    if (expert) {
        sendDraftApprovalEmail(expert, project).catch(err =>
            console.error("[EMAIL] Failed to send approval email:", err.message)
        );
    }

    await project.populate("clientId assignedExpert", "name email role");
    return project;
};

/**
 * Reject a submitted draft and auto-reassign to next expert
 * @param {String} projectId - Project ID
 * @param {String} clientId - Client User ID (for verification)
 * @param {String} rejectionReason - Optional reason for rejection
 * @returns {Object} Updated project with reassignment info
 */
export const rejectDraftService = async (projectId, clientId, rejectionReason = null) => {
    const project = await Project.findOne({
        _id: projectId,
        clientId: clientId,
        status: "submitted",
        draftSubmitted: true,
    });

    if (!project) {
        throw new Error("Project not found, not yours, or no draft to review");
    }

    const rejectedExpertId = project.assignedExpert;

    // Add current expert to rejected list
    if (rejectedExpertId && !project.rejectedExperts.some(id => id.toString() === rejectedExpertId.toString())) {
        project.rejectedExperts.push(rejectedExpertId);
    }

    // Increment attempts count
    project.attemptsCount += 1;
    project.draftStatus = "rejected";

    // Notify the rejected expert
    if (rejectedExpertId) {
        const reasonText = rejectionReason ? ` Reason: ${rejectionReason}` : "";
        await createNotification(
            rejectedExpertId,
            "draft_rejected",
            `Your draft for "${project.title}" was not approved.${reasonText}`,
            project._id
        );
        const expert = await User.findById(rejectedExpertId);
        if (expert) {
            sendDraftRejectionEmail(expert, project, rejectionReason).catch(err =>
                console.error("[EMAIL] Failed to send rejection email:", err.message)
            );
        }
    }

    // Check if max attempts reached
    if (project.attemptsCount >= MAX_ATTEMPTS) {
        project.status = "expired";
        project.assignedExpert = null;
        project.draftSubmitted = false;
        project.draftContent = null;
        project.draftUrl = null;
        await project.save();

        // Notify client about expiration
        await createNotification(
            clientId,
            "project_expired",
            `Project "${project.title}" has expired after ${MAX_ATTEMPTS} failed attempts.`,
            project._id
        );
        const client = await User.findById(clientId);
        if (client) {
            sendProjectExpirationEmail(client, project).catch(err =>
                console.error("[EMAIL] Failed to send expiration email:", err.message)
            );
        }

        await project.populate("clientId", "name email role");
        return { project, reassigned: false, expired: true };
    }

    // Try to auto-reassign to another expert
    const reassignResult = await autoReassignProject(project);

    await project.populate("clientId assignedExpert", "name email role");
    return { project, ...reassignResult };
};

/**
 * Auto-reassign project to next available expert
 * @param {Object} project - Project document
 * @returns {Object} Reassignment result
 */
const autoReassignProject = async (project) => {
    // Find available experts in the same category, excluding rejected ones
    const query = {
        role: "expert",
        _id: { $nin: project.rejectedExperts },
    };

    // If project has a category, prefer experts with matching skills
    const availableExperts = await User.find(query)
        .select("_id name email skills rating")
        .sort({ rating: -1 }); // Prioritize higher-rated experts

    if (availableExperts.length === 0) {
        // No experts available - mark as unassigned but keep active
        project.status = "active";
        project.assignedExpert = null;
        project.assignedAt = null;
        project.draftSubmitted = false;
        project.draftContent = null;
        project.draftUrl = null;
        project.draftStatus = null;
        await project.save();

        return { reassigned: false, expired: false, noExpertsAvailable: true };
    }

    // Assign to the first (highest-rated) available expert
    const newExpert = availableExperts[0];

    project.status = "in_progress";
    project.assignedExpert = newExpert._id;
    project.assignedAt = new Date(); // Reset the 3-hour timer
    project.draftSubmitted = false;
    project.draftContent = null;
    project.draftUrl = null;
    project.draftStatus = null;
    await project.save();

    // Notify the new expert
    await createNotification(
        newExpert._id,
        "project_assigned",
        `You have been assigned to project "${project.title}". You have 3 hours to submit your draft.`,
        project._id
    );

    // Send email to new expert (non-blocking)
    sendProjectAssignmentEmail(newExpert, project).catch(err =>
        console.error("[EMAIL] Failed to send assignment email:", err.message)
    );

    return {
        reassigned: true,
        expired: false,
        newExpert: {
            _id: newExpert._id,
            name: newExpert.name,
            email: newExpert.email,
        }
    };
};

/**
 * Get draft review status for a project
 * @param {String} projectId - Project ID
 * @returns {Object} Draft status info
 */
export const getDraftStatusService = async (projectId) => {
    const project = await Project.findById(projectId)
        .select("title status draftStatus draftSubmitted draftContent draftUrl submittedAt attemptsCount")
        .populate("assignedExpert", "name email");

    if (!project) {
        throw new Error("Project not found");
    }

    return {
        projectId: project._id,
        title: project.title,
        status: project.status,
        draftStatus: project.draftStatus,
        draftSubmitted: project.draftSubmitted,
        draftContent: project.draftContent,
        draftUrl: project.draftUrl,
        submittedAt: project.submittedAt,
        attemptsCount: project.attemptsCount,
        assignedExpert: project.assignedExpert,
    };
};
