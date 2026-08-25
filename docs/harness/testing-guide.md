# Testing guide

Commands are run from the repository root unless stated otherwise. `observed`
means the command or equivalent CI job succeeded for the Harness source tree;
`declared` means the command exists but was not run during this refresh.

## Stable gates

| Purpose | Command | Evidence |
| --- | --- | --- |
| Lockfile-safe install | `pnpm install --frozen-lockfile` | observed in CI |
| Client tests | `pnpm --filter ./apps/client test` | observed in CI |
| Server tests | `pnpm --filter ./apps/server test` | declared; not a CI gate |
| Client typed build | `pnpm client:build` | observed through root build |
| Server typed build | `pnpm server:build` | observed through root build |
| Monorepo build | `pnpm build` | observed in CI |
| Docker image | `docker build -t docmost-local .` | observed locally and in CI |

There is no standalone root typecheck. Client `build` runs `tsc && vite build`;
server `build` runs the Nest compiler. Client lint is declared as
`pnpm --filter ./apps/client lint`. Server lint uses `--fix`, so it mutates files
and must not be used as a read-only verification step without explicit intent.

## Change-to-check map

| Changed area | Focused check | Additional evidence |
| --- | --- | --- |
| Client utility/component | `pnpm --filter ./apps/client test -- src/features/page/page-icon.utils.test.ts` with the nearest real test path | render, keyboard/focus, loading/error state, light/dark, narrow layout |
| Server service/controller | `pnpm --filter ./apps/server test -- page-icon.utils.spec.ts --runInBand` with the nearest real spec name | success, invalid input, unauthenticated, forbidden, cross-workspace, cleanup |
| Editor extension | `pnpm editor-ext:build` | consumer client build and editor round-trip |
| Formula package | `pnpm nx run @docmost/base-formula:build` | parser/evaluator examples or benchmark when performance changes |
| Database migration | migration up, down/recovery, and latest on a disposable database; then `pnpm --filter ./apps/server migration:codegen` | schema diff, data preservation, regenerated types |
| Storage/attachments | nearest server specs plus server build | local/S3/Azure contract, private/public reads, retry and orphan cleanup |
| Collaboration/WebSocket | nearest server specs plus server/client builds | two-client invalidation and reconnect behavior |
| Import/export | nearest server specs plus server build | round-trip, old format, damaged resource degradation, path safety |
| Docker/CI/release | `pnpm build` and `docker build -t docmost-local .` | workflow syntax, image labels/tags, container smoke test |
| Documentation/Harness only | Harness validator and Markdown-link check | no project runtime check unless commands/contracts changed |

The focused examples demonstrate argument placement. Replace the example test
path or spec name with an existing test closest to the changed behavior; do not
invent a passing test target.

## Broad final gate

Run focused checks while iterating. Before delivery, run every affected project
build and its full stable tests. Use `pnpm build` for cross-cutting changes and
the Docker build for deployment/release changes. Do not use a broad formatter
or fixer as verification in a dirty worktree.

## Known baseline policy

The server full suite has had upstream Nest dependency-injection and
transactional-email test-module failures. Re-run and record exact failures when
server behavior changes; compare with the base branch before calling them a
regression. Client lint has also been blocked by an installed
`@tanstack/eslint-plugin-query` package missing its modern entrypoint. These are
historical observations, not permanent exemptions.

## Evidence and skips

Record the exact command, commit/tree, exit status, relevant counts, and output
location. For every skipped or blocked check, state the reason, confidence
impact, and closest safe substitute. End-to-end behavior requires end-to-end
evidence; unit tests or an HTTP response alone do not prove rendered UI.
