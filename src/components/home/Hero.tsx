"use client";

import Image from "next/image";
import banner from "../../assets/images/banner.png";

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center bg-black text-white overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={banner}
          alt="Hero Banner"
          fill
          priority
          className="object-cover opacity-70"
        />
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center px-4">
        {/* Heading */}
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
          Sculpt <span className="text-primary">Your Body</span>, <br />
          Elevate <span className="text-primary">Your Spirit</span>
        </h1>

        {/* Stats */}
        <div className="flex items-center justify-center gap-6 mt-6">
          <div className="bg-gray-900/70 px-4 py-2 rounded-lg">
            <p className="text-primary font-bold text-lg">1.5</p>
            <span className="text-sm text-gray-300">Hours</span>
          </div>
          <div className="bg-gray-900/70 px-4 py-2 rounded-lg">
            <p className="text-primary font-bold text-lg">550</p>
            <span className="text-sm text-gray-300">Kcal</span>
          </div>
          <div className="bg-gray-900/70 px-4 py-2 rounded-lg">
            <p className="text-primary font-bold text-lg">20</p>
            <span className="text-sm text-gray-300">Poses</span>
          </div>
          <div className="bg-gray-900/70 px-4 py-2 rounded-lg">
            <p className="text-primary font-bold text-lg">5</p>
            <span className="text-sm text-gray-300">Sets</span>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10">
          <button className="px-8 py-3 rounded-full bg-primary text-black font-semibold hover:opacity-80 transition">
            Let’s Start 
          </button>
        </div>

        {/* Happy Spirits */}
        <div className="mt-6 flex justify-center items-center gap-3">
          <div className="flex -space-x-3">
            <Image
              src="/users/u1.jpg"
              alt="User 1"
              width={40}
              height={40}
              className="rounded-full border-2 border-black"
            />
            <Image
              src="/users/u2.jpg"
              alt="User 2"
              width={40}
              height={40}
              className="rounded-full border-2 border-black"
            />
            <Image
              src="/users/u3.jpg"
              alt="User 3"
              width={40}
              height={40}
              className="rounded-full border-2 border-black"
            />
          </div>
          <p className="text-gray-300 text-sm">
            <span className="font-bold text-white">12k+</span> Happy Spirits
          </p>
        </div>
      </div>

      {/* Prev / Next Arrows */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
        <span className="text-sm tracking-widest rotate-[-90deg] block">PREV</span>
      </div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300">
        <span className="text-sm tracking-widest rotate-90 block">NEXT</span>
      </div>
    </section>
  );
};

export default Hero;
