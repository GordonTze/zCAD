# Super Z CAD — Project Progress Summary

**Generated:** 2026-06-21
**Total Changes:** 53 across 8 phases
**Current Default Model:** F1 Car Assembled (`part_f1_car_assembled`)

---

## Project Overview

A production-grade browser-based CAD platform inspired by Onshape, built with Next.js 16, TypeScript, Three.js (WebGL2), and Tailwind CSS. All 3D models are procedurally generated at runtime — no external assets. The app now includes a landing page with 24+ screenshots, an interactive 3D ViewCube, and has been through two optimization passes.

## Phase Summary

| Phase | Changes | Status |
|---|---|---|
| 1 — CAD Platform Foundation | 6 | Complete |
| 2 — Chinese 3-Story Building + Walk Mode | 9 | Complete |
| 3 — Architectural Models (LA Mansion + Pyramid) | 5 | Complete |
| 4 — Bay Area Apartment | 3 | Complete |
| 5 — Walk Mode Physics | 3 | Complete |
| 6 — Desktop Setup | 15 | Complete |
| 7 — Grocery Store | 5 | Complete |
| 8 — F1 Car + Optimization + ViewCube + Landing | 7 | Complete (latest) |
| **Total** | **53** | |

## Latest Changes (Phase 8)

1. **8.1** — Created F1 car exploded view (17 component groups, 100+ meshes)
2. **8.2** — Removed black baseplate + added ~150 new detail meshes (wheel spokes, brake vanes, pistons, tethers, suspension, engine internals, cockpit, HANS, mirrors)
3. **8.3** — Added assembled F1 car — parameterized explode/assemble toggle
4. **8.4** — Project-wide optimization pass: 5 bug fixes, 3 dead code removals, 8 files cleaned, ~260 duplicate materials/geometries eliminated
5. **8.5** — Replaced flat view buttons with interactive 3D ViewCube (Blender/AutoCAD style)
6. **8.6** — ViewCube refinements: drag-to-orbit, live camera sync, dark colors, face clicking, inset panels, performance (ref + direct DOM)
7. **8.7** — Landing page with 24+ screenshots, category filtering, per-image part launching, hero carousel, feature cards, tech stack, dark theme

## Available 3D Models (56+)

### Interactive Scenes (3)
- `part_desktop_setup` — Gaming battlestation (PC + server rack + 3 monitors + Embody chair)
- `part_grocery_store` — Supermarket (8 aisles, produce, bakery, deli, dairy, frozen, 6 checkouts)
- `part_f1_car` / `part_f1_car_assembled` — F1 car exploded / assembled

### Architectural (4)
- `part_bay_area_apartment` — Modern 2BR SF SoMa unit (7 floor textures)
- `part_chinese_building` — 3-story pagoda with full interior + walk mode
- `part_la_mansion` — LA Hills luxury home (3 levels, infinity pool)
- `part_pyramid` — Great Pyramid of Giza (40 layers, interior chambers, Sphinx)

### Mechanical (48+)
- Engine assembly (10 parts), power transmission (10), CNC components (14), aerospace (5), miscellaneous (9+)

## Walk Mode Controls

| Key | Action |
|---|---|
| WASD / Arrows | Move |
| Mouse drag | Look |
| Space | Jump (parabolic arc, ~2.7m peak) |
| Shift | Toggle noclip (fly through walls) |
| Q / E | Fly up / down (noclip only) |
| ESC | Exit walk mode |

## ViewCube
- 6 dark color-coded clickable faces
- Drag to orbit camera in real-time
- Click face to snap to standard view
- Live sync with camera orientation (direct DOM, no React re-renders)

## Landing Page
- Hero carousel (4 images, auto-rotate)
- 24-screenshot gallery with 10 category filters
- Click any screenshot to launch studio with that model pre-loaded
- 9 feature cards, 4 model showcase images, tech stack section
- Dark theme (#0a0a0f) with orange accents

## Tech Stack
- Next.js 16.1 (Turbopack), TypeScript 5, Three.js (WebGL2)
- Zustand (state), shadcn/ui + Radix (components), Tailwind CSS 4
- Bun 1.3 / Node 24 runtime

## Files
- `CHANGELOG.md` — Full detailed changelog (2476 lines, all 53 changes)
- `README.md` — Project README (updated)
- `changelog/` — Per-phase changelog files (8 files)
- `worklog.md` — Multi-agent work log
