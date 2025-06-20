import { AnyZodObject, ZodError } from "zod";
import { ApiError } from "../config/api.config";
import { Request, Response, NextFunction, RequestHandler } from "express";

export const validateRequest =
  (schema: AnyZodObject): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json(
          new ApiError(
            400,
            "Validation Error",
            error.errors.map((err) => err.message)
          )
        );
        return next();
      }
      res
        .status(500)
        .json(
          new ApiError(
            500,
            "Internal Server Error",
            [],
            error instanceof Error ? error.stack : undefined
          )
        );
      return next();
    }
  };
