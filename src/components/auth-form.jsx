"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { getSafeRedirectPath } from "@/lib/utils";

function GoogleIcon() {
  return (
    <svg aria-hidden="true" className="auth-provider-icon" viewBox="0 0 48 48">
      <path fill="#4285F4" d="M43.6 24.5c0-1.4-.1-2.7-.4-4H24v7.6h11a9.4 9.4 0 0 1-4.1 6.2v5h6.5c3.8-3.5 6.2-8.7 6.2-14.8Z" />
      <path fill="#34A853" d="M24 44c5.5 0 10.1-1.8 13.4-4.8l-6.5-5c-1.8 1.2-4.1 2-6.9 2-5.3 0-9.8-3.6-11.4-8.5H5.9v5.2A20.2 20.2 0 0 0 24 44Z" />
      <path fill="#FBBC05" d="M12.6 27.7a12.1 12.1 0 0 1 0-7.4v-5.2H5.9a20.1 20.1 0 0 0 0 17.8l6.7-5.2Z" />
      <path fill="#EA4335" d="M24 12c3 0 5.7 1 7.8 3.1l5.8-5.8C34.1 6 29.5 4 24 4A20.2 20.2 0 0 0 5.9 15.1l6.7 5.2C14.2 15.6 18.7 12 24 12Z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg aria-hidden="true" className="auth-provider-icon auth-provider-icon-github" viewBox="0 0 24 24">
      <path d="M12 .8a11.2 11.2 0 0 0-3.54 21.83c.56.1.76-.24.76-.54v-2.1c-3.1.68-3.76-1.32-3.76-1.32-.5-1.3-1.24-1.65-1.24-1.65-1.02-.7.08-.69.08-.69 1.12.08 1.71 1.15 1.71 1.15 1 .1.75 2.6 3.38 1.84.1-.72.39-1.2.7-1.47-2.48-.28-5.08-1.24-5.08-5.52 0-1.22.44-2.21 1.15-2.99-.12-.28-.5-1.42.11-2.95 0 0 .94-.3 3.08 1.14a10.7 10.7 0 0 1 5.6 0c2.13-1.44 3.07-1.14 3.07-1.14.61 1.53.23 2.67.11 2.95.72.78 1.15 1.77 1.15 2.99 0 4.3-2.6 5.23-5.09 5.5.4.35.75 1.02.75 2.06v3.2c0 .3.2.65.77.54A11.2 11.2 0 0 0 12 .8Z" />
    </svg>
  );
}

function getCallbackPath() {
  const searchParams = new URLSearchParams(window.location.search);
  const requestedPath = searchParams.get("callbackUrl") || searchParams.get("callbackURL");

  return getSafeRedirectPath(requestedPath, "/");
}

function getFormError(error, isSocial = false) {
  const code = error?.code?.toUpperCase();

  if (
    code === "USER_ALREADY_EXISTS" ||
    code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL" ||
    code === "EMAIL_ALREADY_EXISTS" ||
    code === "EMAIL_ALREADY_EXISTS_USE_ANOTHER_EMAIL"
  ) {
    return "এই ইমেইল দিয়ে আগে থেকেই একটি অ্যাকাউন্ট আছে।";
  }

  if (code === "INVALID_EMAIL_OR_PASSWORD") {
    return "ইমেইল বা পাসওয়ার্ড সঠিক নয়।";
  }

  if (isSocial) {
    return "এই সাইন-ইন পদ্ধতিটি সেটআপ করা নেই বা এখন কাজ করছে না।";
  }

  return "অনুরোধটি সম্পন্ন হয়নি। তথ্য যাচাই করে আবার চেষ্টা করুন।";
}

export default function AuthForm({ mode }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const isSignUp = mode === "signup";

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");
    const name = String(formData.get("name") || "").trim();
    const confirmPassword = String(formData.get("confirmPassword") || "");

    if (isSignUp && password !== confirmPassword) {
      setErrorMessage("দুটি পাসওয়ার্ড মিলছে না।");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = isSignUp
        ? await authClient.signUp.email({ name, email, password })
        : await authClient.signIn.email({ email, password });

      if (result.error) {
        setErrorMessage(getFormError(result.error));
        return;
      }

      router.replace(getCallbackPath());
      router.refresh();
    } catch {
      setErrorMessage("সার্ভারের সঙ্গে যোগাযোগ করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSocialSignIn(provider) {
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const result = await authClient.signIn.social({
        provider,
        callbackURL: getCallbackPath(),
      });

      if (result.error) {
        setErrorMessage(getFormError(result.error, true));
      }
    } catch {
      setErrorMessage(getFormError(null, true));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-page-heading">
        <h1>{isSignUp ? "অ্যাকাউন্ট তৈরি করুন" : "সাইন ইন"}</h1>
        <p>
          {isSignUp
            ? "বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।"
            : "বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।"}
        </p>
      </div>

      <section aria-label={isSignUp ? "অ্যাকাউন্ট তৈরি" : "সাইন ইন"} className={`auth-card${isSignUp ? " auth-card-signup" : ""}`}>
        <form className="auth-form" onSubmit={handleSubmit}>
          {isSignUp ? (
            <label className="auth-field">
              <span>নাম</span>
              <input autoComplete="name" maxLength={80} name="name" placeholder="যেমন: রহিম উদ্দিন" required />
            </label>
          ) : null}

          <label className="auth-field">
            <span>ইমেইল</span>
            <input autoComplete="email" name="email" placeholder="you@example.com" required type="email" />
          </label>

          <label className="auth-field">
            <span>পাসওয়ার্ড</span>
            <input
              autoComplete={isSignUp ? "new-password" : "current-password"}
              minLength={8}
              name="password"
              placeholder="কমপক্ষে ৮ অক্ষর"
              required
              type="password"
            />
          </label>

          {isSignUp ? (
            <label className="auth-field">
              <span>পাসওয়ার্ড নিশ্চিত করুন</span>
              <input
                autoComplete="new-password"
                minLength={8}
                name="confirmPassword"
                placeholder="আবার লিখুন"
                required
                type="password"
              />
            </label>
          ) : null}

          {errorMessage ? <p className="auth-error" role="alert">{errorMessage}</p> : null}

          <button className="button button-primary auth-submit" disabled={isSubmitting} type="submit">
            {isSubmitting ? "অপেক্ষা করুন…" : isSignUp ? "অ্যাকাউন্ট তৈরি করুন" : "সাইন ইন"}
          </button>
        </form>

        <div aria-hidden="true" className="auth-divider"><span>অথবা</span></div>

        <div className="auth-social-buttons">
          <button
            className="auth-social-button"
            disabled={isSubmitting}
            onClick={() => handleSocialSignIn("google")}
            type="button"
          >
            <GoogleIcon />
            <span>Google দিয়ে চালিয়ে যান</span>
          </button>
          <button
            className="auth-social-button"
            disabled={isSubmitting}
            onClick={() => handleSocialSignIn("github")}
            type="button"
          >
            <GitHubIcon />
            <span>GitHub দিয়ে চালিয়ে যান</span>
          </button>
        </div>

        <p className="auth-provider-note">
          Google/GitHub শুধুমাত্র সার্ভারে কনফিগার করা থাকলে কাজ করবে। কনফিগার না থাকলে বাংলায় জানিয়ে দেওয়া হবে।
        </p>

        <p className="auth-form-switch">
          {isSignUp ? "অ্যাকাউন্ট আছে? " : "অ্যাকাউন্ট নেই? "}
          <Link href={isSignUp ? "/signin" : "/signup"}>
            {isSignUp ? "সাইন ইন করুন" : "সাইন আপ করুন"}
          </Link>
        </p>
      </section>

      <Link className="auth-back-home" href="/">← হোম পেজে ফিরে যান</Link>
    </main>
  );
}
