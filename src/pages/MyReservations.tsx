import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Car, 
  AlertCircle,
  CheckCircle2,
  XCircle 
} from "lucide-react";

interface Reservation {
  id: string;
  facilityName: string;
  spotNumber: string;
  startTime: Date;
  endTime: Date;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  price: number;
  vehicleNumber: string;
}

const MyReservations = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [view, setView] = useState<'calendar' | 'list'>('calendar');

  // Function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Function to get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Clock className="h-4 w-4" />;
      case 'active':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  // Function to filter reservations by date
  const getReservationsForDate = (date: Date) => {
    return reservations.filter(reservation => {
      const reservationDate = new Date(reservation.startTime);
      return (
        reservationDate.getDate() === date.getDate() &&
        reservationDate.getMonth() === date.getMonth() &&
        reservationDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Calendar highlight dates with reservations
  const highlightedDates = reservations.map(res => new Date(res.startTime));

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Reservations</h1>
          <div className="flex gap-2">
            <Button
              variant={view === 'calendar' ? 'default' : 'outline'}
              onClick={() => setView('calendar')}
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              Calendar
            </Button>
            <Button
              variant={view === 'list' ? 'default' : 'outline'}
              onClick={() => setView('list')}
            >
              <Car className="h-4 w-4 mr-2" />
              List
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Calendar Section */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Select Date</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                modifiers={{
                  highlighted: highlightedDates
                }}
                modifiersStyles={{
                  highlighted: {
                    backgroundColor: 'var(--primary-50)',
                    borderRadius: '0.375rem'
                  }
                }}
              />
            </CardContent>
          </Card>

          {/* Reservations List Section */}
          <div className="md:col-span-2 space-y-4">
            {view === 'calendar' ? (
              selectedDate ? (
                getReservationsForDate(selectedDate).length > 0 ? (
                  getReservationsForDate(selectedDate).map((reservation) => (
                    <ReservationCard key={reservation.id} reservation={reservation} />
                  ))
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center text-gray-500">
                      No reservations for {format(selectedDate, 'MMMM d, yyyy')}
                    </CardContent>
                  </Card>
                )
              ) : (
                <Card>
                  <CardContent className="p-6 text-center text-gray-500">
                    Select a date to view reservations
                  </CardContent>
                </Card>
              )
            ) : (
              // List View
              reservations.length > 0 ? (
                reservations.map((reservation) => (
                  <ReservationCard key={reservation.id} reservation={reservation} />
                ))
              ) : (
                <Card>
                  <CardContent className="p-6 text-center text-gray-500">
                    No reservations found
                  </CardContent>
                </Card>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Reservation Card Component
const ReservationCard = ({ reservation }: { reservation: Reservation }) => (
  <Card>
    <CardContent className="p-4">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg">{reservation.facilityName}</h3>
            <Badge className={getStatusColor(reservation.status)}>
              <span className="flex items-center gap-1">
                {getStatusIcon(reservation.status)}
                {reservation.status}
              </span>
            </Badge>
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-1" />
            Spot {reservation.spotNumber}
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="h-4 w-4 mr-1" />
            {format(new Date(reservation.startTime), 'h:mm a')} - {format(new Date(reservation.endTime), 'h:mm a')}
          </div>
          <div className="flex items-center text-gray-600">
            <Car className="h-4 w-4 mr-1" />
            {reservation.vehicleNumber}
          </div>
        </div>
        <div className="flex flex-col justify-between items-end">
          <div className="text-lg font-bold">₹{reservation.price}</div>
          {reservation.status === 'upcoming' && (
            <Button variant="destructive" size="sm">
              Cancel Booking
            </Button>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);

export default MyReservations; 