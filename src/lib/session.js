import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getSafeRedirectPath } from "@/lib/utils";

export async function requireAuthenticatedUser(callbackPath = "/profile") {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    const safeCallbackPath = getSafeRedirectPath(callbackPath, "/profile");
    redirect(`/signin?callbackUrl=${encodeURIComponent(safeCallbackPath)}`);
  }

  return session.user;
}
