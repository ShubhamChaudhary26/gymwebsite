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
    const duration = 2000;
    const steps = 60;
    const stepValue = target / steps;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      setCount(Math.min(Math.floor(stepValue * currentStep), target));
      if (currentStep >= steps) clearInterval(timer);
    }, stepDuration);

    return () => clearInterval(timer);
  }, [target]);

  return <span className="text-4xl md:text-5xl font-bold text-neon">{count}{suffix}</span>;
};

const StatsSection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(120_100%_50%)_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,hsl(120_100%_50%)_0%,transparent_50%)]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Numbers That <span className="text-neon">Speak Volumes</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our track record speaks for itself. Join a community that delivers real results.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group cursor-pointer">
              <div className="section-card p-8 rounded-xl card-hover mb-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                    <stat.icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <CounterAnimation target={stat.value} suffix={stat.suffix} />
                  <h3 className="text-xl font-bold mt-4 mb-2 group-hover:text-neon transition-colors">{stat.label}</h3>
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
