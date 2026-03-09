import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Search, MapPin, ArrowRight } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [featured, setFeatured] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/parkings')
      .then(res => res.json())
      .then(data => setFeatured(data.slice(0, 3)))
      .catch(console.error);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?location=${encodeURIComponent(location)}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F7F5]">
      {/* Editorial Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <span className="micro-label mb-6 block">The New Standard in Parking</span>
                <h1 className="text-[14vw] lg:text-[7.5rem] leading-[0.85] font-display font-bold tracking-tighter text-black mb-8 uppercase">
                  Park <br/> Anywhere.
                </h1>
                <p className="text-lg text-gray-500 mb-10 max-w-md leading-relaxed">
                  A premium marketplace for private parking spaces. Find secure spots instantly or monetize your unused driveway.
                </p>
                
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-xl">
                  <div className="flex-1 relative">
                    <MapPin className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input 
                      type="text" 
                      placeholder="Enter destination..." 
                      className="w-full pl-14 pr-6 py-4 bg-white border border-black/10 rounded-full focus:ring-2 focus:ring-black focus:border-transparent text-black outline-none transition-all shadow-sm text-sm font-medium"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-full font-medium flex items-center justify-center gap-2 transition-all hover:shadow-xl hover:shadow-black/20 flex-shrink-0"
                  >
                    Search <ArrowRight size={16} />
                  </button>
                </form>
              </motion.div>
            </div>
            
            <div className="lg:col-span-5 relative hidden lg:block">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative rounded-[2rem] overflow-hidden aspect-[3/4] shadow-2xl"
              >
                <img 
                  src="https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=1000" 
                  alt="Premium Parking" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white">
                    <div className="flex justify-between items-center mb-2">
                      <span className="micro-label text-white/80">Featured Space</span>
                      <span className="font-display font-bold">₹40/hr</span>
                    </div>
                    <h3 className="text-xl font-medium">IT Park Secure Parking</h3>
                    <p className="text-sm text-white/60 mt-1">Whitefield, Bangalore</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Minimalist Stats/Features */}
      <section className="py-20 border-y border-black/5 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 divide-y md:divide-y-0 md:divide-x divide-black/5">
            {[
              { num: '01', title: 'Verified Spaces', desc: 'Every location is vetted for security and accessibility.' },
              { num: '02', title: 'Instant Access', desc: 'Book and park immediately with zero paperwork.' },
              { num: '03', title: 'Seamless Payments', desc: 'Automated billing based on your exact duration.' }
            ].map((feature, i) => (
              <div key={i} className="pt-8 md:pt-0 md:px-8 first:pl-0 last:pr-0">
                <span className="font-display text-4xl font-light text-black/20 block mb-4">{feature.num}</span>
                <h3 className="text-lg font-bold text-black mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Curated Spaces */}
      <section className="py-32 bg-[#F7F7F5]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-end mb-16">
            <div>
              <span className="micro-label mb-2 block">Curated Collection</span>
              <h2 className="text-4xl font-display font-bold tracking-tight text-black">Premium Spots</h2>
            </div>
            <button onClick={() => navigate('/search')} className="text-sm font-medium border-b border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-colors hidden sm:block">
              Explore All
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featured.map((space) => (
              <div key={space.id} className="group cursor-pointer" onClick={() => navigate(`/parking/${space.id}`)}>
                <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-gray-100">
                  <img 
                    src={space.images[0] || 'https://picsum.photos/seed/parking/400/300'} 
                    alt={space.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-black">{space.title}</h3>
                    <span className="font-display font-medium text-black">₹{space.price_hourly}/hr</span>
                  </div>
                  <p className="text-sm text-gray-500">{space.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
