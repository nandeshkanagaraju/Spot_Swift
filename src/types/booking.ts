export interface BookingDetails {
  id: string
  user_id: string
  parking_spot_id: string
  start_time: string
  end_time: string
  vehicle_number: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  full_name: string
  email: string
  phone_number: string
  created_at: string
} 