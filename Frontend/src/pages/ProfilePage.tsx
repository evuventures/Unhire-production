import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Save } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface ExpertProfile {
    _id: string;
    name: string;
    email: string;
    skills: string[];
    rating: number;
    totalProjects: number;
    bio: string;
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

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/expert/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error('Failed to fetch profile');
            const data = await response.json();
            setProfile(data.expert);
            setFormData({
                name: data.expert.name,
                bio: data.expert.bio || '',
                skills: data.expert.skills.join(', '),
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
            // TODO: Implement profile update API
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
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-2xl text-gray-600">Loading...</div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />

            <main className="flex-1 px-10 py-16">
                <div className="max-w-4xl mx-auto">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate('/expert-dashboard')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span className="font-medium">Back to Dashboard</span>
                    </button>

                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-4xl font-extrabold text-gray-900">Profile</h1>
                            <p className="text-gray-600 text-lg mt-1">Manage your expert profile information</p>
                        </div>
                        {!editing ? (
                            <button
                                onClick={() => setEditing(true)}
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-[#87CEEB] to-[#AFEEEE] text-white font-bold rounded-xl shadow-md hover:from-[#AFEEEE] hover:to-[#87CEEB] transition-all duration-300"
                            >
                                <Edit2 size={20} />
                                Edit Profile
                            </button>
                        ) : (
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setEditing(false);
                                        setFormData({
                                            name: profile?.name || '',
                                            bio: profile?.bio || '',
                                            skills: profile?.skills.join(', ') || '',
                                        });
                                    }}
                                    className="px-6 py-3 bg-gray-300 text-gray-700 font-bold rounded-xl shadow-md hover:bg-gray-400 transition-all duration-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-green-500 to-green-600 text-white font-bold rounded-xl shadow-md hover:from-green-600 hover:to-green-700 transition-all duration-300 disabled:opacity-50"
                                >
                                    <Save size={20} />
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Profile Content */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
                        {/* Profile Picture */}
                        <div className="flex items-center gap-6 pb-6 border-b border-gray-200">
                            <div className="w-24 h-24 bg-gradient-to-br from-[#87CEEB] to-[#AFEEEE] rounded-full flex items-center justify-center text-white font-bold text-4xl">
                                {profile?.name.charAt(0)}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{profile?.name}</h2>
                                <p className="text-gray-600">{profile?.email}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-yellow-500">⭐</span>
                                    <span className="font-semibold">{profile?.rating.toFixed(1)}</span>
                                    <span className="text-gray-500">• {profile?.totalProjects} projects completed</span>
                                </div>
                            </div>
                        </div>

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                            {editing ? (
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#87CEEB] focus:border-transparent outline-none"
                                />
                            ) : (
                                <p className="text-gray-900 text-lg">{profile?.name}</p>
                            )}
                        </div>

                        {/* Email (read-only) */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                            <p className="text-gray-600">{profile?.email}</p>
                            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                        </div>

                        {/* Bio */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
                            {editing ? (
                                <textarea
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#87CEEB] focus:border-transparent outline-none resize-none"
                                    placeholder="Tell clients about yourself..."
                                />
                            ) : (
                                <p className="text-gray-900">{profile?.bio || 'No bio added yet'}</p>
                            )}
                        </div>

                        {/* Skills */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Skills</label>
                            {editing ? (
                                <div>
                                    <input
                                        type="text"
                                        value={formData.skills}
                                        onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#87CEEB] focus:border-transparent outline-none"
                                        placeholder="e.g., React, Node.js, MongoDB (comma separated)"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Separate skills with commas</p>
                                </div>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {profile?.skills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Stats */}
                        <div className="pt-6 border-t border-gray-200">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Statistics</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <div className="text-sm text-gray-600">Rating</div>
                                    <div className="text-2xl font-bold text-gray-900">{profile?.rating.toFixed(1)} ⭐</div>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <div className="text-sm text-gray-600">Total Projects</div>
                                    <div className="text-2xl font-bold text-gray-900">{profile?.totalProjects}</div>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4 col-span-2 md:col-span-1">
                                    <div className="text-sm text-gray-600">Member Since</div>
                                    <div className="text-lg font-bold text-gray-900">2024</div>
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

export default ProfilePage;
