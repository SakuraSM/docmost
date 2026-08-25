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
