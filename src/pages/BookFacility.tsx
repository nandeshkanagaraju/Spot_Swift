import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BookingForm from '@/components/BookingForm';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Lock, Check } from 'lucide-react';
import GridSpotSelector from '@/components/GridSpotSelector';
import SpotStatusGuide from '@/components/SpotStatusGuide';

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
  const [currentLevel, setCurrentLevel] = useState(1);
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [facility, setFacility] = useState<FacilityDetails>({
    id: 'fac-001',
    name: 'Inorbit Mall Parking',
    address: 'Inorbit Mall, Whitefield Main Road, Bangalore',
    totalSpots: 150,
    availableSpots: 24
  });

  // Generate spots for the current level
  const generateSpots = (level: number) => {
    const spots = [];
    for (let i = 1; i <= 12; i++) {
      spots.push({
        id: `${level}-${i}`,
        number: i < 10 ? `10${i}` : `1${i}`,
        type: i % 4 === 0 ? 'accessible' : 'standard',
        status: Math.random() > 0.3 ? 'available' : 'occupied',
        rate: i % 4 === 0 ? 45 : 50
      });
    }
    return spots;
  };

  const spots = generateSpots(currentLevel);
  const availableSpots = spots.filter(spot => spot.status === 'available').length;

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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
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

          {/* Interactive Spot Guide */}
          <div className="mb-6">
            <SpotStatusGuide />
          </div>

          <div className="container mx-auto px-4 py-6">
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Status Guide */}
              <div className="flex items-center justify-center gap-8">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span>Occupied</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span>Reserved</span>
                </div>
              </div>

              {/* Level Selection */}
              <div>
                <h2 className="text-xl font-bold mb-4">Select Level</h2>
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((level) => (
                    <Button
                      key={level}
                      variant={currentLevel === level ? "default" : "outline"}
                      onClick={() => setCurrentLevel(level)}
                      className="h-16"
                    >
                      <div className="text-center">
                        <div className="text-lg font-semibold">Level {level}</div>
                        {currentLevel === level && (
                          <div className="text-sm">{availableSpots} Available</div>
                        )}
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Spot Selection Grid */}
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-4">Select Spot</h2>
                  <div className="grid grid-cols-4 gap-4">
                    {spots.map((spot) => (
                      <motion.button
                        key={spot.id}
                        onClick={() => spot.status === 'available' && setSelectedSpot(spot)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`
                          relative p-4 rounded-lg border-2 transition-all
                          ${spot.status === 'available' 
                            ? selectedSpot?.id === spot.id
                              ? 'border-primary bg-primary/10'
                              : 'border-gray-200 hover:border-primary/50'
                            : 'border-gray-200 bg-gray-50 cursor-not-allowed'}
                        `}
                      >
                        <div className="text-center space-y-2">
                          {/* Car Icon */}
                          <div className="text-3xl">
                            {spot.type === 'accessible' ? '♿' : '🚗'}
                          </div>
                          
                          {/* Spot Number */}
                          <div className="font-bold text-lg">{spot.number}</div>
                          
                          {/* Rate */}
                          <div className="text-sm text-gray-600">₹{spot.rate}/hr</div>

                          {/* Status Indicator */}
                          <div className={`
                            absolute top-2 right-2 w-2 h-2 rounded-full
                            ${spot.status === 'available' ? 'bg-green-500' :
                              spot.status === 'reserved' ? 'bg-yellow-500' : 'bg-red-500'}
                          `} />
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </Card>

                {/* Booking Form */}
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
                      <div className="text-center space-y-3">
                        <p className="text-gray-600">
                          Please select a parking spot to proceed with your booking
                        </p>
                      </div>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookFacility; 