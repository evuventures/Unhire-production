import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ClientProjectDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reviewLoading, setReviewLoading] = useState(false);

    useEffect(() => {
        const fetchProjectDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/projects/${id}/status`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch project details');
                }

                const data = await response.json();
                // The status endpoint returns a simplified object, but we might need more details.
                // For now, let's use what we have, or if we need full details, we should use a /api/projects/:id endpoint if available.
                // Based on current backend, /api/projects/:id might not be strictly defined for details, but let's assume getProjectStatus gives us enough or we use the data we have.
                // Actually, getProjectStatus returns { id, title, status, client, assignedExpert, draftSubmitted, remainingTime }
                // We probably update the status endpoint or create a getDetail one.
                // Wait, the plan said "Modify App.tsx - Add route for /client/project/:id".
                // Let's rely on getProjectStatusService for now, but really we should have a full detail endpoint.
                // However, looking at project.controller.js, there isn't a getOneProject generic endpoint that fetches EVERYTHING including description.
                // Let's stick to what we have in getProjectStatus for status, but for description we might need another call or update the backend.
                // But for "Review", we need the DRAFT CONTENT. getProjectStatusService does NOT return draftContent/draftUrl.

                // CRITICAL: We need to fetch draft content.
                // Let's assume we can fetch it. I will update getProjectStatusService in backend to return draft details if the user is the client.
                // For this step, I'll write the frontend code assuming the data will be there.
                setProject(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProjectDetails();
    }, [id]);

    const handleReview = async (decision) => {
        if (!window.confirm(`Are you sure you want to ${decision} this project?`)) return;

        setReviewLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/projects/${id}/review`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ decision }),
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || 'Review failed');
            }

            // Refresh data
            alert(`Project ${decision}ed successfully!`);
            navigate('/client-dashboard');
        } catch (err) {
            alert(err.message);
        } finally {
            setReviewLoading(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
    if (!project) return <div className="flex justify-center items-center h-screen">Project not found</div>;

    const statusColors = {
        active: 'bg-green-500',
        unassigned: 'bg-yellow-500',
        in_progress: 'bg-blue-500',
        submitted: 'bg-purple-500',
        completed: 'bg-green-700',
        expired: 'bg-red-500',
        timeout: 'bg-red-500',
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                <Link to="/client-dashboard" className="text-blue-500 hover:underline mb-4 inline-block">&larr; Back to Dashboard</Link>

                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">{project.title}</h1>
                            <span className={`px-3 py-1 rounded-full text-white text-sm capitalize ${statusColors[project.status] || 'bg-gray-500'}`}>
                                {project.status}
                            </span>
                        </div>
                        {project.remainingTime && project.status === 'in_progress' && (
                            <div className="bg-blue-50 p-4 rounded-xl text-center">
                                <p className="text-sm text-gray-600 font-semibold mb-1">Time Remaining</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {project.remainingTime.hours}h {project.remainingTime.minutes}m
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">Assigned Expert</h3>
                                {project.assignedExpert ? (
                                    <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-xl">
                                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                                            {project.assignedExpert.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800">{project.assignedExpert.name}</p>
                                            <p className="text-sm text-gray-500">{project.assignedExpert.email || 'Expert'}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 italic">No expert assigned currently.</p>
                                )}
                            </div>

                            {/* Status Specific Details */}
                            {project.status === 'submitted' && (
                                <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                                    <h3 className="text-xl font-bold text-purple-800 mb-4">Draft Submitted!</h3>
                                    <div className="mb-4">
                                        <p className="text-sm font-semibold text-gray-600 mb-1">Draft URL:</p>
                                        {project.draftUrl ? (
                                            <a href={project.draftUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                                                {project.draftUrl}
                                            </a>
                                        ) : (
                                            <p className="text-gray-500 italic">No URL provided</p>
                                        )}
                                    </div>
                                    <div className="mb-6">
                                        <p className="text-sm font-semibold text-gray-600 mb-1">Notes:</p>
                                        <p className="text-gray-800 whitespace-pre-wrap">{project.draftContent || 'No content provided.'}</p>
                                    </div>

                                    <div className="flex space-x-4">
                                        <button
                                            onClick={() => handleReview('accept')}
                                            disabled={reviewLoading}
                                            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl transition-colors disabled:opacity-50"
                                        >
                                            Accept & Complete
                                        </button>
                                        <button
                                            onClick={() => handleReview('reject')}
                                            disabled={reviewLoading}
                                            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-xl transition-colors disabled:opacity-50"
                                        >
                                            Reject & Retry
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-6">
                            {/* Placeholder for project description if we fetched it */}
                            {/* Since getProjectStatus doesn't return description, we might show limited info or fetch it separately. 
                  For now, let's keep it simple as focused on REVIEW. 
              */}
                            <div className="bg-gray-50 p-6 rounded-xl">
                                <h3 className="text-lg font-semibold text-gray-700 mb-4">Project Timeline</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <div className={`w-3 h-3 rounded-full mr-3 ${project.status !== 'unassigned' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                        <span className="text-gray-600">Project Posted</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className={`w-3 h-3 rounded-full mr-3 ${project.assignedExpert ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                        <span className="text-gray-600">Expert Assigned</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className={`w-3 h-3 rounded-full mr-3 ${project.draftSubmitted ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                        <span className="text-gray-600">Draft Submitted</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className={`w-3 h-3 rounded-full mr-3 ${project.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                        <span className="text-gray-600">Client Accepted</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ClientProjectDetailPage;
