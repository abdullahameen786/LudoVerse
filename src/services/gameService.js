// src/services/gameService.js
import { db } from "../firebase/config";
import { doc, setDoc, getDoc, updateDoc, onSnapshot, arrayUnion } from "firebase/firestore";

const generateRoomCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
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
      isHost: true
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
      isHost: false
    })
  });

  return formattedCode;
};

export const startGame = async (roomCode) => {
  const roomRef = doc(db, "games", roomCode);
  await updateDoc(roomRef, { status: "playing" });
};

// Roll handling mechanism updating synchronized room state
export const rollDiceInRoom = async (roomCode, currentRoomData) => {
  const roomRef = doc(db, "games", roomCode);
  const rolledValue = Math.floor(Math.random() * 6) + 1;
  
  // Calculate next structural turn index
  let nextTurnIndex = currentRoomData.currentTurnIndex;
  if (rolledValue !== 6) {
    nextTurnIndex = (currentRoomData.currentTurnIndex + 1) % currentRoomData.players.length;
  }

  await updateDoc(roomRef, {
    currentDiceValue: rolledValue,
    currentTurnIndex: nextTurnIndex
  });
};

export const subscribeToRoom = (roomCode, callback) => {
  const roomRef = doc(db, "games", roomCode.toUpperCase());
  return onSnapshot(roomRef, (docSnap) => {
    if (docSnap.exists()) callback(docSnap.data());
    else callback(null);
  });
};