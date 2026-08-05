// src/pages/Game.jsx
import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import useAudio from "../hooks/useAudio";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";

import {
  createGameRoom,
  joinGameRoom,
  subscribeToRoom,
  startGame,
  rollDiceInRoom,
  moveTokenInRoom,
  skipTurn,
  resignGame,
  proposeDraw,
  acceptDraw,
  declineDraw,
} from "../services/gameService";
import LudoBoard from "../components/game/LudoBoard";

const getAmbientGlow = (color) => {
  switch (color) {
    case 'red': return 'from-rose-500/20 to-red-500/10';
    case 'green': return 'from-emerald-500/20 to-teal-500/10';
    case 'blue': return 'from-sky-500/20 to-blue-500/10';
    case 'yellow': return 'from-amber-500/20 to-yellow-500/10';
    default: return 'from-indigo-500/20 to-violet-500/10';
  }
};

function Game() {
  const { user } = useAuth();
  const { playSound } = useAudio();

  const [activeRoomCode, setActiveRoomCode] = useState(null);
  const [roomData, setRoomData] = useState(null);
  const [joinInput, setJoinInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(120);

  // 1. Live Sync Loop
  useEffect(() => {
    if (!activeRoomCode) return;
    const unsubscribe = subscribeToRoom(activeRoomCode, (data) => {
      if (data) setRoomData(data);
      else {
        setError("Room closed.");
        setActiveRoomCode(null);
      }
    });
    return () => unsubscribe();
  }, [activeRoomCode]);

  // 2. Turn Countdown Timer Engine
  useEffect(() => {
    if (!roomData || roomData.status !== "playing") return;
    setTimeLeft(120);
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          const activePlayer = roomData.players[roomData.currentTurnIndex];
          if (activePlayer.uid === user.uid && !activePlayer.hasResigned) {
            skipTurn(activeRoomCode, roomData);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [roomData?.currentTurnIndex, roomData?.status, activeRoomCode, user.uid]);

  // 3. SAFE ATOMIC HEARTBEAT & AUTO-KICK ENGINE
  useEffect(() => {
    if (!activeRoomCode || !roomData || roomData.status !== "playing") return;

    const heartbeatInterval = setInterval(async () => {
      try {
        const { doc, updateDoc } = await import("firebase/firestore");
        const { db } = await import("../firebase/config");
        const roomRef = doc(db, "games", activeRoomCode);

        await updateDoc(roomRef, {
          [`pings.${user.uid}`]: Date.now()
        });
      } catch (err) {
        console.error("Heartbeat emission failed safely:", err);
      }
    }, 6000); 

    let disconnectChecker;
    if (roomData.hostId === user.uid) {
      disconnectChecker = setInterval(async () => {
        try {
          const { getDoc, doc, updateDoc } = await import("firebase/firestore");
          const { db } = await import("../firebase/config");
          const roomRef = doc(db, "games", activeRoomCode);

          const freshSnap = await getDoc(roomRef);
          if (!freshSnap.exists() || freshSnap.data().status !== "playing") return;
          
          const freshData = freshSnap.data();
          const pings = freshData.pings || {};
          const now = Date.now();
          let stateChanged = false;

          const checkedPlayers = freshData.players.map((p) => {
            const playerLastSeen = pings[p.uid] || now; 
            if (!p.hasResigned && now - playerLastSeen > 25000) {
              stateChanged = true;
              return { ...p, hasResigned: true, isDisconnected: true };
            }
            return p;
          });

          if (stateChanged) {
            let nextTurnIndex = freshData.currentTurnIndex;
            const activePlayerUID = freshData.players[nextTurnIndex].uid;
            const targetDCPlayer = checkedPlayers.find(
              (p) => p.isDisconnected && p.uid === activePlayerUID
            );

            if (targetDCPlayer) {
              nextTurnIndex = (nextTurnIndex + 1) % checkedPlayers.length;
              while (checkedPlayers[nextTurnIndex].hasResigned) {
                nextTurnIndex = (nextTurnIndex + 1) % checkedPlayers.length;
              }
            }

            const activePlayersLeft = checkedPlayers.filter((p) => !p.hasResigned);
            const finalStatus = activePlayersLeft.length <= 1 ? "finished" : freshData.status;

            await updateDoc(roomRef, {
              players: checkedPlayers,
              currentTurnIndex: nextTurnIndex,
              hasRolledThisTurn: false,
              currentDiceValue: null,
              status: finalStatus,
              winnerName:
                finalStatus === "finished" && activePlayersLeft.length === 1
                  ? activePlayersLeft[0].name
                  : freshData.winnerName || null,
            });
          }
        } catch (err) {
          console.error("Host cleanup auditor failure bypass:", err);
        }
      }, 10000);
    }

    return () => {
      clearInterval(heartbeatInterval);
      if (disconnectChecker) clearInterval(disconnectChecker);
    };
  }, [activeRoomCode, roomData?.status, roomData?.hostId, user.uid]);

  // Click Handlers
  const handleCreateRoom = async () => {
    setError("");
    setLoading(true);
    try {
      const code = await createGameRoom(user);
      setActiveRoomCode(code);
    } catch (err) {
      setError(err.message);
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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRollDice = async () => {
    if (!activeRoomCode || !roomData) return;
    playSound("roll");
    await rollDiceInRoom(activeRoomCode, roomData);
  };

  const handleTokenSelect = async (tokenObject) => {
    if (!activeRoomCode || !roomData) return;
    playSound("move");
    await moveTokenInRoom(activeRoomCode, roomData, tokenObject);
  };

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

  const handleDeclineDraw = async () => {
    await declineDraw(activeRoomCode);
  };

  // ==========================================
  // 🎮 LOBBY VIEW (Dark Premium Card on Light Dashboard Background)
  // ==========================================
  if (!activeRoomCode) {
    return (
      <div className="flex min-h-[calc(100vh-76px)] items-center justify-center px-4 py-8 bg-slate-50 relative overflow-hidden">
        {/* Dashboard Style Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] max-w-2xl h-[300px] bg-indigo-400/15 blur-[100px] rounded-full pointer-events-none z-0"></div>

        {/* Deep Premium Dark Card */}
        <div className="w-full max-w-md rounded-[2rem] bg-slate-900 p-8 md:p-10 shadow-2xl shadow-indigo-200/50 border border-slate-800 text-center relative z-10 animate-fade-in">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 mx-auto mb-6 transform -rotate-3">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>

          <h1 className="text-3xl font-black text-white mb-6 tracking-tight">Arena Lobby</h1>
          
          {error && (
            <div className="mb-6 rounded-xl bg-rose-500/10 p-4 text-sm text-rose-400 border border-rose-500/20 backdrop-blur-md">
              {error}
            </div>
          )}
          
          <button
            onClick={handleCreateRoom}
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 py-3.5 font-bold text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 active:scale-95 transition-all mb-6 cursor-pointer"
          >
            Create Private Match
          </button>
          
          <div className="relative my-6 text-center">
            <hr className="border-slate-800" />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Or Join Squad
            </span>
          </div>
          
          <form onSubmit={handleJoinRoom} className="space-y-4">
            <input
              type="text"
              placeholder="ENTER 6-DIGIT CODE"
              value={joinInput}
              onChange={(e) => setJoinInput(e.target.value.toUpperCase())}
              maxLength={6}
              className="w-full rounded-xl border border-slate-700 bg-slate-800/50 p-3.5 text-center text-lg font-black text-white uppercase tracking-[0.3em] outline-none focus:border-indigo-500 focus:bg-slate-800 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-500 placeholder:tracking-normal"
            />
            <button
              disabled={joinInput.length < 6}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 py-3.5 font-bold text-white hover:bg-slate-700/80 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              Join Match
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ==========================================
  // 🎮 WAITING VIEW (Dark Premium Card on Light Dashboard Background)
  // ==========================================
  if (roomData && roomData.status === "waiting") {
    return (
      <div className="flex min-h-[calc(100vh-76px)] items-center justify-center px-4 py-8 bg-slate-50 relative overflow-hidden">
        {/* Dashboard Style Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] max-w-2xl h-[300px] bg-emerald-400/15 blur-[100px] rounded-full pointer-events-none z-0"></div>

        {/* Deep Premium Dark Card */}
        <div className="w-full max-w-md rounded-[2rem] bg-slate-900 p-8 md:p-10 shadow-2xl shadow-emerald-200/40 border border-slate-800 text-center relative z-10 animate-fade-in">
          <h2 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-2">Room Authorized</h2>
          
          <div className="bg-slate-950 border border-slate-800 text-white text-3xl font-black py-3.5 px-6 rounded-2xl inline-block mb-6 tracking-[0.3em] shadow-inner select-all">
            {roomData.id}
          </div>
          
          <p className="text-[11px] font-bold text-slate-500 text-left uppercase mb-3 tracking-wider">Connected Competitors</p>
          
          <div className="space-y-2.5 mb-6">
            {roomData.players.map((p) => (
              <div key={p.uid} className="p-3 rounded-xl border border-slate-800 bg-slate-800/50 flex justify-between items-center text-sm">
                <span className="font-bold text-white flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }}></div>
                  {p.name}
                </span>
                {p.isHost && (
                  <span className="text-[9px] font-black bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-lg uppercase tracking-widest">
                    Host
                  </span>
                )}
              </div>
            ))}
          </div>
          
          {roomData.hostId === user.uid ? (
            <button
              onClick={() => startGame(activeRoomCode)}
              disabled={roomData.players.length < 2}
              className="w-full bg-emerald-600 text-white py-3.5 rounded-xl font-bold text-base hover:bg-emerald-500 shadow-lg shadow-emerald-600/20 active:scale-95 transition-all disabled:opacity-40 cursor-pointer"
            >
              Start Arena Match
            </button>
          ) : (
            <div className="p-3 bg-slate-800/50 rounded-xl text-slate-400 font-medium text-xs animate-pulse border border-slate-700/50">
              Waiting for host to initiate match...
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // 🎲 CORE ACTIVE GAME SCREEN (Light Background)
  // ==========================================
  const activePlayer = roomData?.players?.[roomData?.currentTurnIndex];
  const currentUserId = user?.uid?.trim();
  const activePlayerId = activePlayer?.uid?.trim();
  
  const isMyTurn = currentUserId && activePlayerId && currentUserId === activePlayerId;
  const isDangerTime = timeLeft <= 15;
  const myPlayerState = roomData?.players?.find((p) => p?.uid?.trim() === currentUserId);

  const hasPendingDraw = roomData?.drawProposedBy && !roomData?.drawAcceptedBy?.includes(user.uid);
  const matchEnded = roomData?.status === "finished" || roomData?.status === "drawn";

  const dynamicGlow = getAmbientGlow(activePlayer?.color);

  return (
    <div className="w-full max-w-[100vw] min-h-[calc(100vh-76px)] bg-slate-50 flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8 box-border overflow-x-hidden relative">
      
      {/* Dynamic Ambient Match Background Glow */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-gradient-to-tr ${dynamicGlow} blur-[120px] rounded-full pointer-events-none transition-colors duration-1000 z-0`}></div>

      <div className="w-full max-w-5xl flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-10 relative z-10">
        
        {/* LUDO BOARD PANEL */}
        <div className="w-full max-w-[440px] bg-white/60 backdrop-blur-xl p-3 sm:p-4 rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-white relative flex justify-center items-center shrink-0">
          
          {matchEnded && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-900/80 backdrop-blur-md rounded-[2rem] p-4 animate-fade-in">
              <div className="bg-white p-8 rounded-3xl shadow-2xl text-center border-2 border-indigo-500 max-w-xs w-full space-y-4">
                <div className="w-20 h-20 mx-auto bg-indigo-50 rounded-full flex items-center justify-center text-5xl mb-2 shadow-inner">
                  {roomData.status === "drawn" ? "🤝" : "👑"}
                </div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                  {roomData.status === "drawn" ? "Match Drawn" : "Victory!"}
                </h2>
                <p className="text-sm font-semibold text-slate-500 leading-relaxed px-2">
                  {roomData.status === "drawn"
                    ? "All active players accepted the draw proposal."
                    : `${roomData.winnerName || "A competitor"} has dominated the arena.`}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="w-full mt-4 px-6 py-3.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all"
                >
                  Return to Lobby
                </button>
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

        {/* CONTROLS DASHBOARD PANEL */}
        <div className="w-full max-w-[440px] lg:max-w-none lg:flex-1 bg-white/70 backdrop-blur-xl rounded-[2rem] p-6 md:p-8 shadow-xl shadow-slate-200/50 border border-white space-y-6 self-stretch flex flex-col justify-between">
          <div>
            {hasPendingDraw && !matchEnded && (
              <div className="bg-amber-50 border border-amber-200/80 p-4 rounded-2xl text-center space-y-3 mb-5 shadow-sm animate-fade-in">
                <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest flex items-center justify-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping"></span> Draw Requested
                </p>
                <div className="flex gap-2">
                  <button onClick={handleAcceptDraw} className="flex-1 bg-amber-500 text-white font-bold py-2 rounded-xl text-xs hover:bg-amber-600 active:scale-95 transition-all shadow-sm shadow-amber-200">
                    Accept
                  </button>
                  <button onClick={handleDeclineDraw} className="flex-1 bg-white border border-amber-300 text-amber-700 font-bold py-2 rounded-xl text-xs hover:bg-amber-50 active:scale-95 transition-all">
                    Decline
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between border-b border-slate-200/60 pb-4">
              <div className="text-left">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">
                  Active State
                </p>
                <h3 className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-2" style={{ color: activePlayer?.color }}>
                  <span className="relative flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ backgroundColor: activePlayer?.color }}></span>
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5" style={{ backgroundColor: activePlayer?.color }}></span>
                  </span>
                  {activePlayer?.uid === user.uid ? "Your Turn! ⚡" : `${activePlayer?.name}'s Turn`}
                  {activePlayer?.hasResigned && " (Resigned)"}
                </h3>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">
                  Time Left
                </p>
                <p className={`text-2xl font-black tracking-tight ${isDangerTime ? "text-rose-500 animate-pulse drop-shadow-sm" : "text-slate-800"}`}>
                  {timeLeft}s
                </p>
              </div>
            </div>

            <div className="w-full bg-slate-200/60 rounded-full h-2 overflow-hidden mt-4 shadow-inner">
              <div
                className={`h-2 rounded-full transition-all duration-1000 ease-linear ${isDangerTime ? "bg-rose-500" : "bg-indigo-500"}`}
                style={{ width: `${(timeLeft / 120) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 flex items-center justify-between gap-4 w-full shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-3xl font-black text-slate-800 shadow-sm">
                  {roomData?.currentDiceValue || "—"}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                    Action Guide
                  </p>
                  <p className="text-sm font-bold text-slate-700 leading-snug">
                    {isMyTurn
                      ? roomData?.hasRolledThisTurn
                        ? "Tap your active token on the board"
                        : "Click the button to spin dice"
                      : `Waiting for ${activePlayer?.name || "opponent"} to finish shift`}
                  </p>
                </div>
              </div>
              <button
                onClick={handleRollDice}
                disabled={!isMyTurn || roomData?.hasRolledThisTurn || myPlayerState?.hasResigned || matchEnded}
                className={`px-6 py-4 text-white font-bold text-sm rounded-xl transition-all text-center min-w-[120px] ${
                  isMyTurn
                    ? "bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 active:scale-95 cursor-pointer opacity-100"
                    : "bg-slate-300 cursor-not-allowed shadow-none opacity-60"
                }`}
              >
                {isMyTurn
                  ? roomData?.hasRolledThisTurn
                    ? "Select Token"
                    : "Roll Dice 🎲"
                  : "Wait Turn ⏳"}
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleDrawProposal}
                disabled={myPlayerState?.hasResigned || roomData?.drawProposedBy || matchEnded}
                className="flex-1 bg-white text-slate-600 border border-slate-200 font-bold py-3.5 rounded-xl text-xs hover:bg-slate-50 hover:border-slate-300 active:scale-95 transition-all disabled:opacity-40 disabled:active:scale-100 shadow-sm"
              >
                {roomData?.drawProposedBy ? "Draw Proposed" : "Offer Draw 🤝"}
              </button>
              <button
                onClick={handleResign}
                disabled={myPlayerState?.hasResigned || matchEnded}
                className="flex-1 bg-white text-rose-600 font-bold py-3.5 rounded-xl text-xs border border-rose-200 hover:bg-rose-50 active:scale-95 transition-all disabled:opacity-40 disabled:active:scale-100 shadow-sm"
              >
                {myPlayerState?.hasResigned ? "Resigned 🏳️" : "Resign Match 🏳️"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Game;