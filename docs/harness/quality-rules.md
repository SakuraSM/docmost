# Quality rules

## Architecture invariants

- Client code calls server contracts through the existing API/query service
  layer; do not embed database or storage assumptions in UI components.
- Nest controllers own transport parsing and authentication context, services
  own domain behavior and permission orchestration, and repositories isolate
  Kysely queries.
- Workspace-scoped reads and writes must preserve tenant isolation and use the
  existing permission validators; possession of an ID is never authorization.
- Durable metadata is committed in PostgreSQL before clients are told a change
  succeeded. WebSocket events invalidate or refresh client state; they are not
  the durable source of truth.
- Background jobs and storage cleanup must tolerate retries and partial failure.
- Public file access derives short-lived authorization at response time; public
  URLs or bearer credentials are not stored as page metadata.

## Boundaries

- No-touch enterprise code: `apps/client/src/ee`, `apps/server/src/ee`, and
  `packages/ee`.
- Generated database types: `apps/server/src/database/types/db.d.ts`.
- Generated/untracked outputs: `dist`, `coverage`, `.nx`, and `node_modules`.
- Durable history: released migrations and published release tags.
- External contracts: `/api`, public share routes, Socket.IO events,
  collaboration clients, ZIP formats, storage drivers, Docker Compose, and
  GHCR image tags.

## Security and failure rules

- Validate untrusted input at HTTP, multipart, import, and storage boundaries.
- Check authentication, workspace membership, and resource permission in that
  order where the domain requires them; test denial and cross-workspace access.
- Do not log or commit credentials, cookies, JWTs, private URLs, `.env` values,
  or production identifiers.
- Do not swallow errors, report success before durable completion, or leave
  orphaned database/storage state after a failed multi-step operation.
- Keep import paths controlled and reject traversal, invalid signatures,
  unsupported formats, and resource exhaustion.

## Touched-scope maintenance

- Fix new violations in files touched by the task.
- Avoid unrelated formatting, import churn, mass renames, dependency upgrades,
  or historical cleanup.
- Follow neighboring naming, error handling, localization, query-key, DTO, and
  test patterns before adding an abstraction.
- Preserve accessibility: labeled controls, keyboard access, focus restoration,
  non-duplicative image alternatives, and usable narrow/light/dark layouts.

## Review-only semantics

The following require evidence and judgment and are not mechanically enforced:
permission intent, backward compatibility, data-loss risk, collaboration merge
semantics, import/export compatibility, UI visual quality, and whether cleanup
is safe in the presence of history references.
