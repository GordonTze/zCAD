// ====================== BOLD PROCEDURAL TEXTURES ======================
// Higher-contrast, more visible textures with bump maps for 3D relief.
// All generated at runtime via Canvas API.

import * as THREE from 'three';

function makeTexture(size: number, draw: (ctx: CanvasRenderingContext2D, s: number) => void): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  draw(ctx, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

// Also make a bump map (grayscale) from a draw function
function makeBumpMap(size: number, draw: (ctx: CanvasRenderingContext2D, s: number) => void): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  draw(ctx, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

// ===== BOLD WOOD GRAIN — high contrast, visible grain lines =====
export function makeWoodTexture(baseColor = '#a0703a', darkColor = '#4a2f15'): { map: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
  return {
    map: makeTexture(256, (ctx, s) => {
      ctx.fillStyle = baseColor;
      ctx.fillRect(0, 0, s, s);
      // Bold grain lines
      for (let i = 0; i < 20; i++) {
        ctx.strokeStyle = darkColor;
        ctx.globalAlpha = 0.4 + Math.random() * 0.3;
        ctx.lineWidth = 1 + Math.random() * 3;
        ctx.beginPath();
        const y = (i / 20) * s + Math.random() * 8;
        ctx.moveTo(0, y);
        for (let x = 0; x < s; x += 8) {
          ctx.lineTo(x, y + Math.sin(x * 0.08 + i) * 4 + (Math.random() - 0.5) * 3);
        }
        ctx.stroke();
      }
      // Dark knots
      for (let i = 0; i < 4; i++) {
        ctx.globalAlpha = 0.6;
        const kx = Math.random() * s, ky = Math.random() * s;
        const kr = 4 + Math.random() * 6;
        const grad = ctx.createRadialGradient(kx, ky, 0, kx, ky, kr);
        grad.addColorStop(0, darkColor);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(kx, ky, kr, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }),
    bumpMap: makeBumpMap(256, (ctx, s) => {
      ctx.fillStyle = '#808080';
      ctx.fillRect(0, 0, s, s);
      for (let i = 0; i < 20; i++) {
        ctx.strokeStyle = '#404040';
        ctx.lineWidth = 2;
        ctx.beginPath();
        const y = (i / 20) * s;
        ctx.moveTo(0, y);
        for (let x = 0; x < s; x += 8) {
          ctx.lineTo(x, y + Math.sin(x * 0.08 + i) * 4);
        }
        ctx.stroke();
      }
    }),
  };
}

// ===== BOLD TILE — thick grout lines, glossy tiles =====
export function makeTileTexture(tileColor = '#e8e8e0', groutColor = '#666666', tileSize = 32): { map: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
  return {
    map: makeTexture(256, (ctx, s) => {
      ctx.fillStyle = groutColor;
      ctx.fillRect(0, 0, s, s);
      const tiles = Math.floor(s / tileSize);
      for (let x = 0; x < tiles; x++) {
        for (let y = 0; y < tiles; y++) {
          // Tile with gradient (glossy look)
          const grad = ctx.createLinearGradient(x * tileSize, y * tileSize, x * tileSize + tileSize, y * tileSize + tileSize);
          grad.addColorStop(0, tileColor);
          grad.addColorStop(0.5, 'rgba(255,255,255,0.2)');
          grad.addColorStop(1, tileColor);
          ctx.fillStyle = grad;
          ctx.fillRect(x * tileSize + 2, y * tileSize + 2, tileSize - 4, tileSize - 4);
          // Bold grout shadow
          ctx.fillStyle = 'rgba(0,0,0,0.2)';
          ctx.fillRect(x * tileSize + tileSize - 4, y * tileSize + 2, 2, tileSize - 4);
          ctx.fillRect(x * tileSize + 2, y * tileSize + tileSize - 4, tileSize - 4, 2);
        }
      }
    }),
    bumpMap: makeBumpMap(256, (ctx, s) => {
      ctx.fillStyle = '#404040'; // grout is recessed
      ctx.fillRect(0, 0, s, s);
      const tiles = Math.floor(s / 32);
      ctx.fillStyle = '#c0c0c0'; // tiles are raised
      for (let x = 0; x < tiles; x++) {
        for (let y = 0; y < tiles; y++) {
          ctx.fillRect(x * 32 + 2, y * 32 + 2, 28, 28);
        }
      }
    }),
  };
}

// ===== BOLD BRICK — visible mortar, color variation =====
export function makeBrickTexture(brickColor = '#9b4a2a', mortarColor = '#d0c8b0'): { map: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
  return {
    map: makeTexture(256, (ctx, s) => {
      ctx.fillStyle = mortarColor;
      ctx.fillRect(0, 0, s, s);
      const bw = 64, bh = 24, m = 4;
      for (let row = 0; row < s / bh + 1; row++) {
        const offset = (row % 2) * (bw / 2);
        for (let col = -1; col < s / bw + 2; col++) {
          const x = col * bw + offset + m;
          const y = row * bh + m;
          const shade = 0.7 + Math.random() * 0.4;
          const r = parseInt(brickColor.substr(1, 2), 16) * shade;
          const g = parseInt(brickColor.substr(3, 2), 16) * shade;
          const b = parseInt(brickColor.substr(5, 2), 16) * shade;
          ctx.fillStyle = `rgb(${r | 0},${g | 0},${b | 0})`;
          ctx.fillRect(x, y, bw - m * 2, bh - m * 2);
          // Bold brick texture spots
          ctx.fillStyle = `rgba(0,0,0,${0.1 + Math.random() * 0.2})`;
          for (let k = 0; k < 5; k++) {
            ctx.fillRect(x + Math.random() * (bw - m * 2), y + Math.random() * (bh - m * 2), 3, 2);
          }
        }
      }
    }),
    bumpMap: makeBumpMap(256, (ctx, s) => {
      ctx.fillStyle = '#404040'; // mortar recessed
      ctx.fillRect(0, 0, s, s);
      ctx.fillStyle = '#c0c0c0'; // bricks raised
      const bw = 64, bh = 24, m = 4;
      for (let row = 0; row < s / bh + 1; row++) {
        const offset = (row % 2) * (bw / 2);
        for (let col = -1; col < s / bw + 2; col++) {
          ctx.fillRect(col * bw + offset + m, row * bh + m, bw - m * 2, bh - m * 2);
        }
      }
    }),
  };
}

// ===== BOLD FABRIC — visible weave, thread pattern =====
export function makeFabricTexture(baseColor = '#4a5a7a', patternColor = '#2a3a5a'): { map: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
  return {
    map: makeTexture(128, (ctx, s) => {
      ctx.fillStyle = baseColor;
      ctx.fillRect(0, 0, s, s);
      // Bold diagonal weave
      for (let x = 0; x < s; x += 3) {
        for (let y = 0; y < s; y += 3) {
          const isWarp = (x + y) % 6 < 3;
          ctx.fillStyle = isWarp ? patternColor : baseColor;
          ctx.globalAlpha = 0.5 + Math.random() * 0.3;
          ctx.fillRect(x, y, 3, 3);
        }
      }
      // Stitching lines
      ctx.globalAlpha = 0.3;
      ctx.strokeStyle = patternColor;
      ctx.lineWidth = 1;
      for (let y = 0; y < s; y += 16) {
        ctx.beginPath();
        ctx.setLineDash([4, 4]);
        ctx.moveTo(0, y);
        ctx.lineTo(s, y);
        ctx.stroke();
      }
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;
    }),
    bumpMap: makeBumpMap(128, (ctx, s) => {
      ctx.fillStyle = '#808080';
      ctx.fillRect(0, 0, s, s);
      for (let x = 0; x < s; x += 3) {
        for (let y = 0; y < s; y += 3) {
          ctx.fillStyle = (x + y) % 6 < 3 ? '#606060' : '#a0a0a0';
          ctx.fillRect(x, y, 3, 3);
        }
      }
    }),
  };
}

// ===== BOLD GRANITE — high contrast speckles =====
export function makeGraniteTexture(): { map: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
  return {
    map: makeTexture(256, (ctx, s) => {
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, s, s);
      const colors = ['#1a1a1a', '#2a2a2a', '#3a3a3a', '#555555', '#4a4a4a', '#666666', '#aaaaaa', '#777777'];
      for (let i = 0; i < 3000; i++) {
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        ctx.globalAlpha = 0.4 + Math.random() * 0.4;
        const x = Math.random() * s, y = Math.random() * s, r = 0.5 + Math.random() * 2.5;
        ctx.fillRect(x, y, r, r);
      }
      // Bold white quartz flecks
      for (let i = 0; i < 40; i++) {
        ctx.fillStyle = '#dddddd';
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.arc(Math.random() * s, Math.random() * s, 1 + Math.random() * 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }),
    bumpMap: makeBumpMap(256, (ctx, s) => {
      ctx.fillStyle = '#808080';
      ctx.fillRect(0, 0, s, s);
      for (let i = 0; i < 1000; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? '#606060' : '#a0a0a0';
        ctx.fillRect(Math.random() * s, Math.random() * s, 2, 2);
      }
    }),
  };
}

// ===== BOLD MARBLE — strong veins =====
export function makeMarbleTexture(): { map: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
  return {
    map: makeTexture(256, (ctx, s) => {
      ctx.fillStyle = '#f5f5f5';
      ctx.fillRect(0, 0, s, s);
      // Bold dark veins
      for (let i = 0; i < 6; i++) {
        ctx.strokeStyle = `rgba(60,60,80,${0.3 + Math.random() * 0.4})`;
        ctx.lineWidth = 2 + Math.random() * 4;
        ctx.beginPath();
        let x = Math.random() * s, y = Math.random() * s;
        ctx.moveTo(x, y);
        for (let j = 0; j < 30; j++) {
          x += (Math.random() - 0.5) * 25;
          y += (Math.random() - 0.5) * 25;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      // Gold accent veins
      for (let i = 0; i < 3; i++) {
        ctx.strokeStyle = `rgba(180,150,80,0.2)`;
        ctx.lineWidth = 1 + Math.random() * 2;
        ctx.beginPath();
        let x = Math.random() * s, y = Math.random() * s;
        ctx.moveTo(x, y);
        for (let j = 0; j < 20; j++) {
          x += (Math.random() - 0.5) * 30;
          y += (Math.random() - 0.5) * 30;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    }),
    bumpMap: makeBumpMap(256, (ctx, s) => {
      ctx.fillStyle = '#a0a0a0';
      ctx.fillRect(0, 0, s, s);
      for (let i = 0; i < 6; i++) {
        ctx.strokeStyle = '#606060';
        ctx.lineWidth = 3;
        ctx.beginPath();
        let x = Math.random() * s, y = Math.random() * s;
        ctx.moveTo(x, y);
        for (let j = 0; j < 20; j++) {
          x += (Math.random() - 0.5) * 25;
          y += (Math.random() - 0.5) * 25;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    }),
  };
}

// ===== BOLD PLASTER — visible texture noise =====
export function makePlasterTexture(baseColor = '#f5f0e6'): THREE.CanvasTexture {
  return makeTexture(128, (ctx, s) => {
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 800; i++) {
      const shade = Math.random() > 0.5 ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)';
      ctx.fillStyle = shade;
      ctx.fillRect(Math.random() * s, Math.random() * s, 3, 3);
    }
  });
}

// ===== BOLD CARPET — Chinese-style dragon pattern =====
export function makeCarpetTexture(baseColor = '#8b1a1a', patternColor = '#d4a020'): { map: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
  return {
    map: makeTexture(256, (ctx, s) => {
      ctx.fillStyle = baseColor;
      ctx.fillRect(0, 0, s, s);
      // Bold border
      ctx.strokeStyle = patternColor;
      ctx.lineWidth = 4;
      ctx.strokeRect(8, 8, s - 16, s - 16);
      ctx.lineWidth = 2;
      ctx.strokeRect(16, 16, s - 32, s - 32);
      // Diamond grid pattern (Chinese style)
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = patternColor;
      ctx.globalAlpha = 0.7;
      for (let x = 0; x < s; x += 32) {
        for (let y = 0; y < s; y += 32) {
          ctx.beginPath();
          ctx.moveTo(x + 16, y);
          ctx.lineTo(x + 32, y + 16);
          ctx.lineTo(x + 16, y + 32);
          ctx.lineTo(x, y + 16);
          ctx.closePath();
          ctx.stroke();
          // Center dot
          ctx.fillStyle = patternColor;
          ctx.beginPath();
          ctx.arc(x + 16, y + 16, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      // Corner flourishes
      ctx.globalAlpha = 1;
      [[20, 20], [s - 20, 20], [20, s - 20], [s - 20, s - 20]].forEach(([cx, cy]) => {
        ctx.fillStyle = patternColor;
        ctx.beginPath();
        ctx.arc(cx, cy, 5, 0, Math.PI * 2);
        ctx.fill();
      });
    }),
    bumpMap: makeBumpMap(256, (ctx, s) => {
      ctx.fillStyle = '#606060';
      ctx.fillRect(0, 0, s, s);
      // Carpet pile texture
      for (let i = 0; i < 2000; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? '#505050' : '#707070';
        ctx.fillRect(Math.random() * s, Math.random() * s, 1, 1);
      }
    }),
  };
}

// ===== BOLD WALLPAPER — Chinese floral pattern =====
export function makeWallpaperTexture(baseColor = '#f0e0c8', patternColor = '#c08040'): THREE.CanvasTexture {
  return makeTexture(128, (ctx, s) => {
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, s, s);
    // Bold floral medallions
    ctx.fillStyle = patternColor;
    ctx.globalAlpha = 0.5;
    for (let x = 16; x < s; x += 32) {
      for (let y = 16; y < s; y += 32) {
        // 8-petal flower
        for (let a = 0; a < 8; a++) {
          const ang = (a / 8) * Math.PI * 2;
          ctx.beginPath();
          ctx.ellipse(x + Math.cos(ang) * 6, y + Math.sin(ang) * 6, 4, 2, ang, 0, Math.PI * 2);
          ctx.fill();
        }
        // Center
        ctx.fillStyle = '#a06030';
        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = patternColor;
      }
    }
    // Connecting vines
    ctx.strokeStyle = patternColor;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.3;
    for (let x = 0; x < s; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.quadraticCurveTo(x + 16, 16, x + 32, 0);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  });
}

// ===== PAINTED CONCRETE (exterior walls) =====
export function makeConcreteTexture(baseColor = '#e5e0d5'): { map: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
  return {
    map: makeTexture(256, (ctx, s) => {
      ctx.fillStyle = baseColor;
      ctx.fillRect(0, 0, s, s);
      // Concrete texture — patches and stains
      for (let i = 0; i < 100; i++) {
        const shade = Math.random() > 0.5 ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.04)';
        ctx.fillStyle = shade;
        ctx.beginPath();
        ctx.arc(Math.random() * s, Math.random() * s, 5 + Math.random() * 20, 0, Math.PI * 2);
        ctx.fill();
      }
      // Water stains (vertical streaks)
      for (let i = 0; i < 8; i++) {
        const x = Math.random() * s;
        const grad = ctx.createLinearGradient(x, 0, x, s);
        grad.addColorStop(0, 'rgba(120,100,80,0)');
        grad.addColorStop(0.3, 'rgba(120,100,80,0.06)');
        grad.addColorStop(1, 'rgba(120,100,80,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(x - 5, 0, 10, s);
      }
    }),
    bumpMap: makeBumpMap(256, (ctx, s) => {
      ctx.fillStyle = '#808080';
      ctx.fillRect(0, 0, s, s);
      for (let i = 0; i < 500; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? '#707070' : '#909090';
        ctx.fillRect(Math.random() * s, Math.random() * s, 3, 3);
      }
    }),
  };
}

// ===== MOSAIC TILE (Chinese bathroom accent) =====
export function makeMosaicTexture(colors: string[] = ['#4a90c2', '#3a7090', '#5aa0d2', '#2a6080']): { map: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
  return {
    map: makeTexture(128, (ctx, s) => {
      ctx.fillStyle = '#333333';
      ctx.fillRect(0, 0, s, s);
      const ms = 8; // mosaic tile size
      for (let x = 0; x < s; x += ms) {
        for (let y = 0; y < s; y += ms) {
          ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
          ctx.fillRect(x + 1, y + 1, ms - 2, ms - 2);
          // Glossy highlight
          ctx.fillStyle = 'rgba(255,255,255,0.15)';
          ctx.fillRect(x + 1, y + 1, ms - 2, 2);
        }
      }
    }),
    bumpMap: makeBumpMap(128, (ctx, s) => {
      ctx.fillStyle = '#404040';
      ctx.fillRect(0, 0, s, s);
      ctx.fillStyle = '#c0c0c0';
      for (let x = 0; x < s; x += 8) {
        for (let y = 0; y < s; y += 8) {
          ctx.fillRect(x + 1, y + 1, 6, 6);
        }
      }
    }),
  };
}

// ===== STONE TEXTURE (for foundation/exterior base) =====
export function makeStoneTexture(): { map: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
  return {
    map: makeTexture(256, (ctx, s) => {
      ctx.fillStyle = '#6b6b5a';
      ctx.fillRect(0, 0, s, s);
      // Irregular stone blocks
      const blocks = [
        { x: 0, y: 0, w: 80, h: 50 }, { x: 80, y: 0, w: 90, h: 50 }, { x: 170, y: 0, w: 86, h: 50 },
        { x: 0, y: 50, w: 60, h: 55 }, { x: 60, y: 50, w: 100, h: 55 }, { x: 160, y: 50, w: 96, h: 55 },
        { x: 0, y: 105, w: 90, h: 50 }, { x: 90, y: 105, w: 80, h: 50 }, { x: 170, y: 105, w: 86, h: 50 },
        { x: 0, y: 155, w: 70, h: 55 }, { x: 70, y: 155, w: 90, h: 55 }, { x: 160, y: 155, w: 96, h: 55 },
        { x: 0, y: 210, w: 85, h: 46 }, { x: 85, y: 210, w: 95, h: 46 }, { x: 180, y: 210, w: 76, h: 46 },
      ];
      blocks.forEach(b => {
        const shade = 0.7 + Math.random() * 0.4;
        const r = 107 * shade, g = 107 * shade, bb = 90 * shade;
        ctx.fillStyle = `rgb(${r | 0},${g | 0},${bb | 0})`;
        ctx.fillRect(b.x + 2, b.y + 2, b.w - 4, b.h - 4);
        // Stone texture noise
        for (let i = 0; i < 10; i++) {
          ctx.fillStyle = `rgba(0,0,0,${0.05 + Math.random() * 0.15})`;
          ctx.fillRect(b.x + 2 + Math.random() * (b.w - 4), b.y + 2 + Math.random() * (b.h - 4), 3, 2);
        }
      });
    }),
    bumpMap: makeBumpMap(256, (ctx, s) => {
      ctx.fillStyle = '#404040';
      ctx.fillRect(0, 0, s, s);
      ctx.fillStyle = '#a0a0a0';
      const blocks = [
        { x: 0, y: 0, w: 80, h: 50 }, { x: 80, y: 0, w: 90, h: 50 }, { x: 170, y: 0, w: 86, h: 50 },
        { x: 0, y: 50, w: 60, h: 55 }, { x: 60, y: 50, w: 100, h: 55 }, { x: 160, y: 50, w: 96, h: 55 },
        { x: 0, y: 105, w: 90, h: 50 }, { x: 90, y: 105, w: 80, h: 50 }, { x: 170, y: 105, w: 86, h: 50 },
      ];
      blocks.forEach(b => {
        ctx.fillRect(b.x + 2, b.y + 2, b.w - 4, b.h - 4);
      });
    }),
  };
}

// ===== REFLECTIVE GLASS (windows) =====
export function makeGlassTexture(): THREE.CanvasTexture {
  return makeTexture(128, (ctx, s) => {
    // Blue-tinted reflective glass
    const grad = ctx.createLinearGradient(0, 0, s, s);
    grad.addColorStop(0, '#2a4a6a');
    grad.addColorStop(0.3, '#4a6a8a');
    grad.addColorStop(0.5, '#6a8aaa');
    grad.addColorStop(0.7, '#4a6a8a');
    grad.addColorStop(1, '#2a4a6a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, s, s);
    // Reflection streaks
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    for (let i = 0; i < 5; i++) {
      ctx.fillRect(Math.random() * s, 0, 2 + Math.random() * 3, s);
    }
    // Window frame cross
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(s / 2 - 1, 0, 2, s);
    ctx.fillRect(0, s / 2 - 1, s, 2);
  });
}

// ===== ROOF TILE (exterior) =====
export function makeRoofTileTexture(): THREE.CanvasTexture {
  return makeTexture(256, (ctx, s) => {
    ctx.fillStyle = '#555555';
    ctx.fillRect(0, 0, s, s);
    for (let row = 0; row < s / 16; row++) {
      const y = row * 16;
      ctx.fillStyle = '#6a6a6a';
      ctx.fillRect(0, y, s, 8);
      ctx.fillStyle = '#444444';
      ctx.fillRect(0, y + 8, s, 4);
      for (let col = 0; col < s / 32; col++) {
        ctx.fillStyle = '#333333';
        ctx.fillRect(col * 32 + (row % 2) * 16, y, 1, 12);
      }
    }
  });
}
