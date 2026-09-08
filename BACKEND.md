# Backend Documentation — Fluxogramas Contact Center

This document describes the backend and runtime setup of this project for external technical review.

## Platform

- **Frontend / full-stack framework:** TanStack Start v1 (React 19, TypeScript, Vite 7)
- **Backend:** Lovable Cloud (managed Supabase: PostgreSQL + Auth + Storage)
- **Server logic:** TanStack Start `createServerFn` (runs in an edge/serverless Worker runtime)
- **External HTTP endpoints:** TanStack file routes under `src/routes/api/`, public callers under `src/routes/api/public/`
- **Styling:** Tailwind CSS v4 with native CSS theme variables

## Authentication

The project uses Supabase Auth through the generated client at `src/integrations/supabase/client.ts`.

- Authentication is handled by Lovable Cloud / Supabase Auth.
- Protected server functions use the `requireSupabaseAuth` middleware (`src/integrations/supabase/auth-middleware.ts`).
- Client-side bearer tokens are attached via `attachSupabaseAuth` in `src/start.ts`.
- Social OAuth (Google) can be configured in Lovable Cloud auth settings.

## Database

- **Engine:** PostgreSQL (managed by Lovable Cloud).
- **Access control:** Row Level Security (RLS) must be enabled on every user-facing table.
- **Migrations:** at the time of writing there are no local migration files under `supabase/migrations/`. Schema changes are applied through Lovable Cloud.
- **Data export:** to obtain the schema and/or data for review, go to **Lovable editor → Cloud → Advanced settings → Export data** and request an export.

## Server Functions

Internal app logic is implemented with `createServerFn` from `@tanstack/react-start`.

- Client-safe server function modules: `*.functions.ts` under `src/lib/` or next to the routes that import them.
- Server-only helpers: `*.server.ts` modules.
- Protected functions call `.middleware([requireSupabaseAuth])` and receive `context.supabase`, `context.userId`, and `context.claims`.

## Static Data

The 145 flow diagrams are stored as static JSON in:

- `src/data/flows.json`

This file contains the page definitions, nodes, edges, dimensions, and textual steps extracted from the original Visio source. It is committed to the repository and loaded at build/runtime.

## Environment Variables

See `.env.example` for the full list of required variables.

The most important ones are:

- `SUPABASE_URL` / `VITE_SUPABASE_URL` — Lovable Cloud / Supabase project URL
- `SUPABASE_PUBLISHABLE_KEY` / `VITE_SUPABASE_PUBLISHABLE_KEY` — public anon key
- `SUPABASE_SERVICE_ROLE_KEY` — server-only service role key (must never reach the browser)

## Public API / Webhooks

If webhooks or cron jobs are added later, they must be placed under `src/routes/api/public/` and implement their own caller verification (signature checks, Zod validation, etc.).

## Running Locally

1. Install dependencies:
   ```bash
   bun install
   ```

2. Copy `.env.example` to `.env` and fill in real values from your Lovable Cloud project.

3. Start the dev server:
   ```bash
   bun run dev
   ```

4. Open `http://localhost:8080`.

## Security Notes for Reviewers

- The real `.env` file is excluded from version control.
- `src/integrations/supabase/client.server.ts` provides a service-role client that bypasses RLS; it must only be used inside authenticated and authorized server handlers.
- User roles (if implemented later) must live in a separate `user_roles` table, never in the profile/users table, and must be checked server-side.
- RLS policies and `GRANT` statements are required for every table created in the `public` schema.

## Current State

- The application is published at `https://report-buddy-pt.lovable.app`.
- Lovable Cloud is enabled.
- The admin editing panel and removal of the "Relatório" tab are planned but not yet implemented.
