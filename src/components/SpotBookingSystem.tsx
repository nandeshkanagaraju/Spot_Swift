import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Car, Info, Battery, Wheelchair, ArrowRight } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { motion } from 'framer-motion';

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
  const [hoveredSpot, setHoveredSpot] = useState<string | null>(null);

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

  const getRandomFutureTime = () => {
    const now = new Date();
    const futureDate = new Date(now.getTime() + Math.random() * 24 * 60 * 60 * 1000);
    return futureDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const SpotCard = ({ spot }: { spot: ParkingSpot }) => {
    const typeDetails = getSpotTypeDetails(spot.type);
    const isSelected = selectedSpot?.id === spot.id;
    const isHovered = hoveredSpot === spot.id;

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.button
              disabled={spot.status !== 'available'}
              onClick={() => onSpotSelect(spot)}
              onHoverStart={() => setHoveredSpot(spot.id)}
              onHoverEnd={() => setHoveredSpot(null)}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
              className={`
                relative w-full p-4 rounded-lg border-2 transition-all transform
                ${spot.status !== 'available'
                  ? 'bg-gray-50 cursor-not-allowed' 
                  : isSelected
                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                    : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50 hover:shadow-md'}
                ${isHovered ? 'z-10' : 'z-0'}
              `}
            >
              <div className="text-center space-y-2">
                {/* 3D-like spot number */}
                <div className={`
                  absolute -top-3 -right-3 w-8 h-8 rounded-full
                  flex items-center justify-center text-sm font-bold
                  ${isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100'}
                  transform ${isHovered ? 'scale-110' : ''}
                  transition-transform shadow-md
                `}>
                  {spot.number}
                </div>

                {/* Spot type icon with 3D effect */}
                <div className={`
                  text-3xl transform
                  ${isHovered ? 'scale-110 -translate-y-1' : ''}
                  transition-transform duration-200
                `}>
                  {typeDetails.icon}
                </div>

                {/* Spot details */}
                <div>
                  <div className="font-medium capitalize">{typeDetails.label}</div>
                  <div className="text-sm text-gray-600">₹{spot.rate}/hr</div>
                </div>

                {/* Status badge with glow effect */}
                <Badge
                  className={`
                    absolute top-2 left-2
                    ${getStatusColor(spot.status)}
                    ${spot.status === 'available' ? 'animate-pulse' : ''}
                  `}
                >
                  {spot.status}
                </Badge>

                {/* Vehicle info if occupied */}
                {spot.vehicleType && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-gray-600 flex items-center justify-center gap-1"
                  >
                    <Car className="h-3 w-3" />
                    {spot.vehicleType}
                  </motion.div>
                )}

                {/* Feature icons */}
                <div className="absolute bottom-2 left-2 flex gap-1">
                  {spot.type === 'electric' && <Battery className="h-4 w-4 text-blue-500" />}
                  {spot.type === 'accessible' && <Wheelchair className="h-4 w-4 text-blue-500" />}
                </div>
              </div>
            </motion.button>
          </TooltipTrigger>
          <TooltipContent side="top" className="p-3 max-w-xs">
            <div className="space-y-2">
              <p className="font-medium">{typeDetails.label} Spot {spot.number}</p>
              <p className="text-sm text-gray-600">{typeDetails.description}</p>
              {spot.status === 'available' && (
                <p className="text-sm text-green-600">Available Now</p>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  // Add mini-map component
  const MiniMap = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed bottom-4 right-4 bg-white p-3 rounded-lg shadow-lg border"
    >
      <div className="text-sm font-medium mb-2">Level {selectedLevel} Overview</div>
      <div className="grid grid-cols-4 gap-1">
        {Array.from({ length: 16 }).map((_, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.2 }}
            className={`
              w-3 h-3 rounded-sm cursor-pointer
              ${i === blocks.indexOf(selectedBlock) ? 'bg-blue-500' : 'bg-gray-200'}
            `}
            onClick={() => {
              if (i < blocks.length) {
                setSelectedBlock(blocks[i]);
              }
            }}
          />
        ))}
      </div>
    </motion.div>
  );

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

          {/* Level Selection with 3D effect */}
          <Card className="p-4 relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-50 to-transparent"
              animate={{
                x: [0, 100, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
            <h3 className="text-lg font-semibold mb-4">Select Parking Level</h3>
            <div className="grid grid-cols-3 gap-3">
              {levels.map((level) => (
                <motion.button
                  key={level}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedLevel(level)}
                  className={`
                    relative h-16 rounded-lg transition-all
                    ${selectedLevel === level 
                      ? 'bg-blue-500 text-white shadow-lg' 
                      : 'bg-white border-2 border-gray-200 hover:border-blue-200'}
                  `}
                >
                  <div className="text-center">
                    <div className="text-lg font-semibold">Level {level.replace('L', '')}</div>
                    <div className="text-xs opacity-75">
                      {level === selectedLevel ? 'Selected' : 'Click to select'}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </Card>

          {/* Block Selection with Navigation */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Select Block</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const currentIndex = blocks.indexOf(selectedBlock);
                    if (currentIndex > 0) {
                      setSelectedBlock(blocks[currentIndex - 1]);
                    }
                  }}
                  disabled={blocks.indexOf(selectedBlock) === 0}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const currentIndex = blocks.indexOf(selectedBlock);
                    if (currentIndex < blocks.length - 1) {
                      setSelectedBlock(blocks[currentIndex + 1]);
                    }
                  }}
                  disabled={blocks.indexOf(selectedBlock) === blocks.length - 1}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {blocks.map((block) => (
                <motion.button
                  key={block}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedBlock(block)}
                  className={`
                    h-16 rounded-lg transition-all
                    ${selectedBlock === block 
                      ? 'bg-blue-500 text-white shadow-lg' 
                      : 'bg-white border-2 border-gray-200 hover:border-blue-200'}
                  `}
                >
                  <div className="text-center">
                    <div className="text-lg font-semibold">Block {block}</div>
                    <div className="text-xs opacity-75">
                      {block === selectedBlock ? 'Selected' : 'Click to select'}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </Card>

          {/* Spots Grid with enhanced visuals */}
          <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Available Spots</h3>
              <div className="text-sm text-muted-foreground">
                Level {selectedLevel.replace('L', '')} - Block {selectedBlock}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {currentSpots.map((spot) => (
                <SpotCard key={spot.id} spot={spot} />
              ))}
            </div>
          </Card>

          {/* Selected Spot Details with enhanced visuals */}
          {selectedSpot && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
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
            </motion.div>
          )}
        </div>
      </div>

      {/* Mini-map */}
      <MiniMap />
    </div>
  );
};

export default SpotBookingSystem; 