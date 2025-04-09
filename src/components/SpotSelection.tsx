import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Car } from 'lucide-react';

interface ParkingSpot {
  id: string;
  number: string;
  type: 'standard' | 'compact' | 'accessible' | 'electric';
  status: 'available' | 'occupied' | 'reserved';
  floor: string;
  rate: number;
  vehicleType?: string;
}

interface SpotSelectionProps {
  facilityId: string;
  facilityName: string;
  selectedSpot: ParkingSpot | null;
  onSpotSelect: (spot: ParkingSpot | null) => void;
}

const SpotSelection = ({
  facilityId,
  facilityName,
  selectedSpot,
  onSpotSelect
}: SpotSelectionProps) => {
  const [selectedLevel, setSelectedLevel] = useState('1');
  const [selectedVehicleType, setSelectedVehicleType] = useState('all');

  const vehicleTypes = [
    { id: 'all', label: 'All Vehicles' },
    { id: 'sedan', label: 'Sedan' },
    { id: 'suv', label: 'SUV' },
    { id: 'hatchback', label: 'Hatchback' },
    { id: 'bike', label: 'Bike' },
  ];

  const spots = [
    { id: '1', number: 'A1', type: 'standard', status: 'available', rate: 50, vehicleType: null },
    { id: '2', number: 'A2', type: 'compact', status: 'occupied', rate: 40, vehicleType: 'sedan' },
    { id: '3', number: 'A3', type: 'electric', status: 'reserved', rate: 60, vehicleType: 'suv' },
    { id: '4', number: 'B1', type: 'standard', status: 'available', rate: 50, vehicleType: null },
    { id: '5', number: 'B2', type: 'accessible', status: 'occupied', rate: 45, vehicleType: 'hatchback' },
    { id: '6', number: 'B3', type: 'standard', status: 'available', rate: 50, vehicleType: null },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'standard':
        return '🚗';
      case 'compact':
        return '🚙';
      case 'accessible':
        return '♿';
      case 'electric':
        return '⚡';
      default:
        return '🅿️';
    }
  };

  const getTypeDescription = (type: string) => {
    switch (type) {
      case 'standard':
        return 'Standard parking spot suitable for most vehicles';
      case 'compact':
        return 'Compact spot for small vehicles';
      case 'accessible':
        return 'Accessible parking spot with extra space';
      case 'electric':
        return 'Equipped with EV charging station';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-4">
      {/* Status Legend and Vehicle Filter */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Badge variant="success">Available</Badge>
            <Badge variant="destructive">Occupied</Badge>
            <Badge variant="warning">Reserved</Badge>
          </div>
          <Select value={selectedVehicleType} onValueChange={setSelectedVehicleType}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Vehicle Type" />
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

      {/* Spots Grid */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Select a Parking Spot</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {spots.map((spot) => (
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
                    : 'border-gray-200 hover:border-blue-200'}
              `}
            >
              <div className="text-center space-y-2">
                <span className="text-2xl">
                  {spot.type === 'standard' ? '🚗' :
                   spot.type === 'compact' ? '🚙' :
                   spot.type === 'accessible' ? '♿' : '⚡'}
                </span>
                <div>
                  <div className="font-medium">Spot {spot.number}</div>
                  <div className="text-sm text-gray-600 capitalize">{spot.type}</div>
                </div>
                <div className="text-sm font-medium">₹{spot.rate}/hr</div>
                <Badge
                  variant={
                    spot.status === 'available' ? 'success' :
                    spot.status === 'occupied' ? 'destructive' : 'warning'
                  }
                  className="absolute top-2 right-2"
                >
                  {spot.status}
                </Badge>
                {spot.vehicleType && (
                  <div className="text-xs text-gray-600 flex items-center justify-center gap-1">
                    <Car className="h-3 w-3" />
                    {spot.vehicleType}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default SpotSelection; 