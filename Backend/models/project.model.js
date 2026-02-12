// models/project.model.js
import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  adminOverride: {
  overriddenBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  overriddenAt: { type: Date, default: null },
  reason: { type: String, default: "" },
},
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, 'Client ID is required'],
  },
  title: { 
    type: String, 
    required: [true, 'Project title is required'],
    minlength: [5, 'Title must be at least 5 characters long'],
    maxlength: [100, 'Title must be less than 100 characters'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: [
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
      ],
      message: 'Invalid category selected'
    },
    trim: true
  },
  description: { 
    type: String, 
    required: [true, 'Project description is required'],
    minlength: [20, 'Description must be at least 20 characters long'],
    maxlength: [2000, 'Description must be less than 2000 characters'],
    trim: true
  },
  requirements: {
    type: String,
    maxlength: [1000, 'Requirements must be less than 1000 characters'],
    trim: true
  },
  deliverables: {
    type: String,
    maxlength: [1000, 'Deliverables must be less than 1000 characters'],
    trim: true
  },

  budgetType: { 
    type: String, 
    enum: {
      values: ["fixed", "hourly"], 
      message: 'Budget type must be either fixed or hourly'
    }, 
    required: [true, 'Budget type is required'] 
  },
  budgetAmount: { 
    type: Number, 
    min: [1, 'Budget must be greater than 0'],
    max: [1000000, 'Budget cannot exceed $1,000,000'],
    validate: {
      validator: function(v) {
        return v > 0;
      },
      message: 'Budget must be greater than 0'
    }
  },
  paymentTerms: {
    type: String,
    enum: {
      values: ["upon-completion", "milestones", "50-50"],
      message: 'Invalid payment terms'
    },
    default: "upon-completion"
  },

  startDate: Date,
  endDate: Date,

  // NEW: deadline (required)
  deadline: { 
    type: Date, 
    required: [true, 'Deadline is required'],
    validate: {
      validator: function(v) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return v > today;
      },
      message: 'Deadline must be in the future'
    }
  },

  experienceLevel: {
    type: String,
    enum: {
      values: ["junior", "mid-level", "expert"],
      message: 'Invalid experience level'
    },
    default: "mid-level",
  },
  locationPreference: {
    type: String,
    trim: true,
    maxlength: [100, 'Location preference must be less than 100 characters']
  },
  language: {
    type: String,
    trim: true,
    maxlength: [50, 'Language must be less than 50 characters'],
    default: 'english'
  },

  attachments: [String],
  links: [{
    type: String,
    validate: {
      validator: function(v) {
        // Basic URL validation
        try {
          new URL(v);
          return true;
        } catch {
          return false;
        }
      },
      message: 'Invalid URL format'
    }
  }],

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

  status: {
    type: String,
    enum: ["active", "unassigned", "in_progress", "submitted", "completed", "expired", "timeout"],
    default: "active",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better query performance
projectSchema.index({ clientId: 1, status: 1 });
projectSchema.index({ category: 1 });
projectSchema.index({ deadline: 1 });
projectSchema.index({ createdAt: 1 });

// Virtual for checking if project is expired
projectSchema.virtual('isExpired').get(function() {
  return this.deadline < new Date();
});

// Pre-save middleware to ensure data consistency
projectSchema.pre('save', function(next) {
  // Ensure deadline is in the future
  if (this.deadline && this.deadline <= new Date()) {
    return next(new Error('Deadline must be in the future'));
  }
  
  // Ensure budget amount is positive if provided
  if (this.budgetAmount !== undefined && this.budgetAmount <= 0) {
    return next(new Error('Budget must be greater than 0'));
  }
  
  next();
});

export const Project = mongoose.model("Project", projectSchema);
