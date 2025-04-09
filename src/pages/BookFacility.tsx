import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BookingForm from '@/components/BookingForm';

interface ParkingSpot {
  id: string;
  number: string;
  type: 'standard' | 'compact' | 'accessible' | 'electric';
  status: 'available' | 'occupied';
  rate: number;
  block: string;
  level: string;
}

interface FacilityDetails {
  id: string;
  name: string;
  address: string;
  totalSpots: number;
  availableSpots: number;
}

const BookFacility = () => {
  const { facilityId } = useParams();
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [selectedLevel, setSelectedLevel] = useState('L1');
  const [facility, setFacility] = useState<FacilityDetails>({
    id: 'fac-001',
    name: 'Central City Parking',
    address: '123 Main Street, City Center',
    totalSpots: 100,
    availableSpots: 45
  });

  // Mock parking spots data
  const parkingSpots: ParkingSpot[] = [
    // Level 1
    { id: 'L1-A1', number: 'A1', type: 'standard', status: 'available', rate: 50, block: 'A', level: 'L1' },
    { id: 'L1-A2', number: 'A2', type: 'standard', status: 'available', rate: 50, block: 'A', level: 'L1' },
    { id: 'L1-B1', number: 'B1', type: 'compact', status: 'available', rate: 40, block: 'B', level: 'L1' },
    { id: 'L1-C1', number: 'C1', type: 'electric', status: 'available', rate: 60, block: 'C', level: 'L1' },
    // Level 2
    { id: 'L2-A1', number: 'A1', type: 'standard', status: 'available', rate: 50, block: 'A', level: 'L2' },
    { id: 'L2-B1', number: 'B1', type: 'accessible', status: 'available', rate: 45, block: 'B', level: 'L2' },
    { id: 'L2-C1', number: 'C1', type: 'electric', status: 'available', rate: 60, block: 'C', level: 'L2' },
  ];

  const levels = ['L1', 'L2', 'L3'];
  const blocks = ['A', 'B', 'C'];

  const filteredSpots = parkingSpots.filter(spot => spot.level === selectedLevel);

  const getSpotTypeIcon = (type: string) => {
    switch (type) {
      case 'standard': return '🚗';
      case 'compact': return '🚙';
      case 'accessible': return '♿';
      case 'electric': return '⚡';
      default: return '🅿️';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Facility Header */}
        <Card className="p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold mb-2">{facility.name}</h1>
              <p className="text-gray-600">{facility.address}</p>
              <div className="mt-2 flex gap-4">
                <span className="text-sm text-gray-600">
                  Total Spots: {facility.totalSpots}
                </span>
                <span className="text-sm text-green-600">
                  Available: {facility.availableSpots}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Facility ID</p>
              <p className="font-medium">{facilityId}</p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Spot Selection Section */}
          <div>
            <Card className="p-4">
              <h2 className="text-xl font-semibold mb-4">Select Parking Spot</h2>
              
              {/* Level Selection */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Select Level</h3>
                <div className="flex gap-2">
                  {levels.map(level => (
                    <Button
                      key={level}
                      variant={selectedLevel === level ? "default" : "outline"}
                      onClick={() => setSelectedLevel(level)}
                      className="flex-1"
                    >
                      Level {level.replace('L', '')}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Spots Grid */}
              <div className="grid grid-cols-1 gap-4">
                {blocks.map(block => {
                  const blockSpots = filteredSpots.filter(spot => spot.block === block);
                  if (blockSpots.length === 0) return null;

                  return (
                    <div key={block} className="space-y-2">
                      <h3 className="font-medium">Block {block}</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {blockSpots.map(spot => (
                          <button
                            key={spot.id}
                            onClick={() => setSelectedSpot(spot)}
                            className={`
                              p-4 rounded-lg border-2 transition-all
                              ${selectedSpot?.id === spot.id 
                                ? 'border-blue-500 bg-blue-50' 
                                : 'border-gray-200 hover:border-blue-200'}
                            `}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-2xl">{getSpotTypeIcon(spot.type)}</span>
                              <span className="font-medium">#{spot.number}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="capitalize text-gray-600">{spot.type}</span>
                              <span className="font-medium">₹{spot.rate}/hr</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Selected Spot Details */}
            {selectedSpot && (
              <Card className="mt-4 p-4 bg-blue-50 border-2 border-blue-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">Selected Spot Details</h3>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm">
                        <span className="text-gray-600">Number:</span> {selectedSpot.number}
                      </p>
                      <p className="text-sm">
                        <span className="text-gray-600">Type:</span> {selectedSpot.type}
                      </p>
                      <p className="text-sm">
                        <span className="text-gray-600">Location:</span> Level {selectedSpot.level.replace('L', '')}, Block {selectedSpot.block}
                      </p>
                      <p className="text-sm">
                        <span className="text-gray-600">Rate:</span> ₹{selectedSpot.rate}/hour
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedSpot(null)}
                  >
                    Change
                  </Button>
                </div>
              </Card>
            )}
          </div>

          {/* Booking Form Section */}
          <div>
            {selectedSpot ? (
              <BookingForm
                facilityId={facility.id}
                facilityName={facility.name}
                spotNumber={selectedSpot.number}
                type={selectedSpot.type}
                onBookingComplete={() => setSelectedSpot(null)}
              />
            ) : (
              <Card className="p-6">
                <div className="text-center space-y-4">
                  <p className="text-gray-600">
                    Please select a parking spot to proceed with your booking
                  </p>
                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                    <div className="text-sm text-gray-600">
                      <p className="flex items-center justify-center gap-2">
                        <span>🚗</span> Standard: ₹50/hr
                      </p>
                      <p className="flex items-center justify-center gap-2">
                        <span>🚙</span> Compact: ₹40/hr
                      </p>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p className="flex items-center justify-center gap-2">
                        <span>♿</span> Accessible: ₹45/hr
                      </p>
                      <p className="flex items-center justify-center gap-2">
                        <span>⚡</span> Electric: ₹60/hr
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookFacility; 