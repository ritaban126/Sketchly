import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  MousePointer2,
  Undo2,
  Eraser,
  Square,
  Triangle,
  Circle,
  Diamond,
  type LucideIcon,
} from "lucide-react";


  // Types

interface Point {
  x: number;
  y: number;
}

interface Stroke {
  color: string;
  points: Point[];
}

type ShapeKind = "square" | "triangle" | "circle" | "diamond";

interface MarkerColor {
  name: string;
  hex: string;
}

const MARKER_COLORS: MarkerColor[] = [
  { name: "ink", hex: "#15172B" },
  { name: "coral", hex: "#FF6B57" },
  { name: "teal", hex: "#1FADA0" },
  { name: "yellow", hex: "#E6A800" },
];


  //Helpers

function shapePoints(kind: ShapeKind, cx: number, cy: number, s: number): Point[] {
  switch (kind) {
    case "square":
      return [
        { x: cx - s, y: cy - s },
        { x: cx + s, y: cy - s },
        { x: cx + s, y: cy + s },
        { x: cx - s, y: cy + s },
        { x: cx - s, y: cy - s },
      ];
    case "triangle":
      return [
        { x: cx, y: cy - s },
        { x: cx + s, y: cy + s },
        { x: cx - s, y: cy + s },
        { x: cx, y: cy - s },
      ];
    case "diamond":
      return [
        { x: cx, y: cy - s },
        { x: cx + s, y: cy },
        { x: cx, y: cy + s },
        { x: cx - s, y: cy },
        { x: cx, y: cy - s },
      ];
    case "circle": {
      const pts: Point[] = [];
      for (let i = 0; i <= 32; i++) {
        const a = (i / 32) * Math.PI * 2;
        pts.push({ x: cx + Math.cos(a) * s, y: cy + Math.sin(a) * s });
      }
      return pts;
    }
    default:
      return [];
  }
}


function drawStroke(ctx: CanvasRenderingContext2D, stroke: Stroke): void {
  if (stroke.points.length < 2) return;
  ctx.strokeStyle = stroke.color;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
  for (let i = 1; i < stroke.points.length; i++) {
    const wobble = 2.2 + Math.sin(i * 0.9) * 0.6;
    ctx.lineWidth = wobble;
    ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
  }
  ctx.stroke();
}


function randomInRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}


function createStampStroke(kind: ShapeKind, rect: DOMRect, color: string): Stroke {
  const cx = randomInRange(60, rect.width - 60);
  const cy = randomInRange(40, rect.height - 40);
  return { color, points: shapePoints(kind, cx, cy, 26) };
}


  //Component

export default function DrawableBoard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const strokesRef = useRef<Stroke[]>([]);
  const currentStrokeRef = useRef<Stroke | null>(null);
  const lastPointRef = useRef<Point | null>(null);

  const [color, setColor] = useState<string>(MARKER_COLORS[0].hex);
  const [hasInk, setHasInk] = useState<boolean>(false);

    const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    strokesRef.current.forEach((stroke) => drawStroke(ctx, stroke));
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    redraw();
  }, [redraw]);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [resizeCanvas]);

  const getPos = (e: React.PointerEvent<HTMLCanvasElement>): Point | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handlePointerEnter = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const pos = getPos(e);
    if (!pos) return;
    currentStrokeRef.current = { color, points: [pos] };
    lastPointRef.current = pos;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!currentStrokeRef.current) {
      handlePointerEnter(e);
      return;
    }
    const pos = getPos(e);
    const canvas = canvasRef.current;
    const last = lastPointRef.current;
    if (!pos || !canvas || !last) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = color;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth =
      2.2 + Math.sin(currentStrokeRef.current.points.length * 0.9) * 0.6;
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    currentStrokeRef.current.points.push(pos);
    lastPointRef.current = pos;
    setHasInk(true);
  };

  const handlePointerLeave = () => {
    if (currentStrokeRef.current && currentStrokeRef.current.points.length > 1) {
      strokesRef.current.push(currentStrokeRef.current);
    }
    currentStrokeRef.current = null;
    lastPointRef.current = null;
  };

  const handleUndo = () => {
    strokesRef.current.pop();
    redraw();
    setHasInk(strokesRef.current.length > 0);
  };

  const handleClear = () => {
    strokesRef.current = [];
    redraw();
    setHasInk(false);
  };

  const stamp = (kind: ShapeKind) => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const rect = container.getBoundingClientRect();
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const stroke = createStampStroke(kind, rect, color);

    strokesRef.current.push(stroke);
    drawStroke(ctx, stroke);
    setHasInk(true);
  };

  const shapeButtons: { kind: ShapeKind; Icon: LucideIcon }[] = [
    { kind: "square", Icon: Square },
    { kind: "triangle", Icon: Triangle },
    { kind: "circle", Icon: Circle },
    { kind: "diamond", Icon: Diamond },
  ];

  return (
    <div className="w-full">
      {/* toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E7E3D8] bg-[#FCFBF7] px-3 py-2 sm:px-4">
        <div className="flex items-center gap-1.5">
          {MARKER_COLORS.map((c) => (
            <button
              key={c.hex}
              onClick={() => setColor(c.hex)}
              aria-label={`Use ${c.name} marker`}
              className="h-6 w-6 rounded-full transition-transform hover:scale-110"
              style={{
                backgroundColor: c.hex,
                boxShadow:
                  color === c.hex
                    ? `0 0 0 2px #FCFBF7, 0 0 0 4px ${c.hex}`
                    : "none",
              }}
            />
          ))}
          <span className="mx-1.5 hidden h-5 w-px bg-[#E7E3D8] sm:block" />
          <button
            onClick={handleUndo}
            className="flex items-center gap-1 rounded-md px-2 py-1 font-mono text-[11px] text-[#5B5D6E] transition-colors hover:bg-[#F0EEE5] hover:text-[#15172B]"
          >
            <Undo2 className="h-3.5 w-3.5" /> Undo
          </button>
          <button
            onClick={handleClear}
            className="flex items-center gap-1 rounded-md px-2 py-1 font-mono text-[11px] text-[#5B5D6E] transition-colors hover:bg-[#F0EEE5] hover:text-[#15172B]"
          >
            <Eraser className="h-3.5 w-3.5" /> Clear
          </button>
        </div>
        <div className="flex items-center gap-1">
          {shapeButtons.map(({ kind, Icon }) => (
            <button
              key={kind}
              onClick={() => stamp(kind)}
              aria-label={`Stamp a ${kind}`}
              className="rounded-md p-1.5 text-[#5B5D6E] transition-colors hover:bg-[#F0EEE5] hover:text-[#15172B]"
            >
              <Icon className="h-4 w-4" strokeWidth={1.75} />
            </button>
          ))}
        </div>
      </div>

      {/* canvas */}
      <div
        ref={containerRef}
        className="relative h-70 w-full overflow-hidden bg-white sm:h-85"
        style={{
          backgroundImage: "radial-gradient(#EAE7DC 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      >
        <canvas
          ref={canvasRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          onPointerEnter={handlePointerEnter}
          className="absolute inset-0 h-full w-full cursor-crosshair touch-none"
        />
        {!hasInk && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
            <MousePointer2 className="h-5 w-5 text-[#B9B6A8]" strokeWidth={1.5} />
            <p
              className="text-lg text-[#B9B6A8]"
              style={{ fontFamily: "'Caveat', cursive" }}
            >
              move your cursor here — it draws itself
            </p>
          </div>
        )}
      </div>
    </div>
  );
}