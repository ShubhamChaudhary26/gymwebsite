"use client";
import { Dumbbell, Heart, Flame, Zap } from "lucide-react";
import workoutImage from "@/assets/workout-programs.jpg";

const programs = [
  {
    icon: Dumbbell,
    title: "Strength Training",
    description:
      "Build lean muscle mass and increase strength with our progressive overload programs.",
    features: [
      "Custom weight programs",
      "Form correction",
      "Progress tracking",
      "Advanced techniques",
    ],
    color: "from-primary to-primary/70",
  },
  {
    icon: Heart,
    title: "Cardio Conditioning",
    description:
      "Improve cardiovascular health and burn fat with high-intensity interval training.",
    features: [
      "HIIT workouts",
      "Endurance building",
      "Fat burning focus",
      "Heart rate zones",
    ],
    color: "from-red-500 to-red-600",
  },
  {
    icon: Flame,
    title: "Fat Loss Program",
    description:
      "Comprehensive fat loss approach combining training, nutrition, and lifestyle changes.",
    features: [
      "Metabolism boosting",
      "Nutrition coaching",
      "Body composition",
      "Sustainable habits",
    ],
    color: "from-orange-500 to-orange-600",
  },
  // {
  //   icon: Zap,
  //   title: "Athletic Performance",
  //   description: "Elite training for athletes and those seeking peak physical performance.",
  //   features: ["Sport-specific training", "Power development", "Agility & speed", "Injury prevention"],
  //   color: "from-blue-500 to-blue-600"
  // }
];

const ProgramsSection = () => {
  return (
    <section className="py-20 bg-background md:mt-10 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Train Smarter,{" "}
            <span className="text-default">Unleash Your Potential</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose from our scientifically-designed programs, each crafted to
            deliver maximum results in minimum time.
          </p>
        </div>

        {/* Featured Image */}
        <div className="mb-16 relative">
          <img
            src={workoutImage.src}
            alt="Professional workout programs"
            className="w-full h-96 object-cover rounded-2xl opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent rounded-2xl"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {programs.map((program, index) => (
            <div
              key={index}
              className="section-card p-6 items-center rounded-xl card-hover group relative overflow-hidden h-full"
            >
              {/* Background Gradient */}
              <div
                className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${program.color} opacity-10 rounded-full -mr-10 -mt-10 group-hover:scale-125 transition-transform duration-500`}
              ></div>

              <div className="relative z-10 flex flex-col h-full">
                {/* Icon */}
                <div className="w-14 h-14 rounded-lg bg-default/10 flex items-center justify-center mb-4 group-hover:bg-default/20 transition-colors">
                  <program.icon className="w-7 h-7 text-primary" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold mb-2 group-hover:text-default transition-colors">
                  {program.title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  {program.description}
                </p>

                {/* Features */}
                <ul className="space-y-1 mb-4 text-sm flex-1">
                  {program.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <div className="w-2 h-2 bg-default rounded-full mr-2"></div>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Button */}
                <button className="inline-flex hover:bg-default border-default items-center justify-center border-2 px-4 py-3 rounded-lg font-bold transition-all duration-300 text-sm  self-start">
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProgramsSection;
