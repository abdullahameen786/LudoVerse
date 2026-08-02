// src/services/gameService.js
import { db } from "../firebase/config";
import { doc, setDoc, getDoc, updateDoc, onSnapshot, arrayUnion } from "firebase/firestore";
import { getTokenCoordinates, isSafeZone } from "../utils/ludoMap";

// Generate a random 6-character alphanumeric room code
const generateRoomCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Create the 4 starting tokens for a player
const createInitialTokens = () => {
  return [
    { id: 0, position: -1 },
    { id: 1, position: -1 },
    { id: 2, position: -1 },
    { id: 3, position: -1 }
  ];
};

// Create a new private room
export const createGameRoom = async (user) => {
  const roomCode = generateRoomCode();
  const roomRef = doc(db, "games", roomCode);
  const playerName = user.displayName || user.email.split("@")[0] || "Player";

  const roomData = {
    id: roomCode,
    hostId: user.uid,
    status: "waiting",
    currentTurnIndex: 0,
    currentDiceValue: null,
    hasRolledThisTurn: false,
    players: [{
      uid: user.uid,
      name: playerName,
      color: "red",
      isHost: true,
      tokens: createInitialTokens()
    }],
    createdAt: new Date().toISOString()
  };

  await setDoc(roomRef, roomData);
  return roomCode;
};

// Join an existing room via code
export const joinGameRoom = async (roomCode, user) => {
  const formattedCode = roomCode.trim().toUpperCase();
  const roomRef = doc(db, "games", formattedCode);
  const roomSnap = await getDoc(roomRef);

  if (!roomSnap.exists()) throw new Error("Room not found.");
  const roomData = roomSnap.data();

  if (roomData.status !== "waiting") throw new Error("Game already started.");
  if (roomData.players.length >= 4) throw new Error("Room full.");
  if (roomData.players.some((p) => p.uid === user.uid)) return formattedCode;

  const colors = ["red", "green", "yellow", "blue"];
  const assignedColor = colors[roomData.players.length];
  const playerName = user.displayName || user.email.split("@")[0] || "Player";

  await updateDoc(roomRef, {
    players: arrayUnion({
      uid: user.uid,
      name: playerName,
      color: assignedColor,
      isHost: false,
      tokens: createInitialTokens()
    })
  });

  return formattedCode;
};

// Start the game (Host only)
export const startGame = async (roomCode) => {
  const roomRef = doc(db, "games", roomCode);
  await updateDoc(roomRef, { status: "playing" });
};

// Roll handling mechanism
export const rollDiceInRoom = async (roomCode, currentRoomData) => {
  const roomRef = doc(db, "games", roomCode);
  const rolledValue = Math.floor(Math.random() * 6) + 1;
  
  // Check if active player has any movable tokens with this roll
  const activePlayer = currentRoomData.players[currentRoomData.currentTurnIndex];
  const hasMovableTokens = activePlayer.tokens.some(token => {
    if (token.position === -1 && rolledValue === 6) return true; // Can spawn
    if (token.position >= 0 && token.position + rolledValue <= 56) return true; // Can move forward
    return false;
  });

  // If no tokens can move, pass turn immediately
  if (!hasMovableTokens) {
    const nextTurnIndex = (currentRoomData.currentTurnIndex + 1) % currentRoomData.players.length;
    await updateDoc(roomRef, {
      currentDiceValue: rolledValue,
      currentTurnIndex: nextTurnIndex,
      hasRolledThisTurn: false
    });
  } else {
    // Player rolled a valid number and has pieces to move, lock dice until they click a token
    await updateDoc(roomRef, {
      currentDiceValue: rolledValue,
      hasRolledThisTurn: true
    });
  }
};

// Execute moves, calculate collisions, and process captures
// Execute moves, calculate collisions, and process captures
export const moveTokenInRoom = async (roomCode, currentRoomData, tokenObject) => {
  const roomRef = doc(db, "games", roomCode);
  const diceValue = currentRoomData.currentDiceValue;
  const turnIndex = currentRoomData.currentTurnIndex;
  
  // --- STRICT MOVE VALIDATION ---
  // 1. Prevent moving out of yard without a 6
  if (tokenObject.position === -1 && diceValue !== 6) return;
  
  // 2. Prevent overshooting the victory center
  if (tokenObject.position >= 0 && tokenObject.position + diceValue > 56) return;

  const activePlayer = currentRoomData.players[turnIndex];
  
  const newPosIndex = tokenObject.position === -1 ? 0 : tokenObject.position + diceValue;
  const landingCoords = getTokenCoordinates(activePlayer.color, newPosIndex, tokenObject.id);
  
  let madeACapture = false;

  const updatedPlayers = currentRoomData.players.map((player, pIdx) => {
    if (pIdx === turnIndex) {
      const updatedTokens = player.tokens.map(t => 
        t.id === tokenObject.id ? { ...t, position: newPosIndex } : t
      );
      return { ...player, tokens: updatedTokens };
    }
    
    const checkedTokens = player.tokens.map(t => {
      if (t.position < 0 || t.position > 50) return t;

      const oppCoords = getTokenCoordinates(player.color, t.position, t.id);
      
      if (oppCoords.x === landingCoords.x && oppCoords.y === landingCoords.y) {
        if (!isSafeZone(landingCoords.x, landingCoords.y)) {
          madeACapture = true;
          return { ...t, position: -1 }; 
        }
      }
      return t;
    });

    return { ...player, tokens: checkedTokens };
  });

  let nextTurnIndex = turnIndex;
  if (diceValue !== 6 && !madeACapture) {
    nextTurnIndex = (turnIndex + 1) % currentRoomData.players.length;
  }

  await updateDoc(roomRef, {
    players: updatedPlayers,
    currentDiceValue: null,
    currentTurnIndex: nextTurnIndex,
    hasRolledThisTurn: false
  });
};

// Force skip a turn if a player takes too long
export const skipTurn = async (roomCode, currentRoomData) => {
  const roomRef = doc(db, "games", roomCode);
  const nextTurnIndex = (currentRoomData.currentTurnIndex + 1) % currentRoomData.players.length;
  
  await updateDoc(roomRef, {
    currentTurnIndex: nextTurnIndex,
    currentDiceValue: null,
    hasRolledThisTurn: false
  });
};

// Real-time listener for the room UI
export const subscribeToRoom = (roomCode, callback) => {
  const roomRef = doc(db, "games", roomCode.toUpperCase());
  return onSnapshot(roomRef, (docSnap) => {
    if (docSnap.exists()) callback(docSnap.data());
    else callback(null);
  });
};


// Add this to the bottom of src/services/gameService.js

// Handle a player resigning from the match
export const resignGame = async (roomCode, currentRoomData, userId) => {
  const roomRef = doc(db, "games", roomCode);
  
  // Mark player as resigned and deduct coins (Mocking coin deduction in room state)
  const updatedPlayers = currentRoomData.players.map(p => {
    if (p.uid === userId) {
      return { ...p, hasResigned: true, coins: (p.coins || 1000) - 50 }; // -50 coin penalty
    }
    return p;
  });

  // Check if only one player is left after this resignation
  const activePlayers = updatedPlayers.filter(p => !p.hasResigned);
  const status = activePlayers.length <= 1 ? "finished" : currentRoomData.status;

  // If the resigning player is the current turn, skip their turn
  let nextTurnIndex = currentRoomData.currentTurnIndex;
  if (currentRoomData.players[nextTurnIndex].uid === userId) {
    nextTurnIndex = (nextTurnIndex + 1) % currentRoomData.players.length;
  }

  await updateDoc(roomRef, {
    players: updatedPlayers,
    status: status,
    currentTurnIndex: nextTurnIndex
  });
};

// Propose a draw to the room
export const proposeDraw = async (roomCode, userId) => {
  const roomRef = doc(db, "games", roomCode);
  await updateDoc(roomRef, {
    drawProposedBy: userId,
    drawAcceptedBy: arrayUnion(userId) // Proposer auto-accepts
  });
};

// Accept an active draw proposal
export const acceptDraw = async (roomCode, currentRoomData, userId) => {
  const roomRef = doc(db, "games", roomCode);
  const newAccepted = [...(currentRoomData.drawAcceptedBy || []), userId];
  
  // Count how many players haven't resigned
  const activePlayerCount = currentRoomData.players.filter(p => !p.hasResigned).length;

  // If everyone active accepted, end the game in a draw
  if (newAccepted.length >= activePlayerCount) {
    await updateDoc(roomRef, {
      status: "drawn",
      drawAcceptedBy: newAccepted
    });
  } else {
    await updateDoc(roomRef, {
      drawAcceptedBy: arrayUnion(userId)
    });
  }
};