import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import { CartProvider } from "@/components/cart/CartProvider";
import { ConditionalFooter } from "@/components/footer/ConditionalFooter";
import { Header } from "@/components/header/Header";
import { MainContent } from "@/components/layout/MainContent";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: "QuibroPets",
  description: "Dale a tu mascota lo que necesita",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-black font-sans">
        <CartProvider>
          <Header />
          <MainContent>{children}</MainContent>
          <ConditionalFooter />
        </CartProvider>
      </body>
    </html>
  );
}
