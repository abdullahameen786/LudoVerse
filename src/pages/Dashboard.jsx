// src/pages/Dashboard.jsx
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Leaderboard from "../components/game/Leaderboard.jsx";

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Safely extract display name and initial for the avatar
  const displayName = user?.displayName || user?.email?.split('@')[0] || "Player";
  const userInitial = displayName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Failed to log out", err);
    }
  };

  return (
    <div className="min-h-[calc(100vh-76px)] w-full bg-slate-50 relative py-12 px-4 sm:px-6 overflow-hidden flex flex-col items-center">
      
      {/* 🔮 Background Ambient Glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[80%] max-w-2xl h-[300px] bg-indigo-400/15 blur-[100px] rounded-full pointer-events-none z-0"></div>

      <div className="w-full max-w-4xl space-y-10 relative z-10">
        
        {/* 🌟 MAIN WELCOME DASHBOARD CARD */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 md:p-12 shadow-2xl shadow-indigo-100/40 border border-white text-center relative overflow-hidden group">
          
          {/* Subtle Card Background Decoration */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-indigo-100 to-violet-50 rounded-full blur-2xl opacity-60 pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>

          {/* Dynamic User Avatar */}
          <div className="relative mx-auto w-20 h-20 mb-6 transform -rotate-3 hover:rotate-0 transition-all duration-300">
            <div className="absolute inset-0 bg-indigo-500 rounded-2xl blur-md opacity-40 translate-y-1"></div>
            <div className="relative w-full h-full bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-inner border border-white/20">
              {userInitial}
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-slate-800 mb-3 tracking-tight">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">{displayName}</span>!
          </h1>
          <p className="text-slate-500 font-medium mb-8 max-w-md mx-auto text-sm md:text-base">
            Your tokens are rested and ready. Step into the arena and dominate the global leaderboards today.
          </p>
          
          {/* Action Buttons Hub */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <button 
              onClick={() => navigate("/game")} 
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-indigo-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              Enter Game Lobby
            </button>
            <button 
              onClick={handleLogout} 
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white border-2 border-slate-200 hover:border-rose-200 hover:bg-rose-50 text-slate-600 hover:text-rose-600 font-bold py-3 px-6 rounded-xl transition-all active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>

        {/* 🏆 LEADERBOARD WIDGET INTEGRATION */}
        <div className="max-w-lg mx-auto w-full relative z-10">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-100 to-violet-100 rounded-3xl blur opacity-30 pointer-events-none"></div>
          <Leaderboard />
        </div>

      </div>
    </div>
  );
}

export default Dashboard;