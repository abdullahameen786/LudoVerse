import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    // Max height clamped to 100vh minus a generic navbar allowance to block overflow
    <div className="h-[calc(100vh-76px)] w-full bg-slate-50 relative overflow-hidden font-sans flex items-center">
      
      {/* Subtle Background Grid Pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-40 pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }}
      ></div>

      {/* Main Content Area Container */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center h-full max-h-[600px]">
        
        {/* Left Column: Context Details & Actions (Spans 7 columns for space) */}
        <div className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left space-y-4 md:space-y-6">
          
          {/* Status Notification Tag */}
          <div className="self-center lg:self-start inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100">
            <span className="flex w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest">Multiplayer Beta is Live</span>
          </div>

          {/* Dynamically Scaled Headline to match strict bounds */}
          <h1 className="text-4xl md:text-5xl xl:text-6xl font-black text-slate-900 tracking-tighter leading-[1.1]">
            Play Ludo Online <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">
              With Friends.
            </span>
          </h1>
          
          {/* Constrained descriptive copy blocks over-expansion */}
          <p className="text-sm md:text-base text-slate-500 font-medium max-w-lg mx-auto lg:mx-0 leading-relaxed">
            Experience the classic board game re-imagined. Real-time multiplayer lobbies, fluid state synchronization, and a highly competitive global arena.
          </p>

          {/* Primary Call To Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
            <Link to="/game" className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-indigo-600 text-white font-bold text-base hover:bg-indigo-700 hover:-translate-y-0.5 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 group">
              Play Now 
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link to="/register" className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white text-slate-700 font-bold text-base hover:bg-slate-50 transition-all border border-slate-200 shadow-sm flex items-center justify-center">
              Create Account
            </Link>
          </div>
          
          {/* Metrics Segment */}
          <div className="pt-6 border-t border-slate-200/80 flex items-center justify-center lg:justify-start gap-8">
            <div>
              <p className="text-xl font-black text-slate-800">10ms</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Sync Latency</p>
            </div>
            <div className="w-px h-6 bg-slate-200"></div>
            <div>
              <p className="text-xl font-black text-slate-800">100%</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Server Uptime</p>
            </div>
          </div>

        </div>

        {/* Right Column: Isometric Simulated Canvas Matrix (Spans 5 columns) */}
        <div className="lg:col-span-5 hidden lg:flex justify-center relative perspective-1000">
          <div className="relative w-full max-w-[340px] aspect-square transform -rotate-12 hover:rotate-0 transition-transform duration-700 ease-out z-10">
            
            {/* Modular Graphic Node Wireframe */}
            <div className="absolute inset-0 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
              <div className="absolute inset-y-0 left-1/3 right-1/3 bg-slate-50 border-x border-slate-100"></div>
              <div className="absolute inset-x-0 top-1/3 bottom-1/3 bg-slate-50 border-y border-slate-100"></div>
              
              <div className="absolute top-3 left-3 w-[28%] h-[28%] rounded-xl bg-red-500 shadow-inner flex items-center justify-center">
                <div className="w-1/2 h-1/2 bg-white rounded-lg opacity-95"></div>
              </div>
              <div className="absolute top-3 right-3 w-[28%] h-[28%] rounded-xl bg-emerald-500 shadow-inner flex items-center justify-center">
                <div className="w-1/2 h-1/2 bg-white rounded-lg opacity-95"></div>
              </div>
              <div className="absolute bottom-3 left-3 w-[28%] h-[28%] rounded-xl bg-blue-500 shadow-inner flex items-center justify-center">
                <div className="w-1/2 h-1/2 bg-white rounded-lg opacity-95"></div>
              </div>
              <div className="absolute bottom-3 right-3 w-[28%] h-[28%] rounded-xl bg-amber-500 shadow-inner flex items-center justify-center">
                <div className="w-1/2 h-1/2 bg-white rounded-lg opacity-95"></div>
              </div>

              <div className="absolute top-1/3 left-1/3 right-1/3 bottom-1/3 flex items-center justify-center">
                <div className="w-full h-full bg-slate-800 rotate-45 transform scale-75 rounded shadow-md"></div>
              </div>
            </div>

            {/* Simulated Vector Floating Nodes */}
            <div className="absolute top-1/4 right-1/3 w-6 h-6 rounded-full bg-red-500 border-2 border-white shadow-lg -translate-y-6 translate-x-2"></div>
            <div className="absolute bottom-1/3 left-1/4 w-6 h-6 rounded-full bg-blue-500 border-2 border-white shadow-lg -translate-y-8"></div>
          </div>
          
          {/* Vector Ambient Light Shadow Backplate */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-indigo-400/15 blur-[80px] rounded-full z-0 pointer-events-none"></div>
        </div>

      </main>
    </div>
  );
}

export default Home;