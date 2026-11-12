import { ImageResponse } from "next/og";
import { site } from "@/lib/content";

/** The card shown when the site is shared (LinkedIn, iMessage, Slack…). */
export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Same idea as the hero waveform, frozen into an SVG path. */
function wavePath(width: number, height: number, phase: number) {
  const mid = height / 2;
  let d = "";
  for (let x = 0; x <= width; x += 6) {
    const u = x / width;
    const y =
      Math.sin(u * 13 + phase) * 0.55 + Math.sin(u * 29 + phase * 2) * 0.3 + Math.sin(u * 71) * 0.15;
    const swell = 0.2 + 0.6 * Math.exp(-(((u - 0.62) / 0.16) ** 2));
    d += `${x === 0 ? "M" : "L"}${x} ${(mid + y * swell * Math.sin(Math.PI * u) * mid).toFixed(1)} `;
  }
  return d;
}

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f3f0e8",
          color: "#161514",
          padding: "64px 72px",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, letterSpacing: 4, color: "#64615a" }}>
          {`${site.role.toUpperCase()} · ${site.location.toUpperCase()}`}
        </div>
        <div style={{ display: "flex", fontSize: 150, lineHeight: 0.9, letterSpacing: -4, fontFamily: "serif" }}>
          {site.name}
        </div>
        <svg width="1056" height="140" viewBox="0 0 1056 140">
          <path d={wavePath(1056, 140, 0)} fill="none" stroke="#161514" strokeWidth="3" />
          <path d={wavePath(1056, 140, 1.9)} fill="none" stroke="#ff4f1f" strokeWidth="3" />
        </svg>
      </div>
    ),
    size,
  );
}
