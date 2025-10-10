"use client";

import { useEffect, useState } from "react";
import { Users, Trophy, Calendar, Star } from "lucide-react";

const stats = [
  { icon: Users, value: 50000, suffix: "+", label: "Active Members", description: "Transforming lives daily" },
  { icon: Trophy, value: 98, suffix: "%", label: "Success Rate", description: "Proven results" },
  { icon: Calendar, value: 15, suffix: "+", label: "Years Experience", description: "Industry expertise" },
  { icon: Star, value: 4.9, suffix: "/5", label: "Client Rating", description: "5-star reviews" },
];

const CounterAnimation = ({ target, suffix }: { target: number; suffix: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000; // ms
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress; // easeInOut
      setCount(Math.round(target * eased));

      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [target]);

  return <span className="text-4xl md:text-5xl font-bold text-white">{count}{suffix}</span>;
};

const StatsSection = () => {
  return (
    <section className=" relative overflow-hidden">
      {/* Background Glow */}
      

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="textHeadingmobile md:textHeadinglaptop  ">
            Numbers That <br className="md:hidden" /> <span className="text-default ">Speak Volumes</span>
          </h2>
          <p className="textafterHeading max-w-3xl mx-auto">
            Our track record speaks for itself. Join a community that delivers real results.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 ">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group cursor-pointer">
              <div className=" bg-graydefault section-card p-8 rounded-xl card-hover mb-4 relative overflow-hidden transition-transform duration-500 group-hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-default/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-default/10 flex items-center justify-center transition-all duration-300 bg-default group-hover:scale-110">
                    <stat.icon className="w-8 h-8 text-default transition-transform duration-300 group-hover:scale-125" />
                  </div>
                  <CounterAnimation target={stat.value} suffix={stat.suffix} />
                  <h3 className="text-xl font-bold mt-4 mb-2 transition-colors text-white">{stat.label}</h3>
                  <p className="text-muted-foreground text-sm">{stat.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
