
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/** Helper: get authenticated user or throw */
async function getAuthUser(supabase: Awaited<ReturnType<typeof createClient>>) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')
    return user
}

export async function getTalents() {
    const supabase = await createClient()
    const user = await getAuthUser(supabase)

    const { data, error } = await supabase
        .from('talents')
        .select('*')
        .eq('user_id', user.id)
        .order('name')

    if (error) {
        console.error('Error fetching talents:', error)
        return []
    }

    return data
}

export async function createTalent(formData: FormData) {
    const supabase = await createClient()
    const user = await getAuthUser(supabase)

    const name = formData.get('name') as string
    const role = formData.get('role') as string | null
    const email = formData.get('email') as string | null
    const telegram = formData.get('telegram') as string | null

    const { data, error } = await supabase
        .from('talents')
        .insert({ name, role, email, telegram, user_id: user.id })
        .select()
        .single()

    if (error) {
        console.error('Error creating talent:', error)
        return { error: error.message }
    }

    revalidatePath('/talents')
    revalidatePath('/dashboard')
    return { success: true, data }
}

export async function updateTalent(id: string, formData: FormData) {
    const supabase = await createClient()
    const user = await getAuthUser(supabase)

    const name = formData.get('name') as string
    const role = formData.get('role') as string | null
    const email = formData.get('email') as string | null
    const telegram = formData.get('telegram') as string | null

    const { data, error } = await supabase
        .from('talents')
        .update({ name, role, email, telegram })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

    if (error) {
        console.error('Error updating talent:', error)
        return { error: error.message }
    }

    revalidatePath('/talents')
    revalidatePath('/dashboard')
    return { success: true, data }
}

export async function deleteTalent(id: string) {
    const supabase = await createClient()
    const user = await getAuthUser(supabase)

    const { error } = await supabase
        .from('talents')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        console.error('Error deleting talent:', error)
        return { error: error.message }
    }

    revalidatePath('/talents')
    revalidatePath('/dashboard')
    return { success: true }
}
