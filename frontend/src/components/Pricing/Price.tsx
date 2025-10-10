// app/pricing/page.tsx (or wherever your pricing page is)
"use client";
import React, { useEffect, useState } from "react";
import { Check, Crown, Loader2 } from "lucide-react";
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

  // Fetch Plans from Backend
  useEffect(() => {
    fetchPlans();
  }, []);

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

  // Load Razorpay script dynamically
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      // Check if already loaded
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
    // Check if user is logged in
    const user = localStorage.getItem("user");
    if (!user) {
      alert("Please login first to subscribe!");
      window.location.href = "/login";
      return;
    }

    setProcessingPlanId(plan._id);

    try {
      // Step 1: Load Razorpay SDK
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert("Razorpay SDK failed to load. Please check your internet connection.");
        setProcessingPlanId(null);
        return;
      }

      // Step 2: Get Razorpay config (secure key fetch)
      const configData = await apiService.getRazorpayConfig();
      const razorpayKey = configData.data.key;

      if (!razorpayKey) {
        throw new Error("Razorpay key not configured");
      }

      // Step 3: Create order via backend
      const orderData = await apiService.createOrder(plan._id);
      const { orderId, amount, currency, subscriptionId } = orderData.data;

      console.log("📦 Order created:", orderId);

      // Step 4: Open Razorpay checkout
      const options: any = {
        key: razorpayKey, // ✅ Secure - fetched from backend
        amount,
        currency,
        name: "Fitness Club",
        description: `${plan.name} Membership - ${plan.duration} days`,
        image: "/logo.png", // Your gym logo
        order_id: orderId,
        handler: async function (response: any) {
          try {
            console.log("✅ Payment captured:", response.razorpay_payment_id);

            // Step 5: Verify payment on backend
            await apiService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              subscriptionId,
            });

            alert("🎉 Payment successful! Your subscription is now active.");

            // Redirect to dashboard or subscription page
            window.location.href = "/dashboard"; // or wherever you want
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
          color: "#facc15", // Your brand color
        },
        modal: {
          ondismiss: function () {
            console.log("Payment modal closed");
            setProcessingPlanId(null);
          },
        },
      };

      const rzp = new window.Razorpay(options);

      // Handle payment failure
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
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-default" />
        <span className="ml-2 text-white">Loading plans...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-400 mb-4">{error}</p>
        <button
          onClick={fetchPlans}
          className="px-4 py-2 bg-default text-black rounded-lg "
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <section className="py-10 relative text-white">
      <div className="text-center mb-16">
        <h2 className="textHeadingmobile md:textHeadinglaptop">
          Your Fitness Goals, <span className="text-default">Our Expertise</span>
        </h2>
        <p className="textafterHeading max-w-2xl mx-auto">
          Choose the perfect plan to match your ambition. Every membership comes with our success guarantee and world-class support.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
        {plans.map((plan: any) => (
          <div
            key={plan._id}
            className={`relative p-8 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 ${plan.popular
                ? "bg-gradient-to-b from-yellow-900/30 to-gray-900 border border-default/80 transition/30 ring-2 ring-default"
                : "bg-gray-900 border border-gray-700"
              }`}
          >
            {/* Popular Badge */}
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-default text-black px-4 py-1 rounded-full text-sm font-bold">
                Most Popular
              </div>
            )}

            <div className="text-center mb-6">
              <div className="flex justify-center items-center mb-3">
                {plan.name === "Champion" && <Crown className="w-6 h-6 text-default mr-2" />}
                <h3 className="text-2xl font-bold">{plan.name}</h3>
              </div>
              <p className="text-gray-400">{plan.description || ""}</p>
              <div className="mt-4">
                <span className="text-5xl font-extrabold text-default">₹{plan.price}</span>
                <span className="text-gray-400">/{plan.duration} days</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features?.map((feature: string, i: number) => (
                <li key={i} className="flex items-start text-gray-300">
                  <Check className="w-4 h-4 text-default mr-2 flex-shrink-0 mt-1" />
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => openRazorpay(plan)}
              disabled={processingPlanId === plan._id || !plan.isActive}
              className={`w-full py-3 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${processingPlanId === plan._id
                  ? "bg-gray-600 cursor-not-allowed"
                  : plan.isActive
                    ? "bg-default text-black shadow-md hover:shadow-default/50 "
                    : "bg-gray-600 cursor-not-allowed text-gray-400"
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
                "Subscribe Now"
              )}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PricingPage;