import { Instagram, Facebook, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="section-dark py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-4">
              <span className="text-neon">Fitness</span>Elite
            </h3>
            <p className="text-muted-foreground mb-6">
              Transform your body, elevate your spirit. Join the elite fitness community 
              that's changing lives every day.
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors cursor-pointer">
                <Instagram className="w-5 h-5 text-primary" />
              </div>
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors cursor-pointer">
                <Facebook className="w-5 h-5 text-primary" />
              </div>
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors cursor-pointer">
                <Twitter className="w-5 h-5 text-primary" />
              </div>
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors cursor-pointer">
                <Youtube className="w-5 h-5 text-primary" />
              </div>
            </div>
          </div>
          
          {/* Programs */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Programs</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Strength Training</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Cardio Conditioning</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Fat Loss Program</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Athletic Performance</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Nutrition Coaching</a></li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Refund Policy</a></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-4">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-primary mr-3" />
                <span className="text-muted-foreground text-sm">123 Fitness Street, Gym City, GC 12345</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-primary mr-3" />
                <span className="text-muted-foreground text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-primary mr-3" />
                <span className="text-muted-foreground text-sm">hello@fitnesselite.com</span>
              </div>
            </div>
            
            {/* Newsletter */}
            <div className="mt-6">
              <h5 className="font-semibold mb-2 ">Stay Updated</h5>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 bg-input border border-border rounded-l-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-r-lg hover:bg-primary/90 transition-colors">
                  <Mail className="w-4 h-4 " />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              © 2024 FitnessElite. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <span className="text-sm text-muted-foreground">Available 24/7</span>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm text-primary">Live Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;