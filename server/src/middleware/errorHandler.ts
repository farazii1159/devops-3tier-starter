import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { isAppError } from "../utils/errors.js";

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({ error: "Not Found" });
}

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (error instanceof ZodError) {
    res.status(400).json({
      error: "Validation failed",
      details: error.flatten(),
    });
    return;
  }

  if (isAppError(error)) {
    res.status(error.statusCode).json({ error: error.message });
    return;
  }

  console.error(error);
  res.status(500).json({ error: "Internal Server Error" });
}
