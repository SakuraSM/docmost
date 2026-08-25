# Engineering Harness

This directory defines how people and coding agents plan, change, verify,
review, and hand off work in this fork. It supplements, rather than replaces,
`ARCHITECTURE.md` and `docs/DEVELOPMENT.md`.

## Status

- Tier: `standard`
- Source commit: `11d35ca49fbc8dd216adc2ffb5dc5b2778cbba68`
- Implemented: compact root instructions, machine-readable manifest, change and
  verification protocols, task routes, project knowledge, scorecard, and
  durable decision/follow-up records.
- Not implemented: executable Guard, pre-commit blocking, Harness CI gate, or a
  reviewed historical baseline.
- Rollout: documentation-only. Adding a blocking check requires fixtures,
  false-positive review, and explicit maintainer approval.

## Reading path

- Before editing: [change protocol](change-protocol.md)
- For invariants and boundaries: [quality rules](quality-rules.md)
- For verification: [testing guide](testing-guide.md)
- For Guard status: [Guard guide](guard-guide.md)
- For repeatable task routes: [task routes](task-routes.md)
- For delivery artifacts: [templates](templates.md)
- For Harness health: [scorecard](scorecard.md)
- For decisions and follow-ups: [records](records.md)
- For system facts: [project knowledge](../project-knowledge/README.md)

## Evidence vocabulary

- `observed`: confirmed by direct repository evidence or a successful command
  or CI run for the source tree.
- `declared`: defined by repository configuration or documentation but not
  executed for this Harness refresh.
- `inferred`: derived from structure and must be confirmed before it becomes a
  hard requirement.
- `unknown`: evidence is insufficient.

The current shell used for this refresh had Node 20 and could not start pnpm
11.15.1. Project-command evidence therefore comes from the successful CI and
release run for the source commit; only Harness structural checks are executed
locally during this refresh.

## Maintenance

Review the Harness when toolchain versions, CI, release tags, module entrypoints,
data flows, licenses, or validation commands change. Update the manifest and
the smallest affected document; avoid duplicating source code or transient task
notes here.
