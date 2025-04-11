import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import BookingForm from '@/components/BookingForm';
import SpotBookingSystem from '@/components/SpotBookingSystem';
import InteractiveSpotSelector from '@/components/InteractiveSpotSelector';

interface ParkingSpot {
  id: string;
  number: string;
  type: 'standard' | 'compact' | 'accessible' | 'electric';
  status: 'available' | 'occupied';
  rate: number;
  location: string;
}

const BookParkingSpot = () => {
  const navigate = useNavigate();
  const { facilityId } = useParams();
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);

  const facilityData = {
    id: 'facility-1',
    name: 'Central Parking Complex',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/facilities')}
                className="flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Facilities
              </Button>
              <div>
                <h1 className="text-xl font-bold">Book Parking Spot</h1>
                <p className="text-sm text-gray-600">Facility ID: {facilityId}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                Dashboard
              </Button>
              <Button variant="outline" onClick={() => navigate('/bookings')}>
                My Bookings
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Book Parking Spot</h2>
              <p className="text-gray-600">{facilityData.name}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:sticky lg:top-4">
              <InteractiveSpotSelector
                facilityName={facilityData.name}
                selectedSpot={selectedSpot}
                onSpotSelect={setSelectedSpot}
              />
            </div>
            
            <div>
              {selectedSpot ? (
                <BookingForm
                  facilityId={facilityData.id}
                  facilityName={facilityData.name}
                  spotNumber={selectedSpot.number}
                  type={selectedSpot.type}
                  onBookingComplete={() => setSelectedSpot(null)}
                />
              ) : (
                <Card className="p-6">
                  <div className="text-center space-y-3">
                    <p className="text-gray-600">
                      Please select a parking spot to proceed with your booking
                    </p>
                    <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                      <span>🚗 Standard ₹50/hr</span>
                      <span>🚙 Compact ₹40/hr</span>
                      <span>♿ Accessible ₹45/hr</span>
                      <span>⚡ Electric ₹60/hr</span>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookParkingSpot; 