// src/pages/NotFound.jsx
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="flex min-h-[calc(100vh-76px)] items-center justify-center px-4 sm:px-6 bg-slate-50 relative overflow-hidden">
      
      {/* 🔮 Background Ambient Glows */}
      <div className="absolute top-[10%] left-[20%] w-96 h-96 bg-indigo-400/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[20%] w-96 h-96 bg-violet-400/20 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Main Glassmorphism Content Card */}
      <div className="relative z-10 w-full max-w-lg rounded-[2rem] bg-white/80 backdrop-blur-xl p-10 shadow-2xl shadow-indigo-100/50 border border-white text-center animate-fade-in flex flex-col items-center">
        
        {/* Playful Ludo Icon / Graphic */}
        <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-200 mb-6 transform -rotate-12 hover:rotate-0 transition-all duration-300">
           <div className="w-6 h-6 bg-white/95 rounded-full shadow-inner flex items-center justify-center">
             <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
           </div>
        </div>

        {/* Gradient 404 Header */}
        <h1 className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-violet-600 tracking-tighter drop-shadow-sm select-none leading-tight">
          404
        </h1>
        
        <h2 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-slate-800">
          Token lost in the void!
        </h2>
        
        <p className="mt-3 text-sm sm:text-base text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
          Looks like your dice rolled out of bounds. We couldn’t find the arena you’re looking for.
        </p>
        
        {/* Interactive Return Button */}
        <div className="mt-8 w-full sm:w-auto">
          <Link
            to="/"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-8 py-3.5 font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:bg-indigo-700 active:translate-y-0 active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Return to Base
          </Link>
        </div>
      </div>
      
    </section>
  );
}

export default NotFound;