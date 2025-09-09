import Hero from "@/components/home/Hero";
import Programs from "@/components/home/Programs";
import Checkout from "@/Payment";
import StatsSection from "@/components/home/stats";
import FeaturesSection from "@/components/home/Features";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import PricingSection from "@/components/Pricing/Price";
import BlogSection from "@/components/Blog/BlogSection";
import FAQSection from "@/components/faq/Faq";
import ContactSection from "@/components/contact/contact";

export default async function HomePage() {
 

  return (
    <main>
      <Hero />
      <StatsSection />
      <FeaturesSection />
     
      <Programs />
      <TestimonialsSection />
      <PricingSection/>
      <BlogSection/>
      <FAQSection/>
      <ContactSection/>
    </main>
  );
}
