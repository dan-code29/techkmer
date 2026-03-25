import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Techkmer
        </Link>
        <div className="space-x-4">
          <Link href="/" className="hover:underline">Accueil</Link>
          <Link href="/services" className="hover:underline">Services</Link>
          <Link href="/devis" className="hover:underline">Devis</Link>
        </div>
      </div>
    </nav>
  );
}