import { redis } from "../redis.client";

class CacheService {
  private defaultTTL = 300;

  async get<T>(key: string): Promise<T | null> {
    const data = await redis.get(key);
    if (!data) return null;
    return JSON.parse(data) as T;
  }

  async set(key: string, value: unknown, ttlSeconds = this.defaultTTL) {
    await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
  }

  async del(key: string) {
    await redis.del(key);
  }

  // Delete all keys matching a pattern e.g. "shipments:workspace-uuid:*"
  async delByPattern(pattern: string) {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) await redis.del(...keys);
  }
}

export const cacheService = new CacheService();
