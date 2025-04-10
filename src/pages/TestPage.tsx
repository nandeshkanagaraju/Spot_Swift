import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { toast } from '../components/ui/use-toast';
import { Card } from '../components/ui/card';

interface ParkingSpot {
  id: string;
  spot_number: string;
  location: string;
  price_per_hour: number;
  is_available: boolean;
  created_at: string;
}

interface Booking {
  id: string;
  parking_spot_id: string;
  start_time: string;
  end_time: string;
  vehicle_number: string;
  total_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
}

export default function TestPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Function to fetch data
  const fetchData = async () => {
    setIsLoadingData(true);
    try {
      // Fetch parking spots
      const { data: spotsData, error: spotsError } = await supabase
        .from('parking_spots')
        .select('*')
        .order('created_at', { ascending: false });

      if (spotsError) throw spotsError;
      setParkingSpots(spotsData);

      // Fetch bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (bookingsError) throw bookingsError;
      setBookings(bookingsData);

    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch data',
        variant: 'destructive'
      });
    } finally {
      setIsLoadingData(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

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
          end_time: new Date(Date.now() + 3600000).toISOString(),
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

      // Refresh the data
      fetchData();

    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create test booking',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">Test Booking System</h1>
        <Button 
          onClick={createTestBooking} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Creating...' : 'Create Test Booking'}
        </Button>
      </Card>

      {/* Display Parking Spots */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Parking Spots</h2>
        {isLoadingData ? (
          <p>Loading parking spots...</p>
        ) : (
          <div className="space-y-4">
            {parkingSpots.map(spot => (
              <div key={spot.id} className="border p-4 rounded-lg">
                <p><strong>Spot Number:</strong> {spot.spot_number}</p>
                <p><strong>Location:</strong> {spot.location}</p>
                <p><strong>Price/Hour:</strong> ${spot.price_per_hour}</p>
                <p><strong>Available:</strong> {spot.is_available ? 'Yes' : 'No'}</p>
                <p><strong>Created:</strong> {formatDate(spot.created_at)}</p>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Display Bookings */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Bookings</h2>
        {isLoadingData ? (
          <p>Loading bookings...</p>
        ) : (
          <div className="space-y-4">
            {bookings.map(booking => (
              <div key={booking.id} className="border p-4 rounded-lg">
                <p><strong>Booking ID:</strong> {booking.id}</p>
                <p><strong>Vehicle Number:</strong> {booking.vehicle_number}</p>
                <p><strong>Start Time:</strong> {formatDate(booking.start_time)}</p>
                <p><strong>End Time:</strong> {formatDate(booking.end_time)}</p>
                <p><strong>Total Amount:</strong> ${booking.total_amount}</p>
                <p><strong>Status:</strong> {booking.status}</p>
                <p><strong>Payment Status:</strong> {booking.payment_status}</p>
                <p><strong>Created:</strong> {formatDate(booking.created_at)}</p>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Button 
        onClick={fetchData} 
        variant="outline" 
        className="mt-4"
      >
        Refresh Data
      </Button>
    </div>
  );
} 