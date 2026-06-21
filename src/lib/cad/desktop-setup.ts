// ====================== DESKTOP SETUP ======================
// A modern battlestation / productivity desktop setup.
// Features: L-shaped desk, gaming PC tower (glass side panel + RGB + visible GPU/CPU cooler),
// 3 monitors (ultrawide center + 2 side monitors on arms), mechanical keyboard, mouse,
// mousepad, headphones, desk lamp, speakers, coffee mug, books, plant, ergonomic chair.
// Room: home office with window (city skyline view), wood floor, painted walls.

import * as THREE from 'three';
import { addShadow } from './materials-dsl';
import {
  makeWoodTexture, makeConcreteTexture, makeFabricTexture, makeCarpetTexture,
} from './building-textures';

// ---------- Local texture helpers ----------

function brushedAluminumTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#b8bcc4';
  ctx.fillRect(0, 0, size, size);
  // brushed lines
  for (let i = 0; i < 800; i++) {
    ctx.strokeStyle = `rgba(${200 + Math.random() * 40},${200 + Math.random() * 40},${210 + Math.random() * 40},${0.15 + Math.random() * 0.2})`;
    ctx.lineWidth = 0.5 + Math.random();
    ctx.beginPath();
    const y = Math.random() * size;
    ctx.moveTo(0, y);
    ctx.lineTo(size, y + (Math.random() - 0.5) * 4);
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping; tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  return tex;
}

function carbonFiberTexture(): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, 0, size, size);
  const cell = 16;
  for (let x = 0; x < size; x += cell) {
    for (let y = 0; y < size; y += cell) {
      const grad = ctx.createLinearGradient(x, y, x + cell, y + cell);
      grad.addColorStop(0, '#2a2a2a');
      grad.addColorStop(0.5, '#3a3a3a');
      grad.addColorStop(1, '#1a1a1a');
      ctx.fillStyle = grad;
      ctx.fillRect(x, y, cell / 2 - 0.5, cell / 2 - 0.5);
      ctx.fillRect(x + cell / 2, y + cell / 2, cell / 2 - 0.5, cell / 2 - 0.5);
      const grad2 = ctx.createLinearGradient(x + cell / 2, y, x, y + cell / 2);
      grad2.addColorStop(0, '#252525');
      grad2.addColorStop(0.5, '#353535');
      grad2.addColorStop(1, '#1a1a1a');
      ctx.fillStyle = grad2;
      ctx.fillRect(x + cell / 2, y, cell / 2 - 0.5, cell / 2 - 0.5);
      ctx.fillRect(x, y + cell / 2, cell / 2 - 0.5, cell / 2 - 0.5);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping; tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  return tex;
}

function mousepadTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  // dark background
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, '#1a1a2a');
  grad.addColorStop(1, '#0a0a14');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  // RGB edge glow
  for (let i = 0; i < 4; i++) {
    const colors = ['#ff006e', '#8338ec', '#3a86ff', '#06ffa5'];
    ctx.strokeStyle = colors[i];
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.6;
    ctx.strokeRect(4 + i * 2, 4 + i * 2, size - 8 - i * 4, size - 8 - i * 4);
  }
  ctx.globalAlpha = 1;
  // subtle grid pattern
  ctx.strokeStyle = 'rgba(100,150,255,0.08)';
  ctx.lineWidth = 0.5;
  for (let x = 0; x < size; x += 16) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, size); ctx.stroke();
  }
  for (let y = 0; y < size; y += 16) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(size, y); ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function monitorScreenTexture(theme: 'code' | 'browser' | 'wallpaper'): THREE.CanvasTexture {
  const w = 512, h = 288; // 16:9
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  if (theme === 'code') {
    // dark IDE theme
    ctx.fillStyle = '#1e1e2e';
    ctx.fillRect(0, 0, w, h);
    // title bar
    ctx.fillStyle = '#181825';
    ctx.fillRect(0, 0, w, 24);
    ctx.fillStyle = '#cdd6f4';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('main.ts — Desktop Setup', 12, 16);
    // traffic lights
    ctx.fillStyle = '#ff5f56'; ctx.beginPath(); ctx.arc(12, 12, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffbd2e'; ctx.beginPath(); ctx.arc(28, 12, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#27c93f'; ctx.beginPath(); ctx.arc(44, 12, 5, 0, Math.PI * 2); ctx.fill();
    // sidebar
    ctx.fillStyle = '#181825';
    ctx.fillRect(0, 24, 60, h - 24);
    ctx.fillStyle = '#cba6f7';
    ctx.font = '10px monospace';
    ['src', '  cad', '  models', '  views', 'public'].forEach((t, i) => ctx.fillText(t, 8, 44 + i * 16));
    // code lines
    const colors = ['#cdd6f4', '#f9e2af', '#a6e3a1', '#89b4fa', '#f5c2e7', '#94e2d5', '#cba6f7'];
    const codeLines = [
      'import * as THREE from "three";',
      'export function createDesktop() {',
      '  const desk = new THREE.Group();',
      '  const monitor = makeMonitor("ultrawide");',
      '  desk.add(monitor);',
      '  const pc = buildGamingPC({ rgb: true });',
      '  desk.add(pc);',
      '  return desk;',
      '}',
    ];
    ctx.font = '11px "Courier New", monospace';
    codeLines.forEach((line, i) => {
      const y = 44 + i * 18;
      // syntax highlighting
      let x = 70;
      const tokens = line.split(/(\s+|[(){};,".])/);
      tokens.forEach(tok => {
        if (tok === 'import' || tok === 'export' || tok === 'function' || tok === 'return' || tok === 'const' || tok === 'new') {
          ctx.fillStyle = '#cba6f7';
        } else if (tok === 'THREE' || tok === 'Group') {
          ctx.fillStyle = '#f9e2af';
        } else if (tok === '"three"' || tok === '"ultrawide"') {
          ctx.fillStyle = '#a6e3a1';
        } else if (tok === 'createDesktop' || tok === 'makeMonitor' || tok === 'buildGamingPC') {
          ctx.fillStyle = '#89b4fa';
        } else {
          ctx.fillStyle = '#cdd6f4';
        }
        ctx.fillText(tok, x, y);
        x += ctx.measureText(tok).width;
      });
    });
    // line numbers
    ctx.fillStyle = '#585b70';
    ctx.font = '10px monospace';
    for (let i = 0; i < 12; i++) ctx.fillText(String(i + 1), 64, 44 + i * 18);
  } else if (theme === 'browser') {
    // browser with dashboard
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, w, h);
    // browser chrome
    ctx.fillStyle = '#e0e0e0';
    ctx.fillRect(0, 0, w, 36);
    // URL bar
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(80, 8, w - 160, 20);
    ctx.fillStyle = '#888';
    ctx.font = '11px sans-serif';
    ctx.fillText('🔒 dashboard.example.com', 88, 22);
    // dashboard cards
    const cards = [
      { x: 20, y: 56, w: 140, h: 80, color: '#6366f1', label: 'Revenue', value: '$42.5K' },
      { x: 172, y: 56, w: 140, h: 80, color: '#10b981', label: 'Active Users', value: '1,284' },
      { x: 324, y: 56, w: 140, h: 80, color: '#f59e0b', label: 'Orders', value: '342' },
    ];
    cards.forEach(c => {
      ctx.fillStyle = '#fff';
      ctx.fillRect(c.x, c.y, c.w, c.h);
      ctx.fillStyle = c.color;
      ctx.fillRect(c.x, c.y, 4, c.h);
      ctx.fillStyle = '#666';
      ctx.font = '10px sans-serif';
      ctx.fillText(c.label, c.x + 12, c.y + 22);
      ctx.fillStyle = '#111';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(c.value, c.x + 12, c.y + 50);
    });
    // chart
    ctx.fillStyle = '#fff';
    ctx.fillRect(20, 150, 320, 120);
    ctx.fillStyle = '#6366f1';
    ctx.beginPath();
    ctx.moveTo(30, 250);
    const pts = [240, 220, 230, 190, 200, 160, 170, 180];
    pts.forEach((py, i) => ctx.lineTo(30 + i * 40, py));
    ctx.lineTo(310, 250);
    ctx.closePath();
    ctx.fill();
    // legend
    ctx.fillStyle = '#fff';
    ctx.fillRect(352, 150, 160, 120);
    ctx.fillStyle = '#333';
    ctx.font = '11px sans-serif';
    ctx.fillText('Recent Activity', 360, 168);
    ['• New signup', '• Deploy success', '• Backup complete', '• Alert resolved'].forEach((t, i) => {
      ctx.fillStyle = '#666';
      ctx.fillText(t, 360, 188 + i * 18);
    });
  } else {
    // wallpaper - abstract gradient
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#1a1a2e');
    grad.addColorStop(0.5, '#16213e');
    grad.addColorStop(1, '#0f3460');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    // mountains silhouette
    ctx.fillStyle = '#0a0a1a';
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(0, 180);
    ctx.lineTo(80, 140);
    ctx.lineTo(160, 170);
    ctx.lineTo(240, 110);
    ctx.lineTo(320, 150);
    ctx.lineTo(400, 120);
    ctx.lineTo(512, 160);
    ctx.lineTo(512, h);
    ctx.closePath();
    ctx.fill();
    // moon
    ctx.fillStyle = 'rgba(255,255,220,0.9)';
    ctx.beginPath();
    ctx.arc(400, 70, 24, 0, Math.PI * 2);
    ctx.fill();
    // stars
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 80; i++) {
      const x = Math.random() * w;
      const y = Math.random() * 140;
      ctx.globalAlpha = Math.random();
      ctx.fillRect(x, y, 1, 1);
    }
    ctx.globalAlpha = 1;
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Hardwood floor plank texture — straight horizontal planks with subtle grain,
// plank seams, and a warm brown tone. No wavy lines (unlike makeWoodTexture
// which has sin-wave grain for furniture). Each plank is a horizontal board
// with a dark seam between planks and faint straight grain within.
function floorPlankTexture(baseColor = '#9a7048', darkColor = '#5a3820', seamColor = '#3a2410'): { map: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
  const W = 512, H = 512;
  // --- Color map ---
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, W, H);
  // Plank layout: 6 horizontal planks, each 512/6 ≈ 85px tall
  const plankH = H / 6;
  for (let p = 0; p < 6; p++) {
    const py = p * plankH;
    // Subtle per-plank color variation (some planks slightly lighter/darker)
    const variation = (p % 3) - 1; // -1, 0, 1
    const r = parseInt(baseColor.substring(1, 3), 16) + variation * 10;
    const g = parseInt(baseColor.substring(3, 5), 16) + variation * 8;
    const b = parseInt(baseColor.substring(5, 7), 16) + variation * 5;
    ctx.fillStyle = `rgb(${Math.max(0, r)}, ${Math.max(0, g)}, ${Math.max(0, b)})`;
    ctx.fillRect(0, py, W, plankH);
    // Faint straight grain lines within each plank (horizontal, very subtle)
    ctx.strokeStyle = darkColor;
    ctx.globalAlpha = 0.12;
    ctx.lineWidth = 1;
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      const ly = py + (i / 8) * plankH + 4;
      ctx.moveTo(0, ly);
      // Almost-straight lines with very slight jitter (not wavy)
      for (let x = 0; x <= W; x += 32) {
        ctx.lineTo(x, ly + (Math.random() - 0.5) * 0.8);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    // Plank seam (dark line at the top of each plank)
    ctx.fillStyle = seamColor;
    ctx.fillRect(0, py, W, 2);
    // Plank end joints (staggered vertical seams — every other plank has a joint at a different X)
    const jointX = (p % 2 === 0) ? W * 0.35 : W * 0.7;
    ctx.fillRect(jointX, py, 2, plankH);
  }
  const map = new THREE.CanvasTexture(canvas);
  map.wrapS = THREE.RepeatWrapping; map.wrapT = THREE.RepeatWrapping;
  map.colorSpace = THREE.SRGBColorSpace; map.anisotropy = 8;

  // --- Bump map ---
  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = W; bumpCanvas.height = H;
  const bctx = bumpCanvas.getContext('2d')!;
  bctx.fillStyle = '#909090';
  bctx.fillRect(0, 0, W, H);
  for (let p = 0; p < 6; p++) {
    const py = p * plankH;
    // Plank surface (slightly raised)
    bctx.fillStyle = '#a0a0a0';
    bctx.fillRect(0, py + 2, W, plankH - 2);
    // Plank seam (recessed — darker)
    bctx.fillStyle = '#404040';
    bctx.fillRect(0, py, W, 2);
    // End joint
    const jointX = (p % 2 === 0) ? W * 0.35 : W * 0.7;
    bctx.fillRect(jointX, py, 2, plankH);
    // Faint grain (very subtle)
    bctx.strokeStyle = '#888888';
    bctx.lineWidth = 1;
    for (let i = 0; i < 8; i++) {
      bctx.beginPath();
      const ly = py + (i / 8) * plankH + 4;
      bctx.moveTo(0, ly);
      for (let x = 0; x <= W; x += 32) {
        bctx.lineTo(x, ly + (Math.random() - 0.5) * 0.8);
      }
      bctx.stroke();
    }
  }
  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping; bumpMap.wrapT = THREE.RepeatWrapping;
  return { map, bumpMap };
}

// Full QWERTY keyboard texture (ANSI layout, 60% compact — no numpad)
// 5 rows: number row, QWERTY row, ASDF row, ZXCV row, spacebar row
function keycapTexture(): THREE.CanvasTexture {
  const W = 760, H = 260; // wide canvas matching keyboard aspect ratio (~2.9:1)
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // Background (keyboard chassis)
  ctx.fillStyle = '#1a1a1e';
  ctx.fillRect(0, 0, W, H);

  const keyH = 44;       // standard key height
  const gap = 3;         // gap between keys
  const keyW = 44;       // standard 1u key width
  const padX = 10;       // left/right padding
  const padY = 10;       // top/bottom padding

  // Helper: draw a single keycap at (x, y) with given width and label(s)
  function drawKey(x: number, y: number, w: number, main: string, sub?: string) {
    // Keycap top with subtle gradient (lighter at top, darker at bottom)
    const grad = ctx.createLinearGradient(x, y, x, y + keyH);
    grad.addColorStop(0, '#3a3a40');
    grad.addColorStop(0.5, '#2a2a2e');
    grad.addColorStop(1, '#1a1a1e');
    ctx.fillStyle = grad;
    ctx.fillRect(x, y, w, keyH);
    // Keycap border (darker)
    ctx.strokeStyle = '#0a0a0a';
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 0.5, y + 0.5, w - 1, keyH - 1);
    // Label
    ctx.fillStyle = '#c8c8d0';
    ctx.font = 'bold 16px "Segoe UI", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    if (sub) {
      // Dual-label key (number row: shifted symbol on top, number on bottom)
      ctx.font = 'bold 13px "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = '#909098';
      ctx.fillText(sub, x + w / 2, y + 12);
      ctx.fillStyle = '#c8c8d0';
      ctx.font = 'bold 15px "Segoe UI", Arial, sans-serif';
      ctx.fillText(main, x + w / 2, y + 30);
    } else {
      ctx.fillText(main, x + w / 2, y + keyH / 2 + 1);
    }
  }

  // Row 1: Number row (with shifted symbols)
  const row1Y = padY;
  const row1 = [
    { m: '1', s: '!' }, { m: '2', s: '@' }, { m: '3', s: '#' }, { m: '4', s: '$' },
    { m: '5', s: '%' }, { m: '6', s: '^' }, { m: '7', s: '&' }, { m: '8', s: '*' },
    { m: '9', s: '(' }, { m: '0', s: ')' }, { m: '-', s: '_' }, { m: '=', s: '+' },
  ];
  let x = padX;
  for (const k of row1) { drawKey(x, row1Y, keyW, k.m, k.s); x += keyW + gap; }
  drawKey(x, row1Y, keyW * 2, '⌫ Backspace'); x += keyW * 2 + gap;

  // Row 2: Tab + QWERTY row
  const row2Y = padY + keyH + gap;
  x = padX;
  drawKey(x, row2Y, keyW * 1.5, 'Tab'); x += keyW * 1.5 + gap;
  for (const letter of 'QWERTYUIOP') { drawKey(x, row2Y, keyW, letter); x += keyW + gap; }
  drawKey(x, row2Y, keyW, '[', '['); x += keyW + gap;
  drawKey(x, row2Y, keyW, ']', ']'); x += keyW + gap;
  drawKey(x, row2Y, keyW * 1.5, '\\', '\\'); x += keyW * 1.5 + gap;

  // Row 3: Caps Lock + ASDF row (home row)
  const row3Y = padY + (keyH + gap) * 2;
  x = padX;
  drawKey(x, row3Y, keyW * 1.75, 'Caps'); x += keyW * 1.75 + gap;
  for (const letter of 'ASDFGHJKL') { drawKey(x, row3Y, keyW, letter); x += keyW + gap; }
  drawKey(x, row3Y, keyW, ';', ';'); x += keyW + gap;
  drawKey(x, row3Y, keyW, "'", "'"); x += keyW + gap;
  drawKey(x, row3Y, keyW * 2.25, 'Enter'); x += keyW * 2.25 + gap;

  // Row 4: Shift + ZXCV row
  const row4Y = padY + (keyH + gap) * 3;
  x = padX;
  drawKey(x, row4Y, keyW * 2.25, 'Shift'); x += keyW * 2.25 + gap;
  for (const letter of 'ZXCVBNM') { drawKey(x, row4Y, keyW, letter); x += keyW + gap; }
  drawKey(x, row4Y, keyW, ','); x += keyW + gap;
  drawKey(x, row4Y, keyW, '.'); x += keyW + gap;
  drawKey(x, row4Y, keyW, '/'); x += keyW + gap;
  drawKey(x, row4Y, keyW * 2.75, 'Shift'); x += keyW * 2.75 + gap;

  // Row 5: Bottom row (Ctrl, Win, Alt, Space, Alt, Fn, Menu, Ctrl)
  const row5Y = padY + (keyH + gap) * 4;
  x = padX;
  drawKey(x, row5Y, keyW * 1.25, 'Ctrl'); x += keyW * 1.25 + gap;
  drawKey(x, row5Y, keyW * 1.25, 'Win'); x += keyW * 1.25 + gap;
  drawKey(x, row5Y, keyW * 1.25, 'Alt'); x += keyW * 1.25 + gap;
  drawKey(x, row5Y, keyW * 6.25, 'Space'); x += keyW * 6.25 + gap; // spacebar
  drawKey(x, row5Y, keyW * 1.25, 'Alt'); x += keyW * 1.25 + gap;
  drawKey(x, row5Y, keyW * 1.25, 'Fn'); x += keyW * 1.25 + gap;
  drawKey(x, row5Y, keyW * 1.25, 'Menu'); x += keyW * 1.25 + gap;
  drawKey(x, row5Y, keyW * 1.25, 'Ctrl'); x += keyW * 1.25 + gap;

  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

// ====================== SETUP ======================

export function createDesktopSetupGeometry(): THREE.Group {
  const root = new THREE.Group();

  // Scale: 10 units = 1 meter
  // Desk height: 7.5 units (0.75m standard desk)
  // Monitor height: eye level ~12-15 units above desk

  // ===== MATERIALS =====
  const deskWood = makeWoodTexture('#6b4528', '#3a2515');
  deskWood.map.repeat.set(4, 2); deskWood.bumpMap.repeat.set(4, 2);
  const deskMat = new THREE.MeshStandardMaterial({
    map: deskWood.map, bumpMap: deskWood.bumpMap, bumpScale: 0.03,
    metalness: 0.1, roughness: 0.45,
  });

  const deskLegMat = new THREE.MeshStandardMaterial({ color: 0x4a4a52, metalness: 0.7, roughness: 0.3 }); // lighter gunmetal

  const brushedAlTex = brushedAluminumTexture();
  brushedAlTex.repeat.set(2, 2);
  const aluminMat = new THREE.MeshStandardMaterial({
    map: brushedAlTex, metalness: 0.85, roughness: 0.25,
  });

  const carbonTex = carbonFiberTexture();
  carbonTex.repeat.set(2, 2);
  const carbonMat = new THREE.MeshStandardMaterial({
    map: carbonTex, metalness: 0.5, roughness: 0.4,
  });

  // Lighter neutral plastics for variety (instead of everything being 0x1a1a1a)
  const midGrayPlasticMat = new THREE.MeshStandardMaterial({ color: 0x6a6a72, metalness: 0.3, roughness: 0.5 }); // mid gray
  const lightGrayPlasticMat = new THREE.MeshStandardMaterial({ color: 0x9a9aa2, metalness: 0.2, roughness: 0.5 }); // light gray
  const whitePlasticMat = new THREE.MeshStandardMaterial({ color: 0xe8e8ec, metalness: 0.1, roughness: 0.4 }); // off-white

  const glassPanelMat = new THREE.MeshStandardMaterial({
    color: 0x0a0a14, metalness: 0.3, roughness: 0.1,
    transparent: true, opacity: 0.55,
  });

  const darkPlasticMat = new THREE.MeshStandardMaterial({ color: 0x2a2a32, metalness: 0.3, roughness: 0.5 }); // dark charcoal (not pure black)
  const lightPlasticMat = new THREE.MeshStandardMaterial({ color: 0xf0f0f0, metalness: 0.1, roughness: 0.4 });

  // RGB materials (emissive)
  const rgbMagentaMat = new THREE.MeshStandardMaterial({ color: 0xff006e, emissive: 0xff006e, emissiveIntensity: 1.5, metalness: 0.2, roughness: 0.4 });
  const rgbCyanMat = new THREE.MeshStandardMaterial({ color: 0x00d9ff, emissive: 0x00d9ff, emissiveIntensity: 1.5, metalness: 0.2, roughness: 0.4 });
  const rgbPurpleMat = new THREE.MeshStandardMaterial({ color: 0x8338ec, emissive: 0x8338ec, emissiveIntensity: 1.5, metalness: 0.2, roughness: 0.4 });
  const rgbGreenMat = new THREE.MeshStandardMaterial({ color: 0x06ffa5, emissive: 0x06ffa5, emissiveIntensity: 1.5, metalness: 0.2, roughness: 0.4 });

  // Monitor bezel and screen materials
  // Monitor bezel — slim, dark gray (not pure black) for a more modern look
  const bezelMat = new THREE.MeshStandardMaterial({ color: 0x1a1a20, metalness: 0.4, roughness: 0.45 });
  // Monitor stand — brushed silver aluminum
  const standMat = new THREE.MeshStandardMaterial({ color: 0xa8acb4, metalness: 0.8, roughness: 0.25 });

  // Screen textures
  const centerScreenTex = monitorScreenTexture('code');
  const leftScreenTex = monitorScreenTexture('browser');
  const rightScreenTex = monitorScreenTexture('wallpaper');

  const centerScreenMat = new THREE.MeshStandardMaterial({
    map: centerScreenTex, emissive: 0xffffff, emissiveMap: centerScreenTex, emissiveIntensity: 0.8,
    metalness: 0.1, roughness: 0.2,
  });
  const leftScreenMat = new THREE.MeshStandardMaterial({
    map: leftScreenTex, emissive: 0xffffff, emissiveMap: leftScreenTex, emissiveIntensity: 0.8,
    metalness: 0.1, roughness: 0.2,
  });
  const rightScreenMat = new THREE.MeshStandardMaterial({
    map: rightScreenTex, emissive: 0xffffff, emissiveMap: rightScreenTex, emissiveIntensity: 0.7,
    metalness: 0.1, roughness: 0.2,
  });

  // Keyboard
  const keycapTex = keycapTexture();
  // Full QWERTY texture maps 1:1 onto the keyboard surface (no tiling)
  const keycapMat = new THREE.MeshStandardMaterial({
    map: keycapTex, metalness: 0.2, roughness: 0.6,
  });
  // Keyboard frame — dark gray (not black) with aluminum accent
  const kbFrameMat = new THREE.MeshStandardMaterial({ color: 0x3a3a42, metalness: 0.5, roughness: 0.4 });

  // Mouse
  // Mouse — light gray body (logitech-style) instead of black
  const mouseMat = new THREE.MeshStandardMaterial({ color: 0x8a8a92, metalness: 0.4, roughness: 0.3 });

  // Mousepad
  const mousepadTex = mousepadTexture();
  const mousepadMat = new THREE.MeshStandardMaterial({
    map: mousepadTex, metalness: 0.2, roughness: 0.7,
  });

  // Headphones
  // Headphones — warm taupe/brown leatherette instead of black
  const headbandMat = new THREE.MeshStandardMaterial({ color: 0x4a3a2a, metalness: 0.3, roughness: 0.6 });
  const earCupMat = new THREE.MeshStandardMaterial({ color: 0x5a4a3a, metalness: 0.3, roughness: 0.5 });
  const earPadMat = new THREE.MeshStandardMaterial({ color: 0x3a2a1a, metalness: 0.1, roughness: 0.85 });

  // Desk lamp
  // Desk lamp — brushed silver arm + warm white shade
  const lampMat = new THREE.MeshStandardMaterial({ color: 0xa8acb4, metalness: 0.7, roughness: 0.25 });
  const lampShadeMat = new THREE.MeshStandardMaterial({
    color: 0xf5f0e0, emissive: 0xfff0a0, emissiveIntensity: 0.6, metalness: 0.3, roughness: 0.4,
  });

  // Speakers
  // Speakers — warm walnut wood veneer + dark gray grille (bookshelf speaker look)
  const speakerWoodTex = makeWoodTexture('#6b4528', '#3a2515');
  speakerWoodTex.map.repeat.set(1, 2); speakerWoodTex.bumpMap.repeat.set(1, 2);
  const speakerMat = new THREE.MeshStandardMaterial({
    map: speakerWoodTex.map, bumpMap: speakerWoodTex.bumpMap, bumpScale: 0.02, metalness: 0.1, roughness: 0.6,
  });
  const speakerGrillMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2e, metalness: 0.1, roughness: 0.8 });

  // Mug
  const mugMat = new THREE.MeshStandardMaterial({ color: 0xe8e0d4, metalness: 0.1, roughness: 0.4 });

  // Books
  const bookMats = [
    new THREE.MeshStandardMaterial({ color: 0x8b3a3a, roughness: 0.7 }),
    new THREE.MeshStandardMaterial({ color: 0x2a5a8a, roughness: 0.7 }),
    new THREE.MeshStandardMaterial({ color: 0x3a5a2a, roughness: 0.7 }),
    new THREE.MeshStandardMaterial({ color: 0x8a6a3a, roughness: 0.7 }),
  ];

  // Plant
  const potMat = new THREE.MeshStandardMaterial({ color: 0xe8d4b8, roughness: 0.6, metalness: 0.1 });
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x3a6a3a, roughness: 0.8 });
  const stemMat = new THREE.MeshStandardMaterial({ color: 0x4a3520, roughness: 0.8 });

  // Chair — light gray fabric mesh + silver aluminum frame
  const chairFabric = makeFabricTexture('#5a5a64', '#3a3a44');
  chairFabric.map.repeat.set(2, 2); chairFabric.bumpMap.repeat.set(2, 2);
  const chairMat = new THREE.MeshStandardMaterial({
    map: chairFabric.map, bumpMap: chairFabric.bumpMap, bumpScale: 0.04,
    metalness: 0.05, roughness: 0.75,
  });
  const chairFrameMat = new THREE.MeshStandardMaterial({ color: 0x8a8a92, metalness: 0.8, roughness: 0.25 }); // brushed aluminum

  // Room
  const wallTex = makeConcreteTexture('#e8e0d4');
  wallTex.map.repeat.set(6, 3); wallTex.bumpMap.repeat.set(6, 3);
  const wallMat = new THREE.MeshStandardMaterial({
    map: wallTex.map, bumpMap: wallTex.bumpMap, bumpScale: 0.015, roughness: 0.85,
  });
  const accentWallTex = makeConcreteTexture('#2a3a4a');
  accentWallTex.map.repeat.set(6, 3); accentWallTex.bumpMap.repeat.set(6, 3);
  const accentWallMat = new THREE.MeshStandardMaterial({
    map: accentWallTex.map, bumpMap: accentWallTex.bumpMap, bumpScale: 0.015, roughness: 0.85,
  });
  // Natural brownish hardwood floor — straight plank boards (not wavy grain).
  // Uses the dedicated floorPlankTexture with horizontal planks, seams, and staggered end joints.
  const floorTex = floorPlankTexture('#8a6440', '#5a3820', '#3a2410');
  floorTex.map.repeat.set(6, 6); floorTex.bumpMap.repeat.set(6, 6);
  const floorMat = new THREE.MeshStandardMaterial({
    map: floorTex.map, bumpMap: floorTex.bumpMap, bumpScale: 0.03, metalness: 0.1, roughness: 0.6,
  });
  const ceilTex = makeConcreteTexture('#f5f0e8');
  ceilTex.map.repeat.set(6, 4);
  const ceilMat = new THREE.MeshStandardMaterial({
    map: ceilTex.map, bumpMap: ceilTex.bumpMap, bumpScale: 0.01, roughness: 0.9,
  });
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0x88aacc, metalness: 0.7, roughness: 0.05, transparent: true, opacity: 0.35,
  });

  // ============================================================
  // ROOM (home office — spacious loft feel)
  // 12m x 9m x 4.5m (120 x 90 x 45 units) — larger and taller than before
  // to avoid feeling cramped. Desk and objects keep their current sizes.
  // ============================================================
  const ROOM_W = 120;   // X: -60 to +60
  const ROOM_D = 90;    // Z: -45 to +45
  const ROOM_H = 45;    // Y: 0 to 45 (4.5m ceiling — loft height)

  // Floor
  const floor = addShadow(new THREE.Mesh(new THREE.PlaneGeometry(ROOM_W, ROOM_D), floorMat));
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, 0, 0);
  floor.receiveShadow = true;
  root.add(floor);

  // Ceiling
  const ceiling = addShadow(new THREE.Mesh(new THREE.PlaneGeometry(ROOM_W, ROOM_D), ceilMat));
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.set(0, ROOM_H, 0);
  ceiling.receiveShadow = true;
  root.add(ceiling);

  // Walls (4 sides)
  // South wall (behind user, Z=-45) — accent wall
  const wallS = addShadow(new THREE.Mesh(new THREE.BoxGeometry(ROOM_W, ROOM_H, 1), accentWallMat));
  wallS.position.set(0, ROOM_H / 2, -ROOM_D / 2 - 0.5);
  root.add(wallS);
  // North wall (behind monitors, Z=45) — has window
  // Window opening: X=-10..30 (40 wide), Y=9..36 (27 tall)
  // Left segment: X=-60..-10 (50 wide), right segment: X=30..60 (30 wide)
  const wallN1 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(50, ROOM_H, 1), wallMat));
  wallN1.position.set(-35, ROOM_H / 2, ROOM_D / 2);
  root.add(wallN1);
  const wallN2 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(30, ROOM_H, 1), wallMat));
  wallN2.position.set(45, ROOM_H / 2, ROOM_D / 2);
  root.add(wallN2);
  // Window header and sill (above/below window opening X=-10..30, height 9..36)
  const wallNHdr = addShadow(new THREE.Mesh(new THREE.BoxGeometry(40, 9, 1), wallMat));
  wallNHdr.position.set(10, 40.5, ROOM_D / 2);
  root.add(wallNHdr);
  const wallNSill = addShadow(new THREE.Mesh(new THREE.BoxGeometry(42, 2, 1.5), wallMat));
  wallNSill.position.set(10, 8, ROOM_D / 2);
  root.add(wallNSill);
  // Window glass
  const window = addShadow(new THREE.Mesh(new THREE.PlaneGeometry(38, 27), glassMat));
  window.position.set(10, 22.5, ROOM_D / 2 - 0.5);
  root.add(window);
  // Window frame (mullions)
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x6a6a72, metalness: 0.5, roughness: 0.3 });
  for (const [fx, fw] of [[-10, 0.5], [30, 0.5]] as [number, number][]) {
    const f = addShadow(new THREE.Mesh(new THREE.BoxGeometry(fw, 27, 1), frameMat));
    f.position.set(fx, 22.5, ROOM_D / 2 - 0.5);
    root.add(f);
  }
  for (const fy of [9, 36]) {
    const f = addShadow(new THREE.Mesh(new THREE.BoxGeometry(40, 0.5, 1), frameMat));
    f.position.set(10, fy, ROOM_D / 2 - 0.5);
    root.add(f);
  }
  // vertical mullion
  const mullion = addShadow(new THREE.Mesh(new THREE.BoxGeometry(0.5, 27, 1), frameMat));
  mullion.position.set(10, 22.5, ROOM_D / 2 - 0.5);
  root.add(mullion);

  // East wall (X=60)
  const wallE = addShadow(new THREE.Mesh(new THREE.BoxGeometry(1, ROOM_H, ROOM_D), wallMat));
  wallE.position.set(ROOM_W / 2, ROOM_H / 2, 0);
  root.add(wallE);
  // West wall (X=-60)
  const wallW = addShadow(new THREE.Mesh(new THREE.BoxGeometry(1, ROOM_H, ROOM_D), wallMat));
  wallW.position.set(-ROOM_W / 2, ROOM_H / 2, 0);
  root.add(wallW);

  // ============================================================
  // CITY SKYLINE (visible through window, Z > 30)
  // ============================================================
  const skylineColors = [0x4a4a55, 0x5a5a65, 0x6a6a78, 0x3a3a45, 0x556070];
  const desktopSkylineWinMat = new THREE.MeshStandardMaterial({ color: 0xfff4cc, emissive: 0xfff4cc, emissiveIntensity: 0.5 });
  const desktopSkylineWinGeo = new THREE.PlaneGeometry(1.5, 2);
  for (let i = 0; i < 12; i++) {
    const bw = 10 + Math.random() * 8;
    const bh = 20 + Math.random() * 50;
    const bd = 10 + Math.random() * 8;
    const bx = -35 + i * 7;
    const bz = 50 + Math.random() * 20;
    const bMat = new THREE.MeshStandardMaterial({
      color: skylineColors[i % skylineColors.length], metalness: 0.4, roughness: 0.6,
    });
    const b = addShadow(new THREE.Mesh(new THREE.BoxGeometry(bw, bh, bd), bMat));
    b.position.set(bx, bh / 2, bz);
    root.add(b);
    // lit windows
    // winMat hoisted above as desktopSkylineWinMat
    for (let wy = 2; wy < bh - 2; wy += 4) {
      for (let wx = -bw / 2 + 2; wx < bw / 2 - 2; wx += 3) {
        if (Math.random() > 0.4) {
          const w = new THREE.Mesh(desktopSkylineWinGeo, desktopSkylineWinMat);
          w.position.set(bx + wx, wy, bz + bd / 2 + 0.1);
          root.add(w);
        }
      }
    }
  }

  // ============================================================
  // DESK (L-shaped, against north wall, under window)
  // Main surface: X[-30,30], Z[20,28] (60 wide, 8 deep)
  // Side surface: X[-30,-22], Z[10,20] (8 wide, 10 deep)
  // Top at y=7.5 (0.75m desk height)
  // ============================================================
  const DESK_Y = 7.5;
  const DESK_T = 1; // desktop thickness

  // Main desktop — 50 wide, centered at X=5 so it spans X[-20,30].
  // This clears the server rack (spans X[-37,-27]) with a 7-unit gap on the left,
  // and keeps the right edge at X=30. The desk is a clean rectangle (no awkward
  // L-extension since the PC moved to the main desk).
  const deskMain = addShadow(new THREE.Mesh(new THREE.BoxGeometry(50, DESK_T, 8), deskMat));
  deskMain.position.set(5, DESK_Y, 40); // pushed closer to north wall (Z=45), back edge at Z=44
  deskMain.receiveShadow = true;
  root.add(deskMain);

  // Desk legs (4 metal box legs at the four corners, 1 unit inset)
  // Desk spans X[-20,30], Z[36,44].
  for (const [lx, lz] of [[-18, 37], [28, 37], [-18, 43], [28, 43]]) {
    const leg = addShadow(new THREE.Mesh(new THREE.BoxGeometry(2, DESK_Y, 2), deskLegMat));
    leg.position.set(lx, DESK_Y / 2, lz);
    root.add(leg);
  }

  // Cable management tray under desk
  const cableTray = addShadow(new THREE.Mesh(new THREE.BoxGeometry(40, 1, 3), darkPlasticMat));
  cableTray.position.set(0, DESK_Y - 2, 43);
  root.add(cableTray);

  // ============================================================
  // GAMING PC TOWER (on main desk, bottom-right corner)
  // Position: X=24, Z=24, sitting on the desk surface
  // Size: 8 wide x 16 tall x 8 deep (~0.8m x 1.6m x 0.8m — mid-tower ATX)
  // Glass side panel facing -X (toward user, who is at center looking +Z)
  // Front RGB fans facing -Z (toward user)
  // ============================================================
  const PC_X = 24, PC_Y = DESK_Y + 8, PC_Z = 40;
  const PC_W = 8, PC_H = 16, PC_D = 8;

  // Case frame (carbon fiber)
  const pcFrame = addShadow(new THREE.Mesh(new THREE.BoxGeometry(PC_W, PC_H, PC_D), carbonMat));
  pcFrame.position.set(PC_X, PC_Y, PC_Z);
  root.add(pcFrame);

  // Glass side panel (facing -X, toward user at center)
  const glassPanel = addShadow(new THREE.Mesh(new THREE.BoxGeometry(0.3, PC_H - 2, PC_D - 2), glassPanelMat));
  glassPanel.position.set(PC_X - PC_W / 2 + 0.15, PC_Y, PC_Z);
  root.add(glassPanel);

  // === Internal components (visible through glass) ===
  // Motherboard backplate (vertical, against +X wall of case)
  const mobo = addShadow(new THREE.Mesh(new THREE.BoxGeometry(0.5, PC_H - 4, PC_D - 3), new THREE.MeshStandardMaterial({ color: 0x0a3a2a, metalness: 0.3, roughness: 0.6 })));
  mobo.position.set(PC_X + PC_W / 2 - 1, PC_Y, PC_Z);
  root.add(mobo);

  // GPU (graphics card) — large horizontal card, RGB shroud
  const gpu = addShadow(new THREE.Mesh(new THREE.BoxGeometry(5, 2, PC_D - 3), darkPlasticMat));
  gpu.position.set(PC_X + 1, PC_Y - 1, PC_Z);
  root.add(gpu);
  // GPU RGB strip
  const gpuRgb = addShadow(new THREE.Mesh(new THREE.BoxGeometry(5, 0.4, 0.4), rgbMagentaMat));
  gpuRgb.position.set(PC_X + 1, PC_Y - 2, PC_Z);
  root.add(gpuRgb);
  // GPU fans (2 fans visible from side)
  for (const fanX of [PC_X + 2, PC_X - 1]) {
    const fanHousing = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.3, 0.4, 16), darkPlasticMat));
    fanHousing.rotation.z = Math.PI / 2;
    fanHousing.position.set(fanX, PC_Y - 1, PC_Z - 1);
    root.add(fanHousing);
    const fanBlades = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 0.2, 8), lightPlasticMat));
    fanBlades.rotation.z = Math.PI / 2;
    fanBlades.position.set(fanX - 0.3, PC_Y - 1, PC_Z - 1);
    root.add(fanBlades);
  }

  // CPU cooler (tower cooler with RGB fan)
  const cpuBlock = addShadow(new THREE.Mesh(new THREE.BoxGeometry(2, 1.5, 2), darkPlasticMat));
  cpuBlock.position.set(PC_X + 2, PC_Y + 3, PC_Z);
  root.add(cpuBlock);
  const coolerRad = addShadow(new THREE.Mesh(new THREE.BoxGeometry(3, 6, 3), aluminMat));
  coolerRad.position.set(PC_X, PC_Y + 3, PC_Z);
  root.add(coolerRad);
  const coolerFan = addShadow(new THREE.Mesh(new THREE.BoxGeometry(0.4, 5, 3), darkPlasticMat));
  coolerFan.position.set(PC_X - 1.5, PC_Y + 3, PC_Z);
  root.add(coolerFan);
  // RGB ring on cooler fan
  const coolerRgb = addShadow(new THREE.Mesh(new THREE.RingGeometry(1.4, 1.6, 16), rgbCyanMat));
  coolerRgb.position.set(PC_X - 1.7, PC_Y + 3, PC_Z);
  coolerRgb.rotation.y = Math.PI / 2;
  root.add(coolerRgb);

  // RAM sticks (2x, vertical, with RGB tops)
  for (const ramZ of [PC_Z - 1, PC_Z + 1]) {
    const ram = addShadow(new THREE.Mesh(new THREE.BoxGeometry(0.3, 4, 1), darkPlasticMat));
    ram.position.set(PC_X + 2.5, PC_Y + 4, ramZ);
    root.add(ram);
    const ramRgb = addShadow(new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 1.1), rgbPurpleMat));
    ramRgb.position.set(PC_X + 2.5, PC_Y + 6, ramZ);
    root.add(ramRgb);
  }

  // PSU shroud (bottom horizontal box)
  const psu = addShadow(new THREE.Mesh(new THREE.BoxGeometry(PC_W - 1, 3, PC_D - 2), darkPlasticMat));
  psu.position.set(PC_X, PC_Y - 5, PC_Z);
  root.add(psu);

  // RGB strip along bottom of case
  const bottomRgb = addShadow(new THREE.Mesh(new THREE.BoxGeometry(PC_W - 1, 0.3, 0.3), rgbGreenMat));
  bottomRgb.position.set(PC_X, PC_Y - PC_H / 2 + 0.3, PC_Z);
  root.add(bottomRgb);

  // Front panel (facing -Z, toward user) with RGB fans (3x)
  for (let i = 0; i < 3; i++) {
    const fanY = PC_Y + 4 - i * 4;
    const fanH = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.3, 0.8, 16), darkPlasticMat));
    fanH.rotation.x = Math.PI / 2;
    fanH.position.set(PC_X, fanY, PC_Z - PC_D / 2 + 0.3);
    root.add(fanH);
    const fanRgb = addShadow(new THREE.Mesh(new THREE.RingGeometry(1.1, 1.4, 16), [rgbMagentaMat, rgbCyanMat, rgbPurpleMat][i]));
    fanRgb.position.set(PC_X, fanY, PC_Z - PC_D / 2 + 0.7);
    root.add(fanRgb);
    // fan blades
    const blades = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 0.2, 7), lightPlasticMat));
    blades.rotation.x = Math.PI / 2;
    blades.position.set(PC_X, fanY, PC_Z - PC_D / 2 + 0.5);
    root.add(blades);
  }

  // Power button (top of case)
  const powerBtn = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.2, 12), lightPlasticMat));
  powerBtn.position.set(PC_X + 2, PC_Y + PC_H / 2 + 0.1, PC_Z);
  root.add(powerBtn);

  // PC RGB point lights (subtle glow)
  const pcRgbLight = new THREE.PointLight(0x8338ec, 0.5, 20, 2);
  pcRgbLight.position.set(PC_X - 2, PC_Y, PC_Z);
  root.add(pcRgbLight);
  const pcRgbLight2 = new THREE.PointLight(0x00d9ff, 0.3, 15, 2);
  pcRgbLight2.position.set(PC_X, PC_Y - 3, PC_Z + 2);
  root.add(pcRgbLight2);

  // ============================================================
  // SERVER RACK (at back of room, against north wall)
  // Position: X=-32, Z=28, floor-to-near-ceiling
  // A proper 19" server rack with multiple 1U/2U servers, switches, and patch panel
  // ============================================================
  const SR_X = -32, SR_Z = 28;
  const SR_W = 10, SR_H = 24, SR_D = 8;
  const rackMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2e, metalness: 0.7, roughness: 0.35 });
  const rackFrameMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1e, metalness: 0.6, roughness: 0.4 });
  const serverMat = new THREE.MeshStandardMaterial({ color: 0x3a3a40, metalness: 0.6, roughness: 0.4 });

  // Rack frame (4 vertical rails + top/bottom)
  for (const fx of [SR_X - SR_W / 2, SR_X + SR_W / 2]) {
    for (const fz of [SR_Z - SR_D / 2, SR_Z + SR_D / 2]) {
      const rail = addShadow(new THREE.Mesh(
        new THREE.BoxGeometry(0.5, SR_H, 0.5), rackFrameMat
      ));
      rail.position.set(fx, SR_H / 2, fz);
      root.add(rail);
    }
  }
  // Top and bottom plates
  for (const fy of [0, SR_H]) {
    const plate = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(SR_W, 0.5, SR_D), rackFrameMat
    ));
    plate.position.set(SR_X, fy, SR_Z);
    root.add(plate);
  }
  // Side panels (perforated metal look — solid color)
  const sidePanelL = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(0.3, SR_H - 1, SR_D - 0.5), rackMat
  ));
  sidePanelL.position.set(SR_X - SR_W / 2 + 0.15, SR_H / 2, SR_Z);
  root.add(sidePanelL);
  const sidePanelR = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(0.3, SR_H - 1, SR_D - 0.5), rackMat
  ));
  sidePanelR.position.set(SR_X + SR_W / 2 - 0.15, SR_H / 2, SR_Z);
  root.add(sidePanelR);
  // Back panel
  const backPanel = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(SR_W - 0.5, SR_H - 1, 0.3), rackMat
  ));
  backPanel.position.set(SR_X, SR_H / 2, SR_Z + SR_D / 2 - 0.15);
  root.add(backPanel);

  // === Rack-mounted servers and equipment ===
  // Each unit: a box filling the rack width, with a colored front face and LED indicators
  // Units are stacked from bottom to top with small gaps
  type RackUnit = { name: string; height: number; ledColors: number[]; frontColor: number };
  const rackUnits: RackUnit[] = [
    { name: 'UPS',           height: 2, ledColors: [0x00ff00, 0x00ff00, 0xffaa00], frontColor: 0x2a2a30 }, // 2U UPS at bottom
    { name: 'Server 1',      height: 1, ledColors: [0x00ff00, 0x00ff00],            frontColor: 0x3a3a40 }, // 1U server
    { name: 'Server 2',      height: 1, ledColors: [0x00ff00, 0x00ff00],            frontColor: 0x3a3a40 }, // 1U server
    { name: 'Server 3',      height: 2, ledColors: [0x00ff00, 0xff0000, 0x00ff00],  frontColor: 0x4a4a52 }, // 2U server
    { name: 'NAS Storage',   height: 2, ledColors: [0x00ff00, 0x00ff00, 0x00ff00, 0xffaa00], frontColor: 0x3a3a44 }, // 2U NAS with drive bays
    { name: 'Switch',        height: 1, ledColors: [0x00ff00, 0x00ff00, 0x00ff00, 0x00ff00, 0x00ff00, 0x00ff00, 0x00ff00, 0x00ff00], frontColor: 0x2a2a30 }, // 1U switch (8 port LEDs)
    { name: 'Patch Panel',   height: 1, ledColors: [],                              frontColor: 0x5a5a62 }, // 1U patch panel (no LEDs)
    { name: 'Server 4',      height: 2, ledColors: [0x00ff00, 0x00ff00, 0xff0000],  frontColor: 0x4a4a52 }, // 2U server
    { name: 'KVM',           height: 1, ledColors: [0x00ff00],                       frontColor: 0x3a3a40 }, // 1U KVM
  ];

  // Stack from bottom up. Each rack unit is 1.2 units tall (1U ≈ 0.12m at 10u/m... scaled up for visibility)
  const unitHeight = 1.5; // 1U = 1.5 units
  const gap = 0.2;
  let currentY = 1.5; // start above bottom plate

  for (const unit of rackUnits) {
    const unitH = unit.height * unitHeight;
    // Server body
    const body = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(SR_W - 1, unitH - gap, SR_D - 1),
      serverMat
    ));
    body.position.set(SR_X, currentY + unitH / 2, SR_Z);
    root.add(body);
    // Front face (visible from -Z, toward user)
    const front = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(SR_W - 1.5, unitH - gap, 0.2),
      new THREE.MeshStandardMaterial({ color: unit.frontColor, metalness: 0.5, roughness: 0.4 })
    ));
    front.position.set(SR_X, currentY + unitH / 2, SR_Z - SR_D / 2 + 0.4);
    root.add(front);
    // LED indicators (small emissive dots on the front face, left side)
    for (let led = 0; led < unit.ledColors.length; led++) {
      const ledColor = unit.ledColors[led];
      const ledMesh = addShadow(new THREE.Mesh(
        new THREE.SphereGeometry(0.15, 8, 6),
        new THREE.MeshStandardMaterial({
          color: ledColor, emissive: ledColor, emissiveIntensity: 1.2, metalness: 0.2, roughness: 0.4
        })
      ));
      ledMesh.position.set(
        SR_X - SR_W / 2 + 1.2 + led * 0.5,
        currentY + unitH / 2,
        SR_Z - SR_D / 2 + 0.3
      );
      root.add(ledMesh);
    }
    // Drive bays for NAS (small rectangles on front)
    if (unit.name === 'NAS Storage') {
      for (let bay = 0; bay < 4; bay++) {
        const drive = addShadow(new THREE.Mesh(
          new THREE.BoxGeometry(1.5, unitH - gap - 0.6, 0.15),
          new THREE.MeshStandardMaterial({ color: 0x1a1a1e, metalness: 0.4, roughness: 0.5 })
        ));
        drive.position.set(
          SR_X - 2 + bay * 1.8,
          currentY + unitH / 2,
          SR_Z - SR_D / 2 + 0.32
        );
        root.add(drive);
        // Drive LED
        const driveLed = addShadow(new THREE.Mesh(
          new THREE.SphereGeometry(0.1, 6, 5),
          new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 1.0 })
        ));
        driveLed.position.set(
          SR_X - 2 + bay * 1.8,
          currentY + unitH / 2 + 0.4,
          SR_Z - SR_D / 2 + 0.25
        );
        root.add(driveLed);
      }
    }
    // Rack-mount handles (2 small bars on the front for servers)
    if (unit.name.startsWith('Server')) {
      for (const hx of [SR_X - SR_W / 2 + 1.5, SR_X + SR_W / 2 - 1.5]) {
        const handle = addShadow(new THREE.Mesh(
          new THREE.BoxGeometry(0.4, 0.3, 0.4),
          new THREE.MeshStandardMaterial({ color: 0x1a1a1e, metalness: 0.5, roughness: 0.5 })
        ));
        handle.position.set(hx, currentY + unitH / 2, SR_Z - SR_D / 2 + 0.3);
        root.add(handle);
      }
    }
    currentY += unitH;
  }

  // Cable management (vertical cable bundle on the side of the rack)
  const rackCableBundle = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.5, SR_H - 2, 8),
    new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.8 })
  ));
  rackCableBundle.position.set(SR_X - SR_W / 2 - 0.5, SR_H / 2, SR_Z);
  root.add(rackCableBundle);

  // Server rack status LED strip (top of rack)
  const rackStatusLed = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(SR_W - 1, 0.2, 0.2),
    new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 1.0 })
  ));
  rackStatusLed.position.set(SR_X, SR_H - 0.5, SR_Z - SR_D / 2 + 0.3);
  root.add(rackStatusLed);

  // Server room glow light (subtle green/white from LEDs)
  const serverGlow = new THREE.PointLight(0x80ff80, 0.4, 30, 2);
  serverGlow.position.set(SR_X + 2, SR_H / 2, SR_Z - 3);
  root.add(serverGlow);

  // ============================================================
  // MONITORS (3 monitors, each on its own stand sitting ON the desk)
  // Center: ultrawide (16 wide x 7 tall, ~1.6m) — flat, facing user
  // Left: standard (11 wide x 7 tall, ~1.1m) — angled ~18° toward user
  // Right: standard (11 wide x 7 tall, ~1.1m) — angled ~-18° toward user
  // All bases at Z=26 (back of desk, away from keyboard at Z=20)
  // Each monitor has: compact base on desk + slim neck + monitor head with slight downward tilt
  // ============================================================

  // Helper: build a full monitor stand + monitor
  // baseX/Z = where the stand base sits on the desk
  // monW/monH = screen dimensions (realistic: 16 wide = 1.6m ultrawide, 11 wide = 1.1m standard)
  // yAngle = Y rotation (radians) for side monitors angled toward user
  // xTilt = X rotation (radians) for slight downward tilt
  // screenMat = the emissive screen material
  function buildMonitor(
    baseX: number, baseZ: number,
    monW: number, monH: number,
    yAngle: number, xTilt: number,
    screenMat: THREE.Material,
    neckHeight: number,
  ) {
    const monGroup = new THREE.Group();
    monGroup.position.set(baseX, DESK_Y, baseZ);
    monGroup.rotation.y = yAngle;

    // --- Stand base (compact oval disc on desk, ~0.4m diameter) ---
    const standBase = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(2, 2.3, 0.5, 24),
      standMat
    ));
    standBase.position.set(0, 0.25, 0);
    monGroup.add(standBase);

    // --- Stand neck (slim vertical post, slightly tapered) ---
    // Neck is BEHIND the monitor (local +Z = back of monitor, toward the wall).
    // The screen faces local -Z (toward the chair/user at lower Z).
    const neckBottomY = 0.5;
    const neck = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.7, neckHeight, 12),
      standMat
    ));
    neck.position.set(0, neckBottomY + neckHeight / 2, 0.5); // neck behind monitor center (+Z)
    monGroup.add(neck);

    // --- VESA mount plate (small rectangle where neck meets back of monitor) ---
    const vesa = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(2, 2, 0.4),
      standMat
    ));
    const monCenterY = neckBottomY + neckHeight;
    vesa.position.set(0, monCenterY, 0.7); // VESA on back of monitor (+Z)
    monGroup.add(vesa);

    // --- Monitor head group (so we can tilt the whole head around its center) ---
    const headGroup = new THREE.Group();
    headGroup.position.set(0, monCenterY, 0);
    headGroup.rotation.x = xTilt; // slight downward tilt

    // Bezel (slim frame around screen)
    const bezel = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(monW + 0.6, monH + 0.6, 0.8),
      bezelMat
    ));
    headGroup.add(bezel);

    // Screen surface — front face points toward -Z (toward the chair/user).
    // THREE.PlaneGeometry faces +Z by default, so rotate 180° around Y to face -Z.
    // Position the screen at local -Z (front of monitor, away from the neck/VESA).
    const screen = addShadow(new THREE.Mesh(
      new THREE.PlaneGeometry(monW, monH),
      screenMat
    ));
    screen.position.set(0, 0, -0.45); // front of bezel (toward user)
    screen.rotation.y = Math.PI;       // flip to face -Z (toward chair)
    headGroup.add(screen);

    // Branding strip at bottom of bezel front face (with the screen)
    const branding = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(monW * 0.12, 0.25, 0.05),
      new THREE.MeshStandardMaterial({ color: 0xa8acb4, metalness: 0.8, roughness: 0.3 })
    ));
    branding.position.set(0, -monH / 2 - 0.25, -0.45);
    headGroup.add(branding);

    monGroup.add(headGroup);
    root.add(monGroup);

    return { monGroup, headGroup, monCenterY };
  }

  // --- Center monitor (ultrawide, flat, taller neck so it's at eye level) ---
  // 16 wide × 7 tall (~1.6m × 0.7m — proportional 21:9 ultrawide)
  const centerMonW = 16, centerMonH = 7;
  const centerInfo = buildMonitor(
    0, 42,                    // base at back of desk (pushed closer to wall)
    centerMonW, centerMonH,   // screen size
    0,                        // no Y rotation (facing user)
    -0.06,                    // slight downward tilt (~3.4°)
    centerScreenMat,          // IDE code screen
    11,                       // neck height
  );

  // --- Left monitor (angled toward user, flanking center) ---
  // 11 wide × 7 tall (~1.1m × 0.7m — proportional 16:9 standard)
  // Screen faces local -Z. To angle the left monitor toward the user (who is at lower-Z, center-X),
  // we rotate the monitor clockwise around Y (negative rotation) so the screen turns to face
  // the lower-left (toward the user). Negative Y rotation points local -Z toward (-sin, -cos) = (-, -).
  const sideMonW = 11, sideMonH = 7;
  const leftInfo = buildMonitor(
    -14, 42,                  // base shifted left, at back of desk
    sideMonW, sideMonH,
    -0.45,                    // ~-26° Y rotation — screen faces lower-left (toward user)
    -0.06,                    // slight downward tilt
    leftScreenMat,            // dashboard screen
    10,                       // neck height (slightly shorter than center)
  );

  // --- Right monitor (angled toward user, flanking center) ---
  // Positive Y rotation points local -Z toward (+sin, -cos) = (+, -) = lower-right (toward user).
  const rightInfo = buildMonitor(
    14, 42,                   // base shifted right, at back of desk
    sideMonW, sideMonH,
    0.45,                     // ~+26° Y rotation — screen faces lower-right (toward user)
    -0.06,                    // slight downward tilt
    rightScreenMat,           // wallpaper screen
    10,                       // neck height
  );

  // Monitor screen glow lights (subtle backlight bleed)
  const centerGlow = new THREE.PointLight(0x6080ff, 0.4, 25, 2);
  centerGlow.position.set(0, DESK_Y + 11, 41);
  root.add(centerGlow);
  const leftGlow = new THREE.PointLight(0x80a060, 0.25, 18, 2);
  leftGlow.position.set(-14, DESK_Y + 10, 41);
  root.add(leftGlow);
  const rightGlow = new THREE.PointLight(0x6080a0, 0.25, 18, 2);
  rightGlow.position.set(14, DESK_Y + 10, 41);
  root.add(rightGlow);

  // ============================================================
  // KEYBOARD (mechanical, full-size, on desk in front of center monitor)
  // Scaled down to realistic size (~0.45m wide) and rotated 180° so the
  // number row faces the monitor (+Z) and the spacebar faces the player (-Z).
  // ============================================================
  const KB_W = 18, KB_D = 6.5;
  const kbFrame = addShadow(new THREE.Mesh(new THREE.BoxGeometry(KB_W, 1.5, KB_D), kbFrameMat));
  kbFrame.position.set(0, DESK_Y + 0.75, 36);
  root.add(kbFrame);
  // Keycap surface (textured with full QWERTY layout, rotated 180° to face the chair)
  const keycaps = addShadow(new THREE.Mesh(new THREE.BoxGeometry(KB_W - 1, 0.5, KB_D - 1), keycapMat));
  keycaps.position.set(0, DESK_Y + 1.5, 36);
  keycaps.rotation.y = Math.PI; // flip 180° so number row faces +Z (monitor), spacebar faces -Z (player)
  root.add(keycaps);
  // RGB underglow
  const kbRgb = addShadow(new THREE.Mesh(new THREE.BoxGeometry(KB_W - 2, 0.3, 0.3), rgbCyanMat));
  kbRgb.position.set(0, DESK_Y + 0.3, 36 - KB_D / 2 + 0.5);
  root.add(kbRgb);
  const kbRgb2 = addShadow(new THREE.Mesh(new THREE.BoxGeometry(KB_W - 2, 0.3, 0.3), rgbMagentaMat));
  kbRgb2.position.set(0, DESK_Y + 0.3, 36 + KB_D / 2 - 0.5);
  root.add(kbRgb2);
  // Keyboard RGB light
  const kbLight = new THREE.PointLight(0x00d9ff, 0.3, 15, 2);
  kbLight.position.set(0, DESK_Y + 1, 33);
  root.add(kbLight);

  // ============================================================
  // MOUSE (gaming mouse, right of keyboard)
  // ============================================================
  const mouseBody = addShadow(new THREE.Mesh(new THREE.SphereGeometry(2, 12, 8), mouseMat));
  mouseBody.scale.set(1, 0.5, 1.5);
  mouseBody.position.set(14, DESK_Y + 1.2, 36);
  root.add(mouseBody);
  // Mouse wheel
  const mouseWheel = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 1, 8), rgbMagentaMat));
  mouseWheel.rotation.z = Math.PI / 2;
  mouseWheel.position.set(14, DESK_Y + 1.8, 19.5);
  root.add(mouseWheel);
  // Mouse RGB logo
  const mouseRgb = addShadow(new THREE.Mesh(new THREE.CircleGeometry(0.4, 8), rgbPurpleMat));
  mouseRgb.position.set(14, DESK_Y + 1.6, 19);
  mouseRgb.rotation.x = -Math.PI / 2;
  root.add(mouseRgb);

  // ============================================================
  // MOUSEPAD (large, under keyboard and mouse)
  // ============================================================
  const mousepad = addShadow(new THREE.Mesh(new THREE.PlaneGeometry(40, 12), mousepadMat));
  mousepad.rotation.x = -Math.PI / 2;
  mousepad.position.set(0, DESK_Y + 0.05, 36);
  root.add(mousepad);

  // ============================================================
  // HEADPHONES (on left side of desk, on a stand)
  // Realistic size: headband ~0.18m wide arc, ear cups ~0.09m diameter
  // ============================================================
  // Stand
  const hpStandBase = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(1.8, 2, 0.6, 16), darkPlasticMat));
  hpStandBase.position.set(-20, DESK_Y + 0.3, 22);
  root.add(hpStandBase);
  const hpStandPole = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 3.5, 8), darkPlasticMat));
  hpStandPole.position.set(-20, DESK_Y + 2.3, 22);
  root.add(hpStandPole);
  const hpStandTop = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.5, 0.5, 12), darkPlasticMat));
  hpStandTop.position.set(-20, DESK_Y + 4.3, 22);
  root.add(hpStandTop);
  // Headphones on stand — headband is a half-torus (radius 1.8 = ~0.18m arc, tube 0.18)
  const headband = addShadow(new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.18, 8, 16, Math.PI), headbandMat));
  headband.position.set(-20, DESK_Y + 4, 22);
  headband.rotation.x = Math.PI / 2;
  headband.rotation.z = Math.PI;
  root.add(headband);
  // Left ear cup (radius 0.9 = ~0.09m diameter, depth 0.7)
  const earCupL = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.7, 16), earCupMat));
  earCupL.rotation.z = Math.PI / 2;
  earCupL.position.set(-21.8, DESK_Y + 4, 22);
  root.add(earCupL);
  const earPadL = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.9, 16), earPadMat));
  earPadL.rotation.z = Math.PI / 2;
  earPadL.position.set(-21.6, DESK_Y + 4, 22);
  root.add(earPadL);
  // Right ear cup
  const earCupR = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.7, 16), earCupMat));
  earCupR.rotation.z = Math.PI / 2;
  earCupR.position.set(-18.2, DESK_Y + 4, 22);
  root.add(earCupR);
  const earPadR = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.9, 16), earPadMat));
  earPadR.rotation.z = Math.PI / 2;
  earPadR.position.set(-18.4, DESK_Y + 4, 22);
  root.add(earPadR);
  // RGB rings on ear cups (outer edge)
  const earRgbL = addShadow(new THREE.Mesh(new THREE.RingGeometry(0.95, 1.05, 16), rgbGreenMat));
  earRgbL.position.set(-22.2, DESK_Y + 4, 22);
  earRgbL.rotation.y = Math.PI / 2;
  root.add(earRgbL);
  const earRgbR = addShadow(new THREE.Mesh(new THREE.RingGeometry(0.95, 1.05, 16), rgbGreenMat));
  earRgbR.position.set(-17.8, DESK_Y + 4, 22);
  earRgbR.rotation.y = Math.PI / 2;
  root.add(earRgbR);

  // ============================================================
  // DESK LAMP (articulated, on right side of desk)
  // ============================================================
  const lampBase = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(3, 3.5, 1, 16), lampMat));
  lampBase.position.set(22, DESK_Y + 0.5, 24);
  root.add(lampBase);
  const lampArmLower = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 10, 8), lampMat));
  lampArmLower.position.set(22, DESK_Y + 5.5, 24);
  lampArmLower.rotation.z = 0.3;
  root.add(lampArmLower);
  const lampJoint = addShadow(new THREE.Mesh(new THREE.SphereGeometry(0.8, 8, 8), lampMat));
  lampJoint.position.set(24.8, DESK_Y + 10, 24);
  root.add(lampJoint);
  const lampArmUpper = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 8, 8), lampMat));
  lampArmUpper.position.set(21, DESK_Y + 12, 24);
  lampArmUpper.rotation.z = -0.5;
  root.add(lampArmUpper);
  const lampHead = addShadow(new THREE.Mesh(new THREE.ConeGeometry(2.5, 3, 12), lampMat));
  lampHead.position.set(18, DESK_Y + 13, 24);
  lampHead.rotation.z = Math.PI / 2 + 0.3;
  root.add(lampHead);
  // Lamp light (emissive disc inside head)
  const lampBulb = addShadow(new THREE.Mesh(new THREE.CircleGeometry(2, 12), lampShadeMat));
  lampBulb.position.set(16.5, DESK_Y + 12.5, 24);
  lampBulb.rotation.z = 0.3;
  root.add(lampBulb);
  const lampLight = new THREE.PointLight(0xfff0a0, 0.8, 30, 2);
  lampLight.position.set(15, DESK_Y + 11, 24);
  root.add(lampLight);

  // ============================================================
  // WALL-MOUNTED SPEAKERS (4x in all 4 top corners of the room, angled downward)
  // Detailed bookshelf speakers with: beveled cabinet edges, dome tweeter with
  // waveguide, woofer with cone/dust cap/surround, mounting screws, grille frame,
  // branding badge, bass reflex port, binding posts on back, RGB accent.
  // ============================================================
  const corners: Array<{ x: number; z: number; y: number; yaw: number; label: string }> = [
    // Speakers in all 4 top corners of the larger room (120x90x45).
    // Mounted high on the walls (Y=33) pointing toward the room center (0, 8, 0).
    // Speaker driver face is at local -Z. After rotation.y = yaw, local -Z maps to
    // world (-sin(yaw), 0, -cos(yaw)). We want each speaker to face the room center.
    //   FL (-57,-43) must face +X+Z → yaw = -3π/4
    //   FR ( 57,-43) must face -X+Z → yaw = 3π/4
    //   BL (-57, 43) must face +X-Z → yaw = -π/4 (raised to clear server rack top at Y=24)
    //   BR ( 57, 43) must face -X-Z → yaw = π/4
    { x: -57, z: -43, y: 33, yaw: -Math.PI * 0.75,    label: 'FL' },  // front-left, faces +X+Z (toward room center)
    { x:  57, z: -43, y: 33, yaw: Math.PI * 0.75,     label: 'FR' },  // front-right, faces -X+Z
    { x: -57, z:  43, y: 36, yaw: -Math.PI / 4,       label: 'BL' },  // back-left (raised to clear server rack), faces +X-Z
    { x:  57, z:  43, y: 33, yaw: Math.PI / 4,        label: 'BR' },  // back-right, faces -X-Z
  ];

  // Driver detail materials (reused across all 4 speakers)
  const coneMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1e, metalness: 0.2, roughness: 0.7 }); // woofer cone (dark)
  const dustCapMat = new THREE.MeshStandardMaterial({ color: 0x2a2a30, metalness: 0.3, roughness: 0.5 }); // dust cap (slightly lighter)
  const surroundMat = new THREE.MeshStandardMaterial({ color: 0x3a3a3e, metalness: 0.1, roughness: 0.8 }); // foam surround (gray)
  const tweeterDomeMat = new THREE.MeshStandardMaterial({ color: 0xc0c0c8, metalness: 0.9, roughness: 0.15 }); // silk dome tweeter (silver)
  const tweeterFlangeMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1e, metalness: 0.4, roughness: 0.5 }); // tweeter flange (black)
  const screwMat = new THREE.MeshStandardMaterial({ color: 0x888892, metalness: 0.85, roughness: 0.3 }); // mounting screws (silver)
  const badgeMat = new THREE.MeshStandardMaterial({ color: 0xa8acb4, metalness: 0.8, roughness: 0.25 }); // branding badge (brushed silver)
  const grilleFrameMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2e, metalness: 0.2, roughness: 0.7 }); // grille frame (dark)
  const portMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, metalness: 0.1, roughness: 0.9 }); // port tube (black)
  const terminalMat = new THREE.MeshStandardMaterial({ color: 0xc09545, metalness: 0.9, roughness: 0.25 }); // binding posts (brass)
  const edgeTrimMat = new THREE.MeshStandardMaterial({ color: 0x2a1810, metalness: 0.1, roughness: 0.7 }); // cabinet edge trim (dark wood)

  for (const c of corners) {
    const spkGroup = new THREE.Group();
    spkGroup.position.set(c.x, c.y, c.z);
    spkGroup.rotation.y = c.yaw;
    spkGroup.rotation.x = -0.5; // ~29° downward tilt

    // --- Mounting bracket (metal plate against the wall) ---
    const bracket = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 3, 3),
      new THREE.MeshStandardMaterial({ color: 0x3a3a40, metalness: 0.7, roughness: 0.3 })
    ));
    bracket.position.set(0, 0, 2.2); // behind the speaker (toward wall)
    spkGroup.add(bracket);
    // Bracket mounting screws (4x on the bracket plate)
    for (const [bx, bz] of [[-1.2, 1.2], [1.2, 1.2], [-1.2, -1.2], [1.2, -1.2]]) {
      const bscrew = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.1, 8), screwMat));
      bscrew.rotation.x = Math.PI / 2;
      bscrew.position.set(bx, bz, 2.05);
      spkGroup.add(bscrew);
    }
    // Articulated arm (from bracket to speaker body)
    const arm = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.6, 1.5),
      new THREE.MeshStandardMaterial({ color: 0x3a3a40, metalness: 0.7, roughness: 0.3 })
    ));
    arm.position.set(0, 0, 1.4);
    spkGroup.add(arm);

    // --- Speaker cabinet (walnut wood body with beveled edge trim) ---
    const body = addShadow(new THREE.Mesh(new THREE.BoxGeometry(4, 7, 4), speakerMat));
    spkGroup.add(body);

    // Cabinet edge trim — thin dark strips along the front face edges
    // 2 vertical edge trims on the front face corners
    for (const ex of [-1.95, 1.95]) {
      const vtrim = addShadow(new THREE.Mesh(
        new THREE.BoxGeometry(0.15, 7, 0.15),
        edgeTrimMat
      ));
      vtrim.position.set(ex, 0, -1.95);
      spkGroup.add(vtrim);
    }
    // Top and bottom horizontal edge trims on front face
    for (const ey of [-3.45, 3.45]) {
      const htrim = addShadow(new THREE.Mesh(
        new THREE.BoxGeometry(4, 0.15, 0.15),
        edgeTrimMat
      ));
      htrim.position.set(0, ey, -1.95);
      spkGroup.add(htrim);
    }

    // --- Front baffle (recessed face that holds the drivers) ---
    const baffle = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(3.6, 6.6, 0.2),
      new THREE.MeshStandardMaterial({ color: 0x1a1a1e, metalness: 0.2, roughness: 0.6 })
    ));
    baffle.position.set(0, 0, -2); // front face
    spkGroup.add(baffle);

    // --- Tweeter (silk dome tweeter with flange and waveguide) ---
    // Flange (flat mounting plate around the dome)
    const tweeterFlange = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(0.8, 0.8, 0.1, 24),
      tweeterFlangeMat
    ));
    tweeterFlange.rotation.x = Math.PI / 2;
    tweeterFlange.position.set(0, 2.0, -2.1);
    spkGroup.add(tweeterFlange);
    // Waveguide (shallow recessed horn around the dome)
    const waveguide = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(0.65, 0.4, 0.15, 24),
      new THREE.MeshStandardMaterial({ color: 0x0a0a0a, metalness: 0.3, roughness: 0.4 })
    ));
    waveguide.rotation.x = Math.PI / 2;
    waveguide.position.set(0, 2.0, -2.15);
    spkGroup.add(waveguide);
    // Silk dome (hemisphere — the actual tweeter diaphragm)
    const dome = addShadow(new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2),
      tweeterDomeMat
    ));
    dome.rotation.x = -Math.PI / 2; // face -Z (into room)
    dome.position.set(0, 2.0, -2.22);
    spkGroup.add(dome);
    // Tweeter mounting screws (4x around the flange)
    for (let s = 0; s < 4; s++) {
      const ang = (s / 4) * Math.PI * 2 + Math.PI / 4;
      const tscrew = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.08, 6), screwMat));
      tscrew.rotation.x = Math.PI / 2;
      tscrew.position.set(Math.cos(ang) * 0.7, 2.0 + Math.sin(ang) * 0.7, -2.16);
      spkGroup.add(tscrew);
    }

    // --- Woofer (driver with cone, dust cap, surround, and basket screws) ---
    // Surround (foam ring — outermost ring of the driver)
    const surround = addShadow(new THREE.Mesh(
      new THREE.TorusGeometry(1.1, 0.18, 8, 24),
      surroundMat
    ));
    surround.position.set(0, -1.0, -2.12);
    spkGroup.add(surround);
    // Cone (the main diaphragm — slightly conical, wider at surround, narrower at dust cap)
    const cone = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 1.05, 0.25, 24),
      coneMat
    ));
    cone.rotation.x = Math.PI / 2;
    cone.position.set(0, -1.0, -2.18);
    spkGroup.add(cone);
    // Dust cap (small dome in the center of the cone)
    const dustCap = addShadow(new THREE.Mesh(
      new THREE.SphereGeometry(0.4, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2),
      dustCapMat
    ));
    dustCap.rotation.x = -Math.PI / 2;
    dustCap.position.set(0, -1.0, -2.32);
    spkGroup.add(dustCap);
    // Basket mounting screws (6x around the woofer)
    for (let s = 0; s < 6; s++) {
      const ang = (s / 6) * Math.PI * 2;
      const wscrew = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.08, 6), screwMat));
      wscrew.rotation.x = Math.PI / 2;
      wscrew.position.set(Math.cos(ang) * 1.3, -1.0 + Math.sin(ang) * 1.3, -2.14);
      spkGroup.add(wscrew);
    }

    // --- Branding badge (small metallic plate below the tweeter) ---
    const badge = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.3, 0.05),
      badgeMat
    ));
    badge.position.set(0, 1.0, -2.12);
    spkGroup.add(badge);
    // Badge text mark (small dark line on the badge — simulated logo)
    const badgeMark = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.08, 0.02),
      new THREE.MeshStandardMaterial({ color: 0x1a1a1e, metalness: 0.3, roughness: 0.5 })
    ));
    badgeMark.position.set(0, 1.0, -2.16);
    spkGroup.add(badgeMark);

    // --- Bass reflex port (front-firing tube below the woofer) ---
    // Outer flange
    const portFlange = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(0.4, 0.4, 0.08, 16),
      new THREE.MeshStandardMaterial({ color: 0x2a2a2e, metalness: 0.3, roughness: 0.5 })
    ));
    portFlange.rotation.x = Math.PI / 2;
    portFlange.position.set(0, -2.5, -2.06);
    spkGroup.add(portFlange);
    // Port tube (extends into the cabinet)
    const portTube = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.3, 1.2, 16),
      portMat
    ));
    portTube.rotation.x = Math.PI / 2;
    portTube.position.set(0, -2.5, -1.5);
    spkGroup.add(portTube);
    // Port interior (dark hole visible from front)
    const portHole = addShadow(new THREE.Mesh(
      new THREE.CircleGeometry(0.28, 16),
      new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 1.0 })
    ));
    portHole.position.set(0, -2.5, -2.11);
    spkGroup.add(portHole);

    // --- RGB accent strip along the bottom of the speaker ---
    const spkRgb = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(3.8, 0.2, 0.15),
      c.label.startsWith('F') ? rgbCyanMat : rgbPurpleMat
    ));
    spkRgb.position.set(0, -3.3, -1.9);
    spkGroup.add(spkRgb);

    // --- Grille frame (removable cloth-covered frame — sits over the drivers) ---
    // Outer frame (thin border around the front face)
    const grilleTop = addShadow(new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.15, 0.1), grilleFrameMat));
    grilleTop.position.set(0, 3.15, -2.25);
    spkGroup.add(grilleTop);
    const grilleBot = addShadow(new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.15, 0.1), grilleFrameMat));
    grilleBot.position.set(0, -3.15, -2.25);
    spkGroup.add(grilleBot);
    const grilleLeft = addShadow(new THREE.Mesh(new THREE.BoxGeometry(0.15, 6.3, 0.1), grilleFrameMat));
    grilleLeft.position.set(-1.65, 0, -2.25);
    spkGroup.add(grilleLeft);
    const grilleRight = addShadow(new THREE.Mesh(new THREE.BoxGeometry(0.15, 6.3, 0.1), grilleFrameMat));
    grilleRight.position.set(1.65, 0, -2.25);
    spkGroup.add(grilleRight);
    // Grille cloth (translucent dark mesh — simulates speaker fabric)
    // Using a semi-transparent dark material so the drivers are faintly visible behind it
    const grilleCloth = addShadow(new THREE.Mesh(
      new THREE.PlaneGeometry(3.3, 6.2),
      new THREE.MeshStandardMaterial({
        color: 0x1a1a1e, metalness: 0.0, roughness: 0.95,
        transparent: true, opacity: 0.55,
      })
    ));
    grilleCloth.position.set(0, 0, -2.28);
    spkGroup.add(grilleCloth);
    // Grille attachment pegs (4x small dots at corners)
    for (const [px, py] of [[-1.5, 3.0], [1.5, 3.0], [-1.5, -3.0], [1.5, -3.0]] as [number, number][]) {
      const peg = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.1, 8), grilleFrameMat));
      peg.rotation.x = Math.PI / 2;
      peg.position.set(px, py, -2.22);
      spkGroup.add(peg);
    }

    // --- Binding posts on back (speaker wire terminals) ---
    // Terminal plate on the back of the cabinet
    const termPlate = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 1, 0.1),
      new THREE.MeshStandardMaterial({ color: 0x2a2a2e, metalness: 0.3, roughness: 0.6 })
    ));
    termPlate.position.set(0, -1, 2.05); // back of speaker (+Z)
    spkGroup.add(termPlate);
    // 2 binding posts (red + black, brass-colored caps)
    for (let p = 0; p < 2; p++) {
      const post = addShadow(new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.18, 0.25, 12),
        terminalMat
      ));
      post.rotation.x = Math.PI / 2;
      post.position.set(-0.3 + p * 0.6, -1, 2.18);
      spkGroup.add(post);
      // Post cap center (red/black indicator)
      const cap = addShadow(new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 0.05, 8),
        new THREE.MeshStandardMaterial({ color: p === 0 ? 0xcc2020 : 0x202020, roughness: 0.5 })
      ));
      cap.rotation.x = Math.PI / 2;
      cap.position.set(-0.3 + p * 0.6, -1, 2.33);
      spkGroup.add(cap);
    }

    root.add(spkGroup);
  }

  // ============================================================
  // COFFEE MUG (on right side of desk)
  // ============================================================
  const mug = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.3, 3, 16), mugMat));
  mug.position.set(18, DESK_Y + 1.5, 22);
  root.add(mug);
  const mugHandle = addShadow(new THREE.Mesh(new THREE.TorusGeometry(1, 0.3, 6, 12), mugMat));
  mugHandle.position.set(19.8, DESK_Y + 1.5, 22);
  mugHandle.rotation.y = Math.PI / 2;
  root.add(mugHandle);
  // Coffee (dark liquid)
  const coffee = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 0.3, 16), new THREE.MeshStandardMaterial({ color: 0x3a1a0a, roughness: 0.2 })));
  coffee.position.set(18, DESK_Y + 2.7, 22);
  root.add(coffee);

  // ============================================================
  // BOOKS (stack of 4, on left side desk)
  // ============================================================
  for (let i = 0; i < 4; i++) {
    const book = addShadow(new THREE.Mesh(new THREE.BoxGeometry(6, 1.2, 4), bookMats[i]));
    book.position.set(-15, DESK_Y + 0.6 + i * 1.2, 22);
    book.rotation.y = (Math.random() - 0.5) * 0.1;
    root.add(book);
  }

  // ============================================================
  // PLANT (small succulent, on right side desk)
  // ============================================================
  const plantPot = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(2, 1.5, 3, 12), potMat));
  plantPot.position.set(20, DESK_Y + 1.5, 26);
  root.add(plantPot);
  // Soil
  const soil = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 0.3, 12), new THREE.MeshStandardMaterial({ color: 0x2a1a0a, roughness: 0.9 })));
  soil.position.set(20, DESK_Y + 2.8, 26);
  root.add(soil);
  // Succulent leaves
  for (let i = 0; i < 8; i++) {
    const leaf = addShadow(new THREE.Mesh(new THREE.ConeGeometry(0.6, 3, 6), leafMat));
    const ang = (i / 8) * Math.PI * 2;
    leaf.position.set(20 + Math.cos(ang) * 0.8, DESK_Y + 4, 26 + Math.sin(ang) * 0.8);
    leaf.rotation.z = Math.cos(ang) * 0.3;
    leaf.rotation.x = -Math.sin(ang) * 0.3;
    root.add(leaf);
  }
  // Center leaf
  const centerLeaf = addShadow(new THREE.Mesh(new THREE.ConeGeometry(0.7, 3.5, 6), leafMat));
  centerLeaf.position.set(20, DESK_Y + 4.5, 26);
  root.add(centerLeaf);

  // ============================================================
  // HERMAN MILLER EMBODY GAMING CHAIR
  // Distinctive features: pixelated back support (matrix of "pixels"),
  // narrow tapered backrest, exposed aluminum Y-frame, no headrest,
  // tiered seat with waterfall front edge, 4D armrests.
  // Position: X=0, Z=10 (in front of keyboard, facing the monitors at +Z)
  // ============================================================
  const CHAIR_X = 0, CHAIR_Z = 26; // shifted forward with the desk

  // Embody-specific materials
  // The gaming version has a graphite/dark gray breathable fabric with subtle sheen
  const embodyFabricTex = makeFabricTexture('#3a3a42', '#2a2a32');
  embodyFabricTex.map.repeat.set(2, 3); embodyFabricTex.bumpMap.repeat.set(2, 3);
  const embodyMat = new THREE.MeshStandardMaterial({
    map: embodyFabricTex.map, bumpMap: embodyFabricTex.bumpMap, bumpScale: 0.03,
    metalness: 0.1, roughness: 0.7,
  });
  // Pixel support material — slightly different shade for the backrest pixels
  const pixelMat = new THREE.MeshStandardMaterial({
    color: 0x4a4a52, metalness: 0.15, roughness: 0.65,
  });
  // Graphite-colored frame (dark aluminum, not pure black)
  const embodyFrameMat = new THREE.MeshStandardMaterial({ color: 0x3a3a40, metalness: 0.75, roughness: 0.35 });

  // === 5-star base (graphite aluminum, sleeker than the old chair) ===
  for (let i = 0; i < 5; i++) {
    const ang = (i / 5) * Math.PI * 2;
    // Tapered leg — wider at the wheel end, narrower at the hub
    const leg = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(0.4, 0.6, 7, 8),
      embodyFrameMat
    ));
    leg.rotation.z = Math.PI / 2;
    leg.rotation.y = -ang;
    leg.position.set(CHAIR_X + Math.cos(ang) * 3.5, 1.2, CHAIR_Z + Math.sin(ang) * 3.5);
    root.add(leg);
    // Caster wheel (smaller, more refined)
    const wheel = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(0.6, 0.6, 0.8, 10),
      new THREE.MeshStandardMaterial({ color: 0x2a2a2e, metalness: 0.3, roughness: 0.7 })
    ));
    wheel.rotation.z = Math.PI / 2;
    wheel.rotation.y = ang;
    wheel.position.set(CHAIR_X + Math.cos(ang) * 6.5, 0.6, CHAIR_Z + Math.sin(ang) * 6.5);
    root.add(wheel);
  }
  // Central hub (where the 5 legs meet)
  const hub = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(1.2, 1.5, 1.5, 16),
    embodyFrameMat
  ));
  hub.position.set(CHAIR_X, 1.2, CHAIR_Z);
  root.add(hub);

  // === Gas cylinder column (sleek, graphite) ===
  const chairColumn = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(0.6, 0.7, 4, 16),
    embodyFrameMat
  ));
  chairColumn.position.set(CHAIR_X, 4, CHAIR_Z);
  root.add(chairColumn);

  // === Seat — tiered with waterfall front edge ===
  // The Embody seat has a distinctive tiered/tapered shape.
  // Main seat pan (slightly tapered — narrower at back, wider at front)
  const seatPan = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(12, 1.2, 11),
    embodyMat
  ));
  seatPan.position.set(CHAIR_X, 6.5, CHAIR_Z);
  root.add(seatPan);
  // Front waterfall edge (rounded front lip for leg circulation)
  const seatFront = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(0.6, 0.6, 12, 12, 1, false, 0, Math.PI),
    embodyMat
  ));
  seatFront.rotation.z = Math.PI / 2;
  seatFront.rotation.y = Math.PI / 2;
  seatFront.position.set(CHAIR_X, 6.5, CHAIR_Z + 5.5);
  root.add(seatFront);
  // Seat pixel layers (3 tiers — the Embody seat has visible layering)
  for (let tier = 0; tier < 3; tier++) {
    const tierW = 11 - tier * 0.5;
    const tierD = 10 - tier * 0.5;
    const tierMesh = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(tierW, 0.4, tierD),
      pixelMat
    ));
    tierMesh.position.set(CHAIR_X, 7 + tier * 0.4, CHAIR_Z);
    root.add(tierMesh);
  }

  // === Backrest — the iconic Embody "pixelated" back ===
  // The back is a narrow tapered shape (wider at shoulders, narrower at lumbar)
  // with a matrix of small "pixels" (support points) visible on the front.
  const backGroup = new THREE.Group();
  backGroup.position.set(CHAIR_X, 14, CHAIR_Z - 4.5);
  backGroup.rotation.x = -0.12; // slight recline

  // Back frame — tapered shape using a thin box (wider at top)
  // We approximate the taper with 3 stacked segments of decreasing width
  const backFrameBottom = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(9, 4, 1.5),
    embodyMat
  ));
  backFrameBottom.position.set(0, -5, 0);
  backGroup.add(backFrameBottom);
  const backFrameMid = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(10, 4, 1.5),
    embodyMat
  ));
  backFrameMid.position.set(0, -1, 0);
  backGroup.add(backFrameMid);
  const backFrameTop = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(9, 4, 1.5),
    embodyMat
  ));
  backFrameTop.position.set(0, 3, 0);
  backGroup.add(backFrameTop);

  // Pixel matrix — the signature Embody feature.
  // A grid of small rounded squares covering the backrest front face.
  // 6 columns × 8 rows = 48 pixels
  for (let col = 0; col < 6; col++) {
    for (let row = 0; row < 8; row++) {
      // Skip pixels at the top corners (tapered shape) for a more organic look
      if (row >= 6 && (col === 0 || col === 5)) continue;
      if (row >= 7 && (col === 1 || col === 4)) continue;
      const px = -4 + col * 1.6;
      const py = -6 + row * 1.6;
      const pixel = addShadow(new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 1.2, 0.3),
        pixelMat
      ));
      pixel.position.set(px, py, -0.9); // front face of backrest (toward user, -Z)
      // Slight Z variation for a textured, supportive look
      pixel.position.z = -0.9 - (Math.random() * 0.15);
      backGroup.add(pixel);
    }
  }

  // Exposed Y-frame spine (the Embody has a visible central spine on the back)
  const spine = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 12, 0.5),
    embodyFrameMat
  ));
  spine.position.set(0, -1, 0.9); // back side of the backrest
  backGroup.add(spine);
  // Spine accent (silver stripe down the middle — gaming edition)
  const spineAccent = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 12, 0.55),
    new THREE.MeshStandardMaterial({ color: 0x8a8a92, metalness: 0.8, roughness: 0.25 })
  ));
  spineAccent.position.set(0, -1, 0.95);
  backGroup.add(spineAccent);

  root.add(backGroup);

  // === 4D Armrests (2x) — adjustable, with pad ===
  // The Embody armrests have a vertical post + horizontal pad that can slide.
  for (const ax of [-7, 7]) {
    // Vertical post (graphite)
    const armrestPost = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(0.4, 0.4, 4, 10),
      embodyFrameMat
    ));
    armrestPost.position.set(CHAIR_X + ax, 8, CHAIR_Z);
    root.add(armrestPost);
    // Armrest pad (slightly wider, upholstered)
    const armrestPad = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 0.8, 4),
      pixelMat
    ));
    armrestPad.position.set(CHAIR_X + ax, 10.5, CHAIR_Z);
    root.add(armrestPad);
    // Armrest accent stripe (silver, gaming edition)
    const armAccent = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(1.9, 0.1, 4.1),
      new THREE.MeshStandardMaterial({ color: 0x8a8a92, metalness: 0.8, roughness: 0.25 })
    ));
    armAccent.position.set(CHAIR_X + ax, 10.2, CHAIR_Z);
    root.add(armAccent);
  }

  // === Lumbar support pad (visible on the front of the backrest, mid-height) ===
  const lumbarPad = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(7, 1.2, 0.4),
    new THREE.MeshStandardMaterial({ color: 0x5a5a62, metalness: 0.15, roughness: 0.6 })
  ));
  lumbarPad.position.set(CHAIR_X, 11.5, CHAIR_Z - 4.5 - 1.0); // front of backrest at lumbar height
  root.add(lumbarPad);

  // ============================================================
  // WALL ART / SHELF (on accent wall behind user — south wall Z=-44)
  // ============================================================
  // Floating shelf
  const shelf = addShadow(new THREE.Mesh(new THREE.BoxGeometry(20, 1, 3), deskMat));
  shelf.position.set(-10, 22, -44);
  root.add(shelf);
  // Items on shelf
  for (let i = 0; i < 3; i++) {
    const item = addShadow(new THREE.Mesh(new THREE.BoxGeometry(2, 4, 2), bookMats[i]));
    item.position.set(-15 + i * 4, 24.5, -44);
    root.add(item);
  }
  // Small plant on shelf
  const shelfPot = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1, 2, 8), potMat));
  shelfPot.position.set(-3, 23.5, -44);
  root.add(shelfPot);
  for (let i = 0; i < 5; i++) {
    const leaf = addShadow(new THREE.Mesh(new THREE.ConeGeometry(0.4, 2.5, 5), leafMat));
    const ang = (i / 5) * Math.PI * 2;
    leaf.position.set(-3 + Math.cos(ang) * 0.5, 25.5, -44 + Math.sin(ang) * 0.5);
    leaf.rotation.z = Math.cos(ang) * 0.4;
    root.add(leaf);
  }

  // Framed poster on accent wall
  const posterFrame = addShadow(new THREE.Mesh(new THREE.BoxGeometry(12, 8, 0.5), darkPlasticMat));
  posterFrame.position.set(15, 20, -44.5);
  root.add(posterFrame);
  const posterArt = addShadow(new THREE.Mesh(
    new THREE.PlaneGeometry(11, 7),
    new THREE.MeshStandardMaterial({
      color: 0x1a3a5a, emissive: 0x1a3a5a, emissiveIntensity: 0.2, roughness: 0.6,
    })
  ));
  posterArt.position.set(15, 20, -44.2);
  root.add(posterArt);

  // ============================================================
  // CABLES (subtle, from monitors to PC)
  // ============================================================
  const cableMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.8 });
  // Cable bundle from monitors to desk (behind center monitor)
  const cableBundle = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 6, 8), cableMat));
  cableBundle.position.set(0, DESK_Y + 5, 43);
  root.add(cableBundle);
  // Cable from PC (now at X=24, Z=24) down to floor
  const pcCable = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, DESK_Y, 8), cableMat));
  pcCable.position.set(24, DESK_Y / 2, 40);
  root.add(pcCable);

  // ============================================================
  // LIGHTING
  // ============================================================
  // Sun (warm afternoon light through window)
  const sun = new THREE.DirectionalLight(0xffe4b0, 1.4);
  sun.position.set(20, 40, 50);
  sun.castShadow = true;
  sun.shadow.mapSize.width = 2048;
  sun.shadow.mapSize.height = 2048;
  sun.shadow.camera.left = -70;
  sun.shadow.camera.right = 70;
  sun.shadow.camera.top = 60;
  sun.shadow.camera.bottom = -60;
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 150;
  sun.shadow.bias = -0.0005;
  root.add(sun);

  // Sky fill
  const hemi = new THREE.HemisphereLight(0x88aacc, 0x554035, 0.5);
  root.add(hemi);

  // Ambient
  const ambient = new THREE.AmbientLight(0xffffff, 0.3);
  root.add(ambient);

  // Ceiling light (room)
  const ceilingLight = new THREE.PointLight(0xfff4cc, 0.6, 80, 1.5);
  ceilingLight.position.set(0, 43, 0);
  root.add(ceilingLight);
  const ceilingFixture = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(4, 4, 1.5, 16),
    new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xfff4cc, emissiveIntensity: 0.8, metalness: 0.4, roughness: 0.3 })
  ));
  ceilingFixture.position.set(0, 44, 0);
  root.add(ceilingFixture);

  // ============================================================
  // OFFICE FLOOR RUG (under chair)
  // ============================================================
  const rugTex = makeCarpetTexture('#3a2a4a', '#5a4a6a');
  rugTex.map.repeat.set(2, 2); rugTex.bumpMap.repeat.set(2, 2);
  const rugMat = new THREE.MeshStandardMaterial({
    map: rugTex.map, bumpMap: rugTex.bumpMap, bumpScale: 0.04, roughness: 0.85,
  });
  const rug = addShadow(new THREE.Mesh(new THREE.PlaneGeometry(20, 16), rugMat));
  rug.rotation.x = -Math.PI / 2;
  rug.position.set(0, 0.05, 24); // shifted forward with the chair
  root.add(rug);

  return root;
}
