import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Lock, Check } from 'lucide-react';

interface ParkingSpot {
  id: string;
  number: string;
  status: 'available' | 'occupied' | 'selected';
  block: 'A' | 'B';
}

interface InteractiveSpotSelectorProps {
  facilityName: string;
  selectedSpot: ParkingSpot | null;
  onSpotSelect: (spot: ParkingSpot | null) => void;
}

const InteractiveSpotSelector = ({
  facilityName,
  selectedSpot,
  onSpotSelect
}: InteractiveSpotSelectorProps) => {
  const [currentFloor, setCurrentFloor] = useState(2);
  const [availableSpots] = useState(16);

  // Generate spots layout similar to the image
  const generateSpots = (floor: number): ParkingSpot[] => {
    const spots: ParkingSpot[] = [];
    // Block A (Left side)
    for (let i = 1; i <= 6; i++) {
      spots.push({
        id: `A-${i}`,
        number: `${i}`,
        status: Math.random() > 0.3 ? 'available' : 'occupied',
        block: 'A'
      });
    }
    // Block B (Right side)
    for (let i = 1; i <= 6; i++) {
      spots.push({
        id: `B-${i}`,
        number: `${i}`,
        status: Math.random() > 0.3 ? 'available' : 'occupied',
        block: 'B'
      });
    }
    return spots;
  };

  const spots = generateSpots(currentFloor);

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4">
        <h2 className="text-xl font-semibold text-center">{facilityName}</h2>
        
        {/* Floor Navigation */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentFloor(f => Math.max(1, f - 1))}
            className="text-primary-foreground"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <div className="text-center">
            <div className="text-2xl font-bold">{currentFloor}nd Floor</div>
            <div className="text-sm">{availableSpots} Available</div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentFloor(f => Math.min(5, f + 1))}
            className="text-primary-foreground"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Parking Layout */}
      <div className="p-6">
        <div className="relative">
          {/* Entry/Exit Labels */}
          <div className="text-center mb-4 text-muted-foreground">Entry</div>

          {/* Parking Grid */}
          <div className="grid grid-cols-2 gap-8">
            {/* Block A */}
            <div className="space-y-4">
              <div className="bg-muted rounded-lg p-2 text-center font-medium">
                Block A
              </div>
              <div className="space-y-2">
                {spots.filter(spot => spot.block === 'A').map((spot) => (
                  <motion.div
                    key={spot.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => spot.status === 'available' && onSpotSelect(spot)}
                    className={`
                      relative h-16 rounded-lg border-2 cursor-pointer
                      ${spot.status === 'occupied' 
                        ? 'bg-gray-100 border-gray-200 cursor-not-allowed' 
                        : spot.id === selectedSpot?.id
                          ? 'bg-green-50 border-green-500'
                          : 'bg-white border-gray-200 hover:border-primary'}
                    `}
                  >
                    {/* Spot Number */}
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 font-bold">
                      {spot.number}
                    </div>

                    {/* Status Indicator */}
                    {spot.status === 'occupied' ? (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                    ) : spot.id === selectedSpot?.id ? (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Check className="h-5 w-5 text-green-500" />
                      </div>
                    ) : null}

                    {/* Car Icon (if occupied) */}
                    {spot.status === 'occupied' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-6 bg-gray-300 rounded-sm" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Center Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0 border-l-2 border-dashed border-gray-300" />

            {/* Block B */}
            <div className="space-y-4">
              <div className="bg-muted rounded-lg p-2 text-center font-medium">
                Block B
              </div>
              <div className="space-y-2">
                {spots.filter(spot => spot.block === 'B').map((spot) => (
                  <motion.div
                    key={spot.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => spot.status === 'available' && onSpotSelect(spot)}
                    className={`
                      relative h-16 rounded-lg border-2 cursor-pointer
                      ${spot.status === 'occupied' 
                        ? 'bg-gray-100 border-gray-200 cursor-not-allowed' 
                        : spot.id === selectedSpot?.id
                          ? 'bg-green-50 border-green-500'
                          : 'bg-white border-gray-200 hover:border-primary'}
                    `}
                  >
                    {/* Spot Number */}
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 font-bold">
                      {spot.number}
                    </div>

                    {/* Status Indicator */}
                    {spot.status === 'occupied' ? (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                    ) : spot.id === selectedSpot?.id ? (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Check className="h-5 w-5 text-green-500" />
                      </div>
                    ) : null}

                    {/* Car Icon (if occupied) */}
                    {spot.status === 'occupied' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-6 bg-gray-300 rounded-sm" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Exit Label */}
          <div className="text-center mt-4 text-muted-foreground">Exit</div>
        </div>
      </div>
    </Card>
  );
};

export default InteractiveSpotSelector; 