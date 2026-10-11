# বাজার দর (Bazar Dor)

A Bengali market-price comparison site built with Next.js App Router. It shows daily prices for essential products, category listings, market comparisons, and authenticated profile pages.

## Requirements

- Node.js and npm
- A running MongoDB server or MongoDB Atlas database

## Run locally

Install dependencies and create a local environment file:

```bash
npm install
cp .env.example .env.local
```

Set the values in `.env.local`, then start the app:

```bash
npm run dev
```

Open the local URL printed by Next.js. If it selects a port other than `3000`, set `BETTER_AUTH_URL` in `.env.local` to that URL and restart the server.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `MONGODB_URI` | Yes | MongoDB connection string. Local default: `mongodb://127.0.0.1:27017`. |
| `MONGODB_DB` | No | Database name. Defaults to `pha7-bazar-dor`. |
| `BETTER_AUTH_URL` | Yes | The app's base URL, such as `http://localhost:3000`. |
| `BETTER_AUTH_SECRET` | Yes | A private random secret with at least 32 characters. |
| `BAZARDOR_API_BASE_URL` | No | Catalog API base URL. Defaults to the Programming Hero BazarDor API. The app requests its `/products` endpoint. |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | No | Enable Google sign-in when both values are set. |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | No | Enable GitHub sign-in when both values are set. |

Keep `.env.local` private. It is excluded from Git. For OAuth sign-in, configure the matching client ID and secret in your identity provider and in `.env.local`.

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
| `/category/[slug]` | Category listing with sorting |
| `/product/[slug]` | Protected product details and market comparison |
| `/signin`, `/signup` | Email/password authentication and optional social sign-in |
| `/profile` | Protected profile and name update |
| `/profile/update` | Protected profile update page |
| `/api/auth/[...all]` | Better Auth API handler |
| `/api/health/mongodb` | MongoDB ping check |

The root `src/proxy.js` performs a quick session-cookie check for protected routes. Protected pages also validate the session on the server.

## Project checks

```bash
npm run lint
npm run build
npm run start
```
