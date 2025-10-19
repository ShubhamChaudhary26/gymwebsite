"use client";
import React, { useEffect, useRef, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { Globe } from "./map";

export default function Contact() {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementsRef = useRef<Set<Element>>(new Set());
  
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    message: ""
  });

  useEffect(() => {
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
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
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
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const message = `*New Contact Form Submission*%0A%0A` +
      `*Name:* ${formData.firstname} ${formData.lastname}%0A` +
      `*Email:* ${formData.email}%0A` +
      `*Message:* ${formData.message}`;
    const whatsappNumber = "917777909218";
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
    setFormData({ firstname: "", lastname: "", email: "", message: "" });
  };

  return (
    <>
      <div className="relative mt-20 bg-black overflow-hidden">

        {/* Header Section */}
        <div className="scroll-animate opacity-0 translate-y-8 text-center  px-6 relative z-10">
        
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Contact <span className="text-[#A2CD04]">Us</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
            Got questions about training, memberships, or schedules? Reach out and we’ll respond ASAP!
          </p>
        </div>

        {/* Form & Globe Section */}
       <div className="flex flex-col lg:flex-row items-center justify-center gap-10 px-6 sm:px-10 lg:px-20 pb-16 mt-0 pt-0 relative z-10 w-full max-w-7xl mx-auto">
          {/* Left Form */}
         <div className="scroll-animate opacity-0 slide-left flex-1 w-full max-w-lg rounded-3xl bg-gradient-to-br from-gray-950 via-black to-gray-950 border-2 border-gray-700 hover:border-[#A2CD04]/50 transition-all duration-500 px-10 py-10 shadow-2xl shadow-[#A2CD04]/20">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Welcome to <span className="text-[#A2CD04]">Veltrix Gym</span>
            </h2>
            <p className="mt-2 text-gray-400 text-base md:text-lg leading-relaxed">
              Have questions about training, memberships, or schedules? Fill the form and we’ll reach you right away!
            </p>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-4 md:flex-row">
                <LabelInputContainer>
                  <Label htmlFor="firstname">First name</Label>
                  <Input
                    id="firstname"
                    placeholder="Shubham"
                    type="text"
                    value={formData.firstname}
                    onChange={handleInputChange}
                    required
                  />
                </LabelInputContainer>
                <LabelInputContainer>
                  <Label htmlFor="lastname">Last name</Label>
                  <Input
                    id="lastname"
                    placeholder="Chaudhary"
                    type="text"
                    value={formData.lastname}
                    onChange={handleInputChange}
                    required
                  />
                </LabelInputContainer>
              </div>

              <LabelInputContainer>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  placeholder="shubham@gmail.com"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="message">Message</Label>
                <Input
                  id="message"
                  placeholder="Type your message here..."
                  type="text"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                />
              </LabelInputContainer>

              <button
                className="group relative mt-4 block h-12 w-full rounded-lg bg-[#A2CD04] hover:bg-[#8EBF03] font-bold text-black shadow-lg hover:shadow-xl hover:shadow-[#A2CD04]/50 transition-all duration-300 flex items-center justify-center gap-2"
                type="submit"
              >
                <span>Send via WhatsApp</span>
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>
            </form>
          </div>

          {/* Right Globe */}
          <div className="scroll-animate opacity-0 slide-right flex-1 w-full flex justify-center items-center overflow-visible">
             <div className="w-full h-[550px] md:h-[650px] lg:h-[750px] flex items-center justify-center overflow-visible">
              <Globe />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-from-left {
          from { opacity: 0; transform: translateX(-60px) scale(0.95); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes slide-from-right {
          from { opacity: 0; transform: translateX(60px) scale(0.95); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes slide-from-bottom {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translate(0,0); }
          33% { transform: translate(20px,-20px); }
          66% { transform: translate(-20px,15px); }
        }
        .scroll-animate { transition: all 0.8s cubic-bezier(0.34,1.56,0.64,1); }
        .scroll-animate.slide-left.animate-in { animation: slide-from-left 0.8s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .scroll-animate.slide-right.animate-in { animation: slide-from-right 0.8s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .scroll-animate:not([class*="slide-"]).animate-in { animation: slide-from-bottom 0.8s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .animate-float { animation: float 8s ease-in-out infinite; }
        .animate-float-delayed { animation: float 8s ease-in-out infinite; animation-delay: 4s; }
        @media (prefers-reduced-motion: reduce) {
          .scroll-animate, .animate-float, .animate-float-delayed { animation: none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>
    </>
  );
}

const LabelInputContainer = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("flex w-full flex-col space-y-1", className)}>
    {children}
  </div>
);
