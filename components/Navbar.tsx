'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';

export default function Navbar() {
  const { data: session } = useSession();
  const { totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Liens communs
  const links = [
    { href: '/', label: 'Accueil' },
    { href: '/services', label: 'Services' },
    { href: '/installation', label: 'Installation' },
    { href: '/maintenance', label: 'Maintenance' },
    { href: '/boutique', label: 'Boutique' },
    { href: '/devis', label: 'Devis' },
  ];

  return (
    <nav className="bg-blue-600 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-r from-white to-cyan-500 rounded-full flex items-center justify-center font-bold text-white">
            
            <Image
                        src="/images/logo.png"
                        alt="Logo Tech Innov'Solutions"
                        width={4000}
                        height={4000}
                        className="object-contain"
                    />
          </div>

          <span className="text-lg font-bold hidden sm:inline">Tech Innov'Solutions</span>
        </Link>

        {/* Bouton hamburger (mobile) */}
        <button
          onClick={toggleMenu}
          className="block md:hidden focus:outline-none"
          aria-label="Menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            />
          </svg>
        </button>

        {/* Menu desktop */}
        <div className="hidden md:flex items-center space-x-4">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:underline">
              {link.label}
            </Link>
          ))}
          <Link href="/panier" className="relative hover:underline">
            🛒 Panier
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          {session?.user?.role === 'admin' && (
            <Link href="/admin" className="hover:underline">Admin</Link>
          )}
          {session ? (
            <button
              onClick={() => signOut()}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition"
            >
              Déconnexion
            </button>
          ) : (
            <Link
              href="/login"
              className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100 transition"
            >
              Connexion
            </Link>
          )}
        </div>
      </div>

      {/* Menu mobile (affiché si isMenuOpen) */}
      {isMenuOpen && (
        <div className="md:hidden bg-blue-700 px-4 pb-4 space-y-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-2 hover:underline"
              onClick={toggleMenu}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/panier"
            className="block py-2 hover:underline relative"
            onClick={toggleMenu}
          >
            🛒 Panier
            {totalItems > 0 && (
              <span className="ml-1 inline-block bg-red-500 text-white text-xs rounded-full w-5 h-5 text-center leading-5">
                {totalItems}
              </span>
            )}
          </Link>
          {session?.user?.role === 'admin' && (
            <Link href="/admin" className="block py-2 hover:underline" onClick={toggleMenu}>
              Admin
            </Link>
          )}
          {session ? (
            <button
              onClick={() => {
                signOut();
                toggleMenu();
              }}
              className="block w-full text-left bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition"
            >
              Déconnexion
            </button>
          ) : (
            <Link
              href="/login"
              className="block py-2 hover:underline"
              onClick={toggleMenu}
            >
              Connexion
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}