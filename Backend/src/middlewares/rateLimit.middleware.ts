import { Request, Response, NextFunction } from "express";
import { redisConnection } from "../config/redis.config";
import { ApiError } from "../config/api.config";
import envConfig from "../utils/envConfig";

interface AuthenticatedRequest extends Request {
  userId: string;
  email: string;
}

const RATE_LIMIT = Number(envConfig.RATE_LIMIT) || 100;
const WINDOW_SIZE = Number(envConfig.WINDOW_SIZE) || 60 * 60;

export const rateLimit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as AuthenticatedRequest).userId;

    if (!userId) {
      res.status(401).json(new ApiError(401, "Unauthorized"));
      return;
    }

    const key = `rate_limit:${userId}`;

    const count = await redisConnection.incr(key);

    if (count === 1) {
      await redisConnection.expire(key, WINDOW_SIZE);
     }

    if (count > RATE_LIMIT) {
      res
        .status(429)
        .json(new ApiError(429, "Too many requests. Try again later"));
      return;
    }

    next();
  } catch (error) {
    console.error("Error in rate limiting middleware:", error);
    res.status(500).json(new ApiError(500, "Internal server error"));
  }
};
