import { Router, Request, Response, NextFunction } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware";
import { logger } from "../utils/reqLogger";
import {
  register,
  login,
  logout,
  validateSession,
} from "../controllers/auth.controller";
import { registerSchema, loginSchema } from "../schema/auth.schema";
import { validateRequest } from "../middlewares/validateReq.middleware";

const router = Router();

router.post(
  "/register",
  (req: Request, res: Response, next: NextFunction) => {
    logger.info("Register request received", {
      method: req.method,
      url: req.originalUrl,
      body: req.body,
    });
    next();
  },
  validateRequest(registerSchema),
  register
);

router.post(
  "/login",
  (req: Request, res: Response, next: NextFunction) => {
    logger.info("Login request received", {
      method: req.method,
      url: req.originalUrl,
      body: req.body,
    });
    next();
  },
  validateRequest(loginSchema),
  login
);

router.post(
  "/logout",
  isAuthenticated,
  (req: Request, res: Response, next: NextFunction) => {
    logger.info("Logout request received", {
      method: req.method,
      url: req.originalUrl,
    });
    next();
  },
  logout
);

router.get(
  "/validate-session",
  isAuthenticated,
  (req: Request, res: Response, next: NextFunction) => {
    logger.info("Validate session request received", {
      method: req.method,
      url: req.originalUrl,
    });
    next();
  },
  validateSession
);

export default router;
