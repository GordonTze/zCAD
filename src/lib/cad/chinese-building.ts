// ====================== CHINESE 3-STORY BUILDING ======================
// A detailed 3-story urban building typical of Chinese residential/commercial
// construction: ground-floor shop, two residential floors with balconies,
// flat roof with water tank, AC units, solar water heater, satellite dish.

import * as THREE from 'three';
import { addShadow, steel, stainless, plastic } from './materials-dsl';
import { createBuildingInteriorGeometry } from './building-interior';
import { createBuildingOccupants } from './building-occupants';

export function createChineseBuildingGeometry(): THREE.Group {
  const root = new THREE.Group();
  const stainlessMat = stainless();

  // === Add detailed interior (walls, rooms, furniture, stairs) ===
  const interior = createBuildingInteriorGeometry();
  root.add(interior);

  // === Add 3D occupants (people) throughout the building ===
  const occupants = createBuildingOccupants();
  root.add(occupants);

  // Material palette
  const concreteMat = new THREE.MeshStandardMaterial({ color: 0xe5e0d5, metalness: 0.05, roughness: 0.85 });
  const tileMat = new THREE.MeshStandardMaterial({ color: 0xd4c4a8, metalness: 0.05, roughness: 0.8 }); // tan tiles
  const accentMat = new THREE.MeshStandardMaterial({ color: 0x8b3a2e, metalness: 0.1, roughness: 0.7 }); // red accents (Chinese style)
  const darkFrame = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.3, roughness: 0.6 });
  const windowGlass = new THREE.MeshStandardMaterial({
    color: 0x4a90b8, metalness: 0.3, roughness: 0.1,
    transparent: true, opacity: 0.55,
  });
  const glassReflect = new THREE.MeshStandardMaterial({
    color: 0x2a4a6a, metalness: 0.6, roughness: 0.15,
    transparent: true, opacity: 0.7,
  });
  const railingMat = new THREE.MeshStandardMaterial({ color: 0x4a4a4a, metalness: 0.6, roughness: 0.4 });
  const roofMat = new THREE.MeshStandardMaterial({ color: 0x6b6b6b, metalness: 0.2, roughness: 0.8 });
  const acMat = new THREE.MeshStandardMaterial({ color: 0xf0f0f0, metalness: 0.3, roughness: 0.4 });
  const woodMat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b, metalness: 0.1, roughness: 0.7 });
  const doorMat = new THREE.MeshStandardMaterial({ color: 0x8b3a2e, metalness: 0.2, roughness: 0.5 });
  const grassMat = new THREE.MeshStandardMaterial({ color: 0x4a7c3a, metalness: 0.05, roughness: 0.9 });
  const solarMat = new THREE.MeshStandardMaterial({ color: 0x1a3a5a, metalness: 0.7, roughness: 0.2 });

  const buildingW = 200;   // width (X)
  const buildingD = 140;   // depth (Z)
  const floorH = 100;      // floor height
  const wallT = 6;         // wall thickness

  // ========================================================================
  // FOUNDATION / GROUND
  // ========================================================================
  const ground = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(buildingW + 80, 4, buildingD + 80),
    new THREE.MeshStandardMaterial({ color: 0x6b6b5a, metalness: 0.05, roughness: 0.95 })
  ));
  ground.position.y = -2;
  root.add(ground);

  // Sidewalk around building
  const sidewalk = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(buildingW + 40, 2, buildingD + 40),
    new THREE.MeshStandardMaterial({ color: 0x999999, metalness: 0.1, roughness: 0.7 })
  ));
  sidewalk.position.y = 1;
  root.add(sidewalk);

  // ========================================================================
  // GROUND FLOOR (Shop / Commercial) — y: 0 to 100
  // ========================================================================
  const groundFloor = new THREE.Group();

  // Main walls (4 walls with window/door openings approximated by separate panels)
  // Back wall
  const backWall = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(buildingW, floorH, wallT), concreteMat
  ));
  backWall.position.set(0, floorH / 2, -buildingD / 2);
  groundFloor.add(backWall);

  // Side walls
  [-1, 1].forEach((s) => {
    const sideWall = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(wallT, floorH, buildingD), concreteMat
    ));
    sideWall.position.set(s * (buildingW / 2 - wallT / 2), floorH / 2, 0);
    groundFloor.add(sideWall);
  });

  // Front wall is split into sections to leave room for shop windows and door
  // Left of door
  const frontLeft = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(30, floorH, wallT), concreteMat
  ));
  frontLeft.position.set(-buildingW / 2 + 15, floorH / 2, buildingD / 2);
  groundFloor.add(frontLeft);

  // Right of door
  const frontRight = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(30, floorH, wallT), concreteMat
  ));
  frontRight.position.set(buildingW / 2 - 15, floorH / 2, buildingD / 2);
  groundFloor.add(frontRight);

  // Above door (lintel)
  const lintel = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(buildingW - 60, 25, wallT), concreteMat
  ));
  lintel.position.set(0, floorH - 12.5, buildingD / 2);
  groundFloor.add(lintel);

  // === Large shop windows (front, ground floor) ===
  [-1, 1].forEach((s) => {
    const glass = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(60, 60, 2), glassReflect
    ));
    glass.position.set(s * 50, 40, buildingD / 2 + 0.5);
    groundFloor.add(glass);

    // Window frame
    const frame = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(64, 64, 4), darkFrame
    ));
    frame.position.set(s * 50, 40, buildingD / 2 - 0.5);
    groundFloor.add(frame);

    // Window mullions (vertical dividers)
    [-15, 0, 15].forEach((x) => {
      const mullion = addShadow(new THREE.Mesh(
        new THREE.BoxGeometry(2, 60, 3), darkFrame
      ));
      mullion.position.set(s * 50 + x, 40, buildingD / 2 + 1);
      groundFloor.add(mullion);
    });

    // Horizontal divider
    const hDiv = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(60, 2, 3), darkFrame
    ));
    hDiv.position.set(s * 50, 40, buildingD / 2 + 1);
    groundFloor.add(hDiv);
  });

  // === Shop entrance door (center, double glass door) ===
  [-1, 1].forEach((s) => {
    const door = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(15, 70, 3), glassReflect
    ));
    door.position.set(s * 9, 35, buildingD / 2 + 0.5);
    groundFloor.add(door);

    // Door frame
    const dframe = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(16, 72, 4), darkFrame
    ));
    dframe.position.set(s * 9, 35, buildingD / 2 - 0.5);
    groundFloor.add(dframe);

    // Door handle
    const handle = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(0.8, 0.8, 8, 8), steel()
    ));
    handle.position.set(s * 16, 35, buildingD / 2 + 2);
    handle.rotation.z = Math.PI / 2;
    groundFloor.add(handle);
  });

  // === Shop sign / awning above ground floor ===
  const awning = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(buildingW - 10, 12, 20), accentMat
  ));
  awning.position.set(0, floorH + 6, buildingD / 2 + 8);
  groundFloor.add(awning);

  // Sign text panel (decorative)
  const sign = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(buildingW - 30, 8, 2),
    new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.6, roughness: 0.3 })
  ));
  sign.position.set(0, floorH + 6, buildingD / 2 + 18);
  groundFloor.add(sign);

  // Side windows on ground floor (small, high — for bathroom/storage)
  [-1, 1].forEach((s) => {
    [30, -30].forEach((z) => {
      const win = addShadow(new THREE.Mesh(
        new THREE.BoxGeometry(2, 30, 25), windowGlass
      ));
      win.position.set(s * (buildingW / 2 + 0.5), 65, z);
      groundFloor.add(win);
      const wframe = addShadow(new THREE.Mesh(
        new THREE.BoxGeometry(3, 34, 29), darkFrame
      ));
      wframe.position.set(s * (buildingW / 2 - 0.5), 65, z);
      groundFloor.add(wframe);
    });
  });

  root.add(groundFloor);

  // ========================================================================
  // 2ND FLOOR (Residential) — y: 100 to 200
  // ========================================================================
  const secondFloor = new THREE.Group();
  secondFloor.position.y = floorH;

  // Back wall
  const back2 = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(buildingW, floorH, wallT), concreteMat
  ));
  back2.position.set(0, floorH / 2, -buildingD / 2);
  secondFloor.add(back2);

  // Side walls
  [-1, 1].forEach((s) => {
    const sw = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(wallT, floorH, buildingD), concreteMat
    ));
    sw.position.set(s * (buildingW / 2 - wallT / 2), floorH / 2, 0);
    secondFloor.add(sw);
  });

  // Floor slab (visible separation)
  const slab2 = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(buildingW + 4, 4, buildingD + 4), concreteMat
  ));
  slab2.position.y = -2;
  secondFloor.add(slab2);

  // Front wall (with balcony door opening)
  // Sections left and right of balcony door
  [-1, 1].forEach((s) => {
    const section = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(60, floorH, wallT), concreteMat
    ));
    section.position.set(s * 70, floorH / 2, buildingD / 2);
    secondFloor.add(section);
  });
  // Lintel above balcony door
  const lintel2 = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(80, 25, wallT), concreteMat
  ));
  lintel2.position.set(0, floorH - 12.5, buildingD / 2);
  secondFloor.add(lintel2);

  // === Windows on 2nd floor ===
  // Front windows (2 on each side of balcony)
  [-1, 1].forEach((s) => {
    [-35, -55].forEach((x) => {
      // skip - we'll just do one window per side section
    });
    const win = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(40, 50, 2), windowGlass
    ));
    win.position.set(s * 70, 55, buildingD / 2 + 0.5);
    secondFloor.add(win);
    const wframe = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(44, 54, 4), darkFrame
    ));
    wframe.position.set(s * 70, 55, buildingD / 2 - 0.5);
    secondFloor.add(wframe);
    // Mullion
    const mull = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(2, 50, 3), darkFrame
    ));
    mull.position.set(s * 70, 55, buildingD / 2 + 1);
    secondFloor.add(mull);
    // Horizontal divider
    const hdiv = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(40, 2, 3), darkFrame
    ));
    hdiv.position.set(s * 70, 55, buildingD / 2 + 1);
    secondFloor.add(hdiv);
    // Window sill
    const sill = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(46, 4, 6), accentMat
    ));
    sill.position.set(s * 70, 28, buildingD / 2 + 2);
    secondFloor.add(sill);
  });

  // Side windows (2 per side)
  [-1, 1].forEach((s) => {
    [30, -30].forEach((z) => {
      const win = addShadow(new THREE.Mesh(
        new THREE.BoxGeometry(2, 45, 35), windowGlass
      ));
      win.position.set(s * (buildingW / 2 + 0.5), 55, z);
      secondFloor.add(win);
      const wframe = addShadow(new THREE.Mesh(
        new THREE.BoxGeometry(3, 49, 39), darkFrame
      ));
      wframe.position.set(s * (buildingW / 2 - 0.5), 55, z);
      secondFloor.add(wframe);
      // Sill
      const sill = addShadow(new THREE.Mesh(
        new THREE.BoxGeometry(4, 3, 42), accentMat
      ));
      sill.position.set(s * (buildingW / 2 + 1), 30, z);
      secondFloor.add(sill);
    });
  });

  // Back windows (3 small ones for bedrooms/bathrooms)
  [-50, 0, 50].forEach((x) => {
    const win = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(30, 40, 2), windowGlass
    ));
    win.position.set(x, 55, -buildingD / 2 - 0.5);
    secondFloor.add(win);
    const wframe = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(34, 44, 4), darkFrame
    ));
    wframe.position.set(x, 55, -buildingD / 2 + 0.5);
    secondFloor.add(wframe);
  });

  // === Balcony (front, 2nd floor) ===
  const balcony2 = new THREE.Group();
  balcony2.position.set(0, 30, buildingD / 2);

  // Balcony floor slab
  const balcFloor = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(80, 4, 20), concreteMat
  ));
  balcFloor.position.set(0, -2, 10);
  balcony2.add(balcFloor);

  // Balcony railing (front + 2 sides) — vertical bars + top rail
  // Front railing
  const topRailF = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(80, 3, 3), railingMat
  ));
  topRailF.position.set(0, 35, 20);
  balcony2.add(topRailF);
  const botRailF = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(80, 3, 3), railingMat
  ));
  botRailF.position.set(0, 5, 20);
  balcony2.add(botRailF);
  // Vertical bars (front)
  for (let i = 0; i <= 16; i++) {
    const bar = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 30, 1.5), railingMat
    ));
    bar.position.set(-40 + i * 5, 20, 20);
    balcony2.add(bar);
  }
  // Side railings
  [-1, 1].forEach((s) => {
    const topRail = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(3, 3, 20), railingMat
    ));
    topRail.position.set(s * 40, 35, 10);
    balcony2.add(topRail);
    const botRail = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(3, 3, 20), railingMat
    ));
    botRail.position.set(s * 40, 5, 10);
    balcony2.add(botRail);
    for (let i = 0; i <= 4; i++) {
      const bar = addShadow(new THREE.Mesh(
        new THREE.BoxGeometry(1.5, 30, 1.5), railingMat
      ));
      bar.position.set(s * 40, 20, i * 5);
      balcony2.add(bar);
    }
  });

  // Balcony door (sliding glass)
  const balcDoor = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(76, 70, 2), glassReflect
  ));
  balcDoor.position.set(0, 35, 0);
  balcony2.add(balcDoor);
  const balcDoorFrame = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(80, 74, 4), darkFrame
  ));
  balcDoorFrame.position.set(0, 35, -1);
  balcony2.add(balcDoorFrame);

  // Potted plants on balcony
  [-25, 25].forEach((x) => {
    const pot = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(4, 5, 6, 12),
      new THREE.MeshStandardMaterial({ color: 0x8b5a2b, metalness: 0.1, roughness: 0.7 })
    ));
    pot.position.set(x, 3, 15);
    balcony2.add(pot);
    const plant = addShadow(new THREE.Mesh(
      new THREE.SphereGeometry(6, 12, 10), grassMat
    ));
    plant.position.set(x, 12, 15);
    balcony2.add(plant);
  });

  secondFloor.add(balcony2);

  // === AC unit on side wall (2nd floor) ===
  [-1, 1].forEach((s) => {
    const acBody = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(20, 12, 8), acMat
    ));
    acBody.position.set(s * (buildingW / 2 + 4), 80, 30);
    secondFloor.add(acBody);
    // AC fan grille
    const fan = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(4, 4, 1, 16), darkFrame
    ));
    fan.rotation.z = Math.PI / 2;
    fan.position.set(s * (buildingW / 2 + 8), 80, 30);
    secondFloor.add(fan);
    // AC compressor fins
    const fins = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(1, 10, 6), darkFrame
    ));
    fins.position.set(s * (buildingW / 2 + 8.5), 80, 30);
    secondFloor.add(fins);
    // AC bracket
    const bracket = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(22, 2, 4), darkFrame
    ));
    bracket.position.set(s * (buildingW / 2 + 3), 73, 30);
    secondFloor.add(bracket);
  });

  root.add(secondFloor);

  // ========================================================================
  // 3RD FLOOR (Residential, set back slightly with bigger balcony) — y: 200 to 300
  // ========================================================================
  const thirdFloor = new THREE.Group();
  thirdFloor.position.y = floorH * 2;

  // Floor slab
  const slab3 = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(buildingW + 4, 4, buildingD + 4), concreteMat
  ));
  slab3.position.y = -2;
  thirdFloor.add(slab3);

  // Back wall
  const back3 = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(buildingW, floorH, wallT), concreteMat
  ));
  back3.position.set(0, floorH / 2, -buildingD / 2);
  thirdFloor.add(back3);

  // Side walls
  [-1, 1].forEach((s) => {
    const sw = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(wallT, floorH, buildingD), concreteMat
    ));
    sw.position.set(s * (buildingW / 2 - wallT / 2), floorH / 2, 0);
    thirdFloor.add(sw);
  });

  // Front wall (with balcony door)
  [-1, 1].forEach((s) => {
    const section = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(50, floorH, wallT), concreteMat
    ));
    section.position.set(s * 75, floorH / 2, buildingD / 2);
    thirdFloor.add(section);
  });
  const lintel3 = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(100, 25, wallT), concreteMat
  ));
  lintel3.position.set(0, floorH - 12.5, buildingD / 2);
  thirdFloor.add(lintel3);

  // Front windows (2)
  [-1, 1].forEach((s) => {
    const win = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(35, 50, 2), windowGlass
    ));
    win.position.set(s * 75, 55, buildingD / 2 + 0.5);
    thirdFloor.add(win);
    const wframe = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(39, 54, 4), darkFrame
    ));
    wframe.position.set(s * 75, 55, buildingD / 2 - 0.5);
    thirdFloor.add(wframe);
    const mull = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(2, 50, 3), darkFrame
    ));
    mull.position.set(s * 75, 55, buildingD / 2 + 1);
    thirdFloor.add(mull);
    const sill = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(42, 4, 6), accentMat
    ));
    sill.position.set(s * 75, 28, buildingD / 2 + 2);
    thirdFloor.add(sill);
  });

  // Side windows
  [-1, 1].forEach((s) => {
    [30, -30].forEach((z) => {
      const win = addShadow(new THREE.Mesh(
        new THREE.BoxGeometry(2, 45, 35), windowGlass
      ));
      win.position.set(s * (buildingW / 2 + 0.5), 55, z);
      thirdFloor.add(win);
      const wframe = addShadow(new THREE.Mesh(
        new THREE.BoxGeometry(3, 49, 39), darkFrame
      ));
      wframe.position.set(s * (buildingW / 2 - 0.5), 55, z);
      thirdFloor.add(wframe);
    });
  });

  // Back windows
  [-50, 0, 50].forEach((x) => {
    const win = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(30, 40, 2), windowGlass
    ));
    win.position.set(x, 55, -buildingD / 2 - 0.5);
    thirdFloor.add(win);
    const wframe = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(34, 44, 4), darkFrame
    ));
    wframe.position.set(x, 55, -buildingD / 2 + 0.5);
    thirdFloor.add(wframe);
  });

  // === Large balcony (3rd floor, wraps around front) ===
  const balcony3 = new THREE.Group();
  balcony3.position.set(0, 30, buildingD / 2);

  // Bigger balcony floor
  const balc3Floor = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(150, 4, 30), concreteMat
  ));
  balc3Floor.position.set(0, -2, 15);
  balcony3.add(balc3Floor);

  // Front railing
  const topRail3F = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(150, 3, 3), railingMat
  ));
  topRail3F.position.set(0, 35, 30);
  balcony3.add(topRail3F);
  const botRail3F = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(150, 3, 3), railingMat
  ));
  botRail3F.position.set(0, 5, 30);
  balcony3.add(botRail3F);
  for (let i = 0; i <= 30; i++) {
    const bar = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 30, 1.5), railingMat
    ));
    bar.position.set(-75 + i * 5, 20, 30);
    balcony3.add(bar);
  }
  // Side railings (extending out)
  [-1, 1].forEach((s) => {
    const topRail = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(3, 3, 30), railingMat
    ));
    topRail.position.set(s * 75, 35, 15);
    balcony3.add(topRail);
    const botRail = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(3, 3, 30), railingMat
    ));
    botRail.position.set(s * 75, 5, 15);
    balcony3.add(botRail);
    for (let i = 0; i <= 6; i++) {
      const bar = addShadow(new THREE.Mesh(
        new THREE.BoxGeometry(1.5, 30, 1.5), railingMat
      ));
      bar.position.set(s * 75, 20, i * 5);
      balcony3.add(bar);
    }
  });

  // Decorative railing pattern (Chinese-style diamond shapes)
  for (let i = 0; i < 14; i++) {
    const diamond = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(8, 8, 1.5), accentMat
    ));
    diamond.position.set(-65 + i * 10, 20, 30);
    diamond.rotation.z = Math.PI / 4;
    balcony3.add(diamond);
  }

  // Balcony doors (3 sliding glass doors)
  [-40, 0, 40].forEach((x) => {
    const door = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(35, 70, 2), glassReflect
    ));
    door.position.set(x, 35, 0);
    balcony3.add(door);
    const dframe = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(37, 74, 4), darkFrame
    ));
    dframe.position.set(x, 35, -1);
    balcony3.add(dframe);
  });

  // Potted plants and drying rack
  [-60, 60].forEach((x) => {
    const pot = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(5, 6, 7, 12),
      new THREE.MeshStandardMaterial({ color: 0x8b5a2b, metalness: 0.1, roughness: 0.7 })
    ));
    pot.position.set(x, 3, 22);
    balcony3.add(pot);
    const plant = addShadow(new THREE.Mesh(
      new THREE.SphereGeometry(8, 12, 10), grassMat
    ));
    plant.position.set(x, 14, 22);
    balcony3.add(plant);
  });

  // Drying rack (clothes)
  const rack = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(30, 2, 2), stainlessMat
  ));
  rack.position.set(0, 38, 25);
  balcony3.add(rack);
  const rack2 = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(30, 2, 2), stainlessMat
  ));
  rack2.position.set(0, 38, 20);
  balcony3.add(rack2);
  // Rack supports
  [-12, 12].forEach((x) => {
    const sup = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 12, 1.5), stainlessMat
    ));
    sup.position.set(x, 32, 22.5);
    balcony3.add(sup);
  });

  thirdFloor.add(balcony3);

  // AC units on 3rd floor
  [-1, 1].forEach((s) => {
    const acBody = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(20, 12, 8), acMat
    ));
    acBody.position.set(s * (buildingW / 2 + 4), 80, -30);
    thirdFloor.add(acBody);
    const fan = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(4, 4, 1, 16), darkFrame
    ));
    fan.rotation.z = Math.PI / 2;
    fan.position.set(s * (buildingW / 2 + 8), 80, -30);
    thirdFloor.add(fan);
  });

  root.add(thirdFloor);

  // ========================================================================
  // ROOF (flat roof with parapet, water tank, solar heater, satellite)
  // ========================================================================
  const roofGroup = new THREE.Group();
  roofGroup.position.y = floorH * 3;

  // Roof slab
  const roofSlab = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(buildingW + 4, 4, buildingD + 4), roofMat
  ));
  roofGroup.add(roofSlab);

  // Parapet wall (low wall around roof perimeter)
  const parapetH = 15;
  // Front
  const parapetF = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(buildingW + 4, parapetH, wallT), concreteMat
  ));
  parapetF.position.set(0, parapetH / 2 + 2, buildingD / 2);
  roofGroup.add(parapetF);
  // Back
  const parapetB = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(buildingW + 4, parapetH, wallT), concreteMat
  ));
  parapetB.position.set(0, parapetH / 2 + 2, -buildingD / 2);
  roofGroup.add(parapetB);
  // Sides
  [-1, 1].forEach((s) => {
    const p = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(wallT, parapetH, buildingD), concreteMat
    ));
    p.position.set(s * (buildingW / 2 + 2 - wallT / 2), parapetH / 2 + 2, 0);
    roofGroup.add(p);
  });

  // === Stair access penthouse (small structure on roof) ===
  const penthouse = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(30, 30, 25), concreteMat
  ));
  penthouse.position.set(-60, 17, -40);
  roofGroup.add(penthouse);
  // Penthouse door
  const pdoor = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(10, 18, 1), doorMat
  ));
  pdoor.position.set(-60, 11, -27);
  roofGroup.add(pdoor);
  // Penthouse roof
  const proof = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(34, 2, 29), roofMat
  ));
  proof.position.set(-60, 33, -40);
  roofGroup.add(proof);

  // === Water tank (large cylindrical tank on roof) ===
  const tank = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(15, 15, 25, 24),
    new THREE.MeshStandardMaterial({ color: 0x4a90c2, metalness: 0.5, roughness: 0.4 })
  ));
  tank.position.set(40, 17, -40);
  roofGroup.add(tank);
  // Tank lid
  const tankLid = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(15.5, 15.5, 2, 24), darkFrame
  ));
  tankLid.position.set(40, 30, -40);
  roofGroup.add(tankLid);
  // Tank support legs (4)
  [[10, 10], [10, -10], [-10, 10], [-10, -10]].forEach(([dx, dz]) => {
    const leg = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(3, 8, 3), darkFrame
    ));
    leg.position.set(40 + dx, 7, -40 + dz);
    roofGroup.add(leg);
  });
  // Tank pipes
  const pipe1 = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(1.5, 1.5, 20, 8), stainlessMat
  ));
  pipe1.position.set(25, 12, -40);
  pipe1.rotation.z = Math.PI / 2;
  roofGroup.add(pipe1);

  // === Solar water heater panels (tilted) ===
  // Hoisted: vacuum tube material (shared across 15 tubes)
  const vacuumTubeMat = new THREE.MeshStandardMaterial({ color: 0x1a3a5a, metalness: 0.6, roughness: 0.2 });
  for (let i = 0; i < 3; i++) {
    const panel = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(20, 1, 15), solarMat
    ));
    panel.position.set(-20 + i * 22, 18, 40);
    panel.rotation.x = -0.4; // tilt toward sun
    roofGroup.add(panel);
    // Panel frame
    const pframe = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(22, 2, 17), darkFrame
    ));
    pframe.position.set(-20 + i * 22, 17, 40);
    pframe.rotation.x = -0.4;
    roofGroup.add(pframe);
    // Support legs
    const leg1 = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(1, 1, 8, 8), darkFrame
    ));
    leg1.position.set(-20 + i * 22 - 8, 8, 47);
    roofGroup.add(leg1);
    const leg2 = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(1, 1, 14, 8), darkFrame
    ));
    leg2.position.set(-20 + i * 22 + 8, 5, 33);
    roofGroup.add(leg2);
    // Vacuum tubes (row of cylinders)
    for (let j = 0; j < 5; j++) {
      const tube = addShadow(new THREE.Mesh(
        new THREE.CylinderGeometry(1.5, 1.5, 18, 8),
        vacuumTubeMat
      ));
      tube.position.set(-20 + i * 22 - 6 + j * 3, 12, 40);
      tube.rotation.x = -0.4;
      roofGroup.add(tube);
    }
  }

  // Solar water tank (connected to panels)
  const solarTank = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(8, 8, 20, 16),
    new THREE.MeshStandardMaterial({ color: 0xc0c0c0, metalness: 0.6, roughness: 0.3 })
  ));
  solarTank.position.set(50, 14, 40);
  solarTank.rotation.z = Math.PI / 2;
  roofGroup.add(solarTank);

  // === Satellite dish ===
  const dishBase = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(3, 4, 5, 12), darkFrame
  ));
  dishBase.position.set(70, 7, 0);
  roofGroup.add(dishBase);
  const dishPole = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(1, 1, 15, 8), darkFrame
  ));
  dishPole.position.set(70, 17, 0);
  roofGroup.add(dishPole);
  // Dish (parabolic — use sphere segment)
  const dish = addShadow(new THREE.Mesh(
    new THREE.SphereGeometry(10, 24, 12, 0, Math.PI * 2, 0, Math.PI / 3),
    new THREE.MeshStandardMaterial({ color: 0xe0e0e0, metalness: 0.4, roughness: 0.4 })
  ));
  dish.position.set(70, 25, 0);
  dish.rotation.x = -0.8;
  roofGroup.add(dish);
  // LNB (low-noise block) at focal point
  const lnb = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(1, 1, 4, 8), darkFrame
  ));
  lnb.position.set(70, 22, 5);
  roofGroup.add(lnb);
  // LNB arm
  const lnbArm = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.5, 8, 6), darkFrame
  ));
  lnbArm.position.set(70, 23, 3);
  lnbArm.rotation.x = Math.PI / 2;
  roofGroup.add(lnbArm);

  // === AC condenser units on roof (large central AC) ===
  for (let i = 0; i < 2; i++) {
    const cond = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(25, 15, 12), acMat
    ));
    cond.position.set(-70 + i * 5, 10, 30 + i * 5);
    roofGroup.add(cond);
    // Fan on top
    const fan = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(5, 5, 1, 16), darkFrame
    ));
    fan.position.set(-70 + i * 5, 18, 30 + i * 5);
    roofGroup.add(fan);
    for (let j = 0; j < 5; j++) {
      const blade = new THREE.Mesh(
        new THREE.BoxGeometry(9, 0.5, 1), darkFrame
      );
      blade.position.set(-70 + i * 5, 18.5, 30 + i * 5);
      blade.rotation.y = (j / 5) * Math.PI * 2;
      roofGroup.add(blade);
    }
    // Side fins
    const sfins = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(1, 12, 10), darkFrame
    ));
    sfins.position.set(-70 + i * 5 - 13, 10, 30 + i * 5);
    roofGroup.add(sfins);
  }

  // === Vent pipes (stink pipes — plumbing vents) ===
  [-30, 0, 30].forEach((x) => {
    const vent = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(2, 2, 20, 12), darkFrame
    ));
    vent.position.set(x, 12, -60);
    roofGroup.add(vent);
    // Vent cap
    const cap = addShadow(new THREE.Mesh(
      new THREE.ConeGeometry(3, 4, 12), darkFrame
    ));
    cap.position.set(x, 24, -60);
    roofGroup.add(cap);
  });

  // === Drying area (clotheslines on roof) ===
  for (let i = 0; i < 3; i++) {
    const line = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.3, 40, 6), plastic(0xffffff)
    ));
    line.rotation.z = Math.PI / 2;
    line.position.set(0, 25, -10 + i * 8);
    roofGroup.add(line);
  }
  // Clothesline posts
  [-20, 20].forEach((x) => {
    [-10, -2, 6].forEach((z) => {
      const post = addShadow(new THREE.Mesh(
        new THREE.BoxGeometry(2, 25, 2), darkFrame
      ));
      post.position.set(x, 14, z);
      roofGroup.add(post);
    });
  });

  root.add(roofGroup);

  // ========================================================================
  // EXTERIOR DETAILS (around the building)
  // ========================================================================

  // === Front steps (entrance) ===
  for (let i = 0; i < 3; i++) {
    const step = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(40, 2, 6),
      new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.2, roughness: 0.7 })
    ));
    step.position.set(0, 2 + i * 2, buildingD / 2 + 25 + i * 6);
    root.add(step);
  }

  // === Lanterns (Chinese-style red lanterns at entrance) ===
  [-1, 1].forEach((s) => {
    const lantern = addShadow(new THREE.Mesh(
      new THREE.SphereGeometry(5, 16, 12),
      new THREE.MeshStandardMaterial({
        color: 0xdc2626, emissive: 0x440000,
        metalness: 0.1, roughness: 0.5
      })
    ));
    lantern.position.set(s * 25, 95, buildingD / 2 + 8);
    lantern.scale.y = 1.3;
    root.add(lantern);
    // Lantern cap (top)
    const lcap = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(2, 3, 2, 8), darkFrame
    ));
    lcap.position.set(s * 25, 101, buildingD / 2 + 8);
    root.add(lcap);
    // Lantern tassel
    const tassel = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 1.5, 5, 6),
      new THREE.MeshStandardMaterial({ color: 0xffaa00, metalness: 0.1, roughness: 0.7 })
    ));
    tassel.position.set(s * 25, 87, buildingD / 2 + 8);
    root.add(tassel);
    // Hanging wire
    const wire = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.2, 15, 6), darkFrame
    ));
    wire.position.set(s * 25, 110, buildingD / 2 + 8);
    root.add(wire);
  });

  // === Street sign / lamp post (in front) ===
  const lampPost = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(1.5, 2, 120, 12), darkFrame
  ));
  lampPost.position.set(buildingW / 2 + 20, 60, buildingD / 2 + 30);
  root.add(lampPost);
  // Lamp arm
  const lampArm = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(20, 2, 2), darkFrame
  ));
  lampArm.position.set(buildingW / 2 + 10, 115, buildingD / 2 + 30);
  root.add(lampArm);
  // Lamp head
  const lampHead = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(8, 6, 8),
    new THREE.MeshStandardMaterial({ color: 0x404040, metalness: 0.6, roughness: 0.4 })
  ));
  lampHead.position.set(buildingW / 2 + 2, 112, buildingD / 2 + 30);
  root.add(lampHead);
  // Lamp glow
  const lampGlow = new THREE.Mesh(
    new THREE.BoxGeometry(6, 4, 6),
    new THREE.MeshStandardMaterial({
      color: 0xffdd88, emissive: 0xffdd88, emissiveIntensity: 0.6
    })
  );
  lampGlow.position.set(buildingW / 2 + 2, 111, buildingD / 2 + 30);
  root.add(lampGlow);

  // === Trees (street trees in front) ===
  [-1, 1].forEach((s) => {
    const trunk = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(2, 3, 25, 8), woodMat
    ));
    trunk.position.set(s * (buildingW / 2 + 40), 12, buildingD / 2 + 50);
    root.add(trunk);
    // Foliage (3 spheres)
    for (let i = 0; i < 3; i++) {
      const foliage = addShadow(new THREE.Mesh(
        new THREE.SphereGeometry(8 + Math.random() * 2, 12, 10), grassMat
      ));
      foliage.position.set(
        s * (buildingW / 2 + 40) + (Math.random() - 0.5) * 6,
        28 + i * 4,
        buildingD / 2 + 50 + (Math.random() - 0.5) * 6
      );
      root.add(foliage);
    }
  });

  // === Power lines (running to building) ===
  for (let i = 0; i < 3; i++) {
    const line = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.3, 60, 6), darkFrame
    );
    line.position.set(buildingW / 2 + 30, 220 + i * 5, 0);
    line.rotation.z = Math.PI / 2;
    line.rotation.x = 0.1;
    root.add(line);
  }

  // === Building address plate ===
  const addrPlate = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(15, 8, 0.5),
    new THREE.MeshStandardMaterial({ color: 0x1e3a5f, metalness: 0.3, roughness: 0.4 })
  ));
  addrPlate.position.set(-buildingW / 2 - 0.5, 50, 0);
  addrPlate.rotation.y = Math.PI / 2;
  root.add(addrPlate);

  return root;
}
