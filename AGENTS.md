# Repository guide

This file is the entry point for contributors and coding agents. Keep it short;
put durable detail in the linked documents.

## Repository map

- `apps/client`: React 19 and Vite web client.
- `apps/server`: NestJS and Fastify API, workers, and collaboration server.
- `packages/editor-ext`: shared editor extensions.
- `apps/server/src/database`: migrations, repositories, and generated Kysely types.
- `packages/base-formula`: database-formula parsing and evaluation.
- `docs`: fork-specific development documentation.
- `ARCHITECTURE.md`: system boundaries and major data flows.

## Essential commands

Use Node.js 22 or newer and the pnpm version pinned in `package.json`.

```bash
pnpm install
pnpm dev
pnpm --filter ./apps/server migration:latest
pnpm --filter ./apps/client test
pnpm --filter ./apps/server test
pnpm build
docker build -t docmost-local .
```

See [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) for setup and validation.

## Working rules

- Follow existing module boundaries and local conventions before adding new
  abstractions.
- Do not create branches whose names start with `codex`; prefer the repository's
  existing branch naming convention.
- Keep open-source changes outside `apps/client/src/ee`, `apps/server/src/ee`,
  and `packages/ee`. Those directories use the enterprise license.
- Do not hand-edit generated database types. Run the documented code generation
  command after an intentional schema change.
- Do not hand-edit build output, coverage output, or installed dependencies.
- Keep `pnpm-lock.yaml` in sync only when dependencies change.
- Preserve unrelated work in a dirty worktree.

## Validation entry points

- Client change: client tests, client build, and keyboard/theme/responsive checks.
- Server change: focused Jest tests and server build.
- Cross-cutting change: `pnpm build` and a Docker image build.
- Database change: migration up/down checks plus database type generation.
- Public API or storage change: verify authentication, workspace isolation,
  cleanup after failure, and local/S3/Azure behavior.
