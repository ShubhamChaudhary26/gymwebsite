import { ArrowRight, CheckCircle } from "lucide-react";

const benefits = [
  "Personal fitness assessment",
  "Custom workout plan creation", 
  "Nutrition consultation",
  "Goal setting session",
  "Facility tour and orientation"
];

const CTASection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="section-card p-12 rounded-2xl text-center relative overflow-hidden">
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Connect. Engage. <span className="text-neon">Transform.</span>
            </h2>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Take the first step towards your best self. Join thousands who've already 
              started their transformation journey with us.
            </p>
            
            {/* Benefits List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 max-w-2xl mx-auto">
              {benefits.map((benefit, index) => (
                <div 
                  key={index}
                  className="flex items-center text-left"
                  style={{
                    animation: `fade-in 0.5s ease-out ${index * 0.1 + 0.2}s both`
                  }}
                >
                  <CheckCircle className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                  <span className="text-muted-foreground">{benefit}</span>
                </div>
              ))}
            </div>
            
            {/* CTA Buttons */}
            <div className="space-y-4">
              <button className="btn-hero text-lg px-10 py-4 group">
                Start Your Free Consultation
                <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                  No commitment required
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                  Available 24/7
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                  Expert guidance
                </div>
              </div>
            </div>
            
            {/* Contact Info */}
            <div className="mt-10 pt-8 border-t border-border">
              <p className="text-muted-foreground mb-4">
                Questions? Call us at{" "}
                <span className="text-primary font-semibold">+1 (555) 123-4567</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Available Monday-Friday 6AM-10PM, Weekend 7AM-8PM
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;