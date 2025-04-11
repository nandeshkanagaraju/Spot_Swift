import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useBooking } from '@/contexts/BookingContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

const Reservations = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { bookings, cancelBooking } = useBooking();
  const [reservations, setReservations] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  
  useEffect(() => {
    // Redirect to home if not authenticated
    if (!user) {
      navigate("/");
    }
    
    // Load reservations from localStorage
    const savedReservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    setReservations(savedReservations);
  }, [user, navigate]);

  useEffect(() => {
    // Your reservations will now automatically stay in sync
    // with the calendar through the shared context
  }, [bookings]);

  // Indian context data for reservations - in a real app, this would come from your backend
  const reservationsData = [
    {
      id: "res-001",
      facilityName: "Connaught Place Parking Complex",
      spotNumber: "A23",
      date: "2025-04-15",
      startTime: "09:00 AM",
      endTime: "05:00 PM",
      status: "upcoming",
      price: "₹480.00",
      location: "New Delhi"
    },
    {
      id: "res-002",
      facilityName: "MG Road Parking Zone",
      spotNumber: "B12",
      date: "2025-04-12",
      startTime: "10:00 AM",
      endTime: "03:00 PM",
      status: "active",
      price: "₹250.00",
      location: "Bangalore"
    },
    {
      id: "res-003",
      facilityName: "Marine Drive Parking",
      spotNumber: "C45",
      date: "2025-04-05",
      startTime: "08:00 AM",
      endTime: "06:00 PM",
      status: "completed",
      price: "₹700.00",
      location: "Mumbai"
    },
    {
      id: "res-004",
      facilityName: "Salt Lake Parking Area",
      spotNumber: "A15",
      date: "2025-03-28",
      startTime: "02:00 PM",
      endTime: "06:00 PM",
      status: "completed",
      price: "₹180.00",
      location: "Kolkata"
    },
    {
      id: "res-005",
      facilityName: "Phoenix Mall Parking",
      spotNumber: "D22",
      date: "2025-04-20",
      startTime: "11:00 AM",
      endTime: "04:00 PM",
      status: "upcoming",
      price: "₹320.00",
      location: "Chennai"
    },
    {
      id: "res-006",
      facilityName: "Lulu Mall Parking",
      spotNumber: "E08",
      date: "2025-04-18",
      startTime: "02:00 PM",
      endTime: "07:00 PM",
      status: "upcoming",
      price: "₹350.00",
      location: "Kochi"
    }
  ];

  const getStatusBadge = (status) => {
    const statusStyles = {
      upcoming: "bg-blue-100 text-blue-800",
      active: "bg-green-100 text-green-800",
      completed: "bg-gray-100 text-gray-800",
      cancelled: "bg-red-100 text-red-800",
      pending: "bg-yellow-100 text-yellow-800"
    };

    return (
      <Badge className={statusStyles[status] || "bg-gray-100"}>
        {status}
      </Badge>
    );
  };

  const handleCancelBooking = async () => {
    if (!selectedBooking) return;

    setIsCancelling(true);
    try {
      // Update booking status in Supabase
      const { error: bookingError } = await supabase
        .from('bookings')
        .update({ 
          status: 'cancelled',
          cancelled_at: new Date().toISOString()
        })
        .eq('id', selectedBooking.id);

      if (bookingError) throw bookingError;

      // Release the parking spot
      const { error: spotError } = await supabase
        .from('parking_spots')
        .update({ is_available: true })
        .eq('spot_number', selectedBooking.spotNumber);

      if (spotError) throw spotError;

      // Update local state
      setReservations(prev => 
        prev.map(res => 
          res.id === selectedBooking.id 
            ? { ...res, status: 'cancelled' } 
            : res
        )
      );

      toast({
        title: "Booking Cancelled",
        description: "Your booking has been cancelled successfully.",
      });

      // Close the dialog
      setShowCancelDialog(false);
      setSelectedBooking(null);

    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast({
        title: "Error",
        description: "Failed to cancel booking. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header onLoginClick={() => {}} />

      <main className="flex-1 container mx-auto px-4 py-6 space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">My Reservations</h1>
            <p className="text-muted-foreground">
              View and manage your parking reservations across India.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/calendar">
              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                View Calendar
              </Button>
            </Link>
            <Badge className="bg-green-500">Active</Badge>
            <Badge className="bg-blue-500">Upcoming</Badge>
            <Badge variant="outline" className="text-muted-foreground">Completed</Badge>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">All Reservations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Facility</TableHead>
                    <TableHead>Spot</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reservations.map((reservation) => (
                    <TableRow key={reservation.id}>
                      <TableCell className="font-medium">
                        <div>
                          {reservation.facilityName}
                          <div className="text-xs text-muted-foreground flex items-center mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            {reservation.location}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{reservation.spotNumber}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          {reservation.date}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          {reservation.startTime} - {reservation.endTime}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(reservation.status)}</TableCell>
                      <TableCell className="text-right">{reservation.price}</TableCell>
                      <TableCell className="text-right">
                        {reservation.status === 'upcoming' && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setSelectedBooking(reservation);
                              setShowCancelDialog(true);
                            }}
                          >
                            Cancel
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>

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
              onClick={() => {
                setShowCancelDialog(false);
                setSelectedBooking(null);
              }}
            >
              Keep Booking
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelBooking}
              disabled={isCancelling}
            >
              {isCancelling ? 'Cancelling...' : 'Cancel Booking'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reservations;
