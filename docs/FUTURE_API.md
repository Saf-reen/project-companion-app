# Future API contracts (not implemented)

The app currently runs entirely in the browser. These endpoints are specifications for a future backend; the app makes no requests to them.

| Method | Path | Purpose | Response |
| --- | --- | --- | --- |
| GET | `/api/me` | Current user + plan | `{ id, name, email, plan: "free"\|"pro", usage: { used, limit } }` |
| GET | `/api/plans` | Plans and prices | `{ plans: [{ id, prices: { monthly, yearly }, entitlements }] }` |
| POST | `/api/qr` | Create a QR (server-enforced limit) | body `{ type, payload, options, dynamic? }` → `GeneratedQr` or `402 { error: "limit_reached" }` |
| GET | `/api/qr/history` | List user's QRs | `{ items: GeneratedQr[] }` |
| GET | `/api/qr/:id/analytics` | Scan stats (dynamic only) | `{ total, overTime[], devices[], geo[] }` |
| PATCH | `/api/qr/:id/destination` | Edit dynamic destination | body `{ url }` → `GeneratedQr` |
| POST | `/api/billing/checkout` | Start checkout | body `{ plan, cycle }` → `{ checkoutUrl }` |

Types live in `src/types/index.ts`. Mock implementations live in `src/services/*` and can be swapped for API calls.

## Known limitation
The 5-free-generation limit is stored in localStorage and can be bypassed by clearing storage or switching browsers. Free codes are static (content encoded directly) and never depend on a server.
