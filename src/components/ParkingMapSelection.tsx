import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

type SpotStatus = 'available' | 'occupied' | 'selected' | 'reserved' | 'accessible' | 'electric';

interface ParkingSpot {
  id: string;
  number: string;
  type: 'standard' | 'compact' | 'accessible' | 'electric';
  status: SpotStatus;
  position: { row: number; col: number };
}

interface ParkingLevel {
  id: string;
  name: string;
  rows: number;
  columns: number;
  spots: ParkingSpot[];
}

interface ParkingMapSelectionProps {
  facilityId: string;
  selectedSpotType: string;
  onSpotSelect: (spot: ParkingSpot | null) => void;
}

const ParkingMapSelection = ({ 
  facilityId, 
  selectedSpotType, 
  onSpotSelect 
}: ParkingMapSelectionProps) => {
  const [levels, setLevels] = useState<ParkingLevel[]>([]);
  const [activeLevel, setActiveLevel] = useState<string>('');
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Load parking levels and spots
  useEffect(() => {
    const loadParkingData = async () => {
      setLoading(true);
      try {
        // In a real app, fetch from API
        const data = await mockFetchParkingData(facilityId);
        setLevels(data);
        if (data.length > 0) {
          setActiveLevel(data[0].id);
        }
      } finally {
        setLoading(false);
      }
    };

    loadParkingData();
  }, [facilityId]);

  // Filter spots when spot type changes
  useEffect(() => {
    if (selectedSpot && selectedSpot.type !== selectedSpotType) {
      setSelectedSpot(null);
      onSpotSelect(null);
    }
  }, [selectedSpotType, selectedSpot, onSpotSelect]);

  const handleSpotClick = (spot: ParkingSpot) => {
    // Don't allow selection of unavailable spots
    if (spot.status === 'occupied' || spot.status === 'reserved') {
      return;
    }

    // Don't allow selection of spots that don't match the selected type
    if (spot.type !== selectedSpotType) {
      return;
    }

    if (selectedSpot && selectedSpot.id === spot.id) {
      // Deselect if clicking the same spot
      setSelectedSpot(null);
      onSpotSelect(null);
    } else {
      // Select the new spot
      setSelectedSpot(spot);
      onSpotSelect(spot);
    }
  };

  // Get the currently active level
  const currentLevel = levels.find(level => level.id === activeLevel);

  if (loading) {
    return <div className="flex justify-center items-center h-64 bg-gray-100 rounded-lg">
      <div className="animate-pulse">Loading parking map...</div>
    </div>;
  }

  if (!currentLevel) {
    return <div className="bg-red-100 p-4 rounded-lg text-red-700">
      No parking levels available.
    </div>;
  }

  return (
    <div className="space-y-4">
      {/* Level selection */}
      {levels.length > 1 && (
        <div className="flex space-x-2 mb-4">
          {levels.map(level => (
            <Button 
              key={level.id}
              variant={level.id === activeLevel ? "default" : "outline"}
              onClick={() => setActiveLevel(level.id)}
              size="sm"
            >
              {level.name}
            </Button>
          ))}
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm mb-4">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-200 border border-green-500 rounded mr-1"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-500 border border-blue-700 rounded mr-1"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gray-300 border border-gray-500 rounded mr-1"></div>
          <span>Occupied</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-purple-200 border border-purple-500 rounded mr-1"></div>
          <span>Electric</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-yellow-200 border border-yellow-500 rounded mr-1"></div>
          <span>Accessible</span>
        </div>
      </div>

      {/* Parking map */}
      <div className="overflow-auto bg-gray-100 p-4 rounded-lg max-h-[400px]">
        <div 
          className="grid gap-2"
          style={{ 
            gridTemplateColumns: `repeat(${currentLevel.columns}, minmax(40px, 1fr))`,
          }}
        >
          {/* Generate parking spots layout */}
          {currentLevel.spots.map(spot => {
            // Determine spot color based on type and status
            let bgColor = 'bg-green-200 border-green-500'; // default available
            let cursor = 'cursor-pointer';
            
            // Apply selected styling
            if (selectedSpot && selectedSpot.id === spot.id) {
              bgColor = 'bg-blue-500 border-blue-700 text-white';
            }
            // Apply status-based styling
            else if (spot.status === 'occupied' || spot.status === 'reserved') {
              bgColor = 'bg-gray-300 border-gray-500';
              cursor = 'cursor-not-allowed';
            }
            // Apply type-based styling for available spots
            else if (spot.type === 'electric') {
              bgColor = 'bg-purple-200 border-purple-500';
            }
            else if (spot.type === 'accessible') {
              bgColor = 'bg-yellow-200 border-yellow-500';
            }
            else if (spot.type === 'compact') {
              bgColor = 'bg-green-100 border-green-400';
            }
            
            // Highlight spots of the selected type
            const isSelectedType = spot.type === selectedSpotType;
            const opacity = isSelectedType || spot.status === 'occupied' ? 'opacity-100' : 'opacity-40';
            
            return (
              <div
                key={spot.id}
                className={`h-12 border rounded flex items-center justify-center ${bgColor} ${cursor} ${opacity} transition-all`}
                style={{
                  gridColumn: spot.position.col,
                  gridRow: spot.position.row,
                }}
                onClick={() => handleSpotClick(spot)}
                title={`Spot ${spot.number} (${spot.type})`}
              >
                {spot.number}
              </div>
            );
          })}
          
          {/* Add driving lanes */}
          <div 
            className="bg-gray-200 rounded"
            style={{
              gridColumn: '1 / -1',
              gridRow: Math.floor(currentLevel.rows / 2),
              height: '20px'
            }}
          ></div>
        </div>
      </div>

      {/* Selected spot information */}
      {selectedSpot && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-medium text-blue-800">Selected Spot: {selectedSpot.number}</h3>
          <p className="text-sm text-blue-600 capitalize">Type: {selectedSpot.type}</p>
        </div>
      )}
    </div>
  );
};

// Mock data function
const mockFetchParkingData = async (facilityId: string): Promise<ParkingLevel[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Create sample layout
  const generateSpots = (levelId: string, rows: number, cols: number) => {
    const spots: ParkingSpot[] = [];
    
    // Distribution of spot types
    const types: Array<'standard' | 'compact' | 'accessible' | 'electric'> = [
      'standard', 'standard', 'standard', 'standard', 'standard',
      'compact', 'compact',
      'accessible',
      'electric'
    ];
    
    // Generate grid with driving lanes
    for (let row = 1; row <= rows; row++) {
      // Skip middle row for driving lane
      if (row === Math.floor(rows / 2)) continue;
      
      for (let col = 1; col <= cols; col++) {
        const spotNumber = `${String.fromCharCode(64 + row)}${col}`;
        
        // Randomly determine spot type and status
        const typeIndex = Math.floor(Math.random() * types.length);
        const type = types[typeIndex];
        
        // Make some spots occupied (30% chance)
        const status: SpotStatus = Math.random() < 0.3 ? 'occupied' : 'available';
        
        spots.push({
          id: `${levelId}-${row}-${col}`,
          number: spotNumber,
          type,
          status,
          position: { row, col }
        });
      }
    }
    
    return spots;
  };
  
  return [
    {
      id: 'level-1',
      name: 'Level 1',
      rows: 7,
      columns: 10,
      spots: generateSpots('level-1', 7, 10)
    },
    {
      id: 'level-2',
      name: 'Level 2',
      rows: 7,
      columns: 10,
      spots: generateSpots('level-2', 7, 10)
    }
  ];
};

export default ParkingMapSelection; 