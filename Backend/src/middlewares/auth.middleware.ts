import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.model";
import { verifyToken } from "../utils/jwt.utils";
import { ApiError } from "../config/api.config";
import { logger } from "../utils/reqLogger";

interface AuthenticatedRequest extends Request {
  userId?: string;
  email?: string;
}

export const isAuthenticated = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies.token;

    if (!token) {
      logger.error("No token provided");
      res
        .status(401)
        .json(new ApiError(401, "Unauthorized", ["No token provided"]));
      return;
    }

    const decoded = verifyToken(token) as {
      id: string;
      email: string;
    };

    const { id, email } = decoded;

    if (!id || !email) {
      logger.error("Invalid token payload", { id, email });
      res
        .status(401)
        .json(new ApiError(401, "Unauthorized", ["Invalid token payload"]));
      return;
    }

    const user = await User.findById(id);
    if (!user) {
      logger.error("User not found", { id });
      res
        .status(401)
        .json(new ApiError(401, "Unauthorized", ["User not found"]));
      return;
    }

    req.id = decoded.id;
    req.email = decoded.email;

    next();
  } catch (error) {
    res.status(401).json(new ApiError(401, "Unauthorized", ["Invalid token"]));
  }
};
