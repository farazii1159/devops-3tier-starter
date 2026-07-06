import cors from "cors";
import express from "express";
import type { Env } from "./config/env.js";
import {
  errorHandler,
  notFoundHandler,
} from "./middleware/errorHandler.js";
import { createHealthRouter } from "./modules/health/health.routes.js";

export function createApp(env: Env) {
  const app = express();

  app.use(
    cors({
      origin: env.CORS_ORIGIN,
    }),
  );
  app.use(express.json());

  app.get("/", (_req, res) => {
    res.json({ message: "Three-Tier API" });
  });

  app.use("/api/health", createHealthRouter(env));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}