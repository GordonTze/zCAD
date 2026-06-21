// ====================== LA HILLS MANSION ======================
// A modern luxury mansion perched on the Hollywood Hills.
// 3 levels: garage/gym ground floor, main living floor, bedroom suites + rooftop.
// Features: infinity pool, glass walls, cantilevered sections, infinity-edge roof deck.

import * as THREE from 'three';
import { addShadow } from './materials-dsl';
import {
  makeWoodTexture, makeFabricTexture,
  makeGraniteTexture, makeConcreteTexture, makeStoneTexture,
} from './building-textures';

export function createLAMansionGeometry(): THREE.Group {
  const root = new THREE.Group();

  // ===== MATERIALS =====
  const whiteConcreteTex = makeConcreteTexture('#e8e6e0');
  whiteConcreteTex.map.repeat.set(8, 4);
  whiteConcreteTex.bumpMap.repeat.set(8, 4);
  const wallMat = new THREE.MeshStandardMaterial({
    map: whiteConcreteTex.map, bumpMap: whiteConcreteTex.bumpMap, bumpScale: 0.02,
    metalness: 0.05, roughness: 0.7,
  });

  const glassMat = new THREE.MeshStandardMaterial({
    color: 0x223344, metalness: 0.7, roughness: 0.1,
    transparent: true, opacity: 0.4,
  });

  const darkFrameMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.8, roughness: 0.2 });
  const trimMat = new THREE.MeshStandardMaterial({ color: 0xc0c0c0, metalness: 0.9, roughness: 0.1 });

  const woodFloor = makeWoodTexture('#8b6b3a', '#4a3010');
  woodFloor.map.repeat.set(12, 8);
  woodFloor.bumpMap.repeat.set(12, 8);
  const woodFloorMat = new THREE.MeshStandardMaterial({
    map: woodFloor.map, bumpMap: woodFloor.bumpMap, bumpScale: 0.04, metalness: 0.1, roughness: 0.5,
  });

  const polishedConcrete = makeConcreteTexture('#cccccc');
  polishedConcrete.map.repeat.set(10, 6);
  const concreteFloorMat = new THREE.MeshStandardMaterial({
    map: polishedConcrete.map, bumpMap: polishedConcrete.bumpMap, bumpScale: 0.03, metalness: 0.1, roughness: 0.4,
  });

  const poolMat = new THREE.MeshStandardMaterial({
    color: 0x006994, metalness: 0.3, roughness: 0.05,
    transparent: true, opacity: 0.75,
  });

  const deckMat = makeWoodTexture('#6b5030', '#3a2510');
  deckMat.map.repeat.set(20, 6);
  deckMat.bumpMap.repeat.set(20, 6);
  const deckMaterial = new THREE.MeshStandardMaterial({
    map: deckMat.map, bumpMap: deckMat.bumpMap, bumpScale: 0.05, metalness: 0.05, roughness: 0.7,
  });

  const modernSofa = makeFabricTexture('#3a3a3a', '#2a2a2a');
  modernSofa.map.repeat.set(3, 1);
  modernSofa.bumpMap.repeat.set(3, 1);
  const sofaMat = new THREE.MeshStandardMaterial({
    map: modernSofa.map, bumpMap: modernSofa.bumpMap, bumpScale: 0.06, metalness: 0.05, roughness: 0.7,
  });

  const whiteFurnMat = new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.3, metalness: 0.1 });

  const graniteKitchen = makeGraniteTexture();
  graniteKitchen.map.repeat.set(4, 1);
  graniteKitchen.bumpMap.repeat.set(4, 1);
  const counterMat = new THREE.MeshStandardMaterial({
    map: graniteKitchen.map, bumpMap: graniteKitchen.bumpMap, bumpScale: 0.01, metalness: 0.4, roughness: 0.1,
  });

  const cabinetMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.3, roughness: 0.3 });
  const applianceMat2 = new THREE.MeshStandardMaterial({ color: 0xe8e8e8, metalness: 0.8, roughness: 0.1 });

  const gardenMat = new THREE.MeshStandardMaterial({ color: 0x3a5a2a, roughness: 0.9 });
  const stoneMat = makeStoneTexture();
  stoneMat.map.repeat.set(4, 2);
  const retainingMat = new THREE.MeshStandardMaterial({
    map: stoneMat.map, bumpMap: stoneMat.bumpMap, bumpScale: 0.1, roughness: 0.8,
  });

  const FH = 100; // floor height

  // ============================================================
  // HILLSIDE / GROUND TERRAIN
  // ============================================================
  // Hillside slope (back of lot rises up)
  const hill = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(600, 200, 200),
    gardenMat
  ));
  hill.position.set(0, -50, -200);
  root.add(hill);

  // Retaining wall (stone, at back of building)
  const retaining = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(280, 120, 8), retainingMat
  ));
  retaining.position.set(0, 10, -85);
  root.add(retaining);

  // Front yard / driveway (concrete)
  const driveway = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(300, 2, 120), concreteFloorMat
  ));
  driveway.position.set(0, -1, 100);
  root.add(driveway);

  // Garden area (grass) on sides
  const gardenL = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(60, 1, 300), gardenMat
  ));
  gardenL.position.set(-170, 0, 50);
  root.add(gardenL);
  const gardenR = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(60, 1, 300), gardenMat
  ));
  gardenR.position.set(170, 0, 50);
  root.add(gardenR);

  // ============================================================
  // LEVEL 1 (Ground): Garage + Gym + Wine Cellar
  // ============================================================
  const level1 = new THREE.Group();

  // Floor slab
  const l1Floor = addShadow(new THREE.Mesh(new THREE.BoxGeometry(240, 2, 160), concreteFloorMat));
  l1Floor.position.set(0, 1, 0);
  level1.add(l1Floor);

  // Back wall (against hillside, concrete)
  const l1Back = addShadow(new THREE.Mesh(new THREE.BoxGeometry(240, FH, 8), wallMat));
  l1Back.position.set(0, FH / 2, -80);
  level1.add(l1Back);

  // Side walls
  [-120, 120].forEach((x) => {
    const w = addShadow(new THREE.Mesh(new THREE.BoxGeometry(8, FH, 160), wallMat));
    w.position.set(x, FH / 2, 0);
    level1.add(w);
  });

  // Front wall — mostly garage doors + entry
  // Left section (solid)
  const l1FrontL = addShadow(new THREE.Mesh(new THREE.BoxGeometry(50, FH, 8), wallMat));
  l1FrontL.position.set(-95, FH / 2, 80);
  level1.add(l1FrontL);
  // Right section (solid)
  const l1FrontR = addShadow(new THREE.Mesh(new THREE.BoxGeometry(50, FH, 8), wallMat));
  l1FrontR.position.set(95, FH / 2, 80);
  level1.add(l1FrontR);
  // Lintel above garage
  const l1Lintel = addShadow(new THREE.Mesh(new THREE.BoxGeometry(90, 20, 8), wallMat));
  l1Lintel.position.set(0, FH - 10, 80);
  level1.add(l1Lintel);

  // Garage doors (3 modern roll-up doors)
  [-45, 0, 45].forEach((x) => {
    const door = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(38, 70, 2),
      new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.6, roughness: 0.3 })
    ));
    door.position.set(x, 35, 81);
    level1.add(door);
    // Door frame
    const frame = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(42, 74, 3), darkFrameMat
    ));
    frame.position.set(x, 35, 79);
    level1.add(frame);
    // Door panel lines (horizontal)
    for (let i = 0; i < 5; i++) {
      const line = addShadow(new THREE.Mesh(
        new THREE.BoxGeometry(36, 0.5, 0.5), trimMat
      ));
      line.position.set(x, 10 + i * 14, 82);
      level1.add(line);
    }
  });

  // Interior wall separating garage from gym
  const l1Div = addShadow(new THREE.Mesh(new THREE.BoxGeometry(8, FH, 100), wallMat));
  l1Div.position.set(0, FH / 2, -30);
  level1.add(l1Div);
  // Door opening in divider
  const l1DoorFrame = addShadow(new THREE.Mesh(new THREE.BoxGeometry(12, 30, 10), darkFrameMat));
  l1DoorFrame.position.set(0, 15, 10);
  level1.add(l1DoorFrame);

  // Gym area (left side, x=-120 to 0)
  // Gym mirror wall
  const gymMirror = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(2, 60, 80), glassMat
  ));
  gymMirror.position.set(-116, 35, -30);
  level1.add(gymMirror);

  // Gym equipment (treadmill)
  const treadmill = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(15, 5, 30), darkFrameMat
  ));
  treadmill.position.set(-80, 5, -20);
  level1.add(treadmill);
  const treadmillBelt = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(12, 1, 20), new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.3 })
  ));
  treadmillBelt.position.set(-80, 8, -20);
  level1.add(treadmillBelt);
  // Treadmill console
  const tmConsole = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(15, 15, 3), darkFrameMat
  ));
  tmConsole.position.set(-80, 12, -36);
  level1.add(tmConsole);

  // Weight rack
  const weightRack = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(20, 30, 6), new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.7, roughness: 0.3 })
  ));
  weightRack.position.set(-90, 15, 10);
  level1.add(weightRack);
  // Dumbbells on rack (5 pairs)
  for (let i = 0; i < 5; i++) {
    const db = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(8, 4, 4), new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8, roughness: 0.2 })
    ));
    db.position.set(-90, 6 + i * 5, 10);
    level1.add(db);
  }

  // Wine cellar (right side, behind gym wall)
  // Wine racks (2 rows of bottles)
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 10; col++) {
      const bottle = addShadow(new THREE.Mesh(
        new THREE.CylinderGeometry(1.2, 1.2, 8, 12),
        new THREE.MeshStandardMaterial({
          color: [0x8b0000, 0x228b22, 0x4a2a1a, 0xffd700][row % 4],
          metalness: 0.3, roughness: 0.4,
        })
      ));
      bottle.position.set(40 + col * 8, 5 + row * 10, -60);
      bottle.rotation.x = Math.PI / 2;
      level1.add(bottle);
    }
  }
  // Wine rack frame
  const wineFrame = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(90, 50, 5), new THREE.MeshStandardMaterial({ color: 0x4a3010, roughness: 0.6 })
  ));
  wineFrame.position.set(80, 25, -65);
  level1.add(wineFrame);

  // Ceiling
  const l1Ceiling = addShadow(new THREE.Mesh(new THREE.BoxGeometry(240, 2, 160), wallMat));
  l1Ceiling.position.set(0, FH, 0);
  level1.add(l1Ceiling);

  root.add(level1);

  // ============================================================
  // LEVEL 2 (Main Living Floor) — cantilevered over ground floor
  // ============================================================
  const level2 = new THREE.Group();
  level2.position.y = FH;

  // Floor slab (extends beyond level 1 walls — cantilevered)
  const l2Floor = addShadow(new THREE.Mesh(new THREE.BoxGeometry(280, 3, 180), woodFloorMat));
  l2Floor.position.set(0, 1.5, 10);
  level2.add(l2Floor);

  // Back wall (solid concrete, against hill)
  const l2Back = addShadow(new THREE.Mesh(new THREE.BoxGeometry(280, FH, 8), wallMat));
  l2Back.position.set(0, FH / 2, -80);
  level2.add(l2Back);

  // Side walls (shorter, allowing glass on front and sides)
  [-140, 140].forEach((x) => {
    const w = addShadow(new THREE.Mesh(new THREE.BoxGeometry(8, FH, 80), wallMat));
    w.position.set(x, FH / 2, -40);
    level2.add(w);
  });

  // Front and side GLASS walls (floor-to-ceiling)
  // Front glass wall (facing the view)
  const frontGlass = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(240, 80, 2), glassMat
  ));
  frontGlass.position.set(0, 45, 90);
  level2.add(frontGlass);
  // Glass wall frame (vertical mullions)
  for (let x = -100; x <= 100; x += 40) {
    const mullion = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(3, 80, 4), darkFrameMat
    ));
    mullion.position.set(x, 45, 91);
    level2.add(mullion);
  }
  // Top and bottom frame
  const topFrame = addShadow(new THREE.Mesh(new THREE.BoxGeometry(240, 4, 4), darkFrameMat));
  topFrame.position.set(0, 85, 91);
  level2.add(topFrame);
  const botFrame = addShadow(new THREE.Mesh(new THREE.BoxGeometry(240, 4, 4), darkFrameMat));
  botFrame.position.set(0, 5, 91);
  level2.add(botFrame);

  // Left side glass wall
  const leftGlass = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(2, 80, 100), glassMat
  ));
  leftGlass.position.set(-141, 45, 10);
  level2.add(leftGlass);
  for (let z = -30; z <= 50; z += 40) {
    const mullion = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(4, 80, 3), darkFrameMat
    ));
    mullion.position.set(-141, 45, z);
    level2.add(mullion);
  }

  // Right side glass wall
  const rightGlass = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(2, 80, 100), glassMat
  ));
  rightGlass.position.set(141, 45, 10);
  level2.add(rightGlass);

  // Interior divider wall (separates kitchen from living)
  const l2Div = addShadow(new THREE.Mesh(new THREE.BoxGeometry(8, 60, 40), wallMat));
  l2Div.position.set(40, 30, -20);
  level2.add(l2Div);

  // === LIVING ROOM (front, open plan) ===
  // L-shaped modern sofa (white/gray)
  const sofa1Base = addShadow(new THREE.Mesh(new THREE.BoxGeometry(60, 8, 20), sofaMat));
  sofa1Base.position.set(-30, 6, 50);
  level2.add(sofa1Base);
  const sofa1Back = addShadow(new THREE.Mesh(new THREE.BoxGeometry(60, 25, 4), sofaMat));
  sofa1Back.position.set(-30, 17, 42);
  level2.add(sofa1Back);
  const sofa1Side = addShadow(new THREE.Mesh(new THREE.BoxGeometry(4, 25, 20), sofaMat));
  sofa1Side.position.set(-58, 17, 50);
  level2.add(sofa1Side);
  // Sofa cushions
  [-15, 0, 15, 30].forEach((x) => {
    const cushion = addShadow(new THREE.Mesh(new THREE.BoxGeometry(14, 3, 16), sofaMat));
    cushion.position.set(-30 + x, 11, 50);
    level2.add(cushion);
  });

  // Modern coffee table (glass top + metal base)
  const coffeeBase = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(30, 1, 15), trimMat
  ));
  coffeeBase.position.set(-30, 4, 68);
  level2.add(coffeeBase);
  const coffeeLegs = [[-12, -5], [12, -5], [-12, 5], [12, 5]].forEach(([dx, dz]) => {
    const leg = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 4, 8), trimMat));
    leg.position.set(-30 + dx, 2, 68 + dz);
    level2.add(leg);
  });
  const coffeeGlass = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(32, 1, 17), glassMat
  ));
  coffeeGlass.position.set(-30, 5, 68);
  level2.add(coffeeGlass);

  // Modern fireplace (against back wall)
  const fireBase = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(40, 3, 15), new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.3 })
  ));
  fireBase.position.set(-50, 3, -70);
  level2.add(fireBase);
  const fireWall = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(40, 60, 2),
    new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.2 })
  ));
  fireWall.position.set(-50, 35, -78);
  level2.add(fireWall);
  // Fire glowing
  const fireGlow = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(20, 8, 2),
    new THREE.MeshStandardMaterial({ color: 0xff6600, emissive: 0xff4400, emissiveIntensity: 0.8 })
  ));
  fireGlow.position.set(-50, 8, -77);
  level2.add(fireGlow);
  // Fire light
  const fireLight = new THREE.PointLight(0xff6600, 1.0, 80, 2);
  fireLight.position.set(-50, 15, -60);
  root.add(fireLight);

  // TV (wall-mounted, 85-inch flat panel)
  const tv = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(50, 28, 1.5), darkFrameMat
  ));
  tv.position.set(80, 45, -78);
  level2.add(tv);
  const tvScreen = new THREE.Mesh(
    new THREE.BoxGeometry(48, 26, 0.5),
    new THREE.MeshStandardMaterial({ color: 0x000011, emissive: 0x001133, emissiveIntensity: 0.2 })
  );
  tvScreen.position.set(80, 45, -77);
  level2.add(tvScreen);

  // === DINING AREA (right side) ===
  const diningTable = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(40, 3, 15), whiteFurnMat
  ));
  diningTable.position.set(70, 20, 40);
  level2.add(diningTable);
  // Table base (single pedestal)
  const diningBase = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(3, 5, 20, 16), trimMat
  ));
  diningBase.position.set(70, 10, 40);
  level2.add(diningBase);
  // Dining chairs (8 — modern design)
  [[55, 30], [85, 30], [55, 50], [85, 50], [55, 35], [85, 35], [55, 45], [85, 45]].forEach(([x, z]) => {
    const chairSeat = addShadow(new THREE.Mesh(new THREE.BoxGeometry(8, 2, 8), whiteFurnMat));
    chairSeat.position.set(x, 16, z);
    level2.add(chairSeat);
    const chairBack = addShadow(new THREE.Mesh(new THREE.BoxGeometry(8, 12, 1), whiteFurnMat));
    chairBack.position.set(x, 22, z - 4);
    level2.add(chairBack);
    // Chair leg
    const leg = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 16, 8), trimMat));
    leg.position.set(x, 8, z);
    level2.add(leg);
  });

  // Pendant lights over dining table (3)
  [60, 70, 80].forEach((x) => {
    const pendant = addShadow(new THREE.Mesh(
      new THREE.SphereGeometry(3, 16, 12),
      new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffeec0, emissiveIntensity: 0.7 })
    ));
    pendant.position.set(x, 65, 40);
    level2.add(pendant);
    const cord = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 15, 8), darkFrameMat));
    cord.position.set(x, 75, 40);
    level2.add(cord);
    // Light
    const light = new THREE.PointLight(0xffeec0, 0.5, 50, 2);
    light.position.set(x, 65, 40);
    level2.add(light);
  });

  // === KITCHEN (back-right, open plan) ===
  // Kitchen island (large, with waterfall countertop)
  const island = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(60, 30, 25), cabinetMat
  ));
  island.position.set(80, 15, -40);
  level2.add(island);
  // Island countertop (granite, waterfall sides)
  const islandTop = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(64, 3, 29), counterMat
  ));
  islandTop.position.set(80, 31, -40);
  level2.add(islandTop);
  // Waterfall sides
  [-1, 1].forEach((s) => {
    const side = addShadow(new THREE.Mesh(new THREE.BoxGeometry(64, 30, 2), counterMat));
    side.position.set(80, 16, -40 + s * 14);
    level2.add(side);
  });

  // Bar stools at island (4)
  [60, 70, 80, 90].forEach((x) => {
    const stool = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(2.5, 2.5, 18, 12), trimMat
    ));
    stool.position.set(x, 9, -25);
    level2.add(stool);
    const stoolSeat = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(3, 3, 2, 12), whiteFurnMat
    ));
    stoolSeat.position.set(x, 18, -25);
    level2.add(stoolSeat);
  });

  // Back wall kitchen counter + cabinets
  const kitchenCounter = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(80, 25, 10), cabinetMat
  ));
  kitchenCounter.position.set(80, 12, -75);
  level2.add(kitchenCounter);
  const kitchenTop = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(84, 2, 14), counterMat
  ));
  kitchenTop.position.set(80, 26, -75);
  level2.add(kitchenTop);

  // Upper cabinets
  const upperCabs = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(80, 20, 8), cabinetMat
  ));
  upperCabs.position.set(80, 50, -77);
  level2.add(upperCabs);

  // Built-in appliances (stove, oven)
  const stove2 = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(20, 4, 12), applianceMat2
  ));
  stove2.position.set(60, 27, -75);
  level2.add(stove2);
  // Stove burners
  [[-4, -2], [4, -2], [-4, 2], [4, 2]].forEach(([dx, dz]) => {
    const burner = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 0.5, 16), darkFrameMat));
    burner.position.set(60 + dx, 29, -75 + dz);
    level2.add(burner);
  });

  // Fridge (built-in, panel-ready)
  const fridge2 = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(18, 40, 12), cabinetMat
  ));
  fridge2.position.set(110, 20, -75);
  level2.add(fridge2);

  // Wine fridge (glass front)
  const wineFridge = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(15, 30, 12),
    new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.5, roughness: 0.2 })
  ));
  wineFridge.position.set(-30, 15, -75);
  level2.add(wineFridge);

  // Ceiling
  const l2Ceiling = addShadow(new THREE.Mesh(new THREE.BoxGeometry(280, 2, 180), wallMat));
  l2Ceiling.position.set(0, FH, 10);
  level2.add(l2Ceiling);

  root.add(level2);

  // ============================================================
  // INFINITY POOL + DECK (front of level 2, cantilevered)
  // ============================================================
  // Pool deck (wood decking extending past glass wall)
  const poolDeck = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(280, 2, 60), deckMaterial
  ));
  poolDeck.position.set(0, FH + 3, 120);
  root.add(poolDeck);

  // Infinity pool
  const pool = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(80, 15, 30), poolMat
  ));
  pool.position.set(0, FH + 2, 130);
  root.add(pool);

  // Pool infinity edge (front wall — water flows over)
  const poolEdge = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(82, 8, 2),
    new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.5, roughness: 0.2 })
  ));
  poolEdge.position.set(0, FH + 1, 146);
  root.add(poolEdge);

  // Pool lounge chairs (4)
  [-30, -10, 10, 30].forEach((x) => {
    const lounger = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(8, 3, 20), whiteFurnMat
    ));
    lounger.position.set(x, FH + 5, 115);
    root.add(lounger);
    // Lounger backrest
    const backrest = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(8, 12, 3), whiteFurnMat
    ));
    backrest.position.set(x, FH + 9, 108);
    root.add(backrest);
  });

  // Pool umbrella
  const umbrellaPole = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(0.8, 0.8, 30, 8), trimMat
  ));
  umbrellaPole.position.set(-50, FH + 18, 125);
  root.add(umbrellaPole);
  const umbrellaTop = addShadow(new THREE.Mesh(
    new THREE.ConeGeometry(15, 5, 16),
    new THREE.MeshStandardMaterial({ color: 0xd4a574, roughness: 0.5 })
  ));
  umbrellaTop.position.set(-50, FH + 33, 125);
  root.add(umbrellaTop);

  // ============================================================
  // LEVEL 3 (Bedroom Suites + Rooftop Deck)
  // ============================================================
  const level3 = new THREE.Group();
  level3.position.y = FH * 2;

  // Floor slab (smaller footprint — set back for rooftop deck)
  const l3Floor = addShadow(new THREE.Mesh(new THREE.BoxGeometry(200, 3, 140), woodFloorMat));
  l3Floor.position.set(-20, 1.5, -10);
  level3.add(l3Floor);

  // Back wall
  const l3Back = addShadow(new THREE.Mesh(new THREE.BoxGeometry(200, FH, 8), wallMat));
  l3Back.position.set(-20, FH / 2, -80);
  level3.add(l3Back);

  // Side walls
  [-120, 80].forEach((x) => {
    const w = addShadow(new THREE.Mesh(new THREE.BoxGeometry(8, FH, 100), wallMat));
    w.position.set(x, FH / 2, -30);
    level3.add(w);
  });

  // Interior divider walls (separating 2 bedroom suites)
  const l3Div1 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(8, FH, 60), wallMat));
  l3Div1.position.set(-20, FH / 2, -20);
  level3.add(l3Div1);

  // Front glass walls
  const l3Glass = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(180, 80, 2), glassMat
  ));
  l3Glass.position.set(-30, 45, 60);
  level3.add(l3Glass);
  // Glass mullions
  for (let x = -100; x <= 40; x += 40) {
    const m = addShadow(new THREE.Mesh(new THREE.BoxGeometry(3, 80, 4), darkFrameMat));
    m.position.set(x, 45, 61);
    level3.add(m);
  }

  // === MASTER SUITE (left side) ===
  // King bed
  const masterBed = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(50, 8, 60), new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.5 })
  ));
  masterBed.position.set(-70, 6, 10);
  level3.add(masterBed);
  // Mattress
  const masterMattress = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(48, 4, 58),
    new THREE.MeshStandardMaterial({ color: 0xf0f0f0, roughness: 0.5 })
  ));
  masterMattress.position.set(-70, 10, 10);
  level3.add(masterMattress);
  // Pillows
  [-82, -58].forEach((x) => {
    const p = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(15, 3, 10),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 })
    ));
    p.position.set(x, 13, -14);
    level3.add(p);
  });
  // Headboard (floor-to-ceiling wood panel)
  const headboard3 = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(60, 70, 3),
    new THREE.MeshStandardMaterial({ color: 0x4a3010, roughness: 0.4 })
  ));
  headboard3.position.set(-70, 38, -22);
  level3.add(headboard3);

  // Nightstands (floating, modern)
  [-100, -40].forEach((x) => {
    const ns = addShadow(new THREE.Mesh(new THREE.BoxGeometry(10, 5, 10), whiteFurnMat));
    ns.position.set(x, 12, -5);
    level3.add(ns);
    // Modern lamp
    const lampBase = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(1, 2, 1, 8), trimMat));
    lampBase.position.set(x, 15, -5);
    level3.add(lampBase);
    const lampStem = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 8, 8), trimMat));
    lampStem.position.set(x, 19, -5);
    level3.add(lampStem);
    const lampShade = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(3, 4, 4, 16),
      new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffeec0, emissiveIntensity: 0.5 })
    ));
    lampShade.position.set(x, 25, -5);
    level3.add(lampShade);
  });

  // Master bathroom (behind bed area)
  // Freestanding soaking tub
  const tub = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(12, 10, 15, 24),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1, metalness: 0.1 })
  ));
  tub.position.set(-90, 8, 40);
  level3.add(tub);
  // Tub interior
  const tubInt = new THREE.Mesh(
    new THREE.CylinderGeometry(10, 8, 14, 24),
    new THREE.MeshStandardMaterial({ color: 0x006994, metalness: 0.3, roughness: 0.05 })
  );
  tubInt.position.set(-90, 9, 40);
  level3.add(tubInt);

  // Double vanity (floating)
  const vanity3 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(40, 2, 12), whiteFurnMat));
  vanity3.position.set(-50, 25, 50);
  level3.add(vanity3);
  // Vessel sinks (2)
  [-60, -40].forEach((x) => {
    const sink = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(4, 4, 3, 16),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1 })
    ));
    sink.position.set(x, 27, 50);
    level3.add(sink);
    // Faucet
    const f = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 8, 8), trimMat));
    f.position.set(x, 31, 47);
    level3.add(f);
  });
  // Vanity mirrors (2, floor-to-ceiling)
  [-60, -40].forEach((x) => {
    const mirror = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(12, 50, 0.5),
      new THREE.MeshStandardMaterial({ color: 0x333344, metalness: 0.9, roughness: 0.05 })
    ));
    mirror.position.set(x, 30, 56);
    level3.add(mirror);
  });

  // === GUEST BEDROOM (right side) ===
  const guestBed = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(35, 8, 45), new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.5 })
  ));
  guestBed.position.set(40, 6, 10);
  level3.add(guestBed);
  const guestMattress = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(33, 4, 43),
    new THREE.MeshStandardMaterial({ color: 0xf0f0f0, roughness: 0.5 })
  ));
  guestMattress.position.set(40, 10, 10);
  level3.add(guestMattress);
  // Guest headboard
  const guestHead = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(40, 50, 3), new THREE.MeshStandardMaterial({ color: 0x3a3a3a, roughness: 0.3 })
  ));
  guestHead.position.set(40, 28, -14);
  level3.add(guestHead);

  // Walk-in closet (right side, behind guest bedroom)
  // Closet shelves
  for (let i = 0; i < 5; i++) {
    const shelf = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(30, 1, 10), whiteFurnMat
    ));
    shelf.position.set(55, 10 + i * 10, -50);
    level3.add(shelf);
  }
  // Hanging clothes rod
  const rod = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 30, 8), trimMat));
  rod.rotation.z = Math.PI / 2;
  rod.position.set(55, 40, -55);
  level3.add(rod);
  // Hanging clothes (decorative)
  for (let i = 0; i < 8; i++) {
    const clothes = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(5, 25, 2),
      new THREE.MeshStandardMaterial({
        color: [0x333333, 0x666666, 0x990000, 0x003366, 0x333333, 0x666666, 0x990000, 0x003366][i],
        roughness: 0.7,
      })
    ));
    clothes.position.set(45 + i * 3, 27, -55);
    level3.add(clothes);
  }

  // Ceiling
  const l3Ceiling = addShadow(new THREE.Mesh(new THREE.BoxGeometry(200, 2, 140), wallMat));
  l3Ceiling.position.set(-20, FH, -10);
  level3.add(l3Ceiling);

  root.add(level3);

  // ============================================================
  // ROOFTOP DECK (on top of level 3, open-air)
  // ============================================================
  const rooftop = new THREE.Group();
  rooftop.position.y = FH * 3;

  // Deck floor
  const roofDeck = addShadow(new THREE.Mesh(new THREE.BoxGeometry(200, 2, 140), deckMaterial));
  roofDeck.position.set(-20, 1, -10);
  rooftop.add(roofDeck);

  // Glass railing around perimeter
  const railGlass = new THREE.MeshStandardMaterial({
    color: 0x88aacc, metalness: 0.5, roughness: 0.1,
    transparent: true, opacity: 0.3,
  });
  const railFrame = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.9, roughness: 0.15 });
  // Front railing
  const frontRail = addShadow(new THREE.Mesh(new THREE.BoxGeometry(180, 5, 1), railGlass));
  frontRail.position.set(-30, 4, 60);
  rooftop.add(frontRail);
  const frontRailTop = addShadow(new THREE.Mesh(new THREE.BoxGeometry(180, 2, 2), railFrame));
  frontRailTop.position.set(-30, 7, 60);
  rooftop.add(frontRailTop);
  // Side railings
  [-120, 80].forEach((x) => {
    const r = addShadow(new THREE.Mesh(new THREE.BoxGeometry(1, 5, 100), railGlass));
    r.position.set(x, 4, -10);
    rooftop.add(r);
    const rt = addShadow(new THREE.Mesh(new THREE.BoxGeometry(2, 2, 100), railFrame));
    rt.position.set(x, 7, -10);
    rooftop.add(rt);
  });
  // Back railing
  const backRail = addShadow(new THREE.Mesh(new THREE.BoxGeometry(180, 5, 1), railGlass));
  backRail.position.set(-30, 4, -80);
  rooftop.add(backRail);
  const backRailTop = addShadow(new THREE.Mesh(new THREE.BoxGeometry(180, 2, 2), railFrame));
  backRailTop.position.set(-30, 7, -80);
  rooftop.add(backRailTop);

  // Outdoor lounge seating
  const outdoorSofa = addShadow(new THREE.Mesh(new THREE.BoxGeometry(40, 8, 15),
    new THREE.MeshStandardMaterial({ color: 0x4a4a4a, roughness: 0.6 })));
  outdoorSofa.position.set(-50, 5, 30);
  rooftop.add(outdoorSofa);
  const outdoorSofaBack = addShadow(new THREE.Mesh(new THREE.BoxGeometry(40, 15, 3),
    new THREE.MeshStandardMaterial({ color: 0x4a4a4a, roughness: 0.6 })));
  outdoorSofaBack.position.set(-50, 10, 23);
  rooftop.add(outdoorSofaBack);

  // Outdoor coffee table (fire pit)
  const firePit = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(8, 8, 5, 24),
    new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.5, roughness: 0.3 })
  ));
  firePit.position.set(-50, 5, 50);
  rooftop.add(firePit);
  const firePitGlow = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(6, 6, 2, 24),
    new THREE.MeshStandardMaterial({ color: 0xff6600, emissive: 0xff4400, emissiveIntensity: 0.9 })
  ));
  firePitGlow.position.set(-50, 8, 50);
  rooftop.add(firePitGlow);
  const firePitLight = new THREE.PointLight(0xff6600, 0.8, 60, 2);
  firePitLight.position.set(-50, 12, 50);
  rooftop.add(firePitLight);

  // Outdoor dining table
  const outdoorTable = addShadow(new THREE.Mesh(new THREE.BoxGeometry(25, 3, 12), whiteFurnMat));
  outdoorTable.position.set(30, 5, 30);
  rooftop.add(outdoorTable);

  // Sun loungers (2, for tanning)
  [20, 35].forEach((x) => {
    const lounger = addShadow(new THREE.Mesh(new THREE.BoxGeometry(8, 3, 18), whiteFurnMat));
    lounger.position.set(x, 4, -30);
    rooftop.add(lounger);
  });

  // Outdoor kitchen / BBQ
  const bbq = addShadow(new THREE.Mesh(new THREE.BoxGeometry(20, 20, 10),
    new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.6, roughness: 0.3 })));
  bbq.position.set(60, 10, -50);
  rooftop.add(bbq);
  // BBQ grill
  const grill = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 3, 16),
    new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.7, roughness: 0.2 })));
  grill.position.set(60, 22, -50);
  rooftop.add(grill);

  // Jacuzzi / hot tub
  const jacuzzi = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(12, 10, 10, 24), poolMat
  ));
  jacuzzi.position.set(50, 6, -10);
  rooftop.add(jacuzzi);

  // ============================================================
  // EXTERIOR DETAILS
  // ============================================================

  // Palm trees (4 around the property)
  const palmTrunkMat = new THREE.MeshStandardMaterial({ color: 0x8b7355, roughness: 0.8 });
  const palmLeafMat = new THREE.MeshStandardMaterial({ color: 0x2d5a1d, roughness: 0.7, side: THREE.DoubleSide });
  [[-160, 80], [160, 80], [-160, -30], [160, -30]].forEach(([x, z]) => {
    // Trunk (tapered cylinder)
    const trunk = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(2, 4, 60, 8), palmTrunkMat
    ));
    trunk.position.set(x, 30, z);
    root.add(trunk);
    // Palm fronds (6 leaves radiating)
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const frond = addShadow(new THREE.Mesh(
        new THREE.BoxGeometry(20, 1, 3), palmLeafMat
      ));
      frond.position.set(x + Math.cos(angle) * 10, 60, z + Math.sin(angle) * 10);
      frond.rotation.y = angle;
      frond.rotation.z = -0.3;
      root.add(frond);
    }
  });

  // Sports cars in driveway (2)
  // Car 1 (red sports car)
  const carBody1 = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(40, 8, 18),
    new THREE.MeshStandardMaterial({ color: 0xcc0000, metalness: 0.9, roughness: 0.1 })
  ));
  carBody1.position.set(-30, 6, 120);
  root.add(carBody1);
  const carCabin1 = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(20, 6, 16), glassMat
  ));
  carCabin1.position.set(-30, 13, 120);
  root.add(carCabin1);
  // Wheels (4)
  [[-15, -8], [15, -8], [-15, 8], [15, 8]].forEach(([dx, dz]) => {
    const wheel = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(4, 4, 3, 16),
      new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.5 })
    ));
    wheel.rotation.x = Math.PI / 2;
    wheel.position.set(-30 + dx, 3, 120 + dz);
    root.add(wheel);
  });
  // Headlights
  [-5, 5].forEach((dz) => {
    const light = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(1, 2, 3),
      new THREE.MeshStandardMaterial({ color: 0xffffcc, emissive: 0xffffaa, emissiveIntensity: 0.5 })
    ));
    light.position.set(-10, 6, 120 + dz);
    root.add(light);
  });

  // Car 2 (white luxury SUV)
  const carBody2 = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(45, 10, 20),
    new THREE.MeshStandardMaterial({ color: 0xf0f0f0, metalness: 0.8, roughness: 0.15 })
  ));
  carBody2.position.set(30, 7, 120);
  root.add(carBody2);
  const carCabin2 = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(30, 8, 18), glassMat
  ));
  carCabin2.position.set(30, 15, 120);
  root.add(carCabin2);
  [[-17, -9], [17, -9], [-17, 9], [17, 9]].forEach(([dx, dz]) => {
    const wheel = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(5, 5, 3.5, 16),
      new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.5 })
    ));
    wheel.rotation.x = Math.PI / 2;
    wheel.position.set(30 + dx, 3, 120 + dz);
    root.add(wheel);
  });

  // City lights / skyline (distant, as emissive dots)
  for (let i = 0; i < 100; i++) {
    const dot = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.5, 0.5),
      new THREE.MeshStandardMaterial({
        color: [0xffaa00, 0xffffff, 0x88ccff, 0xffcc44][Math.floor(Math.random() * 4)],
        emissive: 0xffffff, emissiveIntensity: 0.5,
      })
    ));
    dot.position.set(
      -200 + Math.random() * 400,
      10 + Math.random() * 60,
      200 + Math.random() * 100
    );
    root.add(dot);
  }

  // ============================================================
  // LIGHTING
  // ============================================================
  // Level 2 — main living area
  const l2Light1 = new THREE.PointLight(0xffeec0, 0.8, 150, 1.5);
  l2Light1.position.set(-30, FH + 85, 40);
  l2Light1.castShadow = true;
  l2Light1.shadow.mapSize.set(512, 512);
  root.add(l2Light1);

  const l2Light2 = new THREE.PointLight(0xffeec0, 0.6, 120, 1.5);
  l2Light2.position.set(80, FH + 85, -40);
  root.add(l2Light2);

  // Level 3 — bedrooms
  const l3Light1 = new THREE.PointLight(0xd0e0ff, 0.5, 100, 2);
  l3Light1.position.set(-70, FH * 2 + 80, 10);
  root.add(l3Light1);

  const l3Light2 = new THREE.PointLight(0xffeec0, 0.4, 80, 2);
  l3Light2.position.set(40, FH * 2 + 80, 10);
  root.add(l3Light2);

  // Pool light (underwater blue glow)
  const poolLight = new THREE.PointLight(0x00aaff, 0.6, 60, 2);
  poolLight.position.set(0, FH + 5, 130);
  root.add(poolLight);

  // Rooftop ambient
  const roofLight = new THREE.PointLight(0xffeec0, 0.3, 100, 2);
  roofLight.position.set(-20, FH * 3 + 20, 0);
  root.add(roofLight);

  root.add(rooftop);
  return root;
}
