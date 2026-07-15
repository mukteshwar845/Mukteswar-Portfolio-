import React, { useRef, useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

interface ParticleType {
  id: number;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  size: number;
  color: string;
  type: "dot" | "square" | "plus" | "crosshair";
  duration: number;
  delay: number;
  driftX: number;
  driftY: number;
}

export const InteractiveParticleField: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<ParticleType[]>([]);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values to track smooth mouse positions
  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);

  // Soft spring physics for lag-free, ultra-premium organic tracking
  const mouseX = useSpring(rawMouseX, { stiffness: 60, damping: 20 });
  const mouseY = useSpring(rawMouseY, { stiffness: 60, damping: 20 });

  useEffect(() => {
    // Generate a fixed but random-looking set of cyber-minimalist particles
    const generated: ParticleType[] = Array.from({ length: 35 }).map((_, i) => {
      const types: ("dot" | "square" | "plus" | "crosshair")[] = ["dot", "square", "plus"];
      const colors = [
        "rgba(99, 102, 241, 0.25)", // Indigo / Blue-purple
        "rgba(195, 244, 0, 0.35)",  // Lime neon accent
        "rgba(165, 180, 252, 0.15)", // Lavender muted
        "rgba(255, 255, 255, 0.08)", // Cyber White subtle
      ];

      return {
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2.5 + 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: types[Math.floor(Math.random() * types.length)],
        duration: Math.random() * 12 + 10, // speed of floating
        delay: Math.random() * -20, // negative delay so they start scattered
        driftX: (Math.random() - 0.5) * 80, // drift amount
        driftY: (Math.random() - 0.5) * 80,
      };
    });
    setParticles(generated);
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    rawMouseX.set(x);
    rawMouseY.set(y);
    setIsHovered(true);
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0"
    >
      {/* Background radial highlight matching the mouse position */}
      {isHovered && (
        <motion.div
          style={{
            x: useTransform(mouseX, (v) => v - 200),
            y: useTransform(mouseY, (v) => v - 200),
          }}
          className="absolute w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.04)_0%,rgba(195,244,0,0.01)_50%,transparent_100%)] pointer-events-none mix-blend-screen"
        />
      )}

      {/* Grid crosshair or tiny tick indicators on the corners */}
      <div className="absolute top-4 left-4 w-3 h-3 border-t border-l border-white/10 pointer-events-none" />
      <div className="absolute top-4 right-4 w-3 h-3 border-t border-r border-white/10 pointer-events-none" />
      <div className="absolute bottom-4 left-4 w-3 h-3 border-b border-l border-white/10 pointer-events-none" />
      <div className="absolute bottom-4 right-4 w-3 h-3 border-b border-r border-white/10 pointer-events-none" />

      {particles.map((p) => {
        // Individual relative offset transformations based on distance to the mouse
        return (
          <ParticleItem
            key={p.id}
            particle={p}
            mouseX={mouseX}
            mouseY={mouseY}
            isHovered={isHovered}
            containerRef={containerRef}
          />
        );
      })}
    </div>
  );
};

interface ParticleItemProps {
  particle: ParticleType;
  mouseX: any;
  mouseY: any;
  isHovered: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

const ParticleItem: React.FC<ParticleItemProps> = ({
  particle,
  mouseX,
  mouseY,
  isHovered,
  containerRef,
}) => {
  const [initX, setInitX] = useState(0);
  const [initY, setInitY] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setInitX((particle.x / 100) * rect.width);
      setInitY((particle.y / 100) * rect.height);
    }
  }, [particle.x, particle.y, containerRef]);

  // Compute displacement away from the mouse cursor
  const transformX = useTransform(mouseX, (mX: number) => {
    if (!isHovered) return 0;
    const dx = initX - mX;
    const distance = Math.sqrt(dx * dx + (initY - mouseY.get()) * (initY - mouseY.get()));
    if (distance < 160 && distance > 0) {
      // Push particles away inversely proportional to distance
      const force = (160 - distance) / 160;
      return (dx / distance) * force * 35; // displacement of up to 35px
    }
    return 0;
  });

  const transformY = useTransform(mouseY, (mY: number) => {
    if (!isHovered) return 0;
    const dy = initY - mY;
    const distance = Math.sqrt((initX - mouseX.get()) * (initX - mouseX.get()) + dy * dy);
    if (distance < 160 && distance > 0) {
      const force = (160 - distance) / 160;
      return (dy / distance) * force * 35;
    }
    return 0;
  });

  // Floating ambient drift
  const driftAnimation = {
    x: [0, particle.driftX, 0],
    y: [0, particle.driftY, 0],
    opacity: [0.1, 0.8, 0.1],
  };

  const driftTransition = {
    duration: particle.duration,
    repeat: Infinity,
    repeatType: "mirror" as const,
    ease: "easeInOut",
    delay: particle.delay,
  };

  // Render based on particle design type
  const renderShape = () => {
    if (particle.type === "square") {
      return (
        <div
          className="rounded-sm"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            boxShadow: `0 0 6px ${particle.color}`,
          }}
        />
      );
    }

    if (particle.type === "plus") {
      return (
        <span
          className="font-mono text-[8px] leading-none pointer-events-none select-none flex items-center justify-center font-extralight"
          style={{ color: particle.color }}
        >
          +
        </span>
      );
    }

    // Default: glowing circle dot
    return (
      <div
        className="rounded-full"
        style={{
          width: `${particle.size}px`,
          height: `${particle.size}px`,
          backgroundColor: particle.color,
          boxShadow: `0 0 8px ${particle.color}`,
        }}
      />
    );
  };

  return (
    <motion.div
      style={{
        position: "absolute",
        left: `${particle.x}%`,
        top: `${particle.y}%`,
        x: transformX,
        y: transformY,
      }}
      animate={driftAnimation}
      transition={driftTransition}
      className="flex items-center justify-center"
    >
      {renderShape()}
    </motion.div>
  );
};
