import express from "express";
import { protect, authorizeRoles } from "../middleware/auth.middleware.js";
import {
  getUsers,
  listExpertApplications,
  reviewExpertApplication,
  adminAnalytics,
  overrideProject,
  listDisputes,
  resolveDispute,
} from "../controllers/admin.controller.js";

const router = express.Router();
router.use(protect, authorizeRoles("admin"));

router.get("/users", getUsers);

router.get("/expert-applications", listExpertApplications);
router.patch("/expert-applications/:id", reviewExpertApplication);

router.get("/analytics", adminAnalytics);
router.patch("/projects/:id/override", overrideProject);

router.get("/disputes", listDisputes);
router.patch("/disputes/:id/resolve", resolveDispute);

export default router;