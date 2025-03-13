
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/dashboard/Dashboard";
import PatientLogin from "./pages/login/PatientLogin";
import AdminLogin from "./pages/login/AdminLogin";
import ProviderDashboard from "./pages/provider/ProviderDashboard";
import { useEffect } from "react";

// Create a custom hook to add Google fonts to the document
const useAddGoogleFonts = () => {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    // Update font family in CSS
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
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard/*" element={<Dashboard />} />
            <Route path="/login" element={<PatientLogin />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/provider/dashboard/*" element={<ProviderDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
