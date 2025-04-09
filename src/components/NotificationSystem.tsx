import { toast } from 'react-hot-toast';

export const NotificationSystem = () => {
  useEffect(() => {
    // Subscribe to real-time events
    subscribeToEvents((event) => {
      switch (event.type) {
        case 'SPOT_AVAILABLE':
          toast.success(`Parking spot available at ${event.location}`);
          break;
        case 'PAYMENT_RECEIVED':
          toast.success(`Payment of ₹${event.amount} received`);
          break;
        // Handle more events
      }
    });
  }, []);
}; 