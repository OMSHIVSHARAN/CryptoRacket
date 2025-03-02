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
      profiles: {
        Row: {
          id: string
          username: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_stats: {
        Row: {
          user_id: string
          total_gains: number | null
          predictions_accuracy: number | null
          watched_stocks: number | null
          rank: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          total_gains?: number | null
          predictions_accuracy?: number | null
          watched_stocks?: number | null
          rank?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          total_gains?: number | null
          predictions_accuracy?: number | null
          watched_stocks?: number | null
          rank?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      watchlist: {
        Row: {
          id: string
          user_id: string
          symbol: string
          added_at: string
        }
        Insert: {
          id?: string
          user_id: string
          symbol: string
          added_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          symbol?: string
          added_at?: string
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
  }
}