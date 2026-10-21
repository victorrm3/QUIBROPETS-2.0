import { CategoryImageGrid } from "@/components/categories/CategoryImageGrid";
import { STORE_BRANDS } from "@/lib/store-categories";

export default function TiendaPage() {
  return (
    <main className="flex flex-1 flex-col">
      <CategoryImageGrid categories={STORE_BRANDS} />
    </main>
  );
}
