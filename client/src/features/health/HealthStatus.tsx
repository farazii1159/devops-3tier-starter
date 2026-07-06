import { useEffect, useState } from "react";
import { fetchHealth } from "@/shared/api/health";

type HealthState =
  | { status: "loading" }
  | { status: "success"; data: Awaited<ReturnType<typeof fetchHealth>> }
  | { status: "error"; message: string };

export function HealthStatus() {
  const [health, setHealth] = useState<HealthState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    fetchHealth()
      .then((data) => {
        if (!cancelled) {
          setHealth({ status: "success", data });
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          const message =
            error instanceof Error ? error.message : "Unknown error";
          setHealth({ status: "error", message });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (health.status === "loading") {
    return (
      <section className="status-card status-card--loading">
        <h2>API Health</h2>
        <p>Checking backend and database connectivity…</p>
      </section>
    );
  }

  if (health.status === "error") {
    return (
      <section className="status-card status-card--error">
        <h2>API Health</h2>
        <p>{health.message}</p>
      </section>
    );
  }

  return (
    <section className="status-card">
      <h2>API Health</h2>
      <dl>
        <dt>Status</dt>
        <dd>{health.data.status}</dd>
        <dt>Database</dt>
        <dd>{health.data.database}</dd>
        <dt>Timestamp</dt>
        <dd>{new Date(health.data.timestamp).toLocaleString()}</dd>
      </dl>
    </section>
  );
}
