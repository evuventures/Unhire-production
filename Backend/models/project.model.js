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
  draftSubmitted: { type: Boolean, default: false },

  status: {
    type: String,
    enum: ["active", "unassigned", "completed", "expired"],
    default: "active",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Project = mongoose.model("Project", projectSchema);
