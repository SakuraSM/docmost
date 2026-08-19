# Development

This is the development reference for this fork. Upstream deployment and
configuration guidance remains available in the [Docmost documentation](https://docmost.com/docs/self-hosting/development).

## Prerequisites

- Node.js 22 or newer
- pnpm 11.15.1, as pinned by `packageManager`
- PostgreSQL 16 or newer
- Redis or Valkey 7 or newer
- Docker, when validating the production image

## Install

```bash
cp .env.example .env
pnpm install
```

Set a local `APP_SECRET` with at least 32 characters, then update
`DATABASE_URL` and `REDIS_URL` if the defaults do not match your services. Do
not commit `.env` or credentials.

## Database

Apply all migrations before starting the server:

```bash
pnpm --filter ./apps/server migration:latest
```

For an intentional schema change, create and test a migration, then regenerate
the Kysely types:

```bash
pnpm --filter ./apps/server migration:create
pnpm --filter ./apps/server migration:codegen
```

Review generated changes before committing them. Do not edit generated database
types by hand.

## Run locally

Start the web client and API together:

```bash
pnpm dev
```

Run them independently when debugging one side:

```bash
pnpm client:dev
pnpm server:dev
pnpm collab:dev
```

The default application URL is `http://localhost:3000`.

## Test and build

Run focused tests while iterating, followed by the relevant full project check:

```bash
pnpm --filter ./apps/client test
pnpm --filter ./apps/server test
pnpm client:build
pnpm server:build
pnpm build
```

If an upstream full-suite baseline is already failing, record the exact command
and failure separately; do not describe it as a regression caused by the
current change without confirming that relationship.

## Docker validation

Build the same root Dockerfile used by release automation:

```bash
docker build -t docmost-local .
docker run --rm docmost-local node --version
```

For a disposable full stack, first replace the placeholder secrets in
`docker-compose.yml`, then run `docker compose up --build`. Do not reuse those
example credentials in a shared or production environment.

## Before opening a change

- Run tests closest to the changed behavior.
- Build every affected project.
- For UI changes, check keyboard navigation, focus restoration, light and dark
  themes, and narrow layouts.
- For permissions or storage changes, test denial, cross-workspace isolation,
  and cleanup after partial failure.
- Run the root build and Docker build for release-affecting changes.
