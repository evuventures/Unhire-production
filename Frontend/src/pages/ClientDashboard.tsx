import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Briefcase,
  DollarSign,
  Calendar,
  User,
  X,
  LucideIcon
} from 'lucide-react';
import Sidebar from '../components/Sidebar';

import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';

interface Project {
  _id: string;
  title: string;
  category: string;
  status: 'active' | 'unassigned' | 'completed' | 'expired' | 'in_progress';
  budgetAmount: number;
  deadline: string;
}

interface ProjectStatus {
  title: string;
  status: 'active' | 'unassigned' | 'completed' | 'expired' | 'in_progress';
  assignedExpert?: {
    name: string;
  };
  remainingTime?: {
    hours: number;
    minutes: number;
    seconds: number;
  };
}

interface StatusConfigItem {
  color: string;
  bg: string;
  icon: LucideIcon;
}

const ClientDashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedProjectStatus, setSelectedProjectStatus] = useState<ProjectStatus | null>(null);
  const { user } = useAuth(); // Use auth context

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await apiClient.get(`/api/projects/client/${user?._id}`);
        setProjects(response.data);
      } catch (err: any) {
        setError(err.message || "Failed to load projects");
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchProjects();
  }, [user]);

  const handleCheckStatus = async (projectId: string) => {
    try {
      const response = await apiClient.get(`/api/projects/${projectId}/status`);
      setSelectedProjectStatus(response.data);
      setIsStatusModalOpen(true);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch status');
    }
  };

  const statusConfig: Record<string, StatusConfigItem> = {
    active: { color: 'text-green-400', bg: 'bg-green-400/10', icon: CheckCircle2 },
    unassigned: { color: 'text-yellow-400', bg: 'bg-yellow-400/10', icon: Clock },
    completed: { color: 'text-blue-400', bg: 'bg-blue-400/10', icon: CheckCircle2 },
    expired: { color: 'text-red-400', bg: 'bg-red-400/10', icon: AlertCircle },
    in_progress: { color: 'text-blue-400', bg: 'bg-blue-400/10', icon: Clock }, // Added in_progress default
  };

  if (loading) {
    return (
      <div className="flex bg-background min-h-screen">
        <Sidebar role="client" />
        <main
          className="flex-1 flex items-center justify-center transition-all duration-300"
          style={{ marginLeft: 'var(--sidebar-width, 256px)' }}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-text-secondary font-medium animate-pulse">Loading dashboard...</p>
          </div>
        </main>
      </div>
    );
  }

  const stats = [
    { label: 'Total Projects', value: projects.length, icon: Briefcase, color: 'text-primary' },
    { label: 'Active Tasks', value: projects.filter(p => p.status === 'active').length, icon: TrendingUp, color: 'text-green-400' },
    { label: 'Unassigned', value: projects.filter(p => p.status === 'unassigned').length, icon: Clock, color: 'text-yellow-400' },
  ];

  return (
    <div className="flex bg-background min-h-screen text-text-primary">
      <Sidebar role="client" />

      <main
        className="flex-1 p-10 pb-20 transition-all duration-300"
        style={{ marginLeft: 'var(--sidebar-width, 256px)' }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h1 className="text-3xl font-bold mb-2">Client Dashboard</h1>
              <p className="text-text-secondary font-medium">Manage your projects and collaborate with experts.</p>
            </div>
            <Link to="/post-project" className="btn-primary flex items-center gap-2 self-start md:self-center">
              <Plus size={20} />
              Post New Project
            </Link>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 flex items-center justify-between"
              >
                <div>
                  <p className="text-text-secondary text-sm font-medium mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={`size-12 rounded-2xl bg-white/5 flex items-center justify-center ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" size={18} />
              <input
                type="text"
                placeholder="Search projects by title or category..."
                className="w-full bg-surface border border-border rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary/50 transition-all text-sm"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-3 rounded-xl border border-border bg-surface text-sm font-medium hover:bg-white/5 transition-colors">
              <Filter size={18} />
              Filters
            </button>
          </div>

          {/* Projects Content */}
          {error ? (
            <div className="glass-card p-12 text-center border-red-500/20">
              <AlertCircle className="text-red-400 mx-auto mb-4" size={48} />
              <h3 className="text-xl font-bold mb-2">Failed to load projects</h3>
              <p className="text-text-secondary mb-6">{error}</p>
              <button onClick={() => window.location.reload()} className="btn-secondary">Try Again</button>
            </div>
          ) : projects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card p-20 text-center"
            >
              <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Briefcase className="text-primary" size={40} />
              </div>
              <h3 className="text-2xl font-bold mb-3">No projects yet</h3>
              <p className="text-text-secondary mb-8 max-w-sm mx-auto">
                Ready to find top talent? Post your first project and start collaborating with experts.
              </p>
              <Link to="/post-project" className="btn-primary inline-flex">Post Your First Project</Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {projects.map((project, i) => {
                const config = statusConfig[project.status] || statusConfig.unassigned;
                return (
                  <motion.div
                    key={project._id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass-card p-6 hover:border-primary/30 transition-all group"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3 ${config.bg} ${config.color}`}>
                          <config.icon size={12} />
                          {project.status}
                        </div>
                        <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{project.title}</h3>
                        <p className="text-text-secondary text-sm mt-1">{project.category}</p>
                      </div>
                      <button className="text-text-secondary hover:text-white">
                        <MoreHorizontal size={20} />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="bg-white/5 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-text-secondary text-xs mb-1">
                          <DollarSign size={14} />
                          Budget
                        </div>
                        <p className="font-bold text-lg">${project.budgetAmount}</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-text-secondary text-xs mb-1">
                          <Calendar size={14} />
                          Deadline
                        </div>
                        <p className="font-bold text-lg">{new Date(project.deadline).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-white/5 gap-4">
                      <button
                        onClick={() => handleCheckStatus(project._id)}
                        className="flex-1 btn-secondary py-3 text-sm flex items-center justify-center gap-2"
                      >
                        <Clock size={16} />
                        Check Status
                      </button>
                      <Link
                        to={`/client/project/${project._id}`}
                        className="flex-1 btn-primary py-3 text-sm flex items-center justify-center gap-2"
                      >
                        View Details
                        <ExternalLink size={16} />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Status Modal */}
      <AnimatePresence>
        {isStatusModalOpen && selectedProjectStatus && (
          <div className="fixed inset-0 flex items-center justify-center z-[100] p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsStatusModalOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-card max-w-lg w-full p-8 relative z-10 shadow-3xl border-white/10"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">Project Status</h2>
                <button onClick={() => setIsStatusModalOpen(false)} className="text-text-secondary hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between p-4 bg-white/5 rounded-2xl">
                  <span className="text-text-secondary font-medium">Project Title</span>
                  <span className="font-bold">{selectedProjectStatus.title}</span>
                </div>

                <div className="flex justify-between p-4 bg-white/5 rounded-2xl">
                  <span className="text-text-secondary font-medium">Current Status</span>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${statusConfig[selectedProjectStatus.status]?.bg} ${statusConfig[selectedProjectStatus.status]?.color}`}>
                    {selectedProjectStatus.status}
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl">
                  <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <User size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="text-text-secondary text-xs mb-1 font-medium italic">Assigned Expert</p>
                    <p className="font-bold">{selectedProjectStatus.assignedExpert ? selectedProjectStatus.assignedExpert.name : 'Waiting for assignment...'}</p>
                  </div>
                  {selectedProjectStatus.assignedExpert && (
                    <div className="p-2 rounded-full border border-green-400/20 text-green-400">
                      <CheckCircle2 size={16} />
                    </div>
                  )}
                </div>

                {selectedProjectStatus.remainingTime && (
                  <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 text-center">
                    <p className="text-primary font-bold text-sm uppercase tracking-widest mb-4">Submission Countdown</p>
                    <div className="flex justify-center gap-4">
                      <div className="text-center">
                        <p className="text-3xl font-black text-white">{selectedProjectStatus.remainingTime.hours}</p>
                        <p className="text-[10px] text-text-secondary uppercase">Hrs</p>
                      </div>
                      <p className="text-3xl font-black text-white/20">:</p>
                      <div className="text-center">
                        <p className="text-3xl font-black text-white">{selectedProjectStatus.remainingTime.minutes}</p>
                        <p className="text-[10px] text-text-secondary uppercase">Min</p>
                      </div>
                      <p className="text-3xl font-black text-white/20">:</p>
                      <div className="text-center">
                        <p className="text-3xl font-black text-white">{selectedProjectStatus.remainingTime.seconds}</p>
                        <p className="text-[10px] text-text-secondary uppercase">Sec</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => setIsStatusModalOpen(false)}
                className="btn-primary w-full mt-10 py-4"
              >
                Close Status Overview
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClientDashboard;