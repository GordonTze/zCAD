// ====================== F1 CAR (EXPLODED VIEW) ======================
// A modern Formula 1 car with all major components separated in an exploded view.
// Components are laid out vertically along the Y axis so every part is visible.
//
// Scale: 10 units = 1 meter. F1 car length ~5.5m, width ~2m, height ~1m.

import * as THREE from 'three';
import { addShadow } from './materials-dsl';

function carbonFiberTexture(): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#1a1a1e';
  ctx.fillRect(0, 0, size, size);
  const cell = 16;
  for (let x = 0; x < size; x += cell) {
    for (let y = 0; y < size; y += cell) {
      const g1 = ctx.createLinearGradient(x, y, x + cell, y + cell);
      g1.addColorStop(0, '#2a2a2e'); g1.addColorStop(0.5, '#3a3a3e'); g1.addColorStop(1, '#1a1a1e');
      ctx.fillStyle = g1;
      ctx.fillRect(x, y, cell / 2 - 0.5, cell / 2 - 0.5);
      ctx.fillRect(x + cell / 2, y + cell / 2, cell / 2 - 0.5, cell / 2 - 0.5);
      const g2 = ctx.createLinearGradient(x + cell / 2, y, x, y + cell / 2);
      g2.addColorStop(0, '#252528'); g2.addColorStop(0.5, '#353538'); g2.addColorStop(1, '#1a1a1e');
      ctx.fillStyle = g2;
      ctx.fillRect(x + cell / 2, y, cell / 2 - 0.5, cell / 2 - 0.5);
      ctx.fillRect(x, y + cell / 2, cell / 2 - 0.5, cell / 2 - 0.5);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping; tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  return tex;
}

function tireTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 80; i++) {
    ctx.strokeStyle = `rgba(${30 + Math.random() * 20},${30 + Math.random() * 20},${30 + Math.random() * 20},0.3)`;
    ctx.lineWidth = 1 + Math.random();
    ctx.beginPath();
    const y = Math.random() * size;
    ctx.moveTo(0, y);
    ctx.lineTo(size, y + (Math.random() - 0.5) * 6);
    ctx.stroke();
  }
  ctx.fillStyle = 'rgba(180,180,180,0.15)';
  ctx.fillRect(40, size / 2 - 15, size - 80, 30);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Sponsorship/number decal texture
function decalTexture(text: string, bg: string, fg: string): THREE.CanvasTexture {
  const w = 128, h = 64;
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = fg;
  ctx.font = 'bold 32px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, w / 2, h / 2 + 2);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createF1CarGeometry(exploded = true): THREE.Group {
  const root = new THREE.Group();

  // Y positions for each component — assembled (on the car) vs exploded (separated)
  // When exploded, components are spread along Y for visibility.
  // When assembled, components are at their correct positions on a real F1 car.
  const Y = exploded ? {
    floor: 0, frontWing: 12, frontWheels: 22, frontSusp: 32, nose: 42,
    mono: 52, sidePods: 62, bargeboards: 62, engCover: 72, powerUnit: 82,
    exhaust: 88, rearSusp: 92, rearWheels: 92, rearWing: 102, tWing: 112,
    halo: 55, steering: 54, seat: 52, headrest: 56, hans: 55,
    cockpit: 53, rollHoop: 56, mirrors: 55,
  } : {
    floor: 0, frontWing: 0.5, frontWheels: 3.5, frontSusp: 2.5, nose: 1.5,
    mono: 2.5, sidePods: 2, bargeboards: 2, engCover: 3.5, powerUnit: 2.5,
    exhaust: 3.5, rearSusp: 3.5, rearWheels: 3.8, rearWing: 5, tWing: 5.5,
    halo: 3.5, steering: 2.5, seat: 2, headrest: 3.5, hans: 3,
    cockpit: 3, rollHoop: 4, mirrors: 3.5,
  };

  const carbonTex = carbonFiberTexture();
  carbonTex.repeat.set(3, 3);
  const carbonMat = new THREE.MeshStandardMaterial({ map: carbonTex, metalness: 0.5, roughness: 0.4 });
  const carbonMatFlat = new THREE.MeshStandardMaterial({ color: 0x1a1a1e, metalness: 0.4, roughness: 0.5 });
  const tireTex = tireTexture();
  const tireMat = new THREE.MeshStandardMaterial({ map: tireTex, color: 0x1a1a1a, metalness: 0.1, roughness: 0.9 });
  const rimMat = new THREE.MeshStandardMaterial({ color: 0x8a8a92, metalness: 0.9, roughness: 0.15 });
  const brakeMat = new THREE.MeshStandardMaterial({ color: 0x4a4a52, metalness: 0.7, roughness: 0.3 });
  const brakeDiscMat = new THREE.MeshStandardMaterial({ color: 0x8a5a3a, metalness: 0.6, roughness: 0.4 });
  const suspensionMat = new THREE.MeshStandardMaterial({ color: 0x3a3a40, metalness: 0.8, roughness: 0.3 });
  const accentRedMat = new THREE.MeshStandardMaterial({ color: 0xc0202a, metalness: 0.6, roughness: 0.3 });
  const accentBlueMat = new THREE.MeshStandardMaterial({ color: 0x1a4aaa, metalness: 0.6, roughness: 0.3 });
  const accentGreenMat = new THREE.MeshStandardMaterial({ color: 0x00a060, metalness: 0.5, roughness: 0.3 });
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xc09545, metalness: 0.9, roughness: 0.2 });
  const seatMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1e, metalness: 0.2, roughness: 0.8 });
  const engineMat = new THREE.MeshStandardMaterial({ color: 0x6a6a72, metalness: 0.8, roughness: 0.3 });
  const titaniumMat = new THREE.MeshStandardMaterial({ color: 0x9a9aa2, metalness: 0.7, roughness: 0.35 });
  // Hoisted wheel detail materials (avoid duplicate creation in wheel loops)
  const wheelNutMat = new THREE.MeshStandardMaterial({ color: 0xc02020, metalness: 0.6, roughness: 0.3 });
  const pistonMat = new THREE.MeshStandardMaterial({ color: 0x4a4a52, metalness: 0.8, roughness: 0.2 });
  const tetherMat = new THREE.MeshStandardMaterial({ color: 0xc02020, roughness: 0.7 });
  const damperMat = new THREE.MeshStandardMaterial({ color: 0x6a6a72, metalness: 0.7, roughness: 0.3 });
  const sparkPlugMat = new THREE.MeshStandardMaterial({ color: 0xc0c0c8, metalness: 0.9, roughness: 0.1 });
  const manifoldMat = new THREE.MeshStandardMaterial({ color: 0x8a5a3a, metalness: 0.7, roughness: 0.3 });

  // ============================================================
  // 1. FLOOR / UNDERBODY + DIFFUSER (Y=0)
  // ============================================================
  const floor = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(18, 0.5, 35), carbonMatFlat
  ));
  floor.position.set(0, 0, 0);
  root.add(floor);
  // Plank
  const plank = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(2, 0.3, 30),
    new THREE.MeshStandardMaterial({ color: 0x8a6a4a, roughness: 0.8 })
  ));
  plank.position.set(0, -0.4, 0);
  root.add(plank);
  // Diffuser — angled vanes at rear
  for (let i = -3; i <= 3; i++) {
    const vane = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 3.5, 7), carbonMatFlat
    ));
    vane.position.set(i * 2.2, 1.75, 16);
    vane.rotation.x = -0.35;
    root.add(vane);
  }
  // Diffuser outer walls
  for (const dx of [-7, 7]) {
    const wall = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 4, 8), carbonMat
    ));
    wall.position.set(dx, 2, 16);
    wall.rotation.x = -0.25;
    root.add(wall);
  }
  // Floor edge wings (turning vanes on the floor edges)
  for (const fx of [-8, 8]) {
    for (let f = 0; f < 3; f++) {
      const edgeWing = addShadow(new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 2, 2.5), carbonMat
      ));
      edgeWing.position.set(fx, 1, -8 + f * 5);
      edgeWing.rotation.y = 0.15;
      root.add(edgeWing);
    }
  }
  // Front floor splitter
  const splitter = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(16, 0.3, 3), carbonMat
  ));
  splitter.position.set(0, 0.3, -16);
  root.add(splitter);

  // ============================================================
  // 2. FRONT WING ASSEMBLY (Y=12)
  // ============================================================
  const fwY = Y.frontWing;
  // Mainplane
  const fwMain = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(20, 0.5, 4), carbonMat
  ));
  fwMain.position.set(0, fwY, -18);
  root.add(fwMain);
  // 2nd element (flap)
  const fwFlap = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(20, 0.4, 2), carbonMat
  ));
  fwFlap.position.set(0, fwY + 1, -17);
  root.add(fwFlap);
  // 3rd element (upper flap)
  const fwFlap2 = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(18, 0.3, 1.5), carbonMat
  ));
  fwFlap2.position.set(0, fwY + 1.8, -16.5);
  root.add(fwFlap2);
  // 4th element (top flap / cascade)
  const fwCascade = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(14, 0.25, 1), carbonMat
  ));
  fwCascade.position.set(0, fwY + 2.5, -16);
  root.add(fwCascade);
  // Endplates (2x) — tall with cutouts
  for (const ex of [-10, 10]) {
    const ep = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 5, 6), carbonMat
    ));
    ep.position.set(ex, fwY + 0.5, -17);
    root.add(ep);
    // Endplate cascade (small winglet on top of endplate)
    const winglet = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 2, 2), carbonMat
    ));
    winglet.position.set(ex, fwY + 3.5, -16);
    winglet.rotation.y = 0.2;
    root.add(winglet);
    // Endplate strake (vertical fin under endplate)
    const strake = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 2, 1), carbonMat
    ));
    strake.position.set(ex, fwY - 1.5, -19);
    root.add(strake);
  }
  // Under-wing strakes (5 vertical vanes under the mainplane)
  for (let s = -2; s <= 2; s++) {
    const strake = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(0.15, 1, 3), carbonMat
    ));
    strake.position.set(s * 4, fwY - 0.5, -18);
    root.add(strake);
  }
  // Wing pillars (connect to nose — 2x)
  for (const px of [-2.5, 2.5]) {
    const pillar = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(0.25, 0.3, 3, 6), carbonMat
    ));
    pillar.position.set(px, fwY + 1.5, -19.5);
    root.add(pillar);
  }

  // ============================================================
  // 3. FRONT WHEELS (Y=22) — 2x
  // ============================================================
  for (const wx of [-9, 9]) {
    // Tire (torus)
    const tire = addShadow(new THREE.Mesh(
      new THREE.TorusGeometry(3.5, 1.5, 16, 24), tireMat
    ));
    tire.rotation.y = Math.PI / 2;
    tire.position.set(wx, Y.frontWheels, -14);
    root.add(tire);
    // Tire inner (fill the hole)
    const tireInner = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(2, 2, 2.5, 16), tireMat
    ));
    tireInner.rotation.z = Math.PI / 2;
    tireInner.position.set(wx, Y.frontWheels, -14);
    root.add(tireInner);
    // Rim (center hub)
    const rim = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(2.5, 2.5, 2, 16), rimMat
    ));
    rim.rotation.z = Math.PI / 2;
    rim.position.set(wx, Y.frontWheels, -14);
    root.add(rim);
    // Rim spokes (8x — F1 wheel design)
    for (let sp = 0; sp < 8; sp++) {
      const spoke = addShadow(new THREE.Mesh(
        new THREE.BoxGeometry(1.8, 0.3, 0.3), rimMat
      ));
      spoke.position.set(wx, Y.frontWheels, -14);
      spoke.rotation.z = (sp / 8) * Math.PI * 2;
      root.add(spoke);
    }
    // Wheel nut (center)
    const nut = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.5, 0.8, 6),
      wheelNutMat
    ));
    nut.rotation.z = Math.PI / 2;
    nut.position.set(wx, Y.frontWheels, -14);
    root.add(nut);
    // Brake disc
    const brake = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(2.8, 2.8, 0.5, 16), brakeDiscMat
    ));
    brake.rotation.z = Math.PI / 2;
    brake.position.set(wx, Y.frontWheels, -14);
    root.add(brake);
    // Brake disc vanes (radial cooling vanes)
    for (let v = 0; v < 12; v++) {
      const vane = addShadow(new THREE.Mesh(
        new THREE.BoxGeometry(2, 0.15, 0.3), brakeMat
      ));
      vane.position.set(wx, Y.frontWheels, -14);
      vane.rotation.z = (v / 12) * Math.PI * 2;
      root.add(vane);
    }
    // Brake caliper (6-piston)
    const caliper = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(2.5, 2, 2), accentRedMat
    ));
    caliper.position.set(wx, 25, -14);
    root.add(caliper);
    // Caliper pistons (3 visible dots)
    for (let p = 0; p < 3; p++) {
      const piston = addShadow(new THREE.Mesh(
        new THREE.CylinderGeometry(0.25, 0.25, 0.3, 8),
        pistonMat
      ));
      piston.rotation.z = Math.PI / 2;
      piston.position.set(wx, 24 + p * 0.8, -13);
      root.add(piston);
    }
    // Brake duct (carbon fiber scoop)
    const duct = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(1, 3, 2), carbonMat
    ));
    duct.position.set(wx, Y.frontWheels, -16);
    root.add(duct);
    // Wheel tether (safety cable)
    const tether = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 4, 4),
      tetherMat
    ));
    tether.rotation.z = Math.PI / 2;
    tether.position.set(wx, 24, -13);
    root.add(tether);
  }

  // ============================================================
  // 4. FRONT SUSPENSION (Y=32)
  // ============================================================
  // Pushrod (torsion bar spring)
  const pushrod = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(0.4, 0.4, 10, 8), suspensionMat
  ));
  pushrod.position.set(0, Y.frontSusp, -14);
  pushrod.rotation.x = Math.PI / 4;
  root.add(pushrod);
  // Pushrod end fittings
  for (const [px, py, pz] of [[0, 28, -16], [0, 36, -12]] as [number, number, number][]) {
    const fitting = addShadow(new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 8, 6), titaniumMat
    ));
    fitting.position.set(px, py, pz);
    root.add(fitting);
  }
  // Upper wishbone (A-arm — 2 tubes forming a V)
  for (const wx of [-9, 9]) {
    for (const arm of [-1, 1]) {
      const wishbone = addShadow(new THREE.Mesh(
        new THREE.CylinderGeometry(0.25, 0.25, 8, 6), suspensionMat
      ));
      wishbone.position.set(wx * 0.5, Y.frontSusp, -14);
      wishbone.rotation.z = Math.PI / 2 + arm * 0.3;
      wishbone.rotation.x = 0.2;
      root.add(wishbone);
    }
    // Wishbone pickup points (rose joints)
    const joint = addShadow(new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 6, 4), titaniumMat
    ));
    joint.position.set(wx, Y.frontSusp, -14);
    root.add(joint);
  }
  // Lower wishbone
  for (const wx of [-9, 9]) {
    for (const arm of [-1, 1]) {
      const wishbone = addShadow(new THREE.Mesh(
        new THREE.CylinderGeometry(0.25, 0.25, 7, 6), suspensionMat
      ));
      wishbone.position.set(wx * 0.5, Y.frontSusp - 2, -14);
      wishbone.rotation.z = Math.PI / 2 + arm * 0.25;
      wishbone.rotation.x = -0.2;
      root.add(wishbone);
    }
  }
  // Steering arm (track rod)
  const steerArm = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.2, 7, 6), suspensionMat
  ));
  steerArm.position.set(5, Y.frontSusp, -16);
  steerArm.rotation.z = -0.4;
  root.add(steerArm);
  // Steering rack
  const rack = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(8, 0.8, 0.8), suspensionMat
  ));
  rack.position.set(0, Y.frontSusp + 1, -15);
  root.add(rack);
  // Dampers (shock absorbers — 2x torsion bar covers)
  for (const dx of [-2, 2]) {
    const damper = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(0.6, 0.6, 3, 8),
      damperMat
    ));
    damper.position.set(dx, Y.frontSusp + 2, -13);
    damper.rotation.x = 0.3;
    root.add(damper);
  }

  // ============================================================
  // 5. NOSE CONE (Y=42)
  // ============================================================
  // Main nose structure (tapered, sculpted)
  const nose = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(0.8, 0.4, 8, 8), carbonMat
  ));
  nose.rotation.x = Math.PI / 2;
  nose.scale.set(1.5, 1, 1);
  nose.position.set(0, Y.nose, -20);
  root.add(nose);
  // Nose tip (crash structure — narrower tip)
  const noseTip = addShadow(new THREE.Mesh(
    new THREE.ConeGeometry(0.6, 3, 8), carbonMat
  ));
  noseTip.rotation.x = -Math.PI / 2;
  noseTip.scale.set(1.5, 1, 1);
  noseTip.position.set(0, Y.nose, -22.5);
  root.add(noseTip);
  // S-duct inlet (top of nose)
  const sduct = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(1, 0.5, 3), carbonMat
  ));
  sduct.position.set(0, Y.nose + 1, -18);
  root.add(sduct);
  // S-duct outlet (front of nose)
  const sductOut = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 0.4, 1.5), carbonMat
  ));
  sductOut.position.set(0, Y.nose + 0.5, -22);
  root.add(sductOut);
  // Nose mounting pylons (connect to monocoque — 2x)
  for (const px of [-1.5, 1.5]) {
    const pylon = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 3, 2), carbonMat
    ));
    pylon.position.set(px, Y.nose + 1, -17);
    root.add(pylon);
  }
  // Front number decal
  const numTex = decalTexture('7', '#1a1a1e', '#ffffff');
  const numDecal = addShadow(new THREE.Mesh(
    new THREE.PlaneGeometry(2, 1),
    new THREE.MeshStandardMaterial({ map: numTex, emissive: 0xffffff, emissiveMap: numTex, emissiveIntensity: 0.3 })
  ));
  numDecal.position.set(0, Y.nose + 1.5, -19);
  root.add(numDecal);

  // ============================================================
  // 6. MONOCOQUE / CHASSIS (Y=52)
  // ============================================================
  // Main tub
  const mono = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(8, 5, 14), carbonMat
  ));
  mono.scale.set(1, 1, 1.2);
  mono.position.set(0, Y.mono, -8);
  root.add(mono);
  // Cockpit opening (recessed area)
  const cockpit = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(4, 3, 5),
    new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.9 })
  ));
  cockpit.position.set(0, Y.cockpit, -6);
  root.add(cockpit);
  // Front bulkhead
  const bulkhead = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(7, 4, 0.5), carbonMat
  ));
  bulkhead.position.set(0, Y.mono, -15);
  root.add(bulkhead);
  // Side impact spar (crash structure — 2x)
  for (const sx of [-4.5, 4.5]) {
    const spar = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(1, 2, 10), carbonMat
    ));
    spar.position.set(sx, Y.mono, -5);
    root.add(spar);
  }
  // Cockpit side padding (interior)
  for (const sx of [-2, 2]) {
    const pad = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 2, 6),
      new THREE.MeshStandardMaterial({ color: 0x2a2a2e, roughness: 0.8 })
    ));
    pad.position.set(sx, Y.cockpit, -6);
    root.add(pad);
  }
  // Front roll hoop (behind driver)
  const rollHoop = addShadow(new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.2, 6, 12, Math.PI), titaniumMat
  ));
  rollHoop.position.set(0, Y.rollHoop, -3);
  rollHoop.rotation.x = -Math.PI / 2;
  root.add(rollHoop);
  // Roll hoop supports (2x)
  for (const rx of [-1, 1]) {
    const sup = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 3, 0.3), titaniumMat
    ));
    sup.position.set(rx, Y.rollHoop - 1.5, -3);
    root.add(sup);
  }
  // Mirrors (2x)
  for (const mx of [-4, 4]) {
    const mirror = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 1, 0.5),
      new THREE.MeshStandardMaterial({ color: 0x1a1a1e, metalness: 0.3, roughness: 0.4 })
    ));
    mirror.position.set(mx, Y.mirrors, -8);
    root.add(mirror);
    // Mirror stalk
    const stalk = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.15, 2, 6), carbonMat
    ));
    stalk.rotation.z = Math.PI / 2;
    stalk.position.set(mx * 0.8, Y.mirrors, -8);
    root.add(stalk);
    // Mirror glass (reflective)
    const glass = addShadow(new THREE.Mesh(
      new THREE.PlaneGeometry(1.2, 0.7),
      new THREE.MeshStandardMaterial({ color: 0x4488cc, metalness: 0.9, roughness: 0.05 })
    ));
    glass.position.set(mx, Y.mirrors, -8.3);
    root.add(glass);
  }

  // ============================================================
  // 7. SIDE PODS (Y=62) — 2x
  // ============================================================
  for (const sx of [-6, 6]) {
    // Pod body (sculpted shape)
    const pod = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(5, 4, 14), carbonMat
    ));
    pod.scale.set(1, 0.8, 1);
    pod.position.set(sx, Y.sidePods, 0);
    root.add(pod);
    // Radiator intake (front of pod)
    const intake = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(3, 3, 1), carbonMat
    ));
    intake.position.set(sx, Y.sidePods, -7);
    root.add(intake);
    // Radiator exhaust vent (top of pod — gills)
    for (let g = 0; g < 4; g++) {
      const gill = addShadow(new THREE.Mesh(
        new THREE.BoxGeometry(2.5, 0.3, 0.8), carbonMatFlat
      ));
      gill.position.set(sx, Y.sidePods + 3 - g * 0.6, 2 + g * 0.5);
      root.add(gill);
    }
    // Side pod turning vanes (underside aero)
    for (let v = 0; v < 3; v++) {
      const vane = addShadow(new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 3, 3), carbonMat
      ));
      vane.position.set(sx, Y.sidePods - 2, -5 + v * 2);
      vane.rotation.y = 0.2;
      root.add(vane);
    }
    // Pod floor edge (downwash ramp)
    const ramp = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(1, 2, 10), carbonMat
    ));
    ramp.position.set(sx * 1.1, Y.sidePods - 1, 0);
    ramp.rotation.z = sx > 0 ? 0.3 : -0.3;
    root.add(ramp);
    // Brake duct scoop (front of pod, lower)
    const scoop = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 1.5, 2), carbonMat
    ));
    scoop.position.set(sx, Y.sidePods - 2, -8);
    root.add(scoop);
  }

  // ============================================================
  // 8. BARGEBOARDS (Y=62) — 2x (complex multi-element)
  // ============================================================
  for (const bx of [-4, 4]) {
    // Main bargeboard
    const barge = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 5, 7), carbonMat
    ));
    barge.scale.set(1, 1, 0.7);
    barge.position.set(bx, Y.sidePods, -7);
    barge.rotation.y = 0.3;
    root.add(barge);
    // Secondary bargeboard (smaller, offset)
    const barge2 = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 3, 5), carbonMat
    ));
    barge2.position.set(bx * 1.2, Y.sidePods, -6);
    barge2.rotation.y = 0.15;
    root.add(barge2);
    // Turning vane cluster (3 cascading vanes)
    for (let v = 0; v < 3; v++) {
      const vane = addShadow(new THREE.Mesh(
        new THREE.BoxGeometry(0.15, 2.5 - v * 0.5, 3 - v * 0.5), carbonMat
      ));
      vane.position.set(bx * 1.1, Y.bargeboards - 1 + v * 0.3, -8 + v * 0.5);
      vane.rotation.y = 0.4 - v * 0.1;
      root.add(vane);
    }
  }

  // ============================================================
  // 9. ENGINE COVER + AIRBOX (Y=72)
  // ============================================================
  // Cover body
  const engCover = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(5, 4, 12), carbonMat
  ));
  engCover.scale.set(0.9, 1, 1.3);
  engCover.position.set(0, Y.engCover, 4);
  root.add(engCover);
  // Airbox (overhead intake — ram air scoop)
  const airbox = addShadow(new THREE.Mesh(
    new THREE.SphereGeometry(1.5, 12, 8), carbonMat
  ));
  airbox.scale.set(1.5, 1, 1);
  airbox.position.set(0, Y.engCover + 3, -2);
  root.add(airbox);
  // Airbox intake opening (front face)
  const airboxOpen = addShadow(new THREE.Mesh(
    new THREE.CircleGeometry(0.8, 12),
    new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.9 })
  ));
  airboxOpen.position.set(0, Y.engCover + 3, -3.5);
  root.add(airboxOpen);
  // Shark fin (engine cover spine)
  const fin = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 3, 10), carbonMat
  ));
  fin.position.set(0, Y.engCover + 4, 5);
  root.add(fin);
  // Engine cover side panels (cooling louvers — 3 per side)
  for (const lx of [-2, 2]) {
    for (let l = 0; l < 3; l++) {
      const louver = addShadow(new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 0.4, 2), carbonMatFlat
      ));
      louver.position.set(lx, Y.engCover + 1 - l * 0.8, 6);
      root.add(louver);
    }
  }

  // ============================================================
  // 10. POWER UNIT — V6 TURBO HYBRID (Y=82)
  // ============================================================
  // Engine block
  const engineBlock = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(4, 4, 6), engineMat
  ));
  engineBlock.position.set(0, Y.powerUnit, 3);
  root.add(engineBlock);
  // V-cylinder banks (2 rows of 3)
  for (const side of [-1, 1]) {
    for (let c = 0; c < 3; c++) {
      // Cylinder head
      const cyl = addShadow(new THREE.Mesh(
        new THREE.CylinderGeometry(0.6, 0.6, 3, 8), engineMat
      ));
      cyl.position.set(side * 1.2, Y.powerUnit + 2, 1 + c * 2);
      cyl.rotation.z = side * 0.5;
      root.add(cyl);
      // Cylinder head cover (colored — team livery)
      const headCover = addShadow(new THREE.Mesh(
        new THREE.CylinderGeometry(0.65, 0.65, 1, 8), accentRedMat
      ));
      headCover.position.set(side * 1.3, Y.powerUnit + 3.5, 1 + c * 2);
      headCover.rotation.z = side * 0.5;
      root.add(headCover);
      // Spark plug (top of each cylinder)
      const plug = addShadow(new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 0.5, 6),
        sparkPlugMat
      ));
      plug.position.set(side * 1.5, Y.powerUnit + 4, 1 + c * 2);
      plug.rotation.z = side * 0.5;
      root.add(plug);
    }
  }
  // Turbo compressor housing
  const turbo = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(0.8, 0.8, 2, 12), goldMat
  ));
  turbo.rotation.z = Math.PI / 2;
  turbo.position.set(2, Y.powerUnit + 3, 6);
  root.add(turbo);
  // Turbo turbine housing (hot side)
  const turbine = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(0.6, 0.6, 1.5, 8),
    new THREE.MeshStandardMaterial({ color: 0x8a4a2a, metalness: 0.7, roughness: 0.3 })
  ));
  turbine.rotation.z = Math.PI / 2;
  turbine.position.set(2, Y.powerUnit + 3, 8);
  root.add(turbine);
  // Intercooler (between turbo and intake)
  const intercooler = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(2, 3, 1),
    new THREE.MeshStandardMaterial({ color: 0x4a8aaa, metalness: 0.5, roughness: 0.4 })
  ));
  intercooler.position.set(0, Y.powerUnit + 4, 5);
  root.add(intercooler);
  // MGU-K (kinetic energy recovery — attached to crankshaft)
  const mguK = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(0.7, 0.7, 2, 8), accentBlueMat
  ));
  mguK.rotation.z = Math.PI / 2;
  mguK.position.set(-2, Y.powerUnit + 1, 6);
  root.add(mguK);
  // MGU-H (heat energy recovery — attached to turbo)
  const mguH = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(0.4, 0.4, 1.5, 8), accentBlueMat
  ));
  mguH.rotation.z = Math.PI / 2;
  mguH.position.set(2, Y.powerUnit + 4, 7);
  root.add(mguH);
  // ERS battery pack (energy store)
  const battery = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(3, 2, 4),
    new THREE.MeshStandardMaterial({ color: 0x2a4a2a, metalness: 0.3, roughness: 0.5 })
  ));
  battery.position.set(0, Y.powerUnit - 2, 4);
  root.add(battery);
  // Control electronics (ECU)
  const ecu = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(2, 1, 1.5),
    new THREE.MeshStandardMaterial({ color: 0x1a1a1e, metalness: 0.4, roughness: 0.5 })
  ));
  ecu.position.set(-2, Y.powerUnit - 1, 2);
  root.add(ecu);
  // Exhaust manifold (4-2-1 merging pipes)
  for (let m = 0; m < 4; m++) {
    const manifold = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(0.25, 0.35, 4, 6),
      manifoldMat
    ));
    manifold.rotation.x = -0.5;
    manifold.rotation.z = (m - 1.5) * 0.2;
    manifold.position.set(m * 0.8 - 1.2, Y.powerUnit + 3, 7);
    root.add(manifold);
  }
  // Fuel line (braided hose)
  const fuelLine = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(0.15, 0.15, 6, 6),
    new THREE.MeshStandardMaterial({ color: 0xc02020, metalness: 0.3, roughness: 0.5 })
  ));
  fuelLine.position.set(-2, Y.powerUnit, 0);
  fuelLine.rotation.x = Math.PI / 2;
  root.add(fuelLine);

  // ============================================================
  // 11. EXHAUST PIPE (Y=88)
  // ============================================================
  const exhaust = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(0.4, 0.5, 5, 8),
    new THREE.MeshStandardMaterial({ color: 0xc0a080, metalness: 0.9, roughness: 0.1 })
  ));
  exhaust.rotation.x = -0.3;
  exhaust.position.set(0, Y.exhaust, 8);
  root.add(exhaust);
  // Exhaust tip (rolled edge)
  const tip = addShadow(new THREE.Mesh(
    new THREE.TorusGeometry(0.5, 0.1, 6, 12),
    new THREE.MeshStandardMaterial({ color: 0x4a4a52, metalness: 0.8, roughness: 0.2 })
  ));
  tip.position.set(0, Y.exhaust + 1.3, 9.8);
  tip.rotation.x = -0.3;
  root.add(tip);
  // Heat shield
  const heatShield = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(2, 2, 4),
    new THREE.MeshStandardMaterial({ color: 0xc0a080, metalness: 0.9, roughness: 0.1 })
  ));
  heatShield.position.set(0, Y.exhaust, 7);
  root.add(heatShield);

  // ============================================================
  // 12. REAR SUSPENSION (Y=92)
  // ============================================================
  for (const rx of [-9, 9]) {
    // Lower wishbone (2 arms forming V)
    for (const arm of [-1, 1]) {
      const lower = addShadow(new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.3, 8, 6), suspensionMat
      ));
      lower.position.set(rx * 0.5, Y.rearSusp, 8);
      lower.rotation.z = Math.PI / 2 + arm * 0.3;
      root.add(lower);
    }
    // Upper wishbone
    for (const arm of [-1, 1]) {
      const upper = addShadow(new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.3, 7, 6), suspensionMat
      ));
      upper.position.set(rx * 0.5, Y.rearSusp + 2, 8);
      upper.rotation.z = Math.PI / 2 + arm * 0.25;
      root.add(upper);
    }
    // Driveshaft (CV joint to wheel)
    const drive = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.5, 5, 8), suspensionMat
    ));
    drive.rotation.z = Math.PI / 2;
    drive.position.set(rx * 0.7, Y.rearSusp, 10);
    root.add(drive);
    // Driveshaft CV joints (2x — inner and outer)
    for (const cz of [8, 11]) {
      const cv = addShadow(new THREE.Mesh(
        new THREE.SphereGeometry(0.6, 8, 6), titaniumMat
      ));
      cv.position.set(rx * 0.7, Y.rearSusp, cz);
      root.add(cv);
    }
    // Pullrod (alternative to pushrod — rear uses pullrod)
    const pullrod = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(0.35, 0.35, 8, 8), suspensionMat
    ));
    pullrod.position.set(rx * 0.5, Y.rearSusp + 1, 7);
    pullrod.rotation.x = -0.5;
    root.add(pullrod);
    // Pickup point (rose joint)
    const joint = addShadow(new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 6, 4), titaniumMat
    ));
    joint.position.set(rx, Y.rearSusp, 10);
    root.add(joint);
  }
  // Rear dampers (2x)
  for (const dx of [-2, 2]) {
    const damper = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(0.6, 0.6, 3, 8),
      damperMat
    ));
    damper.position.set(dx, Y.rearSusp + 2, 6);
    damper.rotation.x = -0.4;
    root.add(damper);
  }

  // ============================================================
  // 13. REAR WHEELS (Y=92) — 2x (larger than front)
  // ============================================================
  for (const wx of [-9, 9]) {
    // Tire (wider than front)
    const tire = addShadow(new THREE.Mesh(
      new THREE.TorusGeometry(3.8, 1.8, 16, 24), tireMat
    ));
    tire.rotation.y = Math.PI / 2;
    tire.position.set(wx, Y.rearSusp, 10);
    root.add(tire);
    // Tire inner
    const tireInner = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(2.2, 2.2, 3, 16), tireMat
    ));
    tireInner.rotation.z = Math.PI / 2;
    tireInner.position.set(wx, Y.rearSusp, 10);
    root.add(tireInner);
    // Rim (larger)
    const rim = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(2.7, 2.7, 2.5, 16), rimMat
    ));
    rim.rotation.z = Math.PI / 2;
    rim.position.set(wx, Y.rearSusp, 10);
    root.add(rim);
    // Rim spokes (8x)
    for (let sp = 0; sp < 8; sp++) {
      const spoke = addShadow(new THREE.Mesh(
        new THREE.BoxGeometry(2, 0.3, 0.3), rimMat
      ));
      spoke.position.set(wx, Y.rearSusp, 10);
      spoke.rotation.z = (sp / 8) * Math.PI * 2;
      root.add(spoke);
    }
    // Wheel nut
    const nut = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.5, 0.8, 6),
      wheelNutMat
    ));
    nut.rotation.z = Math.PI / 2;
    nut.position.set(wx, Y.rearSusp, 10);
    root.add(nut);
    // Brake disc (larger)
    const brake = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(2.8, 2.8, 0.5, 16), brakeDiscMat
    ));
    brake.rotation.z = Math.PI / 2;
    brake.position.set(wx, Y.rearSusp, 10);
    root.add(brake);
    // Brake disc cooling vanes (16x)
    for (let v = 0; v < 16; v++) {
      const vane = addShadow(new THREE.Mesh(
        new THREE.BoxGeometry(2, 0.12, 0.3), brakeMat
      ));
      vane.position.set(wx, Y.rearSusp, 10);
      vane.rotation.z = (v / 16) * Math.PI * 2;
      root.add(vane);
    }
    // Brake caliper
    const caliper = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(2.5, 2, 2), accentRedMat
    ));
    caliper.position.set(wx, Y.rearWheels + 3, 10);
    root.add(caliper);
    // Caliper pistons (3x)
    for (let p = 0; p < 3; p++) {
      const piston = addShadow(new THREE.Mesh(
        new THREE.CylinderGeometry(0.25, 0.25, 0.3, 8),
        pistonMat
      ));
      piston.rotation.z = Math.PI / 2;
      piston.position.set(wx, Y.rearWheels + 2 + p * 0.8, 9);
      root.add(piston);
    }
    // Wheel tether
    const tether = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 4, 4),
      tetherMat
    ));
    tether.rotation.z = Math.PI / 2;
    tether.position.set(wx, Y.rearWheels + 2, 9);
    root.add(tether);
  }

  // ============================================================
  // 14. REAR WING ASSEMBLY (Y=102)
  // ============================================================
  const rwY = Y.rearWing;
  // Mainplane
  const rwMain = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(18, 0.5, 4), carbonMat
  ));
  rwMain.position.set(0, rwY, 12);
  root.add(rwMain);
  // Beam wing (lower element)
  const rwBeam = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(16, 0.4, 2), carbonMat
  ));
  rwBeam.position.set(0, rwY - 1, 13);
  root.add(rwBeam);
  // Upper flap
  const rwFlap = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(18, 0.4, 2), carbonMat
  ));
  rwFlap.position.set(0, rwY + 1.5, 11);
  root.add(rwFlap);
  // DRS flap (top element — opens for drag reduction)
  const drs = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(16, 0.3, 1.5), accentGreenMat
  ));
  drs.position.set(0, rwY + 3, 10.5);
  root.add(drs);
  // DRS mechanism (actuator — small cylinder connecting flap to mainplane)
  const drsAct = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.2, 2.5, 6),
    new THREE.MeshStandardMaterial({ color: 0x8a8a92, metalness: 0.7, roughness: 0.3 })
  ));
  drsAct.position.set(0, rwY + 2, 11.5);
  root.add(drsAct);
  // Endplates (2x — tall with louvers)
  for (const ex of [-9, 9]) {
    const ep = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 5, 4), carbonMat
    ));
    ep.position.set(ex, rwY + 1, 11.5);
    root.add(ep);
    // Endplate louvers (3 horizontal slots)
    for (let l = 0; l < 3; l++) {
      const louver = addShadow(new THREE.Mesh(
        new THREE.BoxGeometry(0.6, 0.3, 1.5), carbonMatFlat
      ));
      louver.position.set(ex, rwY + 0.5 + l * 0.8, 13);
      root.add(louver);
    }
    // Endplate top winglet
    const winglet = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 1.5, 2), carbonMat
    ));
    winglet.position.set(ex, rwY + 4, 12);
    winglet.rotation.y = 0.2;
    root.add(winglet);
  }
  // Rear wing pillars (2x — connect to gearbox)
  for (const px of [-3, 3]) {
    const pillar = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.3, 5, 6), carbonMat
    ));
    pillar.position.set(px, rwY - 2.5, 12);
    root.add(pillar);
  }
  // Rear wing slot gap separators (small vertical tabs on mainplane)
  for (let s = -7; s <= 7; s += 2) {
    const sep = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.8, 0.2), carbonMatFlat
    ));
    sep.position.set(s, rwY + 1, 10.8);
    root.add(sep);
  }

  // ============================================================
  // 15. T-WING (Y=112)
  // ============================================================
  // Main T-wing element
  const twing = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(14, 0.3, 1.5), carbonMat
  ));
  twing.position.set(0, Y.tWing, 11);
  root.add(twing);
  // Secondary T-wing element (bi-plane)
  const twing2 = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(12, 0.2, 1), carbonMat
  ));
  twing2.position.set(0, Y.tWing - 1, 11.5);
  root.add(twing2);
  // T-wing endplates
  for (const ex of [-7, 7]) {
    const tep = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 2, 1.5), carbonMat
    ));
    tep.position.set(ex, Y.tWing + 0.5, 11);
    root.add(tep);
  }
  // Rear wing support struts (connect T-wing to rear wing)
  for (const sx of [-4, 4]) {
    const strut = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 6, 0.3), carbonMat
    ));
    strut.position.set(sx, Y.tWing - 5, 11);
    root.add(strut);
  }

  // ============================================================
  // 16. HALO + COCKPIT INTERIOR (Y=52, at monocoque level)
  // ============================================================
  // Halo base mounts (2x — titanium)
  for (const hx of [-2, 2]) {
    const base = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 2), titaniumMat
    ));
    base.position.set(hx, Y.mirrors, -8);
    root.add(base);
  }
  // Halo main arc (titanium tube — half torus)
  const haloArc = addShadow(new THREE.Mesh(
    new THREE.TorusGeometry(2.5, 0.35, 8, 16, Math.PI), titaniumMat
  ));
  haloArc.position.set(0, Y.mirrors, -8);
  haloArc.rotation.x = -Math.PI / 2;
  root.add(haloArc);
  // Halo central strut (front support)
  const haloStrut = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(0.35, 2.5, 0.35), titaniumMat
  ));
  haloStrut.position.set(0, Y.halo + 1, -7);
  root.add(haloStrut);
  // Halo side rails (connect arc to cockpit rim — 2x)
  for (const sx of [-2.5, 2.5]) {
    const rail = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.15, 3, 6), titaniumMat
    ));
    rail.position.set(sx, Y.halo + 0.5, -6);
    rail.rotation.x = 0.5;
    root.add(rail);
  }
  // Cockpit padding (rim — energy-absorbing)
  const padding = addShadow(new THREE.Mesh(
    new THREE.TorusGeometry(2, 0.3, 6, 12),
    new THREE.MeshStandardMaterial({ color: 0x2a2a2e, roughness: 0.8 })
  ));
  padding.position.set(0, Y.steering, -6);
  padding.rotation.x = -Math.PI / 2;
  root.add(padding);

  // Steering wheel (F1 rectangular shape with grips and buttons)
  const wheelGroup = new THREE.Group();
  // Wheel body (rectangular F1 shape — open top)
  const wheelBody = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(1.5, 1.5, 0.5, 16, 1, false, 0, Math.PI * 1.3),
    new THREE.MeshStandardMaterial({ color: 0x1a1a1e, metalness: 0.3, roughness: 0.5 })
  ));
  wheelBody.rotation.x = Math.PI / 2;
  wheelGroup.add(wheelBody);
  // LCD display (center screen — green)
  const lcd = addShadow(new THREE.Mesh(
    new THREE.PlaneGeometry(1.8, 1),
    new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 0.6 })
  ));
  lcd.position.set(0, 0.1, 0);
  wheelGroup.add(lcd);
  // Buttons (4 colored buttons around the screen)
  const buttonColors = [0xc02020, 0x00a060, 0x2040c0, 0xc0a020];
  for (let b = 0; b < 4; b++) {
    const bx = -0.9 + (b % 2) * 1.8;
    const by = -0.7 + Math.floor(b / 2) * 1.4;
    const btn = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.15, 0.2, 8),
      new THREE.MeshStandardMaterial({ color: buttonColors[b], emissive: buttonColors[b], emissiveIntensity: 0.3 })
    ));
    btn.position.set(bx, 0.15, by);
    wheelGroup.add(btn);
  }
  // Grip handles (left + right)
  for (const gx of [-1.5, 1.5]) {
    const grip = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.2, 1.5, 8),
      new THREE.MeshStandardMaterial({ color: 0x2a2a2e, roughness: 0.6 })
    ));
    grip.rotation.z = Math.PI / 2;
    grip.position.set(gx, 0, 0);
    wheelGroup.add(grip);
    // Paddle shifter (behind grip)
    const paddle = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.1, 0.5),
      new THREE.MeshStandardMaterial({ color: 0x4a4a52, metalness: 0.6, roughness: 0.3 })
    ));
    paddle.position.set(gx, -0.3, 0.3);
    wheelGroup.add(paddle);
  }
  // Quick-release hub (center back)
  const hub = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.3, 0.8, 8),
    new THREE.MeshStandardMaterial({ color: 0xc02020, metalness: 0.5, roughness: 0.3 })
  ));
  hub.position.set(0, -0.3, 0);
  wheelGroup.add(hub);
  wheelGroup.position.set(0, Y.steering, -4);
  root.add(wheelGroup);

  // Driver seat (molded carbon fiber)
  const seat = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(3, 3, 4), seatMat
  ));
  seat.scale.set(0.8, 1, 1);
  seat.position.set(0, Y.mono, -3);
  root.add(seat);
  // Seat shoulder wings (2x — help direct airflow)
  for (const sx of [-1.5, 1.5]) {
    const shoulder = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 2.5, 3), seatMat
    ));
    shoulder.position.set(sx, Y.headrest - 0.5, -3);
    root.add(shoulder);
  }
  // Headrest (2 side pads + center)
  for (const hx of [-1.2, 0, 1.2]) {
    const headrest = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(hx === 0 ? 1.2 : 0.8, 2.5, 3), seatMat
    ));
    headrest.position.set(hx, Y.rollHoop, -3);
    root.add(headrest);
  }
  // HANS device (head and neck support — visible behind driver)
  const hans = addShadow(new THREE.Mesh(
    new THREE.TorusGeometry(1.5, 0.3, 4, 8, Math.PI),
    new THREE.MeshStandardMaterial({ color: 0x2a2a2e, roughness: 0.7 })
  ));
  hans.position.set(0, Y.hans, -5);
  hans.rotation.x = Math.PI;
  root.add(hans);

  // ============================================================
  // LIGHTING
  // ============================================================
  const sun = new THREE.DirectionalLight(0xffffff, 1.5);
  sun.position.set(20, exploded ? 80 : 30, 30);
  sun.castShadow = true;
  sun.shadow.mapSize.width = 2048;
  sun.shadow.mapSize.height = 2048;
  sun.shadow.camera.left = -50;
  sun.shadow.camera.right = 50;
  sun.shadow.camera.top = exploded ? 120 : 20;
  sun.shadow.camera.bottom = -5;
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 200;
  sun.shadow.bias = -0.0005;
  root.add(sun);

  const hemi = new THREE.HemisphereLight(0xccddff, 0x445566, 0.5);
  root.add(hemi);
  const ambient = new THREE.AmbientLight(0xffffff, 0.3);
  root.add(ambient);
  const rim = new THREE.DirectionalLight(0xff6080, 0.4);
  rim.position.set(-30, 50, -20);
  root.add(rim);

  return root;
}
