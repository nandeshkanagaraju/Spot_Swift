
import { useEffect } from "react";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Car, Calendar, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const Profile = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home if not authenticated
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleVehicleDetailsUpdate = () => {
    toast("Vehicle details update feature coming soon", {
      description: "This feature will be available in the next update."
    });
  };

  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name.charAt(0)}${profile.last_name.charAt(0)}`;
    }
    
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    
    return "U";
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header onLoginClick={() => {}} />

      <main className="flex-1 container mx-auto px-4 py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
          <p className="text-muted-foreground">
            View and manage your account details.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Overview */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder.svg" alt={profile?.first_name || "User"} />
                  <AvatarFallback className="text-xl">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="text-xl font-medium">
                    {profile ? `${profile.first_name} ${profile.last_name}` : "User"}
                  </h3>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              
              <div className="pt-2">
                <h4 className="text-sm font-medium mb-2">Account Status</h4>
                <div className="flex items-center space-x-2 mb-4">
                  <Badge className="bg-green-500">Active</Badge>
                  <span className="text-sm text-muted-foreground">Since {new Date().toLocaleDateString('en-IN')}</span>
                </div>
                
                <Link to="/settings">
                  <Button className="w-full">Edit Profile</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Details */}
          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Vehicle Details</CardTitle>
              <CardDescription>Information about your registered vehicles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-parkblue-100 text-parkblue-600 flex items-center justify-center rounded-full">
                        <Car className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium">Primary Vehicle</h3>
                        <p className="text-sm text-muted-foreground">
                          {profile?.vehicle_license_plate || "No license plate registered"}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">Default</Badge>
                  </div>
                </div>

                <Button variant="outline" className="w-full" onClick={handleVehicleDetailsUpdate}>
                  Add Another Vehicle
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Parking History */}
          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Recent Parking History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    location: "Connaught Place Parking Complex",
                    city: "New Delhi",
                    date: "15 Apr 2025",
                    duration: "8 hours",
                    amount: "₹480.00"
                  },
                  {
                    location: "MG Road Parking Zone",
                    city: "Bangalore",
                    date: "12 Apr 2025",
                    duration: "5 hours",
                    amount: "₹250.00"
                  }
                ].map((activity, index) => (
                  <div key={index} className="flex justify-between p-4 border rounded-lg">
                    <div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <h4 className="font-medium">{activity.location}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground ml-6">{activity.city}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{activity.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {activity.duration} • {activity.amount}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => navigate('/reservations')}>
                View All Reservations
              </Button>
            </CardFooter>
          </Card>

          {/* Account Summary */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Account Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Total Reservations</h4>
                  <p className="text-2xl font-bold">4</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Total Spent</h4>
                  <p className="text-2xl font-bold">₹1,610.00</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Favorite Location</h4>
                  <p className="text-sm">Connaught Place Parking Complex, New Delhi</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Profile;
