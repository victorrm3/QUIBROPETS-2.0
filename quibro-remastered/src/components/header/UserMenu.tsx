"use client";

import { logoutRequest } from "@/lib/api";
import {
  clearClientSession,
  getClientToken,
  getClientUserName,
  isClientAdmin,
  isClientAuthenticated,
} from "@/lib/auth";
import { ChevronDown, LogOut, User, UserPlus } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const iconButtonClass =
  "inline-flex items-center justify-center text-white transition-colors hover:text-zinc-300";

export function UserMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsAuthenticated(isClientAuthenticated());
    setUserName(getClientUserName());
    setIsAdmin(isClientAdmin());
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const token = getClientToken();

    try {
      if (token) {
        await logoutRequest(token);
      }
    } catch {
      // Aunque falle la API, limpiamos la sesión local.
    } finally {
      clearClientSession();
      setIsAuthenticated(false);
      setIsAdmin(false);
      setUserName(null);
      setIsOpen(false);
      setIsLoggingOut(false);
      router.push("/");
      router.refresh();
    }
  };

  if (!isAuthenticated) {
    return (
      <Link
        href="/login"
        className={iconButtonClass}
        aria-label="Iniciar sesión"
      >
        <User className="h-4 w-4 md:h-5 md:w-5" strokeWidth={1.75} />
      </Link>
    );
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        className="inline-flex max-w-[160px] items-center gap-1.5 text-left text-white transition-colors hover:text-zinc-300 sm:max-w-none"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => setIsOpen((open) => !open)}
      >
        <User className="h-4 w-4 shrink-0 md:h-5 md:w-5" strokeWidth={1.75} />
        <span className="hidden truncate text-xs font-medium sm:inline md:text-sm">
          Bienvenido/a {userName || "usuario"}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
          strokeWidth={1.75}
        />
      </button>

      {isOpen ? (
        <div
          role="menu"
          className="absolute top-full right-0 z-50 mt-2 min-w-[220px] border border-white/15 bg-black py-2 shadow-xl"
        >
          <p className="border-b border-white/10 px-4 py-2 text-xs text-zinc-400 sm:hidden">
            Bienvenido/a {userName || "usuario"}
          </p>

          {isAdmin ? (
            <Link
              href="/admin/clientes/alta"
              role="menuitem"
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-white transition-colors hover:bg-white/10"
            >
              <UserPlus className="h-4 w-4" strokeWidth={1.5} />
              Dar de alta a cliente
            </Link>
          ) : null}

          <button
            type="button"
            role="menuitem"
            disabled={isLoggingOut}
            onClick={handleLogout}
            className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-white transition-colors hover:bg-white/10 disabled:opacity-60"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.5} />
            {isLoggingOut ? "Cerrando..." : "Cerrar sesión"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
