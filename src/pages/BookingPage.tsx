import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import BookingForm from "@/components/BookingForm";
import { Card, CardContent } from "@/components/ui/card";
import FacilityParkingMap from "@/components/FacilityParkingMap";

interface FacilityInfo {
  id: string;
  name: string;
  address: string;
  pricePerHour: number;
  image: string;
}

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

const BookingPage = () => {
  const navigate = useNavigate();
  const { facilityId } = useParams();
  const [facilityInfo, setFacilityInfo] = useState<FacilityInfo | null>(null);
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);

  useEffect(() => {
    // In a real app, fetch facility details from your API
    // This is mock data for demonstration
    setFacilityInfo({
      id: facilityId || "",
      name: "Connaught Place Parking Complex",
      address: "Block A, Connaught Place, New Delhi",
      pricePerHour: 60,
      image: "https://images.unsplash.com/photo-1545179605-1296651e9d43?w=800&auto=format&fit=crop&q=60",
    });
  }, [facilityId]);

  const handleSpotSelect = (spot: ParkingSpot) => {
    setSelectedSpot(spot);
  };

  if (!facilityInfo) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Book Parking Spot</h1>
              <p className="text-muted-foreground">Complete your reservation</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Booking Form and Map */}
          <div className="md:col-span-2 space-y-6">
            <FacilityParkingMap
              facilityId={facilityInfo.id}
              facilityName={facilityInfo.name}
              onSpotSelect={handleSpotSelect}
              selectedSpot={selectedSpot}
            />
            <BookingForm 
              facilityId={facilityInfo.id}
              facilityName={facilityInfo.name}
              pricePerHour={facilityInfo.pricePerHour}
              selectedSpot={selectedSpot}
            />
          </div>

          {/* Facility Summary */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-4">
                <div className="aspect-video rounded-lg overflow-hidden mb-4">
                  <img 
                    src={facilityInfo.image} 
                    alt={facilityInfo.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold text-lg mb-2">{facilityInfo.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">{facilityInfo.address}</p>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Price per hour</span>
                    <span className="font-semibold">₹{facilityInfo.pricePerHour}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Operating hours</span>
                    <span className="font-semibold">24/7</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Need Help?</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Cancellation is free up to 1 hour before</p>
                  <p>• Payment is secured and encrypted</p>
                  <p>• 24/7 customer support available</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage; 