import React, { useState, useEffect } from 'react';
import { Truck, ArrowRight, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ButtonProps {
  primary: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Button = ({ primary, children, className = '', onClick }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-md font-medium transition-all duration-300 flex items-center gap-2 ${
        primary 
          ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl' 
          : 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50'
      } ${className}`}
    >
      {children}
    </button>
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    // Set initial state
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md py-3' : 'bg-white py-5'
    }`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <Truck className="text-blue-600 mr-2" size={28} />
          <span className="font-bold text-xl text-gray-800">VORP</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-6 items-center">
          <Link to="/map" className="text-gray-600 hover:text-blue-600 transition-colors">Map</Link>
          <Link to="/about" className="text-gray-600 hover:text-blue-600 transition-colors">About</Link>
          <Link to="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</Link>
          <Button primary={false} onClick={() => {}}>Log In</Button>
          <Button primary={true} onClick={() => {}}>
            Get Started
            <ArrowRight size={16} />
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-600"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <Link 
              to="/map" 
              className="block text-gray-600 hover:text-blue-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Map
            </Link>
            <Link 
              to="/about" 
              className="block text-gray-600 hover:text-blue-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="block text-gray-600 hover:text-blue-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="pt-4 space-y-2">
              <Button primary={false} className="w-full" onClick={() => {}}>Log In</Button>
              <Button primary={true} className="w-full" onClick={() => {}}>
                Get Started
                <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;