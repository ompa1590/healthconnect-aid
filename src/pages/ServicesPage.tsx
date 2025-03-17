import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ServiceCategoryTabs } from "@/components/services/ServiceCategoryTabs";
import HealthCategories from "@/components/services/HealthCategories";
import AllTreatments from "@/components/services/AllTreatments";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
const ServicesPage = () => {
  const [viewMode, setViewMode] = useState("categories");
  return <div className="min-h-screen">
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
          
          <Tabs value={viewMode} onValueChange={setViewMode} className="mb-8">
            <div className="flex justify-center mb-8">
              <TabsList>
                <TabsTrigger value="categories">Health Categories</TabsTrigger>
                <TabsTrigger value="treatments">All Treatments</TabsTrigger>
                <TabsTrigger value="services">Pricing</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="categories" className="animate-fade-in">
              <HealthCategories />
            </TabsContent>
            
            <TabsContent value="treatments" className="animate-fade-in">
              <AllTreatments />
            </TabsContent>
            
            <TabsContent value="services" className="animate-fade-in">
              <ServiceCategoryTabs />
            </TabsContent>
          </Tabs>
        </section>
      </main>
      <Footer />
    </div>;
};
export default ServicesPage;