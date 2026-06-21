# Super Z CAD — Browser-Based 3D Modeling Platform

A production-grade, browser-based CAD platform inspired by [Onshape](https://www.onshape.com/), built with Next.js 16, TypeScript, Three.js (WebGL2), and Tailwind CSS. The application ships with **56+ procedurally generated 3D models** — from mechanical engineering parts (gears, engines, CNC machines) to full architectural scenes (Chinese pagoda, LA mansion, Great Pyramid, Bay Area apartment, grocery store), an F1 car in both exploded and assembled views, and a detailed desktop battlestation — all rendered with realistic procedural textures, dynamic lighting, and shadow casting.

The app now includes a **landing page** with 24+ screenshots, a **first-person walk mode** with gravity/collision/jump/noclip, an **interactive 3D ViewCube** (Blender/AutoCAD style) with drag-to-orbit, and has been through two optimization passes eliminating 250+ duplicate materials and fixing all TypeScript errors.

---

## Table of Contents

1. [Overview](#overview)
2. [What's Included](#whats-included)
3. [Tech Stack](#tech-stack)
4. [Requirements](#requirements)
5. [Installation](#installation)
6. [Running the App](#running-the-app)
7. [Usage Guide](#usage-guide)
8. [Project Structure](#project-structure)
9. [Key Files](#key-files)
10. [Walk Mode Controls](#walk-mode-controls)
11. [Available 3D Models](#available-3d-models)
12. [Landing Page](#landing-page)
13. [ViewCube](#viewcube)
14. [Development Notes](#development-notes)
15. [Changelog](#changelog)

---

## Overview

Super Z CAD is a single-page web application that recreates the look and feel of a professional CAD workstation (feature tree, part list, viewport with shaded/wireframe modes, toolbar, command palette) entirely in the browser. Instead of loading external `.step` or `.stl` files, every model is **procedurally generated at runtime** using Three.js geometry primitives and custom mesh-building functions — meaning the entire 3D scene is built from code, with no asset pipeline.

The platform covers four broad categories of content:

- **Mechanical engineering parts** — 48+ parametric parts including gears, shafts, bearings, springs, impellers, turbine blades, rocket engine injectors, Formula 1 uprights, injection molds, a complete 4-cylinder engine, a full gearbox, and a super-detailed 5-axis CNC machine (built from 14 sub-components).
- **Architectural scenes** — A Chinese 3-story pagoda with full interior, an LA Hills luxury mansion, the Great Pyramid of Giza with interior chambers and the Sphinx, and a modern Bay Area 2BR apartment with 7 distinct floor finishes.
- **Interactive scenes** — A detailed grocery store (60m × 40m supermarket with 8 aisles, produce, bakery, deli, dairy, frozen, 6 checkouts), a desktop battlestation (gaming PC + server rack + 3 monitors + Embody chair), and an F1 car in both exploded and assembled views (17 component groups, 250+ meshes).
- **First-person exploration** — Walk mode drops you into any architectural scene as a 1.7m-tall person with physics-based movement (gravity, collision, stair climbing, jumping) and an optional noclip flight mode.

---

## What's Included

### Mechanical Parts (48+)
- **Power transmission**: gearbox housing, drive shaft, spur gear, ball bearing, cover plate, bolt, coupling, pulley, compression spring, impeller
- **Engine assembly**: engine block, crankshaft, connecting rod, piston, flywheel, camshaft, oil pan, valve cover, cylinder head, propeller
- **Aerospace / high-performance**: turbine, turbine blade, rocket engine injector, F1 upright, injection mold core
- **Robotics**: robotic arm, bracket, heatsink
- **Complete assemblies**: full gearbox, 5-axis CNC machine (14 components), Mega CNC (single super-detailed mesh)

### Architectural Models (4)
1. **Chinese 3-Story Building** — Traditional pagoda with full interior, furniture, 3D occupants, physical stairs, 14+ procedural textures
2. **LA Hills Mansion** — 3-level luxury home with infinity pool, glass walls, cantilevered sections
3. **Great Pyramid of Giza** — 40-layer pyramid with gold capstone, interior chambers, Sphinx, satellite pyramids, 5-light dynamic system
4. **Bay Area Apartment** — Modern 2BR SF SoMa unit with 7 distinct floor finishes, full kitchen, bathroom, balcony, SF skyline

### Interactive Scenes (3)
1. **Desktop Setup** — Gaming battlestation with PC (visible internals + RGB), 19" server rack (9 units), 3 monitors, Herman Miller Embody chair, 4 wall speakers, full home office
2. **Grocery Store** — 60m × 40m supermarket with 8 aisles (1600+ products in 6 packaging types), produce section, bakery, deli, dairy wall, frozen section, 6 checkout lanes
3. **F1 Car** — 17 component groups (250+ meshes) with exploded and assembled views. V6 turbo hybrid power unit, suspension, halo, DRS, T-wing, steering wheel with LCD/buttons/paddles

### Landing Page
A full-screen landing page with:
- Rotating hero carousel (4 images)
- 24-screenshot gallery with category filtering (10 categories)
- Click any screenshot to launch the studio with that specific model loaded
- 9 feature cards, 4 model showcase images, tech stack section
- Dark theme with orange accents

### Walk Mode
First-person navigation with gravity, wall collision, stair climbing, jumping, and noclip:
- **WASD / Arrows** — Move
- **Mouse drag** — Look around
- **Space** — Jump (parabolic arc, ~2.7m peak)
- **Shift** — Toggle noclip (fly through walls)
- **Q / E** — Fly up / down (noclip only)
- **ESC** — Exit walk mode

### ViewCube (Blender/AutoCAD Style)
Interactive 3D navigation cube in the bottom-left corner:
- 6 color-coded clickable faces (dark red/teal/blue/green/gold/purple)
- Drag the cube to orbit the camera in real-time
- Click a face to snap to that standard view
- Cube rotates in sync with camera orientation (live tracking via direct DOM manipulation)
- Inset panels for depth, ISO home button below

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.1 (App Router, Turbopack) |
| Language | TypeScript 5 |
| 3D Rendering | Three.js (WebGL2) |
| State Management | Zustand |
| UI Components | shadcn/ui + Radix UI primitives |
| Styling | Tailwind CSS 4 |
| Fonts | Noto Sans SC / Noto Serif SC (CJK), Inter (Latin) |
| Database (optional) | Prisma ORM + SQLite |
| Package Manager | Bun (recommended) or npm |
| Runtime | Node.js 24+ or Bun 1.3+ |

---

## Requirements

### Minimum
- **Node.js 24.0+** or **Bun 1.3+**
- **Modern browser** with WebGL2 support (Chrome 113+, Firefox 120+, Safari 17+, Edge 113+)
- **4 GB RAM** (8 GB recommended for large scenes)
- **GPU** with hardware-accelerated WebGL (discrete GPU recommended for shadow-heavy scenes)

### Development
- **OS**: Linux, macOS, or Windows (WSL2)
- **Disk**: ~500 MB for `node_modules` + project
- **Port 3000** available

---

## Installation

### Bun (recommended)
```bash
cd my-project
bun install
```

### npm
```bash
cd my-project
npm install
```

---

## Running the App

### Development
```bash
bun run dev
```
Open **http://localhost:3000** — the landing page loads first. Click "Launch Studio" or any gallery image to enter the CAD app.

### Production
```bash
bun run build
bun run start
```

### Database (optional)
```bash
bun run db:push
bun run db:generate
```

---

## Usage Guide

### 1. Landing Page
The app opens to a landing page with a hero carousel, 24-screenshot gallery (filterable by category), feature cards, and model showcase. Click any screenshot to launch the studio with that specific model pre-loaded.

### 2. Exploring the 3D viewport
Once in the studio, the viewport supports orbit/pan/zoom. The **ViewCube** in the bottom-left provides standard view snapping and drag-to-orbit.

### 3. Switching parts
Use the **part switcher** in the left panel to load any of the 56+ models. Each part loads instantly (procedural generation runs synchronously).

### 4. Walking through architectural models
Click the **🚶 Walk Mode** button. See [Walk Mode Controls](#walk-mode-controls) below.

### 5. Command palette
Press **Cmd/Ctrl+K** to open the command palette.

---

## Project Structure

```
my-project/
├── src/
│   ├── app/
│   │   ├── page.tsx                   # Landing page ↔ CAD app toggle
│   │   ├── layout.tsx                 # Root layout
│   │   └── globals.css                # Global styles
│   ├── components/
│   │   ├── cad/
│   │   │   ├── CADApp.tsx             # CAD application shell
│   │   │   ├── Viewport3D.tsx         # 3D viewport + walk mode + ViewCube (~1150 lines)
│   │   │   ├── LeftPanel.tsx          # Feature tree + part switcher
│   │   │   ├── RightPanel.tsx         # Properties
│   │   │   ├── BottomPanel.tsx        # Timeline
│   │   │   ├── Toolbar.tsx            # Modeling tools
│   │   │   ├── TopMenuBar.tsx         # Menus
│   │   │   ├── CommandPalette.tsx     # Cmd+K search
│   │   │   └── ...
│   │   ├── landing/
│   │   │   └── LandingPage.tsx        # Landing page with gallery (~310 lines)
│   │   └── ui/                        # shadcn/ui primitives
│   ├── lib/cad/
│   │   ├── models.ts                  # Part dispatcher (56+ cases)
│   │   ├── seed.ts                    # Part definitions
│   │   ├── types.ts                   # TypeScript types
│   │   ├── materials-dsl.ts           # Material helpers (single source of truth)
│   │   ├── f1-car.ts                  # F1 car (exploded + assembled)
│   │   ├── grocery-store.ts           # Grocery store
│   │   ├── desktop-setup.ts           # Desktop battlestation
│   │   ├── bay-area-apartment.ts      # SF apartment
│   │   ├── chinese-building.ts        # Chinese pagoda
│   │   ├── la-mansion.ts              # LA mansion
│   │   ├── pyramid.ts                 # Great Pyramid
│   │   ├── cnc-machine.ts             # 14 CNC components
│   │   ├── mega-cnc.ts                # Mega CNC
│   │   ├── building-textures.ts       # 14 shared textures
│   │   └── building-interior.ts       # Interior furniture
│   └── store/
│       └── useCADStore.ts             # Zustand store
├── public/
│   └── screenshots/                   # 71 screenshots for landing page
├── changelog/                         # Per-phase changelog (8 files)
├── download/                          # Downloadable CHANGELOG.md + PROJECT-PROGRESS.md
├── worklog.md                         # Multi-agent work log
├── package.json
└── README.md                          # This file
```

---

## Key Files

| File | Purpose |
|---|---|
| `src/app/page.tsx` | Landing page ↔ CAD app toggle with part pre-selection |
| `src/components/landing/LandingPage.tsx` | Full landing page with 24-image gallery, hero carousel, feature cards |
| `src/components/cad/Viewport3D.tsx` | 3D viewport, walk mode physics, ViewCube, GPU memory management |
| `src/lib/cad/models.ts` | Central dispatcher: 56+ part cases |
| `src/lib/cad/seed.ts` | Part definitions with feature trees |
| `src/lib/cad/materials-dsl.ts` | Single source of truth for material helpers |
| `src/store/useCADStore.ts` | Zustand store (activePartId, walkMode, viewMode, etc.) |

---

## Walk Mode Controls

| Key | Action | Mode |
|---|---|---|
| **W A S D** / Arrows | Move horizontally | Both |
| **Mouse drag** | Look around | Both |
| **Space** | Jump (parabolic arc, ~2.7m peak) | Normal only |
| **Shift** (toggle) | Toggle noclip flight | Both |
| **Q** | Fly up | Noclip only |
| **E** | Fly down | Noclip only |
| **ESC** | Exit walk mode | Both |

### Physics
- Scale: 10 units = 1 meter. Eye height = 17 units (1.7m)
- Gravity: 0.3 units/frame² downward
- Jump: initial velocity 4 units/frame, peak ~2.7m, airtime ~0.45s
- Walk speed: 1.5 units/frame (normal), 4 units/frame (noclip)
- Wall collision: raycast against large meshes only (>15 units)
- Adaptive spawn positions per part (no hardcoded entrances)

---

## Available 3D Models (56+)

### Interactive Scenes (3)
- `part_desktop_setup` — Gaming battlestation (PC + server rack + monitors + Embody chair)
- `part_grocery_store` — Supermarket (8 aisles, produce, bakery, deli, dairy, frozen, 6 checkouts)
- `part_f1_car` / `part_f1_car_assembled` — F1 car exploded view / assembled view

### Architectural (4)
- `part_bay_area_apartment` — Modern 2BR SF SoMa unit (7 floor textures)
- `part_chinese_building` — 3-story pagoda with full interior + walk mode
- `part_la_mansion` — LA Hills luxury home (3 levels, infinity pool)
- `part_pyramid` — Great Pyramid of Giza (40 layers, interior chambers, Sphinx)

### Mechanical — Complete Assemblies (2)
- `part_mega_cnc` — Mega CNC Machine (single super-detailed mesh)
- `part_gearbox_complete` — Complete Gearbox

### Mechanical — CNC Components (14)
`part_cnc2_bed`, `part_cnc2_saddle`, `part_cnc2_column`, `part_cnc2_carriage`, `part_cnc2_spindle_motor`, `part_cnc2_trunnion`, `part_cnc2_ctable`, `part_cnc2_magazine`, `part_cnc2_atc_arm`, `part_cnc2_coolant`, `part_cnc2_cabinet`, `part_cnc2_tool_holder`, `part_cnc2_conveyor`, `part_cnc2_workpiece`

### Mechanical — Engine (10)
`part_engine_block`, `part_crankshaft`, `part_conrod`, `part_piston`, `part_flywheel`, `part_camshaft`, `part_oilpan`, `part_valvecover`, `part_cylinder_head`, `part_propeller`

### Mechanical — Power Transmission (10)
`part_gearbox_housing`, `part_shaft`, `part_gear`, `part_bearing`, `part_cover`, `part_bolt`, `part_coupling`, `part_pulley`, `part_spring`, `part_impeller`

### Mechanical — Aerospace (5)
`part_turbine`, `part_turbine_blade`, `part_rocket_injector`, `part_f1_upright`, `part_injection_mold`

### Mechanical — Miscellaneous (3)
`part_robotic_arm`, `part_bracket`, `part_heatsink`

---

## Landing Page

The landing page (`src/components/landing/LandingPage.tsx`) features:

- **Hero section** — Full-screen rotating carousel of 4 hero images with auto-rotation every 4 seconds, gradient overlay, animated stats (56+ models, 51+ changes, 8 phases, 100% procedural)
- **Feature Gallery** — 24 screenshots in a responsive 3-column grid with 10 category filters. Each image has a `partId` — clicking launches the CAD studio with that specific model pre-loaded
- **Key Features** — 9 feature cards (50+ parts, 5 architectural models, walk mode, 30+ textures, ViewCube, dynamic lighting, F1 car, grocery store, optimizations)
- **Model Showcase** — 4 large feature images with descriptions (also clickable to launch)
- **Tech Stack** — 8 technology cards
- **Dark theme** (#0a0a0f background) with orange accent colors

---

## ViewCube

The ViewCube (`src/components/cad/Viewport3D.tsx`) is an interactive 3D navigation cube:

- **6 dark color-coded faces** — TOP (dark red), BOTTOM (teal), FRONT (blue), BACK (green), RIGHT (gold), LEFT (purple)
- **Drag to orbit** — grab the cube and drag to rotate the camera. Dragging right moves camera right, up tilts up
- **Click to snap** — click any face to snap to that standard view with a 0.4s smooth animation
- **Live camera sync** — the cube rotates in real-time to match the camera orientation (via direct DOM manipulation, no React re-renders)
- **Inset panels** — each face has a beveled inner panel for depth
- **Performance** — uses `useRef` + direct `style.transform` updates (bypasses React), throttled to every 3rd frame

---

## Development Notes

### Adding a new 3D model
1. Create `src/lib/cad/my-model.ts` exporting `createMyModelGeometry(): THREE.Group`
2. Register in `src/lib/cad/models.ts`: `case 'part_my_model': return createMyModelGeometry();`
3. Add seed entry in `src/lib/cad/seed.ts`
4. Add walk mode spawn in `Viewport3D.tsx` (if applicable)

### Optimization notes
- All material helpers live in `materials-dsl.ts` (single source of truth, re-exported from `models.ts`)
- Materials are hoisted out of loops wherever possible (250+ duplicates eliminated across 2 optimization passes)
- Old part meshes are fully disposed (geometry + material + textures) on rebuild to prevent GPU memory leaks
- Walk mode has its own render loop — the main loop skips `renderer.render()` when walk mode is active
- ViewCube uses direct DOM manipulation instead of React state for live camera tracking
- Skyline window materials and geometries are shared across all buildings

### Z-fighting prevention
Coplanar surfaces are offset by at least 0.05 units. See `bay-area-apartment.ts` for the pattern (floor at y=0.05, slab top at y=-0.5, ceiling at y=29.9, walls at y=30).

---

## Changelog

See the [`changelog/`](./changelog/) folder for a detailed, per-phase history (8 phases, 51+ changes). The index is in [`changelog/README.md`](./changelog/README.md).

| Phase | Changes | Description |
|---|---|---|
| 1 | 6 | CAD platform foundation + 48 mechanical parts |
| 2 | 9 | Chinese building + walk mode + controls fixes |
| 3 | 5 | LA mansion + Great Pyramid |
| 4 | 3 | Bay Area apartment + overlap/Z-fighting fixes |
| 5 | 3 | Walk mode jump + noclip + control refinements |
| 6 | 15 | Desktop setup (colors, monitors, speakers, keyboard, room expansion) |
| 7 | 5 | Grocery store (aisles, produce, fruit textures, gondola geometry, facings) |
| 8 | 5+ | F1 car (exploded + assembled) + optimization passes + ViewCube + landing page |

Downloadable artifacts:
- [`download/CHANGELOG.md`](./download/CHANGELOG.md) — consolidated changelog (~2500 lines)
- [`download/PROJECT-PROGRESS.md`](./download/PROJECT-PROGRESS.md) — summary with phase table

---

*Built with Next.js 16, Three.js, TypeScript, and Tailwind CSS. Procedurally generated — no external 3D assets.*
