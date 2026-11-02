# বাজার দর (BazarDor)

**বাজার দর** is a Bengali market-price tracker for comparing daily prices of essential products across categories and local markets.

## Key features

1. Browse a daily overview of products with price changes, including rising and falling prices.
2. Explore category pages and sort prices numerically from low to high or high to low.
3. Compare each product's minimum, maximum, and average prices across markets.
4. Create an account or sign in with email and password; optionally enable Google and GitHub OAuth.
5. View protected product details and manage your profile, including updating your name.

## Technologies

- Next.js 16.4 App Router and React 19.3
- Tailwind CSS 4 and DaisyUI 5
- Better Auth 1.7 for email/password authentication and optional OAuth
- Supabase PostgreSQL with a private Better Auth schema and verified TLS
- Programming Hero BazarDor products API, with a bundled sample catalog fallback

## Requirements

- Node.js and npm
- A Supabase PostgreSQL database and its pooler connection string

## Run locally

Install dependencies and copy `.env.example` to `.env.local` in the project root. Fill in the variables listed below; never commit `.env.local`:

```powershell
npm install
```

Set the values in `.env.local`, then start the app:

```powershell
npm run dev
```

Open the local URL printed by Next.js. If it selects a port other than `3000`, set `BETTER_AUTH_URL` in `.env.local` to that URL and restart the server.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | Supabase PostgreSQL pooler URI for the dedicated `bazar_app` database role. |
| `BETTER_AUTH_URL` | No | Set this to your canonical `https://` domain only when using a custom domain. On Vercel, Better Auth automatically uses the deployment host and Vercel project/branch hostnames. |
| `BETTER_AUTH_SECRET` | Yes | A private random secret with at least 32 characters. |
| `BAZARDOR_API_BASE_URL` | No | Catalog API base URL. Defaults to the Programming Hero BazarDor API. The app requests its `/products` endpoint. |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | No | Enable Google sign-in when both values are set. |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | No | Enable GitHub sign-in when both values are set. |

Keep `.env.local` private. It is excluded from Git. Add your PostgreSQL connection string there for local development. For OAuth sign-in, configure the matching client ID and secret with the provider and in `.env.local`.

The assignment asks for both Google and GitHub login. Register `https://YOUR-DOMAIN/api/auth/callback/google` and `https://YOUR-DOMAIN/api/auth/callback/github` with their respective providers. Use the matching local origin when testing locally, add both providers' credentials to the deployment, then redeploy and test each login.

For Vercel deployments, configure `DATABASE_URL` and a unique `BETTER_AUTH_SECRET` as sensitive production environment variables. Add the OAuth credentials and redeploy.

## Database setup and check

Use a dedicated database role with access to the private `bazar_auth` schema. The application uses Better Auth, not Supabase Auth. No auth tables are exposed through the Supabase Data API.

After provisioning the role and schema, run:

```sh
node --env-file=.env.local scripts/migrate-auth.mjs
```

The migration creates Better Auth's user, session, account, and verification tables and enables RLS. The server connects as the table owner; browser clients receive no database credentials or direct table access.

`/api/health/database` returns HTTP 200 with `{"status":"ok"}` when the database query succeeds, or HTTP 503 if unavailable. The old `/api/health/mongodb` path remains a compatibility alias.

## Catalog data

The app fetches product prices from:

```text
https://openapi.programming-hero.com/api/bazardor/products
```

API data is refreshed every five minutes. If the API is unavailable or its response has no usable product prices, the site displays the bundled sample catalog. Product and market values shown in the sample catalog are demonstration data.

## Routes

| Route | Description |
| --- | --- |
| `/` | Home page and product price overview |
| `/category/[slug]` | Category listing with numeric price sorting |
| `/product/[slug]` | Protected product details and market comparison |
| `/signin`, `/signup` | Email/password authentication and optional social sign-in |
| `/profile` | Protected profile overview |
| `/profile/update` | Protected name update form |
| `/api/auth/[...all]` | Better Auth API handler |
| `/api/health/database` | PostgreSQL connectivity check |

The root `src/proxy.js` performs a quick session-cookie check for protected routes. Protected pages also validate the session on the server.

## Project checks

```powershell
npm run lint
npm run build
npm run start
```

## Deployment

Live: https://bazar-dor-a7-lamia-2026.vercel.app

Source: https://github.com/lamia96588-source/pha70-bazar-dor
