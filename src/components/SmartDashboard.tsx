import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Clock,
  Calendar,
  MapPin,
  Car,
  Zap,
  Sun,
  Moon,
  AlertTriangle,
  Users,
  Timer,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

const SmartDashboard = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({
    liveStats: {
      totalSpots: 1200,
      availableNow: 450,
      occupancyRate: 62.5,
      trend: "+5%",
      evCharging: {
        total: 50,
        available: 25,
        charging: 15,
      },
    },
    peakHours: {
      current: 65,
      morning: "9:00 AM - 11:00 AM",
      evening: "5:00 PM - 7:00 PM",
      prediction: "Medium traffic expected",
      nextPeak: "5:00 PM",
    },
    popularLocations: [
      {
        name: "Connaught Place",
        city: "New Delhi",
        availability: 85,
        pricing: "₹60/hr",
      },
      {
        name: "MG Road",
        city: "Bangalore",
        availability: 45,
        pricing: "₹50/hr",
      },
      {
        name: "Marine Drive",
        city: "Mumbai",
        availability: 30,
        pricing: "₹70/hr",
      },
    ],
  });

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        liveStats: {
          ...prev.liveStats,
          availableNow: prev.liveStats.availableNow + Math.floor(Math.random() * 11) - 5,
          occupancyRate: Math.min(100, Math.max(0, prev.liveStats.occupancyRate + (Math.random() * 2 - 1))),
        },
        peakHours: {
          ...prev.peakHours,
          current: Math.min(100, Math.max(0, prev.peakHours.current + (Math.random() * 4 - 2))),
        },
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Live Availability Card */}
        <Card className="bg-gradient-to-br from-parkblue-50 to-white">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Live Availability</CardTitle>
              <Badge variant="secondary" className="animate-pulse">
                Live
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-4xl font-bold text-parkblue-600">
                    {stats.liveStats.availableNow}
                  </p>
                  <p className="text-sm text-muted-foreground">Available Spots</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end text-green-600">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span className="font-medium">{stats.liveStats.trend}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Last hour</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Current Occupancy</span>
                  <span className="font-medium">{Math.round(stats.liveStats.occupancyRate)}%</span>
                </div>
                <Progress 
                  value={stats.liveStats.occupancyRate} 
                  className="h-2"
                  style={{
                    background: `linear-gradient(to right, 
                      ${stats.liveStats.occupancyRate > 80 ? '#ef4444' : 
                        stats.liveStats.occupancyRate > 60 ? '#eab308' : 
                        '#22c55e'} ${stats.liveStats.occupancyRate}%, 
                      #e5e7eb ${stats.liveStats.occupancyRate}%)`
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-parkblue-500" />
                  <div className="text-sm">
                    <p className="font-medium">{stats.liveStats.totalSpots}</p>
                    <p className="text-muted-foreground">Total Capacity</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Timer className="h-4 w-4 text-parkblue-500" />
                  <div className="text-sm">
                    <p className="font-medium">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    <p className="text-muted-foreground">Current Time</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Peak Hours & EV Charging Combined Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Smart Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Peak Hours Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-parkblue-500" />
                  Peak Hours
                </h3>
                <Badge variant="outline" className={
                  stats.peakHours.current > 80 ? "bg-red-100 text-red-800" :
                  stats.peakHours.current > 60 ? "bg-yellow-100 text-yellow-800" :
                  "bg-green-100 text-green-800"
                }>
                  {stats.peakHours.current}% Busy
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Sun className="h-4 w-4 text-yellow-500" />
                  <div>
                    <p className="text-muted-foreground">Morning</p>
                    <p className="font-medium">{stats.peakHours.morning}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Moon className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-muted-foreground">Evening</p>
                    <p className="font-medium">{stats.peakHours.evening}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              {/* EV Charging Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium flex items-center">
                    <Zap className="h-4 w-4 mr-2 text-parkblue-500" />
                    EV Charging
                  </h3>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800">
                    {stats.liveStats.evCharging.available} Available
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-2 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">
                      {stats.liveStats.evCharging.total}
                    </p>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {stats.liveStats.evCharging.available}
                    </p>
                    <p className="text-xs text-muted-foreground">Available</p>
                  </div>
                  <div className="text-center p-2 bg-yellow-50 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-600">
                      {stats.liveStats.evCharging.charging}
                    </p>
                    <p className="text-xs text-muted-foreground">In Use</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Popular Locations */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Popular Locations</CardTitle>
            <Button variant="outline" size="sm" onClick={() => navigate('/facilities')}>
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.popularLocations.map((location, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => navigate(`/facilities?location=${location.name}`)}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin className="h-4 w-4 text-parkblue-500" />
                  <h3 className="font-medium">{location.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{location.city}</p>
                <div className="flex justify-between items-center">
                  <Badge className={
                    location.availability > 50 ? "bg-green-100 text-green-800" : 
                    "bg-yellow-100 text-yellow-800"
                  }>
                    {location.availability}% Free
                  </Badge>
                  <span className="text-sm font-medium">{location.pricing}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartDashboard; 