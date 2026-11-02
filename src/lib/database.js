import { Pool } from "pg";
import { databaseCA } from "./database-ca.js";

// A private schema keeps Better Auth records outside Supabase's public Data API.
export const database = globalThis.__bazarDatabase ?? new Pool({
  connectionString: process.env.DATABASE_URL,
  options: "-c search_path=bazar_auth",
  ssl: { rejectUnauthorized: true, ca: databaseCA },
  max: 3,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 20000,
});

if (process.env.NODE_ENV !== "production") globalThis.__bazarDatabase = database;
