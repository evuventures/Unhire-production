import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Bell,
    Lock,
    Eye,
    ShieldCheck,
    Mail,
    Smartphone,
    ChevronRight,
    ShieldAlert,
    Save,
    Loader2
} from 'lucide-react';
import Sidebar from '../components/Sidebar';

const SettingsPage: React.FC = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userRole = user.role || 'expert';

    const [settings, setSettings] = useState({
        emailNotifications: true,
        projectAlerts: true,
        marketingEmails: false,
        profileVisibility: 'public',
        twoFactorAuth: false,
    });

    const [saving, setSaving] = useState(false);

    const handleToggle = (key: keyof typeof settings) => {
        setSettings(prev => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => {
            setSaving(false);
            alert('Settings saved successfully!');
        }, 1000);
    };

    const SettingToggle = ({
        label,
        description,
        enabled,
        onToggle,
        icon: Icon
    }: {
        label: string;
        description: string;
        enabled: boolean;
        onToggle: () => void;
        icon: any;
    }) => (
        <div className="flex items-center justify-between py-6 border-b border-white/5 last:border-0">
            <div className="flex gap-4">
                <div className="p-2.5 rounded-xl bg-white/5 text-text-secondary h-fit">
                    <Icon size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-white mb-1">{label}</h3>
                    <p className="text-sm text-text-secondary max-w-sm">{description}</p>
                </div>
            </div>
            <button
                onClick={onToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ${enabled ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-surface border border-border'}`}
            >
                <motion.span
                    animate={{ x: enabled ? 26 : 4 }}
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm`}
                />
            </button>
        </div>
    );

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
                            <h1 className="text-4xl font-bold">Preferences</h1>
                            <p className="text-text-secondary mt-1">Manage your account notifications and security settings.</p>
                        </div>

                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="btn-primary py-3 px-8 text-sm flex items-center gap-2"
                        >
                            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                            Update Settings
                        </button>
                    </div>

                    <div className="space-y-8">
                        {/* Notification Settings */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-card p-8 shadow-2xl overflow-hidden relative"
                        >
                            <div className="absolute top-0 right-0 p-8 text-primary/5 pointer-events-none">
                                <Bell size={120} />
                            </div>

                            <div className="flex items-center gap-3 mb-8 relative z-10 font-bold text-xl">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                    <Bell size={20} />
                                </div>
                                Notification Preferences
                            </div>

                            <div className="relative z-10">
                                <SettingToggle
                                    label="Email Notifications"
                                    description="Receive daily digests, project updates, and system alerts via email."
                                    enabled={settings.emailNotifications}
                                    onToggle={() => handleToggle('emailNotifications')}
                                    icon={Mail}
                                />
                                <SettingToggle
                                    label="Project Alerts"
                                    description="Get notified instantly when new projects matching your skills are posted."
                                    enabled={settings.projectAlerts}
                                    onToggle={() => handleToggle('projectAlerts')}
                                    icon={ShieldCheck}
                                />
                                <SettingToggle
                                    label="Marketing Updates"
                                    description="Occasional emails about new features, tips, and industry insights."
                                    enabled={settings.marketingEmails}
                                    onToggle={() => handleToggle('marketingEmails')}
                                    icon={Smartphone}
                                />
                            </div>
                        </motion.div>

                        {/* Privacy & Security */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="glass-card p-8 h-full"
                            >
                                <div className="flex items-center gap-3 mb-8 font-bold text-xl">
                                    <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                                        <Eye size={20} />
                                    </div>
                                    Privacy
                                </div>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-text-secondary uppercase tracking-widest px-1">Profile Visibility</label>
                                        <select
                                            value={settings.profileVisibility}
                                            onChange={(e) => setSettings({ ...settings, profileVisibility: e.target.value })}
                                            className="w-full bg-surface border border-border rounded-xl py-3 px-4 outline-none text-sm transition-all focus:border-primary/50 cursor-pointer"
                                        >
                                            <option value="public">Public - Visible to Marketplace</option>
                                            <option value="private">Private - Link access only</option>
                                        </select>
                                    </div>
                                    <p className="text-xs text-text-secondary italic px-1 leading-relaxed">
                                        Public profiles are indexed by our AI matching engine to suggest your skills to relevant project owners.
                                    </p>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="glass-card p-8 h-full"
                            >
                                <div className="flex items-center gap-3 mb-8 font-bold text-xl">
                                    <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
                                        <Lock size={20} />
                                    </div>
                                    Security
                                </div>
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                                        <div>
                                            <h4 className="font-bold text-sm">2FA Security</h4>
                                            <p className="text-[10px] text-text-secondary">Extra layer of protocol</p>
                                        </div>
                                        <button
                                            onClick={() => handleToggle('twoFactorAuth')}
                                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-all ${settings.twoFactorAuth ? 'bg-primary' : 'bg-surface border border-border'}`}
                                        >
                                            <motion.span animate={{ x: settings.twoFactorAuth ? 20 : 4 }} className="h-3 w-3 rounded-full bg-white shadow-sm" />
                                        </button>
                                    </div>
                                    <button className="w-full py-3 bg-white/5 border border-border rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-all group">
                                        Change Master Password
                                        <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                                    </button>
                                </div>
                            </motion.div>
                        </div>

                        {/* Danger Zone */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-red-500/5 border border-red-500/20 rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6"
                        >
                            <div className="flex gap-4">
                                <div className="p-3 rounded-2xl bg-red-500/10 text-red-400 h-fit">
                                    <ShieldAlert size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1">Danger Zone</h3>
                                    <p className="text-sm text-text-secondary max-w-sm">
                                        Permanently delete your account and all associated data. This action cannot be undone.
                                    </p>
                                </div>
                            </div>
                            <button className="px-6 py-3 bg-red-500/10 border border-red-500/30 text-red-500 rounded-xl text-sm font-bold hover:bg-red-500 hover:text-white transition-all">
                                Deactivate Account
                            </button>
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SettingsPage;
