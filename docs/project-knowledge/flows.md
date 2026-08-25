# Stable flows

Last reviewed at `11d35ca4` on 2026-08-25.

## Page editing and realtime refresh

### Entry and outcome

- Entry: an authenticated client opens and edits a workspace page.
- Outcome: document content and metadata become durable, and other authorized
  clients converge on refreshed page/tree/search/navigation state.

### Data and control path

1. The client loads API data into TanStack Query caches.
2. Yjs document changes travel through the separate collaboration service.
3. Metadata mutations pass controller validation, domain permission checks,
   services, and Kysely repositories into PostgreSQL.
4. The server emits Socket.IO invalidation/update events after durable success.
5. Other clients update or refetch affected caches.

### Risk semantics

- Access rule: workspace context plus page/space permission is required.
- Failure: do not broadcast success for a rolled-back mutation; tolerate stale
  or duplicate events by refreshing from durable state.
- Retry: collaboration reconnect and duplicate event delivery must converge.
- External effects: PostgreSQL, Redis, collaboration process, and browsers.

## Attachment lifecycle

### Entry and outcome

- Entry: authenticated upload, import, page icon, editor attachment, or cleanup.
- Outcome: attachment metadata and binary storage remain permission-scoped and
  consistent through replacement, history, sharing, and deletion.

### Data and control path

1. Validate multipart metadata, file signature/type/size, page/workspace scope,
   and edit permission.
2. Store binary data through the local, S3-compatible, or Azure abstraction and
   create/update PostgreSQL metadata in the service-defined order.
3. Private reads revalidate page visibility; public reads use short-lived
   signed authorization derived at response time.
4. Replacement or deletion enqueues cleanup only after current pages and page
   history no longer reference the attachment.

### Risk semantics

- Access rule: an attachment ID alone grants no access.
- Sensitive data: binary content, metadata, storage keys, and signed URLs.
- Failure: remove partial writes without deleting still-referenced history.
- Retry: cleanup/index jobs must be idempotent.
- External effects: PostgreSQL plus one configured storage driver and queues.

## Import and export

### Entry and outcome

- Entry: an authorized user imports or exports Docmost ZIP or supported content.
- Outcome: pages, documents, and required resources round-trip without path
  escape, cross-workspace references, or all-or-nothing failure for a single
  damaged optional asset.

### Risk semantics

- Access rule: source and destination workspace/space permissions apply.
- Validation: normalize controlled resource paths, validate types/signatures,
  allocate new target IDs, and never trust archive metadata as authorization.
- Compatibility: old ZIPs without newer optional fields remain importable;
  damaged optional images degrade the affected presentation rather than the
  entire batch where the format promises that behavior.
- Failure: report partial outcomes and clean orphaned records/storage.
- External effects: ZIP streams, PostgreSQL, storage, queues, and search/indexing.

## Public sharing and files

1. A public share resolves only content allowed by the share configuration.
2. Public attachment URLs contain short-lived authorization generated for the
   response; the database does not persist reusable public access URLs.
3. Revocation, page deletion, or permission changes must stop future access and
   avoid leaking workspace-only metadata.

Test anonymous success, revoked/expired access, unrelated attachment IDs, and
cache behavior whenever this flow changes.

## Fork release

1. Changes merge to `main` after PR checks.
2. A tag matching `v<upstream-version>-sakura.<revision>` triggers Release CI.
3. CI builds amd64 and arm64 images without enterprise submodules, pushes
   per-platform digests, and creates the multi-architecture GHCR manifest.
4. CI tags the image with the fork version and `sakura-latest`, uploads Docker
   archives, and creates a GitHub prerelease.

Invalid/upstream-style tags must fail validation. Verify the Release run,
assets, package visibility, image tags/digest, and the Compose consumer before
declaring publication complete.
