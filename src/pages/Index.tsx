import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { MenuSection } from '@/components/MenuSection';
import { products } from '@/data/products';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Phone, Mail, MessageCircle } from 'lucide-react';

const Index = () => {
  const biryaniProducts = products.filter(p => p.category === 'biryani');
  const regularProducts = products.filter(p => p.category !== 'biryani');

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      
      {/* About Section */}
      <section id="about" className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h2 className="text-4xl font-bold mb-6">Bringing South India to Gurugram</h2>
            <p className="text-lg text-muted-foreground mb-6">
              We noticed Gurugram lacks authentic, diverse South Indian cuisine and home-cooked food delivery. 
              Our cloud kitchen solves this by bringing you the rich flavors of Kerala, Karnataka, Tamil Nadu, 
              and Andhra Pradesh - all from one kitchen.
            </p>
            <p className="text-lg text-muted-foreground">
              Specializing in authentic Hyderabadi and Kolkata Biryani, we serve every dish with 
              the same care and authenticity as a home kitchen.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mt-12 max-w-4xl mx-auto">
            <div className="text-center animate-fade-in">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Gurugram Wide Delivery</h3>
              <p className="text-sm text-muted-foreground">Fast delivery across all areas</p>
            </div>
            <div className="text-center animate-fade-in">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Fresh & Hot</h3>
              <p className="text-sm text-muted-foreground">Made fresh for every order</p>
            </div>
            <div className="text-center animate-fade-in">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Easy Ordering</h3>
              <p className="text-sm text-muted-foreground">Order online in seconds</p>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Biryanis Section */}
      <MenuSection
        id="biryanis"
        title="Our Premium Biryanis"
        products={biryaniProducts}
      />

      {/* Regular Menu Section */}
      <MenuSection
        id="menu"
        title="Explore Our Menu"
        products={regularProducts}
        showFilters={true}
      />

      {/* CTA Section */}
      <section className="py-12 md:py-20 bg-gradient-warm text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 animate-fade-in">
            Ready to Experience Authentic South Indian Flavors?
          </h2>
          <p className="text-xl mb-8 animate-fade-in">
            Order now and get your favorite dishes delivered hot and fresh!
          </p>
          <a href="#menu">
            <Button size="lg" variant="secondary" className="animate-scale-in">
              Order Now
            </Button>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">Zaika Gharana</h3>
            <p className="text-background/80 mb-6">
              Authentic South Indian Cuisine • Gurugram
            </p>
            
            {/* Contact Links */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
              <a
                href="https://wa.me/917892479342"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-background hover:text-background/80 transition-colors underline decoration-background/40 hover:decoration-background cursor-pointer"
              >
                <MessageCircle className="w-5 h-5" />
                <span>WhatsApp: +91 78924 79342</span>
              </a>
              <span className="hidden sm:inline text-background/40">|</span>
              <a
                href="mailto:zcreeto+zaika_gharana@gmail.com"
                className="flex items-center gap-2 text-background hover:text-background/80 transition-colors underline decoration-background/40 hover:decoration-background cursor-pointer"
              >
                <Mail className="w-5 h-5" />
                <span>zcreeto+zaika_gharana@gmail.com</span>
              </a>
            </div>
            
            <p className="text-sm text-background/60">
              © 2025 Zaika Gharana. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
