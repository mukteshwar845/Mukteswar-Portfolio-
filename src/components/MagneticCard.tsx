import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

interface MagneticCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const MagneticCard: React.FC<MagneticCardProps> = ({ children, onClick, className }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [glowPos, setGlowPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for x/y translation (magnetic shift)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Motion values for 3D tilt
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  // Smooth springs for translations
  const springConfig = { damping: 20, stiffness: 120, mass: 0.5 };
  const translateX = useSpring(x, springConfig);
  const translateY = useSpring(y, springConfig);

  // Smooth springs for tilt
  const tiltX = useSpring(rotateX, springConfig);
  const tiltY = useSpring(rotateY, springConfig);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Pointer position relative to card boundaries
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Store relative percentage for specular glow highlight
    const glowXPercent = (mouseX / width) * 100;
    const glowYPercent = (mouseY / height) * 100;
    setGlowPos({ x: glowXPercent, y: glowYPercent });

    // Center-relative coordinates [-0.5, 0.5]
    const relativeX = (mouseX / width) - 0.5;
    const relativeY = (mouseY / height) - 0.5;

    // Subtle magnetic translation (shifting card towards the cursor)
    const maxPull = 14; // max translation in pixels
    x.set(relativeX * maxPull);
    y.set(relativeY * maxPull);

    // Subtle 3D tilt rotation
    const maxTilt = 8; // max degrees
    rotateX.set(-relativeY * maxTilt);
    rotateY.set(relativeX * maxTilt);
  };

  const handlePointerEnter = () => {
    setIsHovered(true);
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onClick={onClick}
      className={`relative select-none ${className || ""}`}
      style={{
        perspective: "1000px",
        WebkitPerspective: "1000px",
      }}
    >
      <motion.div
        style={{
          x: translateX,
          y: translateY,
          rotateX: tiltX,
          rotateY: tiltY,
          transformStyle: "preserve-3d",
          WebkitTransformStyle: "preserve-3d",
        }}
        className="w-full h-full relative transition-shadow duration-300 rounded-xl"
      >
        {/* Specular Glow Highlight Overlay following the cursor */}
        {isHovered && (
          <div
            className="absolute inset-0 rounded-xl pointer-events-none z-30 opacity-40 mix-blend-screen transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle 120px at ${glowPos.x}% ${glowPos.y}%, rgba(195, 244, 0, 0.12), transparent 80%)`,
            }}
          />
        )}
        {children}
      </motion.div>
    </div>
  );
};
