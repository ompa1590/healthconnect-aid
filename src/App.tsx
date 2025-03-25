import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PatientLogin from './pages/login/PatientLogin';
import PatientSignup from './pages/login/PatientSignup';
import Dashboard from './pages/dashboard/Dashboard';
import HealthRecordsPage from './pages/dashboard/HealthRecordsPage';
import TreatmentOptionsPage from './pages/dashboard/TreatmentOptionsPage';
import PastAppointmentsPage from './pages/dashboard/PastAppointmentsPage';
import PrescriptionsPage from './pages/dashboard/PrescriptionsPage';
import ProviderSignup from './pages/login/ProviderSignup';
import ProviderLogin from './pages/login/ProviderLogin';
import ProviderDashboard from './pages/provider/ProviderDashboard';
import ProfileSettings from '@/components/dashboard/ProfileSettings';
import MedicalHistory from '@/components/dashboard/MedicalHistory';
import DashboardServices from '@/components/dashboard/DashboardServices';
import BookAppointment from '@/components/dashboard/BookAppointment';
import { LanguageProvider } from './contexts/LanguageContext';
import Index from './pages/Index';
import ServicesPage from './pages/ServicesPage';
import HowItWorksPage from './pages/HowItWorksPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import DashboardLayout from "@/layouts/DashboardLayout";
import SupportPage from './pages/dashboard/SupportPage';

const App = () => {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<PatientLogin />} />
          <Route path="/signup" element={<PatientSignup />} />
          <Route path="/provider-registration" element={<ProviderSignup />} />
          <Route path="/provider-login" element={<ProviderLogin />} />
          <Route path="/provider/dashboard" element={<ProviderDashboard />} />
          <Route path="/provider/patients" element={<ProviderDashboard />} />
          <Route path="/provider/consultations" element={<ProviderDashboard />} />
          <Route path="/provider/prescriptions" element={<ProviderDashboard />} />
          <Route path="/provider/settings" element={<ProviderDashboard />} />
          <Route path="/provider/help" element={<ProviderDashboard />} />
          <Route path="/provider/legal" element={<ProviderDashboard />} />
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/profile" element={<ProfileSettings />} />
            <Route path="/dashboard/medical-history" element={<MedicalHistory />} />
            <Route path="/dashboard/health-records" element={<HealthRecordsPage />} />
            <Route path="/dashboard/treatment-options" element={<TreatmentOptionsPage />} />
            <Route path="/dashboard/services" element={<DashboardServices />} />
            <Route path="/dashboard/past-appointments" element={<PastAppointmentsPage />} />
            <Route path="/dashboard/book-appointment" element={<BookAppointment />} />
            <Route path="/dashboard/prescriptions" element={<PrescriptionsPage />} />
            <Route path="/dashboard/support" element={<SupportPage />} />
          </Route>
        </Routes>
      </Router>
    </LanguageProvider>
  );
};

export default App;
