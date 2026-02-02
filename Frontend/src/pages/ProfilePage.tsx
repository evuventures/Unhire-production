import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Edit3,
    Save,
    User,
    Mail,
    Code,
    Star,
    Calendar,
    CheckCircle2,
    Sparkles,
    Info
} from 'lucide-react';
import Sidebar from '../components/Sidebar';

interface ExpertProfile {
    _id: string;
    name: string;
    email: string;
    skills: string[];
    rating: number;
    totalProjects: number;
    bio: string;
    role: string;
}

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<ExpertProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        bio: '',
        skills: '',
    });

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const token = localStorage.getItem('token');
    const userRole = JSON.parse(localStorage.getItem('user') || '{}').role || 'expert';

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const endpoint = userRole === 'client' ? '/api/auth/me' : '/api/expert/profile';
            const response = await fetch(`${backendUrl}${endpoint}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (!response.ok) throw new Error('Failed to fetch profile');
            const data = await response.json();

            const expertData = data.expert || data;
            setProfile({
                ...expertData,
                role: userRole
            });

            setFormData({
                name: expertData.name,
                bio: expertData.bio || '',
                skills: expertData.skills ? expertData.skills.join(', ') : '',
            });
            setLoading(false);
        } catch (err: any) {
            console.error('Profile fetch error:', err);
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s);
            const response = await fetch(`${backendUrl}/api/profile/update`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    bio: formData.bio,
                    skills: skillsArray,
                }),
            });

            if (response.ok) {
                await fetchProfile();
                setEditing(false);
                alert('Profile updated successfully!');
            } else {
                throw new Error('Failed to update profile');
            }
        } catch (err: any) {
            alert(err.message || 'Error updating profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex bg-background min-h-screen">
                <Sidebar role={userRole as any} />
                <main className="flex-1 ml-64 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex bg-background min-h-screen text-text-primary">
            <Sidebar role={userRole as any} />

            <main
                className="flex-1 p-10 pb-20 transition-all duration-300"
                style={{ marginLeft: 'var(--sidebar-width, 256px)' }}
            >
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div>
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-2 text-text-secondary mb-4 hover:text-white transition-colors cursor-pointer w-fit"
                                onClick={() => navigate(userRole === 'client' ? '/client-dashboard' : '/expert-dashboard')}
                            >
                                <ArrowLeft size={16} />
                                <span className="text-sm font-medium">Back to Workspace</span>
                            </motion.div>
                            <h1 className="text-4xl font-bold">Profile Settings</h1>
                            <p className="text-text-secondary mt-1">Customize how you appear to the world.</p>
                        </div>

                        {!editing ? (
                            <button
                                onClick={() => setEditing(true)}
                                className="btn-primary py-3 px-8 text-sm flex items-center gap-2"
                            >
                                <Edit3 size={18} />
                                Edit My Profile
                            </button>
                        ) : (
                            <div className="flex gap-3">
                                <button
                                    onClick={() => { setEditing(false); fetchProfile(); }}
                                    className="btn-secondary py-3 px-6 text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="btn-primary py-3 px-8 text-sm flex items-center gap-2"
                                >
                                    {saving ? <div className="size-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-8">
                        {/* Profile Info Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-card p-10 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                                <User size={160} />
                            </div>

                            <div className="flex flex-col md:flex-row items-center md:items-start gap-10 relative z-10">
                                <div className="relative group">
                                    <div className="size-32 md:size-40 bg-gradient-to-br from-primary to-indigo-600 rounded-3xl flex items-center justify-center text-white font-bold text-5xl shadow-2xl shadow-primary/20 transition-transform group-hover:scale-[1.02]">
                                        {profile?.name.charAt(0)}
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 size-10 bg-surface border border-border rounded-xl flex items-center justify-center text-primary shadow-lg scale-0 group-hover:scale-100 transition-transform">
                                        <Sparkles size={18} />
                                    </div>
                                </div>

                                <div className="flex-1 text-center md:text-left space-y-6 w-full">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full text-left">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-text-secondary uppercase tracking-widest px-1">Full Name</label>
                                            {editing ? (
                                                <input
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full bg-surface border border-border rounded-xl py-3 px-4 outline-none focus:border-primary/50 transition-all text-white"
                                                />
                                            ) : (
                                                <p className="text-xl font-bold px-1">{profile?.name}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-text-secondary uppercase tracking-widest px-1">Email Address</label>
                                            <div className="flex items-center gap-2 px-1 text-text-secondary">
                                                <Mail size={16} />
                                                <p className="text-lg">{profile?.email}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stats for Expert */}
                                    {profile?.role === 'expert' && (
                                        <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
                                            <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/5 flex items-center gap-2">
                                                <Star className="text-yellow-400" size={16} />
                                                <span className="font-bold">{profile?.rating.toFixed(1)}</span>
                                            </div>
                                            <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/5 flex items-center gap-2">
                                                <CheckCircle2 className="text-green-400" size={16} />
                                                <span className="font-bold">{profile?.totalProjects} Projects</span>
                                            </div>
                                            <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/5 flex items-center gap-2">
                                                <Calendar className="text-primary" size={16} />
                                                <span className="font-bold">Joined 2024</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        {/* Bio & Skills */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-8"
                        >
                            <div className="glass-card p-8 flex flex-col h-full">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                        <Info size={18} />
                                    </div>
                                    <h3 className="text-lg font-bold">Biography</h3>
                                </div>
                                {editing ? (
                                    <textarea
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        rows={6}
                                        className="w-full bg-surface border border-border rounded-2xl p-4 outline-none focus:border-primary/50 transition-all text-white placeholder:text-text-secondary resize-none text-sm h-full"
                                        placeholder="Tell us about yourself..."
                                    />
                                ) : (
                                    <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-line">
                                        {profile?.bio || 'Add a bio to let others know about your professional background and passions.'}
                                    </p>
                                )}
                            </div>

                            <div className="glass-card p-8 h-full flex flex-col">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                                        <Code size={18} />
                                    </div>
                                    <h3 className="text-lg font-bold">Core Skills</h3>
                                </div>
                                {editing ? (
                                    <div className="flex flex-col h-full">
                                        <input
                                            type="text"
                                            value={formData.skills}
                                            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                            className="w-full bg-surface border border-border rounded-xl py-3 px-4 outline-none focus:border-primary/50 transition-all text-white text-sm"
                                            placeholder="React, Node.js, Python..."
                                        />
                                        <p className="text-[10px] text-text-secondary mt-2 italic px-1">Separate skills with commas</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-wrap gap-2 content-start">
                                        {profile?.skills && profile.skills.length > 0 ? profile.skills.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="px-4 py-2 bg-white/5 border border-white/5 hover:border-primary/30 rounded-xl text-xs font-bold text-text-secondary hover:text-white transition-all cursor-default"
                                            >
                                                {skill}
                                            </span>
                                        )) : (
                                            <p className="text-text-secondary text-sm italic">No skills listed yet.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProfilePage;
