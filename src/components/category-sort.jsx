"use client";

import { usePathname, useRouter } from "next/navigation";

export default function CategorySort({ sort }) {
  const pathname = usePathname();
  const router = useRouter();

  function updateSort(event) {
    const query = new URLSearchParams(window.location.search);
    const nextSort = event.target.value;

    if (nextSort === "default") {
      query.delete("sort");
    } else {
      query.set("sort", nextSort);
    }

    const queryString = query.toString();
    router.push(`${pathname}${queryString ? `?${queryString}` : ""}`);
  }

  return (
    <div className="category-sort-control">
      <label htmlFor="category-sort">সাজান</label>
      <select id="category-sort" onChange={updateSort} value={sort}>
        <option value="default">ডিফল্ট</option>
        <option value="price-asc">দাম: কম থেকে বেশি</option>
        <option value="price-desc">দাম: বেশি থেকে কম</option>
      </select>
    </div>
  );
}
