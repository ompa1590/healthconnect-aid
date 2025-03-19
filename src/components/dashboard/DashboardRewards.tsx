
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Gift, Award, Calendar, Star, Shield, Zap } from "lucide-react";

const DashboardRewards = () => {
  const rewards = [
    {
      title: "Free Consultation",
      description: "Complete 3 appointments to earn a free consultation",
      progress: 66,
      icon: Calendar,
      color: "primary",
    },
    {
      title: "Premium Membership",
      description: "Earn premium status after 10 completed visits",
      progress: 40,
      icon: Award,
      color: "secondary",
    },
    {
      title: "Referral Bonus",
      description: "Refer a friend and get $20 off your next visit",
      progress: 0,
      icon: Gift,
      color: "accent",
    }
  ];

  const achievements = [
    {
      title: "First Appointment",
      description: "Completed your first virtual appointment",
      icon: Star,
      unlocked: true,
    },
    {
      title: "Profile Complete",
      description: "Filled out your entire medical profile",
      icon: Shield,
      unlocked: true,
    },
    {
      title: "Regular Check-up",
      description: "Scheduled 3 consecutive monthly check-ups",
      icon: Zap,
      unlocked: false,
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-normal mb-6">Rewards & Achievements</h1>
      
      <div className="mb-10">
        <h2 className="text-xl font-medium mb-4">Your Rewards Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rewards.map((reward, index) => (
            <Card key={index} className="border rounded-xl shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className={`rounded-full bg-${reward.color}/10 w-10 h-10 flex items-center justify-center mr-3`}>
                    <reward.icon className={`h-5 w-5 text-${reward.color}`} />
                  </div>
                  <h3 className="font-medium">{reward.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{reward.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-medium">{reward.progress}%</span>
                  </div>
                  <Progress value={reward.progress} className="h-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <div className="mb-10">
        <h2 className="text-xl font-medium mb-4">Your Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {achievements.map((achievement, index) => (
            <Card 
              key={index} 
              className={`border rounded-xl shadow-sm ${
                !achievement.unlocked ? "opacity-60" : ""
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className={`rounded-full ${
                    achievement.unlocked ? "bg-primary/10" : "bg-muted"
                  } w-10 h-10 flex items-center justify-center mr-3`}>
                    <achievement.icon className={`h-5 w-5 ${
                      achievement.unlocked ? "text-primary" : "text-muted-foreground"
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-medium">{achievement.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {achievement.unlocked ? "Unlocked" : "Locked"}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{achievement.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <Card className="mb-8 border rounded-xl shadow-sm overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h2 className="text-xl font-medium mb-2">Invite Friends, Earn Rewards</h2>
              <p className="text-muted-foreground mb-4 md:mb-0">
                Share your referral code and both you and your friend will receive $20 off your next appointment.
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="bg-muted/20 p-4 rounded-lg text-center">
                <span className="text-sm font-medium">Your referral code</span>
                <div className="text-lg font-bold tracking-wide mt-1">VYRA2024</div>
              </div>
              <Button className="whitespace-nowrap">
                Share Code
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardRewards;
