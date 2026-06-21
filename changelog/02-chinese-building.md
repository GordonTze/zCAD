# Phase 2 — Chinese 3-Story Building + Walk Mode

This phase covers the creation of a traditional Chinese 3-story building with full interior, the implementation of first-person walk mode, and multiple rounds of fixes to controls, scaling, stairs, and textures. 9 changes.

---

## Change 2.1 — Chinese 3-Story House

**File created:** `src/lib/cad/chinese-building.ts`

**Function:** `createChineseBuildingGeometry()`

**Details:**
- Traditional Chinese pagoda-style 3-story building
- Scale: 10 units = 1 meter (200-unit-wide building = 20m)
- 3 floors with floor-to-ceiling height of ~3m each
- Traditional curved roof with glazed tiles
- Red wooden columns and beams
- White plaster walls
- Wooden doors and latticed windows
- Registered as `part_chinese_building` in dispatcher and seed
- Building was initially hollow — interior added in later changes

---

## Change 2.2 — Interior Details + Textures

**File created:** `src/lib/cad/building-interior.ts`

**Interior layout:**
- Central courtyard concept
- Rooms arranged around the perimeter of each floor
- Floor openings for stairwells

**Furniture per room:**
- Beds with frames and mattresses
- Tables and chairs
- Kitchen with stove, counter, shelves
- Storage cabinets

**File created:** `src/lib/cad/building-textures.ts` with 14 procedural textures:
- `makeWoodTexture` — bold wood grain with knots
- `makeTileTexture` — ceramic tiles with grout
- `makeBrickTexture` — brick wall with mortar
- `makeFabricTexture` — woven fabric for upholstery
- `makeGraniteTexture` — speckled granite
- `makeMarbleTexture` — veined marble
- `makePlasterTexture` — painted plaster walls
- `makeCarpetTexture` — Chinese dragon pattern carpet
- `makeWallpaperTexture` — floral wallpaper
- `makeConcreteTexture` — painted concrete
- `makeMosaicTexture` — mosaic tiles
- `makeStoneTexture` — natural stone
- `makeGlassTexture` — glass
- `makeRoofTileTexture` — traditional roof tiles

Each texture returns `{ map, bumpMap }` for 3D relief.

---

## Change 2.3 — Walk Mode Feature

**Changes:**
- Added walk mode as a toggleable feature in the CAD store (`walkMode: boolean`, `toggleWalkMode()`)
- Added Walk Mode button to the viewport UI
- Initial walk mode implementation:
  - First-person camera at eye height
  - WASD movement
  - Mouse look
  - Basic gravity (snap to floor)

---

## Change 2.4 — Full Physics Walk Mode

**File created:** `src/lib/cad/building-occupants.ts` — 3D people (initially 50 units tall, later corrected to 17 units = 1.7m)

**Physics implementation in `Viewport3D.tsx`:**
- Gravity (per-frame downward acceleration)
- Floor detection via raycasting downward
- Stair climbing (auto-step up to a threshold)
- Wall collision via raycasting forward
- Wall sliding (try X-only or Z-only movement when blocked)

**Walk mode constants:**
- `EYE_HEIGHT = 17` (1.7m)
- `WALK_SPEED = 1.5` units/frame
- `MAX_STEP_UP = 5` (0.5m stair step)

---

## Change 2.5 — Mouse Look + Scaling Fixes

**Bug fixes:**

1. **Mouse look broken in sandboxed iframes:**
   - `PointerLockControls` fails in sandboxed iframes
   - Replaced with manual `PointerEvent`-based drag look:
     - `pointerdown` → start dragging
     - `pointermove` → update yaw/pitch based on delta
     - `pointerup` → stop dragging
     - Yaw/pitch clamped to prevent gimbal lock

2. **People scaling:**
   - Changed from 50 units (5m) to 17 units (1.7m) — realistic human height

3. **Furniture scaling:**
   - Added 0.35x scaling pass for non-structural meshes with Y-position correction
   - Furniture was 2-3x oversized

4. **Collision blocking movement:**
   - WASD not working because collision detection raycasted against ALL meshes (including tiny furniture)
   - Fixed by filtering to only large meshes (>15 units in any dimension) with shorter raycast range

---

## Change 2.6 — Animation Loop Fix

**Bug:** Mouse look still not working after the PointerEvent replacement.

**Root cause:** The main animation loop was calling `controls.update()` (OrbitControls) every frame, which overwrote the walk mode camera rotation set by the manual yaw/pitch logic.

**Fix:** Added `if (!isWalkMode)` check before `controls.update()` in the main animation loop. This allowed the walk mode's manual yaw/pitch to persist instead of being reset by OrbitControls.

---

## Change 2.7 — WASD Orientation Fix + Stairs

**Bug fixes:**

1. **W/S swapped:**
   - Forward vector was `+Z` (backward in Three.js default camera orientation)
   - Fixed to: `fwdX = -Math.sin(yaw)`, `fwdZ = -Math.cos(yaw)`

2. **Stairs missing:**
   - Rebuilt stairs as 5-unit-tall × 5-deep × 40-wide blocks (previously 2-unit-tall, too thin to see)
   - Added bright yellow railings for visibility
   - Added glowing arrow signs pointing to stairs
   - Fixed floor slab openings for stairwell (floors were previously solid where stairs should pass through)

---

## Change 2.8 — A/D Orientation Fix + Kitchen + Furniture Details

**Bug fixes:**

1. **A/D swapped:**
   - Right vector was negated
   - Fixed to: `rgtX = Math.cos(yaw)`, `rgtZ = -Math.sin(yaw)`

**Additions:**
- Kitchen added to first floor with: stove with burners, refrigerator, sink with faucet, counter with cabinets, shelves with dishes
- Furniture details: baseboards around all rooms, crown molding, ceiling panels, 12 point lights for interior illumination, detailed all furniture with textured materials

---

## Change 2.9 — Texture Resolution + Detail Pass

**Improvements:**
- Increased texture resolution from 128×128 to 256×256 for sharper details
- Added granular furniture: books on shelves (individually modeled), dishes on tables, lamps with shades, plants in pots, wall art/paintings
- Improved bump map resolution and `bumpScale` values for more visible 3D relief
- Added `anisotropy = 8` to all textures for sharper grazing-angle appearance

**Subsequent texture passes (rolled into this change):**
- Applied procedural textures to all previously-untextured furniture (wood on furniture, fabric on upholstery, granite on counters, marble on bathroom, carpet on rugs, tile on floors)
- Rewrote all texture generators for higher contrast and bolder appearance (darker grain lines, thicker grout, bolder mortar, larger speckles, bolder veins)
- Increased `bumpScale` on all materials for more visible 3D relief

**Stair rebuild (rolled into this change):**
- Completely rebuilt stairs as unmistakable physical structures
- Each step: 5 units tall × 5 deep × 40 wide
- Full staircase from ground to 3rd floor
- Bright yellow metal railings on both sides
- Glowing arrow signs at each floor landing
- Floor openings properly cut in each floor slab for stairwell
- Support beams under stairs

**Lighting enhancement (rolled into this change):**
- Increased point light count to 12 (4 per floor)
- Added warm color temperature to interior lights (0xfff4cc)
- Increased directional sun intensity
- Added per-material color variation
- Increased metalness on metallic objects
- Tuned roughness values for more realistic surface appearance
- Added ambient occlusion-like darkening in corners via darker base colors

---

## End of Phase 2

**State at end of Phase 2:**
- Chinese 3-story building with full interior, furniture, occupants, stairs
- 14 bold procedural textures with bump maps
- First-person walk mode with gravity, collision, stair climbing, mouse drag look
- All control bugs fixed (WASD orientation, mouse look, collision filtering)
- Furniture properly scaled (0.35x pass, 1.7m people)

**Files created/modified:**
- `src/lib/cad/chinese-building.ts`
- `src/lib/cad/building-interior.ts`
- `src/lib/cad/building-textures.ts` (14 textures)
- `src/lib/cad/building-occupants.ts`
- `src/components/cad/Viewport3D.tsx` (walk mode physics)
- `src/store/useCADStore.ts` (walk mode state)
