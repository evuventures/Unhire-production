import mongoose from "mongoose";

const expertApplicationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    skills: { type: [String], default: [] },
    linkedIn: { type: String, default: "" },
    bio: { type: String, default: "" },

    adminNotes: { type: String, default: "" },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    reviewedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const ExpertApplication = mongoose.model("ExpertApplication", expertApplicationSchema);