import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, Clock, FileText, Loader2, Shield, Users, X } from 'lucide-react';
import Sidebar from '../components/Sidebar';

type ExpertApplication = {
  _id: string;
  status: 'pending' | 'approved' | 'rejected';
  skills: string[];
  linkedIn: string;
  bio: string;
  adminNotes?: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
};

type AnalyticsResponse = {
  users: number;
  projects: number;
  pendingApps: number;
  openDisputes: number;
  byRole: { _id: string; count: number }[];
  byStatus: { _id: string; count: number }[];
};

type Dispute = {
  _id: string;
  category: string;
  message: string;
  status: 'open' | 'in_review' | 'resolved' | 'rejected';
  projectId?: { _id: string; title: string; status: string; deadline: string };
  raisedBy?: { _id: string; name: string; email: string; role: string };
  against?: { _id: string; name: string; email: string; role: string } | null;
};

const AdminDashboard: React.FC = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem('token');
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch {
      return {};
    }
  }, []);

  const [tab, setTab] = useState<'applications' | 'disputes' | 'analytics' | 'override'>('applications');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [applications, setApplications] = useState<ExpertApplication[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [disputes, setDisputes] = useState<Dispute[]>([]);

  const [overrideForm, setOverrideForm] = useState({
    projectId: '',
    deadline: '',
    status: '',
    reason: '',
  });

  const [resolveModal, setResolveModal] = useState<{ open: boolean; dispute: Dispute | null }>({ open: false, dispute: null });
  const [resolvePayload, setResolvePayload] = useState({ status: 'resolved', resolutionNotes: '' });

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${backendUrl}/api/admin/expert-applications?status=pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => ([]));
      if (!res.ok) throw new Error(data.message || 'Failed to fetch applications');
      setApplications(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${backendUrl}/api/admin/analytics`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Failed to fetch analytics');
      setAnalytics(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  const fetchDisputes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${backendUrl}/api/admin/disputes?status=open`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => ([]));
      if (!res.ok) throw new Error(data.message || 'Failed to fetch disputes');
      setDisputes(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch disputes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tab === 'applications') fetchApplications();
    if (tab === 'analytics') fetchAnalytics();
    if (tab === 'disputes') fetchDisputes();
  }, [tab]);

  const reviewApplication = async (id: string, decision: 'approve' | 'reject') => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${backendUrl}/api/admin/expert-applications/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ decision }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Failed to review application');
      await fetchApplications();
    } catch (err: any) {
      setError(err.message || 'Failed to review application');
    } finally {
      setLoading(false);
    }
  };

  const submitOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (!overrideForm.projectId) throw new Error('Project ID is required');
      const res = await fetch(`${backendUrl}/api/admin/projects/${overrideForm.projectId}/override`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          deadline: overrideForm.deadline || undefined,
          status: overrideForm.status || undefined,
          reason: overrideForm.reason,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Failed to override project');
      setOverrideForm({ projectId: '', deadline: '', status: '', reason: '' });
    } catch (err: any) {
      setError(err.message || 'Failed to override project');
    } finally {
      setLoading(false);
    }
  };

  const openResolve = (d: Dispute) => {
    setResolvePayload({ status: 'resolved', resolutionNotes: '' });
    setResolveModal({ open: true, dispute: d });
  };

  const submitResolve = async () => {
    if (!resolveModal.dispute) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${backendUrl}/api/admin/disputes/${resolveModal.dispute._id}/resolve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(resolvePayload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Failed to update dispute');
      setResolveModal({ open: false, dispute: null });
      await fetchDisputes();
    } catch (err: any) {
      setError(err.message || 'Failed to update dispute');
    } finally {
      setLoading(false);
    }
  };

  const effectiveRole = user?.role || 'admin';

  const statsCards = analytics
    ? [
        { label: 'Users', value: analytics.users, icon: Users },
        { label: 'Projects', value: analytics.projects, icon: FileText },
        { label: 'Pending Applications', value: analytics.pendingApps, icon: Clock },
        { label: 'Open Disputes', value: analytics.openDisputes, icon: AlertCircle },
      ]
    : [];

  return (
    <div className="flex bg-background min-h-screen text-text-primary">
      <Sidebar role={effectiveRole as any} />

      <main className="flex-1 p-10 pb-20 transition-all duration-300" style={{ marginLeft: 'var(--sidebar-width, 256px)' }}>
        <div className="max-w-7xl mx-auto">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Shield size={18} />
                </div>
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              </div>
              <p className="text-text-secondary">Review expert applications, manage disputes, and override project state.</p>
            </div>

            <div className="flex items-center gap-2 p-1.5 bg-surface border border-border rounded-2xl w-fit">
              <button onClick={() => setTab('applications')} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${tab === 'applications' ? 'bg-primary text-white' : 'text-text-secondary hover:text-white'}`}>Applications</button>
              <button onClick={() => setTab('disputes')} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${tab === 'disputes' ? 'bg-primary text-white' : 'text-text-secondary hover:text-white'}`}>Disputes</button>
              <button onClick={() => setTab('analytics')} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${tab === 'analytics' ? 'bg-primary text-white' : 'text-text-secondary hover:text-white'}`}>Analytics</button>
              <button onClick={() => setTab('override')} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${tab === 'override' ? 'bg-primary text-white' : 'text-text-secondary hover:text-white'}`}>Overrides</button>
            </div>
          </header>

          {error && (
            <div className="glass-card p-6 mb-8 border border-red-500/20">
              <div className="flex items-start gap-3">
                <AlertCircle size={18} className="text-red-400 mt-0.5" />
                <p className="text-sm text-red-300">{error}</p>
              </div>
            </div>
          )}

          {loading && (
            <div className="glass-card p-6 mb-8 flex items-center gap-3 text-text-secondary">
              <Loader2 size={18} className="animate-spin" />
              Loading...
            </div>
          )}

          <AnimatePresence mode="wait">
            {tab === 'applications' && (
              <motion.div key="applications" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                {applications.length === 0 ? (
                  <div className="glass-card p-12 text-center">
                    <CheckCircle2 size={40} className="text-green-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold">No pending applications</h3>
                    <p className="text-text-secondary">You’re all caught up.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {applications.map((app) => (
                      <div key={app._id} className="glass-card p-8">
                        <div className="flex items-start justify-between gap-4 mb-6">
                          <div>
                            <p className="text-xs text-text-secondary font-bold uppercase tracking-widest">Applicant</p>
                            <p className="text-lg font-bold">{app.userId?.name}</p>
                            <p className="text-sm text-text-secondary">{app.userId?.email}</p>
                          </div>
                          <div className="px-3 py-1 rounded-full bg-yellow-400/10 text-yellow-400 text-[10px] font-bold uppercase tracking-widest">pending</div>
                        </div>

                        <div className="space-y-3 mb-6">
                          <p className="text-xs text-text-secondary font-bold uppercase tracking-widest">Skills</p>
                          <div className="flex flex-wrap gap-2">
                            {(app.skills || []).slice(0, 8).map((s, i) => (
                              <span key={i} className="px-3 py-1 bg-white/5 border border-white/5 rounded-xl text-xs font-bold text-text-secondary">{s}</span>
                            ))}
                            {(app.skills || []).length === 0 && <span className="text-sm text-text-secondary italic">No skills provided</span>}
                          </div>
                        </div>

                        <div className="text-sm text-text-secondary mb-8 whitespace-pre-line">{app.bio || 'No bio provided.'}</div>

                        <div className="flex gap-3">
                          <button onClick={() => reviewApplication(app._id, 'reject')} className="flex-1 btn-secondary py-3 font-bold">Reject</button>
                          <button onClick={() => reviewApplication(app._id, 'approve')} className="flex-1 btn-primary py-3 font-bold">Approve</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {tab === 'analytics' && (
              <motion.div key="analytics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                {!analytics ? (
                  <div className="glass-card p-12 text-center">
                    <p className="text-text-secondary">No analytics loaded.</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {statsCards.map((c, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-xl bg-white/5 text-primary"><c.icon size={18} /></div>
                            <p className="text-xs text-text-secondary font-bold uppercase tracking-widest">{c.label}</p>
                          </div>
                          <p className="text-3xl font-bold">{c.value}</p>
                        </motion.div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="glass-card p-8">
                        <h3 className="text-lg font-bold mb-4">Users by Role</h3>
                        <div className="space-y-2">
                          {analytics.byRole?.map((r) => (
                            <div key={r._id} className="flex items-center justify-between bg-white/5 border border-white/5 rounded-xl px-4 py-3">
                              <span className="text-sm text-text-secondary font-bold uppercase">{r._id}</span>
                              <span className="text-sm font-bold">{r.count}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="glass-card p-8">
                        <h3 className="text-lg font-bold mb-4">Projects by Status</h3>
                        <div className="space-y-2">
                          {analytics.byStatus?.map((s) => (
                            <div key={s._id} className="flex items-center justify-between bg-white/5 border border-white/5 rounded-xl px-4 py-3">
                              <span className="text-sm text-text-secondary font-bold uppercase">{s._id}</span>
                              <span className="text-sm font-bold">{s.count}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {tab === 'disputes' && (
              <motion.div key="disputes" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                {disputes.length === 0 ? (
                  <div className="glass-card p-12 text-center">
                    <CheckCircle2 size={40} className="text-green-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold">No open disputes</h3>
                    <p className="text-text-secondary">Nothing requires admin attention.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {disputes.map((d) => (
                      <div key={d._id} className="glass-card p-8">
                        <div className="flex items-start justify-between gap-4 mb-6">
                          <div>
                            <p className="text-xs text-text-secondary font-bold uppercase tracking-widest">Project</p>
                            <p className="text-lg font-bold">{d.projectId?.title || 'Unknown project'}</p>
                            <p className="text-sm text-text-secondary">Category: {d.category}</p>
                          </div>
                          <div className="px-3 py-1 rounded-full bg-red-400/10 text-red-400 text-[10px] font-bold uppercase tracking-widest">open</div>
                        </div>
                        <p className="text-sm text-text-secondary whitespace-pre-line mb-6">{d.message}</p>
                        <button onClick={() => openResolve(d)} className="btn-primary py-3 w-full font-bold">Resolve</button>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {tab === 'override' && (
              <motion.div key="override" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-2xl">
                <div className="glass-card p-10">
                  <h3 className="text-xl font-bold mb-2">Project Override</h3>
                  <p className="text-text-secondary mb-8">Manually override project deadline or status.</p>

                  <form onSubmit={submitOverride} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text-secondary px-1">Project ID</label>
                      <input value={overrideForm.projectId} onChange={(e) => setOverrideForm(prev => ({ ...prev, projectId: e.target.value }))} className="w-full bg-surface border border-border rounded-xl py-3.5 px-4 outline-none focus:border-primary/50 transition-all text-white" placeholder="Mongo ObjectId" required />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-text-secondary px-1">New Deadline (optional)</label>
                        <input type="date" value={overrideForm.deadline} onChange={(e) => setOverrideForm(prev => ({ ...prev, deadline: e.target.value }))} className="w-full bg-surface border border-border rounded-xl py-3.5 px-4 outline-none focus:border-primary/50 transition-all text-white" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-text-secondary px-1">New Status (optional)</label>
                        <select value={overrideForm.status} onChange={(e) => setOverrideForm(prev => ({ ...prev, status: e.target.value }))} className="w-full bg-surface border border-border rounded-xl py-3.5 px-4 outline-none focus:border-primary/50 transition-all text-white">
                          <option value="">Select status</option>
                          <option value="active">active</option>
                          <option value="unassigned">unassigned</option>
                          <option value="in_progress">in_progress</option>
                          <option value="submitted">submitted</option>
                          <option value="completed">completed</option>
                          <option value="expired">expired</option>
                          <option value="timeout">timeout</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text-secondary px-1">Reason</label>
                      <textarea value={overrideForm.reason} onChange={(e) => setOverrideForm(prev => ({ ...prev, reason: e.target.value }))} rows={4} className="w-full bg-surface border border-border rounded-2xl p-4 outline-none focus:border-primary/50 transition-all text-white resize-none" placeholder="Why are you overriding this project?" required />
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary w-full py-4 font-bold disabled:opacity-60">Submit Override</button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <AnimatePresence>
        {resolveModal.open && resolveModal.dispute && (
          <div className="fixed inset-0 flex items-center justify-center z-[100] p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setResolveModal({ open: false, dispute: null })} className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} className="glass-card max-w-2xl w-full p-10 relative z-10">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold">Resolve Dispute</h2>
                <button onClick={() => setResolveModal({ open: false, dispute: null })} className="text-text-secondary hover:text-white transition-colors"><X size={22} /></button>
              </div>

              <div className="space-y-6">
                <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
                  <p className="text-xs text-text-secondary font-bold uppercase tracking-widest mb-2">Message</p>
                  <p className="text-sm text-text-secondary whitespace-pre-line">{resolveModal.dispute.message}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary px-1">Status</label>
                    <select value={resolvePayload.status} onChange={(e) => setResolvePayload(prev => ({ ...prev, status: e.target.value }))} className="w-full bg-surface border border-border rounded-xl py-3.5 px-4 outline-none focus:border-primary/50 transition-all text-white">
                      <option value="in_review">in_review</option>
                      <option value="resolved">resolved</option>
                      <option value="rejected">rejected</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary px-1">Resolution Notes</label>
                    <textarea value={resolvePayload.resolutionNotes} onChange={(e) => setResolvePayload(prev => ({ ...prev, resolutionNotes: e.target.value }))} rows={3} className="w-full bg-surface border border-border rounded-2xl p-4 outline-none focus:border-primary/50 transition-all text-white resize-none" placeholder="What is the resolution?" />
                  </div>
                </div>

                <button onClick={submitResolve} disabled={loading} className="btn-primary w-full py-4 font-bold disabled:opacity-60">Save</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
