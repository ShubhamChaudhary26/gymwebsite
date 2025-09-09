'use client';
import Checkout from "@/Payment";
import { Check, Star, Crown } from "lucide-react";
import React, { useEffect, useState } from "react";

const pricingPlans = [
  {
    name: "Starter",
    price: 29,
    period: "month",
    description: "Perfect for beginners starting their fitness journey",
    features: [
      "Access to basic gym equipment",
      "2 group classes per week",
      "Basic nutrition guide",
      "Mobile app access",
      "Locker room access"
    ],
    popular: false,
    cta: "Get Started"
  },
  {
    name: "Elite",
    price: 79,
    period: "month",
    description: "Most popular choice for serious fitness enthusiasts",
    features: [
      "Unlimited gym access",
      "Unlimited group classes",
      "Personal trainer session (2/month)",
      "Custom nutrition plan",
      "Priority booking",
      "Recovery suite access",
      "Progress tracking & analytics"
    ],
    popular: true,
    cta: "Start Elite Training"
  },
  {
    name: "Champion",
    price: 149,
    period: "month",
    description: "Ultimate transformation program for peak performers",
    features: [
      "Everything in Elite",
      "Weekly personal training",
      "Custom meal prep service",
      "Body composition analysis",
      "Supplement consultation",
      "24/7 coach support",
      "VIP amenities access",
      "Guest passes (4/month)"
    ],
    popular: false,
    cta: "Become Champion"
  }
];


const planId = "68bfb6d2024e3cc6dbfdce1b";

const PricingSection = () => {
  const [order, setOrder] = useState<{ id: string; amount: number } | null>(null);

  useEffect(() => {
    const createOrder = async () => {
      const res = await fetch("http://localhost:3000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
        cache: "no-store", // force fresh request
      });
      const orderData = await res.json();
      setOrder(orderData);
    };
    createOrder();
  }, []);

  return (
    <section className="py-20 section-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          {order && <Checkout orderId={order.id} amount={order.amount} />}
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Your Fitness Goals, <span className="text-neon">Our Expertise</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose the perfect plan to match your ambition. Every membership includes 
            our success guarantee and world-class support.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <div 
              key={index}
              className={`relative section-card p-8 rounded-2xl card-hover transition-transform ${
                plan.popular ? 'ring-2 ring-primary scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary text-white px-6 py-2 rounded-full text-sm font-bold flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </div>
                </div>
              )}
              
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  {plan.name === "Champion" && <Crown className="w-6 h-6 text-primary mr-2" />}
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                </div>
                
                <div className="mb-4">
                  <span className="text-5xl font-bold text-neon">${plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
                
                <p className="text-muted-foreground">{plan.description}</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button 
                className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-all ${
                  plan.popular ? 'btn-hero' : 'btn-secondary'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-2 text-sm text-muted-foreground">
            <Check className="w-4 h-4 text-primary" />
            <span>30-day money-back guarantee</span>
            <span>•</span>
            <span>Cancel anytime</span>
            <span>•</span>
            <span>No setup fees</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
