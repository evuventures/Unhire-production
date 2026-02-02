import User from '../models/user.model.js';
import generateToken from '../utils/generateToken.js';

export const signupUser = async ({ name, email, password, role, skills, rating }) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error('User already exists');

    const userData = { name, email, password, role };

    // Only add skills and rating for experts
    if (role === "expert") {
        userData.skills = skills || [];
        userData.rating = rating || 0;
    }

    const user = await User.create(userData);

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

export const googleLoginUser = async ({ name, email, googleId, avatar, role = 'client' }) => {
    let user = await User.findOne({ email });

    if (!user) {
        // Create new user if they don't exist
        user = await User.create({
            name,
            email,
            googleId,
            avatar,
            role, // Expert or Client depending on choice
            skills: [],
            rating: 0
        });
    } else {
        // Update googleId and avatar if user already exists
        user.googleId = googleId;
        user.avatar = avatar;
        await user.save();
    }

    return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
    };
};
