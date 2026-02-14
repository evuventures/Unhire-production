import express from 'express';
import { getUsers, getDashboardStats, verifyExpert, rejectExpert } from '../controllers/admin.controller.js';
import { protect, authorizeRoles } from '../middleware/auth.middleware.js';

const router = express.Router();
router.get('/users', protect, authorizeRoles('admin'), getUsers);
router.get('/stats', protect, authorizeRoles('admin'), getDashboardStats); // New
router.put('/expert/:id/approve', protect, authorizeRoles('admin'), verifyExpert); // New
router.put('/expert/:id/reject', protect, authorizeRoles('admin'), rejectExpert); // New

export default router;
