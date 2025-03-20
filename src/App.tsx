
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PatientLogin from './pages/login/PatientLogin';
import PatientSignup from './pages/login/PatientSignup';
import Dashboard from './pages/dashboard/Dashboard';
import ProfileSettings from './components/dashboard/ProfileSettings';
import MedicalHistory from './components/dashboard/MedicalHistory';
import HealthRecordsPage from './pages/dashboard/HealthRecordsPage';
import TreatmentOptionsPage from './pages/dashboard/TreatmentOptionsPage';
import DashboardServices from './components/dashboard/DashboardServices';
import PastAppointmentsPage from './pages/dashboard/PastAppointmentsPage';
import BookAppointment from './components/dashboard/BookAppointment';
import ProviderSignup from './pages/login/ProviderSignup';
import AdminLogin from './pages/login/AdminLogin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PatientLogin />} />
        <Route path="/login" element={<PatientLogin />} />
        <Route path="/signup" element={<PatientSignup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/profile" element={<ProfileSettings />} />
        <Route path="/dashboard/medical-history" element={<MedicalHistory />} />
        <Route path="/dashboard/health-records" element={<HealthRecordsPage />} />
        <Route path="/dashboard/treatment-options" element={<TreatmentOptionsPage />} />
        <Route path="/dashboard/services" element={<DashboardServices />} />
        <Route path="/dashboard/past-appointments" element={<PastAppointmentsPage />} />
        <Route path="/dashboard/book-appointment" element={<BookAppointment />} />
        <Route path="/provider-registration" element={<ProviderSignup />} />
        <Route path="/admin-login" element={<AdminLogin />} />
      </Routes>
    </Router>
  );
}

export default App;
