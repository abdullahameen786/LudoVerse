// src/pages/Dashboard.jsx
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
// 🌟 Import the newly created Leaderboard component
import Leaderboard from "../components/game/Leaderboard.jsx";

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Failed to log out", err);
    }
  };

  return (
    // Added space-y-8 to create a clean gap between the welcome card and leaderboard
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      
      {/* Main Welcome Dashboard Card */}
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Welcome to LudoVerse!</h1>
        <p className="text-slate-600 mb-6">
          Glad to see you back, <span className="font-semibold text-indigo-600">{user?.displayName || user?.email || "Player"}</span>
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto mb-2">
          <button 
            onClick={() => navigate("/game")} 
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-6 rounded-2xl transition shadow-md active:scale-95"
          >
            Enter Game Lobby
          </button>
          <button 
            onClick={handleLogout} 
            className="border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold py-4 px-6 rounded-2xl transition active:scale-95"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* 🌟 LEADERBOARD WIDGET INTEGRATION */}
      <div className="max-w-md mx-auto w-full">
        <Leaderboard />
      </div>

    </div>
  );
}

export default Dashboard;