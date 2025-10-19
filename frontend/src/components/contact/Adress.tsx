"use client";
import React, { useEffect, useRef } from "react";
import { WobbleCard } from "../ui/wobble-card";

export function Address() {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementsRef = useRef<Set<Element>>(new Set());

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

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto w-full py-1 px-6">

        {/* Address */}
        <div className="scroll-animate opacity-0 slide-up col-span-1 lg:col-span-2" style={{ animationDelay: '0.1s' }}>
          <WobbleCard containerClassName="col-span-1 lg:col-span-2 bg-black min-h-[200px] border border-default/40 rounded-2xl relative overflow-hidden">
            <div className="max-w-md z-10 relative">
              <h2 className="text-left text-2xl md:text-3xl font-bold text-default">Address</h2>
              <p className="mt-3 text-left text-neutral-300">
                123 Fitness Street, Mumbai, India - 400001
              </p>
              <p className="mt-2 text-left text-neutral-400 text-sm">
                Located in the heart of Mumbai, our fitness club is easily accessible and surrounded by cafes, parks, and metro stations. Perfect for morning and evening workouts.
              </p>
              <p className="mt-2 text-left text-neutral-400 text-sm">
                Contact us anytime for guidance, tours, or membership queries. Our front desk staff is always ready to assist you.
              </p>
            </div>
          </WobbleCard>
        </div>

        {/* Email */}
        <div className="scroll-animate opacity-0 slide-up col-span-1" style={{ animationDelay: '0.2s' }}>
          <WobbleCard containerClassName="col-span-1 bg-black min-h-[200px] border border-default/40 rounded-2xl relative overflow-hidden">
            <h2 className="text-left text-2xl md:text-3xl font-bold text-default z-10 relative">Email</h2>
            <p className="mt-3 text-neutral-300 z-10 relative">
              support@gymclub.com <br /> info@gymclub.com
            </p>
            <p className="mt-2 text-neutral-400 text-sm z-10 relative">
              Our team responds quickly. Expect a reply within 24 hours for all membership and support inquiries.
            </p>
          </WobbleCard>
        </div>

        {/* Phone */}
        <div className="scroll-animate opacity-0 slide-up col-span-1" style={{ animationDelay: '0.3s' }}>
          <WobbleCard containerClassName="col-span-1 bg-black min-h-[200px] border border-default/40 rounded-2xl relative overflow-hidden">
            <h2 className="text-left text-2xl md:text-3xl font-bold text-default z-10 relative">Phone</h2>
            <p className="mt-3 text-neutral-300 z-10 relative">
              Owner No: +91 98765 43210 <br /> Receptionist No: +91 91234 56789
            </p>
            <p className="mt-2 text-neutral-400 text-sm z-10 relative">
              Available from 8 AM to 8 PM. Call us to schedule personal training sessions or inquire about group classes.
            </p>
          </WobbleCard>
        </div>

        {/* Working Hours */}
        <div className="scroll-animate opacity-0 slide-up col-span-1 lg:col-span-2" style={{ animationDelay: '0.4s' }}>
          <WobbleCard containerClassName="col-span-1 lg:col-span-2 bg-black min-h-[200px] border border-default/40 rounded-2xl relative overflow-hidden">
            <div className="max-w-md z-10 relative">
              <h2 className="text-left text-2xl md:text-3xl font-bold text-default">Working Hours</h2>
              <p className="mt-3 text-neutral-300">
                Mon-Sat: 6:00 AM – 10:00 PM <br />
                Sun: 7:00 AM – 5:00 PM
              </p>
              <p className="mt-2 text-left text-neutral-400 text-sm">
                Early morning and late evening slots available. Online booking is recommended for peak hours. Walk-ins are welcome.
              </p>
              <p className="mt-2 text-left text-neutral-400 text-sm">
                Holidays and special events timings may vary. Please check our website or contact us directly for updates.
              </p>
            </div>
          </WobbleCard>
        </div>

      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .scroll-animate {
          transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .scroll-animate.slide-up.animate-in {
          animation: slide-up 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          .scroll-animate {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </>
  );
}