"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Zap } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  photo: string;
}

interface ApiResponse {
  success: boolean;
  data: Product[];
  message: string;
}

interface ProductsProps {
  limit?: number;
}

export default function Products({ limit }: ProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementsRef = useRef<Set<Element>>(new Set());

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products`
        );
        if (!res.ok) throw new Error("Failed to fetch products");
        const data: ApiResponse = await res.json();
        setProducts(limit ? data.data.slice(0, limit) : data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [limit]);

  useEffect(() => {
    if (loading || !products.length) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
            observerRef.current?.unobserve(entry.target);
            elementsRef.current.delete(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -80px 0px",
      }
    );

    const timeoutId = setTimeout(() => {
      const elements = document.querySelectorAll(".scroll-animate");
      elements.forEach((el) => {
        elementsRef.current.add(el);
        observerRef.current?.observe(el);
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (observerRef.current) {
        elementsRef.current.forEach((el) => {
          observerRef.current?.unobserve(el);
        });
        observerRef.current.disconnect();
      }
      elementsRef.current.clear();
    };
  }, [loading, products]);


  if (error)
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl">{error}</p>
        </div>
      </div>
    );

  if (!products.length)
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 text-xl">No products available</p>
        </div>
      </div>
    );

  return (
    <div className="bg-gradient-to-b from-black via-gray-900 to-black min-h-screen py-2 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -right-40 w-96 h-96 bg-[#A2CD04] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"></div>
        <div className="absolute bottom-20 -left-40 w-96 h-96 bg-[#A2CD04] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float-delayed"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="scroll-animate opacity-0 translate-y-8 text-center mb-16">
          {/* <div className="inline-block mb-6">
            <span className="bg-[#A2CD04]/20 text-[#A2CD04] px-6 py-2 rounded-full text-sm font-bold tracking-wider uppercase border border-[#A2CD04]/30">
              <ShoppingCart className="w-4 h-4 inline mr-2" />
              Our Store
            </span>
          </div> */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Shop Our <span className="text-[#A2CD04]">Products</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
            High-quality fitness equipment and supplements to enhance your workout journey
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((p, index) => {
            const animationClass = index % 3 === 0 ? 'slide-left' : index % 3 === 1 ? 'slide-up' : 'slide-right';
            
            return (
              <div
                key={p._id}
                className={`scroll-animate opacity-0 ${animationClass} group cursor-pointer`}
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => router.push(`/products/${p._id}`)}
              >
                <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-xl overflow-hidden border-2 border-gray-800 hover:border-[#A2CD04] transition-all duration-500 hover:shadow-2xl hover:shadow-[#A2CD04]/30 flex flex-col h-full">
                  {/* Corner Decorations */}
                  <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[#A2CD04]/0 group-hover:border-[#A2CD04] rounded-tl-2xl transition-all duration-500 z-10"></div>
                  <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[#A2CD04]/0 group-hover:border-[#A2CD04] rounded-br-2xl transition-all duration-500 z-10"></div>

                  {/* Image Container */}
                  <div className="relative h-64 w-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 opacity-60"></div>
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-[#A2CD04]/0 group-hover:bg-[#A2CD04]/10 transition-all duration-500 z-10"></div>
                    
                    <img
                      src={
                        p.photo?.startsWith("http")
                          ? p.photo
                          : `${process.env.NEXT_PUBLIC_BACKEND_URL}${p.photo}`
                      }
                      alt={p.name}
                      className="object-cover w-full h-full group-hover:scale-110 group-hover:rotate-2 transition-all duration-700"
                      loading="lazy"
                    />

                    {/* Stock Badge */}
                    <div className="absolute top-4 right-4 z-20">
                      <div className="bg-[#A2CD04] text-black px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        In Stock
                      </div>
                    </div>

                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-20">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 animate-shine"></div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6 flex flex-col justify-between flex-1 relative">
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-[#A2CD04] transition-colors duration-300">
                        {p.name}
                      </h2>
                      <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 group-hover:text-gray-300 transition-colors duration-300 mb-4">
                        {p.description}
                      </p>
                    </div>

                    {/* Price and Button */}
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-700 group-hover:border-[#A2CD04]/50 transition-colors duration-300">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Price</p>
                        <span className="text-2xl md:text-3xl font-bold text-[#A2CD04]">
                          ₹{p.price}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 bg-[#A2CD04] group-hover:bg-[#8EBF03] text-black font-bold py-2 px-4 rounded-lg transition-all duration-300 shadow-lg group-hover:shadow-xl ">
                        <span className="text-sm">View Details</span>
                        <svg
                          className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-from-left {
          from {
            opacity: 0;
            transform: translateX(-60px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        @keyframes slide-from-right {
          from {
            opacity: 0;
            transform: translateX(60px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        @keyframes slide-from-bottom {
          from {
            opacity: 0;
            transform: translateY(60px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translate(0, 0);
          }
          33% {
            transform: translate(20px, -20px);
          }
          66% {
            transform: translate(-20px, 15px);
          }
        }

        @keyframes shine {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
          }
        }

        .scroll-animate {
          transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .scroll-animate.slide-left.animate-in {
          animation: slide-from-left 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .scroll-animate.slide-right.animate-in {
          animation: slide-from-right 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .scroll-animate.slide-up.animate-in {
          animation: slide-from-bottom 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .scroll-animate:not([class*="slide-"]).animate-in {
          animation: slide-from-bottom 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float 8s ease-in-out infinite;
          animation-delay: 4s;
        }

        .animate-shine {
          animation: shine 2s ease-in-out;
        }

        @media (prefers-reduced-motion: reduce) {
          .scroll-animate,
          .animate-float,
          .animate-float-delayed,
          .animate-shine {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
}