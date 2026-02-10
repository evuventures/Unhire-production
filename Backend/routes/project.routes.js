import express from "express";
import { createProject, getAllProjects, getProjectsByClientId, getProjectStatus } from "../controllers/project.controller.js";
import { reviewDraft, getDraftStatus } from "../controllers/review.controller.js";
import { protect, authorizeRoles } from "../middleware/auth.middleware.js";

const router = express.Router();



// Client creates project → Gemini recommendation triggers automatically

router.post("/", protect, authorizeRoles("client"), createProject); // client posts project
router.get("/", protect, getAllProjects); // list all projects
router.get("/client/:clientId", protect, authorizeRoles("client"), getProjectsByClientId); // list all projects for a client

// GET /api/projects/:id/status
router.get("/:id/status", protect, getProjectStatus);

// GET /api/projects/:id/draft-status - Get draft review status
router.get("/:id/draft-status", protect, getDraftStatus);

// POST /api/projects/:id/review - Client approves/rejects draft
router.post("/:id/review", protect, authorizeRoles("client"), reviewDraft);

export default router;

