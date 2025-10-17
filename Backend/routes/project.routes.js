import express from "express";
import { createProject, getAllProjects, getProjectStatus } from "../controllers/project.controller.js";
import { protect, authorizeRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("client"), createProject); // client posts project
router.get("/", protect, getAllProjects); // list all projects

// GET /api/projects/:id/status
router.get("/:id/status", protect, getProjectStatus);

export default router;
