import express from 'express';
import { getUsers } from '../controllers/admin.controller.js';
import { protect, authorizeRoles } from '../middleware/auth.middleware.js';

const router = express.Router();
router.get('/users', protect, authorizeRoles('admin'), getUsers);

export default router;
