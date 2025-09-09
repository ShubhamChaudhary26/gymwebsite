"use client";
import { useState } from "react";
import { User, Mail, Phone, Lock, UserPlus } from "lucide-react";
import { Button } from "@mui/material";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
      } else {
        alert("✅ Registration successful! Please login.");
        window.location.href = "/login";
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute w-72 h-72 bg-primary/20 blur-3xl rounded-full -top-20 -left-20"></div>
      <div className="absolute w-72 h-72 bg-primary/10 blur-3xl rounded-full bottom-0 right-0"></div>

      <form
        onSubmit={handleRegister}
        className="relative z-10 bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-xl w-96 space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-white">Create Account</h2>
        <p className="text-center text-white/60">Join us and start your journey</p>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        {/* Name */}
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5" />
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:ring-2 focus:ring-primary outline-none transition"
            required
          />
        </div>

        {/* Email */}
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5" />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:ring-2 focus:ring-primary outline-none transition"
            required
          />
        </div>

        {/* Phone */}
        <div className="relative">
          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5" />
          <input
            type="text"
            name="phone"
            placeholder="Phone (optional)"
            value={form.phone}
            onChange={handleChange}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:ring-2 focus:ring-primary outline-none transition"
          />
        </div>

        {/* Password */}
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5" />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:ring-2 focus:ring-primary outline-none transition"
            required
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 btn-hero font-semibold rounded-xl hover:scale-105  flex items-center justify-center gap-2"
        >
          {loading ? "Registering..." : "Register"}
          {!loading && <UserPlus className="w-5 h-5" />}
        </button>
      </form>
    </div>
  );
}
