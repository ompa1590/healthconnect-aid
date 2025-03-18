
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ServiceCategoryTabs } from "@/components/services/ServiceCategoryTabs";
import HealthCategories from "@/components/services/HealthCategories";
import AllTreatments from "@/components/services/AllTreatments";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { DoctorCard } from "@/components/services/DoctorCard";

const ServicesPage = () => {
  const [viewMode, setViewMode] = useState("categories");
  
  const featuredDoctors = [
    {
      name: "Dr. Emily Wilson",
      specialty: "Cardiologist",
      imageUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=987&auto=format&fit=crop",
      rating: 4.9,
      experience: "12+ years",
      availability: "Mon-Fri",
      iconType: "heart" as const,
      iconColor: "primary" as const
    },
    {
      name: "Dr. Michael Chen",
      specialty: "Neurologist",
      imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=1470&auto=format&fit=crop",
      rating: 4.8,
      experience: "15+ years",
      availability: "Tue-Sat",
      iconType: "brain" as const,
      iconColor: "secondary" as const
    },
    {
      name: "Dr. Sophia Rodriguez",
      specialty: "Pediatrician",
      imageUrl: "https://images.unsplash.com/photo-1643297654416-05795d62e385?q=80&w=987&auto=format&fit=crop",
      rating: 5.0,
      experience: "10+ years",
      availability: "Mon-Sat",
      iconType: "doctor" as const,
      iconColor: "accent" as const
    }
  ];
  
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
                <TabsTrigger value="doctors">Our Doctors</TabsTrigger>
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
            
            <TabsContent value="doctors" className="animate-fade-in">
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold mb-2">Meet Our Specialists</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Our team of experienced healthcare professionals is ready to provide you with the best care possible.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredDoctors.map((doctor, index) => (
                  <DoctorCard 
                    key={index}
                    name={doctor.name}
                    specialty={doctor.specialty}
                    imageUrl={doctor.imageUrl}
                    rating={doctor.rating}
                    experience={doctor.experience}
                    availability={doctor.availability}
                    iconType={doctor.iconType}
                    iconColor={doctor.iconColor}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </section>
        
        {/* Featured Healthcare Professionals Section */}
        <section className="container mx-auto px-6 py-12 mt-8">
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-3xl p-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-2">Healthcare Professional Spotlight</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our team of certified specialists is available 24/7 to address your health concerns.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="col-span-1 md:col-span-2 rounded-2xl overflow-hidden h-auto md:h-[400px] relative">
                <img 
                  src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1480&auto=format&fit=crop" 
                  alt="Healthcare team meeting" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Collaborative Care Approach</h3>
                  <p className="mb-4">Our healthcare professionals work together to provide comprehensive care for complex conditions.</p>
                </div>
              </div>
              
              <div className="flex flex-col gap-4">
                <div className="rounded-2xl overflow-hidden h-[190px] relative">
                  <img 
                    src="https://images.unsplash.com/photo-1551601651-bc60f254d532?q=80&w=1364&auto=format&fit=crop" 
                    alt="Doctor with patient" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4 text-white">
                    <h3 className="text-lg font-bold">Patient-Centered Care</h3>
                  </div>
                </div>
                <div className="rounded-2xl overflow-hidden h-[190px] relative">
                  <img 
                    src="https://images.unsplash.com/photo-1631815589668-dc6d0eb3a6cc?q=80&w=1364&auto=format&fit=crop" 
                    alt="Telemedicine consultation" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4 text-white">
                    <h3 className="text-lg font-bold">Virtual Consultations</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>;
};
export default ServicesPage;
