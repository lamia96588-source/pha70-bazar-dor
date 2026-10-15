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
- MongoDB Node.js driver 7.7 with the Better Auth MongoDB adapter
- Programming Hero BazarDor products API, with a bundled sample catalog fallback

## Requirements

- Node.js and npm
- A running MongoDB server or MongoDB Atlas database

## Run locally

Install dependencies and create a local environment file:

```powershell
npm install
Copy-Item .env.example .env.local
```

Set the values in `.env.local`, then start the app:

```powershell
npm run dev
```

Open the local URL printed by Next.js. If it selects a port other than `3000`, set `BETTER_AUTH_URL` in `.env.local` to that URL and restart the server.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `MONGODB_URI` | Yes | MongoDB connection string. Local default: `mongodb://127.0.0.1:27017`. |
| `MONGODB_DB` | No | Database name. Defaults to `pha7-bazar-dor`. |
| `BETTER_AUTH_URL` | Local only | The app's base URL, such as `http://localhost:3000`. On Vercel, Better Auth uses the deployment host and Vercel project/branch hostnames; set this to your canonical `https://` domain if you use a custom domain. |
| `BETTER_AUTH_SECRET` | Yes | A private random secret with at least 32 characters. |
| `BAZARDOR_API_BASE_URL` | No | Catalog API base URL. Defaults to the Programming Hero BazarDor API. The app requests its `/products` endpoint. |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | No | Enable Google sign-in when both values are set. |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | No | Enable GitHub sign-in when both values are set. |

Keep `.env.local` private. It is excluded from Git. For OAuth sign-in, configure the matching client ID and secret with the provider and in `.env.local`.

For Vercel deployments, add `MONGODB_URI` (a remotely reachable MongoDB URI) and a unique `BETTER_AUTH_SECRET` of at least 32 characters to the Vercel environment settings, then redeploy. Add Google or GitHub credentials only for the providers you have configured.

## MongoDB connection check

With MongoDB running and the app started, open:

```text
http://localhost:3000/api/health/mongodb
```

A successful response includes `"status":"ok"` and the connected database name. The route returns HTTP 503 when the database is unavailable or `MONGODB_URI` is missing.

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
| `/api/health/mongodb` | MongoDB ping check |

The root `src/proxy.js` performs a quick session-cookie check for protected routes. Protected pages also validate the session on the server.

## Project checks

```powershell
npm run lint
npm run build
npm run start
```
