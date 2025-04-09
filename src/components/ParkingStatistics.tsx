import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Car, Clock, Calendar, Zap, TrendingUp, AlertTriangle, Sun, Moon } from "lucide-react";
import { toast } from "sonner";

interface ParkingStats {
  totalSpots: number;
  occupiedSpots: number;
  reservedSpots: number;
  evSpots: {
    total: number;
    available: number;
  };
  peakHours: {
    morning: string;
    evening: string;
    currentLoad: number;
  };
  trends: {
    hourly: number;
    daily: number;
  };
  weather: {
    condition: 'sunny' | 'rainy' | 'cloudy';
    impact: number;
  };
}

const ParkingStatistics = () => {
  const [stats, setStats] = useState<ParkingStats>({
    totalSpots: 500,
    occupiedSpots: 280,
    reservedSpots: 50,
    evSpots: {
      total: 50,
      available: 20,
    },
    peakHours: {
      morning: "9:00 AM - 11:00 AM",
      evening: "5:00 PM - 7:00 PM",
      currentLoad: 75,
    },
    trends: {
      hourly: 5,
      daily: 85,
    },
    weather: {
      condition: 'sunny',
      impact: 15,
    },
  });

  const [timeOfDay, setTimeOfDay] = useState<'day' | 'night'>('day');
  const [alerts, setAlerts] = useState<string[]>([]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => {
        // Random fluctuation in occupied spots
        const fluctuation = Math.floor(Math.random() * 11) - 5; // -5 to +5
        const newOccupied = Math.max(0, Math.min(prev.totalSpots, prev.occupiedSpots + fluctuation));
        
        // Update peak hours load based on time
        const hour = new Date().getHours();
        const isPeakHour = (hour >= 9 && hour <= 11) || (hour >= 17 && hour <= 19);
        const newLoad = isPeakHour ? 
          Math.min(100, prev.peakHours.currentLoad + Math.random() * 5) :
          Math.max(30, prev.peakHours.currentLoad - Math.random() * 5);

        // Update time of day
        const newTimeOfDay = (hour >= 6 && hour < 18) ? 'day' : 'night';
        setTimeOfDay(newTimeOfDay);

        // Generate alerts based on conditions
        if (newOccupied > prev.totalSpots * 0.9) {
          const alert = "Parking capacity reaching critical levels!";
          if (!alerts.includes(alert)) {
            setAlerts(prev => [...prev, alert]);
            toast.warning(alert);
          }
        }

        return {
          ...prev,
          occupiedSpots: newOccupied,
          peakHours: {
            ...prev.peakHours,
            currentLoad: newLoad,
          },
          trends: {
            ...prev.trends,
            hourly: fluctuation > 0 ? fluctuation : 0,
          },
        };
      });
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const calculateAvailability = () => {
    const available = stats.totalSpots - stats.occupiedSpots - stats.reservedSpots;
    const percentage = (available / stats.totalSpots) * 100;
    return { available, percentage };
  };

  return (
    <div className="space-y-6">
      {/* Main Stats Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Live Availability Card */}
        <Card className="col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Live Availability
            </CardTitle>
            <Badge 
              variant={calculateAvailability().percentage > 20 ? "default" : "destructive"}
              className="animate-pulse"
            >
              LIVE
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold transition-all duration-500">
                  {calculateAvailability().available}
                </span>
                <span className="text-muted-foreground">
                  spots available
                </span>
              </div>
              <Progress 
                value={calculateAvailability().percentage} 
                className="h-2 transition-all duration-500"
                style={{
                  backgroundColor: calculateAvailability().percentage > 50 ? '#22c55e' :
                                 calculateAvailability().percentage > 20 ? '#eab308' : '#ef4444'
                }}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Peak Hours Prediction */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Peak Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center">
                <Sun className="h-4 w-4 mr-2 text-yellow-500" />
                <span className="text-sm">{stats.peakHours.morning}</span>
              </div>
              <div className="flex items-center">
                <Moon className="h-4 w-4 mr-2 text-blue-500" />
                <span className="text-sm">{stats.peakHours.evening}</span>
              </div>
              <Progress 
                value={stats.peakHours.currentLoad}
                className="h-2 mt-2 transition-all duration-500"
              />
              <p className="text-xs text-muted-foreground">
                Current load: {Math.round(stats.peakHours.currentLoad)}%
              </p>
            </div>
          </CardContent>
        </Card>

        {/* EV Charging Spots */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">EV Charging</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Zap className="h-5 w-5 text-green-500" />
                <span className="text-2xl font-bold transition-all duration-500">
                  {stats.evSpots.available}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                of {stats.evSpots.total} spots available
              </p>
              <Progress 
                value={(stats.evSpots.available / stats.evSpots.total) * 100}
                className="h-2 transition-all duration-500"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts and Notifications */}
      <div className="space-y-2">
        {alerts.map((alert, index) => (
          <div
            key={index}
            className="bg-yellow-50 border-l-4 border-yellow-400 p-4 transition-all duration-300 hover:shadow-md"
          >
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
              <p className="text-sm text-yellow-700">{alert}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Trends and Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Hourly Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <TrendingUp className={`h-5 w-5 mr-2 ${stats.trends.hourly > 0 ? 'text-green-500' : 'text-red-500'}`} />
              <span className="text-2xl font-bold transition-all duration-500">
                {stats.trends.hourly}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Change in last hour
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ParkingStatistics;
