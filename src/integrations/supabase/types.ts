export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      daily_entries: {
        Row: {
          id: string
          user_id: string | null
          date: string
          sleep_hours: number
          exercised: boolean
          meditated: boolean
          breakfast: boolean
          lunch: boolean
          dinner: boolean
          problems_solved: number
          study_hours: number
          university_attended: boolean
          university_revised: boolean
          morning_fresh_up: boolean
          spiritual_practice: boolean
          discipline_check: boolean
          discipline_score: number
          reflection_text: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          date: string
          sleep_hours?: number
          exercised?: boolean
          meditated?: boolean
          breakfast?: boolean
          lunch?: boolean
          dinner?: boolean
          problems_solved?: number
          study_hours?: number
          university_attended?: boolean
          university_revised?: boolean
          morning_fresh_up?: boolean
          spiritual_practice?: boolean
          discipline_check?: boolean
          discipline_score?: number
          reflection_text?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          date?: string
          sleep_hours?: number
          exercised?: boolean
          meditated?: boolean
          breakfast?: boolean
          lunch?: boolean
          dinner?: boolean
          problems_solved?: number
          study_hours?: number
          university_attended?: boolean
          university_revised?: boolean
          morning_fresh_up?: boolean
          spiritual_practice?: boolean
          discipline_check?: boolean
          discipline_score?: number
          reflection_text?: string
          created_at?: string
          updated_at?: string
        }
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
