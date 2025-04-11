import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ParkingSpot {
  id: string;
  number: string;
  type: string;
  status: 'available' | 'occupied' | 'reserved';
  rate: number;
}

interface GridSpotSelectorProps {
  selectedSpot: ParkingSpot | null;
  onSpotSelect: (spot: ParkingSpot | null) => void;
}

const GridSpotSelector = ({ selectedSpot, onSpotSelect }: GridSpotSelectorProps) => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [availableSpots] = useState(16);

  // Generate spots for the current level
  const generateSpots = (level: number): ParkingSpot[] => {
    const spots: ParkingSpot[] = [];
    for (let i = 1; i <= 12; i++) {
      spots.push({
        id: `${level}-${i}`,
        number: `${i < 10 ? '0' : ''}${i}`,
        type: i % 4 === 0 ? 'accessible' : i % 3 === 0 ? 'compact' : 'standard',
        status: Math.random() > 0.3 ? 'available' : 'occupied',
        rate: 50
      });
    }
    return spots;
  };

  const spots = generateSpots(currentLevel);

  return (
    <div className="space-y-8">
      {/* Status Legend */}
      <div className="flex items-center gap-6 justify-center">
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
                <div className="text-lg">Level {level}</div>
                {currentLevel === level && (
                  <div className="text-sm opacity-75">{availableSpots} Available</div>
                )}
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Spot Grid */}
      <div>
        <h2 className="text-xl font-bold mb-4">Select Spot</h2>
        <div className="grid grid-cols-4 gap-4">
          {spots.map((spot) => (
            <motion.button
              key={spot.id}
              onClick={() => spot.status === 'available' && onSpotSelect(spot)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
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
                  {spot.type === 'standard' ? '🚗' :
                   spot.type === 'compact' ? '🚙' :
                   spot.type === 'accessible' ? '♿' : '⚡'}
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
      </div>
    </div>
  );
};

export default GridSpotSelector; 