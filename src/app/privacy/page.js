import Link from "next/link";
export const metadata = { title: "Privacy — Bazar Dor" };
export default function PrivacyPage() {
  return <main className="mx-auto max-w-3xl px-4 py-12">
    <h1 className="text-3xl font-bold">Privacy and account data</h1>
    <p className="mt-5">Bazar Dor is an educational market-price tracking application. Public product prices come from the Programming Hero Bazar Dor API.</p>
    <h2 className="mt-8 text-xl font-semibold">Information used for your account</h2>
    <p className="mt-3">Email registration stores your name, email address and a password hash. Google or GitHub sign-in provides your account identifier, name, email address and profile picture when available. Better Auth stores linked-account credentials and session records to support sign-in. Session records may include your IP address and browser information.</p>
    <h2 className="mt-8 text-xl font-semibold">Storage and use</h2>
    <p className="mt-3">Account information is used to authenticate you, display your profile and protect product details. The application runs on Vercel and stores account records in a private PostgreSQL schema hosted by Supabase. Database credentials remain on the server. A session cookie keeps you signed in until you sign out or the session expires.</p>
    <h2 className="mt-8 text-xl font-semibold">Your choices</h2>
    <p className="mt-3">You can update your name from My Profile and sign out from the navigation menu. You can revoke Google or GitHub access in that provider’s account settings. Revoking provider access does not automatically delete an existing Bazar Dor account. For account-data questions or deletion requests, contact the app operator at <a className="link" href="mailto:miashuvo2077@gmail.com">miashuvo2077@gmail.com</a>.</p>
    <Link className="btn mt-8" href="/">হোম পেজে ফিরে যান</Link>
  </main>;
}
