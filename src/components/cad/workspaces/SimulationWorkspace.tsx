'use client';

import { useState, useEffect } from 'react';
import { useCADStore } from '@/store/useCADStore';
import {
  Beaker, Play, Pause, RefreshCw, Settings2, Activity, Zap,
  ThermometerSun, Wind, Mountain, AlertTriangle, CheckCircle2,
  Loader2, ChevronDown, Cpu, Grid3x3, Eye, ArrowRight, Gauge,
  TrendingDown, Flame, Waves, Move
} from 'lucide-react';
import type { SimulationType, SimulationStudy } from '@/lib/cad/types';

const simTypeMeta: Record<SimulationType, { label: string; icon: React.ReactNode; color: string }> = {
  'static-stress': { label: 'Static Stress', icon: <Activity className="w-3.5 h-3.5" />, color: '#3b82f6' },
  'thermal': { label: 'Thermal', icon: <ThermometerSun className="w-3.5 h-3.5" />, color: '#ef4444' },
  'modal': { label: 'Modal', icon: <Waves className="w-3.5 h-3.5" />, color: '#8b5cf6' },
  'buckling': { label: 'Buckling', icon: <Mountain className="w-3.5 h-3.5" />, color: '#f59e0b' },
  'fatigue': { label: 'Fatigue', icon: <TrendingDown className="w-3.5 h-3.5" />, color: '#10b981' },
  'fluid': { label: 'Fluid Flow (CFD)', icon: <Wind className="w-3.5 h-3.5" />, color: '#06b6d4' },
};

export function SimulationWorkspace() {
  const simulations = useCADStore((s) => s.simulations);
  const activeSimId = useCADStore((s) => s.activeSimulationId);
  const setActiveSimId = useCADStore((s) => s.setActiveSimulationId);
  const runSimulation = useCADStore((s) => s.runSimulation);
  const toast = useCADStore((s) => s.toast);

  const sim = simulations.find(s => s.id === activeSimId) || simulations[0];
  const [animateDeform, setAnimateDeform] = useState(false);
  const [deformScale, setDeformScale] = useState(1);
  const [animFrame, setAnimFrame] = useState(0);

  useEffect(() => {
    if (!animateDeform) return;
    const interval = setInterval(() => {
      setAnimFrame(f => (f + 1) % 60);
    }, 50);
    return () => clearInterval(interval);
  }, [animateDeform]);

  const deformPhase = Math.sin((animFrame / 60) * Math.PI * 2) * deformScale;

  return (
    <div className="flex h-full">
      {/* Left sidebar - Studies */}
      <div className="w-64 border-r cad-panel flex flex-col">
        <div className="px-3 py-2 border-b flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
            Studies
          </span>
          <button
            className="cad-tool-btn"
            onClick={() => toast({ title: 'New study', variant: 'info' })}
            title="New study"
          >
            <Beaker className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {simulations.map((s) => {
            const meta = simTypeMeta[s.type];
            const active = s.id === activeSimId;
            return (
              <div
                key={s.id}
                className={`feature-tree-item cursor-pointer p-2 ${active ? 'selected' : ''}`}
                onClick={() => setActiveSimId(s.id)}
              >
                <div className="flex items-start gap-2">
                  <span style={{ color: meta.color }}>{meta.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-medium truncate">{s.name}</div>
                    <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                      {s.status === 'completed' && <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />}
                      {s.status === 'running' && <Loader2 className="w-2.5 h-2.5 text-blue-500 animate-spin" />}
                      {s.status === 'meshing' && <Loader2 className="w-2.5 h-2.5 text-amber-500 animate-spin" />}
                      {s.status === 'idle' && <span className="w-2 h-2 rounded-full bg-muted-foreground" />}
                      <span>{s.status} · {s.elementCount.toLocaleString()} elem</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t p-2">
          <div className="text-[10px] uppercase text-muted-foreground mb-1.5">Add Study</div>
          <div className="grid grid-cols-3 gap-1">
            {Object.entries(simTypeMeta).map(([key, meta]) => (
              <button
                key={key}
                className="flex flex-col items-center gap-0.5 p-1.5 rounded border bg-card hover:bg-accent transition"
                onClick={() => toast({ title: `New ${meta.label} study`, variant: 'info' })}
                title={meta.label}
              >
                <span style={{ color: meta.color }}>{meta.icon}</span>
                <span className="text-[9px] text-muted-foreground truncate w-full text-center">
                  {meta.label.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Center - 3D mesh view (using SVG for mesh visualization) */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="h-9 border-b cad-toolbar flex items-center px-2 gap-1">
          <button
            className="flex items-center gap-1.5 h-7 px-3 rounded bg-primary text-primary-foreground hover:opacity-90 text-[12px]"
            onClick={() => runSimulation(sim.id)}
            disabled={sim.status === 'running' || sim.status === 'meshing'}
          >
            {sim.status === 'running' || sim.status === 'meshing' ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Running...</>
            ) : (
              <><Play className="w-3.5 h-3.5" /> Run</>
            )}
          </button>
          <button
            className={`flex items-center gap-1.5 h-7 px-3 rounded border bg-card hover:bg-accent text-[12px] ${animateDeform ? 'bg-primary/15 border-primary text-primary' : ''}`}
            onClick={() => setAnimateDeform(!animateDeform)}
          >
            {animateDeform ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            Animate Deformation
          </button>
          <div className="cad-tool-divider" />
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span>Deform Scale:</span>
            <input
              type="range" min="0" max="100" value={deformScale * 20}
              onChange={(e) => setDeformScale(parseInt(e.target.value) / 20)}
              className="w-24"
            />
            <span className="font-mono w-12">{deformScale.toFixed(1)}x</span>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <span>Heatmap:</span>
            <select className="bg-card border rounded px-1.5 py-0.5 text-[11px]">
              <option>von Mises Stress</option>
              <option>Displacement</option>
              <option>Strain</option>
              <option>Temperature</option>
            </select>
          </div>
        </div>

        {/* Mesh viewport */}
        <div className="flex-1 relative bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-900 dark:to-black overflow-hidden">
          {/* FEA Mesh visualization */}
          <svg viewBox="0 0 800 500" className="absolute inset-0 w-full h-full">
            <defs>
              <linearGradient id="stressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="25%" stopColor="#10b981" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="75%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#7c2d12" />
              </linearGradient>
              <radialGradient id="hotspot" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
              </radialGradient>
            </defs>

            {/* Mesh triangles - generate programmatically */}
            {Array.from({ length: 25 }).map((_, row) =>
              Array.from({ length: 35 }).map((_, col) => {
                const x = 80 + col * 18 + (row % 2) * 9;
                const y = 60 + row * 16;
                const cx = 400, cy = 250;
                const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
                const maxDist = 250;
                const stressLevel = Math.max(0, 1 - dist / maxDist) + Math.random() * 0.15;
                const deformOffset = (1 - dist / maxDist) * 15 * deformPhase;

                // Get color from stress level
                const r = stressLevel > 0.75 ? 239 : stressLevel > 0.5 ? 245 : stressLevel > 0.25 ? 16 : 59;
                const g = stressLevel > 0.75 ? 68 : stressLevel > 0.5 ? 158 : stressLevel > 0.25 ? 185 : 130;
                const b = stressLevel > 0.75 ? 68 : stressLevel > 0.5 ? 11 : stressLevel > 0.25 ? 129 : 246;
                const opacity = 0.45 + stressLevel * 0.4;

                return (
                  <g key={`${row}-${col}`}>
                    <polygon
                      points={`${x + deformOffset},${y + deformOffset} ${x + 18 + deformOffset},${y + deformOffset} ${x + 9 + deformOffset},${y + 16 + deformOffset}`}
                      fill={`rgba(${r},${g},${b},${opacity})`}
                      stroke="rgba(0,0,0,0.15)"
                      strokeWidth="0.3"
                    />
                    <polygon
                      points={`${x + 18 + deformOffset},${y + deformOffset} ${x + 27 + deformOffset},${y + 16 + deformOffset} ${x + 9 + deformOffset},${y + 16 + deformOffset}`}
                      fill={`rgba(${r},${g},${b},${opacity * 0.85})`}
                      stroke="rgba(0,0,0,0.15)"
                      strokeWidth="0.3"
                    />
                  </g>
                );
              })
            )}

            {/* Boundary lines (housing outline) */}
            <rect x="180" y="100" width="440" height="300" stroke="white" strokeWidth="2" fill="none" opacity="0.6" />
            <circle cx="280" cy="250" r="40" stroke="white" strokeWidth="2" fill="none" opacity="0.6" />
            <circle cx="520" cy="250" r="40" stroke="white" strokeWidth="2" fill="none" opacity="0.6" />

            {/* Load arrows */}
            <g opacity="0.9">
              <line x1="400" y1="50" x2="400" y2="95" stroke="#ef4444" strokeWidth="2" />
              <polygon points="395,90 405,90 400,100" fill="#ef4444" />
              <text x="410" y="70" fill="#ef4444" fontSize="11" fontFamily="monospace">F = 2500N</text>
            </g>

            {/* Fixture indicator (hatching) */}
            <g opacity="0.7">
              {Array.from({ length: 20 }).map((_, i) => (
                <line
                  key={i}
                  x1={180 + i * 22}
                  y1={400}
                  x2={170 + i * 22}
                  y2={410}
                  stroke="#3b82f6"
                  strokeWidth="1.5"
                />
              ))}
              <line x1="180" y1="400" x2="620" y2="400" stroke="#3b82f6" strokeWidth="1.5" />
              <text x="350" y="425" fill="#3b82f6" fontSize="10" fontFamily="monospace">FIXED</text>
            </g>

            {/* Hotspot label */}
            {sim.results && (
              <g>
                <circle cx="400" cy="200" r="35" fill="url(#hotspot)" opacity="0.5" />
                <line x1="400" y1="200" x2="600" y2="120" stroke="white" strokeWidth="1" strokeDasharray="2,2" />
                <rect x="600" y="100" width="160" height="40" fill="black" opacity="0.7" rx="3" />
                <text x="610" y="115" fill="white" fontSize="10" fontFamily="monospace">MAX STRESS</text>
                <text x="610" y="130" fill="#ef4444" fontSize="12" fontFamily="monospace" fontWeight="bold">
                  {sim.results.maxStress.toFixed(1)} MPa
                </text>
              </g>
            )}
          </svg>

          {/* Progress overlay */}
          {(sim.status === 'running' || sim.status === 'meshing') && (
            <div className="absolute top-4 left-4 right-4 p-3 rounded bg-card/90 backdrop-blur border">
              <div className="flex items-center gap-2 mb-1.5">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span className="text-[12px] font-medium">
                  {sim.status === 'meshing' ? 'Generating mesh...' : 'Solving FEA equations...'}
                </span>
                <span className="text-[11px] font-mono text-muted-foreground ml-auto">
                  {sim.progress.toFixed(0)}%
                </span>
              </div>
              <div className="h-1 bg-muted rounded overflow-hidden">
                <div className="h-full bg-primary transition-all" style={{ width: `${sim.progress}%` }} />
              </div>
              <div className="text-[10px] text-muted-foreground mt-1 font-mono">
                {sim.status === 'meshing' ? `Building ${sim.elementCount.toLocaleString()} tetrahedrons` : 'Computing stiffness matrix · Iteration 247/500'}
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="absolute bottom-4 left-4 p-2 rounded bg-card/90 backdrop-blur border text-[10px]">
            <div className="text-[11px] font-medium mb-1.5">von Mises Stress (MPa)</div>
            <div className="flex items-center gap-1.5">
              <div className="w-32 h-2 rounded" style={{ background: 'linear-gradient(to right, #3b82f6, #10b981, #f59e0b, #ef4444, #7c2d12)' }} />
            </div>
            <div className="flex justify-between w-32 mt-0.5 text-muted-foreground">
              <span>0</span>
              <span>{((sim.results?.maxStress || 150) / 2).toFixed(0)}</span>
              <span>{(sim.results?.maxStress || 150).toFixed(0)}</span>
            </div>
          </div>

          {/* Mesh info */}
          <div className="absolute top-4 right-4 p-2 rounded bg-card/90 backdrop-blur border text-[10px] font-mono">
            <div>Mesh: {sim.meshSize}mm · {sim.elementCount.toLocaleString()} elem</div>
            <div>Solver: Iterative CG · Tolerance 1e-6</div>
            <div>Material: {sim.material}</div>
          </div>
        </div>
      </div>

      {/* Right - Results panel */}
      <div className="w-72 border-l cad-panel overflow-y-auto">
        <div className="px-3 py-2 border-b">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium mb-1">
            {sim.name}
          </div>
          <div className="text-[10px] text-muted-foreground font-mono">{simTypeMeta[sim.type].label}</div>
        </div>

        {sim.results ? (
          <div className="p-3 space-y-3">
            <div>
              <div className="text-[10px] uppercase text-muted-foreground mb-1.5">Summary Results</div>
              <div className="space-y-1.5">
                <ResultRow label="Max Stress" value={`${sim.results.maxStress.toFixed(2)} MPa`} icon={<Zap className="w-3 h-3 text-red-500" />} critical={sim.results.maxStress > 200} />
                <ResultRow label="Min Stress" value={`${sim.results.minStress.toFixed(2)} MPa`} icon={<Activity className="w-3 h-3 text-blue-500" />} />
                <ResultRow label="Max Displacement" value={`${sim.results.maxDisplacement.toFixed(3)} mm`} icon={<Move className="w-3 h-3 text-amber-500" />} />
                <ResultRow label="Safety Factor" value={sim.results.safetyFactor.toFixed(2)} icon={<Gauge className="w-3 h-3" />} critical={sim.results.safetyFactor < 1.5} />
                <ResultRow label="Mass" value={`${sim.results.mass.toFixed(3)} kg`} icon={<Mountain className="w-3 h-3 text-violet-500" />} />
              </div>
            </div>

            {/* Yield comparison */}
            <div className="p-2 rounded border bg-card">
              <div className="flex justify-between text-[10px] mb-1">
                <span>Yield Strength</span>
                <span className="font-mono">276 MPa</span>
              </div>
              <div className="h-2 bg-muted rounded overflow-hidden relative">
                <div
                  className={`h-full ${sim.results.maxStress / 276 > 0.8 ? 'bg-red-500' : sim.results.maxStress / 276 > 0.5 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                  style={{ width: `${Math.min(100, (sim.results.maxStress / 276) * 100)}%` }}
                />
                <div className="absolute top-0 right-0 h-full w-px bg-red-500" />
              </div>
              <div className="flex justify-between text-[9px] mt-1 text-muted-foreground font-mono">
                <span>0</span>
                <span>276 MPa (yield)</span>
              </div>
            </div>

            {/* Loads list */}
            <div>
              <div className="text-[10px] uppercase text-muted-foreground mb-1.5">Loads ({sim.loads.length})</div>
              <div className="space-y-1">
                {sim.loads.map((l) => (
                  <div key={l.id} className="flex items-center gap-2 p-1.5 rounded bg-card border text-[11px]">
                    {l.type === 'force' && <Zap className="w-3 h-3 text-red-500" />}
                    {l.type === 'pressure' && <Gauge className="w-3 h-3 text-amber-500" />}
                    {l.type === 'thermal' && <Flame className="w-3 h-3 text-orange-500" />}
                    {l.type === 'gravity' && <Mountain className="w-3 h-3 text-blue-500" />}
                    <span className="capitalize">{l.type}</span>
                    <span className="font-mono ml-auto">
                      {l.magnitude} {l.type === 'force' ? 'N' : l.type === 'pressure' ? 'MPa' : l.type === 'thermal' ? '°C' : 'm/s²'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Fixtures */}
            <div>
              <div className="text-[10px] uppercase text-muted-foreground mb-1.5">Fixtures ({sim.fixtures.length})</div>
              <div className="space-y-1">
                {sim.fixtures.map((f) => (
                  <div key={f.id} className="flex items-center gap-2 p-1.5 rounded bg-card border text-[11px]">
                    <Settings2 className="w-3 h-3 text-blue-500" />
                    <span className="capitalize">{f.type}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="p-2 rounded border-l-4 border-violet-500 bg-violet-500/10">
              <div className="text-[10px] uppercase text-violet-500 font-medium mb-1 flex items-center gap-1">
                <Cpu className="w-3 h-3" /> AI Recommendation
              </div>
              <div className="text-[11px]">
                {sim.results.safetyFactor < 1.5
                  ? 'Safety factor below 1.5. Consider increasing wall thickness or adding ribs near the bearing bores.'
                  : sim.results.safetyFactor < 2.5
                    ? 'Safety factor acceptable. Consider topology optimization to reduce weight while maintaining strength.'
                    : 'Design is over-engineered. Consider reducing material thickness to save weight.'}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 text-[11px] text-muted-foreground text-center">
            Run simulation to see results
          </div>
        )}
      </div>
    </div>
  );
}

function ResultRow({ label, value, icon, critical }: { label: string; value: string; icon: React.ReactNode; critical?: boolean }) {
  return (
    <div className="flex items-center gap-2 p-1.5 rounded bg-card border text-[11px]">
      {icon}
      <span className="flex-1 text-muted-foreground">{label}</span>
      <span className={`font-mono ${critical ? 'text-red-500 font-bold' : ''}`}>{value}</span>
    </div>
  );
}
