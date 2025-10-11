"use client";

import { useEffect, useState, useRef } from "react";
import { Users, Trophy, Calendar, Star } from "lucide-react";

const stats = [
  { icon: Users, value: 1000, suffix: "+", label: "Active Members", description: "Transforming lives daily" },
  { icon: Trophy, value: 98, suffix: "%", label: "Success Rate", description: "Proven results" },
  { icon: Calendar, value: 5, suffix: "+", label: "Years Experience", description: "Industry expertise" },
  { icon: Star, value: 4.9, suffix: "/5", label: "Client Rating", description: "5-star reviews" },
];

const CounterAnimation = ({ target, suffix, inView }: { target: number; suffix: string; inView: boolean }) => {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!inView || hasAnimated.current) return;

    hasAnimated.current = true;
    let start = 0;
    const duration = 2500;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Smooth easing function
      const eased = 1 - Math.pow(1 - progress, 3);
      
      if (suffix === "/5") {
        setCount(parseFloat((target * eased).toFixed(1)));
      } else {
        setCount(Math.round(target * eased));
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [target, inView, suffix]);

  return (
    <span className="text-4xl md:text-5xl lg:text-6xl font-bold text-white block">
      {count.toLocaleString()}{suffix}
    </span>
  );
};

const StatsSection = () => {
  const [inView, setInView] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !inView) {
            setInView(true);
            entry.target.classList.add("animate-in");
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    const section = sectionRef.current;
    if (section) {
      observerRef.current.observe(section);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [inView]);

  return (
    <section 
      ref={sectionRef}
      className="py-5 relative overflow-hidden bg-gradient-to-b from-black via-gray-900 to-black"
    >
      {/* Background Glow - Optimized */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-[#A2CD04] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"></div>
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-[#A2CD04] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float-delayed"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Title */}
        <div className={`text-center mb-16 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Numbers That <span className="text-[#A2CD04]">Speak Volumes</span>
          </h2>
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto">
            Our track record speaks for itself. Join a community that delivers real results.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const animationClass = index % 2 === 0 ? 'slide-left' : 'slide-right';
            
            return (
              <div 
                key={index} 
                className={`text-center group cursor-pointer transition-all duration-700 ${
                  inView ? 'opacity-100 animate-in' : 'opacity-0'
                } ${animationClass}`}
                style={{ 
                  transitionDelay: `${index * 150}ms`,
                  animationDelay: `${index * 150}ms`
                }}
              >
                <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-800 p-8 rounded-2xl hover:border-[#A2CD04] relative overflow-hidden transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-[#A2CD04]/30">
                  
                  {/* Animated Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#A2CD04]/0 via-[#A2CD04]/0 to-[#A2CD04]/0 group-hover:from-[#A2CD04]/10 group-hover:via-[#A2CD04]/5 group-hover:to-transparent transition-all duration-700"></div>
                  
                  {/* Shimmer Effect on Hover */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                  {/* Corner Accents */}
                  <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[#A2CD04]/0 group-hover:border-[#A2CD04] rounded-tl-2xl transition-all duration-500"></div>
                  <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[#A2CD04]/0 group-hover:border-[#A2CD04] rounded-br-2xl transition-all duration-500"></div>

                  <div className="relative z-10">
                    {/* Icon with Pulse Effect */}
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#A2CD04]/10 flex items-center justify-center transition-all duration-500 group-hover:bg-[#A2CD04] group-hover:scale-110 group-hover:rotate-12 relative">
                      {/* Pulse Ring */}
                      <div className="absolute inset-0 rounded-full bg-[#A2CD04] opacity-0 group-hover:opacity-20 group-hover:scale-150 transition-all duration-700"></div>
                      
                      <stat.icon className="w-8 h-8 text-[#A2CD04] group-hover:text-black transition-all duration-500 group-hover:scale-125 relative z-10" />
                    </div>

                    {/* Counter with Gradient */}
                    <div className="mb-4">
                      <CounterAnimation target={stat.value} suffix={stat.suffix} inView={inView} />
                    </div>
                    
                    {/* Label */}
                    <h3 className="text-lg md:text-xl font-bold mb-2 text-white group-hover:text-[#A2CD04] transition-colors duration-300">
                      {stat.label}
                    </h3>

                    {/* Animated Line */}
                    <div className="w-12 h-1 bg-[#A2CD04]/30 mx-auto mb-3 rounded-full group-hover:w-20 group-hover:bg-[#A2CD04] transition-all duration-500"></div>

                    {/* Description */}
                    <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">
                      {stat.description}
                    </p>
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
            transform: translateX(-50px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        @keyframes slide-from-right {
          from {
            opacity: 0;
            transform: translateX(50px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
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

        .slide-left.animate-in {
          animation: slide-from-left 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .slide-right.animate-in {
          animation: slide-from-right 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float 8s ease-in-out infinite;
          animation-delay: 4s;
        }

        @media (prefers-reduced-motion: reduce) {
          .slide-left.animate-in,
          .slide-right.animate-in,
          .animate-float,
          .animate-float-delayed {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default StatsSection;