import { supabase } from '../lib/supabase'
import { BookingDetails } from '../types/booking'

export interface CreateBookingData {
  parking_spot_id: string
  start_time: Date
  end_time: Date
  vehicle_number: string
  total_amount: number
}

export const bookingService = {
  async createBooking(bookingData: CreateBookingData) {
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('bookings')
      .insert({
        user_id: user.user.id,
        ...bookingData,
        status: 'pending',
        payment_status: 'pending'
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getUserBookings() {
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        parking_spots (
          spot_number,
          location
        )
      `)
      .eq('user_id', user.user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async cancelBooking(bookingId: string) {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId)
      .select()
      .single()

    if (error) throw error
    return data
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