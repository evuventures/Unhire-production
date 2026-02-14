import User from '../models/user.model.js';
import Project from '../models/project.model.js';

// Get all users (with optional role filter)
export const getUsers = async (req, res) => {
    try {
        const { role, status } = req.query;
        const query = {};
        if (role) query.role = role;
        if (status) query.expertStatus = status;

        const users = await User.find(query).select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching users', error: err.message });
    }
};

// Get Dashboard Stats
export const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalClients = await User.countDocuments({ role: 'client' });
        const totalExperts = await User.countDocuments({ role: 'expert' });
        const pendingExperts = await User.countDocuments({ expertStatus: 'pending' });

        const totalProjects = await Project.countDocuments();
        const activeProjects = await Project.countDocuments({ status: { $in: ['active', 'in_progress'] } });
        const completedProjects = await Project.countDocuments({ status: 'completed' });

        res.json({
            users: { total: totalUsers, clients: totalClients, experts: totalExperts, pending: pendingExperts },
            projects: { total: totalProjects, active: activeProjects, completed: completedProjects }
        });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching stats', error: err.message });
    }
};

// Verify/Approve Expert
export const verifyExpert = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { expertStatus: 'approved' },
            { new: true }
        ).select('-password');

        if (!user) return res.status(404).json({ message: 'User not found' });

        // TODO: Send email notification

        res.json({ message: 'Expert approved successfully', user });
    } catch (err) {
        res.status(500).json({ message: 'Error verifying expert', error: err.message });
    }
};

// Reject Expert
export const rejectExpert = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { expertStatus: 'rejected' },
            { new: true }
        ).select('-password');

        if (!user) return res.status(404).json({ message: 'User not found' });

        // TODO: Send email notification

        res.json({ message: 'Expert rejected', user });
    } catch (err) {
        res.status(500).json({ message: 'Error rejecting expert', error: err.message });
    }
};
