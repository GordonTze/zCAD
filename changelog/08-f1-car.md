# Phase 8 — F1 Car + Optimization + ViewCube + Landing Page

This phase covers the F1 car (exploded + assembled), two project-wide optimization passes, an interactive 3D ViewCube, and a landing page with 24+ screenshots. 7 changes.

---

## Change 8.1 — F1 Car Exploded View Creation

**File created:** `src/lib/cad/f1-car.ts` (~470 lines)

**Function:** `createF1CarGeometry()`

### Overview
A modern F1 car with 17 major component groups, all separated vertically along the Y axis in an exploded view so every part is visible. Scale: 10 units = 1 meter.

### Exploded View Layout (bottom to top)

| Y Position | Component | Parts |
|---|---|---|
| 0 | **Floor / Underbody** | Floor panel + wooden plank + 5 diffuser vanes |
| 12 | **Front Wing** | Mainplane + 2 flaps + 2 endplates + 2 pillars |
| 22 | **Front Wheels** (2x) | Slick tires (torus) + aluminum rims + brake discs + red calipers |
| 32 | **Front Suspension** | Pushrod + 2 wishbones + steering arm |
| 42 | **Nose Cone** | Tapered nose + S-duct inlet |
| 52 | **Monocoque** | Carbon fiber chassis tub + cockpit opening + front bulkhead |
| 52 | **Cockpit Interior** | Halo (titanium arc + central strut) + steering wheel (with green LCD) + seat + 2 headrest pads |
| 62 | **Side Pods** (2x) | Pod bodies + radiator intakes + exhaust vents |
| 62 | **Bargeboards** (2x) | Angled aero vanes |
| 72 | **Engine Cover** | Cover body + airbox + shark fin |
| 82 | **Power Unit** | V6 engine block + 6 cylinders (V-bank) + turbo (gold) + MGU-K (blue) + exhaust manifold |
| 88 | **Exhaust** | Pipe + tip |
| 92 | **Rear Suspension** | Lower/upper arms (2x) + driveshafts (2x) |
| 92 | **Rear Wheels** (2x) | Slick tires + rims + brake discs + calipers (larger than front) |
| 102 | **Rear Wing** | Mainplane + beam wing + DRS flap (green) + 2 endplates + 2 pillars |
| 112 | **T-Wing** | Small wing + 2 endplates |

### New Procedural Textures (2)
1. `carbonFiberTexture()` — 2×2 twill weave carbon fiber pattern (dark gray with diagonal cells)
2. `tireTexture()` — tire sidewall pattern (dark with faint grain + lighter lettering band)

### Materials
- **Carbon fiber** (main body components) — twill weave texture, metalness 0.5, roughness 0.4
- **Carbon fiber flat** (floor, halo) — solid dark gray, metalness 0.4, roughness 0.5
- **Tires** — procedural sidewall texture, metalness 0.1, roughness 0.9 (matte rubber)
- **Rims** — aluminum, metalness 0.9, roughness 0.15 (polished)
- **Brake discs** — bronze, metalness 0.6, roughness 0.4
- **Suspension** — dark steel, metalness 0.8, roughness 0.3
- **Accent red** (calipers) — metalness 0.6, roughness 0.3
- **Accent green** (DRS flap, steering LCD) — emissive for visibility
- **Accent blue** (MGU-K) — metalness 0.6, roughness 0.3
- **Gold** (turbo) — metalness 0.9, roughness 0.2

### Lighting
- **Directional sun** — 1.5 intensity, 2048×2048 shadow map, covers the full 120-unit exploded height
- **Hemisphere light** — cool sky / warm ground, 0.5
- **Ambient** — 0.3
- **Rim light** — warm red backlight from behind, 0.4

### Showroom Floor
- Dark metallic floor (CircleGeometry, radius 80) at Y=-2 for shadow casting

### Blue Label Markers
- 13 small blue emissive spheres along the side (X=22) at each component level, marking the exploded structure

### Registration
- Added `createF1CarGeometry` import + `case 'part_f1_car'` in `models.ts`
- Added 15-feature seed entry in `seed.ts`
- Set `activePartId` to `'part_f1_car'` in `useCADStore.ts` (new default)
- Added walk mode spawn: (30, 17, 20) facing -X (toward the car)

**Verification:** `npx tsc --noEmit` shows zero new errors; `npx next build` succeeds.

---

## Change 8.2 — Remove Black Baseplate + Add Extensive Detail to All Components

### Issue 1: Black Baseplate

**Problem:** A dark showroom floor (CircleGeometry at Y=-2 with color 0x2a2a30) appeared as a random black disc under the car. Also, 13 blue emissive label spheres were unnecessary visual clutter.

**Fix:** Removed both the showroom floor and the blue label markers entirely.

### Issue 2: Missing Details on All Components

**Problem:** Every component was a basic shape (simple boxes and cylinders) with no realistic F1 detail. The car looked like a rough prototype, not a detailed model.

**Fix:** Major rewrite of `f1-car.ts` — added ~150 new meshes across all 17 component groups:

**Front Wing:**
- Added 4th wing element (cascade flap)
- Endplate winglets (top winglets on each endplate)
- Endplate strakes (vertical fins under endplates)
- 5 under-wing strakes (vertical vanes under the mainplane)
- Wing pillars changed to cylinders (was boxes)

**Front Wheels (each):**
- Tire inner fill (was just a torus with a hole)
- 8 rim spokes (was a plain cylinder)
- Red wheel nut (center)
- 12 brake disc cooling vanes (radial fins on the brake disc)
- 3 caliper pistons (visible dots on the caliper)
- Brake duct (carbon fiber scoop)
- Wheel tether (red safety cable)

**Front Suspension:**
- Pushrod end fittings (titanium spheres at both ends)
- 4 wishbone tubes (upper + lower, left + right — was just 2)
- Wishbone pickup points (titanium rose joints)
- Steering rack (box)
- 2 dampers (shock absorbers with metallic finish)

**Nose Cone:**
- Separate nose tip (crash structure cone — was just one cylinder)
- S-duct outlet (separate from inlet)
- 2 nose mounting pylons (connect to monocoque)
- Front number decal ("7" in white on dark background)

**Monocoque:**
- 2 side impact spars (crash structures on both sides)
- 2 cockpit side padding panels (interior)
- Front roll hoop (titanium half-torus behind driver)
- 2 roll hoop supports (titanium struts)
- 2 mirrors with stalks + reflective glass (was completely missing)

**Side Pods:**
- 4 radiator exhaust gills (was 1 vent)
- 3 turning vanes per pod (underside aero — was missing)
- Pod floor edge downwash ramps (was missing)
- Brake duct scoops (was missing)

**Bargeboards:**
- Secondary bargeboard per side (was 1 per side, now 2)
- 3-element turning vane cluster per side (was missing entirely)

**Engine Cover:**
- Airbox intake opening (dark circle on front face)
- 6 engine cover louvers (3 per side — was missing)

**Power Unit:**
- Cylinder head covers (red — team livery on each cylinder)
- 6 spark plugs (silver, one per cylinder)
- Turbo turbine housing (hot side — bronze, separate from compressor)
- Intercooler (blue box between turbo and intake)
- MGU-H (heat recovery — separate from MGU-K)
- ERS battery pack (green box — energy store)
- ECU (control electronics box)
- 4 exhaust manifold pipes (4-2-1 merge — was 1 pipe)
- Fuel line (red braided hose)

**Exhaust:**
- Exhaust tip with rolled edge (torus)
- Heat shield (was missing)

**Rear Suspension:**
- 4 wishbone tubes per side (upper + lower × 2 arms — was 2 per side)
- 2 CV joints per driveshaft (inner + outer titanium spheres)
- Pullrod (separate from driveshaft — was missing)
- 2 rear dampers

**Rear Wheels:**
- Same detail additions as front wheels (tire inner, 8 spokes, nut, 16 brake vanes, 3 caliper pistons, brake duct, tether)
- Larger tires (radius 3.8 vs 3.5, tube 1.8 vs 1.5)

**Rear Wing:**
- Beam wing (separate lower element — was combined)
- DRS actuator (metallic cylinder connecting flap to mainplane)
- 3 endplate louvers per endplate (horizontal slots)
- Endplate top winglets
- 8 slot gap separators (small vertical tabs on mainplane)
- Rear wing pillars changed to cylinders

**T-Wing:**
- Secondary T-wing element (bi-plane — was single element)
- 2 support struts connecting T-wing to rear wing

**Halo + Cockpit:**
- 2 halo base mounts (titanium boxes — was just a flat bar)
- 2 halo side rails (titanium tubes connecting arc to cockpit rim)
- Cockpit padding rim (torus around cockpit opening)
- Steering wheel completely rebuilt: rectangular F1 shape with LCD display, 4 colored buttons (red/green/blue/yellow), 2 grip handles, 2 paddle shifters, quick-release hub
- 3 headrest pads (left + center + right — was 2 side pads only)
- HANS device (head and neck support — half-torus behind driver)

**New material:** `titaniumMat` (0x9a9aa2, metalness 0.7, roughness 0.35) for halo, roll hoop, suspension joints, CV joints

**New texture:** `decalTexture(text, bg, fg)` for the front number decal

**Verification:** `npx tsc --noEmit` shows zero errors; `npx next build` succeeds.

---

## Change 8.3 — Add Assembled F1 Car (Toggle Between Exploded and Assembled)

**Problem:** The F1 car was only available in exploded view. The user wanted to see the car assembled — all components in their correct positions as they would be on a real assembled F1 car.

**Fix:** Parameterized the `createF1CarGeometry()` function with an `exploded: boolean` parameter (default `true`). When `false`, all components are positioned at their correct assembled positions on the car.

**How it works:**
- Defined a `Y` object at the top of the function with two sets of Y positions — exploded (spread along Y axis 0-112 for visibility) and assembled (all components at their natural positions on the car, Y 0-5.5)
- All component positions throughout the code reference `Y.*` variables instead of hardcoded numbers
- The `exploded` parameter selects which set of Y positions to use

**Assembled Y positions (realistic F1 car layout):**

| Component | Exploded Y | Assembled Y | Notes |
|---|---|---|---|
| Floor | 0 | 0 | At ground level |
| Front wing | 12 | 0.5 | Low, just above floor |
| Front wheels | 22 | 3.5 | Wheel center at tire radius |
| Front suspension | 32 | 2.5 | Between wheels and monocoque |
| Nose cone | 42 | 1.5 | Low, connecting wing to monocoque |
| Monocoque | 52 | 2.5 | Center of chassis tub |
| Cockpit | 53 | 3 | Just above monocoque |
| Side pods | 62 | 2 | Lower than monocoque |
| Bargeboards | 62 | 2 | Lower, in front of side pods |
| Engine cover | 72 | 3.5 | Above monocoque |
| Power unit | 82 | 2.5 | Inside the car |
| Exhaust | 88 | 3.5 | Above engine, at rear |
| Rear suspension | 92 | 3.5 | Between rear wheels |
| Rear wheels | 92 | 3.8 | Slightly larger tire radius |
| Rear wing | 102 | 5 | High at the back |
| T-wing | 112 | 5.5 | Above rear wing |
| Halo | 55 | 3.5 | At cockpit level |
| Steering wheel | 54 | 2.5 | In the cockpit |
| Seat | 52 | 2 | In the monocoque |
| Headrest | 56 | 3.5 | Above seat |
| Roll hoop | 56 | 4 | Behind driver |
| Mirrors | 55 | 3.5 | On cockpit sides |

**Also adjusted:**
- Sun light position and shadow camera bounds adapt to the mode (lower sun + smaller shadow camera for assembled, since the car is only ~6 units tall instead of 112)
- All relative offsets within each component (e.g., flaps relative to wing mainplane, cylinders relative to engine block) automatically work because the base Y values change

**New part registered:**
- `part_f1_car_assembled` — calls `createF1CarGeometry(false)` — all 17 component groups in correct assembled positions
- The existing `part_f1_car` (exploded) is unchanged
- Both are available in the part switcher — switch between them to compare

**Walk mode spawn for assembled:**
- Spawn at (15, 17, 0) facing -X (toward the car's side profile)

**Result:** The user can now switch between two F1 car parts in the part switcher:
1. **"F1 Car (Exploded View)"** — all components separated vertically for inspection
2. **"F1 Car (Assembled)"** — all components in their correct positions, forming a complete F1 car silhouette (~5.5m long, ~2m wide, ~1m tall)

The assembled version shows the car as it would look on the grid — floor at ground level, wings at front and rear, wheels at all four corners, monocoque in the center, halo above the cockpit, and rear wing high at the back.

**Verification:** `npx tsc --noEmit` shows zero new errors; `npx next build` succeeds.

---

## Change 8.4 — Project-Wide Optimization Pass

A systematic survey and optimization of all source files in the project. Fixed bugs, removed dead code, cleaned up unused imports, and hoisted duplicate materials out of loops for performance.

### Bug Fixes (5)

1. **`Viewport3D.tsx` line 224** — Fixed `Vector2` type error: `{ x, y }` → `new THREE.Vector2(x, y)` in `raycaster.setFromCamera()` call. This was a pre-existing TypeScript error that could cause fragile runtime behavior.

2. **`models.ts` lines 4280–4283** — Fixed 4 missing CNC function references that would crash at runtime if the corresponding part IDs were dispatched:
   - `createCNCBedGeometry` → `createCNCMachineBedGeometry`
   - `createCNCColumnGeometry` → `createCNCColumnGeometry2`
   - `createSpindleGeometry` → `createSpindleCarriageGeometry`
   - `createRotaryTableGeometry` → `createCAxisTableGeometry`

3. **`models.ts` line 216** — Fixed `ribPositions` type annotation: `[number, number][]` → `[number, number, number][]` (the array contains 3-element tuples but was typed as 2-element). Fixed 5 TypeScript errors.

4. **`models.ts` lines 41–64** — Removed 24 lines of duplicate material factory definitions (identical copies of functions already in `materials-dsl.ts`). Replaced with `import { ... } from './materials-dsl'; export { ... };` — single source of truth.

5. **`building-interior.ts` lines 1873–1887** — Fixed heterogeneous array type error in door casing `forEach`. The array `[[groundInt, -50, -20], ...]` mixed `THREE.Group` and `number` types, causing 4 TypeScript errors. Added `as [THREE.Group, number, number][]` cast to the entire array and removed redundant per-element `as THREE.Group` casts inside the loop body.

### Dead Code Removal (3 items)

1. **`f1-car.ts` line 116** — Removed dead `rubberMat` variable (`new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.1, roughness: 0.8 })`) that was declared but never used anywhere in the file.

2. **`chinese-building.ts` lines 246–249** — Removed dead empty `forEach` body:
   ```ts
   [-35, -55].forEach((x) => {
     // skip - we'll just do one window per side section
   });
   ```
   This iterated over an array but did nothing in the callback.

3. **`Viewport3D.tsx` line 7** — Removed 3 unused type imports: `Part`, `AssemblyInstance`, `Feature` from `@/lib/cad/types` (verified zero references in the file).

### Unused Import Cleanup (8 files, ~50 import names removed)

| File | Removed Imports |
|---|---|
| `grocery-store.ts` | `metal, darkSteel, aluminum, plastic, rubber, brass` (6 material helpers) + `makeCarpetTexture` (1 texture) |
| `f1-car.ts` | `metal, darkSteel, aluminum, plastic, rubber, brass` (6 material helpers) |
| `desktop-setup.ts` | `metal, darkSteel, aluminum, plastic, rubber, brass` (6 material helpers) |
| `bay-area-apartment.ts` | `metal, stainless, aluminum, plastic, rubber` (5 material helpers) + `makeTileTexture, makePlasterTexture, makeConcreteTexture` (3 textures) |
| `pyramid.ts` | `metal, steel, stainless, aluminum, darkSteel, brass, rubber, plastic` (all 8 material helpers) |
| `chinese-building.ts` | `metal, aluminum, darkSteel, brass, rubber` (5 material helpers; kept `steel, stainless, plastic` which are used) |
| `la-mansion.ts` | `metal, steel, stainless, aluminum, darkSteel, brass, rubber, plastic` (8 material helpers) + `makeTileTexture, makeBrickTexture, makeMarbleTexture, makePlasterTexture, makeWallpaperTexture, makeGlassTexture` (7 textures; kept `makeWoodTexture, makeFabricTexture, makeGraniteTexture, makeConcreteTexture, makeStoneTexture`) |
| `building-interior.ts` | `metal, steel, aluminum, darkSteel, rubber, plastic` (6 material helpers; kept `brass, stainless`) + `makeStoneTexture, makeConcreteTexture, makeGlassTexture` (3 textures) |

### Performance Optimizations (4 hoisting fixes)

1. **`building-interior.ts`** — Hoisted `stainless()` calls (12→1) and `brass()` calls (2→1):
   - Added `const stainlessMat = stainless();` and `const brassMat = brass();` at function top
   - Replaced all 12 inline `stainless()` calls with `stainlessMat` and 2 inline `brass()` calls with `brassMat`
   - **Impact:** Eliminated 13 duplicate `MeshStandardMaterial` allocations

2. **`la-mansion.ts`** — Hoisted city lights loop materials (100→4) + shared geometry:
   - Pre-created 4 color materials in a `cityLightMats` array (one per color) before the 100-iteration loop
   - Pre-created a shared `cityLightGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5)` before the loop
   - Loop now picks from `cityLightMats[cIdx]` and reuses `cityLightGeo`
   - **Impact:** Eliminated 96 duplicate materials + 100 duplicate geometry allocations

3. **`bay-area-apartment.ts`** — Hoisted skyline window material (14→1) + shared geometry:
   - Pre-created `skylineWinMat` and `skylineWinGeo` before the 14-iteration skyline building loop
   - Replaced inline `new THREE.MeshStandardMaterial(...)` and `new THREE.PlaneGeometry(2, 3)` inside the loop with the hoisted versions
   - **Impact:** Eliminated 13 duplicate materials + 14 duplicate geometry allocations

4. **`desktop-setup.ts`** — Hoisted skyline window material (12→1) + shared geometry:
   - Same pattern as above — pre-created `desktopSkylineWinMat` and `desktopSkylineWinGeo` before the 12-iteration skyline loop
   - **Impact:** Eliminated 11 duplicate materials + 12 duplicate geometry allocations

### Total Impact

| Category | Count | Details |
|---|---|---|
| Bug fixes | 5 | 3 TypeScript errors fixed, 2 runtime crash risks eliminated |
| Dead code removed | 3 | Dead variable, dead forEach, unused type imports |
| Files with unused imports cleaned | 8 | ~50 unused import names removed |
| Duplicate materials eliminated | ~134 | 13 (building-interior) + 96 (la-mansion) + 13 (bay-area) + 11 (desktop) |
| Duplicate geometries eliminated | ~126 | 100 (la-mansion) + 14 (bay-area) + 12 (desktop) |
| Lines of duplicate code removed | ~24 | models.ts material factory re-declarations |

**Verification:** `npx tsc --noEmit` shows zero errors (down from 10+ pre-existing errors); `npx next build` succeeds.

---

## Change 8.5 — Replace View Buttons with Interactive 3D ViewCube (Blender/AutoCAD Style)

**Problem:** The bottom-left corner had 7 flat text buttons (ISO, FRO, TOP, RGT, LFT, BCK, BTM) for view switching. The user wanted a 3D cube widget like Blender or AutoCAD's ViewCube that shows the current viewing angle.

**Fix:** Replaced the flat buttons with an interactive 3D CSS ViewCube component:

**New `ViewCube` component:**
- **3D CSS cube** rendered with `transform-style: preserve-3d` and `perspective: 200px`
- **6 labeled faces** — TOP (red), BTM (teal), FRONT (blue), BACK (green), RIGHT (yellow), LEFT (purple)
- **Each face is clickable** — clicking a face rotates the camera to that standard view
- **Active face highlight** — the currently active view's face is highlighted with its accent color at 50% opacity
- **Hover highlight** — hovering a face shows the full accent color
- **Smooth 3D rotation animation** — the cube rotates with a 0.4s cubic-bezier transition to show the new orientation when you switch views
- **ISO home button** below the cube for quick return to isometric view

**How it communicates with the viewport:**
- The `ViewCube` dispatches a `window.CustomEvent('viewcube-click')` with the view name and camera position
- The main `Viewport3D` `useEffect` listens for this event and moves the camera to the requested position (same positions as the old buttons used)
- The listener is properly cleaned up in the `useEffect` return function

**View presets** (same camera positions as before):
- ISO: (180, 130, 180) — isometric
- TOP: (0, 250, 0.1) — top-down
- BTM: (0, -250, 0.1) — bottom-up
- FRO: (0, 0, 250) — front
- BCK: (0, 0, -250) — back
- RGT: (250, 0, 0) — right
- LFT: (-250, 0, 0) — left

**Removed:** The old 7-button row (`['ISO', 'FRO', 'TOP', 'RGT', 'LFT', 'BCK', 'BTM'].map(...)`)

**Result:** The bottom-left corner now shows a 3D cube that visually represents the current viewing angle. Clicking any face smoothly rotates the cube to face that direction and moves the camera to the corresponding standard view — just like Blender's navigation gizmo or AutoCAD's ViewCube.

**Verification:** `npx tsc --noEmit` shows zero errors; `npx next build` succeeds.

---

## Change 8.6 — ViewCube Refinements (Drag-to-Orbit, Live Sync, Dark Colors, Face Clicking)

**Changes:**
- Added drag-to-orbit: grab the cube and drag to rotate the camera. Dragging right moves camera right, up tilts up. Pointer capture ensures drag continues outside the cube.
- Fixed face click snapping: each face has its own `onClick` handler that snaps to that face's view (was always going to ISO).
- Fixed live camera sync: animation loop broadcasts camera azimuth/polar every 3rd frame via `viewcube-orient` custom event. ViewCube listener converts to CSS rotation and applies directly to `cubeRef.current.style.transform` (bypasses React, zero re-renders).
- Fixed drag/click disambiguation: 4-pixel threshold — under 4px = click (snap to ISO), over 4px = drag (orbit).
- Darker color scheme: all 6 faces changed from bright/light colors to dark muted tones (dark red, dark teal, dark blue, dark green, dark gold, dark purple) at 85% opacity.
- Inset panels: each face has a 72% × 72% inner div with white overlay and inset shadow for a beveled look.
- ISO button spaced 12px below the cube to avoid interference.
- Performance: `useEffect` deps changed from `[isAnimating, isDragging]` to `[]` with refs for state checks — listener no longer re-subscribes on every state change.

## Change 8.7 — Landing Page with 24+ Screenshots

**Created:** `src/components/landing/LandingPage.tsx` (~310 lines)

**Features:**
- **Hero section** — Full-screen rotating carousel of 4 hero images (Mega CNC, Great Pyramid, LA Mansion, Chinese Building) with auto-rotation every 4 seconds, gradient overlay, animated stats (56+ models, 51+ changes, 8 phases, 100% procedural)
- **Feature Gallery** — 24 screenshots in a responsive 3-column grid with 10 category filters (All, Mechanical Parts, Aerospace, Manufacturing, Architecture, Interactive, UI Features, Engine Parts, Power Transmission, Thermal). Each image has a `partId` — clicking launches the CAD studio with that specific model pre-loaded via `useCADStore.setState({ activePartId })`
- **Key Features** — 9 feature cards with icons
- **Model Showcase** — 4 large feature images (also clickable to launch)
- **Tech Stack** — 8 technology cards
- **Dark theme** (#0a0a0f) with orange accent colors, sticky nav bar, lazy-loaded images

**Updated:** `src/app/page.tsx` — toggles between landing page and CAD app. Uses `mounted` guard to prevent hydration errors. `onLaunch(partId?)` sets the active part before showing the app.

**Fixed:**
- Removed `overflow-hidden` from `<body>` in `layout.tsx` (was blocking scroll on landing page; CAD app has its own `overflow-hidden`)
- Fixed hydration error: added `mounted` state guard — minimal loading screen during SSR, actual content only after client mount
- Fixed double text glitch in gallery: removed duplicate hover-only caption overlay, now single caption bar that brightens on hover
- Fixed gallery click: added `onClick={onLaunch}` with `partId` to each image (was missing entirely)
- Fixed `THREE.PCFSoftShadowMap` deprecation warning → changed to `THREE.PCFShadowMap`

**Verification:** `npx tsc --noEmit` shows zero errors; `npx next build` succeeds; Agent Browser confirms zero console errors, scroll works, gallery filtering works, clicking images launches the correct part.

---

## End of Phase 8

**State at end of Phase 8:**
- Detailed F1 car in exploded view with 17 component groups (100+ individual meshes)
- All major F1 components: front/rear wings, monocoque, side pods, bargeboards, engine cover, V6 turbo hybrid power unit, suspension (front + rear), wheels (4x with brakes), halo, cockpit interior (steering wheel + LCD + seat + headrest), nose cone, T-wing, exhaust
- 2 new procedural textures (carbon fiber twill, tire sidewall)
- Showroom floor + 4-light system with shadows
- Set as default active part
- Production build passes

**Files created/modified:**
- `src/lib/cad/f1-car.ts` (~470 lines) — new
- `src/lib/cad/models.ts` (added `part_f1_car` case)
- `src/lib/cad/seed.ts` (added F1 car part definition with 15 features)
- `src/store/useCADStore.ts` (set `activePartId` to `'part_f1_car'`)
- `src/components/cad/Viewport3D.tsx` (added walk mode spawn)
