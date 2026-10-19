import { MongoClient } from "mongodb";

const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 10_000,
};
let client;
let clientPromise;
const globalWithMongo = globalThis;

function isLoopbackMongoUri(uri) {
  try {
    const hostname = new URL(uri).hostname.toLowerCase().replace(/^\[|\]$/g, "");
    return (
      hostname === "localhost" ||
      hostname.endsWith(".localhost") ||
      hostname === "127.0.0.1" ||
      hostname === "::1" ||
      hostname === "0.0.0.0"
    );
  } catch {
    return false;
  }
}

export function getMongoClient() {
  const uri = process.env.MONGODB_URI?.trim();

  if (!uri) {
    throw new Error("Missing MONGODB_URI environment variable");
  }

  if (process.env.VERCEL === "1" && isLoopbackMongoUri(uri)) {
    throw new Error(
      "MONGODB_URI must point to a remotely reachable MongoDB Atlas database on Vercel; localhost is unavailable there.",
    );
  }

  if (process.env.NODE_ENV === "development") {
    // Keep one connection pool during Next.js hot reloads.
    if (!globalWithMongo._mongoClient) {
      globalWithMongo._mongoClient = new MongoClient(uri, options);
    }

    return globalWithMongo._mongoClient;
  }

  if (!client) {
    client = new MongoClient(uri, options);
  }

  return client;
}

export function getDatabaseName() {
  return process.env.MONGODB_DB?.trim() || "pha7-bazar-dor";
}

function getClientPromise() {
  const mongoClient = getMongoClient();

  if (process.env.NODE_ENV === "development") {
    if (!globalWithMongo._mongoClientPromise) {
      globalWithMongo._mongoClientPromise = mongoClient.connect();
    }

    return globalWithMongo._mongoClientPromise;
  }

  if (!clientPromise) {
    clientPromise = mongoClient.connect();
  }

  return clientPromise;
}

export async function getDb() {
  const client = await getClientPromise();
  return client.db(getDatabaseName());
}
