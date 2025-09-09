"use client";
import { useState } from "react";
import { Mail, Lock, LogIn } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
      } else {
        alert("✅ Login successful!");
        window.location.href = "/";
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
        onSubmit={handleLogin}
        className="relative z-10 bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-xl w-96 space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-white">Welcome Back</h2>
        <p className="text-center text-white/60">Login to your account</p>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        {/* Email Input */}
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:ring-2 focus:ring-primary outline-none transition"
            required
          />
        </div>

        {/* Password Input */}
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:ring-2 focus:ring-primary outline-none transition"
            required
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-primary btn-hero font-semibold rounded-xl hover:scale-105   flex items-center justify-center gap-2"
        >
          {loading ? "Logging in..." : "Login"}
          {!loading && <LogIn className="w-5 h-5" />}
        </button>
      </form>
    </div>
  );
}
