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
