'use client';

import { useState } from 'react';
import { useCADStore } from '@/store/useCADStore';
import {
  X, Download, FileText, Box, Layers3, Cpu, Check, Settings2,
  ChevronRight
} from 'lucide-react';

const formats = [
  { ext: 'STL', desc: '3D print mesh (ASCII/binary)', cat: '3D Mesh' },
  { ext: 'STEP', desc: 'ISO 10303 B-Rep exchange', cat: 'CAD' },
  { ext: 'IGES', desc: 'Legacy CAD surface exchange', cat: 'CAD' },
  { ext: 'OBJ', desc: 'Wavefront mesh with materials', cat: '3D Mesh' },
  { ext: '3MF', desc: '3D print advanced format', cat: '3D Mesh' },
  { ext: 'PARASOLID', desc: 'Siemens kernel format', cat: 'CAD' },
  { ext: 'PDF', desc: 'Vector drawing with annotations', cat: '2D' },
  { ext: 'SVG', desc: 'Scalable vector graphics', cat: '2D' },
  { ext: 'DXF', desc: 'AutoCAD drawing exchange', cat: '2D' },
  { ext: 'DWG', desc: 'AutoCAD native', cat: '2D' },
  { ext: 'G-CODE', desc: 'CNC toolpath (3-axis)', cat: 'Manufacturing' },
  { ext: 'NC', desc: 'Numeric control', cat: 'Manufacturing' },
];

export function ExportDialog() {
  const open = useCADStore((s) => s.exportDialogOpen);
  const setOpen = useCADStore((s) => s.setExportDialogOpen);
  const toast = useCADStore((s) => s.toast);
  const [selected, setSelected] = useState<string>('STEP');
  const [options, setOptions] = useState({
    binary: true,
    resolution: 'medium',
    units: 'mm',
    includeDrafting: true,
    precision: 0.01,
  });

  if (!open) return null;

  const handleExport = () => {
    toast({
      title: `Exported as ${selected}`,
      description: `${selected}.${formats.find(f => f.ext === selected)?.ext.toLowerCase()} saved to download folder`,
      variant: 'success',
    });
    setOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)}>
      <div
        className="w-[680px] max-h-[80vh] bg-card border rounded-lg shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-primary" />
            <h2 className="text-[14px] font-semibold">Export Model</h2>
          </div>
          <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Format list */}
          <div className="w-72 border-r overflow-y-auto">
            <div className="px-3 py-2 text-[10px] uppercase tracking-wider text-muted-foreground bg-muted/30 border-b">
              Select Format
            </div>
            {formats.map((f) => (
              <button
                key={f.ext}
                onClick={() => setSelected(f.ext)}
                className={`w-full px-3 py-2 flex items-center gap-3 text-left hover:bg-accent transition border-b ${selected === f.ext ? 'bg-primary/10' : ''}`}
              >
                <div className="w-7 h-7 rounded bg-muted flex items-center justify-center text-[10px] font-mono font-bold">
                  {f.ext.slice(0, 3)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-medium flex items-center gap-2">
                    {f.ext}
                    <span className="text-[9px] px-1 rounded bg-muted text-muted-foreground font-mono">{f.cat}</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground truncate">{f.desc}</div>
                </div>
                {selected === f.ext && <Check className="w-3 h-3 text-primary" />}
              </button>
            ))}
          </div>

          {/* Options */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium mb-2">
                Export Options
              </div>
              <div className="space-y-2">
                <label className="flex items-center justify-between p-2 rounded border bg-card">
                  <span className="text-[12px]">Binary format</span>
                  <input
                    type="checkbox"
                    checked={options.binary}
                    onChange={(e) => setOptions({ ...options, binary: e.target.checked })}
                    className="accent-primary"
                  />
                </label>
                <label className="flex items-center justify-between p-2 rounded border bg-card">
                  <span className="text-[12px]">Units</span>
                  <select
                    className="bg-card border rounded px-2 py-1 text-[11px]"
                    value={options.units}
                    onChange={(e) => setOptions({ ...options, units: e.target.value })}
                  >
                    <option value="mm">Millimeters</option>
                    <option value="cm">Centimeters</option>
                    <option value="m">Meters</option>
                    <option value="in">Inches</option>
                  </select>
                </label>
                <label className="flex items-center justify-between p-2 rounded border bg-card">
                  <span className="text-[12px]">Tessellation resolution</span>
                  <select
                    className="bg-card border rounded px-2 py-1 text-[11px]"
                    value={options.resolution}
                    onChange={(e) => setOptions({ ...options, resolution: e.target.value })}
                  >
                    <option value="coarse">Coarse (fast)</option>
                    <option value="medium">Medium</option>
                    <option value="fine">Fine</option>
                    <option value="ultra">Ultra (slow)</option>
                  </select>
                </label>
                <label className="flex items-center justify-between p-2 rounded border bg-card">
                  <span className="text-[12px]">Precision (chordal error)</span>
                  <span className="text-[11px] font-mono">{options.precision.toFixed(3)} mm</span>
                </label>
              </div>
            </div>

            <div>
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium mb-2">
                Preview
              </div>
              <div className="p-3 rounded border bg-muted/30 text-[11px] font-mono">
                <div>File: gearbox_housing.{selected.toLowerCase()}</div>
                <div>Size: ~{(selected === 'STEP' ? 847 : selected === 'STL' ? 1240 : 350).toLocaleString()} KB</div>
                <div>Triangles: 24,532</div>
                <div>Vertices: 12,268</div>
                <div>Materials: 1</div>
              </div>
            </div>

            <div className="text-[11px] text-muted-foreground flex items-start gap-1.5">
              <Settings2 className="w-3 h-3 mt-0.5" />
              <span>Files are saved to your cloud storage and can be downloaded locally. Exports preserve parametric metadata where supported by the format.</span>
            </div>
          </div>
        </div>

        <div className="px-4 py-3 border-t flex items-center justify-between">
          <div className="text-[11px] text-muted-foreground">
            Selected: <span className="font-mono font-medium">{selected}</span>
          </div>
          <div className="flex gap-2">
            <button
              className="px-3 py-1.5 text-[12px] rounded border bg-card hover:bg-accent"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-1.5 text-[12px] rounded bg-primary text-primary-foreground hover:opacity-90 flex items-center gap-1.5"
              onClick={handleExport}
            >
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
