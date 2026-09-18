import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import BotpressChat from "@/components/BotpressChat";
import Providers from "./providers";          // SessionProvider
import { CartProvider } from "@/context/CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WISEBUILD Smart Systems - Des bâtiments plus sûrs et plus intelligents",
  description: "WISEBUILD conçoit, installe et maintient des solutions électriques, solaires, réseau, sécurité électronique et domotique au Cameroun.",
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
        <Providers>                 {/* SessionProvider NextAuth */}
          <CartProvider>            {/* Panier global */}
            <Navbar />
            <main className="flex-grow">{children}</main>
            <ScrollToTop />         {/* Bouton remonter en haut */}
            <Footer />
            <BotpressChat />        {/* Chatbot (Botpress) */}
          </CartProvider>
        </Providers>
      </body>
    </html>
  );
}