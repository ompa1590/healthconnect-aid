import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ServiceCategoryTabs } from "@/components/services/ServiceCategoryTabs";
import HealthCategories from "@/components/services/HealthCategories";
import AllTreatments from "@/components/services/AllTreatments";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { DoctorCard } from "@/components/services/DoctorCard";
import { GlassCard } from "@/components/ui/GlassCard";
// Add team members data
const teamMembers = [{
  name: "Dr. Sarah Johnson",
  role: "Chief Medical Officer",
  background: "15+ years experience in telemedicine and primary care",
  specialty: "Internal Medicine",
  image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=1470&auto=format&fit=crop",
  gradient: "from-blue-500/20 to-purple-500/20"
}, {
  name: "Dr. James Wilson",
  role: "Lead Specialist",
  background: "Board certified with focus on chronic conditions",
  specialty: "Cardiology",
  image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=1470&auto=format&fit=crop",
  gradient: "from-green-500/20 to-blue-500/20"
}, {
  name: "Dr. Maria Garcia",
  role: "Mental Health Director",
  background: "Specialized in telepsychiatry and anxiety disorders",
  specialty: "Psychiatry",
  image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=987&auto=format&fit=crop",
  gradient: "from-purple-500/20 to-pink-500/20"
}, {
  name: "Dr. David Chen",
  role: "Pediatric Specialist",
  background: "Dedicated to children's telehealth services",
  specialty: "Pediatrics",
  image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=1470&auto=format&fit=crop",
  gradient: "from-orange-500/20 to-red-500/20"
}];
const ServicesPage = () => {
  const [viewMode, setViewMode] = useState("categories");
  const featuredDoctors = [{
    name: "Dr. Emily Wilson",
    specialty: "Cardiologist",
    imageUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=987&auto=format&fit=crop",
    rating: 4.9,
    experience: "12+ years",
    availability: "Mon-Fri",
    iconType: "heart" as const,
    iconColor: "primary" as const
  }, {
    name: "Dr. Michael Chen",
    specialty: "Neurologist",
    imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=1470&auto=format&fit=crop",
    rating: 4.8,
    experience: "15+ years",
    availability: "Tue-Sat",
    iconType: "brain" as const,
    iconColor: "secondary" as const
  }, {
    name: "Dr. Sophia Rodriguez",
    specialty: "Pediatrician",
    imageUrl: "https://images.unsplash.com/photo-1643297654416-05795d62e385?q=80&w=987&auto=format&fit=crop",
    rating: 5.0,
    experience: "10+ years",
    availability: "Mon-Sat",
    iconType: "doctor" as const,
    iconColor: "accent" as const
  }];
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
        
        {/* Team Section */}
        <section className="container mx-auto px-6 mb-20">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 rounded-full text-sm font-medium bg-muted text-primary mb-4">Our Team</span>
            <h2 className="text-3xl font-bold mb-4">Meet Our Medical Experts</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Our team of board-certified physicians and specialists are dedicated to providing
              exceptional care through our telehealth platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => <GlassCard key={index} className="p-0 overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-lg animate-fade-in" style={{
            animationDelay: `${index * 0.1}s`
          }}>
                <div className={`bg-gradient-to-br ${member.gradient} p-6 pb-0`}>
                  <div className="w-24 h-24 mx-auto bg-white rounded-full overflow-hidden mb-4">
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                </div>
                
                <div className="text-center p-6">
                  <h3 className="text-xl font-semibold text-center mb-1">{member.name}</h3>
                  <p className="text-primary text-sm text-center mb-4">{member.role}</p>
                  <p className="text-muted-foreground text-sm mb-3">{member.background}</p>
                  <div className="flex items-center justify-center">
                    <span className="px-3 py-1 rounded-full bg-muted text-xs font-medium">
                      {member.specialty}
                    </span>
                  </div>
                </div>
              </GlassCard>)}
          </div>
        </section>
      </main>
      <Footer />
    </div>;
};
export default ServicesPage;