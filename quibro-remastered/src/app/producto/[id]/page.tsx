import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/products/ProductDetail";
import type { Product } from "@/lib/products";
import { AUTH_COOKIE, AUTH_TOKEN_COOKIE } from "@/lib/auth";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://127.0.0.1:8000/api";

async function fetchProduct(
  id: string,
  token?: string,
): Promise<Product | null> {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: "no-store",
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      return null;
    }

    const json = (await response.json()) as { data?: Product };
    return json.data ?? null;
  } catch {
    return null;
  }
}

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const cookieStore = await cookies();
  const isAuthenticated = Boolean(cookieStore.get(AUTH_COOKIE)?.value);
  const token = cookieStore.get(AUTH_TOKEN_COOKIE)?.value;
  const product = await fetchProduct(id, token);

  if (!product) {
    notFound();
  }

  return (
    <main className="flex flex-1 flex-col bg-black">
      <ProductDetail product={product} showPrice={isAuthenticated} />
    </main>
  );
}
