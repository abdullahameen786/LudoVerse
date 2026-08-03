import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans">
      
      {/* Subtle Background Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-40" 
           style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      </div>

      {/* Hero Section (Split Layout) */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-32 flex flex-col lg:flex-row items-center justify-between gap-16 min-h-[85vh]">
        
        {/* Left Column: Typography & CTAs */}
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 mb-8 animate-fade-in-up">
            <span className="flex w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            <span className="text-xs font-black text-indigo-700 uppercase tracking-widest">Multiplayer Beta is Live</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[1.1] mb-6">
            Play Ludo Online <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">
              With Friends.
            </span>
          </h1>
          
          <p className="text-lg text-slate-500 font-medium mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Experience the classic board game re-imagined. Real-time multiplayer lobbies, fluid state synchronization, and a highly competitive global arena.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Link to="/game" className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-700 hover:-translate-y-1 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-2 group">
              Play Now 
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link to="/register" className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-slate-700 font-bold text-lg hover:bg-slate-50 transition-all border-2 border-slate-200 shadow-sm flex items-center justify-center">
              Create Account
            </Link>
          </div>
          
          {/* Social Proof / Stats */}
          <div className="mt-12 pt-8 border-t border-slate-200 flex items-center justify-center lg:justify-start gap-8">
            <div>
              <p className="text-2xl font-black text-slate-800">10ms</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sync Latency</p>
            </div>
            <div className="w-px h-8 bg-slate-200"></div>
            <div>
              <p className="text-2xl font-black text-slate-800">100%</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Server Uptime</p>
            </div>
          </div>
        </div>

        {/* Right Column: Abstract Isometric Board Graphic */}
        <div className="flex-1 relative w-full max-w-lg hidden md:block perspective-1000">
          <div className="relative w-full aspect-square transform -rotate-12 hover:rotate-0 transition-transform duration-700 ease-out">
            <div className="absolute inset-0 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
              <div className="absolute inset-y-0 left-1/3 right-1/3 bg-slate-50 border-x border-slate-100"></div>
              <div className="absolute inset-x-0 top-1/3 bottom-1/3 bg-slate-50 border-y border-slate-100"></div>
              <div className="absolute top-4 left-4 w-[28%] h-[28%] rounded-2xl bg-red-500 shadow-inner flex items-center justify-center"><div className="w-1/2 h-1/2 bg-white rounded-xl opacity-90"></div></div>
              <div className="absolute top-4 right-4 w-[28%] h-[28%] rounded-2xl bg-emerald-500 shadow-inner flex items-center justify-center"><div className="w-1/2 h-1/2 bg-white rounded-xl opacity-90"></div></div>
              <div className="absolute bottom-4 left-4 w-[28%] h-[28%] rounded-2xl bg-blue-500 shadow-inner flex items-center justify-center"><div className="w-1/2 h-1/2 bg-white rounded-xl opacity-90"></div></div>
              <div className="absolute bottom-4 right-4 w-[28%] h-[28%] rounded-2xl bg-amber-500 shadow-inner flex items-center justify-center"><div className="w-1/2 h-1/2 bg-white rounded-xl opacity-90"></div></div>
              <div className="absolute top-1/3 left-1/3 right-1/3 bottom-1/3 flex items-center justify-center"><div className="w-full h-full bg-slate-800 rotate-45 transform scale-75 rounded shadow-lg"></div></div>
            </div>
            <div className="absolute top-1/4 right-1/3 w-8 h-8 rounded-full bg-red-500 border-4 border-white shadow-xl -translate-y-8 translate-x-4"></div>
            <div className="absolute bottom-1/3 left-1/4 w-8 h-8 rounded-full bg-blue-500 border-4 border-white shadow-xl -translate-y-12"></div>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo-400/20 blur-[100px] rounded-full -z-10"></div>
        </div>

      </main>
    </div>
  );
}

export default Home;