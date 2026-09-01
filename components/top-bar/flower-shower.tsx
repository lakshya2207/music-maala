"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface Petal {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  vRotation: number;
  swayFreq: number;
  swayAmp: number;
  swayOffset: number;
  opacity: number;
  type: "marigold" | "rose" | "lotus" | "jasmine" | "sparkle";
  color: string;
  secondaryColor: string;
}

export function FlowerShower() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isShowering, setIsShowering] = useState(false);
  const petalsRef = useRef<Petal[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const showerTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const showerStartTimeRef = useRef<number>(0);

  const spawnPetals = useCallback((count = 70) => {
    const width = window.innerWidth || 1200;
    const colors = {
      marigold: { primary: "#f59e0b", secondary: "#d97706" }, // Golden Marigold
      rose: { primary: "#ef4444", secondary: "#991b1b" },     // Deep Rose Red
      lotus: { primary: "#ec4899", secondary: "#be185d" },    // Pink Lotus
      jasmine: { primary: "#fef08a", secondary: "#ffffff" },  // Creamy White Jasmine
      sparkle: { primary: "#fde047", secondary: "#ffffff" },  // Divine Sparkle
    };

    const newPetals: Petal[] = [];
    for (let i = 0; i < count; i++) {
      const typeChoice = Math.random();
      let type: Petal["type"] = "marigold";
      if (typeChoice < 0.35) type = "marigold";
      else if (typeChoice < 0.65) type = "rose";
      else if (typeChoice < 0.85) type = "lotus";
      else if (typeChoice < 0.95) type = "jasmine";
      else type = "sparkle";

      const palette = colors[type];

      newPetals.push({
        x: Math.random() * width,
        y: -30 - Math.random() * 250, // Staggered spawn above viewport
        vx: (Math.random() - 0.5) * 1.2,
        vy: 2.2 + Math.random() * 2.8,
        size: type === "sparkle" ? 3 + Math.random() * 4 : 10 + Math.random() * 14,
        rotation: Math.random() * Math.PI * 2,
        vRotation: (Math.random() - 0.5) * 0.08,
        swayFreq: 0.02 + Math.random() * 0.03,
        swayAmp: 1.2 + Math.random() * 2.2,
        swayOffset: Math.random() * Math.PI * 2,
        opacity: 0.85 + Math.random() * 0.15,
        type,
        color: palette.primary,
        secondaryColor: palette.secondary,
      });
    }

    petalsRef.current.push(...newPetals);
  }, []);

  const drawPetal = (ctx: CanvasRenderingContext2D, p: Petal) => {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.globalAlpha = Math.max(0, Math.min(1, p.opacity));

    if (p.type === "sparkle") {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      return;
    }

    // Draw floral petal shape
    ctx.beginPath();
    ctx.moveTo(0, -p.size);
    ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.6, p.size * 0.8, p.size * 0.6, 0, p.size);
    ctx.bezierCurveTo(-p.size * 0.8, p.size * 0.6, -p.size * 0.8, -p.size * 0.6, 0, -p.size);
    ctx.closePath();

    // Gradient fill for realistic petal depth
    const grad = ctx.createLinearGradient(-p.size / 2, -p.size, p.size / 2, p.size);
    grad.addColorStop(0, p.color);
    grad.addColorStop(1, p.secondaryColor);
    ctx.fillStyle = grad;
    ctx.fill();

    // Subtle center vein on petal
    ctx.beginPath();
    ctx.moveTo(0, -p.size * 0.7);
    ctx.lineTo(0, p.size * 0.7);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();
  };

  const startShower = () => {
    setIsShowering(true);
    showerStartTimeRef.current = performance.now();
    spawnPetals(85);

    // Add a second small wave after 1.5s for continuous fullness
    setTimeout(() => {
      spawnPetals(45);
    }, 1200);

    if (showerTimeoutRef.current) {
      clearTimeout(showerTimeoutRef.current);
    }

    // Shower lasts 4.5 to 5 seconds
    showerTimeoutRef.current = setTimeout(() => {
      setIsShowering(false);
    }, 4800);
  };

  useEffect(() => {
    let animId: number;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        animId = requestAnimationFrame(render);
        return;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        animId = requestAnimationFrame(render);
        return;
      }

      if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (petalsRef.current.length > 0) {
        const height = canvas.height;
        const now = performance.now();

        for (let i = petalsRef.current.length - 1; i >= 0; i--) {
          const p = petalsRef.current[i];
          p.y += p.vy;
          p.x += p.vx + Math.sin(now * p.swayFreq + p.swayOffset) * p.swayAmp;
          p.rotation += p.vRotation;

          // Fade out near bottom of screen
          if (p.y > height - 120) {
            p.opacity -= 0.02;
          }

          drawPetal(ctx, p);

          // Remove petals once they leave screen or fully fade
          if (p.y > height + 50 || p.opacity <= 0) {
            petalsRef.current.splice(i, 1);
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    animationFrameRef.current = animId;

    return () => {
      if (animId) cancelAnimationFrame(animId);
      if (showerTimeoutRef.current) clearTimeout(showerTimeoutRef.current);
    };
  }, []);

  return (
    <>
      {/* Fullscreen flower shower canvas overlay */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-50"
        aria-hidden="true"
      />

      {/* Flower Shower Trigger Button */}
      <button
        type="button"
        onClick={startShower}
        className={`glass flex items-center gap-1.5 rounded-full px-3 sm:px-3.5 py-1.5 text-xs text-cream hover:text-amber border border-amber/35 hover:border-amber/60 hover:bg-amber/20 transition-all duration-300 active:scale-90 shadow-lg shadow-amber/10 group select-none ${
          isShowering ? "ring-2 ring-amber/50 bg-amber/20 scale-105" : ""
        }`}
        title="पुष्प वर्षा करें • Offer Flower Shower (4-5s)"
      >
        <span className="text-base leading-none transition-transform duration-300 group-hover:rotate-45 group-active:scale-125">
          🌸
        </span>
        <span
          lang="hi"
          className="font-utility text-[11.5px] sm:text-xs font-semibold text-amber tracking-wide"
        >
          पुष्प वर्षा
        </span>
        <span className="text-[10px] text-amber/70 font-utility hidden xs:inline">
          ✦
        </span>
      </button>
    </>
  );
}
