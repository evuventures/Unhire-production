import {
    getAvailableProjectsService,
    claimProjectService,
    submitDraftService,
    getExpertProjectsService,
    getExpertProfileService,
} from "../services/expert.service.js";

/**
 * GET /api/expert/available-projects
 * Get list of available projects for experts to claim
 */
export const getAvailableProjects = async (req, res) => {
    try {
        const { category } = req.query;
        const projects = await getAvailableProjectsService(category);
        res.status(200).json(projects);
    } catch (err) {
        console.error("Get available projects error:", err);
        res.status(500).json({ message: "Error fetching available projects", error: err.message });
    }
};

/**
 * POST /api/expert/claim/:projectId
 * Claim a project
 */
export const claimProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const expertId = req.user.id;

        const project = await claimProjectService(projectId, expertId);

        res.status(200).json({
            message: "Project claimed successfully",
            project,
        });
    } catch (err) {
        console.error("Claim project error:", err);

        // Handle specific error cases
        if (err.message.includes("already claimed") || err.message.includes("not available")) {
            return res.status(409).json({ message: err.message });
        }

        res.status(500).json({ message: "Error claiming project", error: err.message });
    }
};

/**
 * POST /api/expert/submit/:projectId
 * Submit draft for a claimed project
 */
export const submitDraft = async (req, res) => {
    try {
        const { projectId } = req.params;
        const expertId = req.user.id;
        const { content, url } = req.body;

        if (!content && !url) {
            return res.status(400).json({ message: "Please provide draft content or URL" });
        }

        const project = await submitDraftService(projectId, expertId, { content, url });

        res.status(200).json({
            message: "Draft submitted successfully",
            project,
        });
    } catch (err) {
        console.error("Submit draft error:", err);

        // Handle specific error cases
        if (err.message.includes("not found") || err.message.includes("not assigned")) {
            return res.status(404).json({ message: err.message });
        }

        if (err.message.includes("deadline has passed")) {
            return res.status(410).json({ message: err.message }); // 410 Gone
        }

        res.status(500).json({ message: "Error submitting draft", error: err.message });
    }
};

/**
 * GET /api/expert/my-projects
 * Get all projects claimed by the expert
 */
export const getMyProjects = async (req, res) => {
    try {
        const expertId = req.user.id;
        const projects = await getExpertProjectsService(expertId);
        res.status(200).json(projects);
    } catch (err) {
        console.error("Get my projects error:", err);
        res.status(500).json({ message: "Error fetching your projects", error: err.message });
    }
};

/**
 * GET /api/expert/profile
 * Get expert profile and statistics
 */
export const getExpertProfile = async (req, res) => {
    try {
        const expertId = req.user.id;
        const profileData = await getExpertProfileService(expertId);
        res.status(200).json(profileData);
    } catch (err) {
        console.error("Get expert profile error:", err);

        if (err.message === "Expert not found") {
            return res.status(404).json({ message: err.message });
        }

        res.status(500).json({ message: "Error fetching expert profile", error: err.message });
    }
};
