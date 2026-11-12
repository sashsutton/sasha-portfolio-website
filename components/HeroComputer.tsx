"use client";

import dynamic from "next/dynamic";

/**
 * three.js is the heaviest thing on the page and can't render on the server,
 * so the scene is split into its own chunk and loaded in the browser only.
 * The hero text paints first; the computer fades in once its code arrives.
 */
export const HeroComputer = dynamic(() => import("./three/ComputerScene"), { ssr: false });
