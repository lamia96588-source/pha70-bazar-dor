import ProductCard from "@/components/product-card";
import CategorySort from "@/components/category-sort";
import { getCatalogProducts } from "@/lib/catalog-api";
import { categories, categoryBySlug, formatBanglaNumber } from "@/lib/catalog-data";
import { notFound } from "next/navigation";

const supportedSorts = new Set(["default", "price-asc", "price-desc", "change-desc", "change-asc"]);

function sortProducts(products, sort) {
  const sorted = [...products];

  switch (sort) {
    case "price-asc":
      return sorted.sort((left, right) => left.price - right.price);
    case "price-desc":
      return sorted.sort((left, right) => right.price - left.price);
    case "change-desc":
      return sorted.sort((left, right) => right.change - left.change);
    case "change-asc":
      return sorted.sort((left, right) => left.change - right.change);
    default:
      return sorted;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = categoryBySlug[slug];

  if (!category) return { title: "বিভাগ পাওয়া যায়নি — বাজার দর" };
  return {
    title: `${category.name} — বাজার দর`,
    description: `${category.name} বিভাগের আজকের বাজারদর দেখুন।`,
  };
}

export default async function CategoryPage({ params, searchParams }) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const category = categoryBySlug[slug];
  if (!category) notFound();

  const requestedSort = typeof query.sort === "string" ? query.sort : "default";
  const sort = supportedSorts.has(requestedSort) ? requestedSort : "default";
  const catalog = await getCatalogProducts({ category: category.slug });
  const products = sortProducts(catalog.products, sort);

  return (
    <main className="shell category-main">
      <section aria-labelledby="category-title" className="category-intro-card">
        <span aria-hidden="true" className="category-intro-icon">{category.icon}</span>
        <div>
          <h1 id="category-title">{category.name}</h1>
          <p>{formatBanglaNumber(products.length)}টি পণ্যের আজকের দাম ও পরিবর্তন</p>
        </div>
      </section>

      <section aria-label="পণ্য সাজানোর বিকল্প" className="category-toolbar">
        <CategorySort sort={sort} />
      </section>

      <div className="category-results-summary">
        <p>
          মোট {formatBanglaNumber(products.length)}টি পণ্য দেখানো হচ্ছে
          {catalog.source === "sample" ? <span> · নমুনা মূল্য</span> : null}
        </p>
      </div>

      {products.length ? (
        <div className="product-grid category-product-grid">
          {products.map((product) => <ProductCard key={product.slug} product={product} />)}
        </div>
      ) : (
        <div className="category-empty-state">
          <span aria-hidden="true">{category.icon}</span>
          <p>এই বিভাগে এখনো কোনো পণ্যের দাম পাওয়া যায়নি।</p>
        </div>
      )}
    </main>
  );
}

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}
