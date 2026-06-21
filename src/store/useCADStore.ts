'use client';

import { create } from 'zustand';
import type {
  WorkspaceType, ViewMode, ToolId, Part, Assembly, DrawingSheet,
  SimulationStudy, Collaborator, VersionEntry, Feature, Sketch,
  SketchEntity, Constraint, Dimension, ParametricParameter, Mate,
  AssemblyInstance, FeatureStatus, SimulationResults
} from '@/lib/cad/types';
import {
  seedPart, seedAssembly, seedEngineAssembly, seedCNCAssembly, seedSuperCNCAssembly, seedDrawingSheets, seedSimulations,
  seedCollaborators, seedVersions, uid, sampleParts
} from '@/lib/cad/seed';

export interface ToastMsg {
  id: string;
  title: string;
  description?: string;
  variant: 'default' | 'success' | 'error' | 'info';
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  actions?: { label: string; action: string }[];
}

interface UIState {
  theme: 'dark' | 'light';
  workspace: WorkspaceType;
  activePartId: string;
  activeSketchId: string | null;
  sketchMode: boolean;
  viewMode: ViewMode;
  selectedTool: ToolId;
  selectedFeatureId: string | null;
  selectedFaceId: string | null;
  selectedEdgeId: string | null;
  selectedInstanceId: string | null;
  showGrid: boolean;
  showAxes: boolean;
  showShadows: boolean;
  showWireframe: boolean;
  ortho: boolean;
  sectionPlane: number | null;
  panelLeftCollapsed: boolean;
  panelRightCollapsed: boolean;
  panelBottomCollapsed: boolean;
  rightPanelTab: 'properties' | 'parameters' | 'ai' | 'collab' | 'versions' | 'export';
  activeDrawingSheetId: string;
  activeSimulationId: string;
  commandPaletteOpen: boolean;
  exportDialogOpen: boolean;
  projectBrowserOpen: boolean;
  units: 'mm' | 'cm' | 'm' | 'in';
  precision: number;
  toasts: ToastMsg[];
  aiMessages: AIMessage[];
  collaborators: Collaborator[];
  versions: VersionEntry[];
  isRegenerating: boolean;
  lastRegenTime: number;
  parts: Part[];
  assemblies: Assembly[];
  activeAssemblyId: string;
  assembly: Assembly;
  drawings: DrawingSheet[];
  simulations: SimulationStudy[];
  searchQuery: string;
  walkMode: boolean;
}

interface UIActions {
  setTheme: (t: 'dark' | 'light') => void;
  toggleTheme: () => void;
  setWorkspace: (w: WorkspaceType) => void;
  setActivePartId: (id: string) => void;
  enterSketch: (sketchId: string | null) => void;
  setViewMode: (v: ViewMode) => void;
  setSelectedTool: (t: ToolId) => void;
  selectFeature: (id: string | null) => void;
  selectInstance: (id: string | null) => void;
  selectFace: (id: string | null) => void;
  selectEdge: (id: string | null) => void;
  toggleGrid: () => void;
  toggleAxes: () => void;
  toggleOrtho: () => void;
  toggleShadows: () => void;
  setSectionPlane: (v: number | null) => void;
  toggleLeftPanel: () => void;
  toggleRightPanel: () => void;
  toggleBottomPanel: () => void;
  setRightPanelTab: (t: UIState['rightPanelTab']) => void;
  setActiveDrawingSheetId: (id: string) => void;
  setActiveSimulationId: (id: string) => void;
  setActiveAssemblyId: (id: string) => void;
  setCommandPaletteOpen: (v: boolean) => void;
  setExportDialogOpen: (v: boolean) => void;
  setProjectBrowserOpen: (v: boolean) => void;
  setUnits: (u: 'mm' | 'cm' | 'm' | 'in') => void;
  setPrecision: (p: number) => void;
  toast: (t: Omit<ToastMsg, 'id'>) => void;
  dismissToast: (id: string) => void;
  sendAIMessage: (content: string) => void;
  addAIMessage: (m: Omit<AIMessage, 'id' | 'timestamp'>) => void;
  regenerateAll: () => void;
  // Feature operations
  updateFeature: (id: string, patch: Partial<Feature>) => void;
  addFeature: (f: Feature) => void;
  deleteFeature: (id: string) => void;
  reorderFeature: (id: string, direction: 'up' | 'down') => void;
  toggleFeatureSuppressed: (id: string) => void;
  toggleFeatureVisible: (id: string) => void;
  // Parameters
  updateParameter: (id: string, patch: Partial<ParametricParameter>) => void;
  addParameter: () => void;
  deleteParameter: (id: string) => void;
  // Sketch
  addSketchEntity: (entity: Omit<SketchEntity, 'id'>) => void;
  deleteSketchEntity: (id: string) => void;
  addConstraint: (c: Omit<Constraint, 'id'>) => void;
  addDimension: (d: Omit<Dimension, 'id'>) => void;
  createSketch: (name: string, plane: 'xy' | 'xz' | 'yz') => void;
  // Assembly
  toggleExploded: () => void;
  setExplodedFactor: (f: number) => void;
  addInstance: (partId: string) => void;
  updateInstance: (id: string, patch: Partial<AssemblyInstance>) => void;
  toggleMate: (id: string) => void;
  addMate: (m: Omit<Mate, 'id'>) => void;
  // Simulation
  runSimulation: (id: string) => void;
  // Versioning
  createVersion: (message: string) => void;
  revertVersion: (id: string) => void;
  setSearchQuery: (q: string) => void;
  toggleWalkMode: () => void;
}

export type CADStore = UIState & UIActions;

const part: Part = JSON.parse(JSON.stringify(seedPart));
const parts: Part[] = JSON.parse(JSON.stringify(sampleParts));

export const useCADStore = create<CADStore>((set, get) => ({
  theme: 'dark',
  workspace: 'part',
  activePartId: 'part_f1_car_assembled', // Default to F1 Car (Assembled)
  activeSketchId: null,
  sketchMode: false,
  viewMode: 'shaded-with-edges',
  selectedTool: 'select',
  selectedFeatureId: null,
  selectedFaceId: null,
  selectedEdgeId: null,
  selectedInstanceId: null,
  showGrid: true,
  showAxes: true,
  showShadows: true,
  showWireframe: false,
  ortho: false,
  sectionPlane: null,
  panelLeftCollapsed: false,
  panelRightCollapsed: false,
  panelBottomCollapsed: true,
  rightPanelTab: 'properties',
  activeDrawingSheetId: 'sheet1',
  activeSimulationId: 'sim1',
  commandPaletteOpen: false,
  exportDialogOpen: false,
  projectBrowserOpen: false,
  units: 'mm',
  precision: 3,
  toasts: [],
  aiMessages: [
    {
      id: 'ai_init',
      role: 'assistant',
      content: 'Hi! I\'m your AI engineering assistant. Try commands like "Add fillets to all external edges", "Create a gearbox housing with mounting holes", or "Reduce weight by 15%".',
      timestamp: Date.now(),
    },
  ],
  collaborators: seedCollaborators,
  versions: seedVersions,
  isRegenerating: false,
  lastRegenTime: Date.now(),
  parts,
  assemblies: [
    JSON.parse(JSON.stringify(seedAssembly)),
    JSON.parse(JSON.stringify(seedEngineAssembly)),
    JSON.parse(JSON.stringify(seedCNCAssembly)),
    JSON.parse(JSON.stringify(seedSuperCNCAssembly)),
  ],
  activeAssemblyId: seedAssembly.id,
  assembly: JSON.parse(JSON.stringify(seedAssembly)),
  drawings: JSON.parse(JSON.stringify(seedDrawingSheets)),
  simulations: JSON.parse(JSON.stringify(seedSimulations)),
  searchQuery: '',
  walkMode: false,

  setTheme: (t) => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', t === 'dark');
    }
    set({ theme: t });
  },
  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark';
    get().setTheme(next);
  },
  setWorkspace: (w) => set({ workspace: w, sketchMode: false, activeSketchId: null }),
  setActivePartId: (id) => set({ activePartId: id, workspace: 'part' }),
  enterSketch: (sketchId) => set({
    activeSketchId: sketchId,
    sketchMode: sketchId !== null,
    workspace: 'part',
    selectedTool: sketchId ? 'sketch-line' : 'select',
  }),
  setViewMode: (v) => set({ viewMode: v }),
  setSelectedTool: (t) => set({ selectedTool: t }),
  selectFeature: (id) => set({ selectedFeatureId: id }),
  selectInstance: (id) => set({ selectedInstanceId: id }),
  selectFace: (id) => set({ selectedFaceId: id }),
  selectEdge: (id) => set({ selectedEdgeId: id }),
  toggleGrid: () => set((s) => ({ showGrid: !s.showGrid })),
  toggleAxes: () => set((s) => ({ showAxes: !s.showAxes })),
  toggleOrtho: () => set((s) => ({ ortho: !s.ortho })),
  toggleShadows: () => set((s) => ({ showShadows: !s.showShadows })),
  setSectionPlane: (v) => set({ sectionPlane: v, viewMode: v !== null ? 'section' : get().viewMode }),
  toggleLeftPanel: () => set((s) => ({ panelLeftCollapsed: !s.panelLeftCollapsed })),
  toggleRightPanel: () => set((s) => ({ panelRightCollapsed: !s.panelRightCollapsed })),
  toggleBottomPanel: () => set((s) => ({ panelBottomCollapsed: !s.panelBottomCollapsed })),
  setRightPanelTab: (t) => set((s) => ({ rightPanelTab: t, panelRightCollapsed: false })),
  setActiveDrawingSheetId: (id) => set({ activeDrawingSheetId: id, workspace: 'drawing' }),
  setActiveSimulationId: (id) => set({ activeSimulationId: id, workspace: 'simulation' }),
  setActiveAssemblyId: (id) => set((s) => ({
    activeAssemblyId: id,
    assembly: s.assemblies.find((a) => a.id === id) || s.assembly,
    workspace: 'assembly',
    selectedInstanceId: null,
  })),
  setCommandPaletteOpen: (v) => set({ commandPaletteOpen: v }),
  setExportDialogOpen: (v) => set({ exportDialogOpen: v }),
  setProjectBrowserOpen: (v) => set({ projectBrowserOpen: v }),
  setUnits: (u) => set({ units: u }),
  setPrecision: (p) => set({ precision: p }),
  toast: (t) => {
    const id = uid('toast');
    set((s) => ({ toasts: [...s.toasts, { ...t, id }] }));
    setTimeout(() => get().dismissToast(id), 3500);
  },
  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  sendAIMessage: (content) => {
    const userMsg: AIMessage = {
      id: uid('ai'), role: 'user', content, timestamp: Date.now()
    };
    set((s) => ({ aiMessages: [...s.aiMessages, userMsg] }));

    // Simulated AI response with realistic engineering suggestions
    setTimeout(() => {
      const lower = content.toLowerCase();
      let response = '';
      let actions: { label: string; action: string }[] = [];

      if (lower.includes('fillet')) {
        response = 'I\'ll add fillets to all external edges of the active part. Based on the current geometry, I identified 24 external edges. Using the default FilletRadius parameter (4mm). This will regenerate features f_fillet1 downstream.';
        actions = [
          { label: 'Apply fillet (R4)', action: 'apply-fillet-all' },
          { label: 'Use R2 instead', action: 'apply-fillet-2mm' },
        ];
      } else if (lower.includes('gearbox')) {
        response = 'Generating a parametric gearbox housing. I\'ll create:\n1. A 120×80×60mm base extrusion\n2. Two Ø24 bearing bores (H7 tolerance)\n3. 4× Ø8 mounting holes\n4. 6mm wall thickness shell\n5. R4 external fillets\n6. 1.5mm bore chamfers\n\nMaterial suggestion: Aluminum 6061-T6 (good strength-to-weight, machinable). Estimated mass: 842g.';
        actions = [
          { label: 'Generate model', action: 'generate-gearbox' },
          { label: 'Use different material', action: 'choose-material' },
        ];
      } else if (lower.includes('reduce weight') || lower.includes('lighter')) {
        response = 'Weight optimization analysis:\n\nCurrent mass: 842g\nTarget: 715g (-15%)\n\nRecommended changes:\n• Reduce wall thickness 6mm → 4mm (-92g)\n• Add lightening pockets to top face (-35g)\n• Use larger fillet radii (saves material)\n• Verify structural integrity via FEA\n\nI recommend running a stress simulation after these changes to confirm the safety factor remains > 1.5.';
        actions = [
          { label: 'Apply optimization', action: 'optimize-weight' },
          { label: 'Run stress check', action: 'run-fea' },
        ];
      } else if (lower.includes('mate') || lower.includes('assembly')) {
        response = 'Assembly troubleshooting:\n\nDetected 1 over-constrained mate:\n• "Shaft1-Housing" (cylindrical) conflicts with "Bearing1-Housing"\n\nSuggested fix: Convert "Bearing1-Housing" to a concentric + planar mate instead of cylindrical. The bearing is already constrained by the shaft.\n\nWould you like me to apply this fix?';
        actions = [{ label: 'Fix mate conflict', action: 'fix-mate' }];
      } else if (lower.includes('simulation') || lower.includes('stress') || lower.includes('fea')) {
        response = 'I recommend setting up a static stress study:\n\n1. Fixture: Bottom face fixed (6-DOF)\n2. Load: 2500N downward on bearing bore\n3. Mesh: 2.5mm tetrahedral (142K elements estimated)\n4. Material: Al 6061-T6 (yield 276 MPa)\n\nExpected runtime: ~45 seconds. Safety factor target: > 2.0.';
        actions = [
          { label: 'Run stress analysis', action: 'run-fea' },
          { label: 'Refine mesh', action: 'refine-mesh' },
        ];
      } else if (lower.includes('manufactur') || lower.includes('cnc') || lower.includes('print')) {
        response = 'Manufacturability review:\n\n✓ All walls ≥ 1mm (machinable)\n✓ No deep pockets (>3× diameter)\n✓ Fillets ≥ tool radius (R4 = 6mm tool)\n⚠ 2 internal corners unreachable by milling\n\nFor CNC: 3-axis setup, est. 22 minutes machining time\nFor 3D printing: 4h 12m, no supports needed';
        actions = [
          { label: 'Generate CNC toolpath', action: 'gen-cnc' },
          { label: 'Export STL', action: 'export-stl' },
        ];
      } else {
        response = 'I can help with:\n• Feature creation ("create a hole pattern")\n• Design optimization ("reduce weight by 15%")\n• Assembly troubleshooting ("check mate conflicts")\n• Simulation setup ("run stress analysis")\n• Manufacturing review ("check manufacturability")\n• Constraint diagnosis ("why is my sketch under-defined?")\n\nWhat would you like to do?';
      }

      const aiMsg: AIMessage = {
        id: uid('ai'), role: 'assistant', content: response, timestamp: Date.now(), actions
      };
      set((s) => ({ aiMessages: [...s.aiMessages, aiMsg] }));
    }, 600);
  },
  addAIMessage: (m) => set((s) => ({
    aiMessages: [...s.aiMessages, { ...m, id: uid('ai'), timestamp: Date.now() }]
  })),
  regenerateAll: () => {
    set({ isRegenerating: true });
    setTimeout(() => {
      set((s) => {
        const updatedParts = s.parts.map((p) => ({
          ...p,
          features: p.features.map((f) => ({
            ...f,
            status: (f.suppressed ? 'suppressed' : 'regenerated') as FeatureStatus,
            error: undefined,
          })),
        }));
        return {
          isRegenerating: false,
          lastRegenTime: Date.now(),
          parts: updatedParts,
        };
      });
      get().toast({ title: 'Regeneration complete', variant: 'success' });
    }, 700);
  },

  updateFeature: (id, patch) => set((s) => ({
    parts: s.parts.map((p) => p.id === s.activePartId ? {
      ...p,
      features: p.features.map((f) => f.id === id ? { ...f, ...patch, status: 'stale' as FeatureStatus } : f)
    } : p),
    isRegenerating: false,
  })),

  addFeature: (f) => set((s) => ({
    parts: s.parts.map((p) => p.id === s.activePartId ? {
      ...p, features: [...p.features, f]
    } : p),
  })),

  deleteFeature: (id) => {
    set((s) => ({
      parts: s.parts.map((p) => p.id === s.activePartId ? {
        ...p, features: p.features.filter((f) => f.id !== id)
      } : p),
      selectedFeatureId: s.selectedFeatureId === id ? null : s.selectedFeatureId,
    }));
    get().toast({ title: 'Feature deleted', variant: 'info' });
  },

  reorderFeature: (id, direction) => set((s) => ({
    parts: s.parts.map((p) => {
      if (p.id !== s.activePartId) return p;
      const idx = p.features.findIndex((f) => f.id === id);
      if (idx < 0) return p;
      const newIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= p.features.length) return p;
      const features = [...p.features];
      [features[idx], features[newIdx]] = [features[newIdx], features[idx]];
      return { ...p, features: features.map((f) => ({ ...f, status: 'stale' as FeatureStatus })) };
    }),
  })),

  toggleFeatureSuppressed: (id) => set((s) => ({
    parts: s.parts.map((p) => p.id === s.activePartId ? {
      ...p,
      features: p.features.map((f) => f.id === id ? {
        ...f, suppressed: !f.suppressed,
        status: (!f.suppressed ? 'suppressed' : 'stale') as FeatureStatus
      } : f)
    } : p),
  })),

  toggleFeatureVisible: (id) => set((s) => ({
    parts: s.parts.map((p) => p.id === s.activePartId ? {
      ...p,
      features: p.features.map((f) => f.id === id ? { ...f, visible: !f.visible } : f)
    } : p),
  })),

  updateParameter: (id, patch) => set((s) => ({
    parts: s.parts.map((p) => p.id === s.activePartId ? {
      ...p,
      parameters: p.parameters.map((pr) => pr.id === id ? { ...pr, ...patch } : pr),
      features: p.features.map((f) => ({ ...f, status: 'stale' as FeatureStatus })),
    } : p),
  })),

  addParameter: () => set((s) => ({
    parts: s.parts.map((p) => p.id === s.activePartId ? {
      ...p,
      parameters: [...p.parameters, {
        id: uid('param'),
        name: `Param${p.parameters.length + 1}`,
        value: 10,
        unit: 'mm',
      }],
    } : p),
  })),

  deleteParameter: (id) => set((s) => ({
    parts: s.parts.map((p) => p.id === s.activePartId ? {
      ...p, parameters: p.parameters.filter((pr) => pr.id !== id)
    } : p),
  })),

  addSketchEntity: (entity) => set((s) => {
    if (!s.activeSketchId) return {};
    return {
      parts: s.parts.map((p) => {
        if (p.id !== s.activePartId) return p;
        return {
          ...p,
          sketches: p.sketches.map((sk) => sk.id === s.activeSketchId ? {
            ...sk,
            entities: [...sk.entities, { ...entity, id: uid('ent') }],
            fullyDefined: false,
          } : sk),
        };
      }),
    };
  }),

  deleteSketchEntity: (id) => set((s) => ({
    parts: s.parts.map((p) => p.id === s.activePartId ? {
      ...p,
      sketches: p.sketches.map((sk) => sk.id === s.activeSketchId ? {
        ...sk,
        entities: sk.entities.filter((e) => e.id !== id),
      } : sk),
    } : p),
  })),

  addConstraint: (c) => set((s) => ({
    parts: s.parts.map((p) => p.id === s.activePartId ? {
      ...p,
      sketches: p.sketches.map((sk) => sk.id === s.activeSketchId ? {
        ...sk,
        constraints: [...sk.constraints, { ...c, id: uid('cs') }],
      } : sk),
    } : p),
  })),

  addDimension: (d) => set((s) => ({
    parts: s.parts.map((p) => p.id === s.activePartId ? {
      ...p,
      sketches: p.sketches.map((sk) => sk.id === s.activeSketchId ? {
        ...sk,
        dimensions: [...sk.dimensions, { ...d, id: uid('dim') }],
      } : sk),
    } : p),
  })),

  createSketch: (name, plane) => {
    const newSketch: Sketch = {
      id: uid('sk'), name, plane,
      entities: [], constraints: [], dimensions: [], fullyDefined: false,
    };
    const feat: Feature = {
      id: uid('f'), type: 'sketch', name,
      visible: true, suppressed: false, status: 'regenerated',
      parameters: {}, sketchId: newSketch.id, createdAt: Date.now(),
    };
    set((s) => ({
      parts: s.parts.map((p) => p.id === s.activePartId ? {
        ...p,
        sketches: [...p.sketches, newSketch],
        features: [...p.features, feat],
      } : p),
      activeSketchId: newSketch.id,
      sketchMode: true,
      selectedTool: 'sketch-line',
    }));
    get().toast({ title: `Sketch "${name}" created`, variant: 'success' });
  },

  toggleExploded: () => set((s) => ({
    assembly: { ...s.assembly, exploded: !s.assembly.exploded }
  })),
  setExplodedFactor: (f) => set((s) => ({
    assembly: { ...s.assembly, explodedFactor: f }
  })),
  addInstance: (partId) => set((s) => {
    const part = s.parts.find((p) => p.id === partId);
    if (!part) return {};
    const newInstance: AssemblyInstance = {
      id: uid('ins'),
      partId,
      name: `${part.name} ${s.assembly.instances.filter((i) => i.partId === partId).length + 1}`,
      transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: 1 },
      visible: true,
      explodedOffset: [0, 0, 0],
    };
    return { assembly: { ...s.assembly, instances: [...s.assembly.instances, newInstance] } };
  }),
  updateInstance: (id, patch) => set((s) => ({
    assembly: {
      ...s.assembly,
      instances: s.assembly.instances.map((i) => i.id === id ? { ...i, ...patch, transform: patch.transform ? { ...i.transform, ...patch.transform } : i.transform } : i),
    },
  })),
  toggleMate: (id) => set((s) => ({
    assembly: {
      ...s.assembly,
      mates: s.assembly.mates.map((m) => m.id === id ? { ...m, enabled: !m.enabled } : m),
    },
  })),
  addMate: (m) => set((s) => ({
    assembly: { ...s.assembly, mates: [...s.assembly.mates, { ...m, id: uid('mate') }] },
  })),

  runSimulation: (id) => {
    set((s) => ({
      simulations: s.simulations.map((sim) =>
        sim.id === id ? { ...sim, status: 'meshing', progress: 5 } : sim
      ),
    }));
    get().toast({ title: 'Simulation started', description: 'Generating mesh...', variant: 'info' });

    let progress = 5;
    const interval = setInterval(() => {
      progress += Math.random() * 18 + 7;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        set((s) => ({
          simulations: s.simulations.map((sim) => sim.id === id ? {
            ...sim,
            status: 'completed',
            progress: 100,
            results: {
              maxStress: 80 + Math.random() * 100,
              minStress: 0.5 + Math.random() * 5,
              maxDisplacement: 0.05 + Math.random() * 0.2,
              safetyFactor: 1.4 + Math.random() * 2.5,
              mass: 0.842,
              heatmap: 'stress',
            },
          } as SimulationStudy : sim),
        }));
        get().toast({ title: 'Simulation completed', variant: 'success' });
      } else {
        set((s) => ({
          simulations: s.simulations.map((sim) =>
            sim.id === id ? {
              ...sim,
              status: progress < 30 ? 'meshing' : 'running',
              progress,
            } : sim
          ),
        }));
      }
    }, 250);
  },

  createVersion: (message) => set((s) => {
    const lastVersion = s.versions[s.versions.length - 1];
    const newVersion: VersionEntry = {
      id: uid('v'),
      timestamp: Date.now(),
      author: s.collaborators[0]?.name || 'You',
      message,
      parentId: lastVersion?.id || '',
      branch: 'main',
    };
    return { versions: [...s.versions, newVersion] };
  }),

  revertVersion: (id) => {
    get().toast({ title: 'Version restored', description: `Reverted to ${id}`, variant: 'info' });
  },

  setSearchQuery: (q) => set({ searchQuery: q }),
  toggleWalkMode: () => set((s) => ({ walkMode: !s.walkMode })),
}));
