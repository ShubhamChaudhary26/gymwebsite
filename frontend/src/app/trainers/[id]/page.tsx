"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";

interface Trainer {
  _id: string;
  name: string;
  post: string;
  image: string;
  experience?: string;
  description?: string;
}

export default function TrainerDetails() {
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const router = useRouter();
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!params.id) return;
    const fetchTrainer = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/trainers/${params.id}`
        );
        if (!res.ok) throw new Error("Failed to fetch trainer");
        const data = await res.json();
        setTrainer(data.data);
      } catch (err) {
        setError("Failed to load trainer details");
      } finally {
        setLoading(false);
      }
    };
    fetchTrainer();
  }, [params.id]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px",
      }
    );

    const elements = document.querySelectorAll(".scroll-animate");
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [trainer]);

  if (error)
    return (
      <div className="bg-gradient-to-b from-black via-gray-900 to-black min-h-screen flex items-center justify-center">
        <div className="text-center bg-red-900/20 border-2 border-red-500 rounded-2xl p-12 backdrop-blur-sm scroll-animate opacity-0 animate-in">
          <svg
            className="w-16 h-16 text-red-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-red-400 text-xl font-semibold">{error}</p>
        </div>
      </div>
    );

  if (!trainer)
    return (
      <div className="bg-gradient-to-b from-black via-gray-900 to-black min-h-screen flex items-center justify-center">
        <div className="text-center scroll-animate opacity-0 animate-in">
          <p className="text-gray-400 text-2xl">Trainer not found</p>
        </div>
      </div>
    );

  const specialties = [
    "Strength Training",
    "Cardio",
    "Nutrition",
    "Weight Loss",
  ];
  const stats = [
    { label: "Experience", value: trainer.experience || "2+ Years" },
    { label: "Clients Trained", value: "60+" },
  ];

  return (
    <div className="bg-gradient-to-b from-black via-gray-900 to-black min-h-screen py-20 px-4 sm:px-6 lg:px-12 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-40 w-96 h-96 bg-[#A2CD04] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-1/4 -left-40 w-96 h-96 bg-[#A2CD04] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#A2CD04] rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse delay-500"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="scroll-animate opacity-0 group mb-8 flex items-center gap-3 bg-gray-800/50 hover:bg-gray-800 backdrop-blur-sm text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 border border-gray-700 hover:border-[#A2CD04]/50 hover:shadow-lg hover:shadow-[#A2CD04]/20"
        >
          <svg
            className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Trainers
        </button>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Trainer Image Section */}
          <div className="space-y-6">
            <div className="scroll-animate opacity-0 relative group">
              {/* Main Image Container */}
              <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl overflow-hidden shadow-2xl border-2 border-gray-800 group-hover:border-[#A2CD04] transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
                <img
                  src={
                    trainer.image?.startsWith("http")
                      ? trainer.image
                      : `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${trainer.image}`
                  }
                  alt={trainer.name}
                  className="w-full h-[600px] object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Floating Badge */}
                <div className="absolute top-6 right-6 z-20">
                  <div className="bg-[#A2CD04] text-black px-4 py-2 rounded-full font-bold text-sm uppercase tracking-wider shadow-xl animate-pulse">
                    Certified Pro
                  </div>
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-6 left-6 right-6 z-20">
                  <div className="bg-black/60 backdrop-blur-md rounded-2xl p-4 border border-gray-700 transform group-hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#A2CD04] rounded-full flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-black"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-white font-semibold">
                          Available for Training
                        </p>
                        <p className="text-gray-400 text-sm">
                          Book your session today
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Glow Effect */}
              <div className="absolute inset-0 bg-[#A2CD04] rounded-3xl opacity-0 group-hover:opacity-20 blur-3xl transition-opacity duration-500 -z-10"></div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="scroll-animate opacity-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-5 border border-gray-800 hover:border-[#A2CD04]/50 transition-all duration-300 group"
                  style={{ animationDelay: `${idx * 150}ms` }}
                >
                  <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
                  <p className="text-[#A2CD04] text-2xl font-bold group-hover:scale-110 transition-transform duration-300 inline-block">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Trainer Details Section */}
          <div className="text-white space-y-8">
            {/* Header */}
            <div className="scroll-animate opacity-0 space-y-4">
              <div className="inline-block">
                <span className="bg-[#A2CD04]/20 text-[#A2CD04] px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase">
                  Professional Trainer
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-[#A2CD04] leading-tight">
                {trainer.name}
              </h1>

              <div className="flex items-center gap-3">
                <div className="h-1 w-12 bg-[#A2CD04] rounded-full animate-expand"></div>
                <p className="text-2xl text-[#A2CD04] font-semibold uppercase tracking-wide">
                  {trainer.post}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="scroll-animate opacity-0 bg-gradient-to-br from-gray-900/50 via-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 hover:border-[#A2CD04]/30 transition-all duration-500">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-[#A2CD04] rounded-full"></div>
                About Me
              </h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                {trainer.description ||
                  "A dedicated fitness coach with a passion for transforming lives through personalized training programs. I believe in creating sustainable fitness habits and helping clients reach their full potential with motivation, expertise, and dedication."}
              </p>
            </div>

            {/* Specialties */}
            <div className="scroll-animate opacity-0 bg-gradient-to-br from-gray-900/50 via-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 hover:border-[#A2CD04]/30 transition-all duration-500">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-[#A2CD04] rounded-full"></div>
                Specialties
              </h3>
              <div className="flex flex-wrap gap-3">
                {specialties.map((specialty, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-900 border border-gray-700 hover:border-[#A2CD04] text-gray-300 hover:text-[#A2CD04] px-4 py-2 rounded-lg font-medium transition-all duration-300 cursor-default hover:scale-105 hover:shadow-lg hover:shadow-[#A2CD04]/20"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            {/* Experience Highlight */}
            <div className="scroll-animate opacity-0 bg-gradient-to-r from-[#A2CD04]/20 via-[#A2CD04]/10 to-transparent rounded-2xl p-6 border-l-4 border-[#A2CD04] hover:from-[#A2CD04]/30 transition-all duration-500">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[#A2CD04] rounded-full flex items-center justify-center flex-shrink-0 animate-bounce-slow">
                  <svg
                    className="w-8 h-8 text-black"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Total Experience</p>
                  <p className="text-3xl font-bold text-[#A2CD04]">
                    {trainer.experience || "2+ Years"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Testimonials Preview */}
        <div className="scroll-animate opacity-0 mt-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-8 border border-gray-800 hover:border-[#A2CD04]/30 transition-all duration-500">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <div className="w-1 h-8 bg-[#A2CD04] rounded-full"></div>
            What Clients Say
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="scroll-animate opacity-0 bg-gray-900/50 rounded-2xl p-6 border border-gray-800 hover:border-[#A2CD04]/50 transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-xl hover:shadow-[#A2CD04]/20"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, idx) => (
                    <svg
                      key={idx}
                      className="w-5 h-5 text-[#A2CD04] animate-star"
                      style={{ animationDelay: `${idx * 100}ms` }}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-300 text-sm italic mb-3">
                  "Amazing trainer! Helped me achieve my goals."
                </p>
                <p className="text-gray-400 text-xs font-semibold">
                  - Client {i}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(60px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-left {
          from {
            opacity: 0;
            transform: translateX(60px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-right {
          from {
            opacity: 0;
            transform: translateX(-60px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fade-scale {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes expand {
          from {
            width: 0;
          }
          to {
            width: 3rem;
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes star {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
        }

        .scroll-animate {
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .scroll-animate.animate-in:nth-child(odd) {
          animation: slide-right 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .scroll-animate.animate-in:nth-child(even) {
          animation: slide-left 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .scroll-animate.animate-in:first-child {
          animation: fade-scale 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .animate-expand {
          animation: expand 1s ease-out forwards;
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        .animate-star {
          animation: star 2s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .scroll-animate,
          .animate-expand,
          .animate-bounce-slow,
          .animate-star {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
}