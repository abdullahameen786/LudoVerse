import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    // Added w-full and explicitly centered the inner max-w container
    <div className="w-full bg-slate-50/70 border-b border-slate-200/50 sticky top-0 z-50 backdrop-blur-md px-4">
      <nav className="flex items-center justify-between py-4 max-w-7xl mx-auto w-full">
        {/* Left Side: Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-500 flex items-center justify-center shadow-md">
            <div className="w-3 h-3 bg-white rounded-sm"></div>
          </div>
          <span className="text-2xl font-black text-slate-800 tracking-tight">
            Ludo<span className="text-indigo-600">Verse</span>
          </span>
        </Link>

        {/* Right Side: Links */}
        <div className="flex items-center gap-6 shrink-0">
          <Link
            to="/"
            className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors"
          >
            Home
          </Link>
          <Link
            to="/login"
            className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            Register
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
