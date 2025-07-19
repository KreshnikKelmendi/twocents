import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import logo from '../assets/twocents-logo.png'

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoClick = () => {
    if (location.pathname.startsWith('/post/')) {
      navigate('/');
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-0">
      <div 
        className={`flex items-center gap-3 border-[0.01vh] border-amber-200 text-white rounded-full py-3 px-6 ${
          location.pathname.startsWith('/post/') ? 'cursor-pointer hover:bg-white/5 transition-all duration-200' : ''
        }`}
        onClick={handleLogoClick}
      >
        <img src={logo} alt="Logo" className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16" />
        <span className="text-lg sm:text-xl lg:text-2xl font-semibold">twocents</span>
        {location.pathname.startsWith('/post/') && (
          <span className="text-white/60 text-sm ml-auto">← Back to Home</span>
        )}
      </div>
    </div>
  )
}

export default Header