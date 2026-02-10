import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Menu, X, User, Briefcase, CreditCard, Settings, LogOut,
  FileText, Linkedin, CheckCircle, Smartphone, Globe, PenTool, Database, Megaphone, Type
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  Star,
  TrendingUp,
  Users,
  ExternalLink,
  ChevronRight,
  Sparkles,
  AlertTriangle,
  FileText,
  Link as LinkIcon,
  X,
  Loader2
} from 'lucide-react';
import Sidebar from '../components/Sidebar';

interface Project {
  _id: string;
  title: string;
  description: string;
  category: string;
  budgetType: string;
  budgetAmount: number;
  deadline: string;
  status: string;
  clientId: {
    name: string;
    email: string;
  };
  assignedAt?: string;
  draftSubmitted?: boolean;
  draftContent?: string;
  draftUrl?: string;
  remainingTime?: {
    hours: number;
    minutes: number;
    seconds: number;
    totalMs: number;
  };
}

interface ExpertProfile {
  expert: {
    _id: string;
    name: string;
    email: string;
    skills: string[];
    rating: number;
    totalProjects: number;
    bio: string;
    linkedin?: string;
    resume?: string;
  };
  stats: {
    totalClaimed: number;
    completedProjects: number;
    inProgressProjects: number;
    submittedProjects: number;
  };
}

const ExpertDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'available' | 'my-projects'>('available');
  const [availableProjects, setAvailableProjects] = useState<Project[]>([]);
  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const [expertProfile, setExpertProfile] = useState<ExpertProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [draftContent, setDraftContent] = useState('');
  const [draftUrl, setDraftUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [timerTick, setTimerTick] = useState(0);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem('token');

  const fetchExpertProfile = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/expert/profile`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch profile');
      const data = await response.json();
      setExpertProfile(data);
    } catch (err: any) {
      console.error('Profile fetch error:', err);
    }
  };

  const fetchAvailableProjects = async () => {
    try {
      const url = selectedCategory
        ? `${backendUrl}/api/expert/available-projects?category=${selectedCategory}`
        : `${backendUrl}/api/expert/available-projects`;
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch available projects');
      const data = await response.json();
      setAvailableProjects(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchMyProjects = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/expert/my-projects`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch your projects');
      const data = await response.json();
      setMyProjects(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([
        fetchExpertProfile(),
        fetchAvailableProjects(),
        fetchMyProjects(),
      ]);
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!loading) fetchAvailableProjects();
  }, [selectedCategory]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimerTick((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleClaimProject = async (projectId: string) => {
    try {
      const response = await fetch(`${backendUrl}/api/expert/claim/${projectId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to claim project');
      }
      await Promise.all([fetchAvailableProjects(), fetchMyProjects(), fetchExpertProfile()]);
      alert('Project claimed successfully!');
      setActiveTab('my-projects');
    } catch (err: any) {
      alert(err.message || 'Error claiming project');
    }
  };

  const handleSubmitDraft = async () => {
    if (!draftContent && !draftUrl) {
      alert('Please provide draft content or URL');
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch(`${backendUrl}/api/expert/submit/${selectedProjectId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: draftContent, url: draftUrl }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit draft');
      }
      await Promise.all([fetchMyProjects(), fetchExpertProfile()]);
      setIsSubmitModalOpen(false);
      setDraftContent('');
      setDraftUrl('');
      setSelectedProjectId('');
      alert('Draft submitted successfully!');
    } catch (err: any) {
      alert(err.message || 'Error submitting draft');
    } finally {
      setSubmitting(false);
    }
  };

  const calculateRemainingTime = (project: Project) => {
    if (!project.assignedAt) return null;
    const assignedTime = new Date(project.assignedAt).getTime();
    const expiryTime = assignedTime + 3 * 60 * 60 * 1000;
    const now = Date.now();
    let remainingMs = expiryTime - now;
    if (remainingMs < 0) remainingMs = 0;
    return {
      hours: Math.floor(remainingMs / (1000 * 60 * 60)),
      minutes: Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((remainingMs % (1000 * 60)) / 1000),
      totalMs: remainingMs,
    };
  };

  const formatTime = (time: { hours: number; minutes: number; seconds: number } | null) => {
    if (!time) return '00:00:00';
    return `${String(time.hours).padStart(2, '0')}:${String(time.minutes).padStart(2, '0')}:${String(time.seconds).padStart(2, '0')}`;
  };

  // Get time color based on urgency
  const getTimeColor = (time: { totalMs: number } | null) => {
    if (!time) return 'text-gray-600';
    if (time.totalMs < 30 * 60 * 1000) return 'text-red-600 font-bold';
    if (time.totalMs < 60 * 60 * 1000) return 'text-orange-600 font-semibold';
    return 'text-green-600';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Web Development': return <Globe size={18} />;
      case 'Mobile Development': return <Smartphone size={18} />;
      case 'UI/UX Design': return <PenTool size={18} />;
      case 'Data Science': return <Database size={18} />;
      case 'Marketing': return <Megaphone size={18} />;
      case 'Content Writing': return <Type size={18} />;
      default: return <Briefcase size={18} />;
    }
  };

  const calculateProfileStrength = () => {
    if (!expertProfile) return 0;
    let score = 0;
    if (expertProfile.expert.name) score += 20;
    if (expertProfile.expert.bio) score += 20;
    if (expertProfile.expert.skills && expertProfile.expert.skills.length > 0) score += 20;
    if (expertProfile.expert.linkedin) score += 20;
    if (expertProfile.expert.resume) score += 20;
    return score;
  };

  if (loading) {
    return (
      <div className="flex bg-background min-h-screen">
        <Sidebar role="expert" />
        <main
          className="flex-1 flex items-center justify-center transition-all duration-300"
          style={{ marginLeft: 'var(--sidebar-width, 256px)' }}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-text-secondary font-medium animate-pulse">Loading workspace...</p>
          </div>
        </main>
      </div>
    );
  }

  const expertStats = expertProfile ? [
    { label: 'Platform Rating', value: `${expertProfile.expert.rating.toFixed(1)}/5`, icon: Star, color: 'text-yellow-400' },
    { label: 'Completed', value: expertProfile.stats.completedProjects, icon: CheckCircle2, color: 'text-green-400' },
    { label: 'In Progress', value: expertProfile.stats.inProgressProjects, icon: Clock, color: 'text-primary' },
    { label: 'Opportunities', value: availableProjects.length, icon: Sparkles, color: 'text-indigo-400' },
  ] : [];

  return (
    <div className="flex bg-background min-h-screen text-text-primary">
      <Sidebar role="expert" />

      <main
        className="flex-1 p-10 pb-20 transition-all duration-300"
        style={{ marginLeft: 'var(--sidebar-width, 256px)' }}
      >
        <div className="flex flex-col h-full p-6">
          {/* Profile Section */}
          {expertProfile && (
            <div className="mb-8 pt-16">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#87CEEB] to-[#AFEEEE] rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {expertProfile.expert.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{expertProfile.expert.name}</p>
                  <p className="text-sm text-gray-500">Expert</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="flex-1 space-y-2">
            <Link
              to="/expert-dashboard"
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors duration-200"
            >
              <Briefcase size={20} />
              <span className="font-medium">Projects</span>
            </Link>
            <Link
              to="/profile"
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors duration-200"
            >
              <User size={20} />
              <span className="font-medium">Profile</span>
            </Link>
            <Link
              to="/payments"
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors duration-200"
            >
              <CreditCard size={20} />
              <span className="font-medium">Payments</span>
            </Link>
            <Link
              to="/settings"
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors duration-200"
            >
              <Settings size={20} />
              <span className="font-medium">Settings</span>
            </Link>
          </nav>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200 w-full mt-auto"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Overlay */}
      {
        isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-30"
            onClick={() => setIsSidebarOpen(false)}
          />
        )
      }

      <main className="flex-1 px-4 md:px-10 py-8 md:py-12 max-w-7xl mx-auto w-full">
        <div className="flex flex-col gap-10">

          {/* Hero Section */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-2xl p-8 md:p-12">
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">
                  Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#87CEEB] to-[#AFEEEE]">{expertProfile?.expert.name}</span>
                </h1>
                <p className="text-gray-300 text-lg max-w-2xl">
                  Ready to take on new challenges? You have {availableProjects.length} new projects waiting for your expertise today.
                </p>
              </div>
              <div className="hidden md:block">
                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                  <User size={48} className="text-[#87CEEB]" />
                </div>
              </div>
            </div>

            {/* Ambient Background Elements */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-[#87CEEB] opacity-10 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-[#AFEEEE] opacity-10 blur-3xl"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Stats & Profile Strength */}
            <div className="lg:col-span-1 flex flex-col gap-8">

              {/* Profile Strength Card */}
              <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <User size={20} className="text-blue-500" /> Profile Strength
                </h3>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                        {calculateProfileStrength() === 100 ? "Complete" : "In Progress"}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-blue-600">
                        {calculateProfileStrength()}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-100">
                    <div style={{ width: `${calculateProfileStrength()}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"></div>
                  </div>
                </div>
                <div className="space-y-3 mt-4">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    {expertProfile?.expert.resume ? <CheckCircle size={16} className="text-green-500" /> : <X size={16} className="text-red-400" />}
                    <span className="flex items-center gap-2"><FileText size={14} /> Resume Uploaded</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    {expertProfile?.expert.linkedin ? <CheckCircle size={16} className="text-green-500" /> : <X size={16} className="text-red-400" />}
                    <span className="flex items-center gap-2"><Linkedin size={14} /> LinkedIn Connected</span>
                  </div>
                </div>
              </div>

              {/* Stats Overview */}
              <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Performance</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl text-center">
                    <div className="text-2xl font-bold text-gray-900">{expertProfile?.expert.rating.toFixed(1)}</div>
                    <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide mt-1">Rating</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-xl text-center">
                    <div className="text-2xl font-bold text-green-600">{expertProfile?.stats.completedProjects}</div>
                    <div className="text-xs text-green-700 font-semibold uppercase tracking-wide mt-1">Completed</div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-xl text-center">
                    <div className="text-2xl font-bold text-blue-600">{expertProfile?.stats.inProgressProjects}</div>
                    <div className="text-xs text-blue-700 font-semibold uppercase tracking-wide mt-1">Active</div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-xl text-center">
                    <div className="text-2xl font-bold text-purple-600">{expertProfile?.stats.totalClaimed}</div>
                    <div className="text-xs text-purple-700 font-semibold uppercase tracking-wide mt-1">Total</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Projects */}
            <div className="lg:col-span-2 flex flex-col gap-6">

              {/* Tabs */}
              <div className="flex gap-4">
                <button
                  onClick={() => setActiveTab('available')}
                  className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${activeTab === 'available'
                    ? 'bg-gradient-to-br from-[#87CEEB] to-[#AFEEEE] text-white shadow-md'
                    : 'bg-white text-gray-700 shadow-sm hover:shadow-md'
                    }`}
                >
                  Available Projects
                </button>
                <button
                  onClick={() => setActiveTab('my-projects')}
                  className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${activeTab === 'my-projects'
                    ? 'bg-gradient-to-br from-[#87CEEB] to-[#AFEEEE] text-white shadow-md'
                    : 'bg-white text-gray-700 shadow-sm hover:shadow-md'
                    }`}
                >
                  My Projects ({myProjects.length})
                </button>
              </div>

              {/* Available Projects Tab */}
              {activeTab === 'available' && (
                <div className="flex flex-col gap-6">
                  {/* Category Filter */}
                  <div>
                    <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                      Filter by Category
                    </label>
                    <select
                      id="category"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#87CEEB] focus:border-transparent outline-none"
                    >
                      <option value="">All Categories</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Mobile Development">Mobile Development</option>
                      <option value="UI/UX Design">UI/UX Design</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Content Writing">Content Writing</option>
                    </select>
                  </div>

                  {/* Projects Grid */}
                  {availableProjects.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                      <p className="text-gray-500 text-lg">No available projects at the moment.</p>
                      <p className="text-gray-400 text-sm mt-2">Check back later for new opportunities!</p>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {availableProjects.map((project) => (
                        <div
                          key={project._id}
                          className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col gap-4"
                        >
                          <h2 className="text-xl font-bold text-gray-900">{project.title}</h2>
                          <p className="text-sm text-gray-600 line-clamp-3">{project.description}</p>

                          <div className="flex flex-wrap gap-2">
                            {project.category && (
                              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold flex items-center gap-1">
                                {getCategoryIcon(project.category)}
                                {project.category}
                              </span>
                            )}
                            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
                              {project.budgetType}
                            </span>
                          </div>

                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="font-semibold text-gray-700">Client:</span>
                              <span className="text-gray-600">{project.clientId?.name || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-semibold text-gray-700">Budget:</span>
                              <span className="text-gray-600">${project.budgetAmount || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-semibold text-gray-700">Deadline:</span>
                              <span className="text-gray-600">
                                {new Date(project.deadline).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleClaimProject(project._id)}
                            className="mt-auto w-full bg-gradient-to-br from-[#87CEEB] to-[#AFEEEE] text-white font-bold py-3 px-6 rounded-xl shadow-md hover:from-[#AFEEEE] hover:to-[#87CEEB] transition-all duration-300 transform hover:scale-105"
                          >
                            Claim Project
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* My Projects Tab */}
              {activeTab === 'my-projects' && (
                <div>
                  {myProjects.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                      <p className="text-gray-500 text-lg">You haven't claimed any projects yet.</p>
                      <p className="text-gray-400 text-sm mt-2">
                        Switch to &quot;Available Projects&quot; to claim your first project!
                      </p>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {myProjects.map((project) => {
                        const remainingTime = calculateRemainingTime(project);
                        const timeColor = getTimeColor(remainingTime);

                        return (
                          <div
                            key={project._id}
                            className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col gap-4"
                          >
                            <h2 className="text-xl font-bold text-gray-900">{project.title}</h2>
                            <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>

                            <div className="flex flex-wrap gap-2">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${project.status === 'in_progress'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : project.status === 'submitted'
                                    ? 'bg-blue-100 text-blue-800'
                                    : project.status === 'completed'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-gray-100 text-gray-800'
                                  }`}
                              >
                                {project.status.replace('_', ' ').toUpperCase()}
                              </span>
                              {project.category && (
                                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold flex items-center gap-1">
                                  {getCategoryIcon(project.category)}
                                  {project.category}
                                </span>
                              )}
                            </div>

                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="font-semibold text-gray-700">Client:</span>
                                <span className="text-gray-600">{project.clientId?.name || 'N/A'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-semibold text-gray-700">Budget:</span>
                                <span className="text-gray-600">${project.budgetAmount || 'N/A'}</span>
                              </div>
                              {project.status === 'in_progress' && remainingTime && (
                                <div className="bg-gray-50 rounded-lg p-3 mt-2">
                                  <div className="font-semibold text-gray-700 mb-1">Time Remaining:</div>
                                  <div className={`text-2xl font-mono ${timeColor}`}>
                                    {formatTime(remainingTime)}
                                  </div>
                                  {remainingTime.totalMs < 30 * 60 * 1000 && remainingTime.totalMs > 0 && (
                                    <div className="text-xs text-red-600 mt-1 font-semibold">
                                      ⚠️ Urgent! Less than 30 minutes left!
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>

                            {project.status === 'in_progress' && (
                              <button
                                onClick={() => openSubmitModal(project._id)}
                                className="mt-auto w-full bg-gradient-to-br from-green-500 to-green-600 text-white font-bold py-3 px-6 rounded-xl shadow-md hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105"
                              >
                                Submit Draft
                              </button>
                            )}

                            {project.status === 'submitted' && (
                              <div className="mt-auto bg-blue-50 rounded-xl p-3 text-center">
                                <span className="text-blue-800 font-semibold text-sm">
                                  ✓ Draft Submitted - Awaiting Client Review
                                </span>
                              </div>
                            )}

                            {project.status === 'completed' && (
                              <div className="mt-auto bg-green-50 rounded-xl p-3 text-center">
                                <span className="text-green-800 font-semibold text-sm">✓ Completed</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h1 className="text-3xl font-bold mb-2">Expert Workspace</h1>
              <p className="text-text-secondary font-medium italic">Manage your active projects and discover new tasks.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold">{expertProfile?.expert.name}</p>
                <p className="text-xs text-text-secondary">Expert Level</p>
              </div>
              <div className="size-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold">
                {expertProfile?.expert.name.charAt(0)}
              </div>
            </div>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {expertStats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 border-white/5"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-2 rounded-xl bg-white/5 ${stat.color}`}>
                    <stat.icon size={20} />
                  </div>
                  <p className="text-text-secondary text-xs font-bold uppercase tracking-wider">{stat.label}</p>
                </div>
                <p className="text-3xl font-bold">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-2 p-1.5 bg-surface border border-border rounded-2xl mb-10 w-fit">
            <button
              onClick={() => setActiveTab('available')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'available' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-secondary hover:text-white'}`}
            >
              Marketplace
            </button>
            <button
              onClick={() => setActiveTab('my-projects')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'my-projects' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-secondary hover:text-white'}`}
            >
              Active Tasks ({myProjects.length})
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'available' ? (
              <motion.div
                key="available"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-8"
              >
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative flex-1 w-full group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" size={18} />
                    <input
                      type="text"
                      placeholder="Search for projects..."
                      className="w-full bg-surface border border-border rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary/50 transition-all text-sm"
                    />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full sm:w-64 bg-surface border border-border rounded-xl py-3 px-4 outline-none text-sm cursor-pointer"
                  >
                    <option value="">All Categories</option>
                    {['Web Development', 'UI/UX Design', 'Data Science', 'Content Writing'].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {availableProjects.length === 0 ? (
                  <div className="glass-card p-20 text-center">
                    <Sparkles className="text-primary mx-auto mb-6" size={48} />
                    <h3 className="text-2xl font-bold mb-2">No tasks available</h3>
                    <p className="text-text-secondary max-w-sm mx-auto">Check back soon for new opportunities or try adjusting your filters.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {availableProjects.map((project, i) => (
                      <motion.div
                        key={project._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="glass-card p-8 group hover:border-primary/30 transition-all"
                      >
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <div className="inline-flex px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-4">
                              {project.category}
                            </div>
                            <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{project.title}</h3>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-white">${project.budgetAmount}</p>
                            <p className="text-[10px] text-text-secondary uppercase">Budget</p>
                          </div>
                        </div>
                        <p className="text-text-secondary text-sm mb-8 line-clamp-2 leading-relaxed">
                          {project.description}
                        </p>
                        <div className="flex items-center justify-between pt-6 border-t border-white/5">
                          <div className="flex items-center gap-2 text-text-secondary text-xs">
                            <Clock size={14} />
                            Due {new Date(project.deadline).toLocaleDateString()}
                          </div>
                          <button
                            onClick={() => handleClaimProject(project._id)}
                            className="btn-primary py-2.5 px-6 text-sm flex items-center gap-2"
                          >
                            Claim Task
                            <ChevronRight size={16} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="my-projects"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                {myProjects.length === 0 ? (
                  <div className="col-span-full glass-card p-20 text-center">
                    <Briefcase className="text-primary mx-auto mb-6" size={48} />
                    <h3 className="text-2xl font-bold mb-2">Workspace empty</h3>
                    <p className="text-text-secondary mb-8">You haven't claimed any tasks yet. Head to the Marketplace to get started.</p>
                    <button onClick={() => setActiveTab('available')} className="btn-primary inline-flex">Explore Marketplace</button>
                  </div>
                ) : (
                  myProjects.map((project, i) => {
                    const time = calculateRemainingTime(project);
                    const isUrgent = time && time.totalMs < 60 * 60 * 1000;

                    return (
                      <motion.div
                        key={project._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="glass-card p-8 border-l-4 border-l-primary"
                      >
                        <div className="flex justify-between items-center mb-6">
                          <h3 className="text-xl font-bold">{project.title}</h3>
                          <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${project.status === 'in_progress' ? 'bg-yellow-400/10 text-yellow-400' :
                            project.status === 'submitted' ? 'bg-blue-400/10 text-blue-400' : 'bg-green-400/10 text-green-400'
                            }`}>
                            {project.status.replace('_', ' ')}
                          </div>
                        </div>

                        {project.status === 'in_progress' && time && (
                          <div className={`mb-8 p-4 rounded-2xl border flex items-center justify-between ${isUrgent ? 'bg-red-500/10 border-red-500/20' : 'bg-white/5 border-white/5'}`}>
                            <div className="flex items-center gap-3">
                              <Clock size={20} className={isUrgent ? 'text-red-400' : 'text-primary'} />
                              <span className="text-sm font-medium">Time Remaining</span>
                            </div>
                            <span className={`text-2xl font-black ${isUrgent ? 'text-red-400' : 'text-white'}`}>
                              {formatTime(time)}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center justify-between gap-4">
                          <p className="text-xs text-text-secondary">Client: <span className="text-white font-bold">{project.clientId.name}</span></p>
                          {project.status === 'in_progress' ? (
                            <button
                              onClick={() => { setSelectedProjectId(project._id); setIsSubmitModalOpen(true); }}
                              className="btn-primary py-2.5 px-6 text-sm flex items-center gap-2"
                            >
                              Submit Draft
                              <Sparkles size={16} />
                            </button>
                          ) : project.status === 'submitted' ? (
                            <div className="flex items-center gap-2 text-blue-400 text-sm font-bold italic">
                              <Loader2 size={16} className="animate-spin" />
                              Review Pending
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-green-400 text-sm font-bold italic">
                              <CheckCircle2 size={16} />
                              Task Completed
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Draft Submission Modal */}
      <AnimatePresence>
        {isSubmitModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-[100] p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSubmitModalOpen(false)} className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card max-w-2xl w-full p-10 relative z-10">
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <FileText size={20} />
                  </div>
                  <h2 className="text-2xl font-bold">Submit Your Draft</h2>
                </div>
                <button onClick={() => setIsSubmitModalOpen(false)} className="text-text-secondary hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary px-1">Describe your work</label>
                  <textarea
                    value={draftContent}
                    onChange={(e) => setDraftContent(e.target.value)}
                    rows={6}
                    className="w-full bg-surface border border-border rounded-2xl p-4 outline-none focus:border-primary/50 transition-all text-white placeholder:text-white/20 resize-none"
                    placeholder="Provide a summary of the work you've completed..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary px-1">Deliverable URL (Optional)</label>
                  <div className="relative group">
                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" size={18} />
                    <input
                      type="url"
                      value={draftUrl}
                      onChange={(e) => setDraftUrl(e.target.value)}
                      className="w-full bg-surface border border-border rounded-xl py-4 pl-12 pr-4 outline-none focus:border-primary/50 transition-all text-white placeholder:text-white/20"
                      placeholder="e.g. GitHub repo, Figma link, Google Drive"
                    />
                  </div>
                </div>

                <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl flex gap-3">
                  <AlertTriangle className="text-primary shrink-0" size={20} />
                  <p className="text-xs text-text-secondary leading-relaxed">
                    By submitting, you confirm that this draft represents substantial progress on the task. The client will be notified and will have 24 hours to review or request revisions.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 mt-10">
                <button onClick={() => setIsSubmitModalOpen(false)} className="flex-1 btn-secondary py-4 font-bold">Cancel</button>
                <button
                  onClick={handleSubmitDraft}
                  disabled={submitting || (!draftContent && !draftUrl)}
                  className="flex-[2] btn-primary py-4 font-bold disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="animate-spin mx-auto" size={24} /> : 'Confirm Submission'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExpertDashboard;
