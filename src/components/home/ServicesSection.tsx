
import { services } from "@/data/servicesData";
import ServiceTabs from "./ServiceTabs";

const ServicesSection = () => {
  return (
    <section id="services" className="py-20 bg-muted/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl -z-10 blob-animation-slow"></div>
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-secondary/5 rounded-full filter blur-3xl -z-10 blob-animation"></div>
      
      {/* 3D decorative elements */}
      <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-br from-primary/10 to-transparent rounded-lg transform rotate-12 floating"></div>
      <div className="absolute bottom-40 left-20 w-20 h-20 bg-gradient-to-tl from-secondary/10 to-transparent rounded-lg transform -rotate-12 floating-slow"></div>

      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-4 py-1 rounded-full text-sm font-medium bg-muted text-primary mb-4">Healthcare Programs</span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Our Healthcare Programs</h2>
          <p className="text-muted-foreground text-lg">
            Choose from our range of comprehensive virtual healthcare services tailored to meet your specific needs.
          </p>
        </div>

        <ServiceTabs services={services} />
      </div>
    </section>
  );
};

export default ServicesSection;
