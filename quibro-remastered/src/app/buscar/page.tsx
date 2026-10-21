import { PageHero } from "@/components/ui/PageHero";

type BuscarPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function BuscarPage({ searchParams }: BuscarPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  return (
    <main className="flex flex-1 flex-col">
      <PageHero
        title="Buscar"
        description={
          query
            ? `Resultados para “${query}”.`
            : "Escribe algo en la barra de búsqueda del header."
        }
      />
    </main>
  );
}
