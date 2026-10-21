"use client";

import { Heart, Minus, Plus } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import {
  productVariants,
  swatchForLabel,
  type Product,
} from "@/lib/products";

type ProductDetailProps = {
  product: Product;
  showPrice: boolean;
};

export function ProductDetail({ product, showPrice }: ProductDetailProps) {
  const { addItem } = useCart();
  const variants = productVariants(product);
  const initialId = product.selected_id ?? product.id;

  const [selectedId, setSelectedId] = useState(initialId);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const selected =
    variants.find((variant) => variant.id === selectedId) ?? variants[0];

  const gallery = useMemo(() => {
    const urls = variants
      .map((variant) => variant.imagen?.trim())
      .filter((url): url is string => Boolean(url));

    return Array.from(new Set(urls));
  }, [variants]);

  const mainImage =
    activeImage ?? selected.imagen?.trim() ?? gallery[0] ?? null;

  const showSelector = variants.length > 1;
  const selectorType =
    product.variante_tipo ?? selected.tipo ?? variants[0]?.tipo ?? "talla";

  const outOfStock = selected.stock <= 0;

  const handleAddToCart = () => {
    if (outOfStock) return;

    addItem(
      {
        productId: selected.id,
        codigo: selected.codigo,
        nombre: selected.nombre,
        label: showSelector ? selected.label : null,
        precio: selected.precio,
        imagen: selected.imagen,
      },
      quantity,
    );

    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  const breadcrumbCategory =
    product.denominacion?.trim() || product.proveedor || "Productos";

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 lg:px-8 lg:py-12">
      <nav className="mb-6 text-xs tracking-wide text-zinc-500 uppercase">
        <Link href="/" className="transition-colors hover:text-white">
          Inicio
        </Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-400">{breadcrumbCategory}</span>
        <span className="mx-2">/</span>
        <span className="text-zinc-300">{selected.nombre}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
        <div className="flex gap-3">
          {gallery.length > 1 ? (
            <div className="hidden w-16 shrink-0 flex-col gap-2 sm:flex">
              {gallery.map((url) => {
                const isActive = url === mainImage;
                return (
                  <button
                    key={url}
                    type="button"
                    onClick={() => setActiveImage(url)}
                    className={`relative aspect-square overflow-hidden border bg-zinc-100 transition ${
                      isActive ? "border-white" : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt=""
                      className="h-full w-full object-contain p-1"
                    />
                  </button>
                );
              })}
            </div>
          ) : null}

          <div className="relative aspect-[4/5] w-full overflow-hidden bg-zinc-100">
            {mainImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={mainImage}
                alt={selected.nombre}
                className="absolute inset-0 h-full w-full object-contain p-8 scale-95"
              />
            ) : (
              <div className="absolute inset-0 bg-zinc-800" />
            )}
          </div>
        </div>

        <div className="flex flex-col">
          {product.denominacion ? (
            <p className="mb-2 text-xs tracking-[0.2em] text-zinc-400 uppercase">
              {product.denominacion}
            </p>
          ) : null}

          <div className="flex items-start justify-between gap-4">
            <h1 className="font-montserrat text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {selected.nombre}
            </h1>
            <button
              type="button"
              aria-label="Añadir a favoritos"
              className="mt-1 text-white transition-colors hover:text-zinc-300"
            >
              <Heart className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>

          {showPrice ? (
            <div className="mt-4 flex items-baseline gap-3">
              <p className="text-xl text-white">{selected.precio.toFixed(2)}€</p>
              {selected.descuento > 0 ? (
                <p className="text-sm text-zinc-500 line-through">
                  {selected.precio_base.toFixed(2)}€
                </p>
              ) : null}
            </div>
          ) : (
            <p className="mt-4 text-sm text-zinc-400">
              Inicia sesión para ver el precio
            </p>
          )}

          <p className="mt-4 max-w-md text-sm leading-relaxed text-zinc-400">
            Código {selected.codigo}
            {selected.stock > 0
              ? ` · ${selected.stock} uds disponibles`
              : " · Sin stock"}
          </p>

          {showSelector ? (
            <div className="mt-8">
              <p className="mb-3 text-xs tracking-[0.18em] text-zinc-400 uppercase">
                {selectorType === "color" ? "Color" : "Talla"}
              </p>
              <div className="flex flex-wrap gap-2">
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
                          disabled={variant.stock <= 0}
                          onClick={() => {
                            setSelectedId(variant.id);
                            if (variant.imagen?.trim()) {
                              setActiveImage(variant.imagen.trim());
                            }
                          }}
                          className={`flex h-8 w-8 items-center justify-center rounded-full border transition disabled:opacity-30 ${
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
                            <span className="text-[10px] font-medium text-white">
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
                          disabled={variant.stock <= 0}
                          onClick={() => {
                            setSelectedId(variant.id);
                            if (variant.imagen?.trim()) {
                              setActiveImage(variant.imagen.trim());
                            }
                          }}
                          className={`min-w-[3rem] border px-3 py-2 text-xs tracking-wide transition disabled:opacity-30 ${
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
            </div>
          ) : null}

          <div className="mt-8 flex items-center gap-3">
            <div className="flex items-center border border-zinc-600">
              <button
                type="button"
                aria-label="Reducir cantidad"
                className="px-3 py-3 text-white transition hover:bg-white/5"
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-[2.5rem] text-center text-sm text-white">
                {quantity}
              </span>
              <button
                type="button"
                aria-label="Aumentar cantidad"
                className="px-3 py-3 text-white transition hover:bg-white/5"
                onClick={() => setQuantity((value) => value + 1)}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <button
            type="button"
            disabled={outOfStock}
            onClick={handleAddToCart}
            className="mt-4 w-full bg-white px-6 py-4 text-sm font-semibold tracking-wide text-black uppercase transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
          >
            {outOfStock
              ? "Sin stock"
              : added
                ? "Añadido al carrito"
                : "Agregar al carrito"}
          </button>

          <div className="mt-10 divide-y divide-zinc-800 border-t border-zinc-800">
            <details className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm text-white">
                Detalles
                <Plus className="h-4 w-4 transition group-open:rotate-45" />
              </summary>
              <div className="mt-3 space-y-1 text-sm text-zinc-400">
                <p>Proveedor: {product.proveedor}</p>
                <p>Código: {selected.codigo}</p>
                {product.medidas ? <p>Categoría: {product.medidas}</p> : null}
              </div>
            </details>
            <details className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm text-white">
                Envíos | Devoluciones
                <Plus className="h-4 w-4 transition group-open:rotate-45" />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                Consulta condiciones de envío y devolución con tu comercial
                QuibroPets.
              </p>
            </details>
          </div>
        </div>
      </div>
    </section>
  );
}
