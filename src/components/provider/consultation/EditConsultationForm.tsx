
import React from "react";
import { useForm } from "react-hook-form";
import { AlertCircle, CalendarClock, Check, ListChecks, Pill, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import PatientHeader from "./PatientHeader";

interface ConsultationFormData {
  condition: string;
  diagnosis: string;
  recommendations: string;
  medications: string;
  followUp: string;
  acknowledgment: boolean;
}

interface EditConsultationFormProps {
  initialData: ConsultationFormData;
  onCancel: () => void;
  onSubmit: (data: ConsultationFormData) => void;
  isSaving: boolean;
  legalText: string;
  patient: {
    name: string;
    id: string;
  };
  appointment: {
    date: Date;
    time: string;
  };
  doctor: {
    name: string;
    specialty: string;
  };
}

const EditConsultationForm: React.FC<EditConsultationFormProps> = ({
  initialData,
  onCancel,
  onSubmit,
  isSaving,
  legalText,
  patient,
  appointment,
  doctor,
}) => {
  const form = useForm<ConsultationFormData>({
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <PatientHeader
          patient={patient}
          appointment={appointment}
          doctor={doctor}
        />

        {/* Edit Condition */}
        <FormField
          control={form.control}
          name="condition"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                Presenting Condition
              </FormLabel>
              <FormControl>
                <Textarea {...field} className="min-h-[100px]" />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Edit Diagnosis */}
        <FormField
          control={form.control}
          name="diagnosis"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-blue-500" />
                Diagnosis
              </FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Edit Recommendations */}
        <FormField
          control={form.control}
          name="recommendations"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium flex items-center gap-2">
                <ListChecks className="h-4 w-4 text-green-500" />
                Recommendations (one per line)
              </FormLabel>
              <FormControl>
                <Textarea {...field} className="min-h-[100px]" />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Edit Medications */}
        <FormField
          control={form.control}
          name="medications"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium flex items-center gap-2">
                <Pill className="h-4 w-4 text-indigo-500" />
                Medications (one per line, format: Name, Dosage, Notes)
              </FormLabel>
              <FormControl>
                <Textarea {...field} className="min-h-[100px]" />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Edit Follow-up */}
        <FormField
          control={form.control}
          name="followUp"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium flex items-center gap-2">
                <CalendarClock className="h-4 w-4 text-primary" />
                Follow-up Instructions
              </FormLabel>
              <FormControl>
                <Textarea {...field} className="min-h-[80px]" />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Acknowledgment */}
        <FormField
          control={form.control}
          name="acknowledgment"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 border-t pt-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="mt-1"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm">
                  {legalText}
                </FormLabel>
              </div>
            </FormItem>
          )}
        />

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSaving}
          >
            Cancel Edits
          </Button>
          <Button
            type="submit"
            disabled={isSaving}
          >
            {isSaving ? (
              <>Saving...</>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Confirm & Finalize
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditConsultationForm;
