"use client";

import Link from "next/link";
import {
  productVariants,
  swatchForLabel,
  type Product,
} from "@/lib/products";
import { useState } from "react";

type ProductCardProps = {
  product: Product;
  showPrice: boolean;
  layout?: "slider" | "grid";
};

export function ProductCard({
  product,
  showPrice,
  layout = "slider",
}: ProductCardProps) {
  const variants = productVariants(product);
  const [selectedId, setSelectedId] = useState(product.id);
  const selected =
    variants.find((variant) => variant.id === selectedId) ?? variants[0];

  const imageUrl = selected.imagen?.trim() || null;
  const showSelector = variants.length > 1;
  const selectorType =
    product.variante_tipo ?? selected.tipo ?? variants[0]?.tipo ?? "talla";

  const widthClass =
    layout === "grid"
      ? "w-full"
      : "w-[42vw] shrink-0 sm:w-[30vw] md:w-[22vw] lg:w-[18vw] xl:w-[15vw]";

  return (
    <article className={`group flex flex-col bg-black ${widthClass}`}>
      <Link
        href={`/producto/${product.id}`}
        className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-zinc-100"
      >
        {product.denominacion ? (
          <span className="absolute top-2 left-2 z-10 max-w-[75%] truncate rounded-full bg-white px-2.5 py-1 text-[10px] font-medium tracking-wide text-zinc-900 sm:text-xs">
            {product.denominacion}
          </span>
        ) : null}

        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={selected.nombre}
            className="absolute inset-0 h-full w-full scale-90 object-contain p-4 transition-transform duration-500 group-hover:scale-95"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 bg-zinc-800" aria-hidden="true" />
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-1.5 px-1 pt-3 pb-2">
        <Link
          href={`/producto/${product.id}`}
          className="line-clamp-2 text-left text-xs text-white transition-colors hover:text-zinc-300 sm:text-sm"
        >
          {selected.nombre}
        </Link>

        {product.medidas ? (
          <p className="text-[11px] text-zinc-500">{product.medidas}</p>
        ) : null}

        {showSelector ? (
          <div
            className="flex flex-wrap gap-1.5 pt-0.5"
            onPointerDown={(event) => event.stopPropagation()}
          >
            {selectorType === "color"
              ? variants.map((variant) => {
                  const swatch = swatchForLabel(variant.label);
                  const isActive = variant.id === selected.id;

                  return (
                    <button
                      key={variant.id}
                      type="button"
                      title={variant.label}
                      aria-label={variant.label}
                      aria-pressed={isActive}
                      onClick={() => setSelectedId(variant.id)}
                      className={`flex h-5 w-5 items-center justify-center rounded-full border transition ${
                        isActive
                          ? "border-white ring-1 ring-white"
                          : "border-zinc-600 hover:border-zinc-400"
                      }`}
                      style={
                        swatch
                          ? { backgroundColor: swatch }
                          : { backgroundColor: "#3f3f46" }
                      }
                    >
                      {!swatch ? (
                        <span className="text-[8px] font-medium text-white">
                          {variant.label.slice(0, 1)}
                        </span>
                      ) : null}
                    </button>
                  );
                })
              : variants.map((variant) => {
                  const isActive = variant.id === selected.id;

                  return (
                    <button
                      key={variant.id}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => setSelectedId(variant.id)}
                      className={`min-w-[2.25rem] rounded-md border px-2 py-1 text-[10px] tracking-wide transition sm:text-[11px] ${
                        isActive
                          ? "border-white bg-white text-black"
                          : "border-zinc-600 text-zinc-300 hover:border-zinc-400"
                      }`}
                    >
                      {variant.label}
                    </button>
                  );
                })}
          </div>
        ) : null}

        {showPrice ? (
          <div className="flex items-baseline gap-2">
            <p className="text-xs text-zinc-300 sm:text-sm">
              {selected.precio.toFixed(2)}€
            </p>
            {selected.descuento > 0 ? (
              <p className="text-[11px] text-zinc-500 line-through">
                {selected.precio_base.toFixed(2)}€
              </p>
            ) : null}
          </div>
        ) : (
          <p className="select-none text-xs text-zinc-500 blur-[5px] sm:text-sm">
            {selected.precio.toFixed(2)}€
          </p>
        )}
      </div>
    </article>
  );
}

export type { Product };
