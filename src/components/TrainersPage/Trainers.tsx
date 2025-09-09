"use client";
import Image from "next/image";
import { Star } from "lucide-react";

const trainers = [
  {
    name: "Alex Carter",
    specialty: "Strength & Conditioning",
    experience: "8 Years Experience",
    image:
      "https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=800",
    rating: 5,
  },
  {
    name: "Sophia Johnson",
    specialty: "Yoga & Flexibility",
    experience: "6 Years Experience",
    image:
      "https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    rating: 5,
  },
  {
    name: "Ethan Smith",
    specialty: "HIIT & Weight Loss",
    experience: "5 Years Experience",
    image:
      "https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    rating: 4,
  },
  {
    name: "Olivia Brown",
    specialty: "Pilates & Core Training",
    experience: "7 Years Experience",
    image:
      "https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    rating: 5,
  },
];

export default function TrainersPage() {
  return (
    <section className="relative min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white">
      {/* Background Glow */}
      <div className="absolute w-96 h-96 bg-primary/20 blur-3xl rounded-full -top-20 -left-20"></div>
      <div className="absolute w-80 h-80 bg-primary/10 blur-3xl rounded-full bottom-0 right-0"></div>

      {/* Hero Section */}
      <div className="relative z-10 text-center py-20">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Meet Our <span className="text-primary">Elite Trainers</span>
        </h1>
        <p className="text-lg text-white/70 max-w-2xl mx-auto">
          Our certified trainers bring years of expertise to help you transform
          your body and mind. Whether it's strength, flexibility, or endurance,
          we’ve got the perfect coach for you.
        </p>
      </div>

      {/* Trainers Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 pb-20">
        {trainers.map((trainer, index) => (
          <div
            key={index}
            className="group bg-white/10 border border-white/20 backdrop-blur-xl rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition-all duration-300"
          >
            {/* Trainer Image */}
            <div className="relative w-full h-64 overflow-hidden">
              <Image
                src={trainer.image}
                alt={trainer.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                priority
              />
            </div>

            {/* Trainer Info */}
            <div className="p-6 text-center">
              <h3 className="text-xl font-bold mb-2">{trainer.name}</h3>
              <p className="text-primary font-semibold">{trainer.specialty}</p>
              <p className="text-sm text-white/60 mt-2">{trainer.experience}</p>

              {/* Rating */}
              <div className="flex justify-center mt-3">
                {[...Array(trainer.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400" />
                ))}
              </div>

              {/* CTA Button */}
              <button className="mt-5 px-6 py-2 bg-primary btn-hero font-semibold rounded-full shadow-md hover:shadow-primary/50 transition-all">
                Book Session
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
