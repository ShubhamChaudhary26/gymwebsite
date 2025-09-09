'use client';
import { useState } from "react";
import { Play, X } from "lucide-react";

const GallerySection = () => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const galleryItems = [
    {
      type: "video",
      thumbnail: "https://images.unsplash.com/photo-1599058917212-d750089bc07e",
      title: "Strength Training Session",
      description: "Watch our members push their limits",
      videoId: "dQw4w9WgXcQ"
    },
    {
      type: "image",
      src: "https://images.unsplash.com/photo-1599058917212-d750089bc07e",
      title: "State-of-the-Art Equipment",
      description: "Premium facilities for premium results"
    },
    {
      type: "video", 
      thumbnail: "https://images.unsplash.com/photo-1599058917212-d750089bc07e",
      title: "HIIT Cardio Class",
      description: "High-intensity interval training",
      videoId: "dQw4w9WgXcQ"
    },
    {
      type: "image",
      src: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1", 
      title: "Personal Training",
      description: "One-on-one expert guidance"
    },
    {
      type: "video",
      thumbnail: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1",
      title: "Success Story",
      description: "Incredible transformation journey",
      videoId: "dQw4w9WgXcQ"
    },
    {
      type: "image",
      src: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1",
      title: "Group Fitness Classes", 
      description: "Community-driven workouts"
    }
  ];

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/3 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Experience Fitness <span className="text-neon">Like Never Before</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Take a virtual tour of our facilities and see our community in action. 
            This is where transformations happen.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item, index) => (
            <div 
              key={index}
              className="group relative rounded-xl overflow-hidden card-hover cursor-pointer"
              onClick={() => item.type === 'video' && item.videoId ? setSelectedVideo(item.videoId) : null}
            >
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={item.thumbnail || item.src} 
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                
                {item.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-primary/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 text-primary-foreground ml-1" />
                    </div>
                  </div>
                )}
                
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white font-bold text-lg mb-2 group-hover:text-neon transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-white/80 text-sm">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedVideo && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute -top-12 right-0 text-white hover:text-primary transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                className="w-full h-full rounded-lg"
                allowFullScreen
                title="Fitness Video"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default GallerySection;
