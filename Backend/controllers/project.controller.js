import {
  createProjectService,
  getAllProjectsService,
  getProjectsByClientIdService,
  getProjectStatusService,
  recommendExpertsForProjectService,
  reviewProjectService
} from "../services/project.service.js";

export const reviewProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { decision, feedback } = req.body;
    const project = await reviewProjectService(id, req.user.id, decision, feedback);
    res.status(200).json({ message: "Project reviewed successfully", project });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const createProject = async (req, res) => {
  try {
    if (req.user.role !== "client") {
      return res.status(403).json({ message: "Only clients can post projects." });
    }

    const {
      title,
      category,
      description,
      requirements,
      deliverables,
      budgetType,
      budgetAmount,
      paymentTerms,
      startDate,
      endDate,
      deadline,
      experienceLevel,
      locationPreference,
      language,
      attachments,
      links,
    } = req.body;

    // validation for required fields
    if (!title || !description || !budgetType || !deadline) {
      return res.status(400).json({ message: "Missing required fields: title, description, budgetType, deadline" });
    }

    const parsedDeadline = new Date(deadline);
    if (Number.isNaN(parsedDeadline.getTime())) {
      return res.status(400).json({ message: "Invalid deadline date format" });
    }

    // Enforce: deadline cannot be in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (parsedDeadline < today) {
      return res.status(400).json({
        message: "Deadline cannot be in the past. Please select today or a future date.",
      });
    }

    const projectData = {
      clientId: req.user.id,
      title: typeof title === "string" ? title.trim() : title,
      category: typeof category === "string" ? category.trim() : category,
      description: typeof description === "string" ? description.trim() : description,
      requirements: typeof requirements === "string" ? requirements.trim() : requirements,
      deliverables: typeof deliverables === "string" ? deliverables.trim() : deliverables,
      budgetType,
      budgetAmount,
      paymentTerms,
      startDate,
      endDate,
      deadline: parsedDeadline,
      experienceLevel,
      locationPreference,
      language,
      attachments,
      links,
    };


    // 1️⃣ Create the project
    const project = await createProjectService(projectData);

    // 2️⃣ Immediately trigger Gemini expert recommendation
    const recommendedExperts = await recommendExpertsForProjectService(project);

    // Gemini recommendation completed (logging removed for production cleanliness)

    res.status(201).json({
      message: "Project created successfully",
      project,
      recommendedExperts,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error creating project", error: err.message });
  }
};


export const getAllProjects = async (req, res) => {
  try {
    const projects = await getAllProjectsService();
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ message: "Error fetching projects", error: err.message });
  }
};

export const getProjectsByClientId = async (req, res) => {
  try {
    const { clientId } = req.params;
    const projects = await getProjectsByClientIdService(clientId);
    res.status(200).json(projects);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching projects", error: err.message });
  }
};


export const getProjectStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const projectStatus = await getProjectStatusService(id);
    res.status(200).json(projectStatus);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};