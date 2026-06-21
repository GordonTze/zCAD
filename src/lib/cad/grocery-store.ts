// ====================== GROCERY STORE ======================
// A detailed modern supermarket / grocery store interior.
// Scale: 10 units = 1 meter. Store footprint: 60m x 40m (600 x 400 units),
// ceiling height 5m (50 units).
//
// Layout:
//   - Entrance vestibule (south end) with automatic sliding doors
//   - Produce section (front-left, with display bins, misted greens, fruit pyramids)
//   - Bakery (front-right, with display case, bread shelves, pastry case)
//   - 8 grocery aisles (center, with shelving units stocked with colored product boxes)
//   - Deli counter (back-left, with glass case, slicer, prepared foods)
//   - Dairy / refrigerated wall (back wall, glass-door coolers)
//   - Frozen food aisles (back-right, chest freezers + vertical freezer cases)
//   - 6 checkout lanes (front center, with registers, conveyor belts, bagging areas)
//   - Customer service desk (front-right corner)
//   - Storage / back room (north wall, behind dairy)
//   - Hanging category signage, overhead fluorescent lighting, tiled floor

import * as THREE from 'three';
import { addShadow, metal, darkSteel, aluminum, plastic, rubber } from './materials-dsl';
import { makeTileTexture, makeConcreteTexture, makeWoodTexture } from './building-textures';

// ---------- Local texture helpers ----------

// Floor: large commercial tiles (60cm squares) — light cream with subtle grout
function storeFloorTexture(): { map: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  // Base cream color
  ctx.fillStyle = '#e8e4d8';
  ctx.fillRect(0, 0, size, size);
  // Tile grid: 4 tiles per texture (each 128px = ~0.6m at scale)
  const tileSize = size / 4;
  for (let tx = 0; tx < 4; tx++) {
    for (let ty = 0; ty < 4; ty++) {
      // Subtle per-tile color variation
      const v = (Math.sin(tx * 1.7 + ty * 2.3) + 1) * 0.5;
      const shade = 232 + Math.floor(v * 12);
      ctx.fillStyle = `rgb(${shade}, ${shade - 4}, ${shade - 16})`;
      ctx.fillRect(tx * tileSize + 1, ty * tileSize + 1, tileSize - 2, tileSize - 2);
      // Speckle texture (commercial tile has tiny dots)
      ctx.fillStyle = 'rgba(180,170,150,0.15)';
      for (let i = 0; i < 40; i++) {
        ctx.fillRect(
          tx * tileSize + 2 + Math.random() * (tileSize - 4),
          ty * tileSize + 2 + Math.random() * (tileSize - 4),
          1, 1
        );
      }
    }
  }
  // Grout lines
  ctx.strokeStyle = '#b8b0a0';
  ctx.lineWidth = 2;
  for (let i = 0; i <= 4; i++) {
    ctx.beginPath(); ctx.moveTo(i * tileSize, 0); ctx.lineTo(i * tileSize, size); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, i * tileSize); ctx.lineTo(size, i * tileSize); ctx.stroke();
  }
  const map = new THREE.CanvasTexture(canvas);
  map.wrapS = THREE.RepeatWrapping; map.wrapT = THREE.RepeatWrapping;
  map.colorSpace = THREE.SRGBColorSpace; map.anisotropy = 8;

  // Bump map
  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size; bumpCanvas.height = size;
  const bctx = bumpCanvas.getContext('2d')!;
  bctx.fillStyle = '#a0a0a0'; bctx.fillRect(0, 0, size, size);
  bctx.fillStyle = '#c0c0c0';
  for (let tx = 0; tx < 4; tx++) {
    for (let ty = 0; ty < 4; ty++) {
      bctx.fillRect(tx * tileSize + 1, ty * tileSize + 1, tileSize - 2, tileSize - 2);
    }
  }
  bctx.fillStyle = '#505050';
  for (let i = 0; i <= 4; i++) {
    bctx.fillRect(i * tileSize - 1, 0, 2, size);
    bctx.fillRect(0, i * tileSize - 1, size, 2);
  }
  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping; bumpMap.wrapT = THREE.RepeatWrapping;
  return { map, bumpMap };
}

// Produce section floor: slightly different warmer tile
function produceFloorTexture(): { map: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#d8c8a8'; // warm sandy tile for produce area
  ctx.fillRect(0, 0, size, size);
  const tileSize = size / 4;
  for (let tx = 0; tx < 4; tx++) {
    for (let ty = 0; ty < 4; ty++) {
      const v = (Math.sin(tx * 2.1 + ty * 1.7) + 1) * 0.5;
      const shade = 216 + Math.floor(v * 10);
      ctx.fillStyle = `rgb(${shade}, ${shade - 12}, ${shade - 40})`;
      ctx.fillRect(tx * tileSize + 1, ty * tileSize + 1, tileSize - 2, tileSize - 2);
    }
  }
  ctx.strokeStyle = '#a89878';
  ctx.lineWidth = 2;
  for (let i = 0; i <= 4; i++) {
    ctx.beginPath(); ctx.moveTo(i * tileSize, 0); ctx.lineTo(i * tileSize, size); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, i * tileSize); ctx.lineTo(size, i * tileSize); ctx.stroke();
  }
  const map = new THREE.CanvasTexture(canvas);
  map.wrapS = THREE.RepeatWrapping; map.wrapT = THREE.RepeatWrapping;
  map.colorSpace = THREE.SRGBColorSpace; map.anisotropy = 8;

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size; bumpCanvas.height = size;
  const bctx = bumpCanvas.getContext('2d')!;
  bctx.fillStyle = '#a0a0a0'; bctx.fillRect(0, 0, size, size);
  bctx.fillStyle = '#c0c0c0';
  for (let tx = 0; tx < 4; tx++) {
    for (let ty = 0; ty < 4; ty++) {
      bctx.fillRect(tx * tileSize + 1, ty * tileSize + 1, tileSize - 2, tileSize - 2);
    }
  }
  bctx.fillStyle = '#505050';
  for (let i = 0; i <= 4; i++) {
    bctx.fillRect(i * tileSize - 1, 0, 2, size);
    bctx.fillRect(0, i * tileSize - 1, size, 2);
  }
  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping; bumpMap.wrapT = THREE.RepeatWrapping;
  return { map, bumpMap };
}

// Shelf label / price tag texture
function priceTagTexture(item: string, price: string): THREE.CanvasTexture {
  const w = 256, h = 64;
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  // Yellow price tag background
  ctx.fillStyle = '#fff4a0';
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = '#c8a020';
  ctx.lineWidth = 2;
  ctx.strokeRect(2, 2, w - 4, h - 4);
  // Item name
  ctx.fillStyle = '#1a1a1a';
  ctx.font = 'bold 18px Arial';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(item, 10, 20);
  // Price (large)
  ctx.fillStyle = '#c02020';
  ctx.font = 'bold 28px Arial';
  ctx.fillText(price, 10, 46);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Aisle number sign texture
function aisleSignTexture(num: number, category: string): THREE.CanvasTexture {
  const w = 384, h = 128;
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  // Red sign background
  ctx.fillStyle = '#c8202a';
  ctx.fillRect(0, 0, w, h);
  // White border
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 4;
  ctx.strokeRect(6, 6, w - 12, h - 12);
  // "AISLE" text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 22px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('AISLE', w / 2, 28);
  // Big number
  ctx.font = 'bold 56px Arial';
  ctx.fillText(String(num), w / 2, 70);
  // Category
  ctx.font = 'bold 16px Arial';
  ctx.fillText(category.toUpperCase(), w / 2, 108);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Hanging category banner (wide)
function categoryBannerTexture(text: string, bgColor: string): THREE.CanvasTexture {
  const w = 512, h = 128;
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 5;
  ctx.strokeRect(8, 8, w - 16, h - 16);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 52px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text.toUpperCase(), w / 2, h / 2);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Product box texture (simulates a grocery product package with brand + label)
function productBoxTexture(name: string, color: string, accentColor: string): THREE.CanvasTexture {
  const w = 128, h = 256;
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  // Base product color
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, w, h);
  // Accent band (top third)
  ctx.fillStyle = accentColor;
  ctx.fillRect(0, 0, w, 60);
  // Brand area (white box on accent band)
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(10, 10, w - 20, 40);
  ctx.fillStyle = accentColor;
  ctx.font = 'bold 14px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('BRAND', w / 2, 30);
  // Product name
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 16px Arial';
  ctx.fillText(name, w / 2, 100);
  // Decorative stripe
  ctx.fillStyle = accentColor;
  ctx.fillRect(0, 130, w, 4);
  // "NET WT" area
  ctx.fillStyle = '#ffffff';
  ctx.font = '10px Arial';
  ctx.fillText('NET WT 12 OZ', w / 2, 160);
  ctx.fillText('340g', w / 2, 175);
  // Barcode (fake vertical lines)
  ctx.fillStyle = '#1a1a1a';
  for (let i = 0; i < 30; i++) {
    const bx = 20 + i * 3;
    if (Math.random() > 0.4) {
      ctx.fillRect(bx, 200, 1 + Math.random() * 2, 40);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Refrigerated glass door texture (frosty with handle)
function coolerDoorTexture(): THREE.CanvasTexture {
  const w = 128, h = 256;
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  // Frosted glass (light blue-white)
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, '#c8dde8');
  grad.addColorStop(0.5, '#d8e8f0');
  grad.addColorStop(1, '#b8d0dc');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  // Frost pattern (random white swirls)
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  for (let i = 0; i < 60; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    const r = 3 + Math.random() * 8;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  // Frame (dark)
  ctx.strokeStyle = '#3a3a3e';
  ctx.lineWidth = 6;
  ctx.strokeRect(3, 3, w - 6, h - 6);
  // Handle (vertical bar on right)
  ctx.fillStyle = '#5a5a62';
  ctx.fillRect(w - 16, 20, 6, h - 40);
  // Product silhouette behind frost (faint colored shapes)
  ctx.fillStyle = 'rgba(200,100,50,0.15)';
  ctx.fillRect(15, 30, 30, 50);
  ctx.fillStyle = 'rgba(50,150,200,0.15)';
  ctx.fillRect(55, 30, 30, 50);
  ctx.fillStyle = 'rgba(200,180,50,0.15)';
  ctx.fillRect(15, 100, 30, 50);
  ctx.fillStyle = 'rgba(100,180,80,0.15)';
  ctx.fillRect(55, 100, 30, 50);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Fruit/vegetable texture — adds natural color variation, mottling, and
// a subtle highlight to make produce look realistic instead of flat-colored.
// baseColor = main color, highlightColor = lighter blush/highlight, spotColor = darker spots
function fruitTexture(baseColor: string, highlightColor: string, spotColor: string, spotDensity: number = 30): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  // Base color
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, size, size);
  // Radial highlight (glossy spot — simulates light reflection on the fruit surface)
  const hgrad = ctx.createRadialGradient(size * 0.35, size * 0.3, 0, size * 0.35, size * 0.3, size * 0.5);
  hgrad.addColorStop(0, highlightColor);
  hgrad.addColorStop(0.5, baseColor);
  hgrad.addColorStop(1, baseColor);
  ctx.fillStyle = hgrad;
  ctx.fillRect(0, 0, size, size);
  // Natural mottling (random lighter/darker patches)
  ctx.globalAlpha = 0.15;
  for (let i = 0; i < 20; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? highlightColor : spotColor;
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = 3 + Math.random() * 8;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  // Small spots/specks (pores, blemishes)
  ctx.globalAlpha = 0.3;
  ctx.fillStyle = spotColor;
  for (let i = 0; i < spotDensity; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    ctx.fillRect(x, y, 1 + Math.random(), 1 + Math.random());
  }
  ctx.globalAlpha = 1;
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// ====================== STORE ======================

export function createGroceryStoreGeometry(): THREE.Group {
  const root = new THREE.Group();

  // ===== SCALE: 10 units = 1 meter =====
  // Store footprint: 60m x 40m (600 x 400 units)
  // Ceiling height: 5m (50 units)
  const STORE_W = 600;   // X: -300 to +300
  const STORE_D = 400;   // Z: -200 to +200
  const STORE_H = 50;    // Y: 0 to 50

  // ===== MATERIALS =====
  const floorTex = storeFloorTexture();
  floorTex.map.repeat.set(20, 14); floorTex.bumpMap.repeat.set(20, 14);
  const floorMat = new THREE.MeshStandardMaterial({
    map: floorTex.map, bumpMap: floorTex.bumpMap, bumpScale: 0.02,
    metalness: 0.0, roughness: 0.6,
  });

  const produceFloorTex = produceFloorTexture();
  produceFloorTex.map.repeat.set(10, 8); produceFloorTex.bumpMap.repeat.set(10, 8);
  const produceFloorMat = new THREE.MeshStandardMaterial({
    map: produceFloorTex.map, bumpMap: produceFloorTex.bumpMap, bumpScale: 0.02,
    metalness: 0.0, roughness: 0.6,
  });

  const wallTex = makeConcreteTexture('#f0ece4');
  wallTex.map.repeat.set(15, 4); wallTex.bumpMap.repeat.set(15, 4);
  const wallMat = new THREE.MeshStandardMaterial({
    map: wallTex.map, bumpMap: wallTex.bumpMap, bumpScale: 0.01, roughness: 0.85,
  });

  const ceilTex = makeConcreteTexture('#f5f2ec');
  ceilTex.map.repeat.set(20, 14); ceilTex.bumpMap.repeat.set(20, 14);
  const ceilMat = new THREE.MeshStandardMaterial({
    map: ceilTex.map, bumpMap: ceilTex.bumpMap, bumpScale: 0.005, roughness: 0.9,
  });

  // Shelving materials
  const shelfMat = new THREE.MeshStandardMaterial({ color: 0x4a4a52, metalness: 0.6, roughness: 0.4 });
  const shelfDarkMat = new THREE.MeshStandardMaterial({ color: 0x2a2a30, metalness: 0.5, roughness: 0.5 });

  // Checkout materials
  const checkoutMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2e, metalness: 0.4, roughness: 0.5 });
  const conveyorMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.1, roughness: 0.8 });
  const registerMat = new THREE.MeshStandardMaterial({ color: 0xe8e8ec, metalness: 0.3, roughness: 0.4 });

  // Produce materials — each with a procedural fruit texture for natural variation
  const produceBinMat = new THREE.MeshStandardMaterial({ color: 0x4a6a3a, metalness: 0.1, roughness: 0.7 }); // green bin
  const appleTex = fruitTexture('#c02020', '#ff6060', '#801010', 25);
  const appleMat = new THREE.MeshStandardMaterial({ map: appleTex, color: 0xffffff, metalness: 0.1, roughness: 0.35 });
  const orangeTex = fruitTexture('#ff8c20', '#ffb060', '#cc6010', 40);
  const orangeMat = new THREE.MeshStandardMaterial({ map: orangeTex, color: 0xffffff, metalness: 0.1, roughness: 0.6 });
  const bananaTex = fruitTexture('#f4d020', '#fff060', '#c0a010', 20);
  const bananaMat = new THREE.MeshStandardMaterial({ map: bananaTex, color: 0xffffff, metalness: 0.0, roughness: 0.6 });
  const lettuceTex = fruitTexture('#5a8a3a', '#8aba5a', '#3a6a2a', 35);
  const lettuceMat = new THREE.MeshStandardMaterial({ map: lettuceTex, color: 0xffffff, metalness: 0.0, roughness: 0.7 });
  const tomatoTex = fruitTexture('#d03030', '#ff6060', '#902020', 25);
  const tomatoMat = new THREE.MeshStandardMaterial({ map: tomatoTex, color: 0xffffff, metalness: 0.1, roughness: 0.35 });
  const grapeTex = fruitTexture('#6a3a8a', '#9a6aba', '#4a2a6a', 30);
  const grapeMat = new THREE.MeshStandardMaterial({ map: grapeTex, color: 0xffffff, metalness: 0.1, roughness: 0.4 });
  const lemonTex = fruitTexture('#f4f020', '#ffff80', '#c0bc10', 35);
  const lemonMat = new THREE.MeshStandardMaterial({ map: lemonTex, color: 0xffffff, metalness: 0.1, roughness: 0.4 });
  const pepperRedTex = fruitTexture('#c02020', '#ff5050', '#801010', 20);
  const pepperRedMat = new THREE.MeshStandardMaterial({ map: pepperRedTex, color: 0xffffff, metalness: 0.1, roughness: 0.35 });
  const pepperGreenTex = fruitTexture('#4a8a3a', '#7aba5a', '#2a6a1a', 20);
  const pepperGreenMat = new THREE.MeshStandardMaterial({ map: pepperGreenTex, color: 0xffffff, metalness: 0.1, roughness: 0.35 });
  const potatoTex = fruitTexture('#8a6a4a', '#aa8a6a', '#5a4a2a', 50);
  const potatoMat = new THREE.MeshStandardMaterial({ map: potatoTex, color: 0xffffff, metalness: 0.0, roughness: 0.85 });

  // Refrigeration
  const coolerFrameMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2e, metalness: 0.5, roughness: 0.4 });
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0xc8dde8, metalness: 0.3, roughness: 0.1,
    transparent: true, opacity: 0.5,
  });

  // Misc
  const blackMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.3, roughness: 0.6 });
  const signMat = new THREE.MeshStandardMaterial({ color: 0xc8202a, metalness: 0.2, roughness: 0.5 });
  const cartMat = new THREE.MeshStandardMaterial({ color: 0x8a8a92, metalness: 0.7, roughness: 0.3 });
  const breadMat = new THREE.MeshStandardMaterial({ color: 0xc8a060, metalness: 0.0, roughness: 0.7 });

  // ============================================================
  // FLOOR (main store area — tiled)
  // ============================================================
  const floor = addShadow(new THREE.Mesh(new THREE.PlaneGeometry(STORE_W, STORE_D), floorMat));
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, 0, 0);
  floor.receiveShadow = true;
  root.add(floor);

  // Produce section floor (warmer tile) — front-left quadrant
  const produceFloor = addShadow(new THREE.Mesh(new THREE.PlaneGeometry(160, 120), produceFloorMat));
  produceFloor.rotation.x = -Math.PI / 2;
  produceFloor.position.set(-200, 0.05, 130); // front-left area
  produceFloor.receiveShadow = true;
  root.add(produceFloor);

  // Bakery floor (wood-look) — front-right
  const bakeryFloorTex = makeWoodTexture('#c8a878', '#8a6a44');
  bakeryFloorTex.map.repeat.set(8, 6); bakeryFloorTex.bumpMap.repeat.set(8, 6);
  const bakeryFloorMat = new THREE.MeshStandardMaterial({
    map: bakeryFloorTex.map, bumpMap: bakeryFloorTex.bumpMap, bumpScale: 0.02, roughness: 0.6,
  });
  const bakeryFloor = addShadow(new THREE.Mesh(new THREE.PlaneGeometry(120, 100), bakeryFloorMat));
  bakeryFloor.rotation.x = -Math.PI / 2;
  bakeryFloor.position.set(220, 0.05, 140);
  bakeryFloor.receiveShadow = true;
  root.add(bakeryFloor);

  // ============================================================
  // CEILING
  // ============================================================
  const ceiling = addShadow(new THREE.Mesh(new THREE.PlaneGeometry(STORE_W, STORE_D), ceilMat));
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.set(0, STORE_H, 0);
  ceiling.receiveShadow = true;
  root.add(ceiling);

  // ============================================================
  // WALLS (4 exterior walls)
  // ============================================================
  // South wall (entrance, Z=-200) — has entrance opening
  // Opening: X=-40..40 (80 wide for entrance doors)
  wall(-260, -STORE_D / 2 - 0.5, 220, STORE_H, 1, wallMat);  // left of entrance
  wall(60, -STORE_D / 2 - 0.5, 480, STORE_H, 1, wallMat);    // right of entrance
  // Header above entrance
  wall(0, -STORE_D / 2 - 0.5, 80, 20, 1, wallMat, 0, 40);    // above doors, y center=40
  // North wall (back, Z=200) — solid
  wall(0, STORE_D / 2 + 0.5, STORE_W, STORE_H, 1, wallMat);
  // East wall (X=300)
  wall(STORE_W / 2 + 0.5, 0, 1, STORE_H, STORE_D, wallMat);
  // West wall (X=-300)
  wall(-STORE_W / 2 - 0.5, 0, 1, STORE_H, STORE_D, wallMat);

  // ============================================================
  // ENTRANCE (sliding glass doors + vestibule)
  // Z=-200 (south wall), opening X=-40..40
  // ============================================================
  // Left sliding door
  const door1 = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(38, 35, 0.5),
    new THREE.MeshStandardMaterial({ color: 0x88aacc, metalness: 0.7, roughness: 0.05, transparent: true, opacity: 0.4 })
  ));
  door1.position.set(-20, 17.5, -200);
  root.add(door1);
  // Right sliding door
  const door2 = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(38, 35, 0.5),
    new THREE.MeshStandardMaterial({ color: 0x88aacc, metalness: 0.7, roughness: 0.05, transparent: true, opacity: 0.4 })
  ));
  door2.position.set(20, 17.5, -200);
  root.add(door2);
  // Door frame
  const doorFrame = new THREE.MeshStandardMaterial({ color: 0x2a2a2e, metalness: 0.6, roughness: 0.3 });
  const frameTop = addShadow(new THREE.Mesh(new THREE.BoxGeometry(82, 2, 1), doorFrame));
  frameTop.position.set(0, 35, -200);
  root.add(frameTop);
  // "ENTRANCE" sign above doors
  const entranceSignTex = categoryBannerTexture('ENTRANCE', '#2a6a4a');
  const entranceSign = addShadow(new THREE.Mesh(
    new THREE.PlaneGeometry(60, 12),
    new THREE.MeshStandardMaterial({ map: entranceSignTex, emissive: 0xffffff, emissiveMap: entranceSignTex, emissiveIntensity: 0.3 })
  ));
  entranceSign.position.set(0, 44, -199);
  root.add(entranceSign);

  // Shopping cart corral (just inside entrance)
  for (let i = 0; i < 6; i++) {
    const cx = 100 + (i % 3) * 8;
    const cz = -180 + Math.floor(i / 3) * 12;
    addShoppingCart(root, cx, cz, cartMat, blackMat);
  }

  // ============================================================
  // GROCERY AISLES (8 aisles in center of store)
  // Each aisle: 2 shelving units back-to-back, 120 long, 18 wide, 20 tall
  // Aisle runs along X axis. Spacing: 30 units between aisles (3m).
  // Aisles positioned in Z range [-50, 160], X range [-140, 140]
  // ============================================================
  const aisleDefs = [
    { num: 1, category: 'Canned Goods', z: -50 },
    { num: 2, category: 'Pasta & Rice', z: -20 },
    { num: 3, category: 'Baking', z: 10 },
    { num: 4, category: 'Snacks', z: 40 },
    { num: 5, category: 'Beverages', z: 70 },
    { num: 6, category: 'Cereal', z: 100 },
    { num: 7, category: 'Condiments', z: 130 },
    { num: 8, category: 'International', z: 160 },
  ];

  // Product color palettes per aisle
  const aisleColors = [
    ['#c82020', '#f4a020', '#2a6a4a', '#2050a0'], // canned
    ['#f4d020', '#c84020', '#4a8a3a', '#a040c0'], // pasta
    ['#f4f0e8', '#c8a060', '#d04060', '#4a6ab0'], // baking
    ['#f4a020', '#c02020', '#f4f020', '#2a8a4a'], // snacks
    ['#c02020', '#2a6ab0', '#f4a020', '#4a8a3a'], // beverages
    ['#a040c0', '#f4a020', '#2a6ab0', '#c02020'], // cereal
    ['#c82020', '#f4d020', '#2a6a4a', '#a050a0'], // condiments
    ['#2a6a4a', '#c84020', '#f4d020', '#4a6ab0'], // international
  ];

  for (let i = 0; i < aisleDefs.length; i++) {
    const a = aisleDefs[i];
    const colors = aisleColors[i];
    buildAisle(root, a.num, a.category, a.z, colors, shelfMat, shelfDarkMat);
  }

  // ============================================================
  // PRODUCE SECTION (front-left, X[-280,-120], Z[70,190])
  // Display bins, fruit pyramids, misted greens, price signs
  // ============================================================
  buildProduceSection(root, produceBinMat, appleMat, orangeMat, bananaMat, lettuceMat, tomatoMat, grapeMat, lemonMat, pepperRedMat, pepperGreenMat, potatoMat, signMat);

  // ============================================================
  // BAKERY (front-right, X[160,280], Z[90,190])
  // Display case, bread shelves, pastry case, cake display
  // ============================================================
  buildBakery(root, breadMat, shelfMat, signMat);

  // ============================================================
  // DELI COUNTER (back-left, X[-280,-180], Z[170,195])
  // Glass display case, slicer, prepared foods
  // ============================================================
  buildDeli(root, glassMat, coolerFrameMat, signMat, shelfMat);

  // ============================================================
  // DAIRY WALL (back wall, Z=195-200, full width)
  // Glass-door refrigerated coolers along the north wall
  // ============================================================
  buildDairyWall(root, coolerFrameMat);

  // ============================================================
  // FROZEN FOOD (back-right, X[120,260], Z[140,190])
  // Chest freezers + vertical freezer cases
  // ============================================================
  buildFrozenSection(root, coolerFrameMat, glassMat);

  // ============================================================
  // CHECKOUT LANES (6 lanes, front center, Z=-140 to -90)
  // Each lane: register, conveyor belt, bagging area, divider
  // ============================================================
  const checkoutY = -120;
  for (let i = 0; i < 6; i++) {
    const cx = -150 + i * 60;
    buildCheckoutLane(root, cx, checkoutY, i + 1, checkoutMat, conveyorMat, registerMat, blackMat);
  }

  // Checkout lane signs ("LANE 1" etc.) hanging from ceiling
  for (let i = 0; i < 6; i++) {
    const cx = -150 + i * 60;
    const laneSignTex = categoryBannerTexture(`LANE ${i + 1}`, i === 0 ? '#2a8a4a' : '#2a6ab0');
    const laneSign = addShadow(new THREE.Mesh(
      new THREE.PlaneGeometry(40, 10),
      new THREE.MeshStandardMaterial({ map: laneSignTex, emissive: 0xffffff, emissiveMap: laneSignTex, emissiveIntensity: 0.3, side: THREE.DoubleSide })
    ));
    laneSign.position.set(cx, 42, -100);
    laneSign.rotation.x = Math.PI / 2; // face down
    root.add(laneSign);
    // Hanging chains
    for (const [hx, hz] of [[cx - 18, -100], [cx + 18, -100]] as [number, number][]) {
      const chain = addShadow(new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.2, 6, 6),
        blackMat
      ));
      chain.position.set(hx, 45, hz);
      root.add(chain);
    }
  }

  // ============================================================
  // CUSTOMER SERVICE DESK (front-right corner)
  // ============================================================
  buildCustomerService(root, shelfMat, signMat, blackMat);

  // ============================================================
  // OVERHEAD LIGHTING (fluorescent tube fixtures, grid pattern)
  // ============================================================
  const lightFixtureMat = new THREE.MeshStandardMaterial({
    color: 0xffffff, emissive: 0xfff4e0, emissiveIntensity: 0.7, metalness: 0.3, roughness: 0.4
  });
  // Grid of 8x6 light fixtures across the ceiling
  for (let lx = -250; lx <= 250; lx += 70) {
    for (let lz = -180; lz <= 180; lz += 60) {
      const fixture = addShadow(new THREE.Mesh(
        new THREE.BoxGeometry(50, 1, 8),
        lightFixtureMat
      ));
      fixture.position.set(lx, 49, lz);
      root.add(fixture);

      // Actual point light (lower intensity, only every other fixture for performance)
      if ((Math.abs(lx) + Math.abs(lz)) % 140 === 0) {
        const ptLight = new THREE.PointLight(0xfff4e0, 0.35, 80, 1.5);
        ptLight.position.set(lx, 47, lz);
        root.add(ptLight);
      }
    }
  }

  // ============================================================
  // AMBIENT + DIRECTIONAL LIGHTING
  // ============================================================
  // Bright overhead "store lights" — flat directional from above
  const storeLight = new THREE.DirectionalLight(0xfff8e8, 1.0);
  storeLight.position.set(0, 100, 0);
  storeLight.castShadow = true;
  storeLight.shadow.mapSize.width = 2048;
  storeLight.shadow.mapSize.height = 2048;
  storeLight.shadow.camera.left = -320;
  storeLight.shadow.camera.right = 320;
  storeLight.shadow.camera.top = 220;
  storeLight.shadow.camera.bottom = -220;
  storeLight.shadow.camera.near = 1;
  storeLight.shadow.camera.far = 200;
  storeLight.shadow.bias = -0.0005;
  root.add(storeLight);

  // Fill light from entrance direction
  const fillLight = new THREE.DirectionalLight(0xaaccff, 0.3);
  fillLight.position.set(0, 40, -200);
  root.add(fillLight);

  // Hemisphere + ambient
  const hemi = new THREE.HemisphereLight(0xfff8e8, 0xa09080, 0.5);
  root.add(hemi);
  const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  root.add(ambient);

  // ============================================================
  // BACK ROOM / STORAGE (behind north wall — represented as a dark wall section)
  // ============================================================
  // "EMPLOYEES ONLY" door on back wall
  const backDoor = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(12, 25, 1),
    new THREE.MeshStandardMaterial({ color: 0x3a3a40, metalness: 0.4, roughness: 0.5 })
  ));
  backDoor.position.set(-200, 12.5, 199.5);
  root.add(backDoor);
  // Sign above
  const empSignTex = categoryBannerTexture('EMPLOYEES ONLY', '#3a3a40');
  const empSign = addShadow(new THREE.Mesh(
    new THREE.PlaneGeometry(30, 8),
    new THREE.MeshStandardMaterial({ map: empSignTex, emissive: 0xffffff, emissiveMap: empSignTex, emissiveIntensity: 0.2 })
  ));
  empSign.position.set(-200, 32, 199);
  root.add(empSign);

  // ============================================================
  // HANGING CATEGORY BANNERS (over section entrances)
  // ============================================================
  const banners = [
    { text: 'PRODUCE', color: '#2a8a4a', x: -200, z: 70 },
    { text: 'BAKERY', color: '#c88030', x: 220, z: 90 },
    { text: 'DELI', color: '#a04020', x: -230, z: 165 },
    { text: 'DAIRY', color: '#2a6ab0', x: 0, z: 165 },
    { text: 'FROZEN', color: '#4a8ac8', x: 190, z: 135 },
  ];
  for (const b of banners) {
    const bTex = categoryBannerTexture(b.text, b.color);
    const banner = addShadow(new THREE.Mesh(
      new THREE.PlaneGeometry(80, 14),
      new THREE.MeshStandardMaterial({ map: bTex, emissive: 0xffffff, emissiveMap: bTex, emissiveIntensity: 0.25, side: THREE.DoubleSide })
    ));
    banner.position.set(b.x, 42, b.z);
    banner.rotation.x = Math.PI / 2; // hang flat, face down
    root.add(banner);
    // Hanging chains (4 corners)
    for (const [hx, hz] of [[b.x - 38, b.z], [b.x + 38, b.z]] as [number, number][]) {
      const chain = addShadow(new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.2, 6, 6),
        blackMat
      ));
      chain.position.set(hx, 45, hz);
      root.add(chain);
    }
  }

  return root;

  // ===== HELPER FUNCTIONS =====

  function wall(x: number, z: number, w: number, h: number, d: number, mat: THREE.Material, _y?: number, yCenter?: number) {
    const m = addShadow(new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat));
    m.position.set(x, yCenter !== undefined ? yCenter : h / 2, z);
    root.add(m);
    return m;
  }
}

// ---------- Component builder helpers ----------

function addShoppingCart(root: THREE.Group, x: number, z: number, cartMat: THREE.Material, blackMat: THREE.Material) {
  const cartGroup = new THREE.Group();
  cartGroup.position.set(x, 0, z);
  // Cart basket (wire frame look — simplified as box with dark material)
  const basket = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(14, 12, 18),
    new THREE.MeshStandardMaterial({ color: 0x8a8a92, metalness: 0.7, roughness: 0.3, transparent: true, opacity: 0.6 })
  ));
  basket.position.set(0, 10, 0);
  cartGroup.add(basket);
  // Cart handle
  const handle = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(0.4, 0.4, 14, 8),
    cartMat
  ));
  handle.rotation.x = Math.PI / 2;
  handle.position.set(0, 18, -10);
  cartGroup.add(handle);
  // Handle vertical posts
  for (const hx of [-5, 5]) {
    const post = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 8, 6), cartMat));
    post.position.set(hx, 14, -10);
    cartGroup.add(post);
  }
  // Wheels (4)
  for (const [wx, wz] of [[-6, -8], [6, -8], [-6, 8], [6, 8]] as [number, number][]) {
    const wheel = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 1, 8), blackMat));
    wheel.rotation.x = Math.PI / 2;
    wheel.position.set(wx, 1.5, wz);
    cartGroup.add(wheel);
  }
  root.add(cartGroup);
}

function buildAisle(
  root: THREE.Group, num: number, category: string, z: number,
  colors: string[], shelfMat: THREE.Material, shelfDarkMat: THREE.Material
) {
  const AISLE_LEN = 240;   // 24m long aisle
  const AISLE_W = 18;      // 1.8m wide (two 0.9m shelving units back-to-back)
  const AISLE_H = 22;      // 2.2m tall shelving
  const SHELF_COUNT = 5;   // 5 shelves per side
  const aisleX = 0;

  // Aisle number sign (hanging from ceiling at the end of the aisle)
  const signTex = aisleSignTexture(num, category);
  const aisleSign = addShadow(new THREE.Mesh(
    new THREE.PlaneGeometry(20, 7),
    new THREE.MeshStandardMaterial({ map: signTex, emissive: 0xffffff, emissiveMap: signTex, emissiveIntensity: 0.3, side: THREE.DoubleSide })
  ));
  aisleSign.position.set(aisleX - AISLE_LEN / 2 - 5, 35, z);
  aisleSign.rotation.y = Math.PI / 2;
  root.add(aisleSign);

  // Two shelving units (back-to-back gondola): one facing the -Z walkway, one facing the +Z walkway.
  // The gondola center is at Z=z. The back panel of each unit is at the CENTER (where they meet).
  // Products face OUTWARD toward the walkways on either side of the gondola.
  //
  // Geometry for side=-1 (lower-Z half, faces the -Z walkway):
  //   shelfZ = z - AISLE_W/4 (shelf center)
  //   Back panel at shelfZ + 4 (toward gondola center at z)
  //   Walkway-facing front edge at shelfZ - 4 (toward the -Z walkway)
  //   Products near front, labels face -Z (toward walkway)
  //
  // Geometry for side=+1 (upper-Z half, faces the +Z walkway):
  //   shelfZ = z + AISLE_W/4 (shelf center)
  //   Back panel at shelfZ - 4 (toward gondola center at z)
  //   Walkway-facing front edge at shelfZ + 4 (toward the +Z walkway)
  //   Products near front, labels face +Z (toward walkway)
  for (const side of [-1, 1]) {
    const shelfZ = z + side * (AISLE_W / 4);
    // Shelving back panel — at the GONDOLA CENTER (where the two units meet)
    const backPanel = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(AISLE_LEN, AISLE_H, 0.5),
      shelfDarkMat
    ));
    backPanel.position.set(aisleX, AISLE_H / 2, shelfZ - side * 4);
    root.add(backPanel);

    // Shelves (horizontal planks, 8 deep)
    for (let s = 0; s < SHELF_COUNT; s++) {
      const shelfY = 2 + s * 4.5; // shelves at y=2, 6.5, 11, 15.5, 20
      const shelf = addShadow(new THREE.Mesh(
        new THREE.BoxGeometry(AISLE_LEN, 0.5, 8),
        shelfMat
      ));
      shelf.position.set(aisleX, shelfY, shelfZ);
      root.add(shelf);

      // Products on this shelf — organized into "facings" (contiguous blocks of
      // the same product type and color, like real grocery shelves). Each facing
      // is 3-5 identical products side by side. The facing layout varies per shelf
      // so different shelves have different arrangements.
      const productW = AISLE_LEN / 20; // base unit width (20 products worth of space)

      // Facing layouts — each entry: { type, count }. The layout cycles per shelf
      // so shelf 0 has one arrangement, shelf 1 another, etc.
      // Types: 'box', 'bag', 'bottle', 'can', 'jar', 'pouch'
      const facingLayouts = [
        [{ type: 'box', count: 4 }, { type: 'can', count: 3 }, { type: 'bottle', count: 4 }, { type: 'box', count: 3 }, { type: 'jar', count: 3 }, { type: 'pouch', count: 3 }],
        [{ type: 'box', count: 5 }, { type: 'bottle', count: 3 }, { type: 'can', count: 4 }, { type: 'bag', count: 3 }, { type: 'box', count: 5 }],
        [{ type: 'can', count: 4 }, { type: 'box', count: 4 }, { type: 'jar', count: 3 }, { type: 'bottle', count: 3 }, { type: 'pouch', count: 3 }, { type: 'box', count: 3 }],
        [{ type: 'bottle', count: 4 }, { type: 'box', count: 4 }, { type: 'bag', count: 3 }, { type: 'can', count: 3 }, { type: 'box', count: 3 }, { type: 'jar', count: 3 }],
        [{ type: 'box', count: 3 }, { type: 'jar', count: 3 }, { type: 'box', count: 4 }, { type: 'bottle', count: 4 }, { type: 'pouch', count: 3 }, { type: 'can', count: 3 }],
      ];
      const facings = facingLayouts[s % facingLayouts.length];

      // Walk along the shelf, placing each facing as a contiguous block
      let posIdx = 0; // current position index along the shelf (0-19)
      for (let f = 0; f < facings.length; f++) {
        const facing = facings[f];
        const facingColorIdx = (s * 2 + f) % colors.length;
        const prodColor = colors[facingColorIdx];
        const accentColor = colors[(facingColorIdx + 1) % colors.length];
        const prodName = `${category.substring(0, 3).toUpperCase()}${f + 1}`;
        const prodTex = productBoxTexture(prodName, prodColor, accentColor);

        // Place all products in this facing (same type, same color, same texture)
        for (let p = 0; p < facing.count; p++) {
          const px = aisleX - AISLE_LEN / 2 + posIdx * productW + productW / 2;
          posIdx++;

          let productMesh: THREE.Mesh;
          let productH: number;

          if (facing.type === 'bag') {
            productH = 4;
            const bagW = productW - 2;
            productMesh = addShadow(new THREE.Mesh(
              new THREE.CylinderGeometry(bagW / 2, bagW / 2, productH, 8),
              new THREE.MeshStandardMaterial({ map: prodTex, metalness: 0.3, roughness: 0.4 })
            ));
            productMesh.rotation.x = Math.PI / 2;
            productMesh.rotation.z = Math.PI / 2;
            productMesh.scale.set(1, 0.7, 1);
          } else if (facing.type === 'bottle') {
            productH = 5;
            const bottleBody = new THREE.Group();
            const bodyMesh = addShadow(new THREE.Mesh(
              new THREE.CylinderGeometry(1.2, 1.2, 3.5, 12),
              new THREE.MeshStandardMaterial({ map: prodTex, metalness: 0.2, roughness: 0.3, transparent: true, opacity: 0.85 })
            ));
            bottleBody.add(bodyMesh);
            const shoulder = addShadow(new THREE.Mesh(
              new THREE.CylinderGeometry(0.5, 1.2, 1, 8),
              new THREE.MeshStandardMaterial({ map: prodTex, metalness: 0.2, roughness: 0.3 })
            ));
            shoulder.position.y = 2.25;
            bottleBody.add(shoulder);
            const neck = addShadow(new THREE.Mesh(
              new THREE.CylinderGeometry(0.5, 0.5, 0.8, 8),
              new THREE.MeshStandardMaterial({ color: 0x4a4a52, metalness: 0.3, roughness: 0.4 })
            ));
            neck.position.y = 3.15;
            bottleBody.add(neck);
            const cap = addShadow(new THREE.Mesh(
              new THREE.CylinderGeometry(0.55, 0.55, 0.4, 8),
              new THREE.MeshStandardMaterial({ color: 0xc02020, metalness: 0.4, roughness: 0.3 })
            ));
            cap.position.y = 3.75;
            bottleBody.add(cap);
            bottleBody.rotation.y = side > 0 ? 0 : Math.PI;
            productMesh = bottleBody as unknown as THREE.Mesh;
          } else if (facing.type === 'can') {
            productH = 3.5;
            productMesh = addShadow(new THREE.Mesh(
              new THREE.CylinderGeometry(0.9, 0.9, productH, 12),
              new THREE.MeshStandardMaterial({ map: prodTex, metalness: 0.6, roughness: 0.3 })
            ));
            productMesh.rotation.z = Math.PI / 2;
            productMesh.rotation.y = side > 0 ? 0 : Math.PI;
          } else if (facing.type === 'jar') {
            productH = 3;
            const jarGroup = new THREE.Group();
            const jarBody = addShadow(new THREE.Mesh(
              new THREE.CylinderGeometry(1.3, 1.3, 2.2, 12),
              new THREE.MeshStandardMaterial({ map: prodTex, metalness: 0.1, roughness: 0.1, transparent: true, opacity: 0.7 })
            ));
            jarBody.position.y = 0;
            jarGroup.add(jarBody);
            const lid = addShadow(new THREE.Mesh(
              new THREE.CylinderGeometry(1.3, 1.3, 0.6, 12),
              new THREE.MeshStandardMaterial({ color: 0x8a8a92, metalness: 0.7, roughness: 0.3 })
            ));
            lid.position.y = 1.4;
            jarGroup.add(lid);
            jarGroup.rotation.y = side > 0 ? 0 : Math.PI;
            productMesh = jarGroup as unknown as THREE.Mesh;
          } else if (facing.type === 'pouch') {
            productH = 4;
            const pouchW = productW - 2.5;
            productMesh = addShadow(new THREE.Mesh(
              new THREE.BoxGeometry(pouchW, productH, 1.5),
              new THREE.MeshStandardMaterial({ map: prodTex, metalness: 0.2, roughness: 0.5 })
            ));
            productMesh.scale.set(0.9, 1, 1);
            productMesh.rotation.y = side > 0 ? 0 : Math.PI;
          } else {
            // Box (default)
            productH = 3 + (f % 3);
            const boxW = productW - 1.5;
            productMesh = addShadow(new THREE.Mesh(
              new THREE.BoxGeometry(boxW, productH, 4),
              new THREE.MeshStandardMaterial({ map: prodTex, metalness: 0.1, roughness: 0.5 })
            ));
            productMesh.rotation.y = side > 0 ? 0 : Math.PI;
          }

          productMesh.position.set(px, shelfY + 0.25 + productH / 2, shelfZ + side * 1.5);
          root.add(productMesh);
        }

        // Price tag at the start of each facing (at the leftmost product of the block)
        if (s < SHELF_COUNT - 1) {
          const tagX = aisleX - AISLE_LEN / 2 + (posIdx - facing.count) * productW + productW / 2;
          const tagTex = priceTagTexture(
            `${category.substring(0, 4)}${f + 1}`,
            `$${(1.99 + f * 0.5).toFixed(2)}`
          );
          const tag = addShadow(new THREE.Mesh(
            new THREE.PlaneGeometry(6, 1.5),
            new THREE.MeshStandardMaterial({ map: tagTex, emissive: 0xffffff, emissiveMap: tagTex, emissiveIntensity: 0.2 })
          ));
          tag.position.set(tagX, shelfY + 0.5, shelfZ + side * 3.8);
          tag.rotation.y = side > 0 ? 0 : Math.PI;
          root.add(tag);
        }
      }
      // (Price tags are now placed per-facing above)
    }

    // Endcap (promotional display at the end of the aisle)
    const endcapX = aisleX + AISLE_LEN / 2 + 4;
    const endcap = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(8, 16, AISLE_W),
      shelfMat
    ));
    endcap.position.set(endcapX, 8, z);
    root.add(endcap);
    // Endcap products (stacked boxes)
    for (let e = 0; e < 4; e++) {
      const eColor = colors[e % colors.length];
      const eAccent = colors[(e + 1) % colors.length];
      const eTex = productBoxTexture(`SALE${e + 1}`, eColor, eAccent);
      const eMat = new THREE.MeshStandardMaterial({ map: eTex, metalness: 0.1, roughness: 0.5 });
      for (let r = 0; r < 3; r++) {
        const ebox = addShadow(new THREE.Mesh(new THREE.BoxGeometry(6, 3, 6), eMat));
        ebox.position.set(endcapX, 2 + r * 3.5, z - 6 + r * 2);
        root.add(ebox);
      }
    }
  }
}

function buildProduceSection(
  root: THREE.Group, binMat: THREE.Material,
  appleMat: THREE.Material, orangeMat: THREE.Material, bananaMat: THREE.Material,
  lettuceMat: THREE.Material, tomatoMat: THREE.Material, grapeMat: THREE.Material,
  lemonMat: THREE.Material, pepperRedMat: THREE.Material, pepperGreenMat: THREE.Material,
  potatoMat: THREE.Material, signMat: THREE.Material
) {
  // Produce display bins (angled display cases) along X=-200, Z=80-180
  // 6 bins in a row
  const binX = -200;
  const binStartZ = 80;
  const binSpacing = 18;

  const produceItems = [
    { name: 'APPLES', mat: appleMat, color: 0xc02020 },
    { name: 'ORANGES', mat: orangeMat, color: 0xff8c20 },
    { name: 'BANANAS', mat: bananaMat, color: 0xf4d020 },
    { name: 'LEMONS', mat: lemonMat, color: 0xf4f020 },
    { name: 'TOMATOES', mat: tomatoMat, color: 0xd03030 },
    { name: 'PEPPERS', mat: pepperRedMat, color: 0xc02020 },
  ];

  for (let i = 0; i < 6; i++) {
    const bz = binStartZ + i * binSpacing;
    // Bin base
    const binBase = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(30, 6, 14),
      binMat
    ));
    binBase.position.set(binX, 3, bz);
    root.add(binBase);
    // Flat display surface (no tilt — fruits sit flat on top)
    const display = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(28, 1, 12),
      new THREE.MeshStandardMaterial({ color: 0x3a5a2a, metalness: 0.1, roughness: 0.7 })
    ));
    display.position.set(binX, 6.5, bz);
    root.add(display);
    // Display surface top is at y=7. Fruits sit ON TOP: y = 7 + radius + stacking

    // Produce items — piled in the bin, sitting on the display surface
    const item = produceItems[i];
    for (let p = 0; p < 20; p++) {
      const px = binX - 12 + Math.random() * 24;
      const pz = bz - 5 + Math.random() * 10;
      let shape;
      let fruitRadius = 1.2;
      if (item.name === 'BANANAS') {
        // Bananas = curved cylinders lying flat
        fruitRadius = 0.8;
        shape = addShadow(new THREE.Mesh(
          new THREE.CapsuleGeometry(0.8, 3, 4, 8),
          item.mat
        ));
        shape.scale.set(1, 0.5, 1);
        shape.rotation.z = Math.random() * Math.PI;
        shape.rotation.x = Math.PI / 2; // lay flat
      } else if (item.name === 'LEMONS' || item.name === 'ORANGES' || item.name === 'APPLES') {
        fruitRadius = 1.2;
        shape = addShadow(new THREE.Mesh(new THREE.SphereGeometry(1.2, 12, 8), item.mat));
      } else {
        fruitRadius = 1;
        shape = addShadow(new THREE.Mesh(new THREE.SphereGeometry(1, 12, 8), item.mat));
      }
      // Y position: display top (7) + fruit radius + small random stacking offset (0-2 for piling)
      const stackingOffset = Math.random() < 0.6 ? 0 : Math.random() * 2;
      const py = 7 + fruitRadius + stackingOffset;
      shape.position.set(px, py, pz);
      root.add(shape);

      // Add stems/leaves to certain fruits (apples, peppers, tomatoes, lemons)
      if ((item.name === 'APPLES' || item.name === 'PEPPERS' || item.name === 'TOMATOES' || item.name === 'LEMONS') && Math.random() > 0.4) {
        const stemMat = new THREE.MeshStandardMaterial({ color: 0x4a3a20, roughness: 0.8 });
        const stem = addShadow(new THREE.Mesh(
          new THREE.CylinderGeometry(0.1, 0.15, 0.6, 5),
          stemMat
        ));
        stem.position.set(px, py + fruitRadius + 0.2, pz);
        root.add(stem);
        // Small leaf (green cone)
        if (Math.random() > 0.5) {
          const leafMat = new THREE.MeshStandardMaterial({ color: 0x4a8a3a, roughness: 0.7 });
          const leaf = addShadow(new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.8, 4), leafMat));
          leaf.position.set(px + 0.3, py + fruitRadius + 0.3, pz);
          leaf.rotation.z = 0.8;
          root.add(leaf);
        }
      }
    }

    // Price sign on the bin
    const signTex = priceTagTexture(item.name, `$${(0.99 + i * 0.5).toFixed(2)}/lb`);
    const sign = addShadow(new THREE.Mesh(
      new THREE.PlaneGeometry(10, 2.5),
      new THREE.MeshStandardMaterial({ map: signTex, emissive: 0xffffff, emissiveMap: signTex, emissiveIntensity: 0.3 })
    ));
    sign.position.set(binX, 12, bz - 6);
    root.add(sign);
  }

  // Second row of produce bins (lettuces, grapes, potatoes)
  const bin2X = -160;
  const produce2 = [
    { name: 'LETTUCE', mat: lettuceMat },
    { name: 'GRAPES', mat: grapeMat },
    { name: 'POTATOES', mat: potatoMat },
    { name: 'PEPPERS', mat: pepperGreenMat },
  ];
  for (let i = 0; i < 4; i++) {
    const bz = 100 + i * 18;
    const binBase = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(24, 6, 12),
      binMat
    ));
    binBase.position.set(bin2X, 3, bz);
    root.add(binBase);
    // Flat display surface (no tilt)
    const display2 = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(22, 1, 10),
      new THREE.MeshStandardMaterial({ color: 0x3a5a2a, metalness: 0.1, roughness: 0.7 })
    ));
    display2.position.set(bin2X, 6.5, bz);
    root.add(display2);

    const item = produce2[i];
    for (let p = 0; p < 15; p++) {
      const px = bin2X - 9 + Math.random() * 18;
      const pz = bz - 4 + Math.random() * 8;
      let shape;
      let fruitRadius = 1;
      if (item.name === 'LETTUCE') {
        fruitRadius = 1.5;
        shape = addShadow(new THREE.Mesh(new THREE.SphereGeometry(1.5, 10, 7), item.mat));
        shape.scale.set(1, 0.6, 1);
        fruitRadius = 0.9; // scaled height
      } else if (item.name === 'GRAPES') {
        fruitRadius = 0.5;
        shape = addShadow(new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6), item.mat));
      } else if (item.name === 'POTATOES') {
        fruitRadius = 1;
        shape = addShadow(new THREE.Mesh(new THREE.SphereGeometry(1, 8, 6), item.mat));
        shape.scale.set(1.3, 0.8, 1);
        fruitRadius = 0.8;
      } else {
        fruitRadius = 1;
        shape = addShadow(new THREE.Mesh(new THREE.SphereGeometry(1, 10, 8), item.mat));
      }
      // Sit on display surface (top at y=7), with small stacking offset
      const stackingOffset = Math.random() < 0.6 ? 0 : Math.random() * 1.5;
      const py = 7 + fruitRadius + stackingOffset;
      shape.position.set(px, py, pz);
      root.add(shape);
    }
  }

  // Misting system (visible spray bars above greens)
  for (let i = 0; i < 3; i++) {
    const mistBar = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.3, 24, 8),
      new THREE.MeshStandardMaterial({ color: 0x8a8a92, metalness: 0.7, roughness: 0.3 })
    ));
    mistBar.rotation.z = Math.PI / 2;
    mistBar.position.set(-200, 20, 80 + i * 30);
    root.add(mistBar);
    // Misting nozzles (small spheres)
    for (let n = 0; n < 4; n++) {
      const nozzle = addShadow(new THREE.Mesh(
        new THREE.SphereGeometry(0.4, 6, 4),
        new THREE.MeshStandardMaterial({ color: 0x5a5a62, metalness: 0.7, roughness: 0.3 })
      ));
      nozzle.position.set(-200 - 8 + n * 5, 19.5, 80 + i * 30);
      root.add(nozzle);
    }
  }

  // Refrigerated produce case (for cut fruit, salads) — wall unit
  const refCase = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(60, 22, 8),
    new THREE.MeshStandardMaterial({ color: 0x2a2a2e, metalness: 0.4, roughness: 0.4 })
  ));
  refCase.position.set(-240, 11, 150);
  root.add(refCase);
  // Glass top
  const refGlass = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(56, 0.5, 6),
    new THREE.MeshStandardMaterial({ color: 0xc8dde8, metalness: 0.3, roughness: 0.1, transparent: true, opacity: 0.5 })
  ));
  refGlass.position.set(-240, 22.5, 150);
  root.add(refGlass);
  // Cut fruit containers inside (visible through glass)
  for (let i = 0; i < 6; i++) {
    const cup = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(2, 2, 3, 8),
      [appleMat, orangeMat, grapeMat, lemonMat, tomatoMat, pepperRedMat][i]
    ));
    cup.position.set(-260 + i * 8, 18, 150);
    root.add(cup);
  }
}

function buildBakery(
  root: THREE.Group, breadMat: THREE.Material,
  shelfMat: THREE.Material, signMat: THREE.Material
) {
  // Bakery display case (glass front, X=220, Z=130)
  const caseBase = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(50, 10, 8),
    new THREE.MeshStandardMaterial({ color: 0x4a3a2a, metalness: 0.2, roughness: 0.6 })
  ));
  caseBase.position.set(220, 5, 130);
  root.add(caseBase);
  // Glass case on top
  const glassCase = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(48, 16, 6),
    new THREE.MeshStandardMaterial({ color: 0xc8dde8, metalness: 0.3, roughness: 0.1, transparent: true, opacity: 0.4 })
  ));
  glassCase.position.set(220, 18, 130);
  root.add(glassCase);
  // Pastries inside (small cylinders/spheres)
  for (let i = 0; i < 8; i++) {
    const pastry = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(2, 2, 2, 8),
      new THREE.MeshStandardMaterial({ color: [0xf4d080, 0xc8a060, 0xd8b070, 0xe8c090][i % 4], roughness: 0.7 })
    ));
    pastry.position.set(205 + (i % 4) * 10, 12, 128 + Math.floor(i / 4) * 4);
    root.add(pastry);
  }

  // Bread shelves (open wire racks with loaves)
  for (let row = 0; row < 3; row++) {
    const shelfY = 5 + row * 6;
    const shelf = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(40, 0.5, 8),
      shelfMat
    ));
    shelf.position.set(220, shelfY, 160);
    root.add(shelf);
    // Bread loaves on shelf
    for (let b = 0; b < 5; b++) {
      const loaf = addShadow(new THREE.Mesh(
        new THREE.CapsuleGeometry(1.5, 4, 4, 8),
        breadMat
      ));
      loaf.rotation.z = Math.PI / 2;
      loaf.scale.set(1, 1, 0.7);
      loaf.position.set(208 + b * 6, shelfY + 2, 160);
      root.add(loaf);
    }
  }

  // Cake display (tiered round display)
  const cakeStand = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(8, 9, 6, 16),
    new THREE.MeshStandardMaterial({ color: 0xe8e0d4, metalness: 0.1, roughness: 0.4 })
  ));
  cakeStand.position.set(250, 3, 160);
  root.add(cakeStand);
  // Tier 2
  const cakeTier2 = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(5, 6, 4, 16),
    new THREE.MeshStandardMaterial({ color: 0xe8e0d4, metalness: 0.1, roughness: 0.4 })
  ));
  cakeTier2.position.set(250, 8, 160);
  root.add(cakeTier2);
  // Cake on top
  const cake = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(4, 4, 4, 16),
    new THREE.MeshStandardMaterial({ color: 0xf4d0e0, roughness: 0.5 })
  ));
  cake.position.set(250, 12, 160);
  root.add(cake);

  // "BAKERY" sign
  const signTex = categoryBannerTexture('FRESH BAKED', '#c88030');
  const sign = addShadow(new THREE.Mesh(
    new THREE.PlaneGeometry(40, 8),
    new THREE.MeshStandardMaterial({ map: signTex, emissive: 0xffffff, emissiveMap: signTex, emissiveIntensity: 0.3 })
  ));
  sign.position.set(220, 30, 122);
  root.add(sign);
}

function buildDeli(
  root: THREE.Group, glassMat: THREE.Material,
  coolerFrameMat: THREE.Material, signMat: THREE.Material, shelfMat: THREE.Material
) {
  // Deli counter (long glass display case)
  const counterBase = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(80, 8, 8),
    new THREE.MeshStandardMaterial({ color: 0x3a3a40, metalness: 0.4, roughness: 0.4 })
  ));
  counterBase.position.set(-230, 4, 180);
  root.add(counterBase);
  // Glass case on top (curved look — use a box)
  const glassCase = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(78, 14, 6),
    glassMat
  ));
  glassCase.position.set(-230, 17, 180);
  root.add(glassCase);
  // Prepared foods inside (colored trays)
  const deliFoods = [
    { color: 0xc06030, name: 'ROAST CHICKEN' },
    { color: 0xa04020, name: 'ROAST BEEF' },
    { color: 0xe8c060, name: 'MACARONI' },
    { color: 0x4a8a3a, name: 'SALAD' },
    { color: 0xd0a060, name: 'POTATOES' },
    { color: 0xc08040, name: 'MEATLOAF' },
  ];
  for (let i = 0; i < 6; i++) {
    const food = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(10, 3, 4),
      new THREE.MeshStandardMaterial({ color: deliFoods[i].color, roughness: 0.6 })
    ));
    food.position.set(-265 + i * 12, 11, 180);
    root.add(food);
  }
  // Price sign
  const signTex = categoryBannerTexture('DELI', '#a04020');
  const sign = addShadow(new THREE.Mesh(
    new THREE.PlaneGeometry(30, 8),
    new THREE.MeshStandardMaterial({ map: signTex, emissive: 0xffffff, emissiveMap: signTex, emissiveIntensity: 0.3 })
  ));
  sign.position.set(-230, 30, 175);
  root.add(sign);
  // Meat slicer (visible on the counter)
  const slicerBase = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(6, 8, 5),
    new THREE.MeshStandardMaterial({ color: 0xa8acb4, metalness: 0.8, roughness: 0.2 })
  ));
  slicerBase.position.set(-195, 12, 180);
  root.add(slicerBase);
  // Slicer blade
  const blade = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(3, 3, 0.3, 16),
    new THREE.MeshStandardMaterial({ color: 0xc0c0c8, metalness: 0.95, roughness: 0.1 })
  ));
  blade.rotation.z = Math.PI / 2;
  blade.position.set(-195, 15, 180);
  root.add(blade);
}

function buildDairyWall(root: THREE.Group, coolerFrameMat: THREE.Material) {
  // Wall of glass-door coolers along the north wall (Z=195)
  // 12 cooler units, each 40 wide, side by side
  const coolerTex = coolerDoorTexture();
  const coolerCount = 12;
  const coolerW = 40;
  const totalW = coolerCount * coolerW;
  const startX = -totalW / 2 + coolerW / 2;

  for (let i = 0; i < coolerCount; i++) {
    const cx = startX + i * coolerW;
    // Cooler frame (box)
    const frame = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(coolerW - 1, 25, 8),
      coolerFrameMat
    ));
    frame.position.set(cx, 12.5, 193);
    root.add(frame);
    // Glass door (textured with frost + handle)
    const door = addShadow(new THREE.Mesh(
      new THREE.PlaneGeometry(coolerW - 4, 22),
      new THREE.MeshStandardMaterial({
        map: coolerTex, metalness: 0.3, roughness: 0.1,
        transparent: true, opacity: 0.7,
      })
    ));
    door.position.set(cx, 13, 189);
    root.add(door);
    // Shelves inside (faintly visible through frost)
    for (let s = 0; s < 4; s++) {
      const shelf = addShadow(new THREE.Mesh(
        new THREE.BoxGeometry(coolerW - 4, 0.3, 6),
        new THREE.MeshStandardMaterial({ color: 0x6a6a72, metalness: 0.3, roughness: 0.5 })
      ));
      shelf.position.set(cx, 4 + s * 5.5, 192);
      root.add(shelf);
      // Dairy products on shelf (white/brown jugs and boxes)
      for (let p = 0; p < 4; p++) {
        const prodColor = [0xf4f0e8, 0xc8a060, 0x2a6ab0, 0xf4d020][p % 4];
        const prod = addShadow(new THREE.Mesh(
          new THREE.BoxGeometry(5, 4, 4),
          new THREE.MeshStandardMaterial({ color: prodColor, roughness: 0.6 })
        ));
        prod.position.set(cx - 12 + p * 8, 4 + s * 5.5 + 2, 192);
        root.add(prod);
      }
    }
  }

  // Cooler top signage ("DAIRY" / "MILK" / "CHEESE" / "YOGURT")
  const sectionLabels = ['MILK', 'JUICE', 'YOGURT', 'CHEESE', 'BUTTER', 'CREAM'];
  for (let i = 0; i < 6; i++) {
    const cx = startX + i * coolerW * 2 + coolerW / 2;
    const labelTex = categoryBannerTexture(sectionLabels[i], '#2a6ab0');
    const label = addShadow(new THREE.Mesh(
      new THREE.PlaneGeometry(coolerW * 2 - 4, 4),
      new THREE.MeshStandardMaterial({ map: labelTex, emissive: 0xffffff, emissiveMap: labelTex, emissiveIntensity: 0.3 })
    ));
    label.position.set(cx, 27, 189);
    root.add(label);
  }
}

function buildFrozenSection(
  root: THREE.Group, coolerFrameMat: THREE.Material, glassMat: THREE.Material
) {
  // Chest freezers (open-top, X=160-260, Z=150-180)
  const freezerCount = 5;
  for (let i = 0; i < freezerCount; i++) {
    const fx = 165 + i * 22;
    // Freezer body
    const body = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(18, 10, 30),
      coolerFrameMat
    ));
    body.position.set(fx, 5, 165);
    root.add(body);
    // Open top (frosted glass — slightly transparent)
    const top = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(16, 0.5, 28),
      glassMat
    ));
    top.position.set(fx, 10.5, 165);
    root.add(top);
    // Frozen products inside (visible through frost — boxes and bags)
    for (let p = 0; p < 6; p++) {
      const prodColor = [0x2a6ab0, 0xc02020, 0xf4a020, 0x4a8a3a, 0xa040c0, 0xf4f0e8][p];
      const prod = addShadow(new THREE.Mesh(
        new THREE.BoxGeometry(5, 4, 4),
        new THREE.MeshStandardMaterial({ color: prodColor, roughness: 0.6 })
      ));
      prod.position.set(fx - 6 + (p % 3) * 6, 7, 155 + Math.floor(p / 3) * 12);
      root.add(prod);
    }
  }

  // Vertical freezer cases (glass-door, along the east wall area)
  const vFreezerTex = coolerDoorTexture();
  for (let i = 0; i < 4; i++) {
    const fx = 270;
    const fz = 150 + i * 12;
    const frame = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(8, 25, 10),
      coolerFrameMat
    ));
    frame.position.set(fx, 12.5, fz);
    root.add(frame);
    // Glass door
    const door = addShadow(new THREE.Mesh(
      new THREE.PlaneGeometry(6, 22),
      new THREE.MeshStandardMaterial({
        map: vFreezerTex, metalness: 0.3, roughness: 0.1,
        transparent: true, opacity: 0.7,
      })
    ));
    door.position.set(fx - 5, 13, fz);
    door.rotation.y = Math.PI / 2;
    root.add(door);
  }
}

function buildCheckoutLane(
  root: THREE.Group, x: number, z: number, num: number,
  checkoutMat: THREE.Material, conveyorMat: THREE.Material,
  registerMat: THREE.Material, blackMat: THREE.Material
) {
  // Checkout counter (L-shaped — main counter + bagging area)
  // Main counter
  const counter = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(30, 8, 10),
    checkoutMat
  ));
  counter.position.set(x, 4, z);
  root.add(counter);
  // Counter top (lighter)
  const top = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(32, 0.5, 12),
    new THREE.MeshStandardMaterial({ color: 0x6a6a72, metalness: 0.3, roughness: 0.4 })
  ));
  top.position.set(x, 8.25, z);
  root.add(top);

  // Conveyor belt (moving belt — dark rubber surface)
  const belt = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(24, 0.3, 6),
    conveyorMat
  ));
  belt.position.set(x, 8.5, z + 2);
  root.add(belt);
  // Belt rollers (visible at the ends)
  for (const bx of [x - 12, x + 12]) {
    const roller = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(0.6, 0.6, 6, 8),
      new THREE.MeshStandardMaterial({ color: 0x8a8a92, metalness: 0.7, roughness: 0.3 })
    ));
    roller.rotation.x = Math.PI / 2;
    roller.position.set(bx, 8.3, z + 2);
    root.add(roller);
  }

  // Cash register (POS terminal)
  const register = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(6, 5, 5),
    registerMat
  ));
  register.position.set(x + 8, 11, z - 1);
  root.add(register);
  // Register screen (tilted)
  const screen = addShadow(new THREE.Mesh(
    new THREE.PlaneGeometry(4, 3),
    new THREE.MeshStandardMaterial({ color: 0x1a1a2a, emissive: 0x2a4a6a, emissiveIntensity: 0.4 })
  ));
  screen.position.set(x + 8, 12.5, z - 2.5);
  screen.rotation.x = -0.3;
  root.add(screen);
  // Register keyboard
  const keyboard = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(4, 0.5, 3),
    blackMat
  ));
  keyboard.position.set(x + 8, 9, z);
  root.add(keyboard);
  // Barcode scanner (handheld)
  const scanner = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(0.6, 0.6, 3, 8),
    blackMat
  ));
  scanner.rotation.z = Math.PI / 2;
  scanner.position.set(x + 5, 9, z + 1);
  root.add(scanner);
  // Scanner base (the flat scanner embedded in the counter)
  const scannerBase = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(4, 0.3, 3),
    new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.5, roughness: 0.4, emissive: 0x10ff10, emissiveIntensity: 0.1 })
  ));
  scannerBase.position.set(x + 2, 8.5, z + 1);
  root.add(scannerBase);

  // Bagging area (extends to the right of the register)
  const bagging = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(12, 7, 10),
    checkoutMat
  ));
  bagging.position.set(x + 20, 3.5, z);
  root.add(bagging);
  const baggingTop = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(13, 0.5, 11),
    new THREE.MeshStandardMaterial({ color: 0x6a6a72, metalness: 0.3, roughness: 0.4 })
  ));
  baggingTop.position.set(x + 20, 7.25, z);
  root.add(baggingTop);

  // Bag rack (plastic bag holder above bagging area)
  const bagRack = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.3, 10, 8),
    new THREE.MeshStandardMaterial({ color: 0x4a4a52, metalness: 0.5, roughness: 0.4 })
  ));
  bagRack.rotation.z = Math.PI / 2;
  bagRack.position.set(x + 20, 12, z);
  root.add(bagRack);
  // Hanging bags (small white boxes)
  for (let b = 0; b < 3; b++) {
    const bag = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(3, 4, 0.2),
      new THREE.MeshStandardMaterial({ color: 0xe8e8e0, roughness: 0.7, transparent: true, opacity: 0.8 })
    ));
    bag.position.set(x + 17 + b * 3, 10, z);
    root.add(bag);
  }

  // Divider lane (the next customer's queue — a small barrier)
  const divider = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 3, 8),
    new THREE.MeshStandardMaterial({ color: 0xf4a020, metalness: 0.2, roughness: 0.5 })
  ));
  divider.position.set(x - 14, 8.5, z + 2);
  root.add(divider);
}

function buildCustomerService(
  root: THREE.Group, shelfMat: THREE.Material, signMat: THREE.Material, blackMat: THREE.Material
) {
  // Customer service desk (front-right corner, X=260, Z=-170)
  const desk = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(40, 8, 12),
    new THREE.MeshStandardMaterial({ color: 0x4a3a2a, metalness: 0.2, roughness: 0.5 })
  ));
  desk.position.set(260, 4, -170);
  root.add(desk);
  // Desk top
  const deskTop = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(42, 0.5, 14),
    new THREE.MeshStandardMaterial({ color: 0x6a5a4a, metalness: 0.2, roughness: 0.4 })
  ));
  deskTop.position.set(260, 8.25, -170);
  root.add(deskTop);
  // Computer monitor on desk
  const mon = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(6, 4, 0.5),
    blackMat
  ));
  mon.position.set(260, 12, -174);
  mon.rotation.x = -0.2;
  root.add(mon);
  // Screen
  const screen = addShadow(new THREE.Mesh(
    new THREE.PlaneGeometry(5, 3),
    new THREE.MeshStandardMaterial({ color: 0x1a1a2a, emissive: 0x2a4a6a, emissiveIntensity: 0.4 })
  ));
  screen.position.set(260, 12, -173.7);
  screen.rotation.x = -0.2;
  root.add(screen);
  // Sign
  const signTex = categoryBannerTexture('CUSTOMER SERVICE', '#2a6a4a');
  const sign = addShadow(new THREE.Mesh(
    new THREE.PlaneGeometry(36, 8),
    new THREE.MeshStandardMaterial({ map: signTex, emissive: 0xffffff, emissiveMap: signTex, emissiveIntensity: 0.3 })
  ));
  sign.position.set(260, 20, -178);
  root.add(sign);
}
