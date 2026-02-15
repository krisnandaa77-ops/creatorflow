
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
            contents: {
                Row: {
                    id: string
                    title: string
                    description: string | null
                    platform: 'Instagram' | 'TikTok' | 'YouTube'
                    status: 'Idea' | 'To-Do' | 'Filming' | 'Editing' | 'Done'
                    reference_link: string | null
                    thumbnail_url: string | null
                    production_date: string | null
                    upload_date: string | null
                    script: string | null
                    due_date: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    description?: string | null
                    platform?: 'Instagram' | 'TikTok' | 'YouTube'
                    status?: 'Idea' | 'To-Do' | 'Filming' | 'Editing' | 'Done'
                    reference_link?: string | null
                    thumbnail_url?: string | null
                    production_date?: string | null
                    upload_date?: string | null
                    script?: string | null
                    due_date?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    description?: string | null
                    platform?: 'Instagram' | 'TikTok' | 'YouTube'
                    status?: 'Idea' | 'To-Do' | 'Filming' | 'Editing' | 'Done'
                    reference_link?: string | null
                    thumbnail_url?: string | null
                    production_date?: string | null
                    upload_date?: string | null
                    script?: string | null
                    due_date?: string | null
                    created_at?: string
                }
                Relationships: []
            }
            talents: {
                Row: {
                    id: string
                    name: string
                    avatar_url: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    avatar_url?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    avatar_url?: string | null
                    created_at?: string
                }
                Relationships: []
            }
            content_talents: {
                Row: {
                    content_id: string
                    talent_id: string
                }
                Insert: {
                    content_id: string
                    talent_id: string
                }
                Update: {
                    content_id?: string
                    talent_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "content_talents_content_id_fkey"
                        columns: ["content_id"]
                        referencedRelation: "contents"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "content_talents_talent_id_fkey"
                        columns: ["talent_id"]
                        referencedRelation: "talents"
                        referencedColumns: ["id"]
                    }
                ]
            }
            daily_todos: {
                Row: {
                    id: string
                    task_name: string
                    is_completed: boolean
                    due_date: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    task_name: string
                    is_completed?: boolean
                    due_date?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    task_name?: string
                    is_completed?: boolean
                    due_date?: string | null
                    created_at?: string
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
            content_status: 'Idea' | 'To-Do' | 'Filming' | 'Editing' | 'Done'
            platform_type: 'Instagram' | 'TikTok' | 'YouTube'
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
