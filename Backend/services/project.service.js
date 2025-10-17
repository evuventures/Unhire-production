import { Project } from "../models/project.model.js";

export const createProjectService = async (projectData) => {
  // projectData now expects `deadline` and no longer includes `jobType`
  const project = new Project(projectData);
  return await project.save();
};

export const getAllProjectsService = async () => {
  return await Project.find().populate("clientId assignedExpert", "name email role");
};

export const markExpiredProjectsService = async () => {
  // timer logic for testing: 1 minute
  const threeHoursAgo = new Date(Date.now() - 1 * 60 * 1000);
  const projects = await Project.find({
    status: "active",
    draftSubmitted: false,
    createdAt: { $lte: threeHoursAgo },
  });

  for (const p of projects) {
    p.status = "unassigned";
    p.assignedExpert = null;
    await p.save();
    console.log(`Project ${p._id} marked as unassigned due to no draft.`);
  }

  return projects.length;
};



export const getProjectStatusService = async (projectId) => {
  const project = await Project.findById(projectId)
    .populate("clientId assignedExpert", "name email role");

  if (!project) throw new Error("Project not found");

  // Calculate remaining time
  const projectCreated = project.createdAt.getTime();
  const expiryTime = projectCreated + 3 * 60 * 60 * 1000; // 3 hours
  const now = Date.now();
  let remainingMs = expiryTime - now;
  if (remainingMs < 0) remainingMs = 0;

  const remaining = {
    hours: Math.floor(remainingMs / (1000 * 60 * 60)),
    minutes: Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((remainingMs % (1000 * 60)) / 1000),
  };

  return {
    id: project._id,
    title: project.title,
    status: project.status,
    client: project.clientId,
    assignedExpert: project.assignedExpert,
    draftSubmitted: project.draftSubmitted,
    remainingTime: remaining,
  };
};
