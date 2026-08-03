import { createCanvas, CanvasRenderingContext2D } from "canvas";


type Shape = {
  type: string;
  points?: { x: number; y: number }[];
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  centerX?: number;
  centerY?: number;
  radius?: number;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  color?: string;
  text?: string;
  fontSize?: number;
};

function drawShapeOnContext(ctx: any, shape: Shape) {
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (shape.type === "pen" && shape.points) {
    ctx.strokeStyle = shape.color || "#000000";
    ctx.lineWidth = 3;
    ctx.beginPath();
    shape.points.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
    ctx.stroke();
  } else if (shape.type === "rectangle" && shape.x !== undefined) {
    ctx.strokeStyle = shape.color || "#000000";
    ctx.lineWidth = 2;
    ctx.strokeRect(shape.x, shape.y!, shape.width!, shape.height!);
  } else if (shape.type === "circle" && shape.centerX !== undefined) {
    ctx.strokeStyle = shape.color || "#000000";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(shape.centerX, shape.centerY!, shape.radius!, 0, Math.PI * 2);
    ctx.stroke();
  } else if (shape.type === "line" && shape.x1 !== undefined) {
    ctx.strokeStyle = shape.color || "#000000";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(shape.x1, shape.y1!);
    ctx.lineTo(shape.x2!, shape.y2!);
    ctx.stroke();
  } else if (shape.type === "arrow" && shape.x1 !== undefined) {
    const { x1, y1, x2, y2, color } = shape as Required<Pick<Shape, "x1" | "y1" | "x2" | "y2">> & { color?: string };
    ctx.strokeStyle = color || "#000000";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    const headLength = 12;
    const angle = Math.atan2(y2 - y1, x2 - x1);
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - headLength * Math.cos(angle - Math.PI / 6), y2 - headLength * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - headLength * Math.cos(angle + Math.PI / 6), y2 - headLength * Math.sin(angle + Math.PI / 6));
    ctx.stroke();
  } else if (shape.type === "text" && shape.text) {
    ctx.fillStyle = shape.color || "#000000";
    ctx.font = `${shape.fontSize || 16}px sans-serif`;
    ctx.fillText(shape.text, shape.x!, shape.y!);
  }
}

export function renderBoardToPngBuffer(objects: { data: unknown }[], width = 1600, height = 1000): Buffer {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  objects.forEach((obj) => drawShapeOnContext(ctx, obj.data as Shape));

  return canvas.toBuffer("image/png");
}

export function getShapesForPdf(objects: { data: unknown }[]): Shape[] {
  return objects.map((o) => o.data as Shape);
}