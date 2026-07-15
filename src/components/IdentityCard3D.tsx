import React, { useState, useRef } from "react";
import { BadgeCheck, ShieldAlert, Cpu, Fingerprint } from "lucide-react";

export const IdentityCard3D: React.FC = () => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
  const [glareOpacity, setGlareOpacity] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Normalize mouse position between 0 and 1
    const xPct = x / rect.width;
    const yPct = y / rect.height;

    // Calculate maximum tilt of 15 degrees for optimal 3D feedback
    const tiltX = (yPct - 0.5) * -15;
    const tiltY = (xPct - 0.5) * 15;

    setRotateX(tiltX);
    setRotateY(tiltY);
    setGlarePosition({ x: xPct * 100, y: yPct * 100 });
    setGlareOpacity(0.35);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlareOpacity(0);
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleCardClick = () => {
    setIsFlipped(prev => !prev);
  };

  const frontImage = "https://avatars.githubusercontent.com/u/265782778?v=4"; // Mukteswar actual face

  return (
    <div className="w-full flex flex-col items-center select-none" id="id-card-3d-root">
      
      {/* 3D Perspective Canvas Container */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleCardClick}
        className="perspective-1000 w-[310px] sm:w-[340px] aspect-[1/1.55] cursor-pointer group relative active:scale-[0.98] transition-transform duration-300"
        id="card-perspective-container"
      >
        {/* Card Wrapper (Preserves 3D space, handles Y-rotation flip and mouse hover tilts) */}
        <div
          className="relative w-full h-full transform-style-3d shadow-[0_20px_50px_rgba(0,0,0,0.6)] hover:shadow-[0_25px_60px_rgba(99,102,241,0.3)] rounded-[2.5rem] transition-transform duration-700 ease-out"
          style={{
            transform: `rotateX(${rotateX}deg) rotateY(${rotateY + (isFlipped ? 180 : 0)}deg)`,
            transition: isHovered 
              ? "transform 0.1s ease-out" 
              : "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
          id="card-rotation-wrapper"
        >
          {/* ==================== CARD FRONT FACE ==================== */}
          <div 
            className="absolute inset-0 w-full h-full rounded-[2rem] border border-white/10 bg-gradient-to-b from-zinc-900/95 via-zinc-950/98 to-black p-5 flex flex-col justify-between overflow-hidden backface-hidden"
            id="card-front-face"
          >
            {/* Ambient Background Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
            <div className="absolute -top-10 -right-10 w-44 h-44 bg-indigo-500/10 rounded-full blur-[40px] pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-blue-500/5 rounded-full blur-[40px] pointer-events-none" />

            {/* Dynamic Glare Overlay */}
            <div
              className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255, 255, 255, 0.15) 0%, transparent 55%)`,
                opacity: glareOpacity,
              }}
            />

            {/* Portrait display with Laser scanning line */}
            <div 
              className="relative w-full h-full rounded-2xl border border-white/10 bg-zinc-950/60 overflow-hidden group/portrait mt-2 flex flex-col items-center justify-center"
              id="front-portrait-container"
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/85">
                <div className="relative">
                  <Fingerprint className="w-16 h-16 text-indigo-400/80 group-hover/portrait:text-[#c3f400] transition-colors duration-300" />
                  <div className="absolute inset-0 bg-indigo-500/10 rounded-full blur-xl scale-125 group-hover/portrait:bg-[#c3f400]/10 transition-colors duration-300" />
                </div>
                <span className="font-mono text-[7px] text-indigo-300/60 mt-3 tracking-widest uppercase animate-pulse">
                  BIOMETRIC IDENTITY LOADED
                </span>
              </div>

              {/* Laser Scanner animation overlay */}
              {isHovered && !isFlipped && (
                <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-400 to-transparent shadow-[0_0_8px_rgba(99,102,241,0.8)] z-10 animate-[scanner_2.5s_ease-in-out_infinite]" />
              )}

              {/* Tag designation overlay */}
              <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded border border-white/5 text-[7px] font-mono font-bold text-indigo-300 tracking-widest uppercase">
                PORTRAIT // COGNITIVE
              </div>
            </div>
          </div>

          {/* ==================== CARD BACK FACE ==================== */}
          <div 
            className="absolute inset-0 w-full h-full rounded-[2rem] border border-white/10 bg-gradient-to-b from-zinc-950 via-black to-[#05050c] p-5 flex flex-col justify-between overflow-hidden backface-hidden rotate-y-180"
            id="card-back-face"
          >
            {/* Ambient Background Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(195,244,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(195,244,0,0.02)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
            <div className="absolute -top-10 -left-10 w-44 h-44 bg-[#c3f400]/5 rounded-full blur-[40px] pointer-events-none" />

            {/* Dynamic Glare Overlay (Reversed for Back Face) */}
            <div
              className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle at ${100 - glarePosition.x}% ${glarePosition.y}%, rgba(195, 244, 0, 0.1) 0%, transparent 60%)`,
                opacity: glareOpacity,
              }}
            />

            {/* Top Bar */}
            <div className="flex justify-between items-center relative z-10">
              <span className="font-mono text-[8px] tracking-widest text-[#c3f400] font-bold uppercase bg-[#c3f400]/10 px-2 py-0.5 border border-[#c3f400]/20 rounded">
                DECRYPT CONSOLE
              </span>
              <span className="font-mono text-[7px] text-zinc-500 hover:text-white transition-colors">
                TAP TO FLIP ↻
              </span>
            </div>

            {/* Circular Biometric Scanner Area */}
            <div 
              className="w-24 h-24 rounded-full border border-indigo-500/30 bg-indigo-500/5 flex items-center justify-center relative group/scanner overflow-hidden mx-auto my-4 shrink-0"
              id="back-portrait-container"
            >
              {/* Pulse waves */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent opacity-50 group-hover/scanner:opacity-80 transition-opacity" />
              
              {/* Biometric Scan Icon */}
              <Fingerprint className="w-12 h-12 text-indigo-400 group-hover/scanner:text-[#c3f400] transition-colors relative z-10" />

              {/* Laser Line animation */}
              {isHovered && isFlipped && (
                <div className="absolute left-0 right-0 h-0.5 bg-[#c3f400] shadow-[0_0_8px_#c3f400] z-20 animate-[scanner_2.5s_ease-in-out_infinite]" />
              )}
            </div>

            {/* Experience Dossier Console Fields */}
            <div className="space-y-2 font-mono text-[8px] text-zinc-400 text-left bg-black/50 border border-white/5 p-4 rounded-xl relative z-10">
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span>HARDWARE PROTOCOL</span>
                <span className="text-white font-bold">MUKTESWAR-V3</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span>MAIN NETWORKS</span>
                <span className="text-[#c3f400] font-bold">PYTHON & JAVA</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span>PARADIGMS</span>
                <span className="text-indigo-300 font-bold">DJANGO & REACT</span>
              </div>
              <div className="flex justify-between pb-0.5">
                <span>SIGNATURE</span>
                <span className="text-white font-bold">SHA-256: 0x937B...</span>
              </div>
            </div>

            {/* Micro chips and telemetry visuals */}
            <div className="flex justify-between items-center text-[7px] font-mono text-zinc-600 px-1 pt-1 border-t border-white/5 relative z-10">
              <div className="flex items-center gap-1">
                <Cpu className="w-3 h-3 text-zinc-500" />
                <span>CORE: ARM64-NEON</span>
              </div>
              <span>TEMP: 32°C // IDLE</span>
            </div>

            {/* Bottom prompt */}
            <div className="flex flex-col items-center gap-0.5 pt-2 border-t border-white/5 relative z-10">
              <span className="font-mono text-[8px] tracking-widest text-[#c3f400] font-bold uppercase animate-pulse">
                AUTHORIZED ACCESS
              </span>
              <span className="font-mono text-[6px] text-zinc-500 uppercase">
                MUKTESWAR.DEV // CYBER SEC
              </span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
