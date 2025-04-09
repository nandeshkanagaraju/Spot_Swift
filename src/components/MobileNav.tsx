import { Button } from "@/components/ui/button";
import { User, Search, Calendar, Map, Home, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

interface MobileNavProps {
  onLoginClick: () => void;
  isLoggedIn: boolean;
}

const MobileNav = ({ onLoginClick, isLoggedIn }: MobileNavProps) => {
  const { signOut, profile } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full">
      <div className="py-6">
        <Link to="/" className="inline-block mb-6">
          <h2 className="text-lg font-semibold">SpotSwift</h2>
        </Link>
        <nav className="space-y-4">
          <Link
            to="/"
            className="flex items-center space-x-3 text-parkblue-900 hover:text-parkblue-600 hover:bg-parkblue-50 px-3 py-2 rounded-md"
          >
            <Home className="h-5 w-5" />
            <span>Home</span>
          </Link>
          <Link
            to="/facilities"
            className="flex items-center space-x-3 text-parkblue-900 hover:text-parkblue-600 hover:bg-parkblue-50 px-3 py-2 rounded-md"
          >
            <Search className="h-5 w-5" />
            <span>Find Parking</span>
          </Link>
          <Link
            to="/calendar"
            className="flex items-center space-x-3 text-parkblue-900 hover:text-parkblue-600 hover:bg-parkblue-50 px-3 py-2 rounded-md"
          >
            <Calendar className="h-5 w-5" />
            <span>Calendar</span>
          </Link>
          <Link
            to="/reservations"
            className="flex items-center space-x-3 text-parkblue-900 hover:text-parkblue-600 hover:bg-parkblue-50 px-3 py-2 rounded-md"
          >
            <Calendar className="h-5 w-5" />
            <span>My Reservations</span>
          </Link>
          {isLoggedIn && (
            <Link
              to="/profile"
              className="flex items-center space-x-3 text-parkblue-900 hover:text-parkblue-600 hover:bg-parkblue-50 px-3 py-2 rounded-md"
            >
              <User className="h-5 w-5" />
              <span>Profile</span>
            </Link>
          )}
        </nav>
      </div>
      <div className="mt-auto space-y-2 border-t border-border pt-4">
        {isLoggedIn ? (
          <>
            <div className="px-3 py-2 mb-2">
              <p className="text-sm font-medium">
                {profile ? `${profile.first_name} ${profile.last_name}` : "User"}
              </p>
            </div>
            <Button className="w-full" onClick={() => navigate("/settings")}>
              <Settings className="mr-2 h-4 w-4" /> Settings
            </Button>
            <Button variant="outline" className="w-full" onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" /> Sign Out
            </Button>
          </>
        ) : (
          <>
            <Button className="w-full" onClick={onLoginClick}>
              <User className="mr-2 h-4 w-4" /> Sign In
            </Button>
            <Button variant="outline" className="w-full" onClick={onLoginClick}>
              Register
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default MobileNav;
