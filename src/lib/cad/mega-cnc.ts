// ====================== MEGA CNC MACHINE ======================
// A single super-detailed 5-axis CNC machining center built as ONE part.
// Combines bed, saddle, column, carriage, spindle, trunnion, C-table,
// ATC magazine, ATC arm, coolant system, control cabinet, chip conveyor,
// tool holder, and workpiece — all in one massive detailed model.
// Total: ~150+ individual mesh elements with extreme engineering detail.

import * as THREE from 'three';
import { addShadow, metal, steel, stainless, aluminum, darkSteel, brass, rubber, plastic } from './materials-dsl';

export function createMegaCNCMachineGeometry(): THREE.Group {
  const root = new THREE.Group();

  // Material palette
  const castIron = new THREE.MeshStandardMaterial({ color: 0x1f2937, metalness: 0.5, roughness: 0.7 });
  const machinedIron = new THREE.MeshStandardMaterial({ color: 0x4a5568, metalness: 0.7, roughness: 0.35 });
  const bluePaint = new THREE.MeshStandardMaterial({ color: 0x1e3a5f, metalness: 0.5, roughness: 0.5 });
  const darkFrame = new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.6, roughness: 0.5 });
  const railSteel = new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.95, roughness: 0.05 });
  const toolSteel = new THREE.MeshStandardMaterial({ color: 0xe5e7eb, metalness: 0.95, roughness: 0.08 });
  const carbide = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, metalness: 0.95, roughness: 0.05 });
  const coolant = new THREE.MeshStandardMaterial({ color: 0x22d3ee, metalness: 0.2, roughness: 0.3, transparent: true, opacity: 0.5 });
  const cyanGlow = new THREE.MeshStandardMaterial({ color: 0x22d3ee, emissive: 0x22d3ee, emissiveIntensity: 0.4 });
  const redGlow = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0x440000 });
  const yellowMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.4, roughness: 0.4 });

  // ========================================================================
  // 1. MACHINE BED (massive 360×260×50mm cast iron base)
  // ========================================================================
  const bedGroup = new THREE.Group();
  {
    const L = 360, W = 260, H = 50;
    // Main bed body
    const bed = addShadow(new THREE.Mesh(new THREE.BoxGeometry(L, H, W), castIron));
    bedGroup.add(bed);
    // Top machined surface
    const top = addShadow(new THREE.Mesh(new THREE.BoxGeometry(L - 10, 4, W - 10), machinedIron));
    top.position.y = H / 2;
    bedGroup.add(top);
    // 8 T-slots
    for (let i = 0; i < 8; i++) {
      const z = -105 + i * 30;
      const slot = new THREE.Mesh(new THREE.BoxGeometry(L - 30, 3, 8), darkSteel());
      slot.position.set(0, H / 2 - 0.5, z);
      bedGroup.add(slot);
      const under = new THREE.Mesh(new THREE.BoxGeometry(L - 30, 3, 14), darkSteel());
      under.position.set(0, H / 2 - 3, z);
      bedGroup.add(under);
    }
    // 2 linear guide rails (X-axis)
    [-100, 100].forEach((z) => {
      const rail = addShadow(new THREE.Mesh(new THREE.BoxGeometry(L - 20, 8, 16), railSteel));
      rail.position.set(0, H / 2 + 3, z);
      bedGroup.add(rail);
      // 28 bolts per rail
      for (let i = 0; i < 28; i++) {
        const x = -160 + i * 12;
        const bolt = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 5, 8), darkSteel());
        bolt.position.set(x, H / 2 + 6, z);
        bedGroup.add(bolt);
      }
    });
    // X-axis ballscrew
    const screw = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(10, 10, L - 50, 24), railSteel));
    screw.rotation.z = Math.PI / 2;
    screw.position.set(0, H / 2 + 15, 0);
    bedGroup.add(screw);
    // Ballscrew supports
    [-1, 1].forEach((s) => {
      const sup = addShadow(new THREE.Mesh(new THREE.BoxGeometry(14, 20, 28), castIron));
      sup.position.set(s * (L / 2 - 14), H / 2 + 13, 0);
      bedGroup.add(sup);
    });
    // X-axis servo motor (left end)
    const servo = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(24, 24, 30, 24), castIron));
    servo.rotation.z = Math.PI / 2;
    servo.position.set(-L / 2 - 22, H / 2 + 13, 0);
    bedGroup.add(servo);
    for (let i = 0; i < 7; i++) {
      const fin = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(25, 25, 1.5, 24), castIron));
      fin.rotation.z = Math.PI / 2;
      fin.position.set(-L / 2 - 12 + i * 3, H / 2 + 13, 0);
      bedGroup.add(fin);
    }
    // Coupling
    const coup = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(12, 12, 10, 16), darkSteel()));
    coup.rotation.z = Math.PI / 2;
    coup.position.set(-L / 2 - 3, H / 2 + 13, 0);
    bedGroup.add(coup);
    // 12 telescopic way covers (6 per side)
    [-1, 1].forEach((side) => {
      for (let i = 0; i < 6; i++) {
        const cover = addShadow(new THREE.Mesh(new THREE.BoxGeometry(50, 5, 220), stainless()));
        cover.position.set(-120 + i * 50, H / 2 + 8, side * 55);
        bedGroup.add(cover);
      }
    });
    // Coolant trough
    const trough = addShadow(new THREE.Mesh(new THREE.BoxGeometry(L - 20, 8, 12), castIron));
    trough.position.set(0, H / 2 - 5, -W / 2 + 10);
    bedGroup.add(trough);
    // 10 coolant return holes
    for (let i = 0; i < 10; i++) {
      const x = -150 + i * 32;
      const hole = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.5, 10, 12), darkSteel());
      hole.position.set(x, H / 2 - 1, -W / 2 + 10);
      bedGroup.add(hole);
    }
    // 10 leveling feet
    const feetPos: [number, number][] = [
      [-160, -110], [160, -110], [-160, 110], [160, 110],
      [-80, -110], [80, -110], [-80, 110], [80, 110], [0, -110], [0, 110],
    ];
    feetPos.forEach(([fx, fz]) => {
      const pad = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(18, 22, 6, 16), darkSteel()));
      pad.position.set(fx, -H / 2 - 3, fz);
      bedGroup.add(pad);
      const screw2 = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 12, 12), stainless()));
      screw2.position.set(fx, -H / 2 + 4, fz);
      bedGroup.add(screw2);
      const nut = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(9, 9, 4, 6), darkSteel()));
      nut.position.set(fx, -H / 2 - 1, fz);
      bedGroup.add(nut);
    });
    // 4 lifting eyes
    [-1, 1].forEach((sx) => {
      [-1, 1].forEach((sz) => {
        const eye = addShadow(new THREE.Mesh(new THREE.TorusGeometry(8, 2.5, 8, 16), stainless()));
        eye.position.set(sx * (L / 2 - 20), H / 2 + 5, sz * (W / 2 - 20));
        eye.rotation.x = Math.PI / 2;
        bedGroup.add(eye);
      });
    });
    // Side ribbing (20 ribs)
    for (let i = 0; i < 10; i++) {
      const y = -H / 2 + 6 + i * 4;
      [-1, 1].forEach((side) => {
        const rib = addShadow(new THREE.Mesh(new THREE.BoxGeometry(L - 20, 1.2, 1.2), castIron));
        rib.position.set(0, y, side * (W / 2 - 0.6));
        bedGroup.add(rib);
      });
    }
    // Brass nameplate
    const plate = addShadow(new THREE.Mesh(new THREE.BoxGeometry(50, 10, 0.5), brass()));
    plate.position.set(0, H / 2 + 0.5, -W / 2 + 5);
    bedGroup.add(plate);
  }
  root.add(bedGroup);

  // ========================================================================
  // 2. X-AXIS SADDLE (on bed rails, offset to front)
  // ========================================================================
  const saddleGroup = new THREE.Group();
  saddleGroup.position.set(0, 30, 0);
  {
    const body = addShadow(new THREE.Mesh(new THREE.BoxGeometry(100, 36, 220), castIron));
    saddleGroup.add(body);
    const top = addShadow(new THREE.Mesh(new THREE.BoxGeometry(90, 5, 210), machinedIron));
    top.position.y = 20;
    saddleGroup.add(top);
    // 4 linear guide blocks
    [[-40, -95], [-40, 95], [40, -95], [40, 95]].forEach(([bx, bz]) => {
      const block = addShadow(new THREE.Mesh(new THREE.BoxGeometry(48, 18, 34), darkSteel()));
      block.position.set(bx, -18, bz);
      saddleGroup.add(block);
      const fit = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 4, 8), brass());
      fit.position.set(bx, -28, bz);
      saddleGroup.add(fit);
    });
    // Ballscrew nut
    const nut = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(18, 18, 32, 24), darkSteel()));
    nut.rotation.x = Math.PI / 2;
    nut.position.set(0, -12, 0);
    saddleGroup.add(nut);
    // 2 Z-axis rails on top
    [-60, 60].forEach((z) => {
      const rail = addShadow(new THREE.Mesh(new THREE.BoxGeometry(10, 5, 200), railSteel));
      rail.position.set(0, 24, z);
      saddleGroup.add(rail);
      for (let i = 0; i < 20; i++) {
        const bolt = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 4, 8), darkSteel());
        bolt.position.set(-90 + i * 10, 26, z);
        saddleGroup.add(bolt);
      }
    });
    // Way wipers (4)
    [[-40, -95], [-40, 95], [40, -95], [40, 95]].forEach(([bx, bz]) => {
      const wiper = addShadow(new THREE.Mesh(new THREE.BoxGeometry(52, 5, 5), rubber()));
      wiper.position.set(bx, -22, bz - 20);
      saddleGroup.add(wiper);
    });
    // 2 limit switches
    [-1, 1].forEach((s) => {
      const sw = addShadow(new THREE.Mesh(new THREE.BoxGeometry(10, 7, 5), plastic(0x222)));
      sw.position.set(s * 45, 6, 105);
      saddleGroup.add(sw);
    });
  }
  root.add(saddleGroup);

  // ========================================================================
  // 3. COLUMN (vertical, on saddle)
  // ========================================================================
  const columnGroup = new THREE.Group();
  columnGroup.position.set(0, 38, 0);
  {
    const W = 120, H = 280, D = 100;
    const col = addShadow(new THREE.Mesh(new THREE.BoxGeometry(W, H, D), bluePaint));
    col.position.y = H / 2;
    columnGroup.add(col);
    // Front face
    const front = addShadow(new THREE.Mesh(new THREE.BoxGeometry(W - 8, H - 8, 4), machinedIron));
    front.position.set(0, H / 2, D / 2);
    columnGroup.add(front);
    // 2 Y-axis guide rails
    [-30, 30].forEach((x) => {
      const rail = addShadow(new THREE.Mesh(new THREE.BoxGeometry(14, H - 40, 10), railSteel));
      rail.position.set(x, H / 2, D / 2 + 3);
      columnGroup.add(rail);
      // 30 bolts per rail
      for (let i = 0; i < 30; i++) {
        const y = 20 + i * 8;
        const bolt = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 4, 8), darkSteel());
        bolt.position.set(x, y, D / 2 + 5);
        bolt.rotation.x = Math.PI / 2;
        columnGroup.add(bolt);
      }
    });
    // Y-axis ballscrew
    const screw = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(12, 12, H - 60, 24), railSteel));
    screw.position.set(0, H / 2, D / 2 + 8);
    columnGroup.add(screw);
    // Ballscrew supports
    [H - 15, 15].forEach((y) => {
      const sup = addShadow(new THREE.Mesh(new THREE.BoxGeometry(24, 14, 20), bluePaint));
      sup.position.set(0, y, D / 2 + 8);
      columnGroup.add(sup);
      const brg = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(10, 10, 5, 24), darkSteel()));
      brg.position.set(0, y, D / 2 + 8);
      columnGroup.add(brg);
    });
    // Y-axis servo motor (top)
    const servo = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(22, 22, 28, 24), bluePaint));
    servo.position.set(0, H + 8, D / 2 + 8);
    columnGroup.add(servo);
    for (let i = 0; i < 6; i++) {
      const fin = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(23, 23, 1.5, 24), bluePaint));
      fin.position.set(0, H - 2 + i * 3, D / 2 + 8);
      columnGroup.add(fin);
    }
    // Counterweight cavity + chain
    const cwOpen = new THREE.Mesh(new THREE.BoxGeometry(36, 5, 24), darkSteel());
    cwOpen.position.set(0, H - 1, -12);
    columnGroup.add(cwOpen);
    for (let i = 0; i < 10; i++) {
      const link = addShadow(new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.7, 6, 12), stainless()));
      link.position.set(0, H - 8 - i * 4, -12);
      link.rotation.y = Math.PI / 2;
      columnGroup.add(link);
    }
    // Base flange
    const flange = addShadow(new THREE.Mesh(new THREE.BoxGeometry(W + 24, 12, D + 24), bluePaint));
    flange.position.y = -6;
    columnGroup.add(flange);
    // 16 base bolts
    for (let i = 0; i < 8; i++) {
      [-1, 1].forEach((s) => {
        const x = -50 + i * 14;
        const bolt = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 8, 8), darkSteel());
        bolt.position.set(x, -12, s * (D / 2 + 10));
        columnGroup.add(bolt);
      });
    }
    // 8 internal ribs
    for (let i = 0; i < 8; i++) {
      const y = 30 + i * 32;
      const rib = addShadow(new THREE.Mesh(new THREE.BoxGeometry(W - 16, 5, D - 16), bluePaint));
      rib.position.y = y;
      columnGroup.add(rib);
    }
    // 32 side cooling fins
    for (let i = 0; i < 16; i++) {
      const y = 20 + i * 16;
      [-1, 1].forEach((s) => {
        const fin = addShadow(new THREE.Mesh(new THREE.BoxGeometry(3, 12, 60), bluePaint));
        fin.position.set(s * (W / 2 + 1.5), y, 0);
        columnGroup.add(fin);
      });
    }
    // Heidenhain linear scale
    const scale = addShadow(new THREE.Mesh(new THREE.BoxGeometry(5, H - 50, 2), brass()));
    scale.position.set(W / 2 - 5, H / 2, D / 2 + 1.5);
    columnGroup.add(scale);
    const reader = addShadow(new THREE.Mesh(new THREE.BoxGeometry(8, 8, 5), darkSteel()));
    reader.position.set(W / 2 - 2, H / 2 - 40, D / 2 + 4);
    columnGroup.add(reader);
    // Hydraulic balance cylinder
    const cyl = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(6, 6, 60, 16), stainless()));
    cyl.position.set(W / 2 + 5, H / 2 + 30, -12);
    columnGroup.add(cyl);
  }
  root.add(columnGroup);

  // ========================================================================
  // 4. SPINDLE CARRIAGE (on column front face)
  // ========================================================================
  const carriageGroup = new THREE.Group();
  carriageGroup.position.set(0, 130, 50);
  {
    const body = addShadow(new THREE.Mesh(new THREE.BoxGeometry(140, 90, 80), darkFrame));
    carriageGroup.add(body);
    const back = addShadow(new THREE.Mesh(new THREE.BoxGeometry(130, 80, 5), machinedIron));
    back.position.z = -42;
    carriageGroup.add(back);
    // 4 guide blocks
    [[-50, -28], [-50, 28], [50, -28], [50, 28]].forEach(([bx, by]) => {
      const block = addShadow(new THREE.Mesh(new THREE.BoxGeometry(34, 28, 14), darkSteel()));
      block.position.set(bx, by, -44);
      carriageGroup.add(block);
      const fit = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 4, 8), brass());
      fit.position.set(bx, by, -51);
      carriageGroup.add(fit);
    });
    // Ballscrew nut
    const nut = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(16, 16, 28, 24), darkSteel()));
    nut.position.set(0, 0, -44);
    carriageGroup.add(nut);
    // Spindle bore
    const bore = new THREE.Mesh(new THREE.CylinderGeometry(35, 35, 100, 32), darkSteel());
    carriageGroup.add(bore);
    // Z-axis servo (left)
    const servo = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(26, 26, 34, 24), darkFrame));
    servo.rotation.z = Math.PI / 2;
    servo.position.set(-85, 0, 0);
    carriageGroup.add(servo);
    for (let i = 0; i < 7; i++) {
      const fin = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(27, 27, 1.5, 24), darkFrame));
      fin.rotation.z = Math.PI / 2;
      fin.position.set(-76 + i * 3, 0, 0);
      carriageGroup.add(fin);
    }
    // Coupling
    const coup = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(14, 14, 12, 16), darkSteel()));
    coup.rotation.z = Math.PI / 2;
    coup.position.set(-58, 0, 0);
    carriageGroup.add(coup);
    // Coolant manifold with 5 outlets
    const manifold = addShadow(new THREE.Mesh(new THREE.BoxGeometry(110, 7, 10), darkFrame));
    manifold.position.set(0, -42, 40);
    carriageGroup.add(manifold);
    for (let i = 0; i < 5; i++) {
      const x = -40 + i * 20;
      const outlet = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.5, 8, 12), stainless()));
      outlet.position.set(x, -47, 42);
      carriageGroup.add(outlet);
    }
    // 2 side access panels
    [-1, 1].forEach((s) => {
      const panel = addShadow(new THREE.Mesh(new THREE.BoxGeometry(3, 70, 55), machinedIron));
      panel.position.set(s * 70, 0, 0);
      carriageGroup.add(panel);
      for (let i = 0; i < 10; i++) {
        const y = -28 + i * 7;
        [-1, 1].forEach((s2) => {
          const bolt = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 4, 8), darkSteel());
          bolt.rotation.z = Math.PI / 2;
          bolt.position.set(s * 72, y, s2 * 20);
          carriageGroup.add(bolt);
        });
      }
    });
    // Hydraulic clamp
    const clamp = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(10, 10, 18, 16), stainless()));
    clamp.position.set(0, 55, 0);
    carriageGroup.add(clamp);
  }
  root.add(carriageGroup);

  // ========================================================================
  // 5. SPINDLE MOTOR + ASSEMBLY (15kW, HSK63)
  // ========================================================================
  const spindleGroup = new THREE.Group();
  spindleGroup.position.set(0, 60, 50);
  {
    // Housing
    const housing = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(38, 38, 90, 48), darkFrame));
    spindleGroup.add(housing);
    // 14 cooling fins around
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2;
      const fin = addShadow(new THREE.Mesh(new THREE.BoxGeometry(2.5, 70, 7), darkFrame));
      fin.position.set(Math.cos(a) * 39, 0, Math.sin(a) * 39);
      fin.rotation.y = a;
      spindleGroup.add(fin);
    }
    // Top cap
    const topCap = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(42, 38, 12, 48), darkFrame));
    topCap.position.y = 50;
    spindleGroup.add(topCap);
    // Terminal box
    const termBox = addShadow(new THREE.Mesh(new THREE.BoxGeometry(34, 18, 22), darkFrame));
    termBox.position.set(0, 56, 30);
    spindleGroup.add(termBox);
    // Cable gland + 6-segment cable
    const gland = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(3.5, 4.5, 7, 12), darkSteel()));
    gland.position.set(0, 56, 43);
    gland.rotation.x = Math.PI / 2;
    spindleGroup.add(gland);
    for (let i = 0; i < 6; i++) {
      const cable = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 7, 12), plastic(0x111)));
      cable.position.set(0, 62 + i * 4, 47 + i * 2);
      cable.rotation.x = 0.5;
      spindleGroup.add(cable);
    }
    // Encoder
    const enc = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(16, 16, 9, 24), darkSteel()));
    enc.position.set(0, 60, -10);
    spindleGroup.add(enc);
    // Bottom cap
    const botCap = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(44, 38, 12, 48), darkFrame));
    botCap.position.y = -50;
    spindleGroup.add(botCap);
    // Spindle nose (HSK63)
    const nose = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(32, 38, 10, 48), toolSteel));
    nose.position.y = -58;
    spindleGroup.add(nose);
    // Taper
    const taper = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(22, 32, 14, 32), darkSteel()));
    taper.position.y = -62;
    spindleGroup.add(taper);
    // Drawbar
    const drawbar = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 90, 12), toolSteel));
    drawbar.position.y = 5;
    spindleGroup.add(drawbar);
    // 14 disc springs
    for (let i = 0; i < 14; i++) {
      const spring = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(10, 10, 1.5, 16), toolSteel));
      spring.position.y = 28 - i * 2;
      spindleGroup.add(spring);
    }
    // Tool holder
    const holder = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(22, 28, 55, 32), darkSteel()));
    holder.position.y = -88;
    spindleGroup.add(holder);
    // Retention knob
    const knob = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(7, 7, 12, 12), toolSteel));
    knob.position.y = -62;
    spindleGroup.add(knob);
    // End mill
    const tool = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(7, 7, 35, 16), carbide));
    tool.position.y = -130;
    spindleGroup.add(tool);
    // 4 helical flutes
    for (let f = 0; f < 4; f++) {
      const phase = (f / 4) * Math.PI * 2;
      for (let i = 0; i < 14; i++) {
        const y = -118 - i * 2;
        const a = phase + i * 0.4;
        const flute = new THREE.Mesh(new THREE.TorusGeometry(7, 0.5, 4, 8, Math.PI * 0.5), darkSteel());
        flute.position.set(0, y, 0);
        flute.rotation.y = a;
        spindleGroup.add(flute);
      }
    }
    // Tool tip
    const tip = addShadow(new THREE.Mesh(new THREE.ConeGeometry(7, 7, 16), carbide));
    tip.position.y = -150;
    spindleGroup.add(tip);
    // 2 coolant nozzles with streams
    [-1, 1].forEach((s) => {
      const noz = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(3, 2.5, 14, 12), darkFrame));
      noz.position.set(s * 34, -32, 0);
      noz.rotation.z = s * 0.6;
      spindleGroup.add(noz);
      const stream = new THREE.Mesh(new THREE.CylinderGeometry(1, 2.5, 35, 8), coolant);
      stream.position.set(s * 25, -60, 0);
      stream.rotation.z = s * 0.4;
      spindleGroup.add(stream);
    });
    // Temperature sensor
    const sensor = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 7, 10), darkSteel()));
    sensor.position.set(-22, 34, 0);
    spindleGroup.add(sensor);
    // Nameplate
    const plate = addShadow(new THREE.Mesh(new THREE.BoxGeometry(28, 12, 0.5), brass()));
    plate.position.set(0, 0, 39);
    spindleGroup.add(plate);
  }
  root.add(spindleGroup);

  // ========================================================================
  // 6. B-AXIS TRUNNION (on bed, offset right)
  // ========================================================================
  const trunnionGroup = new THREE.Group();
  trunnionGroup.position.set(110, 28, 0);
  {
    const base = addShadow(new THREE.Mesh(new THREE.BoxGeometry(70, 14, 90), bluePaint));
    base.position.y = -42;
    trunnionGroup.add(base);
    // 10 mounting bolts
    for (let i = 0; i < 5; i++) {
      [-1, 1].forEach((s) => {
        const x = -25 + i * 12;
        const bolt = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 7, 8), darkSteel());
        bolt.position.set(x, -49, s * 35);
        trunnionGroup.add(bolt);
      });
    }
    // 2 side supports
    [-1, 1].forEach((side) => {
      const sup = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(26, 30, 12, 32), bluePaint));
      sup.rotation.z = Math.PI / 2;
      sup.position.set(side * 38, 0, 0);
      trunnionGroup.add(sup);
      const bore = new THREE.Mesh(new THREE.CylinderGeometry(18, 18, 14, 24), darkSteel());
      bore.rotation.z = Math.PI / 2;
      bore.position.set(side * 38, 0, 0);
      trunnionGroup.add(bore);
      const race = addShadow(new THREE.Mesh(new THREE.TorusGeometry(21, 2.5, 8, 32), steel()));
      race.position.set(side * 38, 0, 0);
      race.rotation.y = Math.PI / 2;
      trunnionGroup.add(race);
    });
    // Trunnion body
    const trun = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(24, 24, 70, 32), bluePaint));
    trun.rotation.z = Math.PI / 2;
    trunnionGroup.add(trun);
    const trunBore = new THREE.Mesh(new THREE.CylinderGeometry(16, 16, 74, 24), darkSteel());
    trunBore.rotation.z = Math.PI / 2;
    trunnionGroup.add(trunBore);
    // B-axis servo
    const servo = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(20, 20, 26, 24), bluePaint));
    servo.rotation.z = Math.PI / 2;
    servo.position.set(-58, 0, 0);
    trunnionGroup.add(servo);
    // Encoder
    const enc = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(14, 14, 7, 24), darkSteel()));
    enc.rotation.z = Math.PI / 2;
    enc.position.set(56, 0, 0);
    trunnionGroup.add(enc);
    // C-axis mount plate
    const plate = addShadow(new THREE.Mesh(new THREE.BoxGeometry(60, 8, 60), bluePaint));
    plate.position.y = 20;
    trunnionGroup.add(plate);
    // 8 plate bolts
    for (let i = 0; i < 4; i++) {
      [-1, 1].forEach((s) => {
        const x = -22 + i * 14;
        const bolt = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 6, 8), darkSteel());
        bolt.position.set(x, 25, s * 22);
        trunnionGroup.add(bolt);
      });
    }
    // 6-cable chain
    for (let i = 0; i < 6; i++) {
      const cable = new THREE.Mesh(
        new THREE.CylinderGeometry(1.2, 1.2, 24, 8),
        new THREE.MeshStandardMaterial({
          color: [0x000000, 0xff0000, 0x00aa00, 0x0000ff, 0xffaa00, 0xff00ff][i],
          metalness: 0.1, roughness: 0.7
        })
      );
      cable.position.set(-35, -35 - i * 2.5, 35);
      cable.rotation.z = 0.8;
      trunnionGroup.add(cable);
    }
  }
  root.add(trunnionGroup);

  // ========================================================================
  // 7. C-AXIS ROTARY TABLE (on trunnion)
  // ========================================================================
  const ctableGroup = new THREE.Group();
  ctableGroup.position.set(110, 52, 0);
  {
    // Housing
    const housing = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(55, 60, 20, 48), bluePaint));
    housing.position.y = -16;
    ctableGroup.add(housing);
    // C-axis servo
    const servo = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(18, 18, 24, 24), bluePaint));
    servo.position.y = -34;
    ctableGroup.add(servo);
    for (let i = 0; i < 5; i++) {
      const fin = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(19, 19, 1.5, 24), bluePaint));
      fin.position.y = -28 + i * 3;
      ctableGroup.add(fin);
    }
    // Table disc
    const table = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(52, 55, 14, 64), bluePaint));
    table.position.y = 7;
    ctableGroup.add(table);
    // Table top
    const top = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(51, 51, 2.5, 64), railSteel));
    top.position.y = 15;
    ctableGroup.add(top);
    // 4 T-slots
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2;
      const slot = new THREE.Mesh(new THREE.BoxGeometry(95, 3, 7), darkSteel());
      slot.position.y = 16;
      slot.rotation.y = a;
      ctableGroup.add(slot);
    }
    // Center bore
    const bore = new THREE.Mesh(new THREE.CylinderGeometry(7, 7, 18, 16), darkSteel());
    bore.position.y = 7;
    ctableGroup.add(bore);
    // 10 clamp studs
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2 + Math.PI / 20;
      const r = 35;
      const stud = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 14, 8), stainless()));
      stud.position.set(Math.cos(a) * r, 16, Math.sin(a) * r);
      ctableGroup.add(stud);
    }
    // Workpiece on table
    const wp = addShadow(new THREE.Mesh(new THREE.BoxGeometry(70, 35, 70), aluminum()));
    wp.position.y = 33;
    ctableGroup.add(wp);
    // Machined pocket
    const pocket = new THREE.Mesh(new THREE.BoxGeometry(46, 10, 46), darkSteel());
    pocket.position.y = 47;
    ctableGroup.add(pocket);
    // Island
    const island = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(10, 10, 12, 24), aluminum()));
    island.position.y = 42;
    ctableGroup.add(island);
    // 4 corner holes
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
      const r = 25;
      const hole = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.5, 40, 12), darkSteel());
      hole.position.set(Math.cos(a) * r, 33, Math.sin(a) * r);
      ctableGroup.add(hole);
      const cb = new THREE.Mesh(new THREE.CylinderGeometry(6, 6, 5, 12), darkSteel());
      cb.position.set(Math.cos(a) * r, 49, Math.sin(a) * r);
      ctableGroup.add(cb);
    }
    // 8 toolpath indicators (glowing)
    for (let i = 0; i < 8; i++) {
      const path = new THREE.Mesh(new THREE.BoxGeometry(70 - i * 5, 0.5, 0.5), cyanGlow);
      path.position.set(0, 50, -18 + i * 5);
      ctableGroup.add(path);
    }
    // C-axis encoder
    const enc = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(12, 12, 6, 24), darkSteel()));
    enc.position.set(0, -16, 55);
    ctableGroup.add(enc);
    // 10 mounting bolts
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      const r = 52;
      const bolt = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 7, 8), darkSteel());
      bolt.position.set(Math.cos(a) * r, -26, Math.sin(a) * r);
      ctableGroup.add(bolt);
    }
  }
  root.add(ctableGroup);

  // ========================================================================
  // 8. ATC MAGAZINE (24-tool, on column top, left side)
  // ========================================================================
  const magazineGroup = new THREE.Group();
  magazineGroup.position.set(-100, 280, 0);
  magazineGroup.rotation.y = Math.PI / 2;
  {
    // Housing
    const housing = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(70, 75, 35, 48), darkFrame));
    magazineGroup.add(housing);
    // Face plate
    const face = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(68, 68, 5, 48), darkFrame));
    face.position.z = 20;
    magazineGroup.add(face);
    // 24 tool pockets + holders + tools
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2;
      const r = 58;
      const pocket = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(9, 9, 14, 24), darkSteel()));
      pocket.position.set(Math.cos(a) * r, Math.sin(a) * r, 16);
      pocket.rotation.x = Math.PI / 2;
      pocket.lookAt(0, 0, 16);
      magazineGroup.add(pocket);
      const holder = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(7, 9, 22, 16), darkSteel()));
      holder.position.set(Math.cos(a) * r, Math.sin(a) * r, 30);
      holder.lookAt(0, 0, 30 + 22);
      holder.rotateX(Math.PI / 2);
      magazineGroup.add(holder);
      const toolLen = 14 + (i % 4) * 3;
      const toolR = 2.5 + (i % 3) * 0.5;
      const tool = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(toolR, toolR, toolLen, 12), toolSteel));
      tool.position.set(Math.cos(a) * r, Math.sin(a) * r, 30 + toolLen / 2 + 11);
      tool.lookAt(0, 0, 30 + toolLen + 11);
      tool.rotateX(Math.PI / 2);
      magazineGroup.add(tool);
      const label = new THREE.Mesh(
        new THREE.SphereGeometry(1.8, 8, 8),
        new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0x442200 })
      );
      label.position.set(Math.cos(a) * (r - 14), Math.sin(a) * (r - 14), 20);
      magazineGroup.add(label);
    }
    // Servo motor (back)
    const servo = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(24, 24, 30, 24), darkFrame));
    servo.rotation.x = Math.PI / 2;
    servo.position.z = -22;
    magazineGroup.add(servo);
    for (let i = 0; i < 6; i++) {
      const fin = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(25, 25, 1.5, 24), darkFrame));
      fin.rotation.x = Math.PI / 2;
      fin.position.z = -14 + i * 3;
      magazineGroup.add(fin);
    }
    // Mounting bracket
    const bracket = addShadow(new THREE.Mesh(new THREE.BoxGeometry(48, 24, 10), darkFrame));
    bracket.position.y = 75;
    magazineGroup.add(bracket);
    [-15, 15].forEach((x) => {
      [-1, 1].forEach((s) => {
        const bolt = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 7, 8), darkSteel());
        bolt.position.set(x, 75, s * 7);
        magazineGroup.add(bolt);
      });
    });
    // Tool-setter probe
    const probe = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(10, 12, 18, 16), darkFrame));
    probe.position.set(80, -45, 12);
    magazineGroup.add(probe);
    const probeTip = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(4, 4, 3, 12), redGlow));
    probeTip.position.set(80, -54, 12);
    magazineGroup.add(probeTip);
  }
  root.add(magazineGroup);

  // ========================================================================
  // 9. ATC ARM (between magazine and spindle)
  // ========================================================================
  const atcArmGroup = new THREE.Group();
  atcArmGroup.position.set(-55, 180, 0);
  {
    const base = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(20, 22, 16, 24), darkFrame));
    atcArmGroup.add(base);
    const flange = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(26, 26, 4, 24), darkFrame));
    flange.position.y = -10;
    atcArmGroup.add(flange);
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const bolt = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 6, 8), darkSteel());
      bolt.position.set(Math.cos(a) * 20, -12, Math.sin(a) * 20);
      atcArmGroup.add(bolt);
    }
    const shaft = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(10, 10, 24, 16), toolSteel));
    shaft.position.y = 20;
    atcArmGroup.add(shaft);
    const arm = addShadow(new THREE.Mesh(new THREE.BoxGeometry(95, 10, 14), darkFrame));
    arm.position.y = 30;
    atcArmGroup.add(arm);
    // 2 grippers
    [-48, 48].forEach((x) => {
      const grip = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(12, 14, 16, 16), darkFrame));
      grip.position.set(x, 30, 0);
      atcArmGroup.add(grip);
      [-1, 1].forEach((s) => {
        const claw = addShadow(new THREE.Mesh(new THREE.BoxGeometry(5, 14, 5), darkFrame));
        claw.position.set(x + s * 7, 30, 0);
        atcArmGroup.add(claw);
      });
      const held = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(7, 9, 22, 16), darkSteel()));
      held.position.set(x, 30, 0);
      atcArmGroup.add(held);
      const tool = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.5, 18, 12), toolSteel));
      tool.position.set(x, 17, 0);
      atcArmGroup.add(tool);
      [-1, 1].forEach((s) => {
        const spring = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 10, 8), toolSteel);
        spring.position.set(x + s * 9, 34, 0);
        atcArmGroup.add(spring);
      });
    });
    // 3 cables
    for (let i = 0; i < 3; i++) {
      const cable = new THREE.Mesh(
        new THREE.CylinderGeometry(1, 1, 14, 8),
        new THREE.MeshStandardMaterial({
          color: [0x000000, 0xff0000, 0x00aa00][i],
          metalness: 0.1, roughness: 0.7
        })
      );
      cable.position.set(-5 + i * 5, -18, 0);
      atcArmGroup.add(cable);
    }
  }
  root.add(atcArmGroup);

  // ========================================================================
  // 10. COOLANT SYSTEM (behind machine)
  // ========================================================================
  const coolantGroup = new THREE.Group();
  coolantGroup.position.set(-200, -35, 0);
  {
    const tank = addShadow(new THREE.Mesh(new THREE.BoxGeometry(70, 45, 45), new THREE.MeshStandardMaterial({ color: 0x166534, metalness: 0.4, roughness: 0.6 })));
    coolantGroup.add(tank);
    const lid = addShadow(new THREE.Mesh(new THREE.BoxGeometry(74, 5, 49), new THREE.MeshStandardMaterial({ color: 0x166534, metalness: 0.4, roughness: 0.6 })));
    lid.position.y = 25;
    coolantGroup.add(lid);
    for (let i = 0; i < 4; i++) {
      [-1, 1].forEach((s) => {
        const x = -28 + i * 18;
        const bolt = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 5, 8), darkSteel());
        bolt.position.set(x, 28, s * 20);
        coolantGroup.add(bolt);
      });
    }
    // Sight glass
    const sight = new THREE.Mesh(new THREE.BoxGeometry(2, 34, 9), new THREE.MeshStandardMaterial({ color: 0x84cc16, transparent: true, opacity: 0.6 }));
    sight.position.set(36, 0, 0);
    coolantGroup.add(sight);
    // Pump
    const pump = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(12, 14, 18, 16), new THREE.MeshStandardMaterial({ color: 0x166534, metalness: 0.4, roughness: 0.6 })));
    pump.position.set(-18, 35, 0);
    coolantGroup.add(pump);
    const pumpMotor = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(10, 12, 16, 16), new THREE.MeshStandardMaterial({ color: 0x166534, metalness: 0.4, roughness: 0.6 })));
    pumpMotor.position.set(-18, 49, 0);
    coolantGroup.add(pumpMotor);
    // Pipe + 7-segment hose
    const pipe = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(4, 4, 35, 12), stainless()));
    pipe.position.set(-18, 70, 0);
    coolantGroup.add(pipe);
    for (let i = 0; i < 7; i++) {
      const seg = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(4, 4, 9, 12), new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.2, roughness: 0.7 })));
      seg.position.set(-18 + i * 6, 80 - i * 3.5, 0);
      seg.rotation.z = -0.6;
      coolantGroup.add(seg);
    }
    // Filter
    const filter = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(10, 10, 24, 16), new THREE.MeshStandardMaterial({ color: 0x166534, metalness: 0.4, roughness: 0.6 })));
    filter.position.set(24, 6, 24);
    filter.rotation.z = Math.PI / 2;
    coolantGroup.add(filter);
    // Pressure gauge
    const gauge = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(6, 6, 4, 16), darkSteel()));
    gauge.position.set(12, 30, 22);
    coolantGroup.add(gauge);
    const gFace = new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 0.5, 16), new THREE.MeshStandardMaterial({ color: 0xffffff }));
    gFace.position.set(12, 30, 24.5);
    coolantGroup.add(gFace);
    const needle = new THREE.Mesh(new THREE.BoxGeometry(0.4, 3.5, 0.4), redGlow);
    needle.position.set(12, 31.2, 24.8);
    needle.rotation.z = 0.5;
    coolantGroup.add(needle);
    // Drain valve
    const valve = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.5, 7, 8), darkSteel()));
    valve.position.set(36, -18, 0);
    valve.rotation.z = Math.PI / 2;
    coolantGroup.add(valve);
    const handle = addShadow(new THREE.Mesh(new THREE.BoxGeometry(10, 1.5, 2.5), darkSteel()));
    handle.position.set(42, -18, 0);
    coolantGroup.add(handle);
  }
  root.add(coolantGroup);

  // ========================================================================
  // 11. CONTROL CABINET (right side)
  // ========================================================================
  const cabinetGroup = new THREE.Group();
  cabinetGroup.position.set(220, 0, 0);
  cabinetGroup.rotation.y = -Math.PI / 2;
  {
    const body = addShadow(new THREE.Mesh(new THREE.BoxGeometry(70, 140, 35), new THREE.MeshStandardMaterial({ color: 0x9ca3af, metalness: 0.5, roughness: 0.5 })));
    cabinetGroup.add(body);
    const door = addShadow(new THREE.Mesh(new THREE.BoxGeometry(66, 136, 3), new THREE.MeshStandardMaterial({ color: 0x9ca3af, metalness: 0.5, roughness: 0.5 })));
    door.position.z = 19;
    cabinetGroup.add(door);
    // Handle
    const handle = addShadow(new THREE.Mesh(new THREE.BoxGeometry(4, 20, 3), darkSteel()));
    handle.position.set(28, 0, 21);
    cabinetGroup.add(handle);
    // 2 hinges
    [-58, 58].forEach((y) => {
      const hinge = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 10, 8), darkSteel()));
      hinge.position.set(-32, y, 20);
      hinge.rotation.z = Math.PI / 2;
      cabinetGroup.add(hinge);
    });
    // 10 door bolts
    for (let i = 0; i < 5; i++) {
      const y = -58 + i * 29;
      [-1, 1].forEach((s) => {
        const bolt = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 4, 8), darkSteel());
        bolt.position.set(s * 28, y, 21);
        cabinetGroup.add(bolt);
      });
    }
    // HMI panel (lit cyan)
    const hmi = addShadow(new THREE.Mesh(new THREE.BoxGeometry(42, 32, 2), darkSteel()));
    hmi.position.set(0, 35, 21);
    cabinetGroup.add(hmi);
    const screen = new THREE.Mesh(new THREE.BoxGeometry(38, 28, 0.6), cyanGlow);
    screen.position.set(0, 35, 22.2);
    cabinetGroup.add(screen);
    // E-stop
    const estop = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(7, 8, 5, 16), redGlow));
    estop.position.set(24, -45, 21);
    cabinetGroup.add(estop);
    const bezel = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(10, 10, 2.5, 16), darkSteel()));
    bezel.position.set(24, -45, 20);
    cabinetGroup.add(bezel);
    // 3 status LEDs
    [-9, 0, 9].forEach((x, i) => {
      const led = new THREE.Mesh(
        new THREE.CylinderGeometry(1.8, 1.8, 1.2, 12),
        new THREE.MeshStandardMaterial({
          color: [0x10b981, 0xf59e0b, 0xef4444][i],
          emissive: [0x10b981, 0xf59e0b, 0xef4444][i],
          emissiveIntensity: 0.6
        })
      );
      led.position.set(x, -45, 21);
      cabinetGroup.add(led);
    });
    // Mode selector
    const modeSw = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.5, 2.5, 12), darkSteel()));
    modeSw.position.set(-18, -45, 21);
    cabinetGroup.add(modeSw);
    const knob = addShadow(new THREE.Mesh(new THREE.BoxGeometry(6, 2, 2), darkSteel()));
    knob.position.set(-18, -45, 22.3);
    cabinetGroup.add(knob);
    // Keylock
    const key = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.5, 2, 8), darkSteel()));
    key.position.set(24, -28, 21);
    cabinetGroup.add(key);
    // 2 cooling fans
    for (let i = 0; i < 2; i++) {
      const fan = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(10, 10, 4, 16), darkSteel()));
      fan.position.set(-15 + i * 30, 68, 0);
      cabinetGroup.add(fan);
      for (let j = 0; j < 6; j++) {
        const blade = new THREE.Mesh(new THREE.BoxGeometry(8, 0.6, 1.2), darkSteel());
        blade.position.set(-15 + i * 30, 68, 2);
        blade.rotation.y = (j / 6) * Math.PI * 2;
        cabinetGroup.add(blade);
      }
    }
    // 20 vent louvers
    for (let i = 0; i < 10; i++) {
      const y = -45 + i * 13;
      [-1, 1].forEach((s) => {
        const louver = addShadow(new THREE.Mesh(new THREE.BoxGeometry(2.5, 5, 24), darkFrame));
        louver.position.set(s * 35, y, 0);
        cabinetGroup.add(louver);
      });
    }
    // 7 cable glands
    for (let i = 0; i < 7; i++) {
      const x = -24 + i * 8;
      const gland = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(2.5, 3, 5, 12), darkSteel()));
      gland.position.set(x, -70, 0);
      cabinetGroup.add(gland);
    }
    // Main disconnect with yellow handle
    const disc = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(10, 10, 7, 12), darkSteel()));
    disc.position.set(-35, 35, 0);
    disc.rotation.z = Math.PI / 2;
    cabinetGroup.add(disc);
    const discHandle = addShadow(new THREE.Mesh(new THREE.BoxGeometry(2.5, 14, 2.5), yellowMat));
    discHandle.position.set(-38, 35, 0);
    cabinetGroup.add(discHandle);
    // Nameplate
    const plate = addShadow(new THREE.Mesh(new THREE.BoxGeometry(24, 10, 0.4), brass()));
    plate.position.set(0, 58, 21);
    cabinetGroup.add(plate);
  }
  root.add(cabinetGroup);

  // ========================================================================
  // 12. CHIP CONVEYOR (in front of bed)
  // ========================================================================
  const conveyorGroup = new THREE.Group();
  conveyorGroup.position.set(0, -100, 150);
  {
    const body = addShadow(new THREE.Mesh(new THREE.BoxGeometry(90, 22, 34), darkFrame));
    conveyorGroup.add(body);
    // 24 hinge belt segments
    for (let i = 0; i < 24; i++) {
      const x = -42 + i * 3.5;
      const seg = addShadow(new THREE.Mesh(new THREE.BoxGeometry(3, 2.5, 32), stainless()));
      seg.position.set(x, 9, 0);
      conveyorGroup.add(seg);
    }
    // 2 sprockets
    [-42, 42].forEach((x) => {
      const sp = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(9, 9, 32, 16), darkSteel()));
      sp.rotation.x = Math.PI / 2;
      sp.position.set(x, 9, 0);
      conveyorGroup.add(sp);
    });
    // Drive motor
    const motor = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(9, 11, 16, 16), darkFrame));
    motor.position.set(-42, 9, 23);
    conveyorGroup.add(motor);
    // 25 metal chips
    for (let i = 0; i < 25; i++) {
      const chip = new THREE.Mesh(
        new THREE.BoxGeometry(1 + Math.random() * 2.5, 0.6 + Math.random(), 1 + Math.random() * 2.5),
        new THREE.MeshStandardMaterial({ color: 0xc0c0c0, metalness: 0.9, roughness: 0.3 })
      );
      chip.position.set(-32 + Math.random() * 64, 11 + Math.random() * 2, -12 + Math.random() * 24);
      chip.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      conveyorGroup.add(chip);
    }
    // 2 legs
    [-32, 32].forEach((x) => {
      const leg = addShadow(new THREE.Mesh(new THREE.BoxGeometry(5, 22, 5), darkFrame));
      leg.position.set(x, -22, 0);
      conveyorGroup.add(leg);
    });
    // 6 drain holes
    for (let i = 0; i < 6; i++) {
      const x = -32 + i * 13;
      const hole = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.5, 5, 12), darkSteel());
      hole.position.set(x, -11, 0);
      conveyorGroup.add(hole);
    }
    // Discharge chute + bucket
    const chute = addShadow(new THREE.Mesh(new THREE.BoxGeometry(18, 12, 34), darkFrame));
    chute.position.set(54, -3, 0);
    chute.rotation.z = -0.4;
    conveyorGroup.add(chute);
    const bucket = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(14, 12, 20, 16), darkFrame));
    bucket.position.set(68, -17, 0);
    conveyorGroup.add(bucket);
  }
  root.add(conveyorGroup);

  // ========================================================================
  // 13. STANDALONE TOOL HOLDER (on floor, left side)
  // ========================================================================
  const thGroup = new THREE.Group();
  thGroup.position.set(-200, -65, 100);
  {
    const taper = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(22, 28, 34, 32), darkSteel()));
    thGroup.add(taper);
    const flange = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(32, 32, 7, 32), darkSteel()));
    flange.position.y = 20;
    thGroup.add(flange);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const slot = new THREE.Mesh(new THREE.BoxGeometry(0.5, 5, 9), darkSteel());
      slot.position.set(Math.cos(a) * 30, 20, Math.sin(a) * 30);
      slot.rotation.y = a + Math.PI / 2;
      thGroup.add(slot);
    }
    const knob = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(6, 7, 14, 12), toolSteel));
    knob.position.y = 30;
    thGroup.add(knob);
    const thread = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 9, 12), toolSteel));
    thread.position.y = 40;
    thGroup.add(thread);
    const shank = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(17, 22, 28, 24), darkSteel()));
    shank.position.y = -31;
    thGroup.add(shank);
    const nut = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(20, 20, 9, 16), darkSteel()));
    nut.position.y = -48;
    thGroup.add(nut);
    for (let i = 0; i < 28; i++) {
      const a = (i / 28) * Math.PI * 2;
      const rib = new THREE.Mesh(new THREE.BoxGeometry(0.6, 7, 1.2), darkSteel());
      rib.position.set(Math.cos(a) * 20, -48, Math.sin(a) * 20);
      rib.rotation.y = a;
      thGroup.add(rib);
    }
    const tool = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(7, 7, 40, 16), toolSteel));
    tool.position.y = -75;
    thGroup.add(tool);
    for (let f = 0; f < 4; f++) {
      const phase = (f / 4) * Math.PI * 2;
      for (let i = 0; i < 18; i++) {
        const y = -58 - i * 2;
        const a = phase + i * 0.4;
        const flute = new THREE.Mesh(new THREE.TorusGeometry(7, 0.5, 4, 8, Math.PI * 0.5), darkSteel());
        flute.position.set(0, y, 0);
        flute.rotation.y = a;
        thGroup.add(flute);
      }
    }
    const tip = addShadow(new THREE.Mesh(new THREE.ConeGeometry(7, 7, 16), toolSteel));
    tip.position.y = -97;
    thGroup.add(tip);
    const band = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(17.5, 17.5, 2.5, 24), new THREE.MeshStandardMaterial({ color: 0x3b82f6, metalness: 0.4, roughness: 0.4 })));
    band.position.y = -18;
    thGroup.add(band);
  }
  root.add(thGroup);

  // ========================================================================
  // 14. STANDALONE WORKPIECE (on floor, left-back)
  // ========================================================================
  const wpGroup = new THREE.Group();
  wpGroup.position.set(-200, -65, -100);
  {
    const base = addShadow(new THREE.Mesh(new THREE.BoxGeometry(80, 40, 80), aluminum()));
    wpGroup.add(base);
    // Contoured top
    const topShape = new THREE.Shape();
    topShape.moveTo(-40, -40);
    topShape.bezierCurveTo(-40, -20, -30, 20, 0, 25);
    topShape.bezierCurveTo(30, 20, 40, -20, 40, -40);
    topShape.lineTo(-40, -40);
    const topGeom = new THREE.ExtrudeGeometry(topShape, { depth: 22, bevelEnabled: true, bevelSize: 1, bevelThickness: 1, bevelSegments: 2 });
    const top = addShadow(new THREE.Mesh(topGeom, aluminum()));
    top.position.y = 18;
    top.rotation.x = -Math.PI / 2;
    wpGroup.add(top);
    // Central bore
    const bore = new THREE.Mesh(new THREE.CylinderGeometry(11, 11, 60, 32), darkSteel());
    wpGroup.add(bore);
    const cb = new THREE.Mesh(new THREE.CylinderGeometry(16, 16, 9, 32), darkSteel());
    cb.position.y = 24;
    wpGroup.add(cb);
    // 4 corner holes
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
      const r = 30;
      const hole = new THREE.Mesh(new THREE.CylinderGeometry(4.5, 4.5, 50, 12), darkSteel());
      hole.position.set(Math.cos(a) * r, 0, Math.sin(a) * r);
      wpGroup.add(hole);
      const ccb = new THREE.Mesh(new THREE.CylinderGeometry(7, 7, 7, 12), darkSteel());
      ccb.position.set(Math.cos(a) * r, 18, Math.sin(a) * r);
      wpGroup.add(ccb);
    }
    // Side pocket
    const pocket = new THREE.Mesh(new THREE.BoxGeometry(32, 22, 11), darkSteel());
    pocket.position.set(35, -5, 0);
    wpGroup.add(pocket);
    const boss = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 9, 12), aluminum()));
    boss.position.set(35, -3, 0);
    wpGroup.add(boss);
    // 10 linear toolpath indicators
    for (let i = 0; i < 10; i++) {
      const path = new THREE.Mesh(new THREE.BoxGeometry(75 - i * 5, 0.4, 0.4), cyanGlow);
      path.position.set(0, 20, -22 + i * 5);
      wpGroup.add(path);
    }
    // 24-segment spiral toolpath
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 4;
      const r = 28 - i * 1.1;
      const seg = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.4, 0.4), cyanGlow);
      seg.position.set(Math.cos(a) * r, 26, Math.sin(a) * r);
      seg.rotation.y = a;
      wpGroup.add(seg);
    }
  }
  root.add(wpGroup);

  return root;
}
