# Track B — B1: Community Edition local boot

Notes for a local spike of this fork (`kaibin330/ChatbotX`). Community Edition only. Do not commit `.env`, and do not add Meta, WhatsApp, or other channel credentials.

## How to start

Requirements from this repo: Node.js >= 24, pnpm `10.34.5` (`packageManager` in `package.json`), and Docker Compose.

The recommended path is infrastructure from `docker-compose.yml`, then the apps from source. `README.md` points at the upstream Quick Start and states that these compose files expect `pnpm dev`.

```bash
cp .env.example .env
docker compose up -d
pnpm install
pnpm --filter @chatbotx.io/database db:setup
pnpm dev
```

`docker compose up -d` (default file `docker-compose.yml`) starts local infrastructure only:

| Service | Host port |
| --- | --- |
| PostgreSQL (TimescaleDB image, pgvector) | 5432 |
| Redis | 6379 |
| RedisInsight | 5540 |
| RustFS (S3-compatible) API / console | 9000 / 9001 |
| MailHog SMTP / UI | 1025 / 8025 |
| Adminer | 8080 |

`pnpm dev` runs Turborepo `dev` for the apps that define it: builder (`http://localhost:3123`), worker, realtime (`http://localhost:1999`), and javascript-executor (`http://localhost:3210`). Root `.env` is loaded with `dotenv -e ../../.env`. Values in `.env.example` already match the Compose defaults for Postgres, Redis, RustFS, and MailHog.

`db:setup` is `db:migrate` then `db:seed`. Run it after Postgres is healthy (`docker compose ps`).

A heavier alternative is `docker compose -f docker-compose.dev.yml up --build`. That file includes `docker-compose.yml` and also builds builder, worker, realtime, and javascript-executor. It sets `env_file: ./.env`, so the copy step above is required or Compose exits. Builder in that file maps host `3123` to container `3000` and sets `RUN_DB_MIGRATE=true` and `RUN_DB_SEED=true`.

Self-hosting prebuilt images without a checkout of this monorepo is a different repository, `chatbotx-docker-compose`, as described in `README.md`. That path is outside this spike.

## Required env vars (names only)

Startup validation fails when these are missing or invalid. `.env.example` sets local placeholders for each of them.

- `BETTER_AUTH_SECRET` (at least 32 characters)
- `BETTER_AUTH_URL`
- `NEXT_PUBLIC_BUILDER_URL`
- `NEXT_PUBLIC_EDITION` (use `community`)
- `DATABASE_URL`
- `REDIS_URL`
- `ENCRYPTION_KEY` (64 hex characters)
- `S3_BUCKET`
- `S3_REGION`
- `SMTP_FROM`
- `REALTIME_BROADCAST_SECRET` (at least 32 characters)
- `JAVASCRIPT_EXECUTOR_URL`
- `JAVASCRIPT_EXECUTOR_TOKEN` (at least 32 characters)

Set these as well so local object storage matches RustFS. The schema allows them to be empty, and uploads then have no endpoint.

- `S3_ENDPOINT`
- `S3_ACCESS_KEY_ID`
- `S3_SECRET_ACCESS_KEY`

`SMTP_SERVER` has a MailHog default. `PLATFORM_ADMIN_EMAIL` is optional for process start and is required to open `/manage`. `LICENSE_KEY` is unused while the edition is `community`.

No channel token, app secret, or phone-number id is required to boot. Leave those unset.

## Health checks

- Builder: `GET http://localhost:3123/api/health` returns JSON `status: "healthy"`, `service: "builder"` (`apps/builder/src/app/api/health/route.ts`). Inside the `docker-compose.dev.yml` builder container the same route is `http://localhost:3000/api/health`.
- JavaScript executor: `GET http://localhost:3210/health` when that process is running from `pnpm dev`. The dev Compose file does not publish port `3210`.
- RustFS: `http://localhost:9000/health` and `http://localhost:9001/rustfs/console/health` (Compose healthcheck).
- Postgres and Redis: `docker compose ps` (Compose healthchecks). No HTTP health URL.

MailHog UI is `http://localhost:8025`. It catches SMTP from this stack so the spike does not send real mail.

## Known gaps

- `README.md` says both `docker-compose.yml` and `docker-compose.dev.yml` provision infrastructure only. That matches `docker-compose.yml`. `docker-compose.dev.yml` also builds and runs the apps.
- `.env.example` previously set `REALTIME_BROADCAST_SECRET=secretkey` (9 characters). `packages/partysocket-config/src/keys.ts` requires at least 32, and the builder env extends that schema, so a copied example could not boot. The example now uses a local placeholder of sufficient length. Replace it with `openssl rand -base64 32` before any shared environment.
- `/manage` stays closed until `PLATFORM_ADMIN_EMAIL` is set to a real local admin address. This note does not pick one.
- WhatsApp calling needs a public `TURN_URL`. It is commented out in `.env.example` and is out of scope.
- Inbound channel webhooks need a public URL. Localhost will not receive Meta callbacks. Do not invent credentials to paper over that.
- A full process boot was not run while writing this note: the authoring environment had Node 22 and no Docker. The steps above are taken from this repo's README, Compose files, package scripts, and env schemas.

## Enterprise license

`apps/builder/src/enterprise/`, `packages/business/src/enterprise/`, and `packages/database/src/schema/enterprise/` (plus `packages/database/src/relations/enterprise/`) ship under the ChatbotX Commercial License. See the `LICENSE` file in each of those trees, and `docs/licensing.md`. They are out of scope for this Community Edition spike. Keep `NEXT_PUBLIC_EDITION=community` and do not set `LICENSE_KEY`. Community startup returns before the license check (`packages/business/src/enterprise/license/startup.ts`).
