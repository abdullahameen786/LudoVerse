// src/components/game/LudoBoard.jsx
import React from "react";
import { getTokenCoordinates, SAFE_ZONES } from "../../utils/ludoMap";

// ✅ FIXED: Swapped Yellow and Blue Corners to match engine coordinates
const CORNERS = {
  red: { x: 0, y: 0 },       // Top-Left
  green: { x: 9, y: 0 },     // Top-Right
  yellow: { x: 0, y: 9 },    // Bottom-Left
  blue: { x: 9, y: 9 }       // Bottom-Right
};

const checkIsSafeTile = (r, c) => {
  return SAFE_ZONES.some(zone => zone.x === c && zone.y === r);
};

function LudoBoard({ players, currentTurnIndex, currentDiceValue, hasRolledThisTurn, user, onTokenSelect }) {
  const activePlayer = players?.[currentTurnIndex];
  const isMyTurn = activePlayer?.uid === user?.uid;

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
        
        {/* ✅ FIXED: Base Matrix Quadrants Colors */}
        <rect x="0" y="0" width="6" height="6" fill="#EF4444" stroke="#1E293B" strokeWidth="0.05" /> {/* Red */}
        <rect x="9" y="0" width="6" height="6" fill="#10B981" stroke="#1E293B" strokeWidth="0.05" /> {/* Green */}
        <rect x="0" y="9" width="6" height="6" fill="#F59E0B" stroke="#1E293B" strokeWidth="0.05" /> {/* Yellow (Bottom-Left) */}
        <rect x="9" y="9" width="6" height="6" fill="#3B82F6" stroke="#1E293B" strokeWidth="0.05" /> {/* Blue (Bottom-Right) */}

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

              // ✅ FIXED: Home Track Colors
              if (r === 7 && c > 0 && c < 6) fill = "#EF4444"; // Red (Left)
              if (c === 7 && r > 0 && r < 6) fill = "#10B981"; // Green (Top)
              if (r === 7 && c > 8 && c < 14) fill = "#3B82F6"; // Blue (Right)
              if (c === 7 && r > 8 && r < 14) fill = "#F59E0B"; // Yellow (Bottom)

              // ✅ FIXED: Start Tile Colors
              if (r === 6 && c === 1) fill = "#EF4444"; // Red Start
              if (r === 1 && c === 8) fill = "#10B981"; // Green Start
              if (r === 8 && c === 13) fill = "#3B82F6"; // Blue Start (Right side)
              if (r === 13 && c === 6) fill = "#F59E0B"; // Yellow Start (Bottom side)

              if (isSafe && fill === "#FFFFFF") fill = "#EEF2FF"; 

              return (
                <g key={`tile-${r}-${c}`}>
                  <rect x={c} y={r} width="1" height="1" fill={fill} stroke={isSafe ? "#312E81" : "#1E293B"} strokeWidth={isSafe ? "0.08" : "0.04"} />
                  {isSafe && <rect x={c+0.05} y={r+0.05} width="0.9" height="0.9" fill="#E0E7FF" opacity="0.4" rx="0.05"/>}
                  {isSafe && <text x={c + 0.5} y={r + 0.64} textAnchor="middle" fill="#1E1B4B" fontSize="0.36" fontWeight="black" className="pointer-events-none select-none">★</text>}
                </g>
              );
            }
            return null;
          })
        )}

        {/* ✅ FIXED: Victory Terminus Center Triangles */}
        <polygon points="6,6 9,6 7.5,7.5" fill="#10B981" stroke="#1E293B" strokeWidth="0.05" /> {/* Green (Top) */}
        <polygon points="9,6 9,9 7.5,7.5" fill="#3B82F6" stroke="#1E293B" strokeWidth="0.05" /> {/* Blue (Right) */}
        <polygon points="6,9 9,9 7.5,7.5" fill="#F59E0B" stroke="#1E293B" strokeWidth="0.05" /> {/* Yellow (Bottom) */}
        <polygon points="6,6 6,9 7.5,7.5" fill="#EF4444" stroke="#1E293B" strokeWidth="0.05" /> {/* Red (Left) */}

        {/* Pure SVG Profile Pill Badges */}
        {players?.map((player) => {
          const corner = CORNERS[player.color];
          if (!corner) return null;
          
          const displayName = player.name.length > 8 ? player.name.substring(0, 8) + ".." : player.name;
          
          return (
            <g key={`stats-${player.uid}`} className={`pointer-events-none select-none ${player.hasResigned ? 'opacity-30 grayscale' : ''}`}>
              <rect 
                x={corner.x + 0.8} 
                y={corner.y + 4.85} 
                width="4.4" 
                height="0.85" 
                rx="0.4" 
                fill="#FFFFFF" 
                stroke="#1E293B" 
                strokeWidth="0.05"
                opacity="0.95"
              />
              <text 
                x={corner.x + 3} 
                y={corner.y + 5.42} 
                textAnchor="middle" 
                fill="#0F172A" 
                fontSize="0.36" 
                fontWeight="900"
                className="uppercase tracking-widest"
              >
                {displayName} <tspan fill="#F59E0B">🪙{player.coins ?? 1000}</tspan>
              </text>
            </g>
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