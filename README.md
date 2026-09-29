# Tectonic

Bare-bones Turborepo with a NestJS API, Next.js web app, Prisma database integration, and a typed SDK generated from the API's OpenAPI document.

## Prerequisites

- Node.js 20 or newer
- pnpm 10
- PostgreSQL, when using Prisma migrations or database access

Check the installed versions:

```sh
node --version
pnpm --version
```

The repository pins pnpm through `package.json`:

```json
"packageManager": "pnpm@10.15.0"
```

## First-time setup

Run these commands from the repository root:

```sh
pnpm install
cp apps/api/.env.example apps/api/.env
pnpm generate
pnpm typecheck
```

`pnpm install` installs dependencies for every workspace package and creates or updates `pnpm-lock.yaml`.

The API environment file contains the Prisma connection string and API port. Adjust `DATABASE_URL` in `apps/api/.env` if your PostgreSQL instance uses different credentials or a different database.

## Run the project

Start the API and web app together:

```sh
pnpm dev
```

Open the running services here:

- Web app: http://localhost:3000
- API: http://localhost:3001
- Swagger UI: http://localhost:3001/docs

The root `dev` command uses `concurrently` to run the two persistent development servers. The SDK is a library and does not run its own server.

Stop both development servers with `Ctrl+C`.

To run one service at a time:

```sh
pnpm --filter @tectonic/api dev
pnpm --filter @tectonic/web dev
```

## Generate Prisma and SDK types

Run both generators in sequence:

```sh
pnpm generate
```

This runs:

1. `prisma generate` for the API database client.
2. `openapi-typescript` for the typed SDK.

The SDK generator reads [apps/api/openapi.json](apps/api/openapi.json) and writes [packages/sdk/src/generated/api.ts](packages/sdk/src/generated/api.ts).

Run either generator separately when needed:

```sh
pnpm --filter @tectonic/api generate
pnpm --filter @tectonic/api prisma:generate
pnpm --filter @tectonic/sdk generate
```

After changing API routes or the OpenAPI contract, regenerate the SDK before typechecking or building.

## Local database

The repository includes [docker-compose.yml](docker-compose.yml) for a local PostgreSQL 16 database. It uses the same values as [apps/api/.env.example](apps/api/.env.example):

```text
host: localhost
port: 5432
database: tectonic
user: postgres
password: postgres
```

Copy the API environment file once, then run the complete database setup:

```sh
cp apps/api/.env.example apps/api/.env
pnpm db:setup
```

`db:setup` starts PostgreSQL, runs `prisma migrate dev`, and generates the Prisma client. The current schema has no models yet, so it will not create application tables until models are added.

Useful database commands:

```sh
pnpm db:up       # Start PostgreSQL in the background
pnpm db:down     # Stop PostgreSQL and keep its data
pnpm db:status   # Show container status
pnpm db:logs     # Follow PostgreSQL logs
pnpm db:studio   # Open Prisma Studio on its local URL
pnpm db:reset    # Stop PostgreSQL and delete all local database data
```

Run Prisma commands directly when needed:

```sh
pnpm --filter @tectonic/api prisma:migrate
pnpm --filter @tectonic/api prisma:generate
pnpm --filter @tectonic/api exec prisma studio
```

`prisma:migrate` runs `prisma migrate dev`, which creates and applies a development migration. `db:reset` is destructive: it removes the Docker volume and all local database data.

### Docker permission denied

If `pnpm db:setup` reports `permission denied while trying to connect to the Docker API`, add your Linux user to the Docker group:

```sh
sudo usermod -aG docker "$USER"
```

Then log out and back in, or refresh the current shell with:

```sh
newgrp docker
```

Verify access before retrying setup:

```sh
docker ps
pnpm db:setup
```

Do not make `/var/run/docker.sock` world-writable. Docker group membership grants broad host privileges and should only be given to trusted local users.

## Validate the workspace

Run the root checks:

```sh
pnpm typecheck
pnpm lint
pnpm build
```

The root typecheck runs the API, SDK, and web checks sequentially. This keeps the checks reliable in constrained environments.

Run checks for an individual package:

```sh
pnpm --filter @tectonic/api typecheck
pnpm --filter @tectonic/sdk typecheck
pnpm --filter @tectonic/web typecheck
```

## Build and start

Build all packages:

```sh
pnpm build
```

Start the built services separately:

```sh
pnpm --filter @tectonic/api start
pnpm --filter @tectonic/web start
```

The web app must be built before `next start` can run.

## pnpm build-script approval

If pnpm reports that dependency build scripts were ignored, approve the required packages interactively:

```sh
pnpm approve-builds
```

Select the packages pnpm identifies, then reinstall if requested:

```sh
pnpm install
```

This is separate from the project commands. The warning concerns pnpm's dependency-installation policy, not the API, web app, or SDK source code.

## Workspace layout

```text
apps/api       NestJS API, Swagger, and Prisma schema
apps/web       Next.js frontend
packages/sdk   Typed OpenAPI client
```
