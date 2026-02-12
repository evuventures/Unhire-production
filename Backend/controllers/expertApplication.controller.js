import User from "../models/user.model.js";
import { ExpertApplication } from "../models/expertApplication.model.js";

export const applyForExpert = async (req, res) => {
  try {
    const userId = req.user._id;

    // Only non-admin users can apply
    if (req.user.role === "admin") {
      return res.status(403).json({ message: "Admin cannot apply." });
    }

    const { skills = [], linkedIn = "", bio = "" } = req.body;

    const app = await ExpertApplication.findOneAndUpdate(
      { userId },
      { userId, status: "pending", skills, linkedIn, bio, adminNotes: "", reviewedBy: null, reviewedAt: null },
      { upsert: true, new: true }
    );

    // Force role to client while pending (Option 1)
    if (req.user.role !== "client") {
      await User.findByIdAndUpdate(userId, { role: "client" });
    }

    return res.status(200).json({ message: "Application submitted", application: app });
  } catch (err) {
    return res.status(500).json({ message: "Failed to submit application", error: err.message });
  }
};

export const getMyExpertApplication = async (req, res) => {
  try {
    const app = await ExpertApplication.findOne({ userId: req.user._id });
    res.json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};