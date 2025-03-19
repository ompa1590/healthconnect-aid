
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import FeaturesSection from "@/components/home/FeaturesSection";
import DiagnosticCards from "@/components/home/DiagnosticCards";
import HealthPrograms from "@/components/home/HealthPrograms";
import PopularTreatments from "@/components/home/PopularTreatments";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import LanguageSelector from "@/components/ui/LanguageSelector";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <DiagnosticCards />
        <PopularTreatments />
        <HealthPrograms />
        <FeaturesSection />
      </main>
      <Footer />
      
      <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-50">
        <LanguageSelector />
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Index;
