import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Read role from URL query parameter
  const params = new URLSearchParams(location.search);
  const roleFromURL = params.get("role"); // "client" or "expert" if present

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: roleFromURL || "client",
    skills: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (roleFromURL) setForm(prev => ({ ...prev, role: roleFromURL }));
  }, [roleFromURL]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Prepare payload
    const payload = {
      ...form,
      skills: form.role === "expert" ? form.skills.split(",").map(s => s.trim()) : [],
    };

    console.log("Sending signup payload:", payload);

    try {
      const res = await fetch(`${backendUrl}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Received signup response:", data);

      if (res.ok && data.token) {
        // Save JWT and user info
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        alert("Signup successful! You can now log in.");
        navigate("/login");
      } else {
        alert(data.message || "Signup failed. Try again.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert("Error signing up. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-white">
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
              <textarea name="skills" placeholder="Enter skills (comma separated)" value={form.skills} onChange={handleChange} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-700 focus:ring-2 focus:ring-[#87CEEB] outline-none" required />
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
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignupPage;
