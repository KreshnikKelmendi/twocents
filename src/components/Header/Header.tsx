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
                <h1 className="text-2xl font-bold font-inter">twocents</h1>
              </div>

              {/* Desktop Menu */}
              <nav className="flex items-center space-x-8">
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="text-white hover:text-amber-200 transition-colors duration-300 font-inter bg-transparent border-none cursor-pointer"
                >
                  Home
                </button>
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="text-white hover:text-amber-200 transition-colors duration-300 font-inter bg-transparent border-none cursor-pointer"
                >
                  About Us
                </button>
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="text-white hover:text-amber-200 transition-colors duration-300 font-inter bg-transparent border-none cursor-pointer"
                >
                  Blog
                </button>
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="text-white hover:text-amber-200 transition-colors duration-300 font-inter bg-transparent border-none cursor-pointer"
                >
                  Profile
                </button>

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
                <h1 className="text-2xl font-bold font-inter">twocents</h1>
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
                <button 
                  className="text-white hover:text-amber-200 transition-colors duration-300 font-inter py-2 border-b border-amber-200/20 bg-transparent border-none cursor-pointer text-left"
                  onClick={() => {
                    setIsMenuOpen(false)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                >
                  Home
                </button>
                <button 
                  className="text-white hover:text-amber-200 transition-colors duration-300 font-inter py-2 border-b border-amber-200/20 bg-transparent border-none cursor-pointer text-left"
                  onClick={() => {
                    setIsMenuOpen(false)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                >
                  About Us
                </button>
                <button 
                  className="text-white hover:text-amber-200 transition-colors duration-300 font-inter py-2 border-b border-amber-200/20 bg-transparent border-none cursor-pointer text-left"
                  onClick={() => {
                    setIsMenuOpen(false)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                >
                  Blog
                </button>
                <button 
                  className="text-white hover:text-amber-200 transition-colors duration-300 font-inter py-2 bg-transparent border-none cursor-pointer text-left"
                  onClick={() => {
                    setIsMenuOpen(false)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                >
                  Profile
                </button>
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
              <h1 className="text-2xl font-bold font-inter">twocents</h1>
            </div>

            {/* Desktop Menu */}
            <nav className="flex items-center space-x-8">
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-white hover:text-amber-200 transition-colors duration-300 font-inter bg-transparent border-none cursor-pointer"
              >
                Home
              </button>
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-white hover:text-amber-200 transition-colors duration-300 font-inter bg-transparent border-none cursor-pointer"
              >
                About Us
              </button>
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-white hover:text-amber-200 transition-colors duration-300 font-inter bg-transparent border-none cursor-pointer"
              >
                Blog
              </button>
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-white hover:text-amber-200 transition-colors duration-300 font-inter bg-transparent border-none cursor-pointer"
              >
                Profile
              </button>

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
              <h1 className="text-2xl font-bold font-inter">twocents</h1>
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
              <button 
                className="text-white hover:text-amber-200 transition-colors duration-300 font-inter py-2 border-b border-amber-200/20 bg-transparent border-none cursor-pointer text-left"
                onClick={() => {
                  setIsMenuOpen(false)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              >
                Home
              </button>
              <button 
                className="text-white hover:text-amber-200 transition-colors duration-300 font-inter py-2 border-b border-amber-200/20 bg-transparent border-none cursor-pointer text-left"
                onClick={() => {
                  setIsMenuOpen(false)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              >
                About Us
              </button>
              <button 
                className="text-white hover:text-amber-200 transition-colors duration-300 font-inter py-2 border-b border-amber-200/20 bg-transparent border-none cursor-pointer text-left"
                onClick={() => {
                  setIsMenuOpen(false)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              >
                Blog
              </button>
              <button 
                className="text-white hover:text-amber-200 transition-colors duration-300 font-inter py-2 bg-transparent border-none cursor-pointer text-left"
                onClick={() => {
                  setIsMenuOpen(false)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              >
                Profile
              </button>

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