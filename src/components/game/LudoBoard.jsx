// src/components/game/LudoBoard.jsx
import React from "react";
import { getTokenCoordinates, SAFE_ZONES } from "../../utils/ludoMap";

const CORNERS = {
  red: { x: 0, y: 0 },
  green: { x: 9, y: 0 },
  blue: { x: 0, y: 9 },
  yellow: { x: 9, y: 9 }
};

// Helper function to check if cell coordinates match a registered safe zone
const checkIsSafeTile = (r, c) => {
  return SAFE_ZONES.some(zone => zone.x === c && zone.y === r);
};

function LudoBoard({ players, currentTurnIndex, currentDiceValue, hasRolledThisTurn, user, onTokenSelect }) {
  const activePlayer = players?.[currentTurnIndex];
  const isMyTurn = activePlayer?.uid === user?.uid;

  // CLUSTER LOGIC: Check kitne tokens exact same x,y coordinate par hain
  const tokenClusters = {};
  
  players?.forEach(player => {
    if (player.hasResigned) return;
    player.tokens.forEach(token => {
      if (token.position !== -1) {
        const coords = getTokenCoordinates(player.color, token.position, token.id);
        const key = `${coords.x},${coords.y}`;
        if (!tokenClusters[key]) tokenClusters[key] = [];
        tokenClusters[key].push({ color: player.color, id: token.id });
      }
    });
  });

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
              const isSafe = checkIsSafeTile(r, c);

              // Color mappings for starting paths
              if (r === 7 && c > 0 && c < 6) fill = "#EF4444";
              if (c === 7 && r > 0 && r < 6) fill = "#10B981";
              if (c === 7 && r > 8 && r < 14) fill = "#F59E0B";
              if (r === 7 && c > 8 && c < 14) fill = "#3B82F6";
              if (r === 6 && c === 1) fill = "#EF4444";
              if (r === 1 && c === 8) fill = "#10B981";
              if (r === 8 && c === 13) fill = "#F59E0B";
              if (r === 13 && c === 6) fill = "#3B82F6";

              // 🌟 SAFE ZONE RE-STYLING: Safe tile par alag look apply karein
              if (isSafe && fill === "#FFFFFF") {
                // Indigo-based light tint pattern for safety highlighting
                fill = "#EEF2FF"; 
              }

              return (
                <g key={`tile-${r}-${c}`}>
                  <rect 
                    x={c} 
                    y={r} 
                    width="1" 
                    height="1" 
                    fill={fill} 
                    // Safe zone border highlight
                    stroke={isSafe ? "#312E81" : "#1E293B"} 
                    strokeWidth={isSafe ? "0.08" : "0.04"} 
                  />
                  {/* Subtle inner-shadow aesthetic simulation for pressed feel on safety */}
                  {isSafe && (
                    <rect x={c+0.05} y={r+0.05} width="0.9" height="0.9" fill="#E0E7FF" opacity="0.4" rx="0.05"/>
                  )}
                  {/* 🌟 VECTOR LABEL INSIDE SAFE TILE: Aggr safe hai to text render karein */}
                  {isSafe && (
                    <text 
                      x={c + 0.5} 
                      y={r + 0.64} 
                      textAnchor="middle" 
                      fill="#1E1B4B" 
                      fontSize="0.36" 
                      fontWeight="black" 
                      className="pointer-events-none select-none tracking-tighter"
                    >
                      ★
                    </text>
                  )}
                </g>
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
                  <p className="text-[7px] font-bold text-amber-500 mt-0.5">🪙{player.coins ?? 1000}</p>
                </div>
              </div>
            </foreignObject>
          );
        })}

        {/* Dynamic Tokens Layer */}
        {players?.map((player) =>
          player.tokens.map((token) => {
            if (player.hasResigned) return null;
            const coords = getTokenCoordinates(player.color, token.position, token.id);
            let cx = coords.x + 0.5;
            let cy = coords.y + 0.5;
            let scaleMultiplier = 1;

            if (token.position !== -1) {
              const key = `${coords.x},${coords.y}`;
              const cluster = tokenClusters[key];
              if (cluster && cluster.length > 1) {
                const index = cluster.findIndex(t => t.color === player.color && t.id === token.id);
                const shiftAmt = 0.22;
                if (index === 0) { cx -= shiftAmt; cy -= shiftAmt; }
                else if (index === 1) { cx += shiftAmt; cy += shiftAmt; }
                else if (index === 2) { cx -= shiftAmt; cy += shiftAmt; }
                else if (index === 3) { cx += shiftAmt; cy -= shiftAmt; }
                else if (index > 3) { cx += 0; cy -= shiftAmt; }
                scaleMultiplier = 0.65;
              }
            }

            const isClickable = isMyTurn && hasRolledThisTurn && player.uid === user.uid && 
                               ((token.position === -1 && currentDiceValue === 6) || token.position >= 0);

            return (
              <g 
                key={`${player.color}-${token.id}`}
                onClick={() => isClickable && onTokenSelect(token)}
                className={isClickable ? "cursor-pointer animate-pulse" : ""}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              >
                <circle cx={cx} cy={cy} r={0.35 * scaleMultiplier} fill={player.color === "red" ? "#EF4444" : player.color === "green" ? "#10B981" : player.color === "blue" ? "#3B82F6" : "#F59E0B"} stroke="#FFFFFF" strokeWidth={0.05 * scaleMultiplier} className={isClickable ? "stroke-indigo-600 brightness-105 shadow" : ""} />
                <circle cx={cx} cy={cy} r={0.15 * scaleMultiplier} fill="#FFFFFF" opacity="0.3" />
              </g>
            );
          })
        )}
      </svg>
    </div>
  );
}

export default LudoBoard;