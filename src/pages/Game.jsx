// src/pages/Game.jsx
import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { createGameRoom, joinGameRoom, subscribeToRoom, startGame, rollDiceInRoom } from "../services/gameService";
import LudoBoard from "../components/game/LudoBoard";

function Game() {
  const { user } = useAuth();
  const [activeRoomCode, setActiveRoomCode] = useState(null);
  const [roomData, setRoomData] = useState(null);
  const [joinInput, setJoinInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!activeRoomCode) return;
    const unsubscribe = subscribeToRoom(activeRoomCode, (data) => {
      if (data) setRoomData(data);
      else {
        setError("Room closed or invalid.");
        setActiveRoomCode(null);
      }
    });
    return () => unsubscribe();
  }, [activeRoomCode]);

  const handleCreateRoom = async () => {
    setError(""); setLoading(true);
    try {
      const code = await createGameRoom(user);
      setActiveRoomCode(code);
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    if (!joinInput.trim()) return;
    setError(""); setLoading(true);
    try {
      const code = await joinGameRoom(joinInput, user);
      setActiveRoomCode(code);
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  const handleRollDice = async () => {
    if (!activeRoomCode || !roomData) return;
    await rollDiceInRoom(activeRoomCode, roomData);
  };

  if (!activeRoomCode) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4 py-12 bg-slate-50">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl border border-slate-100">
          <h1 className="text-3xl font-bold text-slate-800 mb-6">Game Lobby</h1>
          {error && <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-600">{error}</div>}
          <button onClick={handleCreateRoom} disabled={loading} className="w-full rounded-xl bg-indigo-600 py-4 font-semibold text-white hover:bg-indigo-700 shadow-md">Create Room</button>
          <div className="relative my-8"><hr className="border-slate-200"/><span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Or</span></div>
          <form onSubmit={handleJoinRoom} className="space-y-4">
            <input type="text" placeholder="Enter Room Code" value={joinInput} onChange={(e) => setJoinInput(e.target.value.toUpperCase())} maxLength={6} className="w-full rounded-xl border border-slate-200 p-4 text-center text-xl font-bold uppercase tracking-widest outline-none focus:border-indigo-600" />
            <button disabled={joinInput.length < 6} className="w-full rounded-xl border bg-white py-4 font-semibold text-slate-700">Join Game</button>
          </form>
        </div>
      </div>
    );
  }

  if (roomData && roomData.status === "waiting") {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4 py-12 bg-slate-50">
        <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-xl border text-center">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Room Code</h2>
          <div className="bg-indigo-50 border text-indigo-700 text-3xl font-black py-3 px-6 rounded-2xl inline-block mb-6">{roomData.id}</div>
          <div className="space-y-3 mb-6">
            {roomData.players.map((p) => (
              <div key={p.uid} className="p-4 rounded-xl border flex justify-between bg-slate-50">
                <span className="font-semibold">{p.name} ({p.color})</span>
                {p.isHost && <span className="text-xs bg-amber-100 text-amber-600 px-2 py-1 rounded">HOST</span>}
              </div>
            ))}
          </div>
          {roomData.hostId === user.uid ? (
            <button onClick={() => startGame(activeRoomCode)} disabled={roomData.players.length < 2} className="w-full bg-indigo-600 text-white py-4 rounded-xl font-semibold">Start Match</button>
          ) : (
            <div className="p-4 bg-slate-100 rounded-xl text-slate-600">Waiting for host...</div>
          )}
        </div>
      </div>
    );
  }

  const activePlayer = roomData?.players[roomData.currentTurnIndex];
  const isMyTurn = activePlayer?.uid === user.uid;

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-8 bg-slate-50">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="flex justify-center">
          <LudoBoard players={roomData?.players} roomData={roomData} onCellClick={(r, c) => console.log(`Tile coordinate matching: ${r}, ${c}`)} />
        </div>
        <div className="bg-white rounded-3xl p-8 shadow-xl border text-center space-y-6">
          <h2 className="text-2xl font-bold text-slate-800">Match in Progress</h2>
          <div className="p-4 bg-slate-50 rounded-2xl border">
            <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Current Turn</p>
            <p className="text-xl font-bold mt-1" style={{ color: activePlayer?.color }}>{activePlayer?.name}</p>
          </div>
          <div className="flex items-center justify-center gap-6">
            <div className="w-20 h-20 bg-slate-100 border-2 border-dashed border-slate-300 rounded-2xl flex items-center justify-center text-4xl font-black text-slate-700">
              {roomData?.currentDiceValue || "—"}
            </div>
            <button onClick={handleRollDice} disabled={!isMyTurn} className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-md disabled:opacity-40 transition">
              {isMyTurn ? "Roll Dice" : "Waiting for Turn"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Game;