import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import twocentsLogo from '../assets/twocents-logo.png';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [loadingNumber, setLoadingNumber] = useState(0);

  useEffect(() => {
    // Animate loading number from 0 to 100 over 3000ms
    const startTime = Date.now();
    const duration = 3000;
    
    const updateNumber = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const number = Math.floor(progress * 100);
      setLoadingNumber(number);
      
      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      }
    };
    
    requestAnimationFrame(updateNumber);

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onLoadingComplete, 1200); // Longer exit animation
    }, 3000);

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#302209] via-[#302209] to-[#302209]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: 1.5, 
            ease: [0.25, 0.46, 0.45, 0.94] 
          }}
        >
          {/* Loading number counter - bottom right */}
          <motion.div
            className="absolute bottom-5 right-5"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ 
              delay: 0.5,
              duration: 1,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            <motion.div
              className="text-6xl font-bold text-gray-300"
              key={loadingNumber}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {loadingNumber}
            </motion.div>
          </motion.div>

          <motion.div
            className="flex flex-col items-center space-y-10"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ 
              duration: 2, 
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: 0.3
            }}
          >
            {/* Logo with ultra-smooth animation */}
            <motion.div
              className="relative"
              initial={{ y: 50, scale: 0.7, opacity: 0 }}
              animate={{ 
                y: 0,
                scale: 1,
                opacity: 1
              }}
              transition={{ 
                duration: 2.5,
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 0.6
              }}
            >
              <motion.img
                src={twocentsLogo}
                alt="TwoCents Logo"
                className="w-40 h-40 object-contain"
                initial={{ filter: "brightness(0.6)" }}
                animate={{ 
                  filter: "brightness(1)",
                }}
                transition={{ 
                  duration: 3,
                  ease: [0.25, 0.46, 0.45, 0.94],
                  delay: 1
                }}
              />
              
              {/* Very subtle glow effect */}
              <motion.div
                className="absolute inset-0 rounded-full"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: [0, 0.15, 0],
                  scale: [0.8, 1.1, 0.8]
                }}
                transition={{ 
                  duration: 4,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: 1.5
                }}
                style={{
                  background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 80%)",
                  filter: "blur(25px)"
                }}
              />
            </motion.div>

            {/* Loading text with smooth entrance */}
            <motion.div
              className="text-center"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ 
                delay: 1.2, 
                duration: 1.5,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            >
              <motion.h1
                className="text-3xl font-bold text-white mb-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ 
                  delay: 1.5,
                  duration: 1.2,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
              >
                twocents
              </motion.h1>
              <motion.p
                className="text-gray-300 text-xs"
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ 
                  delay: 1.8, 
                  duration: 1.2,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
              >
                Loading your experience...
              </motion.p>
            </motion.div>

            {/* Ultra-smooth loading dots */}
            <motion.div
              className="flex space-x-4"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ 
                delay: 2.1, 
                duration: 1.2,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            >
              {[0, 1, 2].map((index) => (
                <motion.div
                  key={index}
                  className="w-3 h-3 bg-white rounded-full"
                  initial={{ scale: 0, opacity: 0, y: 10 }}
                  animate={{
                    scale: [0, 1.2, 0.9, 1],
                    opacity: [0, 1, 0.8, 1],
                    y: [10, -5, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.4,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen; 