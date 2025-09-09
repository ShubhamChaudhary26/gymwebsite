"use client";
import { Dumbbell, Heart, Apple, Users } from "lucide-react";

const services = [
  {
    title: "Personal Training",
    description:
      "Get one-on-one attention with customized workouts designed for your body type and goals.",
    icon: Dumbbell,
    color: "from-pink-500 to-rose-500",
  },
  {
    title: "Group Classes",
    description:
      "Join dynamic group sessions that keep you motivated and build a strong fitness community.",
    icon: Users,
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Yoga & Wellness",
    description:
      "Achieve mental peace and flexibility with yoga classes led by certified instructors.",
    icon: Heart,
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "Nutrition Plans",
    description:
      "Fuel your body right with expert-designed meal plans tailored for your fitness goals.",
    icon: Apple,
    color: "from-yellow-500 to-orange-500",
  },
];

export default function ServicesPage() {
  return (
    <section className="relative min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white">
      {/* Background Glow */}
      <div className="absolute w-96 h-96 bg-primary/20 blur-3xl rounded-full -top-20 -left-20"></div>
      <div className="absolute w-80 h-80 bg-primary/10 blur-3xl rounded-full bottom-0 right-0"></div>

      {/* Hero Section */}
      <div className="relative z-10 text-center py-20">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Our <span className="text-primary">Services</span>
        </h1>
        <p className="text-lg text-white/70 max-w-2xl mx-auto">
          Explore our range of fitness programs designed to help you become the
          best version of yourself. Whether you're a beginner or a pro, we have
          something for everyone.
        </p>
      </div>

      {/* Services Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 pb-20">
        {services.map((service, index) => (
          <div
            key={index}
            className="group relative bg-white/10 border border-white/20 backdrop-blur-xl rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition-all duration-300 p-8 flex flex-col items-center text-center"
          >
            {/* Icon */}
            <div
              className={`w-20 h-20 rounded-full bg-gradient-to-tr ${service.color} flex items-center justify-center mb-6 shadow-lg`}
            >
              <service.icon className="w-10 h-10 text-white" />
            </div>

            {/* Service Info */}
            <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
            <p className="text-white/70">{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
