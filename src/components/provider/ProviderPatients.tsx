import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, FileText, Calendar, Phone, Pill, Stethoscope, AlertCircle, Shield, Users, Clock, Calendar as CalendarIcon, BarChart } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetClose
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GlassCard } from "@/components/ui/GlassCard";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import SummaryDialog from "../dashboard/health-records/SummaryDialog";
import { format } from "date-fns";
import PatientChartDialog from "./PatientChartDialog";

const ProviderPatients = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [recordsOpen, setRecordsOpen] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [consultationNotesOpen, setConsultationNotesOpen] = useState(false);
  const [chartDialogOpen, setChartDialogOpen] = useState(false);
  const [patientForCharting, setPatientForCharting] = useState(null);

  const patients = [
    {
      id: 1,
      name: "Emily Johnson",
      age: 34,
      gender: "Female",
      lastVisit: "2024-03-15",
      conditions: ["Hypertension", "Anxiety"],
      phone: "555-123-4567",
      medications: [
        { name: "Lisinopril", dosage: "10mg", frequency: "Once daily", active: true },
        { name: "Lexapro", dosage: "10mg", frequency: "Once daily", active: true },
        { name: "Ambien", dosage: "5mg", frequency: "As needed", active: false }
      ],
      allergies: ["Penicillin", "Sulfa drugs"],
      vaccinations: [
        { name: "COVID-19", date: "2023-06-10" },
        { name: "Flu", date: "2023-10-15" },
        { name: "Tdap", date: "2019-03-22" }
      ],
      medicalReports: [
        { name: "Blood Work", date: "2024-02-10", type: "Lab", notes: "Cholesterol slightly elevated" },
        { name: "ECG", date: "2023-11-05", type: "Diagnostic", notes: "Normal sinus rhythm" },
        { name: "Chest X-ray", date: "2023-08-15", type: "Imaging", notes: "Clear, no abnormalities" }
      ],
      consultations: [
        { date: "2024-03-15", reason: "Medication review", diagnosis: "Controlled hypertension", treatment: "Continue current medications" },
        { date: "2024-01-22", reason: "Anxiety symptoms", diagnosis: "Generalized anxiety disorder", treatment: "Therapy and medication adjustment" },
        { date: "2023-11-05", reason: "Annual checkup", diagnosis: "Healthy with controlled conditions", treatment: "Routine monitoring" }
      ],
      surgicalHistory: [
        { procedure: "Appendectomy", date: "2010-05-18", hospital: "Memorial Hospital" }
      ],
      familyHistory: [
        "Father: Heart disease",
        "Mother: Breast cancer",
        "Maternal grandmother: Type 2 diabetes"
      ]
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      age: 52,
      gender: "Male",
      lastVisit: "2024-03-10",
      conditions: ["Type 2 Diabetes", "High Cholesterol"],
      phone: "555-987-6543",
      medications: [
        { name: "Metformin", dosage: "1000mg", frequency: "Twice daily", active: true },
        { name: "Lipitor", dosage: "40mg", frequency: "Once daily", active: true },
        { name: "Glipizide", dosage: "5mg", frequency: "Once daily", active: false }
      ],
      allergies: ["Shellfish", "Ibuprofen"],
      vaccinations: [
        { name: "COVID-19", date: "2023-05-20" },
        { name: "Flu", date: "2023-10-05" },
        { name: "Pneumonia", date: "2022-11-10" }
      ],
      medicalReports: [
        { name: "HbA1c", date: "2024-02-15", type: "Lab", notes: "7.2%, improved from last reading" },
        { name: "Lipid Panel", date: "2024-02-15", type: "Lab", notes: "LDL still elevated" },
        { name: "Foot Exam", date: "2024-01-08", type: "Examination", notes: "No ulcers or neuropathy" }
      ],
      consultations: [
        { date: "2024-03-10", reason: "Diabetes management", diagnosis: "Type 2 diabetes - improving control", treatment: "Diet counseling and medication continuation" },
        { date: "2024-01-25", reason: "High cholesterol follow-up", diagnosis: "Hyperlipidemia", treatment: "Increased statin dosage" },
        { date: "2023-12-05", reason: "Routine follow-up", diagnosis: "Stable diabetes", treatment: "Continue current regimen" }
      ],
      surgicalHistory: [
        { procedure: "Knee arthroscopy", date: "2018-09-12", hospital: "University Medical Center" }
      ],
      familyHistory: [
        "Father: Type 2 diabetes, heart disease",
        "Mother: Hypertension",
        "Brother: Type 2 diabetes"
      ]
    },
    {
      id: 3,
      name: "Sarah Parker",
      age: 28,
      gender: "Female",
      lastVisit: "2024-03-05",
      conditions: ["Migraine", "Allergies"],
      phone: "555-456-7890",
      medications: [
        { name: "Sumatriptan", dosage: "50mg", frequency: "As needed", active: true },
        { name: "Cetirizine", dosage: "10mg", frequency: "Once daily", active: true }
      ],
      allergies: ["Dust mites", "Pollen", "Amoxicillin"],
      vaccinations: [
        { name: "COVID-19", date: "2023-07-15" },
        { name: "Flu", date: "2023-10-20" },
        { name: "HPV", date: "2016-04-10" }
      ],
      medicalReports: [
        { name: "Allergy Testing", date: "2023-08-22", type: "Lab", notes: "Positive for multiple environmental allergens" },
        { name: "MRI Brain", date: "2023-05-10", type: "Imaging", notes: "No structural abnormalities" }
      ],
      consultations: [
        { date: "2024-03-05", reason: "Migraine frequency increase", diagnosis: "Chronic migraine", treatment: "Trigger avoidance, medication adjustment" },
        { date: "2023-10-15", reason: "Seasonal allergies", diagnosis: "Allergic rhinitis", treatment: "Antihistamines and nasal spray" },
        { date: "2023-05-10", reason: "Severe headache", diagnosis: "Migraine without aura", treatment: "Prescription for sumatriptan" }
      ],
      surgicalHistory: [],
      familyHistory: [
        "Mother: Migraines",
        "Maternal aunt: Allergies and asthma"
      ]
    },
    {
      id: 4,
      name: "David Thompson",
      age: 45,
      gender: "Male",
      lastVisit: "2024-02-28",
      conditions: ["Back Pain", "Insomnia"],
      phone: "555-234-5678",
      medications: [
        { name: "Cyclobenzaprine", dosage: "10mg", frequency: "As needed", active: true },
        { name: "Trazodone", dosage: "50mg", frequency: "At bedtime", active: true },
        { name: "Ibuprofen", dosage: "800mg", frequency: "As needed", active: false }
      ],
      allergies: [],
      vaccinations: [
        { name: "COVID-19", date: "2023-05-05" },
        { name: "Flu", date: "2023-11-01" },
        { name: "Tetanus", date: "2020-01-15" }
      ],
      medicalReports: [
        { name: "Lumbar Spine MRI", date: "2023-10-10", type: "Imaging", notes: "Mild disc degeneration L4-L5" },
        { name: "Sleep Study", date: "2023-07-20", type: "Diagnostic", notes: "Confirmed insomnia, no sleep apnea" }
      ],
      consultations: [
        { date: "2024-02-28", reason: "Back pain follow-up", diagnosis: "Chronic lumbar strain", treatment: "Physical therapy and muscle relaxants" },
        { date: "2023-12-15", reason: "Sleep issues", diagnosis: "Primary insomnia", treatment: "Sleep hygiene counseling and medication" },
        { date: "2023-10-05", reason: "Acute back pain", diagnosis: "Lumbar strain", treatment: "Rest, medication, and physical therapy referral" }
      ],
      surgicalHistory: [
        { procedure: "Shoulder arthroscopy", date: "2015-03-10", hospital: "Sports Medicine Center" }
      ],
      familyHistory: [
        "Father: Arthritis",
        "Mother: Healthy",
        "Brother: Back problems"
      ]
    },
  ];

  const handleOpenRecords = (patient) => {
    setSelectedPatient(patient);
    setRecordsOpen(true);
  };

  const handleOpenConsultationNotes = (consultation) => {
    setSelectedConsultation(consultation);
    setConsultationNotesOpen(true);
  };

  const handleOpenChartDialog = (patient) => {
    setPatientForCharting(patient);
    setChartDialogOpen(true);
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), "MMM d, yyyy");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold gradient-text">My Patients</h2>
        <div className="relative max-w-md w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          <Input
            placeholder="Search patients by name or ID..."
            className="pl-10 bg-background border-border/30 focus-visible:ring-primary/30 pr-10"
          />
          <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {patients.map((patient) => (
          <GlassCard 
            key={patient.id} 
            variant="elevated"
            className="overflow-hidden hover:border-primary/30 transition-all duration-300"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12 border-2 border-primary/10">
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-primary font-medium">
                    {patient.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <h3 className="font-medium text-lg tracking-tight">{patient.name}</h3>
                  <div className="flex items-center text-sm text-muted-foreground gap-2 mt-0.5">
                    <span>{patient.age} years</span>
                    <span className="inline-block w-1 h-1 rounded-full bg-muted-foreground/50"></span>
                    <span>{patient.gender}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {patient.conditions.map((condition, index) => (
                      <Badge 
                        key={index} 
                        variant="outline"
                        className="bg-primary/5 text-primary border-primary/20 hover:bg-primary/10 font-normal text-xs px-2.5 py-0.5"
                      >
                        {condition}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-background border-secondary/20 text-secondary hover:bg-secondary/5 hover:border-secondary/40 shadow-sm"
                  onClick={() => handleOpenChartDialog(patient)}
                >
                  <BarChart className="mr-2 h-4 w-4" />
                  Chart
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-background border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/40 shadow-sm"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Call
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-background border-secondary/20 text-secondary hover:bg-secondary/5 hover:border-secondary/40 shadow-sm"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-background border-medical/20 text-medical hover:bg-medical/5 hover:border-medical/40 shadow-sm"
                  onClick={() => handleOpenRecords(patient)}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Records
                </Button>
              </div>
            </div>
            
            <div className="mt-4 pt-3 border-t border-border/30 flex justify-between items-center">
              <div className="flex items-center text-sm">
                <CalendarIcon className="h-4 w-4 text-muted-foreground mr-1.5" />
                <span className="text-muted-foreground mr-1.5">Last visit:</span>
                <span className="font-medium">{formatDate(patient.lastVisit)}</span>
              </div>
              <Badge 
                variant="outline" 
                className="bg-wellness/10 text-wellness border-wellness/30"
              >
                Active Patient
              </Badge>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Patient Records Sheet */}
      {selectedPatient && (
        <Sheet open={recordsOpen} onOpenChange={setRecordsOpen}>
          <SheetContent className="sm:max-w-2xl overflow-y-auto">
            <SheetHeader className="pb-4 border-b mb-6">
              <SheetTitle className="text-2xl flex items-center gradient-text">
                <Stethoscope className="mr-2 h-5 w-5 text-primary" />
                {selectedPatient.name}'s Medical Record
              </SheetTitle>
              <SheetDescription className="flex items-center gap-2">
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                  {selectedPatient.age} years 
                </Badge>
                <Badge variant="outline" className="bg-secondary/5 text-secondary border-secondary/20">
                  {selectedPatient.gender}
                </Badge>
                <Badge variant="outline" className="bg-medical/5 text-medical border-medical/20 flex items-center">
                  <Clock className="mr-1 h-3 w-3" />
                  Last visit: {formatDate(selectedPatient.lastVisit)}
                </Badge>
              </SheetDescription>
            </SheetHeader>
            
            {/* Tabbed Medical Record */}
            <Tabs defaultValue="overview" className="mt-4">
              <TabsList className="w-full grid grid-cols-3 lg:grid-cols-6 bg-muted/50 p-1 rounded-lg">
                <TabsTrigger value="overview" className="font-medium text-sm">Overview</TabsTrigger>
                <TabsTrigger value="medications" className="font-medium text-sm">Medications</TabsTrigger>
                <TabsTrigger value="reports" className="font-medium text-sm">Reports</TabsTrigger>
                <TabsTrigger value="consultations" className="font-medium text-sm">Consultations</TabsTrigger>
                <TabsTrigger value="history" className="font-medium text-sm">History</TabsTrigger>
                <TabsTrigger value="family" className="font-medium text-sm">Family</TabsTrigger>
              </TabsList>
              
              {/* Overview Tab */}
              <TabsContent value="overview" className="mt-6 space-y-6">
                <Card className="overflow-hidden border-border/30 shadow-sm">
                  <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 via-primary/10 to-transparent">
                    <CardTitle className="text-lg flex items-center">
                      <AlertCircle className="mr-2 h-4 w-4 text-red-500" />
                      Conditions & Allergies
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4">
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">Active Conditions</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedPatient.conditions.map((condition, index) => (
                          <Badge 
                            key={index} 
                            variant="outline"
                            className="bg-primary/5 text-primary border-primary/20 hover:bg-primary/10"
                          >
                            {condition}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">Allergies</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedPatient.allergies.length > 0 ? (
                          selectedPatient.allergies.map((allergy, index) => (
                            <Badge 
                              key={index} 
                              variant="outline"
                              className="bg-destructive/5 text-destructive border-destructive/20 hover:bg-destructive/10"
                            >
                              {allergy}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm">No known allergies</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Pill className="mr-2 h-4 w-4 text-blue-500" />
                      Current Medications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedPatient.medications
                        .filter(med => med.active)
                        .map((medication, index) => (
                          <div key={index} className="flex items-start gap-2 pb-2 border-b last:border-0">
                            <div className="h-2 w-2 rounded-full bg-green-500 mt-2"></div>
                            <div>
                              <div className="font-medium">{medication.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {medication.dosage} • {medication.frequency}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Shield className="mr-2 h-4 w-4 text-blue-500" />
                      Vaccinations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedPatient.vaccinations.map((vaccination, index) => (
                        <div key={index} className="flex justify-between items-center pb-2 border-b last:border-0">
                          <span className="font-medium">{vaccination.name}</span>
                          <span className="text-sm text-muted-foreground">{vaccination.date}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Medications Tab */}
              <TabsContent value="medications" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Pill className="mr-2 h-5 w-5 text-primary" />
                      Medication History
                    </CardTitle>
                    <CardDescription>Current and past medications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Status</TableHead>
                          <TableHead>Medication</TableHead>
                          <TableHead>Dosage</TableHead>
                          <TableHead>Frequency</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedPatient.medications.map((medication, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <span className={`inline-block h-2 w-2 rounded-full ${medication.active ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                              <span className="ml-2 text-xs">
                                {medication.active ? 'Active' : 'Discontinued'}
                              </span>
                            </TableCell>
                            <TableCell className="font-medium">{medication.name}</TableCell>
                            <TableCell>{medication.dosage}</TableCell>
                            <TableCell>{medication.frequency}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Medical Reports Tab */}
              <TabsContent value="reports" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="mr-2 h-5 w-5 text-primary" />
                      Medical Reports
                    </CardTitle>
                    <CardDescription>Lab results, imaging reports and diagnostics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Report Name</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Notes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedPatient.medicalReports.map((report, index) => (
                          <TableRow key={index}>
                            <TableCell>{report.date}</TableCell>
                            <TableCell className="font-medium">{report.name}</TableCell>
                            <TableCell>{report.type}</TableCell>
                            <TableCell>{report.notes}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Consultations Tab */}
              <TabsContent value="consultations" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Stethoscope className="mr-2 h-5 w-5 text-primary" />
                      Consultation History
                    </CardTitle>
                    <CardDescription>Past visits and diagnoses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {selectedPatient.consultations.map((consultation, index) => (
                      <div key={index} className="mb-6 pb-6 border-b last:border-0 last:mb-0 last:pb-0">
                        <div className="flex justify-between mb-2">
                          <h4 className="font-medium">{consultation.date}</h4>
                          <span className="text-sm text-muted-foreground">{consultation.reason}</span>
                        </div>
                        
                        {/* Provider details */}
                        <div className="mb-3 bg-muted/30 p-2 rounded-md">
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <Stethoscope className="h-3.5 w-3.5 text-primary" />
                            <span className="font-medium text-sm">Dr. Michael Chen</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            <span className="font-medium">Credentials:</span> MD, FRCPC • <span className="font-medium">Specialty:</span> {index === 0 ? "Internal Medicine" : index === 1 ? "Psychiatry" : "Family Medicine"}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                          <div>
                            <h5 className="text-sm font-medium text-muted-foreground">Diagnosis</h5>
                            <p className="text-sm">{consultation.diagnosis}</p>
                          </div>
                          <div>
                            <h5 className="text-sm font-medium text-muted-foreground">Treatment</h5>
                            <p className="text-sm">{consultation.treatment}</p>
                          </div>
                        </div>
                        
                        {/* Consultation notes section */}
                        <div className="mt-3 border-t border-border/30 pt-3">
                          <h5 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                            <FileText className="h-3.5 w-3.5 mr-1.5 text-primary" />
                            Consultation Notes
                          </h5>
                          <div className="text-sm bg-muted/20 rounded-lg p-4 relative hover:bg-muted/30 transition-colors">
                            <p className="pr-[120px] line-clamp-3">
                              {index === 0 
                                ? "Patient reports stable blood pressure readings at home. Current medication regimen appears effective. Discussed importance of regular exercise and reduced sodium intake. Patient showing good understanding of condition management."
                                : index === 1 
                                ? "Patient describes reduction in anxiety symptoms since last visit. Sleep has improved from 4-5 hours to 6-7 hours per night. Still experiencing occasional panic symptoms, particularly in crowded settings. Has been practicing breathing techniques as advised with some benefit."
                                : "Routine checkup shows all vitals within normal limits. Patient reports no new symptoms or concerns. Preventative health measures discussed including upcoming vaccinations."}
                            </p>
                            <div className="absolute top-1/2 -translate-y-1/2 right-3">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className={cn(
                                  "h-8 bg-white hover:bg-primary hover:text-white",
                                  "border border-border/50 hover:border-primary",
                                  "shadow-sm flex items-center gap-1.5"
                                )}
                                onClick={() => handleOpenConsultationNotes(consultation)}
                              >
                                <FileText className="h-3.5 w-3.5" />
                                <span className="text-xs font-medium">View Notes</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Surgical & Hospitalization History Tab */}
              <TabsContent value="history" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="mr-2 h-5 w-5 text-primary" />
                      Surgical & Hospitalization History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedPatient.surgicalHistory.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Procedure</TableHead>
                            <TableHead>Hospital</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedPatient.surgicalHistory.map((surgery, index) => (
                            <TableRow key={index}>
                              <TableCell>{surgery.date}</TableCell>
                              <TableCell className="font-medium">{surgery.procedure}</TableCell>
                              <TableCell>{surgery.hospital}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <p className="text-muted-foreground">No surgical or hospitalization history.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Family History Tab */}
              <TabsContent value="family" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="mr-2 h-5 w-5 text-primary" />
                      Family & Genetic History
                    </CardTitle>
                    <CardDescription>Hereditary conditions and risk factors</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {selectedPatient.familyHistory.length > 0 ? (
                      <ul className="space-y-2">
                        {selectedPatient.familyHistory.map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground">No family history recorded.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 text-right">
              <SheetClose asChild>
                <Button className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80">Close</Button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      )}

      {/* Consultation Notes Dialog */}
      {selectedConsultation && (
        <SummaryDialog
          open={consultationNotesOpen}
          onOpenChange={setConsultationNotesOpen}
          summary={`
Patient Visit Report - ${selectedConsultation.date}

Provider: Dr. Michael Chen, MD, FRCPC
Specialty: ${selectedConsultation.date === "2024-03-15" ? "Internal Medicine" : selectedConsultation.date === "2024-01-22" ? "Psychiatry" : "Family Medicine"}
Location: Vyra Health Clinic, Toronto

Chief Complaint: ${selectedConsultation.reason}

Subjective:
${selectedConsultation.date === "2024-03-15" 
  ? "Patient reports feeling generally well. Home blood pressure readings have been averaging 128/82 mmHg. No dizziness, headaches, or visual disturbances. Patient has been compliant with medication regimen. Reports mild stress at work but managing well with previously discussed coping strategies."
  : selectedConsultation.date === "2024-01-22" 
  ? "Patient reports improvement in anxiety symptoms since starting medication. Sleep has improved from 4-5 hours to 6-7 hours per night. Still experiencing occasional panic symptoms, particularly in crowded settings. Has been practicing breathing techniques as advised with some benefit."
  : "Patient presents for routine annual checkup. No specific complaints. Reports regular exercise 3 times per week. Diet remains balanced with occasional indulgences. Sleep patterns normal. No significant life stressors reported."}

Objective:
${selectedConsultation.date === "2024-03-15" 
  ? "BP: 130/85 mmHg, HR: 72 bpm, RR: 16, Temp: 98.6°F, SpO2: 98%\nGeneral: Alert and oriented, in no acute distress\nCVS: Regular rate and rhythm, no murmurs or gallops\nResp: Clear to auscultation bilaterally\nAbdomen: Soft, non-tender, non-distended"
  : selectedConsultation.date === "2024-01-22" 
  ? "BP: 118/75 mmHg, HR: 68 bpm, RR: 14, Temp: 98.4°F, SpO2: 99%\nGeneral: Mildly anxious but appropriate\nMSE: Mood anxious, affect congruent, thought process linear, no SI/HI, judgment intact\nNeurological: No focal deficits"
  : "BP: 120/78 mmHg, HR: 70 bpm, RR: 15, Temp: 98.5°F, SpO2: 99%\nGeneral: Well-appearing, healthy\nCVS: Regular rate and rhythm\nResp: Clear breath sounds\nAbdomen: Normal bowel sounds, non-tender\nSkin: No concerning lesions\nLymph: No lymphadenopathy"}

Assessment:
${selectedConsultation.diagnosis}

Plan:
1. ${selectedConsultation.treatment}
2. ${selectedConsultation.date === "2024-03-15" 
  ? "Continue current medication regimen with no changes. Review home blood pressure log at next visit."
  : selectedConsultation.date === "2024-01-22" 
  ? "Consider referral to psychologist for additional CBT if symptoms persist. Continue current medication with follow-up in 4 weeks."
  : "Routine bloodwork ordered including CBC, CMP, lipid panel, and HbA1c. Results to be discussed at follow-up."}
3. ${selectedConsultation.date === "2024-03-15" 
  ? "Encouraged to maintain dietary sodium restrictions and moderate exercise regimen."
  : selectedConsultation.date === "2024-01-22" 
  ? "Provided resources for local support group. Encouraged to continue mindfulness practice."
  : "Due for age-appropriate cancer screenings. Colonoscopy referral provided."}
4. Follow-up: ${selectedConsultation.date === "2024-03-15" 
  ? "Return in 3 months for blood pressure check and medication review."
  : selectedConsultation.date === "2024-01-22" 
  ? "Return in 4 weeks to assess medication efficacy and side effects."
  : "Return in 6 months or sooner if concerns arise."}

Notes signed electronically by Dr. Michael Chen, MD, FRCPC on ${selectedConsultation.date}
          `}
          onVerify={() => {
            setConsultationNotesOpen(false);
          }}
        />
      )}

      {/* Patient Chart Dialog */}
      {patientForCharting && (
        <PatientChartDialog
          open={chartDialogOpen}
          onOpenChange={setChartDialogOpen}
          patient={patientForCharting}
        />
      )}
    </div>
  );
};

export default ProviderPatients;
