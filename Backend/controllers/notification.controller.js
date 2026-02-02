import Notification from '../models/notification.model.js';

export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user._id })
            .sort({ createdAt: -1 })
            .limit(50);
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) return res.status(404).json({ message: 'Notification not found' });

        if (notification.recipient.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        notification.isRead = true;
        await notification.save();
        res.json(notification);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const createNotification = async (recipient, message, type, relatedId, onModel) => {
    try {
        await Notification.create({
            recipient,
            message,
            type,
            relatedId,
            onModel
        });
    } catch (err) {
        console.error('Error creating notification:', err);
    }
};
