import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Briefcase, CheckCircle, XCircle, Loader2, LogOut } from 'lucide-react';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
    const { logout } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [pendingExperts, setPendingExperts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, expertsRes] = await Promise.all([
                apiClient.get('/api/admin/stats'),
                apiClient.get('/api/admin/users?role=expert&status=pending')
            ]);
            setStats(statsRes.data);
            setPendingExperts(expertsRes.data);
        } catch (error) {
            console.error("Error fetching admin data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (id: string, action: 'approve' | 'reject') => {
        try {
            await apiClient.put(`/api/admin/expert/${id}/${action}`);
            fetchData(); // Refresh list
        } catch (error) {
            console.error(`Error ${action} expert`, error);
        }
    };

    if (loading) return <div className="flex h-screen items-center justify-center bg-background text-white"><Loader2 className="animate-spin" size={40} /></div>;

    return (
        <div className="min-h-screen bg-background text-text-primary p-8">
            <header className="flex justify-between items-center mb-10">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <button onClick={logout} className="flex items-center gap-2 text-red-400 hover:text-red-300">
                    <LogOut size={20} /> Logout
                </button>
            </header>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <StatCard label="Total Users" value={stats?.users?.total} icon={Users} color="text-blue-400" />
                <StatCard label="Total Projects" value={stats?.projects?.total} icon={Briefcase} color="text-purple-400" />
                <StatCard label="Pending Experts" value={stats?.users?.pending} icon={Users} color="text-yellow-400" />
                <StatCard label="Completed Projects" value={stats?.projects?.completed} icon={CheckCircle} color="text-green-400" />
            </div>

            {/* Pending Experts */}
            <h2 className="text-2xl font-bold mb-6">Pending Expert Applications</h2>
            {pendingExperts.length === 0 ? (
                <p className="text-text-secondary">No pending applications.</p>
            ) : (
                <div className="grid gap-4">
                    {pendingExperts.map((expert) => (
                        <motion.div key={expert._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold">{expert.name}</h3>
                                <p className="text-text-secondary">{expert.email}</p>
                                <div className="flex gap-4 mt-2 text-sm text-blue-300">
                                    {expert.expertProfile?.portfolio && <a href={expert.expertProfile.portfolio} target="_blank" rel="noreferrer" className="hover:underline">Portfolio</a>}
                                    {expert.expertProfile?.github && <a href={expert.expertProfile.github} target="_blank" rel="noreferrer" className="hover:underline">GitHub</a>}
                                    {expert.expertProfile?.linkedin && <a href={expert.expertProfile.linkedin} target="_blank" rel="noreferrer" className="hover:underline">LinkedIn</a>}
                                    {expert.expertProfile?.resume && <a href={expert.expertProfile.resume} target="_blank" rel="noreferrer" className="hover:underline">Resume</a>}
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => handleVerify(expert._id, 'approve')} className="btn-primary bg-green-500 hover:bg-green-600 border-none px-4 py-2 flex items-center gap-2">
                                    <CheckCircle size={18} /> Approve
                                </button>
                                <button onClick={() => handleVerify(expert._id, 'reject')} className="btn-primary bg-red-500 hover:bg-red-600 border-none px-4 py-2 flex items-center gap-2">
                                    <XCircle size={18} /> Reject
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

const StatCard = ({ label, value, icon: Icon, color }: any) => (
    <div className="glass-card p-6 flex items-center gap-4">
        <div className={`p-3 rounded-xl bg-white/5 ${color}`}><Icon size={24} /></div>
        <div>
            <p className="text-text-secondary text-sm">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    </div>
);

export default AdminDashboard;
