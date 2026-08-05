// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    // Updated container viewport properties to flow seamlessly without dynamic text spilling
    <div className="min-h-[calc(100vh-76px)] w-full bg-slate-50 relative overflow-hidden font-sans flex items-center py-10 lg:py-0 box-border">
      
      {/* 🔮 ADVANCED AMBIENT GLOW BACKPLATES */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-indigo-200/40 to-transparent blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-violet-200/30 to-transparent blur-[100px] pointer-events-none z-0"></div>

      {/* Modern Radial Dotted Core Grid Mesh */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.25] pointer-events-none mix-blend-multiply" 
        style={{ 
          backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', 
          backgroundSize: '32px 32px' 
        }}
      ></div>

      {/* Main Content Area Grid Container */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center h-full">
        
        {/* Left Column: Headings, Call to Actions & Platform Metrics */}
        <div className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left space-y-6 md:space-y-7 z-10">
          
          {/* Status Notification Tag Node */}
          <div className="self-center lg:self-start inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-indigo-50/70 border border-indigo-100/80 backdrop-blur-md shadow-xs animate-fade-in">
            <span className="flex relative w-2 h-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
            </span>
            <span className="text-[10px] font-black text-indigo-700 uppercase tracking-[0.15em]">Multiplayer Beta is Live</span>
          </div>

          {/* Premium High-contrast Typography */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.05]">
            Play Ludo Online <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-500 bg-300% animate-gradient-flow">
              With Friends.
            </span>
          </h1>
          
          {/* Descriptive Content Section */}
          <p className="text-sm md:text-base text-slate-500 font-semibold max-w-xl mx-auto lg:mx-0 leading-relaxed antialiased">
            Experience the classic board game re-imagined. Real-time multiplayer lobbies, fluid state synchronization, and a highly competitive global arena.
          </p>

          {/* Dynamic Call To Actions Links Bundle */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
            <Link 
              to="/game" 
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-indigo-600 text-white font-black text-sm tracking-wide hover:bg-indigo-700 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all shadow-lg shadow-indigo-200/80 flex items-center justify-center gap-2 group cursor-pointer"
            >
              Play Now 
              <svg className="w-4 h-4 group-hover:translate-x-1.5 transition-transform stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            <Link 
              to="/register" 
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-slate-700 font-bold text-sm tracking-wide hover:bg-slate-50 active:scale-[0.98] transition-all border border-slate-200 shadow-xs hover:border-slate-300 flex items-center justify-center cursor-pointer"
            >
              Create Account
            </Link>
          </div>
          
          {/* Interactive Performance Metrics Dashboard Segment */}
          <div className="pt-6 border-t border-slate-200/60 flex items-center justify-center lg:justify-start gap-10">
            <div className="hover:scale-105 transition-transform duration-300">
              <p className="text-2xl font-black text-slate-800 tracking-tight">10ms</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Sync Latency</p>
            </div>
            <div className="w-px h-8 bg-slate-200/80"></div>
            <div className="hover:scale-105 transition-transform duration-300">
              <p className="text-2xl font-black text-slate-800 tracking-tight">100%</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Server Uptime</p>
            </div>
          </div>

        </div>

        {/* Right Column: High-fidelity Isometric 3D Board Component Frame */}
        <div className="lg:col-span-5 hidden lg:flex justify-center relative items-center min-h-[450px]">
          
          {/* Dynamic Ambient Background Aura Backplate */}
          <div className="absolute w-[360px] h-[360px] bg-gradient-to-tr from-indigo-500/20 to-violet-500/20 blur-[60px] rounded-full pointer-events-none animate-pulse"></div>
          
          {/* Main 3D Transformation Wrapper Block */}
          <div 
            className="relative w-full max-w-[340px] aspect-square transition-all duration-700 ease-out z-10 group"
            style={{
              transform: 'perspective(1000px) rotateX(24deg) rotateZ(-16deg)',
              transformStyle: 'preserve-3d'
            }}
          >
            
            {/* The Hardened Layered Ludo Matrix Platform */}
            <div className="absolute inset-0 bg-white rounded-3xl shadow-[0_25px_60px_-15px_rgba(15,23,42,0.3)] border border-slate-200 overflow-hidden group-hover:shadow-[0_35px_70px_-10px_rgba(79,70,229,0.25)] group-hover:scale-[1.02] transition-all duration-500 ease-out">
              
              {/* Internal Tracks Layout Meshes */}
              <div className="absolute inset-y-0 left-1/3 right-1/3 bg-slate-50/50 border-x border-slate-100/80"></div>
              <div className="absolute inset-x-0 top-1/3 bottom-1/3 bg-slate-50/50 border-y border-slate-100/80"></div>
              
              {/* Color Quadrants Node Slots */}
              <div className="absolute top-4 left-4 w-[26%] h-[26%] rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 shadow-inner flex items-center justify-center">
                <div className="w-1/2 h-1/2 bg-white/95 rounded-xl shadow-md"></div>
              </div>
              <div className="absolute top-4 right-4 w-[26%] h-[26%] rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-inner flex items-center justify-center">
                <div className="w-1/2 h-1/2 bg-white/95 rounded-xl shadow-md"></div>
              </div>
              <div className="absolute bottom-4 left-4 w-[26%] h-[26%] rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 shadow-inner flex items-center justify-center">
                <div className="w-1/2 h-1/2 bg-white/95 rounded-xl shadow-md"></div>
              </div>
              <div className="absolute bottom-4 right-4 w-[26%] h-[26%] rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-inner flex items-center justify-center">
                <div className="w-1/2 h-1/2 bg-white/95 rounded-xl shadow-md"></div>
              </div>

              {/* Center Triangle Core Cross Section */}
              <div className="absolute top-1/3 left-1/3 right-1/3 bottom-1/3 flex items-center justify-center">
                <div className="w-full h-full bg-slate-800 rotate-45 transform scale-[0.68] rounded-xl shadow-lg border border-slate-700/50"></div>
              </div>
            </div>

            {/* Simulated 3D Suspended Tokens Layer */}
            <div 
              className="absolute top-[22%] right-[42%] w-7 h-7 rounded-full bg-gradient-to-b from-rose-400 to-red-600 border-2 border-white shadow-[0_8px_16px_rgba(225,29,72,0.4)] transition-all duration-500 group-hover:translate-y-[-12px] group-hover:scale-105"
              style={{ transform: 'translateZ(20px)' }}
            ></div>
            <div 
              className="absolute bottom-[38%] left-[24%] w-7 h-7 rounded-full bg-gradient-to-b from-sky-400 to-blue-600 border-2 border-white shadow-[0_8px_16px_rgba(37,99,235,0.4)] transition-all duration-500 group-hover:translate-y-[-6px] group-hover:scale-105"
              style={{ transform: 'translateZ(15px)' }}
            ></div>
            
          </div>
        </div>

      </main>
    </div>
  );
}

export default Home;