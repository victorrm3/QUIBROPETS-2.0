import { PageHero } from "@/components/ui/PageHero";

const COLLECTION_COPY: Record<string, { title: string; description: string }> =
  {
    quibropets: {
      title: "QuibroPets",
      description: "La colección propia de QuibroPets para tu mascota.",
    },
    ferribiella: {
      title: "Ferribiella",
      description: "Productos Ferribiella seleccionados para tu compañero.",
    },
    treponti: {
      title: "Treponti",
      description: "Accesorios y artículos de la marca Treponti.",
    },
    piensos: {
      title: "Piensos",
      description: "Alimentación y piensos para el día a día de tu mascota.",
    },
  };

type ColeccionPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ColeccionPage({ params }: ColeccionPageProps) {
  const { slug } = await params;
  const collection = COLLECTION_COPY[slug] ?? {
    title: slug.replace(/-/g, " "),
    description: "Colección en preparación.",
  };

  return (
    <main className="flex flex-1 flex-col">
      <PageHero
        title={collection.title}
        description={collection.description}
      />
    </main>
  );
}
