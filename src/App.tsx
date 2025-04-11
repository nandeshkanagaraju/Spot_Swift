import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Reservations from "./pages/Reservations";
import Facilities from "./pages/Facilities";
import Calendar from "./pages/Calendar";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import FacilityDetails from "./pages/FacilityDetails";
import BookingConfirmation from "./pages/BookingConfirmation";
import BookingPage from "@/pages/BookingPage";
import { ParkingProvider } from '@/contexts/ParkingContext';
import FacilityBooking from './pages/FacilityBooking';
import PaymentPage from './pages/PaymentPage';
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import { User } from '@supabase/supabase-js'
import { BookingHistory } from '@/components/BookingHistory';
import BookingProvider from '@/contexts/BookingContext';

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <ParkingProvider>
            <BookingProvider>
              <Toaster />
              <Sonner />
              <Router>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/facilities" element={<Facilities />} />
                  <Route path="/facility/:id" element={<FacilityDetails />} />
                  {user ? (
                    <>
                      <Route path="/reservations" element={<Reservations />} />
                      <Route path="/calendar" element={<Calendar />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/book/:facilityId" element={<FacilityBooking />} />
                      <Route path="/payment" element={<PaymentPage />} />
                      <Route path="/booking-confirmation" element={<BookingConfirmation />} />
                      <Route path="/my-bookings" element={<BookingHistory />} />
                    </>
                  ) : null}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Router>
            </BookingProvider>
          </ParkingProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  )
}

export default App;
