// src/components/layout/Footer.jsx
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="w-full bg-white border-t border-slate-100 py-8 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="text-center sm:text-left">
          <span className="text-lg font-bold text-slate-800 tracking-wide">LudoVerse</span>
          <p className="text-xs text-slate-400 mt-1">&copy; {new Date().getFullYear()} LudoVerse. All rights reserved.</p>
        </div>

        {/* Links */}
        <div className="flex gap-6 text-sm font-medium text-slate-500">
          <Link to="/" className="hover:text-indigo-600 transition">Terms</Link>
          <Link to="/" className="hover:text-indigo-600 transition">Privacy</Link>
          <Link to="/" className="hover:text-indigo-600 transition">Contact Support</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;