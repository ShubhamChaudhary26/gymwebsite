"use client";
import { useState } from "react";
import { User, Mail, Lock, UserPlus, X } from "lucide-react";
import apiService from "@/lib/api";

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    fullname: "",
    email: "",
    password: "",
    avatar: null as File | null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false); // ✅ Toast state

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "avatar" && files) {
      setForm({ ...form, avatar: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("username", form.username);
      formData.append("fullname", form.fullname);
      formData.append("email", form.email);
      formData.append("password", form.password);
      if (form.avatar) formData.append("avatar", form.avatar);

      const data = await apiService.register(formData);

      if (!data.success) {
        setError(data.message || "Registration failed");
      } else {
        setShowToast(true);

        setTimeout(() => {
          window.location.href = "/login"; // redirect after 2s
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black relative overflow-hidden px-4 mt-10">
      {/* Background blobs */}
      <div className="absolute w-72 h-72 bg-green-400/20 blur-3xl rounded-full -top-20 -left-20"></div>
      <div className="absolute w-72 h-72 bg-green-400/10 blur-3xl rounded-full bottom-0 right-0"></div>

      <form
        onSubmit={handleRegister}
        className="relative z-10 bg-white/10 backdrop-blur-lg border border-white/20 p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-md space-y-5"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-center text-white">
          Create Account
        </h2>
        <p className="text-center text-white/60">Join us and start your journey</p>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        {/* Username */}
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5" />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-2 md:py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:ring-2 focus:ring-green-400 outline-none transition"
            required
          />
        </div>

        {/* Full Name */}
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5" />
          <input
            type="text"
            name="fullname"
            placeholder="Full Name"
            value={form.fullname}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-2 md:py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:ring-2 focus:ring-green-400 outline-none transition"
            required
          />
        </div>

        {/* Email */}
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5" />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-2 md:py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:ring-2 focus:ring-green-400 outline-none transition"
            required
          />
        </div>

        {/* Password */}
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5" />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-2 md:py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:ring-2 focus:ring-green-400 outline-none transition"
            required
          />
        </div>

        {/* Avatar */}
        <div className="relative">
          <input
            type="file"
            name="avatar"
            accept="image/*"
            onChange={handleChange}
            className="w-full text-white file:bg-green-400/30 file:border file:border-white/20 file:rounded-xl file:px-4 file:py-2 file:text-white hover:file:bg-green-400/50 transition"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 md:py-3 btn-hero font-semibold rounded-xl hover:scale-105 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          {loading ? "Registering..." : "Register"}
          {!loading && <UserPlus className="w-5 h-5" />}
        </button>

        <p className="text-white/60 text-sm text-center">
          Already have an account?{" "}
          <a href="/login" className="text-green-400 hover:underline">
            Login
          </a>
        </p>
      </form>

      {/* ✅ Toast Notification */}
  {showToast && (
  <div className="fixed top-20 left-1/2.5 -translate-x-1/2 bg-green-500 text-white px-5 sm:px-8 py-3 sm:py-4 rounded-xl shadow-xl flex items-center gap-3 max-w-[90%] sm:max-w-md z-50 animate-fade-in">
    <span className="text-sm sm:text-base font-medium">
      ✅ Registration successful! Please login.
    </span>
    <X
      className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer"
      onClick={() => setShowToast(false)}
    />
  </div>
)}



      <style jsx>{`
    @keyframes fade-in {
  0% { opacity: 0; transform: translateY(-30px); }
  100% { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.5s ease-out forwards;
}


      `}</style>
    </div>
  );
}
