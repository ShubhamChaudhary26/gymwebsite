"use client";
import React from "react";
import ServicesPage from "./main";
import CTASection from "./Service";
import FAQSection from "../faq/Faq";


const ServicesMain = () => {
  return (
    <div>
      <ServicesPage />
      
      <FAQSection />
      <CTASection />

    </div>
  );
};

export default ServicesMain;
