export interface Facility {
  id: string;
  name: string;
  address: string;
  description: string;
  totalSpots: number;
  availableSpots: number;
  pricePerHour: number;
  features: string[];
  images: {
    url: string;
    alt: string;
    caption: string;
  }[];
  operatingHours: string;
  contact: string;
}

export const facilities: Facility[] = [
  {
    id: "f1",
    name: "Connaught Place Parking Complex",
    address: "Block A, Connaught Place, New Delhi",
    description: "Multi-level smart parking facility in the heart of Delhi",
    totalSpots: 130,
    availableSpots: 42,
    pricePerHour: 60,
    operatingHours: "24/7",
    contact: "+91 1234567890",
    features: [
      "CCTV Surveillance",
      "EV Charging",
      "Valet Service",
      "Smart Parking System"
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1545179605-1296651e9d43",
        alt: "Connaught Place Parking",
        caption: "Modern parking facility at Connaught Place"
      }
    ]
  },
  {
    id: "f2",
    name: "MG Road Multilevel Parking",
    address: "MG Road, Bangalore",
    description: "State-of-the-art parking complex in Bangalore's business district",
    totalSpots: 200,
    availableSpots: 75,
    pricePerHour: 50,
    operatingHours: "6:00 AM - 11:00 PM",
    contact: "+91 9876543210",
    features: [
      "Automated Entry/Exit",
      "EV Charging",
      "24/7 Security",
      "Car Wash Service"
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1604063155785-ee4488b8ad15",
        alt: "MG Road Parking",
        caption: "Modern parking facility at MG Road"
      }
    ]
  },
  {
    id: "f3",
    name: "Marine Drive Parking Zone",
    address: "Marine Drive, Mumbai",
    description: "Premium parking facility with sea view",
    totalSpots: 150,
    availableSpots: 30,
    pricePerHour: 70,
    operatingHours: "24/7",
    contact: "+91 8765432109",
    features: [
      "Premium Parking",
      "Valet Service",
      "Car Wash",
      "Security Patrol"
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1613638377394-281765460baa",
        alt: "Marine Drive Parking",
        caption: "Premium parking with sea view"
      }
    ]
  },
  {
    id: "f4",
    name: "Cyber City Parking Hub",
    address: "DLF Cyber City, Gurugram",
    description: "Tech-enabled parking solution for corporate professionals",
    totalSpots: 300,
    availableSpots: 120,
    pricePerHour: 55,
    operatingHours: "24/7",
    contact: "+91 7654321098",
    features: [
      "Smart Parking",
      "EV Charging",
      "Mobile App Support",
      "Corporate Packages"
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1470224114660-3f6686c562eb",
        alt: "Cyber City Parking",
        caption: "Modern parking in Cyber City"
      }
    ]
  },
  {
    id: "f5",
    name: "Salt Lake Parking Complex",
    address: "Sector V, Salt Lake, Kolkata",
    description: "Convenient parking solution in Kolkata's IT hub",
    totalSpots: 180,
    availableSpots: 65,
    pricePerHour: 45,
    operatingHours: "6:00 AM - 11:00 PM",
    contact: "+91 6543210987",
    features: [
      "CCTV Coverage",
      "Monthly Passes",
      "Two-wheeler Parking",
      "Security Guards"
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98",
        alt: "Salt Lake Parking",
        caption: "Organized parking in Salt Lake"
      }
    ]
  }
];

export const getFacilityById = (id: string): Facility | undefined => {
  return facilities.find(facility => facility.id === id);
}; 