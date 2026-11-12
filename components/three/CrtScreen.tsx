"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { type ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * The CRT's screen: a little terminal that types itself out after power-on,
 *
 *   $ whoami
 *   Sasha Sutton
 *   aspiring ML researcher
 *   $ ls
 *   > projects
 *     about
 *     background
 *
 * with the hero's waveform running faintly behind it. The menu items are
 * clickable and scroll to their section (the same links are in the nav, so
 * nothing is only reachable from here).
 *
 * The text is drawn into a 2D canvas texture; the glow, scanlines, curvature
 * and power-on wipe are done in the shader.
 */

const W = 1024;
const H = 768; // 4:3, same as the tube
const FONT_PX = 64;
const LINE = 82;
const LEFT = 60;
const TOP = 64;

const MENU = [
  { label: "projects", id: "projects" },
  { label: "about", id: "about" },
  { label: "background", id: "background" },
];

const COLORS = {
  prompt: "#ff6b3d",
  text: "#f3efe4",
  muted: "#a29d90",
  highlightText: "#12110f",
};

type Line = { parts: { text: string; color: string; weight?: number }[]; item?: number };

/** What the terminal shows `ms` after power-on. */
function script(ms: number, done: boolean): { lines: Line[]; finished: boolean } {
  const lines: Line[] = [];
  const type = (text: string, start: number, speed = 85) =>
    done ? text : text.slice(0, Math.max(0, Math.floor((ms - start) / speed)));
  const after = (t: number) => done || ms >= t;

  const prompt = (cmd: string) => ({ parts: [{ text: "$ ", color: COLORS.prompt }, { text: cmd, color: COLORS.text }] });

  lines.push(prompt(type("whoami", 300)));
  if (after(1150)) lines.push({ parts: [{ text: "Sasha Sutton", color: COLORS.text, weight: 600 }] });
  if (after(1350)) lines.push({ parts: [{ text: "aspiring ML researcher", color: COLORS.muted }] });
  if (after(1900)) lines.push(prompt(type("ls", 2100)));
  MENU.forEach((item, i) => {
    if (after(2500 + i * 140)) lines.push({ parts: [{ text: item.label, color: COLORS.text }], item: i });
  });
  return { lines, finished: done || ms >= 2500 + MENU.length * 140 };
}

function useMonoFamily() {
  const [family, setFamily] = useState<string | null>(null);
  useEffect(() => {
    const css = getComputedStyle(document.documentElement).getPropertyValue("--font-geist-mono").trim() || "monospace";
    Promise.all([document.fonts.load(`400 ${FONT_PX}px ${css}`), document.fonts.load(`600 ${FONT_PX}px ${css}`)])
      .catch(() => undefined)
      .then(() => setFamily(css));
  }, []);
  return family;
}

/** Draws the terminal into a canvas texture and keeps it up to date. */
function useTerminalTexture(booted: boolean, hovered: number | null) {
  const family = useMonoFamily();
  const invalidate = useThree((s) => s.invalidate);
  const canvas = useMemo(() => {
    if (typeof document === "undefined") return null;
    const c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    return c;
  }, []);
  const texture = useMemo(() => {
    if (!canvas) return null;
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  }, [canvas]);
  useEffect(() => () => texture?.dispose(), [texture]);

  const [elapsed, setElapsed] = useState(0);
  const [cursorOn, setCursorOn] = useState(true);
  const reduceMotion = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  // Typing clock: runs from power-on until the script has finished.
  useEffect(() => {
    if (!booted || reduceMotion) return;
    const start = performance.now() + 500; // let the tube warm up first
    const id = setInterval(() => {
      const ms = performance.now() - start;
      setElapsed(ms);
      if (script(ms, false).finished) clearInterval(id);
    }, 40);
    return () => clearInterval(id);
  }, [booted, reduceMotion]);

  // Blinking cursor.
  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(() => setCursorOn((on) => !on), 530);
    return () => clearInterval(id);
  }, [reduceMotion]);

  const { lines, finished } = script(elapsed, reduceMotion);

  useEffect(() => {
    const ctx = canvas?.getContext("2d");
    if (!ctx || !texture || !family) return;

    ctx.clearRect(0, 0, W, H);
    ctx.textBaseline = "middle";
    const charW = (() => {
      ctx.font = `400 ${FONT_PX}px ${family}`;
      return ctx.measureText("M").width;
    })();

    const rows: Line[] = finished ? [...lines, { parts: [{ text: "$ ", color: COLORS.prompt }] }] : lines;

    rows.forEach((line, row) => {
      const y = TOP + row * LINE;
      let x = LEFT;

      if (line.item !== undefined) {
        // Menu entries: "> " marks the selected one (the first, until something is hovered).
        const selected = (hovered ?? 0) === line.item;
        const label = line.parts[0].text;
        if (selected) {
          ctx.fillStyle = COLORS.prompt;
          ctx.fillRect(LEFT - 10, y - LINE / 2 + 6, (label.length + 2) * charW + 20, LINE - 12);
        }
        ctx.font = `${selected ? 600 : 400} ${FONT_PX}px ${family}`;
        ctx.fillStyle = selected ? COLORS.highlightText : COLORS.text;
        ctx.fillText(`${selected ? ">" : " "} ${label}`, x, y);
        return;
      }

      for (const part of line.parts) {
        ctx.font = `${part.weight ?? 400} ${FONT_PX}px ${family}`;
        ctx.fillStyle = part.color;
        ctx.fillText(part.text, x, y);
        x += ctx.measureText(part.text).width;
      }
    });

    // Block cursor at the end of whatever is being typed (or the final prompt).
    if (cursorOn || reduceMotion) {
      const last = rows[rows.length - 1];
      const typed = last.parts.map((p) => p.text).join("");
      ctx.fillStyle = COLORS.text;
      ctx.fillRect(LEFT + typed.length * charW + 4, TOP + (rows.length - 1) * LINE - FONT_PX * 0.45, charW * 0.62, FONT_PX * 0.9);
    }

    texture.needsUpdate = true;
    invalidate();
  }, [canvas, texture, family, lines, finished, cursorOn, reduceMotion, invalidate]);

  /** Which menu row (if any) a point on the screen, in canvas pixels, falls on. */
  const itemAt = (px: number, py: number) => {
    const rowsBefore = lines.findIndex((l) => l.item !== undefined);
    if (rowsBefore < 0 || px < LEFT - 20 || px > W - LEFT) return null;
    const row = Math.round((py - TOP) / LINE);
    const item = row - rowsBefore;
    return item >= 0 && item < MENU.length && lines[row]?.item === item ? item : null;
  };

  return { texture, itemAt };
}

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    // Bulge outward like a tube face; clamped >= 0 so corners never sink behind the housing.
    vec3 p = position;
    vec2 d = (uv - 0.5) * 2.0;
    p.z += 0.05 * (1.0 - clamp(dot(d, d) * 0.55, 0.0, 1.0));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  varying vec2 vUv;

  uniform sampler2D uText;
  uniform float uTime;
  uniform float uBoot;    // 0 → 1 power-on
  uniform float uEnergy;  // pointer energy
  uniform vec3  uBg;
  uniform vec3  uTrace;

  const float PI = 3.14159265;
  const vec2 ASPECT = vec2(4.0, 3.0);
  const vec2 TEXEL = vec2(1.0 / 1024.0, 1.0 / 768.0);

  // Same wave as components/Waveform.tsx.
  float traceY(float u, float t) {
    float w = sin(u * 13.0 + t * 1.6) * 0.55
            + sin(u * 29.0 - t * 2.3) * 0.3
            + sin(u * 71.0 + t * 4.1) * 0.15 * (1.0 + uEnergy * 2.0);
    return 0.5 + 0.5 * w * (0.34 + uEnergy * 0.45) * sin(PI * u);
  }

  float trace(vec2 uv, float t) {
    float e = 0.0015;
    float y0 = traceY(uv.x, t);
    float slope = ((traceY(uv.x + e, t) - y0) * ASPECT.y) / (e * ASPECT.x);
    float d = abs(uv.y - y0) * ASPECT.y / sqrt(1.0 + slope * slope);
    return exp(-pow(d / 0.02, 2.0)) + 0.25 * exp(-d / 0.14);
  }

  void main() {
    vec2 uv = vUv;
    vec2 c = uv * 2.0 - 1.0;

    // Power-on: a hairline that snaps open vertically.
    float open = smoothstep(0.0, 0.65, uBoot);
    float halfH = 0.5 * open * open;
    float mask = 1.0 - smoothstep(halfH, halfH + 0.006, abs(uv.y - 0.5));
    float hairline = (1.0 - smoothstep(0.0, 0.9, uBoot)) * exp(-abs(uv.y - 0.5) * 260.0) * 3.0;

    // Background: dark phosphor with the waveform running faintly behind the text.
    vec3 col = uBg + uTrace * trace(uv, uTime) * (0.22 + uEnergy * 0.35);

    // Text, plus a soft halo so it reads as glowing phosphor rather than print.
    vec4 text = texture2D(uText, uv);
    vec3 halo = vec3(0.0);
    for (int i = 0; i < 8; i++) {
      float a = float(i) * PI / 4.0;
      halo += texture2D(uText, uv + vec2(cos(a), sin(a)) * TEXEL * 5.0).rgb
            * texture2D(uText, uv + vec2(cos(a), sin(a)) * TEXEL * 5.0).a;
    }
    col = mix(col, text.rgb, text.a) + halo / 8.0 * 0.35;

    // Tube character: scanlines and vignette.
    col *= mix(1.0, 0.5 + 0.5 * sin(uv.y * 620.0), 0.16);
    col *= 1.0 - dot(c, c) * 0.32;
    col += uTrace * hairline;

    gl_FragColor = vec4(col * mask, 1.0);

    #include <colorspace_fragment>
  }
`;

type Props = {
  width?: number;
  height?: number;
  booted: boolean;
  energy: { current: number };
} & Omit<React.ComponentProps<"mesh">, "args">;

export function CrtScreen({ width = 2.56, height = 1.92, booted, energy, ...props }: Props) {
  const [hovered, setHovered] = useState<number | null>(null);
  const { texture, itemAt } = useTerminalTexture(booted, hovered);
  const material = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uText: { value: texture },
      uTime: { value: 0 },
      uBoot: { value: 0 },
      uEnergy: { value: 0 },
      uBg: { value: new THREE.Color("#12110f") },
      uTrace: { value: new THREE.Color("#ff6b3d") },
    }),
    [texture],
  );

  useFrame((state, delta) => {
    // Write through the material's own uniforms: the object passed as a prop
    // is not guaranteed to be the one the material ends up holding.
    const u = material.current?.uniforms;
    if (!u) return;
    u.uTime.value = state.clock.elapsedTime;
    u.uBoot.value = THREE.MathUtils.damp(u.uBoot.value, booted ? 1 : 0, 2.6, delta);
    u.uEnergy.value = energy.current;
  });

  useEffect(() => {
    document.body.style.cursor = hovered === null ? "" : "pointer";
    return () => {
      document.body.style.cursor = "";
    };
  }, [hovered]);

  const pick = (e: ThreeEvent<PointerEvent | MouseEvent>) =>
    e.uv ? itemAt(e.uv.x * W, (1 - e.uv.y) * H) : null;

  return (
    <mesh
      {...props}
      onPointerMove={(e) => setHovered(pick(e))}
      onPointerOut={() => setHovered(null)}
      onClick={(e) => {
        const item = pick(e);
        if (item !== null) document.getElementById(MENU[item].id)?.scrollIntoView({ behavior: "smooth" });
      }}
    >
      <planeGeometry args={[width, height, 48, 36]} />
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        toneMapped={false}
      />
    </mesh>
  );
}
