# Development map

Last reviewed at `11d35ca4` on 2026-08-25.

## Entrypoints

| Area | Path | Responsibility | Verification |
| --- | --- | --- | --- |
| Client bootstrap | `apps/client/src/main.tsx` | Browser providers, query client, theme, notifications, routing root | client tests and `pnpm client:build` |
| Client routes | `apps/client/src/App.tsx` | Public, authenticated, page, space, and settings route composition | route/feature tests and rendered navigation |
| HTTP server | `apps/server/src/main.ts` | Fastify/Nest bootstrap, multipart/cookies, workspace request guard, validation, WebSocket adapter | server specs and `pnpm server:build` |
| Server composition | `apps/server/src/app.module.ts` | Core domains, storage, queue, cache, import/export, security, and optional EE module loading | server build and module-focused specs |
| Collaboration server | `apps/server/src/collaboration/server/collab-main.ts` | Separate collaborative editing process, default port 3001 | collaboration specs/build and two-client evidence |
| Database | `apps/server/src/database` | Kysely connection, repositories, migrations, and generated types | migration workflow and server build |
| Editor extensions | `packages/editor-ext/src/index.ts` | Shared TipTap/ProseMirror extensions consumed by client/server | `pnpm editor-ext:build` plus consumer build |
| Formula engine | `packages/base-formula/src` | Database formula tokenization, parsing, and evaluation | package build and focused examples/benchmark |
| Container runtime | `Dockerfile`, `docker-compose.yml` | Production build and fork image deployment | Docker build and container smoke test |
| CI/release | `.github/workflows` | OSS checkout, client/build gates, multi-arch GHCR prereleases | workflow run and published artifacts |

## Dependency direction

- Workspace applications may depend on workspace packages; shared packages must
  not import application UI or server modules.
- Client features depend on client API/query services and shared editor code,
  not database repositories or storage drivers.
- Server controllers depend on domain services; services orchestrate permission,
  repositories, events, storage, and jobs; repositories own Kysely access.
- Redis-backed events/jobs coordinate processes, while PostgreSQL and storage
  remain the durable sources of truth.

## Boundaries

- Generated: `apps/server/src/database/types/db.d.ts`, build output, coverage,
  Nx cache, and installed dependencies.
- Enterprise: `apps/client/src/ee`, `apps/server/src/ee` submodule, and
  `packages/ee`; not part of OSS fork changes or CI checkout.
- Durable external contracts: database migrations, HTTP/public-share routes,
  Socket.IO/collaboration events, ZIP metadata, attachment storage keys, Docker
  image tags, and release assets.
- Patched dependencies: `pnpm-workspace.yaml` and `patches/` must be reviewed
  together with `package.json` and `pnpm-lock.yaml` changes.
