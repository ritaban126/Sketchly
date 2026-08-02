import {Queue, Worker} from "bullmq";
import { redisClient } from "../config/redis";
import {db, notifications} from "@repo/db";


export const notificationQueue = new Queue("notification-queue", {
  connection: redisClient,
});

export function startNotificationWorker() {
  return new Worker(
    "notification-queue",
    async (job) => {
      const { userId, boardId, type, payload } = job.data as {
        userId: string;
        boardId: string | null;
        type: string;
        payload?: any;
      };

      await db.insert(notifications).values({
        userId,
        boardId,
        type: type as any,
        payload,
      });

      // Future: dispatch email/push notification here too
    },
    { connection: redisClient }
  );
}