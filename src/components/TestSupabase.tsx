import { useState, useEffect } from 'react';
import { supabase, testSupabaseConnection } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const TestSupabase = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  const testConnection = async () => {
    const connected = await testSupabaseConnection();
    setIsConnected(connected);
    
    if (connected) {
      toast({
        title: "Connection Successful",
        description: "Successfully connected to Supabase!",
      });
    } else {
      toast({
        title: "Connection Failed",
        description: "Failed to connect to Supabase.",
        variant: "destructive"
      });
    }
  };

  const createTestBooking = async () => {
    try {
      const bookingData = {
        booking_reference: `TEST-${Date.now()}`,
        facility_id: 'test-facility',
        facility_name: 'Test Facility',
        spot_number: 'A1',
        spot_type: 'standard',
        vehicle_type: 'sedan',
        vehicle_number: 'TEST123',
        start_time: new Date().toISOString(),
        end_time: new Date(Date.now() + 3600000).toISOString(),
        total_amount: 100,
        user_email: 'test@example.com'
      };

      const { data, error } = await supabase
        .from('bookings')
        .insert([bookingData])
        .select();

      if (error) throw error;

      toast({
        title: "Test Booking Created",
        description: `Booking reference: ${bookingData.booking_reference}`,
      });
    } catch (error) {
      console.error('Error creating test booking:', error);
      toast({
        title: "Error",
        description: "Failed to create test booking",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Supabase Connection Test</h2>
        <Button onClick={testConnection}>
          Test Connection
        </Button>
        {isConnected !== null && (
          <p className={`text-sm ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
            {isConnected ? 'Connected to Supabase' : 'Failed to connect to Supabase'}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Create Test Booking</h2>
        <Button onClick={createTestBooking}>
          Create Test Booking
        </Button>
      </div>
    </div>
  );
};

export default TestSupabase; 