"use client";

import { createClientRequest, type CreateClientPayload } from "@/lib/api";
import { getClientToken } from "@/lib/auth";
import { FormEvent, useState } from "react";

const inputClass =
  "w-full border border-white/20 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-white/60";

const labelClass = "mb-2 block text-sm font-medium text-zinc-200";

const initialForm = {
  nombre: "",
  email: "",
  password: "",
  serie: "1",
  numero_cliente: "",
  poblacion: "",
  is_admin: false,
  descuentoQ: "",
  descuentoF: "",
};

export function AltaClienteForm() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const updateField = <K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const token = getClientToken();
    if (!token) {
      setError("No hay sesión activa. Vuelve a iniciar sesión.");
      return;
    }

    const payload: CreateClientPayload = {
      nombre: form.nombre.trim(),
      email: form.email.trim(),
      password: form.password,
      serie: Number(form.serie),
      numero_cliente: Number(form.numero_cliente),
      poblacion: form.poblacion.trim(),
      is_admin: form.is_admin,
      descuentoQ:
        form.descuentoQ === "" ? null : Number(form.descuentoQ),
      descuentoF:
        form.descuentoF === "" ? null : Number(form.descuentoF),
    };

    setIsLoading(true);

    try {
      const result = await createClientRequest(token, payload);
      setSuccess(result.message);
      setForm(initialForm);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo crear el cliente.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-10 space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="cliente-nombre" className={labelClass}>
            Nombre
          </label>
          <input
            id="cliente-nombre"
            required
            value={form.nombre}
            onChange={(event) => updateField("nombre", event.target.value)}
            className={inputClass}
            placeholder="Nombre del cliente"
          />
        </div>

        <div>
          <label htmlFor="cliente-email" className={labelClass}>
            Email
          </label>
          <input
            id="cliente-email"
            type="email"
            required
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            className={inputClass}
            placeholder="cliente@email.com"
          />
        </div>

        <div>
          <label htmlFor="cliente-password" className={labelClass}>
            Contraseña
          </label>
          <input
            id="cliente-password"
            type="password"
            required
            minLength={8}
            value={form.password}
            onChange={(event) => updateField("password", event.target.value)}
            className={inputClass}
            placeholder="Mínimo 8 caracteres"
          />
        </div>

        <div>
          <label htmlFor="cliente-poblacion" className={labelClass}>
            Población
          </label>
          <input
            id="cliente-poblacion"
            required
            value={form.poblacion}
            onChange={(event) => updateField("poblacion", event.target.value)}
            className={inputClass}
            placeholder="Ciudad / población"
          />
        </div>

        <div>
          <label htmlFor="cliente-serie" className={labelClass}>
            Serie
          </label>
          <input
            id="cliente-serie"
            type="number"
            required
            min={0}
            value={form.serie}
            onChange={(event) => updateField("serie", event.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="cliente-numero" className={labelClass}>
            Número cliente
          </label>
          <input
            id="cliente-numero"
            type="number"
            required
            min={0}
            value={form.numero_cliente}
            onChange={(event) =>
              updateField("numero_cliente", event.target.value)
            }
            className={inputClass}
            placeholder="Código / número de cliente"
          />
        </div>

        <div>
          <label htmlFor="cliente-descuento-q" className={labelClass}>
            Descuento QuibroPets (%)
          </label>
          <input
            id="cliente-descuento-q"
            type="number"
            min={0}
            max={100}
            value={form.descuentoQ}
            onChange={(event) => updateField("descuentoQ", event.target.value)}
            className={inputClass}
            placeholder="Ej: 10, 20, 30"
          />
          <p className="mt-1 text-xs text-zinc-500">
            Se aplica a artículos QUIBROPETS. Vacío = sin descuento.
          </p>
        </div>

        <div>
          <label htmlFor="cliente-descuento-f" className={labelClass}>
            Descuento Ferribiella (%)
          </label>
          <input
            id="cliente-descuento-f"
            type="number"
            min={0}
            max={100}
            value={form.descuentoF}
            onChange={(event) => updateField("descuentoF", event.target.value)}
            className={inputClass}
            placeholder="Ej: 10, 20, 30"
          />
          <p className="mt-1 text-xs text-zinc-500">
            Se aplica a artículos FERRIBIELLA. Vacío = sin descuento.
          </p>
        </div>
      </div>

      <label className="flex items-center gap-3 text-sm text-zinc-200">
        <input
          type="checkbox"
          checked={form.is_admin}
          onChange={(event) => updateField("is_admin", event.target.checked)}
          className="h-4 w-4 rounded border-white/30 bg-black"
        />
        Dar permisos de administrador
      </label>

      {error ? (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      ) : null}

      {success ? (
        <p className="text-sm text-emerald-400" role="status">
          {success}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isLoading}
        className="bg-white px-6 py-3 text-sm font-semibold tracking-wide text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Creando cliente..." : "Crear cliente"}
      </button>
    </form>
  );
}
