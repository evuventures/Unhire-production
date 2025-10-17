import express from 'express';
import { getProfile } from '../controllers/profile.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();
router.get('/', protect, getProfile);

export default router;
