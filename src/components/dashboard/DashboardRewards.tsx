
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Gift, Award, Calendar, Star, Shield, Zap } from "lucide-react";

const DashboardRewards = () => {
  const rewards = [{
    title: "Free Consultation",
    description: "Complete 3 appointments to earn a free consultation",
    progress: 66,
    icon: Calendar,
    color: "primary"
  }, {
    title: "Premium Membership",
    description: "Earn premium status after 10 completed visits",
    progress: 40,
    icon: Award,
    color: "secondary"
  }, {
    title: "Referral Bonus",
    description: "Refer a friend and get $20 off your next visit",
    progress: 0,
    icon: Gift,
    color: "accent"
  }];
  
  const achievements = [{
    title: "First Appointment",
    description: "Completed your first virtual appointment",
    icon: Star,
    unlocked: true
  }, {
    title: "Profile Complete",
    description: "Filled out your entire medical profile",
    icon: Shield,
    unlocked: true
  }, {
    title: "Regular Check-up",
    description: "Scheduled 3 consecutive monthly check-ups",
    icon: Zap,
    unlocked: false
  }];
  
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-medium mb-6">Your Rewards & Achievements</h2>
        
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          {rewards.map((reward, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-full bg-${reward.color}/10 flex items-center justify-center`}>
                    <reward.icon className={`h-5 w-5 text-${reward.color}`} />
                  </div>
                  <h3 className="font-medium">{reward.title}</h3>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4">{reward.description}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{reward.progress}%</span>
                  </div>
                  <Progress value={reward.progress} className="h-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-medium mb-4">Achievements</h3>
        
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {achievements.map((achievement, index) => (
            <Card key={index} className={`${achievement.unlocked ? "bg-muted/20" : "bg-muted/5 opacity-70"}`}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full ${achievement.unlocked ? "bg-primary/10" : "bg-muted/30"} flex items-center justify-center`}>
                  <achievement.icon className={`h-5 w-5 ${achievement.unlocked ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <div>
                  <h4 className="font-medium">{achievement.title}</h4>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardRewards;
