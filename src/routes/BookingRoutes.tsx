import { Route, Routes } from 'react-router-dom';
import BookFacility from '@/pages/BookFacility';

export const BookingRoutes = () => {
  return (
    <Routes>
      <Route path="/book/:facilityId" element={<BookFacility />} />
    </Routes>
  );
}; 