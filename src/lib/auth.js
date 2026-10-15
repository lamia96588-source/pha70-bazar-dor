import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { betterAuth } from "better-auth/minimal";
import { getMongoClient } from "@/lib/mongodb";

const databaseName = process.env.MONGODB_DB || "pha7-bazar-dor";
const database = getMongoClient().db(databaseName);
const socialProviders = {};

function getAuthBaseURL() {
  const configuredBaseURL = process.env.BETTER_AUTH_URL;
  const isVercel = process.env.VERCEL === "1";

  if (!isVercel) {
    return configuredBaseURL;
  }

  let configuredURL;

  try {
    configuredURL = configuredBaseURL ? new URL(configuredBaseURL) : undefined;
  } catch {
    configuredURL = undefined;
  }

  const configuredHost = configuredURL?.host;
  const configuredHostIsLocal =
    configuredURL &&
    ["localhost", "127.0.0.1", "::1"].includes(configuredURL.hostname);
  const allowedHosts = [
    process.env.VERCEL_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_BRANCH_URL,
    !configuredHostIsLocal ? configuredHost : undefined,
  ].filter(Boolean);

  if (allowedHosts.length === 0) {
    return configuredBaseURL;
  }

  const fallbackURL =
    configuredHost && !configuredHostIsLocal
      ? `https://${configuredHost}`
      : `https://${allowedHosts[0]}`;

  return {
    allowedHosts: [...new Set(allowedHosts)],
    protocol: "https",
    fallback: fallbackURL,
  };
}

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
  baseURL: getAuthBaseURL(),
  secret: process.env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(database, { transaction: false }),
  emailAndPassword: {
    enabled: true,
  },
  ...(Object.keys(socialProviders).length > 0 ? { socialProviders } : {}),
});
