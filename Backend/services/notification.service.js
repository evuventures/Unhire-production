// services/notification.service.js
import { Notification } from "../models/notification.model.js";

/**
 * Create a new notification
 * @param {String} userId - Recipient user ID
 * @param {String} type - Notification type
 * @param {String} message - Notification message
 * @param {String} projectId - Related project ID (optional)
 * @returns {Object} Created notification
 */
export const createNotification = async (userId, type, message, projectId = null) => {
    const notification = new Notification({
        userId,
        type,
        message,
        projectId,
    });
    return await notification.save();
};

/**
 * Get all notifications for a user
 * @param {String} userId - User ID
 * @returns {Array} List of notifications
 */
export const getUserNotifications = async (userId) => {
    return await Notification.find({ userId })
        .populate("projectId", "title status")
        .sort({ createdAt: -1 });
};

/**
 * Get unread notification count for a user
 * @param {String} userId - User ID
 * @returns {Number} Unread count
 */
export const getUnreadCount = async (userId) => {
    return await Notification.countDocuments({ userId, read: false });
};

/**
 * Mark a notification as read
 * @param {String} notificationId - Notification ID
 * @param {String} userId - User ID (for verification)
 * @returns {Object} Updated notification
 */
export const markAsRead = async (notificationId, userId) => {
    const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, userId },
        { read: true },
        { new: true }
    );
    if (!notification) {
        throw new Error("Notification not found");
    }
    return notification;
};

/**
 * Mark all notifications as read for a user
 * @param {String} userId - User ID
 * @returns {Number} Number of updated notifications
 */
export const markAllAsRead = async (userId) => {
    const result = await Notification.updateMany(
        { userId, read: false },
        { read: true }
    );
    return result.modifiedCount;
};
