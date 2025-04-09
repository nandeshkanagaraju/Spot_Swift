import { useState } from "react";
import Header from "@/components/Header";
import ParkingMap from "@/components/ParkingMap";
import ParkingStatistics from "@/components/ParkingStatistics";
import NearbyFacilities from "@/components/NearbyFacilities";
import RecentActivity from "@/components/RecentActivity";
import LoginForm from "@/components/LoginForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, MapPin, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import SmartDashboard from "@/components/SmartDashboard";
import WeeklyTrendsGraph from "@/components/WeeklyTrendsGraph";

const Index = () => {
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLoginClick = () => {
    setLoginDialogOpen(true);
  };

  const handleFindParking = () => {
    navigate("/facilities", { state: { query: searchQuery } });
  };

  const handleViewNearby = () => {
    if (user) {
      navigate("/facilities", { state: { view: "nearby" } });
    } else {
      setLoginDialogOpen(true);
    }
  };

  const handleViewReservations = () => {
    if (user) {
      navigate("/reservations");
    } else {
      setLoginDialogOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header onLoginClick={handleLoginClick} />

      <main className="flex-1 container mx-auto px-4 py-6 space-y-6">
        {/* Hero Section */}
        <section className="bg-parkblue-900 text-white rounded-lg p-6 md:p-10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-parkblue-900 to-parkblue-700 opacity-90"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506521781263-d8422e82f27a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-20"></div>
          
          <div className="relative z-10 max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Find and Reserve Parking Spaces in Seconds
            </h1>
            <p className="text-parkblue-100 mb-6 max-w-xl">
              SpotSwift uses advanced technology to help you find the perfect parking spot across India. 
              Save time, reduce stress, and avoid the hassle of searching for parking.
            </p>
            
            <div className="bg-white rounded-lg p-4 shadow-lg">
              <Tabs defaultValue="search" className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger 
                    value="search" 
                    className="data-[state=active]:bg-parkblue-50 data-[state=active]:text-parkblue-900"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Find Parking
                  </TabsTrigger>
                  <TabsTrigger 
                    value="nearby" 
                    className="data-[state=active]:bg-parkblue-50 data-[state=active]:text-parkblue-900"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Nearby
                  </TabsTrigger>
                  <TabsTrigger 
                    value="reservations" 
                    className="data-[state=active]:bg-parkblue-50 data-[state=active]:text-parkblue-900"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Reservations
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="search" className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-grow">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <Input
                        placeholder="Enter location or parking name"
                        className="pl-9 w-full focus:outline-none focus:ring-2 focus:ring-parkblue-500 focus:border-transparent"
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoComplete="off"
                      />
                    </div>
                    <Button 
                      className="whitespace-nowrap bg-parkblue-600 hover:bg-parkblue-700 text-white" 
                      onClick={handleFindParking}
                    >
                      Find Parking
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="nearby" className="text-center py-6">
                  <p className="text-sm text-muted-foreground mb-4">
                    {!user 
                      ? "Sign in to view nearby available spots." 
                      : "Find parking spots near your current location."}
                  </p>
                  <Button 
                    variant={user ? "default" : "outline"}
                    className="w-full sm:w-auto" 
                    onClick={handleViewNearby}
                  >
                    {user ? "View Nearby Spots" : "Sign In to View"}
                  </Button>
                </TabsContent>
                
                <TabsContent value="reservations" className="text-center py-6">
                  <p className="text-sm text-muted-foreground mb-4">
                    {user 
                      ? "View and manage your parking reservations." 
                      : "Sign in to view and manage your parking reservations."}
                  </p>
                  <Button 
                    variant={user ? "default" : "outline"}
                    className="w-full sm:w-auto" 
                    onClick={handleViewReservations}
                  >
                    {user ? "View Reservations" : "Sign In to View"}
                  </Button>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>

        {/* Dashboard Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <SmartDashboard />
            <WeeklyTrendsGraph />
          </div>
          <div className="space-y-6">
            <NearbyFacilities />
            <RecentActivity />
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-6 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2025 SpotSwift. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-sm text-muted-foreground hover:text-parkblue-600">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-parkblue-600">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-parkblue-600">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </footer>

      <LoginForm isOpen={loginDialogOpen} onOpenChange={setLoginDialogOpen} />
    </div>
  );
};

export default Index;
