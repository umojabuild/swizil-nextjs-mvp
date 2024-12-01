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
      users: {
        Row: {
          id: string
          email: string
          settings: Json
          created_at: string
          last_login: string
        }
        Insert: {
          id?: string
          email: string
          settings?: Json
          created_at?: string
          last_login?: string
        }
        Update: {
          id?: string
          email?: string
          settings?: Json
          created_at?: string
          last_login?: string
        }
      }
      content: {
        Row: {
          id: string
          source: string
          content_type: string
          data: Json
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          source: string
          content_type: string
          data: Json
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          source?: string
          content_type?: string
          data?: Json
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      preferences: {
        Row: {
          user_id: string
          feed_settings: Json
          widget_layout: Json
          updated_at: string
        }
        Insert: {
          user_id: string
          feed_settings?: Json
          widget_layout?: Json
          updated_at?: string
        }
        Update: {
          user_id?: string
          feed_settings?: Json
          widget_layout?: Json
          updated_at?: string
        }
      }
      cache: {
        Row: {
          content_id: string
          cached_data: Json
          expires_at: string
          created_at: string
        }
        Insert: {
          content_id: string
          cached_data: Json
          expires_at: string
          created_at?: string
        }
        Update: {
          content_id?: string
          cached_data?: Json
          expires_at?: string
          created_at?: string
        }
      }
    }
  }
}