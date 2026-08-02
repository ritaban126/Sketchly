import {db, drawingObjects} from "../../../../../packages/db/src";
import {and, eq, isNull} from "drizzle-orm";


// for get board objects logic
export async function getBoardObjects(boardId: string) {
  return await db
    .select()
    .from(drawingObjects)
    .where(and(eq(drawingObjects.boardId, boardId), isNull(drawingObjects.deletedAt)));
}

// for create object logic
export async function createObject(boardId: string, authorId: string, object: any) {
  const [row] = await db.insert(drawingObjects).values({
    boardId, authorId, type: object.type, data: object.data, zIndex: object.zIndex ?? 0,
  }).returning();
  return row;
}

// update object logic
export async function updateObject(objectId: string, changes: any) {
  const [row] = await db.update(drawingObjects)
    .set({ data: changes, updatedAt: new Date() })
    .where(eq(drawingObjects.id, objectId)).returning();
  return row;
}

// delete object logic
export async function deleteObject(objectId: string) {
  await db.update(drawingObjects)
    .set({ deletedAt: new Date(), updatedAt: new Date() })
    .where(eq(drawingObjects.id, objectId));
}

// clear board logic
export async function clearBoard(boardId: string) {
  await db.update(drawingObjects)
    .set({ deletedAt: new Date(), updatedAt: new Date() })
    .where(eq(drawingObjects.boardId, boardId));
}