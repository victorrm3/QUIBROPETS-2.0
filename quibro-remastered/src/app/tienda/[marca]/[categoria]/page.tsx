import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { ProductCatalog } from "@/components/products/ProductCatalog";
import { StoreNav } from "@/components/store/StoreNav";
import { PageHero } from "@/components/ui/PageHero";
import { AUTH_COOKIE, AUTH_TOKEN_COOKIE } from "@/lib/auth";
import type { Product } from "@/lib/products";
import {
  getBrandBySlug,
  getQuibropetsCategoryBySlug,
} from "@/lib/store-categories";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://127.0.0.1:8000/api";

async function fetchCategoryProducts(
  denominaciones: string[],
  token?: string,
): Promise<Product[]> {
  if (denominaciones.length === 0) {
    return [];
  }

  const params = new URLSearchParams({
    proveedor: "QUIBROPETS",
    denominacion: denominaciones.join(","),
  });

  try {
    const response = await fetch(`${API_URL}/products?${params.toString()}`, {
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const json = (await response.json()) as { data?: Product[] };
    return json.data ?? [];
  } catch {
    return [];
  }
}

type TiendaCategoriaPageProps = {
  params: Promise<{ marca: string; categoria: string }>;
};

export default async function TiendaCategoriaPage({
  params,
}: TiendaCategoriaPageProps) {
  const { marca, categoria } = await params;
  const brand = getBrandBySlug(marca);

  if (!brand) {
    notFound();
  }

  if (marca !== "quibropets") {
    return (
      <main className="flex flex-1 flex-col">
        <PageHero
          title={brand.title}
          description="Esta sección estará disponible próximamente."
        />
      </main>
    );
  }

  const category = getQuibropetsCategoryBySlug(categoria);

  if (!category) {
    notFound();
  }

  const cookieStore = await cookies();
  const isAuthenticated = Boolean(cookieStore.get(AUTH_COOKIE)?.value);
  const token = cookieStore.get(AUTH_TOKEN_COOKIE)?.value;
  const products = await fetchCategoryProducts(category.denominaciones, token);

  return (
    <main className="flex flex-1 flex-col bg-black">
      <StoreNav
        backHref={`/tienda/${marca}`}
        backLabel="Volver a categorías"
        title={category.title}
        subtitle={`${products.length} producto${products.length === 1 ? "" : "s"}`}
      />

      <ProductCatalog products={products} showPrice={isAuthenticated} />
    </main>
  );
}
