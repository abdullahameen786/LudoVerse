// src/services/gameService.js
import { db } from "../firebase/config";
import { doc, setDoc, getDoc, updateDoc, onSnapshot, arrayUnion } from "firebase/firestore";

// Helper to generate a 6-character alphanumeric room code
const generateRoomCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Create a new private room
export const createGameRoom = async (user) => {
  const roomCode = generateRoomCode();
  const roomRef = doc(db, "games", roomCode);

  const playerName = user.displayName || user.email.split("@")[0] || "Player";

  const roomData = {
    id: roomCode,
    hostId: user.uid,
    status: "waiting", // States: waiting, playing, finished
    players: [{
      uid: user.uid,
      name: playerName,
      color: "red", // First player defaults to Red
      isHost: true
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

  if (!roomSnap.exists()) {
    throw new Error("Room not found. Please check the code.");
  }

  const roomData = roomSnap.data();

  if (roomData.status !== "waiting") {
    throw new Error("This game has already started or finished.");
  }

  if (roomData.players.length >= 4) {
    throw new Error("This room is already full (4/4 players).");
  }

  // Check if user is already in the room (prevents duplicate entries if they refresh)
  if (roomData.players.some((p) => p.uid === user.uid)) {
    return formattedCode;
  }

  // Assign the next available color
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

// Start the game (Host only)
export const startGame = async (roomCode) => {
  const roomRef = doc(db, "games", roomCode);
  await updateDoc(roomRef, {
    status: "playing"
  });
};

// Real-time listener for the room UI
export const subscribeToRoom = (roomCode, callback) => {
  const roomRef = doc(db, "games", roomCode.toUpperCase());
  
  return onSnapshot(roomRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data());
    } else {
      callback(null); // Room was deleted or invalid
    }
  });
};