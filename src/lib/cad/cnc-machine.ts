// ====================== SUPER-DETAILED 5-AXIS CNC MACHINE ======================
// 14 component parts that combine into a complete machining center.
// All parts use real engineering conventions: HSK63 spindles, linear guides,
// ballscrews, ATC carousels, trunnion tables, etc.

import * as THREE from 'three';
import type { Feature } from './types';
import { addShadow, metal, steel, stainless, aluminum, darkSteel, brass, rubber, plastic } from './materials-dsl';

// ---------- 1. MACHINE BED (massive cast iron base) ----------
export function createCNCMachineBedGeometry(): THREE.Group {
  const group = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: 0x1f2937, metalness: 0.5, roughness: 0.7 });
  const machinedMat = new THREE.MeshStandardMaterial({ color: 0x4a5568, metalness: 0.7, roughness: 0.35 });
  const darkMat = darkSteel();
  const railMat = new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.95, roughness: 0.05 });

  const L = 320, W = 240, H = 40;

  // Main bed body
  const bed = addShadow(new THREE.Mesh(new THREE.BoxGeometry(L, H, W), mat));
  group.add(bed);

  // Top machined surface
  const top = addShadow(new THREE.Mesh(new THREE.BoxGeometry(L - 8, 3, W - 8), machinedMat));
  top.position.y = H / 2;
  group.add(top);

  // T-slots (7 slots)
  for (let i = 0; i < 7; i++) {
    const z = -90 + i * 30;
    // Slot mouth
    const slot = new THREE.Mesh(new THREE.BoxGeometry(L - 30, 3, 8), darkMat);
    slot.position.set(0, H / 2 - 0.5, z);
    group.add(slot);
    // T-slot undercut
    const undercut = new THREE.Mesh(new THREE.BoxGeometry(L - 30, 3, 14), darkMat);
    undercut.position.set(0, H / 2 - 3, z);
    group.add(undercut);
  }

  // Two linear guide rails (X-axis, THK-style)
  [-90, 90].forEach((z) => {
    // Rail
    const rail = addShadow(new THREE.Mesh(new THREE.BoxGeometry(L - 20, 6, 14), railMat));
    rail.position.set(0, H / 2 + 2, z);
    group.add(rail);
    // Mounting bolts (24 per rail)
    for (let i = 0; i < 24; i++) {
      const x = -140 + i * 12;
      const bolt = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 5, 8), darkMat);
      bolt.position.set(x, H / 2 + 4, z);
      group.add(bolt);
    }
    // End seal
    [-1, 1].forEach((s) => {
      const seal = addShadow(new THREE.Mesh(new THREE.BoxGeometry(8, 8, 16), darkMat));
      seal.position.set(s * (L / 2 - 4), H / 2 + 3, z);
      group.add(seal);
    });
  });

  // X-axis ballscrew (centered)
  const ballscrew = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(8, 8, L - 40, 24), railMat
  ));
  ballscrew.rotation.z = Math.PI / 2;
  ballscrew.position.set(0, H / 2 + 12, 0);
  group.add(ballscrew);

  // Ballscrew end supports (2)
  [-1, 1].forEach((s) => {
    const support = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(12, 16, 24), mat
    ));
    support.position.set(s * (L / 2 - 12), H / 2 + 10, 0);
    group.add(support);
    // Bearing cap
    const cap = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(8, 8, 4, 24), darkMat
    ));
    cap.rotation.z = Math.PI / 2;
    cap.position.set(s * (L / 2 - 6), H / 2 + 10, 0);
    group.add(cap);
  });

  // X-axis servo motor (left end)
  const servoBody = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(20, 20, 26, 24), mat
  ));
  servoBody.rotation.z = Math.PI / 2;
  servoBody.position.set(-L / 2 - 18, H / 2 + 10, 0);
  group.add(servoBody);

  // Servo cooling fins
  for (let i = 0; i < 6; i++) {
    const fin = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(21, 21, 1.5, 24), mat
    ));
    fin.rotation.z = Math.PI / 2;
    fin.position.set(-L / 2 - 10 + i * 3, H / 2 + 10, 0);
    group.add(fin);
  }

  // Servo shaft coupling cover
  const coupling = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(10, 10, 8, 16), darkMat
  ));
  coupling.rotation.z = Math.PI / 2;
  coupling.position.set(-L / 2 - 2, H / 2 + 10, 0);
  group.add(coupling);

  // Way covers (telescopic steel shields - 5 sections per side)
  [-1, 1].forEach((side) => {
    for (let i = 0; i < 5; i++) {
      const cover = addShadow(new THREE.Mesh(
        new THREE.BoxGeometry(40, 4, 200), stainless()
      ));
      cover.position.set(-100 + i * 50, H / 2 + 6, side * 50);
      group.add(cover);
    }
  });

  // Coolant trough (channel along edge)
  const trough = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(L - 20, 6, 10), mat
  ));
  trough.position.set(0, H / 2 - 4, -W / 2 + 8);
  group.add(trough);

  // Coolant return holes (8)
  for (let i = 0; i < 8; i++) {
    const x = -120 + i * 32;
    const hole = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 8, 12), darkMat);
    hole.position.set(x, H / 2 - 1, -W / 2 + 8);
    group.add(hole);
  }

  // Leveling feet (8)
  const feetPositions: [number, number][] = [
    [-140, -100], [140, -100], [-140, 100], [140, 100],
    [-50, -100], [50, -100], [-50, 100], [50, 100]
  ];
  feetPositions.forEach(([fx, fz]) => {
    // Foot pad
    const pad = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(15, 18, 5, 16), darkMat
    ));
    pad.position.set(fx, -H / 2 - 2.5, fz);
    group.add(pad);
    // Leveling screw
    const screw = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(4, 4, 10, 12), stainless()
    ));
    screw.position.set(fx, -H / 2 + 3, fz);
    group.add(screw);
    // Locking nut
    const nut = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(7, 7, 3, 6), darkMat
    ));
    nut.position.set(fx, -H / 2 - 1, fz);
    group.add(nut);
  });

  // Lifting eyes (4)
  [-1, 1].forEach((sx) => {
    [-1, 1].forEach((sz) => {
      const eye = addShadow(new THREE.Mesh(
        new THREE.TorusGeometry(6, 2, 8, 16), stainless()
      ));
      eye.position.set(sx * (L / 2 - 16), H / 2 + 4, sz * (W / 2 - 16));
      eye.rotation.x = Math.PI / 2;
      group.add(eye);
    });
  });

  // Manufacturer nameplate
  const plate = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(40, 8, 0.5), brass()
  ));
  plate.position.set(0, H / 2 + 0.5, -W / 2 + 4);
  group.add(plate);

  // Side ribbing (8 ribs per side)
  for (let i = 0; i < 8; i++) {
    const y = -H / 2 + 5 + i * 4;
    [-1, 1].forEach((side) => {
      const rib = addShadow(new THREE.Mesh(
        new THREE.BoxGeometry(L - 20, 1, 1), mat
      ));
      rib.position.set(0, y, side * (W / 2 - 0.5));
      group.add(rib);
    });
  }

  return group;
}

// ---------- 2. X-AXIS SADDLE (carriage that rides the bed rails) ----------
export function createXAxisSaddleGeometry(): THREE.Group {
  const group = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: 0x374151, metalness: 0.6, roughness: 0.5 });
  const machinedMat = new THREE.MeshStandardMaterial({ color: 0x4b5563, metalness: 0.7, roughness: 0.35 });
  const darkMat = darkSteel();
  const railMat = new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.95, roughness: 0.05 });

  // Main saddle body (sliding block)
  const body = addShadow(new THREE.Mesh(new THREE.BoxGeometry(80, 30, 200), mat));
  group.add(body);

  // Top machined surface (where column mounts)
  const top = addShadow(new THREE.Mesh(new THREE.BoxGeometry(70, 4, 190), machinedMat));
  top.position.y = 17;
  group.add(top);

  // Linear guide blocks (4 - riding on bed rails)
  const blockPositions: [number, number, number][] = [
    [-30, -15, -85], [-30, -15, 85], [30, -15, -85], [30, -15, 85]
  ];
  blockPositions.forEach(([bx, by, bz]) => {
    const block = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(40, 16, 30), darkMat
    ));
    block.position.set(bx, by, bz);
    group.add(block);
    // Lubrication fitting
    const fit = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 3, 8), brass());
    fit.position.set(bx, by - 10, bz);
    group.add(fit);
  });

  // Ballscrew nut (centered, bottom)
  const nut = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(15, 15, 28, 24), darkMat
  ));
  nut.rotation.x = Math.PI / 2;
  nut.position.set(0, -10, 0);
  group.add(nut);

  // Z-axis rails on top (2 parallel rails for column to ride on)
  [-50, 50].forEach((z) => {
    const rail = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(8, 4, 180), railMat
    ));
    rail.position.set(0, 20, z);
    group.add(rail);
    // Rail bolts
    for (let i = 0; i < 16; i++) {
      const x = -80 + i * 10;
      const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 3, 8), darkMat);
      bolt.position.set(x, 22, z);
      group.add(bolt);
    }
  });

  // Cable chain attachment
  const chainMount = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(20, 8, 12), mat
  ));
  chainMount.position.set(40, 5, 80);
  group.add(chainMount);

  // Drip pan (around edges)
  const pan = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(90, 2, 210), machinedMat
  ));
  pan.position.y = -16;
  group.add(pan);

  // Way wipers (4)
  blockPositions.forEach(([bx, _by, bz]) => {
    const wiper = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(46, 4, 4), rubber()
    ));
    wiper.position.set(bx, -18, bz - 18);
    group.add(wiper);
  });

  // Limit switches (2)
  [-1, 1].forEach((s) => {
    const sw = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(8, 6, 4), plastic(0x222)
    ));
    sw.position.set(s * 40, 5, 95);
    group.add(sw);
  });

  return group;
}

// ---------- 3. COLUMN (massive vertical structure) ----------
export function createCNCColumnGeometry2(): THREE.Group {
  const group = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: 0x1e3a5f, metalness: 0.5, roughness: 0.6 });
  const machinedMat = new THREE.MeshStandardMaterial({ color: 0x2e4a6f, metalness: 0.7, roughness: 0.35 });
  const darkMat = darkSteel();
  const railMat = new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.95, roughness: 0.05 });

  const W = 100, H = 220, D = 80;

  // Main column body
  const col = addShadow(new THREE.Mesh(new THREE.BoxGeometry(W, H, D), mat));
  col.position.y = H / 2;
  group.add(col);

  // Front face (machined, where spindle carriage rides)
  const front = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(W - 6, H - 6, 3), machinedMat
  ));
  front.position.set(0, H / 2, D / 2);
  group.add(front);

  // Y-axis linear guide rails (2 vertical)
  [-25, 25].forEach((x) => {
    const rail = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(12, H - 30, 8), railMat
    ));
    rail.position.set(x, H / 2, D / 2 + 2);
    group.add(rail);
    // Mounting bolts (24 per rail)
    for (let i = 0; i < 24; i++) {
      const y = 20 + i * 8;
      const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 3, 8), darkMat);
      bolt.position.set(x, y, D / 2 + 4);
      bolt.rotation.x = Math.PI / 2;
      group.add(bolt);
    }
  });

  // Y-axis ballscrew (centered, vertical)
  const screw = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(10, 10, H - 50, 24), railMat
  ));
  screw.position.set(0, H / 2, D / 2 + 6);
  group.add(screw);

  // Ballscrew end supports (top + bottom)
  [H - 12, 12].forEach((y) => {
    const sup = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(20, 12, 16), mat
    ));
    sup.position.set(0, y, D / 2 + 6);
    group.add(sup);
    // Bearing
    const brg = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(8, 8, 4, 24), darkMat
    ));
    brg.position.set(0, y, D / 2 + 6);
    group.add(brg);
  });

  // Y-axis servo motor (top)
  const servo = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(18, 18, 24, 24), mat
  ));
  servo.position.set(0, H + 6, D / 2 + 6);
  group.add(servo);
  // Servo fins
  for (let i = 0; i < 5; i++) {
    const fin = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(19, 19, 1.5, 24), mat
    ));
    fin.position.set(0, H - 2 + i * 3, D / 2 + 6);
    group.add(fin);
  }

  // Counterweight cavity (top, dark opening)
  const cwOpening = new THREE.Mesh(
    new THREE.BoxGeometry(30, 4, 20), darkMat
  );
  cwOpening.position.set(0, H - 1, -10);
  group.add(cwOpening);

  // Counterweight chain (visible going into cavity)
  for (let i = 0; i < 8; i++) {
    const link = addShadow(new THREE.Mesh(
      new THREE.TorusGeometry(1, 0.5, 6, 12), stainless()
    ));
    link.position.set(0, H - 6 - i * 3, -10);
    link.rotation.y = Math.PI / 2;
    group.add(link);
  }

  // Base mounting flange (where column bolts to saddle)
  const flange = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(W + 20, 10, D + 20), mat
  ));
  flange.position.y = -5;
  group.add(flange);

  // Mounting bolts (12 around flange)
  for (let i = 0; i < 6; i++) {
    [-1, 1].forEach((s) => {
      const x = -40 + i * 16;
      const bolt = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 6, 8), darkMat);
      bolt.position.set(x, -10, s * (D / 2 + 8));
      group.add(bolt);
    });
  }

  // Internal ribbing (6 horizontal ribs)
  for (let i = 0; i < 6; i++) {
    const y = 30 + i * 30;
    const rib = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(W - 12, 4, D - 12), mat
    ));
    rib.position.y = y;
    group.add(rib);
  }

  // Side cooling fins (left + right)
  for (let i = 0; i < 12; i++) {
    const y = 20 + i * 15;
    [-1, 1].forEach((s) => {
      const fin = addShadow(new THREE.Mesh(
        new THREE.BoxGeometry(2, 10, 50), mat
      ));
      fin.position.set(s * (W / 2 + 1), y, 0);
      group.add(fin);
    });
  }

  // Z-axis linear encoder scale (Heidenhain-style)
  const scale = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(4, H - 40, 1.5), brass()
  ));
  scale.position.set(W / 2 - 4, H / 2, D / 2 + 1);
  group.add(scale);
  // Reader head
  const reader = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(6, 6, 4), darkMat
  ));
  reader.position.set(W / 2 - 1, H / 2 - 30, D / 2 + 3);
  group.add(reader);

  // Way covers (telescopic, 6 sections)
  for (let i = 0; i < 6; i++) {
    const cover = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(W - 16, 3, 4), stainless()
    ));
    cover.position.set(0, 20 + i * 30, D / 2 + 6);
    group.add(cover);
  }

  // Hydraulic balancing cylinder (side)
  const cyl = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(5, 5, 50, 16), stainless()
  ));
  cyl.position.set(W / 2 + 4, H / 2 + 20, -10);
  group.add(cyl);

  return group;
}

// ---------- 4. SPINDLE CARRIAGE (Z-axis head, rides on column) ----------
export function createSpindleCarriageGeometry(): THREE.Group {
  const group = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: 0x1f2937, metalness: 0.6, roughness: 0.45 });
  const machinedMat = new THREE.MeshStandardMaterial({ color: 0x374151, metalness: 0.75, roughness: 0.3 });
  const darkMat = darkSteel();

  // Main carriage body (heavy block)
  const body = addShadow(new THREE.Mesh(new THREE.BoxGeometry(120, 80, 70), mat));
  group.add(body);

  // Back face (machined, slides on column rails)
  const back = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(110, 70, 4), machinedMat
  ));
  back.position.z = -37;
  group.add(back);

  // Linear guide blocks (4 - riding on column rails)
  [-45, 45].forEach((x) => {
    [-25, 25].forEach((y) => {
      const block = addShadow(new THREE.Mesh(
        new THREE.BoxGeometry(30, 24, 12), darkMat
      ));
      block.position.set(x, y, -38);
      group.add(block);
      // Lube fitting
      const fit = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 3, 8), brass());
      fit.position.set(x, y, -44);
      group.add(fit);
    });
  });

  // Ballscrew nut (back, centered)
  const nut = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(14, 14, 24, 24), darkMat
  ));
  nut.position.set(0, 0, -38);
  group.add(nut);

  // Spindle bore (large through hole)
  const bore = new THREE.Mesh(
    new THREE.CylinderGeometry(30, 30, 90, 32), darkMat
  );
  group.add(bore);

  // Z-axis servo motor (left side)
  const servo = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(22, 22, 30, 24), mat
  ));
  servo.rotation.z = Math.PI / 2;
  servo.position.set(-75, 0, 0);
  group.add(servo);

  // Servo fins
  for (let i = 0; i < 6; i++) {
    const fin = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(23, 23, 1.5, 24), mat
    ));
    fin.rotation.z = Math.PI / 2;
    fin.position.set(-67 + i * 3, 0, 0);
    group.add(fin);
  }

  // Servo coupling
  const coupling = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(12, 12, 10, 16), darkMat
  ));
  coupling.rotation.z = Math.PI / 2;
  coupling.position.set(-52, 0, 0);
  group.add(coupling);

  // Z-axis scale reader
  const reader = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(8, 6, 4), darkMat
  ));
  reader.position.set(50, 30, -38);
  group.add(reader);

  // Hydraulic clamp cylinder (top)
  const clamp = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(8, 8, 16, 16), stainless()
  ));
  clamp.position.set(0, 50, 0);
  group.add(clamp);

  // Coolant manifold (front, with 4 outlets)
  const manifold = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(100, 6, 8), mat
  ));
  manifold.position.set(0, -38, 36);
  group.add(manifold);
  // Coolant outlets (4)
  for (let i = 0; i < 4; i++) {
    const x = -36 + i * 24;
    const outlet = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(2, 2, 6, 12), stainless()
    ));
    outlet.position.set(x, -42, 38);
    group.add(outlet);
  }

  // Mounting bolts (around perimeter, 16)
  for (let i = 0; i < 8; i++) {
    const x = -50 + i * 14;
    [-1, 1].forEach((s) => {
      const bolt = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 4, 8), darkMat);
      bolt.position.set(x, s * 35, 36);
      group.add(bolt);
    });
  }

  // Side access panels (2)
  [-1, 1].forEach((s) => {
    const panel = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(2, 60, 50), machinedMat
    ));
    panel.position.set(s * 60, 0, 0);
    group.add(panel);
    // Panel bolts (8)
    for (let i = 0; i < 8; i++) {
      const y = -24 + i * 8;
      [-1, 1].forEach((s2) => {
        const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 3, 8), darkMat);
        bolt.rotation.z = Math.PI / 2;
        bolt.position.set(s * 61, y, s2 * 18);
        group.add(bolt);
      });
    }
  });

  // Limit switch (top)
  const sw = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(10, 6, 4), plastic(0x222)
  ));
  sw.position.set(40, 40, 0);
  group.add(sw);

  return group;
}

// ---------- 5. SPINDLE MOTOR + ASSEMBLY (15kW, with HSK63) ----------
export function createSpindleMotorGeometry(): THREE.Group {
  const group = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: 0x374151, metalness: 0.7, roughness: 0.35 });
  const darkMat = darkSteel();
  const coolMat = new THREE.MeshStandardMaterial({ color: 0x1e40af, metalness: 0.4, roughness: 0.4 });
  const steelMat = new THREE.MeshStandardMaterial({ color: 0xe5e7eb, metalness: 0.95, roughness: 0.08 });

  // Main spindle housing
  const housing = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(32, 32, 80, 48), mat
  ));
  group.add(housing);

  // Cooling fins (12 around housing)
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const fin = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(2, 60, 6), mat
    ));
    fin.position.set(Math.cos(a) * 33, 0, Math.sin(a) * 33);
    fin.rotation.y = a;
    group.add(fin);
  }

  // Top motor cap (with terminal box)
  const topCap = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(36, 32, 10, 48), mat
  ));
  topCap.position.y = 45;
  group.add(topCap);

  // Terminal box (electrical connections)
  const termBox = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(30, 16, 20), mat
  ));
  termBox.position.set(0, 50, 26);
  group.add(termBox);

  // Cable gland
  const gland = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(3, 4, 6, 12), darkMat
  ));
  gland.position.set(0, 50, 38);
  gland.rotation.x = Math.PI / 2;
  group.add(gland);

  // Power cable (visible black cable coming out)
  for (let i = 0; i < 5; i++) {
    const cableSeg = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(2.5, 2.5, 6, 12), plastic(0x111)
    ));
    cableSeg.position.set(0, 56 + i * 4, 42 + i * 2);
    cableSeg.rotation.x = 0.5;
    group.add(cableSeg);
  }

  // Encoder (top, small cylinder)
  const encoder = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(14, 14, 8, 24), darkMat
  ));
  encoder.position.set(0, 54, -8);
  group.add(encoder);
  // Encoder cable
  const encCable = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(1.5, 1.5, 14, 8), plastic(0x222)
  ));
  encCable.position.set(-12, 60, -10);
  encCable.rotation.z = 0.8;
  group.add(encCable);

  // Bottom cap (spindle nose)
  const bottomCap = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(38, 32, 10, 48), mat
  ));
  bottomCap.position.y = -45;
  group.add(bottomCap);

  // Spindle nose (precision taper - HSK63)
  const nose = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(28, 32, 8, 48), steelMat
  ));
  nose.position.y = -52;
  group.add(nose);

  // HSK63 taper (internal)
  const taper = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(20, 28, 12, 32), darkMat
  ));
  taper.position.y = -55;
  group.add(taper);

  // Drawbar (top, threaded rod)
  const drawbar = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(4, 4, 80, 12), steelMat
  ));
  drawbar.position.y = 5;
  group.add(drawbar);

  // Stack of disc springs (belleville washers)
  for (let i = 0; i < 12; i++) {
    const spring = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(8, 8, 1.5, 16), steelMat
    ));
    spring.position.y = 25 - i * 2;
    group.add(spring);
  }

  // Tool holder (HSK63, visible in spindle)
  const toolHolder = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(20, 24, 50, 32), darkMat
  ));
  toolHolder.position.y = -78;
  group.add(toolHolder);

  // Retention knob (top of tool holder)
  const knob = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(6, 6, 10, 12), steelMat
  ));
  knob.position.y = -56;
  group.add(knob);

  // End mill shank
  const tool = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(6, 6, 30, 16), steelMat
  ));
  tool.position.y = -118;
  group.add(tool);

  // Helical flutes (4 flutes, modeled as torus arcs)
  for (let f = 0; f < 4; f++) {
    const phase = (f / 4) * Math.PI * 2;
    for (let i = 0; i < 12; i++) {
      const y = -108 - i * 2;
      const a = phase + i * 0.4;
      const flute = new THREE.Mesh(
        new THREE.TorusGeometry(6, 0.4, 4, 8, Math.PI * 0.5), darkMat
      );
      flute.position.set(0, y, 0);
      flute.rotation.y = a;
      group.add(flute);
    }
  }

  // Tool tip (sharp)
  const tip = addShadow(new THREE.Mesh(
    new THREE.ConeGeometry(6, 6, 16), steelMat
  ));
  tip.position.y = -136;
  group.add(tip);

  // Coolant nozzles (2 angled)
  [-1, 1].forEach((s) => {
    // Nozzle body
    const noz = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(2.5, 2, 12, 12), mat
    ));
    noz.position.set(s * 30, -30, 0);
    noz.rotation.z = s * 0.6;
    group.add(noz);
    // Nozzle tip
    const tip2 = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(1.5, 2.5, 4, 12), darkMat
    ));
    tip2.position.set(s * 28, -36, 0);
    tip2.rotation.z = s * 0.6;
    group.add(tip2);
    // Coolant stream (transparent blue)
    const stream = new THREE.Mesh(
      new THREE.CylinderGeometry(0.8, 2, 30, 8),
      new THREE.MeshStandardMaterial({
        color: 0x22d3ee, metalness: 0.2, roughness: 0.3,
        transparent: true, opacity: 0.4
      })
    );
    stream.position.set(s * 22, -55, 0);
    stream.rotation.z = s * 0.4;
    group.add(stream);
  });

  // Air purge port
  const air = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(2, 2, 5, 10), darkMat
  ));
  air.position.set(20, 30, 0);
  group.add(air);

  // Temperature sensor
  const sensor = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(2.5, 2.5, 6, 10), darkMat
  ));
  sensor.position.set(-20, 30, 0);
  group.add(sensor);

  // Nameplate
  const plate = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(24, 10, 0.5), brass()
  ));
  plate.position.set(0, 0, 33);
  group.add(plate);

  return group;
}

// ---------- 6. B-AXIS TRUNNION TABLE (tilting rotary) ----------
export function createBAxisTrunnionGeometry(): THREE.Group {
  const group = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: 0x1e3a5f, metalness: 0.6, roughness: 0.5 });
  const darkMat = darkSteel();
  const steelMat = steel();

  // Base
  const base = addShadow(new THREE.Mesh(new THREE.BoxGeometry(60, 12, 80), mat));
  base.position.y = -38;
  group.add(base);

  // Mounting bolts (8)
  for (let i = 0; i < 4; i++) {
    [-1, 1].forEach((s) => {
      const x = -22 + i * 14;
      const bolt = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 6, 8), darkMat);
      bolt.position.set(x, -44, s * 32);
      group.add(bolt);
    });
  }

  // Two trunnion side supports
  [-1, 1].forEach((side) => {
    const support = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(22, 26, 10, 32), mat
    ));
    support.rotation.z = Math.PI / 2;
    support.position.set(side * 32, 0, 0);
    group.add(support);

    // Bearing bore
    const bore = new THREE.Mesh(
      new THREE.CylinderGeometry(16, 16, 12, 24), darkMat
    );
    bore.rotation.z = Math.PI / 2;
    bore.position.set(side * 32, 0, 0);
    group.add(bore);

    // Bearing outer race
    const race = addShadow(new THREE.Mesh(
      new THREE.TorusGeometry(18, 2, 8, 32), steelMat
    ));
    race.position.set(side * 32, 0, 0);
    race.rotation.y = Math.PI / 2;
    group.add(race);
  });

  // B-axis trunnion body (horizontal cylinder between supports)
  const trunnion = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(20, 20, 60, 32), mat
  ));
  trunnion.rotation.z = Math.PI / 2;
  group.add(trunnion);

  // Trunnion internal bore
  const trunnionBore = new THREE.Mesh(
    new THREE.CylinderGeometry(14, 14, 64, 24), darkMat
  );
  trunnionBore.rotation.z = Math.PI / 2;
  group.add(trunnionBore);

  // B-axis servo motor (left side)
  const servo = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(18, 18, 22, 24), mat
  ));
  servo.rotation.z = Math.PI / 2;
  servo.position.set(-50, 0, 0);
  group.add(servo);

  // Servo coupling
  const coupling = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(8, 8, 6, 16), darkMat
  ));
  coupling.rotation.z = Math.PI / 2;
  coupling.position.set(-38, 0, 0);
  group.add(coupling);

  // B-axis encoder (right side)
  const enc = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(12, 12, 6, 24), darkMat
  ));
  enc.rotation.z = Math.PI / 2;
  enc.position.set(48, 0, 0);
  group.add(enc);

  // Mounting plate for C-axis (on top of trunnion)
  const mountPlate = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(50, 6, 50), mat
  ));
  mountPlate.position.y = 18;
  group.add(mountPlate);

  // Mounting bolts (8 around plate)
  for (let i = 0; i < 4; i++) {
    [-1, 1].forEach((s) => {
      const x = -18 + i * 12;
      const bolt = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 5, 8), darkMat);
      bolt.position.set(x, 22, s * 18);
      group.add(bolt);
    });
  }

  // Cable chain (multi-colored cables)
  for (let i = 0; i < 5; i++) {
    const cable = new THREE.Mesh(
      new THREE.CylinderGeometry(1, 1, 20, 8),
      new THREE.MeshStandardMaterial({
        color: [0x000000, 0xff0000, 0x00aa00, 0x0000ff, 0xffaa00][i],
        metalness: 0.1, roughness: 0.7
      })
    );
    cable.position.set(-30, -30 - i * 2, 30);
    cable.rotation.z = 0.8;
    group.add(cable);
  }

  return group;
}

// ---------- 7. C-AXIS ROTARY TABLE ----------
export function createCAxisTableGeometry(): THREE.Group {
  const group = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: 0x1e3a5f, metalness: 0.6, roughness: 0.5 });
  const machinedMat = new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.95, roughness: 0.08 });
  const darkMat = darkSteel();
  const workMat = aluminum();

  // Table base (housing for the rotary motor)
  const housing = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(48, 52, 18, 48), mat
  ));
  housing.position.y = -15;
  group.add(housing);

  // C-axis servo motor (bottom)
  const servo = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(16, 16, 20, 24), mat
  ));
  servo.position.y = -30;
  group.add(servo);
  // Servo fins
  for (let i = 0; i < 4; i++) {
    const fin = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(17, 17, 1.5, 24), mat
    ));
    fin.position.y = -25 + i * 3;
    group.add(fin);
  }

  // Rotary table (the disc that spins)
  const table = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(45, 48, 12, 64), mat
  ));
  table.position.y = 6;
  group.add(table);

  // Table top surface (precision machined)
  const tableTop = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(44, 44, 2, 64), machinedMat
  ));
  tableTop.position.y = 13;
  group.add(tableTop);

  // T-slots on table (4 radial slots)
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2;
    const slot = new THREE.Mesh(
      new THREE.BoxGeometry(80, 3, 6), darkMat
    );
    slot.position.y = 14;
    slot.rotation.y = a;
    group.add(slot);
    // T-slot undercut
    const under = new THREE.Mesh(
      new THREE.BoxGeometry(80, 2, 12), darkMat
    );
    under.position.y = 12;
    under.rotation.y = a;
    group.add(under);
  }

  // Center bore (for rotary union / vacuum)
  const centerBore = new THREE.Mesh(
    new THREE.CylinderGeometry(6, 6, 16, 16), darkMat
  );
  centerBore.position.y = 6;
  group.add(centerBore);

  // Clamp studs (8 around table)
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + Math.PI / 16;
    const r = 30;
    const stud = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(1.5, 1.5, 12, 8), stainless()
    ));
    stud.position.set(Math.cos(a) * r, 14, Math.sin(a) * r);
    group.add(stud);
  }

  // Workpiece (a complex aluminum part being machined)
  const workpiece = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(60, 30, 60), workMat
  ));
  workpiece.position.y = 29;
  group.add(workpiece);

  // Machined pocket in workpiece
  const pocket = new THREE.Mesh(
    new THREE.BoxGeometry(40, 8, 40), darkMat
  );
  pocket.position.y = 42;
  group.add(pocket);

  // Pocket floor feature (small island)
  const island = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(8, 8, 10, 24), workMat
  ));
  island.position.y = 38;
  group.add(island);

  // Drilled holes (4 corner holes)
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    const r = 22;
    const hole = new THREE.Mesh(
      new THREE.CylinderGeometry(3, 3, 35, 12), darkMat
    );
    hole.position.set(Math.cos(a) * r, 29, Math.sin(a) * r);
    group.add(hole);
    // Counterbore
    const cb = new THREE.Mesh(
      new THREE.CylinderGeometry(5, 5, 4, 12), darkMat
    );
    cb.position.set(Math.cos(a) * r, 43, Math.sin(a) * r);
    group.add(cb);
  }

  // Edge contour (machined slope on one side)
  const contour = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(20, 15, 60), workMat
  ));
  contour.position.set(35, 24, 0);
  contour.rotation.z = 0.4;
  group.add(contour);

  // Toolpath indicator (visible cutting path on top of workpiece)
  for (let i = 0; i < 6; i++) {
    const path = new THREE.Mesh(
      new THREE.BoxGeometry(60 - i * 8, 0.5, 0.5),
      new THREE.MeshStandardMaterial({
        color: 0x22d3ee, emissive: 0x22d3ee, emissiveIntensity: 0.3
      })
    );
    path.position.set(0, 44.5, -15 + i * 6);
    group.add(path);
  }

  // C-axis encoder (side)
  const enc = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(10, 10, 5, 24), darkMat
  ));
  enc.position.set(0, -15, 48);
  group.add(enc);

  // Mounting bolts (8 around base)
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const r = 45;
    const bolt = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 6, 8), darkMat);
    bolt.position.set(Math.cos(a) * r, -24, Math.sin(a) * r);
    group.add(bolt);
  }

  return group;
}

// ---------- 8. ATC MAGAZINE (24-tool carousel) ----------
export function createATCMagazineGeometry(): THREE.Group {
  const group = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: 0x374151, metalness: 0.6, roughness: 0.5 });
  const darkMat = darkSteel();
  const toolMat = new THREE.MeshStandardMaterial({ color: 0xe5e7eb, metalness: 0.95, roughness: 0.08 });

  // Magazine housing (drum shape)
  const housing = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(60, 65, 30, 48), mat
  ));
  group.add(housing);

  // Front face plate
  const face = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(58, 58, 4, 48), mat
  ));
  face.position.z = 17;
  group.add(face);

  // Tool pockets (24 around circumference)
  const toolCount = 24;
  for (let i = 0; i < toolCount; i++) {
    const a = (i / toolCount) * Math.PI * 2;
    const r = 50;

    // Tool holder pocket (cylinder)
    const pocket = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(8, 8, 12, 24), darkMat
    ));
    pocket.position.set(Math.cos(a) * r, Math.sin(a) * r, 14);
    pocket.rotation.x = Math.PI / 2;
    pocket.lookAt(0, 0, 14);
    group.add(pocket);

    // Tool holder (HSK63)
    const holder = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(6, 8, 20, 16), darkMat
    ));
    holder.position.set(Math.cos(a) * r, Math.sin(a) * r, 26);
    holder.lookAt(0, 0, 26 + 20);
    holder.rotateX(Math.PI / 2);
    group.add(holder);

    // Tool (different lengths per pocket, variety)
    const toolLen = 12 + (i % 4) * 3;
    const toolR = 2 + (i % 3) * 0.5;
    const tool = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(toolR, toolR, toolLen, 12), toolMat
    ));
    tool.position.set(Math.cos(a) * r, Math.sin(a) * r, 26 + toolLen / 2 + 10);
    tool.lookAt(0, 0, 26 + toolLen + 10);
    tool.rotateX(Math.PI / 2);
    group.add(tool);

    // Pocket number label (small sphere)
    const label = new THREE.Mesh(
      new THREE.SphereGeometry(1.5, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0x442200 })
    );
    label.position.set(Math.cos(a) * (r - 12), Math.sin(a) * (r - 12), 18);
    group.add(label);
  }

  // Magazine servo motor (back)
  const servo = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(20, 20, 26, 24), mat
  ));
  servo.rotation.x = Math.PI / 2;
  servo.position.z = -20;
  group.add(servo);

  // Servo cooling fins
  for (let i = 0; i < 5; i++) {
    const fin = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(21, 21, 1.5, 24), mat
    ));
    fin.rotation.x = Math.PI / 2;
    fin.position.z = -12 + i * 3;
    group.add(fin);
  }

  // Mounting bracket (top)
  const bracket = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(40, 20, 8), mat
  ));
  bracket.position.y = 65;
  group.add(bracket);

  // Mounting bolts (4)
  [-12, 12].forEach((x) => {
    [-1, 1].forEach((s) => {
      const bolt = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 6, 8), darkMat);
      bolt.position.set(x, 65, s * 6);
      group.add(bolt);
    });
  });

  // Tool-setter probe (side, smaller cylinder)
  const probe = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(8, 10, 15, 16), mat
  ));
  probe.position.set(70, -40, 10);
  group.add(probe);
  // Probe tip (red)
  const probeTip = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(3, 3, 2, 12),
    new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0x440000 })
  ));
  probeTip.position.set(70, -47, 10);
  group.add(probeTip);

  return group;
}

// ---------- 9. ATC ARM (gripper arm that swings between spindle and magazine) ----------
export function createATCArmGeometry(): THREE.Group {
  const group = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: 0x374151, metalness: 0.7, roughness: 0.35 });
  const darkMat = darkSteel();
  const steelMat = steel();

  // Rotary base (servo housing)
  const base = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(16, 18, 14, 24), mat
  ));
  group.add(base);

  // Base mounting flange
  const flange = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(20, 20, 3, 24), mat
  ));
  flange.position.y = -8;
  group.add(flange);

  // Mounting bolts (6)
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const bolt = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 5, 8), darkMat);
    bolt.position.set(Math.cos(a) * 16, -10, Math.sin(a) * 16);
    group.add(bolt);
  }

  // Vertical pivot shaft
  const shaft = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(8, 8, 20, 16), steelMat
  ));
  shaft.position.y = 17;
  group.add(shaft);

  // Main arm (T-shape, double-ended)
  const arm = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(80, 8, 12), mat
  ));
  arm.position.y = 25;
  group.add(arm);

  // Gripper assemblies (both ends - one for spindle, one for magazine)
  [-40, 40].forEach((x) => {
    // Gripper body
    const grip = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(10, 12, 14, 16), mat
    ));
    grip.position.set(x, 25, 0);
    group.add(grip);

    // Gripper claws (2 - open position)
    [-1, 1].forEach((s) => {
      const claw = addShadow(new THREE.Mesh(
        new THREE.BoxGeometry(4, 12, 4), mat
      ));
      claw.position.set(x + s * 6, 25, 0);
      group.add(claw);
    });

    // Tool holder in gripper (a held tool)
    const heldTool = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(6, 8, 20, 16), darkMat
    ));
    heldTool.position.set(x, 25, 0);
    group.add(heldTool);

    // Tool sticking out
    const tool = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(3, 3, 15, 12), steelMat
    ));
    tool.position.set(x, 14, 0);
    group.add(tool);

    // Spring-loaded gripper indicators (small)
    [-1, 1].forEach((s) => {
      const spring = new THREE.Mesh(
        new THREE.CylinderGeometry(1, 1, 8, 8), steelMat
      );
      spring.position.set(x + s * 8, 28, 0);
      group.add(spring);
    });
  });

  // Arm pivot bolt (top)
  const pivotBolt = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(4, 4, 4, 8), darkMat
  ));
  pivotBolt.position.y = 30;
  group.add(pivotBolt);

  // Curved arm supports (decorative, structural)
  [-40, 40].forEach((x) => {
    const support = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(2, 14, 10), mat
    ));
    support.position.set(x, 19, 0);
    group.add(support);
  });

  // Cable bundle (going down into base)
  for (let i = 0; i < 3; i++) {
    const cable = new THREE.Mesh(
      new THREE.CylinderGeometry(0.8, 0.8, 12, 8),
      new THREE.MeshStandardMaterial({
        color: [0x000000, 0xff0000, 0x00aa00][i],
        metalness: 0.1, roughness: 0.7
      })
    );
    cable.position.set(-4 + i * 4, -16, 0);
    group.add(cable);
  }

  return group;
}

// ---------- 10. COOLANT SYSTEM (tank, pump, hoses) ----------
export function createCoolantSystemGeometry(): THREE.Group {
  const group = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: 0x166534, metalness: 0.4, roughness: 0.6 });
  const darkMat = darkSteel();
  const hoseMat = new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.2, roughness: 0.7 });
  const fluidMat = new THREE.MeshStandardMaterial({
    color: 0x84cc16, metalness: 0.1, roughness: 0.2,
    transparent: true, opacity: 0.6
  });

  // Coolant tank (rectangular)
  const tank = addShadow(new THREE.Mesh(new THREE.BoxGeometry(60, 40, 40), mat));
  group.add(tank);

  // Tank lid
  const lid = addShadow(new THREE.Mesh(new THREE.BoxGeometry(64, 4, 44), mat));
  lid.position.y = 22;
  group.add(lid);

  // Lid bolts (8)
  for (let i = 0; i < 4; i++) {
    [-1, 1].forEach((s) => {
      const x = -24 + i * 16;
      const bolt = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 4, 8), darkMat);
      bolt.position.set(x, 24, s * 18);
      group.add(bolt);
    });
  }

  // Coolant level sight glass (transparent)
  const sight = new THREE.Mesh(
    new THREE.BoxGeometry(2, 30, 8), fluidMat
  );
  sight.position.set(31, 0, 0);
  group.add(sight);
  // Sight glass frame
  const frame = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(1, 34, 10), mat
  ));
  frame.position.set(32, 0, 0);
  group.add(frame);

  // Coolant pump (top of tank)
  const pump = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(10, 12, 16, 16), mat
  ));
  pump.position.set(-15, 30, 0);
  group.add(pump);
  // Pump motor
  const pumpMotor = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(8, 10, 14, 16), mat
  ));
  pumpMotor.position.set(-15, 42, 0);
  group.add(pumpMotor);
  // Pump fins
  for (let i = 0; i < 4; i++) {
    const fin = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(9, 11, 1.5, 16), mat
    ));
    fin.position.set(-15, 37 + i * 3, 0);
    group.add(fin);
  }

  // Outlet pipe (going up from pump)
  const pipe1 = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(3, 3, 30, 12), stainless()
  ));
  pipe1.position.set(-15, 60, 0);
  group.add(pipe1);

  // Flexible hose (5 segments going to spindle)
  for (let i = 0; i < 6; i++) {
    const seg = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(3.5, 3.5, 8, 12), hoseMat
    ));
    seg.position.set(-15 + i * 5, 70 - i * 3, 0);
    seg.rotation.z = -0.6;
    group.add(seg);
  }

  // Hose end fitting
  const fitting = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(4, 4, 4, 12), stainless()
  ));
  fitting.position.set(15, 55, 0);
  group.add(fitting);

  // Filter housing (side)
  const filter = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(8, 8, 20, 16), mat
  ));
  filter.position.set(20, 5, 20);
  filter.rotation.z = Math.PI / 2;
  group.add(filter);
  // Filter bowl (transparent, showing fluid)
  const filterBowl = new THREE.Mesh(
    new THREE.CylinderGeometry(7, 7, 12, 16), fluidMat
  );
  filterBowl.position.set(20, 5, 20);
  filterBowl.rotation.z = Math.PI / 2;
  group.add(filterBowl);

  // Pressure gauge (top)
  const gauge = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(5, 5, 3, 16), darkMat
  ));
  gauge.position.set(10, 25, 18);
  group.add(gauge);
  // Gauge face
  const gaugeFace = new THREE.Mesh(
    new THREE.CylinderGeometry(4, 4, 0.5, 16),
    new THREE.MeshStandardMaterial({ color: 0xffffff })
  );
  gaugeFace.position.set(10, 25, 20);
  group.add(gaugeFace);
  // Gauge needle
  const needle = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 3, 0.3),
    new THREE.MeshStandardMaterial({ color: 0xff0000 })
  );
  needle.position.set(10, 26, 20.3);
  needle.rotation.z = 0.5;
  group.add(needle);

  // Drain valve (bottom side)
  const valve = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(3, 3, 6, 8), darkMat
  ));
  valve.position.set(31, -15, 0);
  valve.rotation.z = Math.PI / 2;
  group.add(valve);
  // Valve handle
  const handle = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(8, 1, 2), darkMat
  ));
  handle.position.set(36, -15, 0);
  group.add(handle);

  return group;
}

// ---------- 11. CONTROL CABINET (electrical enclosure with HMI) ----------
export function createControlCabinetGeometry(): THREE.Group {
  const group = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: 0x9ca3af, metalness: 0.5, roughness: 0.5 });
  const darkMat = darkSteel();
  const panelMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, metalness: 0.4, roughness: 0.6 });

  // Cabinet body
  const body = addShadow(new THREE.Mesh(new THREE.BoxGeometry(60, 120, 30), mat));
  group.add(body);

  // Front door (slightly offset)
  const door = addShadow(new THREE.Mesh(new THREE.BoxGeometry(56, 116, 2), mat));
  door.position.z = 16;
  group.add(door);

  // Door handle
  const handle = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(3, 16, 2), darkMat
  ));
  handle.position.set(24, 0, 17.5);
  group.add(handle);

  // Door hinges (2)
  [-50, 50].forEach((y) => {
    const hinge = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(1.5, 1.5, 8, 8), darkMat
    ));
    hinge.position.set(-28, y, 17);
    hinge.rotation.z = Math.PI / 2;
    group.add(hinge);
  });

  // Door bolts (8 around perimeter)
  for (let i = 0; i < 4; i++) {
    const y = -50 + i * 32;
    [-1, 1].forEach((s) => {
      const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 3, 8), darkMat);
      bolt.position.set(s * 25, y, 17.5);
      group.add(bolt);
    });
  }

  // HMI panel (touchscreen, mounted on door)
  const hmi = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(36, 28, 1.5), darkMat
  ));
  hmi.position.set(0, 30, 18);
  group.add(hmi);
  // HMI screen (lit)
  const screen = new THREE.Mesh(
    new THREE.BoxGeometry(32, 24, 0.5),
    new THREE.MeshStandardMaterial({
      color: 0x22d3ee, emissive: 0x22d3ee, emissiveIntensity: 0.3
    })
  );
  screen.position.set(0, 30, 18.8);
  group.add(screen);

  // Emergency stop button (red, big)
  const estop = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(6, 7, 4, 16),
    new THREE.MeshStandardMaterial({ color: 0xdc2626, emissive: 0x440000 })
  ));
  estop.position.set(20, -40, 18);
  group.add(estop);
  // E-stop bezel
  const bezel = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(8, 8, 2, 16), darkMat
  ));
  bezel.position.set(20, -40, 17);
  group.add(bezel);

  // Status LEDs (3 - green/yellow/red)
  [-8, 0, 8].forEach((x, i) => {
    const led = new THREE.Mesh(
      new THREE.CylinderGeometry(1.5, 1.5, 1, 12),
      new THREE.MeshStandardMaterial({
        color: [0x10b981, 0xf59e0b, 0xef4444][i],
        emissive: [0x10b981, 0xf59e0b, 0xef4444][i],
        emissiveIntensity: 0.5
      })
    );
    led.position.set(x, -40, 18);
    group.add(led);
  });

  // Mode selector switch
  const modeSw = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(3, 3, 2, 12), darkMat
  ));
  modeSw.position.set(-15, -40, 18);
  group.add(modeSw);
  // Selector knob
  const knob = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(5, 1.5, 1.5), darkMat
  ));
  knob.position.set(-15, -40, 19);
  group.add(knob);

  // Keylock switch
  const key = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(2, 2, 1.5, 8), darkMat
  ));
  key.position.set(20, -25, 18);
  group.add(key);

  // Cooling fans (2 on top, ventilation)
  for (let i = 0; i < 2; i++) {
    const fan = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(8, 8, 3, 16), darkMat
    ));
    fan.position.set(-12 + i * 24, 58, 0);
    group.add(fan);
    // Fan blades
    for (let j = 0; j < 5; j++) {
      const blade = new THREE.Mesh(
        new THREE.BoxGeometry(7, 0.5, 1), darkMat
      );
      blade.position.set(-12 + i * 24, 58, 1.5);
      blade.rotation.y = (j / 5) * Math.PI * 2;
      group.add(blade);
    }
    // Vent grille
    const vent = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(10, 10, 1, 16), panelMat
    ));
    vent.position.set(-12 + i * 24, 58, -1);
    group.add(vent);
  }

  // Side ventilation louvers (8 horizontal slots)
  for (let i = 0; i < 8; i++) {
    const y = -40 + i * 12;
    [-1, 1].forEach((s) => {
      const louver = addShadow(new THREE.Mesh(
        new THREE.BoxGeometry(2, 4, 20), panelMat
      ));
      louver.position.set(s * 30, y, 0);
      group.add(louver);
    });
  }

  // Cable glands (bottom, 6)
  for (let i = 0; i < 6; i++) {
    const x = -20 + i * 8;
    const gland = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(2, 2.5, 4, 12), darkMat
    ));
    gland.position.set(x, -60, 0);
    group.add(gland);
  }

  // Main disconnect switch (large rotary, side)
  const disconnect = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(8, 8, 6, 12), darkMat
  ));
  disconnect.position.set(-30, 30, 0);
  disconnect.rotation.z = Math.PI / 2;
  group.add(disconnect);
  // Disconnect handle (yellow)
  const discHandle = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(2, 12, 2),
    new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.4, roughness: 0.4 })
  ));
  discHandle.position.set(-33, 30, 0);
  group.add(discHandle);

  // Manufacturer nameplate
  const plate = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(20, 8, 0.3), brass()
  ));
  plate.position.set(0, 50, 17);
  group.add(plate);

  return group;
}

// ---------- 12. TOOL HOLDER (HSK63, standalone) ----------
export function createToolHolderGeometry(): THREE.Group {
  const group = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: 0x374151, metalness: 0.8, roughness: 0.25 });
  const steelMat = new THREE.MeshStandardMaterial({ color: 0xe5e7eb, metalness: 0.95, roughness: 0.08 });
  const darkMat = darkSteel();

  // HSK63 taper body (the precision tapered section)
  const taper = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(20, 25, 30, 32), mat
  ));
  group.add(taper);

  // HSK flange (the disc with gripper slots)
  const flange = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(28, 28, 6, 32), mat
  ));
  flange.position.y = 18;
  group.add(flange);

  // Gripper slots (V-grooves on flange, 6 around)
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const slot = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 4, 8), darkMat
    );
    slot.position.set(Math.cos(a) * 26, 18, Math.sin(a) * 26);
    slot.rotation.y = a + Math.PI / 2;
    group.add(slot);
  }

  // Retention knob (top threaded stud)
  const knob = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(5, 6, 12, 12), steelMat
  ));
  knob.position.y = 27;
  group.add(knob);
  // Threaded section
  const thread = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(4, 4, 8, 12), steelMat
  ));
  thread.position.y = 36;
  group.add(thread);

  // Tool shank (collet chuck section)
  const shank = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(15, 20, 25, 24), mat
  ));
  shank.position.y = -27;
  group.add(shank);

  // Collet nut (bottom)
  const nut = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(18, 18, 8, 16), mat
  ));
  nut.position.y = -42;
  group.add(nut);
  // Knurling on nut (radial ribs)
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    const rib = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 6, 1), mat
    );
    rib.position.set(Math.cos(a) * 18, -42, Math.sin(a) * 18);
    rib.rotation.y = a;
    group.add(rib);
  }

  // End mill (the cutting tool)
  const tool = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(6, 6, 35, 16), steelMat
  ));
  tool.position.y = -65;
  group.add(tool);

  // Helical flutes (4 flutes)
  for (let f = 0; f < 4; f++) {
    const phase = (f / 4) * Math.PI * 2;
    for (let i = 0; i < 16; i++) {
      const y = -50 - i * 2;
      const a = phase + i * 0.4;
      const flute = new THREE.Mesh(
        new THREE.TorusGeometry(6, 0.4, 4, 8, Math.PI * 0.5), darkMat
      );
      flute.position.set(0, y, 0);
      flute.rotation.y = a;
      group.add(flute);
    }
  }

  // Tool tip
  const tip = addShadow(new THREE.Mesh(
    new THREE.ConeGeometry(6, 6, 16), steelMat
  ));
  tip.position.y = -85;
  group.add(tip);

  // Identification band (color-coded for tool type)
  const band = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(15.5, 15.5, 2, 24),
    new THREE.MeshStandardMaterial({ color: 0x3b82f6, metalness: 0.4, roughness: 0.4 })
  ));
  band.position.y = -15;
  group.add(band);

  // Balance screw (small grub screw on side)
  const grub = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(1, 1, 3, 8), darkMat
  ));
  grub.position.set(15, -10, 0);
  grub.rotation.z = Math.PI / 2;
  group.add(grub);

  return group;
}

// ---------- 13. CHIP CONVEYOR (for waste removal) ----------
export function createChipConveyorGeometry(): THREE.Group {
  const group = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: 0x374151, metalness: 0.5, roughness: 0.6 });
  const darkMat = darkSteel();
  const steelMat = stainless();

  // Conveyor body (angled trough)
  const body = addShadow(new THREE.Mesh(new THREE.BoxGeometry(80, 20, 30), mat));
  group.add(body);

  // Hinge belt (chip conveyor belt - made of many steel segments)
  for (let i = 0; i < 20; i++) {
    const x = -38 + i * 4;
    const seg = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(3, 2, 28), steelMat
    ));
    seg.position.set(x, 8, 0);
    group.add(seg);
  }

  // Drive sprocket (one end)
  const sprocket1 = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(8, 8, 28, 16), darkMat
  ));
  sprocket1.rotation.x = Math.PI / 2;
  sprocket1.position.set(-38, 8, 0);
  group.add(sprocket1);

  // Idle sprocket (other end)
  const sprocket2 = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(8, 8, 28, 16), darkMat
  ));
  sprocket2.rotation.x = Math.PI / 2;
  sprocket2.position.set(38, 8, 0);
  group.add(sprocket2);

  // Drive motor
  const motor = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(8, 10, 14, 16), mat
  ));
  motor.position.set(-38, 8, 20);
  group.add(motor);

  // Chips pile (small metal shavings, decorative)
  for (let i = 0; i < 20; i++) {
    const chip = new THREE.Mesh(
      new THREE.BoxGeometry(
        1 + Math.random() * 2,
        0.5 + Math.random(),
        1 + Math.random() * 2
      ),
      new THREE.MeshStandardMaterial({
        color: 0xc0c0c0, metalness: 0.9, roughness: 0.3
      })
    );
    chip.position.set(
      -30 + Math.random() * 60,
      10 + Math.random() * 2,
      -10 + Math.random() * 20
    );
    chip.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    group.add(chip);
  }

  // Support legs (2)
  [-30, 30].forEach((x) => {
    const leg = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(4, 20, 4), mat
    ));
    leg.position.set(x, -20, 0);
    group.add(leg);
  });

  // Coolant drain holes (in bottom of trough)
  for (let i = 0; i < 5; i++) {
    const x = -30 + i * 15;
    const hole = new THREE.Mesh(
      new THREE.CylinderGeometry(2, 2, 4, 12), darkMat
    );
    hole.position.set(x, -10, 0);
    group.add(hole);
  }

  // Discharge chute (angled end)
  const chute = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(15, 10, 30), mat
  ));
  chute.position.set(48, -2, 0);
  chute.rotation.z = -0.4;
  group.add(chute);

  // Chip bucket (collects chips at end)
  const bucket = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(12, 10, 18, 16), mat
  ));
  bucket.position.set(60, -15, 0);
  group.add(bucket);

  return group;
}

// ---------- 14. WORKPIECE (complex 5-axis part being machined) ----------
export function createWorkpieceGeometry(): THREE.Group {
  const group = new THREE.Group();
  const mat = aluminum();
  const darkMat = darkSteel();

  // Base block
  const base = addShadow(new THREE.Mesh(new THREE.BoxGeometry(80, 40, 80), mat));
  group.add(base);

  // Top contoured surface (curved)
  const topShape = new THREE.Shape();
  topShape.moveTo(-40, -40);
  topShape.bezierCurveTo(-40, -20, -30, 20, 0, 25);
  topShape.bezierCurveTo(30, 20, 40, -20, 40, -40);
  topShape.lineTo(-40, -40);
  const topGeom = new THREE.ExtrudeGeometry(topShape, {
    depth: 20, bevelEnabled: true, bevelSize: 1, bevelThickness: 1, bevelSegments: 2,
  });
  const top = addShadow(new THREE.Mesh(topGeom, mat));
  top.position.y = 18;
  top.rotation.x = -Math.PI / 2;
  group.add(top);

  // Central bore (precision hole)
  const bore = new THREE.Mesh(
    new THREE.CylinderGeometry(10, 10, 60, 32), darkMat
  );
  group.add(bore);

  // Counterbore
  const cb = new THREE.Mesh(
    new THREE.CylinderGeometry(14, 14, 8, 32), darkMat
  );
  cb.position.y = 22;
  group.add(cb);

  // 4 corner mounting holes
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    const r = 30;
    const hole = new THREE.Mesh(
      new THREE.CylinderGeometry(4, 4, 50, 12), darkMat
    );
    hole.position.set(Math.cos(a) * r, 0, Math.sin(a) * r);
    group.add(hole);
    // Counterbore
    const ccb = new THREE.Mesh(
      new THREE.CylinderGeometry(6, 6, 6, 12), darkMat
    );
    ccb.position.set(Math.cos(a) * r, 17, Math.sin(a) * r);
    group.add(ccb);
  }

  // Side pocket (machined feature)
  const pocket = new THREE.Mesh(
    new THREE.BoxGeometry(30, 20, 10), darkMat
  );
  pocket.position.set(35, -5, 0);
  group.add(pocket);

  // Pocket floor with small boss
  const boss = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(4, 4, 8, 12), mat
  ));
  boss.position.set(35, -3, 0);
  group.add(boss);

  // Machined slot (T-slot on top)
  const slot = new THREE.Mesh(
    new THREE.BoxGeometry(60, 3, 8), darkMat
  );
  slot.position.set(0, 17, -20);
  group.add(slot);

  // Toolpath indicators (visible machining passes - glowing cyan)
  for (let i = 0; i < 8; i++) {
    const path = new THREE.Mesh(
      new THREE.BoxGeometry(70 - i * 4, 0.3, 0.3),
      new THREE.MeshStandardMaterial({
        color: 0x22d3ee, emissive: 0x22d3ee, emissiveIntensity: 0.4
      })
    );
    path.position.set(0, 20, -25 + i * 7);
    group.add(path);
  }

  // Spiral toolpath (visible on top)
  for (let i = 0; i < 20; i++) {
    const a = (i / 20) * Math.PI * 4;
    const r = 25 - i * 1;
    const seg = new THREE.Mesh(
      new THREE.BoxGeometry(3, 0.3, 0.3),
      new THREE.MeshStandardMaterial({
        color: 0x22d3ee, emissive: 0x22d3ee, emissiveIntensity: 0.5
      })
    );
    seg.position.set(Math.cos(a) * r, 24, Math.sin(a) * r);
    seg.rotation.y = a;
    group.add(seg);
  }

  // Edge chamfers (decorative bevels)
  [0, 1, 2, 3].forEach((side) => {
    const a = side * Math.PI / 2;
    const chamfer = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(80, 3, 3), mat
    ));
    chamfer.position.set(Math.cos(a) * 38, -18, Math.sin(a) * 38);
    chamfer.rotation.y = a;
    group.add(chamfer);
  });

  // Ribs (internal, visible through pocket)
  [-15, 0, 15].forEach((z) => {
    const rib = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(20, 30, 2), mat
    ));
    rib.position.set(20, 0, z);
    group.add(rib);
  });

  return group;
}

// ====================== DISPATCHER EXTENSION ======================
// This file exports all the CNC machine parts. They are imported and added to the
// main dispatcher in models.ts via the part ID lookup.
