import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Car, MapPin, Clock, Zap, ArrowLeft, Star, Phone, Info, 
  Calendar, BatteryCharging, Shield, Wifi, CreditCard, 
  ThumbsUp, Users, Timer, AlertTriangle, TrendingUp, 
  Droplet, Wind, Thermometer, Camera, ChevronRight, ChevronLeft, Parking
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Carousel } from "@/components/ui/carousel";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { toast } from "@/components/ui/use-toast";

interface ParkingLevel {
  level: string;
  totalSpots: number;
  availableSpots: number;
  evSpots: number;
  compactSpots: number;
  accessibleSpots: number;
}

interface EVCharger {
  type: string;
  power: string;
  available: number;
  total: number;
  estimatedWaitTime?: number;
}

interface WeatherInfo {
  condition: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
}

interface FacilityDetails {
  id: string;
  name: string;
  address: string;
  description: string;
  rating: number;
  reviews: number;
  available: number;
  total: number;
  price: {
    hourly: number;
    daily: number;
    monthly?: number;
    evCharging: number;
  };
  operatingHours: string;
  contact: string;
  hasEV: boolean;
  features: string[];
  amenities: string[];
  parkingLevels: ParkingLevel[];
  evChargers: EVCharger[];
  securityFeatures: string[];
  paymentMethods: string[];
  peakHours: { time: string; occupancy: number }[];
  realTimeOccupancy: number;
  weather: WeatherInfo;
  images: { url: string; alt: string }[];
  services: {
    name: string;
    price: number;
    available: boolean;
  }[];
}

const facilityData: { [key: string]: FacilityDetails } = {
  "fac-001": {
    id: "fac-001",
    name: "Inorbit Mall Parking",
    address: "Inorbit Mall, Whitefield Main Road, Bangalore",
    description: "Multi-level smart parking facility at Inorbit Mall",
    rating: 4.5,
    reviews: 128,
    available: 24,
    total: 150,
    price: {
      hourly: 60,
      daily: 240,
      evCharging: 10
    },
    operatingHours: "24/7",
    contact: "+91 80 4211 0000",
    hasEV: true,
    features: [
      "CCTV Surveillance",
      "EV Charging",
      "Valet Service",
      "Smart Parking System",
      "24/7 Security",
      "Automated Entry/Exit"
    ],
    amenities: [
      "Restrooms",
      "Waiting Lounge",
      "Car Wash",
      "Help Desk"
    ],
    parkingLevels: [
      { level: "1", totalSpots: 50, availableSpots: 24, evSpots: 10, compactSpots: 20, accessibleSpots: 10 },
      { level: "2", totalSpots: 50, availableSpots: 20, evSpots: 8, compactSpots: 22, accessibleSpots: 10 },
      { level: "3", totalSpots: 50, availableSpots: 18, evSpots: 6, compactSpots: 24, accessibleSpots: 12 }
    ],
    evChargers: [
      { type: "Type 2", power: "7.4 kW", available: 10, total: 15 },
      { type: "CHAdeMO", power: "50 kW", available: 8, total: 10 }
    ],
    securityFeatures: [
      "24/7 Security",
      "Automated Entry/Exit"
    ],
    paymentMethods: [
      "Cash",
      "Credit Card",
      "Mobile App"
    ],
    peakHours: [
      { time: "10:00 AM - 12:00 PM", occupancy: 75 },
      { time: "3:00 PM - 5:00 PM", occupancy: 80 }
    ],
    realTimeOccupancy: 50,
    weather: {
      condition: "Sunny",
      temperature: 28,
      humidity: 50,
      windSpeed: 10
    },
    images: [
      { 
        url: "https://images.unsplash.com/photo-1545179605-1296651e9d43?q=80&w=2574",
        alt: "Exterior view of Inorbit Mall Parking Complex" 
      },
      { 
        url: "https://images.unsplash.com/photo-1604063155785-ee4488b8ad15?q=80&w=2574",
        alt: "Modern indoor parking levels" 
      },
      { 
        url: "https://images.unsplash.com/photo-1698257142894-f0e1f9c60e1c?q=80&w=2574",
        alt: "Tesla and EV charging stations" 
      },
      { 
        url: "https://images.unsplash.com/photo-1621977717126-e29965156a27?q=80&w=2574",
        alt: "Smart parking entry system" 
      },
      { 
        url: "https://images.unsplash.com/photo-1580288927815-e36c7a074fb9?q=80&w=2574",
        alt: "24/7 Security monitoring system" 
      },
      { 
        url: "https://images.unsplash.com/photo-1614026480418-bd11fdb9fa99?q=80&w=2574",
        alt: "Premium valet parking service" 
      }
    ],
    services: [
      { name: "Car Wash", price: 50, available: true },
      { name: "Valet Service", price: 100, available: true },
      { name: "Concierge Service", price: 150, available: true },
      { name: "Mobile App Support", price: 0, available: true },
      { name: "Car Care Services", price: 200, available: true }
    ]
  },
  "fac-002": {
    id: "fac-002",
    name: "Brigade Road Multilevel Parking",
    address: "Brigade Road, Near MG Road Metro, Bangalore",
    description: "Modern parking complex in the heart of Brigade Road",
    rating: 4.2,
    reviews: 95,
    available: 12,
    total: 100,
    price: {
      hourly: 50,
      daily: 200,
      evCharging: 0
    },
    operatingHours: "6:00 AM - 11:00 PM",
    contact: "+91 80 4123 5000",
    hasEV: false,
    features: [
      "CCTV Surveillance",
      "Valet Service",
      "Smart Parking System",
      "24/7 Security"
    ],
    amenities: [
      "Restrooms",
      "Waiting Area",
      "Security Guard"
    ],
    parkingLevels: [
      { level: "1", totalSpots: 30, availableSpots: 12, evSpots: 0, compactSpots: 18, accessibleSpots: 10 },
      { level: "2", totalSpots: 30, availableSpots: 10, evSpots: 0, compactSpots: 20, accessibleSpots: 10 },
      { level: "3", totalSpots: 40, availableSpots: 8, evSpots: 0, compactSpots: 24, accessibleSpots: 8 }
    ],
    evChargers: [],
    securityFeatures: [
      "24/7 Security"
    ],
    paymentMethods: [
      "Cash",
      "Credit Card",
      "Mobile App"
    ],
    peakHours: [
      { time: "10:00 AM - 12:00 PM", occupancy: 75 },
      { time: "3:00 PM - 5:00 PM", occupancy: 80 }
    ],
    realTimeOccupancy: 30,
    weather: {
      condition: "Cloudy",
      temperature: 25,
      humidity: 60,
      windSpeed: 5
    },
    images: [
      { 
        url: "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?q=80&w=2574",
        alt: "Brigade Road Parking Complex Exterior" 
      },
      { 
        url: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?q=80&w=2574",
        alt: "Multi-level indoor parking" 
      },
      { 
        url: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=2574",
        alt: "Automated parking guidance system" 
      },
      { 
        url: "https://images.unsplash.com/photo-1611293388250-580b08c4a145?q=80&w=2574",
        alt: "Advanced security cameras" 
      },
      { 
        url: "https://images.unsplash.com/photo-1613638377394-281765460baa?q=80&w=2574",
        alt: "Valet service counter" 
      }
    ],
    services: [
      { name: "Car Wash", price: 50, available: true },
      { name: "Valet Service", price: 100, available: true },
      { name: "Concierge Service", price: 150, available: true },
      { name: "Mobile App Support", price: 0, available: true },
      { name: "Car Care Services", price: 200, available: true }
    ]
  },
  "fac-003": {
    id: "fac-003",
    name: "Phoenix Marketcity Parking",
    address: "Whitefield Road, Mahadevpura, Bangalore",
    description: "Spacious parking facility at Phoenix Marketcity",
    rating: 4.7,
    reviews: 156,
    available: 36,
    total: 200,
    price: {
      hourly: 70,
      daily: 280,
      evCharging: 15
    },
    operatingHours: "24/7",
    contact: "+91 80 6726 6000",
    hasEV: true,
    features: [
      "CCTV Surveillance",
      "EV Charging",
      "Valet Service",
      "Smart Parking System",
      "24/7 Security",
      "Automated Entry/Exit"
    ],
    amenities: [
      "Restrooms",
      "Waiting Lounge",
      "Car Wash",
      "Help Desk",
      "Mobile App Support"
    ],
    parkingLevels: [
      { level: "1", totalSpots: 80, availableSpots: 36, evSpots: 15, compactSpots: 30, accessibleSpots: 15 },
      { level: "2", totalSpots: 80, availableSpots: 30, evSpots: 12, compactSpots: 32, accessibleSpots: 16 },
      { level: "3", totalSpots: 40, availableSpots: 24, evSpots: 12, compactSpots: 16, accessibleSpots: 8 }
    ],
    evChargers: [
      { type: "Type 2", power: "7.4 kW", available: 15, total: 20 },
      { type: "CHAdeMO", power: "50 kW", available: 12, total: 15 }
    ],
    securityFeatures: [
      "24/7 Security",
      "Automated Entry/Exit"
    ],
    paymentMethods: [
      "Cash",
      "Credit Card",
      "Mobile App"
    ],
    peakHours: [
      { time: "10:00 AM - 12:00 PM", occupancy: 75 },
      { time: "3:00 PM - 5:00 PM", occupancy: 80 }
    ],
    realTimeOccupancy: 40,
    weather: {
      condition: "Rainy",
      temperature: 22,
      humidity: 70,
      windSpeed: 10
    },
    images: [
      { 
        url: "https://images.unsplash.com/photo-1470224114660-3f6686c562eb?q=80&w=2574",
        alt: "Phoenix Marketcity Parking Exterior" 
      },
      { 
        url: "https://images.unsplash.com/photo-1587955415523-b5d22aef4a7f?q=80&w=2574",
        alt: "Spacious indoor parking levels" 
      },
      { 
        url: "https://images.unsplash.com/photo-1697800741115-5c1c2f11f179?q=80&w=2574",
        alt: "Modern EV charging infrastructure" 
      },
      { 
        url: "https://images.unsplash.com/photo-1572811298797-9eecadf6cb24?q=80&w=2574",
        alt: "Smart entry/exit barriers" 
      },
      { 
        url: "https://images.unsplash.com/photo-1580274455191-1c62238fa333?q=80&w=2574",
        alt: "CCTV and security systems" 
      },
      { 
        url: "https://images.unsplash.com/photo-1581362072978-14998d01fdaa?q=80&w=2574",
        alt: "Premium valet parking area" 
      }
    ],
    services: [
      { name: "Car Wash", price: 50, available: true },
      { name: "Valet Service", price: 100, available: true },
      { name: "Concierge Service", price: 150, available: true },
      { name: "Mobile App Support", price: 0, available: true },
      { name: "Car Care Services", price: 200, available: true }
    ]
  },
  "fac-004": {
    id: "fac-004",
    name: "UB City Premium Parking",
    address: "24, Vittal Mallya Road, Bangalore",
    description: "Premium parking facility at UB City",
    rating: 4.8,
    reviews: 178,
    available: 8,
    total: 80,
    price: {
      hourly: 80,
      daily: 320,
      evCharging: 20
    },
    operatingHours: "24/7",
    contact: "+91 80 2227 7272",
    hasEV: true,
    features: [
      "CCTV Surveillance",
      "EV Charging",
      "Premium Valet Service",
      "Smart Parking System",
      "24/7 Security",
      "Automated Entry/Exit",
      "Car Care Services"
    ],
    amenities: [
      "Premium Restrooms",
      "Executive Lounge",
      "Car Wash & Detailing",
      "Concierge Service",
      "Mobile App Support"
    ],
    parkingLevels: [
      { level: "1", totalSpots: 20, availableSpots: 8, evSpots: 4, compactSpots: 12, accessibleSpots: 6 },
      { level: "2", totalSpots: 20, availableSpots: 6, evSpots: 2, compactSpots: 12, accessibleSpots: 4 },
      { level: "3", totalSpots: 40, availableSpots: 4, evSpots: 2, compactSpots: 24, accessibleSpots: 10 }
    ],
    evChargers: [
      { type: "Type 2", power: "7.4 kW", available: 4, total: 6 },
      { type: "CHAdeMO", power: "50 kW", available: 2, total: 4 }
    ],
    securityFeatures: [
      "24/7 Security",
      "Automated Entry/Exit"
    ],
    paymentMethods: [
      "Cash",
      "Credit Card",
      "Mobile App"
    ],
    peakHours: [
      { time: "10:00 AM - 12:00 PM", occupancy: 75 },
      { time: "3:00 PM - 5:00 PM", occupancy: 80 }
    ],
    realTimeOccupancy: 20,
    weather: {
      condition: "Sunny",
      temperature: 26,
      humidity: 50,
      windSpeed: 5
    },
    images: [
      { url: "/images/facility10.jpg", alt: "UB City Premium Parking" },
      { url: "/images/facility11.jpg", alt: "UB City Premium Parking" },
      { url: "/images/facility12.jpg", alt: "UB City Premium Parking" }
    ],
    services: [
      { name: "Car Wash", price: 50, available: true },
      { name: "Valet Service", price: 100, available: true },
      { name: "Concierge Service", price: 150, available: true },
      { name: "Mobile App Support", price: 0, available: true },
      { name: "Car Care Services", price: 200, available: true }
    ]
  }
};

const FacilityDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedLevel, setSelectedLevel] = useState("1");
  const [showWeather, setShowWeather] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLiveCamera, setShowLiveCamera] = useState(false);

  const facility = id ? facilityData[id] : null;

  if (!facility) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="min-h-screen flex items-center justify-center"
      >
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Facility Not Found</h2>
            <Button onClick={() => navigate('/facilities')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Facilities
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const renderImageCarousel = () => (
    <div className="relative rounded-xl overflow-hidden h-[500px] mb-6 group">
      {/* Main Image */}
      <motion.div
        key={selectedImageIndex}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0"
      >
        <img
          src={facility.images[selectedImageIndex].url}
          alt={facility.images[selectedImageIndex].alt}
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </motion.div>

      {/* Navigation Arrows */}
      <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="w-12 h-12 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
          onClick={() => setSelectedImageIndex((prev) => 
            prev === 0 ? facility.images.length - 1 : prev - 1
          )}
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="w-12 h-12 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
          onClick={() => setSelectedImageIndex((prev) => 
            prev === facility.images.length - 1 ? 0 : prev + 1
          )}
        >
          <ChevronRight className="h-8 w-8" />
        </Button>
      </div>

      {/* Image Info and Navigation Dots */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="flex flex-col space-y-4">
          <div className="text-white">
            <motion.h1 
              key={facility.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold mb-2"
            >
              {facility.name}
            </motion.h1>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center text-white/90"
            >
              <MapPin className="h-5 w-5 mr-2" />
              {facility.address}
            </motion.div>
          </div>

          {/* Thumbnail Navigation */}
          <div className="flex items-center justify-center gap-3">
            {facility.images.map((_, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedImageIndex(index)}
                className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  index === selectedImageIndex 
                    ? 'border-white opacity-100 scale-110' 
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={facility.images[index].url}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderQuickInfo = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
    >
      {[
        {
          icon: <Car className="h-5 w-5 text-primary" />,
          label: "Available",
          value: `${facility.available} spots`,
          color: facility.available > 10 ? "text-green-600" : "text-amber-600"
        },
        {
          icon: <Clock className="h-5 w-5 text-primary" />,
          label: "Hours",
          value: facility.operatingHours
        },
        {
          icon: <Star className="h-5 w-5 text-yellow-500" />,
          label: "Rating",
          value: `${facility.rating} (${facility.reviews})`
        },
        {
          icon: <Phone className="h-5 w-5 text-primary" />,
          label: "Contact",
          value: facility.contact
        }
      ].map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-lg shadow-sm border p-4"
        >
          <div className="flex items-center space-x-3">
            {item.icon}
            <div>
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className={`font-semibold ${item.color || ''}`}>{item.value}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );

  const renderParkingLevels = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Parking Levels</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {facility.parkingLevels.map((level) => (
            <motion.div
              key={level.level}
              whileHover={{ scale: 1.02 }}
              className={`p-4 rounded-lg cursor-pointer ${
                selectedLevel === level.level ? 'bg-primary/10' : 'bg-gray-50'
              }`}
              onClick={() => setSelectedLevel(level.level)}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Level {level.level}</span>
                <Badge variant={level.availableSpots > 0 ? "success" : "destructive"}>
                  {level.availableSpots} Available
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total Spots:</span>
                  <span>{level.totalSpots}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>EV Spots:</span>
                  <span>{level.evSpots}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Accessible:</span>
                  <span>{level.accessibleSpots}</span>
                </div>
                <Progress 
                  value={(level.availableSpots / level.totalSpots) * 100} 
                  className="h-2"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderEVChargers = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>EV Charging Stations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {facility.evChargers.map((charger, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              className="p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-2 mb-2">
                <BatteryCharging className="h-5 w-5 text-green-500" />
                <div>
                  <div className="font-medium">{charger.type}</div>
                  <div className="text-sm text-muted-foreground">{charger.power}</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Available:</span>
                  <span className="font-medium">{charger.available} / {charger.total}</span>
                </div>
                {charger.estimatedWaitTime && (
                  <div className="flex justify-between text-sm">
                    <span>Est. Wait Time:</span>
                    <span>{charger.estimatedWaitTime} mins</span>
                  </div>
                )}
                <Progress 
                  value={(charger.available / charger.total) * 100} 
                  className="h-2"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderLiveOccupancy = () => (
    <Card className="p-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Live Occupancy
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Current Occupancy</span>
            <Badge variant={facility.realTimeOccupancy > 80 ? "destructive" : "default"}>
              {facility.realTimeOccupancy}%
            </Badge>
          </div>
          <Progress value={facility.realTimeOccupancy} className="h-2" />
          
          <div className="grid grid-cols-3 gap-4 mt-4">
            {facility.parkingLevels.map((level) => (
              <motion.div
                key={level.level}
                className={`p-3 rounded-lg cursor-pointer ${
                  selectedLevel === level.level ? 'bg-primary/10' : 'bg-gray-50'
                }`}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedLevel(level.level)}
              >
                <div className="text-sm font-medium">Level {level.level}</div>
                <div className="text-xs text-muted-foreground">
                  {level.availableSpots} / {level.totalSpots} spots
                </div>
                <div className="mt-1 space-x-2">
                  {level.evSpots > 0 && (
                    <Badge variant="outline" className="text-xs">
                      <BatteryCharging className="h-3 w-3 mr-1" />
                      {level.evSpots} EV
                    </Badge>
                  )}
                  {level.accessibleSpots > 0 && (
                    <Badge variant="outline" className="text-xs">♿ {level.accessibleSpots}</Badge>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderWeatherInfo = () => (
    <AnimatePresence>
      {showWeather && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Card className="p-4">
            <CardHeader>
              <CardTitle className="text-lg">Current Weather</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Thermometer className="h-5 w-5 text-blue-500" />
                  <div>
                    <div className="text-sm text-muted-foreground">Temperature</div>
                    <div className="font-medium">{facility.weather.temperature}°C</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Droplet className="h-5 w-5 text-blue-500" />
                  <div>
                    <div className="text-sm text-muted-foreground">Humidity</div>
                    <div className="font-medium">{facility.weather.humidity}%</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Wind className="h-5 w-5 text-blue-500" />
                  <div>
                    <div className="text-sm text-muted-foreground">Wind</div>
                    <div className="font-medium">{facility.weather.windSpeed} km/h</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const renderLiveCamera = () => (
    <AnimatePresence>
      {showLiveCamera && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Card className="p-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Live Camera Feed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gray-100 rounded-lg relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-muted-foreground">Live camera feed placeholder</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Simple Header with Back Button */}
      <div className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4">
          <div className="h-16 flex items-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/facilities')}
              className="flex items-center -ml-3"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span className="font-medium">Back to Facilities</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {renderImageCarousel()}
        {renderQuickInfo()}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Live Occupancy */}
            {renderLiveOccupancy()}
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <Card>
                  <CardHeader>
                    <CardTitle>About This Facility</CardTitle>
                    <CardDescription>{facility.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {facility.features.map((feature, index) => (
                        <motion.div
                          key={index}
                          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50"
                          whileHover={{ scale: 1.02 }}
                        >
                          <Info className="h-4 w-4 text-primary" />
                          <span>{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="services">
                <Card>
                  <CardHeader>
                    <CardTitle>Available Services</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {facility.services.map((service, index) => (
                        <motion.div
                          key={index}
                          className="p-4 rounded-lg border hover:border-primary cursor-pointer"
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{service.name}</h4>
                              <p className="text-sm text-muted-foreground">₹{service.price}</p>
                            </div>
                            {service.available ? (
                              <Badge variant="success">Available</Badge>
                            ) : (
                              <Badge variant="secondary">Unavailable</Badge>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {facility.securityFeatures.map((feature, index) => (
                        <motion.div
                          key={index}
                          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50"
                          whileHover={{ scale: 1.02 }}
                        >
                          <Shield className="h-4 w-4 text-primary" />
                          <span>{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reviews">
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Reviews</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Add review components here */}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card className="p-4">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowWeather(!showWeather)}
                >
                  {showWeather ? 'Hide Weather' : 'Show Weather'}
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowLiveCamera(!showLiveCamera)}
                >
                  {showLiveCamera ? 'Hide Camera' : 'View Live Camera'}
                </Button>
                <Button 
                  className="w-full"
                  onClick={() => navigate(`/book/${facility.id}`)}
                >
                  Book Now
                </Button>
              </CardContent>
            </Card>

            {renderWeatherInfo()}
            
            {renderLiveCamera()}
            
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Hourly Rate</span>
                    <span className="font-semibold">₹{facility.price.hourly}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Daily Rate</span>
                    <span className="font-semibold">₹{facility.price.daily}</span>
                  </div>
                  {facility.price.monthly && (
                    <div className="flex justify-between">
                      <span>Monthly Rate</span>
                      <span className="font-semibold">₹{facility.price.monthly}</span>
                    </div>
                  )}
                  {facility.hasEV && (
                    <div className="flex justify-between text-green-600">
                      <span>EV Charging</span>
                      <span className="font-semibold">₹{facility.price.evCharging}/kWh</span>
                    </div>
                  )}
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