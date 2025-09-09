"use client";

import Image from "next/image";
import { ArrowRight, Play } from "lucide-react";
import heroImage from "@/assets/hero-fitness.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={heroImage}
          alt="Powerful fitness transformation"
          fill
          priority
          className="object-cover opacity-30"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, hsl(var(--background)), hsla(var(--background),0.8), transparent)",
          }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center lg:text-left">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
          <div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              Sculpt Your <span className="text-neon">Body</span>, <br />
              Elevate Your <span className="text-neon">Spirit</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
              Transform your life with our elite fitness programs. Join thousands who've
              achieved their ultimate physique and unlocked their true potential.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button className="btn-hero group">
                Start Your Journey
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="btn-secondary group">
                <Play className="mr-2 w-5 h-5" />
                Watch Story
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
