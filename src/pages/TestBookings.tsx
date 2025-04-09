import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import bookingService from '@/services/bookingService';
import BookingsList from '@/components/BookingsList';

const TestBookings = () => {
  const [isCreating, setIsCreating] = useState(false);

  const createTestBooking = async () => {
    setIsCreating(true);
    try {
      const bookingData = {
        booking_reference: `BOOK-${Date.now()}`,
        facility_id: 'test-facility',
        facility_name: 'Test Parking Facility',
        spot_number: `A-${Math.floor(Math.random() * 100 + 1)}`,
        spot_type: 'standard',
        vehicle_type: 'sedan',
        vehicle_number: `KA-${Math.floor(Math.random() * 9999)}`,
        start_time: new Date().toISOString(),
        end_time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours later
        total_amount: Math.floor(Math.random() * 500 + 100),
        user_email: 'test@example.com'
      };

      await bookingService.createBooking(bookingData);

      toast({
        title: "Success",
        description: "Test booking created successfully!",
      });

      // Refresh the bookings list
      window.location.reload();
    } catch (error) {
      console.error('Error creating test booking:', error);
      toast({
        title: "Error",
        description: "Failed to create test booking",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-6 mb-8">
        <h1 className="text-2xl font-bold mb-4">Test Booking System</h1>
        <Button 
          onClick={createTestBooking} 
          disabled={isCreating}
        >
          {isCreating ? 'Creating...' : 'Create Test Booking'}
        </Button>
      </Card>

      <BookingsList />
    </div>
  );
};

export default TestBookings; 