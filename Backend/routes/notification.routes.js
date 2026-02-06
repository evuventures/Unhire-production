// routes/notification.routes.js
import express from "express";
import {
    getNotifications,
    markNotificationRead,
    markAllNotificationsRead,
} from "../controllers/notification.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// All notification routes require authentication
router.use(protect);

// GET /api/notifications - Get user's notifications
router.get("/", getNotifications);

// PUT /api/notifications/read-all - Mark all as read
router.put("/read-all", markAllNotificationsRead);

// PUT /api/notifications/:id/read - Mark single notification as read
router.put("/:id/read", markNotificationRead);

export default router;
