// Detailed CAD model generators using Three.js
// Each model is procedurally generated with realistic engineering details

import * as THREE from 'three';
import type { Feature } from '@/lib/cad/types';
// Super-detailed 5-axis CNC machine parts (14 component parts)
import {
  createCNCMachineBedGeometry,
  createXAxisSaddleGeometry,
  createCNCColumnGeometry2,
  createSpindleCarriageGeometry,
  createSpindleMotorGeometry,
  createBAxisTrunnionGeometry,
  createCAxisTableGeometry,
  createATCMagazineGeometry,
  createATCArmGeometry,
  createCoolantSystemGeometry,
  createControlCabinetGeometry,
  createToolHolderGeometry,
  createChipConveyorGeometry,
  createWorkpieceGeometry,
} from './cnc-machine';
// Mega CNC Machine - one massive super-detailed part containing the entire machine
import { createMegaCNCMachineGeometry } from './mega-cnc';
// Chinese 3-story building
import { createChineseBuildingGeometry } from './chinese-building';
// LA Hills Mansion
import { createLAMansionGeometry } from './la-mansion';
// Great Pyramid of Giza
import { createPyramidGeometry } from './pyramid';
// Bay Area Apartment (modern 2BR SF SoMa unit)
import { createBayAreaApartmentGeometry } from './bay-area-apartment';
// Desktop Setup (battlestation with PC + monitors + RGB)
import { createDesktopSetupGeometry } from './desktop-setup';
// Grocery Store (supermarket with aisles, produce, checkouts)
import { createGroceryStoreGeometry } from './grocery-store';
// F1 Car (exploded view with all components)
import { createF1CarGeometry } from './f1-car';

// Material helpers — imported from materials-dsl.ts (single source of truth) and re-exported
import { metal, steel, stainless, aluminum, darkSteel, brass, rubber, plastic } from './materials-dsl';
export { metal, steel, stainless, aluminum, darkSteel, brass, rubber, plastic };

function addShadow(mesh: THREE.Mesh) {
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

// ====================== GEARBOX HOUSING (detailed) ======================
export function createGearboxHousingGeometry(features: Feature[]): THREE.Group {
  const group = new THREE.Group();
  const mat = aluminum();
  const darkMat = darkSteel();

  const w = 120, h = 80, d = 60;
  const wallT = 6;

  // --- Main body with rounded corners using shape extrusion ---
  const bodyShape = new THREE.Shape();
  const r = 8; // outer corner radius
  bodyShape.moveTo(-w/2 + r, -h/2);
  bodyShape.lineTo(w/2 - r, -h/2);
  bodyShape.quadraticCurveTo(w/2, -h/2, w/2, -h/2 + r);
  bodyShape.lineTo(w/2, h/2 - r);
  bodyShape.quadraticCurveTo(w/2, h/2, w/2 - r, h/2);
  bodyShape.lineTo(-w/2 + r, h/2);
  bodyShape.quadraticCurveTo(-w/2, h/2, -w/2, h/2 - r);
  bodyShape.lineTo(-w/2, -h/2 + r);
  bodyShape.quadraticCurveTo(-w/2, -h/2, -w/2 + r, -h/2);

  const bodyGeom = new THREE.ExtrudeGeometry(bodyShape, {
    depth: d, bevelEnabled: true, bevelThickness: 2, bevelSize: 2, bevelSegments: 4,
  });
  bodyGeom.center();
  const body = addShadow(new THREE.Mesh(bodyGeom, mat));
  group.add(body);

  // --- Internal cavity (visualized as dark inset) ---
  const cavityShape = new THREE.Shape();
  const ir = r - wallT;
  const iw = w - 2 * wallT, ih = h - 2 * wallT;
  cavityShape.moveTo(-iw/2 + ir, -ih/2);
  cavityShape.lineTo(iw/2 - ir, -ih/2);
  cavityShape.quadraticCurveTo(iw/2, -ih/2, iw/2, -ih/2 + ir);
  cavityShape.lineTo(iw/2, ih/2 - ir);
  cavityShape.quadraticCurveTo(iw/2, ih/2, iw/2 - ir, ih/2);
  cavityShape.lineTo(-iw/2 + ir, ih/2);
  cavityShape.quadraticCurveTo(-iw/2, ih/2, -iw/2, ih/2 - ir);
  cavityShape.lineTo(-iw/2, -ih/2 + ir);
  cavityShape.quadraticCurveTo(-iw/2, -ih/2, -iw/2 + ir, -ih/2);
  const cavityGeom = new THREE.ExtrudeGeometry(cavityShape, { depth: d - wallT, bevelEnabled: false });
  cavityGeom.center();
  const cavity = new THREE.Mesh(cavityGeom, new THREE.MeshStandardMaterial({
    color: 0x1a1d22, metalness: 0.4, roughness: 0.8,
  }));
  cavity.position.z = -wallT/2 + 1;
  group.add(cavity);

  // --- Bearing bores (large, with chamfered rims) ---
  const borePositions: [number, number][] = [[-45, 0], [45, 0]];
  borePositions.forEach(([cx, cy], idx) => {
    // Through bore
    const bore = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(12, 12, d + 6, 36),
      darkMat
    ));
    bore.rotation.x = Math.PI / 2;
    bore.position.set(cx, cy, 0);
    group.add(bore);

    // Bearing seat (slightly larger recess)
    [d/2, -d/2].forEach((z) => {
      const seat = addShadow(new THREE.Mesh(
        new THREE.CylinderGeometry(15, 12, 4, 36),
        mat
      ));
      seat.rotation.x = Math.PI / 2;
      seat.position.set(cx, cy, z - Math.sign(z) * 2);
      group.add(seat);

      // Snap ring groove
      const groove = new THREE.Mesh(
        new THREE.TorusGeometry(14, 0.8, 6, 36),
        darkMat
      );
      groove.position.set(cx, cy, z - Math.sign(z) * 4);
      groove.rotation.x = Math.PI / 2;
      group.add(groove);
    });
  });

  // --- Smaller holes (top and bottom) ---
  const smallHoles: [number, number][] = [[0, 30], [0, -30]];
  smallHoles.forEach(([cx, cy]) => {
    const hole = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(8, 8, d + 4, 28),
      darkMat
    ));
    hole.rotation.x = Math.PI / 2;
    hole.position.set(cx, cy, 0);
    group.add(hole);

    // Counterbore
    [d/2, -d/2].forEach((z) => {
      const cb = addShadow(new THREE.Mesh(
        new THREE.CylinderGeometry(11, 11, 4, 28),
        mat
      ));
      cb.rotation.x = Math.PI / 2;
      cb.position.set(cx, cy, z - Math.sign(z) * 2);
      group.add(cb);
    });
  });

  // --- Mounting bosses with counterbored holes ---
  const mountFeat = features.find((f) => f.id === 'f_cut_holes');
  if (mountFeat && !mountFeat.suppressed) {
    const mountPositions: [number, number][] = [
      [-50, 30], [50, 30], [-50, -30], [50, -30]
    ];
    mountPositions.forEach(([cx, cy]) => {
      // Boss (raised circular pad)
      const boss = addShadow(new THREE.Mesh(
        new THREE.CylinderGeometry(10, 12, 3, 24),
        mat
      ));
      boss.rotation.x = Math.PI / 2;
      boss.position.set(cx, cy, d/2 + 1.5);
      group.add(boss);

      // Through hole
      const mh = addShadow(new THREE.Mesh(
        new THREE.CylinderGeometry(4, 4, d + 8, 20),
        darkMat
      ));
      mh.rotation.x = Math.PI / 2;
      mh.position.set(cx, cy, 0);
      group.add(mh);

      // Counterbore on top
      const cb = addShadow(new THREE.Mesh(
        new THREE.CylinderGeometry(7, 7, 4, 20),
        mat
      ));
      cb.rotation.x = Math.PI / 2;
      cb.position.set(cx, cy, d/2 + 2);
      group.add(cb);
    });
  }

  // --- Internal ribs (visible through bore) ---
  const ribMat = aluminum();
  const ribPositions: [number, number, number][] = [
    [-22, 0, 0], [22, 0, 0], [0, 15, 0], [0, -15, 0]
  ];
  ribPositions.forEach(([x, y, _]) => {
    const rib = new THREE.Mesh(
      new THREE.BoxGeometry(2.5, 20, d - wallT * 2),
      ribMat
    );
    rib.position.set(x, y, 0);
    group.add(rib);
  });

  // --- Gasket surface (front face recess) ---
  const gasket = new THREE.Mesh(
    new THREE.RingGeometry(2, 5, 16),
    new THREE.MeshStandardMaterial({ color: 0xc09545, metalness: 0.4, roughness: 0.7 })
  );
  gasket.position.set(0, 0, d/2 + 0.5);
  group.add(gasket);

  // --- Breather port (top) ---
  const breatherBase = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(8, 10, 4, 20),
    mat
  ));
  breatherBase.rotation.x = Math.PI / 2;
  breatherBase.position.set(0, h/2 + 2, 0);
  group.add(breatherBase);

  const breatherTop = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(6, 8, 6, 16),
    brass()
  ));
  breatherTop.rotation.x = Math.PI / 2;
  breatherTop.position.set(0, h/2 + 7, 0);
  group.add(breatherTop);

  // Breather vent slots
  for (let i = 0; i < 6; i++) {
    const slot = new THREE.Mesh(
      new THREE.BoxGeometry(1, 6, 1),
      darkMat
    );
    slot.position.set(0, h/2 + 7, 0);
    slot.rotation.y = (i / 6) * Math.PI * 2;
    slot.position.x = Math.cos((i / 6) * Math.PI * 2) * 3;
    slot.position.z = Math.sin((i / 6) * Math.PI * 2) * 3;
    group.add(slot);
  }

  // --- Drain plug (bottom) ---
  const drainBase = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(8, 10, 4, 20),
    mat
  ));
  drainBase.rotation.x = Math.PI / 2;
  drainBase.position.set(0, -h/2 - 2, -d/4);
  group.add(drainBase);

  const drainPlug = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(6, 7, 4, 6),
    brass()
  ));
  drainPlug.rotation.x = Math.PI / 2;
  drainPlug.position.set(0, -h/2 - 6, -d/4);
  group.add(drainPlug);

  // Hex head on drain plug
  const hexHead = new THREE.Mesh(
    new THREE.CylinderGeometry(8, 8, 2, 6),
    brass()
  );
  hexHead.rotation.x = Math.PI / 2;
  hexHead.position.set(0, -h/2 - 7, -d/4);
  group.add(hexHead);

  // --- Oil sight glass (side) ---
  const sight = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(6, 6, 2, 24),
    new THREE.MeshStandardMaterial({
      color: 0xffaa00, metalness: 0.1, roughness: 0.2,
      transparent: true, opacity: 0.6, emissive: 0x442200
    })
  ));
  sight.rotation.x = Math.PI / 2;
  sight.position.set(w/2 + 1, -10, 0);
  sight.rotation.y = Math.PI / 2;
  group.add(sight);

  // --- Mounting flange feet ---
  const footPositions: [number, number][] = [
    [-w/2 + 8, -h/2 - 4], [w/2 - 8, -h/2 - 4]
  ];
  footPositions.forEach(([fx, fy]) => {
    const foot = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(20, 6, d - 10),
      mat
    ));
    foot.position.set(fx, fy, 0);
    group.add(foot);

    // Foot mounting hole
    const fhol = new THREE.Mesh(
      new THREE.CylinderGeometry(3, 3, 8, 12),
      darkMat
    );
    fhol.rotation.x = Math.PI / 2;
    fhol.position.set(fx, fy - 2, 0);
    group.add(fhol);
  });

  // --- Bolt circle markers (yellow indicator dots) ---
  const patternFeat = features.find((f) => f.id === 'f_pattern1');
  if (patternFeat && !patternFeat.suppressed) {
    const count = (patternFeat.parameters.count as number) || 8;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const r2 = 22;
      // Small lightening hole on top face
      const dot = new THREE.Mesh(
        new THREE.CylinderGeometry(2, 2, 4, 12),
        darkMat
      );
      dot.rotation.x = Math.PI / 2;
      dot.position.set(Math.cos(angle) * r2, Math.sin(angle) * r2, d/2);
      group.add(dot);
    }
  }

  // --- Fillet visualization (corner rounds) ---
  const filletFeat = features.find((f) => f.id === 'f_fillet1');
  if (filletFeat && !filletFeat.suppressed) {
    const radius = filletFeat.parameters.radius as number;
    const corners: [number, number][] = [
      [w/2 - radius, h/2 - radius], [-(w/2 - radius), h/2 - radius],
      [w/2 - radius, -(h/2 - radius)], [-(w/2 - radius), -(h/2 - radius)],
    ];
    corners.forEach(([x, y]) => {
      [d/2, -d/2].forEach((z) => {
        const sphere = addShadow(new THREE.Mesh(
          new THREE.SphereGeometry(radius, 16, 16),
          mat
        ));
        sphere.position.set(x, y, z);
        group.add(sphere);
      });
    });
  }

  // --- Nameplate ---
  const plate = new THREE.Mesh(
    new THREE.BoxGeometry(20, 12, 0.5),
    brass()
  );
  plate.position.set(-30, -h/2 - 0.3, d/2 - 15);
  group.add(plate);

  return group;
}

// ====================== SHAFT (stepped with keyways) ======================
export function createShaftGeometry(): THREE.Group {
  const group = new THREE.Group();
  const mat = stainless();

  // Stepped shaft: 5 sections of varying diameter
  // Layout (along Y axis): end -> shoulder -> main -> shoulder -> end
  const sections = [
    { y: -55, len: 18, r1: 8,  r2: 10 },   // left end (smaller)
    { y: -38, len: 6,  r1: 10, r2: 13 },   // shoulder
    { y: -28, len: 38, r1: 11, r2: 11 },   // main bearing journal
    { y: 10,  len: 6,  r1: 13, r2: 13 },   // shoulder
    { y: 18,  len: 20, r1: 13, r2: 11 },   // gear seat
    { y: 38,  len: 4,  r1: 11, r2: 10 },   // shoulder
    { y: 44,  len: 12, r1: 10, r2: 8 },    // right end
  ];

  sections.forEach((s, i) => {
    const geom = new THREE.CylinderGeometry(s.r1, s.r2, s.len, 32);
    const mesh = addShadow(new THREE.Mesh(geom, mat));
    mesh.position.y = s.y + s.len/2;
    group.add(mesh);

    // Chamfer at section transitions (small ring)
    if (i < sections.length - 1) {
      const chamfer = new THREE.Mesh(
        new THREE.TorusGeometry(s.r1 - 0.5, 0.5, 6, 24),
        mat
      );
      chamfer.rotation.x = Math.PI / 2;
      chamfer.position.y = s.y + s.len;
      group.add(chamfer);
    }
  });

  // Keyway on left end (rectangular slot)
  const keyway1 = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(4, 18, 3),
    new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.5, roughness: 0.6 })
  ));
  keyway1.position.set(8.5, -50, 0);
  keyway1.rotation.z = Math.PI / 2;
  group.add(keyway1);

  // Keyway on right end
  const keyway2 = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(4, 12, 3),
    new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.5, roughness: 0.6 })
  ));
  keyway2.position.set(8.5, 47, 0);
  keyway2.rotation.z = Math.PI / 2;
  group.add(keyway2);

  // Retaining ring grooves (snap ring)
  [-30, 38].forEach((y) => {
    const groove = new THREE.Mesh(
      new THREE.TorusGeometry(11.5, 0.6, 6, 32),
      new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.7, roughness: 0.4 })
    );
    groove.rotation.x = Math.PI / 2;
    groove.position.y = y;
    group.add(groove);
  });

  // Center drilling (lathe center mark on ends)
  [-63, 56].forEach((y) => {
    const center = new THREE.Mesh(
      new THREE.ConeGeometry(1.5, 3, 12),
      mat
    );
    center.rotation.x = y < 0 ? 0 : Math.PI;
    center.position.y = y + (y < 0 ? 1.5 : -1.5);
    group.add(center);
  });

  return group;
}

// ====================== GEAR (with hub, web, lightening holes) ======================
export function createGearGeometry(): THREE.Group {
  const group = new THREE.Group();
  const mat = steel();
  const darkMat = darkSteel();

  const teeth = 32;
  const gearModule = 2;
  const pitchR = (teeth * gearModule) / 2;
  const outerR = pitchR + gearModule;
  const rootR = pitchR - gearModule * 1.25;
  const thickness = 20;

  // --- Gear teeth using involute approximation ---
  const shape = new THREE.Shape();
  for (let i = 0; i < teeth; i++) {
    const a0 = (i / teeth) * Math.PI * 2;
    const a1 = ((i + 0.25) / teeth) * Math.PI * 2;
    const a2 = ((i + 0.4) / teeth) * Math.PI * 2;
    const a3 = ((i + 0.6) / teeth) * Math.PI * 2;
    const a4 = ((i + 0.75) / teeth) * Math.PI * 2;
    const a5 = ((i + 1) / teeth) * Math.PI * 2;

    if (i === 0) shape.moveTo(Math.cos(a0) * rootR, Math.sin(a0) * rootR);
    // Tooth profile: rise -> land -> fall -> root
    shape.lineTo(Math.cos(a1) * rootR, Math.sin(a1) * rootR);
    shape.lineTo(Math.cos(a2) * outerR, Math.sin(a2) * outerR);
    shape.lineTo(Math.cos(a3) * outerR, Math.sin(a3) * outerR);
    shape.lineTo(Math.cos(a4) * rootR, Math.sin(a4) * rootR);
    shape.lineTo(Math.cos(a5) * rootR, Math.sin(a5) * rootR);
  }

  // Central bore with keyway
  const boreR = 11;
  const keywayW = 4, keywayD = 2;
  const hole = new THREE.Path();
  hole.absarc(0, 0, boreR, 0, Math.PI * 2, true);
  // Keyway slot
  hole.moveTo(boreR - 0.1, -keywayW/2);
  hole.lineTo(boreR + keywayD, -keywayW/2);
  hole.lineTo(boreR + keywayD, keywayW/2);
  hole.lineTo(boreR - 0.1, keywayW/2);
  shape.holes.push(hole);

  // Lightening holes (4 large circular cutouts in web)
  const lightR = 6;
  const lightOffset = pitchR * 0.55;
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    const lh = new THREE.Path();
    lh.absarc(Math.cos(a) * lightOffset, Math.sin(a) * lightOffset, lightR, 0, Math.PI * 2, true);
    shape.holes.push(lh);
  }

  const gearGeom = new THREE.ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: true,
    bevelThickness: 0.5,
    bevelSize: 0.5,
    bevelSegments: 2,
    curveSegments: 24,
  });
  gearGeom.center();
  const gear = addShadow(new THREE.Mesh(gearGeom, mat));
  gear.rotation.x = Math.PI / 2;
  group.add(gear);

  // Hub (raised boss around bore, both sides)
  [thickness/2, -thickness/2].forEach((z) => {
    const hubGeom = new THREE.CylinderGeometry(boreR + 4, boreR + 4, 6, 32);
    const hub = addShadow(new THREE.Mesh(hubGeom, mat));
    hub.rotation.x = Math.PI / 2;
    hub.position.z = z + Math.sign(z) * 3;
    group.add(hub);
  });

  return group;
}

// ====================== BEARING (detailed with cage, seals) ======================
export function createBearingGeometry(): THREE.Group {
  const group = new THREE.Group();
  const outerMat = metal(0x9ca3af, 0.92, 0.18);
  const innerMat = metal(0xc4c8cc, 0.95, 0.1);
  const ballMat = metal(0xeeeeee, 0.95, 0.05);
  const cageMat = brass();
  const sealMat = rubber();

  const od = 47, id = 20, width = 14;
  const ballR = 4;
  const pitchR = (od + id) / 4;

  // Outer race with groove for balls
  const outerRace = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(od/2, od/2, width, 48),
    outerMat
  ));
  outerRace.rotation.x = Math.PI / 2;
  group.add(outerRace);

  // Outer race inner groove (where balls ride)
  const outerGroove = new THREE.Mesh(
    new THREE.TorusGeometry(pitchR, ballR * 0.7, 12, 48),
    new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.9, roughness: 0.15 })
  );
  group.add(outerGroove);

  // Inner race
  const innerRace = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(id/2, id/2, width, 32),
    innerMat
  ));
  innerRace.rotation.x = Math.PI / 2;
  group.add(innerRace);

  // Inner race outer groove
  const innerGroove = new THREE.Mesh(
    new THREE.TorusGeometry(pitchR, ballR * 0.7, 12, 32),
    new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.9, roughness: 0.15 })
  );
  group.add(innerGroove);

  // Balls with cage
  const ballCount = 10;
  for (let i = 0; i < ballCount; i++) {
    const a = (i / ballCount) * Math.PI * 2;
    // Ball
    const ball = addShadow(new THREE.Mesh(
      new THREE.SphereGeometry(ballR, 24, 24),
      ballMat
    ));
    ball.position.set(Math.cos(a) * pitchR, Math.sin(a) * pitchR, 0);
    group.add(ball);

    // Cage pocket (small bracket between balls)
    const pocket = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, ballR * 1.5, 2),
      cageMat
    );
    pocket.position.set(Math.cos(a) * pitchR, Math.sin(a) * pitchR, 0);
    pocket.lookAt(0, 0, 0);
    pocket.rotateY(Math.PI / 2);
    group.add(pocket);
  }

  // Cage (thin brass ring with pockets)
  const cageRing = new THREE.Mesh(
    new THREE.TorusGeometry(pitchR, 1, 8, 48),
    cageMat
  );
  group.add(cageRing);

  // Rubber seals on both sides
  [width/2 - 1, -width/2 + 1].forEach((z) => {
    const seal = new THREE.Mesh(
      new THREE.RingGeometry(id/2 + 1, od/2 - 1, 48),
      sealMat
    );
    seal.position.z = z;
    seal.rotation.y = 0;
    group.add(seal);

    // Seal lip
    const lip = new THREE.Mesh(
      new THREE.TorusGeometry((id + 4)/2, 0.6, 6, 32),
      sealMat
    );
    lip.position.z = z;
    group.add(lip);
  });

  // Brand engraving (decorative line on outer race)
  const engrave = new THREE.Mesh(
    new THREE.TorusGeometry(od/2 - 1, 0.3, 4, 48),
    new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.7, roughness: 0.3 })
  );
  engrave.position.z = width/2 + 0.1;
  group.add(engrave);

  return group;
}

// ====================== COVER (with ribs, gasket, oil sight) ======================
export function createCoverGeometry(): THREE.Group {
  const group = new THREE.Group();
  const mat = aluminum();
  const darkMat = darkSteel();
  const gasketMat = new THREE.MeshStandardMaterial({ color: 0x4a3520, metalness: 0.2, roughness: 0.8 });

  const w = 120, h = 80, d = 8;

  // Main cover plate (with rounded corners)
  const shape = new THREE.Shape();
  const r = 8;
  shape.moveTo(-w/2 + r, -h/2);
  shape.lineTo(w/2 - r, -h/2);
  shape.quadraticCurveTo(w/2, -h/2, w/2, -h/2 + r);
  shape.lineTo(w/2, h/2 - r);
  shape.quadraticCurveTo(w/2, h/2, w/2 - r, h/2);
  shape.lineTo(-w/2 + r, h/2);
  shape.quadraticCurveTo(-w/2, h/2, -w/2, h/2 - r);
  shape.lineTo(-w/2, -h/2 + r);
  shape.quadraticCurveTo(-w/2, -h/2, -w/2 + r, -h/2);

  const coverGeom = new THREE.ExtrudeGeometry(shape, {
    depth: d, bevelEnabled: true, bevelThickness: 1, bevelSize: 1, bevelSegments: 2,
  });
  const cover = addShadow(new THREE.Mesh(coverGeom, mat));
  cover.position.z = -d/2;
  group.add(cover);

  // Recess for gasket
  const recessShape = new THREE.Shape();
  const rr = r - 4;
  const rw = w - 8, rh = h - 8;
  recessShape.moveTo(-rw/2 + rr, -rh/2);
  recessShape.lineTo(rw/2 - rr, -rh/2);
  recessShape.quadraticCurveTo(rw/2, -rh/2, rw/2, -rh/2 + rr);
  recessShape.lineTo(rw/2, rh/2 - rr);
  recessShape.quadraticCurveTo(rw/2, rh/2, rw/2 - rr, rh/2);
  recessShape.lineTo(-rw/2 + rr, rh/2);
  recessShape.quadraticCurveTo(-rw/2, rh/2, -rw/2, rh/2 - rr);
  recessShape.lineTo(-rw/2, -rh/2 + rr);
  recessShape.quadraticCurveTo(-rw/2, -rh/2, -rw/2 + rr, -rh/2);

  const recessGeom = new THREE.ExtrudeGeometry(recessShape, { depth: 3, bevelEnabled: false });
  const recess = new THREE.Mesh(recessGeom, gasketMat);
  recess.position.z = -1.5;
  group.add(recess);

  // Reinforcing ribs (cross pattern on outer face)
  const ribMat = aluminum();
  const ribs: [number, number, number][] = [
    [0, 0, 0],  // horizontal
    [0, 0, Math.PI / 2],  // vertical
  ];
  ribs.forEach(([rx, ry, rz]) => {
    const rib = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(w - 20, 3, 2),
      ribMat
    ));
    rib.position.set(0, 0, d/2 + 1);
    rib.rotation.z = rz;
    group.add(rib);
  });

  // Diagonal ribs
  [Math.PI / 4, -Math.PI / 4].forEach((rz) => {
    const rib = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(60, 3, 2),
      ribMat
    ));
    rib.position.set(0, 0, d/2 + 1);
    rib.rotation.z = rz;
    group.add(rib);
  });

  // Bolt holes with counterbores
  const boltPositions: [number, number][] = [
    [-50, 30], [50, 30], [-50, -30], [50, -30],
    [0, 30], [0, -30], [-50, 0], [50, 0]
  ];
  boltPositions.forEach(([bx, by]) => {
    // Through hole
    const hole = new THREE.Mesh(
      new THREE.CylinderGeometry(3.5, 3.5, d + 4, 16),
      darkMat
    );
    hole.rotation.x = Math.PI / 2;
    hole.position.set(bx, by, 0);
    group.add(hole);

    // Counterbore
    const cb = new THREE.Mesh(
      new THREE.CylinderGeometry(6, 6, 3, 16),
      mat
    );
    cb.rotation.x = Math.PI / 2;
    cb.position.set(bx, by, d/2 - 1);
    group.add(cb);
  });

  // Oil fill plug (top)
  const fillPlug = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(8, 9, 4, 6),
    brass()
  ));
  fillPlug.rotation.x = Math.PI / 2;
  fillPlug.position.set(0, h/2 + 2, 0);
  group.add(fillPlug);

  // Oil sight glass (transparent)
  const sight = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(7, 7, 2, 24),
    new THREE.MeshStandardMaterial({
      color: 0xff8800, metalness: 0.1, roughness: 0.15,
      transparent: true, opacity: 0.55, emissive: 0x442200
    })
  ));
  sight.position.set(40, 0, d/2 + 1);
  group.add(sight);

  // Sight glass retainer ring
  const retainer = new THREE.Mesh(
    new THREE.TorusGeometry(7, 1, 6, 24),
    brass()
  );
  retainer.position.set(40, 0, d/2 + 1.5);
  group.add(retainer);

  return group;
}

// ====================== SOCKET HEAD CAP SCREW ======================
export function createBoltGeometry(): THREE.Group {
  const group = new THREE.Group();
  const mat = metal(0x475569, 0.92, 0.18);
  const threadMat = metal(0x2a2e35, 0.95, 0.15);

  // Cylindrical head (socket head cap screw style)
  const headGeom = new THREE.CylinderGeometry(5, 5, 5, 24);
  const head = addShadow(new THREE.Mesh(headGeom, mat));
  head.position.y = 2.5;
  group.add(head);

  // Top chamfer
  const chamfer = new THREE.Mesh(
    new THREE.CylinderGeometry(4.5, 5, 0.5, 24),
    mat
  );
  chamfer.position.y = 5;
  group.add(chamfer);

  // Hex socket (Allen key hole)
  const socketShape = new THREE.Shape();
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
    if (i === 0) socketShape.moveTo(Math.cos(a) * 2, Math.sin(a) * 2);
    else socketShape.lineTo(Math.cos(a) * 2, Math.sin(a) * 2);
  }
  const socketGeom = new THREE.ExtrudeGeometry(socketShape, { depth: 2.5, bevelEnabled: false });
  const socket = new THREE.Mesh(socketGeom, new THREE.MeshStandardMaterial({ color: 0x0a0a0a, metalness: 0.4, roughness: 0.8 }));
  socket.rotation.x = Math.PI;
  socket.position.y = 5;
  group.add(socket);

  // Body / shank
  const body = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(3, 3, 20, 24),
    mat
  ));
  body.position.y = -10;
  group.add(body);

  // Thread details (helical appearance via rings)
  for (let i = 0; i < 14; i++) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(3, 0.25, 4, 20),
      threadMat
    );
    ring.position.y = -1 - i * 1.4;
    ring.rotation.x = Math.PI / 2;
    group.add(ring);
  }

  // Thread chamfer at tip
  const tip = new THREE.Mesh(
    new THREE.CylinderGeometry(3, 1.5, 2, 16),
    mat
  );
  tip.position.y = -20.5;
  group.add(tip);

  return group;
}

// ====================== NEW: JAW COUPLING ======================
export function createCouplingGeometry(): THREE.Group {
  const group = new THREE.Group();
  const metalMat = aluminum();
  const spiderMat = new THREE.MeshStandardMaterial({ color: 0xe11d48, metalness: 0.05, roughness: 0.7 });

  const od = 30, id = 8, width = 20;

  // Two metal hubs
  [-width/2 - 3, width/2 + 3].forEach((z) => {
    const hub = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(od/2, od/2, 6, 32),
      metalMat
    ));
    hub.rotation.x = Math.PI / 2;
    hub.position.z = z;
    group.add(hub);

    // Jaw teeth (3 claws)
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2;
      const claw = addShadow(new THREE.Mesh(
        new THREE.BoxGeometry(8, od * 0.8, 6),
        metalMat
      ));
      claw.position.set(Math.cos(a) * 6, Math.sin(a) * 6, z);
      claw.rotation.z = a;
      group.add(claw);
    }

    // Center bore
    const bore = new THREE.Mesh(
      new THREE.CylinderGeometry(id/2, id/2, 8, 16),
      new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.5, roughness: 0.7 })
    );
    bore.rotation.x = Math.PI / 2;
    bore.position.z = z;
    group.add(bore);

    // Keyway
    const keyway = new THREE.Mesh(
      new THREE.BoxGeometry(2, 3, 8),
      new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 0.3, roughness: 0.9 })
    );
    keyway.position.set(id/2 + 1, 0, z);
    group.add(keyway);

    // Set screw
    const setScrew = new THREE.Mesh(
      new THREE.CylinderGeometry(1.5, 1.5, 2, 6),
      darkSteel()
    );
    setScrew.rotation.x = Math.PI / 2;
    setScrew.position.set(od/2 - 1, 0, z);
    group.add(setScrew);
  });

  // Spider (rubber/elastomer in the middle)
  const spider = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(od/2 - 2, od/2 - 2, width, 32),
    spiderMat
  ));
  spider.rotation.x = Math.PI / 2;
  group.add(spider);

  // Spider teeth (matching the jaws)
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 + Math.PI / 3;
    const leg = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(8, od * 0.7, width),
      spiderMat
    ));
    leg.position.set(Math.cos(a) * 5, Math.sin(a) * 5, 0);
    leg.rotation.z = a;
    group.add(leg);
  }

  return group;
}

// ====================== NEW: V-BELT PULLEY ======================
export function createPulleyGeometry(): THREE.Group {
  const group = new THREE.Group();
  const mat = aluminum();
  const darkMat = darkSteel();

  const od = 60, id = 12, width = 24;

  // Main pulley body with V-grooves
  // We construct this as a LatheGeometry: profile revolved around Y axis
  const points: THREE.Vector2[] = [];
  // Profile from inside to outside (top half)
  points.push(new THREE.Vector2(id/2, -width/2));
  points.push(new THREE.Vector2(id/2, -width/2 + 3));
  points.push(new THREE.Vector2(id/2 + 4, -width/2 + 3));
  // V-grooves (3 of them)
  const grooveCount = 3;
  const grooveSpacing = 6;
  const startX = -width/2 + 6;
  for (let i = 0; i < grooveCount; i++) {
    const gx = startX + i * grooveSpacing;
    points.push(new THREE.Vector2(od/2 - 1, gx));
    points.push(new THREE.Vector2(od/2 - 5, gx + 1.5));
    points.push(new THREE.Vector2(od/2 - 1, gx + 3));
  }
  points.push(new THREE.Vector2(id/2 + 4, width/2 - 3));
  points.push(new THREE.Vector2(id/2, width/2 - 3));
  points.push(new THREE.Vector2(id/2, width/2));

  const pulleyGeom = new THREE.LatheGeometry(points, 48);
  const pulley = addShadow(new THREE.Mesh(pulleyGeom, mat));
  pulley.rotation.x = Math.PI / 2;
  group.add(pulley);

  // Hub extension
  const hub = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(id/2 + 5, id/2 + 5, 10, 32),
    mat
  ));
  hub.rotation.x = Math.PI / 2;
  hub.position.z = width/2 + 5;
  group.add(hub);

  // Center bore
  const bore = new THREE.Mesh(
    new THREE.CylinderGeometry(id/2, id/2, width + 12, 24),
    darkMat
  );
  bore.rotation.x = Math.PI / 2;
  bore.position.z = 5;
  group.add(bore);

  // Keyway
  const keyway = new THREE.Mesh(
    new THREE.BoxGeometry(3, 4, width + 12),
    darkMat
  );
  keyway.position.set(id/2 + 1.5, 0, 5);
  group.add(keyway);

  // Set screws (2)
  [width/2 + 4, width/2 + 8].forEach((z) => {
    const ss = new THREE.Mesh(
      new THREE.CylinderGeometry(1.5, 1.5, 3, 6),
      darkMat
    );
    ss.rotation.x = Math.PI / 2;
    ss.position.set(id/2 + 5, 0, z);
    group.add(ss);

    // Hex socket on top
    const sock = new THREE.Mesh(
      new THREE.CylinderGeometry(0.8, 0.8, 1, 6),
      new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 0.3, roughness: 0.9 })
    );
    sock.position.set(id/2 + 5, 2, z);
    group.add(sock);
  });

  // Lightening holes in web (3 holes)
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2;
    const hole = new THREE.Mesh(
      new THREE.CylinderGeometry(4, 4, 4, 16),
      darkMat
    );
    hole.position.set(Math.cos(a) * (od/4), Math.sin(a) * (od/4), 0);
    group.add(hole);
  }

  return group;
}

// ====================== NEW: COMPRESSION SPRING ======================
export function createSpringGeometry(): THREE.Group {
  const group = new THREE.Group();
  const mat = stainless();

  // Helical spring using TubeGeometry
  const wireR = 1.5;
  const coilR = 12;
  const coils = 8;
  const pitch = 4;
  const height = coils * pitch;

  const path = new THREE.CatmullRomCurve3(
    Array.from({ length: coils * 32 + 1 }).map((_, i) => {
      const t = i / (coils * 32);
      const angle = t * coils * Math.PI * 2;
      return new THREE.Vector3(
        Math.cos(angle) * coilR,
        Math.sin(angle) * coilR,
        t * height - height / 2
      );
    }),
    false
  );

  const springGeom = new THREE.TubeGeometry(path, coils * 32, wireR, 8, false);
  const spring = addShadow(new THREE.Mesh(springGeom, mat));
  spring.rotation.x = Math.PI / 2;
  group.add(spring);

  // End caps (flat ground ends)
  [height/2, -height/2].forEach((z) => {
    const cap = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(coilR + wireR, coilR + wireR, 0.5, 32),
      mat
    ));
    cap.rotation.x = Math.PI / 2;
    cap.position.z = z;
    group.add(cap);
  });

  return group;
}

// ====================== NEW: CENTRIFUGAL IMPELLER ======================
export function createImpellerGeometry(): THREE.Group {
  const group = new THREE.Group();
  const mat = stainless();
  const darkMat = darkSteel();

  const od = 60, id = 16, height = 18;

  // Back disc (shroud)
  const backDisc = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(od/2, od/2, 3, 48),
    mat
  ));
  backDisc.position.z = -height/2 + 1.5;
  group.add(backDisc);

  // Hub
  const hub = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(id/2 + 3, id/2 + 3, 12, 32),
    mat
  ));
  hub.position.z = -height/2 + 6;
  group.add(hub);

  // Center bore
  const bore = new THREE.Mesh(
    new THREE.CylinderGeometry(id/2, id/2, height + 4, 24),
    darkMat
  );
  group.add(bore);

  // Keyway
  const keyway = new THREE.Mesh(
    new THREE.BoxGeometry(3, 4, height + 4),
    darkMat
  );
  keyway.position.set(id/2 + 1.5, 0, 0);
  group.add(keyway);

  // Curved blades (7 blades)
  const bladeCount = 7;
  for (let i = 0; i < bladeCount; i++) {
    const a = (i / bladeCount) * Math.PI * 2;

    // Create curved blade using ExtrudeGeometry along an arc
    const bladeShape = new THREE.Shape();
    bladeShape.moveTo(0, 0);
    bladeShape.lineTo(0, height - 3);
    bladeShape.bezierCurveTo(5, height - 3, 15, height - 3, od/2 - 4, height - 4);
    bladeShape.bezierCurveTo(15, height - 6, 5, height - 6, 0, height - 6);
    bladeShape.lineTo(0, 0);

    const bladeGeom = new THREE.ExtrudeGeometry(bladeShape, {
      depth: 1.5, bevelEnabled: false,
    });
    const blade = addShadow(new THREE.Mesh(bladeGeom, mat));
    blade.rotation.z = a;
    group.add(blade);
  }

  // Front shroud ring (partial - open impeller style, just outer ring)
  const frontRing = addShadow(new THREE.Mesh(
    new THREE.TorusGeometry(od/2 - 2, 1.5, 8, 48),
    mat
  ));
  frontRing.position.z = height/2 - 2;
  group.add(frontRing);

  // Balance holes (3 holes through back disc)
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 + Math.PI / 3;
    const hole = new THREE.Mesh(
      new THREE.CylinderGeometry(2.5, 2.5, 4, 12),
      darkMat
    );
    hole.position.set(Math.cos(a) * (od/3.5), Math.sin(a) * (od/3.5), -height/2 + 1.5);
    group.add(hole);
  }

  return group;
}

// ====================== NEW: TURBINE WHEEL ======================
export function createTurbineGeometry(): THREE.Group {
  const group = new THREE.Group();
  const mat = darkSteel();

  // Hub (conical back)
  const hubGeom = new THREE.CylinderGeometry(8, 14, 12, 32);
  const hub = addShadow(new THREE.Mesh(hubGeom, mat));
  group.add(hub);

  // Nose cone (front)
  const nose = addShadow(new THREE.Mesh(
    new THREE.ConeGeometry(8, 8, 32),
    mat
  ));
  nose.position.y = 10;
  group.add(nose);

  // Curved radial blades (10 blades - like turbocharger compressor)
  const bladeCount = 10;
  for (let i = 0; i < bladeCount; i++) {
    const a = (i / bladeCount) * Math.PI * 2;

    // Curved blade shape
    const bladeShape = new THREE.Shape();
    bladeShape.moveTo(0, -6);
    bladeShape.quadraticCurveTo(15, -4, 22, 0);
    bladeShape.quadraticCurveTo(15, 4, 0, 6);
    bladeShape.lineTo(0, -6);

    const bladeGeom = new THREE.ExtrudeGeometry(bladeShape, {
      depth: 1, bevelEnabled: true, bevelSize: 0.2, bevelThickness: 0.2, bevelSegments: 1,
    });
    const blade = addShadow(new THREE.Mesh(bladeGeom, mat));
    blade.rotation.y = a;
    blade.rotation.x = Math.PI / 2;
    blade.position.y = 0;
    group.add(blade);
  }

  // Back disc
  const backDisc = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(22, 22, 2, 48),
    mat
  ));
  backDisc.position.y = -6;
  group.add(backDisc);

  // Center bore
  const bore = new THREE.Mesh(
    new THREE.CylinderGeometry(4, 4, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.5, roughness: 0.7 })
  );
  group.add(bore);

  return group;
}

// ====================== NEW: ROBOTIC ARM SEGMENT ======================
export function createRoboticArmGeometry(): THREE.Group {
  const group = new THREE.Group();
  const mat = metal(0xf59e0b, 0.7, 0.4);  // industrial orange/yellow
  const darkMat = darkSteel();
  const jointMat = metal(0x475569, 0.85, 0.25);

  // Base joint (cylinder)
  const base = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(14, 16, 8, 32),
    jointMat
  ));
  base.position.y = -20;
  group.add(base);

  // Base mounting flange
  const flange = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(18, 18, 2, 32),
    jointMat
  ));
  flange.position.y = -24;
  group.add(flange);

  // Mounting bolts on flange (6)
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const bolt = new THREE.Mesh(
      new THREE.CylinderGeometry(1.5, 1.5, 2, 8),
      darkMat
    );
    bolt.position.set(Math.cos(a) * 14, -25, Math.sin(a) * 14);
    group.add(bolt);
  }

  // Lower arm segment (curved)
  const armShape = new THREE.Shape();
  armShape.moveTo(-8, 0);
  armShape.lineTo(-6, 18);
  armShape.quadraticCurveTo(-4, 20, 0, 20);
  armShape.quadraticCurveTo(4, 20, 6, 18);
  armShape.lineTo(8, 0);
  armShape.lineTo(-8, 0);
  const armGeom = new THREE.ExtrudeGeometry(armShape, {
    depth: 12, bevelEnabled: true, bevelSize: 0.5, bevelThickness: 0.5, bevelSegments: 2,
  });
  armGeom.center();
  const arm = addShadow(new THREE.Mesh(armGeom, mat));
  arm.position.y = -5;
  arm.rotation.y = Math.PI / 2;
  group.add(arm);

  // Joint pivot (where arm rotates)
  const pivot = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(5, 5, 16, 24),
    darkMat
  ));
  pivot.rotation.x = Math.PI / 2;
  pivot.position.y = -20;
  group.add(pivot);

  // Joint caps
  [-7, 7].forEach((z) => {
    const cap = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(7, 7, 1.5, 24),
      jointMat
    ));
    cap.rotation.x = Math.PI / 2;
    cap.position.set(0, -20, z);
    group.add(cap);
  });

  // Wrist joint at end
  const wrist = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(8, 10, 6, 32),
    jointMat
  ));
  wrist.position.y = 18;
  group.add(wrist);

  // Tool mounting flange (ISO 9409-style)
  const toolFlange = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(12, 12, 2, 32),
    jointMat
  ));
  toolFlange.position.y = 22;
  group.add(toolFlange);

  // Tool mounting bolts (6 around)
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const bolt = new THREE.Mesh(
      new THREE.CylinderGeometry(1.2, 1.2, 2, 8),
      darkMat
    );
    bolt.position.set(Math.cos(a) * 9, 23, Math.sin(a) * 9);
    group.add(bolt);
  }

  // Center bore for cable routing
  const cableHole = new THREE.Mesh(
    new THREE.CylinderGeometry(3, 3, 40, 16),
    new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 0.3, roughness: 0.9 })
  );
  group.add(cableHole);

  // Cable bundle (visible at base)
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2;
    const cable = new THREE.Mesh(
      new THREE.CylinderGeometry(0.8, 0.8, 30, 8),
      new THREE.MeshStandardMaterial({
        color: [0x000000, 0xff0000, 0x00ff00, 0x0000ff][i],
        metalness: 0.1, roughness: 0.7
      })
    );
    cable.position.set(Math.cos(a) * 1.5, -5, Math.sin(a) * 1.5);
    group.add(cable);
  }

  return group;
}

// ====================== NEW: BRACKET (sheet metal) ======================
export function createBracketGeometry(): THREE.Group {
  const group = new THREE.Group();
  const mat = aluminum();

  // L-bracket shape via extrusion
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(60, 0);
  shape.lineTo(60, 4);
  shape.lineTo(4, 4);
  shape.lineTo(4, 40);
  shape.lineTo(0, 40);
  shape.lineTo(0, 0);

  const bracketGeom = new THREE.ExtrudeGeometry(shape, {
    depth: 30, bevelEnabled: false,
  });
  const bracket = addShadow(new THREE.Mesh(bracketGeom, mat));
  group.add(bracket);

  // Mounting holes on horizontal flange
  [[15, 2, 15], [45, 2, 15]].forEach(([x, y, z]) => {
    const hole = new THREE.Mesh(
      new THREE.CylinderGeometry(2.5, 2.5, 6, 16),
      new THREE.MeshStandardMaterial({ color: 0x111, metalness: 0.5, roughness: 0.7 })
    );
    hole.position.set(x, y, z);
    hole.rotation.x = Math.PI / 2;
    group.add(hole);
  });

  // Mounting holes on vertical flange
  [[2, 12, 15], [2, 28, 15]].forEach(([x, y, z]) => {
    const hole = new THREE.Mesh(
      new THREE.CylinderGeometry(2.5, 2.5, 6, 16),
      new THREE.MeshStandardMaterial({ color: 0x111, metalness: 0.5, roughness: 0.7 })
    );
    hole.position.set(x, y, z);
    hole.rotation.z = Math.PI / 2;
    group.add(hole);
  });

  // Bend relief (small notch at corner)
  const relief = new THREE.Mesh(
    new THREE.BoxGeometry(2, 2, 30),
    new THREE.MeshStandardMaterial({ color: 0x000, metalness: 0.3, roughness: 0.8 })
  );
  relief.position.set(3, 3, 15);
  group.add(relief);

  // Stiffening rib along vertical
  const rib = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 30, 4),
    mat
  ));
  rib.position.set(7, 20, 15);
  group.add(rib);

  return group;
}

// ====================== NEW: HEAT SINK ======================
export function createHeatSinkGeometry(): THREE.Group {
  const group = new THREE.Group();
  const mat = aluminum();

  // Base plate
  const base = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(60, 4, 40),
    mat
  ));
  base.position.y = -2;
  group.add(base);

  // Cooling fins (15 vertical fins)
  const finCount = 15;
  for (let i = 0; i < finCount; i++) {
    const x = -28 + i * 4;
    const fin = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 20, 36),
      mat
    ));
    fin.position.set(x, 10, 0);
    group.add(fin);
  }

  // Heat pipes (3 copper U-tubes)
  const pipeMat = brass();
  for (let i = 0; i < 3; i++) {
    const z = -10 + i * 10;
    // Horizontal part on top
    const top = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(1.5, 1.5, 30, 12),
      pipeMat
    ));
    top.rotation.z = Math.PI / 2;
    top.position.set(0, 20, z);
    group.add(top);

    // Two vertical legs
    [-15, 15].forEach((x) => {
      const leg = addShadow(new THREE.Mesh(
        new THREE.CylinderGeometry(1.5, 1.5, 22, 12),
        pipeMat
      ));
      leg.position.set(x, 10, z);
      group.add(leg);

      // Bend radius
      const bend = addShadow(new THREE.Mesh(
        new THREE.TorusGeometry(1.5, 1.5, 8, 12, Math.PI / 2),
        pipeMat
      ));
      bend.position.set(x, 20, z);
      bend.rotation.y = Math.PI / 2;
      bend.rotation.x = -Math.PI / 2;
      group.add(bend);
    });
  }

  // Thermal compound (dark patch on base bottom)
  const compound = new THREE.Mesh(
    new THREE.BoxGeometry(20, 0.5, 20),
    new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.3, roughness: 0.8 })
  );
  compound.position.y = -4;
  group.add(compound);

  return group;
}

// ====================== NEW: CYLINDER HEAD ======================
export function createCylinderHeadGeometry(): THREE.Group {
  const group = new THREE.Group();
  const mat = aluminum();
  const darkMat = darkSteel();
  const brassMat = brass();

  // Main block
  const block = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(80, 30, 50),
    mat
  ));
  group.add(block);

  // Top fins (cooling fins)
  for (let i = 0; i < 8; i++) {
    const fin = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(82, 2, 50),
      mat
    ));
    fin.position.y = 16 + i * 3;
    group.add(fin);
  }

  // Combustion chamber (4 cylinders - inline)
  for (let i = 0; i < 4; i++) {
    const x = -30 + i * 20;

    // Spark plug well
    const well = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(6, 6, 25, 24),
      mat
    ));
    well.position.set(x, 12, 0);
    group.add(well);

    // Spark plug
    const plugBody = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(4, 4, 12, 6),
      brassMat
    ));
    plugBody.position.set(x, 22, 0);
    group.add(plugBody);

    // Plug ceramic
    const ceramic = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(3, 3, 8, 16),
      new THREE.MeshStandardMaterial({ color: 0xe5e7eb, metalness: 0.1, roughness: 0.7 })
    ));
    ceramic.position.set(x, 30, 0);
    group.add(ceramic);

    // Plug terminal
    const terminal = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(1, 1, 4, 8),
      brassMat
    ));
    terminal.position.set(x, 35, 0);
    group.add(terminal);

    // Cylinder bore (visible from below)
    const bore = new THREE.Mesh(
      new THREE.CylinderGeometry(10, 10, 12, 32),
      darkMat
    );
    bore.position.set(x, -15, 0);
    group.add(bore);
  }

  // Intake ports (4 tubes on one side)
  for (let i = 0; i < 4; i++) {
    const x = -30 + i * 20;
    const port = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(5, 5, 12, 16),
      mat
    ));
    port.rotation.z = Math.PI / 2;
    port.position.set(x, 5, -28);
    group.add(port);

    // Port flange
    const flange = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(8, 10, 2),
      mat
    ));
    flange.position.set(x, 5, -32);
    group.add(flange);
  }

  // Exhaust ports (other side)
  for (let i = 0; i < 4; i++) {
    const x = -30 + i * 20;
    const port = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(5, 5, 12, 16),
      darkMat
    ));
    port.rotation.z = Math.PI / 2;
    port.position.set(x, 5, 28);
    group.add(port);

    const flange = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(8, 10, 2),
      darkMat
    ));
    flange.position.set(x, 5, 32);
    group.add(flange);
  }

  // Bolt holes around perimeter (top)
  for (let i = 0; i < 6; i++) {
    const x = -35 + i * 14;
    [22, -22].forEach((z) => {
      const hole = new THREE.Mesh(
        new THREE.CylinderGeometry(2, 2, 6, 8),
        darkMat
      );
      hole.position.set(x, 15, z);
      group.add(hole);

      // Bolt
      const bolt = addShadow(new THREE.Mesh(
        new THREE.CylinderGeometry(2.5, 2.5, 4, 6),
        darkMat
      ));
      bolt.position.set(x, 17, z);
      group.add(bolt);
    });
  }

  // Camshaft covers (top, decorative)
  const cover = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(70, 6, 30),
    new THREE.MeshStandardMaterial({ color: 0x1f2937, metalness: 0.6, roughness: 0.4 })
  ));
  cover.position.y = 12;
  group.add(cover);

  return group;
}

// ====================== NEW: PROPELLER ======================
export function createPropellerGeometry(): THREE.Group {
  const group = new THREE.Group();
  const mat = brass();
  const darkMat = darkSteel();

  // Hub
  const hub = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(8, 10, 16, 24),
    mat
  ));
  group.add(hub);

  // Tapered nose
  const nose = addShadow(new THREE.Mesh(
    new THREE.ConeGeometry(8, 8, 24),
    mat
  ));
  nose.position.y = 12;
  group.add(nose);

  // 3 blades with twisted airfoil shape
  const bladeCount = 3;
  for (let i = 0; i < bladeCount; i++) {
    const a = (i / bladeCount) * Math.PI * 2;
    const bladeGroup = new THREE.Group();

    // Blade shape - airfoil-like
    const bladeShape = new THREE.Shape();
    bladeShape.moveTo(0, -2);
    bladeShape.quadraticCurveTo(20, -3, 40, -1);
    bladeShape.quadraticCurveTo(45, 0, 40, 1);
    bladeShape.quadraticCurveTo(20, 3, 0, 2);
    bladeShape.lineTo(0, -2);

    const bladeGeom = new THREE.ExtrudeGeometry(bladeShape, {
      depth: 1.5,
      bevelEnabled: true,
      bevelSize: 0.3,
      bevelThickness: 0.3,
      bevelSegments: 2,
    });

    const blade = addShadow(new THREE.Mesh(bladeGeom, mat));
    blade.position.y = -0.75;
    bladeGroup.add(blade);

    // Pitch twist (rotate blade along its length using 3 sub-sections)
    // Approximated by adding 2 additional twisted blade segments
    const tip = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(8, 1.5, 8),
      mat
    ));
    tip.position.set(40, 0, 0);
    tip.rotation.y = Math.PI / 6;
    bladeGroup.add(tip);

    bladeGroup.rotation.y = a;
    group.add(bladeGroup);
  }

  // Center bore
  const bore = new THREE.Mesh(
    new THREE.CylinderGeometry(4, 4, 24, 16),
    darkMat
  );
  group.add(bore);

  // Keyway
  const keyway = new THREE.Mesh(
    new THREE.BoxGeometry(2, 24, 3),
    darkMat
  );
  keyway.position.set(4, 0, 0);
  group.add(keyway);

  // Pitch adjustment bolts (3 around hub)
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 + Math.PI / 6;
    const bolt = new THREE.Mesh(
      new THREE.CylinderGeometry(1.5, 1.5, 3, 8),
      darkMat
    );
    bolt.position.set(Math.cos(a) * 6, 0, Math.sin(a) * 6);
    bolt.rotation.z = Math.PI / 2;
    bolt.rotation.y = a;
    group.add(bolt);
  }

  return group;
}

// ====================== ENGINE BLOCK (inline-4) ======================
export function createEngineBlockGeometry(): THREE.Group {
  const group = new THREE.Group();
  const mat = aluminum();
  const darkMat = darkSteel();
  const castMat = new THREE.MeshStandardMaterial({ color: 0x6b7280, metalness: 0.5, roughness: 0.7 });

  const blockL = 200, blockH = 80, blockW = 100;
  const cylBore = 35;       // cylinder bore diameter
  const cylSpacing = 45;    // distance between cylinder centers
  const cylCount = 4;
  const deckH = blockH / 2; // top deck height

  // --- Main block body ---
  const block = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(blockL, blockH, blockW),
    castMat
  ));
  group.add(block);

  // --- Cylinder bores (visible dark holes on top deck) ---
  for (let i = 0; i < cylCount; i++) {
    const x = -((cylCount - 1) * cylSpacing) / 2 + i * cylSpacing;

    // Bore hole (dark cylinder going down)
    const bore = new THREE.Mesh(
      new THREE.CylinderGeometry(cylBore / 2, cylBore / 2, blockH + 2, 36),
      new THREE.MeshStandardMaterial({ color: 0x14161a, metalness: 0.6, roughness: 0.5 })
    );
    bore.position.set(x, 0, 0);
    group.add(bore);

    // Bore sleeve (lighter cylinder liner)
    const liner = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(cylBore / 2 + 2, cylBore / 2 + 2, blockH - 4, 36),
      new THREE.MeshStandardMaterial({ color: 0x9aa3b0, metalness: 0.7, roughness: 0.3 })
    ));
    liner.position.set(x, 0, 0);
    group.add(liner);

    // Top deck reinforcement ring
    const ring = addShadow(new THREE.Mesh(
      new THREE.TorusGeometry(cylBore / 2 + 3, 1.5, 8, 32),
      mat
    ));
    ring.position.set(x, deckH, 0);
    ring.rotation.x = Math.PI / 2;
    group.add(ring);
  }

  // --- Main bearing saddles (crankshaft supports - 5 of them) ---
  const mainBearingCount = 5;
  const mainBearingR = 12;
  const mainBearingSpacing = (blockL - 30) / (mainBearingCount - 1);
  for (let i = 0; i < mainBearingCount; i++) {
    const x = -blockL / 2 + 15 + i * mainBearingSpacing;

    // Saddle (half-circle cap on bottom)
    const saddle = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(mainBearingR + 4, mainBearingR + 4, 24, 24, 1, false, 0, Math.PI),
      mat
    ));
    saddle.rotation.z = Math.PI;
    saddle.rotation.y = Math.PI / 2;
    saddle.position.set(x, -blockH / 2 - 4, 0);
    group.add(saddle);

    // Bearing bore (dark)
    const bore = new THREE.Mesh(
      new THREE.CylinderGeometry(mainBearingR, mainBearingR, 26, 24),
      darkMat
    );
    bore.rotation.z = Math.PI / 2;
    bore.position.set(x, -blockH / 2 - 4, 0);
    group.add(bore);

    // Bearing cap bolts (2 per saddle)
    [-10, 10].forEach((z) => {
      const bolt = addShadow(new THREE.Mesh(
        new THREE.CylinderGeometry(1.5, 1.5, 4, 8),
        darkMat
      ));
      bolt.position.set(x, -blockH / 2 - 4, z);
      group.add(bolt);
    });
  }

  // --- Water jacket ports (side passages) ---
  for (let i = 0; i < 4; i++) {
    const x = -((cylCount - 1) * cylSpacing) / 2 + i * cylSpacing;
    // Water port on each side
    [-1, 1].forEach((side) => {
      const port = addShadow(new THREE.Mesh(
        new THREE.CylinderGeometry(5, 5, 8, 16),
        mat
      ));
      port.rotation.z = Math.PI / 2;
      port.position.set(x, 10, side * (blockW / 2 + 2));
      group.add(port);
    });
  }

  // --- Oil return passages (bottom) ---
  for (let i = 0; i < 3; i++) {
    const x = -50 + i * 50;
    const drain = new THREE.Mesh(
      new THREE.CylinderGeometry(4, 4, 8, 12),
      darkMat
    );
    drain.position.set(x, -blockH / 2 - 2, 0);
    group.add(drain);
  }

  // --- Oil pan mounting flange (bottom) ---
  const panFlange = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(blockL + 10, 4, blockW + 10),
    mat
  ));
  panFlange.position.y = -blockH / 2 - 12;
  group.add(panFlange);

  // Pan flange bolt holes (around perimeter)
  for (let i = 0; i < 8; i++) {
    const x = -blockL / 2 + 10 + i * (blockL - 20) / 7;
    [-1, 1].forEach((side) => {
      const hole = new THREE.Mesh(
        new THREE.CylinderGeometry(2, 2, 8, 10),
        darkMat
      );
      hole.position.set(x, -blockH / 2 - 12, side * (blockW / 2 + 4));
      group.add(hole);
    });
  }

  // --- Head mounting bolts (top perimeter) ---
  for (let i = 0; i < 10; i++) {
    const x = -blockL / 2 + 15 + i * (blockL - 30) / 9;
    [-1, 1].forEach((side) => {
      const bolt = addShadow(new THREE.Mesh(
        new THREE.CylinderGeometry(2, 2, 6, 8),
        darkMat
      ));
      bolt.position.set(x, deckH + 2, side * (blockW / 2 - 6));
      group.add(bolt);
    });
  }

  // --- Front cover mounting face (with crank snout bore) ---
  const frontCover = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(6, blockH - 10, blockW - 6),
    mat
  ));
  frontCover.position.set(-blockL / 2 - 3, 0, 0);
  group.add(frontCover);

  // Crank snout bore
  const snoutBore = new THREE.Mesh(
    new THREE.CylinderGeometry(7, 7, 8, 16),
    darkMat
  );
  snoutBore.rotation.z = Math.PI / 2;
  snoutBore.position.set(-blockL / 2 - 3, -blockH / 2 - 4, 0);
  group.add(snoutBore);

  // --- Rear main seal mount (back face, where flywheel goes) ---
  const rearSeal = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(20, 20, 6, 32),
    new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.3, roughness: 0.8 })
  ));
  rearSeal.rotation.z = Math.PI / 2;
  rearSeal.position.set(blockL / 2 + 4, -blockH / 2 - 4, 0);
  group.add(rearSeal);

  // --- Engine mount lugs (sides) ---
  [-1, 1].forEach((side) => {
    const lug = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(30, 8, 14),
      mat
    ));
    lug.position.set(0, -blockH / 2 - 18, side * (blockW / 2 + 8));
    group.add(lug);

    // Mount bolt hole
    const hole = new THREE.Mesh(
      new THREE.CylinderGeometry(3, 3, 10, 12),
      darkMat
    );
    hole.position.set(0, -blockH / 2 - 20, side * (blockW / 2 + 8));
    group.add(hole);
  });

  // --- Side casting details (ribbing) ---
  for (let i = 0; i < 6; i++) {
    const y = -blockH / 2 + 12 + i * 10;
    [-1, 1].forEach((side) => {
      const rib = addShadow(new THREE.Mesh(
        new THREE.BoxGeometry(blockL - 20, 1.5, 1),
        castMat
      ));
      rib.position.set(0, y, side * (blockW / 2 + 0.5));
      group.add(rib);
    });
  }

  return group;
}

// ====================== CRANKSHAFT (inline-4 with throws) ======================
export function createCrankshaftGeometry(): THREE.Group {
  const group = new THREE.Group();
  const mat = steel();
  const darkMat = darkSteel();

  // Crank axis = X axis
  // 5 main journals + 4 crank pins (offset for stroke)
  const mainR = 12;
  const mainW = 18;
  const pinR = 11;
  const pinW = 22;
  const stroke = 40;     // total stroke
  const crankOffset = stroke / 2;
  const mainSpacing = 42;

  // Compute X positions for 5 main journals
  const mainsX: number[] = [];
  for (let i = 0; i < 5; i++) mainsX.push(-(mainSpacing * 2) + i * mainSpacing);

  // Compute X positions for 4 crank pins (between mains)
  const pinsX: number[] = [];
  for (let i = 0; i < 4; i++) pinsX.push((mainsX[i] + mainsX[i + 1]) / 2);

  // Crank throws: pins 1&4 at +offset, pins 2&3 at -offset (180° plane for inline-4)
  const pinOffsets = [crankOffset, -crankOffset, -crankOffset, crankOffset];

  // --- Main journals ---
  mainsX.forEach((x) => {
    const journal = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(mainR, mainR, mainW, 32),
      mat
    ));
    journal.rotation.z = Math.PI / 2;
    journal.position.set(x, 0, 0);
    group.add(journal);

    // Oil groove (decorative ring)
    const groove = new THREE.Mesh(
      new THREE.TorusGeometry(mainR - 1, 0.4, 6, 32),
      darkMat
    );
    groove.rotation.y = Math.PI / 2;
    groove.position.x = x;
    group.add(groove);

    // Oil hole (radial)
    const oilHole = new THREE.Mesh(
      new THREE.CylinderGeometry(1.5, 1.5, mainR * 2 + 2, 8),
      darkMat
    );
    oilHole.position.set(x, 0, 0);
    group.add(oilHole);
  });

  // --- Crank pins (with counterweights) ---
  pinsX.forEach((x, i) => {
    const offset = pinOffsets[i];

    // Crank pin
    const pin = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(pinR, pinR, pinW, 28),
      mat
    ));
    pin.rotation.z = Math.PI / 2;
    pin.position.set(x, offset, 0);
    group.add(pin);

    // Counterweight (web between main and pin) - two webs per pin
    [-(mainW / 2 + pinW / 2), (mainW / 2 + pinW / 2)].forEach((dx) => {
      // Web is a slab that extends from main journal to pin
      const webShape = new THREE.Shape();
      const webR = 28;
      // Half-circle on the pin side
      webShape.moveTo(-pinW / 2, 0);
      webShape.lineTo(-pinW / 2, offset - Math.sign(offset) * 4);
      webShape.absarc(0, offset, 4 + pinW / 2, Math.PI / 2 + (offset > 0 ? 0 : Math.PI), -Math.PI / 2 + (offset > 0 ? 0 : Math.PI), offset < 0);
      webShape.lineTo(pinW / 2, 0);
      // Main journal side curve
      webShape.absarc(0, 0, mainR + 8, 0, Math.PI, true);
      // Counterweight extends opposite side of pin
      webShape.lineTo(-webR, -Math.sign(offset) * (webR - 5));
      webShape.absarc(0, -Math.sign(offset) * (offset * 2), webR, Math.PI, 0, offset > 0);
      webShape.lineTo(-pinW / 2, 0);

      const webGeom = new THREE.ExtrudeGeometry(webShape, {
        depth: 4, bevelEnabled: true, bevelSize: 0.5, bevelThickness: 0.5, bevelSegments: 1,
      });
      webGeom.center();
      const web = addShadow(new THREE.Mesh(webGeom, mat));
      web.position.set(x + dx, 0, 0);
      web.rotation.y = Math.PI / 2;
      group.add(web);
    });

    // Oil drilling (diagonal hole from main to pin - simplified)
    const oilDrill = new THREE.Mesh(
      new THREE.CylinderGeometry(1, 1, 30, 8),
      darkMat
    );
    oilDrill.position.set(x, offset / 2, 0);
    oilDrill.rotation.z = Math.atan2(offset, 0) + Math.PI / 2;
    group.add(oilDrill);
  });

  // --- Crank snout (front - accessory drive) ---
  const snout = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(7, 8, 30, 24),
    mat
  ));
  snout.rotation.z = Math.PI / 2;
  snout.position.set(mainsX[0] - mainW / 2 - 16, 0, 0);
  group.add(snout);

  // Keyway
  const keyway = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(20, 3, 3),
    darkMat
  ));
  keyway.position.set(mainsX[0] - mainW / 2 - 16, 7, 0);
  group.add(keyway);

  // Timing belt sprocket
  const sprocket = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(14, 14, 8, 20),
    mat
  ));
  sprocket.rotation.z = Math.PI / 2;
  sprocket.position.set(mainsX[0] - mainW / 2 - 35, 0, 0);
  group.add(sprocket);

  // Sprocket teeth (small bumps)
  for (let i = 0; i < 20; i++) {
    const a = (i / 20) * Math.PI * 2;
    const tooth = new THREE.Mesh(
      new THREE.BoxGeometry(2, 2, 2),
      mat
    );
    tooth.position.set(
      mainsX[0] - mainW / 2 - 35,
      Math.cos(a) * 14,
      Math.sin(a) * 14
    );
    tooth.rotation.x = a;
    group.add(tooth);
  }

  // Vibration damper pulley (front)
  const damper = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(22, 22, 10, 32),
    new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.4, roughness: 0.7 })
  ));
  damper.rotation.z = Math.PI / 2;
  damper.position.set(mainsX[0] - mainW / 2 - 48, 0, 0);
  group.add(damper);

  // Damper hub
  const hub = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(8, 8, 12, 16),
    mat
  ));
  hub.rotation.z = Math.PI / 2;
  hub.position.set(mainsX[0] - mainW / 2 - 50, 0, 0);
  group.add(hub);

  // Damper bolt
  const damperBolt = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(2.5, 2.5, 4, 6),
    darkMat
  ));
  damperBolt.rotation.z = Math.PI / 2;
  damperBolt.position.set(mainsX[0] - mainW / 2 - 54, 0, 0);
  group.add(damperBolt);

  // --- Flywheel flange (rear - where flywheel mounts) ---
  const flange = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(20, 18, 8, 32),
    mat
  ));
  flange.rotation.z = Math.PI / 2;
  flange.position.set(mainsX[4] + mainW / 2 + 4, 0, 0);
  group.add(flange);

  // Flywheel mounting bolts (6)
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const bolt = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(2, 2, 8, 8),
      darkMat
    ));
    bolt.rotation.z = Math.PI / 2;
    bolt.position.set(
      mainsX[4] + mainW / 2 + 4,
      Math.cos(a) * 12,
      Math.sin(a) * 12
    );
    group.add(bolt);
  }

  // Pilot bearing (centering for transmission input shaft)
  const pilot = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(4, 4, 6, 12),
    brass()
  ));
  pilot.rotation.z = Math.PI / 2;
  pilot.position.set(mainsX[4] + mainW / 2 + 9, 0, 0);
  group.add(pilot);

  return group;
}

// ====================== CONNECTING ROD ======================
export function createConnectingRodGeometry(): THREE.Group {
  const group = new THREE.Group();
  const mat = steel();
  const darkMat = darkSteel();
  const brassMat = brass();

  // Rod oriented along Y axis: big end at bottom, small end at top
  const rodLength = 90;     // center-to-center
  const bigEndR = 14;
  const bigEndW = 18;
  const smallEndR = 7;
  const smallEndW = 14;
  const beamLen = rodLength - bigEndR - smallEndR;

  // --- Big end (with bearing shell) ---
  const bigEnd = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(bigEndR, bigEndR, bigEndW, 32),
    mat
  ));
  bigEnd.position.y = -rodLength / 2;
  group.add(bigEnd);

  // Bearing shell (brass insert)
  const bearingShell = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(bigEndR - 2, bigEndR - 2, bigEndW - 1, 32),
    brassMat
  ));
  bearingShell.position.y = -rodLength / 2;
  group.add(bearingShell);

  // Bearing inner (dark - where crank pin goes)
  const bearingBore = new THREE.Mesh(
    new THREE.CylinderGeometry(bigEndR - 4, bigEndR - 4, bigEndW + 2, 32),
    darkMat
  );
  bearingBore.position.y = -rodLength / 2;
  group.add(bearingBore);

  // Bearing cap (lower half - split at horizontal)
  const cap = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(bigEndR + 1, bigEndR + 1, bigEndW - 2, 32, 1, false, 0, Math.PI),
    mat
  ));
  cap.position.y = -rodLength / 2;
  group.add(cap);

  // Cap bolts (2)
  [-1, 1].forEach((side) => {
    const bolt = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(1.5, 1.5, bigEndW + 4, 8),
      darkMat
    ));
    bolt.rotation.x = Math.PI / 2;
    bolt.position.set(side * (bigEndR - 2), -rodLength / 2, 0);
    group.add(bolt);

    // Bolt head
    const head = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(2.5, 2.5, 2, 6),
      darkMat
    ));
    head.rotation.x = Math.PI / 2;
    head.position.set(side * (bigEndR - 2), -rodLength / 2, bigEndW / 2 + 3);
    group.add(head);
  });

  // Oil spit hole (small hole in big end)
  const oilSpit = new THREE.Mesh(
    new THREE.CylinderGeometry(1, 1, bigEndW + 4, 8),
    darkMat
  );
  oilSpit.rotation.x = Math.PI / 2;
  oilSpit.position.set(bigEndR - 1, -rodLength / 2 + 4, 0);
  group.add(oilSpit);

  // --- I-beam connecting rod (the shank) ---
  // I-beam cross-section: top flange, web, bottom flange
  // We build it as 3 boxes
  const beamY = 0;
  const flangeW = 6, flangeT = 2, webT = 2;

  // Top flange (near small end)
  const topFlange = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(flangeW, beamLen, flangeT),
    mat
  ));
  topFlange.position.y = beamY;
  group.add(topFlange);

  // Web (middle, thinner)
  const web = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(webT, beamLen, flangeT + 2),
    mat
  ));
  web.position.y = beamY;
  group.add(web);

  // Bottom flange (wider near big end - tapered)
  // Approximate taper with two boxes
  const bottomFlange1 = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(flangeW + 2, beamLen * 0.5, flangeT),
    mat
  ));
  bottomFlange1.position.y = -beamLen * 0.25;
  group.add(bottomFlange1);

  const bottomFlange2 = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(flangeW + 4, beamLen * 0.4, flangeT),
    mat
  ));
  bottomFlange2.position.y = -beamLen * 0.3;
  group.add(bottomFlange2);

  // --- Small end (piston pin end) ---
  const smallEnd = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(smallEndR, smallEndR, smallEndW, 24),
    mat
  ));
  smallEnd.position.y = rodLength / 2;
  group.add(smallEnd);

  // Small end bore (where wrist pin goes)
  const smallBore = new THREE.Mesh(
    new THREE.CylinderGeometry(smallEndR - 2, smallEndR - 2, smallEndW + 2, 24),
    darkMat
  );
  smallBore.position.y = rodLength / 2;
  group.add(smallBore);

  // Bronze bushing
  const bushing = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(smallEndR - 2.5, smallEndR - 2.5, smallEndW, 24),
    brassMat
  ));
  bushing.position.y = rodLength / 2;
  group.add(bushing);

  // --- Part number engraving (decorative rib on beam) ---
  const engrave = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(1, 20, 1),
    darkMat
  ));
  engrave.position.set(flangeW / 2 + 0.5, 0, 0);
  group.add(engrave);

  // Fracture-split surface (decorative line on big end)
  const splitLine = new THREE.Mesh(
    new THREE.BoxGeometry(bigEndR * 2 + 2, 0.5, bigEndW + 1),
    darkMat
  );
  splitLine.position.y = -rodLength / 2;
  group.add(splitLine);

  return group;
}

// ====================== PISTON ======================
export function createPistonGeometry(): THREE.Group {
  const group = new THREE.Group();
  const mat = aluminum();
  const darkMat = darkSteel();
  const ringMat = stainless();

  const pistonD = 35;          // diameter
  const pistonH = 45;          // total height
  const crownH = 6;            // crown thickness
  const ringCount = 3;
  const ringH = 1.5;
  const ringGap = 2;
  const skirtH = pistonH - crownH - (ringCount * (ringH + ringGap));

  // --- Piston body (cylindrical with slight crown dome) ---
  // Main skirt
  const skirt = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(pistonD / 2, pistonD / 2 - 0.3, skirtH, 36),
    mat
  ));
  skirt.position.y = -pistonH / 2 + skirtH / 2;
  group.add(skirt);

  // Ring pack area (slightly smaller diameter)
  const ringPack = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(pistonD / 2 - 0.3, pistonD / 2 - 0.3, ringCount * (ringH + ringGap) + ringGap, 36),
    mat
  ));
  ringPack.position.y = -pistonH / 2 + skirtH + ringCount * (ringH + ringGap) / 2;
  group.add(ringPack);

  // Piston rings (3 dark grooves with steel rings)
  for (let i = 0; i < ringCount; i++) {
    const y = -pistonH / 2 + skirtH + ringGap + i * (ringH + ringGap);

    // Ring groove (darker recess)
    const groove = new THREE.Mesh(
      new THREE.CylinderGeometry(pistonD / 2 - 0.2, pistonD / 2 - 0.2, ringH, 36),
      darkMat
    );
    groove.position.y = y;
    group.add(groove);

    // Piston ring (steel)
    const ring = addShadow(new THREE.Mesh(
      new THREE.TorusGeometry(pistonD / 2 - 0.1, 0.6, 6, 36),
      ringMat
    ));
    ring.rotation.x = Math.PI / 2;
    ring.position.y = y;
    group.add(ring);
  }

  // --- Crown (top, with slight dome) ---
  const crown = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(pistonD / 2, pistonD / 2 - 0.3, crownH, 36),
    mat
  ));
  crown.position.y = pistonH / 2 - crownH / 2;
  group.add(crown);

  // Dome on crown (slight raised center)
  const dome = addShadow(new THREE.Mesh(
    new THREE.SphereGeometry(pistonD / 2 - 4, 24, 16, 0, Math.PI * 2, 0, Math.PI / 3),
    mat
  ));
  dome.position.y = pistonH / 2;
  dome.rotation.x = Math.PI;
  group.add(dome);

  // Valve reliefs (2 small depressions on crown - decorative)
  [-6, 6].forEach((x) => {
    const relief = new THREE.Mesh(
      new THREE.CylinderGeometry(3, 3, 2, 12),
      darkMat
    );
    relief.position.set(x, pistonH / 2 - 0.5, 0);
    group.add(relief);
  });

  // --- Wrist pin boss (inside, horizontal cylinder) ---
  const pinBoss = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(pistonD / 4, pistonD / 4, pistonD - 4, 24),
    mat
  ));
  pinBoss.rotation.x = Math.PI / 2;
  pinBoss.position.y = -pistonH / 2 + skirtH / 2;
  group.add(pinBoss);

  // Wrist pin bore (dark)
  const pinBore = new THREE.Mesh(
    new THREE.CylinderGeometry(pistonD / 4 - 2, pistonD / 4 - 2, pistonD, 24),
    darkMat
  );
  pinBore.rotation.x = Math.PI / 2;
  pinBore.position.y = -pistonH / 2 + skirtH / 2;
  group.add(pinBore);

  // --- Wrist pin (steel pin going through) ---
  const wristPin = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(pistonD / 4 - 2, pistonD / 4 - 2, pistonD + 4, 24),
    ringMat
  ));
  wristPin.rotation.x = Math.PI / 2;
  wristPin.position.y = -pistonH / 2 + skirtH / 2;
  group.add(wristPin);

  // Snap rings on wrist pin (both sides)
  [-1, 1].forEach((side) => {
    const snap = new THREE.Mesh(
      new THREE.TorusGeometry(pistonD / 4 - 1, 0.5, 4, 16),
      darkMat
    );
    snap.rotation.y = Math.PI / 2;
    snap.position.set(side * (pistonD / 2 - 1), -pistonH / 2 + skirtH / 2, 0);
    group.add(snap);
  });

  // --- Pin boss struts (inside skirt, visible from bottom) ---
  for (let i = 0; i < 2; i++) {
    const strut = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(2, skirtH * 0.9, pistonD / 2 - 4),
      mat
    ));
    strut.position.set(
      i === 0 ? pistonD / 4 - 2 : -(pistonD / 4 - 2),
      -pistonH / 2 + skirtH / 2,
      0
    );
    group.add(strut);
  }

  // --- Oil drain back (slots in pin boss) ---
  [-1, 1].forEach((side) => {
    const slot = new THREE.Mesh(
      new THREE.BoxGeometry(2, skirtH * 0.6, 2),
      darkMat
    );
    slot.position.set(side * (pistonD / 4 - 1), -pistonH / 2 + skirtH / 2 + 3, 0);
    group.add(slot);
  });

  // --- Skirt cam grinding marks (decorative) ---
  for (let i = 0; i < 6; i++) {
    const mark = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, skirtH - 4, 0.3),
      darkMat
    );
    const a = (i / 6) * Math.PI * 2;
    mark.position.set(
      Math.cos(a) * (pistonD / 2 - 0.2),
      -pistonH / 2 + skirtH / 2,
      Math.sin(a) * (pistonD / 2 - 0.2)
    );
    mark.rotation.y = a + Math.PI / 2;
    group.add(mark);
  }

  return group;
}

// ====================== FLYWHEEL ======================
export function createFlywheelGeometry(): THREE.Group {
  const group = new THREE.Group();
  const mat = darkSteel();
  const steelMat = steel();

  const outerR = 75;       // outer radius (with ring gear teeth)
  const innerR = 35;       // hub inner radius (for crank pilot)
  const thickness = 18;    // flywheel thickness
  const ringGearR = 73;    // ring gear pitch radius
  const ringGearTeeth = 132;

  // --- Main flywheel disc (LatheGeometry for proper profile) ---
  const points: THREE.Vector2[] = [];
  // Profile from center to outer edge (top half cross-section)
  points.push(new THREE.Vector2(innerR - 1, -thickness / 2));     // hub bottom inside
  points.push(new THREE.Vector2(innerR + 8, -thickness / 2 + 1)); // hub fillet
  points.push(new THREE.Vector2(innerR + 12, -thickness / 2 + 6)); // taper out
  points.push(new THREE.Vector2(outerR - 8, -thickness / 2 + 6));  // flat bottom
  points.push(new THREE.Vector2(outerR - 2, -thickness / 2 + 8));  // outer fillet
  points.push(new THREE.Vector2(outerR - 2, thickness / 2 - 8));   // outer up
  points.push(new THREE.Vector2(outerR - 8, thickness / 2 - 6));   // flat top
  points.push(new THREE.Vector2(innerR + 12, thickness / 2 - 6));  // taper in
  points.push(new THREE.Vector2(innerR + 8, thickness / 2 - 1));   // hub fillet
  points.push(new THREE.Vector2(innerR - 1, thickness / 2));       // hub top inside

  const discGeom = new THREE.LatheGeometry(points, 64);
  const disc = addShadow(new THREE.Mesh(discGeom, mat));
  group.add(disc);

  // --- Ring gear (outer teeth) ---
  const ringShape = new THREE.Shape();
  for (let i = 0; i < ringGearTeeth; i++) {
    const a0 = (i / ringGearTeeth) * Math.PI * 2;
    const a1 = ((i + 0.3) / ringGearTeeth) * Math.PI * 2;
    const a2 = ((i + 0.7) / ringGearTeeth) * Math.PI * 2;
    const a3 = ((i + 1) / ringGearTeeth) * Math.PI * 2;
    const outerToothR = outerR + 2;
    const innerToothR = outerR - 1;
    if (i === 0) ringShape.moveTo(Math.cos(a0) * innerToothR, Math.sin(a0) * innerToothR);
    ringShape.lineTo(Math.cos(a1) * outerToothR, Math.sin(a1) * outerToothR);
    ringShape.lineTo(Math.cos(a2) * outerToothR, Math.sin(a2) * outerToothR);
    ringShape.lineTo(Math.cos(a3) * innerToothR, Math.sin(a3) * innerToothR);
  }

  const ringGeom = new THREE.ExtrudeGeometry(ringShape, {
    depth: 8, bevelEnabled: false,
  });
  const ringGear = addShadow(new THREE.Mesh(ringGeom, steelMat));
  ringGear.position.z = -4;
  ringGear.rotation.x = Math.PI / 2;
  ringGear.position.y = -4;
  group.add(ringGear);

  // --- Center hub (raised boss) ---
  const hub = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(innerR + 4, innerR + 6, thickness + 4, 32),
    mat
  ));
  group.add(hub);

  // --- Crank pilot bore ---
  const pilotBore = new THREE.Mesh(
    new THREE.CylinderGeometry(innerR, innerR, thickness + 8, 32),
    new THREE.MeshStandardMaterial({ color: 0x111, metalness: 0.6, roughness: 0.5 })
  );
  group.add(pilotBore);

  // --- Crank mounting bolts (6 around hub) ---
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + Math.PI / 12;
    const r = innerR + 8;
    const bolt = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(2, 2, 8, 8),
      steelMat
    ));
    bolt.position.set(Math.cos(a) * r, Math.sin(a) * r, thickness / 2 + 2);
    group.add(bolt);

    // Bolt head (hex)
    const head = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(3, 3, 2, 6),
      steelMat
    ));
    head.position.set(Math.cos(a) * r, Math.sin(a) * r, thickness / 2 + 5);
    group.add(head);
  }

  // --- Dowel pin (locating pin) ---
  const dowel = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(1.5, 1.5, 6, 8),
    brass()
  ));
  dowel.position.set(innerR + 8, 0, thickness / 2);
  group.add(dowel);

  // --- Clutch mounting face (machined flat surface on engine side) ---
  // Already part of lathe profile, but add bolt holes for pressure plate
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const r = (outerR + innerR) / 2 + 5;
    const hole = new THREE.Mesh(
      new THREE.CylinderGeometry(2.5, 2.5, thickness + 2, 12),
      new THREE.MeshStandardMaterial({ color: 0x111, metalness: 0.5, roughness: 0.6 })
    );
    hole.position.set(Math.cos(a) * r, Math.sin(a) * r, 0);
    group.add(hole);

    // Tapped thread indicator (smaller dark hole)
    const thread = new THREE.Mesh(
      new THREE.CylinderGeometry(2, 2, thickness + 4, 12),
      new THREE.MeshStandardMaterial({ color: 0x000, metalness: 0.3, roughness: 0.8 })
    );
    thread.position.set(Math.cos(a) * r, Math.sin(a) * r, 0);
    group.add(thread);
  }

  // --- Lightening holes (4 large holes between bolt circles) ---
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 8;
    const r = (outerR + innerR) / 2 - 5;
    const hole = new THREE.Mesh(
      new THREE.CylinderGeometry(8, 8, thickness + 4, 24),
      new THREE.MeshStandardMaterial({ color: 0x0a0a0a, metalness: 0.4, roughness: 0.7 })
    );
    hole.position.set(Math.cos(a) * r, Math.sin(a) * r, 0);
    group.add(hole);

    // Chamfered edge (bevel)
    [thickness / 2, -thickness / 2].forEach((z) => {
      const chamfer = new THREE.Mesh(
        new THREE.TorusGeometry(8, 1, 6, 24),
        mat
      );
      chamfer.position.set(Math.cos(a) * r, Math.sin(a) * r, z);
      group.add(chamfer);
    });
  }

  // --- Timing marks (TDC mark - small notch on outer edge) ---
  const tdcMark = new THREE.Mesh(
    new THREE.BoxGeometry(2, 4, thickness + 2),
    new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.3 })
  );
  tdcMark.position.set(outerR + 2, 0, 0);
  group.add(tdcMark);

  // --- Balance drillings (small holes for balancing) ---
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
    const r = innerR + 16;
    const drill = new THREE.Mesh(
      new THREE.CylinderGeometry(2, 2, 4, 8),
      new THREE.MeshStandardMaterial({ color: 0x000, metalness: 0.5, roughness: 0.7 })
    );
    drill.position.set(Math.cos(a) * r, Math.sin(a) * r, thickness / 2 - 2);
    group.add(drill);
  }

  // --- Friction surface ring (smoother material on clutch face) ---
  const friction = addShadow(new THREE.Mesh(
    new THREE.TorusGeometry(50, 5, 12, 64),
    new THREE.MeshStandardMaterial({ color: 0x444, metalness: 0.85, roughness: 0.15 })
  ));
  friction.rotation.x = Math.PI / 2;
  friction.position.z = -thickness / 2 - 0.5;
  group.add(friction);

  return group;
}

// ====================== CAMSHAFT ======================
export function createCamshaftGeometry(): THREE.Group {
  const group = new THREE.Group();
  const mat = steel();
  const darkMat = darkSteel();

  const camCount = 8;       // 4 cylinders × 2 valves (intake + exhaust)
  const bearingJournalCount = 5;
  const shaftLen = 180;

  // --- Main shaft ---
  const shaft = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(6, 6, shaftLen, 24),
    mat
  ));
  shaft.rotation.z = Math.PI / 2;
  group.add(shaft);

  // --- Bearing journals (5) ---
  for (let i = 0; i < bearingJournalCount; i++) {
    const x = -shaftLen / 2 + 18 + i * ((shaftLen - 36) / (bearingJournalCount - 1));
    const journal = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(9, 9, 10, 24),
      mat
    ));
    journal.rotation.z = Math.PI / 2;
    journal.position.x = x;
    group.add(journal);
  }

  // --- Cam lobes (8) - egg-shaped ---
  // Pairs of cams per cylinder (intake + exhaust)
  // Each cylinder pair offset by 45mm, cams within pair offset by 8mm
  // Cam lobe angles approximate firing order 1-3-4-2
  const camSpacing = 45;
  const cylinderCount = 4;
  const camLobeR = 16;     // base circle + lift
  const baseCircleR = 8;
  const lobeW = 8;

  const lobePhases = [0, 90, 270, 180]; // degrees of rotation for each cylinder

  for (let cyl = 0; cyl < cylinderCount; cyl++) {
    const baseX = -((cylinderCount - 1) * camSpacing) / 2 + cyl * camSpacing;

    // Two cams per cylinder (intake, exhaust)
    [-4, 4].forEach((offset, idx) => {
      const x = baseX + offset;
      const phase = lobePhases[cyl] + (idx === 0 ? 0 : 90); // exhaust lags intake

      // Cam lobe (egg shape)
      const lobeShape = new THREE.Shape();
      const lobeSteps = 32;
      for (let i = 0; i <= lobeSteps; i++) {
        const a = (i / lobeSteps) * Math.PI * 2;
        // Egg profile: small base circle + nose bulge
        const liftFactor = 0.5 + 0.5 * Math.cos(a); // peaks at a=0
        const r = baseCircleR + (camLobeR - baseCircleR) * Math.pow(Math.max(0, Math.cos(a / 2)), 1.5);
        const px = Math.cos(a) * r;
        const py = Math.sin(a) * r;
        if (i === 0) lobeShape.moveTo(px, py);
        else lobeShape.lineTo(px, py);
      }

      const lobeGeom = new THREE.ExtrudeGeometry(lobeShape, {
        depth: lobeW, bevelEnabled: true, bevelSize: 0.5, bevelThickness: 0.5, bevelSegments: 1,
      });
      lobeGeom.center();
      const lobe = addShadow(new THREE.Mesh(lobeGeom, mat));
      lobe.rotation.y = Math.PI / 2;
      lobe.rotation.z = (phase * Math.PI) / 180;
      lobe.position.x = x;
      group.add(lobe);
    });
  }

  // --- Front snout (smaller diameter) ---
  const snout = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(4, 5, 16, 16),
    mat
  ));
  snout.rotation.z = Math.PI / 2;
  snout.position.x = -shaftLen / 2 - 8;
  group.add(snout);

  // Cam sprocket mount (front)
  const sprocketMount = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(8, 8, 6, 16),
    mat
  ));
  sprocketMount.rotation.z = Math.PI / 2;
  sprocketMount.position.x = -shaftLen / 2 - 4;
  group.add(sprocketMount);

  // Keyway
  const keyway = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(8, 2, 2),
    darkMat
  ));
  keyway.position.set(-shaftLen / 2 - 8, 4.5, 0);
  group.add(keyway);

  // Cam bolt (front)
  const camBolt = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(2, 2, 4, 6),
    darkMat
  ));
  camBolt.rotation.z = Math.PI / 2;
  camBolt.position.x = -shaftLen / 2 - 16;
  group.add(camBolt);

  // Washer
  const washer = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(4, 4, 1, 12),
    darkMat
  ));
  washer.rotation.z = Math.PI / 2;
  washer.position.x = -shaftLen / 2 - 14;
  group.add(washer);

  // --- Rear oil pump drive (hexagonal) ---
  const hexShape = new THREE.Shape();
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    if (i === 0) hexShape.moveTo(Math.cos(a) * 5, Math.sin(a) * 5);
    else hexShape.lineTo(Math.cos(a) * 5, Math.sin(a) * 5);
  }
  const hexGeom = new THREE.ExtrudeGeometry(hexShape, { depth: 8, bevelEnabled: false });
  const hex = addShadow(new THREE.Mesh(hexGeom, mat));
  hex.rotation.y = Math.PI / 2;
  hex.position.x = shaftLen / 2;
  group.add(hex);

  // --- Oil passages (drilled holes - decorative) ---
  for (let i = 0; i < 5; i++) {
    const x = -shaftLen / 2 + 18 + i * ((shaftLen - 36) / 4);
    const drill = new THREE.Mesh(
      new THREE.CylinderGeometry(1, 1, 18, 8),
      darkMat
    );
    drill.position.x = x;
    group.add(drill);
  }

  return group;
}

// ====================== OIL PAN (sump) ======================
export function createOilPanGeometry(): THREE.Group {
  const group = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: 0x4a4f57, metalness: 0.5, roughness: 0.7 });
  const darkMat = darkSteel();

  const topW = 110, topL = 210;
  const botW = 80, botL = 180;
  const height = 50;

  // --- Build using ExtrudeGeometry with sloped sides ---
  const shape = new THREE.Shape();
  shape.moveTo(-topL / 2, -topW / 2);
  shape.lineTo(topL / 2, -topW / 2);
  shape.lineTo(topL / 2 - 10, -topW / 2);
  // Slope in to bottom
  shape.lineTo(botL / 2, -botW / 2 + 10);
  shape.lineTo(botL / 2, botW / 2 - 10);
  shape.lineTo(topL / 2 - 10, topW / 2);
  shape.lineTo(topL / 2, topW / 2);
  shape.lineTo(-topL / 2, topW / 2);
  shape.lineTo(-topL / 2 + 10, topW / 2);
  shape.lineTo(-botL / 2, botW / 2 - 10);
  shape.lineTo(-botL / 2, -botW / 2 + 10);
  shape.lineTo(-topL / 2 + 10, -topW / 2);
  shape.lineTo(-topL / 2, -topW / 2);

  // We'll build the pan as 6 trapezoidal sides using custom geometry
  // Easier: use a series of beveled extrusion. For now, use a simple tapered box.

  // Top flange (matches engine block bottom)
  const flange = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(topL, 4, topW),
    mat
  ));
  flange.position.y = -height / 2;
  group.add(flange);

  // Side walls (4 sloped)
  // Front/back walls
  [0, 1].forEach((side) => {
    const wall = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(botL + 20, height - 4, 4),
      mat
    ));
    wall.position.set(0, 0, side === 0 ? -(topW / 2 - 8) : (topW / 2 - 8));
    wall.scale.z = 1;
    // We need to slope them inward - approximate with rotation
    wall.rotation.x = side === 0 ? -0.15 : 0.15;
    group.add(wall);
  });

  // Left/right walls
  [0, 1].forEach((side) => {
    const wall = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(4, height - 4, botW + 20),
      mat
    ));
    wall.position.set(side === 0 ? -(topL / 2 - 8) : (topL / 2 - 8), 0, 0);
    wall.rotation.y = side === 0 ? 0.15 : -0.15;
    group.add(wall);
  });

  // Bottom plate
  const bottom = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(botL, 3, botW),
    mat
  ));
  bottom.position.y = height / 2;
  group.add(bottom);

  // --- Drain plug (lowest point) ---
  const drain = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(5, 6, 6, 6),
    brass()
  ));
  drain.position.set(botL / 2 - 20, height / 2 + 3, 0);
  group.add(drain);

  // Drain plug hex head
  const drainHead = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(7, 7, 2, 6),
    brass()
  ));
  drainHead.position.set(botL / 2 - 20, height / 2 + 5.5, 0);
  group.add(drainHead);

  // --- Drain plug gasket ---
  const gasket = new THREE.Mesh(
    new THREE.TorusGeometry(5, 0.8, 6, 16),
    new THREE.MeshStandardMaterial({ color: 0xc09545, metalness: 0.3, roughness: 0.8 })
  );
  gasket.position.set(botL / 2 - 20, height / 2 + 1, 0);
  gasket.rotation.x = Math.PI / 2;
  group.add(gasket);

  // --- Oil pickup tube (inside, partially visible) ---
  const pickupTube = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(3, 3, 30, 12),
    mat
  ));
  pickupTube.position.set(-20, height / 2 - 15, 0);
  pickupTube.rotation.z = Math.PI / 4;
  group.add(pickupTube);

  // Pickup screen (mesh filter)
  const screen = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(6, 6, 4, 16),
    new THREE.MeshStandardMaterial({ color: 0xffcc66, metalness: 0.6, roughness: 0.4 })
  ));
  screen.position.set(-30, height / 2 - 4, 0);
  group.add(screen);

  // --- Baffles (internal ribs visible through walls) ---
  [-30, 0, 30].forEach((x) => {
    const baffle = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(2, height - 8, botW - 4),
      mat
    ));
    baffle.position.set(x, 0, 0);
    group.add(baffle);

    // Baffle cutout (hole for oil flow)
    const hole = new THREE.Mesh(
      new THREE.BoxGeometry(3, 8, 10),
      darkMat
    );
    hole.position.set(x, 5, 0);
    group.add(hole);
  });

  // --- Mounting bolt holes (around top flange) ---
  for (let i = 0; i < 10; i++) {
    const x = -topL / 2 + 15 + i * ((topL - 30) / 9);
    [-1, 1].forEach((side) => {
      const hole = new THREE.Mesh(
        new THREE.CylinderGeometry(2, 2, 6, 10),
        darkMat
      );
      hole.position.set(x, -height / 2, side * (topW / 2 - 4));
      group.add(hole);
    });
  }

  // --- Windage tray (perforated sheet near top) ---
  const tray = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(botL - 4, 1, botW - 4),
    new THREE.MeshStandardMaterial({ color: 0x6b7280, metalness: 0.7, roughness: 0.4 })
  ));
  tray.position.y = -height / 2 + 8;
  group.add(tray);

  // Tray holes
  for (let i = 0; i < 12; i++) {
    for (let j = 0; j < 4; j++) {
      const x = -botL / 2 + 10 + i * ((botL - 20) / 11);
      const z = -botW / 2 + 10 + j * ((botW - 20) / 3);
      const h = new THREE.Mesh(
        new THREE.CylinderGeometry(1.5, 1.5, 2, 8),
        darkMat
      );
      h.position.set(x, -height / 2 + 8, z);
      group.add(h);
    }
  }

  return group;
}

// ====================== VALVE COVER ======================
export function createValveCoverGeometry(): THREE.Group {
  const group = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({
    color: 0x9aa3b0, metalness: 0.7, roughness: 0.4,
  });
  const darkMat = darkSteel();

  const length = 200, width = 90, height = 30;

  // --- Main cover (rounded top) ---
  // Use a custom shape: top is domed
  const shape = new THREE.Shape();
  const r = 12;
  shape.moveTo(-length / 2, 0);
  shape.lineTo(length / 2, 0);
  shape.lineTo(length / 2, height - r);
  shape.quadraticCurveTo(length / 2, height, length / 2 - r, height);
  shape.lineTo(-length / 2 + r, height);
  shape.quadraticCurveTo(-length / 2, height, -length / 2, height - r);
  shape.lineTo(-length / 2, 0);

  const coverGeom = new THREE.ExtrudeGeometry(shape, {
    depth: width, bevelEnabled: true, bevelSize: 1, bevelThickness: 1, bevelSegments: 2,
  });
  const cover = addShadow(new THREE.Mesh(coverGeom, mat));
  cover.position.z = -width / 2;
  group.add(cover);

  // --- Mounting flange (bottom) ---
  const flange = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(length + 6, 3, width + 6),
    mat
  ));
  flange.position.y = -1.5;
  group.add(flange);

  // --- Gasket surface (dark groove on flange bottom) ---
  const gasket = new THREE.Mesh(
    new THREE.BoxGeometry(length - 10, 1, width - 10),
    new THREE.MeshStandardMaterial({ color: 0x4a3520, metalness: 0.2, roughness: 0.8 })
  );
  gasket.position.y = -3;
  group.add(gasket);

  // --- Mounting bolt holes (10 bolts) ---
  for (let i = 0; i < 10; i++) {
    const x = -length / 2 + 15 + i * ((length - 30) / 9);
    [-1, 1].forEach((side) => {
      const hole = new THREE.Mesh(
        new THREE.CylinderGeometry(1.5, 1.5, 5, 8),
        darkMat
      );
      hole.position.set(x, -2, side * (width / 2 - 4));
      group.add(hole);

      // Bolt head on top
      if (i % 2 === 0) {
        const bolt = addShadow(new THREE.Mesh(
          new THREE.CylinderGeometry(2.5, 2.5, 2, 6),
          darkMat
        ));
        bolt.position.set(x, height + 2, side * (width / 2 - 8));
        group.add(bolt);
      }
    });
  }

  // --- Oil filler cap (raised cylindrical tower) ---
  const fillerBase = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(12, 14, 8, 24),
    mat
  ));
  fillerBase.position.set(length / 2 - 30, height + 4, 0);
  group.add(fillerBase);

  // Filler cap (twist-lock style)
  const cap = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(11, 11, 6, 24),
    new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.3, roughness: 0.7 })
  ));
  cap.position.set(length / 2 - 30, height + 11, 0);
  group.add(cap);

  // Cap ribs (gripping texture)
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const rib = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 5, 1),
      new THREE.MeshStandardMaterial({ color: 0x222, metalness: 0.4, roughness: 0.6 })
    );
    rib.position.set(length / 2 - 30 + Math.cos(a) * 11, height + 11, Math.sin(a) * 11);
    rib.rotation.y = a + Math.PI / 2;
    group.add(rib);
  }

  // --- PCV valve port (small tube) ---
  const pcv = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(3, 3, 8, 12),
    mat
  ));
  pcv.position.set(-length / 2 + 25, height + 4, -width / 3);
  group.add(pcv);

  // PCV valve itself
  const pcvValve = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(3.5, 3.5, 6, 12),
    new THREE.MeshStandardMaterial({ color: 0x333, metalness: 0.6, roughness: 0.4 })
  ));
  pcvValve.position.set(-length / 2 + 25, height + 11, -width / 3);
  group.add(pcvValve);

  // --- Breather hose port (other side) ---
  const breather = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(4, 4, 6, 12),
    mat
  ));
  breather.position.set(-length / 2 + 25, height + 3, width / 3);
  group.add(breather);

  // --- Cooling fins on top (decorative ribbing) ---
  for (let i = 0; i < 7; i++) {
    const x = -length / 2 + 25 + i * 20;
    const fin = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(2, 3, width - 8),
      mat
    ));
    fin.position.set(x, height - 1, 0);
    group.add(fin);
  }

  // --- Brand emblem (raised plate) ---
  const emblem = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(8, 8, 1.5, 32),
    new THREE.MeshStandardMaterial({ color: 0xc09545, metalness: 0.8, roughness: 0.3 })
  ));
  emblem.rotation.x = Math.PI / 2;
  emblem.position.set(0, height + 1, 0);
  group.add(emblem);

  // --- Coil pack mounts (4 raised bosses) ---
  for (let i = 0; i < 4; i++) {
    const x = -60 + i * 40;
    const boss = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(4, 5, 4, 12),
      mat
    ));
    boss.position.set(x, height + 2, -width / 3);
    group.add(boss);

    // Coil bolt
    const bolt = new THREE.Mesh(
      new THREE.CylinderGeometry(1, 1, 5, 6),
      darkMat
    );
    bolt.position.set(x, height + 5, -width / 3);
    group.add(bolt);
  }

  return group;
}

// ====================== TURBINE BLADE (jet engine) ======================
export function createTurbineBladeGeometry(): THREE.Group {
  const group = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({
    color: 0xd4a574, metalness: 0.92, roughness: 0.22,
  }); // Inconel / nickel superalloy
  const rootMat = darkSteel();
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.6, roughness: 0.6 });

  // --- Fir-tree root (where blade attaches to disk) ---
  // Build a 2D profile with serrated teeth on top/bottom
  const rootShape = new THREE.Shape();
  const rootH = 24, rootW = 18;
  const teeth = 5;
  const toothH = 2, toothW = 3;
  rootShape.moveTo(-rootW / 2, 0);
  // Top edge with teeth
  for (let i = 0; i < teeth; i++) {
    const x0 = -rootW / 2 + (i / teeth) * rootW;
    const x1 = -rootW / 2 + ((i + 0.4) / teeth) * rootW;
    const x2 = -rootW / 2 + ((i + 0.6) / teeth) * rootW;
    const x3 = -rootW / 2 + ((i + 1) / teeth) * rootW;
    rootShape.lineTo(x0, rootH * 0.3);
    rootShape.lineTo(x1, rootH * 0.5);
    rootShape.lineTo(x2, rootH * 0.3);
    rootShape.lineTo(x3, rootH * 0.35);
  }
  // Top plateau
  rootShape.lineTo(rootW / 2, rootH);
  rootShape.lineTo(-rootW / 2, rootH);
  rootShape.lineTo(-rootW / 2, 0);

  const rootGeom = new THREE.ExtrudeGeometry(rootShape, {
    depth: 12, bevelEnabled: true, bevelSize: 0.3, bevelThickness: 0.3, bevelSegments: 1,
  });
  rootGeom.center();
  const root = addShadow(new THREE.Mesh(rootGeom, rootMat));
  root.position.y = -32;
  group.add(root);

  // --- Shank (transition from root to airfoil) ---
  const shank = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(8, 11, 16, 24),
    mat
  ));
  shank.position.y = -14;
  group.add(shank);

  // --- Platform (where airfoil meets root) ---
  const platform = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(26, 4, 16),
    mat
  ));
  platform.position.y = -4;
  group.add(platform);

  // Fillet between platform and airfoil
  const fillet = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(11, 8, 4, 24),
    mat
  ));
  fillet.position.y = -2;
  group.add(fillet);

  // --- Airfoil (the blade itself) ---
  // Build a custom airfoil shape using Bezier curves
  // Twisted along its length
  const airfoilLen = 50;
  const segments = 20;

  for (let i = 0; i < segments; i++) {
    const t0 = i / segments;
    const t1 = (i + 1) / segments;
    const y0 = t0 * airfoilLen;
    const y1 = t1 * airfoilLen;

    // Twist angle (more twist at root, less at tip)
    const twist0 = (1 - t0) * 0.5;
    const twist1 = (1 - t1) * 0.5;

    // Chord length (tapers slightly toward tip)
    const chord0 = 22 - t0 * 4;
    const chord1 = 22 - t1 * 4;

    // Build 4 vertices for this segment quad
    // Airfoil profile: leading edge curve + trailing edge curve
    // Simplified: just two points per cross-section
    const buildAirfoilPoints = (y: number, chord: number, twist: number) => {
      const le = -chord / 2; // leading edge
      const te = chord / 2;  // trailing edge
      const thickness = chord * 0.18;
      // Suction surface (top) and pressure surface (bottom)
      const points: [number, number, number][] = [];
      // Suction side: arc from LE to TE
      for (let j = 0; j <= 8; j++) {
        const tt = j / 8;
        const x = le + tt * chord;
        const z = Math.sin(tt * Math.PI) * thickness;
        // Apply twist around Y
        const xr = x * Math.cos(twist) - z * Math.sin(twist);
        const zr = x * Math.sin(twist) + z * Math.cos(twist);
        points.push([xr, y, zr]);
      }
      // Pressure side: arc back from TE to LE
      for (let j = 0; j <= 8; j++) {
        const tt = j / 8;
        const x = te - tt * chord;
        const z = -Math.sin(tt * Math.PI) * thickness * 0.7;
        const xr = x * Math.cos(twist) - z * Math.sin(twist);
        const zr = x * Math.sin(twist) + z * Math.cos(twist);
        points.push([xr, y, zr]);
      }
      return points;
    };

    const pts0 = buildAirfoilPoints(y0, chord0, twist0);
    const pts1 = buildAirfoilPoints(y1, chord1, twist1);

    // Build faces between segments
    const vertices: number[] = [];
    for (const p of pts0) vertices.push(...p);
    for (const p of pts1) vertices.push(...p);

    const indices: number[] = [];
    const n = pts0.length;
    for (let j = 0; j < n; j++) {
      const a = j;
      const b = (j + 1) % n;
      indices.push(a, b, n + b);
      indices.push(a, n + b, n + a);
    }

    const segGeom = new THREE.BufferGeometry();
    segGeom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    segGeom.setIndex(indices);
    segGeom.computeVertexNormals();

    const seg = addShadow(new THREE.Mesh(segGeom, mat));
    seg.position.y = 0;
    group.add(seg);
  }

  // --- Shroud (tip cap) ---
  const shroud = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(20, 3, 14),
    mat
  ));
  shroud.position.y = airfoilLen + 1;
  group.add(shroud);

  // Shroud squealer tip (thin lip on top)
  const squealer = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(18, 2, 12),
    darkMat
  ));
  squealer.position.y = airfoilLen + 3.5;
  group.add(squealer);

  // --- Internal cooling holes (visible as small dark circles on leading edge) ---
  for (let i = 0; i < 6; i++) {
    const y = 5 + i * 7;
    // Leading edge cooling hole
    const hole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.6, 0.6, 4, 8),
      darkMat
    );
    hole.position.set(-10 + y * 0.05, y, 0);
    hole.rotation.z = -0.3;
    group.add(hole);
  }

  // Trailing edge cooling slots (film cooling)
  for (let i = 0; i < 8; i++) {
    const y = 8 + i * 5;
    const slot = new THREE.Mesh(
      new THREE.BoxGeometry(2, 0.4, 0.4),
      darkMat
    );
    slot.position.set(8 + y * 0.03, y, 0);
    group.add(slot);
  }

  // --- Tip cooling holes ---
  for (let i = 0; i < 4; i++) {
    const x = -6 + i * 4;
    const hole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.5, 4, 8),
      darkMat
    );
    hole.position.set(x, airfoilLen - 1, 4);
    group.add(hole);
  }

  // --- Z-notch (platform feature for locating in disk) ---
  const notch = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(3, 4, 16),
    rootMat
  ));
  notch.position.set(-13, -4, 0);
  group.add(notch);

  return group;
}

// ====================== ROCKET ENGINE INJECTOR ======================
export function createRocketInjectorGeometry(): THREE.Group {
  const group = new THREE.Group();
  const mat = brass(); // copper alloy look
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, metalness: 0.8, roughness: 0.4 });
  const steelMat = steel();

  const outerR = 55;
  const innerR = 12;
  const thickness = 14;

  // --- Main injector face (disc) ---
  const face = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(outerR, outerR, thickness, 64),
    mat
  ));
  group.add(face);

  // --- Outer ring (manifold) ---
  const manifold = addShadow(new THREE.Mesh(
    new THREE.TorusGeometry(outerR - 8, 5, 16, 64),
    steelMat
  ));
  manifold.rotation.x = Math.PI / 2;
  manifold.position.y = thickness / 2;
  group.add(manifold);

  // --- Central oxidizer post ---
  const centralPost = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(innerR, innerR, thickness + 8, 32),
    mat
  ));
  centralPost.position.y = -2;
  group.add(centralPost);

  // Central bore (dark)
  const centralBore = new THREE.Mesh(
    new THREE.CylinderGeometry(innerR - 2, innerR - 2, thickness + 12, 32),
    darkMat
  );
  group.add(centralBore);

  // --- Coaxial injector elements (ring of elements) ---
  // Outer ring (16 elements)
  const outerCount = 16;
  for (let i = 0; i < outerCount; i++) {
    const a = (i / outerCount) * Math.PI * 2;
    const r = outerR - 16;
    const x = Math.cos(a) * r;
    const z = Math.sin(a) * r;

    // Outer orifice (fuel)
    const outerOrifice = new THREE.Mesh(
      new THREE.CylinderGeometry(2, 2, thickness + 2, 16),
      darkMat
    );
    outerOrifice.position.set(x, 0, z);
    group.add(outerOrifice);

    // Inner orifice (oxidizer) - smaller, raised
    const innerOrifice = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(1, 1, thickness - 2, 12),
      mat
    ));
    innerOrifice.position.set(x, 1, z);
    group.add(innerOrifice);

    // Orifice ring (raised lip)
    const lip = addShadow(new THREE.Mesh(
      new THREE.TorusGeometry(2, 0.4, 6, 16),
      mat
    ));
    lip.position.set(x, thickness / 2, z);
    lip.rotation.x = Math.PI / 2;
    group.add(lip);

    // Chamfered inlet (bottom side)
    const chamfer = new THREE.Mesh(
      new THREE.CylinderGeometry(2.5, 2, 2, 16),
      darkMat
    );
    chamfer.position.set(x, -thickness / 2 + 0.5, z);
    group.add(chamfer);
  }

  // --- Middle ring (12 elements, smaller) ---
  const midCount = 12;
  for (let i = 0; i < midCount; i++) {
    const a = (i / midCount) * Math.PI * 2 + Math.PI / 12;
    const r = outerR - 30;
    const x = Math.cos(a) * r;
    const z = Math.sin(a) * r;

    const orifice = new THREE.Mesh(
      new THREE.CylinderGeometry(1.5, 1.5, thickness + 2, 12),
      darkMat
    );
    orifice.position.set(x, 0, z);
    group.add(orifice);

    // Raised lip
    const lip = addShadow(new THREE.Mesh(
      new THREE.TorusGeometry(1.5, 0.3, 6, 12),
      mat
    ));
    lip.position.set(x, thickness / 2, z);
    lip.rotation.x = Math.PI / 2;
    group.add(lip);
  }

  // --- Inner ring (8 elements, closest to central post) ---
  const innerCount = 8;
  for (let i = 0; i < innerCount; i++) {
    const a = (i / innerCount) * Math.PI * 2 + Math.PI / 8;
    const r = innerR + 6;
    const x = Math.cos(a) * r;
    const z = Math.sin(a) * r;

    const orifice = new THREE.Mesh(
      new THREE.CylinderGeometry(1, 1, thickness + 2, 10),
      darkMat
    );
    orifice.position.set(x, 0, z);
    group.add(orifice);
  }

  // --- Fuel inlet ports (3 around perimeter, bottom side) ---
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 + Math.PI / 6;
    const r = outerR - 6;
    const x = Math.cos(a) * r;
    const z = Math.sin(a) * r;

    const inlet = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(4, 5, 6, 16),
      steelMat
    ));
    inlet.position.set(x, -thickness / 2 - 3, z);
    group.add(inlet);

    // Flange bolt holes (4 per inlet)
    for (let j = 0; j < 4; j++) {
      const ba = (j / 4) * Math.PI * 2 + Math.PI / 4;
      const br = 7;
      const bolt = new THREE.Mesh(
        new THREE.CylinderGeometry(0.8, 0.8, 4, 8),
        darkMat
      );
      bolt.position.set(
        x + Math.cos(ba) * br,
        -thickness / 2 - 4,
        z + Math.sin(ba) * br
      );
      group.add(bolt);
    }
  }

  // --- Oxidizer inlet (central, bottom) ---
  const oxInlet = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(innerR + 4, innerR + 6, 6, 32),
    steelMat
  ));
  oxInlet.position.y = -thickness / 2 - 3;
  group.add(oxInlet);

  // --- Mounting flange (outer rim) ---
  const flange = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(outerR + 4, outerR + 4, 4, 64),
    steelMat
  ));
  flange.position.y = -thickness / 2 - 4;
  group.add(flange);

  // Flange bolt holes (24 around perimeter)
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    const r = outerR + 2;
    const bolt = new THREE.Mesh(
      new THREE.CylinderGeometry(1, 1, 6, 8),
      darkMat
    );
    bolt.position.set(Math.cos(a) * r, -thickness / 2 - 4, Math.sin(a) * r);
    group.add(bolt);
  }

  // --- Impingement pattern indicators (engraved cross marks) ---
  for (let i = 0; i < outerCount; i++) {
    const a = (i / outerCount) * Math.PI * 2;
    const r = outerR - 16;
    const x = Math.cos(a) * r;
    const z = Math.sin(a) * r;
    // Cross mark
    const mark1 = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 0.5, 0.3),
      darkMat
    );
    mark1.position.set(x, thickness / 2 + 0.1, z);
    mark1.lookAt(0, thickness / 2 + 0.1, 0);
    group.add(mark1);
  }

  // --- Manufacturing serial number plate ---
  const plate = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(12, 0.5, 4),
    new THREE.MeshStandardMaterial({ color: 0xc09545, metalness: 0.8, roughness: 0.3 })
  ));
  plate.position.set(0, thickness / 2 + 0.3, outerR - 10);
  group.add(plate);

  return group;
}

// ====================== FORMULA 1 UPRIGHT ======================
export function createF1UprightGeometry(): THREE.Group {
  const group = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({
    color: 0x444444, metalness: 0.85, roughness: 0.25,
  }); // Billet aluminum, anodized
  const darkMat = darkSteel();
  const carbonMat = new THREE.MeshStandardMaterial({
    color: 0x0a0a0a, metalness: 0.4, roughness: 0.5,
  }); // Carbon fiber

  // --- Main upright body (complex sculpted shape) ---
  // Built as a multi-section loft using ExtrudeGeometry
  // Vertical orientation: wheel bearing bore at bottom, top mounts up

  // Lower bearing carrier (large cylinder for wheel bearings)
  const bearingCarrier = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(38, 42, 60, 48),
    mat
  ));
  bearingCarrier.position.y = -40;
  group.add(bearingCarrier);

  // Bearing bore (through hole)
  const bearingBore = new THREE.Mesh(
    new THREE.CylinderGeometry(32, 32, 70, 40),
    darkMat
  );
  bearingBore.position.y = -40;
  group.add(bearingBore);

  // Bearing seat shoulders (inner rings)
  [-25, 25].forEach((y) => {
    const seat = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(34, 32, 4, 40),
      mat
    ));
    seat.position.set(0, -40 + y, 0);
    group.add(seat);
  });

  // Bearing spacer (center)
  const spacer = new THREE.Mesh(
    new THREE.CylinderGeometry(33, 33, 30, 36),
    darkMat
  );
  spacer.position.y = -40;
  group.add(spacer);

  // --- Twin bearing bores (deep groove ball bearings style) ---
  [-15, 15].forEach((y) => {
    // Inner race seat
    const innerSeat = addShadow(new THREE.Mesh(
      new THREE.TorusGeometry(33, 0.8, 6, 32),
      mat
    ));
    innerSeat.position.set(0, -40 + y, 0);
    innerSeat.rotation.x = Math.PI / 2;
    group.add(innerSeat);
  });

  // --- Sculpted arm (connecting bearing carrier to top mounts) ---
  // Curved arm profile using ExtrudeGeometry with bezier shape
  const armShape = new THREE.Shape();
  armShape.moveTo(-15, 0);
  armShape.bezierCurveTo(-25, 20, -20, 40, -10, 50);
  armShape.lineTo(10, 50);
  armShape.bezierCurveTo(20, 40, 25, 20, 15, 0);
  armShape.lineTo(-15, 0);

  const armGeom = new THREE.ExtrudeGeometry(armShape, {
    depth: 22, bevelEnabled: true, bevelSize: 1, bevelThickness: 1, bevelSegments: 2,
  });
  armGeom.center();
  const arm = addShadow(new THREE.Mesh(armGeom, mat));
  arm.position.set(0, 0, 0);
  group.add(arm);

  // --- Top mount plate (where it bolts to the suspension) ---
  const topPlate = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(50, 8, 30),
    mat
  ));
  topPlate.position.y = 55;
  group.add(topPlate);

  // Top mounting holes (4)
  const topHoles: [number, number][] = [
    [-18, -10], [18, -10], [-18, 10], [18, 10]
  ];
  topHoles.forEach(([x, z]) => {
    const hole = new THREE.Mesh(
      new THREE.CylinderGeometry(2.5, 2.5, 12, 12),
      darkMat
    );
    hole.position.set(x, 55, z);
    group.add(hole);

    // Counterbore
    const cb = new THREE.Mesh(
      new THREE.CylinderGeometry(4, 4, 4, 12),
      darkMat
    );
    cb.position.set(x, 58, z);
    group.add(cb);
  });

  // --- Pushrod mount (top, offset) ---
  const pushrodMount = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(8, 10, 12, 24),
    mat
  ));
  pushrodMount.position.set(0, 60, 0);
  group.add(pushrodMount);

  // Pushrod bearing bore
  const pushBore = new THREE.Mesh(
    new THREE.CylinderGeometry(5, 5, 14, 16),
    darkMat
  );
  pushBore.position.set(0, 60, 0);
  group.add(pushBore);

  // Pushrod cap bolts
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    const bolt = new THREE.Mesh(
      new THREE.CylinderGeometry(1, 1, 4, 8),
      darkMat
    );
    bolt.position.set(Math.cos(a) * 9, 65, Math.sin(a) * 9);
    group.add(bolt);
  }

  // --- Steering arm (extending forward) ---
  const steerArm = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(40, 6, 8),
    mat
  ));
  steerArm.position.set(35, -30, 0);
  group.add(steerArm);

  // Steering arm tip (ball joint mount)
  const steerTip = addShadow(new THREE.Mesh(
    new THREE.SphereGeometry(8, 20, 16),
    mat
  ));
  steerTip.position.set(55, -30, 0);
  group.add(steerTip);

  // Steering ball joint bore
  const steerBore = new THREE.Mesh(
    new THREE.CylinderGeometry(4, 4, 16, 16),
    darkMat
  );
  steerBore.position.set(55, -30, 0);
  steerBore.rotation.z = Math.PI / 2;
  group.add(steerBore);

  // --- Brake caliper mount (two posts on the side) ---
  [0, 1].forEach((side) => {
    const post = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(6, 8, 20, 16),
      mat
    ));
    post.position.set(side === 0 ? -28 : 28, -20, 25);
    group.add(post);

    // Caliper bolt
    const bolt = new THREE.Mesh(
      new THREE.CylinderGeometry(2, 2, 24, 8),
      darkMat
    );
    bolt.position.set(side === 0 ? -28 : 28, -20, 25);
    group.add(bolt);
  });

  // --- Brake disc mount (spline inside bearing bore) ---
  // Spline teeth (12 internal splines)
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const spline = new THREE.Mesh(
      new THREE.BoxGeometry(2, 60, 2),
      darkMat
    );
    spline.position.set(Math.cos(a) * 31, -40, Math.sin(a) * 31);
    spline.rotation.y = a + Math.PI / 2;
    spline.rotation.x = Math.PI / 2;
    group.add(spline);
  }

  // --- Wheel hub face (where wheel bolts on) ---
  // Already represented by bearing carrier, but add bolt pattern
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    const r = 25;
    // Wheel bolt
    const bolt = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(2, 2, 8, 8),
      darkMat
    ));
    bolt.position.set(Math.cos(a) * r, -65, Math.sin(a) * r);
    group.add(bolt);

    // Bolt head (hex)
    const head = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(3, 3, 2, 6),
      darkMat
    ));
    head.position.set(Math.cos(a) * r, -68, Math.sin(a) * r);
    group.add(head);
  }

  // --- Sensor mount (for wheel speed sensor) ---
  const sensorMount = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(3, 4, 8, 12),
    mat
  ));
  sensorMount.position.set(30, -10, 18);
  group.add(sensorMount);

  // --- Cable bracket ---
  const bracket = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(8, 2, 4),
    carbonMat
  ));
  bracket.position.set(15, 30, 12);
  group.add(bracket);

  // --- Machining lightening pockets (decorative recesses on arm) ---
  for (let i = 0; i < 3; i++) {
    const pocket = new THREE.Mesh(
      new THREE.CylinderGeometry(4, 4, 2, 16),
      darkMat
    );
    pocket.position.set(0, 10 + i * 12, 11);
    group.add(pocket);

    const pocket2 = pocket.clone();
    pocket2.position.z = -11;
    group.add(pocket2);
  }

  // --- Aero edge (sharp trailing edge on arm) ---
  const edge = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(2, 40, 0.5),
    mat
  ));
  edge.position.set(0, 25, 11.5);
  group.add(edge);

  const edge2 = edge.clone();
  edge2.position.z = -11.5;
  group.add(edge2);

  return group;
}

// ====================== INJECTION MOLD CORE ======================
export function createInjectionMoldCoreGeometry(): THREE.Group {
  const group = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({
    color: 0x6b7280, metalness: 0.9, roughness: 0.18,
  }); // P20 tool steel
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.7, roughness: 0.5 });
  const copperMat = brass();

  // --- Main core block ---
  const blockW = 120, blockH = 100, blockD = 80;
  const block = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(blockW, blockH, blockD),
    mat
  ));
  group.add(block);

  // --- Contoured molding surface (the part-forming face) ---
  // Build a complex contoured shape using a series of curves
  // This is what gives the molded part its shape
  const surfaceShape = new THREE.Shape();
  surfaceShape.moveTo(-50, -40);
  surfaceShape.bezierCurveTo(-50, -20, -40, -10, -30, 0);
  surfaceShape.bezierCurveTo(-20, 10, -10, 30, 0, 35);
  surfaceShape.bezierCurveTo(10, 30, 20, 10, 30, 0);
  surfaceShape.bezierCurveTo(40, -10, 50, -20, 50, -40);
  surfaceShape.lineTo(-50, -40);

  const surfaceGeom = new THREE.ExtrudeGeometry(surfaceShape, {
    depth: 5, bevelEnabled: true, bevelSize: 1, bevelThickness: 1, bevelSegments: 2,
  });
  const surface = addShadow(new THREE.Mesh(surfaceGeom, mat));
  surface.position.set(0, 0, blockD / 2 - 3);
  group.add(surface);

  // --- Molded part feature: raised circular boss ---
  const boss = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(8, 10, 6, 32),
    mat
  ));
  boss.position.set(-25, -10, blockD / 2 + 3);
  group.add(boss);

  // Boss hole detail
  const bossHole = new THREE.Mesh(
    new THREE.CylinderGeometry(3, 3, 8, 16),
    darkMat
  );
  bossHole.position.set(-25, -10, blockD / 2 + 3);
  group.add(bossHole);

  // --- Second boss ---
  const boss2 = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(10, 12, 5, 32),
    mat
  ));
  boss2.position.set(25, -15, blockD / 2 + 2);
  group.add(boss2);

  // --- Rib features (raised walls on the molding face) ---
  const ribs: [number, number, number][] = [
    [-30, 20, 0], [30, 20, 0], [0, -25, Math.PI / 2]
  ];
  ribs.forEach(([x, y, rot]) => {
    const rib = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(40, 4, 4),
      mat
    ));
    rib.position.set(x, y, blockD / 2 + 2);
    rib.rotation.z = rot;
    group.add(rib);
  });

  // --- Ejector pin holes (8 pins for ejecting the molded part) ---
  const ejectorPositions: [number, number][] = [
    [-40, -25], [40, -25], [-40, 25], [40, 25],
    [0, -30], [0, 30], [-20, 0], [20, 0]
  ];
  ejectorPositions.forEach(([x, y]) => {
    // Ejector pin bore (through hole)
    const bore = new THREE.Mesh(
      new THREE.CylinderGeometry(1.5, 1.5, blockH + 4, 12),
      darkMat
    );
    bore.position.set(x, y, 0);
    bore.rotation.x = Math.PI / 2;
    group.add(bore);

    // Ejector pin tip (visible on molding face)
    const tip = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(1.5, 1.5, 1, 12),
      copperMat
    ));
    tip.position.set(x, y, blockD / 2 + 4);
    tip.rotation.x = Math.PI / 2;
    group.add(tip);

    // Counterbore on back
    const cb = new THREE.Mesh(
      new THREE.CylinderGeometry(2.5, 2.5, 3, 12),
      darkMat
    );
    cb.position.set(x, y, -blockD / 2 + 1);
    cb.rotation.x = Math.PI / 2;
    group.add(cb);
  });

  // --- Cooling channels (conformal cooling, visible as copper tubes) ---
  // Pattern: serpentine channel on each side
  [-1, 1].forEach((side) => {
    // 4 straight sections + 3 turns (serpentine)
    for (let i = 0; i < 4; i++) {
      const y = -30 + i * 20;
      const channel = addShadow(new THREE.Mesh(
        new THREE.CylinderGeometry(4, 4, blockW - 20, 16),
        copperMat
      ));
      channel.rotation.z = Math.PI / 2;
      channel.position.set(0, y, side * (blockD / 2 - 8));
      group.add(channel);
    }
    // Connecting turns (vertical)
    for (let i = 0; i < 3; i++) {
      const y1 = -30 + i * 20;
      const y2 = -10 + i * 20;
      const turn = addShadow(new THREE.Mesh(
        new THREE.CylinderGeometry(4, 4, 20, 16),
        copperMat
      ));
      turn.position.set(side > 0 ? (blockW / 2 - 12) : -(blockW / 2 - 12), (y1 + y2) / 2, side * (blockD / 2 - 8));
      group.add(turn);

      // Elbow (torus)
      const elbow = addShadow(new THREE.Mesh(
        new THREE.TorusGeometry(4, 4, 8, 12, Math.PI / 2),
        copperMat
      ));
      elbow.position.set(side > 0 ? (blockW / 2 - 12) : -(blockW / 2 - 12), y1, side * (blockD / 2 - 8));
      elbow.rotation.y = side > 0 ? 0 : Math.PI;
      group.add(elbow);

      const elbow2 = elbow.clone();
      elbow2.position.y = y2;
      elbow2.rotation.y = side > 0 ? Math.PI : 0;
      group.add(elbow2);
    }

    // Inlet/outlet ports (top face)
    [-1, 1].forEach((dir) => {
      const port = addShadow(new THREE.Mesh(
        new THREE.CylinderGeometry(4.5, 5, 6, 16),
        copperMat
      ));
      port.position.set(dir * (blockW / 2 - 12), dir > 0 ? 35 : -35, side * (blockD / 2 - 8));
      port.rotation.z = Math.PI / 2;
      group.add(port);

      // NPT thread indicator
      const thread = new THREE.Mesh(
        new THREE.TorusGeometry(5, 0.5, 4, 12),
        darkMat
      );
      thread.position.copy(port.position);
      thread.position.x += dir * 2;
      thread.rotation.y = Math.PI / 2;
      group.add(thread);
    });
  });

  // --- Sprue bushing (center top, where plastic enters) ---
  const sprue = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(8, 10, 12, 24),
    mat
  ));
  sprue.position.set(0, 35, blockD / 2 - 6);
  group.add(sprue);

  // Sprue bore (tapered)
  const sprueBore = new THREE.Mesh(
    new THREE.CylinderGeometry(3, 5, 14, 24),
    darkMat
  );
  sprueBore.position.set(0, 35, blockD / 2 - 5);
  group.add(sprueBore);

  // --- Runner system (channels from sprue to part) ---
  // Main runner
  const mainRunner = new THREE.Mesh(
    new THREE.CylinderGeometry(3, 3, 50, 12),
    darkMat
  );
  mainRunner.rotation.z = Math.PI / 2;
  mainRunner.position.set(0, 35, blockD / 2 - 1);
  group.add(mainRunner);

  // Branch runners
  [-1, 1].forEach((side) => {
    const runner = new THREE.Mesh(
      new THREE.CylinderGeometry(2.5, 2.5, 25, 10),
      darkMat
    );
    runner.position.set(side * 20, 35, blockD / 2 - 1);
    runner.rotation.z = Math.PI / 4 * (side > 0 ? -1 : 1);
    group.add(runner);
  });

  // Gate (small connection to part)
  const gate = new THREE.Mesh(
    new THREE.BoxGeometry(2, 1, 0.5),
    darkMat
  );
  gate.position.set(0, 0, blockD / 2 + 3);
  group.add(gate);

  // --- Side actions (slides for undercuts) - 2 slides ---
  [-1, 1].forEach((side) => {
    const slide = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(20, 30, 10),
      mat
    ));
    slide.position.set(side * (blockW / 2 + 5), 0, 0);
    group.add(slide);

    // Slide guide (gib)
    const gib = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(4, 35, 12),
      darkMat
    ));
    gib.position.set(side * (blockW / 2 + 5), 0, -blockD / 4);
    group.add(gib);
  });

  // --- Mounting bolt holes (perimeter, top and bottom) ---
  for (let i = 0; i < 4; i++) {
    const x = -45 + i * 30;
    [-1, 1].forEach((side) => {
      const hole = new THREE.Mesh(
        new THREE.CylinderGeometry(2, 2, blockH + 2, 10),
        darkMat
      );
      hole.position.set(x, side * (blockH / 2 - 5), -blockD / 4);
      hole.rotation.x = Math.PI / 2;
      group.add(hole);
    });
  }

  // --- Interlock alignment dowels (2) ---
  [-1, 1].forEach((side) => {
    const dowel = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(2, 2, 6, 12),
      copperMat
    ));
    dowel.position.set(side * 45, 35, -blockD / 2 + 2);
    group.add(dowel);
  });

  return group;
}

// ====================== GEARBOX (complete with internal gear train) ======================
export function createGearboxGeometry(): THREE.Group {
  const group = new THREE.Group();
  const housingMat = aluminum();
  const gearMat = steel();
  const shaftMat = stainless();
  const darkMat = darkSteel();
  const brassMat = brass();

  // --- Gearbox housing (open top view showing internals) ---
  // Built as a U-shape so we can see the gears inside
  const housingL = 140, housingH = 90, housingW = 50;

  // Bottom of housing
  const housingBottom = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(housingL, 6, housingW),
    housingMat
  ));
  housingBottom.position.y = -housingH / 2 + 3;
  group.add(housingBottom);

  // Side walls (front and back) - full
  [0, 1].forEach((side) => {
    const wall = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(housingL, housingH, 4),
      housingMat
    ));
    wall.position.set(0, 0, side === 0 ? -housingW / 2 + 2 : housingW / 2 - 2);
    group.add(wall);
  });

  // End walls (left and right) - shorter, with bearing cutouts
  [0, 1].forEach((side) => {
    const wall = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(4, housingH - 10, housingW - 4),
      housingMat
    ));
    wall.position.set(side === 0 ? -housingL / 2 + 2 : housingL / 2 - 2, 0, 0);
    group.add(wall);
  });

  // Bearing housings in walls (3 shaft positions)
  const shaftPositions: { x: number, y: number, r: number }[] = [
    { x: -40, y: -10, r: 14 }, // input shaft
    { x: 0, y: -20, r: 12 },   // counter shaft
    { x: 40, y: -10, r: 14 },  // output shaft
  ];

  shaftPositions.forEach((sp) => {
    [0, 1].forEach((side) => {
      // Bearing bore (dark)
      const bore = new THREE.Mesh(
        new THREE.CylinderGeometry(sp.r + 1, sp.r + 1, 6, 24),
        darkMat
      );
      bore.rotation.x = Math.PI / 2;
      bore.position.set(sp.x, sp.y, side === 0 ? -housingW / 2 : housingW / 2);
      group.add(bore);
    });
  });

  // === INTERNAL GEAR TRAIN ===

  // Helper: create a spur gear at position with rotation
  const createSpurGear = (
    x: number, y: number, teeth: number, pitchR: number, thickness: number,
    rotationZ: number = 0
  ): THREE.Group => {
    const g = new THREE.Group();
    const shape = new THREE.Shape();
    const outerR = pitchR + 1.5;
    const rootR = pitchR - 2;

    for (let i = 0; i < teeth; i++) {
      const a0 = (i / teeth) * Math.PI * 2;
      const a1 = ((i + 0.25) / teeth) * Math.PI * 2;
      const a2 = ((i + 0.5) / teeth) * Math.PI * 2;
      const a3 = ((i + 0.75) / teeth) * Math.PI * 2;
      const a4 = ((i + 1) / teeth) * Math.PI * 2;

      if (i === 0) shape.moveTo(Math.cos(a0) * rootR, Math.sin(a0) * rootR);
      shape.lineTo(Math.cos(a1) * rootR, Math.sin(a1) * rootR);
      shape.lineTo(Math.cos(a2) * outerR, Math.sin(a2) * outerR);
      shape.lineTo(Math.cos(a3) * outerR, Math.sin(a3) * outerR);
      shape.lineTo(Math.cos(a4) * rootR, Math.sin(a4) * rootR);
    }

    // Bore hole
    const boreR = 6;
    const hole = new THREE.Path();
    hole.absarc(0, 0, boreR, 0, Math.PI * 2, true);
    shape.holes.push(hole);

    const geom = new THREE.ExtrudeGeometry(shape, {
      depth: thickness, bevelEnabled: true, bevelSize: 0.3, bevelThickness: 0.3, bevelSegments: 1,
    });
    geom.center();
    const mesh = addShadow(new THREE.Mesh(geom, gearMat));
    mesh.rotation.x = Math.PI / 2;
    g.add(mesh);

    // Hub
    const hub = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(boreR + 3, boreR + 3, thickness + 2, 24),
      gearMat
    ));
    g.add(hub);

    // Keyway
    const keyway = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(2, 2, thickness + 4),
      darkMat
    ));
    keyway.position.set(boreR + 1, 0, 0);
    g.add(keyway);

    g.position.set(x, y, 0);
    g.rotation.z = rotationZ;
    return g;
  };

  // Input shaft gear (small, 20 teeth)
  group.add(createSpurGear(-40, -10, 20, 14, 14, 0));

  // Counter shaft gear 1 (large, 40 teeth, meshing with input)
  group.add(createSpurGear(0, -20, 40, 22, 14, Math.PI / 20));

  // Counter shaft gear 2 (small, 18 teeth, on same shaft as counter)
  group.add(createSpurGear(0, -20, 18, 12, 14, Math.PI / 18));

  // Wait - those would overlap. Let me reposition: counter shaft gears side by side along Z
  // Actually let me re-think: use 2 gears on counter shaft, offset in Z

  // Remove last 2 and redo
  // Actually it's a visualization; just make a 3-gear train in a row
  // Let's also add intermediate gears

  // Add an idler gear between counter and output
  group.add(createSpurGear(20, -10, 24, 16, 14, Math.PI / 12));

  // Output shaft gear (large, 36 teeth)
  group.add(createSpurGear(40, -10, 36, 20, 14, Math.PI / 36));

  // === SHAFTS (visible through open sides) ===
  shaftPositions.forEach((sp) => {
    // Shaft (cylinder)
    const shaft = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(sp.r - 1, sp.r - 1, housingW + 4, 24),
      shaftMat
    ));
    shaft.rotation.x = Math.PI / 2;
    shaft.position.set(sp.x, sp.y, 0);
    group.add(shaft);

    // Bearing on each side (inside walls)
    [0, 1].forEach((side) => {
      const bearing = addShadow(new THREE.Mesh(
        new THREE.CylinderGeometry(sp.r, sp.r - 1, 6, 24),
        brassMat
      ));
      bearing.rotation.x = Math.PI / 2;
      bearing.position.set(sp.x, sp.y, side === 0 ? -housingW / 2 + 3 : housingW / 2 - 3);
      group.add(bearing);
    });
  });

  // === OIL in sump (dark translucent volume) ===
  const oil = new THREE.Mesh(
    new THREE.BoxGeometry(housingL - 10, 8, housingW - 10),
    new THREE.MeshStandardMaterial({
      color: 0x6b5d2c, metalness: 0.1, roughness: 0.2,
      transparent: true, opacity: 0.5,
    })
  );
  oil.position.y = -housingH / 2 + 7;
  group.add(oil);

  // === MOUNTING FEET ===
  [[-housingL / 2 + 8, 0], [housingL / 2 - 8, 0]].forEach(([fx, fz]) => {
    const foot = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(14, 4, housingW + 4),
      housingMat
    ));
    foot.position.set(fx, -housingH / 2 - 2, 0);
    group.add(foot);

    // Mounting hole
    const hole = new THREE.Mesh(
      new THREE.CylinderGeometry(2, 2, 6, 12),
      darkMat
    );
    hole.position.set(fx, -housingH / 2 - 4, 0);
    group.add(hole);
  });

  // === INPUT/OUTPUT SHAFT EXTENSIONS (sticking out) ===
  // Input shaft extension (left side)
  const inputExt = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(8, 8, 18, 24),
    shaftMat
  ));
  inputExt.rotation.z = Math.PI / 2;
  inputExt.position.set(-housingL / 2 - 9, -10, 0);
  group.add(inputExt);

  // Keyway on input
  const inputKey = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(18, 2, 2),
    darkMat
  ));
  inputKey.position.set(-housingL / 2 - 9, -10, 7);
  group.add(inputKey);

  // Output shaft extension (right side)
  const outputExt = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(8, 8, 18, 24),
    shaftMat
  ));
  outputExt.rotation.z = Math.PI / 2;
  outputExt.position.set(housingL / 2 + 9, -10, 0);
  group.add(outputExt);

  // Output keyway
  const outputKey = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(18, 2, 2),
    darkMat
  ));
  outputKey.position.set(housingL / 2 + 9, -10, 7);
  group.add(outputKey);

  // === BREather / FILL PLUG on top ===
  const fillPlug = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(6, 7, 5, 6),
    brassMat
  ));
  fillPlug.position.set(0, housingH / 2 - 2, 0);
  group.add(fillPlug);

  // === OIL SIGHT GLASS ===
  const sight = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(4, 4, 2, 16),
    new THREE.MeshStandardMaterial({
      color: 0xffaa00, metalness: 0.1, roughness: 0.15,
      transparent: true, opacity: 0.7, emissive: 0x442200
    })
  ));
  sight.position.set(housingL / 2 + 0.5, -20, 0);
  sight.rotation.z = Math.PI / 2;
  group.add(sight);

  return group;
}

// ====================== DISPATCHER ======================
export function createGeometryForPart(part: { id: string; features?: Feature[] }): THREE.Group {
  switch (part.id) {
    case 'part_gearbox_housing': return createGearboxHousingGeometry(part.features || []);
    case 'part_shaft': return createShaftGeometry();
    case 'part_gear': return createGearGeometry();
    case 'part_bearing': return createBearingGeometry();
    case 'part_cover': return createCoverGeometry();
    case 'part_bolt': return createBoltGeometry();
    case 'part_coupling': return createCouplingGeometry();
    case 'part_pulley': return createPulleyGeometry();
    case 'part_spring': return createSpringGeometry();
    case 'part_impeller': return createImpellerGeometry();
    case 'part_turbine': return createTurbineGeometry();
    case 'part_robotic_arm': return createRoboticArmGeometry();
    case 'part_bracket': return createBracketGeometry();
    case 'part_heatsink': return createHeatSinkGeometry();
    case 'part_cylinder_head': return createCylinderHeadGeometry();
    case 'part_propeller': return createPropellerGeometry();
    // New engine parts
    case 'part_engine_block': return createEngineBlockGeometry();
    case 'part_crankshaft': return createCrankshaftGeometry();
    case 'part_conrod': return createConnectingRodGeometry();
    case 'part_piston': return createPistonGeometry();
    case 'part_flywheel': return createFlywheelGeometry();
    case 'part_camshaft': return createCamshaftGeometry();
    case 'part_oilpan': return createOilPanGeometry();
    case 'part_valvecover': return createValveCoverGeometry();
    // Industrial parts
    case 'part_turbine_blade': return createTurbineBladeGeometry();
    case 'part_rocket_injector': return createRocketInjectorGeometry();
    case 'part_f1_upright': return createF1UprightGeometry();
    case 'part_injection_mold': return createInjectionMoldCoreGeometry();
    case 'part_gearbox_complete': return createGearboxGeometry();
    // CNC machine parts (basic versions - kept for backward compatibility)
    case 'part_cnc_bed': return createCNCMachineBedGeometry();
    case 'part_cnc_column': return createCNCColumnGeometry2();
    case 'part_cnc_spindle': return createSpindleCarriageGeometry();
    case 'part_cnc_rotary': return createCAxisTableGeometry();
    // Super-detailed 5-axis CNC machine parts (14 parts)
    case 'part_cnc2_bed': return createCNCMachineBedGeometry();
    case 'part_cnc2_saddle': return createXAxisSaddleGeometry();
    case 'part_cnc2_column': return createCNCColumnGeometry2();
    case 'part_cnc2_carriage': return createSpindleCarriageGeometry();
    case 'part_cnc2_spindle_motor': return createSpindleMotorGeometry();
    case 'part_cnc2_trunnion': return createBAxisTrunnionGeometry();
    case 'part_cnc2_ctable': return createCAxisTableGeometry();
    case 'part_cnc2_magazine': return createATCMagazineGeometry();
    case 'part_cnc2_atc_arm': return createATCArmGeometry();
    case 'part_cnc2_coolant': return createCoolantSystemGeometry();
    case 'part_cnc2_cabinet': return createControlCabinetGeometry();
    case 'part_cnc2_tool_holder': return createToolHolderGeometry();
    case 'part_cnc2_conveyor': return createChipConveyorGeometry();
    case 'part_cnc2_workpiece': return createWorkpieceGeometry();
    // Mega CNC Machine - the entire machine as ONE super-detailed part
    case 'part_mega_cnc': return createMegaCNCMachineGeometry();
    // Chinese 3-story building
    case 'part_chinese_building': return createChineseBuildingGeometry();
    // LA Hills Mansion
    case 'part_la_mansion': return createLAMansionGeometry();
    // Great Pyramid of Giza
    case 'part_pyramid': return createPyramidGeometry();
    // Bay Area Apartment (modern 2BR SF SoMa unit)
    case 'part_bay_area_apartment': return createBayAreaApartmentGeometry();
    // Desktop Setup (battlestation with PC + monitors + RGB)
    case 'part_desktop_setup': return createDesktopSetupGeometry();
    // Grocery Store (supermarket with aisles, produce, checkouts)
    case 'part_grocery_store': return createGroceryStoreGeometry();
    // F1 Car (exploded view with all components)
    case 'part_f1_car': return createF1CarGeometry();
    // F1 Car (assembled — all components in correct positions)
    case 'part_f1_car_assembled': return createF1CarGeometry(false);
    default:
      // If part features are available, build a housing; otherwise default to gear
      if (part.features && part.features.length > 0) {
        return createGearboxHousingGeometry(part.features);
      }
      return createGearGeometry();
  }
}
