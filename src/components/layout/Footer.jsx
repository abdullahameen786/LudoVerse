import { NavLink } from "react-router-dom";
import { Dice6 } from "lucide-react";

function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <div className="flex items-center gap-2 text-2xl font-bold text-indigo-600">
              <Dice6 />
              LudoVerse
            </div>

            <p className="mt-4 max-w-sm text-gray-600">
              Play Ludo online with your friends anytime, anywhere.
              Fast, beautiful and responsive.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Quick Links</h3>

            <div className="flex flex-col gap-3">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/game">Game</NavLink>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} LudoVerse. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;