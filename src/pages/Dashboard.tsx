import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car, Calendar, MapPin, Plus, Clock } from 'lucide-react';
import { api } from '../services/api';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState<any[]>([]);
  const [parkings, setParkings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const bookingsData = await api.getMyBookings();
        setBookings(Array.isArray(bookingsData) ? bookingsData : []);

        if (user.role === 'owner') {
          const parkingsData = await api.getMyParkings();
          setParkings(Array.isArray(parkingsData) ? parkingsData : []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      await api.updateBookingStatus(id, status);
      setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
    } catch (error) {
      console.error(error);
    }
  };

  if (loading || isLoading) return <div className="min-h-screen flex items-center justify-center bg-[#F7F7F5]">Loading...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F7F7F5] py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <span className="micro-label mb-2 block">Overview</span>
            <h1 className="text-4xl font-display font-bold text-black tracking-tight">Dashboard</h1>
            <p className="text-gray-500 mt-2">Welcome back, {user.name}</p>
          </div>
          
          {user.role === 'owner' && (
            <button 
              onClick={() => navigate('/add-parking')}
              className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-full text-sm font-medium flex items-center gap-2 transition-all hover:shadow-lg"
            >
              <Plus size={16} /> New Listing
            </button>
          )}
        </div>

        <div className="bg-white border border-black/5 rounded-[2rem] overflow-hidden shadow-sm">
          <div className="flex border-b border-black/5 px-6">
            <button 
              className={`py-6 px-4 text-sm font-medium transition-colors relative ${activeTab === 'bookings' ? 'text-black' : 'text-gray-400 hover:text-black'}`}
              onClick={() => setActiveTab('bookings')}
            >
              {user.role === 'owner' ? 'Incoming Requests' : 'My Reservations'}
              {activeTab === 'bookings' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></div>}
            </button>
            {user.role === 'owner' && (
              <button 
                className={`py-6 px-4 text-sm font-medium transition-colors relative ${activeTab === 'parkings' ? 'text-black' : 'text-gray-400 hover:text-black'}`}
                onClick={() => setActiveTab('parkings')}
              >
                Active Listings
                {activeTab === 'parkings' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></div>}
              </button>
            )}
          </div>

          <div className="p-8">
            {activeTab === 'bookings' && (
              <div>
                {bookings.length === 0 ? (
                  <div className="text-center py-20 text-gray-400">
                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm">No activity found.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-black/5">
                          <th className="pb-4 font-display text-xs uppercase tracking-wider text-gray-500 font-medium">Status</th>
                          <th className="pb-4 font-display text-xs uppercase tracking-wider text-gray-500 font-medium">Date</th>
                          <th className="pb-4 font-display text-xs uppercase tracking-wider text-gray-500 font-medium">Location</th>
                          <th className="pb-4 font-display text-xs uppercase tracking-wider text-gray-500 font-medium">Details</th>
                          <th className="pb-4 font-display text-xs uppercase tracking-wider text-gray-500 font-medium text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black/5">
                        {bookings.map(booking => (
                          <tr key={booking.id} className="group hover:bg-[#F7F7F5] transition-colors">
                            <td className="py-6 pr-4">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                booking.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                                booking.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {booking.status}
                              </span>
                            </td>
                            <td className="py-6 pr-4 text-sm font-medium text-black whitespace-nowrap">{booking.date}</td>
                            <td className="py-6 pr-4">
                              <p className="font-bold text-black text-sm">{booking.parking_title}</p>
                              <p className="text-xs text-gray-500 mt-1">{user.role === 'owner' ? `By: ${booking.user_name}` : `Host: ${booking.owner_name}`}</p>
                            </td>
                            <td className="py-6 pr-4 text-sm text-gray-600">
                              <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1"><Clock size={12} /> {booking.time_duration}</span>
                                <span className="flex items-center gap-1"><Car size={12} /> {booking.vehicle_number}</span>
                              </div>
                            </td>
                            <td className="py-6 text-right">
                              <div className="flex justify-end items-center gap-3">
                                <a 
                                  href={`https://wa.me/${user.role === 'owner' ? booking.user_phone : booking.owner_phone}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-xs font-medium border-b border-black pb-0.5 hover:text-gray-600 hover:border-gray-600 transition-colors"
                                >
                                  Message
                                </a>
                                
                                {user.role === 'owner' && booking.status === 'Pending' && (
                                  <div className="flex gap-2 ml-4">
                                    <button 
                                      onClick={() => handleStatusUpdate(booking.id, 'Rejected')}
                                      className="w-8 h-8 flex items-center justify-center border border-black/10 rounded-full text-black hover:bg-black hover:text-white transition-colors"
                                      title="Reject"
                                    >
                                      ✕
                                    </button>
                                    <button 
                                      onClick={() => handleStatusUpdate(booking.id, 'Accepted')}
                                      className="w-8 h-8 flex items-center justify-center bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
                                      title="Accept"
                                    >
                                      ✓
                                    </button>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'parkings' && user.role === 'owner' && (
              <div>
                {parkings.length === 0 ? (
                  <div className="text-center py-20 text-gray-400">
                    <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm">No active listings.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {parkings.map(space => (
                      <div key={space.id} className="group cursor-pointer" onClick={() => navigate(`/parking/${space.id}`)}>
                        <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-gray-100">
                          <img 
                            src={space.images[0] || 'https://picsum.photos/seed/parking/400/300'} 
                            alt={space.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="font-bold text-black text-lg group-hover:underline decoration-2 underline-offset-4">{space.title}</h3>
                            <span className="font-display font-bold text-black">₹{space.price_hourly}/hr</span>
                          </div>
                          <p className="text-sm text-gray-500 truncate">{space.location}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
