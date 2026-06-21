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
