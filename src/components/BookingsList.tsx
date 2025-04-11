import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import bookingService from '@/services/bookingService';
import { toast } from '@/components/ui/use-toast';

const BookingsList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const data = await bookingService.getUserBookings(user.email);
      setBookings(data);
    } catch (error) {
      console.error('Error loading bookings:', error);
      toast({
        title: "Error",
        description: "Failed to load bookings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">Loading bookings...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Your Bookings</h2>
      {bookings.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-gray-600 mb-4">No bookings found</p>
          <Button onClick={() => window.location.href = '/facilities'}>
            Book a Parking Spot
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {bookings.map((booking: any) => (
            <Card key={booking.id} className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{booking.facility_name}</h3>
                  <p className="text-sm text-gray-600">
                    Booking Reference: {booking.booking_reference}
                  </p>
                  <p className="text-sm text-gray-600">
                    Spot: {booking.spot_number}
                  </p>
                  <p className="text-sm text-gray-600">
                    Vehicle: {booking.vehicle_type} - {booking.vehicle_number}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-lg">₹{booking.total_amount}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(booking.start_time).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(booking.start_time).toLocaleTimeString()} - 
                    {new Date(booking.end_time).toLocaleTimeString()}
                  </p>
                  <Badge className={
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }>
                    {booking.status}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingsList; 