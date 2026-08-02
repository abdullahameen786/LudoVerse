// src/pages/Game.jsx
import useAuth from "../hooks/useAuth";

function Game() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 bg-slate-50">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl border border-slate-100">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 text-3xl">
          🎲
        </div>
        
        <h1 className="text-2xl font-bold text-slate-800">
          Ludo Board Coming Soon
        </h1>
        
        <p className="mt-2 text-sm text-slate-500">
          Welcome, <span className="font-semibold text-indigo-600">{user?.displayName || "Player"}</span>! The real-time multiplayer board and gameplay mechanics are scheduled for Phase 4.
        </p>

        <button
          disabled
          aria-label="Roll Dice"
          className="mt-6 w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white opacity-50 cursor-not-allowed transition shadow-md shadow-indigo-100"
        >
          Roll Dice (Disabled)
        </button>
      </div>
    </div>
  );
}

export default Game;