
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PatientLogin from './pages/login/PatientLogin';
import PatientSignup from './pages/login/PatientSignup';
import Dashboard from './pages/dashboard/Dashboard';
import HealthRecordsPage from './pages/dashboard/HealthRecordsPage';
import TreatmentOptionsPage from './pages/dashboard/TreatmentOptionsPage';
import PastAppointmentsPage from './pages/dashboard/PastAppointmentsPage';
import ProviderSignup from './pages/login/ProviderSignup';
import ProviderLogin from './pages/login/ProviderLogin';
import ProviderDashboard from './pages/provider/ProviderDashboard';
import ProfileSettings from '@/components/dashboard/ProfileSettings';
import MedicalHistory from '@/components/dashboard/MedicalHistory';
import DashboardServices from '@/components/dashboard/DashboardServices';
import BookAppointment from '@/components/dashboard/BookAppointment';
import { LanguageProvider } from './contexts/LanguageContext';

const App = () => {
  React.useEffect(() => {
    // Add Poppins font to the document head
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    // Add global styles for Poppins
    const style = document.createElement('style');
    style.textContent = `
      body, html {
        font-family: 'Poppins', sans-serif;
      }
      .font-poppins {
        font-family: 'Poppins', sans-serif;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(link);
      document.head.removeChild(style);
    };
  }, []);

  return (
    <LanguageProvider>
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
          <Route path="/provider-login" element={<ProviderLogin />} />
          <Route path="/provider/dashboard" element={<ProviderDashboard />} />
          <Route path="/provider/patients" element={<ProviderDashboard />} />
          <Route path="/provider/consultations" element={<ProviderDashboard />} />
          <Route path="/provider/prescriptions" element={<ProviderDashboard />} />
          <Route path="/provider/settings" element={<ProviderDashboard />} />
          <Route path="/provider/help" element={<ProviderDashboard />} />
          <Route path="/provider/legal" element={<ProviderDashboard />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
};

export default App;
