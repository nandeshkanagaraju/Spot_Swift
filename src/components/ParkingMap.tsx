import { useState, SVGProps, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Info, Calendar, Clock, Car } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { getIndianCities } from '../lib/locationData';

interface ParkingSpot {
  id: string;
  number: string;
  type: 'standard' | 'compact' | 'accessible' | 'electric';
  status: 'available' | 'occupied';
}

interface ParkingMapProps {
  facilityId: string;
  facilityName: string;
  selectedSpot: ParkingSpot | null;
  onSpotSelect: (spot: ParkingSpot | null) => void;
}

const ParkingMap = ({ 
  facilityId, 
  facilityName, 
  selectedSpot,
  onSpotSelect 
}: ParkingMapProps) => {
  const navigate = useNavigate();
  const [showLegend, setShowLegend] = useState(false);
  const [reservationDialogOpen, setReservationDialogOpen] = useState(false);
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [userLocation, setUserLocation] = useState<[number, number]>();
  const [nearbyParkingSpots, setNearbyParkingSpots] = useState<ParkingSpot[]>([]);

  // Mock parking spots data - in real app, this would come from API
  const parkingSpots: ParkingSpot[] = [
    { id: 'A1', number: 'A1', type: 'standard', status: 'available' },
    { id: 'A2', number: 'A2', type: 'compact', status: 'available' },
    { id: 'A3', number: 'A3', type: 'electric', status: 'available' },
    { id: 'B1', number: 'B1', type: 'standard', status: 'occupied' },
    { id: 'B2', number: 'B2', type: 'accessible', status: 'available' },
    { id: 'B3', number: 'B3', type: 'standard', status: 'available' },
    { id: 'C1', number: 'C1', type: 'electric', status: 'available' },
    { id: 'C2', number: 'C2', type: 'compact', status: 'available' },
    { id: 'C3', number: 'C3', type: 'standard', status: 'available' },
  ];

  // Add real-time location tracking
  useEffect(() => {
    navigator.geolocation.watchPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
        fetchNearbyParkingSpots(position.coords);
      },
      (error) => console.error(error),
      { enableHighAccuracy: true }
    );
  }, []);

  const handleSpotClick = (spot: ParkingSpot) => {
    if (spot.status === 'occupied') {
      return;
    }
    onSpotSelect(spot);
  };

  const handleReservation = () => {
    if (selectedSpot) {
      toast({
        title: "Spot Reserved!",
        description: `You have successfully reserved spot ${selectedSpot.number}.`,
        variant: "default",
      });
      setReservationDialogOpen(false);
      
      // Navigate to the calendar to see the reservation
      toast({
        title: "Reservation Added to Calendar",
        description: "View your reservation in the Calendar page.",
      });
      
      // Would typically update the database here
      setTimeout(() => {
        navigate("/calendar");
      }, 1500);
    }
  };

  const legendItems = [
    { label: "Available", className: "spot-available" },
    { label: "Occupied", className: "spot-occupied" },
    { label: "Reserved", className: "spot-reserved" },
    { label: "Accessible", className: "spot-disabled" },
  ];

  const getSpotColor = (spot: ParkingSpot) => {
    if (spot.status === 'occupied') return 'bg-red-500 cursor-not-allowed opacity-50';
    if (selectedSpot?.id === spot.id) return 'bg-blue-500 ring-4 ring-blue-600';
    
    switch (spot.type) {
      case 'standard': return 'bg-green-500 hover:bg-green-600';
      case 'compact': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'accessible': return 'bg-purple-500 hover:bg-purple-600';
      case 'electric': return 'bg-cyan-500 hover:bg-cyan-600';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Select Parking Spot</h3>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          {parkingSpots.map((spot) => (
            <button
              key={spot.id}
              onClick={() => handleSpotClick(spot)}
              className={`
                w-full aspect-square rounded-lg
                flex flex-col items-center justify-center
                transition-all duration-200
                ${getSpotColor(spot)}
              `}
            >
              <span className="text-white font-bold text-lg">{spot.number}</span>
              <span className="text-white text-xs capitalize">{spot.type}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm">Standard</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span className="text-sm">Compact</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-500 rounded"></div>
              <span className="text-sm">Accessible</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-cyan-500 rounded"></div>
              <span className="text-sm">Electric</span>
            </div>
          </div>
        </div>
      </Card>

      {selectedSpot && (
        <Card className="p-4 bg-blue-50 border-2 border-blue-200">
          <h4 className="font-medium mb-2">Selected Spot Details</h4>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">Spot Number:</span> {selectedSpot.number}
            </p>
            <p className="text-sm">
              <span className="font-medium">Type:</span>{' '}
              <span className="capitalize">{selectedSpot.type}</span>
            </p>
          </div>
        </Card>
      )}

      {/* Reservation Dialog */}
      <Dialog open={reservationDialogOpen} onOpenChange={setReservationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reserve Parking Spot {selectedSpot?.number}</DialogTitle>
            <DialogDescription>
              Complete your reservation details below.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-parkblue-500" />
                <span className="text-sm font-medium">Select Date:</span>
              </div>
              <input 
                type="date" 
                className="p-2 border rounded" 
                value={format(selectedDate, "yyyy-MM-dd")}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="py-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-parkblue-500" />
                    Duration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <select className="w-full p-2 border rounded">
                    <option>1 hour - ₹60</option>
                    <option>2 hours - ₹120</option>
                    <option>3 hours - ₹180</option>
                    <option>4 hours - ₹240</option>
                  </select>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="py-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-parkblue-500" />
                    Time Slot
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <select className="w-full p-2 border rounded">
                    <option>10:00 AM - 12:00 PM</option>
                    <option>12:00 PM - 02:00 PM</option>
                    <option>02:00 PM - 04:00 PM</option>
                    <option>04:00 PM - 06:00 PM</option>
                  </select>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="py-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Car className="h-4 w-4 mr-2 text-parkblue-500" />
                  Spot Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm">
                  <span>Spot Number:</span>
                  <span className="font-medium">{selectedSpot?.number}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Type:</span>
                  <span className="capitalize font-medium">{selectedSpot?.type}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Floor:</span>
                  <span className="font-medium">{selectedSpot?.floor}</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span>Price:</span>
                  <span className="font-medium">₹120.00</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setReservationDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleReservation}>Confirm Reservation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ParkingMap;
