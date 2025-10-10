"use client";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import Image from "next/image";

const faqs = [
  {
    question: "What makes your fitness programs different?",
    answer:
      "Our programs combine scientifically-proven methodologies with personalized coaching. Each plan is tailored to your specific goals, fitness level, and lifestyle. We focus on sustainable results rather than quick fixes, ensuring long-term success and health.",
    image: "/banner.png",
  },
  {
    question: "Do I need prior fitness experience to join?",
    answer:
      "Our programs combine scientifically-proven methodologies with personalized coaching. Each plan is tailored to your specific goals, fitness level, and lifestyle. We focus on sustainable results rather than quick fixes, ensuring long-term success and health.",
    image:
      "https://images.unsplash.com/photo-1558611848-73f7eb4001a1?q=80&w=1000&auto=format&fit=crop",
  },
  {
    question: "What's included in the membership?",
    answer:
      "Our programs combine scientifically-proven methodologies with personalized coaching. Each plan is tailored to your specific goals, fitness level, and lifestyle. We focus on sustainable results rather than quick fixes, ensuring long-term success and health.",
    image:
      "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=1000&auto=format&fit=crop",
  },
  {
    question: "How quickly will I see results?",
    answer:
      "Our programs combine scientifically-proven methodologies with personalized coaching. Each plan is tailored to your specific goals, fitness level, and lifestyle. We focus on sustainable results rather than quick fixes, ensuring long-term success and health.",
    image:
      "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?q=80&w=1000&auto=format&fit=crop",
  },
  {
    question: "Can I freeze or cancel my membership?",
    answer:
      "Our programs combine scientifically-proven methodologies with personalized coaching. Each plan is tailored to your specific goals, fitness level, and lifestyle. We focus on sustainable results rather than quick fixes, ensuring long-term success and health.",
    image:
      "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=1000&auto=format&fit=crop",
  },
  {
    question: "Do you provide nutrition guidance?",
    answer:
      "Our programs combine scientifically-proven methodologies with personalized coaching. Each plan is tailored to your specific goals, fitness level, and lifestyle. We focus on sustainable results rather than quick fixes, ensuring long-term success and health.",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop",
  },
];

const FAQItem = ({
  faq,
  index,
  isOpen,
  onClick,
}: {
  faq: (typeof faqs)[0];
  index: number;
  isOpen: boolean;
  onClick: () => void;
}) => {
  return (
    <div className="section-card rounded-xl overflow-hidden border-none  ">
      <button
        className="w-full px-6  py-4 text-left flex items-center justify-between hover:bg-primary/5 transition-colors"
        onClick={onClick}
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

      <div
        className={`overflow-hidden transition-max-height duration-300 ${
          isOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        {faq.answer && (
          <div className="px-6 pb-4">
            <p className="text-muted-foreground leading-relaxed text-gray-300">
              {faq.answer}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <section className=" section-dark bg-black">
          <div className="text-center">
            <h2 className="textHeadingmobile md:textHeadinglaptop">
              Frequently Asked <span className="text-default">Questions</span>
            </h2>
          </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-start mt-10">
        {/* Left FAQ Column */}
        <div className="text-center justify-center ">

          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              faq={faq}
              index={index}
              isOpen={activeIndex === index}
              onClick={() =>
                setActiveIndex(activeIndex === index ? null : index)
              }
            />
          ))}
        </div>

        {/* Right Image Column */}
        <div className="flex justify-center md:justify-end md:mt-[8vh]">
          {activeIndex !== null ? (
            <Image
              src={faqs[activeIndex].image}
              alt={faqs[activeIndex].question}
              width={500}
              height={200}
              className="rounded-xl shadow-lg object-contain w-full max-w-md md:h-[75vh] "
            />
          ) : (
            <p className="text-muted-foreground text-center">
              Select a question to see the related image.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
