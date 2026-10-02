import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, ChefHat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';

export const Navbar = () => {
  const { getTotalItems } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const totalItems = getTotalItems();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold bg-gradient-warm bg-clip-text text-transparent">
              Zaika Gharana
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#menu" className="text-foreground hover:text-primary transition-colors">
              Menu
            </a>
            <a href="#biryanis" className="text-foreground hover:text-primary transition-colors">
              Biryanis
            </a>
            <a href="#about" className="text-foreground hover:text-primary transition-colors">
              About
            </a>
            <Link to="/chat">
              <Button variant="ghost" size="sm">
                <ChefHat className="w-4 h-4 mr-2" />
                Food Guide
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="ghost" size="sm">
                <User className="w-4 h-4 mr-2" />
                Account
              </Button>
            </Link>
            <Link to="/cart">
              <Button variant="outline" size="sm" className="relative">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Cart
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300",
            isOpen ? "max-h-64" : "max-h-0"
          )}
        >
          <div className="py-4 space-y-4">
            <a
              href="#menu"
              className="block text-foreground hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Menu
            </a>
            <a
              href="#biryanis"
              className="block text-foreground hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Biryanis
            </a>
            <a
              href="#about"
              className="block text-foreground hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              About
            </a>
            <Link to="/chat" onClick={() => setIsOpen(false)}>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <ChefHat className="w-4 h-4 mr-2" />
                Food Guide
              </Button>
            </Link>
            <Link to="/auth" onClick={() => setIsOpen(false)}>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <User className="w-4 h-4 mr-2" />
                Account
              </Button>
            </Link>
            <Link to="/cart" onClick={() => setIsOpen(false)}>
              <Button variant="outline" size="sm" className="relative w-full">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Cart
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
