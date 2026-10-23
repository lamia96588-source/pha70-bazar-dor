import Link from "next/link";
import { notFound } from "next/navigation";
import { getCatalogProducts } from "@/lib/catalog-api";
import { requireAuthenticatedUser } from "@/lib/session";
import {
  categoryBySlug,
  formatBanglaNumber,
  formatTaka,
  getProductChangeLabel,
} from "@/lib/catalog-data";

function getPriceRange(product) {
  const marketPrices = product.marketPrices ?? [];
  const minimum = marketPrices.length
    ? Math.min(...marketPrices.map((market) => market.minimumPrice))
    : product.minimumPrice ?? product.price;
  const maximum = marketPrices.length
    ? Math.max(...marketPrices.map((market) => market.maximumPrice))
    : product.maximumPrice ?? product.price;
  const average = product.averagePrice
    ?? (marketPrices.length
      ? marketPrices.reduce((sum, market) => sum + market.averagePrice, 0) / marketPrices.length
      : product.price);

  return { minimum, maximum, average };
}

function getMarketsByDivision(marketPrices) {
  return (marketPrices ?? []).reduce((groups, market) => {
    const division = market.division?.trim() || "অন্যান্য";
    if (!groups[division]) groups[division] = [];
    groups[division].push(market);
    return groups;
  }, {});
}

function HistoryRow({ label, value, unit, isToday }) {
  return (
    <div className={`history-row${isToday ? " is-today" : ""}`}>
      <span>{label}</span>
      <strong>{value === null || value === undefined ? "—" : `${formatBanglaNumber(value)} টাকা`}</strong>
      <small>{isToday ? `প্রতি ${unit} · আজ` : `প্রতি ${unit}`}</small>
    </div>
  );
}
function PriceStat({ label, value, tone, caption }) {
  return (
    <div className="price-stat-card">
      <span>{label}</span>
      <strong className={tone}>{formatTaka(value)}</strong>
      <small>{caption}</small>
    </div>
  );
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { products } = await getCatalogProducts();
  const product = products.find((item) => item.slug === slug);

  if (!product) notFound();

  return {
    title: `${product.name} — বাজার দর`,
    description: `${product.name}-এর আজকের বাজারদর ও বাজারভিত্তিক তুলনা দেখুন।`,
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  await requireAuthenticatedUser(`/product/${encodeURIComponent(slug)}`);
  const catalog = await getCatalogProducts();
  const product = catalog.products.find((item) => item.slug === slug);
  if (!product) notFound();

  const category = categoryBySlug[product.category];
  const categoryName = category?.name ?? "পণ্য";
  const { minimum, maximum, average } = getPriceRange(product);
  const changeClass = product.change > 0 ? "is-up" : product.change < 0 ? "is-down" : "is-flat";
  const movement = product.change > 0 ? "দাম বেড়েছে" : product.change < 0 ? "দাম কমেছে" : "দাম অপরিবর্তিত";
  const movementAmount = product.changeAmount !== null && product.changeAmount !== undefined
    ? `${formatBanglaNumber(Math.abs(product.changeAmount))} টাকা`
    : `${formatBanglaNumber(Math.abs(product.change ?? 0))}%`;

  const marketsByDivision = getMarketsByDivision(product.marketPrices);
  const divisionNames = Object.keys(marketsByDivision).sort((a, b) => a.localeCompare(b, "bn"));
  const historyEntries = [
    { label: "আজ", value: product.price, isToday: true },
    { label: "গতকাল", value: product.yesterday },
    { label: "গত সপ্তাহ", value: product.lastWeek },
    { label: "গত মাস", value: product.lastMonth },
  ];
  const hasHistory = historyEntries.some((entry) => entry.value !== null && entry.value !== undefined);

  return (
    <main className="shell product-detail-main">
      <nav aria-label="ব্রেডক্রাম্ব" className="breadcrumbs">
        <Link href="/">হোম</Link>
        <span aria-hidden="true">›</span>
        {category ? <Link href={`/category/${category.slug}`}>{category.name}</Link> : <span>{categoryName}</span>}
        <span aria-hidden="true">›</span>
        <span aria-current="page">{product.name}</span>
      </nav>

      <section aria-labelledby="product-title" className="product-summary-card">
        <span aria-hidden="true" className="product-summary-icon">{product.emoji}</span>
        <div className="product-summary-copy">
          <h1 id="product-title">{product.name}</h1>
          <p>প্রতি {product.unit} · {categoryName}</p>
          <p className={`product-movement ${changeClass}`}>
            গতকালের তুলনায় আজ দাম {movement} · {movementAmount}
          </p>
        </div>
        <div className="current-price-card">
          <span>আজকের দাম</span>
          <strong>{formatBanglaNumber(product.price)}</strong>
          <span>টাকা / {product.unit}</span>
          <small className={changeClass}>{getProductChangeLabel(product.change)}</small>
        </div>
      </section>

      <section aria-labelledby="price-overview-title" className="price-overview-card">
        <div className="price-overview-heading">
          <h2 id="price-overview-title">দামের সারসংক্ষেপ</h2>
          {catalog.source === "sample" ? <span>নমুনা তথ্য</span> : null}
        </div>

        <div className="price-stat-grid">
          <PriceStat caption="সবচেয়ে কম দামের বাজার" label="সর্বনিম্ন দাম" tone="is-down" value={minimum} />
          <PriceStat caption="সবচেয়ে বেশি দামের বাজার" label="সর্বোচ্চ দাম" tone="is-up" value={maximum} />
          <PriceStat caption={`প্রতি ${product.unit}-এর হিসাবে`} label="গড় দাম" tone="is-down" value={average} />
        </div>

        <div className="market-prices-heading">
          <h2>বাজারভিত্তিক আজকের দাম</h2>
          <span>সব দাম {product.unit} অনুযায়ী</span>
        </div>

        {product.marketPrices?.length ? (
          <div className="division-groups">
            {divisionNames.map((division) => (
              <section aria-label={`${division} বিভাগের বাজার`} className="division-group" key={division}>
                <h3 className="division-title">{division} বিভাগ</h3>
                <div className="market-table-scroll">
                  <table className="market-price-table">
                    <thead>
                      <tr>
                        <th scope="col">বাজার</th>
                        <th scope="col">সর্বনিম্ন</th>
                        <th scope="col">সর্বোচ্চ</th>
                        <th scope="col">গড়</th>
                      </tr>
                    </thead>
                    <tbody>
                      {marketsByDivision[division].map((market) => (
                        <tr key={market.id ?? `${market.market}-${market.division}`}>
                          <td>{market.market}</td>
                          <td>{formatTaka(market.minimumPrice)}</td>
                          <td>{formatTaka(market.maximumPrice)}</td>
                          <td><strong>{formatTaka(market.averagePrice)}</strong></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="market-prices-empty">
            {catalog.source === "sample"
              ? "এই নমুনা পণ্যের জন্য বাজারভিত্তিক দাম নেই।"
              : "এই পণ্যের জন্য এখনো বাজারভিত্তিক দাম পাওয়া যায়নি।"}
          </div>
        )}

        <div className="market-prices-heading">
          <h2>দামের ইতিহাস</h2>
          <span>আজ, গতকাল, গত সপ্তাহ ও গত মাস</span>
        </div>

        {hasHistory ? (
          <div className="history-grid">
            {historyEntries.map((entry) => (
              <HistoryRow key={entry.label} label={entry.label} unit={product.unit} value={entry.value} isToday={entry.isToday} />
            ))}
          </div>
        ) : (
          <div className="market-prices-empty">
            এই পণ্যের জন্য পুরনো দামের তথ্য পাওয়া যায়নি।
          </div>
        )}
      </section>
    </main>
  );
}
