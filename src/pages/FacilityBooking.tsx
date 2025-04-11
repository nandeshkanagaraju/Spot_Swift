import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import { ArrowLeft } from 'lucide-react';
import StatusLegend from '@/components/StatusLegend';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Car, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Battery,
  BatteryCharging,
  Zap
} from 'lucide-react';

interface ParkingSpot {
  id: string;
  number: string;
  type: 'standard' | 'compact' | 'accessible' | 'ev';
  status: 'available' | 'occupied' | 'reserved';
  rate: number;
  level: string;
  chargingSpeed?: 'fast' | 'regular';
  powerOutput?: string;
}

interface SpotTooltip {
  show: boolean;
  spotId: string | null;
  x: number;
  y: number;
}

const FacilityBooking = () => {
  const { facilityId } = useParams();
  const navigate = useNavigate();
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [selectedLevel, setSelectedLevel] = useState('1');
  const [bookingDetails, setBookingDetails] = useState({
    date: '',
    startTime: '',
    endTime: '',
    name: '',
    email: '',
    phone: '',
    vehicleNumber: '',
    vehicleType: 'sedan'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tooltip, setTooltip] = useState<SpotTooltip>({ show: false, spotId: null, x: 0, y: 0 });
  const [hoveredLevel, setHoveredLevel] = useState<string | null>(null);
  const [selectedBlock, setSelectedBlock] = useState('A');

  // Mock facility data
  const facility = {
    id: facilityId,
    name: 'Inorbit Mall Parking',
    address: 'Inorbit Mall, Whitefield Main Road, Bangalore',
    levels: ['1', '2', '3'],
    spotsPerLevel: 50
  };

  const vehicleTypes = [
    { value: 'sedan', label: 'Sedan 🚗' },
    { value: 'suv', label: 'SUV 🚙' },
    { value: 'bike', label: 'Bike 🏍️' },
    { value: 'ev', label: 'Electric Vehicle ⚡' }
  ];

  // Generate spots for the selected level
  const generateSpots = (level: string): ParkingSpot[] => {
    const spots: ParkingSpot[] = [];
    const rates = { 
      standard: 50, 
      compact: 40, 
      accessible: 45,
      ev: 70 // Higher rate for EV spots
    };

    // Generate 12 spots (3 rows x 4 columns)
    for (let i = 1; i <= 12; i++) {
      const spotNumber = i < 10 ? `10${i}` : `1${i}`;
      let type: ParkingSpot['type'];
      let chargingSpeed: 'fast' | 'regular' | undefined;
      let powerOutput: string | undefined;

      // Distribute spot types
      if (i >= 11) {
        type = 'accessible';
      } else if (i >= 8) {
        type = 'ev';
        chargingSpeed = i % 2 === 0 ? 'fast' : 'regular';
        powerOutput = i % 2 === 0 ? '50kW DC' : '22kW AC';
      } else if (i >= 6) {
        type = 'compact';
      } else {
        type = 'standard';
      }
      
      spots.push({
        id: `L${level}-${i}`,
        number: spotNumber,
        type,
        status: Math.random() > 0.3 ? 'available' : 'occupied',
        rate: rates[type],
        level,
        ...(type === 'ev' && { chargingSpeed, powerOutput })
      });
    }
    return spots;
  };

  const spots = generateSpots(selectedLevel);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBookingDetails(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const calculateTotal = () => {
    if (!selectedSpot || !bookingDetails.startTime || !bookingDetails.endTime) return 0;
    
    const start = new Date(`2000/01/01 ${bookingDetails.startTime}`);
    const end = new Date(`2000/01/01 ${bookingDetails.endTime}`);
    if (end < start) end.setDate(end.getDate() + 1);
    
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return Math.round(selectedSpot.rate * hours);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSpot) {
      toast({
        title: "Error",
        description: "Please select a parking spot",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // First, create or get parking spot in Supabase
      let parkingSpotData;

      const { data: newSpotData, error: spotError } = await supabase
        .from('parking_spots')
        .insert({
          spot_number: selectedSpot.number,
          location: facility.name,
          price_per_hour: selectedSpot.rate,
          is_available: true
        })
        .select()
        .single();

      if (spotError) {
        // If spot already exists, try to get it
        const { data: existingSpot, error: getSpotError } = await supabase
          .from('parking_spots')
          .select()
          .eq('spot_number', selectedSpot.number)
          .single();

        if (getSpotError) throw getSpotError;
        parkingSpotData = existingSpot;
      } else {
        parkingSpotData = newSpotData;
      }

      // Create the booking in Supabase
      const startDateTime = new Date(`${bookingDetails.date}T${bookingDetails.startTime}`);
      const endDateTime = new Date(`${bookingDetails.date}T${bookingDetails.endTime}`);
      
      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          parking_spot_id: parkingSpotData.id,
          start_time: startDateTime.toISOString(),
          end_time: endDateTime.toISOString(),
          vehicle_number: bookingDetails.vehicleNumber,
          total_amount: calculateTotal(),
          status: 'pending',
          payment_status: 'pending',
          user_details: {
            name: bookingDetails.name,
            email: bookingDetails.email,
            phone: bookingDetails.phone,
            vehicle_type: bookingDetails.vehicleType
          }
        })
        .select()
        .single();

      if (bookingError) {
        console.error('Booking error:', bookingError);
        throw bookingError;
      }

      // Update spot availability
      const { error: updateSpotError } = await supabase
        .from('parking_spots')
        .update({ is_available: false })
        .eq('id', parkingSpotData.id);

      if (updateSpotError) throw updateSpotError;

      toast({
        title: "Booking Successful!",
        description: `Your parking spot ${selectedSpot.number} has been reserved.`,
      });

      // Navigate to payment page with booking details
      navigate('/payment', {
        state: { 
          bookingDetails: {
            ...bookingData,
            facilityName: facility.name,
            spotNumber: selectedSpot.number
          },
          paymentDetails: {
            bookingId: bookingData.id,
            amount: bookingData.total_amount,
            facilityName: facility.name,
            spotNumber: selectedSpot.number
          }
        }
      });

    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Booking Failed",
        description: error.message || "There was an error processing your booking. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSpotColor = (spot: ParkingSpot) => {
    if (selectedSpot?.id === spot.id) return 'border-primary bg-primary/5';
    if (spot.status === 'occupied') return 'border-red-200 bg-red-50';
    if (spot.status === 'reserved') return 'border-yellow-200 bg-yellow-50';
    return 'border-gray-200 hover:border-primary/50 hover:bg-gray-50';
  };

  const handleSpotHover = (e: React.MouseEvent, spot: ParkingSpot) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      show: true,
      spotId: spot.id,
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY
    });
  };

  const getSpotDetails = (spot: ParkingSpot) => {
    switch (spot.type) {
      case 'ev':
        return {
          icon: <BatteryCharging className="h-6 w-6 text-green-500" />,
          label: 'EV Charging',
          description: `${spot.chargingSpeed === 'fast' ? 'Fast' : 'Regular'} charging (${spot.powerOutput})`,
          color: 'text-green-600'
        };
      case 'accessible':
        return {
          icon: '♿',
          label: 'Accessible',
          description: 'Wheelchair accessible spot',
          color: 'text-blue-600'
        };
      case 'compact':
        return {
          icon: '🚙',
          label: 'Compact',
          description: 'For small vehicles',
          color: 'text-gray-600'
        };
      default:
        return {
          icon: '🚗',
          label: 'Standard',
          description: 'Regular parking spot',
          color: 'text-gray-600'
        };
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onLoginClick={() => {}} />
      
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Facility Info with Animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/facilities')}
                  className="flex items-center"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <div>
                  <h1 className="text-2xl font-bold">{facility.name}</h1>
                  <p className="text-gray-600">{facility.address}</p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Interactive Status Legend */}
          <motion.div 
            className="flex items-center justify-center gap-6 flex-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {[
              { status: 'available', color: 'bg-green-500', icon: CheckCircle2 },
              { status: 'occupied', color: 'bg-red-500', icon: XCircle },
              { status: 'reserved', color: 'bg-yellow-500', icon: AlertCircle }
            ].map((item) => (
              <motion.div
                key={item.status}
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <div className={`w-3 h-3 rounded-full ${item.color}`} />
                <span className="capitalize">{item.status}</span>
              </motion.div>
            ))}
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <Zap className="h-4 w-4 text-green-500" />
              <span>EV Charging</span>
            </motion.div>
          </motion.div>

          {/* Enhanced Level Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-bold mb-4">Select Level</h2>
            <div className="grid grid-cols-3 gap-4">
              {facility.levels.map((level) => (
                <motion.div
                  key={level}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant={selectedLevel === level ? "default" : "outline"}
                    onClick={() => setSelectedLevel(level)}
                    onMouseEnter={() => setHoveredLevel(level)}
                    onMouseLeave={() => setHoveredLevel(null)}
                    className="w-full h-16 relative overflow-hidden"
                  >
                    <div className="text-center relative z-10">
                      <div className="text-lg">Level {level}</div>
                      <AnimatePresence>
                        {(selectedLevel === level || hoveredLevel === level) && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            className="text-sm"
                          >
                            {spots.filter(s => s.status === 'available').length} Available
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    {selectedLevel === level && (
                      <motion.div
                        className="absolute inset-0 bg-primary/10"
                        layoutId="levelBackground"
                        transition={{ type: "spring", bounce: 0.2 }}
                      />
                    )}
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Interactive Spot Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-xl font-bold mb-4">Select Spot</h2>
            <div className="grid grid-cols-4 gap-4">
              <AnimatePresence>
                {spots.map((spot) => {
                  const details = getSpotDetails(spot);
                  return (
                    <motion.button
                      key={spot.id}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ scale: 1.05, zIndex: 1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => spot.status === 'available' && setSelectedSpot(spot)}
                      className={`
                        relative p-4 rounded-lg border-2 transition-all
                        ${getSpotColor(spot)}
                      `}
                    >
                      <div className="text-center space-y-2">
                        {/* Spot Icon */}
                        <div className="text-3xl flex justify-center">
                          {typeof details.icon === 'string' ? (
                            details.icon
                          ) : (
                            details.icon
                          )}
                        </div>
                        
                        {/* Spot Number */}
                        <div className="font-bold text-lg">{spot.number}</div>
                        
                        {/* Spot Type & Rate */}
                        <div className="text-sm text-gray-600">
                          <div className={details.color}>{details.label}</div>
                          <div>₹{spot.rate}/hr</div>
                        </div>

                        {/* EV Charging Info */}
                        {spot.type === 'ev' && (
                          <div className="text-xs text-green-600 flex items-center justify-center gap-1">
                            <Battery className="h-3 w-3" />
                            {spot.chargingSpeed === 'fast' ? 'Fast' : 'Regular'}
                          </div>
                        )}

                        {/* Status Indicator */}
                        <motion.div
                          className={`
                            absolute top-2 right-2 w-2 h-2 rounded-full
                            ${spot.status === 'available' ? 'bg-green-500' :
                              spot.status === 'reserved' ? 'bg-yellow-500' : 'bg-red-500'}
                          `}
                          animate={{ 
                            scale: spot.status === 'available' ? [1, 1.2, 1] : 1
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </div>
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Interactive Tooltip */}
          <AnimatePresence>
            {tooltip.show && tooltip.spotId && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="fixed bg-white p-3 rounded-lg shadow-lg z-50"
                style={{
                  left: tooltip.x,
                  top: tooltip.y - 80
                }}
              >
                {spots.find(s => s.id === tooltip.spotId)?.status === 'available' ? (
                  <div className="text-sm text-green-600">
                    Click to select this spot
                  </div>
                ) : (
                  <div className="text-sm text-red-600">
                    This spot is not available
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Selected Spot Details */}
          <AnimatePresence>
            {selectedSpot && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <Card className="p-6 border-primary">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">Selected Spot</h3>
                        <p className="text-gray-600">Level {selectedLevel}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedSpot(null)}
                      >
                        Change
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600">Spot Number</div>
                        <div className="font-bold">{selectedSpot.number}</div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600">Rate</div>
                        <div className="font-bold">₹{selectedSpot.rate}/hr</div>
                      </div>
                      {selectedSpot.type === 'ev' && (
                        <div className="col-span-2 p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <BatteryCharging className="h-5 w-5 text-green-500" />
                            <div>
                              <div className="font-medium text-green-700">
                                {selectedSpot.chargingSpeed === 'fast' ? 'Fast Charging' : 'Regular Charging'}
                              </div>
                              <div className="text-sm text-green-600">{selectedSpot.powerOutput}</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Booking Form */}
          {selectedSpot && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Date</label>
                      <input
                        type="date"
                        name="date"
                        value={bookingDetails.date}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Start Time</label>
                      <input
                        type="time"
                        name="startTime"
                        value={bookingDetails.startTime}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">End Time</label>
                      <input
                        type="time"
                        name="endTime"
                        value={bookingDetails.endTime}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Personal Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={bookingDetails.name}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={bookingDetails.email}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          value={bookingDetails.phone}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Vehicle Number</label>
                        <input
                          type="text"
                          name="vehicleNumber"
                          value={bookingDetails.vehicleNumber}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="block text-sm font-medium mb-1">Vehicle Type</label>
                    <select
                      name="vehicleType"
                      value={bookingDetails.vehicleType}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      required
                    >
                      {vehicleTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedSpot && bookingDetails.startTime && bookingDetails.endTime && (
                    <Card className="p-4 bg-gray-50">
                      <h3 className="font-medium mb-2">Booking Summary</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Spot Type</span>
                          <span className="capitalize">{selectedSpot.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Rate</span>
                          <span>₹{selectedSpot.rate}/hour</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Duration</span>
                          <span>{calculateDuration(bookingDetails.startTime, bookingDetails.endTime)}</span>
                        </div>
                        <div className="border-t pt-2 mt-2">
                          <div className="flex justify-between font-medium">
                            <span>Total Amount</span>
                            <span>₹{calculateTotal()}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting || !selectedSpot}
                  >
                    {isSubmitting ? 'Processing...' : 'Confirm Booking'}
                  </Button>
                </form>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function to calculate duration
const calculateDuration = (start: string, end: string) => {
  const startDate = new Date(`2000/01/01 ${start}`);
  let endDate = new Date(`2000/01/01 ${end}`);
  if (endDate < startDate) endDate.setDate(endDate.getDate() + 1);
  
  const hours = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60));
  const minutes = Math.floor(((endDate.getTime() - startDate.getTime()) % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}h ${minutes}m`;
};

export default FacilityBooking; 