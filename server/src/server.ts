import "dotenv/config";
import { createApp } from "./app.js";
import { loadEnv } from "./config/env.js";
import { closePool } from "./db/index.js";

const env = loadEnv();
const app = createApp(env);

const server = app.listen(env.PORT, () => {
  console.log(`Server listening on http://localhost:${env.PORT}`);
});

async function shutdown(signal: string) {
  console.log(`Received ${signal}. Shutting down gracefully…`);
  server.close(async () => {
    await closePool();
    process.exit(0);
  });
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));
