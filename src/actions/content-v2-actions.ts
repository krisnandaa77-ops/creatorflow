
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { getOgImage } from '@/lib/metadata'

/** Helper: get authenticated user or throw */
async function getAuthUser(supabase: Awaited<ReturnType<typeof createClient>>) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')
    return user
}

// Reuse existing creation but adds metadata fetching
export async function createIdeaWithMetadata(formData: FormData) {
    const title = formData.get('title') as string
    const platform = formData.get('platform') as 'Instagram' | 'TikTok' | 'YouTube'
    const referenceLink = formData.get('reference_link') as string

    let thumbnailUrl = null;

    if (referenceLink) {
        try {
            thumbnailUrl = await getOgImage(referenceLink);
        } catch (e) {
            console.error('Failed to fetch metadata', e);
        }
    }

    const supabase = await createClient()
    const user = await getAuthUser(supabase)

    const { error } = await supabase
        .from('contents')
        .insert({
            title,
            platform,
            status: 'Idea',
            reference_link: referenceLink || null,
            thumbnail_url: thumbnailUrl,
            user_id: user.id,
        })

    if (error) {
        console.error('Error creating idea:', error)
        return { error: error.message }
    }

    revalidatePath('/dashboard')
    revalidatePath('/ideas')
    return { success: true }
}

export async function updateContentDates(id: string, productionDate: string | null, uploadDate: string | null) {
    const supabase = await createClient()
    const user = await getAuthUser(supabase)

    const { error } = await supabase
        .from('contents')
        .update({
            production_date: productionDate || null,
            upload_date: uploadDate || null
        })
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/dashboard')
    return { success: true }
}

export async function updateContentFull(
    id: string,
    data: {
        title: string
        reference_link: string | null
        production_date: string | null
        upload_date: string | null
        script: string | null
        talent_ids: string[]
    }
) {
    const supabase = await createClient()
    const user = await getAuthUser(supabase)

    // 1. Update the content row
    const { error: updateError } = await supabase
        .from('contents')
        .update({
            title: data.title,
            reference_link: data.reference_link || null,
            production_date: data.production_date || null,
            upload_date: data.upload_date || null,
            script: data.script || null,
        })
        .eq('id', id)
        .eq('user_id', user.id)

    if (updateError) {
        console.error('Error updating content:', updateError)
        return { error: updateError.message }
    }

    // 2. Sync content_talents: delete existing, insert new
    const { error: deleteError } = await supabase
        .from('content_talents')
        .delete()
        .eq('content_id', id)

    if (deleteError) {
        console.error('Error clearing talents:', deleteError)
        return { error: deleteError.message }
    }

    if (data.talent_ids.length > 0) {
        const rows = data.talent_ids.map(talentId => ({
            content_id: id,
            talent_id: talentId,
            user_id: user.id,
        }))

        const { error: insertError } = await supabase
            .from('content_talents')
            .insert(rows)

        if (insertError) {
            console.error('Error assigning talents:', insertError)
            return { error: insertError.message }
        }
    }

    revalidatePath('/dashboard')
    revalidatePath('/ideas')
    revalidatePath('/calendar')
    return { success: true }
}
