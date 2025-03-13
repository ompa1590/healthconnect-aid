
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ServiceCategoryTabs } from "@/components/services/ServiceCategoryTabs";

const ServicesPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-32 pb-20">
        <section className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Our Healthcare Services</h1>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Comprehensive telehealth services designed to provide care when and where you need it.
              Browse our services below and find the right care for your needs.
            </p>
          </div>

          <ServiceCategoryTabs />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ServicesPage;
