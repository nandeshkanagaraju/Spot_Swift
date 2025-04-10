import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import { ArrowLeft } from 'lucide-react';
import StatusLegend from '@/components/StatusLegend';
import { supabase } from '@/lib/supabase';

interface ParkingSpot {
  id: string;
  number: string;
  type: 'standard' | 'compact' | 'accessible' | 'electric';
  status: 'available' | 'occupied' | 'reserved';
  rate: number;
  level: string;
}

const FacilityBooking = () => {
  const { facilityId } = useParams();
  const navigate = useNavigate();
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [selectedLevel, setSelectedLevel] = useState('1');
  const [bookingDetails, setBookingDetails] = useState({
    date: '',
    startTime: '',
    endTime: '',
    name: '',
    email: '',
    phone: '',
    vehicleNumber: '',
    vehicleType: 'sedan'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock facility data
  const facility = {
    id: facilityId,
    name: 'Central Parking Complex',
    address: '123 Main Street, City Center',
    levels: ['1', '2', '3'],
    spotsPerLevel: 20
  };

  const vehicleTypes = [
    { value: 'sedan', label: 'Sedan 🚗' },
    { value: 'suv', label: 'SUV 🚙' },
    { value: 'bike', label: 'Bike 🏍️' },
    { value: 'ev', label: 'Electric Vehicle ⚡' }
  ];

  // Generate spots for the selected level
  const generateSpots = (level: string): ParkingSpot[] => {
    const spots: ParkingSpot[] = [];
    const types = ['standard', 'compact', 'accessible', 'electric'] as const;
    const rates = { standard: 50, compact: 40, accessible: 45, electric: 60 };

    for (let i = 1; i <= facility.spotsPerLevel; i++) {
      const type = types[Math.floor((i - 1) / 5)];
      spots.push({
        id: `L${level}-${i}`,
        number: `${level}${String(i).padStart(2, '0')}`,
        type,
        status: Math.random() > 0.3 ? 'available' : 'occupied',
        rate: rates[type],
        level
      });
    }
    return spots;
  };

  const spots = generateSpots(selectedLevel);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBookingDetails(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const calculateTotal = () => {
    if (!selectedSpot || !bookingDetails.startTime || !bookingDetails.endTime) return 0;
    
    const start = new Date(`2000/01/01 ${bookingDetails.startTime}`);
    const end = new Date(`2000/01/01 ${bookingDetails.endTime}`);
    if (end < start) end.setDate(end.getDate() + 1);
    
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return Math.round(selectedSpot.rate * hours);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSpot) {
      toast({
        title: "Error",
        description: "Please select a parking spot",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // First, create or get parking spot in Supabase
      const { data: spotData, error: spotError } = await supabase
        .from('parking_spots')
        .insert({
          spot_number: selectedSpot.number,
          location: facility.name,
          price_per_hour: selectedSpot.rate,
          is_available: true
        })
        .select()
        .single();

      if (spotError) {
        // If spot already exists, try to get it
        const { data: existingSpot, error: getSpotError } = await supabase
          .from('parking_spots')
          .select()
          .eq('spot_number', selectedSpot.number)
          .single();

        if (getSpotError) throw getSpotError;
        spotData = existingSpot;
      }

      // Create the booking in Supabase
      const startDateTime = new Date(`${bookingDetails.date}T${bookingDetails.startTime}`);
      const endDateTime = new Date(`${bookingDetails.date}T${bookingDetails.endTime}`);
      
      const bookingInsertData = {
        parking_spot_id: spotData.id,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        vehicle_number: bookingDetails.vehicleNumber,
        total_amount: calculateTotal(),
        status: 'pending',
        payment_status: 'pending',
        user_details: {
          name: bookingDetails.name,
          email: bookingDetails.email,
          phone: bookingDetails.phone,
          vehicle_type: bookingDetails.vehicleType
        }
      };

      console.log('Creating booking with data:', bookingInsertData);

      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .insert(bookingInsertData)
        .select()
        .single();

      if (bookingError) {
        console.error('Booking error:', bookingError);
        throw bookingError;
      }

      console.log('Booking created successfully:', bookingData);

      // Update spot availability
      const { error: updateSpotError } = await supabase
        .from('parking_spots')
        .update({ is_available: false })
        .eq('id', spotData.id);

      if (updateSpotError) throw updateSpotError;

      toast({
        title: "Booking Successful!",
        description: `Your parking spot ${selectedSpot.number} has been reserved.`,
      });

      // Navigate to payment page with booking details
      navigate('/payment', {
        state: { 
          bookingDetails: {
            ...bookingData,
            facilityName: facility.name,
            spotNumber: selectedSpot.number
          },
          paymentDetails: {
            bookingId: bookingData.id,
            amount: bookingData.total_amount,
            facilityName: facility.name,
            spotNumber: selectedSpot.number
          }
        }
      });

    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Booking Failed",
        description: error.message || "There was an error processing your booking. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header onLoginClick={() => {}} />
      
      {/* Navigation Bar */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate(-1)}
                className="flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-bold">Book Parking Spot</h1>
                <p className="text-sm text-gray-600">Facility: {facility.name}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 py-6">
        <Card className="max-w-6xl mx-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">{facility.name}</h1>
            <p className="text-gray-600">{facility.address}</p>
          </div>

          {/* Status Legend */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Spot Status Guide</h3>
            <StatusLegend />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Spot Selection Section */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-4">Select Level</h2>
                <div className="flex gap-2">
                  {facility.levels.map(level => (
                    <Button
                      key={level}
                      variant={selectedLevel === level ? "default" : "outline"}
                      onClick={() => setSelectedLevel(level)}
                      className="flex-1"
                    >
                      Level {level}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Select Spot</h2>
                <div className="grid grid-cols-4 gap-3">
                  {spots.map(spot => (
                    <button
                      key={spot.id}
                      disabled={spot.status === 'occupied'}
                      onClick={() => setSelectedSpot(spot)}
                      className={`
                        p-3 rounded-lg border-2 transition-all
                        ${spot.status === 'occupied' 
                          ? 'bg-gray-100 cursor-not-allowed opacity-50' 
                          : selectedSpot?.id === spot.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-200'}
                      `}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-1">
                          {spot.type === 'standard' ? '🚗' :
                           spot.type === 'compact' ? '🚙' :
                           spot.type === 'accessible' ? '♿' : '⚡'}
                        </div>
                        <div className="font-medium">{spot.number}</div>
                        <div className="text-sm text-gray-600">₹{spot.rate}/hr</div>
                      </div>
                    </button>
                  ))}
                </div>

                {selectedSpot && (
                  <Card className="mt-4 p-4 bg-blue-50 border-2 border-blue-200">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-semibold">Selected: Spot {selectedSpot.number}</h3>
                        <p className="text-sm text-gray-600 capitalize">{selectedSpot.type} Spot</p>
                        <p className="text-sm font-medium">₹{selectedSpot.rate}/hour</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedSpot(null)}
                      >
                        Change
                      </Button>
                    </div>
                  </Card>
                )}
              </div>
            </div>

            {/* Booking Form Section */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Booking Details</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={bookingDetails.date}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Start Time</label>
                    <input
                      type="time"
                      name="startTime"
                      value={bookingDetails.startTime}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">End Time</label>
                    <input
                      type="time"
                      name="endTime"
                      value={bookingDetails.endTime}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Personal Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={bookingDetails.name}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={bookingDetails.email}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={bookingDetails.phone}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Vehicle Number</label>
                      <input
                        type="text"
                        name="vehicleNumber"
                        value={bookingDetails.vehicleNumber}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="block text-sm font-medium mb-1">Vehicle Type</label>
                  <select
                    name="vehicleType"
                    value={bookingDetails.vehicleType}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  >
                    {vehicleTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedSpot && bookingDetails.startTime && bookingDetails.endTime && (
                  <Card className="p-4 bg-gray-50">
                    <h3 className="font-medium mb-2">Booking Summary</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Spot Type</span>
                        <span className="capitalize">{selectedSpot.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Rate</span>
                        <span>₹{selectedSpot.rate}/hour</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration</span>
                        <span>{calculateDuration(bookingDetails.startTime, bookingDetails.endTime)}</span>
                      </div>
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between font-medium">
                          <span>Total Amount</span>
                          <span>₹{calculateTotal()}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting || !selectedSpot}
                >
                  {isSubmitting ? 'Processing...' : 'Confirm Booking'}
                </Button>
              </form>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

// Helper function to calculate duration
const calculateDuration = (start: string, end: string) => {
  const startDate = new Date(`2000/01/01 ${start}`);
  let endDate = new Date(`2000/01/01 ${end}`);
  if (endDate < startDate) endDate.setDate(endDate.getDate() + 1);
  
  const hours = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60));
  const minutes = Math.floor(((endDate.getTime() - startDate.getTime()) % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}h ${minutes}m`;
};

export default FacilityBooking; 