export const categories = [
  { slug: "chal", name: "চাল", icon: "🍚" },
  { slug: "dal", name: "ডাল", icon: "🫘" },
  { slug: "tel", name: "তেল", icon: "🛢️" },
  { slug: "sobji", name: "সবজি", icon: "🥬" },
  { slug: "mach", name: "মাছ", icon: "🐟" },
  { slug: "mangsho", name: "মাংস", icon: "🍗" },
  { slug: "dudh-dim", name: "ডিম-দুধ", icon: "🥛" },
  { slug: "moshla", name: "মসলা", icon: "🌶️" },
];

export const products = [
  { slug: "swarnachini-rice", name: "স্বর্ণচিনি চাল", category: "chal", emoji: "🍚", unit: "কেজি", price: 148, change: 2.6 },
  { slug: "miniket-rice", name: "মিনিকেট চাল", category: "chal", emoji: "🍚", unit: "কেজি", price: 99, change: -2.9 },
  { slug: "nazirshail-rice", name: "নাজির চাল", category: "chal", emoji: "🍚", unit: "কেজি", price: 74, change: 0 },
  { slug: "basmati-rice", name: "বাসমতি সাইজ চাল", category: "chal", emoji: "🍚", unit: "কেজি", price: 66, change: 3.6 },
  { slug: "masoor-dal", name: "মসুর ডাল", category: "dal", emoji: "🫘", unit: "কেজি", price: 142, change: 2.9 },
  { slug: "moong-dal", name: "মুগ ডাল", category: "dal", emoji: "🫘", unit: "কেজি", price: 135, change: 0 },
  { slug: "chola", name: "ছোলা", category: "dal", emoji: "🫘", unit: "কেজি", price: 120, change: -2.4 },
  { slug: "aman-dal", name: "আমন ডাল (খোসাছাড়া)", category: "dal", emoji: "🫘", unit: "কেজি", price: 156, change: 3.6 },
  { slug: "mustard-oil", name: "সরিষার তেল", category: "tel", emoji: "🫙", unit: "লিটার", price: 192, change: 2.4 },
  { slug: "palm-oil", name: "পাম তেল", category: "tel", emoji: "🛢️", unit: "লিটার", price: 188, change: -2.3 },
  { slug: "soybean-oil", name: "সয়াবিন তেল", category: "tel", emoji: "🫙", unit: "লিটার", price: 192, change: 1.6 },
  { slug: "rice-bran-oil", name: "রাইস ব্র্যান তেল", category: "tel", emoji: "🫙", unit: "লিটার", price: 225, change: 4.8 },
  { slug: "onion", name: "পেঁয়াজ", category: "sobji", emoji: "🧅", unit: "কেজি", price: 54, change: 5.2 },
  { slug: "ginger", name: "আদা", category: "sobji", emoji: "🫚", unit: "কেজি", price: 85, change: 9.0 },
  { slug: "eggplant", name: "বেগুন", category: "sobji", emoji: "🍆", unit: "কেজি", price: 44, change: 4.8 },
  { slug: "green-chili", name: "কাঁচামরিচ", category: "sobji", emoji: "🌶️", unit: "কেজি", price: 91, change: -3.8 },
  { slug: "garlic", name: "রসুন", category: "sobji", emoji: "🧄", unit: "কেজি", price: 125, change: -4.8 },
  { slug: "potato", name: "আলু", category: "sobji", emoji: "🥔", unit: "কেজি", price: 30, change: -6.6 },
  { slug: "rui-fish", name: "রুই মাছ", category: "mach", emoji: "🐟", unit: "কেজি", price: 43, change: 4.5 },
  { slug: "katla-fish", name: "কাতলা মাছ", category: "mach", emoji: "🐠", unit: "কেজি", price: 42, change: -4.8 },
  { slug: "tilapia", name: "তেলাপিয়া", category: "mach", emoji: "🐟", unit: "কেজি", price: 63, change: 0 },
  { slug: "hilsa", name: "ইলিশ মাছ", category: "mach", emoji: "🐟", unit: "কেজি", price: 1850, change: 8.5 },
  { slug: "broiler-chicken", name: "ব্রয়লার মুরগি", category: "mangsho", emoji: "🍗", unit: "কেজি", price: 225, change: -3.6 },
  { slug: "beef", name: "গরুর মাংস", category: "mangsho", emoji: "🥩", unit: "কেজি", price: 790, change: -1.2 },
  { slug: "mutton", name: "খাসির মাংস", category: "mangsho", emoji: "🍖", unit: "কেজি", price: 1290, change: -2.0 },
  { slug: "eggs", name: "ডিম", category: "dudh-dim", emoji: "🥚", unit: "ডজন", price: 158, change: 3.9 },
  { slug: "milk", name: "দুধ", category: "dudh-dim", emoji: "🥛", unit: "লিটার", price: 102, change: 2.0 },
  { slug: "butter", name: "মাখন (১০০ গ্রাম)", category: "dudh-dim", emoji: "🧈", unit: "পিস", price: 145, change: 3.6 },
  { slug: "turmeric", name: "হলুদ গুঁড়া", category: "moshla", emoji: "🌿", unit: "কেজি", price: 265, change: 0 },
  { slug: "cumin", name: "জিরা", category: "moshla", emoji: "🫙", unit: "কেজি", price: 680, change: -2.3 },
];

export const categoryBySlug = Object.fromEntries(
  categories.map((category) => [category.slug, category]),
);

export function formatBanglaNumber(value) {
  return new Intl.NumberFormat("bn-BD", { maximumFractionDigits: 1 }).format(value);
}

export function formatTaka(value) {
  return `${formatBanglaNumber(value)} টাকা`;
}

export function getBanglaDate() {
  return new Intl.DateTimeFormat("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(new Date());
}

export function getProductChangeLabel(change) {
  if (!change) return "— ০.০%";
  const arrow = change > 0 ? "▲" : change < 0 ? "▼" : "—";
  return `${arrow} ${formatBanglaNumber(Math.abs(change))}%`;
}

export const risingProducts = [...products]
  .filter((product) => product.change > 0)
  .sort((left, right) => right.change - left.change)
  .slice(0, 6);

export const fallingProducts = [...products]
  .filter((product) => product.change < 0)
  .sort((left, right) => left.change - right.change)
  .slice(0, 6);
