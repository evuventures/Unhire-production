import { createProjectService, getAllProjectsService, getProjectStatusService } from "../services/project.service.js";

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
      deadline, // new required field
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

    const projectData = {
      clientId: req.user.id,
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
      deadline: parsedDeadline,
      experienceLevel,
      locationPreference,
      language,
      attachments,
      links,
    };

    const project = await createProjectService(projectData);
    res.status(201).json({ message: "Project created successfully", project });
  } catch (err) {
    res.status(500).json({ message: "Error creating project", error: err.message });
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



export const getProjectStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const projectStatus = await getProjectStatusService(id);
    res.status(200).json(projectStatus);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};