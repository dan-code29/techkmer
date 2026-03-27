import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Techkmer
        </Link>
        <div className="space-x-4">
          <Link href="/" className="hover:underline">Accueil</Link>
          <Link href="/services" className="hover:underline">Services</Link>
          <Link href="/technicians" className="hover:underline">Techniciens</Link>
          <Link href="/boutique" className="hover:underline">Boutique</Link>
          <Link href="/devis" className="hover:underline">Devis</Link>
          <Link href="/admin" className="hover:underline">Admin</Link>
        </div>
      </div>
    </nav>
  );
}