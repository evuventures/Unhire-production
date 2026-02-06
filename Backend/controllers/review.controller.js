// controllers/review.controller.js
import {
    approveDraftService,
    rejectDraftService,
    getDraftStatusService,
} from "../services/review.service.js";

/**
 * POST /api/projects/:id/review
 * Client approves or rejects a submitted draft
 */
export const reviewDraft = async (req, res) => {
    try {
        const { id: projectId } = req.params;
        const clientId = req.user.id;
        const { action, reason } = req.body;

        if (!action || !["approve", "reject"].includes(action)) {
            return res.status(400).json({
                message: "Invalid action. Must be 'approve' or 'reject'",
            });
        }

        let result;

        if (action === "approve") {
            const project = await approveDraftService(projectId, clientId);
            result = {
                message: "Draft approved successfully. Project is now complete.",
                project,
            };
        } else {
            const rejectionResult = await rejectDraftService(projectId, clientId, reason);

            if (rejectionResult.expired) {
                result = {
                    message: `Draft rejected. Project has expired after maximum attempts.`,
                    project: rejectionResult.project,
                    expired: true,
                };
            } else if (rejectionResult.reassigned) {
                result = {
                    message: `Draft rejected. Project reassigned to a new expert.`,
                    project: rejectionResult.project,
                    reassigned: true,
                    newExpert: rejectionResult.newExpert,
                };
            } else if (rejectionResult.noExpertsAvailable) {
                result = {
                    message: `Draft rejected. No available experts to reassign. Project is now open for claims.`,
                    project: rejectionResult.project,
                    noExpertsAvailable: true,
                };
            }
        }

        res.status(200).json(result);
    } catch (err) {
        console.error("Review draft error:", err);

        if (err.message.includes("not found") || err.message.includes("not yours")) {
            return res.status(404).json({ message: err.message });
        }

        res.status(500).json({ message: "Error reviewing draft", error: err.message });
    }
};

/**
 * GET /api/projects/:id/draft-status
 * Get the current draft/review status for a project
 */
export const getDraftStatus = async (req, res) => {
    try {
        const { id: projectId } = req.params;
        const status = await getDraftStatusService(projectId);
        res.status(200).json(status);
    } catch (err) {
        console.error("Get draft status error:", err);

        if (err.message === "Project not found") {
            return res.status(404).json({ message: err.message });
        }

        res.status(500).json({ message: "Error fetching draft status", error: err.message });
    }
};
