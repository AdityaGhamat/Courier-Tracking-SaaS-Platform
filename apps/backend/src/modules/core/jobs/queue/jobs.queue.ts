import { Queue } from "bullmq";
import IORedis from "ioredis";

export const redisConnection = new IORedis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
  ...(process.env.REDIS_TLS === "true" && { tls: {} }),
});

export const notificationQueue = new Queue("notifications", {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 3000,
    },
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 500 },
  },
});
