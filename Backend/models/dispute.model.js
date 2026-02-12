import mongoose from "mongoose";

const disputeSchema = new mongoose.Schema(
  {
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    raisedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    against: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

    category: { type: String, enum: ["quality", "delay", "payment", "behavior", "other"], default: "other" },
    message: { type: String, required: true, maxlength: 2000 },

    status: { type: String, enum: ["open", "in_review", "resolved", "rejected"], default: "open" },
    resolutionNotes: { type: String, default: "" },
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    resolvedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const Dispute = mongoose.model("Dispute", disputeSchema);