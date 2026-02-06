// controllers/notification.controller.js
import {
    getUserNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
} from "../services/notification.service.js";

/**
 * GET /api/notifications
 * Get all notifications for the authenticated user
 */
export const getNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const notifications = await getUserNotifications(userId);
        const unreadCount = await getUnreadCount(userId);

        res.status(200).json({
            notifications,
            unreadCount,
        });
    } catch (err) {
        console.error("Get notifications error:", err);
        res.status(500).json({ message: "Error fetching notifications", error: err.message });
    }
};

/**
 * PUT /api/notifications/:id/read
 * Mark a specific notification as read
 */
export const markNotificationRead = async (req, res) => {
    try {
        const { id: notificationId } = req.params;
        const userId = req.user.id;

        const notification = await markAsRead(notificationId, userId);

        res.status(200).json({
            message: "Notification marked as read",
            notification,
        });
    } catch (err) {
        console.error("Mark notification read error:", err);

        if (err.message === "Notification not found") {
            return res.status(404).json({ message: err.message });
        }

        res.status(500).json({ message: "Error updating notification", error: err.message });
    }
};

/**
 * PUT /api/notifications/read-all
 * Mark all notifications as read for the authenticated user
 */
export const markAllNotificationsRead = async (req, res) => {
    try {
        const userId = req.user.id;
        const count = await markAllAsRead(userId);

        res.status(200).json({
            message: `${count} notification(s) marked as read`,
            updatedCount: count,
        });
    } catch (err) {
        console.error("Mark all notifications read error:", err);
        res.status(500).json({ message: "Error updating notifications", error: err.message });
    }
};
