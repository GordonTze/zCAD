'use client';

import { useState } from 'react';
import { useCADStore } from '@/store/useCADStore';
import {
  FileText, Plus, Download, Printer, ZoomIn, ZoomOut, Maximize2,
  Grid3x3, Layers, Ruler, Eye, ChevronRight, Copy, Trash2,
  PenTool, StickyNote, Hexagon, Wrench
} from 'lucide-react';

export function DrawingWorkspace() {
  const drawings = useCADStore((s) => s.drawings);
  const activeSheetId = useCADStore((s) => s.activeDrawingSheetId);
  const setActiveSheetId = useCADStore((s) => s.setActiveSheetId);
  const setExportDialogOpen = useCADStore((s) => s.setExportDialogOpen);
  const toast = useCADStore((s) => s.toast);
  const [zoom, setZoom] = useState(1);

  const sheet = drawings.find(d => d.id === activeSheetId) || drawings[0];

  const sheetW = sheet.orientation === 'landscape' ? 594 : 420;
  const sheetH = sheet.orientation === 'landscape' ? 420 : 594;

  return (
    <div className="flex h-full">
      {/* Drawing browser / sidebar */}
      <div className="w-56 border-r cad-panel flex flex-col">
        <div className="px-3 py-2 border-b flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
            Sheets ({drawings.length})
          </span>
          <button
            className="cad-tool-btn"
            onClick={() => toast({ title: 'New sheet added', variant: 'success' })}
            title="New sheet"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {drawings.map((d) => (
            <div
              key={d.id}
              className={`feature-tree-item cursor-pointer p-2 ${d.id === activeSheetId ? 'selected' : ''}`}
              onClick={() => setActiveSheetId(d.id)}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-medium truncate">{d.name}</div>
                  <div className="text-[10px] text-muted-foreground font-mono">
                    {d.size} · {d.scale}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t p-2 space-y-1">
          <button
            className="w-full p-1.5 rounded border bg-card hover:bg-accent text-[11px] flex items-center gap-1.5"
            onClick={() => setExportDialogOpen(true)}
          >
            <Download className="w-3 h-3" />
            Export PDF/SVG/DXF
          </button>
          <button
            className="w-full p-1.5 rounded border bg-card hover:bg-accent text-[11px] flex items-center gap-1.5"
            onClick={() => toast({ title: 'Sent to printer', variant: 'success' })}
          >
            <Printer className="w-3 h-3" />
            Print
          </button>
        </div>
      </div>

      {/* Drawing canvas */}
      <div className="flex-1 overflow-auto bg-muted/30 dark:bg-black/30 flex items-center justify-center p-8">
        <div
          className="bg-white shadow-2xl relative"
          style={{
            width: sheetW * zoom,
            height: sheetH * zoom,
            transformOrigin: 'center',
          }}
        >
          {/* Sheet grid */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)',
              backgroundSize: '20px 20px',
              opacity: 0.4,
            }}
          />

          {/* Drawing border */}
          <div className="absolute inset-4 border-2 border-black pointer-events-none" />

          {/* Title block (bottom right) */}
          <div
            className="absolute border-2 border-black bg-white"
            style={{
              right: 4, bottom: 4, width: 180 * zoom, height: 60 * zoom,
            }}
          >
            <table className="w-full h-full text-[8px] font-mono">
              <tbody>
                <tr><td className="border border-black p-0.5 font-bold">Z.AI ENG</td><td className="border border-black p-0.5" colSpan={2}>{sheet.titleBlock.title}</td></tr>
                <tr>
                  <td className="border border-black p-0.5">DRW: {sheet.titleBlock.drawnBy}</td>
                  <td className="border border-black p-0.5">DATE: {sheet.titleBlock.date}</td>
                  <td className="border border-black p-0.5">SIZE: {sheet.titleBlock.size}</td>
                </tr>
                <tr>
                  <td className="border border-black p-0.5">SCALE: {sheet.titleBlock.scale}</td>
                  <td className="border border-black p-0.5" colSpan={2}>REV: {sheet.titleBlock.revision}</td>
                </tr>
                <tr>
                  <td className="border border-black p-0.5 font-bold" colSpan={3}>{sheet.titleBlock.drawingNumber}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Drawing views (placeholder shapes representing orthographic views) */}
          {sheet.views.map((v) => {
            const isIso = v.type === 'iso';
            const isSection = v.type === 'section';
            const isDetail = v.type === 'detail';
            const sizeScale = v.scale * zoom * 1.2;

            return (
              <div
                key={v.id}
                className="absolute"
                style={{
                  left: v.position.x * zoom,
                  top: v.position.y * zoom,
                  width: 160 * sizeScale / 2,
                  height: 120 * sizeScale / 2,
                }}
              >
                <div className="text-[8px] font-mono text-gray-500 mb-1">
                  {v.name} · SCALE 1:{v.scale}
                </div>
                <svg viewBox="0 0 160 120" className="w-full h-full border border-gray-300">
                  {/* Front view of housing */}
                  <rect x="20" y="20" width="120" height="80" stroke="black" strokeWidth="1" fill="none" />
                  {/* Bearing bores */}
                  <circle cx="35" cy="60" r="12" stroke="black" strokeWidth="1" fill="none" />
                  <circle cx="125" cy="60" r="12" stroke="black" strokeWidth="1" fill="none" />
                  <circle cx="35" cy="60" r="11" stroke="black" strokeWidth="0.3" fill="none" strokeDasharray="2,1" />
                  <circle cx="125" cy="60" r="11" stroke="black" strokeWidth="0.3" fill="none" strokeDasharray="2,1" />

                  {/* Small holes */}
                  <circle cx="80" cy="30" r="8" stroke="black" strokeWidth="1" fill="none" />
                  <circle cx="80" cy="90" r="8" stroke="black" strokeWidth="1" fill="none" />

                  {/* Centerlines */}
                  <line x1="10" y1="60" x2="150" y2="60" stroke="black" strokeWidth="0.3" strokeDasharray="6,2,1,2" />
                  <line x1="80" y1="10" x2="80" y2="110" stroke="black" strokeWidth="0.3" strokeDasharray="6,2,1,2" />

                  {/* Corner fillets */}
                  <path d="M 20 30 Q 20 20 30 20" stroke="black" strokeWidth="1" fill="none" />
                  <path d="M 130 20 Q 140 20 140 30" stroke="black" strokeWidth="1" fill="none" />
                  <path d="M 140 90 Q 140 100 130 100" stroke="black" strokeWidth="1" fill="none" />
                  <path d="M 30 100 Q 20 100 20 90" stroke="black" strokeWidth="1" fill="none" />

                  {/* Mounting holes */}
                  <circle cx="30" cy="30" r="2" stroke="black" strokeWidth="0.5" fill="black" />
                  <circle cx="130" cy="30" r="2" stroke="black" strokeWidth="0.5" fill="black" />
                  <circle cx="30" cy="90" r="2" stroke="black" strokeWidth="0.5" fill="black" />
                  <circle cx="130" cy="90" r="2" stroke="black" strokeWidth="0.5" fill="black" />

                  {isSection && (
                    <>
                      <line x1="0" y1="60" x2="160" y2="60" stroke="red" strokeWidth="0.5" strokeDasharray="4,2,1,2" />
                      <text x="2" y="58" fontSize="6" fill="red">A</text>
                      <text x="152" y="58" fontSize="6" fill="red">A</text>
                    </>
                  )}
                  {isIso && (
                    <g transform="rotate(-25) skewX(-15)">
                      <rect x="40" y="40" width="80" height="40" stroke="black" strokeWidth="0.5" fill="none" />
                      <rect x="48" y="48" width="64" height="24" stroke="black" strokeWidth="0.3" fill="none" />
                    </g>
                  )}
                  {isDetail && (
                    <>
                      <circle cx="80" cy="60" r="40" stroke="black" strokeWidth="0.5" strokeDasharray="2,1" fill="none" />
                      <text x="60" y="105" fontSize="6" fill="black">DETAIL B · SCALE 2:1</text>
                    </>
                  )}
                </svg>
              </div>
            );
          })}

          {/* Dimensions overlay */}
          {sheet.dimensions.map((d) => (
            <div
              key={d.id}
              className="absolute text-[8px] font-mono text-black"
              style={{
                left: d.position.x * zoom,
                top: d.position.y * zoom,
              }}
            >
              <div className="flex items-center gap-0.5">
                <span>←</span>
                <span className="font-bold border-b border-black px-1">
                  {d.value}{d.tolerance ? ` ${d.tolerance}` : ''}
                </span>
                <span>→</span>
              </div>
            </div>
          ))}

          {/* Annotations */}
          {sheet.annotations.map((a) => (
            <div
              key={a.id}
              className="absolute text-[8px] font-mono text-black"
              style={{
                left: a.position.x * zoom,
                top: a.position.y * zoom,
              }}
            >
              {a.type === 'surface-finish' ? (
                <div className="border border-black p-0.5 bg-white">
                  √ {a.text}
                </div>
              ) : a.type === 'gdnt' ? (
                <div className="border border-black p-0.5 bg-white font-mono">
                  ⌖ {a.text}
                </div>
              ) : (
                <div className="bg-white px-1 border border-black">
                  {a.text}
                </div>
              )}
            </div>
          ))}

          {/* Section markers */}
          <div className="absolute top-4 left-4 text-[10px] font-mono font-bold text-black">
            A
          </div>
          <div className="absolute top-4 right-4 text-[10px] font-mono font-bold text-black">
            A
          </div>

          {/* Sheet info */}
          <div className="absolute top-4 right-1/2 translate-x-1/2 text-[10px] font-mono text-gray-500">
            {sheet.name} · {sheet.size} · {sheet.scale}
          </div>
        </div>
      </div>

      {/* Right toolbar */}
      <div className="w-10 border-l cad-panel flex flex-col items-center py-2 gap-1">
        <button className="cad-tool-btn" title="Zoom in" onClick={() => setZoom(z => Math.min(z + 0.2, 3))}>
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button className="cad-tool-btn" title="Zoom out" onClick={() => setZoom(z => Math.max(z - 0.2, 0.4))}>
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <button className="cad-tool-btn" title="Fit" onClick={() => setZoom(1)}>
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
        <div className="w-6 h-px bg-border my-1" />
        <span className="text-[10px] font-mono text-muted-foreground">{Math.round(zoom * 100)}%</span>
        <div className="w-6 h-px bg-border my-1" />
        <button className="cad-tool-btn" title="Toggle grid">
          <Grid3x3 className="w-3.5 h-3.5" />
        </button>
        <button className="cad-tool-btn" title="Layers">
          <Layers className="w-3.5 h-3.5" />
        </button>
        <button className="cad-tool-btn" title="Dimension">
          <Ruler className="w-3.5 h-3.5" />
        </button>
        <button className="cad-tool-btn" title="Annotation">
          <PenTool className="w-3.5 h-3.5" />
        </button>
        <button className="cad-tool-btn" title="Note">
          <StickyNote className="w-3.5 h-3.5" />
        </button>
        <button className="cad-tool-btn" title="GD&T">
          <Hexagon className="w-3.5 h-3.5" />
        </button>
        <button className="cad-tool-btn" title="Surface finish">
          <Wrench className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
