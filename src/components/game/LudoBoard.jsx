// src/components/game/LudoBoard.jsx
import React from "react";
import { getTokenCoordinates } from "../../utils/ludoMap";

function LudoBoard({ players, currentTurnIndex, hasRolledThisTurn, user, onTokenSelect }) {
  const activePlayer = players?.[currentTurnIndex];
  const isMyTurn = activePlayer?.uid === user?.uid;

  return (
    <div className="w-full max-w-[480px] aspect-square bg-white rounded-2xl shadow-2xl p-3 border-4 border-slate-800 relative select-none">
      <svg viewBox="0 0 15 15" className="w-full h-full rounded-lg border border-slate-700">
        
        {/* Base Matrix Quadrants */}
        <rect x="0" y="0" width="6" height="6" fill="#EF4444" stroke="#1E293B" strokeWidth="0.05" />
        <rect x="9" y="0" width="6" height="6" fill="#10B981" stroke="#1E293B" strokeWidth="0.05" />
        <rect x="0" y="9" width="6" height="6" fill="#3B82F6" stroke="#1E293B" strokeWidth="0.05" />
        <rect x="9" y="9" width="6" height="6" fill="#F59E0B" stroke="#1E293B" strokeWidth="0.05" />

        {/* Inner Yards */}
        <rect x="1" y="1" width="4" height="4" fill="#FFFFFF" rx="0.3" />
        <rect x="10" y="1" width="4" height="4" fill="#FFFFFF" rx="0.3" />
        <rect x="1" y="10" width="4" height="4" fill="#FFFFFF" rx="0.3" />
        <rect x="10" y="10" width="4" height="4" fill="#FFFFFF" rx="0.3" />

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

              return (
                <rect key={`${r}-${c}`} x={c} y={r} width="1" height="1" fill={fill} stroke="#1E293B" strokeWidth="0.04" />
              );
            }
            return null;
          })
        )}

        {/* Victory Terminus Center Zones */}
        <polygon points="6,6 9,6 7.5,7.5" fill="#10B981" stroke="#1E293B" strokeWidth="0.05" />
        <polygon points="9,6 9,9 7.5,7.5" fill="#3B82F6" stroke="#1E293B" strokeWidth="0.05" />
        <polygon points="6,9 9,9 7.5,7.5" fill="#F59E0B" stroke="#1E293B" strokeWidth="0.05" />
        <polygon points="6,6 6,9 7.5,7.5" fill="#EF4444" stroke="#1E293B" strokeWidth="0.05" />

        {/* Dynamic Interactive Vector Tokens Layer */}
        {players?.map((player) =>
          player.tokens.map((token) => {
            const coords = getTokenCoordinates(player.color, token.position, token.id);
            const isClickable = isMyTurn && hasRolledThisTurn && player.uid === user.uid;

            return (
              <g 
                key={`${player.color}-${token.id}`}
                onClick={() => isClickable && onTokenSelect(token)}
                className={isClickable ? "cursor-pointer animate-bounce group" : ""}
              >
                {/* Visual token body offset centered in its structural unit box */}
                <circle
                  cx={coords.x + 0.5}
                  cy={coords.y + 0.5}
                  r="0.38"
                  fill={player.color === "red" ? "#EF4444" : player.color === "green" ? "#10B981" : player.color === "blue" ? "#3B82F6" : "#F59E0B"}
                  stroke="#FFFFFF"
                  strokeWidth="0.06"
                  className={isClickable ? "stroke-indigo-600 group-hover:brightness-110 drop-shadow-md" : "drop-shadow-sm"}
                />
                <circle
                  cx={coords.x + 0.5}
                  cy={coords.y + 0.5}
                  r="0.18"
                  fill="#FFFFFF"
                  opacity="0.4"
                />
              </g>
            );
          })
        )}
      </svg>
    </div>
  );
}

export default LudoBoard;