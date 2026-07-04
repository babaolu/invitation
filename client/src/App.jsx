import { BrowserRouter, Routes, Route } from 'react-router-dom';
import InvitePage from './pages/InvitePage';
import AdminLogin from './pages/AdminLogin';
import AdminGuests from './pages/AdminGuests';
import SeatingDirectory from './pages/SeatingDirectory';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/invite/:slug" element={<InvitePage />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/guests" element={<AdminGuests />} />
        <Route path="/admin/seating-directory" element={<SeatingDirectory />} />
        <Route path="*" element={<p style={{ padding: 40 }}>Page not found.</p>} />
      </Routes>
    </BrowserRouter>
  );
}
