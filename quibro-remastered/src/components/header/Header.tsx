"use client";

import {
  Heart,
  Layers,
  Search,
  ShoppingBag,
  Store,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { UserMenu } from "@/components/header/UserMenu";
import { useCart } from "@/components/cart/CartProvider";

const SCROLL_THRESHOLD = 10;

const HEADER_HEIGHT = 53.89;

export const HEADER_HEIGHT_CLASS = "h-[53.89px]";

const navLinkClass =
  "text-sm font-semibold text-white transition-colors hover:text-zinc-300";

const iconButtonClass =
  "inline-flex items-center justify-center text-white transition-colors hover:text-zinc-300";

export function Header() {
  const router = useRouter();
  const { itemCount } = useCart();
  const [isVisible, setIsVisible] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      if (ticking.current) return;

      ticking.current = true;

      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;

        if (currentScrollY <= 0) {
          setIsVisible(true);
        } else if (
          currentScrollY > lastScrollY.current + SCROLL_THRESHOLD
        ) {
          setIsVisible(false);
        } else if (
          currentScrollY < lastScrollY.current - SCROLL_THRESHOLD
        ) {
          setIsVisible(true);
        }

        lastScrollY.current = currentScrollY;
        ticking.current = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isSearchOpen) return;
    searchInputRef.current?.focus();
  }, [isSearchOpen]);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = String(formData.get("q") ?? "").trim();
    setIsSearchOpen(false);
    router.push(query ? `/buscar?q=${encodeURIComponent(query)}` : "/buscar");
  };

  return (
    <>
      <header
        className={`fixed top-0 right-0 left-0 z-50 ${HEADER_HEIGHT_CLASS} bg-black transition-transform duration-300 ease-in-out ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="relative flex h-full w-full items-center justify-between gap-2 px-2 md:gap-4 md:px-0 md:pl-3">
          <div className="flex min-w-0 items-center md:h-full">
            <Link href="/" className="flex shrink-0 items-center md:h-full">
              <span className="flex items-center bg-white md:h-full">
                <Image
                  src="/images/logoquibroheader.svg"
                  alt="Quibro"
                  width={200}
                  height={HEADER_HEIGHT}
                  className="h-7 w-auto max-w-[92px] object-contain object-left md:h-full md:max-w-none"
                  priority
                />
              </span>
            </Link>

            <Link
              href="/tienda"
              className={`ml-6 hidden ${navLinkClass} md:inline`}
            >
              Tienda
            </Link>
          </div>

          <div className="absolute left-1/2 hidden -translate-x-1/2 md:block">
            <Link href="/colecciones" className={navLinkClass}>
              Colecciones
            </Link>
          </div>

          <div className="flex shrink-0 items-center gap-3 pr-1 md:gap-6 md:pr-6 lg:gap-8 lg:pr-10">
            <Link
              href="/tienda"
              className={`${iconButtonClass} md:hidden`}
              aria-label="Tienda"
            >
              <Store className="h-4 w-4" strokeWidth={1.75} />
            </Link>

            <Link
              href="/colecciones"
              className={`${iconButtonClass} md:hidden`}
              aria-label="Colecciones"
            >
              <Layers className="h-4 w-4" strokeWidth={1.75} />
            </Link>

            <form
              role="search"
              className="hidden items-center gap-2 border-b border-white/40 pb-0.5 transition-colors focus-within:border-white md:flex"
              onSubmit={handleSearch}
            >
              <label htmlFor="header-search-desktop" className="sr-only">
                Buscar
              </label>
              <input
                id="header-search-desktop"
                type="search"
                name="q"
                placeholder="Buscar"
                className="w-24 bg-transparent text-sm text-white placeholder:text-white/70 focus:outline-none lg:w-36"
              />
              <button
                type="submit"
                className={iconButtonClass}
                aria-label="Buscar"
              >
                <Search className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </form>

            <button
              type="button"
              className={`${iconButtonClass} md:hidden`}
              aria-label="Abrir búsqueda"
              aria-expanded={isSearchOpen}
              onClick={() => setIsSearchOpen((open) => !open)}
            >
              <Search className="h-4 w-4" strokeWidth={1.75} />
            </button>

            <UserMenu />

            <Link
              href="/favoritos"
              className={iconButtonClass}
              aria-label="Artículos favoritos"
            >
              <Heart className="h-4 w-4 md:h-5 md:w-5" strokeWidth={1.75} />
            </Link>

            <Link
              href="/carrito"
              className={`relative ${iconButtonClass}`}
              aria-label="Carrito"
            >
              <ShoppingBag
                className="h-4 w-4 md:h-5 md:w-5"
                strokeWidth={1.75}
              />
              {itemCount > 0 ? (
                <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-white px-1 text-[10px] font-semibold text-black">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              ) : null}
            </Link>
          </div>
        </div>

        {isSearchOpen ? (
          <div className="absolute inset-x-0 top-full border-b border-zinc-800 bg-black px-3 py-3 md:hidden">
            <form
              role="search"
              className="flex items-center gap-3"
              onSubmit={handleSearch}
            >
              <label htmlFor="header-search-mobile" className="sr-only">
                Buscar
              </label>
              <input
                ref={searchInputRef}
                id="header-search-mobile"
                type="search"
                name="q"
                placeholder="Buscar..."
                className="min-w-0 flex-1 border-b border-white/40 bg-transparent pb-1 text-sm text-white placeholder:text-white/70 focus:border-white focus:outline-none"
              />
              <button
                type="submit"
                className={iconButtonClass}
                aria-label="Buscar"
              >
                <Search className="h-5 w-5" strokeWidth={1.5} />
              </button>
              <button
                type="button"
                className={iconButtonClass}
                aria-label="Cerrar búsqueda"
                onClick={() => setIsSearchOpen(false)}
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </form>
          </div>
        ) : null}
      </header>

      <div className={`${HEADER_HEIGHT_CLASS} mb-0 shrink-0`} aria-hidden="true" />
    </>
  );
}
