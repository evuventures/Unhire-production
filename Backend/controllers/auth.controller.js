import { signupUser } from '../services/auth.service.js';
import User from '../models/user.model.js';
import { sendVerificationEmail, sendPasswordChangeSuccessEmail } from '../services/email.service.js';
import generateToken from '../utils/generateToken.js';

// Helper to set cookie
const setTokenCookie = (res, token) => {
    const cookieOptions = {
        httpOnly: true,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Must be 'none' for cross-site cookie if frontend/backend are on different domains in prod
    };
    res.cookie('token', token, cookieOptions);
};

export const signup = async (req, res, next) => {
    try {
        // Validation handled by middleware
        const data = await signupUser(req.body);

        // Optionally auto-login or just return success
        res.status(201).json({
            message: 'User registered successfully. Please log in.',
            user: data.user
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Step 1: Login - Validate credentials & Send 2FA Code
 */
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await user.matchPassword(password))) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate and send verification code
        const code = user.getVerificationCode();
        await user.save();

        try {
            await sendVerificationEmail(user, code);
        } catch (emailError) {
            user.verificationCode = undefined;
            user.verificationCodeExpire = undefined;
            await user.save();
            return res.status(500).json({ message: 'Email could not be sent' });
        }

        res.status(200).json({
            message: 'Verification code sent to email',
            email: user.email,
            requiresVerification: true
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Step 2: Verify Login Code & Issue Token
 */
export const verifyLogin = async (req, res, next) => {
    try {
        const { email, code } = req.body;
        const user = await User.findOne({ email });

        if (!user || !user.verifyCode(code)) {
            return res.status(400).json({ message: 'Invalid or expired verification code' });
        }

        // Clear code after successful verification
        user.verificationCode = undefined;
        user.verificationCodeExpire = undefined;
        await user.save();

        const token = generateToken(user._id, user.role);
        setTokenCookie(res, token);

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token, // Keep sending token in body for now to support both
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Check Auth Status (Accessing via Cookie)
 */
export const checkAuth = async (req, res) => {
    // Protected route, so req.user is already set
    res.json({
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role
    });
};

/**
 * Logout - Clear Cookie
 */
export const logout = (req, res) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

/**
 * Forgot Password - Send Reset Code
 */
export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const code = user.getVerificationCode();
        await user.save();

        try {
            await sendVerificationEmail(user, code);
            res.status(200).json({ message: 'Verification code sent to email' });
        } catch (err) {
            user.verificationCode = undefined;
            user.verificationCodeExpire = undefined;
            await user.save();
            return res.status(500).json({ message: 'Email could not be sent' });
        }
    } catch (err) {
        next(err);
    }
};

/**
 * Reset Password - Verify Code & Set New Password
 */
export const resetPassword = async (req, res, next) => {
    try {
        const { email, code, newPassword } = req.body;
        const user = await User.findOne({ email });

        if (!user || !user.verifyCode(code)) {
            return res.status(400).json({ message: 'Invalid or expired verification code' });
        }

        user.password = newPassword;
        user.verificationCode = undefined;
        user.verificationCodeExpire = undefined;
        await user.save();

        await sendPasswordChangeSuccessEmail(user);

        res.status(200).json({ message: 'Password reset successful. You can now login.' });
    } catch (err) {
        next(err);
    }
};

/**
 * Change Password (Authenticated)
 */
export const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);

        if (!(await user.matchPassword(currentPassword))) {
            return res.status(400).json({ message: 'Incorrect current password' });
        }

        user.password = newPassword;
        await user.save();

        await sendPasswordChangeSuccessEmail(user);

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
        next(err);
    }
};
