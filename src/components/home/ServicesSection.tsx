
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Brain, Heart, Leaf, ShieldPlus, Users } from "lucide-react";

const ServicesSection = () => {
  const services = [
    {
      id: "chronic-care",
      icon: Heart,
      name: "Chronic Care Management",
      description: "Personalized healthcare plans for chronic conditions",
      price: "$70/month",
      features: [
        "Personalized treatment plans",
        "Regular virtual check-ins",
        "Progress tracking tools",
        "Nutritional guidance",
        "Mental health support",
        "24/7 messaging with care team",
      ],
      conditions: ["Diabetes", "Hypertension", "Heart Disease", "Weight Management", "Asthma"],
    },
    {
      id: "consultations",
      icon: ShieldPlus,
      name: "General Consultations",
      description: "On-demand medical advice from certified physicians",
      price: "$45/consultation",
      features: [
        "24/7 available physicians",
        "Video or audio consultations",
        "Prescription services",
        "Follow-up care included",
        "Medical documentation",
        "Provincial health billing integration",
      ],
      conditions: ["Cold & Flu", "UTIs", "Skin Conditions", "Travel Consultations", "Sick Notes"],
    },
    {
      id: "specialist",
      icon: Activity,
      name: "Specialist Services",
      description: "Expert medical care from specialized practitioners",
      price: "Varies by specialist",
      features: [
        "Board-certified specialists",
        "Reduced wait times",
        "Detailed medical reports",
        "Integrated with primary care",
        "Second opinion option",
        "Follow-up scheduling",
      ],
      specialists: ["Dermatologists", "Endocrinologists", "Mental Health", "Pediatrics", "Nutrition"],
    },
    {
      id: "wellness",
      icon: Leaf,
      name: "Wellness Services",
      description: "Holistic approaches to overall wellbeing",
      price: "From $40/session",
      features: [
        "Personalized wellness plans",
        "Virtual fitness coaching",
        "Meditation & stress management",
        "Sleep improvement strategies",
        "Nutritional counseling",
        "Health education resources",
      ],
      areas: ["Fitness", "Nutrition", "Mental Wellness", "Sleep Health", "Preventive Care"],
    },
  ];

  return (
    <section id="services" className="py-20 bg-muted/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-secondary/5 rounded-full filter blur-3xl -z-10"></div>

      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Our Healthcare Programs</h2>
          <p className="text-muted-foreground text-lg">
            Choose from our range of comprehensive virtual healthcare services tailored to meet your specific needs.
          </p>
        </div>

        <Tabs defaultValue="chronic-care" className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 mb-8 bg-transparent">
            {services.map((service) => (
              <TabsTrigger
                key={service.id}
                value={service.id}
                className="data-[state=active]:glass data-[state=active]:shadow-sm text-base py-3"
              >
                <service.icon className="h-5 w-5 mr-2" />
                {service.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {services.map((service) => (
            <TabsContent
              key={service.id}
              value={service.id}
              className="pt-4 animate-fade-in"
            >
              <GlassCard className="p-0 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-3">
                  {/* Service Info */}
                  <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-8 lg:p-10">
                    <service.icon className="h-12 w-12 text-primary mb-6" />
                    <h3 className="text-2xl font-bold mb-3">{service.name}</h3>
                    <p className="text-muted-foreground mb-4">{service.description}</p>
                    <div className="mb-6">
                      <span className="text-3xl font-bold text-primary">{service.price}</span>
                    </div>
                    <Button className="w-full rounded-full bg-primary hover:bg-primary/90">
                      Get Started
                    </Button>
                  </div>

                  {/* Service Details */}
                  <div className="col-span-2 p-8 lg:p-10">
                    <div className="mb-6">
                      <h4 className="text-lg font-medium mb-4">What's Included</h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {service.features.map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <div className="h-5 w-5 rounded-full bg-secondary/20 flex items-center justify-center mr-3">
                              <span className="h-2 w-2 rounded-full bg-secondary"></span>
                            </div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {service.conditions && (
                      <div>
                        <h4 className="text-lg font-medium mb-4">Conditions Covered</h4>
                        <div className="flex flex-wrap gap-2">
                          {service.conditions.map((condition, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 rounded-full bg-muted text-foreground text-sm"
                            >
                              {condition}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {service.specialists && (
                      <div>
                        <h4 className="text-lg font-medium mb-4">Available Specialists</h4>
                        <div className="flex flex-wrap gap-2">
                          {service.specialists.map((specialist, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 rounded-full bg-muted text-foreground text-sm"
                            >
                              {specialist}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {service.areas && (
                      <div>
                        <h4 className="text-lg font-medium mb-4">Wellness Areas</h4>
                        <div className="flex flex-wrap gap-2">
                          {service.areas.map((area, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 rounded-full bg-muted text-foreground text-sm"
                            >
                              {area}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </GlassCard>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default ServicesSection;
