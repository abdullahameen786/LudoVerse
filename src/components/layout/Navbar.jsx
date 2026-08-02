// src/components/layout/Navbar.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-wider bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">
              LudoVerse
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition">
              Home
            </Link>
            {user && (
              <>
                <Link to="/dashboard" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition">
                  Dashboard
                </Link>
                <Link to="/game" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition">
                  Game
                </Link>
              </>
            )}
            
            <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
              {user ? (
                <button
                  onClick={handleLogout}
                  aria-label="Sign Out"
                  className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                >
                  Sign Out
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition shadow-md shadow-indigo-100"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              className="inline-flex items-center justify-center rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Backdrop & Drawer */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop overlay */}
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setIsOpen(false)} />

          {/* Sliding Drawer Container */}
          <div className="relative ml-auto flex h-full w-full max-w-xs flex-col bg-white p-6 shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between mb-8">
              <span className="text-xl font-black text-indigo-600">LudoVerse</span>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
                className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <Link to="/" onClick={() => setIsOpen(false)} className="text-lg font-medium text-slate-700 hover:text-indigo-600">
                Home
              </Link>
              {user && (
                <>
                  <Link to="/dashboard" onClick={() => setIsOpen(false)} className="text-lg font-medium text-slate-700 hover:text-indigo-600">
                    Dashboard
                  </Link>
                  <Link to="/game" onClick={() => setIsOpen(false)} className="text-lg font-medium text-slate-700 hover:text-indigo-600">
                    Game
                  </Link>
                </>
              )}
              
              <hr className="my-4 border-slate-100" />

              {user ? (
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-lg font-medium text-red-600 hover:text-red-700"
                >
                  Sign Out
                </button>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex justify-center rounded-xl border border-slate-200 py-3 font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="flex justify-center rounded-xl bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-700 shadow-md shadow-indigo-100"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;