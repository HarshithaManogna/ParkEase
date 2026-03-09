import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MapPin, CheckCircle2, ArrowLeft } from 'lucide-react';
import { api } from '../services/api';

export default function ParkingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [parking, setParking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState('1 hour');
  const [vehicleType, setVehicleType] = useState('Car');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  useEffect(() => {
    api.getParkingById(id!)
      .then(data => {
        setParking(data);
        setLoading(false);
      })
      .catch(console.error);
  }, [id]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    setBookingStatus('submitting');

    try {
      await api.createBooking({
        parking_id: parking.id,
        owner_id: parking.owner_id,
        date,
        time_duration: duration,
        vehicle_type: vehicleType,
        vehicle_number: vehicleNumber
      });

      setBookingStatus('success');
      const message = `Hello ${parking.owner_name}, I want to book your parking space "${parking.title}" at ${parking.location} on ${date} for ${duration}. Vehicle: ${vehicleType} (${vehicleNumber}).`;
      const whatsappUrl = `https://wa.me/${parking.owner_phone}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    } catch (error) {
      console.error(error);
      setBookingStatus('idle');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#F7F7F5]">Loading...</div>;
  if (!parking) return <div className="min-h-screen flex items-center justify-center bg-[#F7F7F5]">Not found</div>;

  return (
    <div className="min-h-screen bg-[#F7F7F5] pb-24">
      {/* Hero Image */}
      <div className="w-full h-[50vh] relative bg-black">
        <img 
          src={parking.images[0] || 'https://picsum.photos/seed/parking/1600/900'} 
          alt={parking.title} 
          className="w-full h-full object-cover opacity-80"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F7F7F5] via-transparent to-transparent"></div>
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-8 left-8 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 -mt-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="mb-12">
              <span className="micro-label mb-4 block">Premium Listing</span>
              <h1 className="text-5xl font-display font-bold text-black tracking-tight mb-4">{parking.title}</h1>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">{parking.location}</span>
              </div>
            </div>

            <div className="w-full h-[1px] bg-black/10 mb-12"></div>

            <div className="mb-12">
              <h2 className="text-2xl font-display font-bold text-black mb-6">The Space</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                Secure and convenient parking space located in the heart of {parking.location}. 
                Perfect for daily commuters or long-term parking. The area is well-lit and monitored.
                Easy access to main roads and public transport.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-display font-bold text-black mb-6">Amenities</h2>
              <div className="grid grid-cols-2 gap-y-6">
                {parking.facilities.map((facility: string, i: number) => (
                  <div key={i} className="flex items-center gap-3 text-black font-medium">
                    <CheckCircle2 className="w-5 h-5 text-black/40" />
                    {facility}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="w-full h-[1px] bg-black/10 mb-12"></div>
            
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center text-white font-display font-bold text-xl">
                {parking.owner_name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-black">Hosted by {parking.owner_name}</h3>
                <p className="text-sm text-gray-500">Verified Host</p>
              </div>
            </div>
          </div>

          {/* Booking Widget */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="bg-white border border-black/10 rounded-[2rem] p-8 shadow-2xl sticky top-24">
              <div className="flex justify-between items-end mb-8 pb-8 border-b border-black/5">
                <div>
                  <span className="text-4xl font-display font-bold text-black">₹{parking.price_hourly}</span>
                  <span className="text-gray-500 font-medium"> / hr</span>
                </div>
              </div>

              {bookingStatus === 'success' ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-black mb-2">Request Sent</h3>
                  <p className="text-gray-500 mb-8 text-sm">The host has been notified. Please continue the conversation on WhatsApp.</p>
                  <button 
                    onClick={() => setBookingStatus('idle')}
                    className="w-full py-4 border border-black text-black rounded-full font-bold text-sm hover:bg-[#F7F7F5] transition-colors uppercase tracking-wider"
                  >
                    Book Again
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBooking} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="micro-label mb-2 block">Date</label>
                      <input 
                        type="date" 
                        required
                        className="w-full px-4 py-3 bg-[#F7F7F5] border border-transparent rounded-xl focus:bg-white focus:border-black/20 focus:ring-0 text-sm outline-none transition-all"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="micro-label mb-2 block">Duration</label>
                      <select 
                        className="w-full px-4 py-3 bg-[#F7F7F5] border border-transparent rounded-xl focus:bg-white focus:border-black/20 focus:ring-0 text-sm outline-none transition-all appearance-none"
                        value={duration}
                        onChange={e => setDuration(e.target.value)}
                      >
                        <option>1 hour</option>
                        <option>2 hours</option>
                        <option>4 hours</option>
                        <option>8 hours</option>
                        <option>1 day</option>
                        <option>1 week</option>
                        <option>1 month</option>
                      </select>
                    </div>
                    <div>
                      <label className="micro-label mb-2 block">Vehicle Type</label>
                      <select 
                        className="w-full px-4 py-3 bg-[#F7F7F5] border border-transparent rounded-xl focus:bg-white focus:border-black/20 focus:ring-0 text-sm outline-none transition-all appearance-none"
                        value={vehicleType}
                        onChange={e => setVehicleType(e.target.value)}
                      >
                        <option>Car</option>
                        <option>Bike</option>
                        <option>SUV</option>
                      </select>
                    </div>
                    <div>
                      <label className="micro-label mb-2 block">License Plate</label>
                      <input 
                        type="text" 
                        required
                        placeholder="MH 12 AB 1234"
                        className="w-full px-4 py-3 bg-[#F7F7F5] border border-transparent rounded-xl focus:bg-white focus:border-black/20 focus:ring-0 text-sm outline-none transition-all uppercase"
                        value={vehicleNumber}
                        onChange={e => setVehicleNumber(e.target.value)}
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={bookingStatus === 'submitting'}
                    className="w-full py-4 bg-black hover:bg-gray-800 text-white rounded-full font-bold text-sm transition-all mt-4 disabled:opacity-70 uppercase tracking-wider shadow-lg shadow-black/20"
                  >
                    {bookingStatus === 'submitting' ? 'Processing...' : 'Reserve Space'}
                  </button>
                  
                  <p className="text-center text-xs text-gray-400 font-medium">
                    You won't be charged yet.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
