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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ParkingProvider>
          <Toaster />
          <Sonner />
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/reservations" element={<Reservations />} />
              <Route path="/facilities" element={<Facilities />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/facility/:id" element={<FacilityDetails />} />
              <Route path="/book/:facilityId" element={<FacilityBooking />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/booking-confirmation" element={<BookingConfirmation />} />
              {/* Keep the catch-all route last */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </ParkingProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
