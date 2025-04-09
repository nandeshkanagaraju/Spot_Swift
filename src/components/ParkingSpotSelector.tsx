import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

interface ParkingSpot {
  id: string;
  number: string;
  type: 'standard' | 'compact' | 'accessible' | 'electric';
  status: 'available' | 'occupied' | 'selected';
  position: { row: number; col: number };
}

interface ParkingSpotSelectorProps {
  spotType: 'standard' | 'compact' | 'accessible' | 'electric';
  onSpotSelect: (spot: ParkingSpot | null) => void;
}

const ParkingSpotSelector = ({ spotType, onSpotSelect }: ParkingSpotSelectorProps) => {
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  
  // Generate parking spots layout (mock data - in real app this would come from API)
  const generateParkingSpots = () => {
    const spots: ParkingSpot[] = [];
    const rows = 5;
    const cols = 6;
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const id = `${row}-${col}`;
        const number = `${spotType.charAt(0).toUpperCase()}${row * cols + col + 1}`;
        // Randomly set some spots as occupied (for demo)
        const status = Math.random() > 0.7 ? 'occupied' : 'available';
        
        spots.push({
          id,
          number,
          type: spotType,
          status,
          position: { row, col }
        });
      }
    }
    return spots;
  };

  const [parkingSpots] = useState<ParkingSpot[]>(generateParkingSpots());

  const handleSpotClick = (spot: ParkingSpot) => {
    if (spot.status === 'occupied') {
      toast({
        title: "Spot Unavailable",
        description: "This parking spot is already occupied",
        variant: "destructive",
      });
      return;
    }

    if (selectedSpot?.id === spot.id) {
      setSelectedSpot(null);
      onSpotSelect(null);
    } else {
      setSelectedSpot(spot);
      onSpotSelect(spot);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-100 p-4 rounded-lg">
        <div className="mb-4 flex justify-between items-center">
          <h3 className="font-medium">Select a Parking Spot</h3>
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span>Occupied</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span>Selected</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-6 gap-2 max-w-2xl mx-auto">
          {parkingSpots.map((spot) => (
            <Button
              key={spot.id}
              variant="outline"
              className={`
                aspect-square p-2 text-xs font-medium
                ${spot.status === 'occupied' ? 'bg-red-100 hover:bg-red-100 cursor-not-allowed' : ''}
                ${spot.status === 'available' ? 'bg-green-100 hover:bg-green-200' : ''}
                ${selectedSpot?.id === spot.id ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}
              `}
              onClick={() => handleSpotClick(spot)}
              disabled={spot.status === 'occupied'}
            >
              {spot.number}
            </Button>
          ))}
        </div>
      </div>

      {selectedSpot && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Selected Spot Details</h4>
          <div className="space-y-1 text-sm">
            <p>Spot Number: {selectedSpot.number}</p>
            <p className="capitalize">Type: {selectedSpot.type}</p>
            <p>Location: Row {selectedSpot.position.row + 1}, Column {selectedSpot.position.col + 1}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParkingSpotSelector; 