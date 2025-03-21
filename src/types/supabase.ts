
import { Database } from '@/integrations/supabase/types';

// Define a type for Json from the Database namespace if available
export type Json = 
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// DayAvailability interface
export interface DayAvailability {
  isAvailable: boolean;
  isFullDay: boolean;
  startTime?: string;
  endTime?: string;
}

// WeeklyAvailability interface
export interface WeeklyAvailability {
  [key: string]: DayAvailability;
  monday: DayAvailability;
  tuesday: DayAvailability;
  wednesday: DayAvailability;
  thursday: DayAvailability;
  friday: DayAvailability;
  saturday: DayAvailability;
  sunday: DayAvailability;
}

// Helper function to convert WeeklyAvailability to JSON for Supabase
export const weeklyAvailabilityToJson = (availability: WeeklyAvailability): Json => {
  return availability as unknown as Json;
};

// Helper function to convert JSON from Supabase to WeeklyAvailability
export const jsonToWeeklyAvailability = (json: Json | null): WeeklyAvailability => {
  if (!json) {
    // Default availability if none exists
    return {
      monday: { isAvailable: false, isFullDay: false, startTime: "09:00", endTime: "17:00" },
      tuesday: { isAvailable: false, isFullDay: false, startTime: "09:00", endTime: "17:00" },
      wednesday: { isAvailable: false, isFullDay: false, startTime: "09:00", endTime: "17:00" },
      thursday: { isAvailable: false, isFullDay: false, startTime: "09:00", endTime: "17:00" },
      friday: { isAvailable: false, isFullDay: false, startTime: "09:00", endTime: "17:00" },
      saturday: { isAvailable: false, isFullDay: false, startTime: "09:00", endTime: "17:00" },
      sunday: { isAvailable: false, isFullDay: false, startTime: "09:00", endTime: "17:00" },
    };
  }

  const result = typeof json === 'string' ? JSON.parse(json) : json;
  
  return {
    monday: result.monday || { isAvailable: false, isFullDay: false, startTime: "09:00", endTime: "17:00" },
    tuesday: result.tuesday || { isAvailable: false, isFullDay: false, startTime: "09:00", endTime: "17:00" },
    wednesday: result.wednesday || { isAvailable: false, isFullDay: false, startTime: "09:00", endTime: "17:00" },
    thursday: result.thursday || { isAvailable: false, isFullDay: false, startTime: "09:00", endTime: "17:00" },
    friday: result.friday || { isAvailable: false, isFullDay: false, startTime: "09:00", endTime: "17:00" },
    saturday: result.saturday || { isAvailable: false, isFullDay: false, startTime: "09:00", endTime: "17:00" },
    sunday: result.sunday || { isAvailable: false, isFullDay: false, startTime: "09:00", endTime: "17:00" },
  };
};
