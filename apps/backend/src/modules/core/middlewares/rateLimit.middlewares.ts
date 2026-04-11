import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { redis } from "../redis/redis.client";

const createRedisStore = (prefix: string) =>
  new RedisStore({
    // @ts-expect-error
    sendCommand: async (...args: string[]) => redis.call(...args),
    prefix: prefix,
  });

export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "Too many attempts, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: createRedisStore("rate:auth:"),
});

export const apiRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many requests, please slow down",
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: createRedisStore("rate:api:"),
});

export const uploadRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: "Upload limit reached, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: createRedisStore("rate:upload:"),
});
