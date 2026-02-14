import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Link as LinkIcon, Github, Linkedin, FileText, Loader2 } from 'lucide-react';
import apiClient from '../api/client';

const ExpertApplicationPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        portfolio: '',
        github: '',
        linkedin: '',
        resume: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await apiClient.post('/api/expert/apply', form);
            alert('Application submitted successfully! Please wait for admin approval.');
            navigate('/expert-dashboard');
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to submit application');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-text-primary flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl w-full">
                <button onClick={() => navigate('/expert-dashboard')} className="flex items-center gap-2 text-text-secondary hover:text-white mb-6">
                    <ArrowLeft size={18} /> Back to Dashboard
                </button>

                <div className="glass-card p-8">
                    <h1 className="text-3xl font-bold mb-2">Expert Application</h1>
                    <p className="text-text-secondary mb-8">Share your professional profiles to get verified.</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input icon={LinkIcon} label="Portfolio URL" name="portfolio" value={form.portfolio} onChange={(e: any) => setForm({ ...form, portfolio: e.target.value })} placeholder="https://myportfolio.com" />
                        <Input icon={Github} label="GitHub URL" name="github" value={form.github} onChange={(e: any) => setForm({ ...form, github: e.target.value })} placeholder="https://github.com/username" />
                        <Input icon={Linkedin} label="LinkedIn URL" name="linkedin" value={form.linkedin} onChange={(e: any) => setForm({ ...form, linkedin: e.target.value })} placeholder="https://linkedin.com/in/username" />
                        <Input icon={FileText} label="Resume URL (Google Drive/Dropbox)" name="resume" value={form.resume} onChange={(e: any) => setForm({ ...form, resume: e.target.value })} placeholder="https://drive.google.com/..." />

                        <button type="submit" disabled={loading} className="btn-primary w-full py-4 flex items-center justify-center gap-2 mt-4">
                            {loading ? <Loader2 className="animate-spin" /> : <>Submit Application <Send size={18} /></>}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

const Input = ({ icon: Icon, label, ...props }: any) => (
    <div className="space-y-2">
        <label className="text-sm font-medium text-text-secondary">{label}</label>
        <div className="relative group">
            <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" size={18} />
            <input className="w-full bg-surface border border-border rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-primary/50 transition-all text-white placeholder:text-white/20" {...props} />
        </div>
    </div>
);

export default ExpertApplicationPage;
