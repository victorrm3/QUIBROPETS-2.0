"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { PageHero } from "@/components/ui/PageHero";

export default function CarritoPage() {
  const { items, updateQuantity, removeItem, clear, itemCount } = useCart();

  const total = items.reduce(
    (sum, item) => sum + item.precio * item.quantity,
    0,
  );

  return (
    <main className="flex flex-1 flex-col">
      <PageHero
        title="Carrito"
        description="Revisa los productos añadidos antes de finalizar tu compra."
      />

      <section className="mx-auto w-full max-w-4xl px-4 pb-16">
        {items.length === 0 ? (
          <div className="border border-zinc-800 px-6 py-12 text-center">
            <p className="text-sm text-zinc-400">Tu carrito está vacío.</p>
            <Link
              href="/"
              className="mt-4 inline-block text-sm text-white underline underline-offset-4"
            >
              Seguir comprando
            </Link>
          </div>
        ) : (
          <>
            <ul className="divide-y divide-zinc-800 border border-zinc-800">
              {items.map((item) => (
                <li
                  key={item.productId}
                  className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
                >
                  <div className="h-24 w-24 shrink-0 overflow-hidden bg-zinc-100">
                    {item.imagen ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.imagen}
                        alt={item.nombre}
                        className="h-full w-full object-contain p-2"
                      />
                    ) : (
                      <div className="h-full w-full bg-zinc-800" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/producto/${item.productId}`}
                      className="text-sm text-white hover:text-zinc-300"
                    >
                      {item.nombre}
                    </Link>
                    <p className="mt-1 text-xs text-zinc-500">
                      {item.codigo}
                      {item.label ? ` · ${item.label}` : ""}
                    </p>
                    <p className="mt-2 text-sm text-zinc-300">
                      {item.precio.toFixed(2)}€
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-zinc-700">
                      <button
                        type="button"
                        className="px-3 py-2 text-white"
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1)
                        }
                      >
                        -
                      </button>
                      <span className="min-w-[2rem] text-center text-sm text-white">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        className="px-3 py-2 text-white"
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      className="text-xs text-zinc-500 underline underline-offset-2 hover:text-white"
                      onClick={() => removeItem(item.productId)}
                    >
                      Quitar
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-col items-end gap-3">
              <p className="text-sm text-zinc-400">
                {itemCount} artículo{itemCount === 1 ? "" : "s"}
              </p>
              <p className="text-xl text-white">{total.toFixed(2)}€</p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={clear}
                  className="border border-zinc-700 px-4 py-2 text-xs tracking-wide text-zinc-300 uppercase"
                >
                  Vaciar
                </button>
                <Link
                  href="/"
                  className="bg-white px-4 py-2 text-xs font-semibold tracking-wide text-black uppercase"
                >
                  Seguir comprando
                </Link>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
