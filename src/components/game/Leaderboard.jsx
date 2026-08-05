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

  if (loading) {
    return (
      <div className="w-full bg-white rounded-3xl p-6 border text-center text-slate-400 font-medium animate-pulse text-xs">
        🏆 Fetching Arena Champions...
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-3xl p-6 shadow-xl border border-slate-100 text-center">
      <div className="flex items-center justify-center gap-2 mb-6 border-b border-slate-50 pb-3">
        <span className="text-2xl">🏆</span>
        <h3 className="text-lg font-black text-slate-800 uppercase tracking-wider">Global Hall of Fame</h3>
      </div>

      <div className="space-y-3">
        {leaders.length === 0 ? (
          <p className="text-xs font-bold text-slate-400 py-4 uppercase">No Ranked Matches Recorded Yet</p>
        ) : (
          leaders.map((player, index) => {
            const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `${index + 1}`;
            return (
              <div 
                key={player.uid} 
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                  index === 0 
                    ? "bg-amber-50/40 border-amber-200" 
                    : "bg-slate-50/50 border-slate-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-black text-sm w-6 text-center">{medal}</span>
                  <div className="text-left">
                    <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{player.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                      Wins: {player.matchesWon || 0} / Total: {player.matchesPlayed || 0}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100/40">
                  🪙 {player.coins ?? 1000}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Leaderboard;