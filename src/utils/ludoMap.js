// src/utils/ludoMap.js

// 1. The 52 global coordinates that make up the outer circular track of a Ludo board.
// Indexed from 0 to 51, starting from the Red spawn point and moving clockwise.
export const GLOBAL_TRACK = [
  { x: 1, y: 6 }, { x: 2, y: 6 }, { x: 3, y: 6 }, { x: 4, y: 6 }, { x: 5, y: 6 },
  { x: 6, y: 5 }, { x: 6, y: 4 }, { x: 6, y: 3 }, { x: 6, y: 2 }, { x: 6, y: 1 }, { x: 6, y: 0 },
  { x: 7, y: 0 },
  { x: 8, y: 0 }, { x: 8, y: 1 }, { x: 8, y: 2 }, { x: 8, y: 3 }, { x: 8, y: 4 }, { x: 8, y: 5 },
  { x: 9, y: 6 }, { x: 10, y: 6 }, { x: 11, y: 6 }, { x: 12, y: 6 }, { x: 13, y: 6 }, { x: 14, y: 6 },
  { x: 14, y: 7 },
  { x: 14, y: 8 }, { x: 13, y: 8 }, { x: 12, y: 8 }, { x: 11, y: 8 }, { x: 10, y: 8 }, { x: 9, y: 8 },
  { x: 8, y: 9 }, { x: 8, y: 10 }, { x: 8, y: 11 }, { x: 8, y: 12 }, { x: 8, y: 13 }, { x: 8, y: 14 },
  { x: 7, y: 14 },
  { x: 6, y: 14 }, { x: 6, y: 13 }, { x: 6, y: 12 }, { x: 6, y: 11 }, { x: 6, y: 10 }, { x: 6, y: 9 },
  { x: 5, y: 8 }, { x: 4, y: 8 }, { x: 3, y: 8 }, { x: 2, y: 8 }, { x: 1, y: 8 }, { x: 0, y: 8 },
  { x: 0, y: 7 }, { x: 0, y: 6 }
];

// 2. Color-specific offsets and paths
export const PLAYER_PATHS = {
  red: {
    startTrackIndex: 0,
    endTrackIndex: 50,
    homeStretch: [
      { x: 1, y: 7 }, { x: 2, y: 7 }, { x: 3, y: 7 }, { x: 4, y: 7 }, { x: 5, y: 7 }
    ],
    yard: [
      { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 2, y: 3 }, { x: 3, y: 3 }
    ]
  },
  green: {
    startTrackIndex: 13,
    endTrackIndex: 11,
    homeStretch: [
      { x: 7, y: 1 }, { x: 7, y: 2 }, { x: 7, y: 3 }, { x: 7, y: 4 }, { x: 7, y: 5 }
    ],
    yard: [
      { x: 11, y: 2 }, { x: 12, y: 2 }, { x: 11, y: 3 }, { x: 12, y: 3 }
    ]
  },
  blue: {
    startTrackIndex: 26,
    endTrackIndex: 24,
    homeStretch: [
      { x: 13, y: 7 }, { x: 12, y: 7 }, { x: 11, y: 7 }, { x: 10, y: 7 }, { x: 9, y: 7 }
    ],
    yard: [
      { x: 11, y: 11 }, { x: 12, y: 11 }, { x: 11, y: 12 }, { x: 12, y: 12 }
    ]
  },
  yellow: {
    startTrackIndex: 39,
    endTrackIndex: 37,
    homeStretch: [
      { x: 7, y: 13 }, { x: 7, y: 12 }, { x: 7, y: 11 }, { x: 7, y: 10 }, { x: 7, y: 9 }
    ],
    yard: [
      { x: 2, y: 11 }, { x: 3, y: 11 }, { x: 2, y: 12 }, { x: 3, y: 12 }
    ]
  }
};

// 3. Helper function to translate a token's relative step into absolute X/Y grid positions
export const getTokenCoordinates = (color, position, tokenIndex) => {
  const config = PLAYER_PATHS[color];

  // If token is still inside the base yard
  if (position === -1) {
    return config.yard[tokenIndex];
  }

  // If token is moving on the common shared track
  if (position <= 50) {
    const globalIndex = (config.startTrackIndex + position) % 52;
    return GLOBAL_TRACK[globalIndex];
  }

  // If token is on the home stretch heading to victory
  const stretchIndex = position - 51;
  if (stretchIndex < config.homeStretch.length) {
    return config.homeStretch[stretchIndex];
  }

  // Center victory spot fallback coordinates
  return { x: 7.5, y: 7.5 };
};