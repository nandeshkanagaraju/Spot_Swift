import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from './ui/button';
import { toast } from './ui/use-toast';

export function TestBooking() {
  const [isLoading, setIsLoading] = useState(false);

  const createTestBooking = async () => {
    setIsLoading(true);
    try {
      // First, create a test parking spot
      const { data: spotData, error: spotError } = await supabase
        .from('parking_spots')
        .insert({
          spot_number: `A${Math.floor(Math.random() * 100)}`,
          location: 'Test Location',
          price_per_hour: 50,
          is_available: true
        })
        .select()
        .single();

      if (spotError) throw spotError;

      // Then create a booking for this spot
      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          parking_spot_id: spotData.id,
          start_time: new Date().toISOString(),
          end_time: new Date(Date.now() + 3600000).toISOString(), // 1 hour later
          vehicle_number: 'TEST123',
          total_amount: 50,
          status: 'pending',
          payment_status: 'pending'
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      toast({
        title: 'Success',
        description: 'Test booking created successfully!',
      });

      console.log('Created booking:', bookingData);
    } catch (error: any) {
      console.error('Error creating test booking:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create test booking',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <Button 
        onClick={createTestBooking} 
        disabled={isLoading}
      >
        {isLoading ? 'Creating...' : 'Create Test Booking'}
      </Button>
    </div>
  );
} 