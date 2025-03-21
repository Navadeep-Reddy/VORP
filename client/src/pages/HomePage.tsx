import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Truck, BarChart3, Clock, Users, CheckCircle, LucideIcon } from 'lucide-react';

import Navbar from '../components/Navbar';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.8,
      when: "beforeChildren",
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

// Button component enhanced with Framer Motion
interface ButtonProps {
  primary: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}
const Button = ({ primary, children, className = '', onClick }: ButtonProps) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`px-6 py-3 rounded-md font-medium transition-all duration-300 flex items-center gap-2 ${
        primary
          ? 'bg-AccYellow text-white hover:bg-LightBlue shadow-lg hover:shadow-xl'
          : 'bg-white text-secBlue border border-secBlue hover:bg-blue-50'
      } ${className}`}
    >
      {children}
    </motion.button>
  );
};

// Feature Card component with hover animation
interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  direction?: 'left' | 'right';
}
const FeatureCard = ({ icon, title, description, direction = 'left' }: FeatureCardProps) => {
  const Icon = icon;
  return (
    <motion.div 
      className="bg-white p-6 rounded-xl shadow-md flex flex-col items-start"
      initial={{ x: direction === 'left' ? -100 : 100, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.0, ease: 'easeOut' }}
      whileHover={{ scale: 1.03, boxShadow: "0px 8px 20px rgba(0,0,0,0.1)" }}
    >
      <div className="p-3 bg-blue-100 rounded-lg mb-4">
        <Icon className="text-secBlue" size={24} />
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};
// Updated RouteAnimation Component with Enhanced Visibility and Effects
const RouteAnimation = () => {
  return (
    <motion.div 
      className="absolute top-0 right-0 left-0 bottom-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }} // Adjust z-index if needed to ensure proper layering
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.3, transition: { duration: 2, ease: "easeInOut" } }}
    >
      <motion.svg
        viewBox="0 0 1000 1000"
        className="w-full h-full"
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }}
      >
        <motion.path
          d="M200,200 C300,100 400,500 500,300 S700,600 800,400"
          stroke="#2563EB"
          strokeWidth="8"
          fill="none"
          strokeDasharray="20,20"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 0] }}
          transition={{ duration: 4, ease: "easeInOut", repeat: Infinity, repeatType: "loop" }}
          style={{ filter: "drop-shadow(0 0 8px rgba(37,99,235,0.8))" }}
        />
        <circle cx="200" cy="200" r="15" fill="#2563EB" style={{ filter: "drop-shadow(0 0 8px rgba(37,99,235,0.8))" }}/>
        <circle cx="500" cy="300" r="10" fill="#2563EB" style={{ filter: "drop-shadow(0 0 8px rgba(37,99,235,0.8))" }}/>
        <circle cx="800" cy="400" r="10" fill="#2563EB" style={{ filter: "drop-shadow(0 0 8px rgba(37,99,235,0.8))" }}/>
      </motion.svg>
    </motion.div>
  );
};


// Testimonial component with simple fade-in animation
interface TestimonialProps {
  quote: string;
  author: string;
  company: string;
}
const Testimonial = ({ quote, author, company }: TestimonialProps) => {
  return (
    <motion.div className="bg-white p-6 rounded-xl shadow-md" variants={itemVariants}>
      <p className="text-gray-600 italic mb-4">"{quote}"</p>
      <div className="flex items-center">
        <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
        <div>
          <p className="font-bold">{author}</p>
          <p className="text-gray-500 text-sm">{company}</p>
        </div>
      </div>
    </motion.div>
  );
};

const HomePage = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll event for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 relative overflow-hidden">
          <RouteAnimation />
          <motion.div 
            className="container mx-auto max-w-8xl relative"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex flex-col md:flex-row items-center justify-between">
              <motion.div className="md:w-1/2 mb-10 md:mb-0 mx-5" variants={itemVariants}>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Smart Route Optimization for Your Fleet
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  VORP (Vehicle Optimal Route Planner) solves complex vehicle routing problems in seconds. Reduce costs, save time, and increase efficiency with our advanced and interactive, first of its kind CVRP solution.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button primary={true} className="text-lg px-8 py-4" onClick={() => {}}>
                    Try It Now <ArrowRight size={18} />
                  </Button>
                  <Button primary={false} className="text-lg" onClick={() => {}}>
                    Watch Demo
                  </Button>
                </div>
                <div className="mt-8 flex items-center">
                  <div className="flex -space-x-2">
                    <div className="w-10 h-10 rounded-full bg-blue-200"></div>
                    <div className="w-10 h-10 rounded-full bg-blue-300"></div>
                    <div className="w-10 h-10 rounded-full bg-blue-400"></div>
                  </div>
                  <p className="ml-4 text-gray-600">
                    <span className="font-bold text-secBlue">Optimize</span> your business today!
                  </p>
                </div>
              </motion.div>
              <motion.div className="md:w-1/2 relative" variants={itemVariants}>
                <div className="bg-white p-4 rounded-xl shadow-xl">
                  <div className="bg-gray-100 rounded-lg aspect-video relative overflow-hidden">
                    {/* Map placeholder */}
                    <div className="absolute inset-0 bg-blue-50">
                      <svg viewBox="0 0 500 300" className="w-full h-full">
                        <rect x="0" y="0" width="500" height="300" fill="#EFF6FF" />
                        <circle cx="250" cy="150" r="10" fill="#2563EB" /> {/* Depot */}
                        <circle cx="100" cy="100" r="5" fill="#3B82F6" /> {/* Stop */}
                        <circle cx="150" cy="200" r="5" fill="#3B82F6" /> {/* Stop */}
                        <circle cx="300" cy="80" r="5" fill="#3B82F6" /> {/* Stop */}
                        <circle cx="400" cy="220" r="5" fill="#3B82F6" /> {/* Stop */}
                        <circle cx="350" cy="150" r="5" fill="#3B82F6" /> {/* Stop */}
                        <path d="M250,150 L100,100 L150,200 L250,150" stroke="#2563EB" strokeWidth="2" fill="none" />
                        <path d="M250,150 L300,80 L350,150 L400,220 L250,150" stroke="#93C5FD" strokeWidth="2" fill="none" />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500">Total Distance</p>
                      <p className="text-lg font-bold text-gray-800">284.5 km</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500">Routes</p>
                      <p className="text-lg font-bold text-gray-800">2</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500">Cost Saved</p>
                      <p className="text-lg font-bold text-gray-800">18.3%</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

                
        <section id="features" className="py-20 px-4 bg-white">
          <motion.div className="container mx-auto max-w-6xl" variants={containerVariants} initial="hidden" animate="visible">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">VORP's Powerful Features</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our platform provides everything you need to optimize your fleet operations and reduce transportation costs.
              </p>
            </div>
            <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={Truck}
                title="Capacitated Routing"
                description="Optimize routes while considering vehicle capacity constraints and customer demands."
                direction="left"
              />
              <FeatureCard
                icon={Clock}
                title="Real-time Updates"
                description="Adapt to changing conditions with dynamic routing adjustments as new orders arrive."
                direction="right"
              />
              <FeatureCard
                icon={BarChart3}
                title="Analytics Dashboard"
                description="Gain insights into your fleet performance with comprehensive analytics."
                direction="left"
              />
              <FeatureCard
                icon={Users}
                title="Multi-team Access"
                description="Collaborate across teams with role-based access and shared visibility."
                direction="right"
              />
              <FeatureCard
                icon={CheckCircle}
                title="Constraint Management"
                description="Handle complex constraints like time windows, driver breaks, and special delivery requirements."
                direction="left"
              />
              <FeatureCard
                icon={Truck}
                title="Fleet Management"
                description="Manage your entire fleet including vehicle types, capacities, and availability."
                direction="right"
              />
            </motion.div>
          </motion.div>
        </section>

        {/* How it Works Section */}
        <section id="how-it-works" className="py-20 px-4 bg-gray-50">
          <motion.div className="container mx-auto max-w-6xl" variants={containerVariants} initial="hidden" animate="visible">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">How VORP Works</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Get started in just a few simple steps and transform your logistics operations
              </p>
            </div>
            <motion.div className="grid md:grid-cols-3 gap-8">
              {["Upload Your Data", "Set Constraints", "Optimize & Deploy"].map((step, index) => (
                <motion.div key={index} className="bg-white p-6 rounded-xl shadow-md relative" variants={itemVariants}>
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-secBlue rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-bold mb-4 mt-2">{step}</h3>
                  <p className="text-gray-600">
                    {index === 0 && "Upload customer locations, demands, and your vehicle fleet information."}
                    {index === 1 && "Define your specific constraints such as vehicle capacities, time windows, and other requirements."}
                    {index === 2 && "Get optimal routes instantly and deploy them to your drivers through our mobile app."}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* Testimonials */}
        <section className="py-20 px-4 bg-white">
          <motion.div className="container mx-auto max-w-6xl" variants={containerVariants} initial="hidden" animate="visible">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">What VORP Users Say</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Companies of all sizes are saving time and money with VORP
              </p>
            </div>
            <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Testimonial
                quote="We reduced our delivery costs by 23% in the first month. The optimization algorithm is incredibly efficient."
                author="Sarah Johnson"
                company="Logistics Director, FastDelivery Inc."
              />
              <Testimonial
                quote="The interface is intuitive and the results are outstanding. Our drivers complete more deliveries with less fuel consumption."
                author="Michael Chen"
                company="Fleet Manager, GreenTransport"
              />
              <Testimonial
                quote="Finally a solution that actually works for complex routing problems. Customer support is also excellent."
                author="David Williams"
                company="CEO, Regional Distributors"
              />
            </motion.div>
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-secBlue text-white">
          <motion.div className="container mx-auto max-w-6xl text-center" variants={containerVariants} initial="hidden" animate="visible">
            <h2 className="text-3xl font-bold mb-6">Ready to optimize your fleet with VORP?</h2>
            <p className="text-xl mb-10 max-w-2xl mx-auto opacity-90">
              Join hundreds of companies that are saving time and money with VORP's route optimization platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button primary={false} className="bg-white text-secBlue hover:bg-blue-50 text-lg" onClick={() => {}}>
                Schedule Demo
              </Button>
              <Button primary={true} className="bg-blue-800 hover:bg-blue-900 text-lg" onClick={() => {}}>
                Start Free Trial <ArrowRight size={18} />
              </Button>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-800 text-gray-300 py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center mb-4">
                  <Truck className="text-blue-400 mr-2" size={24} />
                  <span className="font-bold text-xl text-white">VORP</span>
                </div>
                <p className="mb-4">
                  VORP (Vehicle Optimal Route Planner) - Smart route optimization for your fleet using advanced CVRP algorithms.
                </p>
                <div className="flex gap-4">
                  <a href="#" className="text-gray-400 hover:text-white">
                    {/* Twitter SVG */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white">
                    {/* LinkedIn SVG */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-white mb-4">Product</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Case Studies</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-white mb-4">Company</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-white mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">API Documentation</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Tutorials</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                </ul>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-gray-700 text-center text-sm">
              <p>&copy; {new Date().getFullYear()} VORP. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>

      {/* Additional navigation items if needed */}
      <div className='flex space-x-4 px-10'>
        <li className='text-lg text-WhiteText'>Home</li>
        <li className='text-lg text-WhiteText'>About</li>
        <li className='text-lg text-WhiteText'>Contact</li>
      </div>
    </div>
  );
};

export default HomePage;
