'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import { toast } from 'sonner'

// ============================================================
// Supabase client (browser)
// ============================================================
function getSupabase() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}

// ============================================================
// Types
// ============================================================
interface Profile {
    id: string
    full_name: string | null
    avatar_url: string | null
    role: string
    subscription_tier: string
    created_at: string
}

// ============================================================
// EditUserModal
// ============================================================
function EditUserModal({
    profile,
    onClose,
    onSaved,
}: {
    profile: Profile
    onClose: () => void
    onSaved: (p: Profile) => void
}) {
    const [tier, setTier] = useState(profile.subscription_tier)
    const [isLoading, setIsLoading] = useState(false)

    async function handleSave() {
        setIsLoading(true)
        const supabase = getSupabase()
        const { data, error } = await supabase
            .from('profiles')
            .update({ subscription_tier: tier })
            .eq('id', profile.id)
            .select()
            .single()

        setIsLoading(false)

        if (error) {
            toast.error('Failed to update user: ' + error.message)
        } else {
            toast.success('User updated!')
            onSaved(data as Profile)
            onClose()
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-[#1a1f35] border border-white/10 rounded-3xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-7 py-5 border-b border-white/5">
                    <h2 className="text-lg font-bold text-white">Edit User</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors text-2xl leading-none">&times;</button>
                </div>

                {/* User Info */}
                <div className="p-7 space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-[#3f68e4]/20 flex items-center justify-center text-[#3f68e4] text-lg font-bold">
                            {(profile.full_name || '?').slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <div className="font-bold text-white">{profile.full_name || 'Unknown'}</div>
                            <div className="text-xs text-slate-400">{profile.id.slice(0, 8)}...</div>
                        </div>
                    </div>

                    {/* Subscription Tier Selector */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Subscription Plan
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setTier('free')}
                                className={`py-3 rounded-2xl text-sm font-bold border transition-all ${tier === 'free'
                                        ? 'bg-slate-500/20 border-slate-400 text-white'
                                        : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                                    }`}
                            >
                                {tier === 'free' ? '● ' : '○ '}Free
                            </button>
                            <button
                                type="button"
                                onClick={() => setTier('pro')}
                                className={`py-3 rounded-2xl text-sm font-bold border transition-all ${tier === 'pro'
                                        ? 'bg-[#3f68e4]/20 border-[#3f68e4] text-[#3f68e4]'
                                        : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                                    }`}
                            >
                                {tier === 'pro' ? '● ' : '○ '}Pro
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={isLoading || tier === profile.subscription_tier}
                        className="w-full py-3 rounded-2xl bg-[#3f68e4] hover:bg-[#3f68e4]/90 text-white text-sm font-extrabold shadow-lg shadow-[#3f68e4]/25 transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.98]"
                    >
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    )
}

// ============================================================
// PAGE
// ============================================================
export default function AdminPage() {
    const [profiles, setProfiles] = useState<Profile[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [editingProfile, setEditingProfile] = useState<Profile | null>(null)

    const fetchProfiles = useCallback(async () => {
        setIsLoading(true)
        try {
            const supabase = getSupabase()
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setProfiles((data || []) as Profile[])
        } catch (err: any) {
            toast.error('Failed to load users: ' + (err?.message || 'Unknown error'))
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchProfiles()
    }, [fetchProfiles])

    // Stats
    const totalUsers = profiles.length
    const proUsers = profiles.filter((p) => p.subscription_tier === 'pro').length
    const freeUsers = profiles.filter((p) => p.subscription_tier === 'free').length

    // Filtered list
    const filtered = useMemo(() => {
        if (!search.trim()) return profiles
        const q = search.toLowerCase()
        return profiles.filter(
            (p) =>
                (p.full_name?.toLowerCase() || '').includes(q) ||
                p.id.toLowerCase().includes(q)
        )
    }, [profiles, search])

    function handleSaved(updated: Profile) {
        setProfiles((prev) =>
            prev.map((p) => (p.id === updated.id ? updated : p))
        )
    }

    async function handleLogout() {
        const supabase = getSupabase()
        await supabase.auth.signOut()
        window.location.href = '/'
    }

    return (
        <div className="min-h-screen p-6 md:p-8 lg:p-10">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#3f68e4] rounded-xl flex items-center justify-center shadow-lg shadow-[#3f68e4]/30 text-white text-xl">
                        ⚙
                    </div>
                    <div>
                        <h1 className="text-xl font-extrabold text-white">Admin Dashboard</h1>
                        <p className="text-xs text-slate-400">User management &amp; analytics</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/dashboard"
                        className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-300 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                    >
                        ← App
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 rounded-xl text-sm font-semibold text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white/[0.04] backdrop-blur-[20px] border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 text-xl">👥</div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Users</span>
                    </div>
                    <div className="text-3xl font-extrabold text-white">{totalUsers}</div>
                </div>
                <div className="bg-white/[0.04] backdrop-blur-[20px] border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-[#3f68e4]/10 rounded-xl flex items-center justify-center text-[#3f68e4] text-xl">⭐</div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pro Users</span>
                    </div>
                    <div className="text-3xl font-extrabold text-[#3f68e4]">{proUsers}</div>
                </div>
                <div className="bg-white/[0.04] backdrop-blur-[20px] border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-slate-500/10 rounded-xl flex items-center justify-center text-slate-400 text-xl">👤</div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Free Users</span>
                    </div>
                    <div className="text-3xl font-extrabold text-slate-300">{freeUsers}</div>
                </div>
            </div>

            {/* Search + Table */}
            <div className="bg-white/[0.04] backdrop-blur-[20px] border border-white/10 rounded-2xl overflow-hidden">
                {/* Search bar */}
                <div className="p-4 border-b border-white/5">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="🔍 Search by name or ID..."
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3f68e4]/30 focus:border-[#3f68e4]/30 transition-all"
                    />
                </div>

                {/* Loading */}
                {isLoading && (
                    <div className="flex items-center justify-center py-16">
                        <span className="w-8 h-8 border-2 border-white/10 border-t-[#3f68e4] rounded-full animate-spin" />
                    </div>
                )}

                {/* Table */}
                {!isLoading && (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/5">
                                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">User</th>
                                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider hidden md:table-cell">ID</th>
                                    <th className="text-center px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Plan</th>
                                    <th className="text-center px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Role</th>
                                    <th className="text-right px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((profile) => (
                                    <tr
                                        key={profile.id}
                                        className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                                    >
                                        {/* User */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-[#3f68e4]/10 flex items-center justify-center text-[#3f68e4] text-xs font-bold border border-white/10">
                                                    {(profile.full_name || '?').slice(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold text-white">
                                                        {profile.full_name || 'Unnamed'}
                                                    </div>
                                                    <div className="text-xs text-slate-500 md:hidden">
                                                        {profile.id.slice(0, 12)}...
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* ID */}
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <span className="text-xs text-slate-500 font-mono">
                                                {profile.id.slice(0, 12)}...
                                            </span>
                                        </td>

                                        {/* Plan */}
                                        <td className="px-6 py-4 text-center">
                                            <span
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${profile.subscription_tier === 'pro'
                                                        ? 'bg-[#3f68e4]/15 text-[#3f68e4] border border-[#3f68e4]/30'
                                                        : 'bg-white/5 text-slate-400 border border-white/10'
                                                    }`}
                                            >
                                                {profile.subscription_tier === 'pro' && '⭐ '}
                                                {profile.subscription_tier}
                                            </span>
                                        </td>

                                        {/* Role */}
                                        <td className="px-6 py-4 text-center">
                                            <span
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${profile.role === 'admin'
                                                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                                                        : 'bg-white/5 text-slate-400 border border-white/10'
                                                    }`}
                                            >
                                                {profile.role}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => setEditingProfile(profile)}
                                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#3f68e4] bg-[#3f68e4]/10 hover:bg-[#3f68e4]/20 border border-[#3f68e4]/20 transition-colors"
                                            >
                                                ✏️ Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-500">
                                            {search ? `No users found matching "${search}"` : 'No users found'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {editingProfile && (
                <EditUserModal
                    profile={editingProfile}
                    onClose={() => setEditingProfile(null)}
                    onSaved={handleSaved}
                />
            )}
        </div>
    )
}
