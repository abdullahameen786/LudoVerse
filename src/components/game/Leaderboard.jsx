// src/components/game/Leaderboard.jsx
import React, { useState, useEffect } from "react";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/config";

function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const usersRef = collection(db, "users");
    // Top 5 highest coins balances dynamically short index query
    const q = query(usersRef, orderBy("coins", "desc"), limit(5));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const topPlayers = [];
      snapshot.forEach((doc) => {
        topPlayers.push(doc.data());
      });
      setLeaders(topPlayers);
      setLoading(false);
    }, (error) => {
      console.error("Leaderboard real-time sync drop:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 🌟 Premium Shimmer Skeleton for Loading State
  if (loading) {
    return (
      <div className="w-full bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 border border-white shadow-2xl shadow-indigo-100/40">
        <div className="flex flex-col items-center gap-3 mb-8 border-b border-slate-100 pb-6">
          <div className="w-12 h-12 bg-slate-200 rounded-2xl animate-pulse"></div>
          <div className="h-4 w-40 bg-slate-200 rounded-full animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-200 rounded-xl animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-3 w-24 bg-slate-200 rounded-full animate-pulse"></div>
                  <div className="h-2 w-16 bg-slate-200 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div className="h-8 w-16 bg-slate-200 rounded-xl animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 🌟 Main Active Leaderboard View
  return (
    <div className="w-full bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 sm:p-8 shadow-2xl shadow-indigo-100/40 border border-white text-center animate-fade-in relative overflow-hidden">
      
      {/* Decorative Glow inside Leaderboard */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 blur-[50px] rounded-full pointer-events-none"></div>

      {/* Header Section */}
      <div className="flex flex-col items-center justify-center gap-2 mb-8 border-b border-slate-100 pb-6 relative z-10">
        <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-200 transform -rotate-3 mb-1">
          <span className="text-2xl drop-shadow-sm">🏆</span>
        </div>
        <h3 className="text-lg font-black text-slate-800 uppercase tracking-widest">Global Hall of Fame</h3>
      </div>

      <div className="space-y-3.5 relative z-10">
        {leaders.length === 0 ? (
          <div className="py-10 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">No Ranked Matches Recorded Yet</p>
          </div>
        ) : (
          leaders.map((player, index) => {
            const isGold = index === 0;
            const isSilver = index === 1;
            const isBronze = index === 2;

            // Dynamic Styling based on rank
            let rowStyle = "bg-slate-50/80 border-slate-200/60";
            let badgeStyle = "bg-slate-200 text-slate-600 font-black";
            let medal = `#${index + 1}`;

            if (isGold) {
              rowStyle = "bg-gradient-to-r from-amber-50 to-white border-amber-200 shadow-sm shadow-amber-100/50 scale-[1.02] z-10";
              badgeStyle = "bg-gradient-to-br from-amber-300 to-orange-400 shadow-md shadow-amber-200 text-white text-xl";
              medal = "🥇";
            } else if (isSilver) {
              rowStyle = "bg-gradient-to-r from-slate-100 to-white border-slate-300/80 shadow-sm";
              badgeStyle = "bg-gradient-to-br from-slate-300 to-slate-400 shadow-md shadow-slate-200 text-white text-xl";
              medal = "🥈";
            } else if (isBronze) {
              rowStyle = "bg-gradient-to-r from-orange-50 to-white border-orange-200/80 shadow-sm";
              badgeStyle = "bg-gradient-to-br from-orange-300 to-rose-400 shadow-md shadow-orange-200 text-white text-xl";
              medal = "🥉";
            }

            return (
              <div 
                key={player.uid} 
                className={`flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.03] hover:shadow-lg cursor-default group ${rowStyle}`}
              >
                <div className="flex items-center gap-4">
                  {/* Rank Badge */}
                  <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center ${badgeStyle} transition-transform group-hover:-rotate-6`}>
                    {medal}
                  </div>
                  
                  {/* Player Info */}
                  <div className="text-left">
                    <p className="text-sm sm:text-base font-black text-slate-800 uppercase tracking-tight">{player.name}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[9px] sm:text-[10px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200/80 shadow-xs">
                        W: {player.matchesWon || 0}
                      </span>
                      <span className="text-[9px] sm:text-[10px] font-bold text-slate-400">
                        / {player.matchesPlayed || 0}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Coins Tag */}
                <div className="shrink-0 ml-2">
                  <span className={`flex items-center gap-1 text-xs sm:text-sm font-black px-3 py-1.5 rounded-xl border shadow-xs transition-colors ${isGold ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-indigo-50 text-indigo-600 border-indigo-100/60 group-hover:bg-indigo-100'}`}>
                    🪙 {player.coins ?? 1000}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Leaderboard;