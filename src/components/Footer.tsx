import { Car } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <Car className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900 tracking-tight">ParkEase</span>
            </Link>
            <p className="text-gray-500 text-sm">
              Find parking anywhere, or rent out your unused space. The smart way to park.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">For Drivers</h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link to="/search" className="hover:text-blue-600">Find Parking</Link></li>
              <li><Link to="#" className="hover:text-blue-600">How to Book</Link></li>
              <li><Link to="#" className="hover:text-blue-600">Pricing</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">For Owners</h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link to="/signup" className="hover:text-blue-600">List Your Space</Link></li>
              <li><Link to="#" className="hover:text-blue-600">Host Guidelines</Link></li>
              <li><Link to="#" className="hover:text-blue-600">Insurance</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link to="#" className="hover:text-blue-600">Help Center</Link></li>
              <li><Link to="#" className="hover:text-blue-600">Contact Us</Link></li>
              <li><Link to="#" className="hover:text-blue-600">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-100 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© {new Date().getFullYear()} ParkEase. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            {/* Social icons could go here */}
          </div>
        </div>
      </div>
    </footer>
  );
}
