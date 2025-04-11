import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, MapPin, Calendar, Clock, Car, 
  CreditCard, Phone, Mail, AlertTriangle, Loader2 
} from "lucide-react";
import { toast, useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { useBooking } from "@/contexts/BookingContext";

interface BookingDetails {
  id: string;
  facilityName: string;
  spotNumber: string;
  start_time: string;
  end_time: string;
  vehicle_number: string;
  total_amount: number;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  payment_status: string;
  payment_method: string;
  user_details: {
    name: string;
    email: string;
    phone: string;
    vehicle_type: string;
  };
  parking_spot_id: string;
}

const BookingDetails = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const { cancelBooking: contextCancelBooking } = useBooking();

  useEffect(() => {
    fetchBookingDetails();
  }, [id]);

  const fetchBookingDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setBooking(data);
    } catch (error) {
      console.error('Error fetching booking:', error);
      toast({
        title: "Error",
        description: "Failed to load booking details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!booking || !booking.id) {
      toast({
        title: "Error",
        description: "Booking information not found",
        variant: "destructive"
      });
      return;
    }

    setCancelling(true);
    try {
      // 1. Begin transaction-like operations
      // First, get the current booking status to ensure it hasn't changed
      const { data: currentBooking, error: fetchError } = await supabase
        .from('bookings')
        .select('status, parking_spot_id')
        .eq('id', booking.id)
        .single();

      if (fetchError) throw fetchError;

      if (currentBooking.status === 'cancelled') {
        throw new Error('This booking has already been cancelled');
      }

      // 2. Update booking status
      const { error: bookingError } = await supabase
        .from('bookings')
        .update({ 
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', booking.id)
        .select()
        .single();

      if (bookingError) throw bookingError;

      // 3. Release the parking spot
      if (currentBooking.parking_spot_id) {
        const { error: spotError } = await supabase
          .from('parking_spots')
          .update({ 
            is_available: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentBooking.parking_spot_id);

        if (spotError) throw spotError;
      }

      // 4. Update booking context
      await contextCancelBooking(booking.id);

      // 5. Update local state
      setBooking(prev => prev ? {
        ...prev,
        status: 'cancelled',
        cancelled_at: new Date().toISOString()
      } : null);

      // 6. Show success message
      toast({
        title: "Booking Cancelled",
        description: "Your booking has been cancelled successfully.",
      });

      // 7. Close dialog
      setShowCancelDialog(false);

      // 8. Redirect after a short delay
      setTimeout(() => {
        navigate('/reservations');
      }, 1500);

    } catch (error: any) {
      console.error('Error cancelling booking:', error);
      toast({
        title: "Cancellation Failed",
        description: error.message || "Failed to cancel booking. Please try again or contact support.",
        variant: "destructive"
      });
    } finally {
      setCancelling(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!booking) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6 text-center">
          <CardContent>
            <h2 className="text-xl font-semibold mb-2">Booking Not Found</h2>
            <p className="text-gray-600 mb-4">The booking you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/reservations')}>
              View All Bookings
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/reservations')}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Reservations
              </Button>
              <h1 className="text-2xl font-bold">Booking Details</h1>
            </div>
            {booking.status === 'upcoming' && (
              <Button 
                variant="destructive"
                onClick={() => setShowCancelDialog(true)}
              >
                Cancel Booking
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Status Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Booking Reference</p>
                  <p className="font-semibold">{booking.id}</p>
                </div>
                <Badge className={getStatusBadgeColor(booking.status)}>
                  {booking.status}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Location Details */}
          <Card>
            <CardHeader>
              <CardTitle>Location Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="font-medium">{booking.facilityName}</p>
                  <p className="text-gray-600">Spot {booking.spotNumber}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="font-medium">Duration</p>
                  <p className="text-gray-600">From: {formatDate(booking.start_time)}</p>
                  <p className="text-gray-600">To: {formatDate(booking.end_time)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Details */}
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Car className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="font-medium">Vehicle Information</p>
                  <p className="text-gray-600">
                    {booking.user_details.vehicle_type} - {booking.vehicle_number}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Details */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <CreditCard className="h-5 w-5 text-primary mt-1" />
                <div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Payment Method</p>
                      <p className="text-gray-600">{booking.payment_method}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">Amount</p>
                      <p className="text-xl font-bold">₹{booking.total_amount}</p>
                    </div>
                  </div>
                  <Badge 
                    className={booking.payment_status === 'completed' ? 
                      'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                  >
                    {booking.payment_status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-gray-600">{booking.user_details.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-gray-600">{booking.user_details.email}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Cancel Booking Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this booking? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium">Please note:</p>
              <ul className="list-disc list-inside mt-1">
                <li>Cancellation fees may apply</li>
                <li>Refunds will be processed within 5-7 business days</li>
                <li>The parking spot will be released for others to book</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
              disabled={cancelling}
            >
              Keep Booking
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelBooking}
              disabled={cancelling}
            >
              {cancelling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                'Cancel Booking'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingDetails; 