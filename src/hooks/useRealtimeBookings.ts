import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useRealtimeBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initial fetch
    fetchBookings()

    // Set up real-time subscription
    const subscription = supabase
      .channel('bookings_channel')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'bookings' 
        }, 
        (payload) => {
          handleBookingChange(payload)
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          parking_spots (*)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setBookings(data)
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBookingChange = (payload: any) => {
    // Update bookings based on real-time changes
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

  return { bookings, loading }
} 