import { categories, sampleProducts } from "@/lib/catalog-data";

const DEFAULT_API_BASE_URL = "https://openapi.programming-hero.com/api/bazardor";
const PRODUCT_COLLECTION_KEYS = ["products", "items", "records", "results", "data", "result"];
const PRODUCT_NAME_KEYS = ["name", "nameBn", "productName", "product_name", "title", "bnName", "banglaName", "itemName"];
const PRODUCT_PRICE_KEYS = [
  "price",
  "today",
  "currentPrice",
  "current_price",
  "averagePrice",
  "average_price",
  "avgPrice",
  "avg_price",
  "marketAverage",
  "market_average",
  "pricePerUnit",
  "minPrice",
  "min_price",
  "latestPrice",
];

function firstDefined(record, keys) {
  for (const key of keys) {
    if (record?.[key] !== undefined && record[key] !== null && record[key] !== "") {
      return record[key];
    }
  }

  return undefined;
}

function hasProductPrice(record) {
  return PRODUCT_PRICE_KEYS.some((key) => record?.[key] !== undefined && record[key] !== null);
}

function isProductRecord(record) {
  return record && typeof record === "object" && !Array.isArray(record)
    && firstDefined(record, PRODUCT_NAME_KEYS) !== undefined
    && hasProductPrice(record);
}

function findProductRecords(payload, depth = 0) {
  if (depth > 6 || payload === null || payload === undefined) return [];

  if (Array.isArray(payload)) {
    if (payload.some(isProductRecord)) return payload.filter(isProductRecord);
    return payload.flatMap((value) => findProductRecords(value, depth + 1));
  }

  if (typeof payload !== "object") return [];

  for (const key of PRODUCT_COLLECTION_KEYS) {
    const records = findProductRecords(payload[key], depth + 1);
    if (records.length) return records;
  }

  for (const value of Object.values(payload)) {
    const records = findProductRecords(value, depth + 1);
    if (records.length) return records;
  }

  return [];
}

function toNumber(value) {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value !== "string") return null;

  const banglaDigits = "০১২৩৪৫৬৭৮৯";
  const normalized = value
    .replace(/[০-৯]/g, (digit) => String(banglaDigits.indexOf(digit)))
    .replace(/,/g, "");
  const match = normalized.match(/-?\d+(?:\.\d+)?/);
  if (!match) return null;

  const number = Number(match[0]);
  return Number.isFinite(number) ? number : null;
}

function toPrice(value, record) {
  if (value && typeof value === "object") {
    const average = toNumber(firstDefined(value, ["average", "avg", "mean", "price"]));
    if (average !== null) return average;

    const minimum = toNumber(firstDefined(value, ["minimum", "min", "low"]));
    const maximum = toNumber(firstDefined(value, ["maximum", "max", "high"]));
    if (minimum !== null && maximum !== null) return (minimum + maximum) / 2;
    if (minimum !== null) return minimum;
    if (maximum !== null) return maximum;
  }

  const directPrice = toNumber(value);
  if (directPrice !== null) return directPrice;

  const minimum = toNumber(firstDefined(record, ["minPrice", "min_price"]));
  const maximum = toNumber(firstDefined(record, ["maxPrice", "max_price"]));
  if (minimum !== null && maximum !== null) return (minimum + maximum) / 2;

  return minimum ?? maximum;
}

function toChange(record) {
  const rawValue = firstDefined(record, [
    "changePercent",
    "change_percent",
    "priceChangePercent",
    "price_change_percent",
    "percentageChange",
    "percentage_change",
    "trendPercent",
    "trend_percent",
    "change",
  ]);

  if (rawValue && typeof rawValue === "object") {
    const amount = toNumber(firstDefined(rawValue, ["pct", "percent", "percentage", "value"])) ?? 0;
    const direction = String(firstDefined(rawValue, ["dir", "direction", "trend"]) ?? "").toLowerCase();

    if (["down", "decrease", "decreasing", "negative", "-"] .some((value) => direction.includes(value))) {
      return -Math.abs(amount);
    }

    if (["up", "increase", "increasing", "positive", "+"] .some((value) => direction.includes(value))) {
      return Math.abs(amount);
    }

    return amount;
  }

  const value = rawValue;
  return toNumber(value) ?? 0;
}

function normalizeMarketPrices(record) {
  const values = firstDefined(record, [
    "marketPrices",
    "market_prices",
    "pricesByMarket",
    "prices_by_market",
    "marketData",
    "market_data",
    "markets",
  ]);
  if (!Array.isArray(values)) return [];

  return values.map((market, index) => {
    const name = firstDefined(market, ["market", "marketName", "market_name", "name", "bazaar", "bazar"]);
    if (!name) return null;

    const minimumPrice = toPrice(firstDefined(market, ["minimumPrice", "minimum_price", "minPrice", "min_price", "min"]), market);
    const maximumPrice = toPrice(firstDefined(market, ["maximumPrice", "maximum_price", "maxPrice", "max_price", "max"]), market);
    const averagePrice = toPrice(firstDefined(market, ["averagePrice", "average_price", "avgPrice", "avg_price", "average", "avg"]), market);
    const listedPrice = toPrice(firstDefined(market, ["price", "currentPrice", "current_price"]), market);
    const resolvedAverage = averagePrice ?? listedPrice
      ?? (minimumPrice !== null && maximumPrice !== null ? (minimumPrice + maximumPrice) / 2 : null);

    if (resolvedAverage === null && minimumPrice === null && maximumPrice === null) return null;

    return {
      id: String(firstDefined(market, ["id", "_id"]) ?? `${name}-${index}`),
      market: String(name),
      division: String(firstDefined(market, ["division", "district", "region", "area", "location"]) ?? "—"),
      minimumPrice: minimumPrice ?? resolvedAverage ?? maximumPrice,
      maximumPrice: maximumPrice ?? resolvedAverage ?? minimumPrice,
      averagePrice: resolvedAverage ?? minimumPrice ?? maximumPrice,
    };
  }).filter(Boolean);
}

function categoryFor(value) {
  const candidate = typeof value === "object" && value !== null
    ? firstDefined(value, ["slug", "name", "title", "categoryName"])
    : value;
  if (!candidate) return null;

  const normalized = String(candidate).trim().toLocaleLowerCase("bn-BD");
  const compact = normalized.replace(/[-_\s]+/g, "");
  const canonicalSlugAliases = {
    "dim-dui": "dudh-dim",
    dimdui: "dudh-dim",
    dudhdim: "dudh-dim",
    "dudh-dhim": "dudh-dim",
    mosla: "moshla",
    moshla: "moshla",
  };
  const resolvedSlug = canonicalSlugAliases[normalized] ?? canonicalSlugAliases[compact] ?? normalized;
  const aliases = {
    chal: ["rice", "চাল", "chal"],
    dal: ["lentil", "pulse", "ডাল", "dal"],
    tel: ["oil", "তেল", "tel"],
    sobji: ["vegetable", "সবজি", "sobji"],
    mach: ["fish", "মাছ", "mach"],
    mangsho: ["meat", "chicken", "মাংস", "mangsho"],
    "dudh-dim": ["milk", "egg", "দুধ", "ডিম", "dim", "dud", "doi", "dudh", "doodh", "dudh-dim", "dim-dui"],
    moshla: ["spice", "মসলা", "mosla", "moshla", "morich", "holud", "ada", "roshun", "moshola"],
  };

  return categories.find((category) => {
    if (category.slug === resolvedSlug || category.slug === normalized || category.name === candidate) return true;
    return aliases[category.slug]?.some((alias) => resolvedSlug.includes(alias) || normalized.includes(alias));
  }) ?? null;
}

function makeSlug(value, index) {
  const slug = String(value ?? "")
    .normalize("NFKD")
    .toLocaleLowerCase("en-US")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return slug || `product-${index + 1}`;
}

function normalizeProduct(record, index) {
  const name = String(firstDefined(record, PRODUCT_NAME_KEYS) ?? "").trim();
  const rawPrice = firstDefined(record, PRODUCT_PRICE_KEYS);
  const price = toPrice(rawPrice, record);
  if (!name || price === null) return null;

  const categoryValue = firstDefined(record, ["category", "categoryName", "category_name", "group"]);
  const category = categoryFor(categoryValue);
  const identity = firstDefined(record, ["slug", "id", "_id", "productId", "product_id"]);
  const slug = makeSlug(identity ?? name, index);
  const knownProduct = sampleProducts.find((sample) => sample.slug === slug || sample.name === name);
  const marketPrices = normalizeMarketPrices(record);
  const minimumPrice = toPrice(firstDefined(record, ["minimumPrice", "minimum_price", "minPrice", "min_price"]), record);
  const maximumPrice = toPrice(firstDefined(record, ["maximumPrice", "maximum_price", "maxPrice", "max_price"]), record);
  const averagePrice = toPrice(firstDefined(record, ["averagePrice", "average_price", "avgPrice", "avg_price", "marketAverage", "market_average"]), record);
  const marketMinimum = marketPrices.length ? Math.min(...marketPrices.map((market) => market.minimumPrice)) : null;
  const marketMaximum = marketPrices.length ? Math.max(...marketPrices.map((market) => market.maximumPrice)) : null;
  const marketAverage = marketPrices.length
    ? marketPrices.reduce((sum, market) => sum + market.averagePrice, 0) / marketPrices.length
    : null;

  const rawUnit = String(firstDefined(record, ["unit", "measurementUnit", "measurement_unit", "priceUnit", "price_unit"]) ?? knownProduct?.unit ?? "কেজি");
  const unit = ({
    kg: "কেজি",
    kilogram: "কেজি",
    liter: "লিটার",
    litre: "লিটার",
    l: "লিটার",
    piece: "পিস",
    pieces: "পিস",
    pcs: "পিস",
    dozen: "ডজন",
  })[rawUnit.trim().toLowerCase()] ?? rawUnit;

  return {
    slug,
    name,
    category: category?.slug ?? (typeof categoryValue === "string" ? makeSlug(categoryValue, index) : "other"),
    emoji: String(firstDefined(record, ["emoji", "icon", "image"]) ?? knownProduct?.emoji ?? category?.icon ?? "🛒"),
    unit,
    price,
    yesterday: toNumber(firstDefined(record, ["yesterday", "yesterdayPrice", "yesterday_price", "prevPrice", "prev_price", "previousPrice"])),
    lastWeek: toNumber(firstDefined(record, ["lastWeek", "last_week", "lastWeekPrice", "last_week_price"])),
    lastMonth: toNumber(firstDefined(record, ["lastMonth", "last_month", "lastMonthPrice", "last_month_price"])),
    change: toChange(record),
    changeAmount: toNumber(firstDefined(record, ["changeAmount", "change_amount", "priceChangeAmount", "price_change_amount", "priceDifference", "price_difference"])),
    minimumPrice: minimumPrice ?? marketMinimum ?? price,
    maximumPrice: maximumPrice ?? marketMaximum ?? price,
    averagePrice: averagePrice ?? marketAverage ?? price,
    marketPrices,
  };
}

function getProductsEndpoint(category) {
  const baseUrl = (process.env.BAZARDOR_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/+$/, "");
  const endpoint = new URL(`${baseUrl}/products`);
  if (category) endpoint.searchParams.set("category", category);
  return endpoint.toString();
}

export async function getCatalogProducts({ category } = {}) {
  const fallbackProducts = category
    ? sampleProducts.filter((product) => product.category === category)
    : sampleProducts;

  try {
    const response = await fetch(getProductsEndpoint(category), {
      next: { revalidate: 300 },
    });
    if (!response.ok) throw new Error(`Catalog API returned HTTP ${response.status}`);

    const payload = await response.json();
    const records = findProductRecords(payload);
    const products = records
      .map((record, index) => normalizeProduct(record, index))
      .filter(Boolean)
      .filter((product) => !category || product.category === category);

    if (products.length) return { products, source: "api" };
    throw new Error("Catalog API response did not contain usable product prices");
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("BazarDor API unavailable; using sample catalog.", error.message);
    }
    return { products: fallbackProducts, source: "sample" };
  }
}
