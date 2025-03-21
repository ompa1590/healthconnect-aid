
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, FileText, Calendar, Phone, Pill, Stethoscope, AlertCircle, Shield, Users } from "lucide-react";
import { useState } from "react";
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
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

const ProviderPatients = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [recordsOpen, setRecordsOpen] = useState(false);

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

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
        <Input
          placeholder="Search patients..."
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {patients.map((patient) => (
          <div 
            key={patient.id} 
            className="bg-background rounded-lg border border-border/30 p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-medium text-lg">{patient.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {patient.age} years • {patient.gender}
                </p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {patient.conditions.map((condition, index) => (
                    <span 
                      key={index} 
                      className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded-full"
                    >
                      {condition}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">
                  <Phone className="mr-2 h-4 w-4" />
                  Call
                </Button>
                <Button variant="outline" size="sm">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleOpenRecords(patient)}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Records
                </Button>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-border/30 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>Last visit:</span>
                <span className="font-medium">{patient.lastVisit}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Patient Records Sheet */}
      {selectedPatient && (
        <Sheet open={recordsOpen} onOpenChange={setRecordsOpen}>
          <SheetContent className="sm:max-w-2xl overflow-y-auto">
            <SheetHeader className="pb-4">
              <SheetTitle className="text-2xl flex items-center">
                <Stethoscope className="mr-2 h-5 w-5 text-primary" />
                {selectedPatient.name}'s Medical Record
              </SheetTitle>
              <SheetDescription>
                {selectedPatient.age} years • {selectedPatient.gender} • Last visit: {selectedPatient.lastVisit}
              </SheetDescription>
            </SheetHeader>
            
            {/* Tabbed Medical Record */}
            <Tabs defaultValue="overview" className="mt-4">
              <TabsList className="w-full grid grid-cols-3 lg:grid-cols-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="medications">Medications</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
                <TabsTrigger value="consultations">Consultations</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="family">Family</TabsTrigger>
              </TabsList>
              
              {/* Overview Tab */}
              <TabsContent value="overview" className="mt-4 space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <AlertCircle className="mr-2 h-4 w-4 text-red-500" />
                      Conditions & Allergies
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">Active Conditions</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedPatient.conditions.map((condition, index) => (
                          <span 
                            key={index} 
                            className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded-full"
                          >
                            {condition}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">Allergies</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedPatient.allergies.length > 0 ? (
                          selectedPatient.allergies.map((allergy, index) => (
                            <span 
                              key={index} 
                              className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full"
                            >
                              {allergy}
                            </span>
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
                      <div key={index} className="mb-4 pb-4 border-b last:border-0 last:mb-0 last:pb-0">
                        <div className="flex justify-between mb-2">
                          <h4 className="font-medium">{consultation.date}</h4>
                          <span className="text-sm text-muted-foreground">{consultation.reason}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div>
                            <h5 className="text-sm font-medium text-muted-foreground">Diagnosis</h5>
                            <p className="text-sm">{consultation.diagnosis}</p>
                          </div>
                          <div>
                            <h5 className="text-sm font-medium text-muted-foreground">Treatment</h5>
                            <p className="text-sm">{consultation.treatment}</p>
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
                <Button>Close</Button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
};

export default ProviderPatients;
