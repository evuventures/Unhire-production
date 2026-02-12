import { Dispute } from "../models/dispute.model.js";
import { Project } from "../models/project.model.js";

export const createDispute = async (req, res) => {
  try {
    const { id: projectId } = req.params;
    const { category = "other", message, against = null } = req.body;

    if (!message) return res.status(400).json({ message: "message is required" });

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const dispute = await Dispute.create({
      projectId,
      raisedBy: req.user._id,
      against,
      category,
      message,
      status: "open",
    });

    res.status(201).json({ message: "Dispute created", dispute });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};