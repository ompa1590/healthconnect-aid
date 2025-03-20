import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PatientLogin from './pages/login/PatientLogin';
import PatientSignup from './pages/login/PatientSignup';
import Dashboard from './pages/dashboard/Dashboard';
import ProfileSettings from './pages/dashboard/ProfileSettings';
import MedicalHistory from './pages/dashboard/MedicalHistory';
import HealthRecords from './pages/dashboard/HealthRecords';
import TreatmentOptions from './pages/dashboard/TreatmentOptions';
import Services from './pages/dashboard/Services';
import PastAppointments from './pages/dashboard/PastAppointments';
import BookAppointment from './pages/dashboard/BookAppointment';
import ProviderSignup from './pages/login/ProviderSignup';

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
        <Route path="/dashboard/health-records" element={<HealthRecords />} />
        <Route path="/dashboard/treatment-options" element={<TreatmentOptions />} />
        <Route path="/dashboard/services" element={<Services />} />
        <Route path="/dashboard/past-appointments" element={<PastAppointments />} />
        <Route path="/dashboard/book-appointment" element={<BookAppointment />} />
        <Route path="/provider-registration" element={<ProviderSignup />} />
      </Routes>
    </Router>
  );
}

export default App;

