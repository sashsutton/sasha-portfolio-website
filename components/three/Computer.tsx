"use client";

import { useEffect, useMemo, useState } from "react";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { CrtScreen } from "./CrtScreen";

/*
 * A beige CRT and keyboard, built from primitives: no model files to download.
 * Ported from the earlier portfolio's night scene and re-tuned for daylight
 * on the cream page.
 *
 * Layout (world units, monitor-local):
 *   shell      3.34 x 2.90 x 2.30, front face at z = +1.00
 *   opening    x ±1.28, y -0.86 → +1.06   (screen centre y = +0.10)
 *   screen     2.56 x 1.92  → 4:3
 *
 * Depth ladder (z). Layers are ~0.1 apart, so the order is load-bearing:
 *   1.05 tube housing · 1.21 phosphor · 1.30 glass apex · 1.19–1.39 bezel · 1.40 chin
 */

const OPENING = { halfW: 1.28, top: 1.06, bottom: -0.86 };
const SHELL = { halfW: 1.67, halfH: 1.45 };
const SCREEN_Y = 0.1;
const GLASS_R = 20; // radius of the sphere the glass is a patch of; bigger = flatter
const Z = { tubeFace: 1.05, phosphor: 1.21, glassApex: 1.3, bezel: 1.19, bezelDepth: 0.4, chin: 1.4 };
const BEZEL_R = 0.045;

const PLASTIC = "#e2d5b6";
const PLASTIC_DARK = "#cfc09c";

function Plastic({ tone = PLASTIC }: { tone?: string }) {
  return <meshStandardMaterial color={tone} roughness={0.68} metalness={0.02} />;
}

function BezelBar({ args, position }: { args: [number, number, number]; position: [number, number, number] }) {
  return (
    <RoundedBox args={args} radius={BEZEL_R} smoothness={3} position={position}>
      <Plastic />
    </RoundedBox>
  );
}

/** Moulded text on the plastic, drawn once into a small canvas texture in the site's mono font. */
function useLabelTexture(text: string) {
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    let tex: THREE.CanvasTexture | null = null;
    let cancelled = false;

    document.fonts.ready.then(() => {
      if (cancelled) return;
      const canvas = document.createElement("canvas");
      canvas.width = 1024;
      canvas.height = 160;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const family =
        getComputedStyle(document.documentElement).getPropertyValue("--font-geist-mono").trim() || "monospace";
      ctx.font = `500 54px ${family}`;
      ctx.fillStyle = "#7a6f58";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      if ("letterSpacing" in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "10px";
      ctx.fillText(text, 512, 82);

      tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 4;
      setTexture(tex);
    });

    return () => {
      cancelled = true;
      tex?.dispose();
    };
  }, [text]);

  return texture;
}

function Monitor({ booted, energy }: { booted: boolean; energy: { current: number } }) {
  const brand = useLabelTexture("SASHA-TRON 1200");

  return (
    <group>
      {/* Shell */}
      <RoundedBox args={[SHELL.halfW * 2, SHELL.halfH * 2, 2.3]} radius={0.14} smoothness={4} position={[0, 0, -0.15]}>
        <Plastic />
      </RoundedBox>

      {/* Tapered tube housing out the back: reads as CRT, not LCD. */}
      <mesh position={[0, 0, -1.55]} rotation={[Math.PI / 2, 0, Math.PI / 4]}>
        <cylinderGeometry args={[1.15, 0.42, 0.7, 4, 1, true]} />
        <meshStandardMaterial color={PLASTIC_DARK} roughness={0.75} side={THREE.DoubleSide} />
      </mesh>

      {/* Cooling slots on top */}
      {Array.from({ length: 7 }, (_, i) => (
        <mesh key={i} position={[0, 1.451, -0.75 + i * 0.16]}>
          <boxGeometry args={[2.1, 0.02, 0.055]} />
          <meshStandardMaterial color="#8d8168" roughness={0.9} />
        </mesh>
      ))}

      {/* Dark surround around the phosphor */}
      <RoundedBox args={[2.62, 1.98, 0.3]} radius={0.1} smoothness={3} position={[0, SCREEN_Y, Z.tubeFace]}>
        <meshStandardMaterial color="#0d0c0b" roughness={0.4} metalness={0.1} />
      </RoundedBox>

      <CrtScreen booted={booted} energy={energy} position={[0, SCREEN_Y, Z.phosphor]} />

      {/* Curved glass: a patch of a big sphere, picks up the environment's reflections. */}
      <mesh position={[0, SCREEN_Y, Z.glassApex - GLASS_R]}>
        <sphereGeometry
          args={[
            GLASS_R,
            32,
            24,
            Math.PI / 2 - 2.62 / GLASS_R / 2,
            2.62 / GLASS_R,
            Math.PI / 2 - 1.98 / GLASS_R / 2,
            1.98 / GLASS_R,
          ]}
        />
        <meshPhysicalMaterial
          transparent
          opacity={0.12}
          roughness={0.15}
          clearcoat={0.6}
          clearcoatRoughness={0.2}
          color="#f3f0e8"
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Bezel. Side bars overlap the top/bottom bars so the rounded edges don't leave notches. */}
      <BezelBar
        args={[SHELL.halfW * 2, SHELL.halfH - OPENING.top, Z.bezelDepth]}
        position={[0, (SHELL.halfH + OPENING.top) / 2, Z.bezel]}
      />
      <BezelBar
        args={[SHELL.halfW * 2, OPENING.bottom + SHELL.halfH, Z.bezelDepth]}
        position={[0, (-SHELL.halfH + OPENING.bottom) / 2, Z.bezel]}
      />
      {[-1, 1].map((side) => (
        <BezelBar
          key={side}
          args={[SHELL.halfW - OPENING.halfW, OPENING.top - OPENING.bottom + 2 * BEZEL_R, Z.bezelDepth]}
          position={[(side * (SHELL.halfW + OPENING.halfW)) / 2, SCREEN_Y, Z.bezel]}
        />
      ))}

      {/* Chin: brand badge, power LED, thumbwheels */}
      {brand && (
        <mesh position={[-0.52, -1.14, Z.chin]}>
          <planeGeometry args={[1.15, 1.15 / 6.4]} />
          <meshBasicMaterial map={brand} transparent depthWrite={false} />
        </mesh>
      )}
      <mesh position={[1.24, -1.15, Z.chin]}>
        <circleGeometry args={[0.03, 16]} />
        <meshBasicMaterial color="#ff4f1f" toneMapped={false} />
      </mesh>
      {[0.72, 0.95].map((x) => (
        <mesh key={x} position={[x, -1.16, Z.chin]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.07, 20]} />
          <meshStandardMaterial color="#8d8168" roughness={0.5} metalness={0.15} />
        </mesh>
      ))}

      {/* Stand */}
      <mesh position={[0, -1.62, -0.1]}>
        <cylinderGeometry args={[0.34, 0.5, 0.42, 24]} />
        <Plastic tone={PLASTIC_DARK} />
      </mesh>
      <RoundedBox args={[1.95, 0.16, 1.6]} radius={0.06} smoothness={3} position={[0, -1.9, -0.1]}>
        <Plastic tone={PLASTIC_DARK} />
      </RoundedBox>
    </group>
  );
}

/* Keyboard: ~60 caps drawn as one instanced mesh (one draw call). */
const ROWS = [14, 14, 13, 12];
const KEY = 0.155;
const GAP = 0.028;

function Keyboard(props: React.ComponentProps<"group">) {
  const matrices = useMemo(() => {
    const list: THREE.Matrix4[] = [];
    const dummy = new THREE.Object3D();
    const pitch = KEY + GAP;
    ROWS.forEach((keys, row) => {
      const offset = (-keys * pitch) / 2 + pitch / 2 + row * 0.03; // staggered rows
      for (let i = 0; i < keys; i++) {
        dummy.position.set(offset + i * pitch, 0, -row * pitch + 0.28);
        dummy.updateMatrix();
        list.push(dummy.matrix.clone());
      }
    });
    return list;
  }, []);

  return (
    <group {...props}>
      <RoundedBox args={[2.95, 0.17, 1.12]} radius={0.05} smoothness={3}>
        <meshStandardMaterial color={PLASTIC_DARK} roughness={0.7} />
      </RoundedBox>
      <instancedMesh
        args={[undefined, undefined, matrices.length]}
        position={[0, 0.1, 0]}
        ref={(mesh) => {
          if (!mesh) return;
          matrices.forEach((m, i) => mesh.setMatrixAt(i, m));
          mesh.instanceMatrix.needsUpdate = true;
        }}
      >
        <boxGeometry args={[KEY, 0.06, KEY]} />
        <meshStandardMaterial color="#ece3cf" roughness={0.55} />
      </instancedMesh>
      {/* Space bar */}
      <mesh position={[0.06, 0.1, 0.44]}>
        <boxGeometry args={[1.1, 0.06, KEY]} />
        <meshStandardMaterial color="#ece3cf" roughness={0.55} />
      </mesh>
    </group>
  );
}

export function Computer({ booted, energy }: { booted: boolean; energy: { current: number } }) {
  return (
    <group>
      <Monitor booted={booted} energy={energy} />
      <Keyboard position={[0.05, -1.915, 2.05]} rotation={[0, -0.05, 0]} />
    </group>
  );
}
