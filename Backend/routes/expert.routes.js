import express from "express";
import {
    getAvailableProjects,
    claimProject,
    submitDraft,
    getMyProjects,
    getExpertProfile,
} from "../controllers/expert.controller.js";
import { protect, authorizeRoles } from "../middleware/auth.middleware.js";
import { applyForExpert, getMyExpertApplication } from "../controllers/expertApplication.controller.js";

const router = express.Router();

// All routes are protected and require expert role
router.use(protect);

router.post("/apply", applyForExpert);
router.get("/my-application", getMyExpertApplication);
 
// Only approved experts can access expert work routes
router.get("/available-projects", authorizeRoles("expert"), getAvailableProjects);
router.get("/my-projects", authorizeRoles("expert"), getMyProjects);
router.get("/profile", authorizeRoles("expert"), getExpertProfile);
router.post("/claim/:projectId", authorizeRoles("expert"), claimProject);
router.post("/submit/:projectId", authorizeRoles("expert"), submitDraft);

export default router;
