import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

interface BookingFormProps {
  facilityId: string;
  facilityName: string;
  spotNumber: string;
  type: 'standard' | 'compact' | 'accessible' | 'electric';
  onBookingComplete?: () => void;
}

interface UserDetails {
  name: string;
  email: string;
  phone: string;
  vehicleNumber: string;
}

const BookingForm = ({
  facilityId,
  facilityName,
  spotNumber,
  type,
  onBookingComplete
}: BookingFormProps) => {
  const navigate = useNavigate();
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [userDetails, setUserDetails] = useState<UserDetails>({
    name: '',
    email: '',
    phone: '',
    vehicleNumber: ''
  });

  const baseRates = {
    standard: 50,
    compact: 40,
    accessible: 45,
    electric: 60
  };

  // Calculate price whenever time changes
  useEffect(() => {
    if (startTime && endTime) {
      const start = new Date(`2000-01-01T${startTime}`);
      let end = new Date(`2000-01-01T${endTime}`);
      
      if (end < start) {
        end.setDate(end.getDate() + 1);
      }
      
      const durationMs = end.getTime() - start.getTime();
      const hours = durationMs / (1000 * 60 * 60);
      const basePrice = baseRates[type];
      const calculatedPrice = Math.round(basePrice * hours);
      
      setTotalPrice(calculatedPrice > 0 ? calculatedPrice : 0);
    } else {
      setTotalPrice(0);
    }
  }, [startTime, endTime, type]);

  const handleUserDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!userDetails.name || !userDetails.email || !userDetails.phone || !userDetails.vehicleNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill in all user details",
        variant: "destructive"
      });
      return false;
    }

    if (!date || !startTime || !endTime) {
      toast({
        title: "Missing Time Details",
        description: "Please select date and time",
        variant: "destructive"
      });
      return false;
    }

    if (totalPrice <= 0) {
      toast({
        title: "Invalid Time Selection",
        description: "Please select a valid time range",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingData = {
        facilityId,
        facilityName,
        spotNumber,
        type,
        date,
        startTime,
        endTime,
        price: totalPrice,
        status: 'confirmed',
        userDetails,
        bookingTime: new Date().toISOString()
      };

      // Store booking in localStorage
      const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      const newBooking = {
        ...bookingData,
        id: `booking-${Date.now()}`
      };
      localStorage.setItem('bookings', JSON.stringify([...existingBookings, newBooking]));

      toast({
        title: "Booking Successful!",
        description: `Your parking spot ${spotNumber} has been reserved.`,
      });

      if (onBookingComplete) {
        onBookingComplete();
      }

      navigate('/booking-confirmation');

    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* User Details Section */}
      <div className="bg-white p-4 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Personal Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={userDetails.name}
              onChange={handleUserDetailsChange}
              className="w-full p-2 border rounded"
              required
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={userDetails.email}
              onChange={handleUserDetailsChange}
              className="w-full p-2 border rounded"
              required
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={userDetails.phone}
              onChange={handleUserDetailsChange}
              className="w-full p-2 border rounded"
              required
              placeholder="Enter your phone number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Vehicle Number</label>
            <input
              type="text"
              name="vehicleNumber"
              value={userDetails.vehicleNumber}
              onChange={handleUserDetailsChange}
              className="w-full p-2 border rounded"
              required
              placeholder="Enter vehicle number"
            />
          </div>
        </div>
      </div>

      {/* Booking Details Section */}
      <div className="bg-white p-4 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Booking Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Start Time</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Time</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="bg-gray-50 p-4 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">Spot Number</span>
            <span className="font-medium">{spotNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Type</span>
            <span className="capitalize font-medium">{type}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Base Rate</span>
            <span className="font-medium">₹{baseRates[type]}/hour</span>
          </div>
          {startTime && endTime && (
            <div className="flex justify-between">
              <span className="text-sm">Duration</span>
              <span>{calculateDuration(startTime, endTime)}</span>
            </div>
          )}
          <div className="border-t mt-2 pt-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total Price:</span>
              <span className="text-lg font-bold">₹{totalPrice}</span>
            </div>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        disabled={isSubmitting || totalPrice <= 0}
      >
        {isSubmitting ? 'Processing...' : 'Confirm Booking'}
      </Button>
    </form>
  );
};

// Helper function to calculate duration string
const calculateDuration = (start: string, end: string) => {
  const startDate = new Date(`2000-01-01T${start}`);
  let endDate = new Date(`2000-01-01T${end}`);
  
  if (endDate < startDate) {
    endDate.setDate(endDate.getDate() + 1);
  }
  
  const diff = endDate.getTime() - startDate.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}h ${minutes}m`;
};

export default BookingForm; 