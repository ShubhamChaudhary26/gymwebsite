"use client";
import React from "react";
import Lightning from "./Lightning";
import Image from "next/image";
import gymPerson from "@/assets/banner.png";

const HomePage: React.FC = () => {
  return (
    <>
      {/* Background lightning */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <Lightning hue={62} xOffset={0} speed={0.9} intensity={1} size={0.8} />
      </div>
      <div className="relative w-full h-screen text-white overflow-hidden">
        {/* Center wrapper */}
        <div className="relative flex flex-col items-center justify-center h-full px-4">

          {/* Heading - Mobile pe upar, Desktop pe same */}
          <h1 className="absolute top-[20%] md:top-[15%] text-4xl md:text-[75px] leading-tight sm:leadingn-[50px] md:leading-[80px] font-extrabold opacity-80 z-100 md:z-0 text-center px-2 md:px-4">
            Sculpt <span className="text-default">Your</span> Body,
            <br />
            Elevate <span className="text-default">Your</span> Spirit
          </h1>

          {/* Gym Image - Mobile pe responsive */}
          <div className="absolute top-[25%] sm:top-[30%] md:top-40 w-[280px] sm:w-[350px] md:w-auto">
            <Image
              src={gymPerson}
              alt="Gym Person"
              className="object-contain shadow-2xl"
              priority
            />
          </div>
          {/* Desktop Floating Cards - Hidden on mobile */}
          <div className="absolute inset-0 hidden md:flex items-center justify-center pointer-events-none text-center">
            <div className="absolute top-[46%] left-[33%] text-default font-bold backdrop-blur-md rounded-xl px-4 py-1 shadow-lg transform -rotate-[25deg] border-2 border-default animate-floatNeg">
              <Image src="/watch.png" alt="Hours" width={50} height={40} />
              <p>Hours</p>
              <p>1.5</p>
            </div>

            <div className="absolute top-[45%] left-[61%] text-default border-2 border-default font-bold backdrop-blur-md rounded-xl px-4 py-1 shadow-lg transform rotate-[25deg] animate-floatPos">
              <Image
                src="/run.png"
                alt="Poses"
                width={30}
                height={20}
                className="ml-3"
              />
              <p>Poses</p>
              <p>20</p>
            </div>

            <div className="absolute bottom-[10%] left-[32%] text-default border-2 border-default font-bold backdrop-blur-md rounded-xl px-5 py-3 shadow-lg transform -rotate-[25deg] animate-floatNeg">
              <Image
                src="/Cal.png"
                alt="Kcal"
                width={30}
                height={30}
                className="ml-1"
              />
              <p>Kcal</p>
              <p>550</p>
            </div>

            <div className="absolute bottom-[10%] left-[63%] text-default border-2 border-default font-bold backdrop-blur-md rounded-xl px-4 py-5 shadow-lg transform rotate-[25deg] animate-floatPos">
              <Image
                src="/dumble.png"
                alt="Sets"
                width={40}
                height={30}
                className="ml-1"
              />
              <p>Sets</p>
              <p>5</p>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="absolute bottom-4 md:bottom-6 w-full flex justify-between items-end px-4 md:px-6 z-20">
            {/* Left Avatars + Text */}
            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Avatars */}
              <div className="flex -space-x-2 md:-space-x-3">
                {/* Avatar 1 */}
                <div className="w-8 h-8 md:w-12 md:h-12 rounded-full border-2 border-black overflow-hidden">
                  <Image
                    src="/gyml.webp"
                    alt="User1"
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                  />
                </div>

                {/* Avatar 2 → Hide on small mobile */}
                <div className="hidden sm:block w-8 h-8 md:w-12 md:h-12 rounded-full border-2 border-black overflow-hidden">
                  <Image
                    src="/gym2.webp"
                    alt="User2"
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                  />
                </div>

                {/* Avatar 3 → Hide on mobile */}
                <div className="hidden md:block w-8 h-8 md:w-12 md:h-12 rounded-full border-2 border-black overflow-hidden">
                  <Image
                    src="/gym3.webp"
                    alt="User3"
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>

              {/* Text */}
              <div className="flex flex-col">
                <p className="text-base md:text-2xl font-bold text-white">
                  12k<span className="text-default">+</span>
                </p>
                <p className="text-gray-300 text-[10px] md:text-sm">
                  Happy Spirits
                </p>
              </div>
            </div>

            {/* Button */}
            <button className="bg-default text-black font-bold text-sm md:text-base px-4 py-2 md:px-8 md:py-3 rounded-full hover:scale-105 transition">
              Let&apos;s Start &gt;&gt;&gt;
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;