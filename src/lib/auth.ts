import { supabase } from './supabase'

export const auth = {
  async signUp(email: string, password: string, userData: { full_name: string, phone_number?: string }) {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) throw authError

      if (authData.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: authData.user.id,
            email,
            full_name: userData.full_name,
            phone_number: userData.phone_number
          })

        if (profileError) throw profileError
      }

      return authData
    } catch (error) {
      console.error('Error in signUp:', error)
      throw error
    }
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  }
} 