# API contracts

Guest usage still runs entirely in the browser (localStorage) with the known
limitation described below. Signed-in usage is enforced by the backend in
[`backend/`](../backend/); see `backend/src/routes/` for the implementation.

| Method | Path | Auth | Purpose | Response |
| --- | --- | --- | --- | --- |
| POST | `/api/auth/signup` | none | Create an account | `{ token }` |
| POST | `/api/auth/login` | none | Sign in | `{ token }` |
| GET | `/api/account` | Bearer JWT | Current user's plan + usage | `{ email, plan, count, memberSince }` |
| POST | `/api/generate` | Bearer JWT | Record a generation (server-enforced limit) | `{ ok, count, plan }` |
| GET | `/api/codes` | Bearer JWT | List the user's saved QR codes | `SavedCode[]` |
| DELETE | `/api/codes/:id` | Bearer JWT | Delete a saved QR code | `{ ok: true }` |
| POST | `/api/contact` | none | Submit the contact form | `{ ok: true }` |

Not yet implemented (still mock/local only in `frontend/src/services/*`):
dynamic QR destinations, scan analytics, and billing/checkout.

## Known limitation

The 5-free-generation limit for **guests** is stored in localStorage and can
be bypassed by clearing storage or switching browsers — this is intentional;
free codes are static (content encoded directly) and never depend on a
server, so they never expire. Signed-in users' limits are enforced server-side
and cannot be bypassed this way.
