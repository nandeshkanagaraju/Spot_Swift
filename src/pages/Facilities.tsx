import { useState } from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Zap, Car, ChevronRight, Filter } from "lucide-react";
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
  
  // Mock data for facilities - in a real app, this would come from your backend
  const facilities: Facility[] = [
    {
      id: "fac-001",
      name: "Downtown Parking Garage",
      address: "123 Main St, Downtown",
      distance: "0.3 miles",
      available: 24,
      total: 150,
      price: "$2.50/hr",
      hasEV: true,
      rating: 4.5,
    },
    {
      id: "fac-002",
      name: "Central Plaza Parking",
      address: "456 Market St, Central District",
      distance: "0.7 miles",
      available: 12,
      total: 100,
      price: "$2.00/hr",
      hasEV: false,
      rating: 4.2,
    },
    {
      id: "fac-003",
      name: "Riverside Parking",
      address: "789 River Rd, Riverside",
      distance: "1.2 miles",
      available: 36,
      total: 200,
      price: "$3.00/hr",
      hasEV: true,
      rating: 4.7,
    },
    {
      id: "fac-004",
      name: "North End Garage",
      address: "321 North St, North District",
      distance: "1.5 miles",
      available: 8,
      total: 80,
      price: "$1.75/hr",
      hasEV: true,
      rating: 3.9,
    },
    {
      id: "fac-005",
      name: "Eastside Parking Complex",
      address: "555 East Ave, East District",
      distance: "2.1 miles",
      available: 42,
      total: 250,
      price: "$2.25/hr",
      hasEV: false,
      rating: 4.1,
    },
  ];

  // Filter facilities based on search term
  const filteredFacilities = facilities.filter(facility =>
    facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    facility.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={`star-${i}`} className="text-yellow-500">★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={`star-${i}`} className="text-yellow-500">★</span>);
      } else {
        stars.push(<span key={`star-${i}`} className="text-gray-300">★</span>);
      }
    }

    return (
      <div className="flex items-center">
        <div className="flex">{stars}</div>
        <span className="ml-1 text-sm text-muted-foreground">{rating}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header onLoginClick={() => {}} />

      <main className="flex-1 container mx-auto px-4 py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Parking Facilities</h1>
          <p className="text-muted-foreground">
            Find and book parking spots at various facilities around the city.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search facilities by name or location"
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" /> Filters
          </Button>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Facilities</TabsTrigger>
            <TabsTrigger value="nearby">Nearby</TabsTrigger>
            <TabsTrigger value="ev">EV Charging</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-4 mt-4">
            {filteredFacilities.map((facility) => (
              <Card key={facility.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="bg-gradient-to-r from-parkblue-700 to-parkblue-500 p-6 text-white md:w-1/3">
                      <h3 className="font-medium text-lg mb-2">{facility.name}</h3>
                      <div className="flex items-start gap-2 mb-2">
                        <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                        <span className="text-sm">{facility.address}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2 text-sm">
                        <span>{facility.distance}</span>
                        <span className="text-xs">•</span>
                        <span>{renderRatingStars(facility.rating)}</span>
                      </div>
                      {facility.hasEV && (
                        <Badge variant="outline" className="bg-blue-600 bg-opacity-50 border-blue-400 text-white">
                          <Zap className="h-3 w-3 mr-1" />
                          EV Charging
                        </Badge>
                      )}
                    </div>
                    <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center flex-grow">
                      <div>
                        <div className="flex items-center mb-2">
                          <Car className="h-4 w-4 mr-2 text-green-500" />
                          <span className="font-medium">
                            {facility.available} spots available
                          </span>
                          <span className="text-muted-foreground text-sm ml-2">
                            (of {facility.total})
                          </span>
                        </div>
                        <div className="text-lg font-bold">{facility.price}</div>
                      </div>
                      <div className="mt-4 md:mt-0">
                        <Button 
                          className="flex items-center" 
                          onClick={() => navigate(`/facility/${facility.id}`)}
                        >
                          View Details <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          <TabsContent value="nearby" className="space-y-4 mt-4">
            {filteredFacilities
              .filter(f => parseFloat(f.distance.split(' ')[0]) < 1.0)
              .map((facility) => (
                // Same facility card as above - keeping the same design
                <Card key={facility.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className="bg-gradient-to-r from-parkblue-700 to-parkblue-500 p-6 text-white md:w-1/3">
                        <h3 className="font-medium text-lg mb-2">{facility.name}</h3>
                        <div className="flex items-start gap-2 mb-2">
                          <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                          <span className="text-sm">{facility.address}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-2 text-sm">
                          <span>{facility.distance}</span>
                          <span className="text-xs">•</span>
                          <span>{renderRatingStars(facility.rating)}</span>
                        </div>
                        {facility.hasEV && (
                          <Badge variant="outline" className="bg-blue-600 bg-opacity-50 border-blue-400 text-white">
                            <Zap className="h-3 w-3 mr-1" />
                            EV Charging
                          </Badge>
                        )}
                      </div>
                      <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center flex-grow">
                        <div>
                          <div className="flex items-center mb-2">
                            <Car className="h-4 w-4 mr-2 text-green-500" />
                            <span className="font-medium">
                              {facility.available} spots available
                            </span>
                            <span className="text-muted-foreground text-sm ml-2">
                              (of {facility.total})
                            </span>
                          </div>
                          <div className="text-lg font-bold">{facility.price}</div>
                        </div>
                        <div className="mt-4 md:mt-0">
                          <Button 
                            className="flex items-center" 
                            onClick={() => navigate(`/facility/${facility.id}`)}
                          >
                            View Details <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>
          <TabsContent value="ev" className="space-y-4 mt-4">
            {filteredFacilities.filter(f => f.hasEV).map((facility) => (
              // Same facility card as above - keeping the same design
              <Card key={facility.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="bg-gradient-to-r from-parkblue-700 to-parkblue-500 p-6 text-white md:w-1/3">
                      <h3 className="font-medium text-lg mb-2">{facility.name}</h3>
                      <div className="flex items-start gap-2 mb-2">
                        <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                        <span className="text-sm">{facility.address}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2 text-sm">
                        <span>{facility.distance}</span>
                        <span className="text-xs">•</span>
                        <span>{renderRatingStars(facility.rating)}</span>
                      </div>
                      <Badge variant="outline" className="bg-blue-600 bg-opacity-50 border-blue-400 text-white">
                        <Zap className="h-3 w-3 mr-1" />
                        EV Charging
                      </Badge>
                    </div>
                    <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center flex-grow">
                      <div>
                        <div className="flex items-center mb-2">
                          <Car className="h-4 w-4 mr-2 text-green-500" />
                          <span className="font-medium">
                            {facility.available} spots available
                          </span>
                          <span className="text-muted-foreground text-sm ml-2">
                            (of {facility.total})
                          </span>
                        </div>
                        <div className="text-lg font-bold">{facility.price}</div>
                      </div>
                      <div className="mt-4 md:mt-0">
                        <Button 
                          className="flex items-center" 
                          onClick={() => navigate(`/facility/${facility.id}`)}
                        >
                          View Details <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
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
