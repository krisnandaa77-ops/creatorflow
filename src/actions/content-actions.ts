
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getContents() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('contents')
        .select(`
      *,
      content_talents (
        talent:talents (*)
      )
    `)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching contents:', error)
        return []
    }

    return data
}

export async function createContent(formData: FormData) {
    const supabase = await createClient()
    const title = formData.get('title') as string
    const platform = formData.get('platform') as 'Instagram' | 'TikTok' | 'YouTube'

    const { error } = await supabase
        .from('contents')
        .insert({
            title,
            platform,
            status: 'Idea',
        })

    if (error) {
        console.error('Error creating content:', error)
        return { error: error.message }
    }

    revalidatePath('/dashboard')
    revalidatePath('/ideas')
    return { success: true }
}

export async function updateContentStatus(id: string, status: 'Idea' | 'To-Do' | 'Filming' | 'Editing' | 'Done') {
    const supabase = await createClient()

    const { error } = await supabase
        .from('contents')
        .update({ status })
        .eq('id', id)

    if (error) {
        console.error('Error updating status:', error)
        return { error: error.message }
    }

    revalidatePath('/dashboard')
    return { success: true }
}

export async function assignTalentToContent(contentId: string, talentId: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('content_talents')
        .insert({
            content_id: contentId,
            talent_id: talentId
        })

    if (error) {
        console.error('Error assigning talent:', error)
        return { error: error.message }
    }

    revalidatePath('/dashboard')
    return { success: true }
}

const STATUS_PIPELINE = ['Idea', 'To-Do', 'Filming', 'Editing', 'Done'] as const

export async function advanceContentStatus(id: string, currentStatus: string) {
    const currentIndex = STATUS_PIPELINE.indexOf(currentStatus as any)
    if (currentIndex === -1 || currentIndex >= STATUS_PIPELINE.length - 1) {
        return { error: 'Cannot advance status further' }
    }

    const nextStatus = STATUS_PIPELINE[currentIndex + 1]
    return updateContentStatus(id, nextStatus)
}

export async function setProductionDate(id: string, date: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('contents')
        .update({
            production_date: date,
            status: 'To-Do'
        })
        .eq('id', id)

    if (error) {
        console.error('Error setting production date:', error)
        return { error: error.message }
    }

    revalidatePath('/dashboard')
    revalidatePath('/ideas')
    revalidatePath('/calendar')
    return { success: true }
}
