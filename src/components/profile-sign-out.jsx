"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function ProfileSignOut() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSignOut() {
    setIsSigningOut(true);
    setErrorMessage("");

    try {
      const result = await authClient.signOut();

      if (result.error) {
        setErrorMessage("সাইন আউট করা যায়নি। আবার চেষ্টা করুন।");
        return;
      }

      router.replace("/");
      router.refresh();
    } catch {
      setErrorMessage("সার্ভারের সঙ্গে যোগাযোগ করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <div className="profile-signout-wrap">
      <button
        className="profile-signout"
        disabled={isSigningOut}
        onClick={handleSignOut}
        type="button"
      >
        {isSigningOut ? "অপেক্ষা করুন…" : "↩ সাইন আউট"}
      </button>
      {errorMessage ? <p className="profile-error" role="alert">{errorMessage}</p> : null}
    </div>
  );
}
