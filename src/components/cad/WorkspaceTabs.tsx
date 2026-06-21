'use client';

import { useState, useRef, useEffect } from 'react';
import { Box, Combine, FileText, Beaker, Sparkles, ChevronDown, Check, Layers } from 'lucide-react';
import { useCADStore } from '@/store/useCADStore';
import type { WorkspaceType } from '@/lib/cad/types';

const tabs: { id: WorkspaceType; label: string; icon: React.ReactNode }[] = [
  { id: 'part', label: 'Part Studio', icon: <Box className="w-3 h-3" /> },
  { id: 'assembly', label: 'Assembly', icon: <Combine className="w-3 h-3" /> },
  { id: 'drawing', label: 'Drawing', icon: <FileText className="w-3 h-3" /> },
  { id: 'simulation', label: 'Simulation', icon: <Beaker className="w-3 h-3" /> },
];

export function WorkspaceTabs() {
  const workspace = useCADStore((s) => s.workspace);
  const setWorkspace = useCADStore((s) => s.setWorkspace);
  const assemblies = useCADStore((s) => s.assemblies);
  const activeAssemblyId = useCADStore((s) => s.activeAssemblyId);
  const setActiveAssemblyId = useCADStore((s) => s.setActiveAssemblyId);
  const assembly = useCADStore((s) => s.assembly);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="h-8 cad-panel border-b flex items-center px-1 gap-0 select-none">
      {tabs.map((t) => (
        <button
          key={t.id}
          className={`flex items-center gap-1.5 px-3 h-7 rounded text-[12px] transition ${
            workspace === t.id
              ? 'bg-card text-foreground border shadow-sm font-medium'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent'
          }`}
          onClick={() => setWorkspace(t.id)}
        >
          {t.icon}
          <span>{t.label}</span>
          {workspace === t.id && <span className="ml-1 w-1 h-1 rounded-full bg-primary" />}
        </button>
      ))}
      <div className="flex-1" />
      {/* Assembly switcher (visible in assembly workspace) */}
      {workspace === 'assembly' && (
        <div className="relative" ref={dropdownRef}>
          <button
            className="flex items-center gap-1.5 px-2 h-7 rounded text-[11px] bg-card border hover:bg-accent transition"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            title="Switch assembly"
          >
            <Layers className="w-3 h-3 text-primary" />
            <span className="font-medium">{assembly.name}</span>
            <ChevronDown className="w-3 h-3 text-muted-foreground" />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-px z-50 min-w-[240px] py-1 cad-panel border rounded shadow-xl">
              <div className="px-2 py-1 text-[10px] uppercase tracking-wider text-muted-foreground font-medium border-b">
                Assemblies ({assemblies.length})
              </div>
              {assemblies.map((a) => (
                <button
                  key={a.id}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 text-[12px] hover:bg-accent transition text-left ${a.id === activeAssemblyId ? 'bg-primary/10' : ''}`}
                  onClick={() => {
                    setActiveAssemblyId(a.id);
                    setDropdownOpen(false);
                  }}
                >
                  <Combine className="w-3 h-3 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <div className="truncate font-medium">{a.name}</div>
                    <div className="text-[10px] text-muted-foreground font-mono">
                      {a.instances.length} parts · {a.mates.length} mates
                    </div>
                  </div>
                  {a.id === activeAssemblyId && <Check className="w-3 h-3 text-primary" />}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      <div className="flex items-center gap-1 px-2 text-[11px] text-muted-foreground">
        <Sparkles className="w-3 h-3" />
        <span>ZCAD Studio · {assembly.name}</span>
      </div>
    </div>
  );
}
