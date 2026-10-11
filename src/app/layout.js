import SiteHeader from "@/components/site-header";
import PriceTicker from "@/components/price-ticker";
import SiteFooter from "@/components/site-footer";
import { getCatalogProducts } from "@/lib/catalog-api";
import "./globals.css";

export const metadata = {
  title: "বাজার দর — আজকের বাজারের দাম এক নজরে",
  description: "চাল, ডাল, তেল, সবজি, মাছ ও নিত্যপ্রয়োজনীয় পণ্যের বাজারদর তুলনা করুন।",
};

export default async function RootLayout({ children }) {
  const { products } = await getCatalogProducts();

  return (
    <html lang="bn" className="h-full antialiased">
      <body className="app-body">
        <SiteHeader />
        <PriceTicker products={products} />
        <div className="app-content">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
