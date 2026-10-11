"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function ProfileEditor({ initialName }) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setErrorMessage("");

    const nextName = name.trim();

    if (!nextName) {
      setErrorMessage("নাম লিখুন।");
      return;
    }

    if (nextName === initialName) {
      setMessage("আপনার নাম পরিবর্তন হয়নি।");
      return;
    }

    setIsSaving(true);

    try {
      const result = await authClient.updateUser({ name: nextName });

      if (result.error) {
        setErrorMessage("নাম আপডেট করা যায়নি। আবার চেষ্টা করুন।");
        return;
      }

      setName(result.data?.user?.name ?? nextName);
      setMessage("আপনার নাম আপডেট হয়েছে।");
      router.refresh();
    } catch {
      setErrorMessage("সার্ভারের সঙ্গে যোগাযোগ করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section aria-labelledby="profile-info-title" className="profile-form-card">
      <h2 id="profile-info-title">তথ্য</h2>
      <form className="profile-form" onSubmit={handleSubmit}>
        <label className="profile-field">
          <span>নাম</span>
          <input
            autoComplete="name"
            maxLength={80}
            onChange={(event) => setName(event.target.value)}
            required
            value={name}
          />
        </label>

        {errorMessage ? <p className="profile-error" role="alert">{errorMessage}</p> : null}
        {message ? <p className="profile-success" role="status">{message}</p> : null}

        <button className="button button-primary profile-submit" disabled={isSaving} type="submit">
          {isSaving ? "আপডেট হচ্ছে…" : "আপডেট"}
        </button>
      </form>
    </section>
  );
}
