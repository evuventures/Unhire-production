import { getUserById } from '../services/user.service.js';

export const getProfile = async (req, res) => {
    const user = await getUserById(req.user._id);
    res.json(user);
};
