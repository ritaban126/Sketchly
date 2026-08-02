"use client";
import { useCanvasStore } from "../../stores/canvasStore";


const tools = [
  { id: "pen", label: "Pen" },
  { id: "eraser", label: "Eraser" },
  { id: "rect", label: "Rectangle" },
  { id: "circle", label: "Circle" },
  { id: "line", label: "Line" },
  { id: "arrow", label: "Arrow" },
  { id: "text", label: "Text" },
  { id: "select", label: "Select" },
] as const;

export function Toolbar() {
  const selectedTool = useCanvasStore((s) => s.selectedTool);
  const setTool = useCanvasStore((s) => s.setTool);
  const color = useCanvasStore((s) => s.color);
  const setColor = useCanvasStore((s) => s.setColor);
  const brushSize = useCanvasStore((s) => s.brushSize);
  const setBrushSize = useCanvasStore((s) => s.setBrushSize);
  const undo = useCanvasStore((s) => s.undo);
  const redo = useCanvasStore((s) => s.redo);

  return (
    <div
      className="flex flex-wrap items-center gap-2 border-b border-neutral-800 bg-neutral-950 px-3 py-2"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {tools.map((tool) => (
        <button
          key={tool.id}
          type="button"
          aria-pressed={selectedTool === tool.id}
          onClick={() => setTool(tool.id)}
          className={`rounded px-3 py-1.5 font-mono text-[13px] tracking-tight transition-colors ${
            selectedTool === tool.id
              ? "bg-blue-600 text-white"
              : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
          }`}
        >
          {tool.label}
        </button>
      ))}

      <label className="flex items-center gap-2 rounded bg-neutral-800 px-2 py-1 font-mono text-[13px] tracking-tight text-neutral-200">
        <span>Color</span>
        <input
          aria-label="Choose brush color"
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="h-7 w-7 cursor-pointer rounded border border-neutral-600 bg-transparent"
        />
      </label>

      <label className="flex items-center gap-2 rounded bg-neutral-800 px-2 py-1 font-mono text-[13px] tracking-tight text-neutral-200">
        <span>Size</span>
        <input
          aria-label="Brush size"
          type="range"
          min={1}
          max={30}
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))}
          className="accent-blue-500"
        />
      </label>

      <button onClick={undo} className="rounded bg-neutral-800 px-3 py-1.5 font-mono text-[13px] tracking-tight text-neutral-300 hover:bg-neutral-700">
        Undo
      </button>
      <button onClick={redo} className="rounded bg-neutral-800 px-3 py-1.5 font-mono text-[13px] tracking-tight text-neutral-300 hover:bg-neutral-700">
        Redo
      </button>
    </div>
  );
}