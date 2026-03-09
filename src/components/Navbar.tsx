import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User as UserIcon } from 'lucide-react';

export default function Navbar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="bg-[#F7F7F5]/80 backdrop-blur-xl border-b border-black/5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center transition-transform group-hover:scale-105">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
              <span className="text-xl font-display font-bold tracking-tighter text-black">PARKEASE</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-6">
            <Link to="/search" className="text-sm font-medium text-gray-500 hover:text-black transition-colors">
              Find Parking
            </Link>
            
            {user ? (
              <div className="flex items-center gap-6 ml-2">
                <Link to="/dashboard" className="text-sm font-medium text-gray-500 hover:text-black transition-colors">
                  Dashboard
                </Link>
                <div className="flex items-center gap-3 pl-6 border-l border-black/10">
                  <div className="h-8 w-8 rounded-full border border-black/10 flex items-center justify-center text-black bg-white">
                    <UserIcon size={14} />
                  </div>
                  <span className="text-sm font-medium text-black hidden sm:block">{user.name}</span>
                  <button onClick={handleLogout} className="text-gray-400 hover:text-black transition-colors ml-2">
                    <LogOut size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 ml-2">
                <Link to="/login" className="text-sm font-medium text-gray-500 hover:text-black transition-colors">
                  Log in
                </Link>
                <Link to="/signup" className="bg-black hover:bg-gray-800 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all hover:shadow-lg hover:shadow-black/20">
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
