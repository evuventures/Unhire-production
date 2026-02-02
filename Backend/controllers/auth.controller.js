import { signupUser, loginUser, googleLoginUser } from '../services/auth.service.js';

export const signup = async (req, res) => {
    try {
        const data = await signupUser(req.body);
        res.status(201).json(data);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const login = async (req, res) => {
    try {
        const data = await loginUser(req.body);
        res.json(data);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const googleLogin = async (req, res) => {
    try {
        const data = await googleLoginUser(req.body);
        res.json(data);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
