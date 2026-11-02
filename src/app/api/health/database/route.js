import { database } from "@/lib/database";
export const runtime = "nodejs";
export async function GET() {
  try {
    await database.query('SELECT 1 FROM bazar_auth."user" LIMIT 1');
    return Response.json({ status: "ok" });
  } catch {
    return Response.json({ status: "error", message: "Database unavailable" }, { status: 503 });
  }
}
