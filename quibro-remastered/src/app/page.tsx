import { cookies } from "next/headers";
import { CatalogBanner } from "@/components/catalogs/CatalogBanner";
import { CategoryGrid } from "@/components/categories/CategoryGrid";
import { Hero } from "@/components/hero/Hero";
import { ProductGrid } from "@/components/products/ProductGrid";
import type { Product } from "@/components/products/ProductCard";
import { AUTH_COOKIE, AUTH_TOKEN_COOKIE } from "@/lib/auth";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://127.0.0.1:8000/api";

const HOME_PRODUCT_IDS = [
  55, 1653, 136, 469, 492, 639, 1510, 209, 1512, 556, 1588, 1538, 1549, 1601,
  1596,
];

async function fetchProducts(token?: string): Promise<Product[]> {
  try {
    const response = await fetch(
      `${API_URL}/products?ids=${HOME_PRODUCT_IDS.join(",")}`,
      {
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return [];
    }

    const json = (await response.json()) as { data?: Product[] };
    return json.data ?? [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const cookieStore = await cookies();
  const isAuthenticated = Boolean(cookieStore.get(AUTH_COOKIE)?.value);
  const token = cookieStore.get(AUTH_TOKEN_COOKIE)?.value;
  const products = await fetchProducts(token);

  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <CategoryGrid />
      <ProductGrid products={products} showPrice={isAuthenticated} />
      <CatalogBanner />
    </main>
  );
}
