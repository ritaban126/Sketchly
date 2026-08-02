import { Tool } from "../../stores/canvasStore";

export type Point = { x: number; y: number };

export type Shape =
  | { type: "pen"; points: Point[]; color: string; width: number }
  | { type: "eraser"; points: Point[]; width: number }
  | { type: "rect"; x: number; y: number; width: number; height: number; color: string }
  | { type: "circle"; centerX: number; centerY: number; radius: number; color: string }
  | { type: "line"; x1: number; y1: number; x2: number; y2: number; color: string }
  | { type: "arrow"; x1: number; y1: number; x2: number; y2: number; color: string }
  | { type: "text"; x: number; y: number; text: string; color: string; fontSize: number };

type InitDrawOptions = {
  getTool: () => Tool;
  getColor: () => string;
  getBrushSize: () => number;
  onShapeFinalized: (shape: Shape) => void; // pushes to store, and emits via socket if connected
};

// Standalone, reusable — used both for live drawing here AND by Canvas.tsx
// to re-render persisted/remote shapes from the store.
export function drawShape(ctx: CanvasRenderingContext2D, shape: Shape) {
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (shape.type === "pen") {
    ctx.strokeStyle = shape.color;
    ctx.lineWidth = shape.width;
    ctx.beginPath();
    shape.points.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
    ctx.stroke();
  } else if (shape.type === "eraser") {
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = shape.width;
    ctx.beginPath();
    shape.points.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
    ctx.stroke();
    ctx.restore();
  } else if (shape.type === "rect") {
    ctx.strokeStyle = shape.color;
    ctx.lineWidth = 2;
    ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
  } else if (shape.type === "circle") {
    ctx.strokeStyle = shape.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2);
    ctx.stroke();
  } else if (shape.type === "line") {
    ctx.strokeStyle = shape.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(shape.x1, shape.y1);
    ctx.lineTo(shape.x2, shape.y2);
    ctx.stroke();
  } else if (shape.type === "arrow") {
    drawArrow(ctx, shape.x1, shape.y1, shape.x2, shape.y2, shape.color);
  } else if (shape.type === "text") {
    ctx.fillStyle = shape.color;
    ctx.font = `${shape.fontSize}px sans-serif`;
    ctx.fillText(shape.text, shape.x, shape.y);
  }
}

export function initDraw(canvas: HTMLCanvasElement, options: InitDrawOptions) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  let isDrawing = false;
  let startPoint: Point = { x: 0, y: 0 };
  let currentPoints: Point[] = [];

  // ❌ resize() function aur uske calls yahan se hata do — Canvas.tsx already handle karta hai

  const getPos = (e: PointerEvent): Point => {
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const finalizeActiveTool = (point: Point) => {
    const tool = options.getTool();
    const color = options.getColor();

    let shape: Shape | null = null;

    if (tool === "pen") {
      shape = { type: "pen", points: currentPoints, color, width: options.getBrushSize() };
    } else if (tool === "eraser") {
      shape = { type: "eraser", points: currentPoints, width: options.getBrushSize() * 3 };
    } else if (tool === "rect") {
      shape = {
        type: "rect",
        x: Math.min(startPoint.x, point.x),
        y: Math.min(startPoint.y, point.y),
        width: Math.abs(point.x - startPoint.x),
        height: Math.abs(point.y - startPoint.y),
        color,
      };
    } else if (tool === "circle") {
      const radius = Math.hypot(point.x - startPoint.x, point.y - startPoint.y) / 2;
      shape = {
        type: "circle",
        centerX: (startPoint.x + point.x) / 2,
        centerY: (startPoint.y + point.y) / 2,
        radius,
        color,
      };
    } else if (tool === "line") {
      shape = { type: "line", x1: startPoint.x, y1: startPoint.y, x2: point.x, y2: point.y, color };
    } else if (tool === "arrow") {
      shape = { type: "arrow", x1: startPoint.x, y1: startPoint.y, x2: point.x, y2: point.y, color };
    }

    if (shape) options.onShapeFinalized(shape);
    currentPoints = [];
  };

  const onPointerDown = (e: PointerEvent) => {
    const tool = options.getTool();
    if (tool === "select") return;

    isDrawing = true;
    startPoint = getPos(e);
    currentPoints = [startPoint];
    canvas.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!isDrawing) return;

    const tool = options.getTool();
    const point = getPos(e);

    if (tool === "pen" || tool === "eraser") {
      currentPoints.push(point);
      const shape: Shape =
        tool === "pen"
          ? { type: "pen", points: currentPoints, color: options.getColor(), width: options.getBrushSize() }
          : { type: "eraser", points: currentPoints, width: options.getBrushSize() * 3 };
      drawShape(ctx, shape);
    }
  };

  const onPointerUp = (e: PointerEvent) => {
    if (!isDrawing) return;
    const tool = options.getTool();
    if (tool === "select") {
      isDrawing = false;
      currentPoints = [];
      return;
    }

    isDrawing = false;
    finalizeActiveTool(getPos(e));

    if (canvas.hasPointerCapture(e.pointerId)) {
      canvas.releasePointerCapture(e.pointerId);
    }
  };

  const onPointerLeave = () => {
    if (!isDrawing) return;
    isDrawing = false;
    currentPoints = [];
  };

  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointercancel", onPointerLeave);
  canvas.addEventListener("pointerleave", onPointerLeave);

  return () => {
    canvas.removeEventListener("pointerdown", onPointerDown);
    canvas.removeEventListener("pointermove", onPointerMove);
    canvas.removeEventListener("pointerup", onPointerUp);
    canvas.removeEventListener("pointercancel", onPointerLeave);
    canvas.removeEventListener("pointerleave", onPointerLeave);
  };
}

function drawArrow(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string) {
  const headLength = 12;
  const angle = Math.atan2(y2 - y1, x2 - x1);

  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - headLength * Math.cos(angle - Math.PI / 6), y2 - headLength * Math.sin(angle - Math.PI / 6));
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - headLength * Math.cos(angle + Math.PI / 6), y2 - headLength * Math.sin(angle + Math.PI / 6));
  ctx.stroke();
}