import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  // Mobile menu open/close status toggle karne ke liye state hook
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full bg-slate-50/80 border-b border-slate-200/60 sticky top-0 z-50 backdrop-blur-md px-4">
      <div className="max-w-7xl mx-auto w-full">
        
        {/* Main Visible Header Row */}
        <nav className="flex items-center justify-between py-3.5 md:py-4">
          
          {/* Left Side: Logo Branding */}
          <Link to="/" className="flex items-center gap-2 shrink-0" onClick={() => setIsOpen(false)}>
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-500 flex items-center justify-center shadow-md">
              <div className="w-2.5 h-2.5 bg-white rounded-xs"></div>
            </div>
            <span className="text-xl font-black text-slate-800 tracking-tight">
              Ludo<span className="text-indigo-600">Verse</span>
            </span>
          </Link>
          
          {/* Desktop Right Side: Standard Visible Links (Hidden on Mobile) */}
          <div className="hidden md:flex items-center gap-6 shrink-0">
            <Link to="/" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">
              Home
            </Link>
            <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">
              Login
            </Link>
            <Link to="/register" className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
              Register
            </Link>
          </div>

          {/* Mobile Hamburg Trigger Action (Hidden on Desktop) */}
          <div className="flex md:hidden items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              type="button"
              className="p-1 text-slate-600 hover:text-indigo-600 focus:outline-none transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {isOpen ? (
                // ❌ Close "X" Cross vector symbol when open
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                // 🍔 Hamburger "3 Bars" vector symbol when closed
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
          
        </nav>

        {/* 📱 MOBILE DROPDOWN DRAWER PANEL (Toggled via State Logic) */}
        {isOpen && (
          <div className="md:hidden border-t border-slate-100 py-4 space-y-3 animate-fade-in origin-top">
            <Link 
              to="/" 
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-all"
            >
              Home
            </Link>
            <Link 
              to="/login" 
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-all"
            >
              Login
            </Link>
            <div className="pt-2 px-4">
              <Link 
                to="/register" 
                onClick={() => setIsOpen(false)}
                className="block text-center w-full px-5 py-3 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-all shadow-md active:scale-98"
              >
                Register Account
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Navbar;