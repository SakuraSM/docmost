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

## Publish a fork release

Use `v<upstream-version>-sakura.<revision>` for every fork release. For
example, the first fork release based on upstream `v0.95.0` is
`v0.95.0-sakura.1`.

Publish from a commit already merged into `main`:

```bash
git checkout main
git pull --ff-only origin main
git tag v0.95.0-sakura.1
git push origin v0.95.0-sakura.1
```

You can also start the workflow without creating the tag first:

```bash
gh workflow run release.yml -f version=v0.95.0-sakura.1
```

The Release workflow publishes these outputs:

- `ghcr.io/sakurasm/docmost:0.95.0-sakura.1`
- `ghcr.io/sakurasm/docmost:sakura-latest`
- AMD64 and ARM64 Docker archives attached to a GitHub prerelease

The workflow rejects upstream-style tags such as `v0.95.0`. Increment the
fork revision for another release from the same upstream version.

## Before opening a change

- Run tests closest to the changed behavior.
- Build every affected project.
- For UI changes, check keyboard navigation, focus restoration, light and dark
  themes, and narrow layouts.
- For permissions or storage changes, test denial, cross-workspace isolation,
  and cleanup after partial failure.
- Run the root build and Docker build for release-affecting changes.
