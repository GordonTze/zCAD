'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Settings2, Sparkles, Users, GitBranch, Download, Plus, Trash2,
  Send, Cpu, Beaker, AlertCircle, CheckCircle2, Loader2,
  Brain, Zap, Activity, Bot, RefreshCw, TrendingUp, ShieldCheck,
  CircleDot, Ruler, Box, Layers3, History, MessageSquare, ChevronRight,
  FileText, Grid3x3
} from 'lucide-react';
import { useCADStore } from '@/store/useCADStore';
import type { Feature, ParametricParameter } from '@/lib/cad/types';

const tabs = [
  { id: 'properties' as const, label: 'Properties', icon: <Settings2 className="w-3.5 h-3.5" /> },
  { id: 'parameters' as const, label: 'Variables', icon: <Cpu className="w-3.5 h-3.5" /> },
  { id: 'ai' as const, label: 'AI', icon: <Sparkles className="w-3.5 h-3.5" /> },
  { id: 'collab' as const, label: 'Team', icon: <Users className="w-3.5 h-3.5" /> },
  { id: 'versions' as const, label: 'History', icon: <GitBranch className="w-3.5 h-3.5" /> },
  { id: 'export' as const, label: 'Export', icon: <Download className="w-3.5 h-3.5" /> },
];

function PropertiesTab() {
  const parts = useCADStore((s) => s.parts);
  const activePartId = useCADStore((s) => s.activePartId);
  const selectedFeatureId = useCADStore((s) => s.selectedFeatureId);
  const selectedInstanceId = useCADStore((s) => s.selectedInstanceId);
  const assembly = useCADStore((s) => s.assembly);
  const updateFeature = useCADStore((s) => s.updateFeature);
  const updateInstance = useCADStore((s) => s.updateInstance);
  const workspace = useCADStore((s) => s.workspace);

  const part = parts.find((p) => p.id === activePartId);
  const feature = part?.features.find((f) => f.id === selectedFeatureId);
  const instance = assembly.instances.find((i) => i.id === selectedInstanceId);

  if (workspace === 'assembly' && instance) {
    const part = parts.find((p) => p.id === instance.partId);
    return (
      <div className="p-3 space-y-3">
        <Section title="Instance Properties">
          <Field label="Name" value={instance.name} onChange={(v) => updateInstance(instance.id, { name: v })} />
          <Field label="Referenced Part" value={part?.name || ''} readOnly />
          <Field label="Part Number" value={part?.partNumber || ''} readOnly />
        </Section>
        <Section title="Transform">
          <NumberField label="X Position" value={instance.transform.position[0]} onChange={(v) => updateInstance(instance.id, { transform: { ...instance.transform, position: [v, instance.transform.position[1], instance.transform.position[2]] } })} unit="mm" />
          <NumberField label="Y Position" value={instance.transform.position[1]} onChange={(v) => updateInstance(instance.id, { transform: { ...instance.transform, position: [instance.transform.position[0], v, instance.transform.position[2]] } })} unit="mm" />
          <NumberField label="Z Position" value={instance.transform.position[2]} onChange={(v) => updateInstance(instance.id, { transform: { ...instance.transform, position: [instance.transform.position[0], instance.transform.position[1], v] } })} unit="mm" />
          <NumberField label="Rot X" value={instance.transform.rotation[0]} onChange={(v) => updateInstance(instance.id, { transform: { ...instance.transform, rotation: [v, instance.transform.rotation[1], instance.transform.rotation[2]] } })} unit="°" />
          <NumberField label="Rot Y" value={instance.transform.rotation[1]} onChange={(v) => updateInstance(instance.id, { transform: { ...instance.transform, rotation: [instance.transform.position[0], v, instance.transform.rotation[2]] } })} unit="°" />
          <NumberField label="Rot Z" value={instance.transform.rotation[2]} onChange={(v) => updateInstance(instance.id, { transform: { ...instance.transform, rotation: [instance.transform.rotation[0], instance.transform.rotation[1], v] } })} unit="°" />
        </Section>
        <Section title="Physical Properties">
          <Field label="Mass" value={`${(part?.mass || 0).toFixed(3)} kg`} readOnly />
          <Field label="Material" value={part?.material || ''} readOnly />
          <Field label="Visible" value={instance.visible ? 'Yes' : 'No'} readOnly />
        </Section>
      </div>
    );
  }

  if (!feature) {
    return (
      <div className="p-3 space-y-3">
        <Section title="Part Properties">
          <Field label="Name" value={part?.name || ''} readOnly />
          <Field label="Part Number" value={part?.partNumber || ''} readOnly />
          <Field label="Material" value={part?.material || ''} readOnly />
          <Field label="Color" value={part?.color || ''} readOnly />
        </Section>
        <Section title="Physical Properties">
          <Field label="Mass" value={`${part?.mass.toFixed(3) || 0} kg`} readOnly />
          <Field label="Volume" value={`${((part?.volume || 0) / 1000).toFixed(0)} cm³`} readOnly />
          <Field label="Surface Area" value={`${((part?.surfaceArea || 0) / 100).toFixed(1)} cm²`} readOnly />
          <Field label="Bounding Box" value={part ? `${(part.bbox.max[0] - part.bbox.min[0])} × ${(part.bbox.max[1] - part.bbox.min[1])} × ${(part.bbox.max[2] - part.bbox.min[2])} mm` : ''} readOnly />
        </Section>
        <Section title="Center of Mass">
          <Field label="X" value="0.000 mm" readOnly />
          <Field label="Y" value="2.340 mm" readOnly />
          <Field label="Z" value="0.000 mm" readOnly />
        </Section>
        <div className="px-3 py-4 text-[11px] text-muted-foreground text-center">
          Select a feature or instance to view its properties
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 space-y-3">
      <Section title={`${feature.type.replace('-', ' ').toUpperCase()} Feature`}>
        <Field label="Name" value={feature.name} onChange={(v) => updateFeature(feature.id, { name: v })} />
        <Field label="Status" value={feature.status} readOnly />
        <Field label="Suppressed" value={feature.suppressed ? 'Yes' : 'No'} readOnly />
        {feature.error && (
          <div className="text-[11px] text-red-500 flex items-start gap-1.5 mt-1">
            <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
            <span>{feature.error}</span>
          </div>
        )}
      </Section>

      <Section title="Parameters">
        {Object.entries(feature.parameters).map(([key, value]) => (
          <div key={key} className="space-y-1">
            {typeof value === 'number' ? (
              <NumberField
                label={key}
                value={value}
                unit={key.toLowerCase().includes('angle') || key === 'rotation' ? '°' : 'mm'}
                onChange={(v) => updateFeature(feature.id, { parameters: { ...feature.parameters, [key]: v } })}
              />
            ) : typeof value === 'string' ? (
              <Field label={key} value={value} onChange={(v) => updateFeature(feature.id, { parameters: { ...feature.parameters, [key]: v } })} />
            ) : Array.isArray(value) ? (
              <Field label={key} value={value.join(', ')} readOnly />
            ) : (
              <Field label={key} value={String(value)} readOnly />
            )}
          </div>
        ))}
        {Object.keys(feature.parameters).length === 0 && (
          <div className="text-[11px] text-muted-foreground">No parameters</div>
        )}
      </Section>

      <Section title="References">
        <Field label="Sketch" value={part?.sketches.find(s => s.id === feature.sketchId)?.name || '—'} readOnly />
        <Field label="Created" value={new Date(feature.createdAt).toLocaleString()} readOnly />
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1.5 border-b pb-1">{title}</div>
      {children}
    </div>
  );
}

function Field({ label, value, onChange, readOnly }: { label: string; value: string; onChange?: (v: string) => void; readOnly?: boolean }) {
  return (
    <div className="grid grid-cols-2 gap-2 items-center">
      <label className="text-[11px] text-muted-foreground">{label}</label>
      <input
        className="cad-input bg-card border rounded px-2 text-foreground"
        value={value}
        readOnly={readOnly}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
}

function NumberField({ label, value, unit, onChange }: { label: string; value: number; unit?: string; onChange?: (v: number) => void }) {
  return (
    <div className="grid grid-cols-2 gap-2 items-center">
      <label className="text-[11px] text-muted-foreground">{label}</label>
      <div className="flex">
        <input
          type="number"
          className="cad-input bg-card border rounded-l px-2 text-foreground flex-1 min-w-0"
          value={value}
          step="0.1"
          onChange={(e) => onChange?.(parseFloat(e.target.value) || 0)}
        />
        {unit && (
          <span className="px-2 h-[26px] flex items-center bg-muted border border-l-0 rounded-r text-[11px] text-muted-foreground font-mono">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

function ParametersTab() {
  const parts = useCADStore((s) => s.parts);
  const activePartId = useCADStore((s) => s.activePartId);
  const updateParameter = useCADStore((s) => s.updateParameter);
  const addParameter = useCADStore((s) => s.addParameter);
  const deleteParameter = useCADStore((s) => s.deleteParameter);

  const part = parts.find((p) => p.id === activePartId);
  if (!part) return null;

  return (
    <div className="p-2 space-y-1">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
          Parametric Variables
        </span>
        <button onClick={addParameter} className="cad-tool-btn" title="Add parameter">
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-[1fr_70px_50px_24px] gap-1 text-[10px] uppercase tracking-wider text-muted-foreground font-medium px-1 pb-1 border-b">
        <span>Name</span>
        <span>Value</span>
        <span>Unit</span>
        <span></span>
      </div>

      {part.parameters.map((p) => (
        <div key={p.id} className="grid grid-cols-[1fr_70px_50px_24px] gap-1 items-center">
          <input
            className="cad-input bg-card border rounded px-2 font-mono text-[11px]"
            value={p.name}
            onChange={(e) => updateParameter(p.id, { name: e.target.value })}
          />
          <input
            type="number"
            step="0.1"
            className="cad-input bg-card border rounded px-2 font-mono text-[11px]"
            value={p.value}
            onChange={(e) => updateParameter(p.id, { value: parseFloat(e.target.value) || 0 })}
          />
          <input
            className="cad-input bg-card border rounded px-2 font-mono text-[11px]"
            value={p.unit}
            onChange={(e) => updateParameter(p.id, { unit: e.target.value })}
          />
          <button
            onClick={() => deleteParameter(p.id)}
            className="cad-tool-btn h-[26px] w-[26px] text-muted-foreground hover:text-red-500"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      ))}

      <div className="mt-4 pt-2 border-t">
        <div className="text-[11px] text-muted-foreground mb-2">
          <Sparkles className="w-3 h-3 inline mr-1" />
          Use variables in dimensions: <code className="font-mono">Width / 2 + 5</code>
        </div>
        <div className="space-y-1 text-[10px] font-mono bg-muted/40 p-2 rounded">
          <div><span className="text-emerald-500">Width</span> = 120mm</div>
          <div><span className="text-emerald-500">Height</span> = 80mm</div>
          <div><span className="text-emerald-500">FilletRadius</span> = 4mm</div>
          <div className="text-muted-foreground">{'// Expression example:'}</div>
          <div><span className="text-violet-500">HoleSpacing</span> = Width - 2 * WallThickness</div>
        </div>
      </div>
    </div>
  );
}

function AITab() {
  const messages = useCADStore((s) => s.aiMessages);
  const sendMessage = useCADStore((s) => s.sendAIMessage);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    setThinking(true);
    sendMessage(input);
    setInput('');
    setTimeout(() => setThinking(false), 700);
  };

  const suggestions = [
    'Add fillets to all external edges',
    'Reduce weight by 15% while maintaining strength',
    'Create a gearbox housing with mounting holes',
    'Check mate conflicts in assembly',
    'Run stress analysis on this part',
    'Review manufacturability',
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-3 py-2 border-b bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
            <Brain className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <div className="text-[12px] font-semibold">Engineering Assistant</div>
            <div className="text-[10px] text-muted-foreground">GPT-4 Turbo · Engineering-tuned</div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((m) => (
          <div key={m.id} className={`flex flex-col gap-1 ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[90%] rounded-lg px-3 py-2 text-[12px] ${
              m.role === 'user'
                ? 'bg-primary text-primary-foreground'
                : 'bg-card border'
            }`}>
              <div className="whitespace-pre-wrap">{m.content}</div>
              {m.actions && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {m.actions.map((a, i) => (
                    <button
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded border bg-background/50 hover:bg-accent transition"
                      onClick={() => useCADStore.getState().toast({ title: 'Applied: ' + a.label, variant: 'success' })}
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {thinking && (
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Analyzing geometry...</span>
          </div>
        )}
      </div>

      {/* Suggestions */}
      <div className="px-2 py-1.5 border-t">
        <div className="text-[10px] uppercase text-muted-foreground mb-1">Quick prompts</div>
        <div className="flex flex-wrap gap-1">
          {suggestions.slice(0, 3).map((s, i) => (
            <button
              key={i}
              onClick={() => setInput(s)}
              className="text-[10px] px-2 py-0.5 rounded-full border bg-card hover:bg-accent transition truncate"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-2 border-t">
        <div className="flex gap-1">
          <input
            className="flex-1 h-8 px-2 rounded bg-card border text-[12px] outline-none focus:ring-1 focus:ring-primary"
            placeholder="Ask the AI engineer..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
          />
          <button
            className="w-8 h-8 flex items-center justify-center rounded bg-primary text-primary-foreground hover:opacity-90 transition"
            onClick={handleSend}
            disabled={thinking}
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function CollabTab() {
  const collaborators = useCADStore((s) => s.collaborators);

  return (
    <div className="p-3 space-y-3">
      <Section title="Active Session">
        <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live · {collaborators.filter(c => c.active).length} active
        </div>
        <div className="text-[10px] font-mono text-muted-foreground">
          ws://zcad.cloud/sess/gearbox-asm
        </div>
      </Section>

      <Section title="Team Members">
        <div className="space-y-1.5">
          {collaborators.map((c) => (
            <div key={c.id} className="flex items-center gap-2 p-1.5 rounded hover:bg-accent">
              <div className="relative">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                  style={{ backgroundColor: c.color }}
                >
                  {c.avatar}
                </div>
                <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-background ${c.active ? 'bg-emerald-500' : 'bg-muted-foreground'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-medium truncate">{c.name}</div>
                <div className="text-[10px] text-muted-foreground truncate">
                  {c.active
                    ? (c.editingFeature ? `Editing: ${c.editingFeature}` : 'Viewing')
                    : 'Offline'}
                </div>
              </div>
              {c.active && (
                <MessageSquare className="w-3 h-3 text-muted-foreground hover:text-foreground cursor-pointer" />
              )}
            </div>
          ))}
        </div>
      </Section>

      <Section title="Recent Activity">
        <div className="space-y-1 text-[11px]">
          <ActivityItem label="Maya Patel" action="edited Fillet feature" time="2 min ago" color="#10b981" />
          <ActivityItem label="Sara Lopez" action="added chamfers to bores" time="15 min ago" color="#8b5cf6" />
          <ActivityItem label="Rohit Kumar" action="ran stress analysis" time="1 hour ago" color="#f59e0b" />
          <ActivityItem label="Alex Chen" action="created version v6" time="3 hours ago" color="#ef4444" />
        </div>
      </Section>

      <Section title="Comments">
        <div className="space-y-2">
          <div className="p-2 rounded bg-card border text-[11px]">
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-4 h-4 rounded-full bg-emerald-500 text-white text-[8px] flex items-center justify-center font-bold">MP</div>
              <span className="font-medium">Maya Patel</span>
              <span className="text-muted-foreground text-[10px]">· 5 min ago</span>
            </div>
            <div>Should we increase the wall thickness to handle the higher torque load? FEA shows a 1.9 SF currently.</div>
          </div>
          <div className="p-2 rounded bg-card border text-[11px]">
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-4 h-4 rounded-full bg-red-500 text-white text-[8px] flex items-center justify-center font-bold">AC</div>
              <span className="font-medium">Alex Chen</span>
              <span className="text-muted-foreground text-[10px]">· 12 min ago</span>
            </div>
            <div>Looks good to me. Let's proceed with this geometry for the prototype.</div>
          </div>
        </div>
      </Section>
    </div>
  );
}

function ActivityItem({ label, action, time, color }: { label: string; action: string; time: string; color: string }) {
  return (
    <div className="flex items-start gap-1.5">
      <div className="w-1.5 h-1.5 rounded-full mt-1.5" style={{ backgroundColor: color }} />
      <div className="flex-1">
        <span className="font-medium">{label}</span> <span className="text-muted-foreground">{action}</span>
        <div className="text-[10px] text-muted-foreground">{time}</div>
      </div>
    </div>
  );
}

function VersionsTab() {
  const versions = useCADStore((s) => s.versions);
  const createVersion = useCADStore((s) => s.createVersion);
  const revertVersion = useCADStore((s) => s.revertVersion);
  const toast = useCADStore((s) => s.toast);

  return (
    <div className="p-2">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
          Version History
        </span>
        <button
          onClick={() => { createVersion('Manual save'); toast({ title: 'Version saved', variant: 'success' }); }}
          className="text-[11px] px-2 py-1 rounded bg-primary text-primary-foreground hover:opacity-90"
        >
          Save Version
        </button>
      </div>

      <div className="flex items-center gap-1 mb-2 text-[11px]">
        <GitBranch className="w-3 h-3 text-emerald-500" />
        <span className="font-mono">main</span>
        <ChevronRight className="w-3 h-3 text-muted-foreground" />
        <span className="text-muted-foreground">{versions.length} commits</span>
      </div>

      <div className="space-y-1">
        {versions.slice().reverse().map((v, i) => (
          <div key={v.id} className="p-2 rounded border bg-card hover:bg-accent transition group">
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                {v.author.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-medium truncate">{v.message}</div>
                <div className="text-[10px] text-muted-foreground">
                  {v.author} · {new Date(v.timestamp).toLocaleString()}
                </div>
                <div className="text-[10px] font-mono text-muted-foreground mt-0.5">{v.id}</div>
              </div>
              {i === 0 && (
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-500 font-mono">HEAD</span>
              )}
              <button
                className="opacity-0 group-hover:opacity-100 text-[10px] px-2 py-1 rounded border hover:bg-accent"
                onClick={() => revertVersion(v.id)}
              >
                Restore
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExportTab() {
  const setExportDialogOpen = useCADStore((s) => s.setExportDialogOpen);
  const toast = useCADStore((s) => s.toast);

  const formats = [
    { ext: 'STL', desc: '3D print mesh', icon: <Box className="w-4 h-4" />, cat: '3D' },
    { ext: 'STEP', desc: 'B-Rep CAD exchange', icon: <Layers3 className="w-4 h-4" />, cat: '3D' },
    { ext: 'IGES', desc: 'Legacy CAD', icon: <Layers3 className="w-4 h-4" />, cat: '3D' },
    { ext: 'OBJ', desc: '3D mesh + materials', icon: <Box className="w-4 h-4" />, cat: '3D' },
    { ext: 'PARASOLID', desc: 'Siemens kernel', icon: <Box className="w-4 h-4" />, cat: '3D' },
    { ext: '3MF', desc: '3D print advanced', icon: <Box className="w-4 h-4" />, cat: '3D' },
    { ext: 'PDF', desc: 'Drawing 2D', icon: <FileText className="w-4 h-4" />, cat: '2D' },
    { ext: 'SVG', desc: 'Vector drawing', icon: <FileText className="w-4 h-4" />, cat: '2D' },
    { ext: 'DXF', desc: 'CAD drawing', icon: <FileText className="w-4 h-4" />, cat: '2D' },
    { ext: 'DWG', desc: 'AutoCAD', icon: <FileText className="w-4 h-4" />, cat: '2D' },
    { ext: 'G-CODE', desc: 'CNC toolpath', icon: <Cpu className="w-4 h-4" />, cat: 'MFG' },
    { ext: 'NC', desc: 'Numeric control', icon: <Cpu className="w-4 h-4" />, cat: 'MFG' },
  ];

  return (
    <div className="p-3 space-y-3">
      <Section title="Export Format">
        <div className="grid grid-cols-2 gap-1.5">
          {formats.map((f) => (
            <button
              key={f.ext}
              className="p-2 rounded border bg-card hover:bg-accent hover:border-primary transition text-left group"
              onClick={() => toast({ title: `Exported as ${f.ext}`, variant: 'success' })}
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-primary group-hover:text-primary">{f.icon}</span>
                <span className="text-[12px] font-medium font-mono">{f.ext}</span>
              </div>
              <div className="text-[10px] text-muted-foreground truncate">{f.desc}</div>
            </button>
          ))}
        </div>
      </Section>

      <Section title="Manufacturing">
        <div className="space-y-1">
          <button
            className="w-full p-2 rounded border bg-card hover:bg-accent text-left flex items-center justify-between"
            onClick={() => setExportDialogOpen(true)}
          >
            <div>
              <div className="text-[12px] font-medium">CNC Toolpath Generator</div>
              <div className="text-[10px] text-muted-foreground">3-axis, est. 22 min machining</div>
            </div>
            <Cpu className="w-4 h-4 text-primary" />
          </button>
          <button className="w-full p-2 rounded border bg-card hover:bg-accent text-left flex items-center justify-between">
            <div>
              <div className="text-[12px] font-medium">Sheet Metal Flat Pattern</div>
              <div className="text-[10px] text-muted-foreground">K-factor 0.44, bend allowance</div>
            </div>
            <Layers3 className="w-4 h-4 text-primary" />
          </button>
          <button className="w-full p-2 rounded border bg-card hover:bg-accent text-left flex items-center justify-between">
            <div>
              <div className="text-[12px] font-medium">3D Print Preparation</div>
              <div className="text-[10px] text-muted-foreground">Slicer · 4h 12m · 18g PLA</div>
            </div>
            <Box className="w-4 h-4 text-primary" />
          </button>
          <button className="w-full p-2 rounded border bg-card hover:bg-accent text-left flex items-center justify-between">
            <div>
              <div className="text-[12px] font-medium">Nesting Optimization</div>
              <div className="text-[10px] text-muted-foreground">73% material utilization</div>
            </div>
            <Grid3x3 className="w-4 h-4 text-primary" />
          </button>
        </div>
      </Section>

      <Section title="Cloud Storage">
        <div className="space-y-1">
          <div className="p-2 rounded bg-card border flex items-center justify-between">
            <div>
              <div className="text-[12px] font-medium flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                Encrypted at rest (AES-256)
              </div>
              <div className="text-[10px] text-muted-foreground">847 MB · 23 versions</div>
            </div>
          </div>
          <div className="p-2 rounded bg-card border flex items-center justify-between">
            <div>
              <div className="text-[12px] font-medium">Storage</div>
              <div className="text-[10px] text-muted-foreground">847 MB / 50 GB used</div>
            </div>
            <div className="text-[10px] font-mono">1.7%</div>
          </div>
        </div>
      </Section>
    </div>
  );
}

export function RightPanel() {
  const rightPanelTab = useCADStore((s) => s.rightPanelTab);
  const setRightPanelTab = useCADStore((s) => s.setRightPanelTab);
  const panelRightCollapsed = useCADStore((s) => s.panelRightCollapsed);
  const toggleRightPanel = useCADStore((s) => s.toggleRightPanel);

  if (panelRightCollapsed) {
    return (
      <div className="w-9 border-l cad-panel flex flex-col items-center py-2 gap-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            className={`cad-tool-btn ${rightPanelTab === t.id ? 'active' : ''}`}
            title={t.label}
            onClick={() => { setRightPanelTab(t.id); toggleRightPanel(); }}
          >
            {t.icon}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col cad-panel">
      <div className="flex items-center border-b">
        {tabs.map((t) => (
          <button
            key={t.id}
            className={`flex-1 py-2 flex flex-col items-center gap-0.5 text-[10px] ${rightPanelTab === t.id ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setRightPanelTab(t.id)}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto">
        {rightPanelTab === 'properties' && <PropertiesTab />}
        {rightPanelTab === 'parameters' && <ParametersTab />}
        {rightPanelTab === 'ai' && <AITab />}
        {rightPanelTab === 'collab' && <CollabTab />}
        {rightPanelTab === 'versions' && <VersionsTab />}
        {rightPanelTab === 'export' && <ExportTab />}
      </div>
    </div>
  );
}
