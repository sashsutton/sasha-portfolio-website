"use client";

import { useEffect, useRef } from "react";

/**
 * The hero's signature: a live waveform drawn on a 2D canvas.
 *
 * Two traces (ink + signal orange) are each a sum of three sines. At rest they
 * barely breathe; near the pointer they swell, and moving the pointer quickly
 * adds energy that decays over about a second — like plucking a string.
 *
 * Cheap by design: ~400 line segments per frame, paused when off-screen, and a
 * single static frame for visitors who prefer reduced motion.
 */
export function Waveform({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const darkScheme = window.matchMedia("(prefers-color-scheme: dark)");

    let width = 0;
    let height = 0;
    let raf = 0;
    let visible = true;
    let colors = { ink: "#161514", accent: "#ff4f1f" };

    // Pointer state: x eases toward target; energy decays every frame.
    const pointer = { x: -1, target: -1, energy: 0, lastX: 0 };

    const readColors = () => {
      const style = getComputedStyle(document.documentElement);
      colors = {
        ink: style.getPropertyValue("--fg").trim() || colors.ink,
        accent: style.getPropertyValue("--accent").trim() || colors.accent,
      };
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const traces = [
      { color: () => colors.ink, gain: 1, phase: 0, lineWidth: 1.6 },
      { color: () => colors.accent, gain: 0.7, phase: 1.9, lineWidth: 1.3 },
    ];

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      pointer.energy *= 0.95;
      if (pointer.target >= 0) {
        pointer.x = pointer.x < 0 ? pointer.target : pointer.x + (pointer.target - pointer.x) * 0.12;
      }

      const mid = height / 2;
      const t = time * 0.001;
      const reach = Math.max(width * 0.12, 90);

      for (const trace of traces) {
        ctx.beginPath();
        for (let x = 0; x <= width; x += 3) {
          const u = x / width;
          const taper = Math.sin(Math.PI * u); // ends pinned to the centre line
          const d = pointer.x < 0 ? 2 : (x - pointer.x) / reach;
          const swell = Math.exp(-d * d) * (0.45 + pointer.energy);
          const amplitude = Math.min(0.16 + swell, 0.95);
          const y =
            Math.sin(u * 13 + t * 1.6 + trace.phase) * 0.55 +
            Math.sin(u * 29 - t * 2.3 + trace.phase * 2) * 0.3 +
            Math.sin(u * 71 + t * 4.1) * 0.15 * (1 + swell * 2);
          const py = mid + y * amplitude * taper * mid * trace.gain;
          if (x === 0) ctx.moveTo(x, py);
          else ctx.lineTo(x, py);
        }
        ctx.strokeStyle = trace.color();
        ctx.lineWidth = trace.lineWidth;
        ctx.lineJoin = "round";
        ctx.stroke();
      }

      if (visible && !reduceMotion.matches) raf = requestAnimationFrame(draw);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(draw);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      // Only react while the pointer is in the hero band around the wave.
      if (event.clientY < rect.top - 260 || event.clientY > rect.bottom + 160) {
        pointer.target = -1;
        pointer.x = -1;
        return;
      }
      const x = event.clientX - rect.left;
      pointer.energy = Math.min(1.2, pointer.energy + Math.abs(x - pointer.lastX) / 260);
      pointer.lastX = x;
      pointer.target = x;
    };
    const onPointerLeave = () => {
      pointer.target = -1;
      pointer.x = -1;
    };

    readColors();
    resize();
    start();

    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (reduceMotion.matches) start();
    });
    resizeObserver.observe(canvas);

    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    });
    intersection.observe(canvas);

    const onScheme = () => {
      readColors();
      start();
    };
    darkScheme.addEventListener("change", onScheme);
    reduceMotion.addEventListener("change", start);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      intersection.disconnect();
      darkScheme.removeEventListener("change", onScheme);
      reduceMotion.removeEventListener("change", start);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className={`block w-full ${className}`} />;
}
