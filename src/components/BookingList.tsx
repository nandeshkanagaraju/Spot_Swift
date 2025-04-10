import { useBookings } from '../hooks/useBookings'

export function BookingList() {
  const { bookings, loading, error } = useBookings()

  if (loading) return <div>Loading bookings...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      {bookings.map(booking => (
        <div key={booking.id}>
          <h3>Booking {booking.id}</h3>
          <p>Status: {booking.status}</p>
          <p>Vehicle: {booking.vehicle_number}</p>
          {/* Add more booking details as needed */}
        </div>
      ))}
    </div>
  )
} 