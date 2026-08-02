// src/pages/Home.jsx
import { Link } from "react-router-dom";

function Home() {
  return (
    <section className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight sm:text-6xl text-slate-900">
        Play Ludo Online <span className="text-indigo-600">With Friends</span>
      </h1>
      <p className="mt-6 max-w-xl text-lg text-slate-600">
        Experience the classic board game re-imagined with real-time multiplayer lobbies, smooth animations, and competitive rooms.
      </p>
      <div className="mt-10 flex gap-4">
        <Link
          to="/login"
          className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700 transition shadow-md shadow-indigo-100"
        >
          Play Now
        </Link>
        <Link
          to="/register"
          className="rounded-xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50 transition"
        >
          Create Account
        </Link>
      </div>
    </section>
  );
}

export default Home;