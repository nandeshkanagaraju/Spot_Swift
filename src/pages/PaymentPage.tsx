import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import { ArrowLeft, CreditCard, Smartphone, Building, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

interface PaymentDetails {
  bookingId: string;
  amount: number;
  facilityName: string;
  spotNumber: string;
}

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const paymentDetails = location.state?.paymentDetails as PaymentDetails;
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');

  // Card payment state
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  // UPI payment state
  const [upiId, setUpiId] = useState('');

  // Net Banking state
  const [selectedBank, setSelectedBank] = useState('');

  if (!paymentDetails) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header onLoginClick={() => {}} />
        <div className="flex-1 container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Payment Details Not Found</h2>
          <Button onClick={() => navigate('/facilities')}>
            Find Parking
          </Button>
        </div>
      </div>
    );
  }

  const handlePaymentSuccess = async (paymentMethod: string) => {
    try {
      // 1. Add to Reservations
      const existingReservations = JSON.parse(localStorage.getItem('reservations') || '[]');
      const newReservation = {
        id: `res-${Date.now()}`,
        facilityName: paymentDetails.facilityName,
        spotNumber: paymentDetails.spotNumber,
        date: new Date(location.state?.bookingDetails.start_time).toISOString().split('T')[0],
        startTime: new Date(location.state?.bookingDetails.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        endTime: new Date(location.state?.bookingDetails.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: "upcoming",
        price: `₹${paymentDetails.amount.toFixed(2)}`,
        location: paymentDetails.facilityName,
        vehicle_number: location.state?.bookingDetails.vehicle_number,
        payment_status: 'completed',
        payment_method: paymentMethod
      };
      localStorage.setItem('reservations', JSON.stringify([...existingReservations, newReservation]));

      // 2. Add to Calendar
      const existingEvents = JSON.parse(localStorage.getItem('calendarEvents') || '[]');
      const startDateTime = new Date(location.state?.bookingDetails.start_time);
      const endDateTime = new Date(location.state?.bookingDetails.end_time);
      
      const calendarEvent = {
        id: newReservation.id,
        title: `Parking at ${paymentDetails.facilityName}`,
        startTime: startDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        endTime: endDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tag: "parking",
        facility: paymentDetails.facilityName,
        spotNumber: paymentDetails.spotNumber,
        price: `₹${paymentDetails.amount.toFixed(2)}`,
        dates: [startDateTime], // The calendar component expects dates in this format
        status: "upcoming"
      };
      localStorage.setItem('calendarEvents', JSON.stringify([...existingEvents, calendarEvent]));

      // 3. Navigate to confirmation page
      navigate('/booking-confirmation', {
        state: { 
          bookingDetails: {
            ...location.state?.bookingDetails,
            payment_status: 'completed',
            payment_method: paymentMethod
          }
        }
      });
    } catch (error) {
      console.error('Error saving booking:', error);
      toast({
        title: "Error",
        description: "Failed to save booking",
        variant: "destructive"
      });
    }
  };

  const handleCardPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Payment Successful",
        description: "Your booking has been confirmed",
      });
      
      await handlePaymentSuccess('card');
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUPIPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      // Simulate UPI payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Payment Successful",
        description: "Your booking has been confirmed",
      });
      
      await handlePaymentSuccess('upi');
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNetBankingPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBank) {
      toast({
        title: "Error",
        description: "Please select a bank",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate net banking payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Payment Successful",
        description: "Your booking has been confirmed",
      });
      
      await handlePaymentSuccess('netbanking');
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const banks = [
    { id: 'sbi', name: 'State Bank of India' },
    { id: 'hdfc', name: 'HDFC Bank' },
    { id: 'icici', name: 'ICICI Bank' },
    { id: 'axis', name: 'Axis Bank' },
    { id: 'kotak', name: 'Kotak Mahindra Bank' }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header onLoginClick={() => {}} />
      
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">Payment</h1>
          </div>
        </div>
      </div>

      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Order Summary */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Facility</span>
                <span>{paymentDetails.facilityName}</span>
              </div>
              <div className="flex justify-between">
                <span>Spot Number</span>
                <span>{paymentDetails.spotNumber}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Total Amount</span>
                <span>₹{paymentDetails.amount}</span>
              </div>
            </div>
          </Card>

          {/* Payment Methods */}
          <Card className="p-6">
            <Tabs defaultValue="card" onValueChange={setSelectedPaymentMethod}>
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="card">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Card
                </TabsTrigger>
                <TabsTrigger value="upi">
                  <Smartphone className="h-4 w-4 mr-2" />
                  UPI
                </TabsTrigger>
                <TabsTrigger value="netbanking">
                  <Building className="h-4 w-4 mr-2" />
                  Net Banking
                </TabsTrigger>
              </TabsList>

              {/* Card Payment Form */}
              <TabsContent value="card">
                <form onSubmit={handleCardPayment} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Card Number</label>
                    <Input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Cardholder Name</label>
                    <Input
                      type="text"
                      placeholder="John Doe"
                      value={cardDetails.name}
                      onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Expiry Date</label>
                      <Input
                        type="text"
                        placeholder="MM/YY"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">CVV</label>
                      <Input
                        type="password"
                        placeholder="123"
                        maxLength={3}
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : `Pay ₹${paymentDetails.amount}`}
                  </Button>
                </form>
              </TabsContent>

              {/* UPI Payment Form */}
              <TabsContent value="upi">
                <form onSubmit={handleUPIPayment} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">UPI ID</label>
                    <Input
                      type="text"
                      placeholder="username@upi"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : `Pay ₹${paymentDetails.amount}`}
                  </Button>
                </form>
              </TabsContent>

              {/* Net Banking Form */}
              <TabsContent value="netbanking">
                <form onSubmit={handleNetBankingPayment} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Select Bank</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      required
                    >
                      <option value="">Select a bank</option>
                      {banks.map(bank => (
                        <option key={bank.id} value={bank.id}>
                          {bank.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : `Pay ₹${paymentDetails.amount}`}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </Card>

          {/* Security Note */}
          <div className="text-center text-sm text-gray-600">
            <p>🔒 Your payment is secure and encrypted</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage; 