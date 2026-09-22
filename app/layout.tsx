import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// ============================================================================
//  IMPORTS DES COMPOSANTS GLOBAUX
// ============================================================================
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import BotpressChat from "@/components/BotpressChat";

// ============================================================================
//  IMPORTS DES PROVIDERS (Contextes globaux)
// ============================================================================
import Providers from "./providers";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import LanguageProvider from "@/components/LanguageProvider";   // ✅ AJOUTÉ

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CHEFFBUILD Smart Systems - Des bâtiments plus sûrs et plus intelligents",
  description:
    "CHEFFBUILD conçoit, installe et maintient des solutions électriques, solaires, réseau, sécurité électronique et domotique au Cameroun.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 flex flex-col min-h-screen`}
      >
        {/* ----------------------------------------------------------------
            ORDRE DES PROVIDERS (important) :
            1. LanguageProvider  → Langue (FR/EN) — le plus global
            2. Providers         → SessionProvider (NextAuth)
            3. CartProvider      → Panier
            4. WishlistProvider  → Favoris
        ---------------------------------------------------------------- */}
        <LanguageProvider>          {/* ✅ AJOUTÉ EN PREMIER */}
          <Providers>
            <CartProvider>
              <WishlistProvider>

                <Navbar />
                <main className="flex-grow">{children}</main>
                <ScrollToTop />
                <Footer />
                <BotpressChat />

              </WishlistProvider>
            </CartProvider>
          </Providers>
        </LanguageProvider>
      </body>
    </html>
  );
}