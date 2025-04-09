import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info, Car } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ParkingSpot {
  id: string;
  spotNumber: string;
  type: "standard" | "compact" | "accessible" | "electric";
  status: "available" | "occupied" | "reserved" | "disabled";
  floor: number;
  coordinates: {
    x: number;
    y: number;
  };
}

interface FacilityParkingMapProps {
  facilityId: string;
  facilityName: string;
  onSpotSelect: (spot: ParkingSpot) => void;
  selectedSpot?: ParkingSpot | null;
}

const FacilityParkingMap = ({
  facilityId,
  facilityName,
  onSpotSelect,
  selectedSpot,
}: FacilityParkingMapProps) => {
  const [currentFloor, setCurrentFloor] = useState(1);
  const [showLegend, setShowLegend] = useState(false);
  const { toast } = useToast();
  const [spots, setSpots] = useState<ParkingSpot[]>([]);

  // In a real app, fetch this from your backend
  useEffect(() => {
    // Mock data generator for different facilities
    const generateSpots = (facilityId: string): ParkingSpot[] => {
      const spots: ParkingSpot[] = [];
      const floors = 2;
      const spotsPerRow = 5;
      const rows = 4;
      
      for (let floor = 1; floor <= floors; floor++) {
        for (let row = 0; row < rows; row++) {
          for (let spot = 0; spot < spotsPerRow; spot++) {
            const spotNumber = `${String.fromCharCode(65 + row)}${spot + 1}`;
            spots.push({
              id: `${facilityId}-${floor}-${spotNumber}`,
              spotNumber,
              type: getSpotType(row, spot),
              status: getRandomStatus(),
              floor,
              coordinates: {
                x: 100 + spot * 60,
                y: 30 + row * 80,
              },
            });
          }
        }
      }
      return spots;
    };

    setSpots(generateSpots(facilityId));
  }, [facilityId]);

  const getSpotType = (row: number, spot: number): ParkingSpot["type"] => {
    if (row === 0) return "standard";
    if (row === 1) return "compact";
    if (row === 2) return spot === 0 ? "accessible" : "standard";
    return spot === 0 ? "electric" : "standard";
  };

  const getRandomStatus = (): ParkingSpot["status"] => {
    const statuses: ParkingSpot["status"][] = ["available", "occupied", "reserved"];
    return statuses[Math.floor(Math.random() * 3)];
  };

  const getStatusClass = (status: ParkingSpot["status"]) => {
    switch (status) {
      case "available":
        return "fill-green-500 cursor-pointer hover:fill-green-600";
      case "occupied":
        return "fill-red-500";
      case "reserved":
        return "fill-yellow-500";
      case "disabled":
        return "fill-gray-500";
      default:
        return "fill-gray-300";
    }
  };

  const handleSpotClick = (spot: ParkingSpot) => {
    if (spot.status === "available") {
      onSpotSelect(spot);
    } else {
      toast({
        title: "Spot Unavailable",
        description: `Parking spot ${spot.spotNumber} is ${spot.status}.`,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">Parking Map</CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowLegend(!showLegend)}
          >
            <Info className="h-4 w-4 mr-2" />
            Legend
          </Button>
          <div className="flex gap-2">
            {Array.from({ length: 2 }, (_, i) => i + 1).map((floor) => (
              <Button
                key={floor}
                variant={currentFloor === floor ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentFloor(floor)}
              >
                Floor {floor}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {showLegend && (
          <div className="mb-4 p-2 bg-muted rounded-md flex flex-wrap gap-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded mr-2" />
              <span className="text-sm">Available</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded mr-2" />
              <span className="text-sm">Occupied</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-500 rounded mr-2" />
              <span className="text-sm">Reserved</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded mr-2" />
              <span className="text-sm">Accessible</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-purple-500 rounded mr-2" />
              <span className="text-sm">Electric</span>
            </div>
          </div>
        )}

        <div className="relative w-full overflow-x-auto">
          <div className="min-w-[600px]">
            <svg width="600" height="400" className="mx-auto">
              {/* Background */}
              <rect x="50" y="20" width="500" height="360" fill="#f8fafc" rx="4" />

              {/* Driving lanes */}
              <rect x="50" y="100" width="500" height="60" fill="#e2e8f0" rx="2" />
              <rect x="50" y="240" width="500" height="60" fill="#e2e8f0" rx="2" />

              {/* Lane markings */}
              <line x1="50" y1="130" x2="550" y2="130" stroke="white" strokeDasharray="10,10" />
              <line x1="50" y1="270" x2="550" y2="270" stroke="white" strokeDasharray="10,10" />

              {/* Parking spots */}
              {spots
                .filter((spot) => spot.floor === currentFloor)
                .map((spot) => (
                  <g
                    key={spot.id}
                    onClick={() => handleSpotClick(spot)}
                    className="transition-colors duration-200"
                    role="button"
                    tabIndex={0}
                    aria-label={`Parking spot ${spot.spotNumber}, ${spot.status}`}
                  >
                    <rect
                      x={spot.coordinates.x}
                      y={spot.coordinates.y}
                      width="40"
                      height="60"
                      className={getStatusClass(spot.status)}
                      rx="2"
                    />
                    <text
                      x={spot.coordinates.x + 20}
                      y={spot.coordinates.y + 30}
                      textAnchor="middle"
                      fill="white"
                      fontSize="12"
                      fontWeight="bold"
                    >
                      {spot.spotNumber}
                    </text>
                    {spot.type !== "standard" && (
                      <text
                        x={spot.coordinates.x + 20}
                        y={spot.coordinates.y + 45}
                        textAnchor="middle"
                        fill="white"
                        fontSize="8"
                      >
                        {spot.type.charAt(0).toUpperCase()}
                      </text>
                    )}
                  </g>
                ))}
            </svg>
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <Badge variant="outline" className="text-xs">
            Floor {currentFloor}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {spots.filter((s) => s.floor === currentFloor && s.status === "available").length} spots available
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default FacilityParkingMap; 