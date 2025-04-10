import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { BookingDetails } from '../types/booking'

export function useBookings() {
  const [bookings, setBookings] = useState<BookingDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Initial fetch of bookings
    fetchBookings()

    // Set up real-time subscription
    const subscription = supabase
      .channel('bookings')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'bookings' },
        (payload) => {
          handleBookingChange(payload)
        }
      )
      .subscribe()

    // Cleanup subscription
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setBookings(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleBookingChange = (payload: any) => {
    if (payload.eventType === 'INSERT') {
      setBookings(prev => [payload.new, ...prev])
    } else if (payload.eventType === 'UPDATE') {
      setBookings(prev => 
        prev.map(booking => 
          booking.id === payload.new.id ? payload.new : booking
        )
      )
    } else if (payload.eventType === 'DELETE') {
      setBookings(prev => 
        prev.filter(booking => booking.id !== payload.old.id)
      )
    }
  }

  return { bookings, loading, error }
} 