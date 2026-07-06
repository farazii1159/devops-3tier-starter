# Three-Tier Application

Production-oriented starter for a **3-tier web application**:

| Tier | Technology | Location |
|------|------------|----------|
| **Presentation** | React + Vite + TypeScript | `client/` |
| **Application** | Node.js + Express + Zod | `server/` |
| **Data** | PostgreSQL 16 | Docker service `postgres` |

Infrastructure and delivery live at the repo root (`docker-compose.yml`, `.github/workflows/`).

---

## Architecture

```text
┌─────────────────┐     HTTP      ┌─────────────────┐     SQL       ┌─────────────────┐
│  React (Vite)   │ ────────────► │  Express API    │ ────────────► │   PostgreSQL    │
│  client :5173   │   /api/*      │  server :4000   │               │   postgres:5432 │
└─────────────────┘               └─────────────────┘               └─────────────────┘
```

### Request flow

1. The browser loads the React SPA from the **client** (Vite dev server or Nginx in Docker).
2. The client calls the **server** REST API (e.g. `GET /api/health`).
3. The server validates config with **Zod**, runs business logic in **modules**, and queries **PostgreSQL** via `pg`.

### Separation of concerns

| Path | Purpose |
|------|---------|
| `client/src/features/` | UI organized by feature (e.g. health dashboard) |
| `client/src/shared/` | Shared API clients and utilities |
| `server/src/modules/` | Domain modules (`routes`, `service`, future `repository`) |
| `server/src/config/` | Environment validation (Zod) |
| `server/src/db/` | Database pool and connectivity |
| `server/src/middleware/` | Cross-cutting HTTP concerns |
| `infra/docker/` | Shared Docker assets (Postgres init scripts) |
| `.github/workflows/` | CI/CD pipelines |

---

## Project structure

```text
three-tier-app/
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── features/       # Feature-based UI modules
│   │   ├── shared/         # Shared API helpers
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── Dockerfile
│   └── package.json
├── server/                 # Node.js backend (Express)
│   ├── src/
│   │   ├── config/         # Zod env validation
│   │   ├── db/             # PostgreSQL pool
│   │   ├── middleware/     # Error handling
│   │   ├── modules/        # Domain modules (health, users, …)
│   │   ├── utils/
│   │   ├── app.ts          # Express app factory
│   │   └── server.ts       # Entry point
│   ├── Dockerfile
│   └── package.json
├── infra/
│   └── docker/
│       └── postgres/
│           └── init/       # DB bootstrap SQL
├── .github/
│   └── workflows/
│       └── deploy.yml      # Lint, build, Docker publish
├── docker-compose.yml      # Local full stack
└── README.md
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [Docker](https://www.docker.com/) & Docker Compose
- (Optional) [Git](https://git-scm.com/)

---

## Quick start (Docker — full stack)

```bash
# From repo root
docker compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| API | http://localhost:4000 |
| Health check | http://localhost:4000/api/health |
| PostgreSQL | `localhost:5432` (user: `app`, db: `app_db`) |

---

## Local development (without Docker for apps)

### 1. Start PostgreSQL

```bash
docker compose up postgres -d
```

### 2. Backend

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

### 3. Frontend

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

The Vite dev server proxies `/api` to `http://localhost:4000`.

---

## Environment variables

### Server (`server/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Runtime mode | `development` |
| `PORT` | API port | `4000` |
| `DATABASE_URL` | Postgres connection string | `postgresql://app:app_secret@localhost:5432/app_db` |
| `CORS_ORIGIN` | Allowed frontend origin | `http://localhost:5173` |

### Client (`client/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend base URL | `http://localhost:4000` |

---

## CI/CD

The workflow in `.github/workflows/deploy.yml` runs on pushes and PRs to `main`:

1. **Lint & Build** — installs, lints, and builds both `client` and `server`.
2. **Docker Build** — on merge to `main`, builds and pushes images to GitHub Container Registry.
3. **Deploy** — placeholder step; connect this to ECS, Kubernetes, or your VM pipeline.

To enable registry pushes, ensure **Packages** write permission is allowed for GitHub Actions in your repo settings.

---

## Next steps (build incrementally)

1. Add a `users` module under `server/src/modules/users/` with CRUD routes.
2. Add Prisma or Knex migrations under `server/src/db/migrations/`.
3. Add authentication (JWT) in `server/src/middleware/auth.ts`.
4. Add React Router and feature pages under `client/src/features/`.
5. Replace the deploy placeholder with your cloud provider (Terraform in `infra/` is a natural next folder).

---

## License

MIT
