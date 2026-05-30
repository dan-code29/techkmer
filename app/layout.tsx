import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import Providers from "./providers";          // SessionProvider
import { CartProvider } from "@/context/CartContext";   // ← import du panier

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tech Innov'Solutions - Connecter, éclairer, protéger",
  description: "Solutions techniques complètes : électricité, informatique, sécurité électronique. Installation, maintenance et conseils par des experts qualifiés.",
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
        <Providers>                 {/* SessionProvider */}
          <CartProvider>            {/* Provider du panier */}
            <Navbar />
            <main className="flex-grow">{children}</main>
            <ScrollToTop />
            <Footer />
          </CartProvider>
        </Providers>
      </body>
    </html>
  );
}