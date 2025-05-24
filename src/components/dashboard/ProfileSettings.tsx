
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  UserRound, 
  Phone, 
  Calendar, 
  User2, 
  UserCog, 
  Mail, 
  BadgeInfo,
  ShieldAlert,
  SaveIcon,
  Stethoscope,
  Sparkles
} from "lucide-react";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { HeartPulseLoader } from "@/components/ui/heart-pulse-loader";
import { supabase } from "@/integrations/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Define the profile schema with Zod
const profileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().optional(),
  date_of_birth: z.string().optional(),
  family_doctor: z.string().optional(),
  emergency_contact: z.string().optional(),
  province: z.string(),
  health_card_number: z.string(),
  data_consent: z.boolean().default(false)
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfileSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  
  // Initialize the form
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      date_of_birth: "",
      family_doctor: "",
      emergency_contact: "",
      province: "",
      health_card_number: "",
      data_consent: false
    }
  });
  const navigate = useNavigate();
  const handleBackToHome = () => {
    navigate("/dashboard");
  };
  
  // Fetch user profile data from Supabase
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error("User not authenticated");
        }
        
        // Fetch user profile from profiles table
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        
        if (error) throw error;
        
        if (profile) {
          // Get user email from auth
          form.reset({
            name: profile.name || "",
            email: user.email || "",
            phone: profile.phone || "",
            date_of_birth: profile.date_of_birth || "",
            family_doctor: profile.family_doctor || "",
            emergency_contact: profile.emergency_contact || "",
            province: profile.province || "",
            health_card_number: profile.health_card_number || "",
            data_consent: profile.data_consent || false
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile", {
          description: "Please try again later"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [form]);
  
  // Handle form submission
  const onSubmit = async (data: ProfileFormValues) => {
    try {
      setSaving(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      // Update profile in Supabase
      const { error } = await supabase
        .from("profiles")
        .update({
          name: data.name,
          phone: data.phone,
          date_of_birth: data.date_of_birth,
          family_doctor: data.family_doctor,
          emergency_contact: data.emergency_contact,
          data_consent: data.data_consent
        })
        .eq("id", user.id);
      
      if (error) throw error;
      
      // Update email in auth if it changed
      const currentUser = await supabase.auth.getUser();
      if (currentUser.data.user?.email !== data.email) {
        const { error: emailUpdateError } = await supabase.auth.updateUser({
          email: data.email
        });
        
        if (emailUpdateError) throw emailUpdateError;
      }
      
      toast.success("Profile updated successfully", {
        description: "Your profile information has been saved."
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile", {
        description: "Please try again later"
      });
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <Card className="animate-pulse transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center py-16">
            <HeartPulseLoader size="lg" />
            <p className="mt-4 text-muted-foreground">Loading your profile...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <main className="max-w-6xl mx-auto px-6 py-10 animate-fade-in">
      <div className="flex items-center mb-6">
        <Button 
          variant="back" 
          size="sm" 
          onClick={handleBackToHome}
          className="mr-4 bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white group"
        >
          <ArrowLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Button>
        <h1 className="text-3xl font-normal flex items-center">
          Medical History
          <FileText className="ml-2 h-6 w-6 text-primary/70" />
        </h1>
      </div>
      <div className="mb-6 relative overflow-hidden rounded-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-health-200/40 to-health-100/20"></div>
        <div className="relative p-6 border border-health-200/30">
          <div className="flex items-center mb-2">
            <Sparkles className="h-5 w-5 text-primary/70 mr-2" />
            <h2 className="text-xl font-medium">Personalized your Profile</h2>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Update your personal information to keep your profile accurate and up to date.          </p>
        </div>
      </div>
    <Card className="max-w-6xl mx-auto my-6 px-6 py-10 animate-fade-in">
      <CardContent className="p-6">
        <h2 className="text-xl font-medium mb-6 flex items-center">
          <UserCog className="mr-2 h-5 w-5 text-primary" />
          Profile Settings
        </h2>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="flex items-center gap-2">
                      <UserRound className="h-4 w-4" />
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="date_of_birth"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Date of Birth
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="family_doctor"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="flex items-center gap-2">
                      <User2 className="h-4 w-4" />
                      Family Doctor
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="emergency_contact"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Emergency Contact
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="province"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="flex items-center gap-2">
                      <BadgeInfo className="h-4 w-4" />
                      Province
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        disabled
                        className="bg-muted/50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="health_card_number"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="flex items-center gap-2">
                      <BadgeInfo className="h-4 w-4" />
                      Health Card Number
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        disabled
                        className="bg-muted/50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="data_consent"
              render={({ field }) => (
                <FormItem className="flex items-start space-x-3 pt-4 border-t">
                  <FormControl>
                    <Switch 
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1">
                    <FormLabel className="flex items-center gap-2 cursor-pointer">
                      <ShieldAlert className="h-4 w-4" />
                      Data Consent
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      I consent to the collection and processing of my health data in accordance with the privacy policy.
                    </p>
                  </div>
                </FormItem>
              )}
            />
            
            <div className="flex justify-end pt-4">
              <Button 
                type="submit"
                disabled={saving}
                className="transition-all duration-300 hover:shadow-md"
              >
                {saving ? (
                  <>
                    <HeartPulseLoader size="sm" color="text-white" className="mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <SaveIcon className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  </main>
  );
};

export default ProfileSettings;
