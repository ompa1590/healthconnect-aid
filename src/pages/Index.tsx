
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import FeaturesSection from "@/components/home/FeaturesSection";
import ServicesSection from "@/components/home/ServicesSection";
import DiagnosticCards from "@/components/home/DiagnosticCards";
import HealthPrograms from "@/components/home/HealthPrograms";
import PopularTreatments from "@/components/home/PopularTreatments";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

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
        <ServicesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
