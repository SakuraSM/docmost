# Architecture

## Overview

Docmost is an Nx-managed pnpm monorepo. The browser application and API are
separate projects, while editor and database code is shared through workspace
packages.

## Runtime components

The React 19 client in `apps/client` is built by Vite. TanStack Query owns
server state, Jotai holds focused client state, and TipTap/ProseMirror provides
the document editor. Socket.IO events refresh page trees and related cached
queries after mutations.

The NestJS application in `apps/server` uses Fastify for HTTP. Controllers
perform request parsing and authentication, domain services enforce behavior,
and repositories in `apps/server/src/database` isolate Kysely queries. The collaboration
entry point runs separately and coordinates Yjs document updates.

PostgreSQL 16 or newer stores workspaces, spaces, pages, history, permissions,
and attachment metadata. Redis or Valkey 7 or newer backs caches, Socket.IO
coordination, and BullMQ jobs.

## Data flows

### Page editing

1. The client loads a page through the API and caches it by ID and slug.
2. Collaborative document changes flow through the collaboration server.
3. Metadata mutations update PostgreSQL and emit Socket.IO invalidation events.
4. Other clients refresh page, tree, search, and navigation state.

### Attachments

Attachment metadata lives in PostgreSQL. Binary data is written through the
storage abstraction, which supports local disk, S3-compatible storage, and
Azure Blob Storage. Private downloads validate page visibility. Public-share
downloads use short-lived attachment JWTs; signed URLs are derived at response
time and are never stored in page records.

Page image icons use the same system. `pages.icon` contains either an emoji or
`page-icon:<attachmentId>`. The referenced attachment is page- and
workspace-scoped. Replaced images are deleted asynchronously only after pages
and page history no longer reference them.

### Background work

BullMQ workers handle attachment indexing and cleanup, imports and exports,
notifications, and other deferred work. Jobs must be retry-safe because Redis
delivery is at least once.

## Boundaries

Open-source code is under the AGPL-3.0 license. Files in `apps/client/src/ee`,
`apps/server/src/ee`, and `packages/ee` are enterprise-licensed and are not part
of this fork's open-source feature work.
