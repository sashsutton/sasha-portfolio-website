# Sasha Sutton — portfolio

A single-page portfolio: simple to read, quick to load, easy to edit.

```bash
npm install
npm run dev     # http://localhost:3000 (also reachable from your phone on the same Wi-Fi)
npm run build
```

## Editing

**All text and links live in `lib/content.ts`.** Change a project, a sentence or a
link there — no component needs touching.

- Portrait: `assets/portrait.jpg` (4:5, resized/optimised automatically by `next/image`)
- CV: `public/cv/sasha-sutton-cv.pdf`
- Colours: the `:root` block at the top of `app/globals.css` (light + dark)

## Stack

| | |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack), React 19.3, TypeScript |
| Styling | Tailwind CSS v4 — tokens in `app/globals.css` via `@theme` |
| Fonts | Instrument Serif, Geist, Geist Mono via `next/font` |
| Motion | CSS only: entrance keyframes + native scroll-driven reveals |
| Hero | `components/Waveform.tsx` — 2D canvas wave that reacts to the pointer |
| Sharing | `app/opengraph-image.tsx` generates the link-preview card |

Dark mode follows the visitor's system setting. Motion is disabled for visitors
who prefer reduced motion.

## Layout

```
app/          layout, page, global styles, icon, OG image
components/   Nav, Hero, Waveform, Work, About, Background, Contact, ui
lib/          content.ts — every word on the site
assets/       portrait
public/cv/    CV PDF
```
