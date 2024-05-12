import { env } from "@/env/env";
import { Redis } from "@upstash/redis";

function createRedis() {
  let redis: Redis | null = null;
  if (!env.server.UPSTASH_REDIS_URL || !env.server.UPSTASH_REDIS_PASSWORD) {
    return redis;
  }
  return (redis = new Redis({
    url: env.server.UPSTASH_REDIS_URL,
    token: env.server.UPSTASH_REDIS_PASSWORD,
  }));
}

export const redis = createRedis();
