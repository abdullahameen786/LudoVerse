import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, Dice6 } from "lucide-react";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Game", path: "/game" },
  { name: "Login", path: "/login" },
  { name: "Register", path: "/register" },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `rounded-xl px-4 py-2 transition ${
      isActive
        ? "bg-indigo-600 text-white"
        : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
        <NavLink
          to="/"
          className="flex items-center gap-2 text-2xl font-bold text-indigo-600"
        >
          <Dice6 size={28} />
          LudoVerse
        </NavLink>

        {/* Desktop */}
        <nav className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={linkClass}
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Mobile Button */}
        <button
          aria-label="Toggle Navigation"
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-xl p-2 transition hover:bg-gray-100 md:hidden"
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`overflow-hidden transition-all duration-300 md:hidden ${
          menuOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <nav className="space-y-2 border-t bg-white p-4">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className={linkClass}
            >
              {link.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;