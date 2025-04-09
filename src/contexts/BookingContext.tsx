import React, { createContext, useContext, useState, useEffect } from 'react';

interface Booking {
  id: string;
  facilityId: string;
  facilityName: string;
  spotId: string;
  spotNumber: string;
  date: string;
  startTime: string;
  endTime: string;
  vehicleType: string;
  vehicleNumber: string;
  totalAmount: number;
  payment?: {
    transactionId: string;
    method: string;
    timestamp: string;
  };
  status: 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
}

interface BookingContextType {
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  updateBooking: (bookingId: string, updates: Partial<Booking>) => void;
  getBooking: (bookingId: string) => Booking | undefined;
  getUserBookings: () => Booking[];
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Load bookings from localStorage on mount
  useEffect(() => {
    const savedBookings = localStorage.getItem('bookings');
    if (savedBookings) {
      setBookings(JSON.parse(savedBookings));
    }
  }, []);

  // Save bookings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('bookings', JSON.stringify(bookings));
  }, [bookings]);

  const addBooking = (booking: Booking) => {
    setBookings(prev => [...prev, booking]);
  };

  const updateBooking = (bookingId: string, updates: Partial<Booking>) => {
    setBookings(prev => 
      prev.map(booking => 
        booking.id === bookingId ? { ...booking, ...updates } : booking
      )
    );
  };

  const getBooking = (bookingId: string) => {
    return bookings.find(booking => booking.id === bookingId);
  };

  const getUserBookings = () => {
    return bookings.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  };

  return (
    <BookingContext.Provider value={{
      bookings,
      addBooking,
      updateBooking,
      getBooking,
      getUserBookings,
    }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBookings = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBookings must be used within a BookingProvider');
  }
  return context;
}; 