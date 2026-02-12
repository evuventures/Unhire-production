import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlusCircle,
  ArrowLeft,
  Sparkles,
  Target,
  DollarSign,
  Calendar,
  Briefcase,
  Layers,
  CheckCircle2,
  Info,
  Loader2,
  ChevronRight,
  AlertCircle,
  X
} from 'lucide-react';
import Sidebar from '../components/Sidebar';

// Validation utilities
const validateTitle = (title: string): string | null => {
  if (!title || title.trim().length === 0) return 'Project title is required';
  if (title.trim().length < 5) return 'Title must be at least 5 characters long';
  if (title.trim().length > 100) return 'Title must be less than 100 characters';
  return null;
};

const validateDescription = (description: string): string | null => {
  if (!description || description.trim().length === 0) return 'Project description is required';
  if (description.trim().length < 20) return 'Description must be at least 20 characters long';
  if (description.trim().length > 2000) return 'Description must be less than 2000 characters';
  return null;
};

const validateBudget = (amount: string): string | null => {
  if (!amount || amount.trim().length === 0) return 'Budget amount is required';
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount)) return 'Please enter a valid number';
  if (numAmount <= 0) return 'Budget must be greater than 0';
  if (numAmount > 1000000) return 'Budget amount seems too high (max: $1,000,000)';
  return null;
};

const validateDeadline = (deadline: string): string | null => {
  if (!deadline) return 'Deadline is required';
  const deadlineDate = new Date(deadline);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (deadlineDate <= today) return 'Deadline must be in the future';
  
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 2);
  if (deadlineDate > maxDate) return 'Deadline cannot be more than 2 years in the future';
  
  return null;
};

const validateRequirements = (requirements: string): string | null => {
  if (requirements && requirements.trim().length > 1000) {
    return 'Requirements must be less than 1000 characters';
  }
  return null;
};

const validateDeliverables = (deliverables: string): string | null => {
  if (deliverables && deliverables.trim().length > 1000) {
    return 'Deliverables must be less than 1000 characters';
  }
  return null;
};

// Sanitize HTML to prevent XSS
const sanitizeInput = (input: string): string => {
  return input
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<[^>]*>?/gm, '');
};

const PostProjectPage: React.FC = () => {
  const navigate = useNavigate();
  const userRole = JSON.parse(localStorage.getItem('user') || '{}').role || 'client';

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    requirements: '',
    deliverables: '',
    budgetType: 'fixed',
    budgetAmount: '',
    paymentTerms: 'upon-completion',
    deadline: '',
    experienceLevel: 'mid-level',
    locationPreference: 'remote',
    language: 'english',
    attachments: [] as File[],
    links: [] as string[],
  });

  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string | null}>({});
  const [touchedFields, setTouchedFields] = useState<{[key: string]: boolean}>({});
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Sanitize input for text fields
    const sanitizedValue = ['title', 'description', 'requirements', 'deliverables'].includes(name) 
      ? sanitizeInput(value) 
      : value;
    
    setFormData({ ...formData, [name]: sanitizedValue });
    
    // Mark field as touched
    setTouchedFields({ ...touchedFields, [name]: true });
    
    // Validate field in real-time
    validateField(name, sanitizedValue);
  };

  const validateAttachments = (files: File[]): string | null => {
    if (files.length > 5) return 'Maximum 5 files allowed';
    
    const maxSize = 10 * 1024 * 1024; // 10MB per file
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    for (const file of files) {
      if (file.size > maxSize) return `File ${file.name} exceeds 10MB limit`;
      if (!allowedTypes.includes(file.type)) return `File ${file.name} is not supported. Allowed types: Images, PDF, Word documents, and text files`;
    }
    
    return null;
  };

  const validateLinks = (links: string[]): string | null => {
    for (const link of links) {
      if (link && !isValidUrl(link)) return `Invalid URL: ${link}`;
    }
    return null;
  };

  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;
    
    const error = validateAttachments(files);
    if (error) {
      setFieldErrors(prev => ({ ...prev, attachments: error }));
      return;
    }
    
    setFormData(prev => ({ ...prev, attachments: [...prev.attachments, ...files] }));
    setFieldErrors(prev => ({ ...prev, attachments: null }));
  };

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const addLink = () => {
    setFormData(prev => ({ ...prev, links: [...prev.links, ''] }));
  };

  const updateLink = (index: number, value: string) => {
    const newLinks = [...formData.links];
    newLinks[index] = value;
    setFormData(prev => ({ ...prev, links: newLinks }));
    
    const error = validateLinks(newLinks);
    setFieldErrors(prev => ({ ...prev, links: error }));
  };

  const removeLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index)
    }));
  };

  const validateField = (fieldName: string, value: string) => {
    let error = null;
    
    switch (fieldName) {
      case 'title':
        error = validateTitle(value);
        break;
      case 'description':
        error = validateDescription(value);
        break;
      case 'budgetAmount':
        error = validateBudget(value);
        break;
      case 'deadline':
        error = validateDeadline(value);
        break;
      case 'requirements':
        error = validateRequirements(value);
        break;
      case 'deliverables':
        error = validateDeliverables(value);
        break;
      case 'category':
        if (!value) error = 'Please select a category';
        break;
      default:
        break;
    }
    
    setFieldErrors(prev => ({ ...prev, [fieldName]: error }));
    return error;
  };

  const validateForm = (): boolean => {
    const errors: {[key: string]: string | null} = {};
    
    errors.title = validateField('title', formData.title);
    errors.category = validateField('category', formData.category);
    errors.description = validateField('description', formData.description);
    errors.budgetAmount = validateField('budgetAmount', formData.budgetAmount);
    errors.deadline = validateField('deadline', formData.deadline);
    errors.requirements = validateField('requirements', formData.requirements);
    errors.deliverables = validateField('deliverables', formData.deliverables);
    errors.attachments = validateAttachments(formData.attachments);
    errors.links = validateLinks(formData.links);
    
    // Mark all fields as touched
    setTouchedFields({
      title: true,
      category: true,
      description: true,
      budgetAmount: true,
      deadline: true,
      requirements: true,
      deliverables: true,
      attachments: true,
      links: true,
    });
    
    return !Object.values(errors).some(error => error !== null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      setError('Please fix the validation errors before submitting');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to post project');
      }

      navigate('/client-dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-background min-h-screen text-text-primary">
      <Sidebar role={userRole as any} />

      <main
        className="flex-1 p-10 pb-20 transition-all duration-300"
        style={{ marginLeft: 'var(--sidebar-width, 256px)' }}
      >
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-12">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-text-secondary mb-4 hover:text-white transition-colors cursor-pointer w-fit"
              onClick={() => navigate('/client-dashboard')}
            >
              <ArrowLeft size={16} />
              <span className="text-sm font-medium">Back to Workspace</span>
            </motion.div>
            <h1 className="text-4xl font-bold flex items-center gap-4">
              Launch a New Project
              <Sparkles className="text-primary" size={32} />
            </h1>
            <p className="text-text-secondary mt-1">Define your vision and connect with the world's best experts.</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Form Column */}
            <div className="lg:col-span-2">
              <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Section 1: Identity */}
                <div className="glass-card p-8 space-y-6">
                  <div className="flex items-center gap-3 mb-2 font-bold text-lg">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Target size={20} />
                    </div>
                    Project Identity
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-widest px-1">Project Title</label>
                    <input
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g. Build a Modern E-commerce Dashboard"
                      className={`w-full bg-surface border rounded-xl py-4 px-4 outline-none transition-all text-white ${
                        touchedFields.title && fieldErrors.title 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'border-border focus:border-primary/50'
                      }`}
                      required
                    />
                    {touchedFields.title && fieldErrors.title && (
                      <div className="flex items-center gap-2 text-red-500 text-xs mt-1">
                        <AlertCircle size={12} />
                        {fieldErrors.title}
                      </div>
                    )}
                    <div className="text-right text-xs text-text-secondary">
                      {formData.title.length}/100 characters
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-widest px-1">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className={`w-full bg-surface border rounded-xl py-4 px-4 outline-none text-sm transition-all cursor-pointer ${
                        touchedFields.category && fieldErrors.category 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'border-border focus:border-primary/50'
                      }`}
                      required
                    >
                      <option value="">Select a domain...</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Mobile Development">Mobile Development</option>
                      <option value="UI/UX Design">UI/UX Design</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Content Writing">Content Writing</option>
                      <option value="Digital Marketing">Digital Marketing</option>
                      <option value="Blockchain Development">Blockchain Development</option>
                      <option value="DevOps & Cloud">DevOps & Cloud</option>
                      <option value="AI & Machine Learning">AI & Machine Learning</option>
                      <option value="Cybersecurity">Cybersecurity</option>
                      <option value="Game Development">Game Development</option>
                    </select>
                    {touchedFields.category && fieldErrors.category && (
                      <div className="flex items-center gap-2 text-red-500 text-xs mt-1">
                        <AlertCircle size={12} />
                        {fieldErrors.category}
                      </div>
                    )}
                  </div>
                </div>

                {/* Section 2: Details */}
                <div className="glass-card p-8 space-y-6">
                  <div className="flex items-center gap-3 mb-2 font-bold text-lg">
                    <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                      <Briefcase size={20} />
                    </div>
                    Project Details
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-widest px-1">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe the overall mission and goals..."
                      rows={5}
                      className={`w-full bg-surface border rounded-2xl p-4 outline-none transition-all text-white placeholder:text-white/20 resize-none ${
                        touchedFields.description && fieldErrors.description 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'border-border focus:border-primary/50'
                      }`}
                      required
                    />
                    {touchedFields.description && fieldErrors.description && (
                      <div className="flex items-center gap-2 text-red-500 text-xs mt-1">
                        <AlertCircle size={12} />
                        {fieldErrors.description}
                      </div>
                    )}
                    <div className="text-right text-xs text-text-secondary">
                      {formData.description.length}/2000 characters
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-text-secondary uppercase tracking-widest px-1">Requirements</label>
                      <textarea
                        name="requirements"
                        value={formData.requirements}
                        onChange={handleInputChange}
                        placeholder="Skills, technology stack..."
                        rows={4}
                        className={`w-full bg-surface border rounded-2xl p-4 outline-none transition-all text-sm text-white placeholder:text-white/20 resize-none ${
                          touchedFields.requirements && fieldErrors.requirements 
                            ? 'border-red-500 focus:border-red-500' 
                            : 'border-border focus:border-primary/50'
                        }`}
                      />
                      {touchedFields.requirements && fieldErrors.requirements && (
                        <div className="flex items-center gap-2 text-red-500 text-xs mt-1">
                          <AlertCircle size={12} />
                          {fieldErrors.requirements}
                        </div>
                      )}
                      <div className="text-right text-xs text-text-secondary">
                        {formData.requirements.length}/1000 characters
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-text-secondary uppercase tracking-widest px-1">Deliverables</label>
                      <textarea
                        name="deliverables"
                        value={formData.deliverables}
                        onChange={handleInputChange}
                        placeholder="What exactly will be delivered?"
                        rows={4}
                        className={`w-full bg-surface border rounded-2xl p-4 outline-none transition-all text-sm text-white placeholder:text-white/20 resize-none ${
                          touchedFields.deliverables && fieldErrors.deliverables 
                            ? 'border-red-500 focus:border-red-500' 
                            : 'border-border focus:border-primary/50'
                        }`}
                      />
                      {touchedFields.deliverables && fieldErrors.deliverables && (
                        <div className="flex items-center gap-2 text-red-500 text-xs mt-1">
                          <AlertCircle size={12} />
                          {fieldErrors.deliverables}
                        </div>
                      )}
                      <div className="text-right text-xs text-text-secondary">
                        {formData.deliverables.length}/1000 characters
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 3: Value & Timeline */}
                <div className="glass-card p-8 space-y-6">
                  <div className="flex items-center gap-3 mb-2 font-bold text-lg">
                    <div className="p-2 rounded-lg bg-green-500/10 text-green-400">
                      <DollarSign size={20} />
                    </div>
                    Investment & Timeline
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-text-secondary uppercase tracking-widest px-1">Budget Amount (USD)</label>
                      <div className="relative group">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" size={18} />
                        <input
                          type="number"
                          name="budgetAmount"
                          value={formData.budgetAmount}
                          onChange={handleInputChange}
                          className={`w-full bg-surface border rounded-xl py-4 pl-12 pr-4 outline-none transition-all text-white ${
                            touchedFields.budgetAmount && fieldErrors.budgetAmount 
                              ? 'border-red-500 focus:border-red-500' 
                              : 'border-border focus:border-primary/50'
                          }`}
                          placeholder="0.00"
                          min="1"
                          max="1000000"
                          step="0.01"
                          required
                        />
                      </div>
                      {touchedFields.budgetAmount && fieldErrors.budgetAmount && (
                        <div className="flex items-center gap-2 text-red-500 text-xs mt-1">
                          <AlertCircle size={12} />
                          {fieldErrors.budgetAmount}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-text-secondary uppercase tracking-widest px-1">Deadline Date</label>
                      <div className="relative group">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" size={18} />
                        <input
                          type="date"
                          name="deadline"
                          value={formData.deadline}
                          onChange={handleInputChange}
                          className={`w-full bg-surface border rounded-xl py-4 pl-12 pr-4 outline-none transition-all text-white [color-scheme:dark] ${
                            touchedFields.deadline && fieldErrors.deadline 
                              ? 'border-red-500 focus:border-red-500' 
                              : 'border-border focus:border-primary/50'
                          }`}
                          min={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>
                      {touchedFields.deadline && fieldErrors.deadline && (
                        <div className="flex items-center gap-2 text-red-500 text-xs mt-1">
                          <AlertCircle size={12} />
                          {fieldErrors.deadline}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-text-secondary uppercase tracking-widest px-1">Experience Level</label>
                      <select
                        name="experienceLevel"
                        value={formData.experienceLevel}
                        onChange={handleInputChange}
                        className="w-full bg-surface border border-border rounded-xl py-4 px-4 outline-none text-sm transition-all focus:border-primary/50 cursor-pointer"
                      >
                        <option value="junior">Junior - Fast execution</option>
                        <option value="mid-level">Mid-level - Balanced approach</option>
                        <option value="expert">Expert - Specialized strategy</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-text-secondary uppercase tracking-widest px-1">Payment Terms</label>
                      <select
                        name="paymentTerms"
                        value={formData.paymentTerms}
                        onChange={handleInputChange}
                        className="w-full bg-surface border border-border rounded-xl py-4 px-4 outline-none text-sm transition-all focus:border-primary/50 cursor-pointer"
                      >
                        <option value="upon-completion">Fully upon completion</option>
                        <option value="milestones">In milestones</option>
                        <option value="50-50">50% Upfront, 50% End</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section 4: Attachments & Links */}
                <div className="glass-card p-8 space-y-6">
                  <div className="flex items-center gap-3 mb-2 font-bold text-lg">
                    <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                      <Layers size={20} />
                    </div>
                    Attachments & Links
                  </div>

                  {/* File Upload */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-text-secondary uppercase tracking-widest px-1">Attachments</label>
                      <div className="border-2 border-dashed border-border rounded-2xl p-6 text-center hover:border-primary/50 transition-colors">
                        <input
                          type="file"
                          multiple
                          accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.txt"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="file-upload"
                        />
                        <label
                          htmlFor="file-upload"
                          className="cursor-pointer flex flex-col items-center gap-3"
                        >
                          <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <PlusCircle className="text-primary" size={24} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white mb-1">
                              Click to upload or drag and drop
                            </p>
                            <p className="text-xs text-text-secondary">
                              Images, PDF, Word docs, text files (Max 10MB each, 5 files total)
                            </p>
                          </div>
                        </label>
                      </div>
                      
                      {touchedFields.attachments && fieldErrors.attachments && (
                        <div className="flex items-center gap-2 text-red-500 text-xs mt-1">
                          <AlertCircle size={12} />
                          {fieldErrors.attachments}
                        </div>
                      )}
                      
                      {/* Display uploaded files */}
                      {formData.attachments.length > 0 && (
                        <div className="space-y-2">
                          {formData.attachments.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                              <div className="flex items-center gap-3">
                                <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                  <Layers size={16} className="text-primary" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-white">{file.name}</p>
                                  <p className="text-xs text-text-secondary">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                  </p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeAttachment(index)}
                                className="text-text-secondary hover:text-red-500 transition-colors"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Links */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-text-secondary uppercase tracking-widest px-1">External Links</label>
                        <button
                          type="button"
                          onClick={addLink}
                          className="text-xs text-primary hover:text-primary/80 transition-colors"
                        >
                          + Add Link
                        </button>
                      </div>
                      
                      {formData.links.map((link, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="url"
                            value={link}
                            onChange={(e) => updateLink(index, e.target.value)}
                            placeholder="https://example.com"
                            className="flex-1 bg-surface border border-border rounded-xl py-3 px-4 outline-none focus:border-primary/50 transition-all text-sm text-white placeholder:text-white/20"
                          />
                          <button
                            type="button"
                            onClick={() => removeLink(index)}
                            className="px-3 py-3 text-text-secondary hover:text-red-500 transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                      
                      {touchedFields.links && fieldErrors.links && (
                        <div className="flex items-center gap-2 text-red-500 text-xs mt-1">
                          <AlertCircle size={12} />
                          {fieldErrors.links}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-sm">
                    <Info size={18} />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-5 rounded-3xl text-lg font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-primary/20"
                >
                  {loading ? <Loader2 className="animate-spin" size={24} /> : (
                    <>
                      Post Project Now
                      <ChevronRight size={24} />
                    </>
                  )}
                </button>
              </motion.form>
            </div>

            {/* Sidebar Guidance */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card p-8 border-primary/20"
              >
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <Sparkles className="text-primary" size={18} />
                  Expert Tips
                </h3>
                <ul className="space-y-6">
                  <li className="flex gap-4">
                    <div className="size-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold shrink-0 mt-1">1</div>
                    <p className="text-xs text-text-secondary leading-relaxed"><span className="text-white font-bold italic">Be specific.</span> Projects with clear deliverables attract 3x more expert proposals.</p>
                  </li>
                  <li className="flex gap-4">
                    <div className="size-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold shrink-0 mt-1">2</div>
                    <p className="text-xs text-text-secondary leading-relaxed"><span className="text-white font-bold italic">Fair pricing.</span> Use the budget as a starting point. Experts value transparency.</p>
                  </li>
                  <li className="flex gap-4">
                    <div className="size-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold shrink-0 mt-1">3</div>
                    <p className="text-xs text-text-secondary leading-relaxed"><span className="text-white font-bold italic">Timeline matters.</span> Realistic deadlines build trust and ensure higher quality results.</p>
                  </li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-8 bg-surface/30 border-white/5"
              >
                <div className="flex items-center gap-3 mb-4 text-sm font-bold opacity-50">
                  <Layers size={16} />
                  System Protocol
                </div>
                <p className="text-[10px] text-text-secondary uppercase tracking-widest font-black mb-4">Escrow Guaranteed</p>
                <p className="text-xs text-text-secondary leading-relaxed italic">
                  All funds are securely held in our escrow system until you approve the final deliverables. Your investment is protected by the Unhire Protocol.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PostProjectPage;
