
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getAllProfiles() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching profiles:', error)
        return []
    }

    return data
}

export async function updateUserProfile(
    userId: string,
    updates: { subscription_tier?: string; role?: string }
) {
    const supabase = await createClient()

    // Secure check: Ensure caller is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const { data: adminProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (adminProfile?.role !== 'admin') {
        return { error: 'Forbidden: Admin only' }
    }

    const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

    if (error) {
        console.error('Error updating profile:', error)
        return { error: error.message }
    }

    revalidatePath('/admin-dashboard')
    return { success: true, data }
}

export async function getAllPayments() {
    const supabase = await createClient()

    // Fetch payments first
    const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select('*')
        .order('payment_date', { ascending: false })

    if (paymentsError) {
        console.error('Error fetching payments:', paymentsError)
        return []
    }

    // Fetch user profiles to map names
    // Optimization: we could collect user_ids and only fetch those, 
    // but for now fetch all profiles (or just needed fields) is fine for admin view.
    const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, full_name')

    // Create a map for quick lookup
    const profilesMap = new Map(
        profilesData?.map(p => [p.id, p]) || []
    )

    // Map payments to include profile info
    const paymentsWithProfile = paymentsData.map(payment => ({
        ...payment,
        profiles: profilesMap.get(payment.user_id) || { full_name: 'Unknown User' }
    }))

    return paymentsWithProfile
}

export async function getAdminStats() {
    const supabase = await createClient()

    // 1. Total Users
    const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

    // 2. Pro Subscribers
    const { count: proUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('subscription_tier', 'pro')

    // 3. Revenue
    const { data: payments } = await supabase
        .from('payments')
        .select('amount')

    const totalRevenue = payments?.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0) || 0

    return {
        totalUsers: totalUsers || 0,
        proUsers: proUsers || 0,
        totalRevenue,
        pendingSupport: 5 // Mock
    }
}
