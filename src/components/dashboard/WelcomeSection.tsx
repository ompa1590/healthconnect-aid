
import { Button } from "@/components/ui/button";
import { ArrowRight, Bell, Calendar, ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";

interface WelcomeSectionProps {
  userName?: string;
}

const WelcomeSection = ({ userName = "Patient" }: WelcomeSectionProps) => {
  // Quick actions for the dashboard
  const quickActions = [
    {
      icon: <Calendar className="h-5 w-5" />,
      label: "Schedule Appointment",
      href: "/dashboard?tab=appointments",
      color: "bg-primary/10",
      textColor: "text-primary",
    },
    {
      icon: <ClipboardList className="h-5 w-5" />,
      label: "View Health Records",
      href: "/dashboard?tab=records",
      color: "bg-secondary/10",
      textColor: "text-secondary",
    },
    {
      icon: <Bell className="h-5 w-5" />,
      label: "Notifications",
      href: "/dashboard/notifications",
      color: "bg-orange-500/10",
      textColor: "text-orange-500",
      badge: 2,
    },
  ];

  return (
    <div className="mb-8">
      <div className="mb-6 bg-gradient-to-r from-secondary/20 to-secondary/10 p-6 rounded-2xl border border-secondary/20">
        <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white">
          Welcome back, {userName}
        </h1>
        <p className="text-white/90 text-lg">
          Your next appointment is on <span className="font-medium text-white">June 15th at 2:00 PM</span>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {quickActions.map((action, index) => (
          <Button
            key={index}
            variant="outline"
            className={`h-auto py-4 px-4 flex justify-between items-center border border-muted/50 ${action.color} hover:bg-muted/30`}
            asChild
          >
            <Link to={action.href}>
              <div className="flex items-center">
                <div className={`mr-3 ${action.textColor}`}>
                  {action.icon}
                </div>
                <span>{action.label}</span>
              </div>
              {action.badge ? (
                <div className="h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-medium">
                  {action.badge}
                </div>
              ) : (
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              )}
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default WelcomeSection;
