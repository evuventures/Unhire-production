import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, Link as LinkIcon, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import Sidebar from '../components/Sidebar';

type ApplicationStatus = 'pending' | 'approved' | 'rejected';

type ExpertApplication = {
  _id: string;
  status: ApplicationStatus;
  skills: string[];
  linkedIn: string;
  bio: string;
  adminNotes?: string;
  reviewedAt?: string;
};

const ApplyExpertPage: React.FC = () => {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem('token');
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch {
      return {};
    }
  }, []);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [application, setApplication] = useState<ExpertApplication | null>(null);

  const [form, setForm] = useState({
    skills: '',
    linkedIn: '',
    bio: '',
  });

  const fetchMyApplication = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${backendUrl}/api/expert/my-application`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to fetch application');
      }
      const data = await res.json();
      setApplication(data || null);

      if (data) {
        setForm({
          skills: Array.isArray(data.skills) ? data.skills.join(', ') : '',
          linkedIn: data.linkedIn || '',
          bio: data.bio || '',
        });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch application');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyApplication();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        skills: form.skills
          .split(',')
          .map(s => s.trim())
          .filter(Boolean),
        linkedIn: form.linkedIn,
        bio: form.bio,
      };

      const res = await fetch(`${backendUrl}/api/expert/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit application');
      }

      setApplication(data.application || null);
    } catch (err: any) {
      setError(err.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  const statusBadge = (status: ApplicationStatus) => {
    if (status === 'pending') return 'bg-yellow-400/10 text-yellow-400';
    if (status === 'approved') return 'bg-green-400/10 text-green-400';
    return 'bg-red-400/10 text-red-400';
  };

  const effectiveRole = user?.role || 'client';

  if (loading) {
    return (
      <div className="flex bg-background min-h-screen">
        <Sidebar role={effectiveRole as any} />
        <main className="flex-1 flex items-center justify-center transition-all duration-300" style={{ marginLeft: 'var(--sidebar-width, 256px)' }}>
          <div className="flex flex-col items-center gap-4">
            <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-text-secondary font-medium animate-pulse">Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex bg-background min-h-screen text-text-primary">
      <Sidebar role={effectiveRole as any} />

      <main className="flex-1 p-10 pb-20 transition-all duration-300" style={{ marginLeft: 'var(--sidebar-width, 256px)' }}>
        <div className="max-w-3xl mx-auto">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <h1 className="text-3xl font-bold mb-2">Apply to Become an Expert</h1>
              <p className="text-text-secondary">Submit your profile for admin review.</p>
            </div>
            <button onClick={() => navigate('/profile')} className="btn-secondary px-6 py-3 text-sm">Back to Profile</button>
          </header>

          {application?.status && (
            <div className="glass-card p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Briefcase size={18} />
                </div>
                <div>
                  <p className="text-xs text-text-secondary font-bold uppercase tracking-wider">Application Status</p>
                  <div className={`inline-flex mt-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${statusBadge(application.status)}`}>{application.status}</div>
                </div>
              </div>
              <button onClick={fetchMyApplication} className="btn-secondary px-6 py-3 text-sm">Refresh</button>
            </div>
          )}

          {error && (
            <div className="glass-card p-6 mb-8 border border-red-500/20">
              <div className="flex items-start gap-3">
                <AlertCircle size={18} className="text-red-400 mt-0.5" />
                <p className="text-sm text-red-300">{error}</p>
              </div>
            </div>
          )}

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary px-1 flex items-center gap-2">
                  <LinkIcon size={16} className="text-primary" />
                  LinkedIn Profile URL
                </label>
                <input
                  type="url"
                  value={form.linkedIn}
                  onChange={(e) => setForm(prev => ({ ...prev, linkedIn: e.target.value }))}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full bg-surface border border-border rounded-xl py-3.5 px-4 outline-none focus:border-primary/50 transition-all text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary px-1">Skills (comma separated)</label>
                <input
                  type="text"
                  value={form.skills}
                  onChange={(e) => setForm(prev => ({ ...prev, skills: e.target.value }))}
                  placeholder="React, Node.js, UI/UX..."
                  className="w-full bg-surface border border-border rounded-xl py-3.5 px-4 outline-none focus:border-primary/50 transition-all text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary px-1">Short bio</label>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm(prev => ({ ...prev, bio: e.target.value }))}
                  rows={6}
                  placeholder="Tell us about your experience and what you can deliver..."
                  className="w-full bg-surface border border-border rounded-2xl p-4 outline-none focus:border-primary/50 transition-all text-white resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full py-4 font-bold flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {submitting ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                Submit Application
              </button>
            </form>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default ApplyExpertPage;
