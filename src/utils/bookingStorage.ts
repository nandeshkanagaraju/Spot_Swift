interface BookingDetails {
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
  status: 'confirmed' | 'pending' | 'cancelled';
  payment?: {
    transactionId: string;
    method: string;
    timestamp: string;
    amount: number;
  };
  createdAt: string;
}

export const saveBooking = (booking: BookingDetails) => {
  try {
    // Get existing bookings
    const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    
    // Add new booking while preserving existing ones
    const updatedBookings = [...existingBookings, booking];
    
    // Save back to localStorage
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));

    // Update calendar events
    updateCalendarEvents(booking);

    // Update reservations count
    updateReservationsCount();

    return true;
  } catch (error) {
    console.error('Error saving booking:', error);
    return false;
  }
};

export const updateCalendarEvents = (booking: BookingDetails) => {
  try {
    // Get existing calendar events
    const existingEvents = JSON.parse(localStorage.getItem('calendarEvents') || '[]');

    // Create new calendar event from booking
    const calendarEvent = {
      id: booking.id,
      title: `Parking at ${booking.facilityName}`,
      start: `${booking.date}T${booking.startTime}`,
      end: `${booking.date}T${booking.endTime}`,
      description: `Spot ${booking.spotNumber}`,
      status: booking.status,
      bookingId: booking.id
    };

    // Add new event while preserving existing ones
    const updatedEvents = [...existingEvents, calendarEvent];

    // Save back to localStorage
    localStorage.setItem('calendarEvents', JSON.stringify(updatedEvents));

    return true;
  } catch (error) {
    console.error('Error updating calendar:', error);
    return false;
  }
};

export const updateReservationsCount = () => {
  try {
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const activeBookings = bookings.filter((b: BookingDetails) => b.status === 'confirmed');
    
    // Update statistics
    const stats = JSON.parse(localStorage.getItem('parkingStats') || '{}');
    stats.totalReservations = activeBookings.length;
    localStorage.setItem('parkingStats', JSON.stringify(stats));
  } catch (error) {
    console.error('Error updating reservation count:', error);
  }
};

export const getBookings = () => {
  try {
    return JSON.parse(localStorage.getItem('bookings') || '[]');
  } catch (error) {
    console.error('Error getting bookings:', error);
    return [];
  }
};

export const getCalendarEvents = () => {
  try {
    return JSON.parse(localStorage.getItem('calendarEvents') || '[]');
  } catch (error) {
    console.error('Error getting calendar events:', error);
    return [];
  }
}; 