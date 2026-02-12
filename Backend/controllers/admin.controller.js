import { getAllUsers } from '../services/user.service.js';
import User from "../models/user.model.js";
import { ExpertApplication } from "../models/expertApplication.model.js";
import { Project } from "../models/project.model.js";
import { Dispute } from "../models/dispute.model.js";

export const getUsers = async (req, res) => {
    const users = await getAllUsers();
    res.json(users);
};
export const listExpertApplications = async (req, res) => {
  const { status } = req.query;
  const filter = status ? { status } : {};
  const apps = await ExpertApplication.find(filter).populate("userId", "name email role");
  res.json(apps);
};
 
export const reviewExpertApplication = async (req, res) => {
  const { id } = req.params;
  const { decision, adminNotes = "", rating } = req.body;
 
  const app = await ExpertApplication.findById(id);
  if (!app) return res.status(404).json({ message: "Application not found" });
 
  if (!["approve", "reject"].includes(decision)) {
    return res.status(400).json({ message: "decision must be approve or reject" });
  }
 
  app.status = decision === "approve" ? "approved" : "rejected";
  app.adminNotes = adminNotes;
  app.reviewedBy = req.user._id;
  app.reviewedAt = new Date();
  await app.save();
 
  if (decision === "approve") {
    await User.findByIdAndUpdate(app.userId, { role: "expert" });
    if (typeof rating === "number") {
      await User.findByIdAndUpdate(app.userId, { rating });
    }
  }
 
  res.json({ message: "Reviewed", application: app });
};
 
export const adminAnalytics = async (req, res) => {
  const [users, projects, pendingApps, openDisputes] = await Promise.all([
    User.countDocuments(),
    Project.countDocuments(),
    ExpertApplication.countDocuments({ status: "pending" }),
    Dispute.countDocuments({ status: "open" }),
  ]);
 
  const byRole = await User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]);
  const byStatus = await Project.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]);
 
  res.json({ users, projects, pendingApps, openDisputes, byRole, byStatus });
};
 
export const overrideProject = async (req, res) => {
  const { id } = req.params;
  const { deadline, status, reason = "" } = req.body;
 
  const project = await Project.findById(id);
  if (!project) return res.status(404).json({ message: "Project not found" });
 
  if (deadline) project.deadline = new Date(deadline);
  if (status) project.status = status;
 
  project.adminOverride = {
    overriddenBy: req.user._id,
    overriddenAt: new Date(),
    reason,
  };
 
  await project.save();
  res.json({ message: "Project updated", project });
};
 
export const listDisputes = async (req, res) => {
  const { status } = req.query;
  const filter = status ? { status } : {};
  const disputes = await Dispute.find(filter)
    .populate("projectId", "title status deadline")
    .populate("raisedBy", "name email role")
    .populate("against", "name email role");
  res.json(disputes);
};
 
export const resolveDispute = async (req, res) => {
  const { id } = req.params;
  const { status, resolutionNotes = "" } = req.body;
 
  const dispute = await Dispute.findById(id);
  if (!dispute) return res.status(404).json({ message: "Dispute not found" });
 
  if (!["resolved", "rejected", "in_review"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }
 
  dispute.status = status;
  dispute.resolutionNotes = resolutionNotes;
  dispute.resolvedBy = req.user._id;
  dispute.resolvedAt = new Date();
  await dispute.save();
 
  res.json({ message: "Dispute updated", dispute });
};
