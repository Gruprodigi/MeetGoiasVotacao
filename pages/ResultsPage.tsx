import React, { useEffect, useState, useMemo } from 'react';
import { DataService } from '../services/dataService';
import { Nomination } from '../types';
import { Award, MapPin, ChefHat, Search } from 'lucide-react';
import { CITIES_GOIAS } from '../constants';

const ResultsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [nominations, setNominations] = useState<Nomination[]>([]);
  
  // Filters
  const [cityFilter, setCityFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const data = await DataService.getPublicResults();
      setNominations(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Aggregation Logic
  const stats = useMemo(() => {
    const filtered = nominations.filter(n => {
      const matchCity = cityFilter ? n.city === cityFilter : true;
      const search = searchTerm.toLowerCase();
      const matchSearch = searchTerm 
        ? n.dishName.toLowerCase().includes(search) || n.restaurantName.toLowerCase().includes(search)
        : true;
      return matchCity && matchSearch;
    });

    // Group by Dish
    const dishCounts: Record<string, number> = {};
    filtered.forEach(n => {
        // Standardize key
        const key = n.dishName.trim().toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        dishCounts[key] = (dishCounts[key] || 0) + 1;
    });
    const topDishes = Object.entries(dishCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10);

    // Group by Restaurant
    const restCounts: Record<string, { count: number, city: string }> = {};
    filtered.forEach(n => {
       const key = n.restaurantName.trim();
       if (!restCounts[key]) restCounts[key] = { count: 0, city: n.city };
       restCounts[key].count++;
    });
    const topRestaurants = Object.entries(restCounts)
      .sort(([, a], [, b]) => b.count - a.count)
      .slice(0, 10);

    return { topDishes, topRestaurants };
  }, [nominations, cityFilter, searchTerm]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-goias-orange"></div>
      </div>
    );
  }

  return (
    <div className="bg-amber-50/50 min-h-screen pb-12">
      {/* Hero Header */}
      <div className="bg-goias-green text-white py-12 px-4 mb-8">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-serif font-bold mb-4">
            O Melhor de Goiás
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Confira o ranking dos pratos mais amados e dos restaurantes que fazem história em nosso estado, eleitos pelo povo.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center justify-between border border-amber-100">
          <div className="flex items-center gap-2 w-full md:w-auto text-goias-orange font-bold text-lg">
             <Award className="w-6 h-6" /> Rankings Oficiais
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Buscar prato ou restaurante..." 
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm w-full md:w-64 focus:ring-1 focus:ring-goias-orange outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select 
                className="pl-9 pr-8 py-2 border border-gray-300 rounded-md text-sm w-full md:w-48 appearance-none focus:ring-1 focus:ring-goias-orange outline-none bg-white"
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
              >
                <option value="">Todas as Cidades</option>
                {CITIES_GOIAS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
            {/* Top Dishes */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-amber-100 p-6 border-b border-amber-200">
                    <h2 className="text-2xl font-serif font-bold text-amber-900 flex items-center gap-2">
                        <UtensilsIcon /> Pratos Típicos
                    </h2>
                    <p className="text-amber-800/70 text-sm mt-1">Os sabores mais indicados pelos goianos</p>
                </div>
                <div className="divide-y divide-gray-100">
                    {stats.topDishes.length > 0 ? (
                        stats.topDishes.map(([dish, count], index) => (
                            <div key={dish} className="p-4 flex items-center gap-4 hover:bg-amber-50/50 transition-colors">
                                <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full font-bold text-lg
                                    ${index === 0 ? 'bg-yellow-400 text-yellow-900 shadow-md' : 
                                      index === 1 ? 'bg-gray-300 text-gray-800' : 
                                      index === 2 ? 'bg-orange-200 text-orange-900' : 'bg-gray-100 text-gray-500'}`}>
                                    {index + 1}º
                                </div>
                                <div className="flex-grow">
                                    <h3 className="font-bold text-gray-800 text-lg">{dish}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                         <span className="text-xs bg-goias-light text-goias-orange px-2 py-0.5 rounded-full font-medium border border-orange-100">
                                            Tradição Goiana
                                         </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="block text-2xl font-bold text-goias-green">{count}</span>
                                    <span className="text-xs text-gray-500">votos</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center text-gray-500">Nenhum resultado encontrado.</div>
                    )}
                </div>
            </div>

            {/* Top Restaurants */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-orange-100 p-6 border-b border-orange-200">
                    <h2 className="text-2xl font-serif font-bold text-orange-900 flex items-center gap-2">
                        <ChefHat className="w-6 h-6" /> Restaurantes
                    </h2>
                    <p className="text-orange-800/70 text-sm mt-1">Estabelecimentos referência na culinária local</p>
                </div>
                <div className="divide-y divide-gray-100">
                    {stats.topRestaurants.length > 0 ? (
                        stats.topRestaurants.map(([name, data], index) => (
                            <div key={name} className="p-4 flex items-center gap-4 hover:bg-orange-50/50 transition-colors">
                                <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full font-bold text-lg
                                    ${index === 0 ? 'bg-yellow-400 text-yellow-900 shadow-md' : 
                                      index === 1 ? 'bg-gray-300 text-gray-800' : 
                                      index === 2 ? 'bg-orange-200 text-orange-900' : 'bg-gray-100 text-gray-500'}`}>
                                    {index + 1}º
                                </div>
                                <div className="flex-grow">
                                    <h3 className="font-bold text-gray-800 text-lg">{name}</h3>
                                    <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                                        <MapPin className="w-3 h-3" /> {data.city}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="block text-2xl font-bold text-goias-green">{data.count}</span>
                                    <span className="text-xs text-gray-500">votos</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center text-gray-500">Nenhum resultado encontrado.</div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

const UtensilsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-utensils"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>
)

export default ResultsPage;
