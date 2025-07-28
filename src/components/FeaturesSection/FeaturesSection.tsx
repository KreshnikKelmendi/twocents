import React from "react";
import { FaEyeSlash, FaCheckCircle, FaTrophy } from "react-icons/fa";
import { IconType } from "react-icons";

const FeaturesSection = () => {
  const features: Array<{
    icon: IconType;
    title: string;
    description: string;
  }> = [
    {
      icon: FaEyeSlash,
      title: "Anonymous",
      description: "No email, name, phone number, or password required to create an account."
    },
    {
      icon: FaCheckCircle,
      title: "Verified",
      description: "Connect brokerages, bank accounts and crypto wallets to sum up your net worth."
    },
    {
      icon: FaTrophy,
      title: "Leaderboards",
      description: "Compare yourself to others with the same age, gender, location, and more."
    }
  ];

  return (
    <>
    <div className="relative z-10 container max-w-6xl mx-auto px-6 lg:px-0 py-24 ">
      {/* Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 mb-20">
        {features.map((feature, index) => {
          const IconComponent = feature.icon as React.ComponentType<{ size: number }>;
          return (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 lg:w-20 lg:h-20 flex items-center justify-center text-[#FEF4C8]">
                  <IconComponent size={52} />
                </div>
              </div>
              <h3 className="text-2xl lg:text-3xl font-inter text-[#FEF4C8] mb-3">{feature.title}</h3>
              <p className="text-[#FEF4C8] text-xs w-60 lg:w-full mx-auto font-inter font-extralight leading-relaxed">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Faded Text */}
      <div className="text-center">
        <h2 className="text-4xl lg:text-6xl xl:text-7xl font-inter font-bold text-white/10 tracking-wider">
          THE PEOPLE HAVE SPOKEN.
        </h2>
      </div>
    </div>
    <div className="h-[4px] w-full bg-gradient-to-r from-transparent via-yellow-500 to-transparent rounded-full hidden lg:block"></div>

    </>
  );
};

export default FeaturesSection; 