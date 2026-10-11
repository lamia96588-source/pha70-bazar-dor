import Link from "next/link";
import { getProductChangeLabel, formatTaka } from "@/lib/catalog-data";

function TickerItems({ interactive = true, products }) {
  return products.slice(0, 12).map((product, index) => (
    interactive ? (
      <Link className="ticker-item" href={`/product/${product.slug}`} key={`${product.slug}-${index}`}>
        <TickerItemContent product={product} />
      </Link>
    ) : (
      <span className="ticker-item" key={`${product.slug}-${index}`}>
        <TickerItemContent product={product} />
      </span>
    )
  ));
}

function TickerItemContent({ product }) {
  return (
    <>
      <span aria-hidden="true">{product.emoji}</span>
      <span>{product.name}</span>
      <span>{formatTaka(product.price)}/{product.unit}</span>
      <span className={product.change > 0 ? "price-change is-up" : product.change < 0 ? "price-change is-down" : "price-change is-flat"}>
        {getProductChangeLabel(product.change)}
      </span>
    </>
  );
}

export default function PriceTicker({ products }) {
  return (
    <div aria-label="আজকের পণ্যের দাম" className="ticker" role="region">
      <div className="ticker-track">
        <div className="ticker-group"><TickerItems products={products} /></div>
        <div aria-hidden="true" className="ticker-group"><TickerItems interactive={false} products={products} /></div>
      </div>
    </div>
  );
}
