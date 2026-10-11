"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { categories, getBanglaDate } from "@/lib/catalog-data";

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="header-main">
        <div className="shell header-main-inner">
          <Link aria-label="বাজার দর — হোম পেজ" className="brand" href="/">
            <span className="brand-mark">
              <Image src="/logo-icon.png" alt="" width={38} height={38} priority />
            </span>
            <span className="brand-copy">
              <strong>বাজার দর</strong>
              <small>{getBanglaDate()}</small>
            </span>
          </Link>

          <div className="account-area">
            <button
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              className="account-trigger"
              onClick={() => setMenuOpen((isOpen) => !isOpen)}
              type="button"
            >
              <span aria-hidden="true" className="account-avatar">👤</span>
              <span className="account-trigger-label">অ্যাকাউন্ট</span>
              <span aria-hidden="true" className="account-caret">⌄</span>
            </button>
            {menuOpen ? (
              <div className="account-menu" role="menu">
                <strong>স্বাগতম</strong>
                <p>দাম তুলনা ও প্রোফাইল দেখতে সাইন ইন করুন।</p>
                <Link href="/signin" onClick={() => setMenuOpen(false)} role="menuitem">
                  👤 সাইন ইন
                </Link>
                <Link href="/signup" onClick={() => setMenuOpen(false)} role="menuitem">
                  অ্যাকাউন্ট তৈরি করুন
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <nav aria-label="পণ্যের বিভাগ" className="category-nav">
        <div className="shell category-nav-inner">
          {categories.map((category) => (
            <Link
              aria-current={pathname === `/category/${category.slug}` ? "page" : undefined}
              className={`category-nav-link${pathname === `/category/${category.slug}` ? " is-active" : ""}`}
              href={`/category/${category.slug}`}
              key={category.slug}
            >
              <span aria-hidden="true">{category.icon}</span>
              <span>{category.name}</span>
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
