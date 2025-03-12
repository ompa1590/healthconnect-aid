
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, FileText, Calendar, Phone } from "lucide-react";

const ProviderPatients = () => {
  const patients = [
    {
      id: 1,
      name: "Emily Johnson",
      age: 34,
      gender: "Female",
      lastVisit: "2024-03-15",
      conditions: ["Hypertension", "Anxiety"],
      phone: "555-123-4567",
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      age: 52,
      gender: "Male",
      lastVisit: "2024-03-10",
      conditions: ["Type 2 Diabetes", "High Cholesterol"],
      phone: "555-987-6543",
    },
    {
      id: 3,
      name: "Sarah Parker",
      age: 28,
      gender: "Female",
      lastVisit: "2024-03-05",
      conditions: ["Migraine", "Allergies"],
      phone: "555-456-7890",
    },
    {
      id: 4,
      name: "David Thompson",
      age: 45,
      gender: "Male",
      lastVisit: "2024-02-28",
      conditions: ["Back Pain", "Insomnia"],
      phone: "555-234-5678",
    },
  ];

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
                <Button variant="outline" size="sm">
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
    </div>
  );
};

export default ProviderPatients;
