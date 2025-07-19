import React, { useState } from "react";

export default function Main() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleEmailSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  return (
    <div className="relative z-10 container max-w-6xl mx-auto mt-10 lg:mt-20">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-0 items-center ">
        
        {/* Left Content */}
        <div className="space-y-6 lg:space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl lg:text-8xl font-inter font-extrabold leading-tighter tracking-[2px]">
              <span className="text-white/10 lg:block">YOUR </span>
              <span className="bg-gradient-to-r from-[#744608] to-[#7c5f0c] bg-clip-text text-transparent lg:block">USERNAME </span>
              <span className="text-white/10 lg:block">IS YOUR </span>
              <span className="bg-gradient-to-r from-[#744608] to-[#7c5f0c] bg-clip-text text-transparent lg:block">NET </span>
              <span className="bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent lg:block">WORTH<span className="text-white/10">.</span></span>
            </h1>
          </div>

          {/* Sign up buttons */}
          <div className="flex">
            <button className="flex-1 h-auto text-white inline-flex items-center justify-center bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 font-semibold lg:px-8 py-3 rounded-l-full text-[12px] lg:text-lg transition-all duration-300 transform hover:scale-105">
              <span className="ml-2">Sign up for iOS</span>
            </button>
            <button className="flex-1 h-auto inline-flex items-center justify-center border border-white/30 text-white hover:bg-white/10 font-semibold lg:px-8 py-3 rounded-r-full text-[12px] lg:text-lg transition-all duration-300">
              <span className="ml-2">Sign up for Android</span>
            </button>
          </div>

          {/* Email signup */}
          <form onSubmit={handleEmailSubmit} className="flex">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-l-full py-3 px-8 text-[12px] lg:text-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
            />
            <button 
              type="submit" 
              className="h-auto inline-flex items-center justify-center bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 rounded-r-full py-4 px-6 transition-all duration-300 transform hover:scale-105"
              disabled={isSubmitted}
            >
              {isSubmitted ? (
                <div className="w-4 h-4 lg:w-5 lg:h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span>→</span>
              )}
            </button>
          </form>

          {isSubmitted && (
            <p className="text-orange-300 font-medium">Thanks! We'll be in touch soon.</p>
          )}
        </div>

        {/* Right Content - Mobile Mockup */}
        <div className="relative flex justify-center lg:justify-end">
          <div className="relative transform rotate-3 hover:rotate-0 transition-transform duration-700">
            {/* Phone Frame */}
            <div className="w-80 h-[650px] bg-white/40 rounded-[3rem] p-1.5 shadow-2xl">
              <div className="w-full h-full bg-black rounded-[2.5rem] overflow-hidden relative">
                
                {/* Status Bar */}
                <div className="flex justify-between items-center px-6 py-3 text-white text-sm">
                  <span className="font-medium">9:41</span>
                  <div className="flex items-center gap-1">
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-white rounded-full"></div>
                      <div className="w-1 h-1 bg-white rounded-full"></div>
                      <div className="w-1 h-1 bg-white rounded-full"></div>
                      <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                    </div>
                    <div className="w-6 h-3 border border-white rounded-sm">
                      <div className="w-4 h-1.5 bg-white rounded-sm m-0.5"></div>
                    </div>
                  </div>
                </div>

                {/* App Header */}
                <div className="flex items-center justify-between px-6 py-3 border-b border-gray-800">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full flex items-center justify-center text-xs font-bold text-black">
                      2¢
                    </div>
                    <span className="text-white font-medium">twocents</span>
                  </div>
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-black text-xs font-bold">?</span>
                  </div>
                </div>

                {/* Posts */}
                <div className="space-y-1">
                  {/* Post 1 */}
                  <div className="px-6 py-4 border-b border-gray-800">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full flex items-center justify-center text-xs font-bold text-black">
                        M
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">Mortgage-Free Life</p>
                        <div className="flex items-center gap-2">
                          <span className="bg-yellow-500 text-black px-2 py-0.5 rounded-full text-xs font-bold">$58,430</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-white/80 text-sm mb-3">I can't believe some of you are still paying rent. Mortgage-free since 2019 💰</p>
                    <div className="flex items-center justify-between text-white/60 text-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <span>↗</span>
                          <span>4,200</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>💬</span>
                          <span>610</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>👁️</span>
                          <span>8,500</span>
                        </div>
                      </div>
                      <span>⋯</span>
                    </div>
                  </div>

                  {/* Post 2 */}
                  <div className="px-6 py-4 border-b border-gray-800">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-black">
                        H
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">Happiness &gt; Money</p>
                        <div className="flex items-center gap-2">
                          <span className="bg-yellow-500 text-black px-2 py-0.5 rounded-full text-xs font-bold">$2,994</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-white/80 text-sm mb-3">If you think being broke means being unhappy, you're not doing life right. Experiences &gt; money any day ✨</p>
                    <div className="flex items-center justify-between text-white/60 text-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <span>↗</span>
                          <span>15</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>💬</span>
                          <span>56</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>👁️</span>
                          <span>300</span>
                        </div>
                      </div>
                      <span>⋯</span>
                    </div>
                  </div>

                  {/* Post 3 */}
                  <div className="px-6 py-4 border-b border-gray-800">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                        S
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">Sold My Startup</p>
                        <div className="flex items-center gap-2">
                          <span className="bg-blue-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">$5</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-white/80 text-sm mb-3">I'm 25, no degree, and I just sold my first startup for $1M 🤯 What are you waiting for?</p>
                    <div className="flex items-center justify-between text-white/60 text-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <span>↗</span>
                          <span>126</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>💬</span>
                          <span>240</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>👁️</span>
                          <span>2,006</span>
                        </div>
                      </div>
                      <span>⋯</span>
                    </div>
                  </div>

                  {/* Post 4 */}
                  <div className="px-6 py-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                        W
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">World Traveler</p>
                        <div className="flex items-center gap-2">
                          <span className="bg-green-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">$3,322</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-white/80 text-sm mb-3">Quit my 9-to-5 to travel the world. Got $30k left.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}