// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    // ✅ Reduced horizontal padding on mobile (px-2 md:px-4)
    <div className="w-full bg-slate-50/70 border-b border-slate-200/50 sticky top-0 z-50 backdrop-blur-md px-2 md:px-4">
      <nav className="flex items-center justify-between py-3 md:py-4 max-w-7xl mx-auto w-full">
        
        {/* Left Side: Logo */}
        <Link to="/" className="flex items-center gap-1.5 md:gap-2 shrink-0">
          <div className="w-6 h-6 md:w-8 md:h-8 rounded-md md:rounded-lg bg-gradient-to-br from-indigo-600 to-violet-500 flex items-center justify-center shadow-md">
            <div className="w-2 h-2 md:w-3 md:h-3 bg-white rounded-sm"></div>
          </div>
          <span className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
            Ludo<span className="text-indigo-600">Verse</span>
          </span>
        </Link>
        
        {/* Right Side: Links */}
        <div className="flex items-center gap-3 md:gap-6 shrink-0">
          {/* ✅ Hidden 'Home' text on extremely small screens to save space */}
          <Link to="/" className="hidden sm:block text-xs md:text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">
            Home
          </Link>
          <Link to="/login" className="text-xs md:text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">
            Login
          </Link>
          <Link to="/register" className="px-3 py-2 md:px-5 md:py-2.5 rounded-lg md:rounded-xl bg-indigo-600 text-white text-xs md:text-sm font-bold hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
            Register
          </Link>
        </div>

      </nav>
    </div>
  );
}

export default Navbar;