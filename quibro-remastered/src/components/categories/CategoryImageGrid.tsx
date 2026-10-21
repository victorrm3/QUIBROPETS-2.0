import Link from "next/link";
import type { StoreCategory } from "@/lib/store-categories";

type CategoryImageGridProps = {
  categories: StoreCategory[];
};

export function CategoryImageGrid({ categories }: CategoryImageGridProps) {
  return (
    <section className="grid w-full grid-cols-2 lg:grid-cols-4">
      {categories.map((category) => (
        <Link
          key={category.slug}
          href={category.href}
          className="group relative block aspect-[3/4] overflow-hidden bg-zinc-800"
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url(${category.imageSrc})` }}
            aria-hidden="true"
          />

          <div
            className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent"
            aria-hidden="true"
          />

          <span className="absolute bottom-4 left-4 max-w-[90%] font-montserrat text-sm font-bold tracking-wide text-white uppercase sm:bottom-5 sm:left-5 sm:text-base lg:text-lg">
            {category.title}
          </span>
        </Link>
      ))}
    </section>
  );
}
