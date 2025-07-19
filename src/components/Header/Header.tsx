import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/twocents-logo.png'


const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const navigate = useNavigate()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleLogoClick = () => {
    navigate('/')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsVisible(scrollTop > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Static Header - Always visible */}
      <header className="py-6 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            {/* Desktop Layout */}
            <div className="hidden md:flex items-center justify-between w-full border-[0.01vh] border-amber-200 text-white rounded-full py-3 px-8">
              {/* Logo and Brand */}
              <div 
                className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity duration-300"
                onClick={handleLogoClick}
              >
                <img src={logo} alt="TwoCents Logo" className="h-12 w-12" />
                <h1 className="text-2xl font-bold font-inter">TwoCents</h1>
              </div>

              {/* Desktop Menu */}
              <nav className="flex items-center space-x-8">
                <a href="#" className="text-white hover:text-amber-200 transition-colors duration-300 font-inter">
                  Home
                </a>
                <a href="#" className="text-white hover:text-amber-200 transition-colors duration-300 font-inter">
                About Us
                </a>
                <a href="#" className="text-white hover:text-amber-200 transition-colors duration-300 font-inter">
                Blog
                </a>
                <a href="#" className="text-white hover:text-amber-200 transition-colors duration-300 font-inter">
                Profile
                </a>
              </nav>
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden flex items-center justify-between w-full border-[0.01vh] border-amber-200 text-white rounded-full py-3 px-8">
              {/* Logo and Brand */}
              <div 
                className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity duration-300"
                onClick={handleLogoClick}
              >
                <img src={logo} alt="TwoCents Logo" className="h-12 w-12" />
                <h1 className="text-2xl font-bold font-inter">TwoCents</h1>
              </div>

              {/* Mobile Menu Button with SVG */}
              <button
                onClick={toggleMenu}
                className="text-white hover:text-amber-200 transition-colors duration-300"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <nav className="md:hidden mt-4 bg-black/20 backdrop-blur-sm rounded-lg border border-amber-200/20 p-4">
              <div className="flex flex-col space-y-4">
                <a 
                  href="#" 
                  className="text-white hover:text-amber-200 transition-colors duration-300 font-inter py-2 border-b border-amber-200/20"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </a>
                <a 
                  href="#" 
                  className="text-white hover:text-amber-200 transition-colors duration-300 font-inter py-2 border-b border-amber-200/20"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About Us
                </a>
                <a 
                  href="#" 
                  className="text-white hover:text-amber-200 transition-colors duration-300 font-inter py-2 border-b border-amber-200/20"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Blog
                </a>
                <a 
                  href="#" 
                  className="text-white hover:text-amber-200 transition-colors duration-300 font-inter py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </a>
              </div>
            </nav>
          )}
        </div>
      </header>

            {/* Sticky Header - Appears when scrolling */}
      <header className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className="py-6 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
              {/* Desktop Layout */}
              <div className={`hidden md:flex items-center justify-between w-full border-[0.01vh] border-amber-200 text-white rounded-full py-3 px-8 transition-all duration-300 ${
                isVisible ? 'backdrop-blur-md grayscale' : ''
              }`}>
            {/* Logo and Brand */}
            <div 
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity duration-300"
              onClick={handleLogoClick}
            >
              <img src={logo} alt="TwoCents Logo" className="h-12 w-12" />
              <h1 className="text-2xl font-bold font-inter">TwoCents</h1>
            </div>

            {/* Desktop Menu */}
            <nav className="flex items-center space-x-8">
              <a href="#" className="text-white hover:text-amber-200 transition-colors duration-300 font-inter">
                Lorem Ipsum
              </a>
              <a href="#" className="text-white hover:text-amber-200 transition-colors duration-300 font-inter">
                Lorem Ipsum
              </a>
              <a href="#" className="text-white hover:text-amber-200 transition-colors duration-300 font-inter">
                Amet Consectetur
              </a>
              <a href="#" className="text-white hover:text-amber-200 transition-colors duration-300 font-inter">
                Elit Sed
              </a>
            </nav>
          </div>

          {/* Mobile Layout */}
          <div className={`md:hidden flex items-center justify-between w-full border-[0.01vh] border-amber-200 text-white rounded-full py-3 px-8 transition-all duration-300 ${
            isVisible ? 'backdrop-blur-md grayscale' : ''
          }`}>
            {/* Logo and Brand */}
            <div 
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity duration-300"
              onClick={handleLogoClick}
            >
              <img src={logo} alt="TwoCents Logo" className="h-12 w-12" />
              <h1 className="text-2xl font-bold font-inter">TwoCents</h1>
            </div>

            {/* Mobile Menu Button with SVG */}
            <button
              onClick={toggleMenu}
              className="text-white hover:text-amber-200 transition-colors duration-300"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 bg-black/20 backdrop-blur-sm rounded-lg border border-amber-200/20 p-4">
            <div className="flex flex-col space-y-4">
              <a 
                href="#" 
                className="text-white hover:text-amber-200 transition-colors duration-300 font-inter py-2 border-b border-amber-200/20"
                onClick={() => setIsMenuOpen(false)}
              >
                Lorem Ipsum
              </a>
              <a 
                href="#" 
                className="text-white hover:text-amber-200 transition-colors duration-300 font-inter py-2 border-b border-amber-200/20"
                onClick={() => setIsMenuOpen(false)}
              >
                Dolor Sit
              </a>
              <a 
                href="#" 
                className="text-white hover:text-amber-200 transition-colors duration-300 font-inter py-2 border-b border-amber-200/20"
                onClick={() => setIsMenuOpen(false)}
              >
                Amet Consectetur
              </a>
              <a 
                href="#" 
                className="text-white hover:text-amber-200 transition-colors duration-300 font-inter py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Elit Sed
              </a>
            </div>
          </nav>
        )}
        </div>
      </div>
    </header>
    </>
  )
}

export default Header