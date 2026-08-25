# Docmost fork agent guide

This file is the repository entry map for humans and coding agents. Detailed
operating rules live under `docs/harness/`; stable system facts live under
`docs/project-knowledge/` and `ARCHITECTURE.md`.

## Project facts

- This is the `SakuraSM/docmost` open-source fork, based on upstream Docmost.
- The repository is an Nx monorepo using pnpm workspaces and TypeScript.
- `apps/client` is a React 19/Vite client; `apps/server` is a NestJS/Fastify API,
  worker host, and collaboration service.
- PostgreSQL stores durable data. Redis or Valkey backs caches, queues, and
  cross-process WebSocket coordination.
- The base branch is `main`; `origin` is the fork and `upstream` is Docmost.

## Toolchain and commands

Use Node.js 22.13 or newer and pnpm `11.15.1`, as documented in
`docs/DEVELOPMENT.md` and pinned in `package.json`. Prefer the lockfile-safe
bootstrap used by CI.

```bash
pnpm install --frozen-lockfile
pnpm dev
pnpm --filter ./apps/server migration:latest
pnpm --filter ./apps/client test
pnpm --filter ./apps/server test
pnpm client:build
pnpm server:build
pnpm build
docker build -t docmost-local .
```

There is no standalone root typecheck; the client and server build commands are
the typed compilation gates. See `docs/harness/testing-guide.md` for focused
commands, evidence status, and known baseline limitations.

## Read first

- Any change: `docs/harness/change-protocol.md`
- Repository navigation: `docs/project-knowledge/dev-map.md`
- Module responsibilities: `docs/project-knowledge/contexts.md`
- Stable flows and risks: `docs/project-knowledge/flows.md`
- Verification: `docs/harness/testing-guide.md`
- Task-specific route: `docs/harness/task-routes.md`
- Architecture detail: `ARCHITECTURE.md`
- Local setup and releases: `docs/DEVELOPMENT.md`

## Hard boundaries

- Do not modify `apps/client/src/ee`, `apps/server/src/ee`, or `packages/ee` for
  open-source fork work. They are enterprise-licensed; the server path is also
  a Git submodule intentionally omitted by OSS CI.
- Do not hand-edit `apps/server/src/database/types/db.d.ts`; regenerate it only
  after an intentional schema change.
- Treat migrations as durable public data history. Add a new migration instead
  of rewriting one that may have shipped.
- Do not edit `dist`, `coverage`, `.nx`, or `node_modules` outputs.
- Keep `pnpm-lock.yaml` aligned with intentional dependency changes only.
- Preserve unrelated dirty-worktree files, including untracked local notes.
- Do not create branches whose names start with `codex`; follow existing
  `fix/`, `feat/`, `chore/`, or task-specific conventions.

## High-risk changes

Raise review and evidence for authentication, authorization, workspace
isolation, public shares, storage cleanup, imports/exports, migrations,
collaboration state, WebSocket events, Docker/CI, and release tags. Verify both
success and denial/failure paths; never infer enterprise behavior from OSS
tests.

## Completion contract

- Write an impact map before editing and keep the diff within it.
- Separate behavior changes, refactors, generated updates, migrations,
  dependency changes, and release changes.
- Run focused checks for touched paths, then the broad stable gate appropriate
  to the risk.
- Record every skipped or failing check with reason, substitute, and confidence
  impact. Do not attribute known baseline debt to the current change without
  evidence.
- For UI behavior, inspect the rendered path, keyboard/focus behavior, error
  state, light/dark themes, and narrow layouts when relevant.
- Update project knowledge when entrypoints, responsibilities, contracts, data
  flows, or verification strategy change.
- Report changed files, behavior impact, verification results, remaining risks,
  and rollback or recovery. Do not claim success without observed evidence.

The machine-readable Harness inventory is `.harness/manifest.json`; the Harness
status and rollout policy are in `docs/harness/README.md`.
