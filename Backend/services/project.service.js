import { Project } from "../models/project.model.js";
import User from "../models/user.model.js";
import { getExpertRecommendations } from "../utils/LLMengine.js";


export const createProjectService = async (projectData) => {
  // projectData now expects `deadline` and no longer includes `jobType`
  const project = new Project(projectData);
  return await project.save();
};

export const getAllProjectsService = async () => {
  return await Project.find().populate("clientId assignedExpert", "name email role");
};

export const getProjectsByClientIdService = async (clientId) => {
  return await Project.find({ clientId }).populate(
    "clientId assignedExpert",
    "name email role"
  );
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
    draftContent: project.draftContent,
    draftUrl: project.draftUrl,
    remainingTime: remaining,
  };
};



// 🔥 NEW SERVICE: Gemini recommendation
export const recommendExpertsForProjectService = async (project) => {
  try {
    // Fetch experts
    const experts = await User.find({ role: "expert" }).select(
      "_id name skills rating"
    );
    if (!experts.length) return [];

    // Ask Gemini to rank them
    const ranked = await getExpertRecommendations(project, experts);

    const topExpertIds = ranked
      .map((r) => r.expertId)
      .filter((id) => experts.find((e) => e._id.toString() === id));

    const topExperts = experts.filter((e) =>
      topExpertIds.includes(e._id.toString())
    );

    // Save to project
    project.notifiedExperts = topExperts.map((e) => e._id);
    await project.save();

    return topExperts;
  } catch (err) {
    console.error("AI recommend service error:", err.message);
    return [];
  }
};

export const reviewProjectService = async (projectId, clientId, decision, feedback) => {
  const project = await Project.findById(projectId);
  if (!project) throw new Error("Project not found");

  if (project.clientId.toString() !== clientId) {
    throw new Error("Unauthorized: Only the project owner can review this project");
  }

  if (project.status !== "submitted") {
    throw new Error("Project is not in a submitted state");
  }

  if (decision === "accept") {
    project.status = "completed";
    project.completedAt = new Date();
    // TODO: Trigger payment release here
  } else if (decision === "reject") {
    project.attemptsCount += 1;

    if (project.attemptsCount >= 3) {
      project.status = "expired";
    } else {
      // Re-open for other experts
      project.status = "unassigned";
      project.assignedExpert = null;
      project.assignedAt = null;
      project.draftSubmitted = false;
      project.draftContent = null;
      project.draftUrl = null;
      project.submittedAt = null;
    }
  } else {
    throw new Error("Invalid decision. Must be 'accept' or 'reject'");
  }

  return await project.save();
};