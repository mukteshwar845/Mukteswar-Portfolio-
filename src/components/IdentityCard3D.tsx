import React, { useState, useRef, useEffect } from "react";
import { BadgeCheck, ShieldAlert, Cpu, Fingerprint } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface IdentityCard3DProps {
  aboutData?: {
    id_card_image?: string;
    id_card_images?: string[];
    card_back_protocol?: string;
    card_back_networks?: string;
    card_back_paradigms?: string;
    card_back_signature?: string;
    card_back_core?: string;
    card_back_temp?: string;
  } | null;
}

export const IdentityCard3D: React.FC<IdentityCard3DProps> = ({ aboutData }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
  const [glareOpacity, setGlareOpacity] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const images = aboutData?.id_card_images && aboutData.id_card_images.length > 0
    ? aboutData.id_card_images
    : (aboutData?.id_card_image ? [aboutData.id_card_image] : []);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [images.length]);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentImageIndex(prev => (prev + 1) % images.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [images.length]);

  const slideVariants = {
    enter: (dir: number) => ({
      rotateY: dir > 0 ? 90 : -90,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      rotateY: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    exit: (dir: number) => ({
      rotateY: dir < 0 ? 90 : -90,
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  // Device orientation (gyroscope) tracking for real physical tilting on mobile
  useEffect(() => {
    let hasPointerActivity = false;

    // We only tilt via gyroscope if the user is not actively dragging/touching the card
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (hasPointerActivity) return;
      if (e.gamma === null || e.beta === null) return;

      // gamma is left-to-right tilt in degrees [-90, 90]
      // beta is front-to-back tilt in degrees [-180, 180]
      // Limit to comfortable visual angles (max 15 degrees)
      const tiltY = Math.max(-15, Math.min(15, e.gamma * 0.4));
      // Assume typical comfortable phone viewing angle of 45 degrees
      const tiltX = Math.max(-15, Math.min(15, (e.beta - 45) * 0.4));

      setRotateX(tiltX);
      setRotateY(tiltY);
      setGlarePosition({ x: 50 + tiltY * 2.5, y: 50 - tiltX * 2.5 });
      setGlareOpacity(0.2);
    };

    window.addEventListener("deviceorientation", handleOrientation);

    // Listener to pause gyro tracking briefly when user touches the card
    const handlePointerActive = () => {
      hasPointerActivity = true;
    };
    const handlePointerInactive = () => {
      setTimeout(() => {
        hasPointerActivity = false;
      }, 1000);
    };

    const cardEl = cardRef.current;
    if (cardEl) {
      cardEl.addEventListener("pointerdown", handlePointerActive);
      cardEl.addEventListener("pointerup", handlePointerInactive);
      cardEl.addEventListener("pointercancel", handlePointerInactive);
    }

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
      if (cardEl) {
        cardEl.removeEventListener("pointerdown", handlePointerActive);
        cardEl.removeEventListener("pointerup", handlePointerInactive);
        cardEl.removeEventListener("pointercancel", handlePointerInactive);
      }
    };
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Normalize pointer position between 0 and 1
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

  const handlePointerLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlareOpacity(0);
    setIsHovered(false);
  };

  const handlePointerEnter = () => {
    setIsHovered(true);
  };

  const handleCardClick = () => {
    setIsFlipped(prev => !prev);
  };

  return (
    <div className="w-full flex flex-col items-center select-none animate-fade-in-up" id="id-card-3d-root">
      
      {/* 3D Perspective Canvas Container */}
      <div
        ref={cardRef}
        onPointerMove={handlePointerMove}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onClick={handleCardClick}
        className="perspective-1000 w-[310px] sm:w-[340px] aspect-[1/1.55] cursor-pointer group relative active:scale-[0.98] transition-transform duration-300 touch-none"
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
            className="absolute inset-0 w-full h-full rounded-[2rem] border border-white/10 bg-gradient-to-b from-zinc-900/95 via-zinc-950/98 to-black overflow-hidden backface-hidden"
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

            {/* Floating Top Identity Header */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-25 pointer-events-none">
              <span className="font-mono text-[7px] tracking-widest text-[#adc6ff] font-bold uppercase bg-black/60 backdrop-blur-md px-2.5 py-1 border border-white/10 rounded-full">
                BIOMETRIC PORTRAIT
              </span>
              <span className="font-mono text-[7px] text-[#c3f400] font-bold bg-black/60 backdrop-blur-md px-2 py-1 border border-white/10 rounded-full">
                {images.length > 0 ? `IMG 0${currentImageIndex + 1}` : "OFFLINE"}
              </span>
            </div>

            {/* Portrait display (full screen size of front card) */}
            <div 
              className="w-full h-full relative flex flex-col items-center justify-center"
              id="front-portrait-container"
            >
              {images.length > 0 ? (
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                  <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                      key={currentImageIndex}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      className="absolute inset-0 w-full h-full"
                      style={{ backfaceVisibility: "hidden" }}
                    >
                      <img 
                        src={images[currentImageIndex]} 
                        alt={`Identity Portrait ${currentImageIndex + 1}`} 
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    </motion.div>
                  </AnimatePresence>
                  
                  {/* Holographic / Cyber scanning overlay effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-indigo-500/5 mix-blend-overlay pointer-events-none z-10" />
                  
                  {/* Dot pagination indicator */}
                  {images.length > 1 && (
                    <div className="absolute bottom-4 right-4 flex gap-1.5 z-20 bg-black/75 px-2 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
                      {images.map((_, i) => (
                        <button
                          key={i}
                          onClick={(e) => {
                            e.stopPropagation(); // Don't flip the 3D card
                            setDirection(i > currentImageIndex ? 1 : -1);
                            setCurrentImageIndex(i);
                          }}
                          className={`w-1.5 h-1.5 rounded-full transition-all ${
                            i === currentImageIndex ? "bg-[#c3f400] w-3" : "bg-white/30 hover:bg-white/60"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/85">
                  <div className="relative">
                    <Fingerprint className="w-16 h-16 text-indigo-400/80 group-hover:text-[#c3f400] transition-colors duration-300 animate-pulse" />
                    <div className="absolute inset-0 bg-indigo-500/10 rounded-full blur-xl scale-125 group-hover:bg-[#c3f400]/10 transition-colors duration-300" />
                  </div>
                  <span className="font-mono text-[8px] text-indigo-300/60 mt-3 tracking-widest uppercase animate-pulse">
                    NO BIOMETRIC PICTURES
                  </span>
                </div>
              )}

              {/* Laser Scanner animation overlay */}
              {isHovered && !isFlipped && (
                <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#c3f400] to-transparent shadow-[0_0_12px_#c3f400] z-20 animate-[scanner_2.5s_ease-in-out_infinite]" />
              )}

              {/* Tag designation overlay floating bottom-left */}
              <div className="absolute bottom-4 left-4 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded border border-white/10 text-[7px] font-mono font-bold text-[#adc6ff] tracking-widest uppercase z-15">
                SYSTEM PORTRAIT // REALTIME
              </div>
            </div>
          </div>

          {/* ==================== CARD BACK FACE ==================== */}
          <div 
            className="absolute inset-0 w-full h-full rounded-[2rem] border border-white/10 bg-gradient-to-b from-zinc-950 via-black to-[#05050c] p-4 flex flex-col justify-between backface-hidden rotate-y-180"
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
            <div className="flex justify-between items-center relative z-10 shrink-0">
              <span className="font-mono text-[8px] tracking-widest text-[#c3f400] font-bold uppercase bg-[#c3f400]/10 px-2 py-0.5 border border-[#c3f400]/20 rounded">
                DECRYPT CONSOLE
              </span>
              <span className="font-mono text-[7px] text-zinc-500 hover:text-white transition-colors">
                TAP TO FLIP ↻
              </span>
            </div>

            {/* Header with fingerprint scanner & credential identifier */}
            <div className="flex items-center gap-3 relative z-10 bg-black/40 border border-white/5 p-2 rounded-xl mt-1.5 shrink-0" id="back-portrait-container-parent">
              {/* Circular Biometric Scanner Area with uploaded small picture */}
              <div 
                className="w-10 h-10 rounded-full border border-[#c3f400]/40 bg-zinc-950/80 flex items-center justify-center relative group/scanner overflow-hidden shrink-0 shadow-[0_0_8px_rgba(195,244,0,0.2)]"
                id="back-portrait-container"
              >
                {images.length > 0 ? (
                  <img
                    src={images[currentImageIndex] || images[0]}
                    alt="Biometric Portrait"
                    className="w-full h-full object-cover rounded-full"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <Fingerprint className="w-5 h-5 text-[#c3f400] group-hover/scanner:scale-105 transition-transform" />
                )}
                
                {/* Laser Line animation */}
                {isHovered && isFlipped && (
                  <div className="absolute left-0 right-0 h-0.5 bg-[#c3f400] shadow-[0_0_8px_#c3f400] z-20 animate-[scanner_2.5s_ease-in-out_infinite]" />
                )}
              </div>
              <div className="text-left font-mono min-w-0 flex-1">
                <span className="text-[5.5px] text-zinc-500 uppercase block tracking-wider">SECURE LINK STATUS</span>
                <span className="text-[8px] font-bold text-[#c3f400] block truncate tracking-wider uppercase">
                  IDENTITY CONNECTED
                </span>
                <span className="text-[7px] text-[#adc6ff] block font-semibold truncate mt-0.5 uppercase">
                  {aboutData?.id_card_name || "Mukteswar Gochhayat"}
                </span>
              </div>
              <BadgeCheck className="w-4 h-4 text-[#c3f400] drop-shadow-[0_0_4px_rgba(195,244,0,0.4)] shrink-0" />
            </div>

            {/* Personal Details Section */}
            <div className="space-y-1.5 font-mono text-left bg-black/40 border border-white/5 p-2.5 rounded-xl relative z-10 mt-1 shrink-0">
              <div>
                <span className="text-[5.5px] text-zinc-500 uppercase block tracking-wider">IDENT NAME</span>
                <span className="text-xs font-bold text-white tracking-wide block leading-snug truncate">
                  {aboutData?.id_card_name || "Mukteswar Gochhayat"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 border-t border-white/5 pt-1">
                <div>
                  <span className="text-[5.5px] text-zinc-500 uppercase block tracking-wider">COLLEGE / INSTITUTION</span>
                  <span className="text-[8px] font-semibold text-zinc-300 block truncate">
                    {aboutData?.id_card_college || "ITER, SOA University"}
                  </span>
                </div>
                <div>
                  <span className="text-[5.5px] text-zinc-500 uppercase block tracking-wider">GRADUATION</span>
                  <span className="text-[8px] font-semibold text-[#c3f400] block">
                    {aboutData?.id_card_grad_year || "Class of 2026"}
                  </span>
                </div>
              </div>

              <div className="border-t border-white/5 pt-1">
                <span className="text-[5.5px] text-zinc-500 uppercase block tracking-wider">ROLE / SPEC</span>
                <span className="text-[8px] font-semibold text-indigo-300 block truncate">
                  {aboutData?.id_card_role || "Full-Stack Software Engineer"}
                </span>
              </div>
            </div>

            {/* Biographical Info Dossier & Philosophy Quote */}
            <div className="space-y-1.5 font-mono text-left bg-black/60 border border-white/5 p-2.5 rounded-xl relative z-10 mt-1 flex-1 flex flex-col justify-center">
              <div>
                <span className="text-[5.5px] text-zinc-500 uppercase block tracking-wider">BIOGRAPHICAL DOSSIER</span>
                <p className="text-[7.5px] text-zinc-300 leading-normal line-clamp-2">
                  {aboutData?.philosophy_title || "Computer Science & Engineering Scholar specializing in secure architectures and modern responsive frameworks."}
                </p>
              </div>
              <div className="border-t border-white/5 pt-1 mt-1">
                <span className="text-[5.5px] text-[#c3f400] uppercase block tracking-wider">PHILOSOPHICAL QUOTE</span>
                <p className="text-[7.5px] italic text-indigo-200 leading-normal line-clamp-2">
                  "{aboutData?.philosophy_quote || "Empowering through secure, elegant, and modern engineering design."}"
                </p>
                <span className="text-[6px] text-zinc-500 block text-right mt-0.5">
                  — {aboutData?.philosophy_author || "Mukteswar Gochhayat"}
                </span>
              </div>
            </div>

            {/* Micro chips and telemetry visuals */}
            <div className="flex justify-between items-center text-[7px] font-mono text-zinc-600 px-1 pt-1.5 border-t border-white/5 relative z-10 mt-1 shrink-0">
              <div className="flex items-center gap-1">
                <Cpu className="w-3 h-3 text-zinc-500 animate-pulse" />
                <span className="truncate max-w-[140px]">{aboutData?.card_back_core || "CORE: ARM64-NEON"}</span>
              </div>
              <span>{aboutData?.card_back_temp || "TEMP: 32°C // IDLE"}</span>
            </div>

            {/* Bottom prompt and verification credentials */}
            <div className="flex flex-col items-center gap-0.5 pt-1.5 border-t border-white/5 relative z-10 shrink-0">
              <span className="font-mono text-[8px] tracking-widest text-[#c3f400] font-bold uppercase animate-pulse">
                AUTHORIZED ACCESS ONLY
              </span>
              <span className="font-mono text-[5.5px] text-zinc-500 uppercase truncate max-w-full">
                {aboutData?.id_card_extra || "SECURE ACCESS LEVEL: A1 // REG: 2201201103"}
              </span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
