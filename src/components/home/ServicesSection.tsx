
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
      color: "primary",
      gradientFrom: "from-primary/20",
      gradientTo: "to-primary/5",
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
      color: "secondary",
      gradientFrom: "from-secondary/20",
      gradientTo: "to-secondary/5",
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
      color: "primary",
      gradientFrom: "from-primary/20",
      gradientTo: "to-secondary/5",
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
      color: "secondary",
      gradientFrom: "from-secondary/20",
      gradientTo: "to-primary/5",
    },
  ];

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

        <Tabs defaultValue="chronic-care" className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 mb-8 bg-transparent">
            {services.map((service) => (
              <TabsTrigger
                key={service.id}
                value={service.id}
                className="data-[state=active]:glass data-[state=active]:shadow-sm text-base py-3 transition-all duration-300 group"
              >
                <div className="relative">
                  <div className="absolute -top-1 -left-1 h-8 w-8 rounded-full bg-muted opacity-0 group-data-[state=active]:opacity-100 transition-opacity duration-300"></div>
                  <service.icon className={`h-5 w-5 mr-2 text-${service.color} relative z-10 group-data-[state=active]:text-${service.color} group-hover:scale-110 transition-transform duration-300`} />
                </div>
                <span>{service.name}</span>
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
                  <div className={`bg-gradient-to-br ${service.gradientFrom} ${service.gradientTo} p-8 lg:p-10 relative overflow-hidden`}>
                    {/* Abstract shape decorations */}
                    <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-white/10 blur-xl"></div>
                    <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white/5 to-transparent"></div>
                    
                    <service.icon className={`h-14 w-14 text-${service.color} mb-6 transform transition-transform hover:scale-110 duration-300`} />
                    <h3 className="text-2xl font-bold mb-3">{service.name}</h3>
                    <p className="text-muted-foreground mb-4">{service.description}</p>
                    <div className="mb-6">
                      <span className={`text-3xl font-bold text-${service.color}`}>{service.price}</span>
                    </div>
                    <Button className={`w-full rounded-full bg-${service.color} hover:bg-${service.color}/90 transition-transform duration-300 hover:scale-105`}>
                      Get Started
                    </Button>
                  </div>

                  {/* Service Details */}
                  <div className="col-span-2 p-8 lg:p-10">
                    <div className="mb-6">
                      <h4 className="text-lg font-medium mb-4">What's Included</h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {service.features.map((feature, index) => (
                          <li key={index} className="flex items-center group">
                            <div className={`h-5 w-5 rounded-full bg-${service.color}/20 flex items-center justify-center mr-3 group-hover:bg-${service.color}/30 transition-colors duration-300`}>
                              <span className={`h-2 w-2 rounded-full bg-${service.color} group-hover:scale-125 transition-transform duration-300`}></span>
                            </div>
                            <span className="group-hover:translate-x-1 transition-transform duration-300">{feature}</span>
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
                              className={`px-3 py-1 rounded-full bg-muted text-foreground text-sm hover:bg-${service.color}/10 hover:border-${service.color}/20 transition-colors duration-300 cursor-pointer`}
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
                              className={`px-3 py-1 rounded-full bg-muted text-foreground text-sm hover:bg-${service.color}/10 hover:border-${service.color}/20 transition-colors duration-300 cursor-pointer`}
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
                              className={`px-3 py-1 rounded-full bg-muted text-foreground text-sm hover:bg-${service.color}/10 hover:border-${service.color}/20 transition-colors duration-300 cursor-pointer`}
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
