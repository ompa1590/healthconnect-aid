
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CircleAlert, Heart, HeartPulse, Activity, Pill, ShieldAlert, Info } from "lucide-react";
import { extractMedicalInfo } from "@/utils/medicalExtractor";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface HealthInsightsProps {
  className?: string;
}

const HealthInsightsWidget: React.FC<HealthInsightsProps> = ({ className }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [documents, setDocuments] = useState<any[]>([]);
  const [insights, setInsights] = useState<{
    conditions: string[];
    allergies: string[];
    medications: string[];
    pastTreatments: string[];
  }>({
    conditions: [],
    allergies: [],
    medications: [],
    pastTreatments: [],
  });
  const { toast } = useToast();

  // Health category colors
  const colors = {
    conditions: "#ef4444", // red
    allergies: "#f59e0b", // amber
    medications: "#3b82f6", // blue
    treatments: "#10b981", // emerald
  };

  useEffect(() => {
    const fetchVerifiedDocuments = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        if (!session?.session) {
          // Show sample data if not logged in
          setIsLoading(false);
          setDocuments([]);
          setSampleData();
          return;
        }

        const { data, error } = await supabase
          .from("user_documents")
          .select("*")
          .eq("user_id", session.session.user.id)
          .eq("summary_verified", true)
          .order("uploaded_at", { ascending: false });

        if (error) throw error;
        setDocuments(data || []);

        if (data && data.length > 0) {
          // Extract medical information from all document summaries
          const extractedInfo = {
            conditions: [] as string[],
            allergies: [] as string[],
            medications: [] as string[],
            pastTreatments: [] as string[],
          };

          data?.forEach((doc) => {
            if (doc.document_summary) {
              const docInfo = extractMedicalInfo(doc.document_summary);
              extractedInfo.conditions.push(...docInfo.conditions);
              extractedInfo.allergies.push(...docInfo.allergies);
              extractedInfo.medications.push(...docInfo.medications);
              extractedInfo.pastTreatments.push(...docInfo.pastTreatments);
            }
          });

          // Remove duplicates
          setInsights({
            conditions: [...new Set(extractedInfo.conditions)],
            allergies: [...new Set(extractedInfo.allergies)],
            medications: [...new Set(extractedInfo.medications)],
            pastTreatments: [...new Set(extractedInfo.pastTreatments)],
          });
        } else {
          // No verified documents found, show sample data
          setSampleData();
        }
      } catch (error) {
        console.error("Error fetching verified documents:", error);
        toast({
          title: "Error",
          description: "Could not load health insights",
          variant: "destructive",
        });
        // Show sample data on error
        setSampleData();
      } finally {
        setIsLoading(false);
      }
    };

    fetchVerifiedDocuments();
  }, [toast]);

  const setSampleData = () => {
    setInsights({
      conditions: ["Hypothyroidism", "Mild Hypertension", "Vitamin B12 Deficiency", "Vitamin D Deficiency"],
      allergies: ["Dust Mites", "Cat Dander", "Pollen", "Penicillin"],
      medications: ["Levothyroxine 50mcg", "Lisinopril 10mg", "Vitamin D3 2000IU", "Vitamin B12 1000mcg"],
      pastTreatments: ["Physical Therapy", "Allergen Immunotherapy", "Annual Wellness Exam", "Cardiovascular Assessment"]
    });
  };

  // Data for pie chart
  const pieData = [
    { name: "Conditions", value: insights.conditions.length, color: colors.conditions },
    { name: "Allergies", value: insights.allergies.length, color: colors.allergies },
    { name: "Medications", value: insights.medications.length, color: colors.medications },
    { name: "Treatments", value: insights.pastTreatments.length, color: colors.treatments },
  ].filter(item => item.value > 0);

  // If there are no verified documents with summaries and no sample data
  if (!isLoading && documents.length === 0 && insights.conditions.length === 0 && 
      insights.allergies.length === 0 && insights.medications.length === 0 && 
      insights.pastTreatments.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HeartPulse className="h-5 w-5 text-primary" />
            Health Insights
          </CardTitle>
          <CardDescription>
            Extracted from your verified medical documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Info className="h-8 w-8 text-muted-foreground mb-2" />
            <h3 className="text-lg font-medium">No insights available</h3>
            <p className="text-muted-foreground text-sm mt-1 max-w-md">
              Upload medical documents and verify their summaries to see health insights here
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const renderCategoryItems = (items: string[], icon: React.ReactNode, title: string, color: string) => {
    if (items.length === 0) return null;
    
    return (
      <div className="space-y-2">
        <h3 className="text-sm font-medium flex items-center gap-1.5" style={{ color }}>
          {icon}
          {title} ({items.length})
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {items.map((item, index) => (
            <Badge key={index} variant="outline" className="text-xs capitalize">
              {item}
            </Badge>
          ))}
        </div>
      </div>
    );
  };

  // Sample data notification
  const SampleDataNotice = () => {
    if (documents.length === 0 && !isLoading) {
      return (
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-md px-3 py-2 mt-2 mb-4">
          <p className="text-xs text-amber-700 dark:text-amber-400 flex items-center">
            <CircleAlert className="h-3 w-3 mr-1.5" />
            Sample data shown. Upload and verify documents to see your actual health insights.
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HeartPulse className="h-5 w-5 text-primary" />
          Health Insights
        </CardTitle>
        <CardDescription>
          Extracted from your verified medical documents
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-[200px] w-full rounded-md" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <div className="flex flex-wrap gap-1">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-12 rounded-full" />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <SampleDataNotice />
            
            {/* Health summary chart */}
            {pieData.length > 0 ? (
              <div className="h-[200px] w-full relative">
                <ChartContainer
                  config={{
                    conditions: { label: "Conditions", theme: { light: colors.conditions, dark: colors.conditions } },
                    allergies: { label: "Allergies", theme: { light: colors.allergies, dark: colors.allergies } },
                    medications: { label: "Medications", theme: { light: colors.medications, dark: colors.medications } },
                    treatments: { label: "Treatments", theme: { light: colors.treatments, dark: colors.treatments } },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                        nameKey="name"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            labelKey="name"
                            hideLabel={false}
                            indicator="dot"
                          />
                        }
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            ) : (
              <div className="text-center py-6">
                <CircleAlert className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                <p className="text-muted-foreground">No health insights available yet</p>
              </div>
            )}

            {/* Categories */}
            <div className="grid gap-4">
              {renderCategoryItems(
                insights.conditions, 
                <Heart className="h-3.5 w-3.5" />, 
                "Conditions", 
                colors.conditions
              )}
              
              {renderCategoryItems(
                insights.allergies, 
                <ShieldAlert className="h-3.5 w-3.5" />, 
                "Allergies", 
                colors.allergies
              )}
              
              {renderCategoryItems(
                insights.medications, 
                <Pill className="h-3.5 w-3.5" />, 
                "Medications", 
                colors.medications
              )}
              
              {renderCategoryItems(
                insights.pastTreatments, 
                <Activity className="h-3.5 w-3.5" />, 
                "Past Treatments", 
                colors.treatments
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HealthInsightsWidget;
