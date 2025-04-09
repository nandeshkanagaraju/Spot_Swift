
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Car, Zap, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Facility {
  id: string;
  name: string;
  distance: string;
  spots: number;
  rating: number;
  price: string;
  hasEV: boolean;
  city: string;
}

const NearbyFacilities = () => {
  const navigate = useNavigate();
  
  // Indian context data for nearby facilities
  const facilities: Facility[] = [
    {
      id: "1",
      name: "Connaught Place Parking Complex",
      distance: "0.5 km",
      spots: 24,
      rating: 4.5,
      price: "₹60/hr",
      hasEV: true,
      city: "New Delhi"
    },
    {
      id: "2",
      name: "MG Road Multilevel Parking",
      distance: "0.8 km",
      spots: 12,
      rating: 4.2,
      price: "₹50/hr",
      hasEV: false,
      city: "Bangalore"
    },
    {
      id: "3",
      name: "Marine Drive Parking Zone",
      distance: "1.2 km",
      spots: 36,
      rating: 4.7,
      price: "₹70/hr",
      hasEV: true,
      city: "Mumbai"
    },
  ];

  const handleFacilityClick = (facilityId: string) => {
    navigate(`/facilities?id=${facilityId}`);
  };

  const renderRatingStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="h-3 w-3 fill-parkyellow-500 text-parkyellow-500" />);
    }

    if (halfStar) {
      stars.push(
        <Star key="half" className="h-3 w-3 fill-parkyellow-500 text-parkyellow-500" style={{ clipPath: "inset(0 50% 0 0)" }} />
      );
    }

    return stars;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Nearby Facilities</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {facilities.map((facility) => (
          <div
            key={facility.id}
            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer"
            onClick={() => handleFacilityClick(facility.id)}
          >
            <div>
              <div className="flex items-center space-x-1 mb-1">
                <h4 className="font-medium">{facility.name}</h4>
                {facility.hasEV && (
                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-500 ml-2 py-0">
                    <Zap className="h-3 w-3 mr-1" />
                    EV
                  </Badge>
                )}
              </div>
              <div className="flex items-center text-xs text-muted-foreground space-x-4">
                <span className="flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  {facility.distance}, {facility.city}
                </span>
                <span className="flex items-center">
                  <Car className="h-3 w-3 mr-1" />
                  {facility.spots} spots
                </span>
                <span className="flex items-center">
                  {renderRatingStars(facility.rating)}
                  <span className="ml-1">{facility.rating}</span>
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-medium text-sm">{facility.price}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground mt-1" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default NearbyFacilities;
