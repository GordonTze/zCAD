'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useCADStore } from '@/store/useCADStore';

import { createGeometryForPart } from '@/lib/cad/models';

// ---- Geometry generation is now in /lib/cad/models.ts ----
// That file contains 16 detailed procedural parts:
// - Gearbox housing (with ribs, bosses, breather, drain, sight glass, feet, nameplate)
// - Stepped shaft (with shoulders, keyways, retaining ring grooves, center drill)
// - Spur gear (involute teeth, hub, web, lightening holes, keyway)
// - Ball bearing (races, balls, cage, seals, branding)
// - Cover (gasket, ribs, oil fill, sight glass, counterbored holes)
// - Socket head cap screw (hex socket, threads, chamfer)
// - Jaw coupling (two hubs + elastomer spider with claws)
// - V-belt pulley (multi-groove, hub, lightening holes, set screws)
// - Compression spring (helical tube with ground ends)
// - Centrifugal impeller (curved blades, back shroud, balance holes)
// - Turbine wheel (radial blades, nose cone, back disc)
// - Robotic arm segment (joint, arm body, tool flange, cables)
// - L-bracket (sheet metal with bend relief, stiffening rib)
// - Heat sink (base, fins, copper U-tube heat pipes, thermal compound)
// - Inline-4 cylinder head (fins, 4 spark plugs, intake/exhaust ports)
// - Marine propeller (3 twisted blades, hub, pitch bolts)


interface SceneState {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;
  gridHelper: THREE.GridHelper;
  axesHelper: THREE.AxesHelper;
  edgeLines: THREE.LineSegments[];
  partMeshes: Map<string, THREE.Object3D>;
  raycaster: THREE.Raycaster;
  ambientLight: THREE.AmbientLight;
  hemiLight: THREE.HemisphereLight;
  ground: THREE.Mesh;
}

// ============================================================
// ViewCube — interactive 3D orientation cube (Blender/AutoCAD style)
// Shows a small isometric cube in the bottom-left corner with labeled faces.
// - Clicking a face snaps to that standard view
// - Dragging the cube orbits the camera in real-time (like grabbing the gizmo)
// - The cube rotates in real-time to match the current camera orientation
// ============================================================

// View presets: camera position for each face
const VIEW_PRESETS: Record<string, { pos: [number, number, number]; label: string }> = {
  TOP: { pos: [0, 250, 0.1],   label: 'TOP' },
  BTM: { pos: [0, -250, 0.1],  label: 'BTM' },
  FRO: { pos: [0, 0, 250],     label: 'FRONT' },
  BCK: { pos: [0, 0, -250],    label: 'BACK' },
  RGT: { pos: [250, 0, 0],     label: 'RIGHT' },
  LFT: { pos: [-250, 0, 0],    label: 'LEFT' },
  ISO: { pos: [180, 130, 180], label: 'ISO' },
};

function ViewCube() {
  const [activeView, setActiveView] = useState('ISO');
  const [hoveredFace, setHoveredFace] = useState<string | null>(null);
  const [liveRotation, setLiveRotation] = useState<string>('rotateX(-25deg) rotateY(-35deg)');
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const cubeRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mutable refs for drag state (avoids re-renders during drag)
  const dragState = useRef({
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    azimuth: 0,    // current camera azimuth in radians
    polar: Math.PI / 4, // current camera polar angle
    distance: 280,
    moved: false,   // track if drag moved enough to not trigger click
  });

  // Listen for live camera orientation updates from the animation loop
  // Refs to track animation/drag state without triggering re-renders
  const isAnimatingRef = useRef(false);
  const isDraggingRef = useRef(false);
  // Keep refs in sync with state
  isAnimatingRef.current = isAnimating;
  isDraggingRef.current = isDragging;

  useEffect(() => {
    const handleOrient = (e: Event) => {
      if (isAnimatingRef.current || isDraggingRef.current) return; // Don't override during click animation or drag
      const detail = (e as CustomEvent).detail;
      if (!detail) return;
      const { azimuth, polar, distance } = detail;
      // Store for drag initialization
      dragState.current.azimuth = azimuth;
      dragState.current.polar = polar;
      dragState.current.distance = distance;
      // Convert spherical camera angles to CSS cube rotation
      const rotY = -azimuth * (180 / Math.PI);
      const rotX = (polar - Math.PI / 2) * (180 / Math.PI);
      const newTransform = `rotateX(${rotX.toFixed(1)}deg) rotateY(${rotY.toFixed(1)}deg)`;
      if (cubeRef.current) {
        cubeRef.current.style.transform = newTransform;
      }
      setActiveView('');
    };
    window.addEventListener('viewcube-orient', handleOrient);
    return () => window.removeEventListener('viewcube-orient', handleOrient);
  }, []);

  // --- Drag-to-orbit logic ---
  // When user grabs the cube and drags, we directly orbit the camera by
  // dispatching 'viewcube-drag' events with new azimuth/polar values.
  // The main Viewport3D listens for these and positions the camera.

  const onPointerDown = (e: React.PointerEvent) => {
    // Capture pointer so we get move/up events even outside the cube
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragState.current.startX = e.clientX;
    dragState.current.startY = e.clientY;
    dragState.current.lastX = e.clientX;
    dragState.current.lastY = e.clientY;
    dragState.current.moved = false;
    setIsDragging(true);
    setIsAnimating(false); // cancel any pending click animation
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragState.current.lastX;
    const dy = e.clientY - dragState.current.lastY;
    dragState.current.lastX = e.clientX;
    dragState.current.lastY = e.clientY;

    // Track if we moved enough to suppress click
    const totalDx = Math.abs(e.clientX - dragState.current.startX);
    const totalDy = Math.abs(e.clientY - dragState.current.startY);
    if (totalDx > 4 || totalDy > 4) dragState.current.moved = true;

    // Sensitivity: how much cube drag maps to camera rotation
    // 1 pixel = ~0.5 degrees of rotation
    const SENSITIVITY = 0.008;

    // Update azimuth and polar based on drag delta
    // Dragging right = orbit camera counter-clockwise (azimuth decreases)
    // Dragging up = tilt camera up (polar decreases, looking more from top)
    dragState.current.azimuth -= dx * SENSITIVITY;
    dragState.current.polar -= dy * SENSITIVITY;

    // Clamp polar to avoid gimbal lock (0.01 to PI - 0.01)
    dragState.current.polar = Math.max(0.01, Math.min(Math.PI - 0.01, dragState.current.polar));

    // Convert to spherical camera position
    const dist = dragState.current.distance;
    const az = dragState.current.azimuth;
    const pol = dragState.current.polar;
    const camX = dist * Math.sin(pol) * Math.sin(az);
    const camY = dist * Math.cos(pol);
    const camZ = dist * Math.sin(pol) * Math.cos(az);

    // Dispatch to Viewport3D to move the camera
    window.dispatchEvent(new CustomEvent('viewcube-drag', {
      detail: { x: camX, y: camY, z: camZ }
    }));

    // Also update the cube rotation locally for instant visual feedback
    const rotY = -az * (180 / Math.PI);
    const rotX = (pol - Math.PI / 2) * (180 / Math.PI);
    const newTransform = `rotateX(${rotX.toFixed(1)}deg) rotateY(${rotY.toFixed(1)}deg)`;
    if (cubeRef.current) {
      cubeRef.current.style.transform = newTransform;
    }
    setActiveView('');
  };

  const onPointerUp = (e: React.PointerEvent) => {
    try { (e.target as HTMLElement).releasePointerCapture(e.pointerId); } catch { /* ignore */ }
    setIsDragging(false);
    // Face click handling is done by each face's own onClick handler (below).
    // We don't snap to ISO here anymore — each face handles its own snap.
  };

  const handleViewClick = (view: string) => {
    // If we were dragging, don't trigger a click snap
    if (dragState.current.moved) return;
    const preset = VIEW_PRESETS[view];
    if (!preset) return;
    setActiveView(view);
    setIsAnimating(true);
    const cubeRotations: Record<string, string> = {
      ISO: 'rotateX(-25deg) rotateY(-35deg)',
      TOP: 'rotateX(0deg) rotateY(0deg)',
      BTM: 'rotateX(180deg) rotateY(0deg)',
      FRO: 'rotateX(90deg) rotateY(0deg)',
      BCK: 'rotateX(-90deg) rotateY(0deg)',
      RGT: 'rotateX(90deg) rotateY(90deg)',
      LFT: 'rotateX(90deg) rotateY(-90deg)',
    };
    setLiveRotation(cubeRotations[view] || cubeRotations.ISO);
    window.dispatchEvent(new CustomEvent('viewcube-click', { detail: { view, pos: preset.pos } }));
    // Update the stored azimuth/polar so drag continues from the new position
    const pos = preset.pos;
    const dist = Math.sqrt(pos[0] ** 2 + pos[1] ** 2 + pos[2] ** 2);
    dragState.current.azimuth = Math.atan2(pos[0], pos[2]);
    dragState.current.polar = Math.acos(Math.max(-1, Math.min(1, pos[1] / dist)));
    dragState.current.distance = dist;
    setTimeout(() => setIsAnimating(false), 450);
  };

  // Each face: semi-transparent color (more opaque for visibility), inset panel for depth
  const faceData = [
    { key: 'TOP', label: 'TOP',  transform: 'rotateX(90deg)  translateZ(20px)',  bg: 'rgba(170, 70, 70, 0.85)', border: 'rgba(200, 90, 90, 0.9)' },
    { key: 'BTM', label: 'BTM',  transform: 'rotateX(-90deg) translateZ(20px)',  bg: 'rgba(60, 140, 130, 0.85)', border: 'rgba(80, 160, 150, 0.9)' },
    { key: 'FRO', label: 'FRONT',transform: 'translateZ(20px)',                    bg: 'rgba(60, 100, 170, 0.85)', border: 'rgba(80, 120, 190, 0.9)' },
    { key: 'BCK', label: 'BACK', transform: 'rotateY(180deg) translateZ(20px)',   bg: 'rgba(70, 140, 70, 0.85)', border: 'rgba(90, 160, 90, 0.9)' },
    { key: 'RGT', label: 'RIGHT',transform: 'rotateY(90deg)  translateZ(20px)',   bg: 'rgba(170, 140, 50, 0.85)', border: 'rgba(190, 160, 70, 0.9)' },
    { key: 'LFT', label: 'LEFT', transform: 'rotateY(-90deg) translateZ(20px)',   bg: 'rgba(120, 80, 150, 0.85)', border: 'rgba(140, 100, 170, 0.9)' },
  ];

  return (
    <div
      ref={containerRef}
      className="absolute bottom-4 left-4 z-30"
      style={{ perspective: '200px', touchAction: 'none' }}
    >
      {/* The 3D cube — grab and drag to orbit, click to snap.
          This div owns all pointer events for the cube area. */}
      <div
        ref={cubeRef}
        className="relative cursor-grab active:cursor-grabbing select-none"
        style={{
          width: '56px',
          height: '56px',
          transformStyle: 'preserve-3d',
          transform: liveRotation,
          transition: isAnimating ? 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onMouseEnter={() => setHoveredFace('ISO')}
        onMouseLeave={() => setHoveredFace(null)}
      >
        {/* Cube faces — each has a semi-transparent color with an inset panel.
            Faces accept pointer events for clicking; drag is handled by the parent
            cube div's onPointerDown which fires first via event bubbling. */}
        {faceData.map((face) => (
          <div
            key={face.key}
            className="absolute inset-0 flex items-center justify-center"
            style={{
              transform: face.transform,
              background: face.bg,
              borderColor: face.border,
              borderWidth: '1px',
              borderStyle: 'solid',
              borderRadius: '3px',
              boxShadow: 'inset 0 0 8px rgba(0,0,0,0.15)',
              cursor: isDragging ? 'grabbing' : 'pointer',
            }}
            onMouseEnter={() => !isDragging && setHoveredFace(face.key)}
            onMouseLeave={() => setHoveredFace(null)}
            onClick={(e) => {
              e.stopPropagation();
              if (!dragState.current.moved) {
                handleViewClick(face.key);
              }
            }}
          >
            {/* Inset panel — smaller inner div creates the beveled/indented look. */}
            <div
              className="flex items-center justify-center pointer-events-none"
              style={{
                width: '72%',
                height: '72%',
                background: hoveredFace === face.key ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.12)',
                borderRadius: '2px',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)',
              }}
            >
              <span className="text-[8px] font-mono font-bold" style={{ color: 'rgba(40, 40, 50, 0.85)' }}>
                {face.label}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Home/ISO button — spaced well below the cube to avoid interference */}
      <button
        className="block px-2 py-0.5 text-[9px] font-mono font-bold rounded bg-card/80 backdrop-blur border hover:bg-accent transition w-[56px] text-center"
        style={{ color: 'rgba(180, 180, 200, 0.7)', marginTop: '12px' }}
        onClick={() => handleViewClick('ISO')}
      >
        ISO
      </button>
    </div>
  );
}

// Small component that listens for Shift key presses (toggles) and displays a NOCLIP badge.
// The actual noclip state lives in the walk-mode useEffect closure, so this component
// mirrors the same Shift-toggle logic just for visual feedback.
function NoclipIndicator() {
  const [noclip, setNoclip] = useState(false);
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.code === 'ShiftLeft' || e.code === 'ShiftRight') && !e.repeat) {
        setNoclip((v) => !v);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      // Reset state when component unmounts (walk mode exits)
      setNoclip(false);
    };
  }, []);
  if (!noclip) return null;
  return (
    <div className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-yellow-500/90 text-black text-[12px] font-mono font-bold pointer-events-none flex items-center gap-2 animate-pulse">
      <span className="w-2 h-2 bg-black rounded-full" />
      NOCLIP ON — fly through walls
    </div>
  );
}

export function Viewport3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<SceneState | null>(null);

  const theme = useCADStore((s) => s.theme);
  const workspace = useCADStore((s) => s.workspace);
  const viewMode = useCADStore((s) => s.viewMode);
  const showGrid = useCADStore((s) => s.showGrid);
  const showAxes = useCADStore((s) => s.showAxes);
  const showShadows = useCADStore((s) => s.showShadows);
  const ortho = useCADStore((s) => s.ortho);
  const sectionPlane = useCADStore((s) => s.sectionPlane);
  const parts = useCADStore((s) => s.parts);
  const assembly = useCADStore((s) => s.assembly);
  const activePartId = useCADStore((s) => s.activePartId);
  const selectedFeatureId = useCADStore((s) => s.selectedFeatureId);
  const selectedInstanceId = useCADStore((s) => s.selectedInstanceId);
  const selectInstance = useCADStore((s) => s.selectInstance);
  const selectFace = useCADStore((s) => s.selectFace);
  const collaborators = useCADStore((s) => s.collaborators);
  const sketchMode = useCADStore((s) => s.sketchMode);
  const walkMode = useCADStore((s) => s.walkMode);
  const toggleWalkMode = useCADStore((s) => s.toggleWalkMode);

  // Initialize scene once
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const scene = new THREE.Scene();
    const isDark = theme === 'dark';
    scene.background = new THREE.Color(isDark ? 0x23272e : 0xbfc4cc);
    scene.fog = new THREE.Fog(isDark ? 0x23272e : 0xbfc4cc, 400, 1500);

    const camera = new THREE.PerspectiveCamera(
      45, container.clientWidth / container.clientHeight, 0.1, 5000
    );
    camera.position.set(180, 130, 180);

    const renderer = new THREE.WebGLRenderer({
      antialias: true, alpha: false, powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 20;
    controls.maxDistance = 1000;
    controls.maxPolarAngle = Math.PI * 0.95;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, isDark ? 0.4 : 0.6);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0x88aaff, 0x444433, isDark ? 0.5 : 0.4);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.4);
    dirLight.position.set(150, 250, 100);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 10;
    dirLight.shadow.camera.far = 800;
    dirLight.shadow.camera.left = -200;
    dirLight.shadow.camera.right = 200;
    dirLight.shadow.camera.top = 200;
    dirLight.shadow.camera.bottom = -200;
    dirLight.shadow.bias = -0.0005;
    dirLight.shadow.normalBias = 0.02;
    scene.add(dirLight);

    // Grid
    const gridHelper = new THREE.GridHelper(500, 50, 0x666666, 0x444444);
    (gridHelper.material as THREE.Material).opacity = 0.35;
    (gridHelper.material as THREE.Material).transparent = true;
    gridHelper.position.y = -50;
    scene.add(gridHelper);

    // Axes
    const axesHelper = new THREE.AxesHelper(40);
    axesHelper.position.set(-250, -49, -250);
    scene.add(axesHelper);

    // Ground (shadow catcher)
    const groundGeom = new THREE.PlaneGeometry(2000, 2000);
    const groundMat = new THREE.ShadowMaterial({ opacity: 0.3 });
    const ground = new THREE.Mesh(groundGeom, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -50;
    ground.receiveShadow = true;
    scene.add(ground);

    // Environment cube (subtle gradient)
    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color(isDark ? 0x2a2f3a : 0xcdd3dc);
    const envRT = new THREE.WebGLCubeRenderTarget(64);
    const envCam = new THREE.CubeCamera(0.1, 1000, envRT);
    envScene.add(envCam);
    envCam.update(renderer, envScene);
    scene.environment = envRT.texture;

    const raycaster = new THREE.Raycaster();

    sceneRef.current = {
      scene, camera, renderer, controls,
      gridHelper, axesHelper, edgeLines: [], partMeshes: new Map(),
      raycaster, ambientLight, hemiLight, ground,
    };

    // Resize
    const handleResize = () => {
      if (!container || !sceneRef.current) return;
      const w = container.clientWidth, h = container.clientHeight;
      sceneRef.current.camera.aspect = w / h;
      sceneRef.current.camera.updateProjectionMatrix();
      sceneRef.current.renderer.setSize(w, h);
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Animation loop
    let animFrame = 0;
    let frameCount = 0;
    const animate = () => {
      animFrame = requestAnimationFrame(animate);
      if (sceneRef.current) {
        // Skip controls.update() when in walk mode (walk mode has its own render loop)
        const isWalkMode = useCADStore.getState().walkMode;
        if (!isWalkMode) {
          sceneRef.current.controls.update();
        }
        // Skip rendering in main loop when walk mode is active (walk mode has its own render loop)
        if (!isWalkMode) {
          sceneRef.current.renderer.render(sceneRef.current.scene, sceneRef.current.camera);
        }

        // Broadcast camera orientation to the ViewCube for live tracking
        // Throttle to every 3rd frame to avoid excessive DOM updates
        if (frameCount % 3 === 0 && !isWalkMode) {
          const cam = sceneRef.current.camera;
          // Compute spherical angles (azimuth + polar) from camera position relative to target
          const dx = cam.position.x;
          const dy = cam.position.y;
          const dz = cam.position.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          const azimuth = Math.atan2(dx, dz);   // Y rotation (around Y axis)
          const polar = Math.acos(Math.max(-1, Math.min(1, dy / dist))); // X rotation (from Y axis)
          window.dispatchEvent(new CustomEvent('viewcube-orient', {
            detail: { azimuth, polar, distance: dist }
          }));
        }
        frameCount++;
      }
    };
    animate();

    // Click handler for selection
    const handleClick = (e: MouseEvent) => {
      if (!sceneRef.current || !container) return;
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      sceneRef.current.raycaster.setFromCamera(new THREE.Vector2(x, y), sceneRef.current.camera);
      const meshes = Array.from(sceneRef.current.partMeshes.values()).flatMap((m) => {
        const arr: THREE.Object3D[] = [];
        m.traverse((c) => { if (c instanceof THREE.Mesh) arr.push(c); });
        return arr;
      });
      const intersects = sceneRef.current.raycaster.intersectObjects(meshes);
      if (intersects.length > 0) {
        // Find parent group with userData.instanceId
        let obj: THREE.Object3D | null = intersects[0].object;
        while (obj && !obj.userData?.instanceId && !obj.userData?.partId) obj = obj.parent;
        if (obj?.userData?.instanceId) {
          selectInstance(obj.userData.instanceId);
        } else if (obj?.userData?.partId) {
          selectFace(intersects[0].object.uuid);
        }
      }
    };
    container.addEventListener('click', handleClick);

    // Listen for ViewCube click events (snap to standard view)
    const handleViewCube = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (!sceneRef.current || !detail?.pos) return;
      sceneRef.current.camera.position.set(detail.pos[0], detail.pos[1], detail.pos[2]);
      sceneRef.current.camera.lookAt(0, 0, 0);
      sceneRef.current.controls.target.set(0, 0, 0);
      sceneRef.current.controls.update();
    };
    window.addEventListener('viewcube-click', handleViewCube);

    // Listen for ViewCube drag events (orbit camera by dragging the cube)
    const handleViewCubeDrag = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (!sceneRef.current || !detail) return;
      sceneRef.current.camera.position.set(detail.x, detail.y, detail.z);
      sceneRef.current.camera.lookAt(0, 0, 0);
      sceneRef.current.controls.target.set(0, 0, 0);
      sceneRef.current.controls.update();
    };
    window.addEventListener('viewcube-drag', handleViewCubeDrag);

    return () => {
      cancelAnimationFrame(animFrame);
      resizeObserver.disconnect();
      container.removeEventListener('click', handleClick);
      window.removeEventListener('viewcube-click', handleViewCube);
      window.removeEventListener('viewcube-drag', handleViewCubeDrag);
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update theme
  useEffect(() => {
    const s = sceneRef.current;
    if (!s) return;
    const isDark = theme === 'dark';
    s.scene.background = new THREE.Color(isDark ? 0x23272e : 0xbfc4cc);
    if (s.scene.fog) (s.scene.fog as THREE.Fog).color.set(isDark ? 0x23272e : 0xbfc4cc);
    s.ambientLight.intensity = isDark ? 0.4 : 0.6;
    s.hemiLight.intensity = isDark ? 0.5 : 0.4;
  }, [theme]);

  // Update grid/axes visibility
  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.gridHelper.visible = showGrid;
      sceneRef.current.axesHelper.visible = showAxes;
    }
  }, [showGrid, showAxes]);

  // Update shadows
  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.renderer.shadowMap.enabled = showShadows;
      sceneRef.current.ground.visible = showShadows;
      sceneRef.current.scene.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.castShadow = showShadows;
          if (o.material instanceof THREE.ShadowMaterial) return;
          o.receiveShadow = showShadows;
        }
      });
    }
  }, [showShadows]);

  // Rebuild geometry when parts/features change
  useEffect(() => {
    const s = sceneRef.current;
    if (!s) return;

    // Clear existing
    s.partMeshes.forEach((m) => {
      s.scene.remove(m);
      // Dispose geometries and materials to prevent GPU memory leaks
      m.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry?.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach(mat => { mat.map?.dispose(); mat.bumpMap?.dispose(); mat.dispose(); });
            } else {
              child.material.map?.dispose();
              child.material.bumpMap?.dispose();
              child.material.dispose();
            }
          }
        }
      });
    });
    s.partMeshes.clear();

    if (workspace === 'part') {
      const part = parts.find((p) => p.id === activePartId);
      if (!part) return;
      const geom = createGeometryForPart(part);
      geom.userData.partId = part.id;
      // Center it
      geom.position.set(0, 0, 0);
      s.scene.add(geom);
      s.partMeshes.set(part.id, geom);
    } else if (workspace === 'assembly' || workspace === 'simulation') {
      assembly.instances.forEach((inst) => {
        if (!inst.visible) return;
        const part = parts.find((p) => p.id === inst.partId);
        if (!part) return;
        const geom = createGeometryForPart(part);
        geom.userData.instanceId = inst.id;
        geom.userData.partId = part.id;

        const t = inst.transform;
        geom.position.set(t.position[0], t.position[1], t.position[2]);
        geom.rotation.set(
          THREE.MathUtils.degToRad(t.rotation[0]),
          THREE.MathUtils.degToRad(t.rotation[1]),
          THREE.MathUtils.degToRad(t.rotation[2])
        );

        if (assembly.exploded) {
          geom.position.x += inst.explodedOffset[0] * assembly.explodedFactor * 1.5;
          geom.position.y += inst.explodedOffset[1] * assembly.explodedFactor * 1.5;
          geom.position.z += inst.explodedOffset[2] * assembly.explodedFactor * 1.5;
        }

        // Highlight selected instance
        if (inst.id === selectedInstanceId) {
          geom.traverse((c) => {
            if (c instanceof THREE.Mesh && c.material instanceof THREE.MeshStandardMaterial) {
              c.material.emissive = new THREE.Color(0x334466);
              c.material.emissiveIntensity = 0.4;
            }
          });
        }

        s.scene.add(geom);
        s.partMeshes.set(inst.id, geom);
      });
    }
  }, [parts, activePartId, workspace, assembly, selectedInstanceId]);

  // Apply view mode
  useEffect(() => {
    const s = sceneRef.current;
    if (!s) return;
    s.scene.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        const mat = o.material as THREE.MeshStandardMaterial;
        if (!mat || mat instanceof THREE.ShadowMaterial) return;
        if (viewMode === 'wireframe') {
          mat.wireframe = true;
          mat.transparent = false;
          mat.opacity = 1;
        } else if (viewMode === 'transparent') {
          mat.wireframe = false;
          mat.transparent = true;
          mat.opacity = 0.35;
        } else {
          mat.wireframe = false;
          mat.transparent = false;
          mat.opacity = 1;
        }
      }
    });
  }, [viewMode, parts, workspace, assembly]);

  // Section plane (clipping)
  useEffect(() => {
    const s = sceneRef.current;
    if (!s) return;
    if (sectionPlane !== null) {
      const clipPlane = new THREE.Plane(new THREE.Vector3(0, 0, -1), sectionPlane);
      s.renderer.localClippingEnabled = true;
      s.scene.traverse((o) => {
        if (o instanceof THREE.Mesh && o.material instanceof THREE.Material) {
          o.material.clippingPlanes = [clipPlane];
          o.material.clipShadows = true;
        }
      });
    } else {
      s.renderer.localClippingEnabled = false;
      s.scene.traverse((o) => {
        if (o instanceof THREE.Mesh && o.material instanceof THREE.Material) {
          o.material.clippingPlanes = [];
        }
      });
    }
  }, [sectionPlane, parts, workspace, assembly]);

  // Highlight selected feature
  useEffect(() => {
    const s = sceneRef.current;
    if (!s) return;
    s.scene.traverse((o) => {
      if (o instanceof THREE.Mesh && o.material instanceof THREE.MeshStandardMaterial) {
        // Reset (skip if selected instance highlight)
        if (o.material.emissiveIntensity > 0 && o.material.emissive.getHex() === 0x334466) return;
        o.material.emissive = new THREE.Color(0x000000);
        o.material.emissiveIntensity = 0;
      }
    });
    if (selectedFeatureId && workspace === 'part') {
      // Highlight based on feature type
      const part = parts.find((p) => p.id === activePartId);
      const feat = part?.features.find((f) => f.id === selectedFeatureId);
      if (!feat) return;
      // Glow entire part subtly
      s.scene.traverse((o) => {
        if (o instanceof THREE.Mesh && o.material instanceof THREE.MeshStandardMaterial) {
          if (o.material.emissive.getHex() === 0x334466) return; // skip selected instance
          o.material.emissive = new THREE.Color(0x442200);
          o.material.emissiveIntensity = 0.15;
        }
      });
    }
  }, [selectedFeatureId, parts, activePartId, workspace]);

  // Camera projection
  useEffect(() => {
    const s = sceneRef.current;
    if (!s) return;
    const oldCam = s.camera;
    const aspect = oldCam.aspect;
    const newCam = ortho
      ? new THREE.OrthographicCamera(-150 * aspect, 150 * aspect, 150, -150, 0.1, 5000)
      : new THREE.PerspectiveCamera(45, aspect, 0.1, 5000);
    newCam.position.copy(oldCam.position);
    newCam.quaternion.copy(oldCam.quaternion);
    s.camera = newCam as THREE.PerspectiveCamera;
    s.controls.object = newCam;
    s.controls.update();
  }, [ortho]);

  // Render collaborator cursors as 3D markers (purely visual)
  useEffect(() => {
    const s = sceneRef.current;
    if (!s) return;
    // Remove old cursor markers
    const toRemove: THREE.Object3D[] = [];
    s.scene.traverse((o) => { if (o.userData?.isCollabCursor) toRemove.push(o); });
    toRemove.forEach((o) => s.scene.remove(o));

    if (workspace === 'assembly' || workspace === 'part') {
      collaborators.filter((c) => c.active && c.cursor).forEach((c) => {
        const cone = new THREE.Mesh(
          new THREE.ConeGeometry(2, 8, 16),
          new THREE.MeshBasicMaterial({ color: c.color })
        );
        // Map cursor to 3D coords (rough)
        cone.position.set(
          (c.cursor!.x - 400) * 0.5,
          80,
          (c.cursor!.y - 300) * 0.5
        );
        cone.userData.isCollabCursor = true;
        cone.userData.collabId = c.id;
        s.scene.add(cone);

        // Beam
        const beam = new THREE.Mesh(
          new THREE.CylinderGeometry(0.3, 0.3, 80, 8),
          new THREE.MeshBasicMaterial({ color: c.color, transparent: true, opacity: 0.4 })
        );
        beam.position.set(cone.position.x, 40, cone.position.z);
        beam.userData.isCollabCursor = true;
        s.scene.add(beam);
      });
    }
  }, [collaborators, workspace]);

  // ===== WALK MODE (first-person navigation with gravity) =====
  useEffect(() => {
    const s = sceneRef.current;
    if (!s || !walkMode) return;

    const { scene, camera, renderer, controls } = s;
    controls.enabled = false;

    // Blur any focused element (e.g., the Exit Walk Mode button) so that pressing
    // Space to jump doesn't accidentally activate a focused button and exit walk mode.
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    // Scale: 10 units = 1m. Building 200×140×100/floor = 20×14×10m
    const EYE_HEIGHT = 17;   // 1.7m
    const WALK_SPEED = 1.5;  // units per frame
    const NOCLIP_SPEED = 4;  // faster movement in noclip mode
    const MAX_STEP_UP = 5;   // one stair step (5 units = 0.5m)
    const JUMP_VELOCITY = 4; // initial upward velocity on jump (peak ≈ 27 units = 2.7m)
    const GRAVITY = 0.3;     // per-frame downward acceleration

    // ===== MOUSE LOOK (drag) =====
    let isDragging = false;
    let prevX = 0, prevY = 0;
    let yaw = 0, pitch = 0;

    // Adaptive spawn position based on the active part.
    // Each architectural scene has a different layout, so spawning at a fixed
    // position would put the player outside the room or stuck in a wall for
    // some scenes. We pick a sensible "entrance" point per part.
    const currentPartId = useCADStore.getState().activePartId;
    let spawnX = 30, spawnZ = 55;
    let spawnYaw = Math.PI; // default: face +Z
    if (currentPartId === 'part_desktop_setup') {
      // Desktop setup room: X[-60,60], Z[-45,45], Y[0,45] (12m x 9m x 4.5m loft).
      // Desk pushed against north wall (Z=45), chair at Z=26, monitors at Z=42.
      // Spawn at the chair position facing +Z (toward the monitors).
      spawnX = 0; spawnZ = 24;
      spawnYaw = Math.PI; // face +Z (toward monitors)
    } else if (currentPartId === 'part_bay_area_apartment') {
      spawnX = -50; spawnZ = 0;
      spawnYaw = 0;
    } else if (currentPartId === 'part_chinese_building') {
      spawnX = 30; spawnZ = 55;
      spawnYaw = Math.PI;
    } else if (currentPartId === 'part_la_mansion') {
      spawnX = 0; spawnZ = 80;
      spawnYaw = Math.PI;
    } else if (currentPartId === 'part_pyramid') {
      spawnX = 30; spawnZ = 120;
      spawnYaw = Math.PI;
    } else if (currentPartId === 'part_grocery_store') {
      // Grocery store: 60m x 40m (600 x 400 units). Spawn just inside the entrance
      // (south, Z=-180) facing +Z (into the store toward the aisles and checkouts).
      spawnX = 0; spawnZ = -170;
      spawnYaw = Math.PI; // face +Z (into the store)
    } else if (currentPartId === 'part_f1_car') {
      // F1 car exploded view: components stacked vertically Y=0-112.
      // Spawn at ground level, to the side, facing the car.
      spawnX = 30; spawnZ = 20;
      spawnYaw = -Math.PI / 2; // face -X (toward the car)
    } else if (currentPartId === 'part_f1_car_assembled') {
      // F1 car assembled: car is ~5.5m long, ~2m wide, ~1m tall.
      // Spawn at the side, ground level, facing the car.
      spawnX = 15; spawnZ = 0;
      spawnYaw = -Math.PI / 2; // face -X (toward the car)
    }
    camera.position.set(spawnX, EYE_HEIGHT, spawnZ);
    camera.rotation.order = 'YXZ';
    camera.rotation.set(0, spawnYaw, 0);
    yaw = spawnYaw;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      prevX = e.clientX;
      prevY = e.clientY;
      yaw -= dx * 0.005;
      pitch -= dy * 0.005;
      pitch = Math.max(-1.4, Math.min(1.4, pitch));
      camera.rotation.y = yaw;
      camera.rotation.x = pitch;
    };
    const onPointerUp = () => { isDragging = false; };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);

    // ===== KEYBOARD =====
    const keys: Record<string, boolean> = {};
    let noclip = false;       // toggled by Shift — disables gravity + collision
    let onGround = true;      // tracks whether player is currently grounded (for jump)
    let jumpQueued = false;   // set on Space keydown, consumed in walk loop

    const onKeyDown = (e: KeyboardEvent) => {
      // Ignore auto-repeat for toggle keys (Shift, Space)
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        if (!e.repeat) {
          noclip = !noclip;
          // Reset velocity and onGround state when toggling noclip
          velocityY = 0;
          onGround = false;
        }
        keys[e.code] = true;
        e.preventDefault();
        return;
      }
      if (e.code === 'Space') {
        if (!e.repeat) jumpQueued = true;
        e.preventDefault(); // prevent page scroll
        keys[e.code] = true;
        return;
      }
      keys[e.code] = true;
      if (e.code === 'Escape') toggleWalkMode();
    };
    const onKeyUp = (e: KeyboardEvent) => { keys[e.code] = false; };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    // ===== COLLIDABLE MESHES (only walls and floors — skip small furniture) =====
    const collidableMeshes: THREE.Mesh[] = [];
    s.partMeshes.forEach((m) => {
      m.traverse((c) => {
        if (c instanceof THREE.Mesh) {
          // Only include meshes larger than 10 units in any dimension (walls, floors, slabs)
          // Skip small furniture items to prevent false collision hits
          const box = new THREE.Box3().setFromObject(c);
          const size = new THREE.Vector3();
          box.getSize(size);
          if (size.x > 15 || size.y > 15 || size.z > 15) {
            collidableMeshes.push(c);
          }
        }
      });
    });

    // ===== PHYSICS =====
    let velocityY = 0;
    const downRay = new THREE.Raycaster();
    const downDir = new THREE.Vector3(0, -1, 0);
    // ===== WALK LOOP =====
    let walkFrame = 0;
    const walkAnimate = () => {
      walkFrame = requestAnimationFrame(walkAnimate);
      if (!sceneRef.current) return;
      const cam = sceneRef.current.camera;

      // Movement direction from yaw
      // Camera at yaw=0 looks in -Z direction (Three.js default)
      // Forward = (-sin(yaw), 0, -cos(yaw))
      // Right = forward × up = (cos(yaw), 0, -sin(yaw))
      const fwdX = -Math.sin(yaw);
      const fwdZ = -Math.cos(yaw);
      const rgtX = Math.cos(yaw);
      const rgtZ = -Math.sin(yaw);

      // Movement speed: noclip is fastest, Shift (held) is run, otherwise walk.
      // Note: Shift now toggles noclip, but if noclip is on we use NOCLIP_SPEED.
      const speed = noclip ? NOCLIP_SPEED : WALK_SPEED;

      let mx = 0, mz = 0;
      if (keys['KeyW'] || keys['ArrowUp']) { mx += fwdX; mz += fwdZ; }
      if (keys['KeyS'] || keys['ArrowDown']) { mx -= fwdX; mz -= fwdZ; }
      if (keys['KeyA'] || keys['ArrowLeft']) { mx -= rgtX; mz -= rgtZ; }
      if (keys['KeyD'] || keys['ArrowRight']) { mx += rgtX; mz += rgtZ; }

      // Normalize horizontal movement
      if (mx !== 0 || mz !== 0) {
        const len = Math.sqrt(mx * mx + mz * mz);
        mx = (mx / len) * speed;
        mz = (mz / len) * speed;
      }

      if (noclip) {
        // ===== NOCLIP MODE: free flight, no collision, no gravity =====
        // Horizontal movement (WASD) — moves in camera-facing direction (projected to horizontal plane)
        cam.position.x += mx;
        cam.position.z += mz;
        // Vertical movement: Q = up, E = down
        let vy = 0;
        if (keys['KeyQ']) vy += NOCLIP_SPEED;
        if (keys['KeyE']) vy -= NOCLIP_SPEED;
        cam.position.y += vy;
        // Clamp to a reasonable range so the user doesn't fly off into infinity
        cam.position.y = Math.max(2, Math.min(cam.position.y, 500));
      } else {
        // ===== NORMAL MODE: walk with collision + gravity + jump =====
        if (mx !== 0 || mz !== 0) {
          // Try to move — simple AABB collision check against large meshes only
          const newX = cam.position.x + mx;
          const newZ = cam.position.z + mz;

          // Check if new position would be inside a wall (raycast forward from feet)
          const feetY = cam.position.y - EYE_HEIGHT + 2;
          const origin = new THREE.Vector3(cam.position.x, feetY, cam.position.z);
          const moveDir = new THREE.Vector3(mx, 0, mz).normalize();
          downRay.set(origin, moveDir);
          downRay.far = 5; // short range — only block if wall is very close
          const wallHits = downRay.intersectObjects(collidableMeshes, false);

          if (wallHits.length === 0 || wallHits[0].distance > 3) {
            // No wall blocking — move
            cam.position.x = newX;
            cam.position.z = newZ;
          } else {
            // Try X-only or Z-only movement (slide along walls)
            const originX = new THREE.Vector3(cam.position.x, feetY, cam.position.z);
            downRay.set(originX, new THREE.Vector3(mx, 0, 0).normalize());
            downRay.far = 5;
            const xHits = downRay.intersectObjects(collidableMeshes, false);
            if (xHits.length === 0 || xHits[0].distance > 3) {
              cam.position.x = newX;
            }
            const originZ = new THREE.Vector3(cam.position.x, feetY, cam.position.z);
            downRay.set(originZ, new THREE.Vector3(0, 0, mz).normalize());
            downRay.far = 5;
            const zHits = downRay.intersectObjects(collidableMeshes, false);
            if (zHits.length === 0 || zHits[0].distance > 3) {
              cam.position.z = newZ;
            }
          }
        }

        // Jump: consume queued jump if grounded.
        // Apply the upward velocity IMMEDIATELY (cam.position.y += velocityY) so the
        // gravity check below sees us above the floor — otherwise the "On floor"
        // branch would instantly snap us back down and cancel the jump.
        if (jumpQueued && onGround) {
          velocityY = JUMP_VELOCITY;
          onGround = false;
          cam.position.y += velocityY;  // move up this frame
        }
        jumpQueued = false;

        // Gravity: find floor below player
        const gravOrigin = new THREE.Vector3(cam.position.x, cam.position.y, cam.position.z);
        downRay.set(gravOrigin, downDir);
        downRay.far = EYE_HEIGHT + 50;
        const floorHits = downRay.intersectObjects(collidableMeshes, false);

        if (floorHits.length > 0) {
          const floorY = floorHits[0].point.y;
          const targetY = floorY + EYE_HEIGHT;
          if (cam.position.y > targetY + 0.5) {
            // Above the floor — apply gravity (covers rising from jump AND falling)
            velocityY -= GRAVITY;
            cam.position.y += velocityY;
            if (cam.position.y <= targetY) {
              // Landed
              cam.position.y = targetY;
              velocityY = 0;
              onGround = true;
            } else {
              // Still airborne
              onGround = false;
            }
          } else if (cam.position.y < targetY - 0.5) {
            // Stepping up (stairs)
            if (targetY - cam.position.y < MAX_STEP_UP + 1) {
              cam.position.y = targetY;
              velocityY = 0;
              onGround = true;
            } else {
              onGround = false;
            }
          } else {
            // Within 0.5 units of floor — snap down only if not moving upward.
            // This prevents the "On floor" branch from cancelling an active jump
            // on the frame the jump was initiated.
            if (velocityY <= 0) {
              cam.position.y = targetY;
              velocityY = 0;
              onGround = true;
            } else {
              onGround = false;
            }
          }
        } else {
          // No floor below — fall
          velocityY -= GRAVITY;
          cam.position.y += velocityY;
          onGround = false;
        }
      }

      sceneRef.current.renderer.render(sceneRef.current.scene, cam);
    };
    walkAnimate();

    // ===== CLEANUP =====
    return () => {
      cancelAnimationFrame(walkFrame);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
      controls.enabled = true;
      camera.position.set(180, 130, 180);
      camera.lookAt(0, 0, 0);
      controls.target.set(0, 0, 0);
      controls.update();
    };
  }, [walkMode]);

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="absolute inset-0" />
      {/* Viewport HUD */}
      <div className="viewport-overlay" style={walkMode ? { pointerEvents: 'none' } : undefined}>
        {/* View cube / orientation gizmo */}
        <div className="absolute bottom-4 right-4 w-20 h-20 bg-card/80 backdrop-blur border rounded shadow-lg flex items-center justify-center">
          <div className="text-[10px] font-mono text-muted-foreground">
            <div className="grid grid-cols-3 gap-1">
              <div></div>
              <div className="text-center text-red-500 font-bold">Y</div>
              <div></div>
              <div className="text-center text-green-500 font-bold">Z</div>
              <div className="text-center text-muted-foreground">·</div>
              <div className="text-center text-blue-500 font-bold">X</div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        </div>

        {/* View mode indicator */}
        <div className="absolute top-4 left-4 px-2 py-1 rounded bg-card/80 backdrop-blur border text-[11px] font-mono text-muted-foreground">
          {viewMode.toUpperCase()}{sectionPlane !== null ? ` · SEC ${sectionPlane}mm` : ''}{sketchMode ? ' · SKETCH' : ''}
        </div>

        {/* Performance counter */}
        <div className="absolute top-4 right-4 px-2 py-1 rounded bg-card/80 backdrop-blur border text-[11px] font-mono text-muted-foreground">
          60 FPS · {workspace === 'assembly' ? assembly.instances.length : 1} obj
        </div>

        {/* Interactive View Cube (Blender/AutoCAD style) */}
        <ViewCube />

        {/* Walk Mode button */}
        <button
          className={`absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg text-[13px] font-medium transition border z-50 ${
            walkMode
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-card/90 backdrop-blur border hover:bg-accent'
          }`}
          style={walkMode ? { pointerEvents: 'auto' } : undefined}
          // Prevent mousedown from giving the button keyboard focus — otherwise
          // pressing Space (jump) would activate the focused button and exit walk mode.
          onMouseDown={(e) => e.preventDefault()}
          onClick={toggleWalkMode}
          title="Enter first-person walk mode (WASD + drag mouse to look + gravity)"
        >
          {walkMode ? '🚶 Exit Walk Mode' : '🚶 Walk Mode'}
        </button>

        {/* Walk Mode crosshair + instructions */}
        {walkMode && (
          <>
            {/* Crosshair */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <div className="w-6 h-6 relative">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/60 -translate-y-1/2" />
                <div className="absolute left-1/2 top-0 h-full w-0.5 bg-white/60 -translate-x-1/2" />
                <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-red-500 rounded-full -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>
            {/* Instructions */}
            <div className="absolute top-16 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg bg-black/80 text-white text-[12px] font-mono pointer-events-none text-center">
              <div className="flex items-center gap-3 flex-wrap justify-center">
                <span><kbd className="px-1.5 py-0.5 bg-white/20 rounded">W A S D</kbd> Move</span>
                <span><kbd className="px-1.5 py-0.5 bg-white/20 rounded">Drag</kbd> Look</span>
                <span><kbd className="px-1.5 py-0.5 bg-white/20 rounded">Space</kbd> Jump</span>
                <span><kbd className="px-1.5 py-0.5 bg-white/20 rounded">Shift</kbd> Noclip</span>
                <span><kbd className="px-1.5 py-0.5 bg-white/20 rounded">Q / E</kbd> Up / Down (noclip)</span>
                <span><kbd className="px-1.5 py-0.5 bg-white/20 rounded">ESC</kbd> Exit</span>
              </div>
              <div className="mt-1 text-[10px] text-yellow-300">
                Press Shift to toggle noclip (fly through walls · Q/E to go up/down)
              </div>
            </div>
            {/* Noclip mode indicator */}
            <NoclipIndicator />
          </>
        )}
      </div>
    </div>
  );
}
