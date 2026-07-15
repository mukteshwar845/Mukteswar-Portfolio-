import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

interface FloatObject {
  id: number;
  type: "card" | "cube" | "ring" | "orb";
  x: number; // initial percentage
  y: number; // initial percentage
  size: number;
  color: string;
  speed: number;
  delay: number;
}

interface Star {
  x: number;
  y: number;
  size: number;
  alpha: number;
  twinkleSpeed: number;
  phase: number;
  depth: number; // Depth factor for 3D parallax
  color: string; // Dynamic astronomical colors
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
  angle: number;
}

export const PremiumFuturisticBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [scrollOffset, setScrollOffset] = useState(0);
  const [mouseActive, setMouseActive] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Mouse coordinate tracking with ultra-smooth spring physics
  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);

  const mouseX = useSpring(rawMouseX, { stiffness: 25, damping: 22 });
  const mouseY = useSpring(rawMouseY, { stiffness: 25, damping: 22 });

  // Floating Glassmorphic elements
  const [floaters, setFloaters] = useState<FloatObject[]>([]);

  useEffect(() => {
    // 1. Motion and Screen Responsiveness
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const motionListener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", motionListener);

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    // 2. Scroll Tracking
    const handleScroll = () => {
      setScrollOffset(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // 3. Seed luxurious floating spatial glass cards (scaled for desktop vs mobile)
    const seedFloaters: FloatObject[] = [
      {
        id: 1,
        type: "card",
        x: 8,
        y: 18,
        size: window.innerWidth < 768 ? 80 : 150,
        color: "rgba(99, 102, 241, 0.04)", // Indigo
        speed: 35,
        delay: -3
      },
      {
        id: 2,
        type: "cube",
        x: 85,
        y: 12,
        size: window.innerWidth < 768 ? 40 : 70,
        color: "rgba(6, 182, 212, 0.05)", // Cyan
        speed: 26,
        delay: -6
      },
      {
        id: 3,
        type: "ring",
        x: 82,
        y: 75,
        size: window.innerWidth < 768 ? 70 : 120,
        color: "rgba(195, 244, 0, 0.04)", // Neon Lime Glow
        speed: 30,
        delay: -11
      },
      {
        id: 4,
        type: "orb",
        x: 5,
        y: 82,
        size: window.innerWidth < 768 ? 60 : 100,
        color: "rgba(59, 130, 246, 0.05)", // Blue
        speed: 40,
        delay: -8
      },
      {
        id: 5,
        type: "card",
        x: 90,
        y: 48,
        size: window.innerWidth < 768 ? 90 : 170,
        color: "rgba(217, 70, 239, 0.04)", // Fuchsia
        speed: 38,
        delay: -14
      }
    ];
    setFloaters(seedFloaters);

    // 4. Ultra-Premium HTML5 Cosmic Canvas Engine
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Dynamic astronomical colors for the premium starfield
    const starColors = [
      "rgba(255, 255, 255,", // Pure white
      "rgba(173, 216, 230,", // Pale blue star
      "rgba(221, 160, 221,", // Soft purple star
      "rgba(240, 230, 140,", // Soft warm white
      "rgba(195, 244, 0,"   // Rare fluorescent neon lime
    ];

    // Create high-fidelity starfield
    const stars: Star[] = [];
    // More stars on desktop, optimized count on mobile for buttery smooth performance
    const starCount = window.innerWidth < 768 
      ? Math.min(100, Math.floor((width * height) / 10000))
      : Math.min(300, Math.floor((width * height) / 4500));

    for (let i = 0; i < starCount; i++) {
      const colorTemplate = starColors[Math.floor(Math.random() * starColors.length)];
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.5 + 0.25, // Microscopic, realistic luxurious stars
        alpha: Math.random() * 0.85 + 0.15,
        twinkleSpeed: 0.008 + Math.random() * 0.018,
        phase: Math.random() * Math.PI * 2,
        depth: Math.random() * 0.9 + 0.1, // Multi-layer parallax depths
        color: colorTemplate
      });
    }

    // Active Shooting Stars
    let shootingStar: ShootingStar | null = null;
    let nextShootingStarTime = Date.now() + 4000 + Math.random() * 8000;

    // Cosmic Dust Particles (Subtle drifting orbs)
    interface Dust {
      x: number;
      y: number;
      size: number;
      vx: number;
      vy: number;
      color: string;
    }
    const dustParticles: Dust[] = [];
    const dustCount = window.innerWidth < 768 ? 12 : 35;
    const dustColors = [
      "rgba(99, 102, 241, 0.07)",  // indigo glow
      "rgba(6, 182, 212, 0.07)",   // cyan glow
      "rgba(139, 92, 246, 0.05)"   // violet glow
    ];
    for (let i = 0; i < dustCount; i++) {
      dustParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 30 + 15,
        vx: (Math.random() - 0.5) * 0.08,
        vy: (Math.random() - 0.5) * 0.08,
        color: dustColors[Math.floor(Math.random() * dustColors.length)]
      });
    }

    // Handle Resize
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Mouse coordinates physics
    let currentMouseX = width / 2;
    let currentMouseY = height / 2;
    const targetMouse = { x: width / 2, y: height / 2 };

    const updateMousePos = (e: MouseEvent) => {
      targetMouse.x = e.clientX;
      targetMouse.y = e.clientY;
    };
    window.addEventListener("mousemove", updateMousePos);

    // Render loop
    let lastTime = 0;
    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interpolation (lagging galaxy effect)
      currentMouseX += (targetMouse.x - currentMouseX) * 0.025;
      currentMouseY += (targetMouse.y - currentMouseY) * 0.025;

      // Parallax factors
      const mouseParallaxX = (currentMouseX - width / 2) * 0.04;
      const mouseParallaxY = (currentMouseY - height / 2) * 0.04;
      const scrollParallaxY = window.scrollY * 0.12;

      // DRAW LAYER 1: Breathtaking Deep space galaxies (Multiple overlapping Nebulae)
      // Nebula 1: Deep Cyan & Sky Blue (Left)
      const nebula1X = width * 0.15 + mouseParallaxX * 0.3;
      const nebula1Y = height * 0.25 + mouseParallaxY * 0.3 - scrollParallaxY * 0.08;
      const rad1 = Math.max(width * 0.55, 350);
      const grad1 = ctx.createRadialGradient(
        nebula1X, nebula1Y, 20,
        nebula1X, nebula1Y, rad1
      );
      grad1.addColorStop(0, "rgba(6, 182, 212, 0.07)"); // cyan
      grad1.addColorStop(0.3, "rgba(59, 130, 246, 0.035)"); // electric blue
      grad1.addColorStop(0.7, "rgba(15, 23, 42, 0.015)"); // fade
      grad1.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      // Nebula 2: Deep Violet, Purple & Indigo (Right)
      const nebula2X = width * 0.85 + mouseParallaxX * 0.5;
      const nebula2Y = height * 0.70 + mouseParallaxY * 0.5 - scrollParallaxY * 0.15;
      const rad2 = Math.max(width * 0.65, 450);
      const grad2 = ctx.createRadialGradient(
        nebula2X, nebula2Y, 30,
        nebula2X, nebula2Y, rad2
      );
      grad2.addColorStop(0, "rgba(139, 92, 246, 0.065)"); // violet
      grad2.addColorStop(0.4, "rgba(79, 70, 229, 0.03)"); // royal indigo
      grad2.addColorStop(0.8, "rgba(15, 23, 42, 0.01)");
      grad2.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // Nebula 3: Center Ambient Dark Glow (Provides extra cosmic dust feeling)
      const nebula3X = width * 0.5 - mouseParallaxX * 0.2;
      const nebula3Y = height * 0.5 + mouseParallaxY * 0.2 - scrollParallaxY * 0.05;
      const rad3 = Math.max(width * 0.45, 300);
      const grad3 = ctx.createRadialGradient(
        nebula3X, nebula3Y, 10,
        nebula3X, nebula3Y, rad3
      );
      grad3.addColorStop(0, "rgba(217, 70, 239, 0.025)"); // soft fuchsia bloom
      grad3.addColorStop(0.5, "rgba(99, 102, 241, 0.01)"); // indigo
      grad3.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad3;
      ctx.fillRect(0, 0, width, height);

      // DRAW LAYER 2: Slow Floating Cosmic Dust Clouds
      dustParticles.forEach((dust) => {
        if (!prefersReducedMotion) {
          dust.x += dust.vx;
          dust.y += dust.vy;

          // Wrap around screen boundaries smoothly
          if (dust.x < -dust.size) dust.x = width + dust.size;
          if (dust.x > width + dust.size) dust.x = -dust.size;
          if (dust.y < -dust.size) dust.y = height + dust.size;
          if (dust.y > height + dust.size) dust.y = -dust.size;
        }

        const dustParallaxX = dust.x + mouseParallaxX * 0.4;
        const dustParallaxY = dust.y + mouseParallaxY * 0.4 - scrollParallaxY * 0.1;

        const dustGrad = ctx.createRadialGradient(
          dustParallaxX, dustParallaxY, 0,
          dustParallaxX, dustParallaxY, dust.size
        );
        dustGrad.addColorStop(0, dust.color);
        dustGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = dustGrad;
        ctx.beginPath();
        ctx.arc(dustParallaxX, dustParallaxY, dust.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // DRAW LAYER 3: Elegant Twinkling Stars Matrix
      stars.forEach((star) => {
        if (!prefersReducedMotion) {
          star.phase += star.twinkleSpeed;
        }
        const currentAlpha = Math.max(0.08, star.alpha * (0.25 + Math.sin(star.phase) * 0.75));

        // Offset positions by parallax layers based on depth
        let starX = star.x + mouseParallaxX * star.depth;
        let starY = star.y + mouseParallaxY * star.depth - scrollParallaxY * star.depth * 0.4;

        // Wrap stars cleanly if they slide off the viewport
        if (starX < 0) starX = width + (starX % width);
        if (starX > width) starX = starX % width;
        if (starY < 0) starY = height + (starY % height);
        if (starY > height) starY = starY % height;

        // Render delicate star point
        ctx.fillStyle = `${star.color}${currentAlpha})`;
        ctx.beginPath();
        ctx.arc(starX, starY, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Subtly halo brighter stars for a luxury bloom look
        if (star.size > 1.3 && currentAlpha > 0.6) {
          ctx.fillStyle = `${star.color}${currentAlpha * 0.12})`;
          ctx.beginPath();
          ctx.arc(starX, starY, star.size * 4, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // DRAW LAYER 4: Digital Constellation Lines (Connecting Nodes)
      ctx.strokeStyle = "rgba(173, 198, 255, 0.015)";
      ctx.lineWidth = 0.5;
      const step = window.innerWidth < 768 ? 8 : 5; // optimize check on mobile
      for (let i = 0; i < stars.length; i += step) {
        for (let j = i + 1; j < Math.min(i + 3, stars.length); j++) {
          const s1 = stars[i];
          const s2 = stars[j];
          const star1X = s1.x + mouseParallaxX * s1.depth;
          const star1Y = s1.y + mouseParallaxY * s1.depth - scrollParallaxY * s1.depth * 0.4;
          const star2X = s2.x + mouseParallaxX * s2.depth;
          const star2Y = s2.y + mouseParallaxY * s2.depth - scrollParallaxY * s2.depth * 0.4;

          const dist = Math.hypot(star1X - star2X, star1Y - star2Y);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(star1X, star1Y);
            ctx.lineTo(star2X, star2Y);
            ctx.stroke();
          }
        }
      }

      // DRAW LAYER 5: Rare Interstellar Shooting Stars
      if (!prefersReducedMotion) {
        const now = Date.now();
        if (!shootingStar && now > nextShootingStarTime) {
          shootingStar = {
            x: Math.random() * width * 0.6,
            y: Math.random() * height * 0.3,
            length: 100 + Math.random() * 120,
            speed: 18 + Math.random() * 14,
            opacity: 1,
            angle: Math.PI / 6 + Math.random() * (Math.PI / 10)
          };
          nextShootingStarTime = now + 15000 + Math.random() * 25000;
        }

        if (shootingStar) {
          const dx = Math.cos(shootingStar.angle) * shootingStar.speed;
          const dy = Math.sin(shootingStar.angle) * shootingStar.speed;
          shootingStar.x += dx;
          shootingStar.y += dy;
          shootingStar.opacity -= 0.016;

          if (shootingStar.opacity <= 0 || shootingStar.x > width || shootingStar.y > height) {
            shootingStar = null;
          } else {
            const trailGrad = ctx.createLinearGradient(
              shootingStar.x - dx * 3, shootingStar.y - dy * 3,
              shootingStar.x, shootingStar.y
            );
            trailGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
            trailGrad.addColorStop(0.5, `rgba(186, 230, 253, ${shootingStar.opacity * 0.3})`);
            trailGrad.addColorStop(1, `rgba(255, 255, 255, ${shootingStar.opacity * 0.75})`);

            ctx.strokeStyle = trailGrad;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length, shootingStar.y - Math.sin(shootingStar.angle) * shootingStar.length);
            ctx.lineTo(shootingStar.x, shootingStar.y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render(0);

    return () => {
      mediaQuery.removeEventListener("change", motionListener);
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", updateMousePos);
      cancelAnimationFrame(animationFrameId);
    };
  }, [prefersReducedMotion]);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    rawMouseX.set(e.clientX - rect.left);
    rawMouseY.set(e.clientY - rect.top);
    setMouseActive(true);
  };

  const handlePointerLeave = () => {
    setMouseActive(false);
  };

  const parallaxLayer1 = prefersReducedMotion ? 0 : scrollOffset * 0.05;
  const parallaxLayer2 = prefersReducedMotion ? 0 : scrollOffset * 0.12;

  const spotlightX = useTransform(mouseX, (val) => `${val}px`);
  const spotlightY = useTransform(mouseY, (val) => `${val}px`);

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="fixed inset-0 w-full h-full pointer-events-none select-none z-0 overflow-hidden bg-[#010204]"
    >
      {/* Absolute Black Space Canvas base */}
      <div className="absolute inset-0 bg-[#000000] z-0" />

      {/* Dynamic Starfield & Atmospheric Nebula Canvas layer */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-10 block opacity-100" />

      {/* LAYER 3: Minimal, high-end vector grid workspace (60px) */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.008)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.008)_1px,transparent_1px)] bg-[size:65px_65px] opacity-55 z-20"
        style={{
          transform: `translateY(${-parallaxLayer1}px)`,
          transition: "transform 0.1s cubic-bezier(0.1, 0.8, 0.2, 1)"
        }}
      />

      {/* Subtle constellations reference bars */}
      <div className="absolute inset-x-0 top-1/3 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/[0.03] to-transparent z-20" />
      <div className="absolute inset-x-0 bottom-1/4 h-[1px] bg-gradient-to-r from-transparent via-purple-400/[0.03] to-transparent z-20" />

      {/* LAYER 4: Mouse Spotlight Glow Trail (Desktop only) */}
      {mouseActive && !prefersReducedMotion && !isMobile && (
        <motion.div
          style={{
            left: spotlightX,
            top: spotlightY,
            transform: "translate(-50%, -50%)"
          }}
          className="absolute w-[650px] h-[650px] rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.045)_0%,rgba(6,182,212,0.015)_35%,transparent_65%)] mix-blend-screen pointer-events-none z-25"
        />
      )}

      {/* LAYER 5: 3D Floating Glassmorphic panels & constellation nodes (Hidden or scaled on mobile) */}
      <div 
        className="absolute inset-0 z-30"
        style={{
          transform: `translateY(${-parallaxLayer2}px)`,
          transition: "transform 0.1s cubic-bezier(0.1, 0.8, 0.2, 1)"
        }}
      >
        {floaters.map((f) => {
          // Disable floating cards on extreme small screens to ensure content dominates
          if (isMobile && f.type === "card") return null;

          const floatTransition = prefersReducedMotion ? {} : {
            y: {
              duration: f.speed,
              repeat: Infinity,
              repeatType: "mirror" as const,
              ease: "easeInOut",
              delay: f.delay,
            },
            rotate: {
              duration: f.speed * 1.5,
              repeat: Infinity,
              repeatType: "mirror" as const,
              ease: "easeInOut",
              delay: f.delay,
            },
            x: {
              duration: f.speed * 1.3,
              repeat: Infinity,
              repeatType: "mirror" as const,
              ease: "easeInOut",
              delay: f.delay,
            }
          };

          const floatAnimation = prefersReducedMotion ? {} : {
            y: [0, -25, 0],
            x: [0, 15, 0],
            rotate: [0, 10, 0],
          };

          if (f.type === "card") {
            return (
              <motion.div
                key={f.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, ...floatAnimation }}
                transition={{ opacity: { duration: 1.5 }, ...floatTransition }}
                style={{
                  position: "absolute",
                  left: `${f.x}%`,
                  top: `${f.y}%`,
                  width: `${f.size}px`,
                  height: `${f.size * 0.65}px`,
                  background: `linear-gradient(135deg, rgba(255,255,255,0.01) 0%, rgba(255,255,255,0.002) 100%)`,
                }}
                className="rounded-2xl border border-white/[0.04] shadow-[0_15px_35px_rgba(0,0,0,0.7)] backdrop-blur-[7px] relative overflow-hidden"
              >
                {/* Mirror Specular reflection sweep */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.012] to-transparent" />
                <div className="absolute top-2.5 left-3 w-1.5 h-1.5 rounded-full bg-cyan-400/20" />
                <div className="absolute top-2.5 left-6 w-5 h-1 rounded-full bg-white/5" />
              </motion.div>
            );
          }

          if (f.type === "cube") {
            return (
              <motion.div
                key={f.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, ...floatAnimation }}
                transition={{ opacity: { duration: 1.5 }, ...floatTransition }}
                style={{
                  position: "absolute",
                  left: `${f.x}%`,
                  top: `${f.y}%`,
                  width: `${f.size}px`,
                  height: `${f.size}px`,
                }}
                className="relative"
              >
                {/* 3D Glass Cube Wireframe */}
                <div className="w-full h-full border border-cyan-500/[0.08] rounded backdrop-blur-[2px] transform rotate-[45deg] flex items-center justify-center">
                  <div className="w-2/3 h-2/3 border border-indigo-500/[0.08] rounded transform rotate-[15deg]" />
                </div>
              </motion.div>
            );
          }

          if (f.type === "ring") {
            return (
              <motion.div
                key={f.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, ...floatAnimation }}
                transition={{ opacity: { duration: 1.5 }, ...floatTransition }}
                style={{
                  position: "absolute",
                  left: `${f.x}%`,
                  top: `${f.y}%`,
                  width: `${f.size}px`,
                  height: `${f.size}px`,
                  borderColor: f.color,
                }}
                className="rounded-full border border-dashed border-white/5 flex items-center justify-center relative"
              >
                <div className="w-4/5 h-4/5 rounded-full border border-double border-white/5" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#c3f400]/40 shadow-[0_0_10px_#c3f400]" />
              </motion.div>
            );
          }

          // Orbs
          return (
            <motion.div
              key={f.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, ...floatAnimation }}
              transition={{ opacity: { duration: 1.5 }, ...floatTransition }}
              style={{
                position: "absolute",
                left: `${f.x}%`,
                top: `${f.y}%`,
                width: `${f.size}px`,
                height: `${f.size}px`,
                background: `radial-gradient(circle, ${f.color} 0%, transparent 70%)`,
              }}
              className="rounded-full blur-xl filter opacity-25 mix-blend-screen"
            />
          );
        })}
      </div>

      {/* Cybernetic overlay screen lines */}
      <div className="absolute inset-0 bg-scanlines opacity-[0.012] pointer-events-none z-40" />
    </div>
  );
};
