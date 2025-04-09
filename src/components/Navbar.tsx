import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-blue-600">ParkZenith</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Dashboard
            </Link>
            <Link 
              to="/find-parking" 
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Find Parking
            </Link>
            <Link 
              to="/bookings" 
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              My Bookings
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="outline">
              Sign In
            </Button>
            <Button>
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 