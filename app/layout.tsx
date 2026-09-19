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
import Providers from "./providers";                       // SessionProvider (NextAuth)
import { CartProvider } from "@/context/CartContext";       // Panier
import { WishlistProvider } from "@/context/WishlistContext"; // Favoris (NOUVEAU)

// ============================================================================
//  POLICES GOOGLE (Geist Sans + Geist Mono)
// ============================================================================
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ============================================================================
//  MÉTADONNÉES SEO
// ============================================================================
export const metadata: Metadata = {
  title: "WISEBUILD Smart Systems - Des bâtiments plus sûrs et plus intelligents",
  description:
    "WISEBUILD conçoit, installe et maintient des solutions électriques, solaires, réseau, sécurité électronique et domotique au Cameroun.",
};

// ============================================================================
//  LAYOUT RACINE
// ============================================================================
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
            1. Providers         → SessionProvider (NextAuth) — le plus global
            2. CartProvider      → Panier
            3. WishlistProvider  → Favoris (NOUVEAU)
        ---------------------------------------------------------------- */}
        <Providers>
          <CartProvider>
            <WishlistProvider>

              {/* Navigation principale (sticky) */}
              <Navbar />

              {/* Contenu des pages */}
              <main className="flex-grow">{children}</main>

              {/* Bouton "Retour en haut" flottant */}
              <ScrollToTop />

              {/* Pied de page */}
              <Footer />

              {/* Chatbot Botpress */}
              <BotpressChat />

            </WishlistProvider>
          </CartProvider>
        </Providers>
      </body>
    </html>
  );
}