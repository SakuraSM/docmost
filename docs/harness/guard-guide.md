# Guard guide

## Rollout status

- Local report mode: not implemented
- Pre-commit blocking: not implemented
- CI blocking: not implemented
- Historical baseline: not created

There is currently no Harness Guard command. Do not claim that boundaries or
quality rules are mechanically enforced; use review and the existing build/test
CI until a tested implementation is approved.

## Candidate first rules

If a Guard is added, start in report-only mode with deterministic diff checks:

- `enterprise-no-touch`: changes under all three enterprise paths, including
  the server submodule root and descendants.
- `generated-db-types`: direct database type edits without a schema/migration
  change and code-generation evidence.
- `dependency-lockstep`: dependency metadata changes without `pnpm-lock.yaml`,
  or lockfile-only churn without an explained source.
- `release-tag-format`: fork release versions must match
  `v<upstream-version>-sakura.<revision>`.
- `credential-addition`: redact and report credential-like additions without
  printing the candidate value.

## Required design before activation

Support worktree, staged, uncommitted, changed, and full modes. Collect Git paths
with NUL delimiters and cover renames, Unicode, deletions, and submodule Gitlinks.
Each finding must include rule ID, P0/P1/P2 severity, repository-relative path,
line when available, redacted evidence, remediation, and historical status.

Fixtures must cover clean and failing diffs, P0/P1, baseline fingerprint drift,
staged/unstaged combinations, rename/Unicode, generated files, enterprise root
and descendant paths, dependency/lockfile mismatch, redacted secrets, and parser
failure. Only then may maintainers approve P0 blocking in CI or a hook.
