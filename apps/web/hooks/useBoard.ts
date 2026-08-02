import { useEffect, useState } from "react";
import {getBoard, getBoardObjects } from "../lib/api/boards";
import { useCanvasStore } from "@/stores/canvasStore";
import { DrawingObject } from "@repo/websocket";


export function useBoard(boardId: string) {
  const [loading, setLoading] = useState(true);
  const [board, setBoard] = useState<{ id: string; title: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const addObject = useCanvasStore((s) => s.addObject);
  const clearObjects = useCanvasStore((s) => s.clearObjects);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      clearObjects();

      try {
        const [boardData, { objects }] = await Promise.all([
          getBoard(boardId),
          getBoardObjects(boardId),
        ]);

        if (cancelled) return;

        setBoard(boardData);
        objects.forEach((obj: DrawingObject) => addObject(obj));
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load board");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [boardId, addObject, clearObjects]);

  return { board, loading, error };
}
