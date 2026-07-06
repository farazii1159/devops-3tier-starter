import { HealthStatus } from "@/features/health/HealthStatus";
import "./App.css";

export default function App() {
  return (
    <main className="app">
      <header className="app__header">
        <h1>Three-Tier App</h1>
        <p>React (Vite) frontend connected to a Node.js API and PostgreSQL.</p>
      </header>
      <HealthStatus />
    </main>
  );
}
