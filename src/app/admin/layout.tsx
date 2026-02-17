'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

function getSupabase() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const [authorized, setAuthorized] = useState(false)
    const [checking, setChecking] = useState(true)

    useEffect(() => {
        async function checkAdmin() {
            const supabase = getSupabase()

            const { data: { user } } = await supabase.auth.getUser()
            console.log('[ADMIN] User:', user?.id, user?.email)

            if (!user) {
                console.log('[ADMIN] No user, redirecting to /login')
                router.replace('/login')
                return
            }

            const { data: profile, error } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single()

            console.log('[ADMIN] Profile:', profile, 'Error:', error)

            if (error || !profile || profile.role !== 'admin') {
                console.log('[ADMIN] Not admin, redirecting to /dashboard')
                router.replace('/dashboard')
                return
            }

            console.log('[ADMIN] ✅ Admin access granted')
            setAuthorized(true)
            setChecking(false)
        }

        checkAdmin()
    }, [router])

    if (checking) {
        return (
            <div className="min-h-screen bg-[#0f1320] text-white flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <span className="w-10 h-10 border-2 border-white/10 border-t-[#3f68e4] rounded-full animate-spin" />
                    <span className="text-sm text-slate-400">Verifying admin access...</span>
                </div>
            </div>
        )
    }

    if (!authorized) return null

    return (
        <div className="min-h-screen bg-[#0f1320] text-white">
            {children}
        </div>
    )
}
