import express from "express";
import {
    getAvailableProjects,
    claimProject,
    submitDraft,
    getMyProjects,
    getExpertProfile,
} from "../controllers/expert.controller.js";
import { protect, authorizeRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

// All routes are protected and require expert role
router.use(protect, authorizeRoles("expert"));

// GET /api/expert/available-projects - List available projects
router.get("/available-projects", getAvailableProjects);

// GET /api/expert/my-projects - Get expert's claimed projects
router.get("/my-projects", getMyProjects);

// GET /api/expert/profile - Get expert profile and stats
router.get("/profile", getExpertProfile);

// POST /api/expert/claim/:projectId - Claim a project
router.post("/claim/:projectId", claimProject);

// POST /api/expert/submit/:projectId - Submit draft
router.post("/submit/:projectId", submitDraft);

export default router;
