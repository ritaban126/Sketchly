import {db, notifications} from "@repo/db";
import {eq, desc} from "drizzle-orm";


export async function createNotification(userId: string, boardId: string | null, type: string, payload?: any) {
  const [row] = await db.insert(notifications).values({
    userId, boardId, type: type as any, payload,
  }).returning();
  return row;
}


// export async function getNotifications(userId: string) {
//   return db.query.notifications.findMany({
//     where: eq(notifications.userId, userId),
//     orderBy: desc(notifications.createdAt),
//   });
// }
export async function getNotifications(userId: string) {
  return await db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt));
}

export async function markAsRead(notificationId: string) {
  await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, notificationId));
}