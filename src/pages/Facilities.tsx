import { useState } from "react";
import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Zap, Car, ChevronRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

interface Facility {
  id: string;
  name: string;
  address: string;
  distance: string;
  available: number;
  total: number;
  price: string;
  hasEV: boolean;
  rating: number;
}

const Facilities = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const facilities: Facility[] = [
    {
      id: "fac-001",
      name: "Inorbit Mall Parking",
      address: "Inorbit Mall, Whitefield Main Road, Bangalore",
      distance: "0.3 miles",
      available: 24,
      total: 150,
      price: "₹60/hr",
      hasEV: true,
      rating: 4.5,
    },
    {
      id: "fac-002",
      name: "Brigade Road Multilevel Parking",
      address: "Brigade Road, Near MG Road Metro, Bangalore",
      distance: "0.7 miles",
      available: 12,
      total: 100,
      price: "₹50/hr",
      hasEV: false,
      rating: 4.2,
    },
    {
      id: "fac-003",
      name: "Phoenix Marketcity Parking",
      address: "Whitefield Road, Mahadevpura, Bangalore",
      distance: "1.2 miles",
      available: 36,
      total: 200,
      price: "₹70/hr",
      hasEV: true,
      rating: 4.7,
    },
    {
      id: "fac-004",
      name: "UB City Premium Parking",
      address: "24, Vittal Mallya Road, Bangalore",
      distance: "1.5 miles",
      available: 8,
      total: 80,
      price: "₹80/hr",
      hasEV: true,
      rating: 4.8,
    }
  ];

  const filteredFacilities = facilities.filter(facility =>
    facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    facility.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderRatingStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={i < rating ? "text-yellow-500" : "text-gray-300"}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onLoginClick={() => {}} />

      <main className="container mx-auto px-4 py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Parking Facilities</h1>
          <p className="text-muted-foreground">
            Find and book parking spots at various facilities around the city.
          </p>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search facilities by name or location"
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Facilities</TabsTrigger>
            <TabsTrigger value="nearby">Nearby</TabsTrigger>
            <TabsTrigger value="ev">EV Charging</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 mt-4">
            {filteredFacilities.map((facility) => (
              <Card key={facility.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="md:w-1/3">
                      <h3 className="text-lg font-medium mb-2">{facility.name}</h3>
                      <div className="flex items-start gap-2 mb-2">
                        <MapPin className="h-4 w-4 mt-1" />
                        <span className="text-sm text-gray-600">{facility.address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>{facility.distance}</span>
                        <span>•</span>
                        <span className="flex">{renderRatingStars(facility.rating)}</span>
                      </div>
                      {facility.hasEV && (
                        <Badge className="mt-2 bg-blue-100 text-blue-800">
                          <Zap className="h-3 w-3 mr-1" />
                          EV Charging
                        </Badge>
                      )}
                    </div>

                    <div className="flex-grow flex flex-col md:flex-row justify-between items-start md:items-center">
                      <div>
                        <div className="flex items-center mb-2">
                          <Car className="h-4 w-4 mr-2 text-green-500" />
                          <span className="font-medium">
                            {facility.available} spots available
                          </span>
                          <span className="text-gray-500 text-sm ml-2">
                            (of {facility.total})
                          </span>
                        </div>
                        <div className="text-lg font-bold">{facility.price}</div>
                      </div>
                      
                      <Button 
                        className="mt-4 md:mt-0"
                        onClick={() => navigate(`/facility/${facility.id}`)}
                      >
                        View Details
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="nearby" className="space-y-4 mt-4">
            {filteredFacilities
              .filter(f => parseFloat(f.distance) < 1.0)
              .map((facility) => (
                <Card key={facility.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="md:w-1/3">
                        <h3 className="text-lg font-medium mb-2">{facility.name}</h3>
                        <div className="flex items-start gap-2 mb-2">
                          <MapPin className="h-4 w-4 mt-1" />
                          <span className="text-sm text-gray-600">{facility.address}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>{facility.distance}</span>
                          <span>•</span>
                          <span className="flex">{renderRatingStars(facility.rating)}</span>
                        </div>
                        {facility.hasEV && (
                          <Badge className="mt-2 bg-blue-100 text-blue-800">
                            <Zap className="h-3 w-3 mr-1" />
                            EV Charging
                          </Badge>
                        )}
                      </div>

                      <div className="flex-grow flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div>
                          <div className="flex items-center mb-2">
                            <Car className="h-4 w-4 mr-2 text-green-500" />
                            <span className="font-medium">
                              {facility.available} spots available
                            </span>
                            <span className="text-gray-500 text-sm ml-2">
                              (of {facility.total})
                            </span>
                          </div>
                          <div className="text-lg font-bold">{facility.price}</div>
                        </div>
                        
                        <Button 
                          className="mt-4 md:mt-0"
                          onClick={() => navigate(`/facility/${facility.id}`)}
                        >
                          View Details
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>

          <TabsContent value="ev" className="space-y-4 mt-4">
            {filteredFacilities
              .filter(f => f.hasEV)
              .map((facility) => (
                <Card key={facility.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="md:w-1/3">
                        <h3 className="text-lg font-medium mb-2">{facility.name}</h3>
                        <div className="flex items-start gap-2 mb-2">
                          <MapPin className="h-4 w-4 mt-1" />
                          <span className="text-sm text-gray-600">{facility.address}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>{facility.distance}</span>
                          <span>•</span>
                          <span className="flex">{renderRatingStars(facility.rating)}</span>
                        </div>
                        {facility.hasEV && (
                          <Badge className="mt-2 bg-blue-100 text-blue-800">
                            <Zap className="h-3 w-3 mr-1" />
                            EV Charging
                          </Badge>
                        )}
                      </div>

                      <div className="flex-grow flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div>
                          <div className="flex items-center mb-2">
                            <Car className="h-4 w-4 mr-2 text-green-500" />
                            <span className="font-medium">
                              {facility.available} spots available
                            </span>
                            <span className="text-gray-500 text-sm ml-2">
                              (of {facility.total})
                            </span>
                          </div>
                          <div className="text-lg font-bold">{facility.price}</div>
                        </div>
                        
                        <Button 
                          className="mt-4 md:mt-0"
                          onClick={() => navigate(`/facility/${facility.id}`)}
                        >
                          View Details
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Facilities;
