# Unassuming Shop

React storefront and Express/PostgreSQL backend for guest ordering, optional verified customer accounts, pay-on-handoff fulfillment, rewards, and staff operations.

## Local setup

Install Node.js 20+ and Docker, then run:

```sh
npm run local
```

This installs dependencies, starts the Compose-managed PostgreSQL service, applies migrations, seeds the database, and launches the frontend and API. It is safe to run again. The storefront runs at `http://localhost:3000`, the API at `http://localhost:8080`, and staff operations at `http://localhost:3000/admin`.

The bootstrap admin must replace its temporary password on first sign-in. If `RESEND_API_KEY` is empty, emails are logged as disabled without blocking orders.

## Commands

- `npm run lint` — type-check browser and server code
- `npm test` — run backend business-rule tests
- `npm run local` — set up PostgreSQL and launch the full local application
- `npm run setup` — install dependencies, start PostgreSQL, migrate, and seed without launching
- `npm run build && npm run build:server` — create production assets
- `npm start` — serve the API and built storefront
- `npm run db:migrate` — apply committed PostgreSQL migrations
- `npm run db:seed` — idempotently seed catalog, locations, and the bootstrap admin

## Railway

Create a Railway PostgreSQL service, connect `DATABASE_URL`, and configure the remaining variables from `.env.example`. `railway.json` builds both applications, runs migrations and the idempotent seed before deployment, and checks `/api/health`.

Order totals and customization prices are calculated by the server in integer cents. Tracking and reward ledgers use unguessable emailed links; staff authentication uses expiring HTTP-only cookie sessions.

Customer registration requires email verification. Verified accounts use separate 30-day HTTP-only sessions and provide profile editing, rewards, order history, checkout prefill, and email-based password recovery. Run migrations after pulling account-related schema changes.
