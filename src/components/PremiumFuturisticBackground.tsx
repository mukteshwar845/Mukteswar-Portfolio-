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

interface GalaxyParticle {
  // 3D coordinates relative to galaxy center
  x: number;
  y: number;
  z: number;
  size: number;
  color: string;
  brightness: number;
  speedMultiplier: number;
  orbitRadius: number;
  initialAngle: number;
  twinkleSpeed: number;
  twinklePhase: number;
  // Screen space projected coordinates (populated during render)
  projX?: number;
  projY?: number;
  projZ?: number;
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

  const mouseX = useSpring(rawMouseX, { stiffness: 20, damping: 24 });
  const mouseY = useSpring(rawMouseY, { stiffness: 20, damping: 24 });

  // Floating Glassmorphic element cards
  const [floaters, setFloaters] = useState<FloatObject[]>([]);

  useEffect(() => {
    // 1. Accessibility & Responsiveness Settings
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

    // 3. Seed elegant floating glassmorphic panels
    const seedFloaters: FloatObject[] = [
      {
        id: 1,
        type: "card",
        x: 10,
        y: 22,
        size: window.innerWidth < 768 ? 90 : 160,
        color: "rgba(99, 102, 241, 0.04)", // Indigo
        speed: 38,
        delay: -4
      },
      {
        id: 2,
        type: "cube",
        x: 84,
        y: 14,
        size: window.innerWidth < 768 ? 45 : 75,
        color: "rgba(6, 182, 212, 0.05)", // Cyan
        speed: 28,
        delay: -7
      },
      {
        id: 3,
        type: "ring",
        x: 80,
        y: 78,
        size: window.innerWidth < 768 ? 80 : 130,
        color: "rgba(195, 244, 0, 0.04)", // Neon Lime Glow
        speed: 32,
        delay: -12
      },
      {
        id: 4,
        type: "orb",
        x: 6,
        y: 84,
        size: window.innerWidth < 768 ? 70 : 110,
        color: "rgba(59, 130, 246, 0.04)", // Electric Blue
        speed: 42,
        delay: -9
      }
    ];
    setFloaters(seedFloaters);

    // 4. BREATHTAKING 3D GALAXY SIMULATION
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Dynamic scale depending on window size
    const galaxyRadius = Math.min(width, height) * (window.innerWidth < 768 ? 0.45 : 0.48);

    // Color ranges for high-fidelity galaxy arms
    const galaxyColors = [
      "rgba(6, 182, 212,",   // Neon Cyan
      "rgba(99, 102, 241,",  // Royal Indigo
      "rgba(139, 92, 246,",  // Cosmic Violet
      "rgba(255, 255, 255,", // Pure Stellar White
      "rgba(173, 226, 255,"  // Light Sky Blue
    ];

    // Seed 3D Galaxy Particles
    const particles: GalaxyParticle[] = [];
    // Optimized count for beautiful details and absolute 60fps responsiveness
    const particleCount = window.innerWidth < 768 ? 220 : 550;
    const spiralArms = 3; // Luxurious 3-arm spiral galaxy

    for (let i = 0; i < particleCount; i++) {
      // Core vs Arm distribution: most particles cluster near the core
      const beta = Math.random();
      const radiusFraction = Math.pow(beta, 2); // clusters stars heavily towards the center
      const r = radiusFraction * galaxyRadius;

      // Assign to spiral arm with offset
      const armIndex = i % spiralArms;
      const armAngle = (armIndex / spiralArms) * Math.PI * 2;
      
      // Arm spiral tightness equation: higher factor = tighter spirals
      const spiralTightness = window.innerWidth < 768 ? 2.5 : 3.0;
      const angle = armAngle + r * (spiralTightness / galaxyRadius) + (Math.random() - 0.5) * 0.45;

      // Dispersion in Z direction (height/thickness of the galactic plane)
      // Thicker at the core, extremely thin and flat at the outer edges
      const thicknessFactor = (1.0 - radiusFraction) * (window.innerWidth < 768 ? 25 : 45);
      const dy = (Math.random() - 0.5) * thicknessFactor;

      // Select high-contrast color based on distance
      // Core is warm, dense white/yellow; arms are cyber-blue, indigo and violet
      let color = "rgba(255, 255, 255,"; // center core
      if (r > galaxyRadius * 0.15) {
        // Outer arms get majestic neon blue/purple colors
        color = galaxyColors[Math.floor(Math.random() * galaxyColors.length)];
      } else if (Math.random() > 0.4) {
        color = "rgba(253, 254, 215,"; // Warm stellar cream core
      }

      particles.push({
        x: r * Math.cos(angle),
        y: dy,
        z: r * Math.sin(angle),
        size: Math.random() * 1.5 + 0.3, // Microscopic high-end points
        color: color,
        brightness: Math.random() * 0.75 + 0.25,
        speedMultiplier: 0.15 + Math.random() * 0.35,
        orbitRadius: r,
        initialAngle: angle,
        twinkleSpeed: 0.01 + Math.random() * 0.03,
        twinklePhase: Math.random() * Math.PI * 2
      });
    }

    // Static Background Stars (The distant deep cosmos layer)
    interface DeepStar {
      x: number;
      y: number;
      size: number;
      alpha: number;
      phase: number;
      speed: number;
    }
    const deepStars: DeepStar[] = [];
    const deepStarCount = window.innerWidth < 768 ? 60 : 180;
    for (let i = 0; i < deepStarCount; i++) {
      deepStars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.0 + 0.2,
        alpha: Math.random() * 0.6 + 0.2,
        phase: Math.random() * Math.PI * 2,
        speed: 0.005 + Math.random() * 0.015
      });
    }

    // Rare shooting stars simulation
    let shootingStar: ShootingStar | null = null;
    let nextShootingStarTime = Date.now() + 5000 + Math.random() * 8000;

    // Handle Window Resize
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Mouse coordinates filtered internally for soft lagging physics
    let currentMouseX = width / 2;
    let currentMouseY = height / 2;
    const targetMouse = { x: width / 2, y: height / 2 };

    const updateMousePos = (e: MouseEvent) => {
      targetMouse.x = e.clientX;
      targetMouse.y = e.clientY;
    };
    window.addEventListener("mousemove", updateMousePos);

    // Initial galactic orientation parameters
    let baseRotation = 0;
    const fov = 400; // 3D Camera Field of View projection depth

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse coordination lag
      currentMouseX += (targetMouse.x - currentMouseX) * 0.025;
      currentMouseY += (targetMouse.y - currentMouseY) * 0.025;

      // Calculate dynamic mouse tilts & scroll parallax offset
      const mouseParallaxX = (currentMouseX - width / 2) * 0.05;
      const mouseParallaxY = (currentMouseY - height / 2) * 0.05;
      const scrollParallaxY = window.scrollY * 0.15;

      // Rotate galaxy core slowly over time
      if (!prefersReducedMotion) {
        baseRotation += 0.0018;
      }

      // DRAW DISTANT COSMIC STARS (Layer 1)
      deepStars.forEach((ds) => {
        if (!prefersReducedMotion) {
          ds.phase += ds.speed;
        }
        const currentAlpha = ds.alpha * (0.3 + Math.sin(ds.phase) * 0.7);
        // Distant parallax shift
        let dsX = ds.x + mouseParallaxX * 0.25;
        let dsY = ds.y + mouseParallaxY * 0.25 - scrollParallaxY * 0.1;

        if (dsX < 0) dsX = width + (dsX % width);
        if (dsX > width) dsX = dsX % width;
        if (dsY < 0) dsY = height + (dsY % height);
        if (dsY > height) dsY = dsY % height;

        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.05, currentAlpha)})`;
        ctx.beginPath();
        ctx.arc(dsX, dsY, ds.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // DRAW ATMOSPHERIC NEBULAE BLOOM (Soft color clouds behind the 3D spiral)
      // Top-Left Cyan Nebula
      const nebula1X = width * 0.25 + mouseParallaxX * 0.5;
      const nebula1Y = height * 0.3 - scrollParallaxY * 0.08;
      const rad1 = Math.max(width * 0.6, 380);
      const grad1 = ctx.createRadialGradient(nebula1X, nebula1Y, 10, nebula1X, nebula1Y, rad1);
      grad1.addColorStop(0, "rgba(6, 182, 212, 0.075)"); // Neon Cyan
      grad1.addColorStop(0.3, "rgba(59, 130, 246, 0.03)"); // Deep Electric Blue
      grad1.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      // Bottom-Right Majestic Violet Nebula
      const nebula2X = width * 0.75 + mouseParallaxX * 0.7;
      const nebula2Y = height * 0.7 - scrollParallaxY * 0.14;
      const rad2 = Math.max(width * 0.65, 420);
      const grad2 = ctx.createRadialGradient(nebula2X, nebula2Y, 15, nebula2X, nebula2Y, rad2);
      grad2.addColorStop(0, "rgba(139, 92, 246, 0.07)"); // Cosmic Purple
      grad2.addColorStop(0.4, "rgba(79, 70, 229, 0.025)"); // Indigo Bloom
      grad2.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // Core Soft Glow
      const centerGlowX = width / 2 + mouseParallaxX * 0.8;
      const centerGlowY = height * 0.45 - scrollParallaxY * 0.12;
      const centerRad = Math.max(galaxyRadius * 0.8, 200);
      const centerGrad = ctx.createRadialGradient(centerGlowX, centerGlowY, 0, centerGlowX, centerGlowY, centerRad);
      centerGrad.addColorStop(0, "rgba(124, 58, 237, 0.04)"); // Violet core bloom
      centerGrad.addColorStop(0.4, "rgba(6, 182, 212, 0.01)");
      centerGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = centerGrad;
      ctx.fillRect(0, 0, width, height);

      // 3D CAMERA MATH TRANSFORMS & TILT
      // Set Pitch (Tilt around X axis - looking at galaxy from an angle of 62 degrees)
      const pitch = 1.08; // 62 deg in radians
      // Pitch adjustment from mouse and scroll
      const dynamicPitch = pitch + (mouseParallaxY * 0.001) - (scrollOffset * 0.0003);
      const cosPitch = Math.cos(dynamicPitch);
      const sinPitch = Math.sin(dynamicPitch);

      // Set Yaw (Dynamic rotation around Y/Z axis)
      // Base rotation + slight mouse coordinate feedback
      const yaw = baseRotation + (mouseParallaxX * 0.002);

      // Center positioning
      const centerX = width * 0.5 + mouseParallaxX * 0.85;
      const centerY = height * 0.45 - scrollParallaxY * 0.12;

      // Project each particle into 3D Space
      const projectedParticles: GalaxyParticle[] = [];

      particles.forEach((p) => {
        // Orbit math to continuously revolve particles around center
        const currentAngle = p.initialAngle + baseRotation * p.speedMultiplier;
        
        // Local coordinates relative to center of galaxy
        const lx = p.orbitRadius * Math.cos(currentAngle);
        const lz = p.orbitRadius * Math.sin(currentAngle);
        const ly = p.y; // Height dispersion

        // Step 1: Rotate in 3D Space (Yaw around Y/vertical axis)
        const cosYaw = Math.cos(baseRotation * p.speedMultiplier * 0.3);
        const sinYaw = Math.sin(baseRotation * p.speedMultiplier * 0.3);
        const rx1 = lx * cosYaw - lz * sinYaw;
        const rz1 = lx * sinYaw + lz * cosYaw;
        const ry1 = ly;

        // Step 2: Rotate around X-axis (Pitch/Tilt towards viewer)
        // This tilts the circular orbit into a breathtaking 3D spiral disk
        const rx2 = rx1;
        const ry2 = ry1 * cosPitch - rz1 * sinPitch;
        const rz2 = ry1 * sinPitch + rz1 * cosPitch;

        // Step 3: Perspective Projection (Z-depth scaling)
        // Camera distance from center
        const cameraDistance = fov + rz2;
        if (cameraDistance > 20) { // Keep behind camera clip plane
          const f = fov / cameraDistance;
          p.projX = centerX + rx2 * f;
          p.projY = centerY + ry2 * f;
          p.projZ = rz2; // Store raw Z depth for sorting

          // Update individual particle twinkle
          if (!prefersReducedMotion) {
            p.twinklePhase += p.twinkleSpeed;
          }

          projectedParticles.push(p);
        }
      });

      // PAINTER'S ALGORITHM: Sort particles by Z depth (back-to-front)
      // This produces perfect 3D depth perception where foreground stars overlap center glow
      projectedParticles.sort((a, b) => (b.projZ || 0) - (a.projZ || 0));

      // RENDER 3D GALAXY PLANETS & STARS
      projectedParticles.forEach((p) => {
        if (p.projX === undefined || p.projY === undefined || p.projZ === undefined) return;

        // Scale size and opacity based on perspective depth
        const scaleFactor = fov / (fov + p.projZ);
        const sizeOnScreen = p.size * scaleFactor;

        // Twinkle factor
        const twinkle = 0.35 + Math.sin(p.twinklePhase) * 0.65;
        const alpha = Math.max(0.12, p.brightness * scaleFactor * twinkle * 0.85);

        ctx.fillStyle = `${p.color}${alpha})`;
        ctx.beginPath();
        ctx.arc(p.projX, p.projY, sizeOnScreen, 0, Math.PI * 2);
        ctx.fill();

        // Beautiful luxury aura on highly prominent foreground particles
        if (sizeOnScreen > 1.3 && alpha > 0.6) {
          ctx.fillStyle = `${p.color}${alpha * 0.15})`;
          ctx.beginPath();
          ctx.arc(p.projX, p.projY, sizeOnScreen * 4.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // DRAW DYNAMIC INTERSTELLAR SHOOTING STARS
      if (!prefersReducedMotion) {
        const now = Date.now();
        if (!shootingStar && now > nextShootingStarTime) {
          shootingStar = {
            x: Math.random() * width * 0.6,
            y: Math.random() * height * 0.3,
            length: 110 + Math.random() * 110,
            speed: 16 + Math.random() * 12,
            opacity: 1,
            angle: Math.PI / 6 + Math.random() * (Math.PI / 12)
          };
          nextShootingStarTime = now + 14000 + Math.random() * 20000;
        }

        if (shootingStar) {
          const dx = Math.cos(shootingStar.angle) * shootingStar.speed;
          const dy = Math.sin(shootingStar.angle) * shootingStar.speed;
          shootingStar.x += dx;
          shootingStar.y += dy;
          shootingStar.opacity -= 0.015;

          if (shootingStar.opacity <= 0 || shootingStar.x > width || shootingStar.y > height) {
            shootingStar = null;
          } else {
            const trailGrad = ctx.createLinearGradient(
              shootingStar.x - dx * 3, shootingStar.y - dy * 3,
              shootingStar.x, shootingStar.y
            );
            trailGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
            trailGrad.addColorStop(0.5, `rgba(186, 230, 253, ${shootingStar.opacity * 0.3})`);
            trailGrad.addColorStop(1, `rgba(255, 255, 255, ${shootingStar.opacity * 0.8})`);

            ctx.strokeStyle = trailGrad;
            ctx.lineWidth = 1.3;
            ctx.beginPath();
            ctx.moveTo(
              shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length, 
              shootingStar.y - Math.sin(shootingStar.angle) * shootingStar.length
            );
            ctx.lineTo(shootingStar.x, shootingStar.y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

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

  const parallaxLayer1 = prefersReducedMotion ? 0 : scrollOffset * 0.04;
  const parallaxLayer2 = prefersReducedMotion ? 0 : scrollOffset * 0.1;

  const spotlightX = useTransform(mouseX, (val) => `${val}px`);
  const spotlightY = useTransform(mouseY, (val) => `${val}px`);

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="fixed inset-0 w-full h-full pointer-events-none select-none z-0 overflow-hidden bg-[#020306]"
    >
      {/* Absolute Black Deep Space canvas container background */}
      <div className="absolute inset-0 bg-[#020204] z-0" />

      {/* Dynamic 3D Starfield & Atmospheric Galaxy Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-10 block opacity-100" />

      {/* LAYER 3: Minimal futuristic vector grid coordinates mapping (65px) */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.006)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.006)_1px,transparent_1px)] bg-[size:65px_65px] opacity-60 z-20"
        style={{
          transform: `translateY(${-parallaxLayer1}px)`,
          transition: "transform 0.1s cubic-bezier(0.1, 0.8, 0.2, 1)"
        }}
      />

      {/* Futuristic design constellations references */}
      <div className="absolute inset-x-0 top-1/4 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/[0.025] to-transparent z-20" />
      <div className="absolute inset-x-0 bottom-1/3 h-[1px] bg-gradient-to-r from-transparent via-purple-400/[0.025] to-transparent z-20" />

      {/* LAYER 4: Mouse Spotlight Glow Trail (Desktop only) */}
      {mouseActive && !prefersReducedMotion && !isMobile && (
        <motion.div
          style={{
            left: spotlightX,
            top: spotlightY,
            transform: "translate(-50%, -50%)"
          }}
          className="absolute w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.04)_0%,rgba(6,182,212,0.012)_35%,transparent_65%)] mix-blend-screen pointer-events-none z-25"
        />
      )}

      {/* LAYER 5: 3D Floating Glassmorphic panels (Desktop only for ultimate readability) */}
      <div 
        className="absolute inset-0 z-30"
        style={{
          transform: `translateY(${-parallaxLayer2}px)`,
          transition: "transform 0.1s cubic-bezier(0.1, 0.8, 0.2, 1)"
        }}
      >
        {floaters.map((f) => {
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
            y: [0, -22, 0],
            x: [0, 15, 0],
            rotate: [0, 8, 0],
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
                  background: `linear-gradient(135deg, rgba(255,255,255,0.012) 0%, rgba(255,255,255,0.002) 100%)`,
                }}
                className="rounded-2xl border border-white/[0.04] shadow-[0_12px_32px_rgba(0,0,0,0.7)] backdrop-blur-[6px] relative overflow-hidden"
              >
                {/* Micro specular reflection highlight sweep */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.01] to-transparent" />
                <div className="absolute top-2 left-3 w-1 h-1 rounded-full bg-cyan-400/25" />
                <div className="absolute top-2 left-6 w-4 h-0.5 rounded-full bg-white/5" />
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
                {/* 3D Glass Wireframe Cube */}
                <div className="w-full h-full border border-cyan-500/[0.07] rounded backdrop-blur-[1px] transform rotate-[45deg] flex items-center justify-center">
                  <div className="w-2/3 h-2/3 border border-indigo-500/[0.07] rounded transform rotate-[15deg]" />
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
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-[#c3f400]/45 shadow-[0_0_8px_#c3f400]" />
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

      {/* CRT scanline aesthetic texture at 1.2% opacity */}
      <div className="absolute inset-0 bg-scanlines opacity-[0.012] pointer-events-none z-40" />
    </div>
  );
};
