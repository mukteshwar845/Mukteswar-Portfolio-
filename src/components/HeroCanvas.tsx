import React, { useEffect, useRef, useState } from "react";

interface HeroCanvasProps {
  onMouseMove: (x: number, y: number) => void;
}

export const HeroCanvas: React.FC<HeroCanvasProps> = ({ onMouseMove }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = 0;
    let height = 0;
    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let rotation = 0;

    // Define 3D-like structural skill nodes
    const nodes = [
      { name: "LOW_LATENCY", x: -120, y: -100, z: 50, size: 4, value: "90%" },
      { name: "REACT_CORE", x: 140, y: -80, z: -40, size: 5, value: "95%" },
      { name: "WEBGL_SHADER", x: -80, y: 120, z: -80, size: 5, value: "85%" },
      { name: "RUST_WASM", x: 100, y: 90, z: 60, size: 4, value: "92%" },
      { name: "CLOUD_ARCH", x: 0, y: -140, z: 20, size: 5, value: "95%" },
      { name: "KUBERNETES", x: -150, y: 50, z: -10, size: 3, value: "88%" },
    ];

    const resize = () => {
      if (containerRef.current && canvas) {
        width = containerRef.current.clientWidth;
        height = containerRef.current.clientHeight || 500;
        canvas.width = width;
        canvas.height = height;
        mouse.x = width / 2;
        mouse.y = height / 2;
        mouse.targetX = width / 2;
        mouse.targetY = height / 2;
      }
    };

    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      mouse.targetX = currentX;
      mouse.targetY = currentY;

      // Map to normalized scale -1.00 to 1.00
      const normX = ((currentX / width) * 2 - 1);
      const normY = (-(currentY / height) * 2 + 1);
      onMouseMove(normX, normY);

      // Check for node hovering
      let foundHover: string | null = null;
      const scaleX = width / 2;
      const scaleY = height / 2;

      // Project nodes to find screen distance
      nodes.forEach(node => {
        // Simple rotation around Y axis
        const cosR = Math.cos(rotation);
        const sinR = Math.sin(rotation);
        const rotX = node.x * cosR - node.z * sinR;
        const rotY = node.y;

        const screenX = scaleX + rotX + (mouse.x - scaleX) * 0.15;
        const screenY = scaleY + rotY + (mouse.y - scaleY) * 0.15;

        const dx = currentX - screenX;
        const dy = currentY - screenY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 28) {
          foundHover = `${node.name} (${node.value})`;
        }
      });
      setHoveredNode(foundHover);
    };

    canvas.addEventListener("mousemove", handleMouseMove);

    // Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Interpolate mouse
      mouse.x += (mouse.targetX - mouse.x) * 0.1;
      mouse.y += (mouse.targetY - mouse.y) * 0.1;

      const centerX = width / 2;
      const centerY = height / 2;
      rotation += 0.003;

      // 1. Draw Tech grid background rings (3D isometric perspective)
      ctx.strokeStyle = "rgba(173, 198, 255, 0.04)";
      ctx.lineWidth = 1;
      for (let i = 1; i <= 4; i++) {
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, i * 65, i * 45, Math.PI / 12, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw horizontal & vertical target tracking line markers
      ctx.strokeStyle = "rgba(173, 198, 255, 0.06)";
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.moveTo(centerX, 0);
      ctx.lineTo(centerX, height);
      ctx.stroke();

      // 2. Draw rotating cybernetic circle details
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation);
      ctx.strokeStyle = "rgba(173, 198, 255, 0.15)";
      ctx.beginPath();
      ctx.arc(0, 0, 110, 0, Math.PI * 1.5);
      ctx.stroke();

      // Draw tick marks along the ring
      ctx.strokeStyle = "rgba(195, 244, 0, 0.3)";
      ctx.lineWidth = 2;
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 6) {
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * 115, Math.sin(a) * 115);
        ctx.lineTo(Math.cos(a) * 122, Math.sin(a) * 122);
        ctx.stroke();
      }
      ctx.restore();

      // 3. Draw Projected 3D Nodes and Connections
      const projectedNodes: { x: number; y: number; name: string; size: number; value: string; depth: number }[] = [];
      const scaleX = width / 2;
      const scaleY = height / 2;

      nodes.forEach(node => {
        // Rotate node in 3D around Y axis
        const cosR = Math.cos(rotation);
        const sinR = Math.sin(rotation);
        
        const rotX = node.x * cosR - node.z * sinR;
        const rotZ = node.x * sinR + node.z * cosR;
        const rotY = node.y;

        // Apply perspective factor based on Z depth
        const perspective = (rotZ + 300) / 300;
        
        // Add slightly reactive offset from mouse
        const offsetMultiplier = 0.15;
        const finalX = scaleX + rotX + (mouse.x - scaleX) * offsetMultiplier;
        const finalY = scaleY + rotY + (mouse.y - scaleY) * offsetMultiplier;

        projectedNodes.push({
          x: finalX,
          y: finalY,
          name: node.name,
          size: node.size * perspective,
          value: node.value,
          depth: rotZ
        });
      });

      // Sort by depth (Z-buffer style) to draw distant items first
      projectedNodes.sort((a, b) => a.depth - b.depth);

      // Draw connections
      ctx.lineWidth = 1;
      for (let i = 0; i < projectedNodes.length; i++) {
        for (let j = i + 1; j < projectedNodes.length; j++) {
          const n1 = projectedNodes[i];
          const n2 = projectedNodes[j];
          const dist = Math.hypot(n1.x - n2.x, n1.y - n2.y);
          if (dist < 180) {
            const alpha = (1 - dist / 180) * 0.15;
            ctx.strokeStyle = `rgba(173, 198, 255, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes and labels
      projectedNodes.forEach(node => {
        const isHovered = hoveredNode?.includes(node.name);

        // Halo aura
        ctx.fillStyle = isHovered 
          ? "rgba(195, 244, 0, 0.15)" 
          : "rgba(173, 198, 255, 0.08)";
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size * 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Node core
        ctx.fillStyle = isHovered ? "#c3f400" : "#adc6ff";
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.fill();

        // Label
        ctx.fillStyle = isHovered ? "#c3f400" : "rgba(229, 226, 225, 0.75)";
        ctx.font = '600 10px "JetBrains Mono", monospace';
        ctx.fillText(node.name, node.x + 12, node.y + 4);

        if (isHovered) {
          ctx.strokeStyle = "#c3f400";
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.size * 5, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      // 4. Draw interactive crosshairs around the mouse cursor
      ctx.strokeStyle = "rgba(195, 244, 0, 0.4)";
      ctx.lineWidth = 1;
      
      // Outer reticle circle
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 18, 0, Math.PI * 2);
      ctx.stroke();

      // Inner target dot
      ctx.fillStyle = "#c3f400";
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 2, 0, Math.PI * 2);
      ctx.fill();

      // Crosshair ticks
      ctx.beginPath();
      ctx.moveTo(mouse.x - 25, mouse.y); ctx.lineTo(mouse.x - 12, mouse.y);
      ctx.moveTo(mouse.x + 12, mouse.y); ctx.lineTo(mouse.x + 25, mouse.y);
      ctx.moveTo(mouse.x, mouse.y - 25); ctx.lineTo(mouse.x, mouse.y - 12);
      ctx.moveTo(mouse.x, mouse.y + 12); ctx.lineTo(mouse.x, mouse.y + 25);
      ctx.stroke();

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      if (canvas) {
        canvas.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [onMouseMove, hoveredNode]);

  return (
    <div ref={containerRef} className="relative w-full h-[400px] md:h-[480px] bg-[#050505]/40 border border-white/5 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 cursor-none" />
      
      {/* Node status overlay */}
      <div className="absolute bottom-4 left-4 font-mono text-[9px] tracking-wider text-[#adc6ff]/60 uppercase bg-black/60 px-3 py-1.5 border border-white/5 pointer-events-none">
        ACTIVE_MODULE: {hoveredNode ? (
          <span className="text-[#c3f400] font-bold">{hoveredNode}</span>
        ) : (
          <span>GRID_READY // HOVER_NODE</span>
        )}
      </div>
    </div>
  );
};
