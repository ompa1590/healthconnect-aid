
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/dashboard/Dashboard";
import PatientLogin from "./pages/login/PatientLogin";
import PatientSignup from "./pages/login/PatientSignup";
import AdminLogin from "./pages/login/AdminLogin";
import ProviderDashboard from "./pages/provider/ProviderDashboard";
import ServicesPage from "./pages/ServicesPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import { useEffect } from "react";
import MedicalHistoryPage from "./pages/dashboard/MedicalHistoryPage";
import TreatmentOptionsPage from "./pages/dashboard/TreatmentOptionsPage";
import HealthRecordsPage from "./pages/dashboard/HealthRecordsPage";
import { LanguageProvider } from "./contexts/LanguageContext";

const useAddGoogleFonts = () => {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    document.documentElement.style.setProperty('--font-sans', '"Inter", system-ui, sans-serif');
    document.documentElement.style.setProperty('--font-heading', '"Montserrat", system-ui, sans-serif');
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);
};

const queryClient = new QueryClient();

const App = () => {
  useAddGoogleFonts();
  
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/*" element={<Dashboard />} />
              <Route path="/login" element={<PatientLogin />} />
              <Route path="/signup" element={<PatientSignup />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/provider/dashboard/*" element={<ProviderDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;
