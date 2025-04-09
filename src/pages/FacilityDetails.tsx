import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car, MapPin, Clock, Zap, ArrowLeft, Star, Phone, Info } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const FacilityDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const facility = {
    id: id,
    name: "Connaught Place Parking Complex",
    address: "Block A, Connaught Place, New Delhi",
    description: "Multi-level smart parking facility in the heart of Delhi",
    rating: 4.5,
    reviews: 128,
    available: 42,
    total: 130,
    price: "₹60/hour",
    operatingHours: "24/7",
    contact: "+91 1234567890",
    images: [
      {
        url: "https://images.unsplash.com/photo-1545179605-1296651e9d43?w=800&auto=format&fit=crop&q=60",
        alt: "Modern Parking Entrance",
        caption: "State-of-the-art entrance with automated barriers"
      },
      {
        url: "https://images.unsplash.com/photo-1604063155785-ee4488b8ad15?w=800&auto=format&fit=crop&q=60",
        alt: "Indoor Parking Level",
        caption: "Spacious indoor parking levels with clear markings"
      },
      {
        url: "https://images.unsplash.com/photo-1613638377394-281765460baa?w=800&auto=format&fit=crop&q=60",
        alt: "Premium Parking Section",
        caption: "Premium parking spots with extra space"
      },
      {
        url: "https://images.unsplash.com/photo-1470224114660-3f6686c562eb?w=800&auto=format&fit=crop&q=60",
        alt: "Security and Monitoring",
        caption: "24/7 security monitoring and CCTV coverage"
      }
    ],
    features: [
      "CCTV Surveillance",
      "EV Charging",
      "Valet Service",
      "Smart Parking System",
      "24/7 Security",
      "Automated Entry/Exit",
      "Vehicle Wash Service",
      "Emergency Assistance"
    ],
    amenities: [
      "Restrooms",
      "Waiting Lounge",
      "Car Wash",
      "Security Guard",
      "Help Desk",
      "Mobile App Support"
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Navigation */}
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
              <h1 className="text-2xl font-bold">{facility.name}</h1>
              <div className="flex items-center text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1" />
                {facility.address}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Quick Info Bar */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3">
              <Car className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Available</p>
                <p className="font-semibold">{facility.available} spots</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Hours</p>
                <p className="font-semibold">{facility.operatingHours}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Star className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Rating</p>
                <p className="font-semibold">{facility.rating} ({facility.reviews})</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Contact</p>
                <p className="font-semibold">{facility.contact}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card>
              <CardContent className="p-0">
                <div className="relative aspect-video">
                  <img
                    src={facility.images[selectedImageIndex].url}
                    alt={facility.images[selectedImageIndex].alt}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4">
                    <p className="text-sm">{facility.images[selectedImageIndex].caption}</p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 p-4">
                  {facility.images.map((image, index) => (
                    <div
                      key={index}
                      className={`cursor-pointer aspect-video relative rounded-md overflow-hidden ${
                        selectedImageIndex === index ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Facility Information */}
            <Card>
              <CardHeader>
                <CardTitle>About This Facility</CardTitle>
                <CardDescription>{facility.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="features" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="features">Features</TabsTrigger>
                    <TabsTrigger value="amenities">Amenities</TabsTrigger>
                    <TabsTrigger value="rules">Rules & Info</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="features">
                    <div className="grid grid-cols-2 gap-4">
                      {facility.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Zap className="h-4 w-4 text-primary" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="amenities">
                    <div className="grid grid-cols-2 gap-4">
                      {facility.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Info className="h-4 w-4 text-primary" />
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="rules">
                    <div className="space-y-2">
                      <p>• Vehicle must be parked in designated areas only</p>
                      <p>• Please keep your parking ticket safe</p>
                      <p>• Maximum height limit: 2.2 meters</p>
                      <p>• The facility is under CCTV surveillance</p>
                      <p>• Lost ticket will incur additional charges</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Book Now</CardTitle>
                <CardDescription>Secure your parking spot</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Price</span>
                    <span className="font-bold">{facility.price}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Available Spots</span>
                    <span>{facility.available} of {facility.total}</span>
                  </div>
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => navigate(`/book/${facility.id}`)}
                >
                  Continue to Book
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Free cancellation up to 1 hour before
                </p>
              </CardContent>
            </Card>

            {/* Map Card */}
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                  {/* Replace with actual map component */}
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    Map View
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacilityDetails; 