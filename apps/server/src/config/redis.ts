import Redis from "ioredis";


if(!process.env.REDIS_URL) {
    throw new Error("REDIS_URL is not set in environment variables.");
}

// Single shared connection — reused by Socket.IO's Redis adapter and BullMQ
export const redisClient = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null, // required by BullMQ
});

redisClient.on("connect", () => console.log("Redis connected"));
redisClient.on("error", (err) => console.error("Redis error:", err));