
-- Create a table for appointments
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID NOT NULL,
  patient_id UUID,
  patient_name TEXT NOT NULL,
  patient_email TEXT NOT NULL,
  service_type TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TEXT NOT NULL,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'upcoming',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow providers to view their appointments
CREATE POLICY "Providers can view their appointments" ON public.appointments
  FOR SELECT
  USING (auth.uid() = provider_id);

-- Create a policy to allow patients to view their appointments
CREATE POLICY "Patients can view their appointments" ON public.appointments
  FOR SELECT
  USING (auth.uid() = patient_id);

-- Create a policy to allow patients to create appointments
CREATE POLICY "Patients can create appointments" ON public.appointments
  FOR INSERT
  WITH CHECK (true);

-- Create a policy to allow providers to update their appointments
CREATE POLICY "Providers can update their appointments" ON public.appointments
  FOR UPDATE
  USING (auth.uid() = provider_id);
