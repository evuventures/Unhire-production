import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify({
          _id: data._id,
          name: data.name,
          email: data.email,
          role: data.role
        }));

        if (data.role === "client") navigate("/client-dashboard");
        else if (data.role === "expert") navigate("/expert-dashboard");
        else navigate("/");
      } else {
        alert(data.message || "Login failed. Check credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Error logging in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-text-primary flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center p-6 pt-32 pb-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="inline-flex items-center gap-2 text-text-secondary hover:text-white transition-colors mb-8 group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to home
          </Link>

          <div className="glass-card p-8 md:p-10 shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
              <p className="text-text-secondary mb-8">Enter your credentials to access your account</p>

              <form onSubmit={handleSubmit} className="space-y-5">
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

                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-sm font-medium text-text-secondary">Password</label>
                    <a href="#" className="text-xs text-primary hover:text-primary-hover transition-colors">Forgot password?</a>
                  </div>
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

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-4 mt-4 flex items-center justify-center gap-2 group disabled:opacity-70"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      Sign In
                      <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              <p className="text-center text-text-secondary text-sm mt-8 py-2 border-t border-white/5">
                Don’t have an account?{" "}
                <Link to="/signup" className="text-primary font-semibold hover:text-primary-hover transition-colors">Create account</Link>
              </p>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;
