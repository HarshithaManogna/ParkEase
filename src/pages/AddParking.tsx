import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MapPin, Image as ImageIcon, DollarSign, CheckSquare } from 'lucide-react';

export default function AddParking() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [priceHourly, setPriceHourly] = useState('');
  const [priceDaily, setPriceDaily] = useState('');
  const [priceMonthly, setPriceMonthly] = useState('');
  const [facilities, setFacilities] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>(['']);
  const [loading, setLoading] = useState(false);

  const facilityOptions = [
    'Covered parking', 'CCTV', 'Security guard', 'EV charging', 'Gated property', '24/7 Access'
  ];

  const handleFacilityToggle = (facility: string) => {
    if (facilities.includes(facility)) {
      setFacilities(facilities.filter(f => f !== facility));
    } else {
      setFacilities([...facilities, facility]);
    }
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
  };

  const addImageField = () => {
    setImages([...images, '']);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || user.role !== 'owner') return;
    
    setLoading(true);
    
    try {
      const res = await fetch('/api/parkings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          location,
          price_hourly: Number(priceHourly),
          price_daily: Number(priceDaily),
          price_monthly: Number(priceMonthly),
          facilities,
          images: images.filter(img => img.trim() !== '')
        })
      });
      
      if (res.ok) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'owner') {
    return <div className="min-h-screen flex items-center justify-center">Unauthorized</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">List Your Parking Space</h1>
        <p className="text-gray-500 mt-2">Fill in the details below to start earning from your unused space.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200">
        
        {/* Basic Info */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2">Basic Information</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Parking Title</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Secure Basement Parking in Andheri"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location / Address</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                required
                placeholder="Full address"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                value={location}
                onChange={e => setLocation(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2">Pricing (₹)</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="number" 
                  required
                  min="0"
                  placeholder="20"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  value={priceHourly}
                  onChange={e => setPriceHourly(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Daily Rate</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="number" 
                  required
                  min="0"
                  placeholder="120"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  value={priceDaily}
                  onChange={e => setPriceDaily(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rate</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="number" 
                  required
                  min="0"
                  placeholder="1500"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  value={priceMonthly}
                  onChange={e => setPriceMonthly(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Facilities */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2">Facilities</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {facilityOptions.map(facility => (
              <label key={facility} className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  checked={facilities.includes(facility)}
                  onChange={() => handleFacilityToggle(facility)}
                />
                <span className="text-sm text-gray-700">{facility}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Images */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2">Images (URLs)</h2>
          
          {images.map((img, index) => (
            <div key={index} className="relative">
              <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="url" 
                placeholder="https://example.com/image.jpg"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                value={img}
                onChange={e => handleImageChange(index, e.target.value)}
              />
            </div>
          ))}
          
          <button 
            type="button" 
            onClick={addImageField}
            className="text-blue-600 text-sm font-medium hover:underline"
          >
            + Add another image URL
          </button>
        </div>

        <div className="pt-6 border-t border-gray-100">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg transition-colors disabled:opacity-70"
          >
            {loading ? 'Publishing...' : 'Publish Listing'}
          </button>
        </div>
      </form>
    </div>
  );
}
