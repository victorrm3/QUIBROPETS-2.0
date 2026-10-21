export const AUTH_COOKIE = "quibro_session";
export const AUTH_TOKEN_COOKIE = "quibro_token";
export const AUTH_NAME_COOKIE = "quibro_user_name";
export const AUTH_ROLE_COOKIE = "quibro_user_role";

export const PROTECTED_PATHS = [
  "/tienda",
  "/favoritos",
  "/carrito",
  "/admin",
] as const;

export function isProtectedPath(pathname: string) {
  return PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

export function isAdminPath(pathname: string) {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));

  if (!match) return null;

  return decodeURIComponent(match.split("=").slice(1).join("="));
}

export function setClientSession(
  token: string,
  userName: string,
  role: string = "user",
) {
  document.cookie = `${AUTH_COOKIE}=authenticated; path=/; max-age=${SESSION_MAX_AGE}; SameSite=Lax`;
  document.cookie = `${AUTH_TOKEN_COOKIE}=${encodeURIComponent(token)}; path=/; max-age=${SESSION_MAX_AGE}; SameSite=Lax`;
  document.cookie = `${AUTH_NAME_COOKIE}=${encodeURIComponent(userName)}; path=/; max-age=${SESSION_MAX_AGE}; SameSite=Lax`;
  document.cookie = `${AUTH_ROLE_COOKIE}=${encodeURIComponent(role)}; path=/; max-age=${SESSION_MAX_AGE}; SameSite=Lax`;
}

export function clearClientSession() {
  document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
  document.cookie = `${AUTH_TOKEN_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
  document.cookie = `${AUTH_NAME_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
  document.cookie = `${AUTH_ROLE_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

export function getClientToken(): string | null {
  return readCookie(AUTH_TOKEN_COOKIE);
}

export function getClientUserName(): string | null {
  return readCookie(AUTH_NAME_COOKIE);
}

export function getClientUserRole(): string | null {
  return readCookie(AUTH_ROLE_COOKIE);
}

export function isClientAuthenticated(): boolean {
  return readCookie(AUTH_COOKIE) === "authenticated";
}

export function isClientAdmin(): boolean {
  return getClientUserRole()?.toLowerCase() === "admin";
}
