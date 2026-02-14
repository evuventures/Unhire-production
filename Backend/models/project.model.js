// models/project.model.js
import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: { type: String, required: true },
  category: String,
  // removed jobType (no longer present)
  description: { type: String, required: true },
  requirements: String,
  deliverables: String,

  budgetType: { type: String, enum: ["fixed", "hourly"], required: true },
  budgetAmount: Number,
  paymentTerms: String,

  startDate: Date,
  endDate: Date,

  // NEW: deadline (required)
  deadline: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        // Only validate on new documents, not updates
        if (this.isNew) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return value >= today;
        }
        return true;
      },
      message: "Deadline cannot be set before today's date.",
    },
  },

  experienceLevel: {
    type: String,
    enum: ["junior", "mid-level", "expert"],
    default: "mid-level",
  },
  locationPreference: String,
  language: String,

  attachments: [String],
  links: [String],

  assignedExpert: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  assignedAt: {
    type: Date,
    default: null,
  },
  draftSubmitted: { type: Boolean, default: false },
  draftContent: {
    type: String,
    default: null,
  },
  draftUrl: {
    type: String,
    default: null,
  },
  submittedAt: {
    type: Date,
    default: null,
  },
  draftStatus: {
    type: String,
    enum: ["pending_review", "accepted", "rejected", null],
    default: null,
  },
  attemptsCount: {
    type: Number,
    default: 0,
  },
  rejectedExperts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  rejectionCount: {
    type: Number,
    default: 0,
  },

  attemptsCount: {
    type: Number,
    default: 0,
  },

  status: {
    type: String,
    enum: ["active", "unassigned", "in_progress", "submitted", "completed", "expired", "timeout"],
    default: "active",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes for performance optimization
projectSchema.index({ assignedExpert: 1, status: 1 }); // For fetching expert's projects
projectSchema.index({ status: 1, assignedAt: 1, draftSubmitted: 1 }); // For timeout monitor
projectSchema.index({ clientId: 1, status: 1 }); // For fetching client's projects

export const Project = mongoose.model("Project", projectSchema);
