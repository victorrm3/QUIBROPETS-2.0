import { notFound } from "next/navigation";
import { CategoryImageGrid } from "@/components/categories/CategoryImageGrid";
import { StoreNav } from "@/components/store/StoreNav";
import { PageHero } from "@/components/ui/PageHero";
import {
  getBrandBySlug,
  QUIBROPETS_CATEGORIES,
} from "@/lib/store-categories";

type TiendaMarcaPageProps = {
  params: Promise<{ marca: string }>;
};

export default async function TiendaMarcaPage({ params }: TiendaMarcaPageProps) {
  const { marca } = await params;
  const brand = getBrandBySlug(marca);

  if (!brand) {
    notFound();
  }

  if (marca === "quibropets") {
    return (
      <main className="flex flex-1 flex-col bg-black">
        <StoreNav
          backHref="/tienda"
          backLabel="Volver a marcas"
          title={brand.title}
          subtitle="Elige una categoría"
        />
        <CategoryImageGrid categories={QUIBROPETS_CATEGORIES} />
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col bg-black">
      <StoreNav backHref="/tienda" backLabel="Volver a marcas" />
      <PageHero
        title={brand.title}
        description="Esta sección estará disponible próximamente."
      />
    </main>
  );
}
