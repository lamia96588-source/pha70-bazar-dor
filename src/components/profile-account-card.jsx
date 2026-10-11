import ProfileSignOut from "@/components/profile-sign-out";

export default function ProfileAccountCard({ email, initials, name }) {
  return (
    <section aria-label="অ্যাকাউন্ট" className="profile-account-card">
      <div aria-hidden="true" className="profile-avatar">{initials}</div>
      <div className="profile-account-copy">
        <strong>{name}</strong>
        <span>{email}</span>
      </div>
      <ProfileSignOut />
    </section>
  );
}
