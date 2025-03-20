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
  return;
};
export default DashboardRewards;