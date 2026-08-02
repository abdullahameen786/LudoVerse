// src/pages/Game.jsx
import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import useAudio from "../hooks/useAudio";
import { createGameRoom, joinGameRoom, subscribeToRoom, startGame, rollDiceInRoom, moveTokenInRoom, skipTurn, resignGame, proposeDraw, acceptDraw } from "../services/gameService";
import LudoBoard from "../components/game/LudoBoard";

function Game() {
  const { user } = useAuth();
  const { playSound } = useAudio();
  
  const [activeRoomCode, setActiveRoomCode] = useState(null);
  const [roomData, setRoomData] = useState(null);
  const [joinInput, setJoinInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    if (!activeRoomCode) return;
    const unsubscribe = subscribeToRoom(activeRoomCode, (data) => {
      if (data) setRoomData(data);
      else { setError("Room closed."); setActiveRoomCode(null); }
    });
    return () => unsubscribe();
  }, [activeRoomCode]);

  useEffect(() => {
    if (!roomData || roomData.status !== "playing") return;
    setTimeLeft(30);
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          const activePlayer = roomData.players[roomData.currentTurnIndex];
          if (activePlayer.uid === user.uid && !activePlayer.hasResigned) skipTurn(activeRoomCode, roomData);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [roomData?.currentTurnIndex, roomData?.status]);

  // Handlers
  const handleCreateRoom = async () => { /* ... existing code ... */ setError(""); setLoading(true); try { const code = await createGameRoom(user); setActiveRoomCode(code); } catch (err) { setError(err.message); } finally { setLoading(false); } };
  const handleJoinRoom = async (e) => { /* ... existing code ... */ e.preventDefault(); if (!joinInput.trim()) return; setError(""); setLoading(true); try { const code = await joinGameRoom(joinInput, user); setActiveRoomCode(code); } catch (err) { setError(err.message); } finally { setLoading(false); } };
  
  const handleRollDice = async () => { if (!activeRoomCode || !roomData) return; playSound("roll"); await rollDiceInRoom(activeRoomCode, roomData); };
  const handleTokenSelect = async (tokenObject) => { if (!activeRoomCode || !roomData) return; playSound("move"); await moveTokenInRoom(activeRoomCode, roomData, tokenObject); };

  // New Match Lifecycle Handlers
  const handleResign = async () => {
    if (window.confirm("Are you sure you want to resign? You will lose 50 coins.")) {
      await resignGame(activeRoomCode, roomData, user.uid);
    }
  };

  const handleDrawProposal = async () => {
    await proposeDraw(activeRoomCode, user.uid);
  };

  const handleAcceptDraw = async () => {
    await acceptDraw(activeRoomCode, roomData, user.uid);
  };

  // Views (Lobby/Waiting logic omitted for brevity, keeping existing structural layout)
  if (!activeRoomCode) { /* ... Lobby Return (Keep your existing Lobby view here) ... */
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

  if (roomData && roomData.status === "waiting") { /* ... Waiting Room Return ... */
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4 py-12 bg-slate-50">
        <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-xl border text-center">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Room Code</h2>
          <div className="bg-indigo-50 border text-indigo-700 text-3xl font-black py-3 px-6 rounded-2xl inline-block mb-6 tracking-[0.2em]">{roomData.id}</div>
          <div className="space-y-3 mb-6">
            {roomData.players.map((p) => (
              <div key={p.uid} className="p-4 rounded-xl border flex justify-between bg-slate-50">
                <span className="font-semibold text-slate-700 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }}></div>
                  {p.name}
                </span>
                {p.isHost && <span className="text-xs font-bold bg-amber-100 text-amber-600 px-2 py-1 rounded-md">HOST</span>}
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

  // Active Game View
  const activePlayer = roomData?.players[roomData.currentTurnIndex];
  const isMyTurn = activePlayer?.uid === user.uid;
  const isDangerTime = timeLeft <= 10;
  const myPlayerState = roomData?.players.find(p => p.uid === user.uid);
  
  // Draw State Logic
  const hasPendingDraw = roomData?.drawProposedBy && !roomData?.drawAcceptedBy?.includes(user.uid);
  const matchEnded = roomData?.status === "drawn" || roomData?.status === "finished";

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-8 bg-slate-50">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        
        {/* Match End Overlay */}
        <div className="flex justify-center relative">
          {matchEnded && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-2xl">
              <div className="bg-white p-8 rounded-2xl shadow-2xl text-center border-4 border-indigo-600">
                <h2 className="text-4xl font-black text-slate-800 mb-2">
                  {roomData.status === "drawn" ? "Match Drawn 🤝" : "Game Over 🏁"}
                </h2>
                <button onClick={() => window.location.reload()} className="mt-6 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700">Return to Lobby</button>
              </div>
            </div>
          )}
          <LudoBoard 
            players={roomData?.players} 
            currentTurnIndex={roomData?.currentTurnIndex} 
            currentDiceValue={roomData?.currentDiceValue} 
            hasRolledThisTurn={roomData?.hasRolledThisTurn} 
            user={user} 
            onTokenSelect={handleTokenSelect} 
          />
        </div>

        {/* Dashboard Controls */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border text-center space-y-6">
          
          {/* Draw Notification Banner */}
          {hasPendingDraw && !matchEnded && (
            <div className="bg-amber-100 border border-amber-300 p-4 rounded-xl mb-4 flex flex-col gap-3">
              <p className="text-sm font-bold text-amber-800">Another player has proposed a Draw.</p>
              <button onClick={handleAcceptDraw} className="w-full bg-amber-500 text-white font-bold py-2 rounded-lg hover:bg-amber-600">Accept Draw</button>
            </div>
          )}

          <h2 className="text-2xl font-bold text-slate-800">Match Live</h2>
          
          <div className="p-4 bg-slate-50 rounded-2xl border">
            <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Current Turn</p>
            <p className="text-2xl font-black mt-1" style={{ color: activePlayer?.color }}>
              {activePlayer?.hasResigned ? "Skipped (Resigned)" : activePlayer?.name}
            </p>
            <div className="mt-4">
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className={isDangerTime ? "text-red-500" : "text-slate-500"}>Time left</span>
                <span>{timeLeft}s</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className={`h-2 rounded-full transition-all duration-1000 ${isDangerTime ? 'bg-red-500' : 'bg-indigo-600'}`} style={{ width: `${(timeLeft / 30) * 100}%` }}></div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6">
            <div className="w-20 h-20 bg-slate-100 border-2 border-dashed border-slate-300 rounded-2xl flex items-center justify-center text-4xl font-black text-slate-700">
              {roomData?.currentDiceValue || "—"}
            </div>
            <button onClick={handleRollDice} disabled={!isMyTurn || roomData?.hasRolledThisTurn || myPlayerState?.hasResigned || matchEnded} className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-md disabled:opacity-40">
              {isMyTurn ? (roomData?.hasRolledThisTurn ? "Select Token" : "Roll Dice") : "Wait Turn"}
            </button>
          </div>

          {/* Lifecycle Controls */}
          <div className="flex gap-4 pt-6 border-t border-slate-100">
            <button 
              onClick={handleDrawProposal} 
              disabled={myPlayerState?.hasResigned || roomData?.drawProposedBy || matchEnded}
              className="flex-1 bg-slate-100 text-slate-600 font-semibold py-3 rounded-xl hover:bg-slate-200 transition disabled:opacity-50"
            >
              {roomData?.drawProposedBy ? "Draw Pending..." : "Offer Draw 🤝"}
            </button>
            <button 
              onClick={handleResign}
              disabled={myPlayerState?.hasResigned || matchEnded}
              className="flex-1 bg-red-50 text-red-600 font-semibold py-3 rounded-xl border border-red-200 hover:bg-red-100 transition disabled:opacity-50"
            >
              {myPlayerState?.hasResigned ? "Resigned 🏳️" : "Resign Match 🏳️"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Game;