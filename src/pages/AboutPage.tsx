
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { 
  Accessibility, 
  Lightbulb, 
  Users, 
  Heart, 
  Clock, 
  Award, 
  Shield, 
  Sparkles,
  ArrowRight 
} from "lucide-react";
import { Link } from "react-router-dom";

const AboutPage = () => {
  const coreValues = [
    {
      icon: Accessibility,
      title: "Accessibility",
      description: "Healthcare should be accessible to everyone, regardless of location or circumstance. We're breaking down barriers to care.",
      color: "primary"
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "We leverage cutting-edge technology to create healthcare experiences that are intuitive, efficient, and effective.",
      color: "secondary"
    },
    {
      icon: Users,
      title: "Patient-Centered Care",
      description: "Our patients are at the heart of everything we do. We design our services around your needs and preferences.",
      color: "primary"
    },
    {
      icon: Heart,
      title: "Holistic Wellness",
      description: "We believe in treating the whole person, addressing physical, mental, and emotional aspects of health.",
      color: "secondary"
    }
  ];

  const benefits = [
    {
      icon: Clock,
      title: "24/7 Unlimited Care",
      description: "Access to healthcare professionals around the clock, with no limits on consultations."
    },
    {
      icon: Award,
      title: "Expert Doctors",
      description: "Board-certified physicians and specialists with extensive experience in telehealth."
    },
    {
      icon: Shield,
      title: "Seamless Booking",
      description: "Book appointments in minutes with our intuitive, user-friendly platform."
    },
    {
      icon: Sparkles,
      title: "AI-Driven Health Insights",
      description: "Personalized health recommendations powered by advanced artificial intelligence."
    }
  ];

  const teamMembers = [
    {
      name: "Dr. Sarah Chen",
      role: "Chief Medical Officer",
      image: "/placeholder.svg",
      background: "Board-certified in Internal Medicine with 15+ years of clinical experience",
      specialty: "Chronic Care Management",
      gradient: "from-primary/30 to-primary/5"
    },
    {
      name: "Dr. Michael Rodriguez",
      role: "Medical Director",
      image: "/placeholder.svg",
      background: "Family Medicine specialist with expertise in telemedicine implementation",
      specialty: "Primary Care",
      gradient: "from-secondary/30 to-secondary/5"
    },
    {
      name: "Dr. Aisha Johnson",
      role: "Head of Mental Health",
      image: "/placeholder.svg",
      background: "Psychiatrist with focus on integrating mental health into primary care",
      specialty: "Anxiety & Depression",
      gradient: "from-primary/30 to-primary/5"
    },
    {
      name: "Dr. James Wilson",
      role: "Chief of Specialist Services",
      image: "/placeholder.svg",
      background: "Cardiologist with expertise in remote patient monitoring",
      specialty: "Cardiovascular Health",
      gradient: "from-secondary/30 to-secondary/5"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-32 pb-20">
        {/* Mission Statement */}
        <section className="container mx-auto px-6 mb-20">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-1 rounded-full text-sm font-medium bg-muted text-primary mb-4">Our Story</span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Transforming Healthcare for the Digital Age</h1>
            <div className="text-lg text-muted-foreground mb-8">
              <p className="mb-4">
                Altheo Health was founded with a simple mission: to make quality healthcare accessible to everyone, everywhere. 
                We believe that technology can bridge the gap between patients and providers, creating a healthcare experience that is 
                convenient, personalized, and effective.
              </p>
              <p>
                Our team of healthcare professionals and technology experts work together to build a platform that puts patients first, 
                leveraging the power of telehealth, AI, and digital tools to revolutionize how healthcare is delivered.
              </p>
            </div>
          </div>
          
          {/* Mission visual */}
          <div className="mt-12 relative">
            <GlassCard className="p-8 md:p-12 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full filter blur-3xl -z-10 blob-animation-slow"></div>
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-secondary/10 rounded-full filter blur-3xl -z-10 blob-animation"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                  <p className="text-lg mb-6">
                    We are on a mission to create a healthcare system that works for everyone. By combining medical expertise with 
                    innovative technology, we're building a future where quality healthcare is just a click away.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button className="rounded-full" asChild>
                      <Link to="/services">
                        Explore Our Services <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center overflow-hidden">
                    <div className="absolute w-40 h-40 bg-white/30 rounded-full top-1/4 left-1/4 filter blur-xl"></div>
                    <div className="relative z-10 w-3/4 h-3/4">
                      {/* 3D abstract representation of health + technology */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-32 rounded-full border-4 border-primary/50 animate-pulse" style={{ animationDuration: "3s" }}></div>
                        <div className="absolute w-40 h-40 rounded-full border border-secondary/30"></div>
                        <div className="absolute w-48 h-48 rounded-full border border-primary/20"></div>
                        <div className="absolute w-20 h-20 bg-gradient-to-br from-primary/40 to-secondary/40 rounded-2xl transform rotate-45 floating-slow"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </section>
        
        {/* Core Values */}
        <section className="container mx-auto px-6 mb-20">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 rounded-full text-sm font-medium bg-muted text-primary mb-4">Our Values</span>
            <h2 className="text-3xl font-bold mb-4">The Principles That Guide Us</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              These core values inform every decision we make and every service we provide,
              ensuring we stay true to our mission of transforming healthcare.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((value, index) => (
              <GlassCard 
                key={index} 
                className="p-6 flex flex-col items-center text-center transform transition-all duration-300 hover:scale-105 hover:shadow-lg animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`rounded-full bg-${value.color}/10 w-16 h-16 flex items-center justify-center mb-6`}>
                  <value.icon className={`h-8 w-8 text-${value.color}`} />
                </div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </GlassCard>
            ))}
          </div>
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
            {teamMembers.map((member, index) => (
              <GlassCard 
                key={index} 
                className="p-0 overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-lg animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`bg-gradient-to-br ${member.gradient} p-6 pb-0`}>
                  <div className="w-24 h-24 mx-auto bg-white rounded-full overflow-hidden mb-4">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-center mb-1">{member.name}</h3>
                  <p className="text-primary text-sm text-center mb-4">{member.role}</p>
                  <p className="text-muted-foreground text-sm mb-3">{member.background}</p>
                  <div className="flex items-center justify-center">
                    <span className="px-3 py-1 rounded-full bg-muted text-xs font-medium">
                      {member.specialty}
                    </span>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>
        
        {/* Why Choose Us */}
        <section className="container mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 rounded-full text-sm font-medium bg-muted text-primary mb-4">Why Choose Altheo Health</span>
            <h2 className="text-3xl font-bold mb-4">Benefits of Our Platform</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              We combine medical expertise with cutting-edge technology to deliver
              healthcare that's convenient, comprehensive, and personalized.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <GlassCard 
                key={index} 
                className="p-6 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start">
                  <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center shrink-0 mr-4">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button className="rounded-full" size="lg" asChild>
              <Link to="/services">
                Get Started Today <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
