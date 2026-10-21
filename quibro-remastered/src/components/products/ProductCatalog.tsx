import { ProductCard, type Product } from "./ProductCard";

type ProductCatalogProps = {
  products: Product[];
  showPrice: boolean;
};

export function ProductCatalog({ products, showPrice }: ProductCatalogProps) {
  if (products.length === 0) {
    return (
      <section className="w-full bg-black px-6 py-10 text-sm text-zinc-500">
        No hay productos en esta categoría todavía.
      </section>
    );
  }

  return (
    <section className="w-full bg-black px-3 py-6 sm:px-4 lg:px-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            showPrice={showPrice}
            layout="grid"
          />
        ))}
      </div>
    </section>
  );
}
