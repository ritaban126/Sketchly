import {db, boardHistory, drawingObjects} from "@repo/db";
import {and, eq, isNull, desc} from "drizzle-orm";
import type { InferModel } from "drizzle-orm";

type DrawingObjectInsert = InferModel<typeof drawingObjects, "insert">;

// take a snapshot of the current board state
export async function takeSnapshot(boardId: string, userId?: string) {
  const [lastSnapshot] = await db
    .select()
    .from(boardHistory)
    .where(eq(boardHistory.boardId, boardId))
    .orderBy(desc(boardHistory.createdAt))
    .limit(1);

  if (lastSnapshot && Date.now() - new Date(lastSnapshot.createdAt).getTime() < 30000) {
    return lastSnapshot;
  }

  const currentObjects = await db
    .select({
      id: drawingObjects.id,
      boardId: drawingObjects.boardId,
      authorId: drawingObjects.authorId,
      type: drawingObjects.type,
      data: drawingObjects.data,
      zIndex: drawingObjects.zIndex,
      createdAt: drawingObjects.createdAt,
      updatedAt: drawingObjects.updatedAt,
      deletedAt: drawingObjects.deletedAt,
    })
    .from(drawingObjects)
    .where(and(eq(drawingObjects.boardId, boardId), isNull(drawingObjects.deletedAt)));

  const [snapshot] = await db
    .insert(boardHistory)
    .values({
      boardId,
      snapshot: currentObjects,
      createdBy: userId ?? null,
    })
    .returning();

  return snapshot;
}

// list board history in newest-first order
export async function listHistory(boardId: string) {
  return db
    .select({
      id: boardHistory.id,
      boardId: boardHistory.boardId,
      snapshot: boardHistory.snapshot,
      createdBy: boardHistory.createdBy,
      createdAt: boardHistory.createdAt,
    })
    .from(boardHistory)
    .where(eq(boardHistory.boardId, boardId))
    .orderBy(desc(boardHistory.createdAt));
}

// restore a previously saved snapshot
export async function restoreSnapshot(boardId: string, historyId: string, userId: string) {
  // Create a safety snapshot before overwriting current objects
  const safety = await takeSnapshot(boardId, userId);
  if (!safety?.id) throw new Error("Failed to create safety snapshot");

  const [target] = await db
    .select({ snapshot: boardHistory.snapshot })
    .from(boardHistory)
    .where(eq(boardHistory.id, historyId))
    .limit(1);

  if (!target) throw new Error("Snapshot not found");

  const restoredObjects = Array.isArray(target.snapshot)
    ? (target.snapshot as Array<Record<string, any>>)
    : [];

  // Soft-delete the current board objects so the restored state becomes the active one
  await db
    .update(drawingObjects)
    .set({ deletedAt: new Date(), updatedAt: new Date() })
    .where(eq(drawingObjects.boardId, boardId));

  if (restoredObjects.length > 0) {
    const restoredRows: DrawingObjectInsert[] = restoredObjects.map((object) => {
      const { id, createdAt, updatedAt, deletedAt, ...rest } = object;

      return {
        boardId,
        authorId: typeof rest.authorId === "string" && rest.authorId ? rest.authorId : userId,
        type: (typeof rest.type === "string" ? rest.type : "pen") as DrawingObjectInsert["type"],
        data: rest.data ?? {},
        zIndex: typeof rest.zIndex === "number" ? rest.zIndex : 0,
        deletedAt: null,
      };
    });

    await db.insert(drawingObjects).values(restoredRows);
  }

  if (!safety?.id) throw new Error("Failed to create safety snapshot");

  return {
    restoredFrom: historyId,
    safetySnapshotId: safety.id,
    restoredAt: new Date().toISOString(),
  };
}

