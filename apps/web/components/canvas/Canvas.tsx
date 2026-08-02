// "use client";
// import { useEffect, useRef } from "react";
// import { drawShape, initDraw, type Shape } from "../../lib/draw/initDraw";
// import { useSocket } from "../../hooks/useSocket";
// import { useCanvasStore } from "../../stores/canvasStore";
// import { DrawingObjectType } from "@repo/websocket";

// export function Canvas({ boardId, collaborating }: { boardId: string; collaborating: boolean }) {
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   const selectedTool = useCanvasStore((s) => s.selectedTool);
//   const color = useCanvasStore((s) => s.color);
//   const brushSize = useCanvasStore((s) => s.brushSize);
//   const objects = useCanvasStore((s) => s.objects);
//   const addObject = useCanvasStore((s) => s.addObject);
//   const pushHistory = useCanvasStore((s) => s.pushHistory);

//   const { sendDrawingCreate } = useSocket(boardId, collaborating);

//   // Re-render every shape whenever the store changes
//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const ctx = canvas?.getContext("2d");
//     if (!canvas || !ctx) return;

//     ctx.fillStyle = "#000";
//     ctx.fillRect(0, 0, canvas.width, canvas.height);

//     Object.values(objects).forEach((obj) => {
//       // draw each persisted object using the same drawShape logic as initDraw
//       // (in practice, export drawShape from initDraw.ts and call it here)
//       drawShape(ctx, obj.data as Shape);
//     });
//   }, [objects]);

//   // Wire up mouse-driven drawing
//   // useEffect(() => {
//   //   if (!canvasRef.current) return;

//   //   const cleanup = initDraw(canvasRef.current, {
//   //     getTool: () => selectedTool,
//   //     getColor: () => color,
//   //     getBrushSize: () => brushSize,
//   //     onShapeFinalized: (shape: Shape) => {
//   //       const id = crypto.randomUUID();
//   //       const object = { id, boardId, authorId: "me", type: shape.type as any, data: shape, zIndex: 0 };

//   //       pushHistory();
//   //       addObject(object);

//   //       if (collaborating) sendDrawingCreate(object);
//   //     },
//   //   });

//   //   return cleanup;
//   // }, [selectedTool, color, brushSize, collaborating]);
//   useEffect(() => {
//   if (!canvasRef.current) return;

//   const cleanup = initDraw(canvasRef.current, {
//     getTool: () => selectedTool,
//     getColor: () => color,
//     getBrushSize: () => brushSize,
//     onShapeFinalized: (shape: Shape) => {
//     const id = crypto.randomUUID();

//   const normalizedType: DrawingObjectType =
//   shape.type === "rect"
//     ? "rectangle"
//     : shape.type === "eraser"
//       ? "pen"
//       : (shape.type as DrawingObjectType);

//       const object = {
//         id,
//         boardId,
//         authorId: "me",
//         type: normalizedType,
//         data: shape as Record<string, unknown>,
//         zIndex: 0,
//       };

//       pushHistory();
//       addObject(object);

//       if (collaborating) {
//         sendDrawingCreate({
//           boardId,
//           type: object.type,
//           data: object.data,
//           zIndex: object.zIndex,
//         });
//       }
//     },
//   });

//   return cleanup;
// }, [
//   selectedTool,
//   color,
//   brushSize,
//   collaborating,
//   boardId,
//   addObject,
//   pushHistory,
//   sendDrawingCreate,
// ]);


//   return <canvas ref={canvasRef} className="w-full h-full block" style={{ touchAction: "none" }} />;
// }



// "use client";
// import { useEffect, useRef, useCallback } from "react";
// import { useCanvasStore } from "@/stores/canvasStore";
// import { initDraw, drawShape, type Shape } from "@/lib/draw/initDraw";
// import { useSocket } from "@/hooks/useSocket";
// import type { DrawingObjectType } from "@repo/websocket";

// export function Canvas({ boardId, collaborating }: { boardId: string; collaborating: boolean }) {
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   const selectedTool = useCanvasStore((s) => s.selectedTool);
//   const color = useCanvasStore((s) => s.color);
//   const brushSize = useCanvasStore((s) => s.brushSize);
//   const objects = useCanvasStore((s) => s.objects);
//   const addObject = useCanvasStore((s) => s.addObject);
//   const pushHistory = useCanvasStore((s) => s.pushHistory);

//   const { sendDrawingCreate } = useSocket(boardId, collaborating);

//   const redraw = useCallback(() => {
//     const canvas = canvasRef.current;
//     const ctx = canvas?.getContext("2d");
//     if (!canvas || !ctx) return;

//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     ctx.fillStyle = "#ffffff";
//     ctx.fillRect(0, 0, canvas.width, canvas.height);

//     Object.values(objects).forEach((obj) => {
//       drawShape(ctx, obj.data as Shape);
//     });
//   }, [objects]);

//   // Size the canvas correctly FIRST, then redraw
//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const resize = () => {
//       const rect = canvas.getBoundingClientRect();
//       canvas.width = rect.width;
//       canvas.height = rect.height;
//       redraw();
//     };

//     resize();
//     window.addEventListener("resize", resize);
//     return () => window.removeEventListener("resize", resize);
//   }, [redraw]);

//   // Re-render whenever shapes change
//   useEffect(() => {
//     redraw();
//   }, [redraw]);

//   // Wire up mouse-driven drawing
//   useEffect(() => {
//     if (!canvasRef.current) return;

//     const cleanup = initDraw(canvasRef.current, {
//       getTool: () => selectedTool,
//       getColor: () => color,
//       getBrushSize: () => brushSize,
//       onShapeFinalized: (shape: Shape) => {
//         const id = crypto.randomUUID();
//         const normalizedType: DrawingObjectType =
//           shape.type === "rect"
//             ? "rectangle"
//             : shape.type === "eraser"
//               ? "pen"
//               : (shape.type as DrawingObjectType);

//         const object = {
//           id,
//           boardId,
//           authorId: "me",
//           type: normalizedType,
//           data: shape as Record<string, unknown>,
//           zIndex: 0,
//         };

//         pushHistory();
//         addObject(object);

//         if (collaborating) {
//           sendDrawingCreate({ boardId, type: object.type, data: object.data, zIndex: object.zIndex });
//         }
//       },
//     });

//     return cleanup;
//   }, [selectedTool, color, brushSize, collaborating, boardId, addObject, pushHistory, sendDrawingCreate]);

//   return (
//     <canvas
//       ref={canvasRef}
//       className="block h-full w-full"
//       style={{ touchAction: "none", backgroundColor: "#ffffff" }}
//     />
//   );
// }

"use client";
import { useEffect, useRef, useCallback } from "react";
import { useCanvasStore } from "@/stores/canvasStore";
import { initDraw, drawShape, type Shape } from "@/lib/draw/initDraw";
import { useSocket } from "@/hooks/useSocket";
import { saveDrawingObject } from "@/lib/api/boards";
import type { DrawingObjectType } from "@repo/websocket";

export function Canvas({ boardId, collaborating }: { boardId: string; collaborating: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const selectedTool = useCanvasStore((s) => s.selectedTool);
  const color = useCanvasStore((s) => s.color);
  const brushSize = useCanvasStore((s) => s.brushSize);
  const objects = useCanvasStore((s) => s.objects);
  const addObject = useCanvasStore((s) => s.addObject);
  const pushHistory = useCanvasStore((s) => s.pushHistory);

  const { sendDrawingCreate } = useSocket(boardId, collaborating);

  // Latest values ko refs mein rakho — initDraw ka effect inhe read karega bina re-run hue
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

  // Sizing — sirf mount pe aur window resize pe
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

  // Shapes change hone pe re-render
  useEffect(() => {
    redraw();
  }, [redraw]);

  // Mouse/pointer drawing wire up — SIRF EK BAAR mount pe chalega
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
          // Multiplayer mode — WebSocket ke through save + broadcast dono
          sendDrawingCreateRef.current({ boardId, type: object.type, data: object.data, zIndex: object.zIndex });
        } else {
          // Solo mode — seedha REST API se save karo (auto-save)
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