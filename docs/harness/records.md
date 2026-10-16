# Harness records

This file stores durable Harness decisions and follow-ups, not chat transcripts,
credentials, temporary debugging logs, or task-by-task noise.

## Decision log

| Date | Decision | Evidence | Consequence |
| --- | --- | --- | --- |
| 2026-08-25 | Use the Standard Harness tier without executable blocking | Nx multi-project repository, CI/release workflows, database/storage/realtime risk, and no existing Guard fixtures | Documentation and project knowledge are canonical; Guard remains planned |
| 2026-08-25 | Treat all three `ee` paths as no-touch for OSS fork work | `ARCHITECTURE.md`, `.gitmodules`, and tracked tree modes | Any exception requires explicit license and scope approval |
| 2026-08-25 | Keep server full-suite and client-lint failures as baseline observations, not exemptions | prior runs on the synchronized source tree | Reproduce and compare before assigning regression ownership |

## Iteration ledger

| Date | Change | Behavior impact | Verification | Knowledge update | Follow-up |
| --- | --- | --- | --- | --- | --- |
| 2026-08-25 | Added Standard repository Harness | documentation only | Harness validator, links, command declarations, and diff whitespace passed | initial project maps and flows added | review priority gaps |
| 2026-10-16 | Sync upstream through `6852e042` | upstream 0.96 features and fixes; adapted fork image icons to new public docs/subpage surfaces | client 442/442; focused server 97/97; four-project build passed; Docker blocked by Debian network 502; server full suite and lint limitations recorded below | architecture and pnpm 11.28.2 commands updated | migrations and browser verification require a disposable runtime |

## 2026-10-16 synchronization evidence

- Source range: `cd9c1669..6852e042`, 68 upstream commits.
- All three enterprise directory trees remain identical to pre-sync `main`.
  New OSS consumers retain server entitlement checks; enterprise consent and
  template additions that require new EE files are excluded.
- Fork image-icon upload, attachment/history cleanup, copy/import/export, CI,
  release tag conventions, and Compose image remain present.
- Node 22.23.1 with pnpm 11.28.2: frozen installation passed.
- Client: 31 suites, 442 tests passed.
- Focused server: page icon, public space, search, collaboration gateway, and
  client-IP specs passed (5 suites, 97 tests).
- Full build: all four Nx projects passed.
- Full server run: 53 suites passed, 15 failed; 889 tests passed, 14 failed.
  Failures involve test dependency injection and missing constructor mocks.
  The WorkspaceService constructor mismatch is unchanged from upstream
  `6852e042`; do not describe the entire suite as green.
- Client lint cannot load the installed TanStack Query ESLint plugin entrypoint.
- Docker build attempted twice; both failed at the upstream Debian apt step
  with HTTP 502. HTTPS access also failed. No successful image is claimed.
- Browser interaction and migration up/down checks were not run: this sync did
  not provision an isolated database/application environment.
- No PR, push, merge to main, release, or remote deployment is part of this
  local synchronization commit.

## Feedback loop

| Signal | Promotion path |
| --- | --- |
| Entrypoint or ownership is repeatedly rediscovered | update `docs/project-knowledge/` |
| The same deterministic review finding recurs | propose a Guard rule plus fixtures |
| A Guard candidate has false positives | keep it non-blocking and refine evidence/fixtures |
| A check is routinely skipped | repair the command, narrow it, or document the external prerequisite |
| A baseline failure changes | compare base/head and update `testing-guide.md` with fresh evidence |

## Follow-up board

| Status | Work | Risk | Owner | Evidence required |
| --- | --- | --- | --- | --- |
| proposed | add `.nvmrc`, `.node-version`, or equivalent Node declaration | low | fork maintainers | local and CI bootstrap on the declared version |
| proposed | add stable focused server tests to CI | medium | server maintainers | repeatable green subset and runtime impact |
| proposed | implement report-only enterprise/lockfile Guard | medium | fork maintainers | fixtures, false-positive review, documented output |
| open | revalidate server full-suite baseline | medium | server maintainers | base/head command output on Node 22 |
| open | repair or revalidate client lint baseline | medium | client maintainers | frozen install plus lint output on Node 22 |
