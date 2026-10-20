# Project Companion App

A QR code generator with a free guest mode and a signed-in Pro plan.

This repo is split into two standalone projects:

- [`frontend/`](frontend/) — Vite + React + TanStack Router single-page app.
- [`backend/`](backend/) — Node.js + Express API backed by Neon Postgres (via Drizzle ORM).

## Development

You need Node.js and npm, and a [Neon](https://neon.tech) Postgres database.

### Backend

```sh
cd backend
npm install
cp .env.example .env   # fill in DATABASE_URL (your Neon connection string) and JWT_SECRET
npm run db:push        # creates the tables in your Neon database
npm run dev            # starts the API on http://localhost:4000
```

### Frontend

```sh
cd frontend
npm install
cp .env.example .env   # VITE_API_URL defaults to http://localhost:4000
npm run dev            # starts the SPA on http://localhost:5173
```
