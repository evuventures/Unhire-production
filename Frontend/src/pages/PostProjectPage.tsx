import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Sparkles,
  Target,
  DollarSign,
  Calendar,
  Briefcase,
  Layers,
  Info,
  Loader2,
  ChevronRight
} from 'lucide-react';
import Sidebar from '../components/Sidebar';

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
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Compute today's date string for min-date validation
  const todayStr = useMemo(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Client-side date validation
    if (formData.deadline && formData.deadline < todayStr) {
      setError('Deadline cannot be in the past. Please select today or a future date.');
      setLoading(false);
      return;
    }

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
                      className="w-full bg-surface border border-border rounded-xl py-4 px-4 outline-none focus:border-primary/50 transition-all text-white"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-widest px-1">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full bg-surface border border-border rounded-xl py-4 px-4 outline-none text-sm transition-all focus:border-primary/50 cursor-pointer"
                      required
                    >
                      <option value="">Select a domain...</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Mobile Development">Mobile Development</option>
                      <option value="UI/UX Design">UI/UX Design</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Content Writing">Content Writing</option>
                    </select>
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
                      className="w-full bg-surface border border-border rounded-2xl p-4 outline-none focus:border-primary/50 transition-all text-white placeholder:text-white/20 resize-none"
                      required
                    />
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
                        className="w-full bg-surface border border-border rounded-2xl p-4 outline-none focus:border-primary/50 transition-all text-sm text-white placeholder:text-white/20 resize-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-text-secondary uppercase tracking-widest px-1">Deliverables</label>
                      <textarea
                        name="deliverables"
                        value={formData.deliverables}
                        onChange={handleInputChange}
                        placeholder="What exactly will be delivered?"
                        rows={4}
                        className="w-full bg-surface border border-border rounded-2xl p-4 outline-none focus:border-primary/50 transition-all text-sm text-white placeholder:text-white/20 resize-none"
                      />
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
                          className="w-full bg-surface border border-border rounded-xl py-4 pl-12 pr-4 outline-none focus:border-primary/50 transition-all text-white"
                          placeholder="0.00"
                          required
                        />
                      </div>
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
                          min={todayStr}
                          className="w-full bg-surface border border-border rounded-xl py-4 pl-12 pr-4 outline-none focus:border-primary/50 transition-all text-white [color-scheme:dark]"
                          required
                        />
                      </div>
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
