import { NextRequest, NextResponse } from "next/server";
import {
  AUTH_COOKIE,
  AUTH_ROLE_COOKIE,
  isAdminPath,
  isProtectedPath,
} from "@/lib/auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  const session = request.cookies.get(AUTH_COOKIE)?.value;

  if (!session) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminPath(pathname)) {
    const role = request.cookies.get(AUTH_ROLE_COOKIE)?.value?.toLowerCase();

    if (role !== "admin") {
      const homeUrl = request.nextUrl.clone();
      homeUrl.pathname = "/";
      homeUrl.search = "";
      return NextResponse.redirect(homeUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/tienda/:path*",
    "/favoritos/:path*",
    "/carrito/:path*",
    "/admin/:path*",
  ],
};
