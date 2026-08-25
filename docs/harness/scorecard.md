# Harness scorecard

Statuses describe evidence at source commit `11d35ca4`. `unknown` is preferred
to an unsupported pass. Review after material toolchain, CI, architecture,
license, or release changes, and at least quarterly.

| Dimension | Status | Evidence | Owner | Next review |
| --- | --- | --- | --- | --- |
| Repository legibility | good | `AGENTS.md`, architecture, task routes, development and project maps | fork maintainers | 2026-11-25 |
| Reproducible environment | partial | pnpm is pinned and CI uses Node 22; no repository-local Node version file | fork maintainers | when toolchain changes |
| Focused verification | partial | client/server test roots and build commands exist; CI omits server tests | client/server maintainers | when CI changes |
| Boundary enforcement | partial | enterprise paths and generated types are documented; no executable Guard | fork maintainers | before Guard rollout |
| Security controls | partial | validation/permission rules and security-sensitive routes exist; no Harness security scan gate | server maintainers | quarterly |
| Traceability | good | PR CI, fork tag convention, generated GitHub Release and GHCR artifacts | fork maintainers | each release change |
| Knowledge freshness | good | manifest records source commit and review date | change owner | each architecture change |

## Priority gaps

1. Add a repository-local Node version declaration so developers do not start
   pnpm 11 on Node 20.
2. Decide whether a stable focused server-test subset should become a CI gate.
3. Prototype enterprise-boundary and dependency-lockstep Guard rules in local
   report mode before considering blocking.
4. Resolve or formally characterize current upstream server-suite and client
   lint baseline failures.

Track decisions and ownership in `records.md`; do not silently promote a gap to
a passing score.
