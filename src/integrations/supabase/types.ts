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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      companies: {
        Row: {
          company_size: string | null
          created_at: string
          engagement_level: string | null
          id: string
          industry_id: string | null
          island: string | null
          location: string | null
          member_count: number | null
          name: string
          updated_at: string
          website: string | null
        }
        Insert: {
          company_size?: string | null
          created_at?: string
          engagement_level?: string | null
          id?: string
          industry_id?: string | null
          island?: string | null
          location?: string | null
          member_count?: number | null
          name: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          company_size?: string | null
          created_at?: string
          engagement_level?: string | null
          id?: string
          industry_id?: string | null
          island?: string | null
          location?: string | null
          member_count?: number | null
          name?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "companies_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "industries"
            referencedColumns: ["id"]
          },
        ]
      }
      event_attendees: {
        Row: {
          attendee_company: string | null
          attendee_email: string | null
          attendee_name: string | null
          attendee_title: string | null
          created_at: string
          event_id: string
          id: string
          member_id: string | null
        }
        Insert: {
          attendee_company?: string | null
          attendee_email?: string | null
          attendee_name?: string | null
          attendee_title?: string | null
          created_at?: string
          event_id: string
          id?: string
          member_id?: string | null
        }
        Update: {
          attendee_company?: string | null
          attendee_email?: string | null
          attendee_name?: string | null
          attendee_title?: string | null
          created_at?: string
          event_id?: string
          id?: string
          member_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_attendees_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_attendees_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          attendee_count: number | null
          company_id: string | null
          created_at: string
          description: string | null
          event_date: string
          event_type: string
          id: string
          location: string | null
          name: string
          organizer_email: string | null
          organizer_name: string | null
          promotion_channels: string[] | null
          updated_at: string
        }
        Insert: {
          attendee_count?: number | null
          company_id?: string | null
          created_at?: string
          description?: string | null
          event_date: string
          event_type?: string
          id?: string
          location?: string | null
          name: string
          organizer_email?: string | null
          organizer_name?: string | null
          promotion_channels?: string[] | null
          updated_at?: string
        }
        Update: {
          attendee_count?: number | null
          company_id?: string | null
          created_at?: string
          description?: string | null
          event_date?: string
          event_type?: string
          id?: string
          location?: string | null
          name?: string
          organizer_email?: string | null
          organizer_name?: string | null
          promotion_channels?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      industries: {
        Row: {
          color: string
          company_count: number | null
          created_at: string
          description: string | null
          growth_rate: number | null
          icon: string | null
          id: string
          member_count: number | null
          name: string
          updated_at: string
        }
        Insert: {
          color?: string
          company_count?: number | null
          created_at?: string
          description?: string | null
          growth_rate?: number | null
          icon?: string | null
          id?: string
          member_count?: number | null
          name: string
          updated_at?: string
        }
        Update: {
          color?: string
          company_count?: number | null
          created_at?: string
          description?: string | null
          growth_rate?: number | null
          icon?: string | null
          id?: string
          member_count?: number | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      island_data: {
        Row: {
          company_count: number | null
          coordinates: Json | null
          created_at: string
          id: string
          member_count: number | null
          name: string
          population: number | null
          tech_percentage: number | null
          updated_at: string
        }
        Insert: {
          company_count?: number | null
          coordinates?: Json | null
          created_at?: string
          id?: string
          member_count?: number | null
          name: string
          population?: number | null
          tech_percentage?: number | null
          updated_at?: string
        }
        Update: {
          company_count?: number | null
          coordinates?: Json | null
          created_at?: string
          id?: string
          member_count?: number | null
          name?: string
          population?: number | null
          tech_percentage?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      linkedin_posts: {
        Row: {
          company_id: string | null
          created_at: string
          engagement_metrics: Json | null
          id: string
          member_id: string | null
          post_content: string | null
          post_date: string
          post_type: string | null
          post_url: string
          updated_at: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          engagement_metrics?: Json | null
          id?: string
          member_id?: string | null
          post_content?: string | null
          post_date: string
          post_type?: string | null
          post_url: string
          updated_at?: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          engagement_metrics?: Json | null
          id?: string
          member_id?: string | null
          post_content?: string | null
          post_date?: string
          post_type?: string | null
          post_url?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "linkedin_posts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "linkedin_posts_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      members: {
        Row: {
          activity_level: string | null
          bio: string | null
          company_id: string | null
          created_at: string
          email: string | null
          events_attended: number | null
          github_url: string | null
          id: string
          industry_id: string | null
          island: string | null
          job_title: string | null
          last_event_date: string | null
          linkedin_url: string | null
          member_since: string | null
          name: string
          skills: string[] | null
          updated_at: string
        }
        Insert: {
          activity_level?: string | null
          bio?: string | null
          company_id?: string | null
          created_at?: string
          email?: string | null
          events_attended?: number | null
          github_url?: string | null
          id?: string
          industry_id?: string | null
          island?: string | null
          job_title?: string | null
          last_event_date?: string | null
          linkedin_url?: string | null
          member_since?: string | null
          name: string
          skills?: string[] | null
          updated_at?: string
        }
        Update: {
          activity_level?: string | null
          bio?: string | null
          company_id?: string | null
          created_at?: string
          email?: string | null
          events_attended?: number | null
          github_url?: string | null
          id?: string
          industry_id?: string | null
          island?: string | null
          job_title?: string | null
          last_event_date?: string | null
          linkedin_url?: string | null
          member_since?: string | null
          name?: string
          skills?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "members_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "members_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "industries"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          role: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          role?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          role?: string | null
          updated_at?: string
          user_id?: string | null
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
    Enums: {},
  },
} as const
