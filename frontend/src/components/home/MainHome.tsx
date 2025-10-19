"use client";
import React, { useEffect, useState } from "react";
import Hero from "@/components/home/Hero";
import StatsSection from "@/components/home/stats";
import PricingSection from "@/components/Pricing/Price";
import BlogSection from "@/components/Blog/BlogSection";
import FAQSection from "@/components/faq/Faq";
import LogoLoop from "@/components/home/LogoLoop";
import Contact from "@/components/contact/contact";
import { InfiniteMovingCardsDemo } from "./TestimonialsSection";
import ChromaGrid from "../TrainersPage/TrainersGrid";
import Products from "../Products/Product";
import AboutVideos from "../about/AboutVideo";
import apiService from "@/lib/api"; // same as About page

interface VideoItem {
  youtubeLink: string;
  topic: string;
  description: string;
  order: number;
}
const techLogos = [
  // Gym Nutrition / Fitness related with company logos
  {
    node: (
      <img
        src="https://imgs.search.brave.com/El-9hhilTBUa5su3OETu6f5iGfXs8LXDb0iOUd-fKx8/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzZhLzg3/L2IwLzZhODdiMDZl/ZTRmMmM5ZmY3Mzlm/MWE0ZWFhOTAxNzg1/LmpwZw"
        alt="MyProtein"
        className="w-12 h-12"
      />
    ),
    title: "MyProtein",
    href: "/products/myprotein",
  },
  {
    node: (
      <img
        src="https://imgs.search.brave.com/68BXBg_-OmFWW2aC2mWdorN360BT9FwvYV7Yk8h1GjM/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS12ZWN0/b3Ivc3BvcnQtbnV0/cml0aW9uLXByb3Rl/aW4tamFyLWZpdG5l/c3MtcHJvdGVpbi1k/dW1iYmVsbC1lbmVy/Z3ktZHJpbmtzLWJv/ZHlidWlsZGluZy1m/b29kLXN1cHBsZW1l/bnRfMTU5MDI1LTk0/NC5qcGc_c2VtdD1h/aXNfaHlicmlkJnc9/NzQwJnE9ODA"
        alt="Optimum Nutrition"
        className="w-12 h-12"
      />
    ),
    title: "Optimum Nutrition",
    href: "/products/optimum-nutrition",
  },
  {
    node: (
      <img
        src="https://imgs.search.brave.com/VJ4DugaO59JrywrWqdWq_MrRlqAEmgxKAsaLD6uBL74/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzBjLzlm/Lzc3LzBjOWY3Nzcw/OTMzOTA2MjM2MDVl/NWIwZTcwOTZhODY0/LmpwZw"
        alt="MuscleBlaze"
        className="w-12 h-12"
      />
    ),
    title: "MuscleBlaze",
    href: "/products/muscleblaze",
  },
];

const MainHome = () => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await apiService.getAboutData(); // same API call as About page
      if (response.success && response.data?.videos) {
        setVideos(response.data.videos);
      }
    } catch (err) {
      console.error("Error fetching videos:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-black text-white">
      <Hero />

      {/* logo loop */}
      <div style={{ height: "100px", position: "relative", overflow: "hidden" }}>
        <div className="mt-10">
          <LogoLoop
            logos={techLogos}
            speed={80}
            direction="left"
            logoHeight={50}
            gap={90}
            pauseOnHover
            scaleOnHover
            fadeOut
            fadeOutColor="#000000"
            ariaLabel="Technology partners"
          />
        </div>
      </div>

      <div className="relative my-10 h-auto md:h-auto sm:h-[2600px]">
        <ChromaGrid
          {...({
            radius: 300,
            damping: 0.45,
            fadeOut: 0.6,
            ease: "power3.out",
            limit: 3,
          } as any)}
        />
      </div>

    <div className="py-0 ">
        <StatsSection />
      </div>

      {/* ✅ AboutVideos component dynamically loaded */}
     <div className="py-0 ">
        {loading ? (
          <div className="flex justify-center py-10 text-gray-400">Loading videos...</div>
        ) : (
          <AboutVideos videos={videos} />
        )}
      </div>

      <div className="py-0 ">
        <PricingSection />
      </div>

      <div className="py-0 ">
        <Products limit={6} />
      </div>

     <div className="py-0 ">
        <FAQSection />
      </div>

     <div className="py-0 ">
        <InfiniteMovingCardsDemo />
      </div>

      <div className="py-0 ">
        <BlogSection limit={3} />
      </div>

      <Contact />
    </main>
  );
};

export default MainHome;
