import pg from "pg";
import type { Env } from "../config/env.js";

const { Pool } = pg;

let pool: pg.Pool | null = null;

export function getPool(env: Env): pg.Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: env.DATABASE_URL,
    });
  }

  return pool;
}

export async function checkDatabaseConnection(env: Env): Promise<boolean> {
  const client = await getPool(env).connect();

  try {
    await client.query("SELECT 1");
    return true;
  } finally {
    client.release();
  }
}

export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
