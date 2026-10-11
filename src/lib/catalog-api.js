import { categories, sampleProducts } from "@/lib/catalog-data";

const DEFAULT_API_BASE_URL = "https://openapi.programming-hero.com/api/bazardor";
const PRODUCT_COLLECTION_KEYS = ["products", "items", "records", "results", "data", "result"];
const PRODUCT_NAME_KEYS = ["name", "productName", "product_name", "title", "bnName", "banglaName", "itemName"];
const PRODUCT_PRICE_KEYS = [
  "price",
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
  const value = firstDefined(record, [
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
  return toNumber(value) ?? 0;
}

function categoryFor(value) {
  const candidate = typeof value === "object" && value !== null
    ? firstDefined(value, ["slug", "name", "title", "categoryName"])
    : value;
  if (!candidate) return null;

  const normalized = String(candidate).trim().toLocaleLowerCase("bn-BD");
  const aliases = {
    chal: ["rice", "চাল"],
    dal: ["lentil", "pulse", "ডাল"],
    tel: ["oil", "তেল"],
    sobji: ["vegetable", "সবজি"],
    mach: ["fish", "মাছ"],
    mangsho: ["meat", "chicken", "মাংস"],
    "dudh-dim": ["milk", "egg", "দুধ", "ডিম"],
    moshla: ["spice", "মসলা", "মসলা"],
  };

  return categories.find((category) => {
    if (category.slug === normalized || category.name === candidate) return true;
    return aliases[category.slug]?.some((alias) => normalized.includes(alias));
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

  return {
    slug,
    name,
    category: category?.slug ?? (typeof categoryValue === "string" ? makeSlug(categoryValue, index) : "other"),
    emoji: String(firstDefined(record, ["emoji", "icon"]) ?? knownProduct?.emoji ?? category?.icon ?? "🛒"),
    unit: String(firstDefined(record, ["unit", "measurementUnit", "measurement_unit", "priceUnit", "price_unit"]) ?? knownProduct?.unit ?? "কেজি"),
    price,
    change: toChange(record),
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
