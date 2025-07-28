import React from 'react';
import logo from '../assets/twocents-logo.png';

const Footer: React.FC = () => {
  return (
    <footer className="text-white py-16 mt-auto relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Main footer content */}
        <div className="flex flex-col lg:flex-row lg:justify-between gap-8 mb-12">
          {/* Brand section */}
          <div className="text-center lg:text-left lg:max-w-md">
            <div className="flex items-center justify-center lg:justify-start mb-4">
              <img src={logo} alt="TwoCents Logo" className="h-10 w-auto mr-3" />
              <h3 className="text-2xl font-bold font-inter bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                twocents
              </h3>
            </div>
            <p className="text-gray-400 text-sm font-inter font-light leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
            </p>
          </div>
          
          {/* Links sections */}
          <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
            {/* Quick links */}
            <div className="text-center lg:text-left">
              <h4 className="text-lg font-semibold font-inter mb-4 text-white">Quick Links</h4>
              <div className="space-y-3">
                <a href="#" className="block text-gray-400 hover:text-white transition-all duration-300 font-inter text-sm hover:translate-x-1">
                  Lorem Ipsum
                </a>
                <a href="#" className="block text-gray-400 hover:text-white transition-all duration-300 font-inter text-sm hover:translate-x-1">
                  Lorem Ipsum
                </a>
                <a href="#" className="block text-gray-400 hover:text-white transition-all duration-300 font-inter text-sm hover:translate-x-1">
                  Lorem Ipsum
                </a>
                <a href="#" className="block text-gray-400 hover:text-white transition-all duration-300 font-inter text-sm hover:translate-x-1">
                  Lorem Ipsum
                </a>
              </div>
            </div>
            
            {/* Social & Community */}
            <div className="text-center lg:text-left">
              <h4 className="text-lg font-semibold font-inter mb-4 text-white">Community</h4>
              <div className="space-y-3">
                <a href="#" className="block text-gray-400 hover:text-white transition-all duration-300 font-inter text-sm hover:translate-x-1">
                  Lorem Ipsum
                </a>
                <a href="#" className="block text-gray-400 hover:text-white transition-all duration-300 font-inter text-sm hover:translate-x-1">
                  Lorem Ipsum
                </a>
                <a href="#" className="block text-gray-400 hover:text-white transition-all duration-300 font-inter text-sm hover:translate-x-1">
                  Lorem Ipsum
                </a>
                <a href="#" className="block text-gray-400 hover:text-white transition-all duration-300 font-inter text-sm hover:translate-x-1">
                  Lorem Ipsum
                </a>
              </div>
            </div>
            
            {/* Resources */}
            <div className="text-center lg:text-left">
              <h4 className="text-lg font-semibold font-inter mb-4 text-white">Resources</h4>
              <div className="space-y-3">
                <a href="#" className="block text-gray-400 hover:text-white transition-all duration-300 font-inter text-sm hover:translate-x-1">
                  Lorem Ipsum
                </a>
                <a href="#" className="block text-gray-400 hover:text-white transition-all duration-300 font-inter text-sm hover:translate-x-1">
                  Lorem Ipsum
                </a>
                <a href="#" className="block text-gray-400 hover:text-white transition-all duration-300 font-inter text-sm hover:translate-x-1">
                  Lorem Ipsum
                </a>
                <a href="#" className="block text-gray-400 hover:text-white transition-all duration-300 font-inter text-sm hover:translate-x-1">
                  Lorem Ipsum
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom section */}
        <div className="border-t border-gray-800/50 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm font-inter text-center md:text-left">
              © 2025 TwoCents. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 font-inter text-sm">
                Lorem Ipsum
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 font-inter text-sm">
                Lorem Ipsum
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 font-inter text-sm">
                Lorem Ipsum
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 