// components/about/GallerySection.tsx (FIXED)
"use client";
import { ChevronRight } from "lucide-react";
import { motion, useInView, Variants } from "framer-motion";
import { useRef } from "react";

const GallerySection = () => {
  const ref = useRef(null);
  const ctaRef = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const ctaInView = useInView(ctaRef, { once: true });

  const images = [
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
    "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80",
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80",
    "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80",
  ];

  // ✅ FIXED: Proper Variants type
  const containerVariants: Variants = {
    hidden: { 
      opacity: 0 
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8 
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.43, 0.13, 0.23, 0.96], // ✅ Custom easing array
      },
    },
  };

  return (
    <section className="py-12 sm:py-16 md:py-10 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-white">
            Our <span className="text-[#A2CD04]">Gallery</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-3xl mx-auto px-4">
            Take a look at our world-class facilities and vibrant community
          </p>
        </motion.div>

        {/* Gallery Grid */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {images.map((image, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05, zIndex: 10 }}
              className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer"
            >
              <img
                src={image}
                alt={`Gallery ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300"></div>

          
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* CTA Section */}
      <section ref={ctaRef} className="mt-12 sm:mt-16 md:mt-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative bg-gradient-to-r from-[#A2CD04]/10 to-transparent border border-[#A2CD04]/20 rounded-2xl p-6 sm:p-8 md:p-12 lg:p-16 overflow-hidden"
          >
            {/* Background Pattern */}
            <div className="absolute right-0 top-0 w-1/2 h-full opacity-5 pointer-events-none">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 0L0 0 0 10' fill='none' stroke='white' stroke-width='1'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "repeat",
                }}
              ></div>
            </div>

            <div className="relative max-w-3xl">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-white">
                Ready to Transform Your Life?
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-6 sm:mb-8">
                Join our community and start your fitness journey today
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => (window.location.href = "/price")}
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-[#A2CD04] text-black font-semibold rounded-lg hover:bg-[#8EBF03] transition-all text-sm sm:text-base"
              >
                View Plans
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </section>
  );
};

export default GallerySection;