import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { betterAuth } from "better-auth/minimal";
import { getMongoClient } from "@/lib/mongodb";

const databaseName = process.env.MONGODB_DB || "pha7-bazar-dor";
const database = getMongoClient().db(databaseName);
const socialProviders = {};

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  socialProviders.google = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  };
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  socialProviders.github = {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  };
}

export const auth = betterAuth({
  appName: "Bazar Dor",
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(database, { transaction: false }),
  emailAndPassword: {
    enabled: true,
  },
  ...(Object.keys(socialProviders).length > 0 ? { socialProviders } : {}),
});
