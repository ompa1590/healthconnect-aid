export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_date: string
          appointment_time: string
          created_at: string | null
          doctor_name: string | null
          id: string
          patient_email: string
          patient_id: string | null
          patient_name: string
          provider_id: string
          reason: string | null
          service_name: string | null
          service_type: string
          status: string
          updated_at: string | null
        }
        Insert: {
          appointment_date: string
          appointment_time: string
          created_at?: string | null
          doctor_name?: string | null
          id?: string
          patient_email: string
          patient_id?: string | null
          patient_name: string
          provider_id: string
          reason?: string | null
          service_name?: string | null
          service_type: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          appointment_date?: string
          appointment_time?: string
          created_at?: string | null
          doctor_name?: string | null
          id?: string
          patient_email?: string
          patient_id?: string | null
          patient_name?: string
          provider_id?: string
          reason?: string | null
          service_name?: string | null
          service_type?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_appointments_patient_id"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_history: {
        Row: {
          allergies: string[] | null
          conditions: string[] | null
          created_at: string
          id: string
          medications: string[] | null
          past_treatments: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          allergies?: string[] | null
          conditions?: string[] | null
          created_at?: string
          id?: string
          medications?: string[] | null
          past_treatments?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          allergies?: string[] | null
          conditions?: string[] | null
          created_at?: string
          id?: string
          medications?: string[] | null
          past_treatments?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "medical_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      prescription_requests: {
        Row: {
          created_at: string
          id: string
          patient_id: string
          prescription_id: string
          reason: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          patient_id: string
          prescription_id: string
          reason: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          patient_id?: string
          prescription_id?: string
          reason?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "prescription_requests_prescription_id_fkey"
            columns: ["prescription_id"]
            isOneToOne: false
            referencedRelation: "prescriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      prescriptions: {
        Row: {
          created_at: string
          dosage: string
          end_date: string | null
          frequency: string
          id: string
          instructions: string
          medication_name: string
          patient_id: string
          provider_id: string
          start_date: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          dosage: string
          end_date?: string | null
          frequency: string
          id?: string
          instructions: string
          medication_name: string
          patient_id: string
          provider_id: string
          start_date: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          dosage?: string
          end_date?: string | null
          frequency?: string
          id?: string
          instructions?: string
          medication_name?: string
          patient_id?: string
          provider_id?: string
          start_date?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          data_consent: boolean | null
          date_of_birth: string | null
          email: string | null
          emergency_contact: string | null
          family_doctor: string | null
          health_card_number: string | null
          id: string
          name: string | null
          phone: string | null
          province: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_consent?: boolean | null
          date_of_birth?: string | null
          email?: string | null
          emergency_contact?: string | null
          family_doctor?: string | null
          health_card_number?: string | null
          id: string
          name?: string | null
          phone?: string | null
          province?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_consent?: boolean | null
          date_of_birth?: string | null
          email?: string | null
          emergency_contact?: string | null
          family_doctor?: string | null
          health_card_number?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          province?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      provider_profiles: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          availability: Json | null
          biography: string | null
          city: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string | null
          first_name: string | null
          gender: string | null
          id: string
          landmark: string | null
          last_name: string | null
          phone_number: string | null
          provider_type: string | null
          registration_expiry: string | null
          registration_number: string | null
          specializations: string[] | null
          state: string | null
          updated_at: string | null
          zip_code: string | null
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          availability?: Json | null
          biography?: string | null
          city?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          first_name?: string | null
          gender?: string | null
          id: string
          landmark?: string | null
          last_name?: string | null
          phone_number?: string | null
          provider_type?: string | null
          registration_expiry?: string | null
          registration_number?: string | null
          specializations?: string[] | null
          state?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          availability?: Json | null
          biography?: string | null
          city?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          first_name?: string | null
          gender?: string | null
          id?: string
          landmark?: string | null
          last_name?: string | null
          phone_number?: string | null
          provider_type?: string | null
          registration_expiry?: string | null
          registration_number?: string | null
          specializations?: string[] | null
          state?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      user_documents: {
        Row: {
          document_name: string | null
          document_path: string
          document_summary: string | null
          document_type: string | null
          id: string
          summary_verified: boolean | null
          uploaded_at: string
          user_id: string
        }
        Insert: {
          document_name?: string | null
          document_path: string
          document_summary?: string | null
          document_type?: string | null
          id?: string
          summary_verified?: boolean | null
          uploaded_at?: string
          user_id: string
        }
        Update: {
          document_name?: string | null
          document_path?: string
          document_summary?: string | null
          document_type?: string | null
          id?: string
          summary_verified?: boolean | null
          uploaded_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
