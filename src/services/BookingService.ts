import { supabase } from '@/integrations/supabase/client';

export interface BookingDetails {
  id: string;
  userId: string;
  facilityId: string;
  facilityName: string;
  spotNumber: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  status: 'confirmed' | 'cancelled' | 'completed';
  vehicleDetails: {
    number: string;
    type: string;
  };
}

export const BookingService = {
  async createBooking(bookingData: Partial<BookingDetails>): Promise<BookingDetails> {
    const { data, error } = await supabase
      .from('bookings')
      .insert([bookingData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async sendConfirmationEmail(booking: BookingDetails, email: string) {
    const { error } = await supabase.functions.invoke('send-booking-email', {
      body: { booking, email }
    });
    
    if (error) throw error;
  },

  async sendSMSNotification(booking: BookingDetails, phone: string) {
    const { error } = await supabase.functions.invoke('send-booking-sms', {
      body: { booking, phone }
    });
    
    if (error) throw error;
  }
}; 