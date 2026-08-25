# Module contexts

Last reviewed at `11d35ca4` on 2026-08-25. “Owner” names a responsibility area,
not a specific person.

## Client

- Owner: client maintainers
- Owned paths: `apps/client/src` excluding `apps/client/src/ee`
- Entrypoints: `main.tsx`, `App.tsx`, feature pages and service/query modules
- Public contracts: HTTP response shapes, route parameters, Socket.IO events,
  editor document/schema behavior, localization keys
- Hidden dependencies: TanStack Query cache keys, Jotai persisted state,
  browser storage, collaboration provider, theme and responsive layout
- Validation: Vitest, typed client build, and rendered interaction evidence

Responsibility: render authenticated and public experiences, manage local/cache
state, call server contracts, and reflect realtime invalidation.

Non-responsibility: enforcing durable authorization, directly accessing
PostgreSQL/storage, or defining enterprise behavior.

## Server

- Owner: server maintainers
- Owned paths: `apps/server/src` excluding `apps/server/src/ee`
- Entrypoints: `main.ts`, `app.module.ts`, `core/*` modules and controllers
- Public contracts: `/api`, public share pages/files, WebSocket events, health,
  import/export formats, worker effects
- Hidden dependencies: workspace request context, global validation/interceptors,
  Redis availability, background jobs, storage driver, optional EE loading
- Validation: focused Jest specs, server build, and contract/integration evidence

Responsibility: authenticate and validate requests, enforce domain and workspace
permissions, coordinate transactions/storage/jobs/events, and expose contracts.

Non-responsibility: treating client checks as authorization or assuming a
single storage/Redis deployment mode.

## Database and jobs

- Owner: server/data maintainers
- Owned paths: `apps/server/src/database`, queue consumers and producers
- Entrypoints: migration runner, repositories, database module, queue module
- Public contracts: schema, constraints, indexes, job names/payloads/retry
  semantics, generated Kysely types
- Hidden dependencies: deployed migration history, table volume/locks, at-least-
  once job delivery, cross-process ordering, external indexing/storage effects
- Validation: disposable migration/recovery run, focused repository/service
  specs, regenerated types, server build, and retry/duplicate evidence

Responsibility: durable state and retry-safe deferred work.

Non-responsibility: rewriting released history or using job delivery as proof
that an external effect happened exactly once.

## Shared packages

- Owner: editor/formula maintainers
- Owned paths: `packages/editor-ext`, `packages/base-formula`
- Entrypoints: package `src/index.ts` or primary source directory
- Public contracts: exported TypeScript APIs, editor schema/serialization,
  formula syntax and evaluation
- Hidden dependencies: client/server consumers, persisted document content,
  import/export compatibility, performance on large documents/tables
- Validation: package build, consumer build, focused round-trip/examples, and
  benchmark when performance is affected

Responsibility: reusable editor and formula behavior without application-layer
ownership.

## Delivery infrastructure

- Owner: fork maintainers
- Owned paths: `Dockerfile`, `docker-compose.yml`, `.github/workflows`, root
  package/workspace metadata, and fork release documentation
- Public contracts: `ghcr.io/sakurasm/docmost`, `sakura-latest`,
  `<upstream-version>-sakura.<revision>`, amd64/arm64 archives, Compose variables
- Hidden dependencies: GitHub permissions, registry visibility, Buildx cache,
  base image/toolchain compatibility, upstream submodule exclusion
- Validation: frozen install, full build, Docker smoke test, workflow run,
  package page, Release page, and rollback tag/image plan

Responsibility: reproducible OSS builds and clearly forked releases.

Non-responsibility: publishing upstream-style version tags or silently pulling
enterprise code into public build artifacts.
