"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M14 13.5h2.5l.5-3H14V8.75c0-.83.17-1.25 1.34-1.25H17V5.07C16.67 5.03 15.77 5 14.79 5 12.6 5 11 6.27 11 8.98V10.5H8.5v3H11V20h3v-6.5Z" />
    </svg>
  );
}

const inputClass =
  "w-full border-b border-white/30 bg-transparent py-2 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-white";

const linkClass =
  "text-sm text-zinc-300 transition-colors hover:text-white";

const headingClass =
  "mb-5 font-montserrat text-sm font-bold tracking-wide text-white uppercase";

export function Footer() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const mailto = new URL("mailto:info@quibropets.com");
    mailto.searchParams.set("subject", subject || "Contacto QuibroPets");
    mailto.searchParams.set(
      "body",
      `Nombre: ${name}\nEmail: ${email}\n\n${message}`,
    );
    window.location.href = mailto.toString();
    setSent(true);
  };

  return (
    <footer className="sticky bottom-0 z-0 w-full bg-black text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-2 lg:grid-cols-4 lg:gap-8 lg:px-10 lg:py-16">
        <div>
          <h2 className={headingClass}>Contacto</h2>
          <p className="mb-6 text-sm text-zinc-400">
            Escríbenos y te responderemos lo antes posible.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="footer-name" className="sr-only">
                Nombre
              </label>
              <input
                id="footer-name"
                type="text"
                name="name"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Nombre"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="footer-email" className="sr-only">
                Email
              </label>
              <input
                id="footer-email"
                type="email"
                name="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="footer-subject" className="sr-only">
                Asunto
              </label>
              <input
                id="footer-subject"
                type="text"
                name="subject"
                required
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                placeholder="Asunto"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="footer-message" className="sr-only">
                Mensaje
              </label>
              <textarea
                id="footer-message"
                name="message"
                required
                rows={4}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Mensaje"
                className={`${inputClass} resize-none`}
              />
            </div>

            <button
              type="submit"
              className="mt-2 text-sm font-semibold tracking-wide text-white uppercase transition hover:text-zinc-300"
            >
              Enviar
            </button>

            {sent ? (
              <p className="text-xs text-zinc-400">
                Se abrirá tu correo para enviar el mensaje.
              </p>
            ) : null}
          </form>
        </div>

        <div>
          <h2 className={headingClass}>QuibroPets</h2>
          <ul className="space-y-3">
            <li>
              <a href="mailto:info@quibropets.com" className={linkClass}>
                info@quibropets.com
              </a>
            </li>
            <li>
              <a href="tel:+34965471722" className={linkClass}>
                965 47 17 22
              </a>
            </li>
            <li className="text-sm leading-relaxed text-zinc-300">
              Ctra. País Vasc 20
              <br />
              03640 (Monòver)
              <br />
              Alicante
            </li>
          </ul>
        </div>

        <div>
          <h2 className={headingClass}>Ayuda</h2>
          <ul className="space-y-3">
            <li>
              <Link href="/tienda" className={linkClass}>
                Tienda
              </Link>
            </li>
            <li>
              <Link href="/colecciones" className={linkClass}>
                Colecciones
              </Link>
            </li>
            <li>
              <Link href="/login" className={linkClass}>
                Iniciar sesión
              </Link>
            </li>
            <li>
              <Link href="/carrito" className={linkClass}>
                Carrito
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className={headingClass}>Legal</h2>
          <ul className="space-y-3">
            <li>
              <Link href="/aviso-legal" className={linkClass}>
                Aviso legal
              </Link>
            </li>
            <li>
              <Link href="/privacidad" className={linkClass}>
                Política de privacidad
              </Link>
            </li>
            <li>
              <Link href="/terminos" className={linkClass}>
                Términos y condiciones
              </Link>
            </li>
          </ul>

          <div className="mt-8 flex items-center gap-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="text-white transition hover:text-zinc-300"
              aria-label="Instagram"
            >
              <InstagramIcon className="h-5 w-5" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="text-white transition hover:text-zinc-300"
              aria-label="Facebook"
            >
              <FacebookIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-8 sm:px-6 lg:px-10">
        <p className="font-montserrat text-center text-[12vw] leading-none font-extrabold tracking-tight text-white uppercase sm:text-[10vw] lg:text-[8vw]">
          QuibroPets
        </p>
      </div>
    </footer>
  );
}
