import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/product-card";
import { getCatalogProducts } from "@/lib/catalog-api";
import {
  formatBanglaNumber,
  getBanglaDate,
  getFallingProducts,
  getRisingProducts,
} from "@/lib/catalog-data";

function ProductSection({ direction, products: sectionProducts }) {
  const isUp = direction === "up";
  const title = isUp ? "আজ দাম বেড়েছে" : "আজ দাম কমেছে";

  return (
    <section aria-labelledby={`${direction}-heading`} className="product-section">
      <div className="section-heading-row">
        <h2 className="section-title" id={`${direction}-heading`}>
          <span aria-hidden="true" className={isUp ? "trend-mark is-up" : "trend-mark is-down"}>
            {isUp ? "▲" : "▼"}
          </span>
          {title}
        </h2>
      </div>
      <div className="product-grid">
        {sectionProducts.map((product) => <ProductCard key={product.slug} product={product} />)}
      </div>
    </section>
  );
}

export default async function Home() {
  const catalog = await getCatalogProducts();
  const { products } = catalog;
  const risingProducts = getRisingProducts(products);
  const fallingProducts = getFallingProducts(products);

  return (
    <main className="shell home-main">
      <section aria-labelledby="home-title" className="hero-card">
        <div className="hero-copy">
          <span className="date-chip">{getBanglaDate()}</span>
          <h1 id="home-title">আজকের বাজারের দাম এক নজরে</h1>
          <p>
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত,
            গড়, সর্বনিম্ন-সর্বোচ্চ এবং দামের পরিবর্তন এক জায়গায়।
          </p>
          <Link className="button button-primary hero-button" href="#সব-পণ্য">
            সব পণ্য দেখুন
          </Link>
        </div>
        <Image
          alt="বাজারের তাজা পণ্যের ঝুড়ি"
          className="hero-art"
          height={256}
          priority
          src="/bazar-hero.png"
          width={288}
        />
      </section>

      <ProductSection direction="up" products={risingProducts} />
      <ProductSection direction="down" products={fallingProducts} />

      <section aria-labelledby="all-products-heading" className="product-section all-products-section" id="সব-পণ্য">
        <div className="all-products-heading">
          <div>
            <h2 className="section-title" id="all-products-heading">সব পণ্য</h2>
            <p className="section-subtitle">মোট {formatBanglaNumber(products.length)}টি পণ্য দেখানো হচ্ছে</p>
          </div>
          <span className="sample-data-note">
            {catalog.source === "api" ? "সর্বশেষ API মূল্য" : "নমুনা মূল্য"}
          </span>
        </div>
        <div className="product-grid">
          {products.map((product) => <ProductCard key={product.slug} product={product} />)}
        </div>
      </section>
    </main>
  );
}
