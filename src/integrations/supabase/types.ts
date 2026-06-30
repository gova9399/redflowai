export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      blood_requests: {
        Row: {
          blood_group: Database["public"]["Enums"]["blood_group"]
          city: string
          created_at: string
          hospital: string
          id: string
          latitude: number | null
          longitude: number | null
          notes: string | null
          patient_name: string
          status: Database["public"]["Enums"]["request_status"]
          units_needed: number
          updated_at: string
          urgency: Database["public"]["Enums"]["urgency_level"]
          user_id: string
        }
        Insert: {
          blood_group: Database["public"]["Enums"]["blood_group"]
          city: string
          created_at?: string
          hospital: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          notes?: string | null
          patient_name: string
          status?: Database["public"]["Enums"]["request_status"]
          units_needed?: number
          updated_at?: string
          urgency?: Database["public"]["Enums"]["urgency_level"]
          user_id: string
        }
        Update: {
          blood_group?: Database["public"]["Enums"]["blood_group"]
          city?: string
          created_at?: string
          hospital?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          notes?: string | null
          patient_name?: string
          status?: Database["public"]["Enums"]["request_status"]
          units_needed?: number
          updated_at?: string
          urgency?: Database["public"]["Enums"]["urgency_level"]
          user_id?: string
        }
        Relationships: []
      }
      donors: {
        Row: {
          antigen_notes: string | null
          blood_group: Database["public"]["Enums"]["blood_group"]
          city: string
          created_at: string
          eligible: boolean
          full_name: string
          id: string
          last_donation_date: string | null
          latitude: number | null
          longitude: number | null
          phone: string
          updated_at: string
          user_id: string
        }
        Insert: {
          antigen_notes?: string | null
          blood_group: Database["public"]["Enums"]["blood_group"]
          city: string
          created_at?: string
          eligible?: boolean
          full_name: string
          id?: string
          last_donation_date?: string | null
          latitude?: number | null
          longitude?: number | null
          phone: string
          updated_at?: string
          user_id: string
        }
        Update: {
          antigen_notes?: string | null
          blood_group?: Database["public"]["Enums"]["blood_group"]
          city?: string
          created_at?: string
          eligible?: boolean
          full_name?: string
          id?: string
          last_donation_date?: string | null
          latitude?: number | null
          longitude?: number | null
          phone?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      matches: {
        Row: {
          compatibility_score: number
          created_at: string
          distance_km: number | null
          donor_id: string
          id: string
          reasoning: string | null
          request_id: string
          status: Database["public"]["Enums"]["match_status"]
          urgency_rank: number
        }
        Insert: {
          compatibility_score?: number
          created_at?: string
          distance_km?: number | null
          donor_id: string
          id?: string
          reasoning?: string | null
          request_id: string
          status?: Database["public"]["Enums"]["match_status"]
          urgency_rank?: number
        }
        Update: {
          compatibility_score?: number
          created_at?: string
          distance_km?: number | null
          donor_id?: string
          id?: string
          reasoning?: string | null
          request_id?: string
          status?: Database["public"]["Enums"]["match_status"]
          urgency_rank?: number
        }
        Relationships: [
          {
            foreignKeyName: "matches_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "donors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "donors_directory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "blood_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          organization: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          organization?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          organization?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      donors_directory: {
        Row: {
          antigen_notes: string | null
          blood_group: Database["public"]["Enums"]["blood_group"] | null
          city: string | null
          created_at: string | null
          eligible: boolean | null
          full_name: string | null
          id: string | null
          last_donation_date: string | null
          latitude: number | null
          longitude: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          antigen_notes?: string | null
          blood_group?: Database["public"]["Enums"]["blood_group"] | null
          city?: string | null
          created_at?: string | null
          eligible?: boolean | null
          full_name?: string | null
          id?: string | null
          last_donation_date?: string | null
          latitude?: number | null
          longitude?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          antigen_notes?: string | null
          blood_group?: Database["public"]["Enums"]["blood_group"] | null
          city?: string | null
          created_at?: string | null
          eligible?: boolean | null
          full_name?: string | null
          id?: string | null
          last_donation_date?: string | null
          latitude?: number | null
          longitude?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      blood_group:
        | "A+"
        | "A-"
        | "B+"
        | "B-"
        | "AB+"
        | "AB-"
        | "O+"
        | "O-"
        | "Bombay"
      match_status: "pending" | "accepted" | "declined" | "completed"
      request_status: "open" | "matched" | "fulfilled" | "cancelled"
      urgency_level: "routine" | "urgent" | "critical"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      blood_group: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Bombay"],
      match_status: ["pending", "accepted", "declined", "completed"],
      request_status: ["open", "matched", "fulfilled", "cancelled"],
      urgency_level: ["routine", "urgent", "critical"],
    },
  },
} as const
