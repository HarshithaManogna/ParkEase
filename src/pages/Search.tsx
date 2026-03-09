import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search as SearchIcon, MapPin, SlidersHorizontal } from 'lucide-react';
import { api } from '../services/api';

export default function Search() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [parkings, setParkings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const initialLocation = searchParams.get('location') || '';
  const [location, setLocation] = useState(initialLocation);

  useEffect(() => {
    api.getParkings()
      .then(data => {
        let filtered = data;
        if (initialLocation) {
          filtered = data.filter((p: any) => 
            p.location.toLowerCase().includes(initialLocation.toLowerCase()) ||
            p.title.toLowerCase().includes(initialLocation.toLowerCase())
          );
        }
        setParkings(filtered);
        setLoading(false);
      })
      .catch(console.error);
  }, [initialLocation]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?location=${encodeURIComponent(location)}`);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)] bg-white">
      {/* List View */}
      <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col border-r border-black/5 z-10">
        <div className="p-6 border-b border-black/5 sticky top-0 bg-white/90 backdrop-blur-md z-20">
          <form onSubmit={handleSearch} className="relative mb-4">
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search destination..." 
              className="w-full pl-12 pr-4 py-3 bg-[#F7F7F5] border border-transparent rounded-full focus:bg-white focus:border-black/20 focus:ring-0 text-sm outline-none transition-all"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </form>
          
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full text-xs font-medium whitespace-nowrap">
              <SlidersHorizontal size={12} /> Filters
            </button>
            <button className="px-4 py-2 border border-black/10 hover:border-black text-black rounded-full text-xs font-medium whitespace-nowrap transition-colors">
              Price: Low to High
            </button>
            <button className="px-4 py-2 border border-black/10 hover:border-black text-black rounded-full text-xs font-medium whitespace-nowrap transition-colors">
              Covered Only
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6 flex justify-between items-end">
            <span className="micro-label">{parkings.length} spaces available</span>
          </div>
          
          {loading ? (
            <div className="space-y-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse flex gap-6">
                  <div className="w-32 h-32 bg-gray-200 rounded-2xl"></div>
                  <div className="flex-1 py-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-6"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : parkings.length > 0 ? (
            <div className="space-y-8">
              {parkings.map((space) => (
                <div 
                  key={space.id} 
                  className="group flex flex-col sm:flex-row gap-6 cursor-pointer"
                  onClick={() => navigate(`/parking/${space.id}`)}
                >
                  <div className="w-full sm:w-40 h-32 flex-shrink-0 rounded-2xl overflow-hidden bg-gray-100">
                    <img 
                      src={space.images[0] || 'https://picsum.photos/seed/parking/400/300'} 
                      alt={space.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1 border-b border-black/5 pb-6 sm:border-none sm:pb-1">
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-black text-lg leading-tight group-hover:underline decoration-2 underline-offset-4">{space.title}</h3>
                      </div>
                      <p className="text-gray-500 text-sm mb-3 flex items-center gap-1">
                        <MapPin size={12} /> {space.location}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {space.facilities.slice(0, 2).map((f: string, i: number) => (
                          <span key={i} className="text-[10px] font-medium px-2 py-1 bg-[#F7F7F5] text-gray-600 rounded-md uppercase tracking-wider">
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between items-end mt-4">
                      <div className="font-display">
                        <span className="text-xl font-bold text-black">₹{space.price_hourly}</span>
                        <span className="text-gray-500 text-sm">/hr</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-[#F7F7F5] rounded-full flex items-center justify-center mx-auto mb-4">
                <SearchIcon className="text-gray-400" size={20} />
              </div>
              <h3 className="text-lg font-bold text-black mb-1">No spaces found</h3>
              <p className="text-gray-500 text-sm">Try adjusting your search area.</p>
            </div>
          )}
        </div>
      </div>

      {/* Map View */}
      <div className="hidden lg:block flex-1 bg-[#F7F7F5] relative">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1600" 
            alt="Map view" 
            className="w-full h-full object-cover opacity-60 grayscale"
            referrerPolicy="no-referrer"
          />
        </div>
        {/* Mock Map Markers */}
        {parkings.slice(0, 5).map((space, i) => (
          <div 
            key={space.id}
            className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-110 hover:z-20"
            style={{ top: `${30 + (i * 15)}%`, left: `${40 + (i % 2 === 0 ? 10 : -10)}%` }}
            onClick={() => navigate(`/parking/${space.id}`)}
          >
            <div className="bg-black text-white px-3 py-1.5 rounded-full font-display font-bold text-sm shadow-xl shadow-black/20 flex items-center gap-1">
              ₹{space.price_hourly}
            </div>
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-black mx-auto"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
