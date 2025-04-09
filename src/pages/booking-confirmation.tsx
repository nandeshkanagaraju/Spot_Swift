import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';

const BookingConfirmation = () => {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">Booking Confirmed!</h1>
        <p className="text-gray-600 mb-6">
          Your parking spot has been successfully reserved. You will receive a confirmation email shortly.
        </p>
        <div className="space-x-4">
          <Button
            onClick={() => router.push('/dashboard')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Go to Dashboard
          </Button>
          <Button
            onClick={() => router.push('/bookings')}
            variant="outline"
          >
            View Bookings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation; 