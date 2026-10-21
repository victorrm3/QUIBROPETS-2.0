export type StoreCategory = {
  title: string;
  slug: string;
  href: string;
  imageSrc: string;
  /** Valores exactos del campo `denominacion` en BD */
  denominaciones: string[];
};

export const STORE_BRANDS: StoreCategory[] = [
  {
    title: "QUIBROPETS",
    slug: "quibropets",
    href: "/tienda/quibropets",
    imageSrc: "/images/categories/quibropets.jpg",
    denominaciones: [],
  },
  {
    title: "FERRIBIELLA",
    slug: "ferribiella",
    href: "/tienda/ferribiella",
    imageSrc: "/images/categories/ferribiella.jpg",
    denominaciones: [],
  },
  {
    title: "TREPONTI",
    slug: "treponti",
    href: "/tienda/treponti",
    imageSrc: "/images/categories/treponti.jpg",
    denominaciones: [],
  },
  {
    title: "PIENSOS",
    slug: "piensos",
    href: "/tienda/piensos",
    imageSrc: "/images/categories/piensos.jpg",
    denominaciones: [],
  },
];

export const QUIBROPETS_CATEGORIES: StoreCategory[] = [
  {
    title: "SNACKS DENTALES",
    slug: "snacks-dentales",
    href: "/tienda/quibropets/snacks-dentales",
    imageSrc: "/images/categories/quibropets/snacks-dentales.jpg",
    denominaciones: ["SNACKS DENTALES"],
  },
  {
    title: "PREMIOS",
    slug: "premios",
    href: "/tienda/quibropets/premios",
    imageSrc: "/images/categories/quibropets/premios.jpg",
    denominaciones: ["PREMIOS"],
  },
  {
    title: "GALLETAS",
    slug: "galletas",
    href: "/tienda/quibropets/galletas",
    imageSrc: "/images/categories/quibropets/galletas.jpg",
    denominaciones: ["GALLETAS"],
  },
  {
    title: "HUESOS",
    slug: "huesos",
    href: "/tienda/quibropets/huesos",
    imageSrc: "/images/categories/quibropets/huesos.jpg",
    denominaciones: ["HUESOS"],
  },
  {
    title: "ACEITES",
    slug: "aceites",
    href: "/tienda/quibropets/aceites",
    imageSrc: "/images/categories/quibropets/aceites.jpg",
    denominaciones: ["ACEITES"],
  },
  {
    title: "SNACKS NATURALES DESHIDRATADOS",
    slug: "snacks-naturales-deshidratados",
    href: "/tienda/quibropets/snacks-naturales-deshidratados",
    imageSrc:
      "/images/categories/quibropets/snacks-naturales-deshidratados.jpg",
    denominaciones: ["SNACKS NATURALES DESHIDRATADOS"],
  },
  {
    title: "SNACKS NATURALES",
    slug: "snacks-naturales",
    href: "/tienda/quibropets/snacks-naturales",
    imageSrc: "/images/categories/quibropets/snacks-naturales.jpg",
    denominaciones: ["SNACKS NATURALES"],
  },
  {
    title: "COMIDA HUMEDA",
    slug: "comida-humeda",
    href: "/tienda/quibropets/comida-humeda",
    imageSrc: "/images/categories/quibropets/comida-humeda.jpg",
    denominaciones: ["COMIDA HUMEDA"],
  },
  {
    title: "SNACKS GATOS",
    slug: "snacks-gatos",
    href: "/tienda/quibropets/snacks-gatos",
    imageSrc: "/images/categories/quibropets/snacks-gatos.jpg",
    denominaciones: ["SNACKS - GATO"],
  },
  {
    title: "HIGIENE",
    slug: "higiene",
    href: "/tienda/quibropets/higiene",
    imageSrc: "/images/categories/quibropets/higiene.jpg",
    denominaciones: ["HIGIENE"],
  },
  {
    title: "COMEDEROS",
    slug: "comedores",
    href: "/tienda/quibropets/comedores",
    imageSrc: "/images/categories/quibropets/comedores.jpg",
    denominaciones: ["COMEDEROS", "COMEDEROS-CERÁMICO"],
  },
  {
    title: "UTILIDAD",
    slug: "utilidad",
    href: "/tienda/quibropets/utilidad",
    imageSrc: "/images/categories/quibropets/utilidad.jpg",
    denominaciones: ["UTILIDAD"],
  },
  {
    title: "UTILIDAD GATO",
    slug: "utilidad-gato",
    href: "/tienda/quibropets/utilidad-gato",
    imageSrc: "/images/categories/quibropets/utilidad-gato.jpg",
    denominaciones: ["UTILIDAD-GATO"],
  },
  {
    title: "LINEA TRAVEL",
    slug: "linea-travel",
    href: "/tienda/quibropets/linea-travel",
    imageSrc: "/images/categories/quibropets/linea-travel.jpg",
    denominaciones: ["LINEA TRAVEL"],
  },
  {
    title: "JUGUETE PERRO",
    slug: "juguete-perro",
    href: "/tienda/quibropets/juguete-perro",
    imageSrc: "/images/categories/quibropets/juguete-perro.jpg",
    denominaciones: ["JUGUETES"],
  },
  {
    title: "JUGUETE GATO",
    slug: "juguete-gato",
    href: "/tienda/quibropets/juguete-gato",
    imageSrc: "/images/categories/quibropets/juguete-gato.jpg",
    denominaciones: [],
  },
  {
    title: "RASCADORES",
    slug: "rascadores",
    href: "/tienda/quibropets/rascadores",
    imageSrc: "/images/categories/quibropets/rascadores.jpg",
    denominaciones: ["RASCADORES"],
  },
  {
    title: "CONFORT",
    slug: "confort",
    href: "/tienda/quibropets/confort",
    imageSrc: "/images/categories/quibropets/confort.jpg",
    denominaciones: ["CONFORT"],
  },
  {
    title: "JAULAS Y TORTUGUERAS",
    slug: "jaulas-y-tortugueras",
    href: "/tienda/quibropets/jaulas-y-tortugueras",
    imageSrc: "/images/categories/quibropets/jaulas-y-tortugueras.jpg",
    denominaciones: [],
  },
];

export function getBrandBySlug(slug: string): StoreCategory | undefined {
  return STORE_BRANDS.find((brand) => brand.slug === slug);
}

export function getQuibropetsCategoryBySlug(
  slug: string,
): StoreCategory | undefined {
  return QUIBROPETS_CATEGORIES.find((category) => category.slug === slug);
}
