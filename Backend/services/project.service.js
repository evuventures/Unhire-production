import { Project } from "../models/project.model.js";
import User from "../models/user.model.js";
import { getExpertRecommendations } from "../utils/LLMengine.js";
import { createNotification } from "./notification.service.js";
import {
  sendProjectExpirationEmail,
  sendProjectAssignmentEmail,
  sendDraftRejectedEmail
} from "./email.service.js";

const MAX_ATTEMPTS = 3;
const SUBMISSION_TIMEOUT_MS = 3 * 60 * 60 * 1000; // 3 hours

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

/**
 * Check for timed-out projects and handle reassignment
 * Called by cron job every minute
 */
export const markExpiredProjectsService = async () => {
  const timeoutThreshold = new Date(Date.now() - SUBMISSION_TIMEOUT_MS);

  // Find projects that are in_progress and past the 3-hour submission deadline
  const timedOutProjects = await Project.find({
    status: "in_progress",
    assignedAt: { $lte: timeoutThreshold },
    draftSubmitted: false,
  });

  let reassignedCount = 0;
  let expiredCount = 0;

  for (const project of timedOutProjects) {
    const timedOutExpertId = project.assignedExpert;

    // Add timed-out expert to rejected list
    if (timedOutExpertId && !project.rejectedExperts.some(id => id.toString() === timedOutExpertId.toString())) {
      project.rejectedExperts.push(timedOutExpertId);
    }

    // Increment attempts count and rejection count
    project.attemptsCount += 1;
    project.rejectionCount += 1;

    // Notify the timed-out expert
    if (timedOutExpertId) {
      await createNotification(
        timedOutExpertId,
        "draft_rejected",
        `Your submission for "${project.title}" timed out. The project has been reassigned.`,
        project._id
      );

      // Send email
      const expert = await User.findById(timedOutExpertId);
      if (expert) {
        // Using draft rejected email template for consistency, or we could create a specific timeout one.
        // For now, let's use the generic rejection email but maybe we should format the reason.
        // Actually, let's just use the notification message in the email if possible, 
        // but sendDraftRejectedEmail takes a project and optional reason.
        sendDraftRejectedEmail(expert, project, "Draft submission timed out (3 hours limit).").catch(err =>
          console.error("[EMAIL] Failed to send rejection email:", err.message)
        );
      }
    }

    // Check if max attempts reached
    if (project.attemptsCount >= MAX_ATTEMPTS) {
      project.status = "expired";
      project.assignedExpert = null;
      project.draftSubmitted = false;
      project.draftStatus = null;
      await project.save();

      // Notify client about expiration
      await createNotification(
        project.clientId,
        "project_expired",
        `Project "${project.title}" has expired after ${MAX_ATTEMPTS} failed attempts.`,
        project._id
      );

      // Send email (non-blocking)
      const client = await User.findById(project.clientId);
      if (client) {
        sendProjectExpirationEmail(client, project).catch(err =>
          console.error("[EMAIL] Failed to send expiration email:", err.message)
        );
      }

      console.log(`[CRON] Project ${project._id} expired after ${MAX_ATTEMPTS} timeout attempts.`);
      expiredCount++;
      continue;
    }

    // Try to reassign to another expert
    const reassigned = await autoReassignTimedOutProject(project);
    if (reassigned) {
      reassignedCount++;
    }
  }

  return { reassignedCount, expiredCount };
};

/**
 * Auto-reassign a timed-out project to the next available expert
 */
const autoReassignTimedOutProject = async (project) => {
  // Find available experts excluding rejected ones
  const availableExperts = await User.find({
    role: "expert",
    _id: { $nin: project.rejectedExperts },
  })
    .select("_id name email rating")
    .sort({ rating: -1 });

  if (availableExperts.length === 0) {
    // No experts available - mark as active/unassigned
    project.status = "active";
    project.assignedExpert = null;
    project.assignedAt = null;
    project.draftStatus = null;
    await project.save();
    console.log(`[CRON] Project ${project._id} marked as active - no experts available.`);
    return false;
  }

  // Assign to highest-rated available expert
  const newExpert = availableExperts[0];
  project.status = "in_progress";
  project.assignedExpert = newExpert._id;
  project.assignedAt = new Date();
  project.draftSubmitted = false;
  project.draftStatus = null;
  await project.save();

  // Notify the new expert
  await createNotification(
    newExpert._id,
    "project_assigned",
    `You have been assigned to project "${project.title}". You have 3 hours to submit your draft.`,
    project._id
  );

  // Send email (non-blocking)
  sendProjectAssignmentEmail(newExpert, project).catch(err =>
    console.error("[EMAIL] Failed to send assignment email:", err.message)
  );

  console.log(`[CRON] Project ${project._id} reassigned to expert ${newExpert._id}`);
  return true;
};


export const getProjectStatusService = async (projectId) => {
  const project = await Project.findById(projectId)
    .populate("clientId assignedExpert", "name email role");

  if (!project) throw new Error("Project not found");

  // Calculate remaining time from assignedAt (not createdAt)
  let remaining = { hours: 0, minutes: 0, seconds: 0 };

  if (project.assignedAt && ["in_progress"].includes(project.status)) {
    const assignedTime = new Date(project.assignedAt).getTime();
    const expiryTime = assignedTime + 3 * 60 * 60 * 1000; // 3 hours from assignment
    const now = Date.now();
    let remainingMs = expiryTime - now;
    if (remainingMs < 0) remainingMs = 0;

    remaining = {
      hours: Math.floor(remainingMs / (1000 * 60 * 60)),
      minutes: Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((remainingMs % (1000 * 60)) / 1000),
    };
  }

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