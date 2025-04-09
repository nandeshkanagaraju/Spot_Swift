import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Car, Info } from 'lucide-react';

interface ParkingSpot {
  id: string;
  number: string;
  type: 'standard' | 'compact' | 'accessible' | 'electric';
  status: 'available' | 'occupied' | 'reserved';
  rate: number;
  level: string;
  block: string;
  vehicleType?: string;
  occupiedUntil?: string;
}

interface SpotBookingSystemProps {
  facilityId: string;
  facilityName: string;
  selectedSpot: ParkingSpot | null;
  onSpotSelect: (spot: ParkingSpot | null) => void;
}

const SpotBookingSystem = ({
  facilityId,
  facilityName,
  selectedSpot,
  onSpotSelect
}: SpotBookingSystemProps) => {
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState('L1');
  const [selectedBlock, setSelectedBlock] = useState('A');
  const [selectedVehicleType, setSelectedVehicleType] = useState('all');

  const vehicleTypes = [
    { id: 'all', label: 'All Vehicles' },
    { id: 'sedan', label: 'Sedan' },
    { id: 'suv', label: 'SUV' },
    { id: 'hatchback', label: 'Hatchback' },
    { id: 'bike', label: 'Bike' },
  ];

  // Mock parking spots data with more realistic information
  const generateSpots = (level: string, block: string): ParkingSpot[] => {
    const spots: ParkingSpot[] = [];
    const types = ['standard', 'compact', 'accessible', 'electric'] as const;
    const rates = { standard: 50, compact: 40, accessible: 45, electric: 60 };
    const statuses = ['available', 'occupied', 'reserved'] as const;
    const vehicles = ['sedan', 'suv', 'hatchback', 'bike'];
    
    for (let i = 1; i <= 6; i++) {
      const type = types[Math.floor((i - 1) / 2)];
      const status = statuses[Math.floor(Math.random() * 3)];
      const vehicleType = vehicles[Math.floor(Math.random() * vehicles.length)];
      
      spots.push({
        id: `${level}-${block}-${i}`,
        number: `${block}${String(i).padStart(2, '0')}`,
        type,
        status,
        rate: rates[type],
        level,
        block,
        vehicleType: status !== 'available' ? vehicleType : undefined,
        occupiedUntil: status !== 'available' ? getRandomFutureTime() : undefined
      });
    }
    return spots;
  };

  const levels = ['L1', 'L2', 'L3'];
  const blocks = ['A', 'B', 'C', 'D'];
  
  const currentSpots = generateSpots(selectedLevel, selectedBlock)
    .filter(spot => selectedVehicleType === 'all' || spot.vehicleType === selectedVehicleType);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500 text-white';
      case 'occupied':
        return 'bg-red-500 text-white';
      case 'reserved':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getSpotTypeDetails = (type: string) => {
    switch (type) {
      case 'standard':
        return { icon: '🚗', label: 'Standard', description: 'Regular parking spot' };
      case 'compact':
        return { icon: '🚙', label: 'Compact', description: 'For small vehicles' };
      case 'accessible':
        return { icon: '♿', label: 'Accessible', description: 'Wheelchair accessible' };
      case 'electric':
        return { icon: '⚡', label: 'Electric', description: 'With charging point' };
      default:
        return { icon: '🅿️', label: 'Unknown', description: '' };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate(-1)}
                className="flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-bold">{facilityName}</h1>
                <p className="text-sm text-gray-600">Facility ID: {facilityId}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                Dashboard
              </Button>
              <Button variant="outline" onClick={() => navigate('/bookings')}>
                My Bookings
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Status Legend */}
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Badge variant="success">Available</Badge>
                <Badge variant="destructive">Occupied</Badge>
                <Badge variant="warning">Reserved</Badge>
              </div>
              <Select value={selectedVehicleType} onValueChange={setSelectedVehicleType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
                <SelectContent>
                  {vehicleTypes.map(type => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Level Selection */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Select Parking Level</h3>
            <div className="grid grid-cols-3 gap-3">
              {levels.map((level) => (
                <Button
                  key={level}
                  variant={selectedLevel === level ? "default" : "outline"}
                  onClick={() => setSelectedLevel(level)}
                  className="h-16"
                >
                  <div className="text-center">
                    <div className="text-lg font-semibold">Level {level.replace('L', '')}</div>
                    <div className="text-xs text-muted-foreground">
                      {level === selectedLevel ? 'Selected' : 'Click to select'}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </Card>

          {/* Block Selection */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Select Block</h3>
            <div className="grid grid-cols-4 gap-3">
              {blocks.map((block) => (
                <Button
                  key={block}
                  variant={selectedBlock === block ? "default" : "outline"}
                  onClick={() => setSelectedBlock(block)}
                  className="h-16"
                >
                  <div className="text-center">
                    <div className="text-lg font-semibold">Block {block}</div>
                    <div className="text-xs text-muted-foreground">
                      {block === selectedBlock ? 'Selected' : 'Click to select'}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </Card>

          {/* Spots Grid */}
          <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Available Spots</h3>
              <div className="text-sm text-muted-foreground">
                Level {selectedLevel.replace('L', '')} - Block {selectedBlock}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {currentSpots.map((spot) => {
                const typeDetails = getSpotTypeDetails(spot.type);
                return (
                  <button
                    key={spot.id}
                    disabled={spot.status !== 'available'}
                    onClick={() => onSpotSelect(spot)}
                    className={`
                      relative p-4 rounded-lg border-2 transition-all
                      ${spot.status !== 'available'
                        ? 'bg-gray-50 cursor-not-allowed' 
                        : selectedSpot?.id === spot.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'}
                    `}
                  >
                    <div className="text-center space-y-2">
                      <span className="text-2xl">{typeDetails.icon}</span>
                      <div>
                        <div className="font-medium">Spot {spot.number}</div>
                        <div className="text-sm text-gray-600 capitalize">{typeDetails.label}</div>
                      </div>
                      <div className="text-sm font-medium">₹{spot.rate}/hr</div>
                      <Badge
                        className={`absolute top-2 right-2 ${getStatusColor(spot.status)}`}
                      >
                        {spot.status}
                      </Badge>
                      {spot.vehicleType && (
                        <div className="text-xs text-gray-600">
                          <Car className="inline h-3 w-3 mr-1" />
                          {spot.vehicleType}
                        </div>
                      )}
                      {spot.occupiedUntil && (
                        <div className="text-xs text-gray-600">
                          Until: {spot.occupiedUntil}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Selected Spot Details */}
          {selectedSpot && (
            <Card className="p-4 bg-blue-50 border-2 border-blue-200">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">Selected Spot Details</h3>
                    <p className="text-sm text-gray-600">
                      Level {selectedSpot.level.replace('L', '')} - Block {selectedSpot.block}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSpotSelect(null)}
                  >
                    Change Selection
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Spot Number</p>
                    <p className="font-medium text-lg">{selectedSpot.number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Type</p>
                    <p className="font-medium text-lg capitalize flex items-center gap-2">
                      {getSpotTypeDetails(selectedSpot.type).icon} {selectedSpot.type}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Rate</p>
                    <p className="font-medium text-lg">₹{selectedSpot.rate}/hour</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <Badge variant="success" className="mt-1">
                      Available
                    </Badge>
                  </div>
                </div>

                <div className="text-sm text-gray-600 bg-white p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Spot Features:</h4>
                  <ul className="space-y-1">
                    {selectedSpot.type === 'electric' && (
                      <li>✓ Equipped with EV charging station</li>
                    )}
                    {selectedSpot.type === 'accessible' && (
                      <li>✓ Extra wide spot with wheelchair access</li>
                    )}
                    {selectedSpot.type === 'compact' && (
                      <li>✓ Optimized for small vehicles</li>
                    )}
                    {selectedSpot.type === 'standard' && (
                      <li>✓ Standard size spot for most vehicles</li>
                    )}
                    <li>✓ 24/7 CCTV surveillance</li>
                    <li>✓ Well-lit area</li>
                  </ul>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function to generate random future time
const getRandomFutureTime = () => {
  const now = new Date();
  const futureDate = new Date(now.getTime() + Math.random() * 5 * 60 * 60 * 1000); // Random time up to 5 hours
  return futureDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export default SpotBookingSystem; 