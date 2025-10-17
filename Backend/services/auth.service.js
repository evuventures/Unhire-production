import User from '../models/user.model.js';
import generateToken from '../utils/generateToken.js';

export const signupUser = async ({ name, email, password, role }) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error('User already exists');

    const user = await User.create({ name, email, password, role });

    return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
    };
};

export const loginUser = async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error('Invalid email or password');

    const isMatch = await user.matchPassword(password);
    if (!isMatch) throw new Error('Invalid email or password');

    return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
    };
};
