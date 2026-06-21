// ====================== BAY AREA APARTMENT ======================
// A modern 2-bedroom apartment inspired by SF SoMa / Oakland mid-rise units.
// Features: open-concept living/kitchen, 2 bedrooms, 1 bathroom, balcony.
// Floor finishes: herringbone hardwood (living), chevron oak (hallway),
// hex marble (bathroom), ceramic subway (kitchen), plush carpet (bedrooms),
// composite deck (balcony). Walls: warm plaster. Modern furniture + lighting.

import * as THREE from 'three';
import { addShadow } from './materials-dsl';
import {
  makeWoodTexture, makeTileTexture, makeGraniteTexture, makeMarbleTexture,
  makePlasterTexture, makeCarpetTexture, makeConcreteTexture, makeFabricTexture,
} from './building-textures';

// ---------- Local helpers ----------

function herringboneFloorTexture(baseColor = '#9c6b3a', darkColor = '#5a3a1a'): { map: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  // base
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, size, size);
  // herringbone planks
  const plankLen = 96;
  const plankW = 24;
  for (let y = -plankLen; y < size + plankLen; y += plankW) {
    for (let x = -plankLen; x < size + plankLen; x += plankLen) {
      // each cell has two perpendicular planks
      const offset = (Math.floor((y) / plankW) % 2) * (plankLen / 2);
      drawPlank(ctx, x + offset, y, plankLen, plankW, baseColor, darkColor);
      drawPlank(ctx, x + offset + plankLen / 2, y + plankW, plankLen, plankW, baseColor, darkColor, true);
    }
  }
  // subtle wear
  ctx.globalAlpha = 0.08;
  for (let i = 0; i < 80; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? '#000' : '#fff';
    ctx.fillRect(Math.random() * size, Math.random() * size, 30 + Math.random() * 60, 4);
  }
  ctx.globalAlpha = 1;
  const map = new THREE.CanvasTexture(canvas);
  map.wrapS = THREE.RepeatWrapping; map.wrapT = THREE.RepeatWrapping;
  map.colorSpace = THREE.SRGBColorSpace; map.anisotropy = 8;

  // Bump map
  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size; bumpCanvas.height = size;
  const bctx = bumpCanvas.getContext('2d')!;
  bctx.fillStyle = '#a0a0a0'; bctx.fillRect(0, 0, size, size);
  for (let y = -plankLen; y < size + plankLen; y += plankW) {
    for (let x = -plankLen; x < size + plankLen; x += plankLen) {
      const offset = (Math.floor((y) / plankW) % 2) * (plankLen / 2);
      bctx.fillStyle = '#c0c0c0';
      bctx.fillRect(x + offset + 1, y + 1, plankLen - 2, plankW - 2);
      bctx.fillStyle = '#505050';
      bctx.fillRect(x + offset, y, plankLen, 1);
      bctx.fillRect(x + offset, y + plankW - 1, plankLen, 1);
      bctx.fillStyle = '#c0c0c0';
      bctx.fillRect(x + offset + plankLen / 2, y + plankW + 1, plankLen, plankW - 2);
      bctx.fillStyle = '#505050';
      bctx.fillRect(x + offset + plankLen / 2, y + plankW, plankLen, 1);
      bctx.fillRect(x + offset + plankLen / 2, y + plankW * 2 - 1, plankLen, 1);
    }
  }
  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping; bumpMap.wrapT = THREE.RepeatWrapping;
  return { map, bumpMap };
}

function drawPlank(ctx: CanvasRenderingContext2D, x: number, y: number, len: number, w: number, base: string, dark: string, flip = false) {
  // grain gradient
  const grad = flip
    ? ctx.createLinearGradient(x, y, x, y + w)
    : ctx.createLinearGradient(x, y, x + len, y);
  grad.addColorStop(0, base);
  grad.addColorStop(0.5, shade(base, -10));
  grad.addColorStop(1, base);
  ctx.fillStyle = grad;
  ctx.fillRect(x, y, len, w);
  // grain lines
  ctx.strokeStyle = dark;
  ctx.globalAlpha = 0.35;
  ctx.lineWidth = 1;
  for (let g = 0; g < 5; g++) {
    ctx.beginPath();
    const gy = y + (g + 0.5) * (w / 5);
    ctx.moveTo(x, gy);
    for (let gx = 0; gx <= len; gx += 8) {
      ctx.lineTo(x + gx, gy + Math.sin((x + gx) * 0.06 + g) * 1.4);
    }
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  // plank border
  ctx.strokeStyle = 'rgba(0,0,0,0.45)';
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 0.5, y + 0.5, len - 1, w - 1);
}

function shade(hex: string, percent: number): string {
  const c = hex.replace('#', '');
  const r = Math.max(0, Math.min(255, parseInt(c.substring(0, 2), 16) + percent));
  const g = Math.max(0, Math.min(255, parseInt(c.substring(2, 4), 16) + percent));
  const b = Math.max(0, Math.min(255, parseInt(c.substring(4, 6), 16) + percent));
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

function hexTileTexture(bgColor = '#ece6dc', tileColor = '#d8d0c2', groutColor = '#8a8275'): { map: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = groutColor; ctx.fillRect(0, 0, size, size);
  const hexR = 22;
  const hexH = hexR * Math.sqrt(3);
  for (let row = -1; row < size / hexH + 1; row++) {
    for (let col = -1; col < size / (hexR * 3) + 1; col++) {
      const cx = col * hexR * 3 + (row % 2 ? hexR * 1.5 : 0);
      const cy = row * hexH / 2;
      drawHex(ctx, cx, cy, hexR - 1.5, tileColor);
    }
  }
  // veining
  ctx.globalAlpha = 0.12;
  for (let i = 0; i < 18; i++) {
    ctx.strokeStyle = '#6a6055';
    ctx.lineWidth = 1 + Math.random() * 2;
    ctx.beginPath();
    ctx.moveTo(Math.random() * size, Math.random() * size);
    ctx.bezierCurveTo(
      Math.random() * size, Math.random() * size,
      Math.random() * size, Math.random() * size,
      Math.random() * size, Math.random() * size
    );
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  const map = new THREE.CanvasTexture(canvas);
  map.wrapS = THREE.RepeatWrapping; map.wrapT = THREE.RepeatWrapping;
  map.colorSpace = THREE.SRGBColorSpace; map.anisotropy = 8;

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size; bumpCanvas.height = size;
  const bctx = bumpCanvas.getContext('2d')!;
  bctx.fillStyle = '#404040'; bctx.fillRect(0, 0, size, size);
  for (let row = -1; row < size / hexH + 1; row++) {
    for (let col = -1; col < size / (hexR * 3) + 1; col++) {
      const cx = col * hexR * 3 + (row % 2 ? hexR * 1.5 : 0);
      const cy = row * hexH / 2;
      bctx.fillStyle = '#c8c8c8';
      drawHex(bctx, cx, cy, hexR - 1.5, '#c8c8c8');
    }
  }
  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping; bumpMap.wrapT = THREE.RepeatWrapping;
  return { map, bumpMap };
}

function drawHex(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, fill: string) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i;
    const x = cx + r * Math.cos(a);
    const y = cy + r * Math.sin(a);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
  // small per-tile variation
  ctx.fillStyle = `rgba(0,0,0,${0.04 + Math.random() * 0.08})`;
  ctx.fill();
}

function chevronFloorTexture(baseColor = '#a8784a', darkColor = '#5a3520'): { map: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = baseColor; ctx.fillRect(0, 0, size, size);
  const plankW = 28;
  const plankL = 80;
  for (let y = -plankL; y < size + plankL; y += plankW) {
    for (let x = -plankL; x < size + plankL * 2; x += plankL * 2) {
      // upward V
      drawPlankRot(ctx, x, y, plankL, plankW, baseColor, darkColor, -45);
      drawPlankRot(ctx, x + plankL, y, plankL, plankW, baseColor, darkColor, 45);
    }
  }
  const map = new THREE.CanvasTexture(canvas);
  map.wrapS = THREE.RepeatWrapping; map.wrapT = THREE.RepeatWrapping;
  map.colorSpace = THREE.SRGBColorSpace; map.anisotropy = 8;

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size; bumpCanvas.height = size;
  const bctx = bumpCanvas.getContext('2d')!;
  bctx.fillStyle = '#a0a0a0'; bctx.fillRect(0, 0, size, size);
  bctx.fillStyle = '#505050';
  for (let y = -plankL; y < size + plankL; y += plankW) {
    bctx.fillRect(0, y, size, 1);
  }
  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping; bumpMap.wrapT = THREE.RepeatWrapping;
  return { map, bumpMap };
}

function drawPlankRot(ctx: CanvasRenderingContext2D, x: number, y: number, len: number, w: number, base: string, dark: string, angle: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((angle * Math.PI) / 180);
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, len, w);
  ctx.strokeStyle = dark;
  ctx.globalAlpha = 0.3;
  for (let g = 0; g < 4; g++) {
    ctx.lineWidth = 1;
    ctx.beginPath();
    const gy = (g + 0.5) * (w / 4);
    ctx.moveTo(0, gy);
    for (let gx = 0; gx <= len; gx += 8) ctx.lineTo(gx, gy + Math.sin(gx * 0.07 + g) * 1.2);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  ctx.strokeStyle = 'rgba(0,0,0,0.4)';
  ctx.lineWidth = 1;
  ctx.strokeRect(0, 0, len, w);
  ctx.restore();
}

function plushCarpetTexture(baseColor = '#4a3a5a', accentColor = '#7a5a8a'): { map: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = baseColor; ctx.fillRect(0, 0, size, size);
  // plush pile - many small dots with variation
  for (let i = 0; i < 8000; i++) {
    const x = Math.random() * size, y = Math.random() * size;
    const v = Math.random();
    ctx.fillStyle = v > 0.85 ? accentColor : v > 0.5 ? shade(baseColor, 12) : shade(baseColor, -12);
    ctx.fillRect(x, y, 2, 2);
  }
  // soft carpet pattern stripes
  ctx.globalAlpha = 0.15;
  for (let y = 0; y < size; y += 24) {
    ctx.fillStyle = shade(baseColor, 8);
    ctx.fillRect(0, y, size, 12);
  }
  ctx.globalAlpha = 1;
  const map = new THREE.CanvasTexture(canvas);
  map.wrapS = THREE.RepeatWrapping; map.wrapT = THREE.RepeatWrapping;
  map.colorSpace = THREE.SRGBColorSpace; map.anisotropy = 8;

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size; bumpCanvas.height = size;
  const bctx = bumpCanvas.getContext('2d')!;
  bctx.fillStyle = '#606060'; bctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 6000; i++) {
    bctx.fillStyle = Math.random() > 0.5 ? '#707070' : '#505050';
    bctx.fillRect(Math.random() * size, Math.random() * size, 2, 2);
  }
  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping; bumpMap.wrapT = THREE.RepeatWrapping;
  return { map, bumpMap };
}

function subwayTileTexture(tileColor = '#ece4d4', groutColor = '#5a5048'): { map: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
  const size = 256;
  const tileW = 64, tileH = 32;
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = groutColor; ctx.fillRect(0, 0, size, size);
  for (let row = 0; row < size / tileH; row++) {
    const offset = (row % 2) * (tileW / 2);
    for (let col = -1; col < size / tileW + 1; col++) {
      const x = col * tileW + offset + 2;
      const y = row * tileH + 2;
      const grad = ctx.createLinearGradient(x, y, x, y + tileH);
      grad.addColorStop(0, shade(tileColor, 10));
      grad.addColorStop(0.5, tileColor);
      grad.addColorStop(1, shade(tileColor, -8));
      ctx.fillStyle = grad;
      ctx.fillRect(x, y, tileW - 4, tileH - 4);
      // glossy highlight
      ctx.fillStyle = 'rgba(255,255,255,0.18)';
      ctx.fillRect(x + 2, y + 2, tileW - 8, 4);
    }
  }
  const map = new THREE.CanvasTexture(canvas);
  map.wrapS = THREE.RepeatWrapping; map.wrapT = THREE.RepeatWrapping;
  map.colorSpace = THREE.SRGBColorSpace; map.anisotropy = 8;

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size; bumpCanvas.height = size;
  const bctx = bumpCanvas.getContext('2d')!;
  bctx.fillStyle = '#404040'; bctx.fillRect(0, 0, size, size);
  bctx.fillStyle = '#c0c0c0';
  for (let row = 0; row < size / tileH; row++) {
    const offset = (row % 2) * (tileW / 2);
    for (let col = -1; col < size / tileW + 1; col++) {
      bctx.fillRect(col * tileW + offset + 2, row * tileH + 2, tileW - 4, tileH - 4);
    }
  }
  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping; bumpMap.wrapT = THREE.RepeatWrapping;
  return { map, bumpMap };
}

function compositeDeckTexture(baseColor = '#7a5a3a', darkColor = '#3a2a18'): { map: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = baseColor; ctx.fillRect(0, 0, size, size);
  // composite planks with realistic grooves
  const plankH = 32;
  for (let y = 0; y < size; y += plankH) {
    const grad = ctx.createLinearGradient(0, y, 0, y + plankH);
    grad.addColorStop(0, shade(baseColor, -8));
    grad.addColorStop(0.5, baseColor);
    grad.addColorStop(1, shade(baseColor, -16));
    ctx.fillStyle = grad;
    ctx.fillRect(0, y, size, plankH - 2);
    // wood grain
    ctx.strokeStyle = darkColor;
    ctx.globalAlpha = 0.3;
    ctx.lineWidth = 1;
    for (let g = 0; g < 6; g++) {
      ctx.beginPath();
      const gy = y + (g + 0.5) * (plankH / 6);
      ctx.moveTo(0, gy);
      for (let x = 0; x <= size; x += 8) ctx.lineTo(x, gy + Math.sin(x * 0.07 + y) * 0.8);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    // groove between planks
    ctx.fillStyle = darkColor;
    ctx.fillRect(0, y + plankH - 2, size, 2);
    // brush strokes (composite texture)
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = shade(baseColor, 20);
    for (let x = 0; x < size; x += 4) {
      ctx.fillRect(x, y + 4, 2, plankH - 8);
    }
    ctx.globalAlpha = 1;
  }
  const map = new THREE.CanvasTexture(canvas);
  map.wrapS = THREE.RepeatWrapping; map.wrapT = THREE.RepeatWrapping;
  map.colorSpace = THREE.SRGBColorSpace; map.anisotropy = 8;

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size; bumpCanvas.height = size;
  const bctx = bumpCanvas.getContext('2d')!;
  bctx.fillStyle = '#808080'; bctx.fillRect(0, 0, size, size);
  bctx.fillStyle = '#202020';
  for (let y = 0; y < size; y += plankH) {
    bctx.fillRect(0, y + plankH - 2, size, 2);
  }
  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping; bumpMap.wrapT = THREE.RepeatWrapping;
  return { map, bumpMap };
}

function plasterWallTexture(color = '#e8e0d4'): { map: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = color; ctx.fillRect(0, 0, size, size);
  // subtle mottling
  for (let i = 0; i < 2000; i++) {
    const v = Math.random();
    ctx.fillStyle = v > 0.6 ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.04)';
    ctx.fillRect(Math.random() * size, Math.random() * size, 3, 3);
  }
  // soft wall streaks
  ctx.globalAlpha = 0.06;
  for (let i = 0; i < 8; i++) {
    ctx.fillStyle = '#000';
    ctx.fillRect(Math.random() * size, 0, 3 + Math.random() * 4, size);
  }
  ctx.globalAlpha = 1;
  const map = new THREE.CanvasTexture(canvas);
  map.wrapS = THREE.RepeatWrapping; map.wrapT = THREE.RepeatWrapping;
  map.colorSpace = THREE.SRGBColorSpace; map.anisotropy = 8;

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size; bumpCanvas.height = size;
  const bctx = bumpCanvas.getContext('2d')!;
  bctx.fillStyle = '#808080'; bctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 1500; i++) {
    bctx.fillStyle = Math.random() > 0.5 ? '#707070' : '#909090';
    bctx.fillRect(Math.random() * size, Math.random() * size, 2, 2);
  }
  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping; bumpMap.wrapT = THREE.RepeatWrapping;
  return { map, bumpMap };
}

// ====================== APARTMENT ======================

export function createBayAreaApartmentGeometry(): THREE.Group {
  const root = new THREE.Group();

  // ===== LAYOUT (10 units = 1 meter) =====
  // Footprint: X[-100,100], Z[-70,70]  (200 x 140 = 20m x 14m)
  // Ceiling: FH=30 (3m), Wall thickness: WT=4 (0.4m)
  //
  // Rooms (non-overlapping):
  //   Living+Kitchen:  X[-100,30],  Z[-70,30]   (130 x 100)
  //   Hallway:         X[30,70],    Z[-30,30]   (40 x 60)
  //   Bathroom:        X[70,100],   Z[-30,30]   (30 x 60)
  //   Bedroom 1:       X[30,100],   Z[30,70]    (70 x 40)
  //   Bedroom 2:       X[30,100],   Z[-70,-30]  (70 x 40)
  //   Balcony:         X[-100,0],   Z[70,120]   (100 x 50, OUTSIDE north wall)
  //
  // Doorways (8 wide, 14 tall):
  //   Living↔Hallway:    X=30, Z=-9..-1
  //   Hallway↔Bathroom:  X=70, Z=-9..-1
  //   Hallway↔Bedroom1:  Z=30, X=46..54
  //   Living↔Bedroom2:   X=30, Z=-48..-40
  //   Living↔Balcony:    Z=70, X=-100..0 (sliding glass door, full width)

  const AW = 200, AD = 140, FH = 30, WT = 4;

  // ===== FLOOR MATERIALS =====
  const livingFloor = herringboneFloorTexture('#9c6b3a', '#5a3a1a');
  livingFloor.map.repeat.set(4, 3); livingFloor.bumpMap.repeat.set(4, 3);
  const livingFloorMat = new THREE.MeshStandardMaterial({ map: livingFloor.map, bumpMap: livingFloor.bumpMap, bumpScale: 0.04, metalness: 0.1, roughness: 0.5 });

  const hallFloor = chevronFloorTexture('#6b4528', '#3a2515');
  hallFloor.map.repeat.set(6, 2); hallFloor.bumpMap.repeat.set(6, 2);
  const hallFloorMat = new THREE.MeshStandardMaterial({ map: hallFloor.map, bumpMap: hallFloor.bumpMap, bumpScale: 0.04, metalness: 0.1, roughness: 0.5 });

  const kitchenFloor = subwayTileTexture('#d8cfbf', '#5a4a3a');
  kitchenFloor.map.repeat.set(8, 6); kitchenFloor.bumpMap.repeat.set(8, 6);
  const kitchenFloorMat = new THREE.MeshStandardMaterial({ map: kitchenFloor.map, bumpMap: kitchenFloor.bumpMap, bumpScale: 0.02, metalness: 0.1, roughness: 0.4 });

  const bathFloor = hexTileTexture('#e8e4d8', '#d4cec0', '#8a8275');
  bathFloor.map.repeat.set(4, 4); bathFloor.bumpMap.repeat.set(4, 4);
  const bathFloorMat = new THREE.MeshStandardMaterial({ map: bathFloor.map, bumpMap: bathFloor.bumpMap, bumpScale: 0.025, metalness: 0.05, roughness: 0.3 });

  const bed1Floor = plushCarpetTexture('#4a4055', '#6a5a75');
  bed1Floor.map.repeat.set(4, 4); bed1Floor.bumpMap.repeat.set(4, 4);
  const bed1FloorMat = new THREE.MeshStandardMaterial({ map: bed1Floor.map, bumpMap: bed1Floor.bumpMap, bumpScale: 0.06, metalness: 0.0, roughness: 0.95 });

  const bed2Floor = plushCarpetTexture('#3a4a55', '#5a6a78');
  bed2Floor.map.repeat.set(4, 4); bed2Floor.bumpMap.repeat.set(4, 4);
  const bed2FloorMat = new THREE.MeshStandardMaterial({ map: bed2Floor.map, bumpMap: bed2Floor.bumpMap, bumpScale: 0.06, metalness: 0.0, roughness: 0.95 });

  const balconyFloor = compositeDeckTexture('#7a5a3a', '#3a2a18');
  balconyFloor.map.repeat.set(8, 4); balconyFloor.bumpMap.repeat.set(8, 4);
  const balconyFloorMat = new THREE.MeshStandardMaterial({ map: balconyFloor.map, bumpMap: balconyFloor.bumpMap, bumpScale: 0.05, metalness: 0.05, roughness: 0.7 });

  // ===== WALL / CEILING MATERIALS =====
  const wallTex = plasterWallTexture('#e8e0d4');
  wallTex.map.repeat.set(4, 2); wallTex.bumpMap.repeat.set(4, 2);
  const wallMat = new THREE.MeshStandardMaterial({ map: wallTex.map, bumpMap: wallTex.bumpMap, bumpScale: 0.015, metalness: 0.0, roughness: 0.85 });

  const accentWallTex = plasterWallTexture('#3a4a5a');
  accentWallTex.map.repeat.set(4, 2); accentWallTex.bumpMap.repeat.set(4, 2);
  const accentWallMat = new THREE.MeshStandardMaterial({ map: accentWallTex.map, bumpMap: accentWallTex.bumpMap, bumpScale: 0.015, metalness: 0.0, roughness: 0.85 });

  const bathWallTex = subwayTileTexture('#f0e8d8', '#9a9080');
  bathWallTex.map.repeat.set(6, 4); bathWallTex.bumpMap.repeat.set(6, 4);
  const bathWallMat = new THREE.MeshStandardMaterial({ map: bathWallTex.map, bumpMap: bathWallTex.bumpMap, bumpScale: 0.02, metalness: 0.05, roughness: 0.3 });

  const backsplashTex = hexTileTexture('#3a3a4a', '#2a2a3a', '#5a5a6a');
  backsplashTex.map.repeat.set(6, 3); backsplashTex.bumpMap.repeat.set(6, 3);
  const backsplashMat = new THREE.MeshStandardMaterial({ map: backsplashTex.map, bumpMap: backsplashTex.bumpMap, bumpScale: 0.02, metalness: 0.1, roughness: 0.3 });

  const ceilTex = plasterWallTexture('#f5f0e8');
  ceilTex.map.repeat.set(6, 4);
  const ceilMat = new THREE.MeshStandardMaterial({ map: ceilTex.map, bumpMap: ceilTex.bumpMap, bumpScale: 0.01, metalness: 0.0, roughness: 0.9 });

  const trimMat = new THREE.MeshStandardMaterial({ color: 0xf8f4ec, metalness: 0.05, roughness: 0.4 });
  const darkTrimMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, metalness: 0.3, roughness: 0.4 });

  // ===== GLASS / WINDOW =====
  const glassMat = new THREE.MeshStandardMaterial({ color: 0x88aacc, metalness: 0.7, roughness: 0.05, transparent: true, opacity: 0.35 });
  const windowFrameMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, metalness: 0.5, roughness: 0.3 });

  // ===== FURNITURE MATERIALS =====
  const sofaFabric = makeFabricTexture('#3a4a5a', '#2a3a4a');
  sofaFabric.map.repeat.set(3, 1); sofaFabric.bumpMap.repeat.set(3, 1);
  const sofaMat = new THREE.MeshStandardMaterial({ map: sofaFabric.map, bumpMap: sofaFabric.bumpMap, bumpScale: 0.05, metalness: 0.05, roughness: 0.75 });

  const accentChairFabric = makeFabricTexture('#a05030', '#7a3520');
  accentChairFabric.map.repeat.set(2, 1); accentChairFabric.bumpMap.repeat.set(2, 1);
  const accentChairMat = new THREE.MeshStandardMaterial({ map: accentChairFabric.map, bumpMap: accentChairFabric.bumpMap, bumpScale: 0.05, metalness: 0.05, roughness: 0.7 });

  const woodFurnitureTex = makeWoodTexture('#4a2f15', '#2a1808');
  woodFurnitureTex.map.repeat.set(4, 2); woodFurnitureTex.bumpMap.repeat.set(4, 2);
  const woodFurnMat = new THREE.MeshStandardMaterial({ map: woodFurnitureTex.map, bumpMap: woodFurnitureTex.bumpMap, bumpScale: 0.03, metalness: 0.1, roughness: 0.5 });

  const oakTableTex = makeWoodTexture('#a8784a', '#5a3520');
  oakTableTex.map.repeat.set(3, 2); oakTableTex.bumpMap.repeat.set(3, 2);
  const oakTableMat = new THREE.MeshStandardMaterial({ map: oakTableTex.map, bumpMap: oakTableTex.bumpMap, bumpScale: 0.03, metalness: 0.1, roughness: 0.45 });

  const graniteCounter = makeGraniteTexture();
  graniteCounter.map.repeat.set(4, 2); graniteCounter.bumpMap.repeat.set(4, 2);
  const counterMat = new THREE.MeshStandardMaterial({ map: graniteCounter.map, bumpMap: graniteCounter.bumpMap, bumpScale: 0.01, metalness: 0.3, roughness: 0.15 });

  const marbleCounter = makeMarbleTexture();
  marbleCounter.map.repeat.set(3, 2); marbleCounter.bumpMap.repeat.set(3, 2);
  const marbleCounterMat = new THREE.MeshStandardMaterial({ map: marbleCounter.map, bumpMap: marbleCounter.bumpMap, bumpScale: 0.01, metalness: 0.2, roughness: 0.1 });

  const cabinetMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.3, roughness: 0.4 });
  const whiteCabinetMat = new THREE.MeshStandardMaterial({ color: 0xf0ece4, metalness: 0.05, roughness: 0.4 });
  const applianceMat = new THREE.MeshStandardMaterial({ color: 0xc8c8cc, metalness: 0.85, roughness: 0.15 });
  const brassMat = new THREE.MeshStandardMaterial({ color: 0xc09545, metalness: 0.9, roughness: 0.25 });
  const rugTex = makeCarpetTexture('#7a3a3a', '#d4a060');
  rugTex.map.repeat.set(2, 1); rugTex.bumpMap.repeat.set(2, 1);
  const rugMat = new THREE.MeshStandardMaterial({ map: rugTex.map, bumpMap: rugTex.bumpMap, bumpScale: 0.04, metalness: 0.05, roughness: 0.85 });
  const potMat = new THREE.MeshStandardMaterial({ color: 0xe8d4b8, roughness: 0.6, metalness: 0.1 });

  // ===== HELPERS =====
  function wall(x: number, z: number, w: number, h: number, d: number, mat: THREE.Material = wallMat, name = 'wall', yCenter?: number) {
    const m = addShadow(new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat));
    m.position.set(x, yCenter !== undefined ? yCenter : h / 2, z);
    m.name = name;
    root.add(m);
    return m;
  }

  function baseboard(x: number, z: number, w: number, d: number) {
    const m = addShadow(new THREE.Mesh(new THREE.BoxGeometry(w, 1.5, d), trimMat));
    m.position.set(x, 0.75, z);
    root.add(m);
  }

  // ============================================================
  // GROUND / EXTERIOR BASE SLAB
  // ============================================================
  const baseSlab = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(AW + 200, 4, AD + 200),
    new THREE.MeshStandardMaterial({ color: 0x3a3a3a, metalness: 0.1, roughness: 0.8 })
  ));
  // Slab is 4 thick, centered at y=-2.5 → top at y=-0.5 (below apartment floors at y=0.05)
  // This prevents Z-fighting between slab top and room floor planes.
  baseSlab.position.set(0, -2.5, 0);
  root.add(baseSlab);

  const lineMat = new THREE.MeshStandardMaterial({ color: 0xddcc44, metalness: 0.1, roughness: 0.6 });
  for (let i = -2; i <= 2; i++) {
    const line = addShadow(new THREE.Mesh(new THREE.BoxGeometry(4, 0.5, 60), lineMat));
    line.position.set(i * 60, 0.6, 100);
    root.add(line);
  }

  // ============================================================
  // FLOOR SLABS (one per room, NO overlaps)
  // ============================================================
  // Living room floor (X[-100,30], Z[-70,30])
  // All room floors sit at y=0.05 — slightly above the slab top (y=-0.5) to prevent Z-fighting.
  const FLOOR_Y = 0.05;
  const livingFloorMesh = addShadow(new THREE.Mesh(new THREE.PlaneGeometry(130, 100), livingFloorMat));
  livingFloorMesh.rotation.x = -Math.PI / 2;
  livingFloorMesh.position.set(-35, FLOOR_Y, -20);
  livingFloorMesh.receiveShadow = true;
  root.add(livingFloorMesh);

  // Kitchen tile overlay (X[-100,-30], Z[-70,-30] — south-west corner of living)
  // Sits above the living floor (y=0.05) at y=0.1 to prevent Z-fighting with living floor.
  const kitchenTileOverlay = addShadow(new THREE.Mesh(new THREE.PlaneGeometry(70, 40), kitchenFloorMat));
  kitchenTileOverlay.rotation.x = -Math.PI / 2;
  kitchenTileOverlay.position.set(-65, 0.1, -50);
  kitchenTileOverlay.receiveShadow = true;
  root.add(kitchenTileOverlay);

  // Hallway floor (X[30,70], Z[-30,30])
  const hallFloorMesh = addShadow(new THREE.Mesh(new THREE.PlaneGeometry(40, 60), hallFloorMat));
  hallFloorMesh.rotation.x = -Math.PI / 2;
  hallFloorMesh.position.set(50, FLOOR_Y, 0);
  hallFloorMesh.receiveShadow = true;
  root.add(hallFloorMesh);

  // Bathroom floor (X[70,100], Z[-30,30])
  const bathFloorMesh = addShadow(new THREE.Mesh(new THREE.PlaneGeometry(30, 60), bathFloorMat));
  bathFloorMesh.rotation.x = -Math.PI / 2;
  bathFloorMesh.position.set(85, FLOOR_Y, 0);
  bathFloorMesh.receiveShadow = true;
  root.add(bathFloorMesh);

  // Bedroom 1 floor (X[30,100], Z[30,70])
  const bed1FloorMesh = addShadow(new THREE.Mesh(new THREE.PlaneGeometry(70, 40), bed1FloorMat));
  bed1FloorMesh.rotation.x = -Math.PI / 2;
  bed1FloorMesh.position.set(65, FLOOR_Y, 50);
  bed1FloorMesh.receiveShadow = true;
  root.add(bed1FloorMesh);

  // Bedroom 2 floor (X[30,100], Z[-70,-30])
  const bed2FloorMesh = addShadow(new THREE.Mesh(new THREE.PlaneGeometry(70, 40), bed2FloorMat));
  bed2FloorMesh.rotation.x = -Math.PI / 2;
  bed2FloorMesh.position.set(65, FLOOR_Y, -50);
  bed2FloorMesh.receiveShadow = true;
  root.add(bed2FloorMesh);

  // Balcony floor (X[-100,0], Z[70,120] — OUTSIDE north wall)
  // Sits at y=0.1 (same level as apartment interior floors, just above slab top at y=-0.5).
  const balconyFloorMesh = addShadow(new THREE.Mesh(new THREE.PlaneGeometry(100, 50), balconyFloorMat));
  balconyFloorMesh.rotation.x = -Math.PI / 2;
  balconyFloorMesh.position.set(-50, 0.1, 95);
  balconyFloorMesh.receiveShadow = true;
  root.add(balconyFloorMesh);

  // ============================================================
  // THRESHOLD STRIPS (brass transition strips at doorways)
  // ============================================================
  const thresholds = [
    { x: 30, z: -5, w: WT, d: 8 },   // living to hallway
    { x: 70, z: -5, w: WT, d: 8 },   // hallway to bathroom
    { x: 50, z: 30, w: 8, d: WT },   // hallway to bedroom 1
    { x: 30, z: -44, w: WT, d: 8 },  // living to bedroom 2
  ];
  for (const t of thresholds) {
    const strip = addShadow(new THREE.Mesh(new THREE.BoxGeometry(t.w, 0.5, t.d), brassMat));
    strip.position.set(t.x, 0.3, t.z);
    root.add(strip);
  }

  // ============================================================
  // EXTERIOR WALLS
  // ============================================================
  // South wall (Z=-70, full width)
  wall(0, -70 - WT / 2, AW + WT * 2, FH, WT, wallMat, 'wall-south');

  // North wall: split — west segment (X=-100..0) is balcony door opening, east segment (X=0..100) is solid
  wall(50, 70 + WT / 2, 100 + WT, FH, WT, wallMat, 'wall-north-east');

  // West wall (X=-100, full depth Z=-70..70)
  wall(-100 - WT / 2, 0, WT, FH, AD + WT * 2, wallMat, 'wall-west');

  // East wall (X=100, full depth Z=-70..70)
  wall(100 + WT / 2, 0, WT, FH, AD + WT * 2, wallMat, 'wall-east');

  // Balcony walls/railings (outside apartment, Z=70..120):
  // North railing at Z=120 (glass), West railing at X=-100 (glass), East wall at X=0 (short solid wall for privacy)
  // These are added later in the balcony section.

  // ============================================================
  // INTERIOR WALLS
  // ============================================================
  // --- Wall at X=30 (Living | Bedroom2 + Hallway) ---
  // Segments: Z=-70..-48 (solid), Z=-48..-40 (door opening), Z=-40..-30 (solid),
  //           Z=-30..-9 (solid), Z=-9..-1 (door opening), Z=-1..30 (solid)
  wall(30, -59, WT, FH, 22, wallMat, 'wall-30-a');       // Z=-70..-48
  wall(30, -35, WT, FH, 10, wallMat, 'wall-30-b');       // Z=-40..-30
  wall(30, -19.5, WT, FH, 21, wallMat, 'wall-30-c');     // Z=-30..-9
  wall(30, 14.5, WT, FH, 31, wallMat, 'wall-30-d');      // Z=-1..30
  // Headers above doors (16 tall, centered at y=21.95 so top is at y=29.95 — below ceiling at y=29.9)
  wall(30, -44, WT, 16, 8, wallMat, 'wall-30-hdr-br2', 21.95);  // Z=-48..-40
  wall(30, -5, WT, 16, 8, wallMat, 'wall-30-hdr-hall', 21.95);  // Z=-9..-1

  // --- Wall at X=70 (Hallway | Bathroom) ---
  // Segments: Z=-30..-9 (solid), Z=-9..-1 (door opening), Z=-1..30 (solid)
  wall(70, -19.5, WT, FH, 21, wallMat, 'wall-70-a');     // Z=-30..-9
  wall(70, 14.5, WT, FH, 31, wallMat, 'wall-70-b');      // Z=-1..30
  wall(70, -5, WT, 16, 8, wallMat, 'wall-70-hdr', 21.95);   // Z=-9..-1

  // --- Wall at Z=-30 (Bedroom2 | Hallway+Bathroom) ---
  // Full segment: X=30..100 (70 long), no door (BR2 accessed from X=30 wall)
  wall(65, -30, 70, FH, WT, wallMat, 'wall-zneg30');

  // --- Wall at Z=30 (Bedroom1 | Hallway+Bathroom) ---
  // Segments: X=30..46 (solid), X=46..54 (door opening), X=54..100 (solid)
  wall(38, 30, 16, FH, WT, wallMat, 'wall-zpos30-a');    // X=30..46
  wall(77, 30, 46, FH, WT, wallMat, 'wall-zpos30-b');    // X=54..100
  wall(50, 30, 8, 16, WT, wallMat, 'wall-zpos30-hdr', 21.95); // X=46..54

  // ============================================================
  // ACCENT WALL (living room, on the east side — X=30 wall facing west)
  // ============================================================
  // Accent panel — height FH-0.2=29.8, centered at y=(FH-0.2)/2=14.9, so top at y=29.8 (below ceiling at 29.9)
  const accentPanel = addShadow(new THREE.Mesh(
    new THREE.PlaneGeometry(80, FH - 0.2),
    accentWallMat
  ));
  accentPanel.position.set(29.8, (FH - 0.2) / 2, -10);
  accentPanel.rotation.y = -Math.PI / 2;  // faces -X (west, into living room)
  root.add(accentPanel);

  // ============================================================
  // BATHROOM TILE WALLS (subway tile on interior faces)
  // Bathroom: X[70,100], Z[-30,30]
  // ============================================================
  // All bathroom tile panels: height FH-0.2=29.8, centered at y=(FH-0.2)/2=14.9, so top at y=29.8 (below ceiling at 29.9).
  // This prevents Z-fighting at the ceiling line.
  const TILE_H = FH - 0.2;
  const TILE_Y = TILE_H / 2;
  // South wall interior face (Z=-30+WT, faces +Z)
  const bathTileSouth = addShadow(new THREE.Mesh(new THREE.PlaneGeometry(30 - WT, TILE_H), bathWallMat));
  bathTileSouth.position.set(85, TILE_Y, -30 + WT);
  root.add(bathTileSouth);
  // North wall interior face (Z=30-WT, faces -Z)
  const bathTileNorth = addShadow(new THREE.Mesh(new THREE.PlaneGeometry(30 - WT, TILE_H), bathWallMat));
  bathTileNorth.position.set(85, TILE_Y, 30 - WT);
  bathTileNorth.rotation.y = Math.PI;
  root.add(bathTileNorth);
  // West wall interior face (X=70+WT, faces +X)
  const bathTileWest = addShadow(new THREE.Mesh(new THREE.PlaneGeometry(60 - WT, TILE_H), bathWallMat));
  bathTileWest.position.set(70 + WT, TILE_Y, 0);
  bathTileWest.rotation.y = Math.PI / 2;
  root.add(bathTileWest);
  // East wall interior face (X=100-WT, faces -X)
  const bathTileEast = addShadow(new THREE.Mesh(new THREE.PlaneGeometry(60 - WT, TILE_H), bathWallMat));
  bathTileEast.position.set(100 - WT, TILE_Y, 0);
  bathTileEast.rotation.y = -Math.PI / 2;
  root.add(bathTileEast);

  // ============================================================
  // KITCHEN BACKSPLASH (on west wall, behind west counter)
  // West counter is at X=-94, Z=-50. Backsplash above counter, on wall.
  // Backsplash: 12 tall, centered at y=15 (spans y=9..21) — well below ceiling.
  // ============================================================
  const backsplash = addShadow(new THREE.Mesh(new THREE.PlaneGeometry(40, 12), backsplashMat));
  backsplash.position.set(-99.5, 15, -50);  // just in front of west wall (X=-100), above counter
  backsplash.rotation.y = Math.PI / 2;  // faces +X (east, into kitchen)
  root.add(backsplash);

  // ============================================================
  // CEILING
  // Ceiling sits at y=FH-0.1=29.9 — slightly below wall tops (y=30) to prevent Z-fighting
  // with wall tops, door header tops, bathroom tile panel tops, and accent panel top.
  // ============================================================
  const ceiling = addShadow(new THREE.Mesh(new THREE.PlaneGeometry(AW, AD), ceilMat));
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.set(0, FH - 0.1, 0);
  ceiling.receiveShadow = true;
  root.add(ceiling);

  // ============================================================
  // CEILING RECESSED LIGHTS
  // ============================================================
  const lightFixtureMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xfff4cc, emissiveIntensity: 0.8, metalness: 0.4, roughness: 0.3 });
  const lightPositions: [number, number][] = [
    [-80, -55], [-50, -55], [-80, -20], [-50, -20], [-20, -50], [-20, -10],  // living + kitchen
    [50, -15], [50, 15],                                                       // hallway
    [85, -15], [85, 15],                                                       // bathroom
    [55, 50], [80, 50],                                                        // bedroom 1
    [55, -50], [80, -50],                                                      // bedroom 2
  ];
  for (const [lx, lz] of lightPositions) {
    const fixture = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 1, 16), lightFixtureMat));
    fixture.position.set(lx, FH - 0.5, lz);
    root.add(fixture);
    const ptLight = new THREE.PointLight(0xfff4cc, 0.5, 80, 1.5);
    ptLight.position.set(lx, FH - 3, lz);
    ptLight.castShadow = false;
    root.add(ptLight);
  }

  // ============================================================
  // BASEBOARDS
  // ============================================================
  // Living room perimeter (X[-100,30], Z[-70,30])
  baseboard(-99, -20, 1, 100);   // west wall (Z=-70..30)
  baseboard(-35, 29, 130, 1);    // south wall (X=-100..30) — wait, south is Z=-70
  baseboard(-35, -69, 130, 1);   // south wall (X=-100..30, Z=-70)
  baseboard(-35, 29, 130, 1);    // north wall of living (X=-100..30, Z=30) — but Z=30 is interior wall
  // East wall of living (X=30, Z=-70..30) — has 2 doorways, split into segments
  baseboard(29, -59, 1, 22);     // Z=-70..-48
  baseboard(29, -35, 1, 10);     // Z=-40..-30
  baseboard(29, -19.5, 1, 21);   // Z=-30..-9
  baseboard(29, 14.5, 1, 31);    // Z=-1..30

  // Hallway perimeter (X[30,70], Z[-30,30])
  baseboard(69, 0, 1, 60);       // east wall (X=70, Z=-30..30) — has doorway, but baseboard can be continuous under header
  baseboard(50, -29, 40, 1);     // south wall (Z=-30)
  baseboard(50, 29, 40, 1);      // north wall (Z=30) — has doorway

  // Bathroom perimeter (X[70,100], Z[-30,30])
  baseboard(99, 0, 1, 60);       // east wall
  baseboard(85, -29, 30, 1);     // south wall
  baseboard(85, 29, 30, 1);      // north wall
  baseboard(71, 0, 1, 60);       // west wall

  // Bedroom 1 perimeter (X[30,100], Z[30,70])
  baseboard(99, 50, 1, 40);      // east wall
  baseboard(65, 69, 70, 1);      // north wall
  baseboard(65, 31, 70, 1);      // south wall (Z=30) — has doorway
  baseboard(31, 50, 1, 40);      // west wall (X=30)

  // Bedroom 2 perimeter (X[30,100], Z[-70,-30])
  baseboard(99, -50, 1, 40);     // east wall
  baseboard(65, -69, 70, 1);     // south wall
  baseboard(65, -31, 70, 1);     // north wall (Z=-30)
  baseboard(31, -50, 1, 40);     // west wall (X=30) — has doorway

  // ============================================================
  // WINDOWS
  // ============================================================
  function windowFrame(cx: number, cz: number, w: number, h: number, facing: 'south' | 'north' | 'east' | 'west') {
    const frameGroup = new THREE.Group();
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(w - 4, h - 4), glassMat);
    glass.position.set(cx, h / 2 + 4, cz);
    if (facing === 'south') glass.rotation.y = 0;
    if (facing === 'north') glass.rotation.y = Math.PI;
    if (facing === 'east') glass.rotation.y = -Math.PI / 2;
    if (facing === 'west') glass.rotation.y = Math.PI / 2;
    frameGroup.add(glass);
    function frPart(x: number, y: number, z: number, fw: number, fh: number, fd: number) {
      const m = addShadow(new THREE.Mesh(new THREE.BoxGeometry(fw, fh, fd), windowFrameMat));
      m.position.set(x, y, z);
      frameGroup.add(m);
    }
    if (facing === 'south' || facing === 'north') {
      frPart(cx - w / 2, h / 2 + 4, cz, 1, h, 1);
      frPart(cx + w / 2, h / 2 + 4, cz, 1, h, 1);
      frPart(cx, h + 4, cz, w, 1, 1);
      frPart(cx, 4, cz, w, 1, 1);
      frPart(cx, h / 2 + 4, cz, 1, h, 1);
      frPart(cx, h / 2 + 4, cz, w, 1, 1);
    } else {
      frPart(cx, h / 2 + 4, cz - w / 2, 1, h, 1);
      frPart(cx, h / 2 + 4, cz + w / 2, 1, h, 1);
      frPart(cx, h + 4, cz, 1, 1, w);
      frPart(cx, 4, cz, 1, 1, w);
      frPart(cx, h / 2 + 4, cz, 1, h, 1);
      frPart(cx, h / 2 + 4, cz, 1, 1, w);
    }
    root.add(frameGroup);
  }

  // South-facing windows (living room + bedroom 2)
  windowFrame(-70, -70 + WT / 2, 50, 22, 'south');   // living window 1
  windowFrame(-20, -70 + WT / 2, 40, 22, 'south');   // living window 2
  windowFrame(60, -70 + WT / 2, 30, 20, 'south');    // bedroom 2 window
  // North-facing window (bedroom 1)
  windowFrame(60, 70 - WT / 2, 40, 22, 'north');
  // East-facing window (bathroom)
  windowFrame(100 - WT / 2, 0, 20, 16, 'east');
  // West-facing window (kitchen above sink)
  windowFrame(-100 + WT / 2, -50, 30, 20, 'west');

  // ============================================================
  // LIVING ROOM FURNITURE
  // Living: X[-100,30], Z[-70,30]. Kitchen in SW corner X[-100,-30], Z[-70,-30].
  // ============================================================

  // --- Sectional sofa (L-shape) in the east part of living ---
  // Main sofa: along south area, facing north
  const sofa1 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(50, 8, 16), sofaMat));
  sofa1.position.set(-10, 4, -55);
  root.add(sofa1);
  for (let i = 0; i < 4; i++) {
    const cushion = addShadow(new THREE.Mesh(new THREE.BoxGeometry(11, 2, 12), sofaMat));
    cushion.position.set(-10 - 18 + i * 12, 9, -55);
    root.add(cushion);
  }
  for (let i = 0; i < 4; i++) {
    const bc = addShadow(new THREE.Mesh(new THREE.BoxGeometry(11, 8, 3), sofaMat));
    bc.position.set(-10 - 18 + i * 12, 11, -60);
    root.add(bc);
  }
  // L-arm: extends north from the east end of sofa1
  const sofa2 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(16, 8, 30), sofaMat));
  sofa2.position.set(16, 4, -40);
  root.add(sofa2);

  // Accent chair
  const accentChair = addShadow(new THREE.Mesh(new THREE.BoxGeometry(14, 8, 14), accentChairMat));
  accentChair.position.set(-25, 4, -25);
  root.add(accentChair);
  const accentChairBack = addShadow(new THREE.Mesh(new THREE.BoxGeometry(14, 12, 3), accentChairMat));
  accentChairBack.position.set(-25, 10, -19);
  root.add(accentChairBack);

  // Coffee table (oak)
  const coffeeTable = addShadow(new THREE.Mesh(new THREE.BoxGeometry(30, 2, 16), oakTableMat));
  coffeeTable.position.set(-10, 4, -40);
  root.add(coffeeTable);
  for (const [lx, lz] of [[-23, -46], [3, -46], [-23, -34], [3, -34]]) {
    const leg = addShadow(new THREE.Mesh(new THREE.BoxGeometry(2, 4, 2), darkTrimMat));
    leg.position.set(lx, 2, lz);
    root.add(leg);
  }

  // Area rug under coffee table (sits above the living floor at y=0.05)
  const areaRug = addShadow(new THREE.Mesh(new THREE.PlaneGeometry(50, 30), rugMat));
  areaRug.rotation.x = -Math.PI / 2;
  areaRug.position.set(-10, 0.15, -40);
  root.add(areaRug);

  // --- TV media console against east wall (X=30, facing west into living) ---
  const mediaConsole = addShadow(new THREE.Mesh(new THREE.BoxGeometry(12, 6, 50), woodFurnMat));
  mediaConsole.position.set(24, 3, -10);  // X=18..30, Z=-35..15
  root.add(mediaConsole);
  // TV mounted on X=30 wall, facing west
  const tvFrame = addShadow(new THREE.Mesh(new THREE.BoxGeometry(1.5, 22, 40), darkTrimMat));
  tvFrame.position.set(29.25, 18, -10);  // back at X=30, front at X=28.5
  root.add(tvFrame);
  const tvScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(38, 20),
    new THREE.MeshStandardMaterial({ color: 0x0a0a14, emissive: 0x0a1a2a, emissiveIntensity: 0.4, metalness: 0.3, roughness: 0.2 })
  );
  tvScreen.position.set(28.4, 18, -10);
  tvScreen.rotation.y = -Math.PI / 2;  // faces -X (west)
  root.add(tvScreen);

  // Floor lamp next to sofa
  const lampPole = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 30, 8), darkTrimMat));
  lampPole.position.set(20, 15, -60);
  root.add(lampPole);
  const lampShade = addShadow(new THREE.Mesh(
    new THREE.ConeGeometry(4, 6, 12, 1, true),
    new THREE.MeshStandardMaterial({ color: 0xf0e4c0, emissive: 0xfff0a0, emissiveIntensity: 0.3, metalness: 0.1, roughness: 0.6 })
  ));
  lampShade.position.set(20, 32, -60);
  root.add(lampShade);
  const lampLight = new THREE.PointLight(0xffe8a0, 0.5, 50, 2);
  lampLight.position.set(20, 30, -60);
  root.add(lampLight);

  // Bookshelf against east wall (X=30)
  const bookshelf = addShadow(new THREE.Mesh(new THREE.BoxGeometry(6, 24, 40), woodFurnMat));
  bookshelf.position.set(27, 12, 15);  // X=24..30, Z=-5..35 → wait, Z=35 is past living (Z=30). Fix Z.
  bookshelf.position.set(27, 12, 10);  // X=24..30, Z=-10..30 ✓
  root.add(bookshelf);
  const bookColors = [0x8b3a3a, 0x2a5a8a, 0x3a5a2a, 0x8a6a3a, 0x5a3a8a, 0x8a8a3a, 0x3a8a5a];
  for (let shelf = 0; shelf < 3; shelf++) {
    for (let i = 0; i < 8; i++) {
      const book = addShadow(new THREE.Mesh(
        new THREE.BoxGeometry(3, 6, 2.5 + Math.random() * 1.5),
        new THREE.MeshStandardMaterial({ color: bookColors[(shelf * 8 + i) % bookColors.length], roughness: 0.7 })
      ));
      book.position.set(26.5, 4 + shelf * 8, -8 + i * 4);  // books on the shelf, facing west
      root.add(book);
    }
  }

  // Potted plant (fiddle leaf fig) in NE corner of living
  const pot = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(4, 3, 6, 16), potMat));
  pot.position.set(20, 3, 20);
  root.add(pot);
  const trunk = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.8, 24, 8), woodFurnMat));
  trunk.position.set(20, 18, 20);
  root.add(trunk);
  for (let i = 0; i < 8; i++) {
    const leaf = addShadow(new THREE.Mesh(
      new THREE.SphereGeometry(4 + Math.random() * 2, 8, 6),
      new THREE.MeshStandardMaterial({ color: 0x3a6a3a, roughness: 0.8 })
    ));
    leaf.position.set(20 + (Math.random() - 0.5) * 10, 26 + Math.random() * 6, 20 + (Math.random() - 0.5) * 10);
    leaf.scale.set(1, 0.3, 1);
    root.add(leaf);
  }

  // ============================================================
  // KITCHEN FURNITURE (SW corner of living: X[-100,-30], Z[-70,-30])
  // ============================================================
  const counterH = 9;

  // West counter (along west wall X=-100, runs Z=-70..-30)
  const counter1 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(10, counterH, 40), cabinetMat));
  counter1.position.set(-94, counterH / 2, -50);  // X=-99..-89, Z=-70..-30
  root.add(counter1);
  const counterTop1 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(12, 1, 42), counterMat));
  counterTop1.position.set(-93, counterH + 0.5, -50);
  root.add(counterTop1);

  // South counter (along south wall Z=-70, runs X=-50..0)
  const counter2 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(50, counterH, 10), cabinetMat));
  counter2.position.set(-25, counterH / 2, -65);  // X=-50..0, Z=-70..-60
  root.add(counter2);
  const counterTop2 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(52, 1, 12), counterMat));
  counterTop2.position.set(-25, counterH + 0.5, -65);
  root.add(counterTop2);

  // Kitchen island (center of kitchen area)
  const island = addShadow(new THREE.Mesh(new THREE.BoxGeometry(30, counterH, 14), whiteCabinetMat));
  island.position.set(-65, counterH / 2, -50);  // X=-80..-50, Z=-57..-43
  root.add(island);
  const islandTop = addShadow(new THREE.Mesh(new THREE.BoxGeometry(32, 1, 16), marbleCounterMat));
  islandTop.position.set(-65, counterH + 0.5, -50);
  root.add(islandTop);

  // Bar stools (north side of island, facing south)
  for (const sx of [-72, -58]) {
    const stool = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.5, 6, 12), darkTrimMat));
    stool.position.set(sx, 3, -36);
    root.add(stool);
    const stoolSeat = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(3, 3, 1, 12),
      new THREE.MeshStandardMaterial({ color: 0xc09545, metalness: 0.5, roughness: 0.3 })
    ));
    stoolSeat.position.set(sx, 6.5, -36);
    root.add(stoolSeat);
  }

  // Stove (on west counter, at Z=-60)
  const stoveBody = addShadow(new THREE.Mesh(new THREE.BoxGeometry(10, 1, 14), applianceMat));
  stoveBody.position.set(-93, counterH + 1, -60);
  root.add(stoveBody);
  for (const [bx, bz] of [[-95, -62], [-91, -62], [-95, -58], [-91, -58]]) {
    const burner = addShadow(new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.3, 8, 16), darkTrimMat));
    burner.position.set(bx, counterH + 1.5, bz);
    burner.rotation.x = Math.PI / 2;
    root.add(burner);
  }
  // Range hood above stove
  const hood = addShadow(new THREE.Mesh(new THREE.BoxGeometry(14, 5, 10), applianceMat));
  hood.position.set(-93, 22, -60);
  root.add(hood);

  // Refrigerator (at corner of south counter, east end)
  const fridge = addShadow(new THREE.Mesh(new THREE.BoxGeometry(14, 24, 10), applianceMat));
  fridge.position.set(-7, 12, -65);  // X=-14..0, Z=-70..-60
  root.add(fridge);
  const fridgeHandle = addShadow(new THREE.Mesh(new THREE.BoxGeometry(0.5, 10, 1), darkTrimMat));
  fridgeHandle.position.set(-1, 14, -65);
  root.add(fridgeHandle);

  // Sink (on south counter)
  const sinkBasin = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(12, 1, 6),
    new THREE.MeshStandardMaterial({ color: 0xa8a8b0, metalness: 0.8, roughness: 0.2 })
  ));
  sinkBasin.position.set(-25, counterH + 0.3, -65);
  root.add(sinkBasin);
  const faucetBase = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 1, 8), brassMat));
  faucetBase.position.set(-25, counterH + 1, -69);
  root.add(faucetBase);
  const faucetSpout = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 6, 8), brassMat));
  faucetSpout.position.set(-25, counterH + 4, -69);
  faucetSpout.rotation.z = Math.PI / 2;
  root.add(faucetSpout);

  // Pendant lights over island (3)
  for (const px of [-75, -65, -55]) {
    const pendant = addShadow(new THREE.Mesh(
      new THREE.ConeGeometry(2.5, 4, 12, 1, true),
      new THREE.MeshStandardMaterial({ color: 0xc09545, metalness: 0.7, roughness: 0.3, emissive: 0xffc060, emissiveIntensity: 0.2 })
    ));
    pendant.position.set(px, 22, -50);
    root.add(pendant);
    const pendantCord = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 6, 6), darkTrimMat));
    pendantCord.position.set(px, 27, -50);
    root.add(pendantCord);
    const pLight = new THREE.PointLight(0xffd080, 0.4, 30, 2);
    pLight.position.set(px, 20, -50);
    root.add(pLight);
  }

  // Dining table (round, in the NE area of living)
  const diningTable = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(10, 10, 1.5, 24), oakTableMat));
  diningTable.position.set(-10, 8, 0);  // X=-20..0, Z=-10..10
  root.add(diningTable);
  const tableBase = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(2, 3, 7, 12), darkTrimMat));
  tableBase.position.set(-10, 3.5, 0);
  root.add(tableBase);
  // 4 dining chairs around the table
  for (const [dx, dz, ry] of [[-10, -11, 0], [-10, 11, Math.PI], [-22, 0, Math.PI / 2], [2, 0, -Math.PI / 2]]) {
    const chair = addShadow(new THREE.Mesh(new THREE.BoxGeometry(8, 5, 8), woodFurnMat));
    chair.position.set(dx, 2.5, dz);
    root.add(chair);
    const chairBack = addShadow(new THREE.Mesh(new THREE.BoxGeometry(8, 8, 1), woodFurnMat));
    chairBack.position.set(dx + Math.sin(ry) * 4, 6, dz + Math.cos(ry) * 4);
    chairBack.rotation.y = ry;
    root.add(chairBack);
  }

  // ============================================================
  // HALLWAY FURNITURE (X[30,70], Z[-30,30])
  // ============================================================
  // Console table against X=30 wall (living/hallway wall)
  const console = addShadow(new THREE.Mesh(new THREE.BoxGeometry(4, 4, 20), woodFurnMat));
  console.position.set(33, 2, -20);  // X=31..35, Z=-30..-10
  root.add(console);
  // Mirror above console (on X=30 wall, facing +X into hallway)
  const mirrorFrame = addShadow(new THREE.Mesh(new THREE.BoxGeometry(1, 18, 14), brassMat));
  mirrorFrame.position.set(30.5, 14, -20);
  root.add(mirrorFrame);
  const mirror = new THREE.Mesh(
    new THREE.PlaneGeometry(12, 16),
    new THREE.MeshStandardMaterial({ color: 0xaaaab0, metalness: 0.9, roughness: 0.05 })
  );
  mirror.position.set(31, 14, -20);
  mirror.rotation.y = Math.PI / 2;  // faces +X
  root.add(mirror);

  // Wall art (3 prints on X=30 wall)
  for (let i = 0; i < 3; i++) {
    const artFrame = addShadow(new THREE.Mesh(new THREE.BoxGeometry(0.5, 8, 6), woodFurnMat));
    artFrame.position.set(30.5, 15, 0 + i * 10);
    root.add(artFrame);
    const artCanvas = new THREE.Mesh(
      new THREE.PlaneGeometry(7, 5),
      new THREE.MeshStandardMaterial({
        color: [0x5a3a5a, 0x3a5a7a, 0x7a5a3a][i],
        emissive: [0x5a3a5a, 0x3a5a7a, 0x7a5a3a][i],
        emissiveIntensity: 0.05, roughness: 0.8
      })
    );
    artCanvas.position.set(30.7, 15, 0 + i * 10);
    artCanvas.rotation.y = Math.PI / 2;
    root.add(artCanvas);
  }

  // ============================================================
  // BEDROOM 1 FURNITURE (X[30,100], Z[30,70]) — Master
  // ============================================================
  // King bed (headboard against north wall Z=70)
  const bedFrame = addShadow(new THREE.Mesh(new THREE.BoxGeometry(36, 4, 30), woodFurnMat));
  bedFrame.position.set(60, 2, 55);  // X=42..78, Z=40..70
  root.add(bedFrame);
  const mattress = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(34, 5, 28),
    new THREE.MeshStandardMaterial({ color: 0xf0ece4, roughness: 0.7 })
  ));
  mattress.position.set(60, 6.5, 55);
  root.add(mattress);
  // Pillows (at north end, near headboard)
  for (const px of [50, 70]) {
    const pillow = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(14, 2.5, 8),
      new THREE.MeshStandardMaterial({ color: 0xfafaf0, roughness: 0.7 })
    ));
    pillow.position.set(px, 10, 64);
    root.add(pillow);
  }
  // Duvet
  const duvet = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(34, 1.5, 18),
    new THREE.MeshStandardMaterial({ color: 0x6a5a78, roughness: 0.7 })
  ));
  duvet.position.set(60, 9, 48);
  root.add(duvet);
  // Headboard (against north wall Z=70)
  const headboard = addShadow(new THREE.Mesh(new THREE.BoxGeometry(38, 14, 2), woodFurnMat));
  headboard.position.set(60, 9, 69);  // Z=68..70
  root.add(headboard);

  // Nightstands (on east and west sides of bed, at north end)
  for (const nx of [38, 82]) {
    const ns = addShadow(new THREE.Mesh(new THREE.BoxGeometry(8, 6, 8), woodFurnMat));
    ns.position.set(nx, 3, 64);
    root.add(ns);
    const tlBase = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.5, 4, 8), brassMat));
    tlBase.position.set(nx, 8, 64);
    root.add(tlBase);
    const tlShade = addShadow(new THREE.Mesh(
      new THREE.ConeGeometry(2.5, 4, 12, 1, true),
      new THREE.MeshStandardMaterial({ color: 0xf0e4c0, emissive: 0xfff0a0, emissiveIntensity: 0.3, roughness: 0.5 })
    ));
    tlShade.position.set(nx, 11, 64);
    root.add(tlShade);
    const tlLight = new THREE.PointLight(0xffe8a0, 0.3, 20, 2);
    tlLight.position.set(nx, 10, 64);
    root.add(tlLight);
  }

  // Dresser (against east wall X=100)
  const dresser = addShadow(new THREE.Mesh(new THREE.BoxGeometry(8, 10, 28), woodFurnMat));
  dresser.position.set(96, 5, 40);  // X=92..100, Z=26..54
  root.add(dresser);
  for (let i = 0; i < 3; i++) {
    const drawer = addShadow(new THREE.Mesh(new THREE.BoxGeometry(0.3, 2.8, 26), darkTrimMat));
    drawer.position.set(99.5, 2 + i * 3.2, 40);
    root.add(drawer);
  }
  for (let i = 0; i < 3; i++) {
    const knob = addShadow(new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 8), brassMat));
    knob.position.set(99.5, 3.4 + i * 3.2, 40);
    root.add(knob);
  }
  // Wall art above dresser
  const art2Frame = addShadow(new THREE.Mesh(new THREE.BoxGeometry(0.5, 10, 16), darkTrimMat));
  art2Frame.position.set(99.5, 18, 40);
  root.add(art2Frame);

  // Wardrobe (against south wall Z=30)
  const wardrobe = addShadow(new THREE.Mesh(new THREE.BoxGeometry(30, 24, 8), woodFurnMat));
  wardrobe.position.set(50, 12, 34);  // X=35..65, Z=30..38
  root.add(wardrobe);

  // ============================================================
  // BEDROOM 2 FURNITURE (X[30,100], Z[-70,-30]) — Home Office
  // ============================================================
  // Queen bed (headboard against south wall Z=-70)
  const bed2Frame = addShadow(new THREE.Mesh(new THREE.BoxGeometry(28, 4, 26), woodFurnMat));
  bed2Frame.position.set(55, 2, -50);  // X=41..69, Z=-63..-37
  root.add(bed2Frame);
  const bed2Mattress = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(26, 5, 24),
    new THREE.MeshStandardMaterial({ color: 0xf0ece4, roughness: 0.7 })
  ));
  bed2Mattress.position.set(55, 6.5, -50);
  root.add(bed2Mattress);
  const bed2Pillow = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(22, 2.5, 7),
    new THREE.MeshStandardMaterial({ color: 0xfafaf0, roughness: 0.7 })
  ));
  bed2Pillow.position.set(55, 10, -62);
  root.add(bed2Pillow);
  const bed2Duvet = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(26, 1.5, 16),
    new THREE.MeshStandardMaterial({ color: 0x5a6a78, roughness: 0.7 })
  ));
  bed2Duvet.position.set(55, 9, -45);
  root.add(bed2Duvet);
  // Headboard (against south wall Z=-70)
  const bed2Headboard = addShadow(new THREE.Mesh(new THREE.BoxGeometry(30, 12, 2), woodFurnMat));
  bed2Headboard.position.set(55, 8, -69);  // Z=-70..-68
  root.add(bed2Headboard);

  // Desk (against east wall X=100)
  const desk = addShadow(new THREE.Mesh(new THREE.BoxGeometry(8, 3, 20), woodFurnMat));
  desk.position.set(96, 6, -50);  // X=92..100, Z=-60..-40
  root.add(desk);
  for (const [lx, lz] of [[92, -58], [100, -58], [92, -42], [100, -42]]) {
    const leg = addShadow(new THREE.Mesh(new THREE.BoxGeometry(1, 5, 1), darkTrimMat));
    leg.position.set(lx, 2.5, lz);
    root.add(leg);
  }
  // Office chair (west of desk)
  const chairSeat = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(8, 2, 8),
    new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.6 })
  ));
  chairSeat.position.set(85, 8, -50);
  root.add(chairSeat);
  const chairBackRest = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(8, 10, 1),
    new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.6 })
  ));
  chairBackRest.position.set(85, 13, -46);
  root.add(chairBackRest);
  const chairPost = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 4, 8), darkTrimMat));
  chairPost.position.set(85, 5, -50);
  root.add(chairPost);
  // Monitor (on desk, against east wall)
  const monitorStand = addShadow(new THREE.Mesh(new THREE.BoxGeometry(4, 4, 4), darkTrimMat));
  monitorStand.position.set(96, 9.5, -50);
  root.add(monitorStand);
  const monitorFrame = addShadow(new THREE.Mesh(new THREE.BoxGeometry(0.5, 9, 16), darkTrimMat));
  monitorFrame.position.set(99.5, 16, -50);
  root.add(monitorFrame);
  const monitorScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(15, 8),
    new THREE.MeshStandardMaterial({ color: 0x0a0a14, emissive: 0x1a3a5a, emissiveIntensity: 0.4, metalness: 0.3, roughness: 0.2 })
  );
  monitorScreen.position.set(99, 16, -50);
  monitorScreen.rotation.y = -Math.PI / 2;  // faces -X (west)
  root.add(monitorScreen);

  // ============================================================
  // BATHROOM FURNITURE (X[70,100], Z[-30,30])
  // ============================================================
  // Bathtub (along south wall Z=-30)
  const tub = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(20, 5, 8),
    new THREE.MeshStandardMaterial({ color: 0xf0f0f0, metalness: 0.2, roughness: 0.15 })
  ));
  tub.position.set(85, 2.5, -26);  // X=75..95, Z=-30..-22
  root.add(tub);
  const tubInterior = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(18, 4, 6),
    new THREE.MeshStandardMaterial({ color: 0xc8c8d0, metalness: 0.2, roughness: 0.15 })
  ));
  tubInterior.position.set(85, 3.5, -26);
  root.add(tubInterior);
  const tubFaucet = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 4, 8), brassMat));
  tubFaucet.position.set(85, 7, -29);
  root.add(tubFaucet);

  // Vanity (along north wall Z=30)
  const vanity = addShadow(new THREE.Mesh(new THREE.BoxGeometry(20, 8, 6), whiteCabinetMat));
  vanity.position.set(85, 4, 27);  // X=75..95, Z=24..30
  root.add(vanity);
  const vanityTop = addShadow(new THREE.Mesh(new THREE.BoxGeometry(22, 1, 8), marbleCounterMat));
  vanityTop.position.set(85, 8.5, 27);
  root.add(vanityTop);
  // Sink basin
  const sink = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(3, 2.5, 2, 16),
    new THREE.MeshStandardMaterial({ color: 0xf0f0f0, metalness: 0.2, roughness: 0.1 })
  ));
  sink.position.set(85, 9, 27);
  root.add(sink);
  // Faucet
  const vFaucet = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 4, 8), brassMat));
  vFaucet.position.set(85, 11, 25);
  root.add(vFaucet);
  const vFaucetSpout = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 4, 8), brassMat));
  vFaucetSpout.position.set(85, 13, 27);
  vFaucetSpout.rotation.x = Math.PI / 2;
  root.add(vFaucetSpout);

  // Mirror above vanity (on north wall Z=30)
  const vanityMirror = addShadow(new THREE.Mesh(new THREE.BoxGeometry(18, 0.5, 12), brassMat));
  vanityMirror.position.set(85, 17, 30);
  root.add(vanityMirror);
  const vanityMirrorGlass = new THREE.Mesh(
    new THREE.PlaneGeometry(16, 10),
    new THREE.MeshStandardMaterial({ color: 0xaaaab0, metalness: 0.9, roughness: 0.05 })
  );
  vanityMirrorGlass.position.set(85, 17, 29.7);
  vanityMirrorGlass.rotation.y = Math.PI;  // faces -Z (south, into bathroom)
  root.add(vanityMirrorGlass);

  // Toilet (along east wall X=100)
  const toiletBowl = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(3, 3.5, 3, 16),
    new THREE.MeshStandardMaterial({ color: 0xf5f5f5, metalness: 0.1, roughness: 0.2 })
  ));
  toiletBowl.position.set(96, 1.5, 0);
  root.add(toiletBowl);
  const toiletSeat = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(3.2, 3.2, 0.5, 16),
    new THREE.MeshStandardMaterial({ color: 0xfafafa, metalness: 0.1, roughness: 0.3 })
  ));
  toiletSeat.position.set(96, 3.2, 0);
  root.add(toiletSeat);
  const toiletTank = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(3, 6, 7),
    new THREE.MeshStandardMaterial({ color: 0xf5f5f5, metalness: 0.1, roughness: 0.2 })
  ));
  toiletTank.position.set(98, 6, 0);  // X=96.5..99.5, Z=-3.5..3.5
  root.add(toiletTank);

  // Towel rack with towels (on east wall, north of toilet)
  const rackBar = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 14, 8), brassMat));
  rackBar.rotation.x = Math.PI / 2;  // horizontal along Z
  rackBar.position.set(99, 12, 10);
  root.add(rackBar);
  for (let i = 0; i < 2; i++) {
    const towel = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(1, 8, 5),
      new THREE.MeshStandardMaterial({ color: [0x5a7a8a, 0xaac4cc][i], roughness: 0.8 })
    ));
    towel.position.set(98.5, 8, 7 + i * 4);
    root.add(towel);
  }

  // ============================================================
  // BALCONY (X[-100,0], Z[70,120] — OUTSIDE north wall)
  // ============================================================
  const railingMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.7, roughness: 0.3 });

  // Sliding glass door frame (in the balcony opening, Z=70, X=-100..0)
  // Top track
  const doorTrackTop = addShadow(new THREE.Mesh(new THREE.BoxGeometry(100, 2, 1), railingMat));
  doorTrackTop.position.set(-50, FH - 1, 70);
  root.add(doorTrackTop);
  // Bottom track
  const doorTrackBottom = addShadow(new THREE.Mesh(new THREE.BoxGeometry(100, 1, 1), railingMat));
  doorTrackBottom.position.set(-50, 0.5, 70);
  root.add(doorTrackBottom);
  // Side posts
  const doorPost1 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(1, FH, 1), railingMat));
  doorPost1.position.set(-100, FH / 2, 70);
  root.add(doorPost1);
  const doorPost2 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(1, FH, 1), railingMat));
  doorPost2.position.set(0, FH / 2, 70);
  root.add(doorPost2);
  // Glass sliding door panels (2 panels, slightly offset to show they're sliding doors)
  const slideGlass1 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(48, FH - 4, 0.5), glassMat));
  slideGlass1.position.set(-26, FH / 2, 69.5);
  root.add(slideGlass1);
  const slideGlass2 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(48, FH - 4, 0.5), glassMat));
  slideGlass2.position.set(-74, FH / 2, 70.5);
  root.add(slideGlass2);

  // Balcony railings (3 sides: west X=-100, north Z=120, east X=0)
  // Top rails
  const railTopW = addShadow(new THREE.Mesh(new THREE.BoxGeometry(1, 1, 50), railingMat));
  railTopW.position.set(-100, 4, 95);
  root.add(railTopW);
  const railTopN = addShadow(new THREE.Mesh(new THREE.BoxGeometry(100, 1, 1), railingMat));
  railTopN.position.set(-50, 4, 120);
  root.add(railTopN);
  const railTopE = addShadow(new THREE.Mesh(new THREE.BoxGeometry(1, 1, 50), railingMat));
  railTopE.position.set(0, 4, 95);
  root.add(railTopE);
  // Bottom rails
  const railBotW = addShadow(new THREE.Mesh(new THREE.BoxGeometry(1, 1, 50), railingMat));
  railBotW.position.set(-100, 1, 95);
  root.add(railBotW);
  const railBotN = addShadow(new THREE.Mesh(new THREE.BoxGeometry(100, 1, 1), railingMat));
  railBotN.position.set(-50, 1, 120);
  root.add(railBotN);
  const railBotE = addShadow(new THREE.Mesh(new THREE.BoxGeometry(1, 1, 50), railingMat));
  railBotE.position.set(0, 1, 95);
  root.add(railBotE);
  // Glass panels between top and bottom rails
  for (let z = 75; z <= 115; z += 8) {
    const gpW = addShadow(new THREE.Mesh(new THREE.BoxGeometry(0.5, 3, 7), glassMat));
    gpW.position.set(-100, 2.5, z);
    root.add(gpW);
    const gpE = addShadow(new THREE.Mesh(new THREE.BoxGeometry(0.5, 3, 7), glassMat));
    gpE.position.set(0, 2.5, z);
    root.add(gpE);
  }
  for (let x = -95; x <= -5; x += 8) {
    const gpN = addShadow(new THREE.Mesh(new THREE.BoxGeometry(7, 3, 0.5), glassMat));
    gpN.position.set(x, 2.5, 120);
    root.add(gpN);
  }

  // Balcony furniture: 2 lounge chairs + side table
  for (const [bx, bz] of [[-80, 85], [-80, 105]]) {
    const lounge = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(10, 3, 18),
      new THREE.MeshStandardMaterial({ color: 0x4a4a4a, roughness: 0.6 })
    ));
    lounge.position.set(bx, 3.5, bz);
    root.add(lounge);
    const loungeBack = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(10, 8, 2),
      new THREE.MeshStandardMaterial({ color: 0x4a4a4a, roughness: 0.6 })
    ));
    loungeBack.position.set(bx, 6.5, bz - 9);  // back at south side (facing north)
    root.add(loungeBack);
    const lcushion = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(9, 1, 16),
      new THREE.MeshStandardMaterial({ color: 0xc8b8a0, roughness: 0.7 })
    ));
    lcushion.position.set(bx, 5, bz);
    root.add(lcushion);
  }
  // Side table between lounges
  const sideTable = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 4, 12), woodFurnMat));
  sideTable.position.set(-65, 4.5, 95);
  root.add(sideTable);

  // Potted plant on balcony (NE corner)
  const bpPot = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(3, 2.5, 5, 12), potMat));
  bpPot.position.set(-5, 5, 115);
  root.add(bpPot);
  for (let i = 0; i < 6; i++) {
    const leaf = addShadow(new THREE.Mesh(
      new THREE.SphereGeometry(3 + Math.random() * 2, 8, 6),
      new THREE.MeshStandardMaterial({ color: 0x4a6a3a, roughness: 0.8 })
    ));
    leaf.position.set(-5 + (Math.random() - 0.5) * 6, 10 + Math.random() * 4, 115 + (Math.random() - 0.5) * 6);
    leaf.scale.set(1, 0.4, 1);
    root.add(leaf);
  }

  // ============================================================
  // INTERIOR DOORS
  // ============================================================
  function door(cx: number, cz: number, facing: 'x' | 'z', color = 0xf0ece4) {
    const doorMat = new THREE.MeshStandardMaterial({ color, roughness: 0.5, metalness: 0.1 });
    const frameGroup = new THREE.Group();
    if (facing === 'x') {
      // Door in a wall running along Z (constant X), walk through in X direction
      const d = addShadow(new THREE.Mesh(new THREE.BoxGeometry(0.8, 14, 8), doorMat));
      d.position.set(cx, 9, cz);
      frameGroup.add(d);
      const knob = addShadow(new THREE.Mesh(new THREE.SphereGeometry(0.4, 8, 8), brassMat));
      knob.position.set(cx + 0.6, 9, cz + 3);
      frameGroup.add(knob);
    } else {
      // Door in a wall running along X (constant Z), walk through in Z direction
      const d = addShadow(new THREE.Mesh(new THREE.BoxGeometry(8, 14, 0.8), doorMat));
      d.position.set(cx, 9, cz);
      frameGroup.add(d);
      const knob = addShadow(new THREE.Mesh(new THREE.SphereGeometry(0.4, 8, 8), brassMat));
      knob.position.set(cx + 3, 9, cz + 0.6);
      frameGroup.add(knob);
    }
    root.add(frameGroup);
  }
  door(30, -5, 'x');    // living ↔ hallway (opening Z=-9..-1)
  door(70, -5, 'x');    // hallway ↔ bathroom (opening Z=-9..-1)
  door(50, 30, 'z');    // hallway ↔ bedroom 1 (opening X=46..54)
  door(30, -44, 'x');   // living ↔ bedroom 2 (opening Z=-48..-40)

  // ============================================================
  // SF SKYLINE (south of apartment, Z=-150..-120)
  // ============================================================
  const skylineBuildingColors = [0x4a4a55, 0x5a5a65, 0x6a6a78, 0x3a3a45, 0x556070];
  // Hoisted: skyline window material (shared across all buildings)
  // Hoisted: skyline building materials (5 colors cycled across 14 buildings)
  const skylineColors = [0x4a4a55, 0x5a5a65, 0x6a6a78, 0x3a3a45, 0x556070];
  const skylineBuildingMats = skylineColors.map(c => new THREE.MeshStandardMaterial({ color: c, metalness: 0.4, roughness: 0.6 }));
  const skylineWinMat = new THREE.MeshStandardMaterial({ color: 0xfff4cc, emissive: 0xfff4cc, emissiveIntensity: 0.4 });
  const skylineWinGeo = new THREE.PlaneGeometry(2, 3);
  for (let i = 0; i < 14; i++) {
    const bw = 18 + Math.random() * 14;
    const bh = 30 + Math.random() * 60;
    const bd = 18 + Math.random() * 14;
    const bx = -120 + i * 18;
    const bz = -150 - Math.random() * 30;
    const bMat = new THREE.MeshStandardMaterial({ color: skylineBuildingColors[i % skylineBuildingColors.length], metalness: 0.4, roughness: 0.6 });
    const b = addShadow(new THREE.Mesh(new THREE.BoxGeometry(bw, bh, bd), bMat));
    b.position.set(bx, bh / 2 - 4, bz);
    root.add(b);
    const winMat = new THREE.MeshStandardMaterial({ color: 0xfff4cc, emissive: 0xfff4cc, emissiveIntensity: 0.4 });
    for (let wy = 4; wy < bh - 4; wy += 6) {
      for (let wx = -bw / 2 + 3; wx < bw / 2 - 3; wx += 5) {
        if (Math.random() > 0.3) {
          const w = new THREE.Mesh(skylineWinGeo, skylineWinMat);
          w.position.set(bx + wx, wy, bz + bd / 2 + 0.1);
          root.add(w);
        }
      }
    }
  }

  // Hoisted: bridge cable material (shared across all 16 cables)
  const bridgeCableMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.3 });
  // Bay Bridge silhouette
  const bridgeMat = new THREE.MeshStandardMaterial({ color: 0x2a2a35, metalness: 0.4, roughness: 0.7 });
  const bridgeDeck = addShadow(new THREE.Mesh(new THREE.BoxGeometry(300, 2, 6), bridgeMat));
  bridgeDeck.position.set(-50, 30, -180);
  root.add(bridgeDeck);
  for (const tx of [-120, 20]) {
    const tower = addShadow(new THREE.Mesh(new THREE.BoxGeometry(4, 50, 4), bridgeMat));
    tower.position.set(tx, 50, -180);
    root.add(tower);
    for (let i = 0; i < 8; i++) {
      const cable = addShadow(new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.2, 25, 6),
        bridgeCableMat
      ));
      cable.position.set(tx + (i - 4) * 8, 50, -180);
      cable.rotation.z = (i - 4) * 0.15;
      root.add(cable);
    }
  }

  // ============================================================
  // LIGHTING
  // ============================================================
  const sun = new THREE.DirectionalLight(0xffd0a0, 1.6);
  sun.position.set(-200, 120, -100);
  sun.castShadow = true;
  sun.shadow.mapSize.width = 2048;
  sun.shadow.mapSize.height = 2048;
  sun.shadow.camera.left = -200;
  sun.shadow.camera.right = 200;
  sun.shadow.camera.top = 200;
  sun.shadow.camera.bottom = -200;
  sun.shadow.camera.near = 10;
  sun.shadow.camera.far = 500;
  sun.shadow.bias = -0.0005;
  root.add(sun);

  const hemi = new THREE.HemisphereLight(0x88aacc, 0x554035, 0.4);
  root.add(hemi);
  const ambient = new THREE.AmbientLight(0xffffff, 0.25);
  root.add(ambient);
  const fill = new THREE.DirectionalLight(0xaaccff, 0.3);
  fill.position.set(150, 50, 100);
  root.add(fill);

  // ============================================================
  // SF BAY WATER
  // ============================================================
  const waterMat = new THREE.MeshStandardMaterial({
    color: 0x2a4a6a, metalness: 0.4, roughness: 0.1, transparent: true, opacity: 0.85,
  });
  const water = addShadow(new THREE.Mesh(new THREE.PlaneGeometry(800, 400), waterMat));
  water.rotation.x = -Math.PI / 2;
  water.position.set(0, -3, -350);
  root.add(water);

  return root;
}
