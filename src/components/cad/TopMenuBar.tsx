'use client';

import { useState } from 'react';
import {
  Menu, Search, Bell, User, Settings, ChevronDown, Folder, FileText,
  Save, Download, Upload, Share2, GitBranch, Cloud, CloudCheck, History,
  Sun, Moon, HelpCircle, Circle, Triangle, Square, Hexagon, Layers
} from 'lucide-react';
import { useCADStore } from '@/store/useCADStore';

const menus: { label: string; items: { label: string; shortcut?: string; action?: () => void; divider?: boolean }[] }[] = [
  {
    label: 'File',
    items: [
      { label: 'New Document', shortcut: 'Ctrl+N' },
      { label: 'Open Project...', shortcut: 'Ctrl+O' },
      { label: 'Recent Projects', divider: true },
      { label: 'Save', shortcut: 'Ctrl+S' },
      { label: 'Save As...', shortcut: 'Ctrl+Shift+S' },
      { label: 'Version...', shortcut: 'Ctrl+Shift+V', divider: true },
      { label: 'Export...', shortcut: 'Ctrl+E' },
      { label: 'Print...', shortcut: 'Ctrl+P' },
    ],
  },
  {
    label: 'Edit',
    items: [
      { label: 'Undo', shortcut: 'Ctrl+Z' },
      { label: 'Redo', shortcut: 'Ctrl+Y', divider: true },
      { label: 'Cut', shortcut: 'Ctrl+X' },
      { label: 'Copy', shortcut: 'Ctrl+C' },
      { label: 'Paste', shortcut: 'Ctrl+V' },
      { label: 'Delete', shortcut: 'Del', divider: true },
      { label: 'Select All', shortcut: 'Ctrl+A' },
      { label: 'Find / Replace', shortcut: 'Ctrl+F' },
    ],
  },
  {
    label: 'Create',
    items: [
      { label: 'Sketch...', shortcut: 'S' },
      { label: 'Extrude...', shortcut: 'E' },
      { label: 'Revolve...', shortcut: 'R' },
      { label: 'Sweep...', shortcut: 'W' },
      { label: 'Loft...', shortcut: 'L', divider: true },
      { label: 'Fillet...', shortcut: 'F' },
      { label: 'Chamfer...', shortcut: 'C' },
      { label: 'Shell...', shortcut: 'H' },
      { label: 'Draft...', divider: true },
      { label: 'Linear Pattern...' },
      { label: 'Circular Pattern...' },
      { label: 'Mirror...' },
      { label: 'Hole...' },
    ],
  },
  {
    label: 'Modify',
    items: [
      { label: 'Split...' },
      { label: 'Move Face...' },
      { label: 'Replace Face...' },
      { label: 'Delete Face...', divider: true },
      { label: 'Boolean Union' },
      { label: 'Boolean Subtract' },
      { label: 'Boolean Intersect' },
    ],
  },
  {
    label: 'View',
    items: [
      { label: 'Fit View', shortcut: 'F' },
      { label: 'Zoom to Selection', shortcut: 'Z' },
      { label: 'Standard Views', divider: true },
      { label: 'Shaded' },
      { label: 'Wireframe' },
      { label: 'Shaded with Edges' },
      { label: 'Section View', shortcut: 'X', divider: true },
      { label: 'Show Grid' },
      { label: 'Show Axes' },
      { label: 'Shadows' },
    ],
  },
  {
    label: 'Tools',
    items: [
      { label: 'Measure...', shortcut: 'M' },
      { label: 'Mass Properties...' },
      { label: 'Interference Detection...', divider: true },
      { label: 'Simulation Setup' },
      { label: 'Manufacturing...' },
      { label: 'AI Assistant...', shortcut: 'Ctrl+I' },
      { label: 'Command Palette...', shortcut: 'Ctrl+K', divider: true },
      { label: 'Options...', shortcut: 'Ctrl+,' },
    ],
  },
  {
    label: 'Help',
    items: [
      { label: 'Documentation' },
      { label: 'Keyboard Shortcuts', shortcut: '?' },
      { label: 'Tutorial' },
      { label: 'About ZCAD' },
    ],
  },
];

export function TopMenuBar() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const toggleTheme = useCADStore((s) => s.toggleTheme);
  const theme = useCADStore((s) => s.theme);
  const setCommandPaletteOpen = useCADStore((s) => s.setCommandPaletteOpen);
  const setProjectBrowserOpen = useCADStore((s) => s.setProjectBrowserOpen);
  const regenerateAll = useCADStore((s) => s.regenerateAll);
  const toast = useCADStore((s) => s.toast);
  const createVersion = useCADStore((s) => s.createVersion);

  return (
    <div className="h-9 cad-panel-header border-b flex items-center px-2 gap-1 select-none text-[13px]">
      {/* Logo */}
      <div className="flex items-center gap-2 px-2">
        <div className="w-5 h-5 rounded bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground text-[10px] font-bold">
          Z
        </div>
        <span className="font-semibold tracking-tight">ZCAD</span>
        <span className="text-muted-foreground text-[11px]">Studio Pro</span>
      </div>

      <div className="w-px h-5 bg-border mx-1" />

      {/* Menu items */}
      <nav className="flex items-center">
        {menus.map((m) => (
          <div
            key={m.label}
            className="relative"
            onMouseEnter={() => openMenu && setOpenMenu(m.label)}
          >
            <button
              className={`px-3 py-1 rounded hover:bg-accent transition ${openMenu === m.label ? 'bg-accent' : ''}`}
              onClick={() => setOpenMenu(openMenu === m.label ? null : m.label)}
            >
              {m.label}
            </button>
            {openMenu === m.label && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setOpenMenu(null)} />
                <div className="absolute left-0 top-full mt-px z-50 min-w-[220px] py-1 cad-panel border rounded shadow-xl">
                  {m.items.map((item, i) => (
                    <div key={i}>
                      {item.divider && <div className="h-px bg-border my-1" />}
                      <div
                        className="cad-menu-item flex items-center justify-between gap-8"
                        onClick={() => {
                          setOpenMenu(null);
                          if (item.label.includes('Save')) {
                            createVersion(`Saved: ${item.label}`);
                            toast({ title: 'Saved', description: 'Version created', variant: 'success' });
                          } else if (item.label.includes('Regenerat')) {
                            regenerateAll();
                          } else if (item.label.includes('Export')) {
                            useCADStore.getState().setExportDialogOpen(true);
                          } else {
                            toast({ title: item.label, variant: 'info' });
                          }
                        }}
                      >
                        <span>{item.label}</span>
                        {item.shortcut && (
                          <span className="text-[10px] text-muted-foreground font-mono">{item.shortcut}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </nav>

      <div className="flex-1" />

      {/* Project name */}
      <button
        className="flex items-center gap-2 px-3 py-1 rounded hover:bg-accent transition"
        onClick={() => setProjectBrowserOpen(true)}
      >
        <Folder className="w-3.5 h-3.5 text-primary" />
        <span>Gearbox Assembly</span>
        <GitBranch className="w-3 h-3 text-muted-foreground" />
        <span className="text-muted-foreground text-[11px] font-mono">main</span>
      </button>

      <div className="w-px h-5 bg-border mx-1" />

      {/* Cloud status */}
      <div className="flex items-center gap-1 px-2 text-[11px] text-muted-foreground">
        <CloudCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>Saved</span>
      </div>

      <button
        className="cad-tool-btn"
        title="Search (Ctrl+K)"
        onClick={() => setCommandPaletteOpen(true)}
      >
        <Search className="w-3.5 h-3.5" />
      </button>

      <button className="cad-tool-btn relative" title="Notifications">
        <Bell className="w-3.5 h-3.5" />
        <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
      </button>

      <button
        className="cad-tool-btn"
        title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
        onClick={toggleTheme}
      >
        {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
      </button>

      <button className="cad-tool-btn" title="Settings">
        <Settings className="w-3.5 h-3.5" />
      </button>

      <div className="w-px h-5 bg-border mx-1" />

      {/* Collaborator avatars */}
      <div className="flex -space-x-1.5">
        {useCADStore((s) => s.collaborators).slice(0, 4).map((c) => (
          <div
            key={c.id}
            className="w-6 h-6 rounded-full border-2 border-background flex items-center justify-center text-[10px] font-bold text-white"
            style={{ backgroundColor: c.color }}
            title={c.name + (c.active ? ' (active)' : '')}
          >
            {c.avatar}
          </div>
        ))}
        <button className="w-6 h-6 rounded-full border-2 border-background bg-card flex items-center justify-center hover:bg-accent transition">
          <Share2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
