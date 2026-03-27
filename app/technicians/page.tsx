export default function TechniciansPage() {
  const technicians = [
    {
      name: 'Jean Dupont',
      specialty: 'Électricien',
      location: 'Paris',
      rating: 4.8,
      image: '👨‍🔧',
    },
    {
      name: 'Marie Martin',
      specialty: 'Plombier',
      location: 'Lyon',
      rating: 4.9,
      image: '👩‍🔧',
    },
    {
      name: 'Pierre Durand',
      specialty: 'Chauffagiste',
      location: 'Bordeaux',
      rating: 4.7,
      image: '🔧',
    },
    {
      name: 'Sophie Lefèvre',
      specialty: 'Électricien',
      location: 'Marseille',
      rating: 4.6,
      image: '⚡',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Nos techniciens partenaires</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {technicians.map((tech) => (
          <div key={tech.name} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
            <div className="text-6xl text-center py-6 bg-gray-100">{tech.image}</div>
            <div className="p-4">
              <h2 className="text-xl font-semibold">{tech.name}</h2>
              <p className="text-gray-600">{tech.specialty}</p>
              <p className="text-gray-500 text-sm">📍 {tech.location}</p>
              <div className="flex items-center mt-2">
                <span className="text-yellow-500">★</span>
                <span className="ml-1 text-gray-700">{tech.rating}</span>
              </div>
              <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                Contacter
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}