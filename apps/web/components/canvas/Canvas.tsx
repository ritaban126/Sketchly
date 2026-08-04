"use client";
import { useEffect, useRef, useCallback } from "react";
import { useCanvasStore } from "@/stores/canvasStore";
import { initDraw, drawShape, type Shape } from "@/lib/draw/initDraw";
import { useSocket } from "@/hooks/useSocket";
import { saveDrawingObject } from "@/lib/api/boards";
import type { DrawingObjectType } from "@repo/websocket";

export function Canvas({
  boardId,
  collaborating,
  socket,
}: {
  boardId: string;
  collaborating: boolean;
  socket: ReturnType<typeof useSocket>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const selectedTool = useCanvasStore((s) => s.selectedTool);
  const color = useCanvasStore((s) => s.color);
  const brushSize = useCanvasStore((s) => s.brushSize);
  const objects = useCanvasStore((s) => s.objects);
  const addObject = useCanvasStore((s) => s.addObject);
  const pushHistory = useCanvasStore((s) => s.pushHistory);

  // const { sendDrawingCreate } = useSocket(boardId, collaborating);
  const { sendDrawingCreate } = socket;

  // Latest values refs mein hai — initDraw ka effect inhe read karega bina re-run hue
  const toolRef = useRef(selectedTool);
  const colorRef = useRef(color);
  const brushSizeRef = useRef(brushSize);
  const collaboratingRef = useRef(collaborating);
  const sendDrawingCreateRef = useRef(sendDrawingCreate);

  useEffect(() => { toolRef.current = selectedTool; }, [selectedTool]);
  useEffect(() => { colorRef.current = color; }, [color]);
  useEffect(() => { brushSizeRef.current = brushSize; }, [brushSize]);
  useEffect(() => { collaboratingRef.current = collaborating; }, [collaborating]);
  useEffect(() => { sendDrawingCreateRef.current = sendDrawingCreate; }, [sendDrawingCreate]);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    Object.values(objects).forEach((obj) => {
      drawShape(ctx, obj.data as Shape);
    });
  }, [objects]);


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      redraw();
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [redraw]);


  const setCanvasElement = useCanvasStore((s) => s.setCanvasElement);
  useEffect(() => {
    setCanvasElement(canvasRef.current);
    return () => setCanvasElement(null);
  }, [setCanvasElement]);

  // Shapes change hone pe re-render
  useEffect(() => {
    redraw();
  }, [redraw]);

  // Mouse/pointer drawing wire up — ek baar mount pe chalega
  useEffect(() => {
    if (!canvasRef.current) return;

    const cleanup = initDraw(canvasRef.current, {
      getTool: () => toolRef.current,
      getColor: () => colorRef.current,
      getBrushSize: () => brushSizeRef.current,
      onShapeFinalized: async (shape: Shape) => {
        const id = crypto.randomUUID();
        const normalizedType: DrawingObjectType =
          shape.type === "rect"
            ? "rectangle"
            : shape.type === "eraser"
              ? "pen"
              : (shape.type as DrawingObjectType);

        const object = {
          id,
          boardId,
          authorId: "me",
          type: normalizedType,
          data: shape as Record<string, unknown>,
          zIndex: 0,
        };

        pushHistory();
        addObject(object);

        if (collaboratingRef.current) {
          // Multiplayer mode — WebSocket ke through save + broadcast
          sendDrawingCreateRef.current({ boardId, type: object.type, data: object.data, zIndex: object.zIndex });
        } else {
          // Solo mode — direct REST API se save (auto-save)
          try {
            await saveDrawingObject(boardId, {
              type: object.type,
              data: object.data,
              zIndex: object.zIndex,
            });
          } catch (err) {
            console.error("Auto-save failed:", err);
          }
        }
      },
    });

    return cleanup;
  }, [boardId, addObject, pushHistory]); // stable deps — sirf ek baar chalega

  return (
    <canvas
      ref={canvasRef}
      className="block h-full w-full"
      style={{ touchAction: "none", backgroundColor: "#ffffff" }}
    />
  );
}