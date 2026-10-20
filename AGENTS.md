> [!NOTE]
> This project was originally scaffolded with [Lovable](https://lovable.dev) as a
> single TanStack Start app with Supabase. It has since been split into a
> standalone `frontend/` (Vite SPA) and `backend/` (Node/Express API + Neon
> Postgres) — Lovable's live sync no longer applies to this layout.

## Project layout
- `frontend/` — Vite + React + TanStack Router SPA. No server-side rendering.
- `backend/` — Express + TypeScript API, Drizzle ORM, Neon Postgres.

## Architecture rules
- Enforced plan limits live only in `backend/src/config.ts`; the backend is the
  single source of truth for anything that affects billing or abuse limits.
  Display-only copies of plan rules/prices/flags for the guest/demo UI live in
  `frontend/src/config/config.ts`.
- Mock services in `frontend/src/services/*` are the only layer touching
  localStorage (via `frontend/src/lib/storage.ts`); they back the guest/demo
  experience only.
- Free QR codes must encode content directly — never an internal redirect —
  so they never expire.
- Pages are TanStack Router file routes in `frontend/src/routes/` (no
  `src/pages`), because the framework's router is fixed.
- `/` is the marketing landing page; the generator home lives at `/home`, so
  first-time visitors see the pitch before the tool.
- Signed-in users' limits, plan and saved codes are enforced server-side by
  the backend (`backend/src/lib/recordGeneration.ts`, called from
  `POST /api/generate`); guests fall back to browser storage, because only the
  server can enforce limits reliably. All backend queries scoped to a user
  filter explicitly by `user_id` — there is no Postgres RLS on Neon.
- Auth is plain email/password (bcrypt + JWT), issued by the backend
  (`backend/src/routes/auth.ts`) and verified by `backend/src/middleware/auth.ts`.
  The frontend stores the JWT in `localStorage` and attaches it via
  `frontend/src/lib/api.ts`.
