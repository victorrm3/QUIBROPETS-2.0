import { AltaClienteForm } from "@/components/admin/AltaClienteForm";

export default function AltaClientePage() {
  return (
    <main className="flex flex-1 flex-col bg-black text-white">
      <section className="mx-auto w-full max-w-3xl px-6 py-14 lg:px-10">
        <h1 className="font-montserrat text-3xl font-bold tracking-tight sm:text-4xl">
          Dar de alta a cliente
        </h1>
        <p className="mt-3 text-sm text-zinc-400 sm:text-base">
          Crea un nuevo usuario en la base de datos. Los descuentos (10, 20,
          30…) se aplicarán como porcentaje en artículos QuibroPets o
          Ferribiella según el campo.
        </p>

        <AltaClienteForm />
      </section>
    </main>
  );
}
