"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (!params.id) return;
    const fetchTrainer = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/v1/trainers/${params.id}`);
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

  
  if (error)
    return (
      <div className="bg-gradient-to-b from-black via-gray-900 to-black min-h-screen flex items-center justify-center">
        <div className="text-center bg-red-900/20 border-2 border-red-500 rounded-2xl p-12 backdrop-blur-sm">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-400 text-xl font-semibold">{error}</p>
        </div>
      </div>
    );
  
  if (!trainer)
    return (
      <div className="bg-gradient-to-b from-black via-gray-900 to-black min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 text-2xl">Trainer not found</p>
        </div>
      </div>
    );

  const specialties = ["Strength Training", "Cardio", "Nutrition", "Weight Loss"];
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
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="group mb-8 flex items-center gap-3 bg-gray-800/50 hover:bg-gray-800 backdrop-blur-sm text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 border border-gray-700 hover:border-[#A2CD04]/50 hover:shadow-lg hover:shadow-[#A2CD04]/20"
        >
          <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Trainers
        </button>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Trainer Image Section */}
          <div className="space-y-6">
            <div className="relative group">
              {/* Main Image Container */}
              <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl overflow-hidden shadow-2xl border-2 border-gray-800 group-hover:border-[#A2CD04] transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
                <img
                  src={trainer.image || "/placeholder-trainer.jpg"}
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
                  <div className="bg-black/60 backdrop-blur-md rounded-2xl p-4 border border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#A2CD04] rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-white font-semibold">Available for Training</p>
                        <p className="text-gray-400 text-sm">Book your session today</p>
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
                  className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-5 border border-gray-800 hover:border-[#A2CD04]/50 transition-all duration-300 group"
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
            <div className="space-y-4">
              <div className="inline-block">
                <span className="bg-[#A2CD04]/20 text-[#A2CD04] px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase">
                  Professional Trainer
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-[#A2CD04] leading-tight">
                {trainer.name}
              </h1>
              
              <div className="flex items-center gap-3">
                <div className="h-1 w-12 bg-[#A2CD04] rounded-full"></div>
                <p className="text-2xl text-[#A2CD04] font-semibold uppercase tracking-wide">
                  {trainer.post}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-gradient-to-br from-gray-900/50 via-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
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
            <div className="bg-gradient-to-br from-gray-900/50 via-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-[#A2CD04] rounded-full"></div>
                Specialties
              </h3>
              <div className="flex flex-wrap gap-3">
                {specialties.map((specialty, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-900 border border-gray-700 hover:border-[#A2CD04] text-gray-300 hover:text-[#A2CD04] px-4 py-2 rounded-lg font-medium transition-all duration-300 cursor-default"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            {/* Experience Highlight */}
            <div className="bg-gradient-to-r from-[#A2CD04]/20 via-[#A2CD04]/10 to-transparent rounded-2xl p-6 border-l-4 border-[#A2CD04]">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[#A2CD04] rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Total Experience</p>
                  <p className="text-3xl font-bold text-[#A2CD04]">{trainer.experience || "2+ Years"}</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            {/* <div className="flex flex-wrap gap-4 pt-4">
              <button className="flex-1 bg-[#A2CD04] hover:bg-[#8EBF03] text-black font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-[#A2CD04]/50 flex items-center justify-center gap-2 group">
                Book Session
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button className="bg-gray-800 hover:bg-gray-700 border-2 border-gray-700 hover:border-[#A2CD04] text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Message
              </button>
            </div> */}
          </div>
        </div>

        {/* Bottom Section - Testimonials Preview */}
        <div className="mt-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-8 border border-gray-800">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <div className="w-1 h-8 bg-[#A2CD04] rounded-full"></div>
            What Clients Say
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800 hover:border-[#A2CD04]/50 transition-all duration-300">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, idx) => (
                    <svg key={idx} className="w-5 h-5 text-[#A2CD04]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-300 text-sm italic mb-3">"Amazing trainer! Helped me achieve my goals."</p>
                <p className="text-gray-400 text-xs font-semibold">- Client {i}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}