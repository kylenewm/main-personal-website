"use client";

import { useEffect, useRef, useState } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  pulsePhase: number;
}

export function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const mouseRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });
  const animationRef = useRef<number>();
  const isMobileRef = useRef(false);
  const [showBeam, setShowBeam] = useState(true);
  const [canvasReady, setCanvasReady] = useState(false);

  // Defer canvas animation start to allow page to become interactive first
  useEffect(() => {
    const timer = setTimeout(() => {
      setCanvasReady(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Canvas animation - only starts after canvasReady is true
  useEffect(() => {
    if (!canvasReady) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      isMobileRef.current = window.innerWidth < 768;
      initNodes();
    };

    const initNodes = () => {
      // Reduce nodes on mobile for better performance
      const divisor = isMobileRef.current ? 40000 : 20000;
      const nodeCount = Math.floor((canvas.width * canvas.height) / divisor);
      nodesRef.current = [];

      for (let i = 0; i < nodeCount; i++) {
        nodesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 2 + 1,
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const nodes = nodesRef.current;
      const mouse = mouseRef.current;
      const connectionDistance = 150;

      // Update and draw nodes
      nodes.forEach((node) => {
        // Update position
        node.x += node.vx;
        node.y += node.vy;
        node.pulsePhase += 0.02;

        // Wrap around edges
        if (node.x < 0) node.x = canvas.width;
        if (node.x > canvas.width) node.x = 0;
        if (node.y < 0) node.y = canvas.height;
        if (node.y > canvas.height) node.y = 0;

        // Draw node with pulse effect
        const pulse = Math.sin(node.pulsePhase) * 0.5 + 0.5;
        const alpha = 0.3 + pulse * 0.4;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + pulse, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 240, 255, ${alpha})`;
        ctx.fill();
      });

      // Draw connections between nodes (skip on mobile for performance)
      if (!isMobileRef.current) {
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < connectionDistance) {
              const alpha = (1 - distance / connectionDistance) * 0.15;
              ctx.beginPath();
              ctx.moveTo(nodes[i].x, nodes[i].y);
              ctx.lineTo(nodes[j].x, nodes[j].y);
              ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      }

      // Draw connections to mouse (desktop only)
      if (!isMobileRef.current && mouse.x !== null && mouse.y !== null) {
        for (let i = 0; i < nodes.length; i++) {
          const dx = nodes[i].x - mouse.x;
          const dy = nodes[i].y - mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 200) {
            const alpha = (1 - distance / 200) * 0.4;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(123, 97, 255, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", handleMouseMove);

    // Start animation
    animate();

    // Hide beam after animation completes
    const beamTimer = setTimeout(() => setShowBeam(false), 2000);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      clearTimeout(beamTimer);
    };
  }, [canvasReady]);

  return (
    <>
      {/* Neural Network Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ background: "#0a0a0f" }}
      />

      {/* Morphing Gradient Blob - hidden on mobile for performance */}
      <div className="fixed w-[800px] h-[800px] top-1/2 right-[-200px] -translate-y-1/2 morph-blob z-[1] pointer-events-none hidden md:block" />

      {/* Grid Overlay */}
      <div className="fixed inset-0 grid-overlay z-[1] pointer-events-none" />

      {/* Light Beam Sweep - plays once on load */}
      {showBeam && (
        <div className="fixed inset-0 z-[1000] pointer-events-none light-beam" />
      )}
    </>
  );
}

