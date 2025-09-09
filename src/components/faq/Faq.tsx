'use client'
import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "What makes your fitness programs different?",
    answer: "Our programs combine scientifically-proven methodologies with personalized coaching. Each plan is tailored to your specific goals, fitness level, and lifestyle. We focus on sustainable results rather than quick fixes, ensuring long-term success and health."
  },
  {
    question: "Do I need prior fitness experience to join?",
    answer: "Not at all! Our programs cater to all fitness levels, from complete beginners to advanced athletes. Our certified trainers will assess your current fitness level and create a program that challenges you appropriately while ensuring safety and progress."
  },
  {
    question: "What's included in the membership?",
    answer: "All memberships include access to our state-of-the-art facilities, group classes, mobile app, basic nutrition guidance, and progress tracking. Higher tiers include personal training sessions, custom meal plans, and priority support."
  },
  {
    question: "How quickly will I see results?",
    answer: "Most members notice improvements in energy and strength within 2-3 weeks. Visible physical changes typically occur within 4-6 weeks of consistent training. Remember, sustainable transformation is a journey, not a sprint."
  },
  {
    question: "Can I freeze or cancel my membership?",
    answer: "Yes, we offer flexible membership options. You can freeze your membership for up to 3 months per year for medical or travel reasons. Cancellations require 30 days notice, and we offer a 30-day money-back guarantee for new members."
  },
  {
    question: "Do you provide nutrition guidance?",
    answer: "Absolutely! All memberships include basic nutrition guidance. Our Elite and Champion tiers include custom meal planning and ongoing nutrition coaching to optimize your results and support your fitness goals."
  }
];

const FAQItem = ({ faq, index }: { faq: typeof faqs[0]; index: number }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="section-card rounded-xl overflow-hidden card-hover"
      style={{
        animation: `fade-in 0.5s ease-out ${index * 0.1}s both`
      }}
    >
      <button
        className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-primary/5 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-semibold pr-4">{faq.question}</h3>
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          {isOpen ? (
            <Minus className="w-4 h-4 text-primary" />
          ) : (
            <Plus className="w-4 h-4 text-primary" />
          )}
        </div>
      </button>
      
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
        <div className="px-8 pb-6">
          <p className="text-muted-foreground leading-relaxed">
            {faq.answer}
          </p>
        </div>
      </div>
    </div>
  );
};

const FAQSection = () => {
  return (
    <section className="py-20 section-dark">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Frequently Asked <span className="text-neon">Questions</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Get answers to common questions about our programs, memberships, and approach to fitness.
          </p>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem key={index} faq={faq} index={index} />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-6">
            Still have questions? We're here to help!
          </p>
          <button className="btn-hero">
            Contact Our Team
          </button>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;