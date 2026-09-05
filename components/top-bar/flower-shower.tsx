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
  maxOpacity: number;
  type: "marigold" | "rose" | "lotus" | "jasmine" | "sparkle";
  color: string;
}

export function FlowerShower() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isShowering, setIsShowering] = useState(false);
  const petalsRef = useRef<Petal[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const showerTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Resize canvas handler (only on mount / resize, avoiding per-frame layout thrashing)
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(dpr, dpr);
    }
  }, []);

  const spawnPetals = useCallback((count?: number) => {
    const width = window.innerWidth || 360;
    const isMobile = width < 640;

    // Mobile performance tuning: limit count so mobile GPUs never hang or stutter
    const targetCount = count ?? (isMobile ? 30 : 60);

    const colors = {
      marigold: "#f59e0b", // Rich Golden Marigold
      rose: "#ef4444",     // Vivid Red Rose
      lotus: "#ec4899",    // Pink Lotus
      jasmine: "#fef08a",  // Soft Jasmine Cream
      sparkle: "#fde047",  // Divine Golden Sparkle
    };

    const newPetals: Petal[] = [];
    for (let i = 0; i < targetCount; i++) {
      const typeChoice = Math.random();
      let type: Petal["type"] = "marigold";
      if (typeChoice < 0.35) type = "marigold";
      else if (typeChoice < 0.65) type = "rose";
      else if (typeChoice < 0.85) type = "lotus";
      else if (typeChoice < 0.95) type = "jasmine";
      else type = "sparkle";

      // 3 distinct opacity & depth tiers:
      // ~35% FULLY OPAQUE (0.92 - 1.0) - Bold, solid foreground petals
      // ~40% SEMI-TRANSLUCENT (0.60 - 0.78) - Midground depth
      // ~25% ETHEREAL TRANSLUCENT (0.30 - 0.48) - Soft background petals
      const tierChoice = Math.random();
      let maxOpacity: number;
      let sizeScale = 1;

      if (tierChoice < 0.35) {
        maxOpacity = 0.92 + Math.random() * 0.08; // Fully Opaque (Solid!)
        sizeScale = 1.15;
      } else if (tierChoice < 0.75) {
        maxOpacity = 0.60 + Math.random() * 0.18; // Semi-Translucent
        sizeScale = 1.0;
      } else {
        maxOpacity = 0.30 + Math.random() * 0.18; // Soft Ethereal Translucent
        sizeScale = 0.85;
      }

      const baseSize = type === "sparkle" ? 2.5 + Math.random() * 3 : (isMobile ? 7 + Math.random() * 8 : 9 + Math.random() * 11);

      newPetals.push({
        x: Math.random() * width,
        y: -20 - Math.random() * 160,
        vx: (Math.random() - 0.5) * 0.9,
        vy: 1.8 + Math.random() * 2.0,
        size: baseSize * sizeScale,
        rotation: Math.random() * Math.PI * 2,
        vRotation: (Math.random() - 0.5) * 0.05,
        swayFreq: 0.015 + Math.random() * 0.025,
        swayAmp: 0.8 + Math.random() * 1.5,
        swayOffset: Math.random() * Math.PI * 2,
        opacity: 0.05, // Fade in from 0.05
        maxOpacity,
        type,
        color: colors[type],
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
      for (let i = 0; i < 4; i++) {
        ctx.rotate(Math.PI / 4);
        ctx.lineTo(0, p.size * 1.2);
        ctx.rotate(Math.PI / 4);
        ctx.lineTo(0, p.size * 0.35);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      return;
    }

    // Draw multi-petaled FLOWER BLOSSOM (Marigold, Rose, Lotus, Jasmine)
    const numPetals = p.type === "marigold" ? 7 : 5;
    const r = p.size;
    const coreRadius = r * (p.type === "marigold" ? 0.42 : 0.32);

    // 1. Draw surrounding petals around center
    ctx.fillStyle = p.color;
    for (let i = 0; i < numPetals; i++) {
      const angle = (i * 2 * Math.PI) / numPetals;
      const nextAngle = ((i + 1) * 2 * Math.PI) / numPetals;
      const midAngle = (angle + nextAngle) / 2;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(
        Math.cos(angle) * r * 1.3,
        Math.sin(angle) * r * 1.3,
        Math.cos(midAngle) * r,
        Math.sin(midAngle) * r
      );
      ctx.quadraticCurveTo(
        Math.cos(nextAngle) * r * 1.3,
        Math.sin(nextAngle) * r * 1.3,
        0,
        0
      );
      ctx.fill();
    }

    // 2. Center core / seed (stamen)
    ctx.fillStyle = p.type === "marigold" ? "#b45309" : p.type === "rose" ? "#881337" : p.type === "lotus" ? "#be185d" : "#ca8a04";
    ctx.beginPath();
    ctx.arc(0, 0, coreRadius, 0, Math.PI * 2);
    ctx.fill();

    // 3. Stamen center dots for detail
    if (p.type !== "marigold") {
      ctx.fillStyle = "#fde047";
      for (let s = 0; s < 4; s++) {
        const sAngle = (s * Math.PI) / 2;
        ctx.beginPath();
        ctx.arc(
          Math.cos(sAngle) * (coreRadius * 0.5),
          Math.sin(sAngle) * (coreRadius * 0.5),
          0.8,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    }

    ctx.restore();
  };

  const startShower = () => {
    setIsShowering(true);
    const isMobile = window.innerWidth < 640;

    spawnPetals(isMobile ? 30 : 55);

    // Wave 2 after 1s
    setTimeout(() => {
      spawnPetals(isMobile ? 15 : 30);
    }, 1000);

    if (showerTimeoutRef.current) {
      clearTimeout(showerTimeoutRef.current);
    }

    showerTimeoutRef.current = setTimeout(() => {
      setIsShowering(false);
    }, 4200);
  };

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

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

      const width = window.innerWidth;
      const height = window.innerHeight;

      ctx.clearRect(0, 0, width, height);

      if (petalsRef.current.length > 0) {
        const now = performance.now();

        for (let i = petalsRef.current.length - 1; i >= 0; i--) {
          const p = petalsRef.current[i];
          p.y += p.vy;
          p.x += p.vx + Math.sin(now * p.swayFreq + p.swayOffset) * p.swayAmp;
          p.rotation += p.vRotation;

          // Smooth fade in near top
          if (p.opacity < p.maxOpacity) {
            p.opacity = Math.min(p.maxOpacity, p.opacity + 0.04);
          }

          // Smooth fade out near bottom of viewport
          if (p.y > height - 160) {
            p.opacity -= 0.015;
          }

          drawPetal(ctx, p);

          // Remove petals once off screen or fully faded
          if (p.y > height + 40 || p.opacity <= 0) {
            petalsRef.current.splice(i, 1);
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    animationFrameRef.current = animId;

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animId) cancelAnimationFrame(animId);
      if (showerTimeoutRef.current) clearTimeout(showerTimeoutRef.current);
    };
  }, [resizeCanvas]);

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
        title="पुष्प वर्षा करें • Offer Flower Shower"
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
