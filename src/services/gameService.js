// src/services/gameService.js
import { db } from "../firebase/config";
import { doc, setDoc, getDoc, updateDoc, onSnapshot, arrayUnion } from "firebase/firestore";

const generateRoomCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

const createInitialTokens = () => {
  // Every player manages 4 tokens initially located inside their starting yard (-1)
  return [
    { id: 0, position: -1 },
    { id: 1, position: -1 },
    { id: 2, position: -1 },
    { id: 3, position: -1 }
  ];
};

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

export const startGame = async (roomCode) => {
  const roomRef = doc(db, "games", roomCode);
  await updateDoc(roomRef, { status: "playing" });
};

export const rollDiceInRoom = async (roomCode, currentRoomData) => {
  const roomRef = doc(db, "games", roomCode);
  const rolledValue = Math.floor(Math.random() * 6) + 1;
  
  // Check if active player has any movable tokens with this roll
  const activePlayer = currentRoomData.players[currentRoomData.currentTurnIndex];
  const hasMovableTokens = activePlayer.tokens.some(token => {
    if (token.position === -1 && rolledValue === 6) return true;
    if (token.position >= 0 && token.position + rolledValue <= 56) return true;
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

// Execute moves on chosen tokens and calculate rotation transitions
export const moveTokenInRoom = async (roomCode, currentRoomData, tokenObject) => {
  const roomRef = doc(db, "games", roomCode);
  const diceValue = currentRoomData.currentDiceValue;
  const turnIndex = currentRoomData.currentTurnIndex;
  
  const updatedPlayers = currentRoomData.players.map((player, pIdx) => {
    if (pIdx !== turnIndex) return player;
    
    const updatedTokens = player.tokens.map(t => {
      if (t.id !== tokenObject.id) return t;
      
      // Spawn out of base yard on a 6, otherwise advance position index
      const newPos = t.position === -1 ? 0 : t.position + diceValue;
      return { ...t, position: newPos };
    });

    return { ...player, tokens: updatedTokens };
  });

  // A roll of 6 rewards the player with an extra consecutive turn
  const nextTurnIndex = diceValue === 6 ? turnIndex : (turnIndex + 1) % currentRoomData.players.length;

  await updateDoc(roomRef, {
    players: updatedPlayers,
    currentDiceValue: null,
    currentTurnIndex: nextTurnIndex,
    hasRolledThisTurn: false
  });
};

export const skipTurn = async (roomCode, currentRoomData) => {
  const roomRef = doc(db, "games", roomCode);
  const nextTurnIndex = (currentRoomData.currentTurnIndex + 1) % currentRoomData.players.length;
  await updateDoc(roomRef, {
    currentTurnIndex: nextTurnIndex,
    currentDiceValue: null,
    hasRolledThisTurn: false
  });
};

export const subscribeToRoom = (roomCode, callback) => {
  const roomRef = doc(db, "games", roomCode.toUpperCase());
  return onSnapshot(roomRef, (docSnap) => {
    if (docSnap.exists()) callback(docSnap.data());
    else callback(null);
  });
};