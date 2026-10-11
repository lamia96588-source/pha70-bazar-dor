import ProfileAccountCard from "@/components/profile-account-card";
import ProfileEditor from "@/components/profile-editor";
import { requireAuthenticatedUser } from "@/lib/session";
import { getUserDisplayName, getUserInitials } from "@/lib/utils";

export const metadata = {
  title: "আমার প্রোফাইল — বাজার দর",
};

export default async function ProfilePage() {
  const user = await requireAuthenticatedUser("/profile");
  const name = getUserDisplayName(user);

  return (
    <main className="profile-main">
      <header className="profile-heading">
        <h1>আমার প্রোফাইল</h1>
        <p>আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।</p>
      </header>

      <ProfileAccountCard email={user.email} initials={getUserInitials(user)} name={name} />
      <ProfileEditor initialName={user.name ?? ""} />
    </main>
  );
}
