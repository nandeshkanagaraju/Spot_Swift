import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

interface ParkingSpot {
  id: string;
  number: string;
  type: 'standard' | 'compact' | 'accessible' | 'electric';
  status: 'available' | 'occupied';
  rate: number;
}

interface Facility {
  id: string;
  name: string;
  location: string;
  distance: number;
  availableSpots: number;
  spots: ParkingSpot[];
  image: string;
}

const FindParking = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [bookingDetails, setBookingDetails] = useState({
    date: '',
    startTime: '',
    endTime: ''
  });
  const navigate = useNavigate();

  // Mock facilities data
  const facilities: Facility[] = [
    {
      id: 'f1',
      name: 'Central Parking Complex',
      location: 'MG Road, Bangalore',
      distance: 0.5,
      availableSpots: 15,
      image: '/parking1.jpg',
      spots: [
        { id: 'A1', number: 'A1', type: 'standard', status: 'available', rate: 50 },
        { id: 'A2', number: 'A2', type: 'compact', status: 'available', rate: 40 },
        { id: 'A3', number: 'A3', type: 'electric', status: 'available', rate: 60 },
      ]
    },
    {
      id: 'f2',
      name: 'City Mall Parking',
      location: 'Brigade Road, Bangalore',
      distance: 1.2,
      availableSpots: 8,
      image: '/parking2.jpg',
      spots: [
        { id: 'B1', number: 'B1', type: 'standard', status: 'available', rate: 50 },
        { id: 'B2', number: 'B2', type: 'accessible', status: 'available', rate: 45 },
      ]
    },
    // Add more facilities as needed
  ];

  const calculateTotal = () => {
    if (!bookingDetails.startTime || !bookingDetails.endTime || !selectedSpot) return 0;
    const start = new Date(`2000-01-01T${bookingDetails.startTime}`);
    let end = new Date(`2000-01-01T${bookingDetails.endTime}`);
    if (end < start) end.setDate(end.getDate() + 1);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return Math.round(selectedSpot.rate * hours);
  };

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle booking submission
    navigate('/booking-confirmation');
  };

  const getSpotStyle = (spot: ParkingSpot) => {
    if (spot.status === 'occupied') return 'bg-red-100 cursor-not-allowed';
    if (selectedSpot?.id === spot.id) return 'bg-blue-500 text-white';
    switch (spot.type) {
      case 'standard': return 'bg-green-100 hover:bg-green-200';
      case 'compact': return 'bg-yellow-100 hover:bg-yellow-200';
      case 'accessible': return 'bg-purple-100 hover:bg-purple-200';
      case 'electric': return 'bg-cyan-100 hover:bg-cyan-200';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex gap-4 mb-8">
          <Input
            type="text"
            placeholder="Search by location or facility name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button>Search</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Facilities List */}
          <div className="space-y-4">
            {facilities.map((facility) => (
              <Card
                key={facility.id}
                className={`p-4 cursor-pointer transition-all ${
                  selectedFacility?.id === facility.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => {
                  setSelectedFacility(facility);
                  setSelectedSpot(null);
                }}
              >
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-gray-200 rounded-lg">
                    {/* Add facility image here */}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{facility.name}</h3>
                    <p className="text-gray-600 text-sm">{facility.location}</p>
                    <div className="mt-2 flex items-center gap-4">
                      <span className="text-sm text-gray-600">
                        {facility.distance} km away
                      </span>
                      <span className="text-sm text-green-600">
                        {facility.availableSpots} spots available
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Booking Section */}
          <div>
            {selectedFacility ? (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">{selectedFacility.name}</h2>
                
                {/* Spot Selection */}
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Select Parking Spot</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {selectedFacility.spots.map((spot) => (
                      <button
                        key={spot.id}
                        onClick={() => setSelectedSpot(spot)}
                        disabled={spot.status === 'occupied'}
                        className={`
                          p-3 rounded-lg transition-all
                          flex flex-col items-center
                          ${getSpotStyle(spot)}
                        `}
                      >
                        <span className="font-medium">{spot.number}</span>
                        <span className="text-xs capitalize">{spot.type}</span>
                        <span className="text-xs">₹{spot.rate}/hr</span>
                      </button>
                    ))}
                  </div>
                </div>

                {selectedSpot && (
                  <form onSubmit={handleBooking} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Date</label>
                      <input
                        type="date"
                        value={bookingDetails.date}
                        onChange={(e) => setBookingDetails(prev => ({ ...prev, date: e.target.value }))}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Start Time</label>
                        <input
                          type="time"
                          value={bookingDetails.startTime}
                          onChange={(e) => setBookingDetails(prev => ({ ...prev, startTime: e.target.value }))}
                          className="w-full p-2 border rounded"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">End Time</label>
                        <input
                          type="time"
                          value={bookingDetails.endTime}
                          onChange={(e) => setBookingDetails(prev => ({ ...prev, endTime: e.target.value }))}
                          className="w-full p-2 border rounded"
                          required
                        />
                      </div>
                    </div>

                    <div className="border-t pt-4 mt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-medium">Total Amount:</span>
                        <span className="text-xl font-bold">₹{calculateTotal()}</span>
                      </div>
                      <Button type="submit" className="w-full">
                        Book Now
                      </Button>
                    </div>
                  </form>
                )}
              </Card>
            ) : (
              <Card className="p-6">
                <div className="text-center text-gray-500">
                  Select a facility to view available spots and book parking
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindParking; 