// ====================== GREAT PYRAMID OF GIZA ======================
// Detailed pyramid with limestone block textures, interior chambers,
// hieroglyphic walls, gold accents, surrounding desert + Sphinx.

import * as THREE from 'three';
import { addShadow } from './materials-dsl';

// ===== PYRAMID-SPECIFIC TEXTURES =====
function makeTexture(size: number, draw: (ctx: CanvasRenderingContext2D, s: number) => void): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  draw(ctx, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping; tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  return tex;
}
function makeBump(size: number, draw: (ctx: CanvasRenderingContext2D, s: number) => void): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  draw(ctx, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping; tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

// Limestone block texture (pyramid exterior) — HIGH CONTRAST, realistic
function makeLimestoneTexture(): { map: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
  return {
    map: makeTexture(256, (ctx, s) => {
      // Deep mortar background (dark shadow between blocks)
      ctx.fillStyle = '#3a2e18';
      ctx.fillRect(0, 0, s, s);
      const bw = 64, bh = 32, m = 3;
      for (let row = 0; row < s / bh + 1; row++) {
        const offset = (row % 2) * (bw / 2);
        for (let col = -1; col < s / bw + 2; col++) {
          const x = col * bw + offset + m, y = row * bh + m;
          // Block base with per-block variation
          const shade = 0.75 + Math.random() * 0.4;
          const r = 198 * shade, g = 178 * shade, b = 138 * shade;
          ctx.fillStyle = `rgb(${r | 0},${g | 0},${b | 0})`;
          ctx.fillRect(x, y, bw - m * 2, bh - m * 2);

          // Top highlight (sun catches the top edge of each block)
          const hlGrad = ctx.createLinearGradient(x, y, x, y + 6);
          hlGrad.addColorStop(0, `rgba(255,245,210,${0.3 + Math.random() * 0.2})`);
          hlGrad.addColorStop(1, 'transparent');
          ctx.fillStyle = hlGrad;
          ctx.fillRect(x, y, bw - m * 2, 6);

          // Bottom shadow (shadow under each block overhang)
          const shGrad = ctx.createLinearGradient(x, y + bh - m * 2 - 8, x, y + bh - m * 2);
          shGrad.addColorStop(0, 'transparent');
          shGrad.addColorStop(1, 'rgba(20,10,0,0.4)');
          ctx.fillStyle = shGrad;
          ctx.fillRect(x, y + bh - m * 2 - 8, bw - m * 2, 8);

          // Side shadows (left/right edges of each block)
          ctx.fillStyle = 'rgba(20,10,0,0.2)';
          ctx.fillRect(x, y, 2, bh - m * 2);
          ctx.fillRect(x + bw - m * 2 - 2, y, 2, bh - m * 2);

          // Weathering stains (dripping down from top)
          ctx.fillStyle = `rgba(110,85,40,${0.08 + Math.random() * 0.2})`;
          const stainX = x + Math.random() * (bw - m * 2);
          const stainH = 5 + Math.random() * (bh - m * 2 - 5);
          ctx.fillRect(stainX, y, 3 + Math.random() * 5, stainH);

          // Dark spots / biological growth
          if (Math.random() > 0.6) {
            ctx.fillStyle = `rgba(50,55,30,${0.15 + Math.random() * 0.2})`;
            ctx.beginPath();
            ctx.arc(x + Math.random() * (bw - m * 2), y + Math.random() * (bh - m * 2), 1 + Math.random() * 3, 0, Math.PI * 2);
            ctx.fill();
          }

          // Cracks (dark, jagged)
          if (Math.random() > 0.55) {
            ctx.strokeStyle = 'rgba(30,20,5,0.5)';
            ctx.lineWidth = 0.8 + Math.random() * 0.8;
            ctx.beginPath();
            let cx = x + Math.random() * (bw - m * 2);
            let cy = y;
            ctx.moveTo(cx, cy);
            for (let k = 0; k < 4; k++) {
              cx += (Math.random() - 0.5) * 12;
              cy += (bh - m * 2) / 4;
              ctx.lineTo(cx, cy);
            }
            ctx.stroke();
          }

          // Small surface texture noise
          for (let k = 0; k < 8; k++) {
            ctx.fillStyle = Math.random() > 0.5
              ? `rgba(255,235,200,${0.05 + Math.random() * 0.1})`
              : `rgba(60,40,15,${0.05 + Math.random() * 0.1})`;
            ctx.fillRect(x + Math.random() * (bw - m * 2), y + Math.random() * (bh - m * 2), 2, 1);
          }
        }
      }

      // Overall warm wash (Egyptian sun tint)
      ctx.fillStyle = 'rgba(255,200,100,0.04)';
      ctx.fillRect(0, 0, s, s);
    }),
    bumpMap: makeBump(256, (ctx, s) => {
      // Deep mortar (recessed)
      ctx.fillStyle = '#202020';
      ctx.fillRect(0, 0, s, s);
      const bw = 64, bh = 32, m = 3;
      for (let row = 0; row < s / bh + 1; row++) {
        const offset = (row % 2) * (bw / 2);
        for (let col = -1; col < s / bw + 2; col++) {
          const x = col * bw + offset + m, y = row * bh + m;
          // Block surface (raised)
          ctx.fillStyle = '#b0b0b0';
          ctx.fillRect(x, y, bw - m * 2, bh - m * 2);
          // Top edge extra raised (highlight)
          ctx.fillStyle = '#d0d0d0';
          ctx.fillRect(x, y, bw - m * 2, 3);
          // Bottom edge extra recessed (shadow)
          ctx.fillStyle = '#808080';
          ctx.fillRect(x, y + bh - m * 2 - 3, bw - m * 2, 3);
          // Surface bumps
          for (let k = 0; k < 5; k++) {
            ctx.fillStyle = Math.random() > 0.5 ? '#909090' : '#c0c0c0';
            ctx.fillRect(x + Math.random() * (bw - m * 2), y + Math.random() * (bh - m * 2), 3, 2);
          }
        }
      }
    }),
  };
}

// Hieroglyphics texture (interior chamber walls)
function makeHieroglyphTexture(): { map: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
  const symbols = ['☥', '👁', '𓂀', '𓃭', '𓅓', '𓆣', '𓈖', '𓊪', '𓋴', '𓏏', '◇', '◆', '⬡', '☉', '⊕'];
  return {
    map: makeTexture(256, (ctx, s) => {
      // Sandstone-gold background
      const grad = ctx.createLinearGradient(0, 0, 0, s);
      grad.addColorStop(0, '#d4a843');
      grad.addColorStop(0.5, '#c89830');
      grad.addColorStop(1, '#b88820');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, s, s);
      // Hieroglyph symbols in rows
      ctx.fillStyle = '#3a2a10';
      ctx.font = 'bold 20px serif';
      ctx.textAlign = 'center';
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          const sym = symbols[(row * 8 + col) % symbols.length];
          ctx.fillText(sym, col * 32 + 16, row * 32 + 24);
        }
      }
      // Gold accent border lines
      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 2;
      ctx.strokeRect(4, 4, s - 8, s - 8);
      ctx.lineWidth = 1;
      ctx.strokeRect(12, 12, s - 24, s - 24);
    }),
    bumpMap: makeBump(256, (ctx, s) => {
      ctx.fillStyle = '#808080';
      ctx.fillRect(0, 0, s, s);
      ctx.fillStyle = '#404040';
      ctx.font = 'bold 20px serif';
      ctx.textAlign = 'center';
      const symbols = ['☥', '👁', '◇', '◆', '⬡', '☉', '⊕', '○'];
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          ctx.fillText(symbols[(row * 8 + col) % symbols.length], col * 32 + 16, row * 32 + 24);
        }
      }
    }),
  };
}

// Gold leaf texture (sarcophagus, treasures)
function makeGoldTexture(): { map: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
  return {
    map: makeTexture(128, (ctx, s) => {
      ctx.fillStyle = '#ffd700';
      ctx.fillRect(0, 0, s, s);
      // Gold leaf pattern (overlapping flakes)
      for (let i = 0; i < 50; i++) {
        const shade = 0.8 + Math.random() * 0.3;
        ctx.fillStyle = `rgba(${255 * shade|0},${215 * shade|0},${0})`;
        ctx.beginPath();
        ctx.arc(Math.random() * s, Math.random() * s, 3 + Math.random() * 8, 0, Math.PI * 2);
        ctx.fill();
      }
      // Shine streaks
      ctx.fillStyle = 'rgba(255,255,200,0.2)';
      for (let i = 0; i < 5; i++) {
        ctx.fillRect(Math.random() * s, 0, 2, s);
      }
    }),
    bumpMap: makeBump(128, (ctx, s) => {
      ctx.fillStyle = '#a0a0a0';
      ctx.fillRect(0, 0, s, s);
      for (let i = 0; i < 50; i++) {
        ctx.fillStyle = '#808080';
        ctx.beginPath();
        ctx.arc(Math.random() * s, Math.random() * s, 3 + Math.random() * 8, 0, Math.PI * 2);
        ctx.fill();
      }
    }),
  };
}

// Basalt texture (chamber floors, dark stone)
function makeBasaltTexture(): { map: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
  return {
    map: makeTexture(128, (ctx, s) => {
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, s, s);
      for (let i = 0; i < 500; i++) {
        ctx.fillStyle = `rgba(${40 + Math.random() * 30|0},${40 + Math.random() * 30|0},${40 + Math.random() * 30|0},0.5)`;
        ctx.fillRect(Math.random() * s, Math.random() * s, 2, 2);
      }
      // Larger mineral veins
      for (let i = 0; i < 5; i++) {
        ctx.strokeStyle = 'rgba(80,70,60,0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        let x = Math.random() * s, y = Math.random() * s;
        ctx.moveTo(x, y);
        for (let j = 0; j < 10; j++) {
          x += (Math.random() - 0.5) * 30;
          y += (Math.random() - 0.5) * 30;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    }),
    bumpMap: makeBump(128, (ctx, s) => {
      ctx.fillStyle = '#808080';
      ctx.fillRect(0, 0, s, s);
      for (let i = 0; i < 300; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? '#707070' : '#909090';
        ctx.fillRect(Math.random() * s, Math.random() * s, 2, 2);
      }
    }),
  };
}

// Desert sand texture
function makeSandTexture(): { map: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
  return {
    map: makeTexture(256, (ctx, s) => {
      ctx.fillStyle = '#e8d5a8';
      ctx.fillRect(0, 0, s, s);
      // Sand ripples
      for (let i = 0; i < 20; i++) {
        ctx.strokeStyle = `rgba(200,180,130,${0.1 + Math.random() * 0.2})`;
        ctx.lineWidth = 1 + Math.random() * 2;
        ctx.beginPath();
        const y = (i / 20) * s;
        ctx.moveTo(0, y);
        for (let x = 0; x < s; x += 10) {
          ctx.lineTo(x, y + Math.sin(x * 0.1 + i) * 3);
        }
        ctx.stroke();
      }
      // Sand grain noise
      for (let i = 0; i < 1000; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? 'rgba(180,160,110,0.15)' : 'rgba(240,220,180,0.15)';
        ctx.fillRect(Math.random() * s, Math.random() * s, 1, 1);
      }
    }),
    bumpMap: makeBump(256, (ctx, s) => {
      ctx.fillStyle = '#808080';
      ctx.fillRect(0, 0, s, s);
      for (let i = 0; i < 20; i++) {
        ctx.strokeStyle = '#606060';
        ctx.lineWidth = 2;
        ctx.beginPath();
        const y = (i / 20) * s;
        ctx.moveTo(0, y);
        for (let x = 0; x < s; x += 10) {
          ctx.lineTo(x, y + Math.sin(x * 0.1 + i) * 3);
        }
        ctx.stroke();
      }
    }),
  };
}

// Granite texture (King's Chamber walls)
function makeGraniteTexture(): { map: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
  return {
    map: makeTexture(256, (ctx, s) => {
      ctx.fillStyle = '#6b3a2a';
      ctx.fillRect(0, 0, s, s);
      const colors = ['#5a2a1a', '#7a4a3a', '#8b5a4a', '#4a2010', '#9b6a5a', '#3a1510'];
      for (let i = 0; i < 4000; i++) {
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        ctx.globalAlpha = 0.3 + Math.random() * 0.4;
        ctx.fillRect(Math.random() * s, Math.random() * s, 1 + Math.random() * 2, 1 + Math.random() * 2);
      }
      // White quartz veins
      for (let i = 0; i < 8; i++) {
        ctx.strokeStyle = 'rgba(200,200,200,0.3)';
        ctx.lineWidth = 1 + Math.random() * 2;
        ctx.beginPath();
        let x = Math.random() * s, y = Math.random() * s;
        ctx.moveTo(x, y);
        for (let j = 0; j < 15; j++) {
          x += (Math.random() - 0.5) * 25;
          y += (Math.random() - 0.5) * 25;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }),
    bumpMap: makeBump(256, (ctx, s) => {
      ctx.fillStyle = '#808080';
      ctx.fillRect(0, 0, s, s);
      for (let i = 0; i < 2000; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? '#606060' : '#a0a0a0';
        ctx.fillRect(Math.random() * s, Math.random() * s, 2, 2);
      }
    }),
  };
}

// Weathered aged limestone (darker, more eroded — for lower pyramid layers)
function makeWeatheredLimestoneTexture(): { map: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
  return {
    map: makeTexture(256, (ctx, s) => {
      // Very dark mortar (deep shadows between eroded blocks)
      ctx.fillStyle = '#2a1e08';
      ctx.fillRect(0, 0, s, s);
      const bw = 64, bh = 32, m = 3;
      for (let row = 0; row < s / bh + 1; row++) {
        const offset = (row % 2) * (bw / 2);
        for (let col = -1; col < s / bw + 2; col++) {
          const x = col * bw + offset + m, y = row * bh + m;
          // Darker, more weathered blocks
          const shade = 0.55 + Math.random() * 0.35;
          const r = 168 * shade, g = 148 * shade, b = 112 * shade;
          ctx.fillStyle = `rgb(${r | 0},${g | 0},${b | 0})`;
          ctx.fillRect(x, y, bw - m * 2, bh - m * 2);

          // Top highlight (weak — weathered surface doesn't catch much light)
          const hlGrad = ctx.createLinearGradient(x, y, x, y + 4);
          hlGrad.addColorStop(0, 'rgba(200,180,140,0.2)');
          hlGrad.addColorStop(1, 'transparent');
          ctx.fillStyle = hlGrad;
          ctx.fillRect(x, y, bw - m * 2, 4);

          // Heavy bottom shadow
          const shGrad = ctx.createLinearGradient(x, y + bh - m * 2 - 8, x, y + bh - m * 2);
          shGrad.addColorStop(0, 'transparent');
          shGrad.addColorStop(1, 'rgba(10,5,0,0.5)');
          ctx.fillStyle = shGrad;
          ctx.fillRect(x, y + bh - m * 2 - 8, bw - m * 2, 8);

          // Side shadows
          ctx.fillStyle = 'rgba(10,5,0,0.3)';
          ctx.fillRect(x, y, 3, bh - m * 2);
          ctx.fillRect(x + bw - m * 2 - 3, y, 3, bh - m * 2);

          // Heavy erosion stains (dripping down)
          ctx.fillStyle = `rgba(70,50,20,${0.15 + Math.random() * 0.3})`;
          for (let k = 0; k < 4; k++) {
            const sx = x + Math.random() * (bw - m * 2);
            const sh = 5 + Math.random() * (bh - m * 2 - 5);
            ctx.fillRect(sx, y, 4 + Math.random() * 6, sh);
          }

          // Deep cracks (jagged, dark)
          if (Math.random() > 0.4) {
            ctx.strokeStyle = 'rgba(20,10,0,0.6)';
            ctx.lineWidth = 1 + Math.random();
            ctx.beginPath();
            let cx = x + Math.random() * (bw - m * 2), cy = y;
            ctx.moveTo(cx, cy);
            for (let k = 0; k < 5; k++) {
              cx += (Math.random() - 0.5) * 14;
              cy += (bh - m * 2) / 5;
              ctx.lineTo(cx, cy);
            }
            ctx.stroke();
          }

          // Missing chunks (dark holes — erosion damage)
          if (Math.random() > 0.6) {
            ctx.fillStyle = 'rgba(15,8,0,0.7)';
            ctx.beginPath();
            ctx.arc(x + Math.random() * (bw - m * 2), y + Math.random() * (bh - m * 2), 2 + Math.random() * 5, 0, Math.PI * 2);
            ctx.fill();
          }

          // Biological growth (dark green/black patches)
          if (Math.random() > 0.5) {
            ctx.fillStyle = `rgba(35,45,20,${0.15 + Math.random() * 0.25})`;
            ctx.beginPath();
            ctx.arc(x + Math.random() * (bw - m * 2), y + Math.random() * (bh - m * 2), 2 + Math.random() * 4, 0, Math.PI * 2);
            ctx.fill();
          }

          // Surface roughness noise
          for (let k = 0; k < 10; k++) {
            ctx.fillStyle = Math.random() > 0.5
              ? `rgba(180,160,120,${0.06 + Math.random() * 0.1})`
              : `rgba(40,25,5,${0.06 + Math.random() * 0.1})`;
            ctx.fillRect(x + Math.random() * (bw - m * 2), y + Math.random() * (bh - m * 2), 2, 1);
          }
        }
      }
      // Overall dark weathering wash
      ctx.fillStyle = 'rgba(60,40,15,0.06)';
      ctx.fillRect(0, 0, s, s);
    }),
    bumpMap: makeBump(256, (ctx, s) => {
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, s, s);
      const bw = 64, bh = 32, m = 3;
      for (let row = 0; row < s / bh + 1; row++) {
        const offset = (row % 2) * (bw / 2);
        for (let col = -1; col < s / bw + 2; col++) {
          const x = col * bw + offset + m, y = row * bh + m;
          // Block surface (less raised = more eroded)
          ctx.fillStyle = '#909090';
          ctx.fillRect(x, y, bw - m * 2, bh - m * 2);
          // Top edge slightly raised
          ctx.fillStyle = '#a0a0a0';
          ctx.fillRect(x, y, bw - m * 2, 2);
          // Bottom heavily recessed
          ctx.fillStyle = '#606060';
          ctx.fillRect(x, y + bh - m * 2 - 4, bw - m * 2, 4);
        }
      }
      // Erosion pits (deep)
      for (let i = 0; i < 40; i++) {
        ctx.fillStyle = '#202020';
        ctx.beginPath();
        ctx.arc(Math.random() * s, Math.random() * s, 2 + Math.random() * 6, 0, Math.PI * 2);
        ctx.fill();
      }
      // Surface roughness
      for (let i = 0; i < 200; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? '#707070' : '#a0a0a0';
        ctx.fillRect(Math.random() * s, Math.random() * s, 2, 1);
      }
    }),
  };
}

// Painted Egyptian mural (colorful wall paintings — for chamber walls)
function makeMuralTexture(): { map: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
  return {
    map: makeTexture(256, (ctx, s) => {
      // plaster background
      ctx.fillStyle = '#e8d8a8';
      ctx.fillRect(0, 0, s, s);
      // Painted figures (simplified Egyptian art style)
      // Scene 1: Pharaoh figure (left side)
      ctx.fillStyle = '#c87030'; // orange-brown skin
      ctx.fillRect(20, 60, 8, 50); // body
      ctx.beginPath(); ctx.arc(24, 50, 8, 0, Math.PI * 2); ctx.fill(); // head
      ctx.fillStyle = '#d4a020'; // gold crown
      ctx.fillRect(16, 42, 16, 6);
      ctx.fillStyle = '#ffffff'; // white kilt
      ctx.fillRect(20, 85, 8, 15);
      // Staff
      ctx.fillStyle = '#5a3a10';
      ctx.fillRect(34, 40, 2, 70);
      ctx.fillStyle = '#d4a020';
      ctx.beginPath(); ctx.arc(35, 38, 4, 0, Math.PI * 2); ctx.fill();

      // Scene 2: Anubis (jackal god, right side)
      ctx.fillStyle = '#1a1a1a'; // black jackal head
      ctx.fillRect(180, 55, 15, 25);
      ctx.beginPath(); ctx.arc(187, 52, 8, 0, Math.PI * 2); ctx.fill();
      // Snout
      ctx.fillRect(193, 55, 10, 6);
      // Body
      ctx.fillStyle = '#c87030';
      ctx.fillRect(182, 80, 12, 35);
      // Gold collar
      ctx.fillStyle = '#d4a020';
      ctx.fillRect(180, 78, 16, 4);

      // Scene 3: Eye of Horus (center top)
      ctx.strokeStyle = '#1a1a1a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(128, 30, 12, 0, Math.PI);
      ctx.stroke();
      ctx.fillStyle = '#1a4a8a'; // blue iris
      ctx.beginPath(); ctx.arc(128, 30, 5, 0, Math.PI * 2); ctx.fill();
      // Eye makeup lines
      ctx.strokeStyle = '#1a1a1a';
      ctx.beginPath();
      ctx.moveTo(116, 30); ctx.lineTo(110, 25);
      ctx.moveTo(140, 30); ctx.lineTo(146, 28);
      ctx.moveTo(128, 42); ctx.lineTo(128, 48);
      ctx.moveTo(128, 42); ctx.lineTo(122, 45);
      ctx.stroke();

      // Scene 4: Scarab beetle (center bottom)
      ctx.fillStyle = '#2a7a3a'; // green-blue body
      ctx.beginPath(); ctx.ellipse(128, 200, 15, 10, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#d4a020'; // gold head
      ctx.beginPath(); ctx.arc(128, 190, 5, 0, Math.PI * 2); ctx.fill();
      // Legs
      ctx.strokeStyle = '#1a1a1a';
      ctx.lineWidth = 1.5;
      for (let a = -1; a <= 1; a++) {
        ctx.beginPath();
        ctx.moveTo(128 + a * 10, 195);
        ctx.lineTo(128 + a * 18, 185 + a * 3);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(128 + a * 10, 200);
        ctx.lineTo(128 + a * 18, 200 + a * 3);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(128 + a * 10, 205);
        ctx.lineTo(128 + a * 18, 215 + a * 3);
        ctx.stroke();
      }

      // Decorative borders (top and bottom)
      ctx.fillStyle = '#1a4a8a';
      ctx.fillRect(0, 0, s, 8);
      ctx.fillRect(0, s - 8, s, 8);
      // Border pattern (alternating diamonds)
      ctx.fillStyle = '#d4a020';
      for (let i = 0; i < s; i += 16) {
        ctx.save();
        ctx.translate(i + 8, 4);
        ctx.rotate(Math.PI / 4);
        ctx.fillRect(-3, -3, 6, 6);
        ctx.restore();
        ctx.save();
        ctx.translate(i + 8, s - 4);
        ctx.rotate(Math.PI / 4);
        ctx.fillRect(-3, -3, 6, 6);
        ctx.restore();
      }

      // Vertical text columns (hieroglyphs between scenes)
      ctx.fillStyle = '#1a4a8a';
      ctx.font = 'bold 12px serif';
      ctx.textAlign = 'center';
      const glyphs = ['☥', '𓂀', '☉', '◇', '𓃭', '𓅓'];
      for (let col = 0; col < 3; col++) {
        for (let row = 0; row < 6; row++) {
          ctx.fillText(glyphs[(row + col) % glyphs.length], 70 + col * 50, 20 + row * 20);
        }
      }
    }),
    bumpMap: makeBump(256, (ctx, s) => {
      ctx.fillStyle = '#909090';
      ctx.fillRect(0, 0, s, s);
      // Painted areas are slightly raised
      ctx.fillStyle = '#a0a0a0';
      ctx.fillRect(20, 40, 20, 80);  // pharaoh
      ctx.fillRect(175, 40, 25, 80); // anubis
      ctx.beginPath(); ctx.arc(128, 30, 12, 0, Math.PI); ctx.fill(); // eye
      ctx.beginPath(); ctx.ellipse(128, 200, 15, 10, 0, 0, Math.PI * 2); ctx.fill(); // scarab
      // Borders
      ctx.fillStyle = '#b0b0b0';
      ctx.fillRect(0, 0, s, 8);
      ctx.fillRect(0, s - 8, s, 8);
    }),
  };
}

// Alabaster texture (translucent white stone — Queen's chamber walls)
function makeAlabasterTexture(): { map: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
  return {
    map: makeTexture(256, (ctx, s) => {
      ctx.fillStyle = '#f0ead8';
      ctx.fillRect(0, 0, s, s);
      // Veining (translucent bands)
      for (let i = 0; i < 15; i++) {
        ctx.strokeStyle = `rgba(200,190,160,${0.2 + Math.random() * 0.3})`;
        ctx.lineWidth = 1 + Math.random() * 3;
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
      // Soft cloud-like patches
      for (let i = 0; i < 20; i++) {
        const grad = ctx.createRadialGradient(Math.random() * s, Math.random() * s, 0, Math.random() * s, Math.random() * s, 20 + Math.random() * 30);
        grad.addColorStop(0, 'rgba(220,210,180,0.2)');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, s, s);
      }
    }),
    bumpMap: makeBump(256, (ctx, s) => {
      ctx.fillStyle = '#909090';
      ctx.fillRect(0, 0, s, s);
      for (let i = 0; i < 10; i++) {
        ctx.strokeStyle = '#808080';
        ctx.lineWidth = 2;
        ctx.beginPath();
        let x = Math.random() * s, y = Math.random() * s;
        ctx.moveTo(x, y);
        for (let j = 0; j < 15; j++) {
          x += (Math.random() - 0.5) * 30;
          y += (Math.random() - 0.5) * 30;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    }),
  };
}

// Mudbrick texture (for surrounding workers' buildings)
function makeMudbrickTexture(): { map: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
  return {
    map: makeTexture(256, (ctx, s) => {
      ctx.fillStyle = '#9a7848';
      ctx.fillRect(0, 0, s, s);
      const bw = 32, bh = 16, m = 1.5;
      for (let row = 0; row < s / bh + 1; row++) {
        const offset = (row % 2) * (bw / 2);
        for (let col = -1; col < s / bw + 2; col++) {
          const x = col * bw + offset + m, y = row * bh + m;
          const shade = 0.75 + Math.random() * 0.4;
          const r = 154 * shade, g = 120 * shade, b = 72 * shade;
          ctx.fillStyle = `rgb(${r | 0},${g | 0},${b | 0})`;
          ctx.fillRect(x, y, bw - m * 2, bh - m * 2);
          // Straw / chaff marks in mudbrick
          ctx.fillStyle = `rgba(60,40,15,${0.08 + Math.random() * 0.12})`;
          for (let k = 0; k < 3; k++) {
            ctx.fillRect(x + Math.random() * (bw - m * 2), y + Math.random() * (bh - m * 2), 4 + Math.random() * 6, 1);
          }
        }
      }
      // Overall weathering wash
      ctx.fillStyle = 'rgba(80,60,30,0.08)';
      ctx.fillRect(0, 0, s, s);
    }),
    bumpMap: makeBump(256, (ctx, s) => {
      ctx.fillStyle = '#404040';
      ctx.fillRect(0, 0, s, s);
      ctx.fillStyle = '#a0a0a0';
      const bw = 32, bh = 16, m = 1.5;
      for (let row = 0; row < s / bh + 1; row++) {
        const offset = (row % 2) * (bw / 2);
        for (let col = -1; col < s / bw + 2; col++) {
          ctx.fillRect(col * bw + offset + m, row * bh + m, bw - m * 2, bh - m * 2);
        }
      }
    }),
  };
}

// Papyrus scroll texture (for wall niches / document scenes)
function makePapyrusTexture(): THREE.CanvasTexture {
  return makeTexture(256, (ctx, s) => {
    // Papyrus base (warm beige with fiber lines)
    ctx.fillStyle = '#e8d8a0';
    ctx.fillRect(0, 0, s, s);
    // Horizontal fiber strips (papyrus is made of overlapping strips)
    for (let y = 0; y < s; y += 12) {
      const shade = 0.85 + Math.random() * 0.25;
      ctx.fillStyle = `rgba(180,160,100,${0.1 + Math.random() * 0.1})`;
      ctx.fillRect(0, y, s, 12);
      // Fiber lines within each strip
      ctx.strokeStyle = `rgba(160,140,80,${0.1 + Math.random() * 0.15})`;
      ctx.lineWidth = 0.5;
      for (let k = 0; k < 3; k++) {
        ctx.beginPath();
        ctx.moveTo(0, y + 3 + k * 3);
        ctx.lineTo(s, y + 3 + k * 3);
        ctx.stroke();
      }
    }
    // Ink hieroglyphs (dark, brush-stroke style)
    ctx.fillStyle = '#1a1a2a';
    ctx.font = 'bold 16px serif';
    ctx.textAlign = 'center';
    const glyphs = ['☥', '𓂀', '𓃭', '𓅓', '𓆣', '𓈖', '𓊪', '𓋴', '◇', '☉'];
    for (let row = 0; row < 12; row++) {
      for (let col = 0; col < 12; col++) {
        if (Math.random() > 0.3) {
          ctx.fillText(glyphs[Math.floor(Math.random() * glyphs.length)], col * 20 + 10, row * 20 + 16);
        }
      }
    }
    // Aging stains
    for (let i = 0; i < 10; i++) {
      const grad = ctx.createRadialGradient(Math.random() * s, Math.random() * s, 0, Math.random() * s, Math.random() * s, 20 + Math.random() * 30);
      grad.addColorStop(0, 'rgba(120,80,30,0.15)');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, s, s);
    }
  });
}

// ===== BUILD PYRAMID =====
export function createPyramidGeometry(): THREE.Group {
  const root = new THREE.Group();

  // Materials
  // ===== NON-UNIFORM TEXTURE SYSTEM =====
  // Create 4 variants of limestone + 3 variants of weathered limestone
  // Each layer gets a RANDOM variant with RANDOM UV offset and slightly different repeat
  // This breaks up the repetitive tiling pattern

  const limestoneVariants: { map: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture }[] = [];
  for (let v = 0; v < 4; v++) {
    const tex = makeLimestoneTexture();
    limestoneVariants.push(tex);
  }

  const weatheredVariants: { map: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture }[] = [];
  for (let v = 0; v < 3; v++) {
    const tex = makeWeatheredLimestoneTexture();
    weatheredVariants.push(tex);
  }

  // Helper: create a unique material for a specific layer/face
  // Each call clones a texture variant with a unique offset and repeat
  const makeLayerMaterial = (layerIdx: number, faceIdx: number, isWeathered: boolean): THREE.MeshStandardMaterial => {
    const variants = isWeathered ? weatheredVariants : limestoneVariants;
    // Use Math.abs to ensure positive index (avoid negative modulo)
    const variantIdx = Math.abs(layerIdx * 7 + faceIdx * 13 + Math.floor(Math.random() * 100)) % variants.length;
    const src = variants[variantIdx];

    // Clone textures so each face gets unique UVs
    const mapClone = src.map.clone();
    const bumpClone = src.bumpMap.clone();
    mapClone.needsUpdate = true;
    bumpClone.needsUpdate = true;

    // Random repeat (slightly different per layer — breaks uniformity)
    const repX = 4 + Math.floor(Math.random() * 5); // 4-8
    const repY = 3 + Math.floor(Math.random() * 4); // 3-6
    mapClone.repeat.set(repX, repY);
    bumpClone.repeat.set(repX, repY);

    // Random UV offset (shifts the pattern so it doesn't align between layers)
    mapClone.offset.set(Math.random(), Math.random());
    bumpClone.offset.set(mapClone.offset.x, mapClone.offset.y);

    // Slightly different bump scale per layer
    const bumpScale = isWeathered ? 0.15 + Math.random() * 0.1 : 0.1 + Math.random() * 0.1;

    // Slightly different roughness per layer
    const roughness = isWeathered ? 0.85 + Math.random() * 0.1 : 0.75 + Math.random() * 0.15;

    return new THREE.MeshStandardMaterial({
      map: mapClone,
      bumpMap: bumpClone,
      bumpScale,
      metalness: 0.0,
      roughness,
    });
  };

  // Keep a single pyramidMat for the solid core (interior, not visible)
  const pyramidMat = new THREE.MeshStandardMaterial({
    color: 0xc4b896, roughness: 0.85,
  });

  // Painted mural for King's Chamber walls
  const mural = makeMuralTexture();
  mural.map.repeat.set(3, 2);
  mural.bumpMap.repeat.set(3, 2);
  const muralMat = new THREE.MeshStandardMaterial({
    map: mural.map, bumpMap: mural.bumpMap, bumpScale: 0.08,
    metalness: 0.05, roughness: 0.5,
  });

  // Alabaster for Queen's Chamber walls
  const alabaster = makeAlabasterTexture();
  alabaster.map.repeat.set(3, 2);
  alabaster.bumpMap.repeat.set(3, 2);
  const alabasterMat = new THREE.MeshStandardMaterial({
    map: alabaster.map, bumpMap: alabaster.bumpMap, bumpScale: 0.05,
    metalness: 0.1, roughness: 0.3,
    transparent: true, opacity: 0.85,
  });

  // Mudbrick for surrounding workers' buildings
  const mudbrick = makeMudbrickTexture();
  mudbrick.map.repeat.set(4, 4);
  mudbrick.bumpMap.repeat.set(4, 4);
  const mudbrickMat = new THREE.MeshStandardMaterial({
    map: mudbrick.map, bumpMap: mudbrick.bumpMap, bumpScale: 0.12,
    metalness: 0.0, roughness: 0.9,
  });

  // Papyrus scroll texture for wall niches
  const papyrusTex = makePapyrusTexture();
  papyrusTex.repeat.set(1, 1);
  const papyrusMat = new THREE.MeshStandardMaterial({
    map: papyrusTex, metalness: 0.0, roughness: 0.7,
  });

  const hieroglyph = makeHieroglyphTexture();
  hieroglyph.map.repeat.set(4, 3);
  hieroglyph.bumpMap.repeat.set(4, 3);
  const hieroMat = new THREE.MeshStandardMaterial({
    map: hieroglyph.map, bumpMap: hieroglyph.bumpMap, bumpScale: 0.1,
    metalness: 0.2, roughness: 0.5,
  });

  const gold = makeGoldTexture();
  gold.map.repeat.set(2, 2);
  gold.bumpMap.repeat.set(2, 2);
  const goldMat = new THREE.MeshStandardMaterial({
    map: gold.map, bumpMap: gold.bumpMap, bumpScale: 0.05,
    metalness: 0.95, roughness: 0.1,
  });

  const basalt = makeBasaltTexture();
  basalt.map.repeat.set(4, 4);
  basalt.bumpMap.repeat.set(4, 4);
  const basaltMat = new THREE.MeshStandardMaterial({
    map: basalt.map, bumpMap: basalt.bumpMap, bumpScale: 0.08,
    metalness: 0.3, roughness: 0.5,
  });

  const sand = makeSandTexture();
  sand.map.repeat.set(20, 20);
  sand.bumpMap.repeat.set(20, 20);
  const sandMat = new THREE.MeshStandardMaterial({
    map: sand.map, bumpMap: sand.bumpMap, bumpScale: 0.1,
    metalness: 0.0, roughness: 0.95,
  });

  const graniteTex = makeGraniteTexture();
  graniteTex.map.repeat.set(3, 3);
  graniteTex.bumpMap.repeat.set(3, 3);
  const graniteMat = new THREE.MeshStandardMaterial({
    map: graniteTex.map, bumpMap: graniteTex.bumpMap, bumpScale: 0.08,
    metalness: 0.1, roughness: 0.6,
  });

  const darkStone = new THREE.MeshStandardMaterial({ color: 0x3a2a1a, roughness: 0.7 });
  const torchMat = new THREE.MeshStandardMaterial({ color: 0xff6600, emissive: 0xff4400, emissiveIntensity: 0.8 });

  // ============================================================
  // DESERT GROUND
  // ============================================================
  const desert = addShadow(new THREE.Mesh(
    new THREE.CircleGeometry(600, 64), sandMat
  ));
  desert.rotation.x = -Math.PI / 2;
  desert.position.y = 0;
  root.add(desert);

  // Sand dunes (low mounds around the pyramid)
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const dist = 250 + Math.random() * 100;
    const dune = addShadow(new THREE.Mesh(
      new THREE.SphereGeometry(40 + Math.random() * 30, 16, 8, 0, Math.PI * 2, 0, Math.PI / 3),
      sandMat
    ));
    dune.position.set(Math.cos(angle) * dist, -10, Math.sin(angle) * dist);
    root.add(dune);
  }

  // ============================================================
  // GREAT PYRAMID (main structure)
  // ============================================================
  const baseSize = 280;  // 280 units = ~230m at real scale
  const pyramidHeight = 180;

  // Build pyramid from stacked block layers (visible texture on each face)
  const layers = 40;
  for (let i = 0; i < layers; i++) {
    const t = i / layers;
    const layerSize = baseSize * (1 - t);
    const layerH = pyramidHeight / layers;
    const layerY = i * layerH + layerH / 2;

    // 4 sloped faces per layer (using thin boxes angled inward)
    const angle = Math.atan2(pyramidHeight, baseSize / 2);

    [0, 1, 2, 3].forEach((face) => {
      const faceAngle = (face / 4) * Math.PI * 2;
      const faceWidth = layerSize * Math.SQRT2; // diagonal width
      // Lower 1/3 uses weathered limestone, upper 2/3 uses normal limestone
      const useWeathered = i < layers / 3;
      // Each layer+face gets a UNIQUE material with random variant, offset, and repeat
      const layerMaterial = makeLayerMaterial(i, face, useWeathered);
      const faceMesh = addShadow(new THREE.Mesh(
        new THREE.BoxGeometry(faceWidth, layerH * 1.5, 2),
        layerMaterial
      ));
      // Position at the edge of this layer
      const edgeDist = layerSize / 2;
      faceMesh.position.set(
        Math.cos(faceAngle) * edgeDist,
        layerY,
        Math.sin(faceAngle) * edgeDist
      );
      faceMesh.rotation.y = faceAngle + Math.PI / 2;
      faceMesh.rotation.z = 0;
      // Tilt to match pyramid slope
      const dir = new THREE.Vector3(Math.cos(faceAngle), 0, Math.sin(faceAngle));
      faceMesh.lookAt(faceMesh.position.x + dir.x, faceMesh.position.y + layerH * 0.8, faceMesh.position.z + dir.z);
      root.add(faceMesh);
    });
  }

  // Solid pyramid core (for collision/walk mode)
  const pyramidCore = addShadow(new THREE.Mesh(
    new THREE.ConeGeometry(baseSize / 2 * Math.SQRT2, pyramidHeight, 4, 1),
    pyramidMat
  ));
  pyramidCore.position.y = pyramidHeight / 2;
  pyramidCore.rotation.y = Math.PI / 4;
  root.add(pyramidCore);

  // Gold capstone (pyramidion)
  const capstone = addShadow(new THREE.Mesh(
    new THREE.ConeGeometry(8, 15, 4), goldMat
  ));
  capstone.position.y = pyramidHeight + 7;
  capstone.rotation.y = Math.PI / 4;
  root.add(capstone);

  // Capstone glow
  const capGlow = new THREE.PointLight(0xffd700, 1.0, 100, 2);
  capGlow.position.y = pyramidHeight + 15;
  root.add(capGlow);

  // ============================================================
  // ENTRANCE (north face, slightly above ground)
  // ============================================================
  const entranceH = 15, entranceW = 12;
  const entrance = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(entranceW, entranceH, 8), darkStone
  ));
  entrance.position.set(0, entranceH / 2 + 5, -baseSize / 2 + 4);
  root.add(entrance);
  // Entrance frame (limestone)
  const entFrame = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(entranceW + 4, entranceH + 4, 6), pyramidMat
  ));
  entFrame.position.set(0, entranceH / 2 + 5, -baseSize / 2 + 2);
  root.add(entFrame);

  // ============================================================
  // INTERIOR — DESCENDING PASSAGE
  // ============================================================
  const passageGroup = new THREE.Group();
  passageGroup.position.set(0, 0, -baseSize / 2 + 8);

  // Descending passage (slopes down into bedrock)
  const descPassage = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(8, 6, 60), darkStone
  ));
  descPassage.position.set(0, -15, 30);
  descPassage.rotation.x = -0.27; // ~15 degree slope
  passageGroup.add(descPassage);

  // Subterranean chamber (below pyramid)
  const subChamber = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(40, 25, 30), basaltMat
  ));
  subChamber.position.set(0, -45, 55);
  passageGroup.add(subChamber);
  // Chamber hollow (darker interior)
  const subHollow = new THREE.Mesh(
    new THREE.BoxGeometry(36, 20, 26),
    new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.8 })
  );
  subHollow.position.set(0, -45, 55);
  passageGroup.add(subHollow);

  // ============================================================
  // ASCENDING PASSAGE + GRAND GALLERY
  // ============================================================
  // Ascending passage
  const ascPassage = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(8, 6, 50), darkStone
  ));
  ascPassage.position.set(0, 20, 15);
  ascPassage.rotation.x = 0.43; // ~25 degree slope up
  passageGroup.add(ascPassage);

  // Grand Gallery (tall corbelled passage)
  const gallery = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(8, 40, 50), hieroMat
  ));
  gallery.position.set(0, 50, 50);
  passageGroup.add(gallery);

  // Gallery side benches (shelf on each side)
  [-1, 1].forEach((s) => {
    const shelf = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(3, 8, 45), hieroMat
    ));
    shelf.position.set(s * 4, 44, 50);
    passageGroup.add(shelf);
  });

  // Torches on gallery walls (glowing)
  [35, 50, 65].forEach((z) => {
    [-1, 1].forEach((s) => {
      const torch = addShadow(new THREE.Mesh(
        new THREE.CylinderGeometry(0.5, 0.5, 4, 8), torchMat
      ));
      torch.position.set(s * 3, 55, z);
      passageGroup.add(torch);
      // Torch flame
      const flame = addShadow(new THREE.Mesh(
        new THREE.ConeGeometry(1.5, 3, 8), torchMat
      ));
      flame.position.set(s * 3, 58, z);
      passageGroup.add(flame);
      // Torch light
      const tLight = new THREE.PointLight(0xff6600, 0.5, 40, 2);
      tLight.position.set(s * 3, 58, z);
      passageGroup.add(tLight);
    });
  });

  // ============================================================
  // KING'S CHAMBER (granite walls, sarcophagus)
  // ============================================================
  const kingChamber = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(50, 30, 20), graniteMat
  ));
  kingChamber.position.set(0, 70, 75);
  passageGroup.add(kingChamber);

  // Chamber interior (hollow with hieroglyph walls)
  const kingInterior = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(46, 26, 16), muralMat
  ));
  kingInterior.position.set(0, 70, 75);
  passageGroup.add(kingInterior);

  // Sarcophagus (gold)
  const sarcophagus = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(12, 10, 6), goldMat
  ));
  sarcophagus.position.set(0, 62, 75);
  passageGroup.add(sarcophagus);
  // Sarcophagus lid
  const sarcLid = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(13, 2, 7), goldMat
  ));
  sarcLid.position.set(0, 68, 75);
  passageGroup.add(sarcLid);

  // Gold treasures around sarcophagus
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const treasure = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(3, 2, 3), goldMat
    ));
    treasure.position.set(Math.cos(angle) * 10, 60, 75 + Math.sin(angle) * 8);
    passageGroup.add(treasure);
  }

  // King's Chamber light (torch-lit warm glow)
  const kingLight = new THREE.PointLight(0xff8800, 0.6, 60, 2);
  kingLight.position.set(0, 75, 75);
  passageGroup.add(kingLight);

  // ============================================================
  // QUEEN'S CHAMBER (smaller, hieroglyph walls)
  // ============================================================
  const queenChamber = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(30, 20, 15), alabasterMat
  ));
  queenChamber.position.set(0, 40, 40);
  passageGroup.add(queenChamber);

  // Queen's statue (small gold figure)
  const statue = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(3, 8, 3), goldMat
  ));
  statue.position.set(0, 34, 40);
  passageGroup.add(statue);
  // Statue head
  const statueHead = addShadow(new THREE.Mesh(
    new THREE.SphereGeometry(2, 12, 10), goldMat
  ));
  statueHead.position.set(0, 40, 40);
  passageGroup.add(statueHead);

  // Queen's Chamber light
  const queenLight = new THREE.PointLight(0xffaa00, 0.3, 40, 2);
  queenLight.position.set(0, 42, 40);
  passageGroup.add(queenLight);

  root.add(passageGroup);

  // ============================================================
  // SPHINX (in front of the pyramid)
  // ============================================================
  const sphinxGroup = new THREE.Group();
  // Body (reclining lion) — uses weathered limestone (exposed to elements)
  const sphinxMat = makeLayerMaterial(99, 0, true); // weathered variant
  const sphinxBody = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(60, 25, 35), sphinxMat
  ));
  sphinxBody.position.y = 12;
  sphinxGroup.add(sphinxBody);
  // Head (pharaoh head)
  const sphinxHead = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(20, 25, 18), sphinxMat
  ));
  sphinxHead.position.set(0, 35, 10);
  sphinxGroup.add(sphinxHead);
  // Headdress (gold stripes)
  const headdress = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(22, 15, 20), goldMat
  ));
  headdress.position.set(0, 40, 10);
  sphinxGroup.add(headdress);
  // Front paws
  [-12, 12].forEach((x) => {
    const paw = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(8, 8, 20), pyramidMat
    ));
    paw.position.set(x, 4, -25);
    sphinxGroup.add(paw);
  });

  sphinxGroup.position.set(0, 0, -baseSize / 2 - 60);
  root.add(sphinxGroup);

  // ============================================================
  // SMALLER PYRAMIDS (2 satellite pyramids)
  // ============================================================
  [[-180, -100], [180, -100]].forEach(([x, z]) => {
    // Each satellite pyramid gets a unique non-uniform texture
    const satMat = makeLayerMaterial(200 + x, z, false);
    const smallPyramid = addShadow(new THREE.Mesh(
      new THREE.ConeGeometry(50 * Math.SQRT2, 80, 4), satMat
    ));
    smallPyramid.position.set(x, 40, z);
    smallPyramid.rotation.y = Math.PI / 4;
    root.add(smallPyramid);
    // Small gold capstone
    const smallCap = addShadow(new THREE.Mesh(
      new THREE.ConeGeometry(3, 6, 4), goldMat
    ));
    smallCap.position.set(x, 83, z);
    smallCap.rotation.y = Math.PI / 4;
    root.add(smallCap);
  });

  // ============================================================
  // MORTUARY TEMPLE (in front of pyramid, east side) — mudbrick texture
  // ============================================================
  const temple = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(80, 20, 40), mudbrickMat
  ));
  temple.position.set(0, 10, baseSize / 2 + 40);
  root.add(temple);
  // Temple columns (6) — limestone
  for (let i = 0; i < 6; i++) {
    const col = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(3, 4, 25, 16), pyramidMat
    ));
    col.position.set(-30 + i * 12, 22, baseSize / 2 + 60);
    root.add(col);
  }
  // Temple roof — mudbrick
  const templeRoof = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(80, 4, 20), mudbrickMat
  ));
  templeRoof.position.set(0, 35, baseSize / 2 + 60);
  root.add(templeRoof);

  // Workers' buildings (mudbrick, near temple)
  [[-60, baseSize / 2 + 30], [60, baseSize / 2 + 30], [-60, baseSize / 2 + 80]].forEach(([x, z]) => {
    const hut = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(25, 15, 20), mudbrickMat
    ));
    hut.position.set(x, 7.5, z);
    root.add(hut);
    // Thatched roof
    const roof = addShadow(new THREE.Mesh(
      new THREE.ConeGeometry(20, 8, 4),
      new THREE.MeshStandardMaterial({ color: 0x8b7333, roughness: 0.9 })
    ));
    roof.position.set(x, 19, z);
    roof.rotation.y = Math.PI / 4;
    root.add(roof);
  });

  // Papyrus scroll niches in Grand Gallery walls (2)
  [[-3.5, 50, 35], [3.5, 50, 65]].forEach(([x, y, z]) => {
    const niche = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 12, 8), papyrusMat
    ));
    niche.position.set(x, y, z);
    passageGroup.add(niche);
  });

  // ============================================================
  // SURROUNDING WALL + CAUSEWAY
  // ============================================================
  // Perimeter wall (low limestone wall around complex)
  const wallH = 8;
  [[0, 200, 500, wallH], [0, -200, 500, wallH], [200, 0, wallH, 500], [-200, 0, wallH, 500]].forEach(([x, z, w, h]) => {
    const wall = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(w, h, 3), pyramidMat
    ));
    wall.position.set(x, h / 2, z);
    root.add(wall);
  });

  // Causeway (paved walkway from temple to Nile)
  const causeway = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(20, 1, 150), basaltMat
  ));
  causeway.position.set(0, 0.5, baseSize / 2 + 140);
  root.add(causeway);

  // ============================================================
  // PALM TREES + OASIS (near the causeway end)
  // Hoisted palm materials (avoid 42 duplicate allocations in the loop)
  // ============================================================
  const palmTrunkMat = new THREE.MeshStandardMaterial({ color: 0x8b7355, roughness: 0.8 });
  const palmFrondMat = new THREE.MeshStandardMaterial({ color: 0x3a5a1a, roughness: 0.7, side: THREE.DoubleSide });
  for (let i = 0; i < 6; i++) {
    const x = -20 + (i % 3) * 20 + Math.random() * 10;
    const z = baseSize / 2 + 200 + Math.random() * 40;
    // Trunk
    const trunk = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(1.5, 3, 30, 8),
      palmTrunkMat
    ));
    trunk.position.set(x, 15, z);
    root.add(trunk);
    // Fronds
    for (let j = 0; j < 6; j++) {
      const angle = (j / 6) * Math.PI * 2;
      const frond = addShadow(new THREE.Mesh(
        new THREE.BoxGeometry(12, 0.5, 2),
        palmFrondMat
      ));
      frond.position.set(x + Math.cos(angle) * 6, 30, z + Math.sin(angle) * 6);
      frond.rotation.y = angle;
      frond.rotation.z = -0.3;
      root.add(frond);
    }
  }

  // Small water feature (Nile river edge)
  const nile = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(300, 1, 60),
    new THREE.MeshStandardMaterial({ color: 0x4a7a9a, metalness: 0.3, roughness: 0.1, transparent: true, opacity: 0.7 })
  ));
  nile.position.set(0, 0.5, baseSize / 2 + 280);
  root.add(nile);

  // ============================================================
  // LIGHTING (realistic Egyptian sun with strong shadows)
  // ============================================================
  // Main sun (warm, low angle for long dramatic shadows)
  const sun = new THREE.DirectionalLight(0xffd88a, 2.0);
  sun.position.set(150, 250, 80);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -500;
  sun.shadow.camera.right = 500;
  sun.shadow.camera.top = 500;
  sun.shadow.camera.bottom = -500;
  sun.shadow.camera.near = 10;
  sun.shadow.camera.far = 1200;
  sun.shadow.bias = -0.0003;
  sun.shadow.normalBias = 0.02;
  root.add(sun);

  // Fill light (cool sky bounce — fills shadow areas)
  const fill = new THREE.DirectionalLight(0xb0d0ff, 0.4);
  fill.position.set(-150, 200, -100);
  root.add(fill);

  // Ambient (warm, low — keeps shadows dark)
  const ambient = new THREE.AmbientLight(0xddc888, 0.25);
  root.add(ambient);

  // Hemisphere (warm sky / sand bounce)
  const hemi = new THREE.HemisphereLight(0xffeec0, 0xddc888, 0.35);
  root.add(hemi);

  // Rim light (backlight to separate pyramid from sky)
  const rim = new THREE.DirectionalLight(0xffaa44, 0.3);
  rim.position.set(-100, 100, -200);
  root.add(rim);

  return root;
}
