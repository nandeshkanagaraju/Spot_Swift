import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import { ArrowLeft, Calendar, Clock, Car, MapPin, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import StatusLegend from '@/components/StatusLegend';

interface BookingDetails {
  id: string;
  facilityId: string;
  spotId: string;
  date: string;
  startTime: string;
  endTime: string;
  vehicleType: string;
  vehicleNumber: string;
  totalAmount: number;
  spotNumber: string;
  facilityName: string;
  spotType: 'standard' | 'compact' | 'accessible' | 'electric';
  paymentStatus: string;
  paymentMethod: string;
}

const BookingConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingDetails = location.state?.bookingDetails as BookingDetails;

  if (!bookingDetails) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header onLoginClick={() => {}} />
        <div className="flex-1 container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Booking Not Found</h2>
          <Button onClick={() => navigate('/facilities')}>
            Find Parking
          </Button>
        </div>
      </div>
    );
  }

  const getVehicleIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'suv': return '🚙';
      case 'sedan': return '🚗';
      case 'bike': return '🏍️';
      case 'ev': return '⚡';
      default: return '🚗';
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header onLoginClick={() => {}} />
      
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/facilities')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Facilities
            </Button>
            <h1 className="text-2xl font-bold">Booking Confirmation</h1>
          </div>
        </div>
      </div>

      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <Card className="p-6 bg-green-50 border-green-200">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-green-800">Booking Confirmed!</h2>
              <p className="text-green-600">
                Booking Reference: {bookingDetails.id}
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Booking Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-blue-500 mt-1" />
                  <div>
                    <p className="font-medium">{bookingDetails.facilityName}</p>
                    <p className="text-sm text-gray-600">Spot {bookingDetails.spotNumber}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-blue-500 mt-1" />
                  <div>
                    <p className="font-medium">Date</p>
                    <p className="text-sm text-gray-600">{bookingDetails.date}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-blue-500 mt-1" />
                  <div>
                    <p className="font-medium">Time</p>
                    <p className="text-sm text-gray-600">
                      {bookingDetails.startTime} - {bookingDetails.endTime}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Car className="h-5 w-5 text-blue-500 mt-1" />
                  <div>
                    <p className="font-medium">Vehicle Details</p>
                    <p className="text-sm text-gray-600">
                      {getVehicleIcon(bookingDetails.vehicleType)}{' '}
                      {bookingDetails.vehicleType} - {bookingDetails.vehicleNumber}
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium">Total Amount</p>
                  <p className="text-2xl font-bold text-green-600">
                    ₹{bookingDetails.totalAmount}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Payment Information */}
          <div className="mt-4 pt-4 border-t">
            <h4 className="font-semibold mb-2">Payment Information</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Payment Status</span>
                <span className="text-green-600 font-medium">
                  {bookingDetails.paymentStatus === 'completed' ? (
                    <span className="flex items-center">
                      <Check className="h-4 w-4 mr-1" />
                      Paid
                    </span>
                  ) : 'Pending'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Payment Method</span>
                <span className="capitalize">{bookingDetails.paymentMethod}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total Amount Paid</span>
                <span>₹{bookingDetails.totalAmount}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <Button
              onClick={() => navigate('/')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Go to Dashboard
            </Button>
            <Button
              onClick={() => navigate('/reservations')}
              variant="outline"
            >
              View Reservations
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation; 