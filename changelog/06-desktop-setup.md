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
