// // src/components/game/LudoBoard.jsx
import React from "react";
import { getTokenCoordinates, SAFE_ZONES } from "../../utils/ludoMap";

// FIXED: Swapped Yellow and Blue Corners to match engine coordinates
const CORNERS = {
  red: { x: 0, y: 0 },       // Top-Left
  green: { x: 9, y: 0 },     // Top-Right
  yellow: { x: 0, y: 9 },    // Bottom-Left
  blue: { x: 9, y: 9 }       // Bottom-Right
};

// Map primary colors to Tailwind-like hexes for rich gradients
const COLORS = {
  red: { base: "#EF4444", dark: "#B91C1C", light: "#FCA5A5" },
  green: { base: "#10B981", dark: "#047857", light: "#6EE7B7" },
  blue: { base: "#3B82F6", dark: "#1D4ED8", light: "#93C5FD" },
  yellow: { base: "#F59E0B", dark: "#B45309", light: "#FCD34D" }
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
    <div className="w-full max-w-[440px] aspect-square bg-slate-100 rounded-[2rem] shadow-[inset_0_4px_12px_rgba(0,0,0,0.05),0_10px_30px_rgba(15,23,42,0.1)] p-2.5 sm:p-3 relative select-none flex items-center justify-center border-b-[6px] border-slate-300">
      <svg viewBox="0 0 15 15" className="w-full h-full rounded-2xl bg-white shadow-xl overflow-hidden drop-shadow-sm">
        
        {/* SVG Definition Filters for 3D Tokens and Glows */}
        <defs>
          <filter id="token-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0.15" stdDeviation="0.15" floodOpacity="0.4" />
          </filter>
          <filter id="active-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="grad-red" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={COLORS.red.light} />
            <stop offset="100%" stopColor={COLORS.red.base} />
          </linearGradient>
          <linearGradient id="grad-green" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={COLORS.green.light} />
            <stop offset="100%" stopColor={COLORS.green.base} />
          </linearGradient>
          <linearGradient id="grad-blue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={COLORS.blue.light} />
            <stop offset="100%" stopColor={COLORS.blue.base} />
          </linearGradient>
          <linearGradient id="grad-yellow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={COLORS.yellow.light} />
            <stop offset="100%" stopColor={COLORS.yellow.base} />
          </linearGradient>
        </defs>

        {/* Dynamic Turn Aura Underlay (Highlights the current player's corner) */}
        {activePlayer && CORNERS[activePlayer.color] && (
          <rect 
            x={CORNERS[activePlayer.color].x} 
            y={CORNERS[activePlayer.color].y} 
            width="6" 
            height="6" 
            fill={COLORS[activePlayer.color].light} 
            opacity="0.3"
            className="animate-pulse"
          />
        )}

        {/* Base Matrix Quadrants Colors */}
        <rect x="0" y="0" width="6" height="6" fill="url(#grad-red)" stroke="#F87171" strokeWidth="0.05" /> {/* Red */}
        <rect x="9" y="0" width="6" height="6" fill="url(#grad-green)" stroke="#34D399" strokeWidth="0.05" /> {/* Green */}
        <rect x="0" y="9" width="6" height="6" fill="url(#grad-yellow)" stroke="#FBBF24" strokeWidth="0.05" /> {/* Yellow */}
        <rect x="9" y="9" width="6" height="6" fill="url(#grad-blue)" stroke="#60A5FA" strokeWidth="0.05" /> {/* Blue */}

        {/* Inner Glass Yards (Playpen) */}
        <rect x="1" y="1" width="4" height="4" fill="#FFFFFF" rx="0.4" opacity="0.9" stroke="#E2E8F0" strokeWidth="0.05" />
        <rect x="10" y="1" width="4" height="4" fill="#FFFFFF" rx="0.4" opacity="0.9" stroke="#E2E8F0" strokeWidth="0.05" />
        <rect x="1" y="10" width="4" height="4" fill="#FFFFFF" rx="0.4" opacity="0.9" stroke="#E2E8F0" strokeWidth="0.05" />
        <rect x="10" y="10" width="4" height="4" fill="#FFFFFF" rx="0.4" opacity="0.9" stroke="#E2E8F0" strokeWidth="0.05" />

        {/* Track Grid Paths */}
        {Array.from({ length: 15 }).map((_, r) =>
          Array.from({ length: 15 }).map((_, c) => {
            if ((r >= 6 && r <= 8) || (c >= 6 && c <= 8)) {
              if (r >= 6 && r <= 8 && c >= 6 && c <= 8) return null;
              
              let fill = "#FFFFFF";
              const isSafe = checkIsSafeTile(r, c);

              // Home Track Colors
              if (r === 7 && c > 0 && c < 6) fill = COLORS.red.base; // Red (Left)
              if (c === 7 && r > 0 && r < 6) fill = COLORS.green.base; // Green (Top)
              if (r === 7 && c > 8 && c < 14) fill = COLORS.blue.base; // Blue (Right)
              if (c === 7 && r > 8 && r < 14) fill = COLORS.yellow.base; // Yellow (Bottom)

              // Start Tile Colors
              if (r === 6 && c === 1) fill = COLORS.red.base;
              if (r === 1 && c === 8) fill = COLORS.green.base;
              if (r === 8 && c === 13) fill = COLORS.blue.base;
              if (r === 13 && c === 6) fill = COLORS.yellow.base;

              if (isSafe && fill === "#FFFFFF") fill = "#F8FAFC"; 

              return (
                <g key={`tile-${r}-${c}`}>
                  <rect x={c} y={r} width="1" height="1" fill={fill} stroke={isSafe ? "#94A3B8" : "#E2E8F0"} strokeWidth={isSafe ? "0.06" : "0.04"} />
                  {isSafe && <rect x={c+0.1} y={r+0.1} width="0.8" height="0.8" fill="#E2E8F0" opacity="0.4" rx="0.1"/>}
                  {isSafe && <text x={c + 0.5} y={r + 0.65} textAnchor="middle" fill="#475569" fontSize="0.4" fontWeight="black" className="pointer-events-none select-none opacity-50">★</text>}
                </g>
              );
            }
            return null;
          })
        )}

        {/* Victory Terminus Center Triangles */}
        <polygon points="6,6 9,6 7.5,7.5" fill="url(#grad-green)" stroke="#F8FAFC" strokeWidth="0.03" /> {/* Green (Top) */}
        <polygon points="9,6 9,9 7.5,7.5" fill="url(#grad-blue)" stroke="#F8FAFC" strokeWidth="0.03" /> {/* Blue (Right) */}
        <polygon points="6,9 9,9 7.5,7.5" fill="url(#grad-yellow)" stroke="#F8FAFC" strokeWidth="0.03" /> {/* Yellow (Bottom) */}
        <polygon points="6,6 6,9 7.5,7.5" fill="url(#grad-red)" stroke="#F8FAFC" strokeWidth="0.03" /> {/* Red (Left) */}
        <circle cx="7.5" cy="7.5" r="0.25" fill="#1E293B" opacity="0.9"/> {/* Center Core Plug */}

        {/* Premium Profile Pill Badges */}
        {players?.map((player) => {
          const corner = CORNERS[player.color];
          if (!corner) return null;
          
          const displayName = player.name.length > 7 ? player.name.substring(0, 7) + ".." : player.name;
          const isActive = player.uid === activePlayer?.uid;
          
          return (
            <g key={`stats-${player.uid}`} className={`pointer-events-none select-none ${player.hasResigned ? 'opacity-30 grayscale' : ''}`}>
              <rect 
                x={corner.x + 0.8} 
                y={corner.y + 4.9} 
                width="4.4" 
                height="0.9" 
                rx="0.45" 
                fill="#FFFFFF" 
                stroke={isActive ? COLORS[player.color].dark : "#CBD5E1"} 
                strokeWidth={isActive ? "0.08" : "0.05"}
                opacity="0.95"
                filter={isActive ? "url(#token-shadow)" : ""}
              />
              <text 
                x={corner.x + 3} 
                y={corner.y + 5.5} 
                textAnchor="middle" 
                fill="#0F172A" 
                fontSize="0.38" 
                fontWeight="900"
                className="uppercase tracking-[0.1em]"
              >
                {displayName} <tspan fill="#D97706">🪙{player.coins ?? 1000}</tspan>
              </text>
            </g>
          );
        })}

        {/* Realistic 3D Tokens Layer */}
        {players?.map((player) =>
          player.tokens.map((token) => {
            if (player.hasResigned) return null;
            const coords = getTokenCoordinates(player.color, token.position, token.id);
            let cx = coords.x + 0.5;
            let cy = coords.y + 0.5;
            let scaleMultiplier = 1;

            // Handle Clustered Tokens Positioning
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

            // Token Gradient and Outline Setup
            const tokenColor = COLORS[player.color];

            return (
              <g 
                key={`${player.color}-${token.id}`}
                onClick={() => isClickable && onTokenSelect(token)}
                className={`transition-all duration-300 origin-center ${isClickable ? "cursor-pointer" : ""}`}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              >
                {/* 🌟 FIXED: Removed animate-bounce (vertical motion) so tokens stay fixed over the center of the tile */}
                <g filter="url(#token-shadow)">
                  {/* Outer Rim (Darker edge for 3D effect) */}
                  <circle cx={cx} cy={cy} r={0.36 * scaleMultiplier} fill={tokenColor.dark} />
                  {/* Main Token Body (Gradient) */}
                  <circle cx={cx} cy={cy - (0.02 * scaleMultiplier)} r={0.34 * scaleMultiplier} fill={`url(#grad-${player.color})`} />
                  {/* Inner White Shine (Glass highlight reflection) */}
                  <circle cx={cx} cy={cy - (0.1 * scaleMultiplier)} r={0.22 * scaleMultiplier} fill="#FFFFFF" opacity="0.3" />
                  <circle cx={cx} cy={cy - (0.02 * scaleMultiplier)} r={0.22 * scaleMultiplier} fill="none" stroke="#FFFFFF" strokeWidth={0.03 * scaleMultiplier} opacity="0.5" />
                  
                  {/* 🌟 FIXED: Stable In-Place Pulse and Glow indicator ONLY for selectable tokens. 
                      Uses only scale(1) and scale(1.1) in combination with a glow. 
                      The center position never shifts. */}
                  {isClickable && (
                    <circle cx={cx} cy={cy} r={0.42 * scaleMultiplier} fill="none" stroke="#FCD34D" strokeWidth={0.08 * scaleMultiplier} filter="url(#active-glow)" className="animate-pulse" />
                  )}
                </g>
              </g>
            );
          })
        )}
      </svg>
    </div>
  );
}

export default LudoBoard;