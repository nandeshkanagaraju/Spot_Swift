import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PRICING, formatPrice } from '@/utils/pricing';

interface ParkingSpot {
  id: string;
  type: 'standard' | 'compact' | 'accessible' | 'electric';
  basePrice: number;
  available: boolean;
}

interface Facility {
  id: string;
  name: string;
  location: string;
  spots: ParkingSpot[];
  distance: number;
}

const FindParking = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      const results = await mockSearchFacilities(searchQuery);
      setFacilities(results);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Input
          placeholder="Search by location or facility name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {facilities.map((facility) => (
          <Card key={facility.id} className="p-4">
            <h3 className="text-lg font-semibold">{facility.name}</h3>
            <p className="text-sm text-gray-500">{facility.location}</p>
            <p className="text-sm text-gray-500">{facility.distance}km away</p>
            
            <div className="mt-4 space-y-2">
              <h4 className="font-medium">Available Spots:</h4>
              {facility.spots.map((spot) => (
                <div key={spot.id} className="flex justify-between items-center">
                  <span className="capitalize">{spot.type}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {formatPrice(PRICING.BASE_RATES[spot.type as keyof typeof PRICING.BASE_RATES])}/hr
                    </span>
                    {spot.available ? (
                      <span className="text-green-500 text-sm">Available</span>
                    ) : (
                      <span className="text-red-500 text-sm">Occupied</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Starting from</span>
                <span className="text-lg font-bold">
                  {formatPrice(Math.min(...Object.values(PRICING.BASE_RATES)))}/hr
                </span>
              </div>
            </div>

            <Button className="w-full mt-4">
              View Details
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Mock function to simulate API call
const mockSearchFacilities = async (query: string): Promise<Facility[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return [
    {
      id: '1',
      name: 'Central Parking Complex',
      location: 'MG Road, Bangalore',
      distance: 1.2,
      spots: [
        { id: 's1', type: 'standard', basePrice: 60, available: true },
        { id: 's2', type: 'compact', basePrice: 50, available: true },
        { id: 's3', type: 'electric', basePrice: 80, available: false },
      ],
    },
    // Add more mock facilities as needed
  ];
};

export default FindParking; 