'use client';

import { useEffect, useState } from 'react';
import {
  PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen,
  PanelBottomClose, PanelBottomOpen, ChevronLeft, ChevronRight,
  ChevronsLeftRight
} from 'lucide-react';
import { useCADStore } from '@/store/useCADStore';
import { TopMenuBar } from './TopMenuBar';
import { Toolbar } from './Toolbar';
import { LeftPanel } from './LeftPanel';
import { RightPanel } from './RightPanel';
import { StatusBar } from './StatusBar';
import { WorkspaceTabs } from './WorkspaceTabs';
import { Viewport3D } from './Viewport3D';
import { CommandPalette } from './CommandPalette';
import { ToastContainer } from './ToastContainer';
import { ExportDialog } from './dialogs/ExportDialog';
import { ProjectBrowser } from './dialogs/ProjectBrowser';
import { DrawingWorkspace } from './workspaces/DrawingWorkspace';
import { SimulationWorkspace } from './workspaces/SimulationWorkspace';
import { BottomPanel } from './BottomPanel';

export function CADApp() {
  const [mounted, setMounted] = useState(false);
  const theme = useCADStore((s) => s.theme);
  const setTheme = useCADStore((s) => s.setTheme);
  const workspace = useCADStore((s) => s.workspace);
  const panelLeftCollapsed = useCADStore((s) => s.panelLeftCollapsed);
  const panelRightCollapsed = useCADStore((s) => s.panelRightCollapsed);
  const panelBottomCollapsed = useCADStore((s) => s.panelBottomCollapsed);
  const toggleLeftPanel = useCADStore((s) => s.toggleLeftPanel);
  const toggleRightPanel = useCADStore((s) => s.toggleRightPanel);
  const toggleBottomPanel = useCADStore((s) => s.toggleBottomPanel);
  const setCommandPaletteOpen = useCADStore((s) => s.setCommandPaletteOpen);
  const setRightPanelTab = useCADStore((s) => s.setRightPanelTab);
  const regenerateAll = useCADStore((s) => s.regenerateAll);
  const toggleTheme = useCADStore((s) => s.toggleTheme);

  // Initialize theme on mount (avoid hydration mismatch)
  useEffect(() => {
    // Use a microtask to defer state updates outside the effect body
    Promise.resolve().then(() => {
      setMounted(true);
      setTheme('dark');
    });
  }, [setTheme]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!mounted) return;
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      // Cmd/Ctrl+K - command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
        return;
      }
      // Cmd/Ctrl+I - AI assistant
      if ((e.metaKey || e.ctrlKey) && e.key === 'i') {
        e.preventDefault();
        setRightPanelTab('ai');
        return;
      }
      // Cmd/Ctrl+S - save
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        useCADStore.getState().createVersion('Manual save');
        useCADStore.getState().toast({ title: 'Saved', description: 'Version created', variant: 'success' });
        return;
      }
      // Cmd/Ctrl+G - regenerate
      if ((e.metaKey || e.ctrlKey) && e.key === 'g') {
        e.preventDefault();
        regenerateAll();
        return;
      }
      // Ctrl+B / Cmd+B - toggle left panel
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        toggleLeftPanel();
        return;
      }
      // Ctrl+J / Cmd+J - toggle right panel
      if ((e.metaKey || e.ctrlKey) && e.key === 'j') {
        e.preventDefault();
        toggleRightPanel();
        return;
      }

      if (isInput) return;

      // Single-key shortcuts (when not typing)
      if (e.key === 'Escape') {
        useCADStore.getState().enterSketch(null);
        useCADStore.getState().selectFeature(null);
      } else if (e.key === 's' || e.key === 'S') {
        useCADStore.getState().setSelectedTool('sketch-line');
      } else if (e.key === 'e' || e.key === 'E') {
        useCADStore.getState().setSelectedTool('feature-extrude');
      } else if (e.key === 'r' || e.key === 'R') {
        useCADStore.getState().setSelectedTool('feature-revolve');
      } else if (e.key === 'f' || e.key === 'F') {
        useCADStore.getState().setSelectedTool('feature-fillet');
      } else if (e.key === 'c' || e.key === 'C') {
        useCADStore.getState().setSelectedTool('feature-chamfer');
      } else if (e.key === 'm' || e.key === 'M') {
        useCADStore.getState().setSelectedTool('measure');
      } else if (e.key === 'g' || e.key === 'G') {
        regenerateAll();
      } else if (e.key === '`') {
        toggleTheme();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [mounted, setCommandPaletteOpen, setRightPanelTab, regenerateAll, toggleLeftPanel, toggleRightPanel, toggleTheme]);

  if (!mounted) return null;

  return (
    <div className={`h-screen w-screen flex flex-col overflow-hidden ${theme === 'dark' ? 'dark' : ''} bg-background text-foreground`}>
      <TopMenuBar />
      <Toolbar />
      <WorkspaceTabs />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        {panelLeftCollapsed ? (
          <div className="w-9 border-r cad-panel flex flex-col items-center py-2 gap-1">
            <button
              className="cad-tool-btn"
              title="Show left panel (Ctrl+B)"
              onClick={toggleLeftPanel}
            >
              <PanelLeftOpen className="w-3.5 h-3.5" />
            </button>
            <div className="flex flex-col gap-1 mt-1">
              <button className="cad-tool-btn" title="Features">
                <BoxIcon />
              </button>
              <button className="cad-tool-btn" title="Search">
                <ChevronsLeftRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ) : (
          <div className="w-64 border-r flex flex-col">
            <div className="flex-1 overflow-hidden">
              <LeftPanel />
            </div>
            <button
              className="h-5 border-t cad-panel-header flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent"
              onClick={toggleLeftPanel}
              title="Hide panel (Ctrl+B)"
            >
              <PanelLeftClose className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Main Viewport area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden relative">
            {workspace === 'drawing' ? (
              <DrawingWorkspace />
            ) : workspace === 'simulation' ? (
              <SimulationWorkspace />
            ) : (
              <Viewport3D />
            )}
          </div>

          {/* Bottom panel */}
          {!panelBottomCollapsed && (
            <div className="h-48 border-t flex flex-col">
              <BottomPanel />
              <button
                className="h-5 border-t cad-panel-header flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent"
                onClick={toggleBottomPanel}
              >
                <PanelBottomClose className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Right Panel */}
        {panelRightCollapsed ? (
          <div className="w-9 border-l cad-panel flex flex-col items-center py-2 gap-1">
            <button
              className="cad-tool-btn"
              title="Show right panel (Ctrl+J)"
              onClick={toggleRightPanel}
            >
              <PanelRightOpen className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="w-72 border-l flex flex-col">
            <div className="flex-1 overflow-hidden">
              <RightPanel />
            </div>
            <button
              className="h-5 border-t cad-panel-header flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent"
              onClick={toggleRightPanel}
              title="Hide panel (Ctrl+J)"
            >
              <PanelRightClose className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      <StatusBar />
      <CommandPalette />
      <ToastContainer />
      <ExportDialog />
      <ProjectBrowser />
    </div>
  );
}

function BoxIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
      <line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  );
}
