import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Home from './pages/Home';
import EventDetails from './pages/EventDetails';
import Registration from './pages/Registration';
import RegistrationSuccess from './pages/RegistrationSuccess';
import RegistrationStatus from './pages/RegistrationStatus';
import Quiz from './pages/Quiz';
import QuizResults from './pages/QuizResults';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import RegistrationsManager from './admin/RegistrationsManager';
import PaymentsManager from './admin/PaymentsManager';
import QuizManager from './admin/QuizManager';
import SettingsManager from './admin/SettingsManager';

export default function App() {
  return (
    <Routes>
      {/* Public Pages wrapped in PublicLayout (Navbar & Footer) */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/event-details" element={<EventDetails />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/registration-success" element={<RegistrationSuccess />} />
        <Route path="/registration-status" element={<RegistrationStatus />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/quiz-results" element={<QuizResults />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin Login Route */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Admin Protected Routes wrapped in AdminLayout */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="registrations" element={<RegistrationsManager />} />
        <Route path="payments" element={<PaymentsManager />} />
        <Route path="quiz" element={<QuizManager />} />
        <Route path="settings" element={<SettingsManager />} />
      </Route>
    </Routes>
  );
}
