import { betterAuth } from "better-auth";
import { database } from "@/lib/database";

const socialProviders = {};

function getAuthBaseURL() {
  const configuredBaseURL = process.env.BETTER_AUTH_URL?.trim();
  const isVercel = process.env.VERCEL === "1";

  if (!isVercel) {
    if (configuredBaseURL) {
      return configuredBaseURL;
    }

    return {
      allowedHosts: ["localhost:*", "127.0.0.1:*", "[::1]:*"],
      protocol: "http",
      fallback: "http://localhost:3000",
    };
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
    if (configuredURL && !configuredHostIsLocal) {
      return configuredURL.origin;
    }

    throw new Error(
      "Could not resolve a public Better Auth URL on Vercel. Set VERCEL_URL or BETTER_AUTH_URL to your public HTTPS domain.",
    );
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
  database,
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  ...(Object.keys(socialProviders).length > 0 ? { socialProviders } : {}),
});
