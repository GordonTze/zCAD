'use client';

import { useState } from 'react';
import { useCADStore } from '@/store/useCADStore';
import {
  Terminal, AlertCircle, CheckCircle2, Info, Bell, Search,
  Activity, Clock, ChevronRight, X, History
} from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: number;
  type: 'info' | 'warning' | 'error' | 'success';
  category: string;
  message: string;
  detail?: string;
}

const sampleLogs: LogEntry[] = [
  { id: '1', timestamp: Date.now() - 5000, type: 'success', category: 'Regen', message: 'Feature "Extrude Main Body" regenerated', detail: '142ms' },
  { id: '2', timestamp: Date.now() - 12000, type: 'info', category: 'Solver', message: 'Constraint solver converged', detail: '12 iterations' },
  { id: '3', timestamp: Date.now() - 28000, type: 'warning', category: 'Sketch', message: 'Sketch "Top Mounting Pattern" is under-defined', detail: '2 degrees of freedom' },
  { id: '4', timestamp: Date.now() - 45000, type: 'success', category: 'Sync', message: 'Cloud sync complete', detail: '847 KB uploaded' },
  { id: '5', timestamp: Date.now() - 62000, type: 'info', category: 'Collab', message: 'Maya Patel is editing "External Fillets"', detail: 'Locked for 2 min' },
  { id: '6', timestamp: Date.now() - 95000, type: 'error', category: 'Mate', message: 'Over-constraint detected on Shaft1-Housing mate', detail: 'Conflict with Bearing1-Housing' },
  { id: '7', timestamp: Date.now() - 130000, type: 'success', category: 'FEA', message: 'Static stress analysis completed', detail: '142K elements · 47s' },
  { id: '8', timestamp: Date.now() - 180000, type: 'info', category: 'AI', message: 'AI suggestion: Reduce wall thickness to save 92g', detail: 'Confidence 87%' },
  { id: '9', timestamp: Date.now() - 240000, type: 'warning', category: 'Manufacturing', message: '2 internal corners unreachable by milling', detail: 'Consider 5-axis' },
  { id: '10', timestamp: Date.now() - 320000, type: 'success', category: 'Save', message: 'Version v7 saved', detail: 'Autosave' },
];

export function BottomPanel() {
  const [tab, setTab] = useState<'logs' | 'notifications' | 'search' | 'history'>('logs');
  const [search, setSearch] = useState('');

  const filtered = sampleLogs.filter(l =>
    l.message.toLowerCase().includes(search.toLowerCase()) ||
    l.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <div className="h-7 border-b cad-panel-header flex items-center px-2 gap-0.5">
        {[
          { id: 'logs' as const, label: 'Logs', icon: <Terminal className="w-3 h-3" />, count: 10 },
          { id: 'notifications' as const, label: 'Notifications', icon: <Bell className="w-3 h-3" />, count: 3 },
          { id: 'search' as const, label: 'Search', icon: <Search className="w-3 h-3" /> },
          { id: 'history' as const, label: 'History', icon: <History className="w-3 h-3" />, count: 247 },
        ].map(t => (
          <button
            key={t.id}
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] transition ${tab === t.id ? 'bg-card text-foreground border' : 'text-muted-foreground hover:text-foreground hover:bg-accent'}`}
            onClick={() => setTab(t.id)}
          >
            {t.icon}
            <span>{t.label}</span>
            {t.count && (
              <span className="px-1 rounded bg-muted text-[9px] font-mono">{t.count}</span>
            )}
          </button>
        ))}
        <div className="flex-1" />
        <input
          className="h-5 px-2 rounded bg-card border text-[11px] w-48"
          placeholder="Filter logs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex-1 overflow-y-auto p-1 font-mono text-[11px]">
        {tab === 'logs' && (
          <div>
            {filtered.slice().reverse().map(log => (
              <div key={log.id} className="flex items-start gap-2 px-2 py-0.5 hover:bg-accent rounded">
                <span className="text-muted-foreground text-[10px] w-20 flex-shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString('en-US', { hour12: false })}
                </span>
                {log.type === 'success' && <CheckCircle2 className="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" />}
                {log.type === 'error' && <AlertCircle className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0" />}
                {log.type === 'warning' && <AlertCircle className="w-3 h-3 text-amber-500 mt-0.5 flex-shrink-0" />}
                {log.type === 'info' && <Info className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />}
                <span className="text-muted-foreground w-20 flex-shrink-0">[{log.category}]</span>
                <span className="flex-1">{log.message}</span>
                {log.detail && (
                  <span className="text-muted-foreground text-[10px]">{log.detail}</span>
                )}
              </div>
            ))}
          </div>
        )}
        {tab === 'notifications' && (
          <div className="p-2 space-y-1">
            {[
              { msg: 'Maya Patel mentioned you in a comment', time: '5 min ago', icon: '💬' },
              { msg: 'FEA simulation completed with safety factor 1.93', time: '1 hour ago', icon: '✅' },
              { msg: 'Sara Lopez requested review on "Bore Chamfers"', time: '3 hours ago', icon: '👀' },
            ].map((n, i) => (
              <div key={i} className="flex items-center gap-2 p-2 rounded hover:bg-accent border bg-card">
                <span>{n.icon}</span>
                <span className="flex-1 text-[12px] font-sans">{n.msg}</span>
                <span className="text-[10px] text-muted-foreground">{n.time}</span>
              </div>
            ))}
          </div>
        )}
        {tab === 'search' && (
          <div className="p-4 text-center text-[12px] text-muted-foreground">
            <Search className="w-6 h-6 mx-auto mb-2 opacity-50" />
            Search across features, sketches, mates, versions, comments and AI history.
          </div>
        )}
        {tab === 'history' && (
          <div className="p-2 space-y-0.5">
            {[
              'Edited Fillet feature · radius 4 → 5',
              'Created chamfer on bore edges',
              'Added bolt circle pattern (8x)',
              'Updated WallThickness parameter',
              'Ran static stress analysis',
              'Created version v6',
              'Imported "Spur Gear" from library',
              'Added mate "Shaft1-Housing"',
              'Edited sketch "Profile Sketch"',
              'Modified assembly exploded view',
              'Ran thermal analysis',
              'Exported STEP file',
            ].map((h, i) => (
              <div key={i} className="flex items-center gap-2 px-2 py-1 hover:bg-accent rounded text-[12px]">
                <Clock className="w-3 h-3 text-muted-foreground" />
                <span className="flex-1">{h}</span>
                <span className="text-[10px] text-muted-foreground">{i + 1}m ago</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
