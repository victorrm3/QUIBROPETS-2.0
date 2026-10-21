import { CategoryImageGrid } from "@/components/categories/CategoryImageGrid";
import { STORE_BRANDS } from "@/lib/store-categories";

export function CategoryGrid() {
  return <CategoryImageGrid categories={STORE_BRANDS} />;
}
