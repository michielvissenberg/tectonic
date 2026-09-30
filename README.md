# Tectonic

Turborepo with a NestJS API, Next.js web app, PostgreSQL database, and typed SDK.

## Start the project

Prerequisites: Node.js 20+, pnpm 10+, and Docker.

From the repository root, run:

```sh
pnpm install
cp apps/api/.env.example apps/api/.env
pnpm db:setup
pnpm dev
```

`pnpm db:setup` starts the local PostgreSQL database, runs migrations, and generates the Prisma client.

Useful database commands:

```sh
pnpm db:up       # Start PostgreSQL
pnpm db:down     # Stop PostgreSQL and keep its data
pnpm db:status   # Show container status
pnpm db:logs     # Follow PostgreSQL logs
pnpm db:studio   # Open Prisma Studio
pnpm db:reset    # Stop PostgreSQL and delete its data
```

Open:

- Web app: http://localhost:3000
- API: http://localhost:3001
- Swagger UI: http://localhost:3001/docs

Stop the development servers with `Ctrl+C`.

The workspace contains:

- `apps/api`: NestJS API, Swagger, and Prisma schema
- `apps/web`: Next.js frontend
- `packages/sdk`: typed OpenAPI client
