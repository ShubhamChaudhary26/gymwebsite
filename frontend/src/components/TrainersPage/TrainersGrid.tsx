"use client";

import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/v1/trainers");
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

 
  
  if (error)
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="text-center bg-red-900/20 border border-red-500 rounded-lg p-8">
          <p className="text-red-400 text-xl">{error}</p>
        </div>
      </div>
    );
  
  if (!trainers.length)
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 text-xl">No trainers available</p>
        </div>
      </div>
    );

  return (
    <div className="bg-gradient-to-b from-black via-gray-900 to-black min-h-screen py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#A2CD04] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#A2CD04] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-700"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-in">
          
          <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-[#A2CD04] mb-4">
            Meet Our Trainers
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Certified professionals dedicated to transforming your fitness journey
          </p>
          
          <div className="inline-block mb-4 mt-4">
            <span className="bg-[#A2CD04]/20 text-[#A2CD04] px-4 py-2 rounded-full text-sm font-semibold tracking-wider uppercase">
              Expert Team
            </span>
          </div>
        </div>

        {/* Trainers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {trainers.map((t, index) => (
            <div
              key={t._id}
              onClick={() => router.push(`/trainers/${t._id}`)}
              className="group relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl cursor-pointer overflow-hidden border border-gray-800 hover:border-[#A2CD04] transition-all duration-500 transform hover:-translate-y-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Glow Effect on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#A2CD04]/0 to-[#A2CD04]/0 group-hover:from-[#A2CD04]/20 group-hover:to-transparent transition-all duration-500 rounded-2xl"></div>
              
              {/* Image Container */}
              <div className="relative h-80 w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                <img
                  src={t.image || "/placeholder-trainer.jpg"}
                  alt={t.name}
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Badge Overlay */}
                <div className="absolute top-4 right-4 z-20">
                  <div className="bg-[#A2CD04] text-black px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                    Pro Trainer
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 relative z-10">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-[#A2CD04] transition-colors duration-300">
                    {t.name}
                  </h2>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-1 w-8 bg-[#A2CD04] rounded-full"></div>
                    <p className="text-[#A2CD04] font-semibold text-sm uppercase tracking-wide">
                      {t.post}
                    </p>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                    {t.description || "Passionate about helping clients achieve their fitness goals with personalized training."}
                  </p>
                </div>

                {/* Footer Section */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-700 group-hover:border-[#A2CD04]/50 transition-colors duration-300">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#A2CD04] rounded-full animate-pulse"></div>
                    <span className="text-gray-400 text-sm font-medium">
                      {t.experience || "2+ years"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-[#A2CD04] group-hover:bg-[#8EBF03] text-black font-bold py-2 px-5 rounded-lg transition-all duration-300 shadow-lg group-hover:shadow-[#A2CD04]/50">
                    <span className="text-sm">View Profile</span>
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Shimmer Effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
            </div>
          ))}
        </div>

        
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}