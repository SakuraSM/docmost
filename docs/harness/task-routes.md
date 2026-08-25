# Task routes

Every route starts with `change-protocol.md`, uses `testing-guide.md`, and ends
with the delivery evidence in `templates.md`.

## Client and page UI

- **Use when:** changing routes, page tree, editor UI, queries, components, or
  client-side state.
- **Read first:** `docs/project-knowledge/contexts.md#client` and the nearest
  feature, query, service, and test files.
- **Focus:** API contract, query cache/invalidation, accessibility, error and
  loading states, responsive/theme behavior, and the client enterprise boundary.
- **Validation:** nearest Vitest test, client build, rendered/manual evidence;
  add full client tests for cross-feature changes.
- **Output:** screenshots or reproducible UI steps when behavior is visual.

## Server API or domain service

- **Use when:** changing controllers, DTOs, services, repositories, guards, or
  events.
- **Read first:** `docs/project-knowledge/contexts.md#server` and the matching
  module from controller through repository.
- **Focus:** validation, auth, workspace isolation, transactions, emitted
  events, failure cleanup, and backward compatibility.
- **Validation:** nearest Jest specs and server build; add client/contract
  evidence when the response changes.
- **Output:** success/denial/failure cases and data side effects.

## Database migration

- **Use when:** changing schema, indexes, constraints, or durable data.
- **Read first:** database scripts in `apps/server/package.json`, neighboring
  migrations, and `docs/project-knowledge/contexts.md#database-and-jobs`.
- **Focus:** shipped-history immutability, locks, backfill size, rollback or
  forward recovery, repository assumptions, and generated Kysely types.
- **Validation:** apply on a disposable database, verify data/schema, exercise
  recovery, regenerate types, and build affected server code.
- **Output:** migration/recovery plan and compatibility window.

## Attachment, import, or export

- **Use when:** changing multipart input, attachment metadata, storage drivers,
  signed files, ZIPs, cleanup, or indexing.
- **Read first:** `docs/project-knowledge/flows.md#attachment-lifecycle` and
  `#import-and-export`.
- **Focus:** type/signature/size checks, path safety, page/workspace permission,
  local/S3/Azure parity, partial failure, history references, retry/idempotency,
  and old-format compatibility.
- **Validation:** nearest server specs, round-trip/degradation cases, server
  build, and client evidence when presentation changes.
- **Output:** lifecycle diagram or ordered effects when more than one durable
  system changes.

## Collaboration or WebSocket

- **Use when:** changing Yjs collaboration, Socket.IO events, Redis adapters,
  or client invalidation.
- **Read first:** `ARCHITECTURE.md`, collaboration/server entrypoints, and
  `docs/project-knowledge/flows.md#page-editing-and-realtime-refresh`.
- **Focus:** durable source of truth, event ordering, reconnect, duplicate
  delivery, multiple clients, and cache invalidation.
- **Validation:** nearest specs, server/client builds, and two-client manual or
  integration evidence.
- **Output:** event/data order and stale-state risks.

## Dependency, Docker, CI, or release

- **Use when:** changing package metadata, lockfile, Dockerfile/Compose,
  workflows, registry naming, or release tags.
- **Read first:** `docs/DEVELOPMENT.md`, `pnpm-workspace.yaml`, Docker files, and
  workflow files.
- **Focus:** OSS checkout without submodules, Node/pnpm compatibility, patched
  dependencies, multi-architecture output, fork-only tag format, GHCR tags,
  credentials/permissions, and rollback.
- **Validation:** frozen install, full build, Docker build/smoke test, and
  workflow/release status as applicable.
- **Output:** artifact names, image tags/digests, release link, and rollback.

## Upstream synchronization

- **Use when:** fetching or merging `docmost/docmost` into the fork.
- **Read first:** license boundaries, upstream diff, fork-only commits, CI and
  release files, and any current dirty worktree.
- **Focus:** retain fork features and CI/release behavior, do not initialize or
  modify enterprise code, isolate conflicts, and distinguish upstream baseline
  failures from fork regressions.
- **Validation:** diff review, client tests, relevant server tests, full build,
  Docker build, PR checks, then merge only after successful evidence.
- **Output:** upstream range, conflicts/resolutions, retained fork behavior,
  baseline failures, PR, and release decision.
