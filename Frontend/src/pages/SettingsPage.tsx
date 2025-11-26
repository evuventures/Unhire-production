import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Lock, Eye } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const SettingsPage: React.FC = () => {
    const navigate = useNavigate();
    const [settings, setSettings] = useState({
        emailNotifications: true,
        projectAlerts: true,
        marketingEmails: false,
        profileVisibility: 'public',
        twoFactorAuth: false,
    });

    const handleToggle = (key: keyof typeof settings) => {
        setSettings(prev => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const handleSave = () => {
        // TODO: Implement settings save API
        alert('Settings saved successfully!');
    };

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
                    <div className="mb-8">
                        <h1 className="text-4xl font-extrabold text-gray-900">Settings</h1>
                        <p className="text-gray-600 text-lg mt-1">Manage your account preferences and security</p>
                    </div>

                    {/* Settings Sections */}
                    <div className="space-y-6">
                        {/* Notifications */}
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <Bell className="text-[#87CEEB]" size={24} />
                                <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Email Notifications</h3>
                                        <p className="text-sm text-gray-600">Receive email updates about your account</p>
                                    </div>
                                    <button
                                        onClick={() => handleToggle('emailNotifications')}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.emailNotifications ? 'bg-[#87CEEB]' : 'bg-gray-300'
                                            }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                        />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Project Alerts</h3>
                                        <p className="text-sm text-gray-600">Get notified when new projects match your skills</p>
                                    </div>
                                    <button
                                        onClick={() => handleToggle('projectAlerts')}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.projectAlerts ? 'bg-[#87CEEB]' : 'bg-gray-300'
                                            }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.projectAlerts ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                        />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between py-3">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Marketing Emails</h3>
                                        <p className="text-sm text-gray-600">Receive updates about new features and tips</p>
                                    </div>
                                    <button
                                        onClick={() => handleToggle('marketingEmails')}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.marketingEmails ? 'bg-[#87CEEB]' : 'bg-gray-300'
                                            }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.marketingEmails ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Privacy */}
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <Eye className="text-[#87CEEB]" size={24} />
                                <h2 className="text-2xl font-bold text-gray-900">Privacy</h2>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Profile Visibility
                                    </label>
                                    <select
                                        value={settings.profileVisibility}
                                        onChange={(e) => setSettings({ ...settings, profileVisibility: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#87CEEB] focus:border-transparent outline-none"
                                    >
                                        <option value="public">Public - Visible to all clients</option>
                                        <option value="private">Private - Only visible when you apply</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Security */}
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <Lock className="text-[#87CEEB]" size={24} />
                                <h2 className="text-2xl font-bold text-gray-900">Security</h2>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Two-Factor Authentication</h3>
                                        <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                                    </div>
                                    <button
                                        onClick={() => handleToggle('twoFactorAuth')}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.twoFactorAuth ? 'bg-[#87CEEB]' : 'bg-gray-300'
                                            }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                        />
                                    </button>
                                </div>

                                <div className="py-3">
                                    <button className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-colors">
                                        Change Password
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="flex justify-end">
                            <button
                                onClick={handleSave}
                                className="px-8 py-3 bg-gradient-to-br from-[#87CEEB] to-[#AFEEEE] text-white font-bold rounded-xl shadow-md hover:from-[#AFEEEE] hover:to-[#87CEEB] transition-all duration-300"
                            >
                                Save Settings
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default SettingsPage;
