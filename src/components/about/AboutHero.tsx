import { Shield, Award, Users, Target } from "lucide-react";

const values = [
  {
    icon: Shield,
    title: "Safety First",
    description: "Your wellbeing is our priority with certified trainers and medical oversight.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "Award-winning programs recognized by fitness industry professionals worldwide.",
  },
  {
    icon: Users,
    title: "Community",
    description: "Join a supportive community that celebrates every milestone together.",
  },
  {
    icon: Target,
    title: "Results-Driven",
    description: "Data-backed approach with measurable progress tracking and accountability.",
  },
];

const AboutSection = () => {
  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
          <div className="mb-12 lg:mb-0">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              Inspired to <span className="text-neon">Inspire Your Best Self</span>
            </h2>

            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p className="text-lg">
                For over 15 years, we've been the catalyst for incredible transformations.
                What started as a simple mission to help people get fit has evolved into
                a movement that changes lives.
              </p>

              <p>
                Our approach goes beyond traditional fitness. We believe in empowering
                individuals to discover their inner strength, build unshakeable confidence,
                and create lasting lifestyle changes that extend far beyond the gym walls.
              </p>

              <p>
                Every program is scientifically designed, every coach is expertly trained,
                and every member becomes part of a family that supports each other through
                every challenge and celebrates every victory.
              </p>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <button className="btn-hero">Discover Your Potential</button>
              <button className="btn-secondary">Meet Our Team</button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="section-card p-6 rounded-xl card-hover group"
                style={{
                  animation: `scale-in 0.5s ease-out ${index * 0.1 + 0.2}s both`,
                }}
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <value.icon className="w-6 h-6 text-primary" />
                </div>

                <h3 className="text-lg font-bold mb-3 group-hover:text-neon transition-colors">
                  {value.title}
                </h3>

                <p className="text-muted-foreground text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
