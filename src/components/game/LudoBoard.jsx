// src/components/game/LudoBoard.jsx
import React from "react";

function LudoBoard({ players, roomData, onCellClick }) {
  // Classic Ludo grid map dimensions: 15x15 structural units
  return (
    <div className="w-full max-w-[480px] aspect-square bg-white rounded-2xl shadow-2xl p-3 border-4 border-slate-800 relative select-none">
      <svg viewBox="0 0 15 15" className="w-full h-full rounded-lg border border-slate-700">
        {/* Base Matrix Quadrants */}
        <rect x="0" y="0" width="6" height="6" fill="#EF4444" stroke="#1E293B" strokeWidth="0.05" />
        <rect x="9" y="0" width="6" height="6" fill="#10B981" stroke="#1E293B" strokeWidth="0.05" />
        <rect x="0" y="9" width="6" height="6" fill="#3B82F6" stroke="#1E293B" strokeWidth="0.05" />
        <rect x="9" y="9" width="6" height="6" fill="#F59E0B" stroke="#1E293B" strokeWidth="0.05" />

        {/* Home Bases (Inner Yards) */}
        <rect x="1" y="1" width="4" height="4" fill="#FFFFFF" rx="0.3" />
        <rect x="10" y="1" width="4" height="4" fill="#FFFFFF" rx="0.3" />
        <rect x="1" y="10" width="4" height="4" fill="#FFFFFF" rx="0.3" />
        <rect x="10" y="10" width="4" height="4" fill="#FFFFFF" rx="0.3" />

        {/* Common Track Shared Grid Paths */}
        {Array.from({ length: 15 }).map((_, r) =>
          Array.from({ length: 15 }).map((_, c) => {
            // Render pathway tiles exclusively outside home bases and center home zone triangle
            if ((r >= 6 && r <= 8) || (c >= 6 && c <= 8)) {
              if (r >= 6 && r <= 8 && c >= 6 && c <= 8) return null; // Skip central triangle area
              
              // Color home stretch lines dynamically
              let fill = "#FFFFFF";
              if (r === 7 && c > 0 && c < 6) fill = "#EF4444";     // Red Home Stretch
              if (c === 7 && r > 0 && r < 6) fill = "#10B981";     // Green Home Stretch
              if (c === 7 && r > 8 && r < 14) fill = "#F59E0B";    // Yellow Home Stretch
              if (r === 7 && c > 8 && c < 14) fill = "#3B82F6";    // Blue Home Stretch
              
              // Standard initial safety spawning checkpoints
              if (r === 6 && c === 1) fill = "#EF4444";
              if (r === 1 && c === 8) fill = "#10B981";
              if (r === 8 && c === 13) fill = "#F59E0B";
              if (r === 13 && c === 6) fill = "#3B82F6";

              return (
                <rect
                  key={`${r}-${c}`}
                  x={c}
                  y={r}
                  width="1"
                  height="1"
                  fill={fill}
                  stroke="#1E293B"
                  strokeWidth="0.04"
                  onClick={() => onCellClick && onCellClick(r, c)}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                />
              );
            }
            return null;
          })
        )}

        {/* Central Victory Triangle Terminus */}
        <polygon points="6,6 9,6 7.5,7.5" fill="#10B981" stroke="#1E293B" strokeWidth="0.05" />
        <polygon points="9,6 9,9 7.5,7.5" fill="#3B82F6" stroke="#1E293B" strokeWidth="0.05" />
        <polygon points="6,9 9,9 7.5,7.5" fill="#F59E0B" stroke="#1E293B" strokeWidth="0.05" />
        <polygon points="6,6 6,9 7.5,7.5" fill="#EF4444" stroke="#1E293B" strokeWidth="0.05" />
      </svg>
    </div>
  );
}

export default LudoBoard;