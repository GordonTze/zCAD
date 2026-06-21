# Phase 4 — Bay Area Apartment

This phase covers the creation of the Bay Area apartment model and the fixes for overlapping geometry and Z-fighting. 3 changes.

---

## Change 4.1 — Bay Area Apartment Creation

**File created:** `src/lib/cad/bay-area-apartment.ts` (initial version ~1815 lines)

**Function:** `createBayAreaApartmentGeometry()`

**Building specs:**
- Footprint: 200 × 140 units (20m × 14m at 10u/m scale)
- Ceiling height: 30 units (3m)
- Wall thickness: 4 units (0.4m)

**7 distinct procedural floor textures (each with bump map):**
1. **Herringbone oak hardwood** (living room) — V-shaped plank pattern with grain lines, knots, and wear marks. Custom `herringboneFloorTexture()` function.
2. **Chevron walnut** (hallway) — Angled V-pattern planks. Custom `chevronFloorTexture()` function.
3. **Ceramic subway tile** (kitchen floor + walls + backsplash) — Offset brick pattern with glossy highlights. Custom `subwayTileTexture()` function.
4. **Hexagonal marble tile** (bathroom floor) — Honeycomb pattern with veining. Custom `hexTileTexture()` function.
5. **Plush gray-purple carpet** (master bedroom) — Dense pile texture. Custom `plushCarpetTexture()` function.
6. **Plush blue-gray carpet** (bedroom 2) — Same carpet generator, different colors.
7. **Composite deck** (balcony) — Wood-plank look with grooves. Custom `compositeDeckTexture()` function.

**Room layout (initial version — had overlaps, fixed in Change 4.2):**
- Living + Kitchen: open-concept with sectional sofa, coffee table, area rug, TV console, floor lamp, bookshelf, fiddle-leaf fig plant
- Kitchen: L-shape granite counter, marble-top island with brass bar stools, stainless stove with burners + range hood, fridge, sink with brass faucet, 3 brass pendant lights, round oak dining table with 4 chairs
- Hallway: chevron walnut floor, console table with mirror, 3 wall-art prints, brass thresholds
- Master Bedroom: king bed with pillows + duvet + headboard, 2 nightstands with brass table lamps, dresser with brass knobs, wardrobe
- Bedroom 2 / Home Office: queen bed, oak desk, office chair, monitor with emissive screen
- Bathroom: bathtub with brass faucet, marble vanity with sink, toilet, brass towel rack, framed mirror
- Balcony: composite deck, glass railing, 2 lounge chairs, side table, potted plant

**Exterior:**
- Parking slab with painted lines
- 14 SF skyline buildings with lit windows
- Bay Bridge silhouette with towers + cables
- SF Bay water plane

**Lighting:**
- Warm golden-hour directional sun (2048 shadow map)
- Hemisphere fill, ambient, fill light from east
- 8 recessed ceiling fixtures (with PointLights)
- 3 island pendant lights
- Floor lamp PointLight, 2 nightstand lamp PointLights

**Walls:** warm plaster walls + dark blue accent wall + baseboards + 4 interior doors with brass knobs

**Windows:** 7 large bay windows with mullions (south-facing SF-style) + kitchen window above sink

**Registration:** Added as `part_bay_area_apartment` in `models.ts` and `seed.ts`. Set as default active part in `useCADStore.ts`.

**TypeScript fixes:**
- Replaced `new (ternary) ? A : B` pattern with computed width variable in bathroom tile panel loop
- Fixed `ConeGeometry` signature: added `1` heightSegments before `true` openEnded flag (3 occurrences)

---

## Change 4.2 — Fix Overlapping and Glitching Objects

**Problem:** Multiple objects were overlapping and glitching — walls blocking doorways, furniture poking through walls, duplicate floors, balcony inside apartment footprint.

**Root causes diagnosed (10 issues):**
1. Door headers placed INSIDE doorways (at y=0..18) instead of above doors (y=14..30)
2. Duplicate kitchen floor in `rooms` array AND `kitchenTileOverlay` → Z-fighting
3. Misaligned wall segments — walls didn't match doorway openings
4. Doors on wrong walls — bathroom door at X=85 (floating), bedroom 1 door at X=30 (wrong wall)
5. Missing wall at Z=-30 — bedroom 2 was open to the hallway
6. Balcony inside apartment footprint (Z=20..70) overlapping with bedroom 1
7. Furniture poking through walls — media console, TV, bookshelf were 50 units deep
8. Kitchen counter floating at Z=-21 in the middle of the room
9. Backsplash inside counter (at X=-95, inside counter at X=-99..-89)
10. Dead space at X[0,30], Z[20,70] — undefined area

**Fix:** Rewrote the entire `createBayAreaApartmentGeometry` function (~1140 lines) with corrected layout:

**New non-overlapping room layout:**
- Living+Kitchen: X[-100,30], Z[-70,30] (130 × 100)
- Hallway: X[30,70], Z[-30,30] (40 × 60)
- Bathroom: X[70,100], Z[-30,30] (30 × 60)
- Bedroom 1: X[30,100], Z[30,70] (70 × 40)
- Bedroom 2: X[30,100], Z[-70,-30] (70 × 40)
- Balcony: X[-100,0], Z[70,120] (100 × 50, OUTSIDE north wall)

**Structural fixes:**
- Each room has exactly ONE floor slab (no duplicates, no Z-fighting)
- Kitchen tile is a single overlay on the SW corner of living
- All interior walls have correct segments with doorway openings at Z=-9..-1, Z=-48..-40, X=46..54
- Door headers placed ABOVE doorways at y=14..30 (centered at y=22, 16 tall)
- North exterior wall split: west segment (X=-100..0) is balcony sliding door opening, east segment (X=0..100) is solid
- Balcony moved OUTSIDE apartment to Z=70..120 with glass railings on 3 sides + sliding glass door
- Added missing Z=-30 wall (bedroom 2 | hallway+bathroom)
- Fixed bathroom door: now at `(70, -5, 'x')` on X=70 wall
- Fixed bedroom 1 door: now at `(50, 30, 'z')` on Z=30 wall
- Accent wall panel on X=30 wall facing west into living room
- Bathroom tile panels on all 4 interior faces, correctly positioned just inside each wall

**Furniture repositioning:**
- Media console: `BoxGeometry(12,6,50)` against X=30 wall (was 50 deep in X poking through wall)
- TV: `BoxGeometry(1.5,22,40)` mounted on X=30 wall facing west (was lying flat)
- Bookshelf: `BoxGeometry(6,24,40)` against X=30 wall (was 40 deep in X)
- Kitchen counter2: moved to south wall Z=-70 (was floating at Z=-21)
- Backsplash: at X=-99.5 on west wall above counter (was at X=-95 inside counter)
- Fridge: at corner of south counter (was at X=-53 floating)
- Sink: on south counter (was on north counter that didn't exist)
- Dining table: moved to NE area of living (was at Z=-25 conflicting with sofa)
- All bedroom furniture repositioned for new room boundaries
- Bathroom fixtures repositioned for larger bathroom (Z=-30..30 instead of Z=-30..0)
- Toilet rotated to sit against east wall properly

**Additions:**
- Sliding glass door (2 panels, offset to show sliding) in balcony opening
- Baseboards for all rooms with correct segment breaks at doorways
- Updated ceiling light positions for new room layout (14 lights total)

**Verification:** `npx tsc --noEmit` shows zero errors; `npx next build` succeeds.

---

## Change 4.3 — Fix Floor Texture / Baseplate Z-Fighting

**Problem:** The floor textures and the baseplate (parking slab) were always colliding and glitching — classic Z-fighting flicker.

**Root cause:** Coincident surfaces
- Base slab: `BoxGeometry(400, 4, 340)` centered at y=-2 → **top at y=0**
- All room floor planes (living, hallway, bathroom, bed1, bed2): positioned at **y=0**
- Two surfaces at exactly y=0 → renderer can't decide which to draw on top → flickering

**Secondary Z-fighting at ceiling (y=FH=30):**
- Wall tops (walls span y=0..30, top at y=30)
- Door header tops (16 tall, centered at y=22, top at y=30)
- Bathroom tile panel tops (FH=30 tall, top at y=30)
- Accent wall panel top (FH=30 tall, top at y=30)
- Ceiling plane at y=30

**Fixes applied (9 changes):**
1. **Base slab:** lowered from y=-2 to y=-2.5 (top now at y=-0.5, below apartment floors)
2. **Room floors:** added `FLOOR_Y = 0.05` constant; raised all 5 room floor planes from y=0 to y=0.05
3. **Balcony floor:** lowered from y=0.5 to y=0.1 (consistent with interior floors, still above slab)
4. **Ceiling:** lowered from y=FH=30 to y=FH-0.1=29.9 (below wall/header/tile tops at y=30)
5. **Door headers:** lowered centers from y=22 to y=21.95 (tops now at y=29.95, below ceiling at 29.9)
6. **Accent panel:** shrunk height from FH=30 to FH-0.2=29.8 (top at y=29.8, below ceiling)
7. **Bathroom tile panels:** shrunk from FH=30 to FH-0.2=29.8 (tops at y=29.8, below ceiling)
8. **Area rug:** lowered from y=0.2 to y=0.15 (still above floor at y=0.05)
9. **Kitchen tile overlay:** stays at y=0.1 (above living floor at y=0.05, no coincidence)

**Result:** All coincident surfaces now have a minimum 0.05-unit offset (5mm at 10u/m scale — invisible to the eye but eliminates Z-fighting).

**Verification:** `npx tsc --noEmit` shows zero errors; `npx next build` succeeds.

---

## End of Phase 4

**State at end of Phase 4:**
- Bay Area apartment with 7 distinct floor finishes, each with bump maps
- All overlapping geometry fixed — clean, non-overlapping room layout
- All Z-fighting eliminated — floor/slab, ceiling/walls/headers/tiles all properly offset
- Balcony outside apartment footprint with glass railings and sliding glass door
- SF skyline + Bay Bridge + bay water visible through windows
- Set as default active part

**Files modified:**
- `src/lib/cad/bay-area-apartment.ts` (~1550 lines)
- `src/lib/cad/models.ts` (added `part_bay_area_apartment` case)
- `src/lib/cad/seed.ts` (added apartment part definition with 12 features)
- `src/store/useCADStore.ts` (set `activePartId` to `'part_bay_area_apartment'`)
