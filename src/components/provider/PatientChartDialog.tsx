
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BodyMap } from "./chart/BodyMap";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, Clock, Save, Upload } from "lucide-react";
import { generateChartSummary } from "@/utils/documentParser";

interface PatientChartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: any;
}

interface ConditionMarker {
  id: string;
  bodyPart: string;
  position: { x: number; y: number };
  diagnosis: string;
  severity: "low" | "moderate" | "high";
  notes: string;
  provider: string;
  timestamp: Date;
  chronic: boolean;
  followUp?: Date | null;
}

const PatientChartDialog: React.FC<PatientChartDialogProps> = ({ 
  open, 
  onOpenChange, 
  patient 
}) => {
  const [activeTab, setActiveTab] = useState("body-map");
  const [markers, setMarkers] = useState<ConditionMarker[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<ConditionMarker | null>(null);
  const [chartSummary, setChartSummary] = useState("");
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const { toast } = useToast();

  // Function to add a new marker
  const handleAddMarker = (bodyPart: string, position: { x: number; y: number }) => {
    const newMarker: ConditionMarker = {
      id: `marker-${Date.now()}`,
      bodyPart,
      position,
      diagnosis: "",
      severity: "moderate",
      notes: "",
      provider: "Dr. Chen",
      timestamp: new Date(),
      chronic: false,
      followUp: null
    };
    
    setMarkers([...markers, newMarker]);
    setSelectedMarker(newMarker);
  };

  // Function to update marker information
  const handleUpdateMarker = (id: string, updates: Partial<ConditionMarker>) => {
    const updatedMarkers = markers.map(marker => 
      marker.id === id ? { ...marker, ...updates } : marker
    );
    setMarkers(updatedMarkers);
    
    if (selectedMarker && selectedMarker.id === id) {
      setSelectedMarker({ ...selectedMarker, ...updates });
    }
  };

  // Function to delete a marker
  const handleDeleteMarker = (id: string) => {
    const updatedMarkers = markers.filter(marker => marker.id !== id);
    setMarkers(updatedMarkers);
    
    if (selectedMarker && selectedMarker.id === id) {
      setSelectedMarker(null);
    }
  };

  // Generate AI chart summary when markers change or tab changes to summary
  useEffect(() => {
    if (activeTab === "summary" && markers.length > 0) {
      updateChartSummary();
    }
  }, [activeTab, markers.filter(m => m.diagnosis).length]);

  // Function to generate chart summary based on markers
  const updateChartSummary = async () => {
    if (markers.length === 0) {
      setChartSummary("No conditions have been documented for this patient.");
      return;
    }

    if (!isEditingSummary) {
      setIsGeneratingSummary(true);
      try {
        const aiSummary = await generateChartSummary(markers, patient.name);
        setChartSummary(aiSummary);
      } catch (error) {
        console.error("Error generating AI summary:", error);
        toast({
          variant: "destructive",
          title: "Summary Generation Failed",
          description: "Could not generate an AI summary. Using fallback summary instead."
        });
      } finally {
        setIsGeneratingSummary(false);
      }
    }
  };

  // Function to handle file upload for patient images
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload this to storage
      toast({
        title: "Image uploaded",
        description: `${file.name} has been added to patient chart`,
      });
    }
  };

  // Function to save the chart
  const handleSaveChart = () => {
    // In a real app, this would save to the database
    toast({
      title: "Chart saved successfully",
      description: `${patient.name}'s chart has been updated with ${markers.length} condition(s)`,
    });
  };

  // Get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-500";
      case "moderate": return "bg-amber-500";
      case "low": return "bg-green-500";
      default: return "bg-blue-500";
    }
  };

  // Force regeneration of summary
  const handleRegenerateSummary = () => {
    updateChartSummary();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-primary/10">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {patient.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <DialogTitle className="text-xl">{patient.name}'s Chart</DialogTitle>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-primary/5 border-primary/20">
                {patient.age} years
              </Badge>
              <Badge variant="outline" className="bg-secondary/5 border-secondary/20">
                {patient.gender}
              </Badge>
            </div>
          </div>
        </DialogHeader>
        
        <div className="mt-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="body-map">Body Map</TabsTrigger>
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
            </TabsList>
            
            <TabsContent value="body-map" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <div className="border rounded-lg overflow-hidden bg-muted/20 p-4">
                    <BodyMap 
                      markers={markers}
                      onSelectMarker={setSelectedMarker}
                      onAddMarker={handleAddMarker}
                    />
                  </div>
                  <div className="mt-4 text-sm text-muted-foreground">
                    <p>Click on a body region to add a new condition marker. Click on existing markers to edit details.</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {selectedMarker ? (
                    <div className="border rounded-lg p-4 space-y-4">
                      <div>
                        <h3 className="font-medium flex items-center gap-2">
                          <span className={`w-3 h-3 rounded-full ${getSeverityColor(selectedMarker.severity)}`}></span>
                          {selectedMarker.bodyPart}
                        </h3>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <Clock className="h-3 w-3" /> 
                          Added: {selectedMarker.timestamp.toLocaleString()}
                        </p>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Diagnosis</label>
                        <Input 
                          value={selectedMarker.diagnosis} 
                          onChange={(e) => handleUpdateMarker(selectedMarker.id, { diagnosis: e.target.value })} 
                          placeholder="Enter diagnosis"
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Severity</label>
                        <Select 
                          value={selectedMarker.severity} 
                          onValueChange={(value: "low" | "moderate" | "high") => 
                            handleUpdateMarker(selectedMarker.id, { severity: value })
                          }
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select severity" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="moderate">Moderate</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Notes</label>
                        <Textarea 
                          value={selectedMarker.notes} 
                          onChange={(e) => handleUpdateMarker(selectedMarker.id, { notes: e.target.value })}
                          placeholder="Enter clinical notes"
                          className="mt-1"
                          rows={3}
                        />
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="chronic"
                          checked={selectedMarker.chronic}
                          onChange={(e) => handleUpdateMarker(selectedMarker.id, { chronic: e.target.checked })}
                        />
                        <label htmlFor="chronic" className="text-sm">Chronic condition</label>
                      </div>
                      
                      {selectedMarker.chronic && (
                        <div>
                          <label className="text-sm font-medium">Follow-up Date</label>
                          <Input 
                            type="date" 
                            value={selectedMarker.followUp ? new Date(selectedMarker.followUp).toISOString().split('T')[0] : ''}
                            onChange={(e) => {
                              const date = e.target.value ? new Date(e.target.value) : null;
                              handleUpdateMarker(selectedMarker.id, { followUp: date });
                            }}
                            className="mt-1"
                          />
                        </div>
                      )}
                      
                      <div className="flex justify-between pt-2">
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteMarker(selectedMarker.id)}
                        >
                          Delete
                        </Button>
                        <Button 
                          variant="default"
                          size="sm"
                          onClick={() => setSelectedMarker(null)}
                        >
                          Done
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="border rounded-lg p-4 text-center py-8">
                      <AlertCircle className="h-10 w-10 mx-auto text-muted-foreground" />
                      <p className="mt-2">Select a body region or marker to see details</p>
                    </div>
                  )}
                  
                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-2">Condition Markers</h3>
                    {markers.length > 0 ? (
                      <div className="space-y-2">
                        {markers.map(marker => (
                          <div 
                            key={marker.id}
                            className="flex items-center justify-between p-2 border rounded-md hover:bg-muted/20 cursor-pointer"
                            onClick={() => setSelectedMarker(marker)}
                          >
                            <div className="flex items-center gap-2">
                              <span className={`w-3 h-3 rounded-full ${getSeverityColor(marker.severity)}`}></span>
                              <span>{marker.bodyPart}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{marker.diagnosis || "Undiagnosed"}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No conditions documented</p>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="summary" className="mt-4">
              <div className="border rounded-lg p-4">
                <div className="flex justify-between mb-4 items-center">
                  <h3 className="font-medium">AI-Generated Chart Summary</h3>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsEditingSummary(!isEditingSummary)}
                    >
                      {isEditingSummary ? "View" : "Edit"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRegenerateSummary}
                      disabled={isGeneratingSummary}
                    >
                      Regenerate
                    </Button>
                  </div>
                </div>
                
                {isGeneratingSummary ? (
                  <div className="min-h-[300px] flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                      <p className="text-sm text-muted-foreground">Generating AI summary...</p>
                    </div>
                  </div>
                ) : isEditingSummary ? (
                  <Textarea 
                    value={chartSummary}
                    onChange={(e) => setChartSummary(e.target.value)}
                    className="min-h-[300px] font-mono text-sm"
                  />
                ) : (
                  <pre className="whitespace-pre-wrap font-mono text-sm bg-muted/20 p-4 rounded-md min-h-[300px]">
                    {chartSummary || "No chart summary available. Add conditions to generate a summary."}
                  </pre>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="images" className="mt-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-4">Patient Images</h3>
                
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="mt-2">Drag and drop images or click to upload</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Supported formats: JPEG, PNG, HEIC
                  </p>
                  <Input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    id="image-upload"
                    onChange={handleFileUpload}
                  />
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => document.getElementById('image-upload')?.click()}
                  >
                    Select Files
                  </Button>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-sm font-medium mb-2">Uploaded Images</h4>
                  <p className="text-sm text-muted-foreground">No images have been uploaded for this patient.</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="flex justify-between mt-4 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={handleSaveChart} className="bg-primary">
            <Save className="mr-2 h-4 w-4" />
            Save Chart
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PatientChartDialog;
