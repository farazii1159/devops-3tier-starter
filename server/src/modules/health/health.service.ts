import type { Env } from "../../config/env.js";
import { checkDatabaseConnection } from "../../db/index.js";

export type HealthResponse = {
  status: "ok";
  timestamp: string;
  database: "connected" | "disconnected";
};

export async function getHealthStatus(env: Env): Promise<HealthResponse> {
  let database: HealthResponse["database"] = "disconnected";

  try {
    const isConnected = await checkDatabaseConnection(env);
    database = isConnected ? "connected" : "disconnected";
  } catch {
    database = "disconnected";
  }

  return {
    status: "ok",
    timestamp: new Date().toISOString(),
    database,
  };
}
