import { getDb } from "@/lib/mongodb";

export const runtime = "nodejs";

export async function GET() {
  try {
    const db = await getDb();
    await db.command({ ping: 1 });

    return Response.json({ status: "ok", database: db.databaseName });
  } catch (error) {
    const isMissingUri = error.message === "Missing MONGODB_URI environment variable";

    return Response.json(
      {
        status: "error",
        message: isMissingUri ? error.message : "Could not connect to MongoDB",
      },
      { status: 503 },
    );
  }
}
