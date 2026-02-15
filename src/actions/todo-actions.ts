'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import dayjs from 'dayjs'

export async function getDailyTodos() {
    const supabase = await createClient()
    const today = dayjs().format('YYYY-MM-DD')

    const { data, error } = await supabase
        .from('daily_todos')
        .select('*')
        .eq('due_date', today)
        .order('created_at')

    if (error) {
        console.error('Error fetching todos:', error)
        return []
    }

    return data
}

export interface UnifiedTodoItem {
    id: string
    label: string
    is_completed: boolean
    source: 'manual' | 'content'
    content_id?: string
    content_status?: string
}

export async function getUnifiedDailyTodos(): Promise<UnifiedTodoItem[]> {
    const supabase = await createClient()
    const today = dayjs().format('YYYY-MM-DD')

    // 1. Manual todos
    const { data: manualTodos } = await supabase
        .from('daily_todos')
        .select('*')
        .eq('due_date', today)
        .order('created_at')

    // 2. Content shooting today
    const { data: shootingToday } = await supabase
        .from('contents')
        .select('id, title, status')
        .eq('production_date', today)

    // 3. Content uploading today
    const { data: uploadingToday } = await supabase
        .from('contents')
        .select('id, title, status')
        .eq('upload_date', today)

    const items: UnifiedTodoItem[] = []

        // Map manual todos
        ; (manualTodos || []).forEach(todo => {
            items.push({
                id: todo.id,
                label: todo.task_name,
                is_completed: todo.is_completed,
                source: 'manual',
            })
        })

        // Map production tasks
        ; (shootingToday || []).forEach(content => {
            items.push({
                id: `prod-${content.id}`,
                label: `🎬 Shooting: ${content.title}`,
                is_completed: content.status === 'Done',
                source: 'content',
                content_id: content.id,
                content_status: content.status,
            })
        })

        // Map upload tasks
        ; (uploadingToday || []).forEach(content => {
            items.push({
                id: `upload-${content.id}`,
                label: `🚀 Upload: ${content.title}`,
                is_completed: content.status === 'Done',
                source: 'content',
                content_id: content.id,
                content_status: content.status,
            })
        })

    return items
}

export async function createTodo(formData: FormData) {
    const supabase = await createClient()
    const taskName = formData.get('task_name') as string

    const { error } = await supabase
        .from('daily_todos')
        .insert({
            task_name: taskName,
            due_date: dayjs().format('YYYY-MM-DD')
        })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/dashboard')
    return { success: true }
}

export async function toggleTodo(id: string, isCompleted: boolean) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('daily_todos')
        .update({ is_completed: isCompleted })
        .eq('id', id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/dashboard')
    return { success: true }
}
