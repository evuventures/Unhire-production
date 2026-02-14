import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, User, Mail, Lock, Briefcase, ArrowRight, Loader2, Sparkles } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import apiClient from "../api/client";
import { useAuth } from "../context/AuthContext";

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth(); // Global auth state

  const params = new URLSearchParams(location.search);
  const roleFromURL = params.get("role");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: roleFromURL || "client",
    skills: "",
    linkedin: "",
    resumePath: "",
  });

  const [loading, setLoading] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false); // New state for upload loading

  useEffect(() => {
    if (roleFromURL) setForm(prev => ({ ...prev, role: roleFromURL }));

    // Redirect if already logged in
    if (user) {
      navigate(user.role === "client" ? "/client-dashboard" : "/expert-dashboard");
    }
  }, [roleFromURL, navigate, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

<<<<<<< HEAD
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("resume", file);

      setUploadingResume(true);
      try {
        const res = await fetch(`${backendUrl}/api/utils/resume-parse`, {
          method: "POST",
          body: formData, // No Content-Type header needed, browser sets it
        });

        const data = await res.json();

        if (res.ok) {
          setForm(prev => ({
            ...prev,
            skills: data.extractedSkills.join(", "),
            resumePath: data.filePath
          }));
          alert("Resume parsed successfully! Skills auto-filled.");
        } else {
          alert("Failed to parse resume: " + data.message);
        }
      } catch (err) {
        console.error("Resume upload error:", err);
        alert("Error uploading resume");
      } finally {
        setUploadingResume(false);
      }
    }
  };

=======
>>>>>>> auth-overhaul-evu
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...form,
      ...form,
      skills: form.role === "expert" ? form.skills.split(",").map(s => s.trim()) : [],
      linkedin: form.role === "expert" ? form.linkedin : "",
      resume: form.role === "expert" ? form.resumePath : "", // Send the path returned from parse
    };

    try {
      // Use apiClient which handles cookies automatically
      await apiClient.post('/api/auth/signup', payload);

      alert("Signup successful! You can now log in.");
      navigate("/login");
    } catch (err: any) {
      console.error("Signup error:", err);
      const msg = err.response?.data?.message || "Signup failed. Try again.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-text-primary flex flex-col">
      <Header />
      <main className="flex flex-1 justify-center items-center px-6 py-16 bg-gray-50">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-6">
            Create Your Account
          </h1>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-700 focus:ring-2 focus:ring-[#87CEEB] outline-none" required />
            <input type="email" name="email" placeholder="Email Address" value={form.email} onChange={handleChange} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-700 focus:ring-2 focus:ring-[#87CEEB] outline-none" required />
            <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-700 focus:ring-2 focus:ring-[#87CEEB] outline-none" required />

            <select name="role" value={form.role} onChange={handleChange} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-700 focus:ring-2 focus:ring-[#87CEEB] outline-none">
              <option value="client">Client</option>
              <option value="expert">Expert</option>
              <option value="admin">Admin</option>
            </select>

            {form.role === "expert" && (
              <>
                <input type="url" name="linkedin" placeholder="LinkedIn Profile URL" value={form.linkedin} onChange={handleChange} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-700 focus:ring-2 focus:ring-[#87CEEB] outline-none" />

                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Upload Resume (PDF) - Auto-fills Skills</label>
                  <input type="file" accept=".pdf" onChange={handleResumeUpload} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-700 focus:ring-2 focus:ring-[#87CEEB] outline-none" />
                  {uploadingResume && <p className="text-sm text-blue-500 mt-1">Parsing resume...</p>}
                </div>

                <textarea name="skills" placeholder="Skills (comma separated) or upload resume" value={form.skills} onChange={handleChange} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-700 focus:ring-2 focus:ring-[#87CEEB] outline-none" required />
              </>
            )}

            <button type="submit" disabled={loading} className="w-full rounded-xl bg-gradient-to-br from-[#87CEEB] to-[#AFEEEE] text-white font-bold py-3 mt-2 hover:from-[#AFEEEE] hover:to-[#87CEEB] shadow-md transition-transform transform hover:scale-105">
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>

          <p className="text-center text-gray-600 text-sm mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-[#F08080] font-semibold hover:underline">
              Log in
            </Link>
          </p>

      <main className="flex-1 flex items-center justify-center p-6 pt-32 pb-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] pointer-events-none overflow-hidden -z-10">
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-xl"
        >
          <Link to="/" className="inline-flex items-center gap-2 text-text-secondary hover:text-white transition-colors mb-8 group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to home
          </Link>

          <div className="glass-card p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="text-primary" size={24} />
                <h1 className="text-3xl font-bold">Start your journey</h1>
              </div>
              <p className="text-text-secondary mb-10">Join Unhire today and experience the future of work.</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary px-1">Full Name</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" size={18} />
                      <input
                        type="text"
                        name="name"
                        placeholder="John Doe"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full bg-surface border border-border rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-primary/50 transition-all text-white placeholder:text-white/20"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary px-1">Email Address</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" size={18} />
                      <input
                        type="email"
                        name="email"
                        placeholder="name@example.com"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full bg-surface border border-border rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-primary/50 transition-all text-white placeholder:text-white/20"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary px-1">Password</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" size={18} />
                      <input
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full bg-surface border border-border rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-primary/50 transition-all text-white placeholder:text-white/20"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary px-1">I want to</label>
                    <div className="relative">
                      <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                      <select
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                        className="w-full bg-surface border border-border rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-primary/50 transition-all text-white appearance-none cursor-pointer"
                      >
                        <option value="client">Hire Experts</option>
                        <option value="expert">Find Work</option>
                      </select>
                    </div>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {form.role === "expert" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2 overflow-hidden"
                    >
                      <label className="text-sm font-medium text-text-secondary px-1">Skills (optional)</label>
                      <textarea
                        name="skills"
                        placeholder="React, Node.js, UI/UX Design..."
                        value={form.skills}
                        onChange={handleChange}
                        className="w-full bg-surface border border-border rounded-xl py-3.5 px-4 outline-none focus:border-primary/50 transition-all text-white placeholder:text-white/20 min-h-[100px] resize-none"
                      />
                      <p className="text-[10px] text-text-secondary px-1 italic">Separate skills with commas</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-4 mt-4 flex items-center justify-center gap-2 group disabled:opacity-70"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      Create Account
                      <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              <p className="text-center text-text-secondary text-sm mt-8 py-2 border-t border-white/5">
                Already have an account?{" "}
                <Link to="/login" className="text-primary font-semibold hover:text-primary-hover transition-colors">Sign in</Link>
              </p>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default SignupPage;
