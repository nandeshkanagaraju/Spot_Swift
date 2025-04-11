import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Booking {
  id: string;
  facilityName: string;
  spotNumber: string;
  startTime: string;
  endTime: string;
  date: string;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  price: number;
  vehicleNumber: string;
  userDetails: {
    name: string;
    email: string;
    phone: string;
    vehicleType: string;
  };
}

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  facilityName: string;
  spotNumber: string;
  status: string;
}

interface BookingContextType {
  bookings: Booking[];
  calendarEvents: CalendarEvent[];
  addBooking: (booking: Booking) => void;
  updateBooking: (bookingId: string, updates: Partial<Booking>) => void;
  cancelBooking: (bookingId: string) => void;
  getBooking: (bookingId: string) => Booking | undefined;
  getUserBookings: () => Booking[];
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);

  // Load bookings and calendar events from storage on mount
  useEffect(() => {
    loadBookingsAndEvents();
  }, []);

  const loadBookingsAndEvents = async () => {
    try {
      // Get user's bookings from Supabase
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (bookingsError) throw bookingsError;

      setBookings(bookingsData || []);

      // Convert bookings to calendar events
      const events = bookingsData?.map(booking => ({
        id: booking.id,
        title: `Parking at ${booking.facilityName}`,
        start: booking.startTime,
        end: booking.endTime,
        facilityName: booking.facilityName,
        spotNumber: booking.spotNumber,
        status: booking.status
      })) || [];

      setCalendarEvents(events);

    } catch (error) {
      console.error('Error loading bookings:', error);
    }
  };

  const addBooking = async (booking: Booking) => {
    try {
      // Add booking to Supabase
      const { data, error } = await supabase
        .from('bookings')
        .insert([booking])
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setBookings(prev => [...prev, data]);

      // Add corresponding calendar event
      const calendarEvent: CalendarEvent = {
        id: data.id,
        title: `Parking at ${booking.facilityName}`,
        start: booking.startTime,
        end: booking.endTime,
        facilityName: booking.facilityName,
        spotNumber: booking.spotNumber,
        status: booking.status
      };

      setCalendarEvents(prev => [...prev, calendarEvent]);

    } catch (error) {
      console.error('Error adding booking:', error);
      throw error;
    }
  };

  const updateBooking = async (bookingId: string, updates: Partial<Booking>) => {
    try {
      // Update booking in Supabase
      const { data, error } = await supabase
        .from('bookings')
        .update(updates)
        .eq('id', bookingId)
        .select()
        .single();

      if (error) throw error;

      // Update local states
      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId ? { ...booking, ...updates } : booking
        )
      );

      // Update calendar event
      setCalendarEvents(prev =>
        prev.map(event =>
          event.id === bookingId
            ? {
                ...event,
                title: `Parking at ${data.facilityName}`,
                start: data.startTime,
                end: data.endTime,
                status: data.status
              }
            : event
        )
      );

    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  };

  const cancelBooking = async (bookingId: string) => {
    try {
      // Update booking status in Supabase
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);

      if (error) throw error;

      // Update local states
      setBookings(prev =>
        prev.map(booking =>
          booking.id === bookingId
            ? { ...booking, status: 'cancelled' }
            : booking
        )
      );

      setCalendarEvents(prev =>
        prev.map(event =>
          event.id === bookingId
            ? { ...event, status: 'cancelled' }
            : event
        )
      );

    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  };

  const getBooking = (bookingId: string) => {
    return bookings.find(booking => booking.id === bookingId);
  };

  const getUserBookings = () => {
    return bookings.sort((a, b) => 
      new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );
  };

  return (
    <BookingContext.Provider value={{
      bookings,
      calendarEvents,
      addBooking,
      updateBooking,
      cancelBooking,
      getBooking,
      getUserBookings,
    }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

export default BookingProvider; 