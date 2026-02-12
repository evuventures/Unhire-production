import {
  createProjectService,
  getAllProjectsService,
  getProjectsByClientIdService,
  getProjectStatusService,
  recommendExpertsForProjectService
} from "../services/project.service.js";
import User from "../models/user.model.js";
import { createNotification } from "./notification.controller.js";

// Validation utilities
const validateTitle = (title) => {
  if (!title || title.trim().length === 0) return 'Project title is required';
  if (title.trim().length < 5) return 'Title must be at least 5 characters long';
  if (title.trim().length > 100) return 'Title must be less than 100 characters';
  return null;
};

const validateDescription = (description) => {
  if (!description || description.trim().length === 0) return 'Project description is required';
  if (description.trim().length < 20) return 'Description must be at least 20 characters long';
  if (description.trim().length > 2000) return 'Description must be less than 2000 characters';
  return null;
};

const validateBudget = (amount) => {
  if (isNaN(amount)) return 'Please enter a valid number';
  if (amount <= 0) return 'Budget must be greater than 0';
  if (amount > 1000000) return 'Budget amount seems too high (max: $1,000,000)';
  return null;
};

const validateDeadline = (deadline) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (deadline <= today) return 'Deadline must be in the future';
  
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 2);
  if (deadline > maxDate) return 'Deadline cannot be more than 2 years in the future';
  
  return null;
};

const validateRequirements = (requirements) => {
  if (requirements && requirements.trim().length > 1000) {
    return 'Requirements must be less than 1000 characters';
  }
  return null;
};

const validateDeliverables = (deliverables) => {
  if (deliverables && deliverables.trim().length > 1000) {
    return 'Deliverables must be less than 1000 characters';
  }
  return null;
};

const validateCategory = (category) => {
  const validCategories = [
    'Web Development',
    'Mobile Development', 
    'UI/UX Design',
    'Data Science',
    'Content Writing',
    'Digital Marketing',
    'Blockchain Development',
    'DevOps & Cloud',
    'AI & Machine Learning',
    'Cybersecurity',
    'Game Development'
  ];
  
  if (!category) return 'Category is required';
  if (!validCategories.includes(category)) return 'Invalid category selected';
  return null;
};

const validateBudgetType = (budgetType) => {
  const validTypes = ['fixed', 'hourly'];
  if (!budgetType) return 'Budget type is required';
  if (!validTypes.includes(budgetType)) return 'Invalid budget type';
  return null;
};

const validateExperienceLevel = (level) => {
  const validLevels = ['junior', 'mid-level', 'expert'];
  if (level && !validLevels.includes(level)) return 'Invalid experience level';
  return null;
};

const validatePaymentTerms = (terms) => {
  const validTerms = ['upon-completion', 'milestones', '50-50'];
  if (terms && !validTerms.includes(terms)) return 'Invalid payment terms';
  return null;
};

// Sanitize input to prevent XSS
const sanitizeInput = (input) => {
  return input
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<[^>]*>?/gm, '')
    .trim();
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

    // Sanitize all text inputs
    const sanitizedTitle = sanitizeInput(title || '');
    const sanitizedCategory = sanitizeInput(category || '');
    const sanitizedDescription = sanitizeInput(description || '');
    const sanitizedRequirements = sanitizeInput(requirements || '');
    const sanitizedDeliverables = sanitizeInput(deliverables || '');
    const sanitizedLocationPreference = sanitizeInput(locationPreference || '');
    const sanitizedLanguage = sanitizeInput(language || '');

    // Validate all fields
    const titleError = validateTitle(sanitizedTitle);
    const categoryError = validateCategory(sanitizedCategory);
    const descriptionError = validateDescription(sanitizedDescription);
    const budgetTypeError = validateBudgetType(budgetType);
    const budgetAmountError = budgetAmount ? validateBudget(parseFloat(budgetAmount)) : null;
    const requirementsError = validateRequirements(sanitizedRequirements);
    const deliverablesError = validateDeliverables(sanitizedDeliverables);
    const experienceLevelError = validateExperienceLevel(experienceLevel);
    const paymentTermsError = validatePaymentTerms(paymentTerms);

    // Check for validation errors
    const errors = [
      titleError, categoryError, descriptionError, budgetTypeError, 
      budgetAmountError, requirementsError, deliverablesError,
      experienceLevelError, paymentTermsError
    ].filter(error => error !== null);

    if (errors.length > 0) {
      return res.status(400).json({ 
        message: "Validation failed", 
        errors: errors 
      });
    }

    // Validate deadline
    if (!deadline) {
      return res.status(400).json({ message: "Deadline is required" });
    }

    const parsedDeadline = new Date(deadline);
    if (Number.isNaN(parsedDeadline.getTime())) {
      return res.status(400).json({ message: "Invalid deadline date format" });
    }

    const deadlineError = validateDeadline(parsedDeadline);
    if (deadlineError) {
      return res.status(400).json({ message: deadlineError });
    }

    const projectData = {
      clientId: req.user.id,
      title: sanitizedTitle,
      category: sanitizedCategory,
      description: sanitizedDescription,
      requirements: sanitizedRequirements,
      deliverables: sanitizedDeliverables,
      budgetType,
      budgetAmount: budgetAmount ? parseFloat(budgetAmount) : undefined,
      paymentTerms,
      startDate,
      endDate,
      deadline: parsedDeadline,
      experienceLevel,
      locationPreference: sanitizedLocationPreference,
      language: sanitizedLanguage,
      attachments,
      links,
    };

    // 1️⃣ Create the project
    const project = await createProjectService(projectData);

    // 2️⃣ Immediately trigger Gemini expert recommendation
    const recommendedExperts = await recommendExpertsForProjectService(project);

    console.log("Recommended experts by Gemini:", recommendedExperts);

    res.status(201).json({
      message: "Project created successfully",
      project,
      recommendedExperts,
    });

    // Notify all experts asynchronously
    const experts = await User.find({ role: 'expert' });
    experts.forEach(expert => {
      createNotification(
        expert._id,
        `New project posted: ${project.title}`,
        'job_post',
        project._id,
        'Project'
      );
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