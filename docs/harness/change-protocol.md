# Change protocol

## 1. Establish state

Before editing, identify the repository root, current branch, base branch,
worktree status, applicable instructions, submodule state, and touched license
boundary. Do not fetch, switch branches, initialize enterprise submodules, or
discard unrelated changes unless the task explicitly requires it.

## 2. Write an impact map

```md
- Goal:
- Behavior change:
- Touched paths:
- Dependencies and consumers:
- Risk domains:
- No-touch paths:
- Focused validation:
- Broad validation:
- Knowledge update:
```

If a boundary or external consumer is unknown, inspect it or stop for direction
before making a consequential assumption.

## 3. Classify the change

- **Behavior change:** test the observable success, failure, and permission
  paths. Add rendered evidence for user-facing behavior.
- **Behavior-preserving refactor:** prove existing tests cover the moved
  behavior and avoid unrelated cleanup.
- **Dependency change:** update `package.json` and `pnpm-lock.yaml` together;
  inspect release/runtime impact and patched dependencies.
- **Database change:** add and test a migration, verify rollback or recovery,
  then regenerate Kysely types. Do not rewrite shipped migrations.
- **Generated update:** change the source and run the owning generator; never
  edit generated output alone.
- **Docker, CI, or release change:** validate syntax, build the relevant
  artifact, preserve fork tag semantics, and document rollback.
- **Enterprise-boundary exception:** stop and obtain explicit license and scope
  approval. OSS work does not authorize edits in enterprise paths.

## 4. Work in touched scope

Keep the diff limited to the impact map. Preserve unrelated dirty files and do
not turn historical lint/test debt into task scope. Separate broad formatting,
dependency upgrades, migrations, generated updates, and functional changes
when they require different review or rollback.

Branch names must not start with `codex`. Follow the repository's observed
`fix/`, `feat/`, `chore/`, or task-specific naming pattern. Commit messages
should describe one coherent change; releases are cut only from merged `main`.

## 5. Verify and review

Use the path-to-check matrix in `testing-guide.md`. High-risk changes require a
review of denial, cross-workspace, retry/idempotency, partial-failure cleanup,
and external-contract behavior as applicable. Treat a failing broad baseline
separately from regressions introduced by the diff.

## 6. Deliver evidence

Report the behavior impact, touched files, exact commands and outcomes, manual
checks, skipped checks and substitutes, remaining risks, rollback/recovery,
and whether project knowledge changed. Use `templates.md`; do not mark the work
ready without observed evidence.
