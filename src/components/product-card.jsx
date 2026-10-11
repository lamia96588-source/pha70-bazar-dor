import Link from "next/link";
import { formatBanglaNumber, formatTaka, getProductChangeLabel } from "@/lib/catalog-data";

export default function ProductCard({ product }) {
  const changeClass = product.change > 0 ? "is-up" : product.change < 0 ? "is-down" : "is-flat";

  return (
    <Link className="product-card" href={`/product/${product.slug}`}>
      <div className="product-card-heading">
        <span aria-hidden="true" className="product-icon">{product.emoji}</span>
        <span className="product-card-name-wrap">
          <strong className="product-card-name">{product.name}</strong>
          <small>প্রতি {product.unit}</small>
        </span>
      </div>
      <div className="product-card-price-row">
        <div>
          <span className="price-caption">আজকের দাম</span>
          <strong className="product-price">{formatBanglaNumber(product.price)} <span>টাকা</span></strong>
        </div>
        <span className={`price-change ${changeClass}`}>
          {getProductChangeLabel(product.change)}
        </span>
      </div>
      <span className="visually-hidden">বিস্তারিত দেখুন, {formatTaka(product.price)}</span>
    </Link>
  );
}
