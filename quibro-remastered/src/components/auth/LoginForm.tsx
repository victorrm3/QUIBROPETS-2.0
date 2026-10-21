"use client";

import { loginRequest } from "@/lib/api";
import { setClientSession } from "@/lib/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

function getSafeRedirect(next: string | null) {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/";
  }
  return next;
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const data = await loginRequest({ email, password });
      setClientSession(data.token, data.user.name, data.user.role);
      router.push(getSafeRedirect(searchParams.get("next")));
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo iniciar sesión.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md border border-white/15 bg-black/55 px-6 py-8 shadow-2xl backdrop-blur-md sm:px-8 sm:py-10"
    >
      <h1 className="font-montserrat text-2xl font-bold tracking-wide text-white sm:text-3xl">
        Iniciar sesión
      </h1>
      <p className="mt-2 text-sm text-zinc-300">
        Accede a tu cuenta de QuibroPets
      </p>

      <div className="mt-8 space-y-5">
        <div>
          <label
            htmlFor="login-email"
            className="mb-2 block text-sm font-medium text-zinc-200"
          >
            Email
          </label>
          <input
            id="login-email"
            type="email"
            name="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="tu@email.com"
            className="w-full border border-white/20 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-white/60"
          />
        </div>

        <div>
          <label
            htmlFor="login-password"
            className="mb-2 block text-sm font-medium text-zinc-200"
          >
            Contraseña
          </label>
          <input
            id="login-password"
            type="password"
            name="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            className="w-full border border-white/20 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-white/60"
          />
        </div>
      </div>

      {error ? (
        <p className="mt-4 text-sm text-red-400" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isLoading}
        className="mt-8 w-full bg-white px-4 py-3 text-sm font-semibold tracking-wide text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Entrando..." : "Entrar"}
      </button>

      <p className="mt-6 text-center text-sm text-zinc-400">
        ¿No tienes cuenta?{" "}
        <span className="text-white">Próximamente</span>
      </p>
    </form>
  );
}
