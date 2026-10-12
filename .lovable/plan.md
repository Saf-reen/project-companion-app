# Landing page + backend

## What you'll get
1. **New landing page at `/`** — the first thing visitors see: big headline, short pitch, 3–4 benefit tiles, a sample QR preview, "How it works" (3 steps), a pricing teaser, and one clear "Start creating" button.
2. **Current home page moves to `/home`** — the generator, features and FAQ stay exactly as they are. Nav "Home" link points there; the logo goes to the landing page.
3. **Real backend (server code)** — written in TypeScript/Node-style server functions that run with the app (a separate Express server can't be hosted here; this is the supported equivalent and deploys automatically):
   - Accounts: sign up / log in / log out
   - Free-limit enforcement on the server (5 codes per user, can't be reset by clearing the browser)
   - Saved QR history per user
   - Contact form messages stored and viewable
   - Pro plan flag per user (payments can be added later)

Backend uses Lovable Cloud (database + login), enabled as the first step.

## Technical details
- `src/routes/index.tsx` -> landing; old content -> `src/routes/home.tsx`; update Header/Footer links and all `to="/"` references to the generator.
- Enable Lovable Cloud; migration: `profiles` (plan, generation_count), `qr_codes`, `contact_messages`, with RLS scoped to `auth.uid()`; contact insert allowed for anon.
- Server functions in `src/lib/*.functions.ts` with `requireSupabaseAuth`: `recordGeneration` (atomic count check vs `config.ts` limit), `listHistory`, `submitContact`, `getAccount`.
- Swap `src/services/*` from localStorage to these functions; keep guest mode (localStorage) for signed-out visitors.
- Add `/login` route; update AGENTS.md.
