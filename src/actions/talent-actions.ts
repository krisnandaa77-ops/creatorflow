
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getTalents() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('talents')
        .select('*')
        .order('name')

    if (error) {
        console.error('Error fetching talents:', error)
        return []
    }

    return data
}

export async function createTalent(formData: FormData) {
    const supabase = await createClient()
    const name = formData.get('name') as string

    const { error } = await supabase
        .from('talents')
        .insert({ name })

    if (error) {
        console.error('Error creating talent:', error)
        return { error: error.message }
    }

    revalidatePath('/talents')
    revalidatePath('/dashboard')
    return { success: true }
}
