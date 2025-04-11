import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import { ArrowLeft, Calendar, Clock, Car, MapPin, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface BookingDetails {
  id: string;
  start_time: string;
  end_time: string;
  vehicle_number: string;
  total_amount: number;
  status: string;
  payment_status: string;
  payment_method: string;
  user_details: {
    name: string;
    email: string;
    phone: string;
    vehicle_type: string;
  };
  facilityName: string;
  spotNumber: string;
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

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
          {/* Success Message */}
          <Card className="p-6 bg-green-50 border-green-200">
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-green-800">Booking Confirmed!</h2>
              <p className="text-green-600 mt-2">
                Booking Reference: {bookingDetails.id}
              </p>
            </div>
          </Card>

          {/* Booking Details */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Booking Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Location Details */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-blue-500 mt-1" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-gray-600">{bookingDetails.facilityName}</p>
                    <p className="text-gray-600">Spot {bookingDetails.spotNumber}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-blue-500 mt-1" />
                  <div>
                    <p className="font-medium">Duration</p>
                    <p className="text-gray-600">From: {formatDate(bookingDetails.start_time)}</p>
                    <p className="text-gray-600">To: {formatDate(bookingDetails.end_time)}</p>
                  </div>
                </div>
              </div>

              {/* Vehicle & Payment Details */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Car className="h-5 w-5 text-blue-500 mt-1" />
                  <div>
                    <p className="font-medium">Vehicle Details</p>
                    <p className="text-gray-600">
                      {getVehicleIcon(bookingDetails.user_details.vehicle_type)}{' '}
                      {bookingDetails.user_details.vehicle_type} - {bookingDetails.vehicle_number}
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium">Payment Details</p>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status</span>
                      <span className="text-green-600 font-medium flex items-center">
                        <Check className="h-4 w-4 mr-1" />
                        {bookingDetails.payment_status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Method</span>
                      <span className="capitalize">{bookingDetails.payment_method}</span>
                    </div>
                    <div className="flex justify-between font-medium pt-2 border-t">
                      <span>Total Amount</span>
                      <span className="text-lg">₹{bookingDetails.total_amount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Contact Information */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Name</p>
                <p className="font-medium">{bookingDetails.user_details.name}</p>
              </div>
              <div>
                <p className="text-gray-600">Phone</p>
                <p className="font-medium">{bookingDetails.user_details.phone}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-gray-600">Email</p>
                <p className="font-medium">{bookingDetails.user_details.email}</p>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button
              onClick={() => navigate('/reservations')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              View All Bookings
            </Button>
            <Button
              onClick={() => navigate('/facilities')}
              variant="outline"
            >
              Book Another Spot
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation; 