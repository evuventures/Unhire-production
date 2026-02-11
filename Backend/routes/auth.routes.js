import express from 'express';
import {
    signup,
    login,
    verifyLogin,
    forgotPassword,
    resetPassword,
    changePassword,
    checkAuth,
    logout
} from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import validate from '../middleware/validate.middleware.js';
import {
    signupSchema,
    loginSchema,
    verifyLoginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    changePasswordSchema
} from '../validations/auth.validation.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Limit each IP to 20 requests per windowMs
    message: { message: "Too many login attempts, please try again later" }
});

router.post('/signup', validate(signupSchema), signup);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/verify-login', authLimiter, validate(verifyLoginSchema), verifyLogin);
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);
router.put('/change-password', protect, validate(changePasswordSchema), changePassword);

router.get('/me', protect, checkAuth);
router.post('/logout', logout);

export default router;
