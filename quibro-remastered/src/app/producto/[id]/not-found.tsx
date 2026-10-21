import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
      <h1 className="font-montserrat text-2xl font-bold text-white">
        Producto no encontrado
      </h1>
      <p className="mt-3 text-sm text-zinc-400">
        El artículo que buscas no existe o ya no está disponible.
      </p>
      <Link
        href="/"
        className="mt-8 bg-white px-6 py-3 text-sm font-semibold tracking-wide text-black uppercase"
      >
        Volver al inicio
      </Link>
    </main>
  );
}
