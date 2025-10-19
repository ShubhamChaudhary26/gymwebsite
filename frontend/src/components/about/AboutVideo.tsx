"use client";

import { motion, useInView, Variants } from "framer-motion";
import { useRef } from "react";

interface VideoItem {
  youtubeLink: string;
  topic: string;
  description: string;
  order: number;
}

interface AboutVideosProps {
  videos: VideoItem[];
}

const AboutVideos = ({ videos }: AboutVideosProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const extractYouTubeEmbedUrl = (url: string) => {
    if (!url) return "";
    if (url.includes("embed")) return url;

    const videoIdMatch = url.match(
      /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([\w-]{11})/
    );
    const videoId = videoIdMatch ? videoIdMatch[1] : null;

    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  if (!videos || videos.length === 0) return null;

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  };

  return (
    <>
      {/* Section Title */}
      <div className="text-center mt-20  transition-all duration-700 opacity-100 translate-y-0">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          Veltrix <span className="text-[#A2CD04]">Your Fitness Zone.</span>
        </h2>
        <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto">
          Your Journey to the Perfect Physique Begins Here
        </p>
      </div>

      <section
        id="videos"
        ref={ref}
        className="py-1 sm:py-16 md:py-14 bg-black"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8"
          >
            {videos.map((video, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="group bg-gray-900/50 rounded-xl overflow-hidden border border-gray-800 hover:border-[#A2CD04]/50 transition-all"
              >
                {/* Video */}
                <div className="relative aspect-video bg-gray-800">
                  <iframe
                    src={extractYouTubeEmbedUrl(video.youtubeLink)}
                    title={video.topic}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>

                {/* Video Info */}
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 group-hover:text-[#A2CD04] transition text-white">
                    {video.topic}
                  </h3>
                  {video.description && (
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {video.description}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default AboutVideos;
