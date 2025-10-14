// import express from 'express';
// import User from '../models/User.js';
// import generateToken from '../utils/generateToken.js';

// const router = express.Router();

// // SIGNUP
// router.post('/signup', async (req, res) => {
//     const { name, email, password, role } = req.body;

//     try {
//         const existingUser = await User.findOne({ email });
//         if (existingUser) return res.status(400).json({ message: 'User already exists' });

//         const user = await User.create({ name, email, password, role });

//         res.status(201).json({
//             _id: user._id,
//             name: user.name,
//             email: user.email,
//             role: user.role,
//             token: generateToken(user._id)
//         });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

// // LOGIN
// router.post('/login', async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         const user = await User.findOne({ email });
//         if (!user) return res.status(400).json({ message: 'Invalid email or password' });

//         const isMatch = await user.matchPassword(password);
//         if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

//         res.json({
//             _id: user._id,
//             name: user.name,
//             email: user.email,
//             role: user.role,
//             token: generateToken(user._id)
//         });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

// export default router;
