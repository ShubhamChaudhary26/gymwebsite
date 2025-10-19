// components/about/AboutContent.tsx
"use client";
import { Target, Eye } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

interface Stat {
  label: string;
  value: string;
  icon: string;
}

interface AboutContentProps {
  stats: Stat[];
  mission: string;
  vision: string;
}

// Counter Animation Hook
const useCountAnimation = (end: number, duration: number = 2) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);

      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, isVisible]);

  return { count, setIsVisible };
};

const AboutContent = ({ stats, mission, vision }: AboutContentProps) => {
  const statsRef = useRef(null);
  const missionRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true });
  const missionInView = useInView(missionRef, { once: true });

  return (
    <>
      {/* Stats Section */}
      {stats && stats.length > 0 && (
        <section
          ref={statsRef}
          className="py-12 sm:py-16 md:py-20 border-t border-b border-gray-800"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-12">
              {stats.map((stat, index) => (
                <StatCard
                  key={index}
                  stat={stat}
                  index={index}
                  isInView={statsInView}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mission & Vision */}
      <section ref={missionRef} className="py-12 sm:py-16 md:py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={missionInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="group"
            >
              <div className="flex items-center gap-3 mb-6">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-12 h-12 rounded-xl bg-[#A2CD04]/10 flex items-center justify-center group-hover:bg-[#A2CD04]/20 transition"
                >
                  <Target className="w-6 h-6 text-[#A2CD04]" />
                </motion.div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                  Our Mission
                </h2>
              </div>
              <p className="text-gray-400 leading-relaxed text-sm sm:text-base md:text-lg">
                {mission}
              </p>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={missionInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="group"
            >
              <div className="flex items-center gap-3 mb-6">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  className="w-12 h-12 rounded-xl bg-[#A2CD04]/10 flex items-center justify-center group-hover:bg-[#A2CD04]/20 transition"
                >
                  <Eye className="w-6 h-6 text-[#A2CD04]" />
                </motion.div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                  Our Vision
                </h2>
              </div>
              <p className="text-gray-400 leading-relaxed text-sm sm:text-base md:text-lg">
                {vision}
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

// Stat Card Component with Counter
const StatCard = ({
  stat,
  index,
  isInView,
}: {
  stat: Stat;
  index: number;
  isInView: boolean;
}) => {
  const numericValue = parseInt(stat.value.replace(/\D/g, ""));
  const suffix = stat.value.replace(/[0-9]/g, "");
  const { count, setIsVisible } = useCountAnimation(numericValue);

  useEffect(() => {
    if (isInView) {
      setIsVisible(true);
    }
  }, [isInView, setIsVisible]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="text-center"
    >
      <motion.div
        animate={isInView ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#A2CD04] mb-2"
      >
        {count}
        {suffix}
      </motion.div>
      <div className="text-xs sm:text-sm md:text-base text-gray-400">
        {stat.label}
      </div>
    </motion.div>
  );
};

export default AboutContent;