import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    Calendar,
    CheckCircle2,
    XCircle,
    Clock,
    ExternalLink,
    FileText,
    AlertTriangle,
    Loader2,
    ShieldAlert
} from 'lucide-react';
import Sidebar from '../components/Sidebar';

interface Expert {
    _id: string;
    name: string;
    email: string;
}

interface Project {
    _id: string;
    title: string;
    status: 'active' | 'in_progress' | 'submitted' | 'completed' | 'expired' | 'unassigned';
    draftStatus?: 'pending_review' | 'accepted' | 'rejected' | null;
    draftSubmitted?: boolean;
    draftContent?: string;
    draftUrl?: string;
    submittedAt?: string;
    attemptsCount?: number;
    assignedExpert?: Expert;
}

const ClientProjectDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Review state
    const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        fetchProjectDetails();
    }, [id]);

    const fetchProjectDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${backendUrl}/api/projects/${id}/draft-status`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch project details');
            }

            const data = await response.json();
            setProject(data);
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleReview = async () => {
        if (reviewAction === 'reject' && !rejectionReason.trim()) {
            alert('Please provide a reason for rejection');
            return;
        }

        setIsSubmittingReview(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${backendUrl}/api/projects/${id}/review`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: reviewAction,
                    reason: reviewAction === 'reject' ? rejectionReason : undefined,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to submit review');
            }

            const data = await response.json();

            // Update local state based on response
            if (data.project) {
                setProject(prev => prev ? ({
                    ...prev,
                    status: data.project.status,
                    draftStatus: data.project.draftStatus,
                    // Update other fields as needed
                }) : null);
            }

            // Close modal and reset
            setReviewAction(null);
            setRejectionReason('');

            // Re-fetch to be sure
            await fetchProjectDetails();

            alert(reviewAction === 'approve' ? 'Project approved successfully!' : 'Draft rejected. Expert has been notified.');

        } catch (err: any) {
            alert(err.message || 'An error occurred during review submission');
        } finally {
            setIsSubmittingReview(false);
        }
    };

    if (loading) {
        return (
            <div className="flex bg-background min-h-screen">
                <Sidebar role="client" />
                <main className="flex-1 flex items-center justify-center" style={{ marginLeft: 'var(--sidebar-width, 256px)' }}>
                    <Loader2 className="animate-spin text-primary" size={40} />
                </main>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="flex bg-background min-h-screen">
                <Sidebar role="client" />
                <main className="flex-1 p-10 flex flex-col items-center justify-center text-center" style={{ marginLeft: 'var(--sidebar-width, 256px)' }}>
                    <AlertTriangle className="text-red-400 mb-4" size={48} />
                    <h2 className="text-2xl font-bold mb-2">Error Loading Project</h2>
                    <p className="text-text-secondary mb-6">{error || 'Project not found'}</p>
                    <button onClick={() => navigate('/client-dashboard')} className="btn-secondary">
                        Back to Dashboard
                    </button>
                </main>
            </div>
        );
    }

    const getStatusColor = (status: Project['status']) => {
        switch (status) {
            case 'completed': return 'text-green-400 bg-green-400/10';
            case 'in_progress': return 'text-blue-400 bg-blue-400/10';
            case 'active': return 'text-green-400 bg-green-400/10';
            case 'submitted': return 'text-yellow-400 bg-yellow-400/10';
            case 'expired': return 'text-red-400 bg-red-400/10';
            default: return 'text-text-secondary bg-white/5';
        }
    };

    return (
        <div className="flex bg-background min-h-screen text-text-primary">
            <Sidebar role="client" />

            <main className="flex-1 p-10 pb-20 transition-all duration-300" style={{ marginLeft: 'var(--sidebar-width, 256px)' }}>
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <Link to="/client-dashboard" className="inline-flex items-center gap-2 text-text-secondary hover:text-white transition-colors mb-6 group">
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Back to Dashboard
                        </Link>

                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
                                <div className="flex items-center gap-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(project.status)}`}>
                                        {project.status.replace('_', ' ')}
                                    </span>
                                    {project.draftStatus && (
                                        <span className="text-sm text-text-secondary border-l border-white/10 pl-3">
                                            Draft Status: <span className="text-white font-medium capitalize">{project.draftStatus.replace('_', ' ')}</span>
                                        </span>
                                    )}
                                </div>
                            </div>

                            {project.assignedExpert && (
                                <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl">
                                    <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                        {project.assignedExpert.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-xs text-text-secondary">Assigned Expert</p>
                                        <p className="font-bold">{project.assignedExpert.name}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">

                            {/* Draft Review Section - Only visible when submitted */}
                            {project.status === 'submitted' && project.draftSubmitted && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="glass-card p-8 border-yellow-400/20 bg-yellow-400/5 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        <FileText size={120} />
                                    </div>

                                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                        <Clock className="text-yellow-400" />
                                        Review Draft Submission
                                    </h2>

                                    <div className="bg-background/50 rounded-xl p-6 mb-6 border border-white/5">
                                        <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-3">Expert Message</h3>
                                        <p className="text-lg leading-relaxed whitespace-pre-wrap">{project.draftContent || "No message provided."}</p>

                                        {project.draftUrl && (
                                            <div className="mt-6 pt-6 border-t border-white/5">
                                                <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-2">Deliverable Link</h3>
                                                <a
                                                    href={project.draftUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 text-primary hover:underline"
                                                >
                                                    <ExternalLink size={16} />
                                                    {project.draftUrl}
                                                </a>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => setReviewAction('reject')}
                                            className="flex-1 btn-secondary py-3 border-red-500/30 text-red-400 hover:bg-red-500/10"
                                        >
                                            Reject & Request Revision
                                        </button>
                                        <button
                                            onClick={() => setReviewAction('approve')}
                                            className="flex-[2] btn-primary py-3"
                                        >
                                            Approve & Complete
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Draft Accepted State */}
                            {project.draftStatus === 'accepted' && (
                                <div className="glass-card p-8 border-green-400/20 bg-green-400/5 flex items-center gap-4">
                                    <div className="p-3 rounded-full bg-green-400/20 text-green-400">
                                        <CheckCircle2 size={32} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-green-400">Project Completed</h3>
                                        <p className="text-text-secondary">You approved this draft. The project is securely stored and payment has been released.</p>
                                    </div>
                                </div>
                            )}

                            {/* Draft Rejected State */}
                            {project.draftStatus === 'rejected' && (
                                <div className="glass-card p-8 border-red-400/20 bg-red-400/5 flex items-center gap-4">
                                    <div className="p-3 rounded-full bg-red-400/20 text-red-400">
                                        <XCircle size={32} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-red-400">Draft Rejected</h3>
                                        <p className="text-text-secondary">
                                            {project.status === 'expired'
                                                ? "Project has expired after maximum failed attempts."
                                                : "Waiting for expert to submit a revised draft or for reassignment."}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Project Description (Using existing data structure assumptions) */}
                            <div className="glass-card p-8">
                                <h2 className="text-xl font-bold mb-4">Project Scope</h2>
                                <div className="prose prose-invert max-w-none text-text-secondary">
                                    <p>Details about the project would go here. (Fetching full description likely required if not included in draft-status endpoint)</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Timeline / Stats */}
                            <div className="glass-card p-6">
                                <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-4">Project Details</h3>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                                        <div className="flex items-center gap-3">
                                            <Calendar size={18} className="text-text-secondary" />
                                            <span className="text-sm">Submitted At</span>
                                        </div>
                                        <span className="font-bold text-sm">
                                            {project.submittedAt ? new Date(project.submittedAt).toLocaleDateString() : 'Pending'}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                                        <div className="flex items-center gap-3">
                                            <ShieldAlert size={18} className="text-text-secondary" />
                                            <span className="text-sm">Attempts</span>
                                        </div>
                                        <span className="font-bold text-sm">{project.attemptsCount || 0} / 3</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Review Confirmation/Rejection Modal */}
            <AnimatePresence>
                {reviewAction && (
                    <div className="fixed inset-0 flex items-center justify-center z-[100] p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setReviewAction(null)}
                            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="glass-card max-w-md w-full p-8 relative z-10 border-white/10"
                        >
                            <h2 className="text-2xl font-bold mb-4">
                                {reviewAction === 'approve' ? 'Approve Draft?' : 'Reject Draft'}
                            </h2>

                            {reviewAction === 'approve' ? (
                                <p className="text-text-secondary mb-8">
                                    Are you sure you want to approve this draft? This will complete the project and release payment to the expert.
                                </p>
                            ) : (
                                <div className="mb-6">
                                    <p className="text-text-secondary mb-4">
                                        Please provide feedback on why this draft is being rejected. This will help the expert improve (or the next expert if reassigned).
                                    </p>
                                    <textarea
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        placeholder="e.g., The color scheme doesn't match our brand guidelines..."
                                        className="w-full bg-surface border border-border rounded-xl p-4 outline-none focus:border-red-400/50 transition-all text-white placeholder:text-white/20 min-h-[120px] resize-none"
                                        autoFocus
                                    />
                                </div>
                            )}

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setReviewAction(null)}
                                    className="flex-1 btn-secondary py-3"
                                    disabled={isSubmittingReview}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleReview}
                                    disabled={isSubmittingReview}
                                    className={`flex-[2] btn-primary py-3 font-bold flex items-center justify-center gap-2 ${reviewAction === 'reject' ? 'bg-red-500 hover:bg-red-600 border-red-500' : ''
                                        }`}
                                >
                                    {isSubmittingReview && <Loader2 className="animate-spin" size={18} />}
                                    {reviewAction === 'approve' ? 'Confirm Approval' : 'Reject Draft'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ClientProjectDetailsPage;
