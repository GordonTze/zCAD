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
