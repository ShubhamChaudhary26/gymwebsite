"use client";
import React, { useEffect, useState, useRef } from "react";
import { Check, Crown, Loader2, Zap, Shield, Star } from "lucide-react";
import apiService from "@/lib/api";

declare global {
  interface Window {
    Razorpay?: any;
  }
}

const PricingPage = () => {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementsRef = useRef<Set<Element>>(new Set());

  useEffect(() => {
    fetchPlans();
  }, []);

  useEffect(() => {
    if (loading || !plans.length) return;

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
  }, [loading, plans]);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const data = await apiService.getPlans();
      setPlans(data.data || []);
    } catch (err: any) {
      console.error("Error fetching plans:", err);
      setError("Failed to load plans. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        console.log("✅ Razorpay SDK loaded");
        resolve(true);
      };
      script.onerror = () => {
        console.error("❌ Razorpay SDK failed to load");
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const openRazorpay = async (plan: any) => {
    const user = localStorage.getItem("user");
    if (!user) {
      alert("Please login first to subscribe!");
      window.location.href = "/login";
      return;
    }

    setProcessingPlanId(plan._id);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert("Razorpay SDK failed to load. Please check your internet connection.");
        setProcessingPlanId(null);
        return;
      }

      const configData = await apiService.getRazorpayConfig();
      const razorpayKey = configData.data.key;

      if (!razorpayKey) {
        throw new Error("Razorpay key not configured");
      }

      const orderData = await apiService.createOrder(plan._id);
      const { orderId, amount, currency, subscriptionId } = orderData.data;

      console.log("📦 Order created:", orderId);

      const options: any = {
        key: razorpayKey,
        amount,
        currency,
        name: "Fitness Club",
        description: `${plan.name} Membership - ${plan.duration} days`,
        image: "/logo.png",
        order_id: orderId,
        handler: async function (response: any) {
          try {
            console.log("✅ Payment captured:", response.razorpay_payment_id);

            await apiService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              subscriptionId,
            });

            alert("🎉 Payment successful! Your subscription is now active.");
            window.location.href = "/dashboard";
          } catch (verifyError: any) {
            console.error("❌ Payment verification failed:", verifyError);
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: JSON.parse(user).name || "",
          email: JSON.parse(user).email || "",
        },
        notes: {
          planId: plan._id,
          planName: plan.name,
        },
        theme: {
          color: "#A2CD04",
        },
        modal: {
          ondismiss: function () {
            console.log("Payment modal closed");
            setProcessingPlanId(null);
          },
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response: any) {
        console.error("❌ Payment failed:", response.error);
        alert(`Payment failed: ${response.error.description}`);
        setProcessingPlanId(null);
      });

      rzp.open();
    } catch (err: any) {
      console.error("❌ Error in payment flow:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to create order";
      alert(errorMessage);
      setProcessingPlanId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#A2CD04] mx-auto mb-4" />
          <span className="text-white text-xl">Loading plans...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
        <p className="text-red-400 text-xl mb-6">{error}</p>
        <button
          onClick={fetchPlans}
          className="px-8 py-3 bg-[#A2CD04] text-black rounded-lg font-bold hover:bg-[#8EBF03] transition-colors duration-300"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <section className="py-5 relative text-white bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-[#A2CD04] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"></div>
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-[#A2CD04] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#A2CD04] rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse-glow"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="scroll-animate opacity-0 translate-y-8 text-center mb-16">
          <div className="inline-block mb-6">
            <span className="bg-[#A2CD04]/20 text-[#A2CD04] px-6 py-2 rounded-full text-sm font-bold tracking-wider uppercase border border-[#A2CD04]/30 hover:scale-105 transition-transform duration-300">
              Membership Plans
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Your Fitness Goals,{" "}
            <span className="text-[#A2CD04]">
              Our Expertise
            </span>
          </h2>
          
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Choose the perfect plan to match your ambition. Every membership comes with our success guarantee and world-class support.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-10">
          {plans.map((plan: any, index: number) => {
            const animationClass = index === 0 ? 'slide-left' : index === 2 ? 'slide-right' : 'slide-up';
            
            return (
              <div
                key={plan._id}
                className={`scroll-animate opacity-0 ${animationClass}`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div
                  className={`relative h-full flex flex-col p-8 rounded-2xl ${
                    plan.popular
                      ? "bg-gradient-to-br from-[#A2CD04]/20 via-gray-900 to-black border-2 border-[#A2CD04] shadow-2xl shadow-[#A2CD04]/30"
                      : "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-2 border-gray-800"
                  }`}
                >
                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#A2CD04] to-[#8EBF03] text-black px-6 py-2 rounded-full text-sm font-bold shadow-lg animate-float-badge">
                      <span className="flex items-center gap-2">
                        <Crown className="w-4 h-4" />
                        Most Popular
                      </span>
                    </div>
                  )}

                  {/* Card Content */}
                  <div className="relative z-10 flex flex-col flex-grow">
                    {/* Header */}
                    <div className="text-center mb-6">
                      <div className="flex justify-center items-center mb-3">
                        {plan.name === "Champion" && (
                          <Crown className="w-6 h-6 text-[#A2CD04] mr-2 animate-pulse" />
                        )}
                        <h3 className="text-2xl md:text-3xl font-bold text-white">
                          {plan.name}
                        </h3>
                      </div>
                      <p className="text-gray-400 text-sm min-h-[40px]">
                        {plan.description || "Perfect for your fitness journey"}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="text-center mb-8">
                      <div className="inline-block">
                        <span className="text-5xl md:text-6xl font-extrabold text-[#A2CD04]">
                          ₹{plan.price}
                        </span>
                        <span className="text-gray-400 text-lg ml-2">
                          /{plan.duration} days
                        </span>
                      </div>
                      {/* Price divider */}
                      <div className="w-16 h-1 bg-[#A2CD04]/30 mx-auto mt-4 rounded-full"></div>
                    </div>

                    {/* Features List */}
                    <ul className="space-y-4 mb-8 flex-grow">
                      {plan.features?.map((feature: string, i: number) => (
                        <li
                          key={i}
                          className="flex items-start text-gray-300"
                        >
                          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#A2CD04]/20 flex items-center justify-center mr-3 mt-0.5">
                            <Check className="w-3 h-3 text-[#A2CD04]" />
                          </div>
                          <span className="text-sm leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Button */}
                    <div className="mt-auto pt-4">
                      <button
                        onClick={() => openRazorpay(plan)}
                        disabled={processingPlanId === plan._id || !plan.isActive}
                        className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                          processingPlanId === plan._id
                            ? "bg-gray-600 cursor-not-allowed text-gray-400"
                            : plan.isActive
                            ? "bg-[#A2CD04] text-black hover:bg-[#8EBF03] shadow-lg hover:shadow-xl"
                            : "bg-gray-700 cursor-not-allowed text-gray-500"
                        }`}
                      >
                        {processingPlanId === plan._id ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Processing...
                          </>
                        ) : !plan.isActive ? (
                          "Not Available"
                        ) : (
                          <>
                            Subscribe Now
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                              />
                            </svg>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Badges */}
        <div className="scroll-animate opacity-0 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-5">
          <div className="flex items-center justify-center gap-3 p-4 bg-gray-900/50 rounded-lg border border-gray-800">
            <Shield className="w-6 h-6 text-[#A2CD04]" />
            <span className="text-gray-300 text-sm">7-Day Money Back</span>
          </div>
          <div className="flex items-center justify-center gap-3 p-4 bg-gray-900/50 rounded-lg border border-gray-800">
            <Zap className="w-6 h-6 text-[#A2CD04]" />
            <span className="text-gray-300 text-sm">Instant Activation</span>
          </div>
          <div className="flex items-center justify-center gap-3 p-4 bg-gray-900/50 rounded-lg border border-gray-800">
            <Star className="w-6 h-6 text-[#A2CD04]" />
            <span className="text-gray-300 text-sm">Cancel Anytime</span>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="scroll-animate opacity-0 text-center">
          <p className="text-gray-400 text-lg mb-4">
            🔒 Secure payment powered by Razorpay
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-[#A2CD04] rounded-full animate-pulse"></div>
            <span>Join 50,000+ satisfied members</span>
          </div>
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
            transform: translateY(60px) scale(0.95);
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

        @keyframes float-badge {
          0%, 100% {
            transform: translateX(-50%) translateY(0);
          }
          50% {
            transform: translateX(-50%) translateY(-3px);
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.05;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 0.15;
            transform: translate(-50%, -50%) scale(1.1);
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

        .animate-float-badge {
          animation: float-badge 3s ease-in-out infinite;
        }

        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .scroll-animate,
          .animate-float,
          .animate-float-delayed,
          .animate-float-badge,
          .animate-pulse-glow {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default PricingPage;