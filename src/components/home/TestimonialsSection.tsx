import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Marcus Johnson",
    role: "Software Engineer",
    image: "https://source.unsplash.com/100x100/?man,fitness",
    rating: 5,
    text: "I've tried countless gyms and programs, but nothing comes close to this. Lost 45 pounds and gained incredible strength in just 6 months. The coaches genuinely care about your success.",
    results: "Lost 45 lbs • Gained 15 lbs muscle"
  },
  {
    name: "Sarah Chen",
    role: "Marketing Director", 
    image: "https://source.unsplash.com/100x100/?woman,fitness",
    rating: 5,
    text: "The personalized approach changed everything for me. Not just my body, but my entire mindset. I'm stronger and more confident than I've ever been in my life.",
    results: "Body fat: 32% → 18%"
  },
  {
    name: "David Rodriguez",
    role: "Professional Athlete",
    image: "https://source.unsplash.com/100x100/?athlete,gym",
    rating: 5,
    text: "Elite level training that pushed me beyond my limits. The attention to detail and scientific approach helped me reach peak performance I never thought possible.",
    results: "Increased strength by 40%"
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Your Success Stories, <span className="text-neon">Our Inspiration</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real transformations from real people who decided to change their lives. 
            Your success story could be next.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <div key={index} className="section-card p-8 rounded-xl card-hover relative">
              <Quote className="w-8 h-8 text-primary/30 mb-6" />
              <div className="flex items-center mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-primary fill-current" />
                ))}
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">"{t.text}"</p>
              <div className="bg-primary/10 rounded-lg p-4 mb-6">
                <div className="text-sm font-semibold text-primary mb-1">Results:</div>
                <div className="text-sm text-neon font-bold">{t.results}</div>
              </div>
              <div className="flex items-center">
                <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover mr-4" />
                <div>
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-sm text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <div className="section-card p-8 rounded-2xl max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold mb-4">
              Ready to Write Your <span className="text-neon">Success Story</span>?
            </h3>
            <p className="text-muted-foreground mb-8">
              Join thousands who've already transformed their lives. Your journey starts with a single decision.
            </p>
            <button className="btn-hero">Start Your Transformation Today</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
