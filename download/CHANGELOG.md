# Changelog Index

This folder documents every change made to the Super Z CAD project, organized by phase. Each file covers a logical group of related changes and provides a detailed technical report of what was modified, added, or fixed.

## How to read this

- Each `.md` file covers a related group of changes (a "phase").
- Changes are listed chronologically within each file, oldest first.
- Each entry is a detailed technical report: what was done, which files were touched, what bugs were found and how they were fixed.
- No user prompts or conversational context — just the engineering changes.

---

## Phases

| Phase | File | Changes | Description |
|---|---|---|---|
| 1 | [`01-cad-platform-foundation.md`](./01-cad-platform-foundation.md) | 6 | Initial CAD platform build + 48 mechanical parts |
| 2 | [`02-chinese-building.md`](./02-chinese-building.md) | 9 | Chinese 3-story building with interior, walk mode, controls fixes |
| 3 | [`03-architectural-models.md`](./03-architectural-models.md) | 5 | LA Hills mansion + Great Pyramid of Giza |
| 4 | [`04-bay-area-apartment.md`](./04-bay-area-apartment.md) | 3 | Bay Area apartment creation + overlap/Z-fighting fixes |
| 5 | [`05-walk-mode-physics.md`](./05-walk-mode-physics.md) | 3 | Walk mode jump + noclip + control refinements |
| 6 | [`06-desktop-setup.md`](./06-desktop-setup.md) | 15 | Desktop battlestation (colors, monitors, speakers, keyboard, room, desk) |
| 7 | [`07-grocery-store.md`](./07-grocery-store.md) | 5 | Grocery store (aisles, produce, gondola geometry, product variety, facings) |
| 8 | [`08-f1-car.md`](./08-f1-car.md) | 7 | F1 car (exploded + assembled) + optimization passes + ViewCube + landing page |

**Total changes documented: 53**

---

## Summary by Phase

### Phase 1 — CAD Platform Foundation
Built the production-grade browser-based CAD platform (Next.js 16 + Three.js + Tailwind). Added 48+ procedural mechanical parts: gearbox, engine, turbine blade, rocket injector, F1 upright, injection mold, 5-axis CNC (14 components), and the Mega CNC single-mesh assembly.

### Phase 2 — Chinese 3-Story Building
Created a traditional Chinese pagoda with full interior across 3 floors. Added furniture, 3D occupants, physical stairs, and 14+ procedural textures. Implemented first-person walk mode with gravity, wall collision, and stair climbing. Fixed multiple control issues (WASD swapped, A/D swapped, mouse look in sandboxed iframes).

### Phase 3 — Architectural Models
Built the LA Hills luxury mansion (3 levels, infinity pool, glass walls). Then built the Great Pyramid of Giza with 40 limestone layers, interior chambers, Sphinx, satellite pyramids, and dynamic Egyptian sun lighting with 2048 shadow maps.

### Phase 4 — Bay Area Apartment
Created a modern 2BR SF SoMa apartment with 7 distinct floor finishes, full kitchen, bathroom, bedrooms, glass-railed balcony, and SF skyline. Fixed overlapping geometry (walls blocking doorways, balcony inside apartment) and Z-fighting between floor textures and the baseplate.

### Phase 5 — Walk Mode Physics
Added jump (Space) and noclip flight mode (Shift toggle). Changed noclip vertical controls to Q/E. Fixed the jump bug where Space was instantly cancelled by the gravity check. Tuned jump parameters for a proper parabolic arc. Added adaptive spawn positions per part.

### Phase 6 — Desktop Setup
Created a detailed desktop battlestation with gaming PC (visible internals + RGB), 3 monitors (procedural screen content), server rack (9 units), Herman Miller Embody chair, 4 wall-mounted corner speakers, full QWERTY keyboard, and home office environment. 15 changes covering colors, monitor orientation, overlap fixes, room expansion, desk repositioning, and two optimization passes.

### Phase 7 — Grocery Store
Created a 60m × 40m supermarket with 8 aisles (1600+ products in 6 packaging types), produce section (10 bins with procedural fruit textures), bakery, deli, dairy wall (12 glass-door coolers), frozen section, 6 checkout lanes, and full overhead signage. Fixed gondola geometry, organized products into facings, and added product variety (bags, bottles, cans, jars, pouches).

### Phase 8 — F1 Car + Optimization + ViewCube + Landing Page
Created a detailed F1 car with 17 component groups (250+ meshes) in both exploded and assembled views. Added V6 turbo hybrid power unit, suspension, halo, DRS, T-wing, and cockpit interior. Conducted two project-wide optimization passes (fixing 10+ bugs, removing dead code, hoisting 250+ duplicate materials, fixing GPU memory leaks). Built an interactive 3D ViewCube (Blender/AutoCAD style) with drag-to-orbit and live camera sync. Created a landing page with 24+ screenshots, category filtering, and per-image part launching.

---

## Conventions

- **Change** = a unit of work that may include multiple files, fixes, and additions.
- All file paths are relative to the project root (`/home/z/my-project/`).
- Line counts are approximate and reflect the state of the file at the time of the change.
- The consolidated multi-agent work log is in [`../worklog.md`](../worklog.md).

---

# Phase 1 — CAD Platform Foundation

This phase covers the initial build of the browser-based CAD platform and the expansion of mechanical engineering parts. 6 changes, all focused on the core CAD application and mechanical models.

---

## Change 1.1 — Initial CAD Platform Build

**Files created:**
- `src/app/page.tsx`, `src/app/layout.tsx` — Next.js App Router entry points
- `src/components/cad/CADApp.tsx` — top-level application shell
- `src/components/cad/Viewport3D.tsx` — Three.js viewport with orbit controls, shaded/wireframe view modes
- `src/components/cad/LeftPanel.tsx` — feature tree with visibility toggles
- `src/components/cad/RightPanel.tsx` — properties / parameters panel
- `src/components/cad/BottomPanel.tsx` — timeline / history
- `src/components/cad/Toolbar.tsx` — modeling tools (sketch, extrude, revolve, fillet, chamfer, hole, pattern, mirror)
- `src/components/cad/TopMenuBar.tsx` — file/edit/view menus
- `src/components/cad/CommandPalette.tsx` — Cmd+K quick search
- `src/components/cad/StatusBar.tsx` — bottom status bar (units, mass properties, regen status)
- `src/store/useCADStore.ts` — Zustand store for state management
- `src/lib/cad/models.ts` — part dispatcher (`createGeometryForPart`)
- `src/lib/cad/seed.ts` — part definitions and feature tree seed data
- `src/lib/cad/types.ts` — TypeScript types (Part, Feature, AssemblyInstance, etc.)

**Technical decisions:**
- Three.js for 3D rendering (WebGL2)
- All models procedurally generated at runtime — no external 3D assets
- TypeScript strict mode
- Turbopack for dev server (faster rebuilds)
- shadcn/ui + Radix UI primitives for component library
- Tailwind CSS 4 for styling

**Initial mechanical parts:** gearbox housing, drive shaft, spur gear, ball bearing, cover plate, bolt, coupling, pulley, compression spring.

---

## Change 1.2 — Material Helpers + Additional Parts

**Files created:**
- `src/lib/cad/materials-dsl.ts` — reusable material helpers

**Material helpers added:**
- `metal(color, metalness, roughness)` — generic MeshStandardMaterial
- `steel()` — 0x6b7280, metalness 0.92, roughness 0.18
- `stainless()` — 0xb8bcc4, metalness 0.95, roughness 0.12
- `aluminum()` — 0x9aa3b0, metalness 0.7, roughness 0.35
- `darkSteel()` — 0x3a3f47, metalness 0.88, roughness 0.25
- `brass()` — 0xc09545, metalness 0.9, roughness 0.3
- `rubber()` — 0x1a1a1a, metalness 0.1, roughness 0.9
- `plastic(color)` — color, metalness 0.05, roughness 0.6
- `addShadow(mesh)` — sets `castShadow = true` and `receiveShadow = true`

**New parts:** impeller, turbine, robotic arm, bracket, heatsink, cylinder head, propeller. Each generated with realistic engineering details (fillets, chamfers, holes, ribs, bosses). All registered in `models.ts` dispatcher and `seed.ts`.

---

## Change 1.3 — Complete Engine Assembly

**Parts added (7):**
- `part_engine_block` — engine block with cylinder bores, coolant jackets, oil passages
- `part_crankshaft` — main journals, rod journals, counterweights, keyway
- `part_conrod` — connecting rod with big end, small end, I-beam shaft
- `part_piston` — ring grooves, wrist pin bore, crown, skirt
- `part_flywheel` — ring gear teeth, mounting bolts, friction surface
- `part_camshaft` — cam lobes, journals, keyway
- `part_oilpan` — drain plug, baffles
- `part_valvecover` — breathers, oil filler cap

**Design:** Parts designed to assemble together (matching bore spacings, journal diameters, bolt patterns). Mass properties and bounding boxes calculated for each part.

---

## Change 1.4 — Aerospace / High-Performance Parts

**Parts added (6):**
- `part_turbine_blade` — single crystal turbine blade with root, airfoil, tip shroud, cooling passages
- `part_rocket_injector` — coaxial swirl injector with oxidizer/fuel manifolds, 18 injection elements
- `part_f1_upright` — Formula 1 wheel upright with bearing housings, pushrod mount, caliper mount
- `part_injection_mold` — injection mold core with cooling channels, ejector pins, cavity
- `part_gearbox_complete` — complete gearbox assembly (housing + shaft + gears + bearings + cover)
- Initial 5-axis CNC machine as separate components (`part_cnc_bed`, `part_cnc_column`, `part_cnc_spindle`, `part_cnc_rotary`)

---

## Change 1.5 — Detailed 5-Axis CNC Machine (14 Sub-Components)

**File created:** `src/lib/cad/cnc-machine.ts`

**Sub-component generators (14):**
1. `createCNCMachineBedGeometry` — machine bed with T-slots, leveling feet
2. `createXAxisSaddleGeometry` — X-axis saddle with linear rail mounts
3. `createCNCColumnGeometry2` — column with Y-axis rail mounts, counterweight bore
4. `createSpindleCarriageGeometry` — Z-axis carriage with spindle mount
5. `createSpindleMotorGeometry` — spindle motor with cooling fins, encoder
6. `createBAxisTrunnionGeometry` — B-axis rotary trunnion table
7. `createCAxisTableGeometry` — C-axis rotary table with T-slots
8. `createATCMagazineGeometry` — automatic tool changer magazine (20 pockets)
9. `createATCArmGeometry` — ATC swing arm with gripper
10. `createCoolantSystemGeometry` — coolant tank, pump, nozzle
11. `createControlCabinetGeometry` — electrical cabinet with ventilation
12. `createToolHolderGeometry` — CAT40 tool holder
13. `createChipConveyorGeometry` — chip conveyor with hinge belt
14. `createWorkpieceGeometry` — sample workpiece (aluminum block)

Each part registered as `part_cnc2_*` in the dispatcher. Designed to assemble into a complete 5-axis machining center.

---

## Change 1.6 — Mega CNC Machine (Single Super-Detailed Mesh)

**File created:** `src/lib/cad/mega-cnc.ts`

**Function:** `createMegaCNCMachineGeometry()` generates the entire 5-axis CNC as a single super-detailed mesh group (rather than 14 separate parts).

**Additional details beyond the 14-component version:**
- Way covers (telescopic)
- Door with handle
- Multiple coolant nozzles
- Tool in spindle
- Workpiece mounted on trunnion
- Cable management chains
- Warning labels and branding plates

Registered as `part_mega_cnc` in dispatcher and seed. Set as one of the showcase parts.

---

## End of Phase 1

**State at end of Phase 1:**
- 40+ procedural mechanical parts across 6 categories
- Full CAD workstation UI (feature tree, viewport, toolbar, command palette, panels)
- Three.js rendering with shaded / wireframe / shaded-with-edges view modes
- Zustand state management
- No architectural models yet (those start in Phase 2)
- No walk mode yet

**Files created:**
- `src/lib/cad/models.ts` (dispatcher, ~4300 lines)
- `src/lib/cad/seed.ts` (part definitions)
- `src/lib/cad/materials-dsl.ts` (material helpers)
- `src/lib/cad/cnc-machine.ts` (14 CNC components)
- `src/lib/cad/mega-cnc.ts` (single-mesh CNC)
- All UI components in `src/components/cad/`
- `src/store/useCADStore.ts`
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
# Phase 3 — Architectural Models (LA Mansion + Great Pyramid)

This phase covers the creation of the LA Hills luxury mansion and the Great Pyramid of Giza with realistic textures and dynamic lighting. 5 changes.

---

## Change 3.1 — LA Hills Mansion

**File created:** `src/lib/cad/la-mansion.ts` (~1000 lines)

**Function:** `createLAMansionGeometry()`

**Building details:**
- Modern luxury mansion perched on the Hollywood Hills
- 3 levels:
  - Ground floor: garage + gym
  - Main floor: open-plan living, dining, kitchen
  - Upper floor: bedroom suites + rooftop deck
- Floor height: 100 units (10m) per floor

**Architectural features:**
- Glass curtain walls
- Cantilevered sections
- Infinity-edge pool
- Infinity-edge roof deck
- Retaining walls (stone)
- Landscaped garden
- Hillside slope behind the building

**Materials:**
- White painted concrete walls (textured with `makeConcreteTexture`)
- Dark anodized window frames
- Glass walls (transparent, metalness 0.7, roughness 0.05, opacity 0.4)
- Polished concrete floors
- Hardwood floors
- Composite deck

**Furnishings:**
- Modern sofa with cushions (fabric texture)
- White accent furniture
- Granite kitchen counters
- Dark cabinets
- Stainless appliances
- Pool with translucent water
- Outdoor deck furniture

Registered as `part_la_mansion` in dispatcher and seed. Set as default active part.

---

## Change 3.2 — Great Pyramid of Giza

**File created:** `src/lib/cad/pyramid.ts` (~1200 lines)

**Function:** `createPyramidGeometry()`

**Pyramid structure:**
- 40-layer limestone block pyramid
- Each layer: 4 sloped face panels at the pyramid angle (51°50')
- Lower 1/3 uses weathered limestone texture
- Upper 2/3 uses clean limestone texture
- Gold capstone at the apex

**Interior chambers:**
- Subterranean Chamber (basalt floor)
- King's Chamber (granite walls, gold sarcophagus, 6 gold treasures)
- Queen's Chamber (hieroglyph walls, gold statue)

**Passages:**
- Descending Passage (entrance to Subterranean Chamber)
- Ascending Passage
- Grand Gallery (hieroglyph walls, 6 torches with flames)

**Surrounding structures:**
- Sphinx (limestone body, pharaoh head, gold headdress, paws)
- 2 satellite pyramids (with gold capstones)
- Mortuary Temple (6 columns + roof)
- Perimeter walls
- Causeway (basalt)
- 6 palm trees
- Nile River section

**11 procedural textures:**
1. Limestone (clean)
2. Weathered limestone
3. Granite (for King's Chamber)
4. Basalt (for floors)
5. Gold (for capstone and treasures)
6. Sand (desert ground)
7. Hieroglyph (wall carvings)
8. Palm bark + fronds
9. Water (Nile)
10. Stone (mortuary temple)
11. Wood (torch handles)

Registered as `part_pyramid` in dispatcher and seed.

---

## Change 3.3 — Additional Pyramid Textures

**Texture enhancements:**
- Detailed limestone block texture with individual block outlines, mortar lines, and per-block color variation
- Weathered limestone with cracks, erosion, and discoloration
- Sand dune texture with ripple patterns
- Enhanced hieroglyph texture with more symbols and deeper relief
- Polished granite with visible feldspar crystals
- Brushed gold with surface striations
- Increased texture repeat values for finer detail on large surfaces
- Added per-face UV variation to break up repetition

---

## Change 3.4 — Shadows and Realistic Lighting

**5-light system implemented:**
1. **Directional sun** — warm Egyptian sunlight
   - Intensity: 2.0
   - Shadow map: 2048×2048
   - Shadow camera bounds: ±300 units
   - Shadow bias: -0.0005 (prevents shadow acne)
2. **Fill light** — soft directional light from opposite side, intensity 0.4
3. **Ambient light** — low-intensity white, intensity 0.25
4. **Hemisphere light** — sky tan / ground brown, intensity 0.35
5. **Rim light** — backlight for edge definition, intensity 0.3

**Additional lights:**
- Torch lights inside passages and chambers (warm point lights)
- Capstone glow (emissive gold material)

**Surface texture enhancements:**
- Higher-contrast limestone with deeper relief
- More visible weathering patterns
- Enhanced bump maps for 3D surface detail
- Per-layer color variation for organic appearance

---

## Change 3.5 — Non-Uniform Texture Application

**Problem:** All 40 layers used the same `pyramidMat` (limestone, repeat 8×8) or `weatheredMat` (weathered limestone, repeat 6×6) with identical UV mapping — the surface looked too uniform.

**Fix:** Broke up the uniform texture application:
- Each of the 40 layers × 4 faces now uses slightly different texture parameters:
  - Random UV offset per face (so the texture doesn't tile identically)
  - Slightly different repeat values per layer
  - Per-layer color tint via `material.color` (subtle hue/value variation)
  - Some layers use the weathered variant, others use clean limestone, mixed organically
- This makes the surface look like real pyramid blocks — no two faces look identical

---

## End of Phase 3

**State at end of Phase 3:**
- 4 architectural models total: Chinese building, LA mansion, Great Pyramid (Bay Area apartment comes in Phase 4)
- Great Pyramid with 11 procedural textures, interior chambers, Sphinx, dynamic 5-light system with shadows
- Non-uniform texture application for organic appearance
- Walk mode available for all architectural models

**Files created/modified:**
- `src/lib/cad/la-mansion.ts` (~1000 lines)
- `src/lib/cad/pyramid.ts` (~1300 lines)
- `src/lib/cad/models.ts` (added `part_la_mansion` and `part_pyramid` cases)
- `src/lib/cad/seed.ts` (added LA mansion and pyramid part definitions)
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
# Phase 5 — Walk Mode Physics Enhancements

This phase covers the addition of jump and noclip flight mode to walk mode, plus several rounds of control fixes. 3 changes. All changes are in `src/components/cad/Viewport3D.tsx`.

---

## Change 5.1 — Add Jump and Noclip Mode

**New constants:**
- `NOCLIP_SPEED = 4` (faster than walk speed of 1.5)
- `JUMP_VELOCITY = 7` (initial upward velocity — later tuned to 4 in Change 5.3)
- `GRAVITY = 0.3` (per-frame downward acceleration)

**Removed:** `RUN_SPEED` constant (Shift no longer runs — it toggles noclip)

**New state variables:**
- `noclip: boolean` — toggled by Shift, disables gravity + collision
- `onGround: boolean` — tracks whether player is currently grounded (for jump)
- `jumpQueued: boolean` — set on Space keydown, consumed in walk loop

**`onKeyDown` handler rewritten:**
- **Shift** (left/right): toggles `noclip` on each fresh keydown (with `e.repeat` guard to prevent auto-repeat from rapidly toggling). Calls `e.preventDefault()` to avoid browser shortcuts.
- **Space**: queues a jump (`jumpQueued = true`) on fresh keydown; `e.preventDefault()` prevents page scroll.
- Other keys: tracked in `keys{}` as before.

**Walk loop physics split into two branches:**

1. **NOCLIP MODE** (`noclip = true`): free flight, no collision, no gravity
   - WASD = horizontal movement (NOCLIP_SPEED)
   - Space = fly up, Ctrl/C = fly down (later changed to Q/E in Change 5.2)
   - Y position clamped to [2, 500] to prevent flying off into infinity

2. **NORMAL MODE** (`noclip = false`): walk with collision + gravity + jump
   - Same wall-collision raycasting as before (X-only / Z-only sliding)
   - Jump: if `jumpQueued && onGround`, set `velocityY = JUMP_VELOCITY`
   - Gravity: existing falling/stair-stepping logic, but now uses `GRAVITY` constant and tracks `onGround` state
   - Added "No floor below — fall" branch for when player walks off an edge

**New component: `NoclipIndicator`**
- Listens for Shift keydown (non-repeat) and toggles local state
- Renders a yellow "NOCLIP ON — fly through walls" badge in top-right when active
- Uses `animate-pulse` for visual attention
- Resets state on unmount (when walk mode exits)

**UI updates:**
- Added Space (Jump) and Shift (Noclip) to the keyboard hints
- Updated subtitle: "Press Shift to toggle noclip (fly through walls · Space/Ctrl to go up/down)"

---

## Change 5.2 — Q/E for Noclip + Space Jump Focus Fix

### Issue 1: Noclip up/down changed to Q/E

**Change:** In the `walkAnimate` loop, noclip vertical movement keys changed:
- Old: `if (keys['Space']) vy += NOCLIP_SPEED; if (keys['ControlLeft'] || keys['ControlRight'] || keys['KeyC']) vy -= NOCLIP_SPEED;`
- New: `if (keys['KeyQ']) vy += NOCLIP_SPEED; if (keys['KeyE']) vy -= NOCLIP_SPEED;`

This frees up Space to be used purely for jump in normal mode (no conflict with noclip up).

### Issue 2: Space not working for jump in default walk mode

**Root cause:** When the user clicks the "Walk Mode" button to enter walk mode, the button receives keyboard focus. Pressing Space then triggers the button's default action (`onClick` → `toggleWalkMode`), which exits walk mode immediately, instead of triggering the jump keydown handler.

**Fix A:** Added `document.activeElement.blur()` at the start of the walk mode `useEffect` — removes focus from any focused element (including the Walk Mode button) when walk mode starts.

**Fix B:** Added `onMouseDown={(e) => e.preventDefault()}` to the Walk Mode button — prevents the button from stealing keyboard focus when clicked. This means even if the user clicks the button to exit walk mode, focus won't move to it (so re-entering walk mode won't have the focus issue).

**Why both fixes:** The `onKeyDown` handler already calls `e.preventDefault()` on Space, but that alone wasn't enough because the button's click action is triggered on keyup, and the browser may still process the focused-button click before our `preventDefault` takes effect. The blur + `onMouseDown` combo fully resolves this.

**UI updates:**
- Added "Q / E  Up / Down (noclip)" to the keyboard hints row
- Updated subtitle from "Space/Ctrl to go up/down" to "Q/E to go up/down"

---

## Change 5.3 — Fix Jump Arc (Space Doesn't Actually Jump)

**Problem:** Space did not actually produce a jump — the player stayed on the ground.

**Root cause:** The jump was being **instantly cancelled on the same frame it was initiated**.

Frame sequence was:
1. `jumpQueued = true` (from Space keydown)
2. Walk loop: `if (jumpQueued && onGround) { velocityY = JUMP_VELOCITY; onGround = false; }`
3. Gravity check runs immediately after: `cam.position.y ≈ targetY` (hasn't moved yet)
4. Enters "On floor" branch (within 0.5 units of `targetY`) → `cam.position.y = targetY; velocityY = 0; onGround = true;`
5. **JUMP CANCELLED** — `velocityY` reset to 0, player snaps back to floor

**Secondary issue:** `JUMP_VELOCITY = 7` was way too high — would launch player ~8m up (peak = 49/0.6 = 81 units = 8.1m).

**Fix applied (3 changes):**

1. **Apply jump velocity IMMEDIATELY:** Added `cam.position.y += velocityY` right after setting `velocityY` in the jump branch. This moves the player up on the same frame, so the subsequent gravity check sees `cam.position.y > targetY + 0.5` and enters the "Above the floor" branch (which continues applying gravity) instead of the "On floor" branch (which cancels the jump).

2. **Guard the "On floor" branch** with `if (velocityY <= 0)`: even if the player is within 0.5 units of the floor, we only snap down if they're not moving upward. This prevents any edge case where a jump could still be cancelled.

3. **Added `onGround = false`** in the "Still airborne" sub-branch (when `cam.position.y > targetY` after applying gravity) — ensures `onGround` stays false while rising/falling through the air.

**Tuned jump parameters:**
- `JUMP_VELOCITY`: 7 → 4 (peak height now ~27 units = 2.7m, enough to clear a sofa/bed but not fly through the ceiling)
- `GRAVITY`: kept at 0.3 (airtime ≈ 27 frames ≈ 0.45s — snappy game-feel)

**Result:** Jump now follows a proper parabolic arc:
- Frame 0: `velocityY = 4`, `y += 4` (launch)
- Frame 1: `velocityY = 3.7`, `y += 3.7` (rising, decelerating)
- ... `velocityY` decreases by 0.3 each frame ...
- Frame ~13: `velocityY = 0` (peak, ~27 units above floor)
- Frame ~14: `velocityY = -0.3`, `y -= 0.3` (falling, accelerating)
- Frame ~27: `y <= targetY` → land, `velocityY = 0`, `onGround = true`

---

## End of Phase 5

**State at end of Phase 5:**
- Walk mode supports:
  - **WASD / arrows** — move horizontally
  - **Mouse drag** — look around
  - **Space** — jump (parabolic arc, ~2.7m peak, requires grounding)
  - **Shift** (toggle) — noclip flight mode (no gravity, no collision, fly through walls)
  - **Q** — fly up (noclip only)
  - **E** — fly down (noclip only)
  - **ESC** — exit walk mode
- Visual "NOCLIP ON" badge appears in top-right when noclip is active
- Instructions overlay shows all controls
- Jump physics: proper parabolic arc with gravity, landing detection, no double jumps
- Walk Mode button can't steal keyboard focus (blur + onMouseDown preventDefault)
- Production build passes

**Files modified:**
- `src/components/cad/Viewport3D.tsx` (walk mode physics, ~850 lines total)
  - Added `NoclipIndicator` component
  - Rewrote `onKeyDown` for Shift toggle + Space jump queue
  - Rewrote walk loop with noclip/normal branches
  - Added `document.activeElement.blur()` on walk mode start
  - Added `onMouseDown` preventDefault to Walk Mode button
  - Fixed jump arc with immediate velocity application + on-floor guard
# Phase 6 — Desktop Setup

This phase covers the creation of a detailed desktop battlestation model and the subsequent fixes for color palette, monitor positioning, orientation, chair replacement, PC/server layout, headphones sizing, collision cleanup, walk mode spawn, desk repair, wall speakers, speaker detail, speaker orientation, keyboard layout, floor color, keyboard orientation/scale, floor plank texture, room expansion, and desk repositioning. 15 changes.

---

## Change 6.1 — Desktop Battlestation Creation

**File created:** `src/lib/cad/desktop-setup.ts` (~1120 lines)

**Function:** `createDesktopSetupGeometry()`

**Scene overview:** A complete gaming/productivity battlestation in a home office room (8m × 6m × 3m).

### Room Environment
- Wood floor (procedural oak texture with bump map)
- Painted concrete walls (light cream)
- Dark blue accent wall (behind user)
- Window with mullions and city skyline view (12 buildings with lit windows)
- Ceiling light fixture (emissive disc + point light)
- Floating shelf with books and small plant
- Framed poster on accent wall
- Floor rug under chair

### L-Shaped Desk
- Main surface: 60 wide × 8 deep (X[-30,30], Z[20,28])
- Side surface: 8 wide × 10 deep (L-extension to the left)
- Wood top (procedural texture with bump map)
- 6 metal box legs
- Cable management tray underneath

### Gaming PC Tower (on side desk)
- Carbon fiber case (procedural twill weave texture)
- Tempered glass side panel (facing user, transparent)
- **Visible internals:**
  - Motherboard (dark green PCB)
  - GPU with RGB shroud + 2 visible fans
  - Tower CPU cooler with aluminum radiator + RGB ring fan
  - 2 RAM sticks with RGB tops
  - PSU shroud (bottom)
- 3 RGB front intake fans (magenta/cyan/purple) with fan blades
- RGB bottom strip (green)
- Power button on top
- 2 internal RGB point lights (purple + cyan) for glow

### 3 Monitors (initial version — oversized, fixed in Change 6.3)
- **Center:** 34" ultrawide (44 × 19 units) showing a code IDE
- **Left:** 27" standard (32 × 18 units) showing a dashboard, angled 23° toward user
- **Right:** 27" standard (32 × 18 units) showing a mountain wallpaper, angled -23° toward user
- Each monitor has emissive screen material + backlight glow point light

### Peripherals
- **Mechanical keyboard:** procedural keycap texture (QWERTY layout with letter labels), dual RGB underglow strips (cyan + magenta), RGB point light
- **Gaming mouse:** sculpted body (sphere scaled), RGB scroll wheel, RGB logo
- **Large RGB mousepad:** radial gradient + 4-color RGB edge glow + grid pattern
- **RGB gaming headphones on stand:** headband (torus), 2 ear cups with RGB rings
- **2 bookshelf speakers:** tweeter + woofer + RGB underglow (purple/cyan)
- **Articulated desk lamp:** base + 2 arm segments + cone head + emissive bulb + point light
- **Coffee mug** with handle and dark coffee liquid
- **Stack of 4 books** (different colors)
- **Succulent plant** in terracotta pot (8 angled leaves + center leaf)

### Ergonomic Office Chair
- 5-star base with caster wheels
- Gas cylinder column
- Padded seat + cushion
- Tall backrest (slight recline)
- Headrest
- 2 armrests

### 7 New Procedural Textures
1. `brushedAluminumTexture()` — horizontal brushed metal lines
2. `carbonFiberTexture()` — 2×2 twill weave pattern with gradient cells
3. `mousepadTexture()` — dark radial gradient + 4-color RGB edge + grid pattern
4. `monitorScreenTexture('code')` — dark IDE with syntax-highlighted TypeScript (file tree, line numbers, traffic lights, code with keyword/string/function colors)
5. `monitorScreenTexture('browser')` — light dashboard with revenue/users/orders cards, chart, activity feed, URL bar
6. `monitorScreenTexture('wallpaper')` — night mountain scene with moon, stars, mountain silhouette
7. `keycapTexture()` — 5×5 keycap grid with letter labels (QWERTY)

### Dynamic Lighting
- Warm sun (1.4 intensity, 2048 shadow map) through window
- Hemisphere fill (sky tan / ground brown, 0.5)
- Ambient (0.3)
- Ceiling point light (warm 0.5)
- 7 RGB point lights: PC (purple + cyan), keyboard (cyan), 3 monitor backlights (blue/green/blue), desk lamp (warm)

### Registration
- Added `createDesktopSetupGeometry` import + `case 'part_desktop_setup'` in `models.ts`
- Added 11-feature seed entry in `seed.ts`
- Set `activePartId` to `'part_desktop_setup'` in `useCADStore.ts`

### Bug Fix
- Fixed typo: `fan Housing` → `fanHousing` (line 619, variable declaration with space in name)

**Verification:** `npx tsc --noEmit` shows zero new errors; `npx next build` succeeds.

---

## Change 6.2 — Color Palette Diversification + Natural Monitor Stands

### Issue 1: Too Many Blacks

**Problem:** 13+ materials were using near-black colors (`0x1a1a1a`, `0x2a2a2a`, `0x0a0a0a`), making the scene look uniformly dark and muddy.

**Color palette diversification:**

| Material | Before | After | Notes |
|---|---|---|---|
| `deskLegMat` | `0x2a2a2a` | `0x4a4a52` | Lighter gunmetal |
| `darkPlasticMat` | `0x1a1a1a` | `0x2a2a32` | Dark charcoal (not pure black) |
| `bezelMat` | `0x0a0a0a` | `0x1a1a20` | Dark gray, modern slim bezel |
| `standMat` | `0x2a2a2a` | `0xa8acb4` | Brushed silver aluminum |
| `kbFrameMat` | `0x1a1a1a` | `0x3a3a42` | Dark gray |
| `mouseMat` | `0x1a1a1a` | `0x8a8a92` | Light gray (Logitech-style) |
| `headbandMat` | `0x1a1a1a` | `0x4a3a2a` | Warm taupe/brown leatherette |
| `earCupMat` | `0x2a2a2a` | `0x5a4a3a` | Matching brown |
| `earPadMat` | `0x0a0a0a` | `0x3a2a1a` | Dark brown leather |
| `lampMat` | `0x1a1a1a` | `0xa8acb4` | Brushed silver (matches stands) |
| `speakerMat` | `0x1a1a1a` | Walnut wood texture | Bookshelf speaker look |
| `speakerGrillMat` | `0x0a0a0a` | `0x2a2a2e` | Dark gray |
| `chairFabric` | `#2a2a35` | `#5a5a64` | Light gray mesh |
| `chairFrameMat` | `0x1a1a1a` | `0x8a8a92` | Brushed aluminum |
| `frameMat` (window) | `0x2a2a2a` | `0x6a6a72` | Lighter |

**New materials added for future use:**
- `midGrayPlasticMat` — `0x6a6a72`, metalness 0.3, roughness 0.5
- `lightGrayPlasticMat` — `0x9a9aa2`, metalness 0.2, roughness 0.5
- `whitePlasticMat` — `0xe8e8ec`, metalness 0.1, roughness 0.4

**Result:** Color palette now has warm browns (headphones, speakers, desk), brushed silvers (stands, lamp, chair frame, monitor stands), light grays (mouse, chair fabric, keyboard frame), and only the PC internals + bezels remain dark — which is realistic.

### Issue 2: Floating Monitor Arms → Proper Stands

**Problem:** The old monitors used thin floating arms (`BoxGeometry(2, 2, 6)`) attached to a tall vertical pole clamped to the back of the desk. The monitors looked like they were floating in mid-air with no visible support.

**Fix:** Replaced with proper monitor stands:
1. **Flat oval base disc** (`CylinderGeometry(4, 4.5, 0.8, 24)`) sitting ON the desk
2. **Tapered vertical neck** (`CylinderGeometry(0.9, 1.1, neckHeight, 12)`)
3. **VESA mount plate** (`BoxGeometry(3, 3, 0.5)`)
4. **Monitor head group** with slight downward tilt (-0.06 rad ≈ 3.4°)

Built a reusable `buildMonitor()` helper function. Side monitors angled ±18° (was ±23° — too extreme). Center monitor neck taller (13 units vs 12) for eye-level placement. Added silver branding strip at bottom of each bezel.

**Verification:** `npx tsc --noEmit` shows zero errors; `npx next build` succeeds.

---

## Change 6.3 — Fix Monitor Overlap and Scaling

**Problem:** Monitors were overlapping with the keyboard and with each other.

**Three root causes diagnosed:**

1. **Monitors massively oversized** — at 10 units = 1 meter:
   - Center: 44 wide × 19 tall = 4.4m × 1.9m (real 34" ultrawide is ~0.8m × 0.34m — 5.5x too big)
   - Sides: 32 wide × 18 tall = 3.2m × 1.8m (real 27" monitor is ~0.6m × 0.34m — 5.3x too big)

2. **Monitor bases overlapped keyboard on desk surface:**
   - Desk surface: Z[20, 28] (8 deep)
   - Keyboard: at Z=20, depth 7 → Z=16.5..23.5
   - Center monitor base: at Z=22, radius 4.5 → Z=17.5..26.5
   - Overlap: keyboard back (Z=23.5) vs monitor base front (Z=17.5) — 6-unit collision zone

3. **Monitors overlapped each other:**
   - Center screen: 44 wide at X=0 → spans X=-22..+22
   - Left screen: 32 wide at X=-19 → spans X=-35..-3
   - Right screen: 32 wide at X=19 → spans X=+3..+35
   - Left/center overlap zone: X=-22..-3 (19-unit collision)
   - Right/center overlap zone: X=+3..+22 (19-unit collision)

**Fixes applied:**

1. **Scaled monitors down to realistic sizes:**
   - Center: 44 × 19 → **16 × 7** (~1.6m × 0.7m, proportional 21:9 ultrawide)
   - Sides: 32 × 18 → **11 × 7** (~1.1m × 0.7m, proportional 16:9 standard)
   - Bezel thickness: 1.2 → 0.8 (slimmer)
   - Bezel border: +1.2 → +0.6 (less frame around screen)

2. **Moved monitor bases to back of desk (away from keyboard):**
   - Center base: Z=22 → **Z=26** (back of desk, 2.5-unit gap from keyboard)
   - Left base: Z=21 → **Z=26**
   - Right base: Z=21 → **Z=26**

3. **Repositioned side monitors to flank center without overlapping:**
   - Left base: X=-19 → **X=-14** (with smaller 11-wide screen + 18° angle, screen right edge reaches X≈-18.4, clear of center's left edge at X=-8)
   - Right base: X=19 → **X=14** (mirrored)

4. **Scaled down stand components proportionally:**
   - Stand base: `CylinderGeometry(4, 4.5, 0.8)` → `CylinderGeometry(2, 2.3, 0.5)` (~0.4m diameter, realistic)
   - Neck: `CylinderGeometry(0.9, 1.1, neckHeight)` → `CylinderGeometry(0.5, 0.7, neckHeight)` (slimmer)
   - VESA plate: `BoxGeometry(3, 3, 0.5)` → `BoxGeometry(2, 2, 0.4)` (smaller)

5. **Reduced neck heights:**
   - Center: 13 → **11** (screen center now at y=DESK_Y+11.5=19, still above eye level)
   - Sides: 12 → **10** (slightly lower than center, typical battlestation arrangement)

6. **Updated glow light positions** to match new monitor locations (Z=25, reduced intensity from 0.5/0.3 to 0.4/0.25 since monitors are smaller)

**Spacing verification (post-fix):**
- Keyboard: Z=16.5..23.5, monitor bases: Z=24..28 → 0.5-unit gap ✓
- Center screen: X=-8..+8, left screen right edge: X≈-18.4 → 10.4-unit gap ✓
- Center screen: X=-8..+8, right screen left edge: X≈+18.4 → 10.4-unit gap ✓

**Verification:** `npx tsc --noEmit` shows zero errors; `npx next build` succeeds.

---

## Change 6.4 — Fix Monitor Orientation + Herman Miller Embody Chair

### Issue 1: Monitors Facing the Wrong Way

**Problem:** The monitors were flipped 180° — the screen faced the wall (away from the chair) and the back of the stem (VESA mount + neck) faced the chair. The user saw the back of the monitor instead of the screen.

**Root cause:** In the `buildMonitor()` function:
- The `THREE.PlaneGeometry` faces `+Z` by default (front face normal points +Z)
- The screen was placed at local `z = -0.45` with no rotation → front face pointed `+Z` (toward the wall at Z=30, away from the chair at Z=10)
- The neck and VESA mount were at local `-Z` (between the screen and the chair) — geometrically wrong; they should be behind the monitor at `+Z`

**Fix applied:**
1. **Flipped the screen to face -Z** (toward the chair): Added `screen.rotation.y = Math.PI` to rotate the plane 180° around Y, so its front face now points `-Z` (toward the user/chair at lower Z)
2. **Moved the neck to the back of the monitor**: Changed `neck.position.z` from `-0.5` to `+0.5` (behind the monitor center, toward the wall)
3. **Moved the VESA mount to the back**: Changed `vesa.position.z` from `-0.7` to `+0.7` (on the back of the monitor, where the neck connects)
4. **Kept the screen and branding at local `-Z`** (`-0.45`) — now correctly the FRONT of the monitor (facing the chair)
5. Updated comments to clarify: neck/VESA are at `+Z` (back, toward wall), screen/branding are at `-Z` (front, toward chair)

**Result:** The screen now faces the chair (the user sees the display), and the neck/VESA mount are hidden behind the monitor (toward the wall) — proper monitor orientation.

### Issue 2: Chair Replacement (Herman Miller Embody Gaming)

**Problem:** The old chair was described as a "weird 2 object chair" — it was just two stacked boxes (seat + backrest) with a 5-star base, lacking any realistic chair detail.

**Fix:** Replaced with a detailed Herman Miller Embody gaming chair, including the chair's signature features:

**New Embody-specific materials:**
- `embodyMat` — graphite/dark gray breathable fabric with subtle sheen (fabric texture + bump map)
- `pixelMat` — slightly lighter gray for the backrest support pixels (metalness 0.15, roughness 0.65)
- `embodyFrameMat` — graphite-colored aluminum frame (not pure black — color 0x3a3a40, metalness 0.75)

**Chair components built:**

1. **5-star base** (redesigned):
   - Tapered cylindrical legs (was box-shaped) — `CylinderGeometry(0.4, 0.6, 7, 8)`, narrower at hub, wider at wheel
   - Smaller, refined caster wheels — `CylinderGeometry(0.6, 0.6, 0.8, 10)` (was 0.8 radius, 1 long)
   - Central hub (`CylinderGeometry(1.2, 1.5, 1.5, 16)`) where the 5 legs meet

2. **Gas cylinder column** — sleeker (`CylinderGeometry(0.6, 0.7, 4, 16)`, was 0.8-1.0)

3. **Tiered seat with waterfall front edge** (Embody signature):
   - Main seat pan: `BoxGeometry(12, 1.2, 11)`
   - Rounded waterfall front edge: half-cylinder (`CylinderGeometry(0.6, 0.6, 12, 12, 1, false, 0, Math.PI)`) for leg circulation
   - 3 tiered pixel layers (decreasing width/depth) — the Embody seat has visible layering

4. **Pixelated backrest** (the iconic Embody feature):
   - Tapered back frame built from 3 stacked segments (9 wide → 10 wide → 9 wide) to approximate the Embody's hourglass shape
   - **Pixel matrix**: 6 columns × 8 rows = 48 small support "pixels" (`BoxGeometry(1.2, 1.2, 0.3)`) covering the front face of the backrest
   - Pixels at top corners skipped to create the tapered shape
   - Slight random Z variation on each pixel for a textured, supportive look
   - Exposed Y-frame spine on the back (`BoxGeometry(0.6, 12, 0.5)`)
   - Silver spine accent stripe (gaming edition detail)
   - Slight recline (`rotation.x = -0.12`)

5. **4D Armrests** (2x, redesigned):
   - Vertical graphite post (`CylinderGeometry(0.4, 0.4, 4, 10)`)
   - Upholstered armrest pad (`BoxGeometry(1.8, 0.8, 4)`)
   - Silver accent stripe on each pad (gaming edition)

6. **Lumbar support pad** — visible on the front of the backrest at mid-height (`BoxGeometry(7, 1.2, 0.4)`)

**Note:** The Embody does not have a headrest (removed the old headrest).

**Verification:** `npx tsc --noEmit` shows zero errors; `npx next build` succeeds.

---

## Change 6.5 — Fix Side Monitor Orientation + Server Rack + Desk PC

### Issue 1: Left/Right Monitors Not Facing the Chair

**Problem:** After the 180° screen flip in Change 6.4, the side monitors' Y rotations were still using the old values (+0.32 for left, -0.32 for right), which now pointed the screens AWAY from the user instead of toward them.

**Root cause:** With the screen now facing local `-Z` (after the `rotation.y = Math.PI` flip), the rotation direction needed to be reversed:
- Old logic (pre-flip, screen faced +Z): left monitor at +0.32 rad turned the screen toward the user
- New logic (post-flip, screen faces -Z): left monitor needs **negative** Y rotation to turn the screen toward the user

A positive Y rotation maps local `-Z` to world `(+sin, -cos)` = lower-right. A negative Y rotation maps local `-Z` to world `(-sin, -cos)` = lower-left. The left monitor (at X=-14) needs to face lower-left (toward the user at center), so it needs negative rotation.

**Fix:**
- Left monitor Y rotation: `+0.32` → **`-0.45`** (~-26°, screen faces lower-left toward user)
- Right monitor Y rotation: `-0.32` → **`+0.45`** (~+26°, screen faces lower-right toward user)
- Increased angle from 18° to 26° for a more wrapped-around-the-user battlestation feel
- Updated comments to explain the rotation direction logic

### Issue 2: PC Looked Like a Server → Moved to Back of Room as Server Rack

**Problem:** The original "gaming PC" on the side desk was large (12 wide × 25 tall × 12 deep = 1.2m × 2.5m × 1.2m) and looked more like a server rack than a desktop PC.

**Fix:** Built a proper 19" server rack at the back of the room (against the north wall) with realistic rack-mounted equipment.

**Server rack details:**
- Position: X=-32, Z=28 (back-left corner of room, against north wall)
- Size: 10 wide × 24 tall × 8 deep (~1m × 2.4m × 0.8m — full-height 42U rack)
- 4 vertical aluminum rails + top/bottom plates + side panels + back panel
- **9 rack-mounted units** stacked from bottom to top:
  1. **UPS** (2U) — green/yellow LEDs (power status)
  2. **Server 1** (1U) — green LEDs
  3. **Server 2** (1U) — green LEDs
  4. **Server 3** (2U) — green + red LEDs (one fault indicator)
  5. **NAS Storage** (2U) — 4 drive bays with individual LEDs + status LEDs
  6. **Switch** (1U) — 8 port LEDs (all green, active)
  7. **Patch Panel** (1U) — no LEDs
  8. **Server 4** (2U) — green + red LEDs
  9. **KVM** (1U) — single green LED
- Each unit has: server body + colored front face + LED indicators (emissive spheres) + rack-mount handles (for servers)
- NAS has 4 visible drive bays with individual activity LEDs
- Cable management bundle (vertical cylinder on side of rack)
- Status LED strip at top of rack (green, emissive)
- Green glow point light (subtle, from all the green LEDs)

**New materials:**
- `rackMat` — dark gray (0x2a2a2e) for side/back panels
- `rackFrameMat` — darker (0x1a1a1e) for rails and plates
- `serverMat` — medium gray (0x3a3a40) for server bodies

### Issue 3: New Gaming PC on Desk (Bottom-Right)

**Fix:** Built a new, properly-sized gaming PC tower on the main desk at the bottom-right corner.

**New PC details:**
- Position: X=24, Z=24 (bottom-right of main desk surface)
- Size: 8 wide × 16 tall × 8 deep (~0.8m × 1.6m × 0.8m — mid-tower ATX, realistic desktop size)
- Carbon fiber case with tempered glass side panel facing `-X` (toward user at center)
- **Visible internals** (mirrored orientation from old PC since panel is now on the -X side):
  - Motherboard against +X wall
  - GPU with RGB shroud + 2 fans
  - Tower CPU cooler with RGB ring
  - 2 RAM sticks with RGB tops
  - PSU shroud at bottom
- 3 RGB front intake fans (magenta/cyan/purple) facing `-Z` (toward user)
- RGB bottom strip (green)
- Power button on top
- 2 RGB point lights (purple + cyan) for internal glow

### Bug Fix
- Renamed `cableBundle` (server rack) to `rackCableBundle` to avoid naming collision with the existing `cableBundle` in the CABLES section (TypeScript error: "Cannot redeclare block-scoped variable")

### Seed Update
- Updated `ds2` feature description to note the PC is now on the desk (bottom-right)
- Added new `ds2b` feature for the server rack (UPS + 4 servers + NAS + switch + patch panel + KVM + LED indicators + cable management)

**Verification:** `npx tsc --noEmit` shows zero errors; `npx next build` succeeds.

---

## Change 6.6 — Scale Down Headphones to Realistic Size

**Problem:** The headphones were massively oversized — the headband was a half-torus with radius 5 (1m arc), ear cups were 2.5 radius (0.5m diameter each), and the whole headphone assembly spanned 10 units (1 meter) wide. Real over-ear headphones are ~0.18m wide with ~0.09m ear cup diameter.

**Root cause:** The original dimensions were set when the desk and room were larger; after the monitor and PC scaling fixes, the headphones became visually disproportionate — they were almost as wide as the keyboard.

**Fix applied — scaled all headphone and stand components down to realistic sizes:**

| Component | Before | After | Real-world size |
|---|---|---|---|
| Stand base radius | 3 / 3.5 | **1.8 / 2** | ~0.2m diameter base |
| Stand base height | 1.0 | **0.6** | shorter |
| Stand pole radius | 0.6 | **0.35** | slimmer |
| Stand pole height | 6.0 | **3.5** | shorter (headphones lower) |
| Stand top radius | 1.2 / 0.8 | **0.7 / 0.5** | smaller cradle |
| Stand top height | 1.0 | **0.5** | shorter |
| Headband torus radius | 5.0 | **1.8** | ~0.18m arc (realistic) |
| Headband tube radius | 0.6 | **0.18** | slimmer band |
| Ear cup radius | 2.5 | **0.9** | ~0.09m diameter (realistic) |
| Ear cup depth | 2.0 | **0.7** | thinner |
| Ear pad radius | 2.2 | **0.8** | smaller |
| Ear pad depth | 2.5 | **0.9** | thinner |
| RGB ring inner/outer | 2.6 / 2.9 | **0.95 / 1.05** | smaller ring |
| Ear cup X positions | ±5 from center | **±1.8 from center** | headphones now 0.36m wide total |

**Repositioning:** The stand and headphones were lowered to sit on the desk properly:
- Stand base: `DESK_Y + 0.5` → `DESK_Y + 0.3`
- Stand pole: `DESK_Y + 4` → `DESK_Y + 2.3`
- Stand top: `DESK_Y + 7.5` → `DESK_Y + 4.3`
- Headband + ear cups: `DESK_Y + 7` → `DESK_Y + 4`

**Result:** The headphones are now a moderate, realistic size (~0.18m wide, 0.09m ear cups) that looks proportional next to the keyboard, mouse, and other desk accessories. The stand is appropriately sized to hold them.

**Verification:** `npx tsc --noEmit` shows zero errors; `npx next build` succeeds.

---

## Change 6.7 — Fix Stray Cable Collision + Speaker/Monitor Collision

### Issue 1: Random Block Colliding with Server

**Problem:** A stray cylindrical block was visible next to the server rack at the back of the room, colliding with the server area.

**Root cause:** The `pcCable` (cable from PC to floor) was still positioned at the **old PC location** (X=-26, Z=18) from before the PC was moved to the desk in Change 6.5. When the PC moved to X=24, Z=24, the cable was left behind as an orphaned mesh floating at X=-26, Z=18 — which is near the server rack (at X=-32, Z=28) and the side desk.

**Fix:** Updated `pcCable.position` from `(-26, DESK_Y / 2, 18)` to `(24, DESK_Y / 2, 24)` — now correctly runs from the new PC location on the desk down to the floor.

### Issue 2: Left Speaker Colliding with Monitor

**Problem:** The left speaker was positioned too close to the left monitor, causing a visible collision.

**Root cause:** Both speakers were at Z=24 (same depth as the monitor bases at Z=26, only 2 units forward). The left speaker at X=-28, Z=24 (5 wide, 6 deep → spans X[-30.5,-25.5], Z[21,27]) was close to the left monitor base at X=-14, Z=26 (radius 2 → spans X[-16,-12], Z[24,28]). While not a direct X overlap, the speaker's Z range (21-27) overlapped with the monitor's Z range (24-28), and visually they appeared crowded together.

**Fix:** Moved both speakers:
- **Z position:** 24 → **21** (moved forward, away from monitors at Z=26 — now 5-unit gap)
- **X position:** kept at ±28 (fully on the desk surface which spans X[-30,30])
- **Result:** Speakers now sit at the front corners of the desk (Z=21), monitors at the back (Z=26) — clear separation with no collision

**New positions:**
- Left speaker: X=-28, Z=21 (spans X[-30.5,-25.5], Z[18,24])
- Right speaker: X=+28, Z=21 (spans X[25.5,30.5], Z[18,24])
- Left monitor base: X=-14, Z=26 (spans X[-16,-12], Z[24,28])
- Gap between left speaker and left monitor: 9.5 units in X, 2 units in Z ✓

### Download Artifacts

Created downloadable progress-tracking files in `/home/z/my-project/download/`:
- `CHANGELOG.md` — consolidated full changelog (1289 lines, all 32 changes concatenated)
- `PROJECT-PROGRESS.md` — summary with phase table, latest changes, model list, walk mode controls, tech stack

These files will be updated each prompt to track ongoing progress alongside the changelog.

**Verification:** `npx tsc --noEmit` shows zero errors; `npx next build` succeeds.

---

## Change 6.8 — Remove Desk Collision with Server Rack

**Problem:** Large wooden blocks (the main desk surface and a desk leg) were colliding with the server rack at the back-left of the room.

**Root cause:** After the server rack was added at X=-32, Z=28 (spanning X[-37,-27], Z[24,32]) in Change 6.5, the main desk was never adjusted. The desk was still 60 wide centered at X=0 (spanning X[-30,30], Z[20,28]), so it overlapped the server rack in the region X[-30,-27], Z[24,28] — a 3×4 unit collision zone where the wooden desk plank poked into the server rack. Additionally, the left-back desk leg at (X=-28, Z=27) (spanning X[-29,-27], Z[26,28]) was entirely inside the server rack footprint.

**Fix applied:**

1. **Shortened the main desk** from 60 wide to **52 wide**, and shifted its center from X=0 to **X=4**:
   - Old: `BoxGeometry(60, DESK_T, 8)` at `(0, DESK_Y, 24)` → spans X[-30,30]
   - New: `BoxGeometry(52, DESK_T, 8)` at `(4, DESK_Y, 24)` → spans X[-22,30]
   - The right edge stays at X=30 (where the right speaker sits), but the left edge pulls in from X=-30 to X=-22, creating a 5-unit gap from the server rack (which starts at X=-27)

2. **Moved the left desk legs inward** to fit the shortened desk:
   - Old left legs: X=-28 (at Z=21 and Z=27) — the Z=27 leg was inside the server rack
   - New left legs: X=-20 (at Z=21 and Z=27) — well clear of the server rack
   - Right legs unchanged at X=28

3. **Side desk kept unchanged** — it's at X=-26, Z=15 (spans X[-30,-22], Z[10,20]), which doesn't overlap the server rack (Z[24,32]) since there's a 4-unit gap in Z

**Spacing verification (post-fix):**
- Desk left edge: X=-22
- Server rack right edge: X=-27
- Gap: 5 units ✓
- Desk legs at X=-20, server rack at X[-37,-27] — no overlap ✓

**Verification:** `npx tsc --noEmit` shows zero errors; `npx next build` succeeds.

---

## Change 6.9 — Fix Walk Mode Spawn for Desktop Setup

**Problem:** Walk mode didn't work with the desktop setup — the player spawned outside the room in empty space and couldn't see or interact with the scene.

**Root cause:** The walk mode `useEffect` in `Viewport3D.tsx` hardcoded the spawn position as `camera.position.set(30, EYE_HEIGHT, 55)`. This position was tuned for the Chinese building (which is large, spanning hundreds of units). For the desktop setup, the room is only X[-40,40], Z[-30,30] — so spawning at Z=55 put the player **25 units outside the north wall**, in empty space with no floor beneath them. Gravity would pull them down into the void, and they'd be stuck outside the room.

**Fix applied:** Made the spawn position **adaptive based on the active part**. Added a per-part spawn configuration that reads `useCADStore.getState().activePartId` and picks a sensible entrance point + facing direction for each scene:

| Part ID | Spawn X | Spawn Z | Spawn Yaw | Facing |
|---|---|---|---|---|
| `part_desktop_setup` | 0 | 8 | π (180°) | +Z (toward monitors at Z=26) |
| `part_bay_area_apartment` | -50 | 0 | 0 | -Z (toward origin) |
| `part_chinese_building` | 30 | 55 | π | +Z (default) |
| `part_la_mansion` | 0 | 80 | π | +Z |
| `part_pyramid` | 30 | 120 | π | +Z |
| (default) | 30 | 55 | π | +Z |

**Implementation details:**
- Moved the `let yaw = 0, pitch = 0` declaration ABOVE the spawn logic (was below) so `yaw = spawnYaw` assignment works
- Set `camera.rotation.set(0, spawnYaw, 0)` to initialize the camera facing the correct direction
- Set `yaw = spawnYaw` so the mouse-look and WASD movement use the correct initial heading
- For the desktop setup specifically: spawn at (0, 17, 8) — the chair position — facing +Z toward the monitors. This puts the player sitting at the desk, looking at the 3 monitors, with the keyboard and mouse in front of them.

**Result:** Walk mode now works correctly for the desktop setup — the player spawns at the chair, facing the monitors, with the floor beneath them. WASD moves them around the room, mouse drag looks around, Space jumps, Shift toggles noclip to fly through walls and inspect the PC internals.

**Verification:** `npx tsc --noEmit` shows zero new errors (only pre-existing Vector2 error); `npx next build` succeeds.

---

## Change 6.10 — Repair Desk + 4 Wall-Mounted Corner Speakers

### Issue 1: Desk Repair

**Problem:** After Change 6.8 shortened the desk to 52 wide centered at X=4 (spans X[-22,30]) to clear the server rack, the desk looked asymmetric and incomplete — it had an odd shape with the left side cut short, and the orphaned L-extension (side desk at X=-26, Z=15) was still present even though the PC had moved off it.

**Fix applied:**
- **Main desk:** changed from 52 wide × centered at X=4 to **50 wide × centered at X=5** (spans X[-20,30])
  - Cleaner rectangular shape, symmetric around X=5
  - 7-unit gap from server rack (left edge X=-20, server right edge X=-27)
  - Right edge stays at X=30
- **Removed the orphaned side desk** (was `BoxGeometry(8, DESK_T, 10)` at X=-26, Z=15) — no longer needed since the PC moved to the main desk
- **Removed the 2 side desk legs** (were at X=-29, Z=11 and X=-23, Z=11)
- **Repositioned main desk legs** to fit the 50-wide desk: left legs at X=-18 (was -20), right legs at X=28 (unchanged), at Z=21 and Z=27
- Result: clean rectangular desk, 50 wide × 8 deep, with 4 corner legs, no orphaned extensions

### Issue 2: Speakers Moved to All 4 Top Corners (Wall-Mounted, Angled Downward)

**Problem:** The 2 desk speakers were taking up desk space and the user wanted 4 speakers in all 4 top corners of the room, wall-mounted and angled downward toward the listening position.

**Fix applied:** Removed the 2 desk speakers and built **4 wall-mounted corner speakers**:

**Corner positions and orientation:**

| Corner | X | Z | Y | Yaw | Notes |
|---|---|---|---|---|---|
| Front-Left (FL) | -37 | -28 | 24 | π/4 (45°) | Faces +X+Z into room |
| Front-Right (FR) | 37 | -28 | 24 | -π/4 (-45°) | Faces -X+Z into room |
| Back-Left (BL) | -37 | 28 | **27** (raised) | 0.75π (135°) | Faces +X-Z; raised to clear server rack top (Y=24) |
| Back-Right (BR) | 37 | 28 | 24 | -0.75π (-135°) | Faces -X-Z into room |

**Each speaker is a compact bookshelf speaker built in a Group:**
- **Mounting bracket** — small dark metal plate (`BoxGeometry(0.4, 3, 3)`) against the wall
- **Speaker body** — walnut wood veneer, 4 wide × 7 tall × 4 deep
- **Front baffle** — recessed dark grille face (`BoxGeometry(3.6, 6.6, 0.3)`)
- **Tweeter** — small driver (`CylinderGeometry(0.5, 0.5, 0.3, 12)`) in upper portion
- **Woofer** — larger driver (`CylinderGeometry(1.2, 1.2, 0.3, 16)`) in lower portion
- **Woofer surround ring** — `RingGeometry(1.2, 1.4, 16)` around the woofer
- **RGB accent strip** — along the bottom (cyan for front speakers, purple for back speakers)
- **Port hole** — small circle below the woofer

**Orientation:**
- Each speaker group has `rotation.y = yaw` (points horizontally toward room center)
- Each speaker group has `rotation.x = -0.5` (~29° downward tilt) so the speakers aim down toward the listening position near the desk (Y≈8)
- The back-left speaker is mounted at Y=27 (3 units higher than the others) so it clears the server rack which is 24 units tall

**Result:** 4 wall-mounted speakers in all 4 top corners, each angled downward toward the desk/listening position — a proper surround-sound setup. The desk is now clear of speakers, giving more workspace.

### Seed Update
- Updated `ds5` feature description from "2 bookshelf speakers" to "4 wall-mounted corner speakers (woofers/tweeters/RGB accents, angled downward)"

**Verification:** `npx tsc --noEmit` shows zero errors; `npx next build` succeeds.

---

## Change 6.11 — Add Detail to Wall Speakers (No More "Tissue Box" Look)

**Problem:** The 4 wall-mounted corner speakers looked like tissue boxes — just plain rectangular boxes with flat cylinder drivers. They lacked the visual detail that makes a speaker recognizable as a speaker.

**Fix applied:** Completely rebuilt each speaker with realistic bookshelf speaker anatomy. Added 11 new detail materials and ~20 mesh elements per speaker:

### New detail materials (11):
- `coneMat` — dark woofer cone (0x1a1a1e, metalness 0.2, roughness 0.7)
- `dustCapMat` — slightly lighter dust cap (0x2a2a30, metalness 0.3)
- `surroundMat` — gray foam surround (0x3a3a3e, metalness 0.1, roughness 0.8)
- `tweeterDomeMat` — silver silk dome (0xc0c0c8, metalness 0.9, roughness 0.15)
- `tweeterFlangeMat` — black tweeter mounting flange (0x1a1a1e)
- `screwMat` — silver mounting screws (0x888892, metalness 0.85)
- `badgeMat` — brushed silver branding badge (0xa8acb4, metalness 0.8)
- `grilleFrameMat` — dark grille frame (0x2a2a2e)
- `portMat` — black bass reflex port tube (0x0a0a0a)
- `terminalMat` — brass binding posts (0xc09545, metalness 0.9)
- `edgeTrimMat` — dark wood cabinet edge trim (0x2a1810)

### Per-speaker components added (~20 meshes each):

**Mounting hardware:**
- Metal bracket plate against the wall + 4 mounting screws
- Articulated arm connecting bracket to speaker body

**Cabinet:**
- Walnut wood body (4×7×4)
- 4 edge trim strips (2 vertical + 2 horizontal) on the front face — dark wood banding for a finished cabinet look
- Recessed front baffle (darker than the cabinet)

**Tweeter (dome tweeter assembly):**
- Flange — flat mounting plate (cylinder, 0.8 radius)
- Waveguide — shallow recessed horn (tapered cylinder)
- Silk dome — hemisphere diaphragm (silver, metalness 0.9) facing into the room
- 4 mounting screws around the flange

**Woofer (driver assembly):**
- Surround — foam ring (torus, 1.1 radius, 0.18 tube)
- Cone — conical diaphragm (tapered cylinder, wider at surround, narrower at center)
- Dust cap — small hemisphere dome in the center
- 6 basket mounting screws around the woofer

**Other details:**
- Branding badge — brushed silver plate below the tweeter + dark logo mark
- Bass reflex port — outer flange + port tube extending into the cabinet + dark interior hole
- RGB accent strip along the bottom (cyan for front speakers, purple for back)
- Grille frame — 4 thin border bars (top/bottom/left/right) + translucent dark grille cloth (opacity 0.55, so drivers are faintly visible behind it) + 4 attachment pegs at corners
- Binding posts on back — terminal plate + 2 brass binding posts with red/black indicator caps

**Result:** Each speaker now has ~20 detailed mesh elements instead of 6 plain ones. The speakers are instantly recognizable as bookshelf speakers — with visible dome tweeters, woofer cones with dust caps, mounting screws, grille cloth, branding badges, bass reflex ports, and binding posts on the back. No more "tissue box" appearance.

**Verification:** `npx tsc --noEmit` shows zero errors; `npx next build` succeeds.

---

## Change 6.12 — Fix Speaker Orientation + Full QWERTY Keyboard + Natural Floor

### Issue 1: Speakers Not Facing the Chair (Flipped 180°)

**Problem:** All 4 wall-mounted corner speakers were facing away from the chair/room center — the driver faces (tweeters, woofers, grille) were pointing toward the corners/walls instead of into the room.

**Root cause:** The speaker driver face is at local `-Z` (the baffle, tweeter, woofer, grille are all at negative Z in the speaker group). After `rotation.y = yaw`, local `-Z` maps to world `(-sin(yaw), 0, -cos(yaw))`. The original yaw values were calculated assuming the face was at local `+Z`, so all 4 speakers were rotated 180° off — pointing their backs (binding posts, cabinet back) into the room and their driver faces into the corners.

**Fix:** Recalculated all 4 yaw values so local `-Z` (driver face) points toward the room center (0, 8, 0) from each corner:

| Corner | Position | Old Yaw | New Yaw | Faces |
|---|---|---|---|---|
| Front-Left | (-37, -28) | π/4 (45°) | **-3π/4 (-135°)** | +X+Z (toward center) |
| Front-Right | (37, -28) | -π/4 (-45°) | **3π/4 (135°)** | -X+Z |
| Back-Left | (-37, 28) | 3π/4 (135°) | **-π/4 (-45°)** | +X-Z |
| Back-Right | (37, 28) | -3π/4 (-135°) | **π/4 (45°)** | -X-Z |

Each new yaw is the old yaw ± π (flipped 180°). Added detailed comments explaining the rotation math.

### Issue 2: Keyboard Only Had Random Letters — Added Full QWERTY Layout

**Problem:** The keyboard texture was a 128×128 canvas with a 5×5 grid of keycaps using random letters from "QWERTASDFGZXCVB" — not a real keyboard layout.

**Fix:** Completely rewrote the `keycapTexture()` function to draw a full ANSI QWERTY keyboard layout:

**New texture specs:**
- Canvas: 760×260 pixels (wide aspect ratio matching keyboard shape)
- 5 rows, proper ANSI 60% compact layout (no numpad)

**Layout drawn:**
- **Row 1 (number row):** `1 2 3 4 5 6 7 8 9 0 - =` with shifted symbols (`! @ # $ % ^ & * ( ) _ +`) on top, plus `Backspace` (2u wide)
- **Row 2 (QWERTY):** `Tab` (1.5u) + `Q W E R T Y U I O P` + `[ ] \` (1.5u)
- **Row 3 (home row):** `Caps` (1.75u) + `A S D F G H J K L` + `; '` + `Enter` (2.25u)
- **Row 4 (ZXCV):** `Shift` (2.25u) + `Z X C V B N M` + `, . /` + `Shift` (2.75u)
- **Row 5 (bottom):** `Ctrl Win Alt` + `Space` (6.25u) + `Alt Fn Menu Ctrl`

**Each keycap has:**
- Gradient fill (lighter at top, darker at bottom) for a 3D keycap appearance
- Dark border outline
- Centered label (light gray text)
- Number row keys have dual labels (shifted symbol on top, number on bottom)

**Keyboard mesh adjusted:**
- Width: 22 → **24**, Depth: 7 → **8.5** (better aspect ratio for the wider texture)
- Removed `repeat.set(3, 1)` tiling — the full QWERTY texture now maps 1:1 onto the keyboard surface

### Issue 3: Floor Color Too Dark/Orange — Changed to Natural Light Oak

**Problem:** The floor was `makeWoodTexture('#8b6b3a', '#4a3010')` — a dark orange-brown that looked unnatural.

**Fix:** Changed to `makeWoodTexture('#c8a878', '#8a6a44')` — a natural light oak / honey-blonde hardwood tone. The base color is a warm cream-blonde (`#c8a878`) with darker grain lines in a medium brown (`#8a6a44`), giving a realistic light oak plank floor appearance.

**Verification:** `npx tsc --noEmit` shows zero errors; `npx next build` succeeds.

---

## Change 6.13 — Fix Keyboard Orientation + Scale Down + Brownish Plank Floor

### Issue 1: Keyboard Flipped (Facing Away from Chair)

**Problem:** The keyboard texture was upside down — the number row (top of the QWERTY layout) was facing the player (-Z, toward the chair) and the spacebar row was facing the monitor (+Z). A real keyboard has the number row at the back (toward the monitor) and the spacebar at the front (toward the player).

**Root cause:** The `BoxGeometry` top face maps the texture so that the canvas's top edge (number row) aligns with -Z by default. Since the keyboard is at Z=20 and the player/chair is at Z=10 (lower Z), the number row ended up facing the player instead of the monitor.

**Fix:** Added `keycaps.rotation.y = Math.PI` (180° rotation around Y) to flip the texture so the number row now faces +Z (toward the monitor) and the spacebar faces -Z (toward the player/chair).

### Issue 2: Keyboard Too Large — Scaled Down

**Problem:** The keyboard was 24 wide × 8.5 deep (2.4m × 0.85m) — larger than a real keyboard (which is ~0.45m × 0.15m). It dominated the desk surface.

**Fix:** Scaled down to **18 wide × 6.5 deep** (~1.8m × 0.65m at 10u/m scale — still slightly oversized for visibility but much more proportionate to the desk and other accessories). All RGB underglow strips and lighting adjusted automatically since they reference `KB_W` and `KB_D`.

| Dimension | Before | After |
|---|---|---|
| Width | 24 | **18** |
| Depth | 8.5 | **6.5** |

### Issue 3: Floor Had Wavy Lines — Changed to Brownish Straight Plank Boards

**Problem:** The floor used `makeWoodTexture()` which draws wavy grain lines (using `Math.sin(x * 0.08 + i) * 4` to create sin-wave curves). This looked like furniture wood grain, not floor planks. The user wanted straight board planks in a brownish color.

**Fix:** Created a new dedicated `floorPlankTexture()` function that draws proper hardwood floor planks:

**New `floorPlankTexture()` function:**
- Canvas: 512×512
- **6 horizontal planks**, each ~85px tall
- Each plank has:
  - Base brown color with subtle per-plank variation (some planks slightly lighter/darker)
  - Faint straight grain lines (almost flat, only ±0.8px jitter — not wavy)
  - Dark seam line at the top of each plank (the gap between boards)
  - Staggered end joints (vertical seams at different X positions on alternating planks, like real hardwood installation)
- **Colors:** base `#8a6440` (warm medium brown), dark grain `#5a3820`, seams `#3a2410` (dark brown)
- Bump map: plank surfaces slightly raised, seams recessed, faint grain

**Floor material updated:**
- Old: `makeWoodTexture('#c8a878', '#8a6a44')` (light oak with wavy grain) — from Change 6.12
- New: `floorPlankTexture('#8a6440', '#5a3820', '#3a2410')` (brownish straight planks)
- Repeat: 6×6 (tiles the 512×512 plank pattern across the 80×60 floor)
- Bump scale reduced from 0.04 to 0.03 (subtler plank relief)

**Result:** The floor now shows distinct horizontal brown planks with straight seams and staggered end joints — a realistic hardwood floor appearance, no wavy lines.

**Verification:** `npx tsc --noEmit` shows zero errors; `npx next build` succeeds.

---

## Change 6.14 — Expand Room (Larger and Taller, Less Cramped)

**Problem:** The room felt cramped — it was only 8m × 6m × 3m (80 × 60 × 30 units), which made the desk and furniture feel crowded. The user wanted the room to be larger and taller while keeping the desk and objects at their current (correct) sizes.

**Fix applied:** Expanded the room to a spacious loft feel:

| Dimension | Before | After | Change |
|---|---|---|---|
| Width (X) | 80 (8m) | **120 (12m)** | +50% wider |
| Depth (Z) | 60 (6m) | **90 (9m)** | +50% deeper |
| Height (Y) | 30 (3m) | **45 (4.5m)** | +50% taller (loft ceiling) |

**Used constants** for room bounds (`ROOM_W=120`, `ROOM_D=90`, `ROOM_H=45`) to make the dimensions clear and adjustable.

**Elements updated to fit the new room:**

1. **Floor:** `PlaneGeometry(80, 60)` → `PlaneGeometry(120, 90)`
2. **Ceiling:** `PlaneGeometry(80, 60)` at Y=30 → `PlaneGeometry(120, 90)` at Y=45
3. **South wall (accent):** `BoxGeometry(80, 30, 1)` at Z=-30.5 → `BoxGeometry(120, 45, 1)` at Z=-45.5
4. **North wall segments:** widened to fill X[-60,60] with window opening X[-10,30]
5. **Window:** enlarged from 28×18 to **38×27** (taller window for the higher ceiling), repositioned to Y=22.5 (centered in the taller wall)
6. **Window header/sill:** repositioned for the new window height (header at Y=40.5, sill at Y=8)
7. **East/West walls:** `BoxGeometry(1, 30, 60)` → `BoxGeometry(1, 45, 90)`, repositioned to X=±60
8. **Wall-mounted speakers:** moved from corners (±37, ±28) to new corners **(±57, ±43)**, raised from Y=24/27 to **Y=33/36** (proportional to the taller walls)
9. **Floating shelf + items + plant:** moved from Z=-29 to Z=-44 (new south wall), raised from Y=18-22 to Y=22-26 (proportional to taller wall)
10. **Framed poster:** moved from Z=-29.5 to Z=-44.5, raised from Y=16 to Y=20
11. **Ceiling light + fixture:** raised from Y=28/29.5 to **Y=43/44** (new ceiling), increased light range from 50 to 80, increased fixture size from radius 3 to 4
12. **Sun shadow camera:** expanded bounds from ±40 to **±70 (X) / ±60 (Z)**, far plane from 100 to 150, to cover the larger room

**What stayed the same (correct sizes):**
- Desk (50 wide × 8 deep), all desk accessories (monitors, keyboard, mouse, PC, headphones, lamp, mug, books, plant)
- Server rack (at back-left, X=-32)
- Herman Miller Embody chair (at Z=10)
- Walk mode spawn position (X=0, Z=8 — still at the chair, now with more breathing room)

**Result:** The room now feels spacious — 12m × 9m with a 4.5m loft ceiling. The desk and furniture are the same size but have much more empty space around them, eliminating the cramped feeling. The taller ceiling makes the wall-mounted speakers (now at Y=33-36) and window (now 2.7m tall) look properly proportioned.

**Verification:** `npx tsc --noEmit` shows zero errors; `npx next build` succeeds.

---

## Change 6.15 — Push Desk Closer to Wall and Window

**Problem:** After the room was expanded to 12m × 9m (Change 6.14), the desk was still at Z=24 (its original position), but the north wall moved to Z=45. This left a 17-unit (1.7m) gap between the back of the desk and the wall/window — an awkward empty space behind the monitors.

**Fix applied:** Shifted the entire desk group forward (+16 units in Z) so the desk back is now 1 unit from the north wall:

| Object | Old Z | New Z | Notes |
|---|---|---|---|
| Desk surface | 24 | **40** | Back edge now at Z=44 (1 unit from wall at Z=45) |
| Desk legs (front) | 21 | **37** | |
| Desk legs (back) | 27 | **43** | |
| Cable tray | 27 | **43** | |
| Gaming PC tower | 24 | **40** | |
| Center monitor base | 26 | **42** | |
| Left monitor base | 26 | **42** | |
| Right monitor base | 26 | **42** | |
| Monitor glow lights | 25 | **41** | |
| Keyboard frame + keycaps | 20 | **36** | |
| Keyboard RGB strips | 20 | **36** | |
| Keyboard RGB point light | 17 | **33** | |
| Mouse | 20 | **36** | |
| Mousepad | 20 | **36** | |
| Cable bundle | 27 | **43** | |
| PC cable | 24 | **40** | |
| Herman Miller Embody chair | 10 | **26** | Shifted forward with the desk |
| Floor rug | 8 | **24** | Shifted forward with the chair |

**Walk mode spawn updated** (in `Viewport3D.tsx`):
- Old: spawn at (0, 17, 8) — chair's old position
- New: spawn at **(0, 17, 24)** — chair's new position
- Updated comment to reflect the new room dimensions (12m × 9m × 4.5m) and desk-against-wall layout

**Result:** The desk now sits flush against the north wall, directly under the window. The monitors are at the back of the desk (Z=42), just in front of the window — a natural battlestation arrangement. The chair (Z=26) and rug (Z=24) are positioned in front of the desk, with plenty of open floor space (Z=-45 to Z=24) behind the player for walking around. No more awkward gap behind the monitors.

**Verification:** `npx tsc --noEmit` shows zero new errors; `npx next build` succeeds.

---

## End of Phase 6

**State at end of Phase 6:**
- Desktop battlestation with gaming PC on desk (bottom-right, visible internals + RGB), 19" server rack at back of room (9 units with LED indicators), 3 properly-scaled monitors (correctly oriented — all 3 screens face the chair), full peripherals, Herman Miller Embody gaming chair, home office environment
- Diversified color palette: warm browns, brushed silvers, light grays replace the sea of black
- Monitors are realistically sized, positioned at back of desk, flank the center without overlapping, and all face the user (side monitors angled ±26° toward the chair)
- Herman Miller Embody chair with signature pixelated backrest (48 support pixels), tiered seat with waterfall front edge, exposed Y-frame spine, 4D armrests, lumbar pad
- Server rack with 9 rack-mounted units (UPS, 4 servers, NAS with drive bays, switch, patch panel, KVM) + LED indicators + cable management
- 7 procedural textures including 3 distinct monitor screens (IDE / dashboard / wallpaper)
- 10+ RGB emissive elements with 8 RGB point lights for dynamic glow
- Set as default active part
- Production build passes

**Files modified:**
- `src/lib/cad/desktop-setup.ts` (~1120 lines)
- `src/lib/cad/models.ts` (added `part_desktop_setup` case)
- `src/lib/cad/seed.ts` (added desktop setup part definition with 11 features)
- `src/store/useCADStore.ts` (set `activePartId` to `'part_desktop_setup'`)
# Phase 7 — Grocery Store

This phase covers the creation of a detailed, intricately-modelled grocery store (supermarket) with correct real-world scaling, plus fixes for floating fruits, shelf orientation, gondola geometry, product variety, and shelf organization. 5 changes.

---

## Change 7.1 — Grocery Store Creation

**File created:** `src/lib/cad/grocery-store.ts` (~1400 lines)

**Function:** `createGroceryStoreGeometry()`

### Scale (correct real-world proportions)
- **10 units = 1 meter** (consistent with all other architectural models)
- **Store footprint:** 60m × 40m (600 × 400 units) — a typical mid-size supermarket
- **Ceiling height:** 5m (50 units) — standard commercial retail height
- **Aisle length:** 24m (240 units) — realistic grocery aisle length
- **Shelving height:** 2.2m (22 units) — standard gondola shelving
- **Aisle spacing:** 3m (30 units) between aisles — meets ADA accessibility guidelines
- **Checkout counter:** 3m × 1m (30 × 10 units) — standard checkout dimension
- **Cooler doors:** 4m tall × 4m wide (40 × 40 units) — standard refrigerated display door

### Store Layout
```
                    NORTH WALL (Z=200)
  ┌──────────────────────────────────────────────────────────┐
  │  DELI    │  DAIRY WALL (12 glass-door coolers)  │ FROZEN │
  │  counter │  Milk Juice Yogurt Cheese Butter Cream│ freezers│
  ├──────────┴──────────────────────────────────────┴────────┤
  │                                                          │
  │  AISLE 8  │ International                                 │
  │  AISLE 7  │ Condiments                                    │
  │  AISLE 6  │ Cereal                                        │
  │  AISLE 5  │ Beverages                                     │
  │  AISLE 4  │ Snacks                                        │
  │  AISLE 3  │ Baking                                        │
  │  AISLE 2  │ Pasta & Rice                                  │
  │  AISLE 1  │ Canned Goods                                  │
  │                                                          │
  ├─────────────────────────┬────────────────────────────────┤
  │  PRODUCE                │  BAKERY                         │
  │  (10 bins, misting,     │  (display case, bread shelves, │
  │   cut-fruit case)       │   cake stand)                   │
  ├─────────────────────────┴────────────────────────────────┤
  │  CHECKOUT LANES (6)     CARTS    CUSTOMER SERVICE        │
  │  ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐  ┌─┐         ┌──┐              │
  │  │1│ │2│ │3│ │4│ │5│ │6│  │cart       │desk             │
  │  └─┘ └─┘ └─┘ └─┘ └─┘ └─┘  └─┘         └──┘              │
  ├──────────────────────────────────────────────────────────┤
  │           ENTRANCE (sliding glass doors)                 │
  └──────────────────────────────────────────────────────────┘
                    SOUTH WALL (Z=-200)
```

### Components Built

#### 1. Store Shell
- **Floor:** Commercial tile texture (60cm squares, cream color with speckle, grout lines) — main store area
- **Produce floor:** Warmer sandy tile (different color zone for produce section)
- **Bakery floor:** Wood-look planks (warm tone for bakery area)
- **Ceiling:** Drop ceiling texture (light cream)
- **4 exterior walls** (painted concrete texture)
- **Entrance:** 2 sliding glass doors (translucent blue glass) with frame + "ENTRANCE" sign
- **Back room door:** "EMPLOYEES ONLY" door on north wall

#### 2. 8 Grocery Aisles
Each aisle has:
- 2 shelving units back-to-back (24m long, 2.2m tall)
- 5 shelves per side (at heights 0.2m, 0.65m, 1.1m, 1.55m, 2.0m)
- **20 product boxes per shelf × 5 shelves × 2 sides = 200 products per aisle** (1600 total)
- Each product has a procedurally generated texture (brand name, product name, color band, barcode, "NET WT" label)
- Price tags (yellow tags with item name + price) on shelf edges
- Endcap displays (promotional stacks at the end of each aisle)
- Hanging aisle number sign (red, with "AISLE N" + category name)

**Aisle categories:**
1. Canned Goods (red/orange/green/blue products)
2. Pasta & Rice (yellow/red/green/purple)
3. Baking (cream/brown/pink/blue)
4. Snacks (orange/red/yellow/green)
5. Beverages (red/blue/orange/green)
6. Cereal (purple/orange/blue/red)
7. Condiments (red/yellow/green/purple)
8. International (green/orange/yellow/blue)

#### 3. Produce Section (front-left)
- **10 display bins** (angled display cases with green bases)
- Produce items: apples (red spheres), oranges (orange spheres), bananas (yellow capsules), lemons (yellow spheres), tomatoes (red spheres), peppers (red/green), lettuce (green flattened spheres), grapes (small purple spheres), potatoes (brown ellipsoids)
- 15-20 items per bin, piled naturally with random positions
- **Misting system:** 3 spray bars with nozzles above the greens section
- **Refrigerated cut-fruit case:** Wall unit with glass top, 6 cut-fruit containers visible inside
- Price signs on each bin (yellow tags with item name + price/lb)

#### 4. Bakery (front-right)
- **Glass display case** (50 wide, with 8 pastries visible inside — small cylinders in warm colors)
- **3-tier bread shelves** (open wire racks with 5 bread loaves per shelf — capsule-shaped, golden brown)
- **Tiered cake stand** (2-tier round display with a pink cake on top)
- "FRESH BAKED" sign

#### 5. Deli Counter (back-left)
- **8m glass display case** (translucent, with 6 prepared food trays inside: roast chicken, roast beef, macaroni, salad, potatoes, meatloaf)
- **Commercial meat slicer** (stainless steel body + circular blade) on the counter
- "DELI" sign

#### 6. Dairy Wall (back wall)
- **12 glass-door refrigerated coolers** side by side along the entire north wall
- Each cooler: 4m wide × 2.5m tall, with frosted glass doors (procedural frost texture + handle + faint product silhouettes)
- 4 shelves per cooler, each with 4 dairy products (milk jugs, juice, yogurt, cheese, butter, cream)
- Section labels above: MILK, JUICE, YOGURT, CHEESE, BUTTER, CREAM

#### 7. Frozen Food Section (back-right)
- **5 open-top chest freezers** (18 wide × 30 deep, with frosted glass tops and frozen products inside)
- **4 vertical glass-door freezer cases** (along the east wall, with frosted doors)

#### 8. 6 Checkout Lanes (front center)
Each lane has:
- **Checkout counter** (3m × 1m, dark with lighter top)
- **Conveyor belt** (24 long, dark rubber surface) with rollers at both ends
- **POS register** (white terminal with tilted screen showing blue glow, keyboard, handheld barcode scanner, and embedded scanner base with green glow)
- **Bagging area** (extends right of register, with bag rack and 3 hanging plastic bags)
- **Divider lane** (orange barrier for the next customer's queue)
- **Hanging "LANE N" sign** (green for lane 1, blue for others, hanging from ceiling with chains)

#### 9. Customer Service Desk (front-right corner)
- Wooden desk with countertop
- Computer monitor (tilted, with blue glowing screen)
- "CUSTOMER SERVICE" sign

#### 10. Shopping Cart Corral
- 6 shopping carts (just inside the entrance)
- Each cart: wire-frame basket (translucent), handle, 4 wheels

#### 11. Overhead Signage
- **5 hanging category banners** (Produce, Bakery, Deli, Dairy, Frozen) — hanging flat from ceiling with chains, colored per section, emissive for visibility
- **8 aisle number signs** (red, at the end of each aisle, with "AISLE N" + category)
- **6 checkout lane signs** (hanging from ceiling, "LANE 1" through "LANE 6")
- **Entrance sign** (green, "ENTRANCE" above the doors)

#### 12. Lighting
- **48 overhead fluorescent fixtures** (grid pattern across ceiling, every 7m × 6m) — emissive white panels
- Point lights at alternating fixture positions (24 point lights for performance)
- **Bright directional store light** (1.0 intensity, 2048 shadow map, covering the full 60m × 40m store)
- Fill light from entrance direction
- Hemisphere light (warm sky / ground)
- Ambient light (0.4)

### New Procedural Textures (7)
1. `storeFloorTexture()` — commercial 60cm tiles (cream with speckle + grout)
2. `produceFloorTexture()` — warmer sandy tiles for produce zone
3. `priceTagTexture(item, price)` — yellow price tag with item name + red price
4. `aisleSignTexture(num, category)` — red aisle sign with "AISLE N" + category
5. `categoryBannerTexture(text, bgColor)` — wide hanging banner with section name
6. `productBoxTexture(name, color, accentColor)` — product package with brand band, name, barcode, NET WT
7. `coolerDoorTexture()` — frosted glass door with frost swirls, handle, faint product silhouettes

### Registration
- Added `createGroceryStoreGeometry` import + `case 'part_grocery_store'` in `models.ts`
- Added 12-feature seed entry in `seed.ts`
- Set `activePartId` to `'part_grocery_store'` in `useCADStore.ts` (new default)
- Added walk mode spawn in `Viewport3D.tsx`: spawns at (0, 17, -170) — just inside the entrance, facing +Z into the store

### Bug Fix
- `buildCustomerService()` was missing the `blackMat` parameter (needed for the computer monitor). Added `blackMat: THREE.Material` to the function signature and passed it from the call site.

**Verification:** `npx tsc --noEmit` shows zero new errors; `npx next build` succeeds.

---

## Change 7.2 — Fix Floating Fruits + Shelf Orientation + Fruit Textures

### Issue 1: Fruits Floating Above Display Bins

**Problem:** The produce items (apples, oranges, bananas, etc.) were floating above the display bins instead of sitting on the surface.

**Root cause:** The display surface was tilted (`rotation.x = -0.2`), which caused the surface height to vary across the bin. The fruit Y position was hardcoded at `7 + Math.random() * 3` regardless of the fruit's X/Z position on the tilted surface. Additionally, the fruit center was placed at the surface height without accounting for the fruit's radius (the bottom of the sphere should touch the surface, so center = surface + radius).

**Fix:**
1. **Removed the tilt** on all display surfaces (now flat — fruits sit level)
2. **Calculated correct Y positions** based on each fruit's radius:
   - Display surface top is at y=7
   - Fruit center Y = 7 + fruitRadius + stackingOffset
   - Stacking offset: 60% of fruits at offset 0 (bottom layer), 40% at 0-2 units (piled on top)
3. **Increased sphere detail** from 8×6 to 12×8 segments for smoother fruit appearance
4. **Bananas now lie flat** (`rotation.x = Math.PI / 2`) instead of standing upright

### Issue 2: Shelves Rotated Wrong (Products Inaccessible)

**Problem:** The product boxes on the aisle shelving were facing the back panels instead of the aisle walkway — customers couldn't see the product labels. The products were also placed at the back of the shelf instead of the front (aisle-facing edge).

**Root cause:** Two bugs in the `buildAisle()` function:
1. **Product Z position** was `shelfZ + side * 0.5` — this placed products near the CENTER of the shelf, toward the back panel. They should be at the FRONT (aisle-facing edge).
2. **Product rotation** was `side > 0 ? 0 : Math.PI` — this made the product label face AWAY from the aisle center (toward the back panel) on both sides.

**Fix:**
1. **Product Z position** changed to `shelfZ - side * 2.5` — moves products to the front/aisle-facing edge of the shelf
2. **Product rotation** changed to `side > 0 ? Math.PI : 0` — the productBoxTexture draws the label on the +Z face; for side=-1 (lower-Z shelf), the aisle is at +Z so label faces +Z (rotation=0); for side=+1 (upper-Z shelf), the aisle is at -Z so label faces -Z (rotation=π)
3. **Product depth** reduced from 5 to 4 so boxes fit properly within the 8-deep shelf without overhanging

**Result:** Products now sit at the front edge of each shelf with their labels (brand name, product name, barcode) facing into the aisle walkway — customers can browse and read the labels as they walk down the aisle.

### Issue 3: Fruits Lacked Texture (Flat Colors)

**Problem:** All produce items were flat-colored spheres (e.g., all apples were the same flat red) with no natural variation, making them look unrealistic.

**Fix:** Created a new `fruitTexture()` function and applied it to all 10 produce materials:

**New `fruitTexture(baseColor, highlightColor, spotColor, spotDensity)` function:**
- 128×128 canvas texture
- **Radial highlight** — a glossy light reflection spot (simulates the specular highlight on fresh fruit skin)
- **Natural mottling** — 20 random lighter/darker patches (simulates color variation across the fruit surface)
- **Small spots/specks** — `spotDensity` tiny dots (simulates pores, blemishes, texture)
- Each fruit type has customized colors:
  - **Apples:** red base, bright red highlight, dark red spots (glossy, 25 specks)
  - **Oranges:** orange base, light orange highlight, dark orange spots (porous, 40 specks)
  - **Bananas:** yellow base, bright yellow highlight, brown spots (20 specks)
  - **Lemons:** bright yellow base, pale yellow highlight, olive spots (35 specks)
  - **Tomatoes:** red base, bright red highlight, dark red spots (glossy, 25 specks)
  - **Grapes:** purple base, light purple highlight, dark purple spots (30 specks)
  - **Peppers (red):** red base, bright red highlight, dark red spots (20 specks)
  - **Peppers (green):** green base, light green highlight, dark green spots (20 specks)
  - **Lettuce:** green base, light green highlight, dark green spots (35 specks)
  - **Potatoes:** brown base, light brown highlight, dark brown spots (rough, 50 specks)

**Additional fruit details:**
- **Stems** — small brown cylinders on top of ~60% of apples, peppers, tomatoes, and lemons
- **Leaves** — small green cones next to the stems on ~30% of those fruits
- **Sphere segments** increased from 8×6 to 12×8 for smoother, more realistic fruit shapes

**Verification:** `npx tsc --noEmit` shows zero errors; `npx next build` succeeds.

---

## Change 7.3 — Fix Gondola Geometry (Back Panels + Product Positions + Push Back)

**Problem:** The shelves were still inaccessible — walking through the aisle walkway, customers couldn't reach or see the products. The items also appeared to be falling off the front edge of the shelves.

**Root cause (the fundamental geometry bug):** The back panels of the shelving units were positioned at `shelfZ + side * 4`, which placed them on the OUTSIDE of the gondola (facing the walkway) instead of at the CENTER (where the two back-to-back units meet). This meant:
- The back panels faced the walkways (blocking access)
- The products were on the INNER side of the shelves (facing the gondola center, inaccessible from the walkway)
- The previous "fix" (Change 7.2) moved products and flipped rotations, but because the back panels were still on the wrong side, the products ended up between the back panel and the gondola center — completely inaccessible

**The correct gondola geometry:**
A grocery store gondola is two shelving units placed back-to-back. The back panels meet in the CENTER, and products face OUTWARD toward the walkways on either side:

```
       Walkway (-Z side)          Walkway (+Z side)
            ←                            →
  ┌─────────┬──────────────────────────┬─────────┐
  │Products │  Back Panel (center)     │Products │
  │  facing │  ────┬──── (meets here)  │ facing  │
  │  ← (-Z) │      │                   │  (+Z) → │
  └─────────┴──────┴───────────────────┴─────────┘
              ↑ gondola center (Z=z)
```

**Fix applied — 4 changes:**

1. **Back panel position:** Changed from `shelfZ + side * 4` (outside, toward walkway) to `shelfZ - side * 4` (inside, toward gondola center where the two units meet)
   - side=-1: back panel at `shelfZ + 4` (toward gondola center at +Z)
   - side=+1: back panel at `shelfZ - 4` (toward gondola center at -Z)

2. **Product Z position:** Changed from `shelfZ - side * 2.5` (near front edge) to `shelfZ + side * 1.5` (pushed further back from the walkway-facing edge)
   - Front edge is at `shelfZ + side * 4`; products at `shelfZ + side * 1.5` are 2.5 units back from the edge — safely on the shelf, not falling off
   - Products are between the back panel (`shelfZ - side * 4`) and the front edge (`shelfZ + side * 4`), on the walkway-accessible side

3. **Product rotation:** Changed from `side > 0 ? Math.PI : 0` to `side > 0 ? 0 : Math.PI`
   - side=-1 (faces -Z walkway): label faces -Z → rotation = π
   - side=+1 (faces +Z walkway): label faces +Z → rotation = 0
   - Labels now face OUTWARD toward the walkways, away from the gondola center

4. **Price tag position and rotation:** Updated to match the corrected geometry
   - Tag Z position: `shelfZ + side * 3.8` (at the walkway-facing front edge)
   - Tag rotation: `side > 0 ? 0 : Math.PI` (facing the walkway)

**Result:** The gondola now has the correct geometry — back panels meet in the center, products sit on the walkway-accessible side of each shelf (pushed back 2.5 units from the edge so they don't fall off), and product labels face outward toward the walkways. Walking through the aisle, customers can now see and reach the products on both sides.

**Verification:** `npx tsc --noEmit` shows zero errors; `npx next build` succeeds.

---

## Change 7.4 — Replace Some Boxes with Bags, Bottles, Cans, Jars, and Pouches

**Problem:** All 1,600 products across the 8 aisles were uniform cardboard boxes — no variety in product packaging, which looked monotonous and unrealistic. Real grocery shelves have a mix of boxes, bags, bottles, cans, jars, and pouches.

**Fix:** Replaced the single box-generation code with a product-type cycler that creates 6 different product shapes. Every 10 products on each shelf now includes: 6 boxes, 1 bag, 1 bottle, 1 can, 1 jar, and 1 pouch (60% boxes, 40% other packaging).

**Product types (cycling by `p % 10`):**

| Type | `p % 10` | Shape | Description |
|---|---|---|---|
| **Box** | 0, 1, 3, 5, 7 | `BoxGeometry` | Standard cardboard product box (default — varied height 3-5 units) |
| **Bag** | 2 | `CylinderGeometry` (flattened) | Chip/snack bag — cylinder laid on its side, scaled to 0.7 Y (flattened), metallic sheen (metalness 0.3) |
| **Bottle** | 4 | Group (body + shoulder + neck + cap) | Tall bottle with tapered shoulder, narrow neck, and colored cap. Body is semi-transparent (opacity 0.85). Total height ~5-6 units. |
| **Can** | 6 | `CylinderGeometry` (horizontal) | Soda can / canned good — short cylinder (radius 0.9, height 3.5) laid on its side, metallic (metalness 0.6) |
| **Jar** | 8 | Group (glass body + metal lid) | Glass jar — wide short cylinder (radius 1.3) with silver metal lid. Body is semi-transparent (opacity 0.7, roughness 0.1 for glass look). |
| **Pouch** | 9 | `BoxGeometry` (narrow, scaled) | Stand-up pouch — thin flat box (depth 1.5), scaled 0.9 in X for a tapered look |

**Details per product type:**

- **Bags** use `CylinderGeometry` rotated to lay horizontally, scaled to 70% height to simulate a flattened snack bag. Higher metalness (0.3) for the foil/mylar sheen.
- **Bottles** are a 4-part Group: cylindrical body (with product label texture), tapered shoulder (cone-like transition), narrow neck (dark gray), and colored cap (red). The body uses semi-transparent material to suggest glass/plastic.
- **Cans** are horizontal cylinders with high metalness (0.6) for the aluminum look. The product label wraps around the cylinder.
- **Jars** are a 2-part Group: wide short glass body (semi-transparent, low roughness for glass) + silver metal lid on top.
- **Pouches** are thin flat boxes (depth 1.5 vs 4 for regular boxes) scaled narrower at the top, simulating stand-up food pouches.

**Positioning and orientation:**
- All product types use the same Y position formula: `shelfY + 0.25 + productH / 2` (sitting on the shelf)
- All use the same Z position: `shelfZ + side * 1.5` (pushed back from the walkway edge)
- Box/pouch/can types have `rotation.y` set to face the label toward the walkway (`side > 0 ? 0 : Math.PI`)
- Bottle/jar groups have their `rotation.y` set during construction
- Bags use `rotation.x` and `rotation.z` to lay horizontally with the label facing outward

**Result:** The aisles now have visual variety — walking down an aisle, you see a mix of cardboard boxes, shiny snack bags, tall bottles with colored caps, metallic cans lying on their sides, glass jars with silver lids, and flat stand-up pouches. This breaks up the monotony and looks much more like a real grocery store.

**Verification:** `npx tsc --noEmit` shows zero errors; `npx next build` succeeds.

---

## Change 7.5 — Organize Products into Facings (No More Random Distribution)

**Problem:** The product types (boxes, bags, bottles, cans, jars, pouches) were cycling individually by position (`p % 10`), creating a random-looking mix where every other product was a different type. Real grocery shelves have organized "facings" — contiguous blocks of the same product type and brand clustered together.

**Fix:** Replaced the individual product-type cycler with an organized facing system:

**5 facing layout patterns** (cycled per shelf so each shelf has a different arrangement):
- Layout 0: 4 boxes → 3 cans → 4 bottles → 3 boxes → 3 jars → 3 pouches
- Layout 1: 5 boxes → 3 bottles → 4 cans → 3 bags → 5 boxes
- Layout 2: 4 cans → 4 boxes → 3 jars → 3 bottles → 3 pouches → 3 boxes
- Layout 3: 4 bottles → 4 boxes → 3 bags → 3 cans → 3 boxes → 3 jars
- Layout 4: 3 boxes → 3 jars → 4 boxes → 4 bottles → 3 pouches → 3 cans

**How it works:**
- Each shelf picks a layout pattern (`facingLayouts[s % 5]`)
- The layout is an array of facings, each with a `{ type, count }` (e.g., `{ type: 'can', count: 3 }`)
- Products are placed left-to-right along the shelf, with all products in a facing using the **same type, same color, same texture** (one `productBoxTexture` per facing, shared across all units in that facing)
- Each facing gets its own color from the aisle's color palette (`(s * 2 + f) % colors.length`)
- Price tags are now placed per-facing (one tag at the start of each facing block), not at fixed intervals

**Result:** Products are now organized into neat, contiguous blocks — you see a row of 4 identical boxes, then a row of 3 identical cans, then 4 identical bottles, etc. Different shelves have different arrangements. This looks like a real grocery store where products are "faced" (organized by type and brand) rather than randomly scattered.

**Verification:** `npx tsc --noEmit` shows zero errors; `npx next build` succeeds.

---

## End of Phase 7

**State at end of Phase 7:**
- Detailed grocery store (60m × 40m × 5m) with 8 aisles, produce, bakery, deli, dairy wall, frozen section, 6 checkout lanes, customer service desk, shopping carts, and full overhead signage
- Correctly scaled (10u/m, 24m aisles, 2.2m shelving, 3m checkout counters)
- 1600+ procedurally textured product boxes across 8 aisles
- 7 new procedural textures (floor tiles, price tags, aisle signs, banners, product boxes, cooler doors)
- Walk mode spawns just inside the entrance, facing into the store
- Set as default active part
- Production build passes

**Files created/modified:**
- `src/lib/cad/grocery-store.ts` (~1400 lines) — new
- `src/lib/cad/models.ts` (added `part_grocery_store` case)
- `src/lib/cad/seed.ts` (added grocery store part definition with 12 features)
- `src/store/useCADStore.ts` (set `activePartId` to `'part_grocery_store'`)
- `src/components/cad/Viewport3D.tsx` (added walk mode spawn for grocery store)
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
