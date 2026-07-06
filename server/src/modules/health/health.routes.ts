import { Router } from "express";
import type { Env } from "../../config/env.js";
import { getHealthStatus } from "./health.service.js";

export function createHealthRouter(env: Env): Router {
  const router = Router();

  router.get("/", async (_req, res, next) => {
    try {
      const health = await getHealthStatus(env);
      res.json(health);
    } catch (error) {
      next(error);
    }
  });

  return router;
}
