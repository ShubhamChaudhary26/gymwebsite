// app/login/page.tsx
"use client";
import { useState } from "react";
import { Mail, Lock, LogIn } from "lucide-react";
import apiService from "@/lib/api";

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
      // ✅ CORRECTED: apiService.login() already returns parsed JSON
      const data = await apiService.login(email, password);

      // ❌ REMOVE THIS LINE:
      // const data = await res.json();

      // ✅ Direct access to data
      if (!data.success) {
        setError(data.message || "Login failed");
        return;
      }

      // ✅ Save user info (NOT token - backend handles cookies)
      if (data.data?.user) {
        localStorage.setItem("user", JSON.stringify({
          name: data.data.user.fullname,
          email: data.data.user.email,
          avatar: data.data.user.avatar,
        }));
      }

      alert("✅ Login successful!");
      window.location.href = "/";
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black relative overflow-hidden">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-green-500/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>

      <form
        onSubmit={handleLogin}
        className="relative z-10 bg-white/10 backdrop-blur-lg border border-white/20 p-10 rounded-2xl shadow-xl w-full max-w-md space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-white">Welcome Back</h2>
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            required
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 btn-hero font-semibold rounded-xl flex items-center justify-center gap-2 transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
          {!loading && <LogIn className="w-5 h-5" />}
        </button>

        <p className="text-white/60 text-sm text-center">
          Don't have an account?{" "}
          <a href="/register" className="text-green-400 hover:underline">
            Register
          </a>
        </p>
      </form>
    </div>
  );
}