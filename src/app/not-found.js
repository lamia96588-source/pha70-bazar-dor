import Link from "next/link";

export const metadata = {
  title: "পাতা পাওয়া যায়নি — বাজার দর",
  description: "আপনি যে পাতাটি খুঁজছেন তা পাওয়া যায়নি।",
};

export default function NotFound() {
  return (
    <main className="shell not-found-main">
      <section aria-labelledby="not-found-title" className="not-found-card">
        <span aria-hidden="true" className="not-found-code">404</span>
        <h1 id="not-found-title">পাতাটি খুঁজে পাওয়া যায়নি</h1>
        <p>এই ঠিকানায় কোনো পৃষ্ঠা নেই। হোম পেজে ফিরে আজকের বাজারদর দেখুন।</p>
        <Link className="button button-primary not-found-home" href="/">
          হোম পেজে ফিরে যান
        </Link>
      </section>
    </main>
  );
}
