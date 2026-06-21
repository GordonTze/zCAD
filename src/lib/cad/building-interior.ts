// ====================== CHINESE BUILDING INTERIOR ======================
// Realistic interior layout for a Chinese urban townhouse (商住两用 - shāng zhù liǎng yòng).
// Layout follows typical Chinese construction:
//   - Ground floor: shop at front, storage + WC at back, U-shaped stairs
//   - 2nd/3rd floor: 2-bedroom apartment with living room, kitchen, bathroom
//   - Each floor connected by U-shaped staircase with landing
// All dimensions match the building shell: 200 (X) × 140 (Z) × 100/floor.

import * as THREE from 'three';
import { addShadow, metal, steel, stainless, aluminum, darkSteel, brass, rubber, plastic } from './materials-dsl';
import {
  makeWoodTexture, makeTileTexture, makeBrickTexture, makeFabricTexture,
  makeGraniteTexture, makeMarbleTexture, makePlasterTexture, makeCarpetTexture,
  makeWallpaperTexture, makeMosaicTexture,
  makeGlassTexture
} from './building-textures';

export function createBuildingInteriorGeometry(): THREE.Group {
  const root = new THREE.Group();
  // Hoisted shared materials (avoid duplicate creation in loops)
  const stainlessMat = stainless();
  const brassMat = brass();

  // ===== BOLD TEXTURED MATERIALS (with bump maps for 3D relief) =====
  // Wood floor — bold grain with bump map
  const woodFloor = makeWoodTexture('#a0703a', '#4a2f15');
  woodFloor.map.repeat.set(15, 10);
  woodFloor.bumpMap.repeat.set(15, 10);
  const floorMat = new THREE.MeshStandardMaterial({
    map: woodFloor.map, bumpMap: woodFloor.bumpMap, bumpScale: 0.05,
    metalness: 0.05, roughness: 0.6,
  });

  // Tile floor — bold grout with bump map
  const tileFloor = makeTileTexture('#d8d8d0', '#555555', 24);
  tileFloor.map.repeat.set(15, 10);
  tileFloor.bumpMap.repeat.set(15, 10);
  const tileFloorMat = new THREE.MeshStandardMaterial({
    map: tileFloor.map, bumpMap: tileFloor.bumpMap, bumpScale: 0.1,
    metalness: 0.15, roughness: 0.35,
  });

  // Plaster walls
  const plasterTex = makePlasterTexture('#f5f0e6');
  plasterTex.repeat.set(8, 4);
  const intWallMat = new THREE.MeshStandardMaterial({ map: plasterTex, metalness: 0.05, roughness: 0.85 });

  // Wallpaper — bold floral pattern
  const wallpaperTex = makeWallpaperTexture('#f0e0c8', '#c08040');
  wallpaperTex.repeat.set(6, 3);
  const bedroomWallMat = new THREE.MeshStandardMaterial({ map: wallpaperTex, metalness: 0.05, roughness: 0.8 });

  // Brick accent wall — bold bricks with bump map
  const brickTex = makeBrickTexture('#9b4a2a', '#d0c8b0');
  brickTex.map.repeat.set(6, 3);
  brickTex.bumpMap.repeat.set(6, 3);
  const brickMat = new THREE.MeshStandardMaterial({
    map: brickTex.map, bumpMap: brickTex.bumpMap, bumpScale: 0.15,
    metalness: 0.1, roughness: 0.8,
  });

  // Stairs — bold wood grain
  const stairWood = makeWoodTexture('#6b4423', '#3a1f0a');
  stairWood.map.repeat.set(3, 3);
  stairWood.bumpMap.repeat.set(3, 3);
  const stairMat = new THREE.MeshStandardMaterial({
    map: stairWood.map, bumpMap: stairWood.bumpMap, bumpScale: 0.08,
    metalness: 0.1, roughness: 0.65,
  });

  const railingMat = new THREE.MeshStandardMaterial({ color: 0x4a4a4a, metalness: 0.6, roughness: 0.4 });

  // Furniture wood — bold grain with bump
  const furnWood = makeWoodTexture('#6b4423', '#3a1f0a');
  furnWood.map.repeat.set(2, 2);
  furnWood.bumpMap.repeat.set(2, 2);
  const furnitureWood = new THREE.MeshStandardMaterial({
    map: furnWood.map, bumpMap: furnWood.bumpMap, bumpScale: 0.06,
    metalness: 0.1, roughness: 0.55,
  });

  // Sofa fabric — bold weave with bump
  const sofaFab = makeFabricTexture('#4a5a7a', '#2a3a5a');
  sofaFab.map.repeat.set(3, 1);
  sofaFab.bumpMap.repeat.set(3, 1);
  const sofaMat = new THREE.MeshStandardMaterial({
    map: sofaFab.map, bumpMap: sofaFab.bumpMap, bumpScale: 0.1,
    metalness: 0.05, roughness: 0.8,
  });

  // Bed fabric — bold weave
  const bedFab = makeFabricTexture('#c8d8e8', '#98b0c8');
  bedFab.map.repeat.set(2, 2);
  bedFab.bumpMap.repeat.set(2, 2);
  const bedMat = new THREE.MeshStandardMaterial({
    map: bedFab.map, bumpMap: bedFab.bumpMap, bumpScale: 0.08,
    metalness: 0.05, roughness: 0.7,
  });

  const tableMat = new THREE.MeshStandardMaterial({
    map: furnWood.map, bumpMap: furnWood.bumpMap, bumpScale: 0.06,
    metalness: 0.1, roughness: 0.5,
  });

  // Granite counter — bold speckles with bump
  const granite = makeGraniteTexture();
  granite.map.repeat.set(3, 1);
  granite.bumpMap.repeat.set(3, 1);
  const counterMat = new THREE.MeshStandardMaterial({
    map: granite.map, bumpMap: granite.bumpMap, bumpScale: 0.02,
    metalness: 0.4, roughness: 0.15,
  });

  // Marble vanity — bold veins with bump
  const marble = makeMarbleTexture();
  marble.map.repeat.set(2, 1);
  marble.bumpMap.repeat.set(2, 1);
  const vanityMat = new THREE.MeshStandardMaterial({
    map: marble.map, bumpMap: marble.bumpMap, bumpScale: 0.03,
    metalness: 0.2, roughness: 0.25,
  });

  // Mosaic tile for bathroom accent
  const mosaic = makeMosaicTexture(['#4a90c2', '#3a7090', '#5aa0d2', '#2a6080']);
  mosaic.map.repeat.set(4, 3);
  mosaic.bumpMap.repeat.set(4, 3);
  const mosaicMat = new THREE.MeshStandardMaterial({
    map: mosaic.map, bumpMap: mosaic.bumpMap, bumpScale: 0.1,
    metalness: 0.2, roughness: 0.3,
  });

  const applianceMat = new THREE.MeshStandardMaterial({ color: 0xe0e0e0, metalness: 0.6, roughness: 0.25 });
  const toiletMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.1, roughness: 0.25 });
  const darkInt = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.3, roughness: 0.6 });
  const doorMat = new THREE.MeshStandardMaterial({
    map: furnWood.map, bumpMap: furnWood.bumpMap, bumpScale: 0.06,
    metalness: 0.1, roughness: 0.6,
  });

  // Building shell dimensions (must match chinese-building.ts)
  const W = 200;          // width X
  const D = 140;          // depth Z
  const FH = 100;         // floor height
  const WT = 6;           // wall thickness
  const INT_WT = 4;       // interior wall thickness (lighter)

  // Helper: interior wall (vertical, runs along X)
  const wallX = (x: number, z: number, w: number, h: number = FH - 10, y: number = 0) => {
    const m = addShadow(new THREE.Mesh(new THREE.BoxGeometry(w, h, INT_WT), intWallMat));
    m.position.set(x, y + h / 2, z);
    return m;
  };
  // Helper: interior wall (along Z)
  const wallZ = (x: number, z: number, d: number, h: number = FH - 10, y: number = 0) => {
    const m = addShadow(new THREE.Mesh(new THREE.BoxGeometry(INT_WT, h, d), intWallMat));
    m.position.set(x, y + h / 2, z);
    return m;
  };
  // Helper: door opening (a hole represented as a dark panel + frame)
  const doorOpening = (x: number, z: number, w: number, h: number, axis: 'x' | 'z', y: number = 0) => {
    const grp = new THREE.Group();
    if (axis === 'x') {
      // door swings along X axis, opening in wall running along X
      const panel = addShadow(new THREE.Mesh(new THREE.BoxGeometry(w * 0.4, h, 1), doorMat));
      panel.position.set(x - w * 0.3, y + h / 2, z);
      grp.add(panel);
      const frame1 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(0.5, h, 2), darkInt));
      frame1.position.set(x - w / 2, y + h / 2, z);
      grp.add(frame1);
      const frame2 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(0.5, h, 2), darkInt));
      frame2.position.set(x + w / 2, y + h / 2, z);
      grp.add(frame2);
      const lintel = addShadow(new THREE.Mesh(new THREE.BoxGeometry(w, 5, 2), intWallMat));
      lintel.position.set(x, y + h + 2.5, z);
      grp.add(lintel);
    } else {
      const panel = addShadow(new THREE.Mesh(new THREE.BoxGeometry(1, h, w * 0.4), doorMat));
      panel.position.set(x, y + h / 2, z - w * 0.3);
      grp.add(panel);
      const frame1 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(2, h, 0.5), darkInt));
      frame1.position.set(x, y + h / 2, z - w / 2);
      grp.add(frame1);
      const frame2 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(2, h, 0.5), darkInt));
      frame2.position.set(x, y + h / 2, z + w / 2);
      grp.add(frame2);
      const lintel = addShadow(new THREE.Mesh(new THREE.BoxGeometry(2, 5, w), intWallMat));
      lintel.position.set(x, y + h + 2.5, z);
      grp.add(lintel);
    }
    return grp;
  };

  // ============================================================
  // GROUND FLOOR — Shop layout
  // Layout (looking down, +Z is FRONT/street, -Z is BACK):
  //   Front half (z: -20 to +70): SHOP / RETAIL (open)
  //   Back-left (z: -70 to -20, x: -100 to -10): STAIRS (U-shape)
  //   Back-right (z: -70 to -20, x: -10 to +100): STORAGE + WC
  // ============================================================
  const groundInt = new THREE.Group();

  // Floor (shop area = tile, back = tile too)
  const gfFloor = addShadow(new THREE.Mesh(new THREE.BoxGeometry(W - WT * 2, 1, D - WT * 2), tileFloorMat));
  gfFloor.position.set(0, 0.5, 0);
  groundInt.add(gfFloor);

  // Wall separating front shop from back rooms (runs along X at z=-20)
  // With door opening to stairs and door to storage
  groundInt.add(wallX(0, -20, W - WT * 2, FH - 10));
  // Door to stairs (left side of dividing wall)
  groundInt.remove(groundInt.children[groundInt.children.length - 1]);
  // Build dividing wall in 3 sections to leave 2 door openings
  groundInt.add(wallX(-55, -20, 90, FH - 10));   // left section (with door gap)
  groundInt.add(wallX(0, -20, 40, FH - 10));      // middle section
  groundInt.add(wallX(60, -20, 80, FH - 10));     // right section
  // Door to stairs (left, x=-50, 1.2m wide)
  groundInt.add(doorOpening(-50, -20, 14, 28, 'x'));
  // Door to storage (right, x=50, 1.2m wide)
  groundInt.add(doorOpening(50, -20, 14, 28, 'x'));

  // Wall between stairs and storage (runs along Z at x=-10)
  groundInt.add(wallZ(-10, -45, 50, FH - 10));
  // Door opening between stairs landing and storage hallway — actually leave open
  // Replace with 2 sections
  groundInt.remove(groundInt.children[groundInt.children.length - 1]);
  groundInt.add(wallZ(-10, -68, 6, FH - 10));   // back bit
  // (no middle — open passage)
  groundInt.add(wallZ(-10, -25, 30, FH - 10));  // front bit

  // WC wall (small room in back-right corner)
  groundInt.add(wallX(40, -60, 50, FH - 10));
  groundInt.add(doorOpening(40, -60, 10, 26, 'x')); // small WC door
  // WC walls
  groundInt.add(wallZ(65, -65, 10, FH - 10));

  // === Shop interior: shelves along back wall of shop area ===
  // Left shelf
  const shelf1 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(60, 40, 8), furnitureWood));
  shelf1.position.set(-65, 20, 0);
  groundInt.add(shelf1);
  // Shelf dividers (3)
  for (let i = 0; i < 3; i++) {
    const div = addShadow(new THREE.Mesh(new THREE.BoxGeometry(60, 0.5, 8), darkInt));
    div.position.set(-65, 10 + i * 12, 0);
    groundInt.add(div);
  }
  // Right shelf
  const shelf2 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(60, 40, 8), furnitureWood));
  shelf2.position.set(65, 20, 0);
  groundInt.add(shelf2);
  for (let i = 0; i < 3; i++) {
    const div = addShadow(new THREE.Mesh(new THREE.BoxGeometry(60, 0.5, 8), darkInt));
    div.position.set(65, 10 + i * 12, 0);
    groundInt.add(div);
  }

  // Shop counter (in middle of shop)
  const counter = addShadow(new THREE.Mesh(new THREE.BoxGeometry(40, 18, 12), furnitureWood));
  counter.position.set(0, 9, 30);
  groundInt.add(counter);
  // Counter top
  const counterTop = addShadow(new THREE.Mesh(new THREE.BoxGeometry(42, 1, 14), counterMat));
  counterTop.position.set(0, 18.5, 30);
  groundInt.add(counterTop);

  // Shop display items (small boxes on shelves — 12 items)
  for (let i = 0; i < 6; i++) {
    const colors = [0xff6b6b, 0x4ecdc4, 0xffe66d, 0x95e1d3, 0xf38181, 0xaa96da];
    const item1 = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(6, 6, 6),
      new THREE.MeshStandardMaterial({ color: colors[i], metalness: 0.2, roughness: 0.5 })
    ));
    item1.position.set(-90 + i * 10, 5, 2);
    groundInt.add(item1);
    const item2 = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(6, 6, 6),
      new THREE.MeshStandardMaterial({ color: colors[(i + 3) % 6], metalness: 0.2, roughness: 0.5 })
    ));
    item2.position.set(40 + i * 10, 5, 2);
    groundInt.add(item2);
  }

  // === MASSIVE U-SHAPED STAIRCASE (back-left) — UNMISTAKABLE ===
  // Stairwell: x=-95 to -15, z=-68 to -20
  // Big thick steps (5 tall × 5 deep × 40 wide) with bright yellow railings
  const stepW = 40;
  const bigStepH = 5;   // 0.5m riser — THICK and visible
  const bigStepD = 5;   // 0.5m tread — THICK and visible
  const numSteps = 10;  // 10 steps per flight × 2 flights = 20 steps = 100 units = one floor
  const stairSignMat = new THREE.MeshStandardMaterial({
    color: 0xffd700, emissive: 0x886600, emissiveIntensity: 0.3,
    side: THREE.DoubleSide,
  });

  // === Flight A: along +Z, from z=-68 to z=-18, rising y=0 to y=50 ===
  for (let i = 0; i < 10; i++) {
    const step = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(stepW, bigStepH, bigStepD), stairMat
    ));
    step.position.set(-75, (i + 1) * bigStepH, -68 + (i + 0.5) * bigStepD);
    groundInt.add(step);
    // Step edge highlight (yellow line on front edge)
    const edge = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(stepW, 1, 1), stairSignMat
    ));
    edge.position.set(-75, (i + 1) * bigStepH + bigStepH / 2, -68 + (i + 1) * bigStepD);
    groundInt.add(edge);
  }

  // Mid landing at y=50 — big platform
  const landing = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(stepW, 5, 18), stairMat
  ));
  landing.position.set(-75, 50, -15);
  groundInt.add(landing);

  // === Flight B: along -Z, from z=-18 to z=-68, rising y=50 to y=100 ===
  for (let i = 0; i < 10; i++) {
    const step = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(stepW, bigStepH, bigStepD), stairMat
    ));
    step.position.set(-35, 50 + (i + 1) * bigStepH, -18 - (i + 0.5) * bigStepD);
    groundInt.add(step);
    // Step edge highlight
    const edge = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(stepW, 1, 1), stairSignMat
    ));
    edge.position.set(-35, 50 + (i + 1) * bigStepH + bigStepH / 2, -18 - (i + 1) * bigStepD);
    groundInt.add(edge);
  }

  // Top landing at y=100 (connects to 2nd floor)
  const topLanding = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(55, 5, 18), stairMat
  ));
  topLanding.position.set(-55, 100, -60);
  groundInt.add(topLanding);

  // === BRIGHT YELLOW RAILINGS (impossible to miss) ===
  const yellowRailing = new THREE.MeshStandardMaterial({
    color: 0xffd700, metalness: 0.6, roughness: 0.3,
  });
  // Flight A railing (left side, x=-95)
  const rA1 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(3, 35, 55), yellowRailing));
  rA1.position.set(-95, 25, -42);
  groundInt.add(rA1);
  // Landing railing (front edge)
  const rL = addShadow(new THREE.Mesh(new THREE.BoxGeometry(55, 35, 3), yellowRailing));
  rL.position.set(-55, 50, -7);
  groundInt.add(rL);
  // Flight B railing (right side, x=-15)
  const rB1 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(3, 35, 55), yellowRailing));
  rB1.position.set(-15, 75, -42);
  groundInt.add(rB1);
  // Top landing railing
  const rT = addShadow(new THREE.Mesh(new THREE.BoxGeometry(55, 35, 3), yellowRailing));
  rT.position.set(-55, 100, -70);
  groundInt.add(rT);

  // Vertical balusters (bright yellow, thick)
  for (let i = 0; i < 10; i++) {
    const b = addShadow(new THREE.Mesh(new THREE.BoxGeometry(2, 33, 2), yellowRailing));
    b.position.set(-95, 16, -66 + i * 5);
    groundInt.add(b);
  }

  // === STAIR SIGN — big arrow pointing UP ===
  // Arrow sign on wall next to stairs
  const signBg = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(25, 15, 1),
    new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.5 })
  ));
  signBg.position.set(-93, 60, -45);
  signBg.rotation.y = Math.PI / 2;
  groundInt.add(signBg);

  // Arrow shape (pointing up) — made of triangles
  const arrowMat = new THREE.MeshStandardMaterial({
    color: 0xffd700, emissive: 0xffd700, emissiveIntensity: 0.5,
    side: THREE.DoubleSide,
  });
  // Arrow shaft
  const arrowShaft = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(6, 8, 1), arrowMat
  ));
  arrowShaft.position.set(-92.5, 57, -45);
  arrowShaft.rotation.y = Math.PI / 2;
  groundInt.add(arrowShaft);
  // Arrow head (cone pointing up)
  const arrowHead = addShadow(new THREE.Mesh(
    new THREE.ConeGeometry(5, 6, 4), arrowMat
  ));
  arrowHead.position.set(-92.5, 65, -45);
  arrowHead.rotation.y = Math.PI / 2;
  arrowHead.rotation.z = 0;
  groundInt.add(arrowHead);

  // "STAIRS" text panel
  const textPanel = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(20, 4, 0.5),
    new THREE.MeshStandardMaterial({ color: 0xffd700, emissive: 0x886600, emissiveIntensity: 0.3 })
  ));
  textPanel.position.set(-92.5, 50, -45);
  textPanel.rotation.y = Math.PI / 2;
  groundInt.add(textPanel);

  // === Storage room (back-right) ===
  // Storage shelves
  const storShelf = addShadow(new THREE.Mesh(new THREE.BoxGeometry(8, 50, 40), furnitureWood));
  storShelf.position.set(85, 25, -45);
  groundInt.add(storShelf);
  for (let i = 0; i < 4; i++) {
    const div = addShadow(new THREE.Mesh(new THREE.BoxGeometry(8, 0.5, 40), darkInt));
    div.position.set(85, 8 + i * 12, -45);
    groundInt.add(div);
  }
  // Boxes on storage shelves
  for (let i = 0; i < 4; i++) {
    const box = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(7, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0x8b6f47, metalness: 0.1, roughness: 0.7 })
    ));
    box.position.set(85, 12 + i * 0.5, -60 + i * 8);
    groundInt.add(box);
  }

  // === WC (small bathroom in back-right corner) ===
  // Toilet
  const toilet = addShadow(new THREE.Mesh(new THREE.BoxGeometry(10, 12, 14), toiletMat));
  toilet.position.set(55, 6, -65);
  groundInt.add(toilet);
  const toiletTank = addShadow(new THREE.Mesh(new THREE.BoxGeometry(10, 6, 4), toiletMat));
  toiletTank.position.set(55, 18, -70);
  groundInt.add(toiletTank);
  // Sink
  const sink = addShadow(new THREE.Mesh(new THREE.BoxGeometry(12, 3, 8), toiletMat));
  sink.position.set(75, 15, -55);
  groundInt.add(sink);
  const sinkBase = addShadow(new THREE.Mesh(new THREE.BoxGeometry(12, 14, 8), furnitureWood));
  sinkBase.position.set(75, 7, -55);
  groundInt.add(sinkBase);
  // Mirror above sink
  const mirror = addShadow(new THREE.Mesh(new THREE.BoxGeometry(12, 10, 0.5), darkInt));
  mirror.position.set(75, 25, -55);
  groundInt.add(mirror);

  // === GROUND FLOOR KITCHEN (back-right, next to storage) ===
  // Small kitchen for the shop owner — typical Chinese commercial/residential setup
  // Located at x=20 to 70, z=-65 to -25

  // Kitchen counter (L-shape along back wall + side wall)
  const gkCounter1 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(50, 20, 8), counterMat));
  gkCounter1.position.set(45, 10, -65);
  groundInt.add(gkCounter1);
  // Counter top (granite-look)
  const gkTop1 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(52, 1.5, 10),
    new THREE.MeshStandardMaterial({ color: 0x2a2a2a, metalness: 0.3, roughness: 0.2 })));
  gkTop1.position.set(45, 21, -65);
  groundInt.add(gkTop1);

  // Counter along side wall (perpendicular)
  const gkCounter2 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(8, 20, 35), counterMat));
  gkCounter2.position.set(22, 10, -45);
  groundInt.add(gkCounter2);
  const gkTop2 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(10, 1.5, 37),
    new THREE.MeshStandardMaterial({ color: 0x2a2a2a, metalness: 0.3, roughness: 0.2 })));
  gkTop2.position.set(22, 21, -45);
  groundInt.add(gkTop2);

  // Sink (stainless steel, double basin)
  const gkSink = addShadow(new THREE.Mesh(new THREE.BoxGeometry(16, 2, 10),
    new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.8, roughness: 0.15 })));
  gkSink.position.set(35, 22, -65);
  groundInt.add(gkSink);
  // Sink basin 1
  const gkBasin1 = new THREE.Mesh(new THREE.BoxGeometry(7, 1.5, 8), darkInt);
  gkBasin1.position.set(31, 21, -65);
  groundInt.add(gkBasin1);
  // Sink basin 2
  const gkBasin2 = new THREE.Mesh(new THREE.BoxGeometry(7, 1.5, 8), darkInt);
  gkBasin2.position.set(39, 21, -65);
  groundInt.add(gkBasin2);
  // Faucet (curved neck)
  const gkFaucetBase = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.8, 2, 8), stainlessMat));
  gkFaucetBase.position.set(35, 23, -60);
  groundInt.add(gkFaucetBase);
  const gkFaucetNeck = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, 6, 8), stainlessMat));
  gkFaucetNeck.position.set(35, 27, -62);
  gkFaucetNeck.rotation.x = 0.5;
  groundInt.add(gkFaucetNeck);
  // Faucet handle
  const gkFaucetHandle = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1.5, 8), stainlessMat));
  gkFaucetHandle.position.set(33, 24, -60);
  groundInt.add(gkFaucetHandle);

  // Stove (4-burner gas range)
  const gkStove = addShadow(new THREE.Mesh(new THREE.BoxGeometry(20, 4, 16), applianceMat));
  gkStove.position.set(55, 22, -65);
  groundInt.add(gkStove);
  // 4 burners (black circles)
  [[-4, -3], [4, -3], [-4, 3], [4, 3]].forEach(([dx, dz]) => {
    const burner = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.5, 1, 20),
      new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.5, roughness: 0.3 })));
    burner.position.set(55 + dx, 24.5, -65 + dz);
    groundInt.add(burner);
    // Burner grate (cross pattern)
    const grate1 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(5, 0.3, 0.5), darkInt));
    grate1.position.set(55 + dx, 25, -65 + dz);
    groundInt.add(grate1);
    const grate2 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.3, 5), darkInt));
    grate2.position.set(55 + dx, 25, -65 + dz);
    groundInt.add(grate2);
  });
  // Stove control knobs (4)
  for (let i = 0; i < 4; i++) {
    const knob = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 1, 12),
      new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.7, roughness: 0.2 })));
    knob.position.set(48 + i * 5, 23, -57);
    groundInt.add(knob);
  }
  // Stove backsplash (behind stove)
  const gkBacksplash = addShadow(new THREE.Mesh(new THREE.BoxGeometry(22, 15, 1),
    new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.3, roughness: 0.3 })));
  gkBacksplash.position.set(55, 30, -73);
  groundInt.add(gkBacksplash);

  // Range hood above stove
  const gkHood = addShadow(new THREE.Mesh(new THREE.BoxGeometry(24, 6, 12),
    new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.7, roughness: 0.15 })));
  gkHood.position.set(55, 42, -65);
  groundInt.add(gkHood);
  // Hood vent pipe
  const gkHoodPipe = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 12, 16),
    new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.7, roughness: 0.15 })));
  gkHoodPipe.position.set(55, 51, -65);
  groundInt.add(gkHoodPipe);

  // Refrigerator (stainless steel, tall)
  const gkFridge = addShadow(new THREE.Mesh(new THREE.BoxGeometry(18, 35, 16),
    new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.7, roughness: 0.15 })));
  gkFridge.position.set(68, 17.5, -50);
  groundInt.add(gkFridge);
  // Fridge door split line
  const gkFridgeSplit = addShadow(new THREE.Mesh(new THREE.BoxGeometry(0.5, 35, 16.1), darkInt));
  gkFridgeSplit.position.set(68, 17.5, -50);
  groundInt.add(gkFridgeSplit);
  // Fridge handles (2 — upper freezer, lower main)
  const gkFridgeHandle1 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(1, 12, 1.5), darkInt));
  gkFridgeHandle1.position.set(74, 27, -43);
  groundInt.add(gkFridgeHandle1);
  const gkFridgeHandle2 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(1, 18, 1.5), darkInt));
  gkFridgeHandle2.position.set(74, 12, -43);
  groundInt.add(gkFridgeHandle2);
  // Fridge magnetic decals (decorative)
  const gkDecal1 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(3, 3, 0.3),
    new THREE.MeshStandardMaterial({ color: 0xff6b6b, roughness: 0.5 })));
  gkDecal1.position.set(65, 28, -42);
  groundInt.add(gkDecal1);
  const gkDecal2 = addShadow(new THREE.Mesh(new THREE.CircleGeometry(2, 12),
    new THREE.MeshStandardMaterial({ color: 0x4ecdc4, roughness: 0.5 })));
  gkDecal2.position.set(63, 20, -42);
  groundInt.add(gkDecal2);

  // Upper kitchen cabinets (above counter, along back wall)
  const gkUpperCab = addShadow(new THREE.Mesh(new THREE.BoxGeometry(50, 18, 8), furnitureWood));
  gkUpperCab.position.set(45, 55, -65);
  groundInt.add(gkUpperCab);
  // Cabinet door dividers (3 doors)
  [30, 45, 60].forEach((x) => {
    const divider = addShadow(new THREE.Mesh(new THREE.BoxGeometry(0.5, 18, 8.1), darkInt));
    divider.position.set(x, 55, -65);
    groundInt.add(divider);
    // Cabinet handles
    const handle = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 4, 8), stainlessMat));
    handle.rotation.z = Math.PI / 2;
    handle.position.set(x - 5, 55, -60);
    groundInt.add(handle);
  });

  // Microwave on counter
  const gkMicrowave = addShadow(new THREE.Mesh(new THREE.BoxGeometry(14, 8, 10), applianceMat));
  gkMicrowave.position.set(22, 25, -35);
  groundInt.add(gkMicrowave);
  // Microwave door (dark glass)
  const gkMicroDoor = addShadow(new THREE.Mesh(new THREE.BoxGeometry(10, 6, 0.5),
    new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.5, roughness: 0.2 })));
  gkMicroDoor.position.set(22, 25, -30);
  groundInt.add(gkMicroDoor);
  // Microwave buttons panel
  const gkMicroPanel = addShadow(new THREE.Mesh(new THREE.BoxGeometry(3, 6, 0.5), darkInt));
  gkMicroPanel.position.set(28, 25, -30);
  groundInt.add(gkMicroPanel);

  // Rice cooker (Chinese kitchen essential!)
  const gkRiceCooker = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 7, 16), applianceMat));
  gkRiceCooker.position.set(22, 24.5, -50);
  groundInt.add(gkRiceCooker);
  // Rice cooker lid
  const gkRcLid = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(5.2, 5, 2, 16), darkInt));
  gkRcLid.position.set(22, 28, -50);
  groundInt.add(gkRcLid);
  // Rice cooker steam vent
  const gkRcVent = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1, 8), darkInt));
  gkRcVent.position.set(22, 29.5, -50);
  groundInt.add(gkRcVent);
  // Rice cooker handle
  const gkRcHandle = addShadow(new THREE.Mesh(new THREE.BoxGeometry(8, 1, 1.5), darkInt));
  gkRcHandle.position.set(22, 27, -55);
  groundInt.add(gkRcHandle);

  // Wok on stove (Chinese cooking!)
  const gkWok = addShadow(new THREE.Mesh(new THREE.SphereGeometry(4, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.7, roughness: 0.2 })));
  gkWok.position.set(55, 25, -62);
  groundInt.add(gkWok);

  // Cutting board on counter
  const gkCutBoard = addShadow(new THREE.Mesh(new THREE.BoxGeometry(10, 0.8, 6),
    new THREE.MeshStandardMaterial({ color: 0x8b6f47, roughness: 0.6 })));
  gkCutBoard.position.set(30, 22, -30);
  groundInt.add(gkCutBoard);

  // Kitchen knife on cutting board
  const gkKnife = addShadow(new THREE.Mesh(new THREE.BoxGeometry(6, 0.3, 1),
    new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.1 })));
  gkKnife.position.set(30, 22.6, -30);
  groundInt.add(gkKnife);
  const gkKnifeHandle = addShadow(new THREE.Mesh(new THREE.BoxGeometry(3, 0.5, 1), furnitureWood));
  gkKnifeHandle.position.set(33, 22.5, -30);
  groundInt.add(gkKnifeHandle);

  // Spice rack on counter (4 small jars)
  for (let i = 0; i < 4; i++) {
    const jarColors = [0xdc2626, 0xfacc15, 0x16a34a, 0x884433];
    const jar = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 3, 12),
      new THREE.MeshStandardMaterial({ color: jarColors[i], transparent: true, opacity: 0.7, roughness: 0.3 })));
    jar.position.set(15 + i * 3, 23, -30);
    groundInt.add(jar);
    // Jar lid
    const jarLid = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.3, 0.5, 12), darkInt));
    jarLid.position.set(15 + i * 3, 24.5, -30);
    groundInt.add(jarLid);
  }

  // Dish rack next to sink
  const gkDishRack = addShadow(new THREE.Mesh(new THREE.BoxGeometry(8, 4, 6), stainlessMat));
  gkDishRack.position.set(42, 22, -60);
  groundInt.add(gkDishRack);
  // Plates in dish rack (3 standing plates)
  for (let i = 0; i < 3; i++) {
    const plate = addShadow(new THREE.Mesh(new THREE.BoxGeometry(0.5, 3, 4),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 })));
    plate.position.set(40 + i * 2, 23, -60);
    groundInt.add(plate);
  }

  // Trash can under counter area
  const gkTrash = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(3, 2.5, 8, 12), darkInt));
  gkTrash.position.set(25, 4, -30);
  groundInt.add(gkTrash);

  // Kitchen floor mat
  const gkMat = addShadow(new THREE.Mesh(new THREE.BoxGeometry(25, 0.3, 12),
    new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.8 })));
  gkMat.position.set(45, 0.5, -50);
  groundInt.add(gkMat);

  root.add(groundInt);

  // ============================================================
  // 2ND FLOOR — 2-bedroom apartment
  // Layout (looking down, +Z is FRONT/street):
  //   Front-left: BEDROOM 1 (x: -100 to -10, z: 0 to 70)
  //   Front-right: LIVING ROOM (x: -10 to 100, z: -20 to 70)
  //   Front-center: BALCONY (z: 70 to 80)
  //   Back-left: STAIRS (continues up)
  //   Back-center: KITCHEN (x: -30 to 30, z: -70 to -20)
  //   Back-right: BATH (x: 30 to 100, z: -70 to -20)
  //   Back-right-corner: BEDROOM 2 (x: 50 to 100, z: -70 to -30) — actually let's reorganize
  // Better layout:
  //   Front: Living Room (full width) + Balcony
  //   Back-left: Stairs
  //   Back-center: Kitchen
  //   Back-right: Bedroom 2
  //   Middle-left: Bedroom 1
  //   Middle-right: Bathroom
  // ============================================================
  const secondInt = new THREE.Group();
  secondInt.position.y = FH;

  // Floor (wood for residential) — with stairwell opening
  // Stairwell is at x=-95 to -15, z=-68 to -25
  // Left floor slab (covers front + right side)
  const sfFloorA = addShadow(new THREE.Mesh(new THREE.BoxGeometry(W - WT * 2, 1, 50), floorMat));
  sfFloorA.position.set(0, 0.5, 20);
  secondInt.add(sfFloorA);
  // Right back floor slab (covers x=-15 to 100, z=-70 to -20)
  const sfFloorB = addShadow(new THREE.Mesh(new THREE.BoxGeometry(85, 1, 50), floorMat));
  sfFloorB.position.set(42, 0.5, -45);
  secondInt.add(sfFloorB);
  // Small piece between stairwell and front (x=-15 to 0 area near front)
  const sfFloorC = addShadow(new THREE.Mesh(new THREE.BoxGeometry(20, 1, 50), floorMat));
  sfFloorC.position.set(-40, 0.5, -45);
  secondInt.add(sfFloorC);

  // Dividing wall between front (living) and back (kitchen/bedrooms) — along X at z=-20
  // Sections to leave doors
  secondInt.add(wallX(-55, -20, 90, FH - 10));   // left
  secondInt.add(wallX(0, -20, 40, FH - 10));      // middle
  secondInt.add(wallX(60, -20, 80, FH - 10));     // right
  // Doors
  secondInt.add(doorOpening(-50, -20, 14, 28, 'x')); // to bedroom 1
  secondInt.add(doorOpening(50, -20, 14, 28, 'x'));  // to kitchen hallway

  // Wall between stairs and kitchen (along Z at x=-10, in back area)
  secondInt.add(wallZ(-10, -45, 50, FH - 10));

  // Wall between kitchen and bathroom/bedroom2 (along Z at x=30, back area)
  secondInt.add(wallZ(30, -45, 50, FH - 10));
  // Door to kitchen
  secondInt.add(doorOpening(30, -25, 12, 26, 'z'));
  // Door to bedroom 2 / bathroom
  secondInt.add(doorOpening(30, -65, 12, 26, 'z'));

  // Wall between bathroom and bedroom 2 (along X at z=-45)
  secondInt.add(wallX(65, -45, 70, FH - 10));
  secondInt.add(doorOpening(45, -45, 12, 26, 'x')); // bathroom door

  // === MASSIVE STAIRCASE going UP to 3rd floor ===
  // Same big steps as ground floor (5 tall × 5 deep × 40 wide)
  const yellowRailing2F = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.6, roughness: 0.3 });
  for (let i = 0; i < 10; i++) {
    const step = addShadow(new THREE.Mesh(new THREE.BoxGeometry(stepW, 5, 5), stairMat));
    step.position.set(-75, (i + 1) * 5, -68 + (i + 0.5) * 5);
    secondInt.add(step);
    // Yellow edge
    const edge = addShadow(new THREE.Mesh(new THREE.BoxGeometry(stepW, 1, 1), yellowRailing2F));
    edge.position.set(-75, (i + 1) * 5 + 2.5, -68 + (i + 1) * 5);
    secondInt.add(edge);
  }
  const landing2 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(stepW, 5, 18), stairMat));
  landing2.position.set(-75, 50, -15);
  secondInt.add(landing2);
  for (let i = 0; i < 10; i++) {
    const step = addShadow(new THREE.Mesh(new THREE.BoxGeometry(stepW, 5, 5), stairMat));
    step.position.set(-35, 50 + (i + 1) * 5, -18 - (i + 0.5) * 5);
    secondInt.add(step);
    const edge = addShadow(new THREE.Mesh(new THREE.BoxGeometry(stepW, 1, 1), yellowRailing2F));
    edge.position.set(-35, 50 + (i + 1) * 5 + 2.5, -18 - (i + 1) * 5);
    secondInt.add(edge);
  }
  const topLanding2 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(55, 5, 18), stairMat));
  topLanding2.position.set(-55, 100, -60);
  secondInt.add(topLanding2);

  // Yellow railings
  const rA2 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(3, 35, 55), yellowRailing2F));
  rA2.position.set(-95, 25, -42); secondInt.add(rA2);
  const rL2 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(55, 35, 3), yellowRailing2F));
  rL2.position.set(-55, 50, -7); secondInt.add(rL2);
  const rB2 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(3, 35, 55), yellowRailing2F));
  rB2.position.set(-15, 75, -42); secondInt.add(rB2);
  const rT2y = addShadow(new THREE.Mesh(new THREE.BoxGeometry(55, 35, 3), yellowRailing2F));
  rT2y.position.set(-55, 100, -70); secondInt.add(rT2y);

  // Stairwell void (hole in floor showing stairs below)
  const stairVoid = new THREE.Mesh(new THREE.BoxGeometry(85, 2, 55), darkInt);
  stairVoid.position.set(-55, -1, -42);
  secondInt.add(stairVoid);

  // UP arrow sign
  const arrow2 = addShadow(new THREE.Mesh(new THREE.ConeGeometry(5, 6, 4),
    new THREE.MeshStandardMaterial({ color: 0xffd700, emissive: 0xffd700, emissiveIntensity: 0.5, side: THREE.DoubleSide })));
  arrow2.position.set(-92.5, 65, -45);
  arrow2.rotation.y = Math.PI / 2;
  secondInt.add(arrow2);

  // Stair railing (top of opening)
  const rT2 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(2, 25, 50), railingMat));
  rT2.position.set(-15, 12, -45);
  secondInt.add(rT2);
  const rT2b = addShadow(new THREE.Mesh(new THREE.BoxGeometry(80, 25, 2), railingMat));
  rT2b.position.set(-55, 12, -68);
  secondInt.add(rT2b);

  // === BEDROOM 1 (front-left) ===
  // Bed
  const bed1 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(35, 8, 50), furnitureWood));
  bed1.position.set(-70, 4, 30);
  secondInt.add(bed1);
  // Mattress
  const mat1 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(33, 4, 48), bedMat));
  mat1.position.set(-70, 10, 30);
  secondInt.add(mat1);
  // Pillow
  const pillow1 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(30, 3, 8), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7 })));
  pillow1.position.set(-70, 13, 12);
  secondInt.add(pillow1);
  // Wardrobe
  const wardrobe1 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(40, 50, 8), furnitureWood));
  wardrobe1.position.set(-85, 25, -10);
  secondInt.add(wardrobe1);
  // Wardrobe doors (2)
  [-95, -75].forEach((x) => {
    const wdoor = addShadow(new THREE.Mesh(new THREE.BoxGeometry(18, 48, 0.5), doorMat));
    wdoor.position.set(x, 25, -5.5);
    secondInt.add(wdoor);
    const handle = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 4, 8), brassMat));
    handle.rotation.z = Math.PI / 2;
    handle.position.set(x + (x < -85 ? 8 : -8), 25, -5);
    secondInt.add(handle);
  });
  // Nightstand
  const ns1 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(8, 10, 8), furnitureWood));
  ns1.position.set(-50, 5, 8);
  secondInt.add(ns1);
  // Desk
  const desk1 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(25, 10, 12), furnitureWood));
  desk1.position.set(-30, 5, 50);
  secondInt.add(desk1);
  // Chair
  const chair1 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(8, 12, 8), furnitureWood));
  chair1.position.set(-30, 6, 38);
  secondInt.add(chair1);
  const chairBack1 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(8, 18, 2), furnitureWood));
  chairBack1.position.set(-30, 15, 34);
  secondInt.add(chairBack1);

  // === LIVING ROOM (front-right, large open space) ===
  // Sofa (3-seat, against back wall of living room)
  const sofaBase = addShadow(new THREE.Mesh(new THREE.BoxGeometry(50, 10, 18), sofaMat));
  sofaBase.position.set(40, 5, -10);
  secondInt.add(sofaBase);
  const sofaBack = addShadow(new THREE.Mesh(new THREE.BoxGeometry(50, 25, 4), sofaMat));
  sofaBack.position.set(40, 17, -17);
  secondInt.add(sofaBack);
  // Sofa cushions (3)
  [-15, 0, 15].forEach((x) => {
    const cushion = addShadow(new THREE.Mesh(new THREE.BoxGeometry(14, 3, 14), sofaMat));
    cushion.position.set(40 + x, 11, -10);
    secondInt.add(cushion);
  });
  // Sofa armrests
  [-1, 1].forEach((s) => {
    const arm = addShadow(new THREE.Mesh(new THREE.BoxGeometry(4, 18, 18), sofaMat));
    arm.position.set(40 + s * 25, 9, -10);
    secondInt.add(arm);
  });

  // Coffee table
  const coffeeTbl = addShadow(new THREE.Mesh(new THREE.BoxGeometry(25, 5, 12), tableMat));
  coffeeTbl.position.set(40, 3, 10);
  secondInt.add(coffeeTbl);
  // Tea set on coffee table (Chinese style — small teapot + cups)
  const teapot = addShadow(new THREE.Mesh(new THREE.SphereGeometry(2.5, 12, 10),
    new THREE.MeshStandardMaterial({ color: 0x8b3a2e, metalness: 0.2, roughness: 0.3 })));
  teapot.position.set(40, 6, 10);
  secondInt.add(teapot);
  for (let i = 0; i < 4; i++) {
    const cup = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.6, 1.5, 8),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 })));
    const a = (i / 4) * Math.PI * 2;
    cup.position.set(40 + Math.cos(a) * 4, 5.5, 10 + Math.sin(a) * 4);
    secondInt.add(cup);
  }

  // TV stand + TV (against front wall of living room, facing sofa)
  const tvStand = addShadow(new THREE.Mesh(new THREE.BoxGeometry(40, 8, 8), furnitureWood));
  tvStand.position.set(40, 4, 50);
  secondInt.add(tvStand);
  const tv = addShadow(new THREE.Mesh(new THREE.BoxGeometry(35, 22, 2), darkInt));
  tv.position.set(40, 22, 53);
  secondInt.add(tv);
  // TV screen (lit)
  const tvScreen = new THREE.Mesh(new THREE.BoxGeometry(33, 20, 0.5),
    new THREE.MeshStandardMaterial({ color: 0x223344, emissive: 0x223344, emissiveIntensity: 0.3 }));
  tvScreen.position.set(40, 22, 54);
  secondInt.add(tvScreen);

  // Dining table (in living room, near kitchen)
  const dineTbl = addShadow(new THREE.Mesh(new THREE.BoxGeometry(20, 4, 30), tableMat));
  dineTbl.position.set(85, 5, 30);
  secondInt.add(dineTbl);
  // Dining chairs (4)
  [[85, 14], [85, 46], [75, 30], [95, 30]].forEach(([x, z]) => {
    const dchair = addShadow(new THREE.Mesh(new THREE.BoxGeometry(8, 12, 8), furnitureWood));
    dchair.position.set(x, 6, z);
    secondInt.add(dchair);
  });

  // === KITCHEN (back-center) ===
  // Kitchen counter (L-shape along 2 walls)
  const counter1 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(8, 20, 45), counterMat));
  counter1.position.set(15, 10, -42);
  secondInt.add(counter1);
  // Counter top
  const counterTop1 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(10, 1, 47), counterMat));
  counterTop1.position.set(15, 20.5, -42);
  secondInt.add(counterTop1);
  // Sink
  const kSink = addShadow(new THREE.Mesh(new THREE.BoxGeometry(8, 1, 12),
    new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.7, roughness: 0.2 })));
  kSink.position.set(15, 21, -30);
  secondInt.add(kSink);
  const kSinkBowl = new THREE.Mesh(new THREE.BoxGeometry(7, 1, 11), darkInt);
  kSinkBowl.position.set(15, 20, -30);
  secondInt.add(kSinkBowl);
  // Faucet
  const faucet = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 8, 8), stainlessMat));
  faucet.position.set(15, 25, -30);
  secondInt.add(faucet);
  const faucetArm = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 4, 8), stainlessMat));
  faucetArm.rotation.z = Math.PI / 2;
  faucetArm.position.set(15, 28, -30);
  secondInt.add(faucetArm);

  // Stove (4 burners)
  const stove = addShadow(new THREE.Mesh(new THREE.BoxGeometry(20, 4, 18), applianceMat));
  stove.position.set(15, 22, -55);
  secondInt.add(stove);
  // 4 burners
  [[-5, -5], [5, -5], [-5, 5], [5, 5]].forEach(([dx, dz]) => {
    const burner = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.5, 1, 16), darkInt));
    burner.position.set(15 + dx, 24.5, -55 + dz);
    secondInt.add(burner);
  });

  // Refrigerator
  const fridge = addShadow(new THREE.Mesh(new THREE.BoxGeometry(15, 30, 14), applianceMat));
  fridge.position.set(25, 15, -22);
  secondInt.add(fridge);
  // Fridge handles
  const fhandle = addShadow(new THREE.Mesh(new THREE.BoxGeometry(1, 20, 1), darkInt));
  fhandle.position.set(20, 15, -15);
  secondInt.add(fhandle);

  // Upper kitchen cabinets (along wall)
  const upperCab = addShadow(new THREE.Mesh(new THREE.BoxGeometry(8, 18, 45), furnitureWood));
  upperCab.position.set(15, 55, -42);
  secondInt.add(upperCab);

  // === BATHROOM (back, between kitchen and bedroom 2) ===
  // Bathtub
  const tub = addShadow(new THREE.Mesh(new THREE.BoxGeometry(20, 8, 10), toiletMat));
  tub.position.set(50, 4, -60);
  secondInt.add(tub);
  const tubBowl = new THREE.Mesh(new THREE.BoxGeometry(18, 5, 8), darkInt);
  tubBowl.position.set(50, 5, -60);
  secondInt.add(tubBowl);
  // Toilet
  const bath_toilet = addShadow(new THREE.Mesh(new THREE.BoxGeometry(8, 10, 12), toiletMat));
  bath_toilet.position.set(70, 5, -65);
  secondInt.add(bath_toilet);
  const bath_tank = addShadow(new THREE.Mesh(new THREE.BoxGeometry(8, 5, 3), toiletMat));
  bath_tank.position.set(70, 15, -70);
  secondInt.add(bath_tank);
  // Sink with vanity
  const vanity = addShadow(new THREE.Mesh(new THREE.BoxGeometry(15, 12, 8), furnitureWood));
  vanity.position.set(75, 6, -45);
  secondInt.add(vanity);
  const vanityTop = addShadow(new THREE.Mesh(new THREE.BoxGeometry(16, 1, 9), counterMat));
  vanityTop.position.set(75, 12.5, -45);
  secondInt.add(vanityTop);
  const bathSink = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 1, 16), toiletMat));
  bathSink.position.set(75, 13, -45);
  secondInt.add(bathSink);

  // === BEDROOM 2 (back-right corner) ===
  // Bed (smaller)
  const bed2 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(30, 8, 35), furnitureWood));
  bed2.position.set(80, 4, -50);
  secondInt.add(bed2);
  const mat2 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(28, 4, 33), bedMat));
  mat2.position.set(80, 10, -50);
  secondInt.add(mat2);
  const pillow2 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(25, 3, 7),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7 })));
  pillow2.position.set(80, 13, -65);
  secondInt.add(pillow2);
  // Wardrobe
  const wardrobe2 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(35, 50, 8), furnitureWood));
  wardrobe2.position.set(60, 25, -25);
  secondInt.add(wardrobe2);

  // === BALCONY (front, off living room) ===
  // Balcony floor already part of shell — add potted plants + drying rack
  const plant1 = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(4, 5, 6, 12),
    new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.7 })));
  plant1.position.set(-30, 3, 75);
  secondInt.add(plant1);
  const plant1Foliage = addShadow(new THREE.Mesh(new THREE.SphereGeometry(7, 12, 10),
    new THREE.MeshStandardMaterial({ color: 0x4a7c3a, roughness: 0.9 })));
  plant1Foliage.position.set(-30, 13, 75);
  secondInt.add(plant1Foliage);
  // Drying rack
  const dryRack1 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(20, 1, 1), stainlessMat));
  dryRack1.position.set(30, 30, 75);
  secondInt.add(dryRack1);
  const dryRack2 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(20, 1, 1), stainlessMat));
  dryRack2.position.set(30, 30, 80);
  secondInt.add(dryRack2);

  // Wall light fixtures (small bright spots on walls)
  [-50, 50].forEach((x) => {
    const light = new THREE.Mesh(new THREE.BoxGeometry(6, 3, 2),
      new THREE.MeshStandardMaterial({ color: 0xffdd88, emissive: 0xffdd88, emissiveIntensity: 0.5 }));
    light.position.set(x, 50, -19);
    secondInt.add(light);
  });

  root.add(secondInt);

  // ============================================================
  // 3RD FLOOR — 2-bedroom apartment (similar layout, master suite)
  // Same layout as 2nd floor but with master bedroom + study
  // ============================================================
  const thirdInt = new THREE.Group();
  thirdInt.position.y = FH * 2;

  // Floor — with stairwell opening (same as 2nd floor)
  const tfFloorA = addShadow(new THREE.Mesh(new THREE.BoxGeometry(W - WT * 2, 1, 50), floorMat));
  tfFloorA.position.set(0, 0.5, 20);
  thirdInt.add(tfFloorA);
  const tfFloorB = addShadow(new THREE.Mesh(new THREE.BoxGeometry(85, 1, 50), floorMat));
  tfFloorB.position.set(42, 0.5, -45);
  thirdInt.add(tfFloorB);
  const tfFloorC = addShadow(new THREE.Mesh(new THREE.BoxGeometry(20, 1, 50), floorMat));
  tfFloorC.position.set(-40, 0.5, -45);
  thirdInt.add(tfFloorC);

  // Dividing wall (front/back)
  thirdInt.add(wallX(-55, -20, 90, FH - 10));
  thirdInt.add(wallX(0, -20, 40, FH - 10));
  thirdInt.add(wallX(60, -20, 80, FH - 10));
  thirdInt.add(doorOpening(-50, -20, 14, 28, 'x'));
  thirdInt.add(doorOpening(50, -20, 14, 28, 'x'));

  thirdInt.add(wallZ(-10, -45, 50, FH - 10));
  thirdInt.add(wallZ(30, -45, 50, FH - 10));
  thirdInt.add(doorOpening(30, -25, 12, 26, 'z'));
  thirdInt.add(doorOpening(30, -65, 12, 26, 'z'));
  thirdInt.add(wallX(65, -45, 70, FH - 10));
  thirdInt.add(doorOpening(45, -45, 12, 26, 'x'));

  // === MASSIVE STAIRCASE going DOWN to 2nd floor ===
  const yellowRailing3F = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.6, roughness: 0.3 });
  for (let i = 0; i < 10; i++) {
    const step = addShadow(new THREE.Mesh(new THREE.BoxGeometry(stepW, 5, 5), stairMat));
    step.position.set(-75, (i + 1) * 5, -68 + (i + 0.5) * 5);
    thirdInt.add(step);
    const edge = addShadow(new THREE.Mesh(new THREE.BoxGeometry(stepW, 1, 1), yellowRailing3F));
    edge.position.set(-75, (i + 1) * 5 + 2.5, -68 + (i + 1) * 5);
    thirdInt.add(edge);
  }
  const landing3 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(stepW, 5, 18), stairMat));
  landing3.position.set(-75, 50, -15);
  thirdInt.add(landing3);
  for (let i = 0; i < 10; i++) {
    const step = addShadow(new THREE.Mesh(new THREE.BoxGeometry(stepW, 5, 5), stairMat));
    step.position.set(-35, 50 + (i + 1) * 5, -18 - (i + 0.5) * 5);
    thirdInt.add(step);
    const edge = addShadow(new THREE.Mesh(new THREE.BoxGeometry(stepW, 1, 1), yellowRailing3F));
    edge.position.set(-35, 50 + (i + 1) * 5 + 2.5, -18 - (i + 1) * 5);
    thirdInt.add(edge);
  }
  // Stairwell void
  const stairVoid3 = new THREE.Mesh(new THREE.BoxGeometry(85, 2, 55), darkInt);
  stairVoid3.position.set(-55, -1, -42);
  thirdInt.add(stairVoid3);
  // Yellow railings
  const rA3 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(3, 35, 55), yellowRailing3F));
  rA3.position.set(-95, 25, -42); thirdInt.add(rA3);
  const rL3 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(55, 35, 3), yellowRailing3F));
  rL3.position.set(-55, 50, -7); thirdInt.add(rL3);
  const rB3 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(3, 35, 55), yellowRailing3F));
  rB3.position.set(-15, 75, -42); thirdInt.add(rB3);
  const rT3y = addShadow(new THREE.Mesh(new THREE.BoxGeometry(55, 35, 3), yellowRailing3F));
  rT3y.position.set(-55, 100, -70); thirdInt.add(rT3y);
  // DOWN arrow sign
  const arrow3 = addShadow(new THREE.Mesh(new THREE.ConeGeometry(5, 6, 4),
    new THREE.MeshStandardMaterial({ color: 0xffd700, emissive: 0xffd700, emissiveIntensity: 0.5, side: THREE.DoubleSide })));
  arrow3.position.set(-92.5, 35, -45);
  arrow3.rotation.y = Math.PI / 2;
  arrow3.rotation.x = Math.PI; // pointing down
  thirdInt.add(arrow3);

  // === MASTER BEDROOM (front-left, larger) ===
  // King bed
  const mbed = addShadow(new THREE.Mesh(new THREE.BoxGeometry(45, 8, 55), furnitureWood));
  mbed.position.set(-65, 4, 25);
  thirdInt.add(mbed);
  const mmat = addShadow(new THREE.Mesh(new THREE.BoxGeometry(43, 4, 53), bedMat));
  mmat.position.set(-65, 10, 25);
  thirdInt.add(mmat);
  // 2 pillows
  [-75, -55].forEach((x) => {
    const mp = addShadow(new THREE.Mesh(new THREE.BoxGeometry(15, 3, 10),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7 })));
    mp.position.set(x, 13, 3);
    thirdInt.add(mp);
  });
  // Headboard
  const headboard = addShadow(new THREE.Mesh(new THREE.BoxGeometry(45, 30, 3), furnitureWood));
  headboard.position.set(-65, 19, -3);
  thirdInt.add(headboard);
  // 2 nightstands
  [-90, -40].forEach((x) => {
    const ns = addShadow(new THREE.Mesh(new THREE.BoxGeometry(8, 10, 8), furnitureWood));
    ns.position.set(x, 5, 5);
    thirdInt.add(ns);
    // Lamp
    const lamp = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(2, 3, 6, 12),
      new THREE.MeshStandardMaterial({ color: 0xffdd88, emissive: 0xffdd88, emissiveIntensity: 0.4 })));
    lamp.position.set(x, 13, 5);
    thirdInt.add(lamp);
  });
  // Large wardrobe
  const mwardrobe = addShadow(new THREE.Mesh(new THREE.BoxGeometry(50, 55, 10), furnitureWood));
  mwardrobe.position.set(-85, 27, -50);
  thirdInt.add(mwardrobe);
  // Wardrobe doors (3)
  [-105, -85, -65].forEach((x) => {
    const wd = addShadow(new THREE.Mesh(new THREE.BoxGeometry(18, 53, 0.5), doorMat));
    wd.position.set(x, 27, -45);
    thirdInt.add(wd);
  });
  // Dresser
  const dresser = addShadow(new THREE.Mesh(new THREE.BoxGeometry(35, 20, 12), furnitureWood));
  dresser.position.set(-25, 10, -45);
  thirdInt.add(dresser);
  // Dresser drawers (3)
  for (let i = 0; i < 3; i++) {
    const draw = addShadow(new THREE.Mesh(new THREE.BoxGeometry(33, 5, 1), darkInt));
    draw.position.set(-25, 5 + i * 7, -39);
    thirdInt.add(draw);
    const dhandle = addShadow(new THREE.Mesh(new THREE.BoxGeometry(6, 1, 1), brassMat));
    dhandle.position.set(-25, 5 + i * 7, -38);
    thirdInt.add(dhandle);
  }
  // TV on dresser
  const mtv = addShadow(new THREE.Mesh(new THREE.BoxGeometry(28, 18, 2), darkInt));
  mtv.position.set(-25, 28, -38.5);
  thirdInt.add(mtv);

  // === LIVING ROOM (front-right) ===
  // L-shaped sofa
  const lsofa1 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(50, 10, 18), sofaMat));
  lsofa1.position.set(40, 5, -10);
  thirdInt.add(lsofa1);
  const lsofa1b = addShadow(new THREE.Mesh(new THREE.BoxGeometry(50, 25, 4), sofaMat));
  lsofa1b.position.set(40, 17, -17);
  thirdInt.add(lsofa1b);
  const lsofa2 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(18, 10, 35), sofaMat));
  lsofa2.position.set(70, 5, 5);
  thirdInt.add(lsofa2);
  const lsofa2b = addShadow(new THREE.Mesh(new THREE.BoxGeometry(4, 25, 35), sofaMat));
  lsofa2b.position.set(79, 17, 5);
  thirdInt.add(lsofa2b);
  // Sofa cushions
  [-15, 0, 15].forEach((x) => {
    const cushion = addShadow(new THREE.Mesh(new THREE.BoxGeometry(14, 3, 14), sofaMat));
    cushion.position.set(40 + x, 11, -10);
    thirdInt.add(cushion);
  });
  // Coffee table (larger, wood)
  const mcoffee = addShadow(new THREE.Mesh(new THREE.BoxGeometry(30, 5, 15), tableMat));
  mcoffee.position.set(45, 3, 10);
  thirdInt.add(mcoffee);
  // Tea set
  const mteapot = addShadow(new THREE.Mesh(new THREE.SphereGeometry(3, 12, 10),
    new THREE.MeshStandardMaterial({ color: 0x8b3a2e, metalness: 0.2, roughness: 0.3 })));
  mteapot.position.set(45, 7, 10);
  thirdInt.add(mteapot);
  for (let i = 0; i < 6; i++) {
    const cup = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(1, 0.7, 1.8, 8),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 })));
    const a = (i / 6) * Math.PI * 2;
    cup.position.set(45 + Math.cos(a) * 5, 6, 10 + Math.sin(a) * 5);
    thirdInt.add(cup);
  }
  // Bookshelf
  const bookshelf = addShadow(new THREE.Mesh(new THREE.BoxGeometry(40, 50, 6), furnitureWood));
  bookshelf.position.set(15, 25, 55);
  thirdInt.add(bookshelf);
  // Books (colorful row)
  for (let i = 0; i < 12; i++) {
    const colors = [0xff6b6b, 0x4ecdc4, 0xffe66d, 0x95e1d3, 0xf38181, 0xaa96da, 0x88d8b0, 0xff8c94, 0xc8b6ff, 0xa8dadc, 0xf1faee, 0xa8dadc];
    const book = addShadow(new THREE.Mesh(new THREE.BoxGeometry(3, 18, 4),
      new THREE.MeshStandardMaterial({ color: colors[i % colors.length], roughness: 0.6 })));
    book.position.set(2 + i * 3.5, 28, 55);
    thirdInt.add(book);
  }

  // TV unit (large)
  const mtvStand = addShadow(new THREE.Mesh(new THREE.BoxGeometry(50, 8, 10), furnitureWood));
  mtvStand.position.set(50, 4, 55);
  thirdInt.add(mtvStand);
  const bigTV = addShadow(new THREE.Mesh(new THREE.BoxGeometry(45, 28, 2), darkInt));
  bigTV.position.set(50, 24, 60);
  thirdInt.add(bigTV);
  const bigTVScreen = new THREE.Mesh(new THREE.BoxGeometry(43, 26, 0.5),
    new THREE.MeshStandardMaterial({ color: 0x223344, emissive: 0x223344, emissiveIntensity: 0.3 }));
  bigTVScreen.position.set(50, 24, 61);
  thirdInt.add(bigTVScreen);

  // === STUDY (back-right, where bedroom 2 was on 2nd floor) ===
  // Desk (large)
  const sdesk = addShadow(new THREE.Mesh(new THREE.BoxGeometry(35, 10, 16), furnitureWood));
  sdesk.position.set(80, 5, -50);
  thirdInt.add(sdesk);
  // Office chair
  const ochairBase = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(6, 6, 1, 12), darkInt));
  ochairBase.position.set(80, 3, -38);
  thirdInt.add(ochairBase);
  const ochairBack = addShadow(new THREE.Mesh(new THREE.BoxGeometry(10, 22, 2),
    new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.5 })));
  ochairBack.position.set(80, 13, -33);
  thirdInt.add(ochairBack);
  // Computer monitor
  const monitor = addShadow(new THREE.Mesh(new THREE.BoxGeometry(16, 10, 1), darkInt));
  monitor.position.set(80, 16, -54);
  thirdInt.add(monitor);
  const monitorScreen = new THREE.Mesh(new THREE.BoxGeometry(15, 9, 0.3),
    new THREE.MeshStandardMaterial({ color: 0x223344, emissive: 0x223344, emissiveIntensity: 0.4 }));
  monitorScreen.position.set(80, 16, -54.5);
  thirdInt.add(monitorScreen);
  // Monitor stand
  const mstand = addShadow(new THREE.Mesh(new THREE.BoxGeometry(4, 5, 4), darkInt));
  mstand.position.set(80, 12.5, -54);
  thirdInt.add(mstand);
  // Bookshelf
  const sbookshelf = addShadow(new THREE.Mesh(new THREE.BoxGeometry(35, 50, 6), furnitureWood));
  sbookshelf.position.set(60, 25, -65);
  thirdInt.add(sbookshelf);
  // Books
  for (let i = 0; i < 25; i++) {
    const colors = [0xff6b6b, 0x4ecdc4, 0xffe66d, 0x95e1d3, 0xf38181, 0xaa96da, 0x88d8b0, 0xff8c94, 0xc8b6ff, 0xa8dadc];
    const book = addShadow(new THREE.Mesh(new THREE.BoxGeometry(3, 22, 4),
      new THREE.MeshStandardMaterial({ color: colors[i % colors.length], roughness: 0.6 })));
    book.position.set(48 + i * 3, 30, -65);
    thirdInt.add(book);
  }

  // === KITCHEN (back-center, same as 2nd floor) ===
  const counter3 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(8, 20, 45), counterMat));
  counter3.position.set(15, 10, -42);
  thirdInt.add(counter3);
  const counterTop3 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(10, 1, 47), counterMat));
  counterTop3.position.set(15, 20.5, -42);
  thirdInt.add(counterTop3);
  // Sink
  const kSink3 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(8, 1, 12),
    new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.7, roughness: 0.2 })));
  kSink3.position.set(15, 21, -30);
  thirdInt.add(kSink3);
  const kSinkBowl3 = new THREE.Mesh(new THREE.BoxGeometry(7, 1, 11), darkInt);
  kSinkBowl3.position.set(15, 20, -30);
  thirdInt.add(kSinkBowl3);
  // Stove
  const stove3 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(20, 4, 18), applianceMat));
  stove3.position.set(15, 22, -55);
  thirdInt.add(stove3);
  [[-5, -5], [5, -5], [-5, 5], [5, 5]].forEach(([dx, dz]) => {
    const burner = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.5, 1, 16), darkInt));
    burner.position.set(15 + dx, 24.5, -55 + dz);
    thirdInt.add(burner);
  });
  // Fridge
  const fridge3 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(15, 30, 14), applianceMat));
  fridge3.position.set(25, 15, -22);
  thirdInt.add(fridge3);
  // Microwave on counter
  const microwave = addShadow(new THREE.Mesh(new THREE.BoxGeometry(12, 8, 8), applianceMat));
  microwave.position.set(5, 23, -25);
  thirdInt.add(microwave);
  // Rice cooker (Chinese kitchen essential!)
  const riceCooker = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 6, 16), applianceMat));
  riceCooker.position.set(5, 23.5, -50);
  thirdInt.add(riceCooker);

  // === BATHROOM (same as 2nd floor) ===
  // Shower stall (glass)
  const shower = addShadow(new THREE.Mesh(new THREE.BoxGeometry(15, 30, 15),
    new THREE.MeshStandardMaterial({ color: 0x88aabb, metalness: 0.4, roughness: 0.15, transparent: true, opacity: 0.4 })));
  shower.position.set(50, 15, -55);
  thirdInt.add(shower);
  // Shower head
  const shead = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 3, 8), stainlessMat));
  shead.position.set(50, 28, -62);
  thirdInt.add(shead);
  // Toilet
  const t3_toilet = addShadow(new THREE.Mesh(new THREE.BoxGeometry(8, 10, 12), toiletMat));
  t3_toilet.position.set(70, 5, -65);
  thirdInt.add(t3_toilet);
  const t3_tank = addShadow(new THREE.Mesh(new THREE.BoxGeometry(8, 5, 3), toiletMat));
  t3_tank.position.set(70, 15, -70);
  thirdInt.add(t3_tank);
  // Vanity
  const vanity3 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(15, 12, 8), furnitureWood));
  vanity3.position.set(75, 6, -45);
  thirdInt.add(vanity3);
  const vanityTop3 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(16, 1, 9), counterMat));
  vanityTop3.position.set(75, 12.5, -45);
  thirdInt.add(vanityTop3);
  // Mirror (large, full-height)
  const mirror3 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(16, 30, 0.5), darkInt));
  mirror3.position.set(75, 30, -49);
  thirdInt.add(mirror3);

  // Wall lights
  [-50, 50].forEach((x) => {
    const light = new THREE.Mesh(new THREE.BoxGeometry(6, 3, 2),
      new THREE.MeshStandardMaterial({ color: 0xffdd88, emissive: 0xffdd88, emissiveIntensity: 0.5 }));
    light.position.set(x, 50, -19);
    thirdInt.add(light);
  });

  // Ceiling lights (round LED panels — typical in Chinese apartments)
  [-50, 0, 50].forEach((x) => {
    [30, -50].forEach((z) => {
      const ceilLight = new THREE.Mesh(new THREE.CylinderGeometry(8, 8, 1, 24),
        new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffeecc, emissiveIntensity: 0.5 }));
      ceilLight.position.set(x, FH - 6, z);
      thirdInt.add(ceilLight);
    });
  });

  root.add(thirdInt);

  // ===== ADDITIONAL DETAILED ITEMS =====
  // Wall decorations (paintings) on all floors
  const paintingMat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b, metalness: 0.1, roughness: 0.5 });
  const paintingArt = new THREE.MeshStandardMaterial({ color: 0x4a7c3a, metalness: 0.05, roughness: 0.6 });
  // Ground floor painting
  const gp = addShadow(new THREE.Mesh(new THREE.BoxGeometry(20, 12, 1), paintingMat));
  gp.position.set(0, 40, -67);
  groundInt.add(gp);
  const gpArt = addShadow(new THREE.Mesh(new THREE.BoxGeometry(16, 8, 0.5), paintingArt));
  gpArt.position.set(0, 40, -66.5);
  groundInt.add(gpArt);

  // 2nd floor paintings
  const p2a = addShadow(new THREE.Mesh(new THREE.BoxGeometry(15, 10, 1), paintingMat));
  p2a.position.set(80, 45, -67);
  secondInt.add(p2a);
  const p2b = addShadow(new THREE.Mesh(new THREE.BoxGeometry(15, 10, 1), paintingMat));
  p2b.position.set(-80, 45, -67);
  secondInt.add(p2b);

  // 3rd floor painting
  const p3 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(18, 12, 1), paintingMat));
  p3.position.set(0, 45, -67);
  thirdInt.add(p3);

  // Clock on wall (ground floor)
  const clockBody = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(4, 4, 1, 24), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 })));
  clockBody.rotation.x = Math.PI / 2;
  clockBody.position.set(-50, 55, 67);
  groundInt.add(clockBody);
  const clockHands = addShadow(new THREE.Mesh(new THREE.BoxGeometry(0.5, 3, 0.3), darkInt));
  clockHands.position.set(-50, 55, 67.5);
  groundInt.add(clockHands);

  // Floor lamps in living rooms
  const lampMat = new THREE.MeshStandardMaterial({ color: 0xe5e5e5, metalness: 0.5, roughness: 0.3 });
  const lampGlow = new THREE.MeshStandardMaterial({ color: 0xffeecc, emissive: 0xffeecc, emissiveIntensity: 0.4 });
  // 2F floor lamp
  const fl2pole = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 30, 8), lampMat));
  fl2pole.position.set(85, 15, -10);
  secondInt.add(fl2pole);
  const fl2shade = addShadow(new THREE.Mesh(new THREE.ConeGeometry(5, 8, 16), lampGlow));
  fl2shade.position.set(85, 32, -10);
  secondInt.add(fl2shade);
  const fl2base = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(4, 5, 2, 16), lampMat));
  fl2base.position.set(85, 1, -10);
  secondInt.add(fl2base);

  // 3F floor lamp
  const fl3pole = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 30, 8), lampMat));
  fl3pole.position.set(85, 15, -10);
  thirdInt.add(fl3pole);
  const fl3shade = addShadow(new THREE.Mesh(new THREE.ConeGeometry(5, 8, 16), lampGlow));
  fl3shade.position.set(85, 32, -10);
  thirdInt.add(fl3shade);
  const fl3base = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(4, 5, 2, 16), lampMat));
  fl3base.position.set(85, 1, -10);
  thirdInt.add(fl3base);

  // Potted plants in corners
  const potMat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.7 });
  const foliageMat = new THREE.MeshStandardMaterial({ color: 0x4a7c3a, roughness: 0.9 });
  [[-90, 60], [90, 60], [-90, -60], [90, -60]].forEach(([px, pz]) => {
    const pot = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(3, 4, 5, 12), potMat));
    pot.position.set(px, 2.5, pz);
    groundInt.add(pot);
    const foliage = addShadow(new THREE.Mesh(new THREE.SphereGeometry(5, 12, 10), foliageMat));
    foliage.position.set(px, 8, pz);
    groundInt.add(foliage);
  });

  // Curtains on windows (2nd floor)
  const curtainFab = makeFabricTexture('#6b7b8d', '#4a5a6d');
  curtainFab.map.repeat.set(1, 3);
  curtainFab.bumpMap.repeat.set(1, 3);
  const curtainMat = new THREE.MeshStandardMaterial({
    map: curtainFab.map, bumpMap: curtainFab.bumpMap, bumpScale: 0.08,
    roughness: 0.8, side: THREE.DoubleSide,
  });
  [-70, 70].forEach((x) => {
    const curtain = addShadow(new THREE.Mesh(new THREE.BoxGeometry(2, 40, 25), curtainMat));
    curtain.position.set(x, 50, 70);
    secondInt.add(curtain);
  });

  // Curtains on 3rd floor
  [-70, 70].forEach((x) => {
    const curtain3 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(2, 40, 25), curtainMat));
    curtain3.position.set(x, 50, 70);
    thirdInt.add(curtain3);
  });

  // Kitchen backsplash tiles (2F) — textured
  const bs2 = makeTileTexture('#d4d4d4', '#555555', 16);
  bs2.map.repeat.set(5, 2);
  bs2.bumpMap.repeat.set(5, 2);
  const backsplash2 = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(50, 20, 1),
    new THREE.MeshStandardMaterial({ map: bs2.map, bumpMap: bs2.bumpMap, bumpScale: 0.08, metalness: 0.2, roughness: 0.3 })
  ));
  backsplash2.position.set(15, 35, -64);
  secondInt.add(backsplash2);

  // Kitchen backsplash tiles (3F) — textured
  const bs3 = makeTileTexture('#d4d4d4', '#555555', 16);
  bs3.map.repeat.set(5, 2);
  bs3.bumpMap.repeat.set(5, 2);
  const backsplash3 = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(50, 20, 1),
    new THREE.MeshStandardMaterial({ map: bs3.map, bumpMap: bs3.bumpMap, bumpScale: 0.08, metalness: 0.2, roughness: 0.3 })
  ));
  backsplash3.position.set(15, 35, -64);
  thirdInt.add(backsplash3);

  // Rugs on floors
  const carpetTex = makeCarpetTexture('#8b1a1a', '#d4a020');
  carpetTex.map.repeat.set(4, 3);
  carpetTex.bumpMap.repeat.set(4, 3);
  const rugMat = new THREE.MeshStandardMaterial({
    map: carpetTex.map, bumpMap: carpetTex.bumpMap, bumpScale: 0.08,
    roughness: 0.9, side: THREE.DoubleSide,
  });
  const rug2 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(40, 0.5, 30), rugMat));
  rug2.position.set(40, 1.5, 10);
  secondInt.add(rug2);
  const rug3 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(45, 0.5, 30), rugMat));
  rug3.position.set(45, 1.5, 10);
  thirdInt.add(rug3);

  // Shop sign / menu board on ground floor
  const menuBoard = addShadow(new THREE.Mesh(new THREE.BoxGeometry(30, 20, 1), new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.5 })));
  menuBoard.position.set(-50, 35, -19);
  groundInt.add(menuBoard);
  const menuText = addShadow(new THREE.Mesh(new THREE.BoxGeometry(26, 16, 0.5), new THREE.MeshStandardMaterial({ color: 0xffd700, emissive: 0x442200, roughness: 0.4 })));
  menuText.position.set(-50, 35, -18.5);
  groundInt.add(menuText);

  // Trash can in kitchen (2F)
  const trash2 = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(4, 3, 10, 12), new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.6 })));
  trash2.position.set(25, 5, -20);
  secondInt.add(trash2);

  // Trash can in kitchen (3F)
  const trash3 = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(4, 3, 10, 12), new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.6 })));
  trash3.position.set(25, 5, -20);
  thirdInt.add(trash3);

  // Wall-mounted AC unit controls (decorative panels on walls)
  const acPanel2 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(8, 4, 1), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 })));
  acPanel2.position.set(40, 50, -19);
  secondInt.add(acPanel2);
  const acPanel3 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(8, 4, 1), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 })));
  acPanel3.position.set(40, 50, -19);
  thirdInt.add(acPanel3);

  // ===== SCALE ALL FURNITURE TO PROPER REAL-WORLD SIZE =====
  // Building is 200×140 units = 20×14m (10 units/m).
  // Furniture was authored 2-3x too big. Scale all non-structural meshes
  // by 0.35 and adjust Y so items sit on the floor properly.
  const SCALE = 0.35;
  const structuralMats = new Set<THREE.Material>([
    intWallMat, floorMat, tileFloorMat, stairMat, railingMat, doorMat, darkInt
  ]);

  // Collect all floor groups for Y-offset calculation
  const floorGroups = [
    { group: groundInt, baseY: 0 },
    { group: secondInt, baseY: FH },
    { group: thirdInt, baseY: FH * 2 },
  ];

  floorGroups.forEach(({ group, baseY }) => {
    group.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh) || !obj.material) return;
      const mat = obj.material as THREE.Material;
      let isStructural = false;
      structuralMats.forEach((sm) => { if (mat === sm) isStructural = true; });
      if (isStructural) return;

      // Get bounding box BEFORE scaling (in world space)
      const oldBox = new THREE.Box3().setFromObject(obj);
      const oldBottomY = oldBox.min.y;

      // Scale the mesh
      obj.scale.multiplyScalar(SCALE);

      // Get bounding box AFTER scaling
      const newBox = new THREE.Box3().setFromObject(obj);
      const newBottomY = newBox.min.y;

      // Adjust Y position so the bottom stays at the same height
      obj.position.y += (oldBottomY - newBottomY);
    });
  });

  // Also scale the additional detail items that were added to root directly
  root.children.forEach((child) => {
    if (child === groundInt || child === secondInt || child === thirdInt) return;
    child.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh) || !obj.material) return;
      const mat = obj.material as THREE.Material;
      let isStructural = false;
      structuralMats.forEach((sm) => { if (mat === sm) isStructural = true; });
      if (isStructural) return;

      const oldBox = new THREE.Box3().setFromObject(obj);
      const oldBottomY = oldBox.min.y;
      obj.scale.multiplyScalar(SCALE);
      const newBox = new THREE.Box3().setFromObject(obj);
      const newBottomY = newBox.min.y;
      obj.position.y += (oldBottomY - newBottomY);
    });
  });

  // ===== ADD VISIBLE DETAILS (scaled to match new furniture size) =====
  // Cabinet door lines on kitchen counters (ground floor kitchen)
  const detailMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.5 });
  // Counter door lines (3 visible door seams)
  [35, 45, 55].forEach((x) => {
    const seam = addShadow(new THREE.Mesh(new THREE.BoxGeometry(0.3, 15, 0.3), detailMat));
    seam.position.set(x, 8, -61);
    groundInt.add(seam);
    // Drawer handle
    const handle = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 3, 8), stainlessMat));
    handle.rotation.z = Math.PI / 2;
    handle.position.set(x - 3, 8, -60.5);
    groundInt.add(handle);
  });

  // Fridge water dispenser detail
  const dispenser = addShadow(new THREE.Mesh(new THREE.BoxGeometry(3, 4, 0.5),
    new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.5, roughness: 0.2 })));
  dispenser.position.set(66, 10, -42.5);
  groundInt.add(dispenser);

  // Bed frame detail (2F bedroom 1) — wooden frame around mattress
  const bedFrame2 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(13, 2, 18), furnitureWood));
  bedFrame2.position.set(-24.5, 1.5, 10.5);
  secondInt.add(bedFrame2);

  // Bed frame detail (3F master bedroom)
  const bedFrame3 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(16, 2, 19), furnitureWood));
  bedFrame3.position.set(-22.75, 1.5, 8.75);
  thirdInt.add(bedFrame3);

  // Sofa seam lines (2F living room) — visible cushion separation
  [-5, 5].forEach((offset) => {
    const seam = addShadow(new THREE.Mesh(new THREE.BoxGeometry(0.3, 3, 5), detailMat));
    seam.position.set(14 + offset, 3.5, -3.5);
    secondInt.add(seam);
  });

  // Sofa seam lines (3F living room)
  [-5, 5].forEach((offset) => {
    const seam3 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(0.3, 3, 5), detailMat));
    seam3.position.set(14 + offset, 3.5, -3.5);
    thirdInt.add(seam3);
  });

  // Table legs (2F dining table)
  [[-5, -8], [5, -8], [-5, 8], [5, 8]].forEach(([dx, dz]) => {
    const leg = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 5, 8), furnitureWood));
    leg.position.set(29.75 + dx, 2.5, 10.5 + dz);
    secondInt.add(leg);
  });

  // Table legs (3F dining area — using coffee table position)
  [[-4, -3], [4, -3], [-4, 3], [4, 3]].forEach(([dx, dz]) => {
    const leg = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 4, 8), furnitureWood));
    leg.position.set(15.75 + dx, 2, 3.5 + dz);
    thirdInt.add(leg);
  });

  // Wardrobe drawer handles (2F bedroom 1)
  [-29.75, -19.75].forEach((x) => {
    const handle = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 3, 8), stainlessMat));
    handle.rotation.z = Math.PI / 2;
    handle.position.set(x, 8.75, -6.75);
    secondInt.add(handle);
  });

  // Wardrobe drawer handles (3F master bedroom — 3 doors)
  [-36.75, -29.75, -22.75].forEach((x) => {
    const handle = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 3, 8), stainlessMat));
    handle.rotation.z = Math.PI / 2;
    handle.position.set(x, 9.625, -15.75);
    thirdInt.add(handle);
  });

  // Dresser drawer handles (3F — 3 drawers)
  for (let i = 0; i < 3; i++) {
    const handle = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 2, 8), stainlessMat));
    handle.rotation.z = Math.PI / 2;
    handle.position.set(-8.75, 3.5 + i * 2.45, -15.75);
    thirdInt.add(handle);
  }

  // Toilet seat detail (ground floor WC)
  const seat = addShadow(new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.5, 4.5),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 })));
  seat.position.set(19.25, 5.55, -22.75);
  groundInt.add(seat);

  // Bathroom tile accent strip (2F bathroom)
  const tileStrip2 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(17, 1, 1),
    new THREE.MeshStandardMaterial({ color: 0x4a90c2, roughness: 0.3 })));
  tileStrip2.position.set(17.5, 8.75, -22.75);
  secondInt.add(tileStrip2);

  // Bathroom tile accent strip (3F bathroom)
  const tileStrip3 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(17, 1, 1),
    new THREE.MeshStandardMaterial({ color: 0x4a90c2, roughness: 0.3 })));
  tileStrip3.position.set(17.5, 8.75, -22.75);
  thirdInt.add(tileStrip3);

  // Kitchen drawer pulls on upper cabinets (ground floor)
  [10.5, 15.75, 21].forEach((x) => {
    const pull = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 2, 8), stainlessMat));
    pull.rotation.z = Math.PI / 2;
    pull.position.set(x, 19.25, -62.75);
    groundInt.add(pull);
  });

  // TV remote on coffee table (2F)
  const remote = addShadow(new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.3, 3),
    new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.5 })));
  remote.position.set(14, 2.1, 3.5);
  secondInt.add(remote);

  // Books on desk (3F study)
  for (let i = 0; i < 3; i++) {
    const colors = [0xff6b6b, 0x4ecdc4, 0xffe66d];
    const book = addShadow(new THREE.Mesh(new THREE.BoxGeometry(4, 0.8, 3),
      new THREE.MeshStandardMaterial({ color: colors[i], roughness: 0.6 })));
    book.position.set(28 + i * 0.9, 4.1, -17.5);
    thirdInt.add(book);
  }

  // Coffee cups on dining table (2F)
  [-3, 0, 3].forEach((offset) => {
    const cup = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.6, 1.2, 12),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 })));
    cup.position.set(29.75 + offset, 2.4, 10.5);
    secondInt.add(cup);
  });

  // Flower vase on 3F coffee table
  const vase = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(1, 1.5, 3, 12),
    new THREE.MeshStandardMaterial({ color: 0x4a90c2, transparent: true, opacity: 0.7, roughness: 0.2 })));
  vase.position.set(15.75, 2.5, 3.5);
  thirdInt.add(vase);
  // Flowers in vase
  for (let i = 0; i < 3; i++) {
    const flower = addShadow(new THREE.Mesh(new THREE.SphereGeometry(0.8, 8, 6),
      new THREE.MeshStandardMaterial({ color: [0xff6b6b, 0xffe66d, 0xff8c94][i], roughness: 0.5 })));
    flower.position.set(15.75 + (i - 1) * 0.8, 5, 3.5);
    thirdInt.add(flower);
  }

  // ===== DYNAMIC LIGHTING (makes details pop with real shadows) =====
  const warmLight = 0xffeec0;
  const coolLight = 0xd0e0ff;

  // Ground floor — shop lights (bright, commercial)
  const gLight1 = new THREE.PointLight(warmLight, 0.8, 120, 1.5);
  gLight1.position.set(0, 85, 20);
  gLight1.castShadow = true;
  gLight1.shadow.mapSize.set(512, 512);
  gLight1.shadow.camera.far = 120;
  root.add(gLight1);

  const gLight2 = new THREE.PointLight(coolLight, 0.5, 100, 2);
  gLight2.position.set(-60, 80, -40);
  root.add(gLight2);

  // Ground floor kitchen light
  const gkLight = new THREE.PointLight(warmLight, 0.6, 80, 1.5);
  gkLight.position.set(45, 85, -50);
  root.add(gkLight);

  // 2nd floor — living room warm light
  const f2Light1 = new THREE.PointLight(warmLight, 0.7, 100, 1.5);
  f2Light1.position.set(40, 180, 10);
  f2Light1.castShadow = true;
  f2Light1.shadow.mapSize.set(512, 512);
  root.add(f2Light1);

  // 2nd floor — bedroom cool light
  const f2Light2 = new THREE.PointLight(coolLight, 0.4, 80, 2);
  f2Light2.position.set(-60, 180, 30);
  root.add(f2Light2);

  // 2nd floor — kitchen light
  const f2kLight = new THREE.PointLight(warmLight, 0.5, 70, 1.5);
  f2kLight.position.set(15, 185, -45);
  root.add(f2kLight);

  // 2nd floor — stairwell light
  const f2stairLight = new THREE.PointLight(0xffd700, 0.5, 60, 1.5);
  f2stairLight.position.set(-55, 150, -45);
  root.add(f2stairLight);

  // 3rd floor — living room
  const f3Light1 = new THREE.PointLight(warmLight, 0.7, 100, 1.5);
  f3Light1.position.set(40, 280, 10);
  f3Light1.castShadow = true;
  f3Light1.shadow.mapSize.set(512, 512);
  root.add(f3Light1);

  // 3rd floor — master bedroom
  const f3Light2 = new THREE.PointLight(coolLight, 0.4, 80, 2);
  f3Light2.position.set(-60, 280, 25);
  root.add(f3Light2);

  // 3rd floor — kitchen
  const f3kLight = new THREE.PointLight(warmLight, 0.5, 70, 1.5);
  f3kLight.position.set(15, 285, -45);
  root.add(f3kLight);

  // 3rd floor — stairwell
  const f3stairLight = new THREE.PointLight(0xffd700, 0.5, 60, 1.5);
  f3stairLight.position.set(-55, 250, -45);
  root.add(f3stairLight);

  // ===== BASEBOARDS / WALL TRIM (adds depth to every room) =====
  const trimMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4, metalness: 0.1 });

  // Ground floor baseboards (along exterior walls)
  const gTrimF = addShadow(new THREE.Mesh(new THREE.BoxGeometry(W - WT * 2, 4, 1), trimMat));
  gTrimF.position.set(0, 2, D / 2 - WT - 0.5);
  groundInt.add(gTrimF);
  const gTrimB = addShadow(new THREE.Mesh(new THREE.BoxGeometry(W - WT * 2, 4, 1), trimMat));
  gTrimB.position.set(0, 2, -D / 2 + WT + 0.5);
  groundInt.add(gTrimB);
  [-1, 1].forEach((s) => {
    const t = addShadow(new THREE.Mesh(new THREE.BoxGeometry(1, 4, D - WT * 2), trimMat));
    t.position.set(s * (W / 2 - WT - 0.5), 2, 0);
    groundInt.add(t);
  });

  // 2nd floor baseboards
  const f2TrimF = addShadow(new THREE.Mesh(new THREE.BoxGeometry(W - WT * 2, 4, 1), trimMat));
  f2TrimF.position.set(0, 2, D / 2 - WT - 0.5);
  secondInt.add(f2TrimF);
  const f2TrimB = addShadow(new THREE.Mesh(new THREE.BoxGeometry(W - WT * 2, 4, 1), trimMat));
  f2TrimB.position.set(0, 2, -D / 2 + WT + 0.5);
  secondInt.add(f2TrimB);
  [-1, 1].forEach((s) => {
    const t = addShadow(new THREE.Mesh(new THREE.BoxGeometry(1, 4, D - WT * 2), trimMat));
    t.position.set(s * (W / 2 - WT - 0.5), 2, 0);
    secondInt.add(t);
  });

  // 3rd floor baseboards
  const f3TrimF = addShadow(new THREE.Mesh(new THREE.BoxGeometry(W - WT * 2, 4, 1), trimMat));
  f3TrimF.position.set(0, 2, D / 2 - WT - 0.5);
  thirdInt.add(f3TrimF);
  const f3TrimB = addShadow(new THREE.Mesh(new THREE.BoxGeometry(W - WT * 2, 4, 1), trimMat));
  f3TrimB.position.set(0, 2, -D / 2 + WT + 0.5);
  thirdInt.add(f3TrimB);
  [-1, 1].forEach((s) => {
    const t = addShadow(new THREE.Mesh(new THREE.BoxGeometry(1, 4, D - WT * 2), trimMat));
    t.position.set(s * (W / 2 - WT - 0.5), 2, 0);
    thirdInt.add(t);
  });

  // ===== CROWN MOLDING (top of walls, adds architectural detail) =====
  const crownMat = new THREE.MeshStandardMaterial({ color: 0xf0f0f0, roughness: 0.3, metalness: 0.15 });
  // Ground floor
  [-1, 1].forEach((s) => {
    const crown = addShadow(new THREE.Mesh(new THREE.BoxGeometry(W - WT * 2, 3, 2), crownMat));
    crown.position.set(0, FH - 15, s * (D / 2 - WT - 1));
    groundInt.add(crown);
  });
  // 2nd floor
  [-1, 1].forEach((s) => {
    const crown = addShadow(new THREE.Mesh(new THREE.BoxGeometry(W - WT * 2, 3, 2), crownMat));
    crown.position.set(0, FH - 15, s * (D / 2 - WT - 1));
    secondInt.add(crown);
  });
  // 3rd floor
  [-1, 1].forEach((s) => {
    const crown = addShadow(new THREE.Mesh(new THREE.BoxGeometry(W - WT * 2, 3, 2), crownMat));
    crown.position.set(0, FH - 15, s * (D / 2 - WT - 1));
    thirdInt.add(crown);
  });

  // ===== CEILING PANELS (drop ceiling tiles in shop) =====
  const ceilPanelMat = new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.6, metalness: 0.05 });
  // Ground floor ceiling grid
  for (let x = -80; x <= 80; x += 40) {
    for (let z = -50; z <= 50; z += 40) {
      const panel = addShadow(new THREE.Mesh(new THREE.BoxGeometry(38, 1, 38), ceilPanelMat));
      panel.position.set(x, FH - 5, z);
      groundInt.add(panel);
    }
  }
  // Ceiling grid lines (dark)
  const gridMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.5 });
  for (let x = -80; x <= 80; x += 40) {
    const line = addShadow(new THREE.Mesh(new THREE.BoxGeometry(1, 1.5, 180), gridMat));
    line.position.set(x, FH - 4, 0);
    groundInt.add(line);
  }
  for (let z = -50; z <= 50; z += 40) {
    const line = addShadow(new THREE.Mesh(new THREE.BoxGeometry(180, 1.5, 1), gridMat));
    line.position.set(0, FH - 4, z);
    groundInt.add(line);
  }

  // ===== WINDOW SILL DETAILS (interior side) =====
  const sillMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.3, metalness: 0.2 });
  // 2nd floor window sills
  [-70, 70].forEach((x) => {
    const sill = addShadow(new THREE.Mesh(new THREE.BoxGeometry(45, 2, 5), sillMat));
    sill.position.set(x, 30, D / 2 - WT - 1);
    secondInt.add(sill);
  });
  // 3rd floor window sills
  [-75, 75].forEach((x) => {
    const sill = addShadow(new THREE.Mesh(new THREE.BoxGeometry(40, 2, 5), sillMat));
    sill.position.set(x, 30, D / 2 - WT - 1);
    thirdInt.add(sill);
  });

  // ===== WALL OUTLET COVERS (small details) =====
  const outletMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
  [[-80, 20], [80, 20], [-80, -30], [80, -30]].forEach(([x, z]) => {
    const outlet = addShadow(new THREE.Mesh(new THREE.BoxGeometry(3, 5, 0.5), outletMat));
    outlet.position.set(x, 15, z > 0 ? D / 2 - WT - 0.5 : -D / 2 + WT + 0.5);
    groundInt.add(outlet);
  });

  // ===== LIGHT SWITCH PLATES =====
  [[-50, 25], [50, 25]].forEach(([x, z]) => {
    const sw = addShadow(new THREE.Mesh(new THREE.BoxGeometry(4, 5, 0.5), outletMat));
    sw.position.set(x, 30, z > 0 ? D / 2 - WT - 0.5 : -D / 2 + WT + 0.5);
    groundInt.add(sw);
  });

  // ===== DOOR FRAME CASINGS (trim around door openings) =====
  const casingMat = new THREE.MeshStandardMaterial({ color: 0xf5f5f0, roughness: 0.4 });
  // Add casing around the dividing wall doors on each floor
  ([
    [groundInt, -50, -20], [groundInt, 50, -20],
    [secondInt, -50, -20], [secondInt, 50, -20],
    [thirdInt, -50, -20], [thirdInt, 50, -20],
  ] as [THREE.Group, number, number][]).forEach(([grp, x, z]) => {
    // Top casing
    const top = addShadow(new THREE.Mesh(new THREE.BoxGeometry(18, 3, 2), casingMat));
    top.position.set(x, 30, z);
    grp.add(top);
    // Left casing
    const left = addShadow(new THREE.Mesh(new THREE.BoxGeometry(2, 30, 2), casingMat));
    left.position.set(x - 8, 15, z);
    grp.add(left);
    // Right casing
    const right = addShadow(new THREE.Mesh(new THREE.BoxGeometry(2, 30, 2), casingMat));
    right.position.set(x + 8, 15, z);
    grp.add(right);
  });

  // ===== WALL WAINSCOTING (lower wall paneling in living rooms) =====
  const wainscotMat = new THREE.MeshStandardMaterial({ color: 0xe8e0d0, roughness: 0.5, metalness: 0.05 });
  // 2nd floor living room wainscoting (back wall section)
  const w2 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(80, 30, 0.5), wainscotMat));
  w2.position.set(40, 15, -D / 2 + WT + 0.5);
  secondInt.add(w2);
  // Chair rail above wainscoting
  const cr2 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(80, 2, 1), casingMat));
  cr2.position.set(40, 30, -D / 2 + WT + 1);
  secondInt.add(cr2);

  // 3rd floor living room wainscoting
  const w3 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(80, 30, 0.5), wainscotMat));
  w3.position.set(40, 15, -D / 2 + WT + 0.5);
  thirdInt.add(w3);
  const cr3 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(80, 2, 1), casingMat));
  cr3.position.set(40, 30, -D / 2 + WT + 1);
  thirdInt.add(cr3);

  // ===== VISIBLE LIGHT FIXTURES (matching the point lights) =====
  const fixtureMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffeec0, emissiveIntensity: 0.6, roughness: 0.3 });

  // Ground floor — 2 ceiling light fixtures (shop)
  [-30, 30].forEach((x) => {
    const fixture = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(8, 8, 2, 24), fixtureMat));
    fixture.position.set(x, FH - 8, 20);
    groundInt.add(fixture);
    // Light fixture frame
    const frame = addShadow(new THREE.Mesh(new THREE.TorusGeometry(8, 0.5, 6, 24),
      new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.7, roughness: 0.3 })));
    frame.position.set(x, FH - 7, 20);
    frame.rotation.x = Math.PI / 2;
    groundInt.add(frame);
  });

  // 2nd floor — pendant light over dining table
  const pendant2 = addShadow(new THREE.Mesh(new THREE.ConeGeometry(5, 6, 16), fixtureMat));
  pendant2.position.set(30, FH - 15, 10);
  pendant2.rotation.x = Math.PI;
  secondInt.add(pendant2);
  const pendantCord2 = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 15, 8), darkInt));
  pendantCord2.position.set(30, FH - 5, 10);
  secondInt.add(pendantCord2);

  // 3rd floor — pendant light
  const pendant3 = addShadow(new THREE.Mesh(new THREE.ConeGeometry(5, 6, 16), fixtureMat));
  pendant3.position.set(30, FH - 15, 10);
  pendant3.rotation.x = Math.PI;
  thirdInt.add(pendant3);
  const pendantCord3 = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 15, 8), darkInt));
  pendantCord3.position.set(30, FH - 5, 10);
  thirdInt.add(pendantCord3);

  // Kitchen under-cabinet lights (LED strips)
  const ledMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffeec0, emissiveIntensity: 0.8 });
  const led2 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(40, 0.5, 1), ledMat));
  led2.position.set(15, 23, -60);
  secondInt.add(led2);
  const led3 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(40, 0.5, 1), ledMat));
  led3.position.set(15, 23, -60);
  thirdInt.add(led3);

  return root;
}
