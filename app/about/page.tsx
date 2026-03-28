export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">À propos de Techkmer</h1>
      <div className="prose max-w-none">
        <p>Créée en 2024, Techkmer est née de la volonté de proposer des solutions techniques complètes...</p>
        <h2>Notre mission</h2>
        <p>Fournir un service de qualité, rapide et fiable...</p>
        <h2>Nos valeurs</h2>
        <ul>
          <li>Expertise technique</li>
          <li>Réactivité</li>
          <li>Relation de confiance</li>
        </ul>
      </div>
    </div>
  );
}