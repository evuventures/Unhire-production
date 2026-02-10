import { signupUser, loginUser } from '../services/auth.service.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required' });
        }

        if (typeof email !== 'string' || !EMAIL_REGEX.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        if (typeof password !== 'string' || password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        const data = await signupUser(req.body);
        res.status(201).json(data);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        if (typeof email !== 'string' || !EMAIL_REGEX.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        const data = await loginUser(req.body);
        res.json(data);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
