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
