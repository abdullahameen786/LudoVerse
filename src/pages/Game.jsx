// src/pages/Game.jsx
import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { createGameRoom, joinGameRoom, subscribeToRoom, startGame } from "../services/gameService";

function Game() {
  const { user } = useAuth();
  
  // State Management
  const [activeRoomCode, setActiveRoomCode] = useState(null);
  const [roomData, setRoomData] = useState(null);
  const [joinInput, setJoinInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Real-time Firestore Subscription
  useEffect(() => {
    if (!activeRoomCode) return;

    // Start listening to the room document
    const unsubscribe = subscribeToRoom(activeRoomCode, (data) => {
      if (data) {
        setRoomData(data);
      } else {
        setError("Room closed or invalid.");
        setActiveRoomCode(null);
      }
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [activeRoomCode]);

  // Handlers
  const handleCreateRoom = async () => {
    setError("");
    setLoading(true);
    try {
      const newRoomCode = await createGameRoom(user);
      setActiveRoomCode(newRoomCode);
    } catch (err) {
      setError(err.message || "Failed to create room.");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    if (!joinInput.trim()) return;
    
    setError("");
    setLoading(true);
    try {
      const code = await joinGameRoom(joinInput, user);
      setActiveRoomCode(code);
    } catch (err) {
      setError(err.message || "Failed to join room.");
    } finally {
      setLoading(false);
    }
  };

  const handleStartGame = async () => {
    if (!activeRoomCode) return;
    try {
      await startGame(activeRoomCode);
    } catch (err) {
      setError("Failed to start game.");
    }
  };

  // --------------------------------------------------------
  // VIEW 1: Main Menu (Create or Join)
  // --------------------------------------------------------
  if (!activeRoomCode) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4 py-12 bg-slate-50">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl border border-slate-100">
          <h1 className="text-3xl font-bold text-slate-800 mb-6">Game Lobby</h1>
          
          {error && (
            <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100">
              {error}
            </div>
          )}

          <button
            onClick={handleCreateRoom}
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 py-4 font-semibold text-white hover:bg-indigo-700 transition shadow-md disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Private Room"}
          </button>

          <div className="relative my-8 text-center">
            <hr className="border-slate-200" />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Or</span>
          </div>

          <form onSubmit={handleJoinRoom} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Enter 6-Digit Room Code"
                value={joinInput}
                onChange={(e) => setJoinInput(e.target.value.toUpperCase())}
                maxLength={6}
                required
                className="w-full rounded-xl border border-slate-200 p-4 text-center text-xl font-bold tracking-widest outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 uppercase"
              />
            </div>
            <button
              disabled={loading || joinInput.length < 6}
              className="w-full rounded-xl border border-slate-200 bg-white py-4 font-semibold text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
            >
              Join Game
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------
  // VIEW 2: Waiting Room UI
  // --------------------------------------------------------
  if (roomData && roomData.status === "waiting") {
    const isHost = roomData.hostId === user.uid;
    const playerCount = roomData.players.length;

    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4 py-12 bg-slate-50">
        <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-xl border border-slate-100">
          
          <div className="text-center mb-8">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Room Code</h2>
            <div className="inline-block bg-indigo-50 border border-indigo-100 text-indigo-700 text-4xl font-black tracking-[0.25em] py-3 px-6 rounded-2xl">
              {roomData.id}
            </div>
          </div>

          <div className="mb-6 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">Players ({playerCount}/4)</h3>
            {playerCount < 4 && (
              <span className="text-sm font-medium text-slate-500 animate-pulse">Waiting for others...</span>
            )}
          </div>

          <div className="space-y-3 mb-8">
            {roomData.players.map((player) => (
              <div key={player.uid} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full bg-${player.color}-500 shadow-sm`} style={{ backgroundColor: player.color }}></div>
                  <span className="font-semibold text-slate-700">{player.name}</span>
                  {player.uid === user.uid && <span className="text-xs font-bold text-indigo-600 bg-indigo-100 px-2 py-1 rounded-md">YOU</span>}
                </div>
                {player.isHost && (
                  <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded-md">HOST</span>
                )}
              </div>
            ))}
          </div>

          {isHost ? (
            <button
              onClick={handleStartGame}
              disabled={playerCount < 2}
              className="w-full rounded-xl bg-indigo-600 py-4 font-semibold text-white hover:bg-indigo-700 transition shadow-md disabled:opacity-50"
            >
              {playerCount < 2 ? "Need at least 2 players" : "Start Game Now"}
            </button>
          ) : (
            <div className="text-center p-4 rounded-xl bg-slate-50 border border-slate-100 text-slate-600 font-medium">
              Waiting for host to start the game...
            </div>
          )}
        </div>
      </div>
    );
  }

  // --------------------------------------------------------
  // VIEW 3: Active Game Board (Phase 4 Placeholder)
  // --------------------------------------------------------
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 bg-slate-50">
      <div className="w-full max-w-4xl rounded-3xl bg-white p-8 text-center shadow-xl border border-slate-100">
        <h1 className="text-3xl font-bold text-slate-800 mb-4">Game is Live!</h1>
        <p className="text-slate-600 mb-8">Room: {roomData?.id} | Players: {roomData?.players.length}</p>
        
        <div className="aspect-square max-w-md mx-auto bg-slate-100 rounded-3xl border-4 border-slate-200 flex items-center justify-center text-slate-400 font-bold text-xl">
          LUDO BOARD MOUNTING POINT
          <br/>
          (Phase 4)
        </div>
      </div>
    </div>
  );
}

export default Game;