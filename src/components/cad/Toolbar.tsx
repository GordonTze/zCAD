'use client';

import {
  MousePointer2, Spline, Square, Circle as CircleIcon, DraftingCompass,
  Hexagon, Pencil, Ruler, ArrowUpRight, RotateCw, FolderTree, Layers3,
  Cylinder, Scissors, Combine, Minus, Box, HardHat, Sparkles,
  Sun, Grid3x3, Eye, EyeOff, Maximize, Magnet, Move, Search,
  ChevronDown, Plus, Minus as MinusIcon, RefreshCw, Play,
  Snowflake, Mountain, Plane as PlaneIcon, Wrench, FileText
} from 'lucide-react';
import { useCADStore } from '@/store/useCADStore';
import type { ToolId, ViewMode } from '@/lib/cad/types';
import { useState, useRef, useEffect } from 'react';

interface ToolGroup {
  name: string;
  tools: { id: ToolId; label: string; icon: React.ReactNode; more?: ToolId[] }[];
}

const toolGroups: ToolGroup[] = [
  {
    name: 'selection',
    tools: [
      { id: 'select', label: 'Select', icon: <MousePointer2 className="w-3.5 h-3.5" /> },
    ],
  },
  {
    name: 'sketch',
    tools: [
      { id: 'sketch-line', label: 'Line', icon: <Spline className="w-3.5 h-3.5" />, more: ['sketch-rectangle', 'sketch-polygon', 'sketch-slot'] },
      { id: 'sketch-circle', label: 'Circle', icon: <CircleIcon className="w-3.5 h-3.5" />, more: ['sketch-arc', 'sketch-spline'] },
      { id: 'sketch-point', label: 'Point', icon: <Plus className="w-3.5 h-3.5" /> },
      { id: 'dim-linear', label: 'Dimension', icon: <Ruler className="w-3.5 h-3.5" />, more: ['dim-angular', 'dim-radial', 'dim-diameter'] },
    ],
  },
  {
    name: 'features',
    tools: [
      { id: 'feature-extrude', label: 'Extrude', icon: <Box className="w-3.5 h-3.5" /> },
      { id: 'feature-revolve', label: 'Revolve', icon: <RotateCw className="w-3.5 h-3.5" /> },
      { id: 'feature-sweep', label: 'Sweep', icon: <Move className="w-3.5 h-3.5" /> },
      { id: 'feature-loft', label: 'Loft', icon: <Layers3 className="w-3.5 h-3.5" /> },
      { id: 'feature-fillet', label: 'Fillet', icon: <Mountain className="w-3.5 h-3.5" /> },
      { id: 'feature-chamfer', label: 'Chamfer', icon: <Mountain className="w-3.5 h-3.5 rotate-45" /> },
      { id: 'feature-shell', label: 'Shell', icon: <Hexagon className="w-3.5 h-3.5" /> },
      { id: 'feature-hole', label: 'Hole', icon: <CircleIcon className="w-3.5 h-3.5" /> },
      { id: 'feature-mirror', label: 'Mirror', icon: <Snowflake className="w-3.5 h-3.5" /> },
      { id: 'feature-pattern-linear', label: 'Pattern', icon: <Grid3x3 className="w-3.5 h-3.5" />, more: ['feature-pattern-circular'] },
    ],
  },
  {
    name: 'boolean',
    tools: [
      { id: 'boolean-union', label: 'Union', icon: <Combine className="w-3.5 h-3.5" /> },
      { id: 'boolean-subtract', label: 'Subtract', icon: <Minus className="w-3.5 h-3.5" /> },
      { id: 'boolean-intersect', label: 'Intersect', icon: <Scissors className="w-3.5 h-3.5" /> },
    ],
  },
  {
    name: 'inspection',
    tools: [
      { id: 'measure', label: 'Measure', icon: <Ruler className="w-3.5 h-3.5" /> },
      { id: 'section-plane', label: 'Section', icon: <PlaneIcon className="w-3.5 h-3.5" /> },
    ],
  },
];

const viewModes: { id: ViewMode; label: string; icon: React.ReactNode }[] = [
  { id: 'shaded', label: 'Shaded', icon: <Box className="w-3.5 h-3.5" /> },
  { id: 'shaded-with-edges', label: 'Shaded + Edges', icon: <Hexagon className="w-3.5 h-3.5" /> },
  { id: 'wireframe', label: 'Wireframe', icon: <Grid3x3 className="w-3.5 h-3.5" /> },
  { id: 'transparent', label: 'Transparent', icon: <Eye className="w-3.5 h-3.5" /> },
  { id: 'section', label: 'Section', icon: <PlaneIcon className="w-3.5 h-3.5" /> },
];

const toolLabels: Record<string, string> = {
  'sketch-line': 'Line',
  'sketch-rectangle': 'Rectangle',
  'sketch-polygon': 'Polygon',
  'sketch-slot': 'Slot',
  'sketch-arc': 'Arc',
  'sketch-spline': 'Spline',
  'dim-angular': 'Angular Dimension',
  'dim-radial': 'Radial Dimension',
  'dim-diameter': 'Diameter Dimension',
  'feature-pattern-circular': 'Circular Pattern',
};

export function Toolbar() {
  const selectedTool = useCADStore((s) => s.selectedTool);
  const setSelectedTool = useCADStore((s) => s.setSelectedTool);
  const viewMode = useCADStore((s) => s.viewMode);
  const setViewMode = useCADStore((s) => s.setViewMode);
  const showGrid = useCADStore((s) => s.showGrid);
  const toggleGrid = useCADStore((s) => s.toggleGrid);
  const showAxes = useCADStore((s) => s.showAxes);
  const toggleAxes = useCADStore((s) => s.toggleAxes);
  const showShadows = useCADStore((s) => s.showShadows);
  const toggleShadows = useCADStore((s) => s.toggleShadows); // not exposed - re-use grid pattern
  const setSectionPlane = useCADStore((s) => s.setSectionPlane);
  const regenerateAll = useCADStore((s) => s.regenerateAll);
  const isRegenerating = useCADStore((s) => s.isRegenerating);
  const sketchMode = useCADStore((s) => s.sketchMode);
  const workspace = useCADStore((s) => s.workspace);
  const setRightPanelTab = useCADStore((s) => s.setRightPanelTab);
  const toast = useCADStore((s) => s.toast);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [hoveredTool, setHoveredTool] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleToolClick = (tool: ToolId) => {
    setSelectedTool(tool);
    // Trigger action feedback
    const label = toolLabels[tool] || toolLabels[tool.replace('sketch-', 'sketch-')] || tool;
    if (tool.startsWith('feature-') || tool.startsWith('boolean-')) {
      toast({ title: `${label} tool activated`, description: 'Click geometry to apply', variant: 'info' });
    }
  };

  // Filter tool groups based on workspace
  const visibleGroups = toolGroups.filter(g => {
    if (workspace === 'part') return true;
    if (workspace === 'assembly') return g.name === 'selection' || g.name === 'inspection';
    return g.name === 'selection';
  });

  return (
    <div className="h-10 cad-toolbar border-b flex items-center px-2 gap-1 select-none relative">
      {/* Workspace indicator */}
      <div className="flex items-center gap-1 px-2 mr-1 h-7 rounded bg-card border text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
        {workspace === 'part' && <Box className="w-3 h-3" />}
        {workspace === 'assembly' && <Combine className="w-3 h-3" />}
        {workspace === 'drawing' && <FileText className="w-3 h-3" />}
        {workspace === 'simulation' && <Sparkles className="w-3 h-3" />}
        <span>{workspace}</span>
        {sketchMode && <span className="text-primary ml-1">· SKETCH</span>}
      </div>

      <div className="cad-tool-divider" />

      {/* Tool groups */}
      <div className="flex items-center gap-0.5" ref={dropdownRef}>
        {visibleGroups.map((group, gi) => (
          <div key={group.name} className="flex items-center gap-0.5">
            {gi > 0 && <div className="cad-tool-divider" />}
            {group.tools.map((tool) => (
              <div key={tool.id} className="relative">
                <button
                  className={`cad-tool-btn ${selectedTool === tool.id ? 'active' : ''}`}
                  title={toolLabels[tool.id] || tool.label}
                  onClick={() => handleToolClick(tool.id)}
                  onMouseEnter={() => setHoveredTool(tool.id)}
                  onMouseLeave={() => setHoveredTool(null)}
                >
                  {tool.icon}
                  {tool.more && <ChevronDown className="w-2 h-2 absolute -bottom-0.5 -right-0.5 opacity-60" />}
                </button>
                {tool.more && openDropdown === tool.id && (
                  <div className="absolute top-full left-0 mt-px z-50 min-w-[140px] py-1 cad-panel border rounded shadow-xl">
                    {tool.more.map((subTool) => (
                      <div
                        key={subTool}
                        className="cad-menu-item flex items-center gap-2"
                        onClick={() => {
                          handleToolClick(subTool);
                          setOpenDropdown(null);
                        }}
                      >
                        {toolLabels[subTool]}
                      </div>
                    ))}
                  </div>
                )}
                {tool.more && (
                  <button
                    className="absolute -bottom-0.5 -right-0.5 w-3 h-3 flex items-center justify-center hover:bg-accent rounded"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDropdown(openDropdown === tool.id ? null : tool.id);
                    }}
                  >
                    <ChevronDown className="w-2 h-2" />
                  </button>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="flex-1" />

      {/* Regenerate button */}
      <button
        className="flex items-center gap-1.5 h-7 px-3 rounded bg-primary/15 hover:bg-primary/25 text-primary text-[12px] font-medium transition"
        onClick={regenerateAll}
        disabled={isRegenerating}
        title="Regenerate all features (Ctrl+G)"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
        {isRegenerating ? 'Regenerating...' : 'Regenerate'}
      </button>

      <div className="cad-tool-divider" />

      {/* View modes */}
      <div className="flex items-center gap-0.5">
        {viewModes.map((v) => (
          <button
            key={v.id}
            className={`cad-tool-btn ${viewMode === v.id ? 'active' : ''}`}
            title={v.label}
            onClick={() => {
              if (v.id === 'section') {
                setSectionPlane(0);
              } else {
                setSectionPlane(null);
                setViewMode(v.id);
              }
            }}
          >
            {v.icon}
          </button>
        ))}
      </div>

      <div className="cad-tool-divider" />

      {/* Toggle: grid / axes / shadows */}
      <button
        className={`cad-tool-btn ${showGrid ? 'active' : ''}`}
        title="Toggle grid"
        onClick={toggleGrid}
      >
        <Grid3x3 className="w-3.5 h-3.5" />
      </button>
      <button
        className={`cad-tool-btn ${showAxes ? 'active' : ''}`}
        title="Toggle axes"
        onClick={toggleAxes}
      >
        <Move className="w-3.5 h-3.5" />
      </button>
      <button
        className={`cad-tool-btn ${showShadows ? 'active' : ''}`}
        title="Toggle shadows"
        onClick={toggleShadows}
      >
        <Sun className="w-3.5 h-3.5" />
      </button>

      <div className="cad-tool-divider" />

      {/* AI Assistant */}
      <button
        className="flex items-center gap-1.5 h-7 px-3 rounded bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 hover:from-violet-500/30 hover:to-fuchsia-500/30 text-[12px] font-medium border border-violet-500/30"
        onClick={() => setRightPanelTab('ai')}
        title="AI Engineering Assistant (Ctrl+I)"
      >
        <Sparkles className="w-3.5 h-3.5 text-violet-500" />
        <span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">AI Assistant</span>
      </button>

      {/* Tooltip */}
      {hoveredTool && (
        <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-card border text-[11px] shadow-md whitespace-nowrap pointer-events-none z-50">
          {toolLabels[hoveredTool] || hoveredTool}
        </div>
      )}
    </div>
  );
}
