"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

interface Trainer {
  _id: string;
  name: string;
  post: string;
  image: string;
  experience?: string;
  description?: string;
}

export default function TrainersPage() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementsRef = useRef<Set<Element>>(new Set());

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/trainers`
        );
        if (!res.ok) throw new Error("Failed to fetch trainers");
        const data = await res.json();
        setTrainers(data.data || []);
      } catch (err) {
        setError("Failed to load trainers");
      } finally {
        setLoading(false);
      }
    };
    fetchTrainers();
  }, []);

  useEffect(() => {
    if (loading || !trainers.length) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
            observerRef.current?.unobserve(entry.target);
            elementsRef.current.delete(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -100px 0px",
      }
    );

    const timeoutId = setTimeout(() => {
      const elements = document.querySelectorAll(".scroll-animate");
      elements.forEach((el) => {
        elementsRef.current.add(el);
        observerRef.current?.observe(el);
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (observerRef.current) {
        elementsRef.current.forEach((el) => {
          observerRef.current?.unobserve(el);
        });
        observerRef.current.disconnect();
      }
      elementsRef.current.clear();
    };
  }, [loading, trainers]);

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center py-0 px-4">
        <div className="text-center bg-red-900/20 border border-red-500 rounded-lg p-8 animate-shake">
          <p className="text-red-400 text-xl">{error}</p>
        </div>
      </div>
    );

  if (!trainers.length)
    return (
      <div className="min-h-screen flex items-center justify-center py-20 px-4">
        <div className="text-center">
          <p className="text-gray-400 text-xl">No trainers available</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background with movement */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -right-40 w-96 h-96 bg-[#A2CD04] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"></div>
        <div className="absolute bottom-20 -left-40 w-96 h-96 bg-[#A2CD04] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#A2CD04] rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse-glow"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section with enhanced animation */}
        <div className="text-center mb-16 scroll-animate opacity-0">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-[#A2CD04] mb-6 animate-gradient">
            Meet Our Trainers
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-6">
            Certified professionals dedicated to transforming your fitness journey
          </p>
          <div className="inline-block">
            <span className="bg-[#A2CD04]/20 text-[#A2CD04] px-6 py-2 rounded-full text-sm font-semibold tracking-wider uppercase border border-[#A2CD04]/30 hover:bg-[#A2CD04]/30 hover:scale-105 transition-all duration-300">
              Expert Team
            </span>
          </div>
        </div>

        {/* Trainers Grid with alternating animations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {trainers.map((t, index) => {
            const animationClass = index % 3 === 0 ? 'slide-left' : index % 3 === 1 ? 'slide-right' : 'slide-up';
            
            return (
              <div
                key={t._id}
                onClick={() => router.push(`/trainers/${t._id}`)}
                className={`scroll-animate scroll-${animationClass} opacity-0 group relative rounded-2xl cursor-pointer overflow-hidden border border-gray-800 hover:border-[#A2CD04] transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:shadow-[#A2CD04]/30 hover:scale-[1.02]`}
                style={{ 
                  transitionDelay: `${index * 100}ms`,
                }}
              >
                {/* Animated corner accent */}
                <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-[#A2CD04]/20 to-transparent rounded-br-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-[#A2CD04]/20 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Image Container */}
                <div className="relative h-80 w-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10"></div>
                  
                  {/* Animated overlay on hover */}
                  <div className="absolute inset-0 bg-[#A2CD04]/0 group-hover:bg-[#A2CD04]/10 transition-all duration-500 z-10"></div>
                  
                  <img
                    src={
                      t.image
                        ? t.image.startsWith("http")
                          ? t.image
                          : `${process.env.NEXT_PUBLIC_BACKEND_URL}${t.image}`
                        : "/placeholder-trainer.jpg"
                    }
                    alt={t.name}
                    className="object-cover w-full h-full group-hover:scale-110 group-hover:rotate-2 transition-all duration-700"
                    loading="lazy"
                  />

                  {/* Badge with bounce effect */}
                  <div className="absolute top-4 right-4 z-20 animate-bounce-subtle">
                    <div className="bg-[#A2CD04] text-black px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg group-hover:shadow-[#A2CD04]/50 transition-shadow duration-300">
                      Pro Trainer
                    </div>
                  </div>

                  {/* Animated shine effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 animate-shine"></div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 relative z-10 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                  <div className="mb-4">
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-[#A2CD04] transition-colors duration-300">
                      {t.name}
                    </h2>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-1 w-8 bg-[#A2CD04] rounded-full group-hover:w-12 transition-all duration-300"></div>
                      <p className="text-[#A2CD04] font-semibold text-sm uppercase tracking-wide">
                        {t.post}
                      </p>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 group-hover:text-gray-300 transition-colors duration-300">
                      {t.description ||
                        "Passionate about helping clients achieve their fitness goals with personalized training."}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-700 group-hover:border-[#A2CD04]/50 transition-colors duration-300">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#A2CD04] rounded-full animate-pulse"></div>
                      <span className="text-gray-400 text-sm font-medium">
                        {t.experience || "2+ years"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-[#A2CD04] group-hover:bg-[#8EBF03] text-black font-bold py-2 px-4 rounded-lg transition-all duration-300 shadow-lg group-hover:shadow-xl group-hover:scale-105">
                      <span className="text-sm">View Profile</span>
                      <svg
                        className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-from-left {
          from {
            opacity: 0;
            transform: translateX(-60px) rotate(-5deg) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateX(0) rotate(0) scale(1);
          }
        }

        @keyframes slide-from-right {
          from {
            opacity: 0;
            transform: translateX(60px) rotate(5deg) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateX(0) rotate(0) scale(1);
          }
        }

        @keyframes slide-from-bottom {
          from {
            opacity: 0;
            transform: translateY(60px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.05;
            transform: scale(1);
          }
          50% {
            opacity: 0.15;
            transform: scale(1.2);
          }
        }

        @keyframes shine {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
          }
        }

        @keyframes bounce-subtle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .scroll-animate {
          transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .scroll-animate.scroll-slide-left.animate-in {
          animation: slide-from-left 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .scroll-animate.scroll-slide-right.animate-in {
          animation: slide-from-right 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .scroll-animate.scroll-slide-up.animate-in {
          animation: slide-from-bottom 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .scroll-animate:not([class*="scroll-slide"]).animate-in {
          animation: slide-from-bottom 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float 8s ease-in-out infinite;
          animation-delay: 4s;
        }

        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }

        .animate-shine {
          animation: shine 2s ease-in-out;
        }

        .animate-bounce-subtle {
          animation: bounce-subtle 3s ease-in-out infinite;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient-shift 5s ease infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .scroll-animate,
          .animate-float,
          .animate-float-delayed,
          .animate-pulse-glow,
          .animate-shine,
          .animate-bounce-subtle,
          .animate-gradient {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
}