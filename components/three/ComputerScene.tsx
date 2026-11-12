"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { Computer } from "./Computer";

/**
 * The hero's 3D computer. Loaded client-side only (see HeroComputer), on a
 * transparent canvas so it sits directly on the cream page.
 *
 * Motion: the machine turns gently toward the pointer. The screen's menu is
 * clickable, so the canvas takes pointer events (touch scrolling
 * still passes through: R3F doesn't set touch-action).
 *
 * Cost control: rendering stops entirely while the hero is off-screen, and
 * visitors who prefer reduced motion get one still frame.
 */

/** Base pose: a three-quarter view from the left, so the hero text reads into it. */
const BASE_YAW = -0.38;

function Rig({ booted }: { booted: boolean }) {
  const group = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const { x, y } = pointer.current;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, BASE_YAW + x * 0.22 + Math.sin(t * 0.32) * 0.015, 3, delta);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, y * 0.06, 3, delta);
    g.position.y = Math.sin(t * 0.6) * 0.015;
  });

  return (
    <group ref={group}>
      <Computer booted={booted} />
    </group>
  );
}

export default function ComputerScene() {
  const wrapper = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [ready, setReady] = useState(false);
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener("change", update);

    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    if (wrapper.current) io.observe(wrapper.current);

    return () => {
      mq.removeEventListener("change", update);
      io.disconnect();
    };
  }, []);

  // The tube warms up a beat after the machine fades in.
  useEffect(() => {
    if (!ready) return;
    const id = setTimeout(() => setBooted(true), reduceMotion ? 0 : 600);
    return () => clearTimeout(id);
  }, [ready, reduceMotion]);

  const frameloop = !inView ? "never" : reduceMotion ? "demand" : "always";

  return (
    <div
      ref={wrapper}
      aria-hidden
      className="size-full transition-opacity duration-1000"
      style={{ opacity: ready ? 1 : 0 }}
    >
      <Canvas
        frameloop={frameloop}
        dpr={[1, 1.75]}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0.7, 9.6], fov: 30, near: 0.1, far: 40 }}
        onCreated={({ camera }) => {
          camera.lookAt(0, -0.85, 0.5);
          setReady(true);
        }}
      >
        <ambientLight intensity={0.9} color="#fff6e8" />
        <directionalLight position={[-5, 6, 6]} intensity={2.1} color="#fffaf0" />
        <directionalLight position={[6, 2, -4]} intensity={0.6} color="#ffd8b0" />

        {/* Built-in light shapes instead of an HDRI: no download, gives the plastic and glass something to reflect. */}
        <Environment resolution={128} frames={1}>
          <Lightformer form="rect" intensity={2} color="#ffffff" scale={[10, 6, 1]} position={[-6, 5, 4]} target={[0, 0, 0]} />
          <Lightformer form="rect" intensity={0.8} color="#ffe2c4" scale={[8, 4, 1]} position={[6, 2, -5]} target={[0, 0, 0]} />
          <Lightformer form="rect" intensity={0.6} color="#ffffff" scale={[14, 14, 1]} position={[0, 9, 0]} rotation={[Math.PI / 2, 0, 0]} />
        </Environment>

        <Rig booted={booted} />

        {/* Soft shadow on the "page" under the machine. */}
        <ContactShadows position={[0, -2, 0.5]} scale={10} blur={2.4} opacity={0.32} far={3.5} resolution={512} color="#3a3020" />
      </Canvas>
    </div>
  );
}
