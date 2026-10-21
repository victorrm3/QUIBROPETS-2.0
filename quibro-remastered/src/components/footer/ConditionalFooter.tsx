"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/footer/Footer";

export function ConditionalFooter() {
  const pathname = usePathname();
  const showFooter = pathname === "/" || pathname.startsWith("/tienda");

  if (!showFooter) {
    return null;
  }

  return <Footer />;
}
