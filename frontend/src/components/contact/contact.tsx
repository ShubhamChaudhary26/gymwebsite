"use client";
import React, { useEffect, useRef, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { Globe } from "./map";

export default function Contact() {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementsRef = useRef<Set<Element>>(new Set());
  
  // Form state
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
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // WhatsApp message format
    const message = `*New Contact Form Submission*%0A%0A` +
      `*Name:* ${formData.firstname} ${formData.lastname}%0A` +
      `*Email:* ${formData.email}%0A` +
      `*Message:* ${formData.message}`;
    
    // Your WhatsApp number (with country code, without +)
    const whatsappNumber = "917777909218";
    
    // Open WhatsApp with pre-filled message
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${message}`;
    window.open(whatsappURL, '_blank');
    
    // Reset form
    setFormData({
      firstname: "",
      lastname: "",
      email: "",
      message: ""
    });
  };

  return (
    <>
      <div className="relative bg-black overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 -left-40 w-96 h-96 bg-[#A2CD04] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"></div>
          <div className="absolute bottom-20 -right-40 w-96 h-96 bg-[#A2CD04] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float-delayed"></div>
        </div>

        {/* Header Section */}
        <div className="scroll-animate opacity-0 translate-y-8 text-center py-2 px-4 relative z-10">
          <div className="inline-block mb-6">
            <span className="bg-[#A2CD04]/20 text-[#A2CD04] px-6 py-2 rounded-full text-sm font-bold tracking-wider uppercase border border-[#A2CD04]/30">
              Get In Touch
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Contact <span className="text-[#A2CD04]">Us</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
            Got questions or need support? We're here to help! Reach out to us
            through any of the channels below and our team will respond as soon as
            possible.
          </p>
        </div>

        {/* Form and Globe Section */}
        <div className="flex min-h-screen gap-5 lg:gap-16 items-center justify-center px-10 sm:px-6 lg:px-8 pb-16 relative z-10 flex-col lg:flex-row">
          {/* Left Form */}
          <div className="scroll-animate opacity-0 slide-left shadow-2xl shadow-[#A2CD04]/10 w-full max-w-lg rounded-2xl bg-gradient-to-br from-gray-950 via-black to-gray-950 border-2 border-gray-700 hover:border-[#A2CD04]/50 transition-all duration-500 px-8 py-5">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Welcome to <span className="text-[#A2CD04]">Veltrix</span>
            </h2>

            <p className="mt-4 text-sm md:text-base text-gray-400">
              Have questions or need help? <br />
              Let&apos;s connect through our Contact Us form.
            </p>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
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
                className="group relative mt-6 block h-12 w-full rounded-lg bg-[#A2CD04] hover:bg-[#8EBF03] font-bold text-black shadow-lg hover:shadow-xl hover:shadow-[#A2CD04]/50 transition-all duration-300 flex items-center justify-center gap-2"
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
          <div className="scroll-animate opacity-0 slide-right hidden lg:flex w-full justify-center px-4 overflow-visible">
            <div className="w-full h-[400px] md:h-[500px] lg:h-[600px] flex items-center justify-center overflow-visible">
              <Globe />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-from-left {
          from {
            opacity: 0;
            transform: translateX(-60px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        @keyframes slide-from-right {
          from {
            opacity: 0;
            transform: translateX(60px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        @keyframes slide-from-bottom {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translate(0, 0);
          }
          33% {
            transform: translate(20px, -20px);
          }
          66% {
            transform: translate(-20px, 15px);
          }
        }

        .scroll-animate {
          transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .scroll-animate.slide-left.animate-in {
          animation: slide-from-left 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .scroll-animate.slide-right.animate-in {
          animation: slide-from-right 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .scroll-animate:not([class*="slide-"]).animate-in {
          animation: slide-from-bottom 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float 8s ease-in-out infinite;
          animation-delay: 4s;
        }

        @media (prefers-reduced-motion: reduce) {
          .scroll-animate,
          .animate-float,
          .animate-float-delayed {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </>
  );
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-1", className)}>
      {children}
    </div>
  );
};