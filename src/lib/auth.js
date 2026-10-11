import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { betterAuth } from "better-auth/minimal";
import { getMongoClient } from "@/lib/mongodb";

const databaseName = process.env.MONGODB_DB || "pha7-bazar-dor";
const database = getMongoClient().db(databaseName);

export const auth = betterAuth({
  appName: "Bazar Dor",
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(database, { transaction: false }),
  emailAndPassword: {
    enabled: true,
  },
});
