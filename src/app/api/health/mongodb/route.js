import { getDb } from "@/lib/mongodb";

export const runtime = "nodejs";

export async function GET() {
  try {
    const db = await getDb();
    await db.command({ ping: 1 });

    return Response.json({ status: "ok", database: db.databaseName });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    const isConfigurationError =
      message === "Missing MONGODB_URI environment variable" ||
      message.startsWith("MONGODB_URI must point to a remotely reachable");

    if (!isConfigurationError) {
      const hasErrorCode = error && typeof error === "object" && "code" in error;
      const cause = error && typeof error === "object" && "cause" in error ? error.cause : undefined;
      const hasCauseCode = cause && typeof cause === "object" && "code" in cause;

      console.error("MongoDB health check failed", {
        name: error instanceof Error ? error.name : "UnknownError",
        code: hasErrorCode ? error.code : undefined,
        causeCode: hasCauseCode ? cause.code : undefined,
      });
    }

    return Response.json(
      {
        status: "error",
        message: isConfigurationError ? message : "Could not connect to MongoDB",
      },
      { status: 503 },
    );
  }
}
