type CatalogItem = {
  title: string;
  imageSrc: string;
  downloadHref: string;
  downloadName: string;
};

const CATALOGS: CatalogItem[] = [
  {
    title: "QUIBROPETS",
    imageSrc: "/images/catalogs/quibro.jpg",
    downloadHref: "/catalogs/quibro.pdf",
    downloadName: "catalogo-quibro.pdf",
  },
  {
    title: "FERRIBIELLA",
    imageSrc: "/images/catalogs/ferribiella.jpg",
    downloadHref: "/catalogs/ferribiella.pdf",
    downloadName: "catalogo-ferribiella.pdf",
  },
];

export function CatalogBanner() {
  return (
    <section className="grid w-full grid-cols-1 bg-black md:grid-cols-2">
      {CATALOGS.map((catalog) => (
        <a
          key={catalog.title}
          href={catalog.downloadHref}
          download={catalog.downloadName}
          className="group relative block aspect-[4/5] overflow-hidden bg-zinc-900 md:aspect-[4/5]"
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url(${catalog.imageSrc})` }}
            aria-hidden="true"
          />

          <div
            className="absolute inset-0 bg-black/25 transition-colors duration-300 group-hover:bg-black/35"
            aria-hidden="true"
          />

          <span className="absolute bottom-4 left-4 font-montserrat text-sm font-bold tracking-wide text-white uppercase sm:bottom-5 sm:left-5 sm:text-base lg:text-lg">
            {catalog.title}
          </span>
        </a>
      ))}
    </section>
  );
}
