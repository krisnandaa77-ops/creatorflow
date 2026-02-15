'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// ============================================================
// HELPER: Get today's date as YYYY-MM-DD
// Using native JS — no dayjs needed, avoids timezone drift
// ============================================================
function getTodayString(): string {
    const now = new Date()
    const yyyy = now.getFullYear()
    const mm = String(now.getMonth() + 1).padStart(2, '0')
    const dd = String(now.getDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
}

// ============================================================
// getDailyFocusData() — All 3 columns in a single call
// ROBUST: handles missing is_shot / is_uploaded columns gracefully
// ============================================================
export async function getDailyFocusData() {
    try {
        const supabase = await createClient()
        const today = getTodayString()

        console.log('[getDailyFocusData] ===== FETCHING =====')
        console.log('[getDailyFocusData] Today:', today)

        // 1. Shooting Today (production_date = today)
        // Try fetching with is_shot first, fallback without it
        let shooting: any[] = []
        const { data: shootData, error: shootErr } = await supabase
            .from('contents')
            .select('id, title, platform, status, production_date, is_shot')
            .eq('production_date', today)
            .order('created_at')

        if (shootErr) {
            console.error('[getDailyFocusData] Shooting query failed (is_shot column may not exist):', shootErr.message)
            // Fallback: query without is_shot
            const { data: fallback } = await supabase
                .from('contents')
                .select('id, title, platform, status, production_date')
                .eq('production_date', today)
                .order('created_at')
            shooting = (fallback || []).map(item => ({ ...item, is_shot: false }))
        } else {
            shooting = (shootData || []).map(item => ({
                ...item,
                is_shot: item.is_shot ?? false, // handle null
            }))
        }

        // 2. Upload Today (upload_date = today)
        let uploads: any[] = []
        const { data: uploadData, error: uploadErr } = await supabase
            .from('contents')
            .select('id, title, platform, status, upload_date, is_uploaded')
            .eq('upload_date', today)
            .order('created_at')

        if (uploadErr) {
            console.error('[getDailyFocusData] Upload query failed (is_uploaded column may not exist):', uploadErr.message)
            // Fallback: query without is_uploaded
            const { data: fallback } = await supabase
                .from('contents')
                .select('id, title, platform, status, upload_date')
                .eq('upload_date', today)
                .order('created_at')
            uploads = (fallback || []).map(item => ({ ...item, is_uploaded: false }))
        } else {
            uploads = (uploadData || []).map(item => ({
                ...item,
                is_uploaded: item.is_uploaded ?? false,
            }))
        }

        // 3. General Tasks (daily_todos.due_date = today)
        const { data: todos, error: todoErr } = await supabase
            .from('daily_todos')
            .select('*')
            .eq('due_date', today)
            .order('created_at')

        if (todoErr) console.error('[getDailyFocusData] Todos error:', todoErr.message)

        console.log(`[getDailyFocusData] Results — Shooting: ${shooting.length}, Uploads: ${uploads.length}, Todos: ${todos?.length ?? 0}`)

        return {
            shooting,
            uploads,
            todos: todos || [],
        }
    } catch (err: any) {
        console.error('[getDailyFocusData] Unexpected error:', err)
        return { shooting: [], uploads: [], todos: [] }
    }
}

// ============================================================
// getCalendarEvents — All contents with production_date or upload_date
// ============================================================
export async function getCalendarEvents() {
    try {
        const supabase = await createClient()

        const { data, error } = await supabase
            .from('contents')
            .select('id, title, platform, status, production_date, upload_date')
            .order('created_at')

        if (error) {
            console.error('[getCalendarEvents] Error:', error.message)
            return []
        }

        console.log(`[getCalendarEvents] Fetched ${data?.length ?? 0} contents`)
        return data || []
    } catch (err: any) {
        console.error('[getCalendarEvents] Unexpected error:', err)
        return []
    }
}

// ============================================================
// addGeneralTask — Insert a manual task for today
// ============================================================
export async function addGeneralTask(taskName: string) {
    try {
        const supabase = await createClient()
        const today = getTodayString()

        console.log('[addGeneralTask] Task:', taskName, 'Date:', today)

        const { data, error } = await supabase
            .from('daily_todos')
            .insert({
                task_name: taskName,
                due_date: today,
                is_completed: false,
            })
            .select()
            .single()

        if (error) {
            console.error('[addGeneralTask] Supabase Error:', JSON.stringify(error, null, 2))
            return { error: error.message }
        }

        console.log('[addGeneralTask] SUCCESS — ID:', data.id)
        revalidatePath('/todo')
        revalidatePath('/dashboard')
        return { success: true, data }
    } catch (err: any) {
        console.error('[addGeneralTask] Unexpected error:', err)
        return { error: err.message }
    }
}

// ============================================================
// toggleTaskStatus — Toggle completion of a daily_todo
// ============================================================
export async function toggleTaskStatus(id: string, isCompleted: boolean) {
    try {
        const supabase = await createClient()
        console.log('[toggleTaskStatus] ID:', id, 'isCompleted:', isCompleted)

        const { error } = await supabase
            .from('daily_todos')
            .update({ is_completed: isCompleted })
            .eq('id', id)

        if (error) {
            console.error('[toggleTaskStatus] Supabase Error:', JSON.stringify(error, null, 2))
            return { error: error.message }
        }

        console.log('[toggleTaskStatus] SUCCESS')
        revalidatePath('/todo')
        revalidatePath('/dashboard')
        return { success: true }
    } catch (err: any) {
        console.error('[toggleTaskStatus] Unexpected error:', err)
        return { error: err.message }
    }
}

// ============================================================
// deleteTask — Remove a daily_todo
// ============================================================
export async function deleteTask(id: string) {
    try {
        const supabase = await createClient()
        console.log('[deleteTask] ID:', id)

        const { error } = await supabase
            .from('daily_todos')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('[deleteTask] Supabase Error:', JSON.stringify(error, null, 2))
            return { error: error.message }
        }

        console.log('[deleteTask] SUCCESS')
        revalidatePath('/todo')
        return { success: true }
    } catch (err: any) {
        console.error('[deleteTask] Unexpected error:', err)
        return { error: err.message }
    }
}

// ============================================================
// toggleShotStatus — Mark a content as shot/not-shot
// ============================================================
export async function toggleShotStatus(id: string, isShot: boolean) {
    try {
        const supabase = await createClient()
        console.log('[toggleShotStatus] ID:', id, 'is_shot:', isShot)

        const { error } = await supabase
            .from('contents')
            .update({ is_shot: isShot } as any)
            .eq('id', id)

        if (error) {
            console.error('[toggleShotStatus] Supabase Error:', JSON.stringify(error, null, 2))
            return { error: error.message }
        }

        console.log('[toggleShotStatus] SUCCESS')
        revalidatePath('/todo')
        revalidatePath('/dashboard')
        return { success: true }
    } catch (err: any) {
        console.error('[toggleShotStatus] Unexpected error:', err)
        return { error: err.message }
    }
}

// ============================================================
// toggleUploadStatus — Mark a content as uploaded/not-uploaded
// ============================================================
export async function toggleUploadStatus(id: string, isUploaded: boolean) {
    try {
        const supabase = await createClient()
        console.log('[toggleUploadStatus] ID:', id, 'is_uploaded:', isUploaded)

        const { error } = await supabase
            .from('contents')
            .update({ is_uploaded: isUploaded } as any)
            .eq('id', id)

        if (error) {
            console.error('[toggleUploadStatus] Supabase Error:', JSON.stringify(error, null, 2))
            return { error: error.message }
        }

        console.log('[toggleUploadStatus] SUCCESS')
        revalidatePath('/todo')
        revalidatePath('/dashboard')
        return { success: true }
    } catch (err: any) {
        console.error('[toggleUploadStatus] Unexpected error:', err)
        return { error: err.message }
    }
}

// ============================================================
// BACKWARD COMPAT — Legacy exports for DailyTodos.tsx, DailyFocusContent.tsx
// ============================================================
export interface UnifiedTodoItem {
    id: string
    label: string
    is_completed: boolean
    source: 'manual' | 'content'
    content_id?: string
    content_status?: string
}

export async function toggleTodo(id: string, isCompleted: boolean) {
    return toggleTaskStatus(id, isCompleted)
}

export async function createTodo(formData: FormData) {
    const taskName = formData.get('task_name') as string
    return addGeneralTask(taskName)
}

export async function getDailyTodos() {
    const { todos } = await getDailyFocusData()
    return todos
}
