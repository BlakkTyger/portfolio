# Custom Graphics Specification

> This file documents every visual element in `WorldlineSection.tsx` that needs a custom graphic asset — either a detailed SVG you design in Figma/Illustrator, or a downloaded asset that gets traced/converted.
> The placeholder SVG structure, IDs, and viewBox dimensions are listed precisely so you can drop replacements straight into the code.

---

## Legend

| Symbol | Meaning |
|--------|---------|
| 🖌️ | Design in Figma / Illustrator |
| 🌐 | Download & SVG-trace |
| ⚙️ | Procedural / code-only (no custom asset needed) |

---

## Stage 1 — Arduino UNO Board

**Status:** 🌐 / 🖌️ (trace a top-down photo or redraw in Figma)

### Current placeholder
- A dark-green rectangle `#1e3a2f`, 280×170 px, with simplified chip, pins, USB connector, and crystal built from primitives.

### Custom asset requirements

| Property | Value |
|----------|-------|
| **SVG viewBox** | `0 0 280 170` |
| **Root `id`** | `jny-arduino-board` (outer `<rect>`) → replace with `<g id="jny-arduino-board">` |
| **Board outline path id** | `arduino-outline` |
| **MCU chip group id** | `arduino-mcu` |
| **Pin header group id** | `arduino-pins` |
| **USB port group id** | `arduino-usb` |
| **Stroke colour** | `#00FF9D` (--terminal-cyan) |
| **Fill** | `#1e3a2f` body; `#111` chip; `#2a2a2a` USB |

### How to drop in
1. Export the board as a standalone SVG with `viewBox="0 0 280 170"`.
2. Replace the `<rect id="jny-arduino-board" .../>` and all sibling component elements inside `<g id="jny-arduino-group">` with your `<g id="jny-arduino-board">…</g>`.
3. Keep the circuit-trace `<path class="jny-trace">` elements — they radiate out from the board and are controlled by GSAP.

### Trace attachment points (in viewport coordinates)
The following are the `M` start points of each trace path. Ensure the board artwork has visible "pads" or circles at these positions:

```
Left side:  (540, 270), (540, 310), (540, 340)
Right side: (820, 265), (820, 300), (820, 330)
Top side:   (680, 200), (720, 200)
```

---

## Stage 2 — Wireframe Food Container (ADBHUT)

**Status:** 🖌️ (design a clean wireframe bowl / lidded container)

### Current placeholder
- An ellipse-based wireframe bowl with horizontal rings, built purely in SVG.

### Custom asset requirements

| Property | Value |
|----------|-------|
| **SVG viewBox** | `0 0 240 220` |
| **Root group id** | `jny-container-body` |
| **Top ellipse id** | `container-top-rim` |
| **Bottom ellipse id** | `container-bottom-rim` |
| **Side strokes class** | `container-meridian` (7 paths) |
| **Horizontal ring class** | `container-ring` (3–4 paths) |
| **Stroke colour** | `#c8b98a` (parchment) |
| **Fill** | none (wireframe only) |

### Design notes
- The container should look like a round, sustainable bowl with a subtle lid — reference a bento box or bioplastic container.
- All strokes should be hairline (`strokeWidth: 0.8–1.5`) so it reads as a technical schematic, not an illustration.
- Centre of the asset in the viewBox should be `(120, 110)` — GSAP rotates around this point.
- GSAP applies `rotationY` to the whole group (`svgOrigin: '500 300'` in the viewport) — the wireframe illusion of 3-D rotation works because of the varying meridian line widths.

---

## Stage 3 — Neural Network Graph

**Status:** ⚙️ (fully procedural — no asset needed)

All nodes and edges are generated programmatically in the component. No custom graphic required.

If you want custom node icons (e.g., tiny neuron illustrations inside each circle), design them as `<symbol>` defs and reference them via `<use>`.

---

## Stage 4 — F1 Car (Team Quantum Racing)

**Status:** 🖌️ (design a clean side-profile silhouette)

### Current placeholder
- A simplified side-profile F1 car built from `<path>` and `<circle>` primitives.

### Custom asset requirements

| Property | Value |
|----------|-------|
| **SVG viewBox** | `0 0 450 130` |
| **Root group id** | `jny-f1-car` (keep the outer `<g id="jny-f1-car">` wrapper in the component) |
| **Body path id** | `f1-body` |
| **Cockpit path id** | `f1-cockpit` |
| **Front wing id** | `f1-front-wing` |
| **Rear wing id** | `f1-rear-wing` |
| **Rear wheel id** | `f1-rear-wheel` |
| **Front wheel id** | `f1-front-wheel` |
| **Number plate id** | `f1-number` |
| **Primary stroke** | `#00FF9D` (cyan) |
| **Accent stroke** | `#c8b98a` (parchment) for wings |
| **Wheel stroke** | `#8F00FF` (violet) |
| **Fill** | `#1a1a2e` body, `#111` tyres |

### Design notes
- Car faces **left** (nose pointing left, exhaust pointing right) — this matches the right-to-left motion animation.
- The car should fit within a 450×130 bounding box at its "natural" size.
- The GSAP animation translates the whole `#jny-f1-car` group: it starts at `x: +600` (off-screen right in SVG space) and travels left.
- Add `QR·01` or your team number on the sidepod; use `font-family: monospace`.
- Keep exhaust/DRS vent open at the rear — GSAP adds an orange glow at `(0,55)` relative to the car group origin.

### Wind line attachment
The wind lines (`class="jny-wind"`) are `<path>` elements whose right endpoint is at `x=1020` (off-screen right of the 1000-wide viewBox). They terminate at `x=700`. Ensure the car's rear (exhaust side) sits around `x=50–80` relative to its group origin so the wind lines visually trail behind it.

---

## Stage 5 — Quantum Circuit + Gavel

**Status:** ⚙️ circuit is procedural; 🖌️ optional for gavel

### Gavel (optional custom art)

| Property | Value |
|----------|-------|
| **SVG viewBox** | `0 0 60 130` |
| **Root id** | `jny-gavel` (keep the outer `<g id="jny-gavel" transform="translate(700,80)">` wrapper) |
| **Handle path id** | `gavel-handle` |
| **Head path id** | `gavel-head` |
| **Stroke colour** | `#c8b98a` (parchment) |
| **Fill** | `#c8b98a` at ~0.8–0.9 opacity |

### Notes
- The gavel's pivot point for the swing animation is at approximately `(80%, 20%)` of its bounding box — place the grip end there.
- GSAP swings it from `rotation: -70` to `rotation: 15` over the scroll-scrub.

---

## Stage 6 — Optical Lens (Nanophotonics)

**Status:** ⚙️ + 🖌️ optional enhanced version

### Current placeholder
- A biconvex lens drawn from two quadratic Bézier arcs and a transparent fill.

### Custom asset (optional upgrade)

| Property | Value |
|----------|-------|
| **SVG viewBox** | `0 0 160 180` |
| **Root id** | `jny-lens` (keep the outer `<g id="jny-lens">` wrapper with `filter="url(#glow-cyan)"`) |
| **Left arc id** | `lens-left-arc` |
| **Right arc id** | `lens-right-arc` |
| **Lens fill id** | `lens-fill` |
| **Stroke colour** | `#00FF9D` at 0.8 opacity |
| **Fill** | `#00FF9D` at 0.07 opacity |

### Laser beam path
The laser `id="jny-laser-beam"` uses the fixed path:
```
M500,0 → L500,220 → L460,300 → L540,300 → L500,380 → L500,600
```
This zigzags through the lens centre `(500, 300)`. If you redesign the lens position, update these coordinates accordingly. The lens is currently centred at SVG `(500, 300)`.

---

## Stage 7 — Padlock & Shield (Post-Quantum Cryptography)

**Status:** 🖌️ (both shapes benefit from precise vector art)

### Padlock

| Property | Value |
|----------|-------|
| **SVG viewBox** | `0 0 80 90` (centred at `0,0` — component translates group to `500,300`) |
| **Root id** | `jny-padlock` (keep the outer `<g id="jny-padlock" transform="translate(500,300)">`) |
| **Shackle path id** | `padlock-shackle` |
| **Body rect id** | `padlock-body` |
| **Keyhole group id** | `padlock-keyhole` |
| **Stroke colour** | `#c8b98a` (parchment) |
| **Fill** | `#1a1208` (espresso) for body |

### Shield

| Property | Value |
|----------|-------|
| **SVG viewBox** | `0 0 140 190` (centred at `0,0` — component translates group to `500,300`) |
| **Root id** | `jny-shield` (keep the outer `<g id="jny-shield" transform="translate(500,300)" filter="url(#glow-cyan)">`) |
| **Outline path id** | `shield-outline` — the full shield shape path |
| **Fill path id** | `shield-fill` — same shape, filled with `url(#shield-grad)` at 0.3 opacity |
| **Checkmark path id** | `shield-check` |
| **Primary stroke** | `#00FF9D` (cyan), strokeWidth `2.5` |
| **Gradient fill** | `url(#shield-grad)` — cyan→violet top-to-bottom (defined in SVG `<defs>`) |

### Shield outline path (current)
```
M0,-90 L70,-60 L70,10 Q70,70 0,95 Q-70,70 -70,10 L-70,-60 Z
```
Replace with a more ornate heraldic or tech-shield silhouette if desired — just keep the bounding box approximately `140×190` centred on `(0,0)`.

### Pulse rings
Three `<circle class="jny-shield-ring">` elements are centred at `(500, 300)` with `r=50`. GSAP expands them to `r=120` (scale 2.4) and fades them out in a repeating pulse. These are ⚙️ procedural.

---

## Downloadable Assets (External)

| Stage | Asset | Suggested Source | Format needed |
|-------|-------|-----------------|---------------|
| Stage 1 | Arduino UNO board | [arduino.cc](https://www.arduino.cc/en/uploads/Main/ArduinoUno_R3_Front.jpg) — trace in Inkscape | SVG, top-down, simplified strokes |
| Stage 4 | F1 car reference | [formula1.com](https://www.formula1.com) livery renders — **redraw as vector** | SVG side-profile silhouette |

> **Note:** Do not embed raster images in the component. All assets must be SVGs (either inline or imported). Raster images cannot be animated with GSAP SVG properties.

---

## Dropping In Your Custom SVG

1. Open `WorldlineSection.tsx`.
2. Locate the stage group by its `id` (e.g., `<g id="jny-arduino-group">`).
3. Replace the placeholder child elements inside that group with your custom SVG paths/groups.
4. **Preserve all outer group `id`s** — GSAP targets them.
5. **Preserve all `class` names** on animated sub-elements (`jny-trace`, `jny-comp`, `jny-pulse-dot`, `jny-wind`, etc.) — GSAP uses class selectors for staggered animations.
6. If your artwork has a different intrinsic size, scale it by wrapping in `<g transform="scale(sx, sy)">` or adjusting the `transform` on the group in the JSX.

---

## Global SVG Canvas Reference

The animation SVG uses `viewBox="0 0 1000 600"` with `preserveAspectRatio="xMidYMid meet"`.

| Zone | x range | y range | Used by |
|------|---------|---------|---------|
| Left margin | 0–200 | any | Neural net input layer, trace endpoints |
| Left text safe zone | 0–400 | any | Keep animations out of this when text is on left |
| Centre | 400–600 | 200–400 | Container, Lens, Shield, Padlock |
| Right side | 540–860 | 150–420 | Arduino board |
| Right margin | 800–1000 | any | F1 car entry, trace endpoints, neural net output |
| Right text safe zone | 600–1000 | any | Keep animations out when text is on right |

Text blocks alternate left/right — even-indexed (0,2,4,6) have text on the **left**, odd-indexed (1,3,5) have text on the **right**. Design your animations for the opposite side.
