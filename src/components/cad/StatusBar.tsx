'use client';

import {
  Ruler, Box, Layers3, Cpu, Activity, AlertCircle, CheckCircle2,
  RefreshCw, Sparkles, Globe, Lock, Eye, Clock, ChevronUp,
  ChevronDown, GitBranch, Wifi, Maximize2
} from 'lucide-react';
import { useCADStore } from '@/store/useCADStore';

export function StatusBar() {
  const units = useCADStore((s) => s.units);
  const setUnits = useCADStore((s) => s.setUnits);
  const precision = useCADStore((s) => s.precision);
  const setPrecision = useCADStore((s) => s.setPrecision);
  const isRegenerating = useCADStore((s) => s.isRegenerating);
  const lastRegenTime = useCADStore((s) => s.lastRegenTime);
  const parts = useCADStore((s) => s.parts);
  const activePartId = useCADStore((s) => s.activePartId);
  const collaborators = useCADStore((s) => s.collaborators);
  const panelBottomCollapsed = useCADStore((s) => s.panelBottomCollapsed);
  const toggleBottomPanel = useCADStore((s) => s.toggleBottomPanel);
  const toggleOrtho = useCADStore((s) => s.toggleOrtho);
  const ortho = useCADStore((s) => s.ortho);

  const part = parts.find((p) => p.id === activePartId);
  const activeCount = collaborators.filter(c => c.active).length;

  return (
    <div className="h-6 cad-panel-header border-t flex items-center text-[11px] select-none">
      <button
        className="status-bar-item"
        onClick={toggleBottomPanel}
        title="Toggle bottom panel"
      >
        {panelBottomCollapsed ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>

      <div className="status-bar-item">
        {isRegenerating ? (
          <><RefreshCw className="w-3 h-3 animate-spin text-amber-500" />
          <span className="text-amber-500">Regenerating...</span></>
        ) : (
          <><CheckCircle2 className="w-3 h-3 text-emerald-500" />
          <span>Regenerated · {part?.features.length || 0} features</span></>
        )}
      </div>

      <div className="status-bar-item">
        <Clock className="w-3 h-3" />
        <span>{new Date(lastRegenTime).toLocaleTimeString()} · 142ms</span>
      </div>

      <div className="status-bar-item">
        <Box className="w-3 h-3" />
        <span>{part?.mass.toFixed(3) || 0} kg</span>
      </div>

      <div className="status-bar-item">
        <Layers3 className="w-3 h-3" />
        <span>{(part?.volume || 0).toLocaleString()} mm³</span>
      </div>

      <div className="status-bar-item">
        <Ruler className="w-3 h-3" />
        <span>{part ? `${part.bbox.max[0] - part.bbox.min[0]} × ${part.bbox.max[1] - part.bbox.min[1]} × ${part.bbox.max[2] - part.bbox.min[2]}` : ''}</span>
      </div>

      <div className="flex-1" />

      <button className="status-bar-item" onClick={toggleOrtho} title="Toggle ortho/perspective">
        <Maximize2 className="w-3 h-3" />
        <span>{ortho ? 'ORTHO' : 'PERSP'}</span>
      </button>

      <div className="status-bar-item">
        <Globe className="w-3 h-3" />
        <select
          className="bg-transparent outline-none cursor-pointer"
          value={units}
          onChange={(e) => setUnits(e.target.value as 'mm' | 'cm' | 'm' | 'in')}
        >
          <option value="mm">mm</option>
          <option value="cm">cm</option>
          <option value="m">m</option>
          <option value="in">in</option>
        </select>
      </div>

      <div className="status-bar-item">
        <span>Precision:</span>
        <select
          className="bg-transparent outline-none cursor-pointer"
          value={precision}
          onChange={(e) => setPrecision(parseInt(e.target.value))}
        >
          <option value={1}>0.1</option>
          <option value={2}>0.01</option>
          <option value={3}>0.001</option>
          <option value={4}>0.0001</option>
        </select>
      </div>

      <div className="status-bar-item">
        <GitBranch className="w-3 h-3" />
        <span>main</span>
      </div>

      <div className="status-bar-item">
        <Lock className="w-3 h-3" />
        <span>AES-256</span>
      </div>

      <div className="status-bar-item">
        <Wifi className="w-3 h-3 text-emerald-500" />
        <span>Synced</span>
      </div>

      <div className="status-bar-item">
        <Activity className="w-3 h-3" />
        <span>{activeCount} live</span>
      </div>

      <div className="status-bar-item">
        <span>v7.0</span>
      </div>
    </div>
  );
}
