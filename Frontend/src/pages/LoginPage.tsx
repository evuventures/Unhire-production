import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch(`${backendUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    console.log("Login response:", data); // DEBUG

    if (res.ok) {
      // Save token and user info
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role
      }));

      // Redirect based on role
      if (data.role === "client") navigate("/client-dashboard");
      else if (data.role === "expert") navigate("/expert-dashboard");
      else navigate("/"); // admin or fallback
    } else {
      alert(data.message || "Login failed. Check credentials.");
    }
  } catch (err) {
    console.error("Login error:", err);
    alert("Error logging in.");
  }
};


  return (
    <div className="relative flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex flex-1 justify-center items-center px-6 py-16 bg-gray-50">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-6">Welcome Back</h1>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input type="email" name="email" placeholder="Email Address" value={form.email} onChange={handleChange} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-700 focus:ring-2 focus:ring-[#87CEEB] outline-none" required />
            <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-700 focus:ring-2 focus:ring-[#87CEEB] outline-none" required />

            <button type="submit" disabled={loading} className="w-full rounded-xl bg-[#F08080] text-white font-bold py-3 mt-2 hover:bg-opacity-90 shadow-md transition-transform transform hover:scale-105">
              {loading ? "Logging In..." : "Log In"}
            </button>
          </form>

          <p className="text-center text-gray-600 text-sm mt-6">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-[#87CEEB] font-semibold hover:underline">Sign up</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;
