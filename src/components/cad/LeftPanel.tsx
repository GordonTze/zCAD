'use client';

import { useState } from 'react';
import {
  ChevronRight, ChevronDown, Eye, EyeOff, Box, Circle, Square,
  Scissors, Combine, Minus, Plus, RotateCw, Move, Layers3,
  Mountain, Snowflake, Grid3x3, FileText, Sparkles, AlertCircle,
  CheckCircle2, Loader2, Search, Folder, FolderOpen, Wrench,
  CircleDashed, Beaker, GitBranch, History, Database,
  CircleDot, PenTool, DraftingCompass, MoreVertical, Trash2,
  ArrowUp, ArrowDown, Copy, Edit3
} from 'lucide-react';
import { useCADStore } from '@/store/useCADStore';
import type { Feature, FeatureType, Sketch, Part } from '@/lib/cad/types';

const featureIcons: Record<FeatureType, React.ReactNode> = {
  sketch: <PenTool className="w-3.5 h-3.5" />,
  extrude: <Box className="w-3.5 h-3.5" />,
  revolve: <RotateCw className="w-3.5 h-3.5" />,
  sweep: <Move className="w-3.5 h-3.5" />,
  loft: <Layers3 className="w-3.5 h-3.5" />,
  shell: <CircleDashed className="w-3.5 h-3.5" />,
  draft: <DraftingCompass className="w-3.5 h-3.5" />,
  fillet: <Mountain className="w-3.5 h-3.5" />,
  chamfer: <Mountain className="w-3.5 h-3.5 rotate-45" />,
  mirror: <Snowflake className="w-3.5 h-3.5" />,
  'pattern-linear': <Grid3x3 className="w-3.5 h-3.5" />,
  'pattern-circular': <RotateCw className="w-3.5 h-3.5" />,
  'boolean-union': <Combine className="w-3.5 h-3.5" />,
  'boolean-subtract': <Minus className="w-3.5 h-3.5" />,
  'boolean-intersect': <Scissors className="w-3.5 h-3.5" />,
  hole: <Circle className="w-3.5 h-3.5" />,
  rib: <Wrench className="w-3.5 h-3.5" />,
  plane: <FileText className="w-3.5 h-3.5" />,
  axis: <Plus className="w-3.5 h-3.5" />,
};

function StatusIcon({ status }: { status: Feature['status'] }) {
  switch (status) {
    case 'regenerated': return <CheckCircle2 className="w-3 h-3 text-emerald-500" />;
    case 'stale': return <AlertCircle className="w-3 h-3 text-amber-500" />;
    case 'failed': return <AlertCircle className="w-3 h-3 text-red-500" />;
    case 'suppressed': return <CircleDashed className="w-3 h-3 text-muted-foreground" />;
    default: return null;
  }
}

function FeatureTreeItem({ feature, depth }: { feature: Feature; depth: number }) {
  const selectedFeatureId = useCADStore((s) => s.selectedFeatureId);
  const selectFeature = useCADStore((s) => s.selectFeature);
  const toggleFeatureVisible = useCADStore((s) => s.toggleFeatureVisible);
  const toggleFeatureSuppressed = useCADStore((s) => s.toggleFeatureSuppressed);
  const deleteFeature = useCADStore((s) => s.deleteFeature);
  const reorderFeature = useCADStore((s) => s.reorderFeature);
  const enterSketch = useCADStore((s) => s.enterSketch);
  const [expanded, setExpanded] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const selected = selectedFeatureId === feature.id;

  return (
    <div
      className={`feature-tree-item flex items-center text-[12px] cursor-pointer ${selected ? 'selected' : ''}`}
      style={{ paddingLeft: depth * 12 + 8 }}
      onClick={() => selectFeature(feature.id)}
      onDoubleClick={() => feature.type === 'sketch' && enterSketch(feature.sketchId || feature.id)}
    >
      <button
        className="w-3 h-3 flex items-center justify-center text-muted-foreground hover:text-foreground"
        onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
      >
        {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
      </button>
      <span className="text-muted-foreground mx-1">{featureIcons[feature.type]}</span>
      <span className={`flex-1 truncate ${feature.suppressed ? 'line-through text-muted-foreground' : ''}`}>
        {feature.name}
      </span>
      <span className="mr-1.5"><StatusIcon status={feature.status} /></span>
      <button
        className="w-4 h-4 flex items-center justify-center text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100"
        onClick={(e) => { e.stopPropagation(); toggleFeatureVisible(feature.id); }}
        title={feature.visible ? 'Hide' : 'Show'}
      >
        {feature.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
      </button>
      <div className="relative group">
        <button
          className="w-4 h-4 flex items-center justify-center text-muted-foreground hover:text-foreground"
          onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
        >
          <MoreVertical className="w-3 h-3" />
        </button>
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 top-full mt-px z-50 min-w-[160px] py-1 cad-panel border rounded shadow-xl">
              <div className="cad-menu-item flex items-center gap-2" onClick={(e) => { e.stopPropagation(); reorderFeature(feature.id, 'up'); setMenuOpen(false); }}>
                <ArrowUp className="w-3 h-3" /> Move Up
              </div>
              <div className="cad-menu-item flex items-center gap-2" onClick={(e) => { e.stopPropagation(); reorderFeature(feature.id, 'down'); setMenuOpen(false); }}>
                <ArrowDown className="w-3 h-3" /> Move Down
              </div>
              <div className="cad-menu-item flex items-center gap-2" onClick={(e) => { e.stopPropagation(); toggleFeatureSuppressed(feature.id); setMenuOpen(false); }}>
                <CircleDashed className="w-3 h-3" /> {feature.suppressed ? 'Unsuppress' : 'Suppress'}
              </div>
              <div className="cad-menu-item flex items-center gap-2" onClick={(e) => { e.stopPropagation(); setMenuOpen(false); }}>
                <Edit3 className="w-3 h-3" /> Edit...
              </div>
              <div className="cad-menu-item flex items-center gap-2" onClick={(e) => { e.stopPropagation(); setMenuOpen(false); }}>
                <Copy className="w-3 h-3" /> Copy
              </div>
              <div className="h-px bg-border my-1" />
              <div className="cad-menu-item flex items-center gap-2 text-red-500" onClick={(e) => { e.stopPropagation(); deleteFeature(feature.id); setMenuOpen(false); }}>
                <Trash2 className="w-3 h-3" /> Delete
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function PartItem({ part }: { part: Part }) {
  const activePartId = useCADStore((s) => s.activePartId);
  const setActivePartId = useCADStore((s) => s.setActivePartId);
  const [expanded, setExpanded] = useState(part.id === activePartId);
  const isActive = part.id === activePartId;

  return (
    <div>
      <div
        className={`feature-tree-item flex items-center text-[12px] cursor-pointer ${isActive ? 'selected' : ''}`}
        onClick={() => { setActivePartId(part.id); setExpanded(true); }}
      >
        <button
          className="w-3 h-3 flex items-center justify-center text-muted-foreground"
          onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
        >
          {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        </button>
        <Box className="w-3.5 h-3.5 mx-1" style={{ color: part.color }} />
        <span className="flex-1 truncate font-medium">{part.name}</span>
        <span className="text-[10px] text-muted-foreground font-mono">{part.partNumber}</span>
      </div>
      {expanded && (
        <div className="group">
          {part.sketches.map((sk) => (
            <SketchItem key={sk.id} sketch={sk} depth={1} />
          ))}
          {part.features.map((f) => (
            <FeatureTreeItem key={f.id} feature={f} depth={1} />
          ))}
        </div>
      )}
    </div>
  );
}

function SketchItem({ sketch, depth }: { sketch: Sketch; depth: number }) {
  const enterSketch = useCADStore((s) => s.enterSketch);
  const activeSketchId = useCADStore((s) => s.activeSketchId);
  const isActive = activeSketchId === sketch.id;

  return (
    <div
      className={`feature-tree-item flex items-center text-[12px] cursor-pointer ${isActive ? 'selected' : ''}`}
      style={{ paddingLeft: depth * 12 + 8 }}
      onClick={() => enterSketch(sketch.id)}
    >
      <span className="w-3" />
      <PenTool className={`w-3.5 h-3.5 mx-1 ${sketch.fullyDefined ? 'text-emerald-500' : 'text-amber-500'}`} />
      <span className="flex-1 truncate">{sketch.name}</span>
      <span className="text-[10px] text-muted-foreground">
        {sketch.fullyDefined ? 'FULL' : 'UNDER'}
      </span>
    </div>
  );
}

export function LeftPanel() {
  const parts = useCADStore((s) => s.parts);
  const assembly = useCADStore((s) => s.assembly);
  const workspace = useCADStore((s) => s.workspace);
  const activePartId = useCADStore((s) => s.activePartId);
  const selectedInstanceId = useCADStore((s) => s.selectedInstanceId);
  const selectInstance = useCADStore((s) => s.selectInstance);
  const toggleExploded = useCADStore((s) => s.toggleExploded);
  const createSketch = useCADStore((s) => s.createSketch);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'features' | 'assembly' | 'library'>('features');

  const activePart = parts.find((p) => p.id === activePartId);

  const filteredInstances = assembly.instances.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col cad-panel">
      {/* Tabs */}
      <div className="flex items-center border-b text-[11px] uppercase tracking-wider">
        <button
          className={`flex-1 py-1.5 font-medium ${tab === 'features' ? 'border-b-2 border-primary text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          onClick={() => setTab('features')}
        >
          Features
        </button>
        <button
          className={`flex-1 py-1.5 font-medium ${tab === 'assembly' ? 'border-b-2 border-primary text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          onClick={() => setTab('assembly')}
        >
          Assembly
        </button>
        <button
          className={`flex-1 py-1.5 font-medium ${tab === 'library' ? 'border-b-2 border-primary text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          onClick={() => setTab('library')}
        >
          Library
        </button>
      </div>

      {/* Search */}
      <div className="p-2 border-b">
        <div className="flex items-center gap-1.5 h-7 px-2 rounded bg-card border">
          <Search className="w-3 h-3 text-muted-foreground" />
          <input
            className="flex-1 bg-transparent outline-none text-[12px] placeholder:text-muted-foreground"
            placeholder="Search features..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {tab === 'features' && (
          <>
            <div className="flex items-center justify-between px-2 py-1.5 text-[11px] uppercase text-muted-foreground tracking-wider border-b bg-muted/30">
              <span>Part Studio</span>
              <button
                className="hover:text-foreground"
                onClick={() => createSketch(`Sketch ${activePart?.sketches.length ? activePart.sketches.length + 1 : 1}`, 'xy')}
                title="New sketch"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            {parts.map((p) => (
              <PartItem key={p.id} part={p} />
            ))}
          </>
        )}

        {tab === 'assembly' && (
          <>
            <div className="flex items-center justify-between px-2 py-1.5 text-[11px] uppercase text-muted-foreground tracking-wider border-b bg-muted/30">
              <span>Instances ({assembly.instances.length})</span>
              <button
                className={`px-2 py-0.5 rounded text-[10px] font-mono ${assembly.exploded ? 'bg-primary text-primary-foreground' : 'bg-card border'}`}
                onClick={toggleExploded}
                title="Toggle exploded view"
              >
                {assembly.exploded ? 'EXPLODED' : 'EXPLODE'}
              </button>
            </div>
            {filteredInstances.map((inst) => {
              const part = parts.find((p) => p.id === inst.partId);
              const selected = selectedInstanceId === inst.id;
              return (
                <div
                  key={inst.id}
                  className={`feature-tree-item flex items-center text-[12px] cursor-pointer ${selected ? 'selected' : ''}`}
                  style={{ paddingLeft: 12 }}
                  onClick={() => selectInstance(inst.id)}
                >
                  <Box className="w-3.5 h-3.5 mx-1" style={{ color: part?.color }} />
                  <span className="flex-1 truncate">{inst.name}</span>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    [{inst.transform.position.join(',')}]
                  </span>
                </div>
              );
            })}
            <div className="px-2 py-1.5 mt-2 text-[11px] uppercase text-muted-foreground tracking-wider border-y bg-muted/30">
              Mates ({assembly.mates.length})
            </div>
            {assembly.mates.map((m) => (
              <div
                key={m.id}
                className="feature-tree-item flex items-center text-[12px]"
                style={{ paddingLeft: 12 }}
              >
                <Combine className="w-3.5 h-3.5 mx-1 text-muted-foreground" />
                <span className="flex-1 truncate">{m.name}</span>
                <span className="text-[10px] px-1 rounded bg-muted text-muted-foreground font-mono uppercase">
                  {m.type}
                </span>
                {!m.enabled && <CircleDashed className="w-3 h-3 text-muted-foreground ml-1" />}
              </div>
            ))}
          </>
        )}

        {tab === 'library' && (
          <>
            <div className="px-2 py-1.5 text-[11px] uppercase text-muted-foreground tracking-wider border-b bg-muted/30">
              Standard Parts
            </div>
            {[
              { name: 'ISO 4762 - Socket Head Cap Screw', cat: 'Fasteners' },
              { name: 'ISO 7089 - Plain Washer', cat: 'Fasteners' },
              { name: 'SKF 6204 - Ball Bearing', cat: 'Bearings' },
              { name: 'SKF 6205 - Ball Bearing', cat: 'Bearings' },
              { name: 'ISO 273 - Close Fit Hole', cat: 'Holes' },
              { name: 'DIN 912 - Hex Socket Bolt', cat: 'Fasteners' },
              { name: 'NEMA 17 - Stepper Mount', cat: 'Motors' },
              { name: 'NEMA 23 - Stepper Mount', cat: 'Motors' },
              { name: 'GT2 Pulley 20T', cat: 'Power' },
              { name: 'GT2 Belt 6mm', cat: 'Power' },
            ].map((item, i) => (
              <div key={i} className="feature-tree-item flex items-center text-[12px]" style={{ paddingLeft: 12 }}>
                <Database className="w-3.5 h-3.5 mx-1 text-muted-foreground" />
                <span className="flex-1 truncate">{item.name}</span>
                <span className="text-[10px] text-muted-foreground">{item.cat}</span>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Bottom: Properties summary */}
      {activePart && (
        <div className="border-t p-2 text-[11px] bg-muted/30">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Mass:</span>
            <span className="font-mono">{activePart.mass.toFixed(3)} kg</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Volume:</span>
            <span className="font-mono">{(activePart.volume / 1000).toFixed(0)} cm³</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Features:</span>
            <span className="font-mono">{activePart.features.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Material:</span>
            <span className="truncate ml-2">{activePart.material}</span>
          </div>
        </div>
      )}
    </div>
  );
}
