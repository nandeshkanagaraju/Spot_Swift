import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
  user_details: {
    name: string;
    email: string;
    phone: string;
  };
}

export function BookingHistory() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('bookings_channel')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'bookings' 
        }, 
        (payload) => {
          handleBookingChange(payload);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    }
  }, []);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          parking_spots (
            spot_number,
            location
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingChange = (payload: any) => {
    if (payload.eventType === 'INSERT') {
      setBookings(prev => [payload.new, ...prev]);
    } else if (payload.eventType === 'UPDATE') {
      setBookings(prev => 
        prev.map(booking => 
          booking.id === payload.new.id ? payload.new : booking
        )
      );
    } else if (payload.eventType === 'DELETE') {
      setBookings(prev => 
        prev.filter(booking => booking.id !== payload.old.id)
      );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return <div>Loading bookings...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Your Bookings</h2>
      {bookings.length === 0 ? (
        <Card className="p-6 text-center">
          <p>No bookings found</p>
        </Card>
      ) : (
        bookings.map(booking => (
          <Card key={booking.id} className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold">Booking Details</h3>
                <p>Vehicle: {booking.vehicle_number}</p>
                <p>Start: {formatDate(booking.start_time)}</p>
                <p>End: {formatDate(booking.end_time)}</p>
                <p>Amount: ₹{booking.total_amount}</p>
              </div>
              <div>
                <h3 className="font-semibold">Status</h3>
                <p>Booking: {booking.status}</p>
                <p>Payment: {booking.payment_status}</p>
                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {/* Add cancel/modify functionality */}}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );
} 