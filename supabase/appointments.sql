
-- Create appointments table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL,
  patient_id UUID,
  patient_name TEXT NOT NULL,
  patient_email TEXT NOT NULL,
  service_type TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TEXT NOT NULL,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'upcoming',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable row level security
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Clear existing policies (if any)
DROP POLICY IF EXISTS "Providers can view their appointments" ON public.appointments;
DROP POLICY IF EXISTS "Patients can view their appointments" ON public.appointments;
DROP POLICY IF EXISTS "Patients can create appointments" ON public.appointments;
DROP POLICY IF EXISTS "Providers can update their appointments" ON public.appointments;

-- Create updated policies
-- Allow providers to view appointments where they are the provider
CREATE POLICY "Providers can view their appointments" 
  ON public.appointments 
  FOR SELECT 
  USING (auth.uid() = provider_id);

-- Allow patients to view their own appointments (using patient_id directly)
CREATE POLICY "Patients can view their appointments" 
  ON public.appointments 
  FOR SELECT 
  USING (auth.uid() = patient_id OR patient_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Allow authenticated users to create appointments
CREATE POLICY "Patients can create appointments" 
  ON public.appointments 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

-- Allow providers to update their appointments
CREATE POLICY "Providers can update their appointments" 
  ON public.appointments 
  FOR UPDATE 
  USING (auth.uid() = provider_id);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_appointments_provider_id ON public.appointments(provider_id);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON public.appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(appointment_date);
