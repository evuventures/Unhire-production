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
  deadline: { type: Date, required: true },

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

export const Project = mongoose.model("Project", projectSchema);
