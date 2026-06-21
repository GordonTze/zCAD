'use client';

import { useEffect, useState, useRef } from 'react';
import {
  Search, CornerDownLeft, ArrowRight, Box, Combine, FileText, Beaker,
  Sparkles, Settings2, Cpu, Plus, RotateCw, Mountain, Move, Layers3,
  Snowflake, Grid3x3, Circle, Eye, Plane as PlaneIcon, Ruler,
  Save, Download, GitBranch, Users, Cloud, RefreshCw, Wrench,
  Scissors, Minus, Hexagon, ArrowUp, ArrowDown, EyeOff, PersonStanding
} from 'lucide-react';
import { useCADStore } from '@/store/useCADStore';
import type { WorkspaceType } from '@/lib/cad/types';

interface Command {
  id: string;
  label: string;
  category: string;
  icon: React.ReactNode;
  shortcut?: string;
  action?: () => void;
}

export function CommandPalette() {
  const open = useCADStore((s) => s.commandPaletteOpen);
  const setOpen = useCADStore((s) => s.setCommandPaletteOpen);
  const setWorkspace = useCADStore((s) => s.setWorkspace);
  const setSelectedTool = useCADStore((s) => s.setSelectedTool);
  const regenerateAll = useCADStore((s) => s.regenerateAll);
  const toggleTheme = useCADStore((s) => s.toggleTheme);
  const setRightPanelTab = useCADStore((s) => s.setRightPanelTab);
  const setExportDialogOpen = useCADStore((s) => s.setExportDialogOpen);
  const toast = useCADStore((s) => s.toast);
  const createSketch = useCADStore((s) => s.createSketch);
  const toggleWalkMode = useCADStore((s) => s.toggleWalkMode);

  const [query, setQuery] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: Command[] = [
    { id: 'ws-part', label: 'Switch to Part Studio', category: 'Workspace', icon: <Box className="w-3.5 h-3.5" />, action: () => setWorkspace('part') },
    { id: 'ws-asm', label: 'Switch to Assembly', category: 'Workspace', icon: <Combine className="w-3.5 h-3.5" />, action: () => setWorkspace('assembly') },
    { id: 'ws-drawing', label: 'Switch to Drawing', category: 'Workspace', icon: <FileText className="w-3.5 h-3.5" />, action: () => setWorkspace('drawing') },
    { id: 'ws-sim', label: 'Switch to Simulation', category: 'Workspace', icon: <Beaker className="w-3.5 h-3.5" />, action: () => setWorkspace('simulation') },
    { id: 'sketch-new', label: 'Create New Sketch', category: 'Sketch', icon: <Plus className="w-3.5 h-3.5" />, shortcut: 'S', action: () => createSketch(`Sketch ${Date.now() % 100}`, 'xy') },
    { id: 'sketch-line', label: 'Sketch: Line', category: 'Sketch', icon: <Plus className="w-3.5 h-3.5" />, action: () => setSelectedTool('sketch-line') },
    { id: 'sketch-rect', label: 'Sketch: Rectangle', category: 'Sketch', icon: <Box className="w-3.5 h-3.5" />, action: () => setSelectedTool('sketch-rectangle') },
    { id: 'sketch-circle', label: 'Sketch: Circle', category: 'Sketch', icon: <Circle className="w-3.5 h-3.5" />, action: () => setSelectedTool('sketch-circle') },
    { id: 'ft-extrude', label: 'Feature: Extrude', category: 'Feature', icon: <Box className="w-3.5 h-3.5" />, shortcut: 'E', action: () => setSelectedTool('feature-extrude') },
    { id: 'ft-revolve', label: 'Feature: Revolve', category: 'Feature', icon: <RotateCw className="w-3.5 h-3.5" />, shortcut: 'R', action: () => setSelectedTool('feature-revolve') },
    { id: 'ft-sweep', label: 'Feature: Sweep', category: 'Feature', icon: <Move className="w-3.5 h-3.5" />, shortcut: 'W', action: () => setSelectedTool('feature-sweep') },
    { id: 'ft-loft', label: 'Feature: Loft', category: 'Feature', icon: <Layers3 className="w-3.5 h-3.5" />, shortcut: 'L', action: () => setSelectedTool('feature-loft') },
    { id: 'ft-fillet', label: 'Feature: Fillet', category: 'Feature', icon: <Mountain className="w-3.5 h-3.5" />, shortcut: 'F', action: () => setSelectedTool('feature-fillet') },
    { id: 'ft-chamfer', label: 'Feature: Chamfer', category: 'Feature', icon: <Mountain className="w-3.5 h-3.5 rotate-45" />, shortcut: 'C', action: () => setSelectedTool('feature-chamfer') },
    { id: 'ft-shell', label: 'Feature: Shell', category: 'Feature', icon: <Hexagon className="w-3.5 h-3.5" />, action: () => setSelectedTool('feature-shell') },
    { id: 'ft-hole', label: 'Feature: Hole', category: 'Feature', icon: <Circle className="w-3.5 h-3.5" />, action: () => setSelectedTool('feature-hole') },
    { id: 'ft-mirror', label: 'Feature: Mirror', category: 'Feature', icon: <Snowflake className="w-3.5 h-3.5" />, action: () => setSelectedTool('feature-mirror') },
    { id: 'ft-pattern-l', label: 'Feature: Linear Pattern', category: 'Feature', icon: <Grid3x3 className="w-3.5 h-3.5" />, action: () => setSelectedTool('feature-pattern-linear') },
    { id: 'ft-pattern-c', label: 'Feature: Circular Pattern', category: 'Feature', icon: <RotateCw className="w-3.5 h-3.5" />, action: () => setSelectedTool('feature-pattern-circular') },
    { id: 'bool-union', label: 'Boolean: Union', category: 'Boolean', icon: <Combine className="w-3.5 h-3.5" />, action: () => setSelectedTool('boolean-union') },
    { id: 'bool-sub', label: 'Boolean: Subtract', category: 'Boolean', icon: <Minus className="w-3.5 h-3.5" />, action: () => setSelectedTool('boolean-subtract') },
    { id: 'bool-int', label: 'Boolean: Intersect', category: 'Boolean', icon: <Scissors className="w-3.5 h-3.5" />, action: () => setSelectedTool('boolean-intersect') },
    { id: 'view-shaded', label: 'View: Shaded', category: 'View', icon: <Box className="w-3.5 h-3.5" />, action: () => useCADStore.getState().setViewMode('shaded') },
    { id: 'view-wire', label: 'View: Wireframe', category: 'View', icon: <Grid3x3 className="w-3.5 h-3.5" />, action: () => useCADStore.getState().setViewMode('wireframe') },
    { id: 'view-section', label: 'View: Section Cut', category: 'View', icon: <PlaneIcon className="w-3.5 h-3.5" />, shortcut: 'X', action: () => useCADStore.getState().setSectionPlane(0) },
    { id: 'view-transparent', label: 'View: Transparent', category: 'View', icon: <Eye className="w-3.5 h-3.5" />, action: () => useCADStore.getState().setViewMode('transparent') },
    { id: 'measure', label: 'Measure', category: 'Tools', icon: <Ruler className="w-3.5 h-3.5" />, shortcut: 'M', action: () => setSelectedTool('measure') },
    { id: 'regen', label: 'Regenerate All Features', category: 'Edit', icon: <RefreshCw className="w-3.5 h-3.5" />, shortcut: 'Ctrl+G', action: regenerateAll },
    { id: 'save', label: 'Save Version', category: 'File', icon: <Save className="w-3.5 h-3.5" />, shortcut: 'Ctrl+S', action: () => { useCADStore.getState().createVersion('Manual save'); toast({ title: 'Saved', variant: 'success' }); } },
    { id: 'export', label: 'Export...', category: 'File', icon: <Download className="w-3.5 h-3.5" />, shortcut: 'Ctrl+E', action: () => setExportDialogOpen(true) },
    { id: 'ai', label: 'Open AI Assistant', category: 'AI', icon: <Sparkles className="w-3.5 h-3.5" />, shortcut: 'Ctrl+I', action: () => setRightPanelTab('ai') },
    { id: 'ai-fillet', label: 'AI: "Add fillets to all external edges"', category: 'AI', icon: <Sparkles className="w-3.5 h-3.5" />, action: () => { setRightPanelTab('ai'); useCADStore.getState().sendAIMessage('Add fillets to all external edges'); } },
    { id: 'ai-weight', label: 'AI: "Reduce weight by 15%"', category: 'AI', icon: <Sparkles className="w-3.5 h-3.5" />, action: () => { setRightPanelTab('ai'); useCADStore.getState().sendAIMessage('Reduce weight by 15% while maintaining strength'); } },
    { id: 'ai-gearbox', label: 'AI: "Create a gearbox housing"', category: 'AI', icon: <Sparkles className="w-3.5 h-3.5" />, action: () => { setRightPanelTab('ai'); useCADStore.getState().sendAIMessage('Create a gearbox housing with mounting holes'); } },
    { id: 'ai-mate', label: 'AI: "Troubleshoot assembly mates"', category: 'AI', icon: <Sparkles className="w-3.5 h-3.5" />, action: () => { setRightPanelTab('ai'); useCADStore.getState().sendAIMessage('Check mate conflicts in assembly'); } },
    { id: 'ai-sim', label: 'AI: "Run stress analysis"', category: 'AI', icon: <Sparkles className="w-3.5 h-3.5" />, action: () => { setRightPanelTab('ai'); useCADStore.getState().sendAIMessage('Run stress analysis on this part'); } },
    { id: 'ai-mfg', label: 'AI: "Review manufacturability"', category: 'AI', icon: <Wrench className="w-3.5 h-3.5" />, action: () => { setRightPanelTab('ai'); useCADStore.getState().sendAIMessage('Review manufacturability'); } },
    { id: 'collab', label: 'Open Team Panel', category: 'Collaboration', icon: <Users className="w-3.5 h-3.5" />, action: () => setRightPanelTab('collab') },
    { id: 'versions', label: 'Version History', category: 'Collaboration', icon: <GitBranch className="w-3.5 h-3.5" />, action: () => setRightPanelTab('versions') },
    { id: 'theme', label: 'Toggle Dark/Light Theme', category: 'View', icon: <Settings2 className="w-3.5 h-3.5" />, action: toggleTheme },
    { id: 'walk', label: 'Enter Walk Mode (First-Person, Gravity, WASD)', category: 'View', icon: <PersonStanding className="w-3.5 h-3.5" />, action: toggleWalkMode },
    { id: 'params', label: 'Edit Variables', category: 'Edit', icon: <Cpu className="w-3.5 h-3.5" />, action: () => setRightPanelTab('parameters') },
  ];

  const filtered = commands.filter(c =>
    c.label.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    setSelectedIdx(0);
  }, [query]);

  if (!open) return null;

  const grouped = filtered.reduce((acc, c) => {
    if (!acc[c.category]) acc[c.category] = [];
    acc[c.category].push(c);
    return acc;
  }, {} as Record<string, Command[]>);

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)}>
      <div
        className="w-[600px] max-h-[60vh] bg-card border rounded-lg shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 px-3 py-2.5 border-b">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            ref={inputRef}
            className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-muted-foreground"
            placeholder="Search commands, features, AI prompts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIdx((i) => Math.min(i + 1, filtered.length - 1));
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIdx((i) => Math.max(i - 1, 0));
              } else if (e.key === 'Enter') {
                e.preventDefault();
                const cmd = filtered[selectedIdx];
                if (cmd) {
                  cmd.action?.();
                  setOpen(false);
                }
              } else if (e.key === 'Escape') {
                setOpen(false);
              }
            }}
          />
          <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-muted border text-muted-foreground font-mono">ESC</kbd>
        </div>

        <div className="flex-1 overflow-y-auto">
          {Object.entries(grouped).map(([cat, cmds]) => (
            <div key={cat}>
              <div className="px-3 py-1 text-[10px] uppercase tracking-wider text-muted-foreground bg-muted/30">
                {cat}
              </div>
              {cmds.map((c) => {
                const idx = filtered.indexOf(c);
                const selected = idx === selectedIdx;
                return (
                  <div
                    key={c.id}
                    className={`flex items-center gap-3 px-3 py-2 cursor-pointer text-[12px] ${
                      selected ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                    }`}
                    onMouseEnter={() => setSelectedIdx(idx)}
                    onClick={() => {
                      c.action?.();
                      setOpen(false);
                    }}
                  >
                    <span className={selected ? '' : 'text-muted-foreground'}>{c.icon}</span>
                    <span className="flex-1">{c.label}</span>
                    {c.shortcut && (
                      <kbd className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${selected ? 'bg-primary-foreground/20' : 'bg-muted border text-muted-foreground'}`}>
                        {c.shortcut}
                      </kbd>
                    )}
                    {selected && <CornerDownLeft className="w-3 h-3" />}
                  </div>
                );
              })}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="px-3 py-8 text-center text-[12px] text-muted-foreground">
              No commands found. Try a different query.
            </div>
          )}
        </div>

        <div className="px-3 py-1.5 border-t text-[10px] text-muted-foreground flex items-center justify-between">
          <span>{filtered.length} commands</span>
          <div className="flex items-center gap-3">
            <span><kbd className="font-mono">↑↓</kbd> navigate</span>
            <span><kbd className="font-mono">↵</kbd> select</span>
            <span><kbd className="font-mono">esc</kbd> close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
