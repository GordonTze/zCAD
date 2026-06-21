'use client';

import { useState } from 'react';
import { useCADStore } from '@/store/useCADStore';
import {
  X, Folder, FolderOpen, FileText, Box, Combine, Search,
  Star, Clock, Users, Plus, MoreVertical, Cloud,
  GitBranch, ChevronRight, Database, ShieldCheck
} from 'lucide-react';

const projects = [
  { id: 'p1', name: 'Gearbox Assembly', type: 'assembly', modified: '2 min ago', owner: 'Alex Chen', shared: 4, size: '847 MB', color: '#3b82f6', starred: true },
  { id: 'p2', name: 'Drone Frame v3', type: 'part', modified: '1 hour ago', owner: 'Maya Patel', shared: 2, size: '124 MB', color: '#10b981', starred: false },
  { id: 'p3', name: 'Robotic Arm', type: 'assembly', modified: 'yesterday', owner: 'You', shared: 6, size: '1.2 GB', color: '#f59e0b', starred: true },
  { id: 'p4', name: 'Bicycle Hub Motor', type: 'part', modified: '2 days ago', owner: 'Rohit Kumar', shared: 1, size: '285 MB', color: '#8b5cf6', starred: false },
  { id: 'p5', name: 'Sheet Metal Bracket', type: 'part', modified: '3 days ago', owner: 'You', shared: 0, size: '12 MB', color: '#ef4444', starred: false },
  { id: 'p6', name: '3D Print Phone Stand', type: 'part', modified: '5 days ago', owner: 'Sara Lopez', shared: 0, size: '4 MB', color: '#06b6d4', starred: false },
  { id: 'p7', name: 'Pneumatic Cylinder', type: 'assembly', modified: '1 week ago', owner: 'You', shared: 3, size: '423 MB', color: '#84cc16', starred: false },
  { id: 'p8', name: 'Furniture Hardware Kit', type: 'assembly', modified: '2 weeks ago', owner: 'Maya Patel', shared: 8, size: '2.1 GB', color: '#a855f7', starred: false },
];

export function ProjectBrowser() {
  const open = useCADStore((s) => s.projectBrowserOpen);
  const setOpen = useCADStore((s) => s.setProjectBrowserOpen);
  const toast = useCADStore((s) => s.toast);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState<'all' | 'mine' | 'shared' | 'starred'>('all');

  if (!open) return null;

  const filtered = projects.filter(p => {
    if (filter === 'mine') return p.owner === 'You';
    if (filter === 'shared') return p.shared > 0;
    if (filter === 'starred') return p.starred;
    return true;
  });

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)}>
      <div
        className="w-[900px] h-[600px] bg-card border rounded-lg shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Folder className="w-4 h-4 text-primary" />
            <h2 className="text-[14px] font-semibold">Projects</h2>
            <span className="text-[11px] text-muted-foreground">· 8 projects · 4.9 GB used of 50 GB</span>
          </div>
          <div className="flex items-center gap-1">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] rounded bg-primary text-primary-foreground hover:opacity-90">
              <Plus className="w-3.5 h-3.5" />
              New Project
            </button>
            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground ml-2">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-52 border-r overflow-y-auto p-2 space-y-1">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium px-2 py-1">
              Filters
            </div>
            {[
              { id: 'all', label: 'All Projects', icon: <Folder className="w-3.5 h-3.5" /> },
              { id: 'mine', label: 'My Projects', icon: <FolderOpen className="w-3.5 h-3.5" /> },
              { id: 'shared', label: 'Shared with me', icon: <Users className="w-3.5 h-3.5" /> },
              { id: 'starred', label: 'Starred', icon: <Star className="w-3.5 h-3.5" /> },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id as typeof filter)}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-[12px] transition ${filter === f.id ? 'bg-primary/15 text-primary' : 'hover:bg-accent'}`}
              >
                {f.icon}
                <span>{f.label}</span>
              </button>
            ))}

            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium px-2 pt-3 pb-1">
              Teams
            </div>
            {[
              { name: 'Mechanical Eng', color: '#3b82f6', count: 12 },
              { name: 'Hardware Dev', color: '#10b981', count: 8 },
              { name: 'Prototyping Lab', color: '#f59e0b', count: 4 },
              { name: 'Manufacturing', color: '#ef4444', count: 6 },
            ].map(t => (
              <button
                key={t.name}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-[12px] hover:bg-accent"
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: t.color }} />
                <span className="flex-1 text-left truncate">{t.name}</span>
                <span className="text-[10px] text-muted-foreground font-mono">{t.count}</span>
              </button>
            ))}

            <div className="pt-3 mt-2 border-t">
              <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/30">
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-500 font-medium mb-1">
                  <ShieldCheck className="w-3 h-3" />
                  Enterprise Plan
                </div>
                <div className="text-[10px] text-muted-foreground">
                  Unlimited projects · SSO · Audit logs · RBAC
                </div>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="px-4 py-2 border-b flex items-center gap-2">
              <div className="flex items-center gap-1.5 h-7 px-2 rounded bg-card border flex-1">
                <Search className="w-3 h-3 text-muted-foreground" />
                <input
                  className="flex-1 bg-transparent outline-none text-[12px] placeholder:text-muted-foreground"
                  placeholder="Search projects..."
                />
              </div>
              <select className="bg-card border rounded px-2 py-1.5 text-[12px]">
                <option>Recent</option>
                <option>Name</option>
                <option>Size</option>
                <option>Owner</option>
              </select>
            </div>

            <div className="flex-1 overflow-y-auto p-3">
              {view === 'grid' ? (
                <div className="grid grid-cols-4 gap-2">
                  {filtered.map(p => (
                    <button
                      key={p.id}
                      className="p-3 rounded border bg-card hover:border-primary hover:bg-accent transition text-left group"
                      onClick={() => {
                        toast({ title: `Opening "${p.name}"`, variant: 'info' });
                        setOpen(false);
                      }}
                    >
                      <div className="aspect-square rounded mb-2 flex items-center justify-center" style={{ backgroundColor: `${p.color}20`, border: `1px solid ${p.color}40` }}>
                        {p.type === 'assembly' ? (
                          <Combine className="w-8 h-8" style={{ color: p.color }} />
                        ) : (
                          <Box className="w-8 h-8" style={{ color: p.color }} />
                        )}
                      </div>
                      <div className="text-[12px] font-medium truncate flex items-center gap-1">
                        {p.name}
                        {p.starred && <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />}
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-0.5 truncate">
                        {p.modified} · {p.owner}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1 text-[10px] text-muted-foreground">
                        <Users className="w-2.5 h-2.5" />
                        <span>{p.shared}</span>
                        <span>·</span>
                        <Cloud className="w-2.5 h-2.5" />
                        <span>{p.size}</span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-1">
                  {filtered.map(p => (
                    <div key={p.id} className="flex items-center gap-3 p-2 rounded border bg-card hover:bg-accent cursor-pointer">
                      {p.type === 'assembly' ? <Combine className="w-4 h-4" style={{ color: p.color }} /> : <Box className="w-4 h-4" style={{ color: p.color }} />}
                      <span className="flex-1 text-[12px] font-medium truncate">{p.name}</span>
                      <span className="text-[11px] text-muted-foreground w-24">{p.owner}</span>
                      <span className="text-[11px] text-muted-foreground w-24">{p.modified}</span>
                      <span className="text-[11px] text-muted-foreground font-mono">{p.size}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
