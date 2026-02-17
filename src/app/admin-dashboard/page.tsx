
import React from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAdminStats, getAllProfiles, getAllPayments } from '@/actions/admin-actions'
import { AdminDashboardClient } from '@/components/admin/AdminDashboardClient'

export default async function AdminDashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/')
    }

    // Security Check: Role must be admin
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') {
        redirect('/dashboard')
    }

    // Fetch Data
    const stats = await getAdminStats()
    const users = await getAllProfiles()
    const payments = await getAllPayments()

    return (
        <AdminDashboardClient
            stats={stats}
            users={users || []}
            payments={payments || []}
        />
    )
}
