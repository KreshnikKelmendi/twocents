import React, { useState, useEffect } from "react";
import { motion, easeOut } from "framer-motion";
import heroImage from "../assets/hero.png";

export default function Main() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeButton, setActiveButton] = useState<"ios" | "android" | null>("ios");
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleEmailSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  const handleButtonClick = (platform: "ios" | "android") => {
    setActiveButton(platform);
  };

  // Animation variants for word-by-word animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const wordVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.8
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: easeOut,
      }
    },
  };

  // Split the text into words while preserving line breaks
  const headingWords = [
    { text: "YOUR", className: "text-white/10 lg:block" },
    { text: "USERNAME", className: "bg-gradient-to-r from-[#744608] to-[#7c5f0c] bg-clip-text text-transparent lg:block" },
    { text: "IS YOUR", className: "text-white/10 lg:block" },
    { text: "NET", className: "bg-gradient-to-r from-[#744608] to-[#7c5f0c] bg-clip-text text-transparent lg:block" },
    { text: "WORTH.", className: "bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent lg:block" },
  ];

  return (
    <>
    <div className="relative z-10 container max-w-6xl px-6 lg:px-0 mx-auto mt-10 lg:mt-20">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-0">
        
        {/* Left Content */}
        <div className="space-y-6 lg:space-y-8">
          <div className="space-y-4">
            <motion.h1 
              className="text-5xl lg:text-8xl font-inter font-extrabold leading-tighter lg:tracking-[2px]"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {headingWords.map((word, index) => (
                <motion.span
                  key={index}
                  className={word.className}
                  variants={wordVariants}
                >
                  {word.text}{" "}
                </motion.span>
              ))}
            </motion.h1>
          </div>

          {/* Sign up buttons */}
          <div className="flex">
            <button 
              className={`flex-1 h-auto text-white inline-flex items-center justify-center font-semibold lg:px-8 py-3 rounded-l-full text-[12px] lg:text-lg transition-all duration-300 transform hover:scale-105 ${
                activeButton === "ios" 
                  ? "bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600" 
                  : "border border-white/30 hover:bg-white/10"
              }`}
              onClick={() => handleButtonClick("ios")}
            >
              <svg className="w-4 h-4 lg:w-5 lg:h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <span>Sign up for iOS</span>
            </button>
            <button 
              className={`flex-1 h-auto inline-flex items-center justify-center font-semibold lg:px-8 py-3 rounded-r-full text-[12px] lg:text-lg transition-all duration-300 ${
                activeButton === "android" 
                  ? "bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white transform hover:scale-105" 
                  : "border border-white/30 text-white hover:bg-white/10"
              }`}
              onClick={() => handleButtonClick("android")}
            >
              <svg className="w-4 h-4 lg:w-5 lg:h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993.0001.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.5036C15.5902 8.2432 13.8533 7.5 12 7.5s-3.5902.7432-5.1377 1.92L4.8401 5.9164a.416.416 0 00-.5676-.1521.416.416 0 00-.1521.5676L5.1178 9.3214C2.6889 11.1868 1.5 13.9121 1.5 17v.5c0 .8284.6716 1.5 1.5 1.5h19c.8284 0 1.5-.6716 1.5-1.5V17c0-3.0879-1.1889-5.8132-3.6178-7.6786"/>
              </svg>
              <span>Sign up for Android</span>
            </button>
          </div>

          {/* Email signup */}
          <form onSubmit={handleEmailSubmit} className="relative">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              className="w-full bg-transparent border border-white/30 text-white placeholder:text-white/50 rounded-full py-3 px-8 pr-16 text-[12px] lg:text-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:outline-none transition-all duration-300"
            />
                       <button 
              type="submit" 
              className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 lg:h-12 lg:w-12 flex items-center justify-center bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 rounded-full transition-all duration-300 hover:scale-105 text-white font-semibold"
              disabled={isSubmitted}
            >
              {isSubmitted ? (
                <div className="w-3 h-3 lg:w-5 lg:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span>&gt;</span>
              )}
            </button>


          </form>

          {isSubmitted && (
            <p className="text-orange-300 font-medium">Thanks! We'll be in touch soon.</p>
          )}
        </div>

        {/* Right Content - Hero Image */}
        <div className="relative flex justify-center lg:justify-end">
          <div className="relative">
            <img 
              src={heroImage} 
              alt="TwoCents App" 
              className="rounded-[3rem]"
              style={{
                transform: window.innerWidth >= 1024 ? `translateY(${-scrollY * 0.3}px)` : 'none',
                transition: 'transform 0.1s ease-out'
              }}
            />
          </div>
        </div>
      </div>
    </div>
    <div className="h-[4px] w-full bg-gradient-to-r from-transparent via-yellow-500 to-transparent rounded-full hidden lg:block"></div>
    </>
  );
}