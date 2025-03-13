
import { useState } from "react";
import { useForm } from "react-hook-form";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Mail, 
  Phone, 
  MapPin, 
  MessageSquare, 
  Send, 
  Linkedin, 
  Twitter, 
  Instagram,
  ArrowRight,
  CheckCircle 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

const ContactPage = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();
  
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Message sent!",
      description: "We'll get back to you as soon as possible.",
    });
    
    setIsSubmitting(false);
    setSubmitted(true);
    reset();
    
    // Reset success message after 5 seconds
    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      details: "support@cloudcure.com",
      action: "Send email",
      link: "mailto:support@cloudcure.com",
      color: "primary"
    },
    {
      icon: Phone,
      title: "Call Us",
      details: "+1 (800) 555-0123",
      action: "Call now",
      link: "tel:+18005550123",
      color: "secondary"
    },
    {
      icon: MapPin,
      title: "Location",
      details: "123 Health Avenue, Toronto, ON",
      action: "Get directions",
      link: "https://maps.google.com",
      color: "primary"
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      details: "Chat with our support team",
      action: "Start chat",
      link: "#chat",
      color: "secondary"
    }
  ];

  const socialLinks = [
    { icon: Linkedin, name: "LinkedIn", link: "#", color: "bg-[#0077B5]" },
    { icon: Twitter, name: "Twitter", link: "#", color: "bg-[#1DA1F2]" },
    { icon: Instagram, name: "Instagram", link: "#", color: "bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45]" },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-32 pb-20">
        <section className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Get In Touch</h1>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Have questions about our services or need support? We're here to help.
              Reach out to us through any of the methods below.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <div className="lg:col-span-1 space-y-6">
              {contactInfo.map((item, index) => (
                <GlassCard 
                  key={index} 
                  className="p-6 animate-fade-in hover:shadow-lg transition-all duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start">
                    <div className={`rounded-full bg-${item.color}/10 w-12 h-12 flex items-center justify-center shrink-0 mr-4`}>
                      <item.icon className={`h-6 w-6 text-${item.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                      <p className="text-muted-foreground mb-3">{item.details}</p>
                      <Button variant="link" className="p-0 h-auto" asChild>
                        <a href={item.link} target="_blank" rel="noopener noreferrer">
                          {item.action} <ArrowRight className="ml-1 h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              ))}
              
              {/* Social Media */}
              <GlassCard className="p-6 animate-fade-in" style={{ animationDelay: "0.4s" }}>
                <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <a 
                      key={index} 
                      href={social.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`${social.color} text-white p-3 rounded-full hover:opacity-90 transition-opacity`}
                    >
                      <social.icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </GlassCard>
            </div>
            
            <div className="lg:col-span-2">
              <GlassCard className="p-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <div className="flex items-center mb-6">
                  <Send className="h-6 w-6 text-primary mr-3" />
                  <h2 className="text-2xl font-semibold">Send Us A Message</h2>
                </div>
                
                {submitted ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mb-4">
                      <CheckCircle className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                    <p className="text-muted-foreground mb-6">
                      Thank you for reaching out. We'll get back to you as soon as possible.
                    </p>
                    <Button onClick={() => setSubmitted(false)}>Send Another Message</Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                          Your Name <span className="text-destructive">*</span>
                        </label>
                        <Input
                          id="name"
                          placeholder="John Doe"
                          {...register("name", { required: "Name is required" })}
                          className={errors.name ? "border-destructive" : ""}
                        />
                        {errors.name && (
                          <p className="text-destructive text-xs">{errors.name.message}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          Email Address <span className="text-destructive">*</span>
                        </label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          {...register("email", { 
                            required: "Email is required",
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Invalid email address"
                            }
                          })}
                          className={errors.email ? "border-destructive" : ""}
                        />
                        {errors.email && (
                          <p className="text-destructive text-xs">{errors.email.message}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium">
                        Phone Number (Optional)
                      </label>
                      <Input
                        id="phone"
                        placeholder="+1 (555) 000-0000"
                        {...register("phone")}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium">
                        Subject <span className="text-destructive">*</span>
                      </label>
                      <Input
                        id="subject"
                        placeholder="How can we help you?"
                        {...register("subject", { required: "Subject is required" })}
                        className={errors.subject ? "border-destructive" : ""}
                      />
                      {errors.subject && (
                        <p className="text-destructive text-xs">{errors.subject.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">
                        Message <span className="text-destructive">*</span>
                      </label>
                      <Textarea
                        id="message"
                        placeholder="Please describe your question or concern..."
                        rows={5}
                        {...register("message", { required: "Message is required" })}
                        className={errors.message ? "border-destructive" : ""}
                      />
                      {errors.message && (
                        <p className="text-destructive text-xs">{errors.message.message}</p>
                      )}
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full md:w-auto rounded-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                      <Send className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                )}
              </GlassCard>
            </div>
          </div>
          
          {/* Map Section */}
          <div className="relative">
            <GlassCard className="p-0 overflow-hidden animate-fade-in">
              <div className="aspect-video rounded-xl bg-muted relative">
                {/* Placeholder map UI */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-primary mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground">Interactive map would be displayed here</p>
                  </div>
                </div>
                
                {/* Location marker */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center relative">
                    <div className="absolute w-12 h-12 bg-primary/30 rounded-full animate-ping"></div>
                    <MapPin className="h-4 w-4 text-white" />
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
