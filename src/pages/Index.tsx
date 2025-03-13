
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import FeaturesSection from "@/components/home/FeaturesSection";
import ServicesSection from "@/components/home/ServicesSection";
import CTASection from "@/components/home/CTASection";
import DiagnosticCards from "@/components/home/DiagnosticCards";
import HealthPrograms from "@/components/home/HealthPrograms";
import PopularTreatments from "@/components/home/PopularTreatments";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <DiagnosticCards />
        <PopularTreatments />
        <FeaturesSection />
        <HealthPrograms />
        <ServicesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
