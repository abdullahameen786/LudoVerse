// src/components/game/LudoBoard.jsx
import React from "react";
import { getTokenCoordinates } from "../../utils/ludoMap";

const CORNERS = {
  red: { x: 0, y: 0 },
  green: { x: 9, y: 0 },
  blue: { x: 0, y: 9 },
  yellow: { x: 9, y: 9 }
};

function LudoBoard({ players, currentTurnIndex, currentDiceValue, hasRolledThisTurn, user, onTokenSelect }) {
  const activePlayer = players?.[currentTurnIndex];
  const isMyTurn = activePlayer?.uid === user?.uid;

  return (
    <div className="w-full max-w-[440px] aspect-square bg-white rounded-2xl shadow-xl p-2 border-4 border-slate-800 relative select-none flex items-center justify-center">
      <svg viewBox="0 0 15 15" className="w-full h-full rounded-md border border-slate-700 bg-white">
        
        {/* Base Matrix Quadrants */}
        <rect x="0" y="0" width="6" height="6" fill="#EF4444" stroke="#1E293B" strokeWidth="0.05" />
        <rect x="9" y="0" width="6" height="6" fill="#10B981" stroke="#1E293B" strokeWidth="0.05" />
        <rect x="0" y="9" width="6" height="6" fill="#3B82F6" stroke="#1E293B" strokeWidth="0.05" />
        <rect x="9" y="9" width="6" height="6" fill="#F59E0B" stroke="#1E293B" strokeWidth="0.05" />

        {/* Inner Yards */}
        <rect x="1" y="1" width="4" height="4" fill="#FFFFFF" rx="0.2" />
        <rect x="10" y="1" width="4" height="4" fill="#FFFFFF" rx="0.2" />
        <rect x="1" y="10" width="4" height="4" fill="#FFFFFF" rx="0.2" />
        <rect x="10" y="10" width="4" height="4" fill="#FFFFFF" rx="0.2" />

        {/* Track Grid Paths */}
        {Array.from({ length: 15 }).map((_, r) =>
          Array.from({ length: 15 }).map((_, c) => {
            if ((r >= 6 && r <= 8) || (c >= 6 && c <= 8)) {
              if (r >= 6 && r <= 8 && c >= 6 && c <= 8) return null;
              let fill = "#FFFFFF";
              if (r === 7 && c > 0 && c < 6) fill = "#EF4444";
              if (c === 7 && r > 0 && r < 6) fill = "#10B981";
              if (c === 7 && r > 8 && r < 14) fill = "#F59E0B";
              if (r === 7 && c > 8 && c < 14) fill = "#3B82F6";
              if (r === 6 && c === 1) fill = "#EF4444";
              if (r === 1 && c === 8) fill = "#10B981";
              if (r === 8 && c === 13) fill = "#F59E0B";
              if (r === 13 && c === 6) fill = "#3B82F6";
              return <rect key={`${r}-${c}`} x={c} y={r} width="1" height="1" fill={fill} stroke="#1E293B" strokeWidth="0.04" />;
            }
            return null;
          })
        )}

        {/* Victory Terminus Center Zones */}
        <polygon points="6,6 9,6 7.5,7.5" fill="#10B981" stroke="#1E293B" strokeWidth="0.05" />
        <polygon points="9,6 9,9 7.5,7.5" fill="#3B82F6" stroke="#1E293B" strokeWidth="0.05" />
        <polygon points="6,9 9,9 7.5,7.5" fill="#F59E0B" stroke="#1E293B" strokeWidth="0.05" />
        <polygon points="6,6 6,9 7.5,7.5" fill="#EF4444" stroke="#1E293B" strokeWidth="0.05" />

        {/* Scaled HTML Profile Cards Overlay */}
        {players?.map((player) => {
          const corner = CORNERS[player.color];
          if (!corner) return null;
          
          return (
            <foreignObject key={`stats-${player.uid}`} x={corner.x + 0.5} y={corner.y + 0.5} width="5" height="5">
              <div className={`w-full h-full flex items-center justify-center p-0.5 ${player.hasResigned ? 'opacity-20 grayscale' : ''}`}>
                <div className="bg-white/95 rounded border border-slate-300 shadow-sm text-center p-1 w-full max-w-[70px] pointer-events-none select-none">
                  <p className="font-extrabold text-[9px] truncate text-slate-800 tracking-tight">{player.name}</p>
                  <div className="flex justify-center gap-0.5 text-[6px] text-slate-500 font-bold scale-90 origin-center mt-0.5">
                    <span>M:12</span>
                    <span className="text-green-600">W:4</span>
                    <span className="text-amber-600">D:2</span>
                  </div>
                  <p className="text-[7px] font-bold text-amber-500 mt-0.5">
                    🪙{player.coins ?? 1000}
                  </p>
                </div>
              </div>
            </foreignObject>
          );
        })}

        {/* Tokens Layer */}
        {players?.map((player) =>
          player.tokens.map((token) => {
            if (player.hasResigned) return null;
            const coords = getTokenCoordinates(player.color, token.position, token.id);
            const isClickable = isMyTurn && hasRolledThisTurn && player.uid === user.uid && 
                               ((token.position === -1 && currentDiceValue === 6) || token.position >= 0);

            return (
              <g 
                key={`${player.color}-${token.id}`}
                onClick={() => isClickable && onTokenSelect(token)}
                className={isClickable ? "cursor-pointer animate-pulse" : ""}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              >
                <circle cx={coords.x + 0.5} cy={coords.y + 0.5} r="0.35" fill={player.color === "red" ? "#EF4444" : player.color === "green" ? "#10B981" : player.color === "blue" ? "#3B82F6" : "#F59E0B"} stroke="#FFFFFF" strokeWidth="0.05" className={isClickable ? "stroke-indigo-600 brightness-105 shadow" : ""} />
                <circle cx={coords.x + 0.5} cy={coords.y + 0.5} r="0.15" fill="#FFFFFF" opacity="0.3" />
              </g>
            );
          })
        )}
      </svg>
    </div>
  );
}

export default LudoBoard;