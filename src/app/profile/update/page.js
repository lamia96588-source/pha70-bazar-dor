import Link from "next/link";
import ProfileAccountCard from "@/components/profile-account-card";
import ProfileEditor from "@/components/profile-editor";
import { requireAuthenticatedUser } from "@/lib/session";
import { getUserDisplayName, getUserInitials } from "@/lib/utils";

export const metadata = {
  title: "প্রোফাইল আপডেট — বাজার দর",
};

export default async function UpdateProfilePage() {
  const user = await requireAuthenticatedUser("/profile/update");
  const name = getUserDisplayName(user);

  return (
    <main className="profile-main">
      <header className="profile-heading">
        <h1>প্রোফাইল আপডেট</h1>
        <p>আপনার অ্যাকাউন্টের তথ্য পরিবর্তন করুন।</p>
      </header>

      <ProfileAccountCard email={user.email} initials={getUserInitials(user)} name={name} />
      <ProfileEditor initialName={user.name ?? ""} />
      <Link className="profile-back-link" href="/profile">← প্রোফাইলে ফিরে যান</Link>
    </main>
  );
}
