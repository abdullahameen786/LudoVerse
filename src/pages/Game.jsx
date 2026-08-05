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

// ==========================================
  // 🌟 3. SAFE ATOMIC HEARTBEAT & AUTO-KICK ENGINE (100% FIXED)
  // ==========================================
  useEffect(() => {
    if (!activeRoomCode || !roomData || roomData.status !== "playing") return;

    // A. EMITTER: Quietly update specific user's ping using Atomic Dot Notation
    const heartbeatInterval = setInterval(async () => {
      try {
        const { doc, updateDoc } = await import("firebase/firestore");
        const { db } = await import("../firebase/config");
        const roomRef = doc(db, "games", activeRoomCode);

        // 🌟 FIX: We no longer overwrite the 'players' array. 
        // We only update a separate 'pings' object specifically for this user.
        await updateDoc(roomRef, {
          [`pings.${user.uid}`]: Date.now()
        });
      } catch (err) {
        console.error("Heartbeat emission failed safely:", err);
      }
    }, 6000); // Ping every 6 seconds

// B. AUDITOR (Host Only): Bulletproof state verification ignoring old array structures
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
            // 🌟 STRICT FIX: Direct dynamic dictionary lookup only. 
            // Agg user recently room state push kar raha hai to dynamic dictionary state rule karegi.
            const playerLastSeen = pings[p.uid] || now; 
            
            // Allow a generous 25-second window to prevent aggressive false-positive kicks during fast rolls
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Lobby Views
  if (!activeRoomCode) {
    return (
      <div className="flex min-h-[85vh] items-center justify-center px-4 py-6 bg-slate-50">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 md:p-8 text-center shadow-xl border border-slate-100">
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 mb-6">Game Lobby</h1>
          {error && (
            <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}
          <button
            onClick={handleCreateRoom}
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 py-3.5 font-bold text-white hover:bg-indigo-700 shadow-md active:scale-95 transition-all text-sm md:text-base"
          >
            Create Private Room
          </button>
          <div className="relative my-6">
            <hr className="border-slate-200" />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
              Or Join Friends
            </span>
          </div>
          <form onSubmit={handleJoinRoom} className="space-y-4">
            <input
              type="text"
              placeholder="ENTER ROOM CODE"
              value={joinInput}
              onChange={(e) => setJoinInput(e.target.value.toUpperCase())}
              maxLength={6}
              className="w-full rounded-xl border border-slate-200 p-3.5 text-center text-lg md:text-xl font-black uppercase tracking-widest outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all bg-slate-50"
            />
            <button
              disabled={joinInput.length < 6}
              className="w-full rounded-xl border bg-white py-3.5 font-bold text-slate-700 hover:bg-slate-50 transition-all text-sm md:text-base disabled:opacity-40"
            >
              Join Room
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (roomData && roomData.status === "waiting") {
    return (
      <div className="flex min-h-[85vh] items-center justify-center px-4 py-6 bg-slate-50">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 md:p-8 shadow-xl border text-center">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Room Code</h2>
          <div className="bg-indigo-50 border border-indigo-100 text-indigo-700 text-2xl md:text-3xl font-black py-2.5 px-6 rounded-xl inline-block mb-6 tracking-[0.2em]">
            {roomData.id}
          </div>
          <p className="text-xs font-bold text-slate-400 text-left uppercase mb-2">Connected Squad</p>
          <div className="space-y-2.5 mb-6">
            {roomData.players.map((p) => (
              <div key={p.uid} className="p-3 rounded-xl border flex justify-between bg-slate-50 items-center text-sm">
                <span className="font-bold text-slate-700 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full shadow-xs" style={{ backgroundColor: p.color }}></div>
                  {p.name}
                </span>
                {p.isHost && (
                  <span className="text-[10px] font-black bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md uppercase tracking-wider">
                    HOST
                  </span>
                )}
              </div>
            ))}
          </div>
          {roomData.hostId === user.uid ? (
            <button
              onClick={() => startGame(activeRoomCode)}
              disabled={roomData.players.length < 2}
              className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-40 text-sm"
            >
              Start Arena Match
            </button>
          ) : (
            <div className="p-3 bg-slate-100 rounded-xl text-slate-500 font-medium text-xs md:text-sm animate-pulse">
              Waiting for host to initiate match...
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // 🌟 STRICT CONTEXT EVALUATION (BUG FIXED HERE)
  // ==========================================
  const activePlayer = roomData?.players?.[roomData?.currentTurnIndex];
  const currentUserId = user?.uid?.trim();
  const activePlayerId = activePlayer?.uid?.trim();
  
  const isMyTurn = currentUserId && activePlayerId && currentUserId === activePlayerId;
  const isDangerTime = timeLeft <= 15;
  const myPlayerState = roomData?.players?.find((p) => p?.uid?.trim() === currentUserId);

  const hasPendingDraw = roomData?.drawProposedBy && !roomData?.drawAcceptedBy?.includes(user.uid);
  const matchEnded = roomData?.status === "finished" || roomData?.status === "drawn";

  return (
    <div className="w-full max-w-[100vw] min-h-[calc(100vh-76px)] bg-slate-100 flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8 box-border overflow-x-hidden">
      <div className="w-full max-w-5xl flex flex-col lg:flex-row items-center justify-center gap-6">
        
        {/* LUDO BOARD PANEL */}
        <div className="w-full max-w-[440px] bg-white p-3 sm:p-4 rounded-3xl shadow-md border border-slate-200/60 relative flex justify-center items-center shrink-0">
          {matchEnded && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs rounded-3xl p-4">
              <div className="bg-white p-6 rounded-xl shadow-2xl text-center border-2 border-indigo-600 max-w-xs w-full space-y-3.5">
                <div className="text-4xl">👑</div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                  {roomData.status === "drawn" ? "Match Drawn 🤝" : "Victory! 🎉"}
                </h2>
                <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                  {roomData.status === "drawn"
                    ? "All active players accepted the draw proposal."
                    : `${roomData.winnerName || "A competitor"} has won.`}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="w-full mt-1 px-4 py-2.5 bg-indigo-600 text-white font-bold rounded-lg text-xs shadow-md hover:bg-indigo-700"
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
        <div className="w-full max-w-[440px] lg:max-w-none lg:flex-1 bg-white rounded-3xl p-5 md:p-6 shadow-md border border-slate-200/60 space-y-4 self-stretch flex flex-col justify-between">
          <div>
            {hasPendingDraw && !matchEnded && (
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-center space-y-2 mb-3">
                <p className="text-[11px] font-black text-amber-800 uppercase tracking-widest">
                  Draw Requested
                </p>
                <div className="flex gap-2">
                  <button onClick={handleAcceptDraw} className="flex-1 bg-amber-500 text-white font-bold py-1.5 rounded-lg text-xs hover:bg-amber-600">
                    Accept
                  </button>
                  <button onClick={handleDeclineDraw} className="flex-1 bg-white border border-amber-300 text-amber-700 font-bold py-1.5 rounded-lg text-xs hover:bg-amber-50">
                    Decline
                  </button>
                </div>
              </div>
            )}

            <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight mb-2 text-center lg:text-left">
              Match Live
            </h2>

            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="text-left">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">
                  Active State
                </p>
                <h3 className="text-base font-black tracking-tight flex items-center gap-1.5 mt-0.5" style={{ color: activePlayer?.color }}>
                  <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: activePlayer?.color }}></span>
                  {activePlayer?.uid === user.uid ? "Your Turn! ⚡" : `${activePlayer?.name}'s Turn`}
                  {activePlayer?.hasResigned && " (Resigned)"}
                </h3>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">
                  Time Left
                </p>
                <p className={`text-base font-black mt-0.5 ${isDangerTime ? "text-red-500 animate-pulse" : "text-slate-700"}`}>
                  {timeLeft}s
                </p>
              </div>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mt-3">
              <div
                className={`h-1.5 rounded-full transition-all duration-1000 ease-linear ${isDangerTime ? "bg-red-500" : "bg-indigo-600"}`}
                style={{ width: `${(timeLeft / 120) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center justify-between gap-4 w-full">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-2xl font-black text-slate-800 shadow-xs">
                  {roomData?.currentDiceValue || "—"}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wide">
                    Action Guide
                  </p>
                  <p className="text-xs font-bold text-slate-600">
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
                className={`px-5 py-3 text-white font-bold text-xs rounded-xl shadow-md transition-all text-center active:scale-95 min-w-[100px] ${
                  isMyTurn
                    ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100 cursor-pointer opacity-100"
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
                className="flex-1 bg-slate-50 text-slate-600 border border-slate-200/80 font-bold py-2.5 rounded-xl text-xs hover:bg-slate-100 disabled:opacity-40"
              >
                {roomData?.drawProposedBy ? "Draw Proposed" : "Offer Draw 🤝"}
              </button>
              <button
                onClick={handleResign}
                disabled={myPlayerState?.hasResigned || matchEnded}
                className="flex-1 bg-red-50 text-red-600 font-bold py-2.5 rounded-xl text-xs border border-red-100 hover:bg-red-100 disabled:opacity-40"
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