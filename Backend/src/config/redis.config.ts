import Redis from "ioredis";
import envConfig from "../utils/envConfig";
import { RedisOptions } from "ioredis";

const redisOptions: RedisOptions = {
  maxRetriesPerRequest: null,
};

export const redisConnection = new Redis(envConfig.REDIS_URL, redisOptions);
