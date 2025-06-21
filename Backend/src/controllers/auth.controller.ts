import { Request, Response } from "express";
import { User } from "../models/user.model";
import bcrypt from "bcryptjs";
import envConfig from "../utils/envConfig";
import { ApiResponse, ApiError } from "../config/api.config";
import { signToken } from "../utils/jwt.utils";
import { logger } from "../utils/reqLogger";
import { AuthenticatedRequest } from "../types/req.types";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.find({ email });

    if (existingUser.length > 0) {
      const error = new ApiError(400, "User already exists");
      res.status(error.statusCode).json(error);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const savedUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = signToken(
      { userId: savedUser._id, email: savedUser.email },
      envConfig.JWT_EXPIRATION
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: envConfig.NODE_ENV === "production",
      sameSite: "lax",
    });

    logger.info(`User registered: ${savedUser.email}`);

    const registerResponse = new ApiResponse(
      200,
      {
        userId: savedUser._id,
        email: savedUser.email,
        username: savedUser.username,
      },
      "User registered successfully"
    );

    res.status(registerResponse.statusCode).json(registerResponse);
    return;
  } catch (error: any) {
    logger.error(`Error registering user: ${error.message}`);
    const errorResponse = new ApiError(500, "Internal server error");
    res.status(errorResponse.statusCode).json(errorResponse);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      const error = new ApiError(404, "User not found");
      res.status(error.statusCode).json(error);
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      const error = new ApiError(401, "Invalid credentials");
      res.status(error.statusCode).json(error);
      return;
    }

    const token = signToken(
      { userId: user._id, email: user.email },
      envConfig.JWT_EXPIRATION
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: envConfig.NODE_ENV === "production",
      sameSite: "lax",
    });

    logger.info(`User logged in: ${user.email}`);

    const loginResponse = new ApiResponse(
      200,
      {
        userId: user._id,
        email: user.email,
        username: user.username,
      },
      "User logged in successfully"
    );

    res.status(loginResponse.statusCode).json(loginResponse);
    return;
  } catch (error: any) {
    logger.error(`Error logging in user: ${error.message}`);
    const errorResponse = new ApiError(500, "Internal server error");
    res.status(errorResponse.statusCode).json(errorResponse);
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: envConfig.NODE_ENV === "production",
      sameSite: "lax",
    });

    logger.info("User logged out");

    const logoutResponse = new ApiResponse(
      200,
      {},
      "User logged out successfully"
    );
    res.status(logoutResponse.statusCode).json(logoutResponse);
  } catch (error: any) {
    logger.error(`Error logging out user: ${error.message}`);
    const errorResponse = new ApiError(500, "Internal server error");
    res.status(errorResponse.statusCode).json(errorResponse);
  }
};

export const validateSession = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req as AuthenticatedRequest;

    if (!userId) {
      const error = new ApiError(400, "User ID is required");
      res.status(error.statusCode).json(error);
      return;
    }

    logger.info(`Validating session for user ID: ${userId}`);
    res.status(200).json({
      message: "Session is valid",
      userId,
    });
    return;
  } catch (error: any) {
    logger.error(`Error validating session: ${error.message}`);
    const errorResponse = new ApiError(500, "Internal server error");
    res.status(errorResponse.statusCode).json(errorResponse);
  }
};
