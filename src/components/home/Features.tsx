"use client";

import { Target, Users, Award, Clock, Zap, Shield } from "lucide-react";

const features = [
  { icon: Target, title: "Personalized Training", description: "Custom workout plans tailored to your fitness level, goals, and lifestyle for maximum results." },
  { icon: Users, title: "Expert Coaches", description: "Train with certified professionals who've transformed thousands of lives worldwide." },
  { icon: Award, title: "Proven Results", description: "95% success rate with our scientifically-backed training methodology and nutrition guidance." },
  { icon: Clock, title: "Flexible Scheduling", description: "Train on your schedule with 24/7 gym access and online coaching support." },
  { icon: Zap, title: "Cutting-Edge Equipment", description: "State-of-the-art facilities with the latest fitness technology and equipment." },
  { icon: Shield, title: "Safe Environment", description: "Clean, secure facilities with strict safety protocols and injury prevention focus." },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 section-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Discover What Sets Us <span className="text-neon">Apart</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We don't just provide gym access - we deliver a complete transformation experience
            that changes lives forever.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="section-card p-8 rounded-xl card-hover group">
              <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4 group-hover:text-neon transition-colors">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
