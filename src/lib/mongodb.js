import { MongoClient } from "mongodb";

const options = {};
let client;
let clientPromise;
const globalWithMongo = globalThis;

export function getMongoClient() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("Missing MONGODB_URI environment variable");
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
  return client.db(process.env.MONGODB_DB || "pha7-bazar-dor");
}
