// src/components/game/GameChat.jsx
import React, { useState, useRef, useEffect } from "react";
import { sendChatMessage } from "../../services/gameService";

const QUICK_EMOJIS = ["😂", "🤡", "👑", "🎲", "🤝", "🔥", "😭", "🥱"];

const TEXT_COLORS = {
  red: "text-red-600 bg-red-50 border-red-100",
  green: "text-emerald-600 bg-emerald-50 border-emerald-100",
  blue: "text-blue-600 bg-blue-50 border-blue-100",
  yellow: "text-amber-500 bg-amber-50 border-amber-100"
};

function GameChat({ roomCode, players, user, roomData }) {
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);

  const myPlayer = players?.find((p) => p.uid === user?.uid);
  const myColor = myPlayer?.color || "red";
  const myName = myPlayer?.name || "Player";

  const chatMessages = roomData?.chatMessages || []; 

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages.length]);

  const handleSendText = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !roomCode) return;

    try {
      const msg = inputMessage;
      setInputMessage(""); 
      await sendChatMessage(roomCode, myColor, myName, msg);
    } catch (err) {
      console.error("Chat transmission failed:", err);
    }
  };

  const handleSendEmoji = async (emoji) => {
    if (!roomCode) return;
    try {
      await sendChatMessage(roomCode, myColor, myName, emoji);
    } catch (err) {
      console.error("Emoji drop failed:", err);
    }
  };

  return (
    <div className="w-full bg-white/90 backdrop-blur-xl rounded-3xl p-3 sm:p-4 shadow-sm border border-slate-100 flex flex-col flex-1 min-h-[220px] max-h-[300px]">
      
      <div className="flex items-center gap-2 pb-2 border-b border-slate-100 overflow-x-auto shrink-0 justify-between no-scrollbar">
        {QUICK_EMOJIS.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => handleSendEmoji(emoji)}
            className="text-xl sm:text-2xl p-1 hover:bg-slate-50 rounded-xl transition active:scale-75 cursor-pointer"
          >
            {emoji}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto py-2 space-y-2 pr-1 text-left flex flex-col min-h-0">
        {chatMessages.length === 0 ? (
          <div className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest text-center my-auto opacity-60">
            Arena Live Chat Feed
          </div>
        ) : (
          chatMessages.map((msg) => {
            const colorStyle = TEXT_COLORS[msg.senderColor] || "text-slate-600 bg-slate-50";
            return (
              <div 
                key={msg.id} 
                className={`p-2 rounded-2xl border text-xs sm:text-sm flex flex-col gap-0.5 animate-fadeIn ${colorStyle}`}
              >
                <span className="text-[9px] font-black uppercase tracking-wider opacity-70">
                  {msg.senderName} ({msg.senderColor})
                </span>
                <span className="font-semibold break-words leading-tight">{msg.text}</span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendText} className="flex gap-2 pt-2 border-t border-slate-100 shrink-0 mt-auto">
        <input
          type="text"
          placeholder="Taunt your opponents..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          maxLength={60}
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium outline-none focus:bg-white focus:border-indigo-500 transition-all placeholder:text-slate-400"
        />
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 sm:px-4 rounded-xl text-xs sm:text-sm transition active:scale-95 shadow-md shadow-indigo-100 cursor-pointer">
          Send
        </button>
      </form>
    </div>
  );
}

export default GameChat;