import { PageHero } from "@/components/ui/PageHero";

export default function FavoritosPage() {
  return (
    <main className="flex flex-1 flex-col">
      <PageHero
        title="Favoritos"
        description="Aquí aparecerán los artículos que hayas guardado."
      />
    </main>
  );
}
