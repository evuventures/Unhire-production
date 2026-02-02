import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Briefcase, Link as LinkIcon, Sparkles, Loader2, CheckCircle2 } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const OnboardingPage: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetchingLinkedIn, setFetchingLinkedIn] = useState(false);
    const [form, setForm] = useState({
        skills: "",
        linkedin: ""
    });

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const handleFetchLinkedIn = () => {
        if (!form.linkedin) return alert("Please enter your LinkedIn URL first");
        setFetchingLinkedIn(true);
        // Mock fetching logic
        setTimeout(() => {
            setForm(prev => ({
                ...prev,
                skills: prev.skills ? prev.skills + ", React, Node.js, TypeScript, UI/UX" : "React, Node.js, TypeScript, UI/UX"
            }));
            setFetchingLinkedIn(false);
        }, 2000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${backendUrl}/api/profile/update`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    skills: form.skills.split(",").map(sx => sx.trim()).filter(Boolean),
                    linkedIn: form.linkedin
                }),
            });

            if (res.ok) {
                // Update local user data if needed
                navigate("/expert-dashboard");
            } else {
                alert("Failed to update profile.");
            }
        } catch (err) {
            console.error(err);
            alert("Error saving your profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-background text-text-primary flex flex-col">
            <Header />

            <main className="flex-1 flex items-center justify-center p-6 pt-32 pb-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-2xl bg-surface border border-border rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Sparkles size={120} className="text-primary" />
                    </div>

                    <div className="relative z-10">
                        <h1 className="text-4xl font-bold mb-4">Complete your expert profile</h1>
                        <p className="text-text-secondary mb-10 leading-relaxed">
                            To match you with the best projects, we need to know your strengths.
                            Add your skills manually or sync from LinkedIn.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-4">
                                <label className="text-sm font-semibold text-text-secondary flex items-center gap-2">
                                    <LinkIcon size={16} className="text-primary" />
                                    LinkedIn Profile URL
                                </label>
                                <div className="flex gap-4">
                                    <input
                                        type="url"
                                        placeholder="https://linkedin.com/in/username"
                                        value={form.linkedin}
                                        onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                                        className="flex-1 bg-background/50 border border-border rounded-xl py-4 px-6 outline-none focus:border-primary transition-all text-white"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleFetchLinkedIn}
                                        disabled={fetchingLinkedIn}
                                        className="px-6 py-4 rounded-xl border border-primary/30 text-primary font-bold hover:bg-primary/10 transition-all flex items-center gap-2 disabled:opacity-50 whitespace-nowrap"
                                    >
                                        {fetchingLinkedIn ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                                        Sync Data
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-sm font-semibold text-text-secondary flex items-center gap-2">
                                    <Briefcase size={16} className="text-primary" />
                                    Professional Skills
                                </label>
                                <textarea
                                    placeholder="e.g. React, Python, Digital Marketing, SEO..."
                                    value={form.skills}
                                    onChange={(e) => setForm({ ...form, skills: e.target.value })}
                                    className="w-full bg-background/50 border border-border rounded-xl py-4 px-6 outline-none focus:border-primary transition-all text-white min-h-[120px] resize-none"
                                    required
                                />
                                <p className="text-xs text-text-secondary italic">Separate skills with commas</p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full py-5 text-lg flex items-center justify-center gap-3 group"
                            >
                                {loading ? <Loader2 className="animate-spin" size={24} /> : (
                                    <>
                                        Finish Onboarding
                                        <CheckCircle2 size={24} className="group-hover:scale-110 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
};

export default OnboardingPage;
