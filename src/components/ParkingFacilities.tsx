import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface ParkingSpot {
  id: string;
  type: string;
  hourlyRate: number;
  available: boolean;
}

interface Facility {
  id: string;
  name: string;
  address: string;
  totalSpots: number;
  availableSpots: number;
  distance: number;
  spots: ParkingSpot[];
}

const ParkingFacilities = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app this would be an API call
    fetchFacilities().then(data => {
      setFacilities(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="text-center p-8">Loading parking facilities...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {facilities.map(facility => (
        <Card key={facility.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle>{facility.name}</CardTitle>
            <p className="text-sm text-gray-500">{facility.address}</p>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm">Availability</span>
                <span className="text-sm font-medium">
                  {facility.availableSpots}/{facility.totalSpots} spots
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${(facility.availableSpots / facility.totalSpots) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <h4 className="text-sm font-medium">Spot Types & Rates:</h4>
              {facility.spots.slice(0, 3).map(spot => (
                <div key={spot.id} className="flex justify-between">
                  <span className="text-sm capitalize">{spot.type}</span>
                  <span className="text-sm font-medium">₹{spot.hourlyRate}/hour</span>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between items-center mt-4 pt-2 border-t">
              <div>
                <span className="text-sm text-gray-500">{facility.distance}km away</span>
                <p className="font-medium">From ₹{Math.min(...facility.spots.map(s => s.hourlyRate))}/hour</p>
              </div>
              <Link to={`/facility/${facility.id}`}>
                <Button>Book Now</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Mock API function
const fetchFacilities = async (): Promise<Facility[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return [
    {
      id: "1",
      name: "Central Parking Complex",
      address: "MG Road, Bangalore",
      totalSpots: 200,
      availableSpots: 45,
      distance: 1.2,
      spots: [
        { id: "s1", type: "standard", hourlyRate: 60, available: true },
        { id: "s2", type: "compact", hourlyRate: 50, available: true },
        { id: "s3", type: "accessible", hourlyRate: 70, available: false },
        { id: "s4", type: "electric", hourlyRate: 100, available: true },
      ]
    },
    {
      id: "2",
      name: "Koramangala Multilevel Parking",
      address: "6th Block, Koramangala",
      totalSpots: 150,
      availableSpots: 32,
      distance: 3.5,
      spots: [
        { id: "s1", type: "standard", hourlyRate: 50, available: true },
        { id: "s2", type: "compact", hourlyRate: 40, available: true },
        { id: "s3", type: "accessible", hourlyRate: 60, available: true },
        { id: "s4", type: "electric", hourlyRate: 80, available: false },
      ]
    },
    {
      id: "3",
      name: "Indiranagar Parking Plaza",
      address: "100 Feet Road, Indiranagar",
      totalSpots: 100,
      availableSpots: 15,
      distance: 5.8,
      spots: [
        { id: "s1", type: "standard", hourlyRate: 70, available: true },
        { id: "s2", type: "compact", hourlyRate: 60, available: false },
        { id: "s3", type: "accessible", hourlyRate: 80, available: true },
        { id: "s4", type: "electric", hourlyRate: 120, available: true },
      ]
    }
  ];
};

export default ParkingFacilities; 