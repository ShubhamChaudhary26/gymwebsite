// app/about/page.tsx (Same as before)
"use client";
import React, { useEffect, useState } from "react";
import apiService from "@/lib/api";
import AboutHero from "@/components/about/AboutHero";
import AboutContent from "@/components/about/AboutContent";
import AboutVideos from "@/components/about/AboutVideo";
import GallerySection from "@/components/about/GallerySection";

interface VideoItem {
  youtubeLink: string;
  topic: string;
  description: string;
  order: number;
}

interface AboutData {
  title: string;
  description: string;
  mission: string;
  vision: string;
  videos: VideoItem[];
  stats: {
    label: string;
    value: string;
    icon: string;
  }[];
}

const AboutPage = () => {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getAboutData();

      if (response.success && response.data) {
        setAboutData(response.data);
      } else {
        setError("Failed to load page");
      }
    } catch (err: any) {
      console.error("Error:", err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-[#A2CD04] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !aboutData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || "Failed to load"}</p>
          <button
            onClick={fetchAboutData}
            className="px-6 py-2 bg-[#A2CD04] text-black rounded-lg hover:bg-[#8EBF03] transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <AboutHero title={aboutData.title} description={aboutData.description} />
      <AboutVideos videos={aboutData.videos} />
      <AboutContent
        stats={aboutData.stats}
        mission={aboutData.mission}
        vision={aboutData.vision}
      />
      <GallerySection />
    </div>
  );
};

export default AboutPage;