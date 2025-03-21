
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Clock, 
  Video, 
  User,
  ClipboardList
} from "lucide-react";
import { format } from "date-fns";

interface AppointmentCardProps {
  count: number;
  title: string;
  icon: React.ReactNode;
  color?: string;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ 
  count, 
  title, 
  icon,
  color = "bg-blue-50" 
}) => {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-6 flex justify-between items-center">
        <div>
          <h3 className="text-sm text-gray-600 font-medium mb-1">{title}</h3>
          <p className="text-3xl font-bold">{count}</p>
        </div>
        <div className={`${color} p-3 rounded-md`}>
          {icon}
        </div>
      </CardContent>
    </Card>
  );
};

interface Appointment {
  id: number;
  type: string;
  patientId: string;
  patientName: string;
  date: Date;
  startTime: string;
  endTime: string;
  appointmentType: "video";
}

interface DashboardOverviewProps {
  todaysAppointments: Appointment[];
  recentPatients: any[];
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  todaysAppointments,
  recentPatients
}) => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Welcome, Dr. Provider</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <AppointmentCard
          count={16}
          title="Total Appointments"
          icon={<Calendar className="h-6 w-6 text-blue-500" />}
          color="bg-blue-50"
        />
        <AppointmentCard
          count={8}
          title="Upcoming Appointments"
          icon={<Clock className="h-6 w-6 text-green-500" />}
          color="bg-green-50"
        />
        <AppointmentCard
          count={8}
          title="Completed Appointments"
          icon={<ClipboardList className="h-6 w-6 text-purple-500" />}
          color="bg-purple-50"
        />
        <AppointmentCard
          count={0}
          title="Follow-Up Appointments"
          icon={<Calendar className="h-6 w-6 text-amber-500" />}
          color="bg-amber-50"
        />
        <AppointmentCard
          count={0}
          title="Extension Requests"
          icon={<ClipboardList className="h-6 w-6 text-rose-500" />}
          color="bg-rose-50"
        />
      </div>
      
      {/* Today's Appointments */}
      <Card className="shadow-sm">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Today's Appointments</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Upcoming</Button>
              <Button variant="ghost" size="sm">Completed</Button>
            </div>
          </div>
        </div>
        <CardContent className="p-0">
          {todaysAppointments.length > 0 ? (
            <div className="divide-y">
              {todaysAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center text-sky-600">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">{appointment.type}</h3>
                      <p className="text-sm text-gray-500">{appointment.patientId} - {appointment.patientName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>{format(appointment.date, 'MMMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>{appointment.startTime} - {appointment.endTime}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Video className="h-4 w-4" />
                      <span>Video Call</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">Visit Reason</Button>
                    <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600">Cancel</Button>
                    <Button size="sm" className="bg-cyan-500 hover:bg-cyan-600">
                      <Video className="h-4 w-4 mr-1" />
                      Join Call
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-gray-500">
              No appointments scheduled for today
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Recent Patients & Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Patients */}
        <Card className="shadow-sm">
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Patients</h2>
            <Button variant="link" size="sm">View All</Button>
          </div>
          <CardContent className="p-0">
            {recentPatients.length > 0 ? (
              <div className="divide-y">
                {recentPatients.map((patient) => (
                  <div key={patient.id} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-medium">
                        {patient.initials}
                      </div>
                      <div>
                        <h3 className="font-medium">{patient.name}</h3>
                        <p className="text-xs text-gray-500">{patient.patientId}</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-600">
                      {patient.specialty}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-gray-500">
                No recent patients
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Your Schedule Today */}
        <Card className="shadow-sm">
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="text-lg font-semibold">Your Schedule Today</h2>
            <Button variant="link" size="sm">Set Availability</Button>
          </div>
          <CardContent className="p-0">
            <div className="divide-y">
              <div className="flex items-center p-4">
                <div className="w-16 text-center">
                  <p className="text-sm font-medium text-cyan-500">06:00</p>
                </div>
                <div className="flex-1 ml-4">
                  <p className="font-medium">Specialist consultation</p>
                  <p className="text-sm text-gray-500">Sarah Johnson</p>
                </div>
                <Button variant="outline" size="sm" className="bg-cyan-500 text-white hover:bg-cyan-600 border-0">Join</Button>
              </div>
              <div className="flex items-center p-4">
                <div className="w-16 text-center">
                  <p className="text-sm font-medium text-cyan-500">03:00</p>
                </div>
                <div className="flex-1 ml-4">
                  <p className="font-medium">Psychiatry consultation</p>
                  <p className="text-sm text-gray-500">Michael Chen</p>
                </div>
                <Button variant="outline" size="sm" className="bg-cyan-500 text-white hover:bg-cyan-600 border-0">Join</Button>
              </div>
              <div className="flex items-center p-4">
                <div className="w-16 text-center">
                  <p className="text-sm font-medium text-cyan-500">05:00</p>
                </div>
                <div className="flex-1 ml-4">
                  <p className="font-medium">Family Planning counseling</p>
                  <p className="text-sm text-gray-500">Emma Williams</p>
                </div>
                <Button variant="outline" size="sm" className="bg-cyan-500 text-white hover:bg-cyan-600 border-0">Join</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
