'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// ============================================================
// GROUND TRUTH — Supabase `contents` table columns
// (from src/types/supabase.ts):
//   id              uuid
//   title           text
//   description     text | null
//   platform        'Instagram' | 'TikTok' | 'YouTube'
//   status          'Idea' | 'To-Do' | 'Filming' | 'Editing' | 'Done'
//   reference_link  text | null
//   thumbnail_url   text | null
//   production_date text | null
//   upload_date     text | null
//   script          text | null
//   due_date        text | null
//   created_at      timestamptz
// ============================================================

export async function getContents() {
    try {
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
            console.error('[getContents] Supabase Error:', JSON.stringify(error, null, 2))
            return []
        }

        console.log(`[getContents] Fetched ${data?.length ?? 0} items`)
        return data
    } catch (err: any) {
        console.error('[getContents] Unexpected error:', err)
        return []
    }
}

export async function createContent(formData: FormData) {
    try {
        const supabase = await createClient()

        const title = formData.get('title') as string
        const platform = formData.get('platform') as string || 'TikTok'
        const status = (formData.get('status') as string) || 'Idea'
        const description = formData.get('description') as string || null
        const reference_link = formData.get('reference_link') as string || null
        const script = formData.get('script') as string || null
        const production_date = formData.get('production_date') as string || null
        const upload_date = formData.get('upload_date') as string || null
        const talentIds = formData.getAll('talent_ids') as string[]

        const insertPayload = {
            title,
            platform,
            status,
            description,
            reference_link,
            script,
            production_date,
            upload_date,
        }

        console.log('[createContent] ===== DATA TO BE SAVED =====')
        console.log('[createContent] Payload:', JSON.stringify(insertPayload, null, 2))
        console.log('[createContent] Talent IDs:', talentIds)

        const { data: content, error } = await supabase
            .from('contents')
            .insert(insertPayload as any)
            .select()
            .single()

        if (error) {
            console.error('[createContent] Supabase Error:', JSON.stringify(error, null, 2))
            return { error: error.message }
        }

        console.log('[createContent] SUCCESS — ID:', content.id)

        // Assign talents via junction table
        if (talentIds.length > 0 && content?.id) {
            const talentInserts = talentIds.map(tid => ({
                content_id: content.id,
                talent_id: tid,
            }))
            console.log('[createContent] Assigning talents:', talentInserts)

            const { error: talentError } = await supabase
                .from('content_talents')
                .insert(talentInserts)

            if (talentError) {
                console.error('[createContent] Talent assign error:', JSON.stringify(talentError, null, 2))
            }
        }

        revalidatePath('/dashboard')
        revalidatePath('/ideabank')
        revalidatePath('/calendar')
        return { success: true, data: content }
    } catch (err: any) {
        console.error('[createContent] Unexpected error:', err)
        return { error: err.message || 'Unexpected error during create' }
    }
}

export async function updateContent(id: string, formData: FormData) {
    try {
        const supabase = await createClient()

        if (!id) {
            console.error('[updateContent] CRITICAL: ID is null/undefined!')
            return { error: 'Content ID is missing. Cannot update.' }
        }

        const title = formData.get('title') as string
        const platform = formData.get('platform') as string || 'TikTok'
        const status = (formData.get('status') as string) || 'Idea'
        const description = formData.get('description') as string || null
        const reference_link = formData.get('reference_link') as string || null
        const script = formData.get('script') as string || null
        const production_date = formData.get('production_date') as string || null
        const upload_date = formData.get('upload_date') as string || null
        const talentIds = formData.getAll('talent_ids') as string[]

        const updatePayload = {
            title,
            platform,
            status,
            description,
            reference_link,
            script,
            production_date,
            upload_date,
        }

        console.log('[updateContent] ===== UPDATE DATA =====')
        console.log('[updateContent] ID:', id)
        console.log('[updateContent] Payload:', JSON.stringify(updatePayload, null, 2))

        const { data, error } = await supabase
            .from('contents')
            .update(updatePayload as any)
            .eq('id', id)
            .select()

        if (error) {
            console.error('[updateContent] Supabase Error:', JSON.stringify(error, null, 2))
            return { error: error.message }
        }

        console.log('[updateContent] SUCCESS — Rows:', data?.length ?? 0)

        // Update talents: delete and reinsert
        const { error: deleteError } = await supabase
            .from('content_talents')
            .delete()
            .eq('content_id', id)

        if (deleteError) {
            console.error('[updateContent] Talent delete error:', JSON.stringify(deleteError, null, 2))
        }

        if (talentIds.length > 0) {
            const talentInserts = talentIds.map(tid => ({
                content_id: id,
                talent_id: tid,
            }))
            const { error: talentError } = await supabase
                .from('content_talents')
                .insert(talentInserts)

            if (talentError) {
                console.error('[updateContent] Talent insert error:', JSON.stringify(talentError, null, 2))
            }
        }

        revalidatePath('/dashboard')
        revalidatePath('/ideabank')
        revalidatePath('/calendar')
        return { success: true }
    } catch (err: any) {
        console.error('[updateContent] Unexpected error:', err)
        return { error: err.message || 'Unexpected error during update' }
    }
}

export async function updateContentStatus(id: string, status: string) {
    try {
        const supabase = await createClient()
        console.log('[updateContentStatus] ID:', id, 'Status:', status)

        const { error } = await supabase
            .from('contents')
            .update({ status } as any)
            .eq('id', id)

        if (error) {
            console.error('[updateContentStatus] Supabase Error:', JSON.stringify(error, null, 2))
            return { error: error.message }
        }

        console.log('[updateContentStatus] SUCCESS')
        revalidatePath('/dashboard')
        revalidatePath('/ideabank')
        return { success: true }
    } catch (err: any) {
        console.error('[updateContentStatus] Unexpected error:', err)
        return { error: err.message }
    }
}

export async function assignTalentToContent(contentId: string, talentId: string) {
    try {
        const supabase = await createClient()
        console.log('[assignTalentToContent] Content:', contentId, 'Talent:', talentId)

        const { error } = await supabase
            .from('content_talents')
            .insert({ content_id: contentId, talent_id: talentId })

        if (error) {
            console.error('[assignTalentToContent] Supabase Error:', JSON.stringify(error, null, 2))
            return { error: error.message }
        }

        console.log('[assignTalentToContent] SUCCESS')
        revalidatePath('/dashboard')
        return { success: true }
    } catch (err: any) {
        console.error('[assignTalentToContent] Unexpected error:', err)
        return { error: err.message }
    }
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
    try {
        const supabase = await createClient()
        console.log('[setProductionDate] ID:', id, 'Date:', date)

        const { error } = await supabase
            .from('contents')
            .update({ production_date: date, status: 'To-Do' } as any)
            .eq('id', id)

        if (error) {
            console.error('[setProductionDate] Supabase Error:', JSON.stringify(error, null, 2))
            return { error: error.message }
        }

        revalidatePath('/dashboard')
        revalidatePath('/ideabank')
        revalidatePath('/calendar')
        return { success: true }
    } catch (err: any) {
        console.error('[setProductionDate] Unexpected error:', err)
        return { error: err.message }
    }
}

// ============================================================
// IDEA BANK — Dedicated Actions
// ============================================================

export async function getIdeas() {
    try {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from('contents')
            .select('*')
            .eq('status', 'Idea')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('[getIdeas] Supabase Error:', JSON.stringify(error, null, 2))
            return []
        }

        console.log(`[getIdeas] Fetched ${data?.length ?? 0} ideas`)
        return data
    } catch (err: any) {
        console.error('[getIdeas] Unexpected error:', err)
        return []
    }
}

export async function createIdea(formData: FormData) {
    try {
        const supabase = await createClient()

        const title = formData.get('title') as string
        const reference_link = formData.get('reference_link') as string || null
        const description = formData.get('description') as string || null

        const payload = {
            title,
            reference_link,
            description,
            status: 'Idea',
            platform: 'TikTok', // default
        }

        console.log('[createIdea] ===== SAVING IDEA =====')
        console.log('[createIdea] Payload:', JSON.stringify(payload, null, 2))

        const { data, error } = await supabase
            .from('contents')
            .insert(payload as any)
            .select()
            .single()

        if (error) {
            console.error('[createIdea] Supabase Error:', JSON.stringify(error, null, 2))
            return { error: error.message }
        }

        console.log('[createIdea] SUCCESS — ID:', data.id)
        revalidatePath('/ideabank')
        revalidatePath('/dashboard')
        return { success: true, data }
    } catch (err: any) {
        console.error('[createIdea] Unexpected error:', err)
        return { error: err.message || 'Unexpected error' }
    }
}

export async function updateIdea(id: string, formData: FormData) {
    try {
        const supabase = await createClient()

        if (!id) {
            return { error: 'Idea ID is missing.' }
        }

        const title = formData.get('title') as string
        const reference_link = formData.get('reference_link') as string || null
        const description = formData.get('description') as string || null

        const payload = {
            title,
            reference_link,
            description,
        }

        console.log('[updateIdea] ===== UPDATING IDEA =====')
        console.log('[updateIdea] ID:', id, 'Payload:', JSON.stringify(payload, null, 2))

        const { data, error } = await supabase
            .from('contents')
            .update(payload as any)
            .eq('id', id)
            .select()

        if (error) {
            console.error('[updateIdea] Supabase Error:', JSON.stringify(error, null, 2))
            return { error: error.message }
        }

        console.log('[updateIdea] SUCCESS')
        revalidatePath('/ideabank')
        revalidatePath('/dashboard')
        return { success: true }
    } catch (err: any) {
        console.error('[updateIdea] Unexpected error:', err)
        return { error: err.message || 'Unexpected error' }
    }
}
