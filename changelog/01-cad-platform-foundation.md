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
