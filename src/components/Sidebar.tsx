'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Lightbulb, CheckSquare, Calendar, Users, Zap, Settings } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { UserSettingsModal } from './UserSettingsModal'

const sidebarItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Idea Bank', href: '/ideabank', icon: Lightbulb },
    { name: 'Daily Focus', href: '/todo', icon: CheckSquare },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
    { name: 'Talents', href: '/talents', icon: Users },
]

export function Sidebar() {
    const pathname = usePathname()
    const [settingsOpen, setSettingsOpen] = useState(false)
    const [userName, setUserName] = useState('User')
    const [userPlan, setUserPlan] = useState('Free Plan')
    const [userAvatar, setUserAvatar] = useState<string | null>(null)

    // Fetch user profile data
    useEffect(() => {
        async function fetchUser() {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data: profile } = await supabase
                .from('profiles')
                .select('full_name, avatar_url, subscription_tier')
                .eq('id', user.id)
                .single()

            if (profile) {
                setUserName(profile.full_name || user.email?.split('@')[0] || 'User')
                setUserPlan(profile.subscription_tier === 'pro' ? 'Pro Plan' : 'Free Plan')
                setUserAvatar(profile.avatar_url)

                // Track last_seen
                await supabase.from('profiles').update({ last_seen: new Date().toISOString() }).eq('id', user.id)
            }
        }
        fetchUser()
    }, [settingsOpen]) // Re-fetch when modal closes (settingsOpen changes)

    const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

    return (
        <>
            {/* ===== MOBILE BOTTOM NAV (< lg) ===== */}
            <nav
                className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-blue-700/90 backdrop-blur-xl border-t border-white/10 shadow-[0_-4px_24px_rgba(0,0,0,0.15)]"
                style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
            >
                <div className="flex items-center justify-around px-2 pt-2 pb-1">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link key={item.name} href={item.href} className="relative flex flex-col items-center gap-0.5 px-1 py-1 min-w-0">
                                {isActive && (
                                    <motion.div
                                        layoutId="bottomnav-active"
                                        className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-white rounded-full"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    />
                                )}
                                <div className={cn(
                                    "p-1.5 rounded-xl transition-all duration-200",
                                    isActive ? "bg-white/20 scale-110" : ""
                                )}>
                                    <item.icon className={cn(
                                        "w-5 h-5 transition-colors",
                                        isActive ? "text-white" : "text-white/50"
                                    )} />
                                </div>
                                <span className={cn(
                                    "text-[10px] font-medium truncate max-w-[56px] transition-colors",
                                    isActive ? "text-white font-bold" : "text-white/50"
                                )}>
                                    {item.name}
                                </span>
                            </Link>
                        )
                    })}
                    {/* Settings icon in mobile nav */}
                    <button
                        onClick={() => setSettingsOpen(true)}
                        className="relative flex flex-col items-center gap-0.5 px-1 py-1 min-w-0"
                    >
                        <div className="p-1.5 rounded-xl">
                            <Settings className="w-5 h-5 text-white/50" />
                        </div>
                        <span className="text-[10px] font-medium text-white/50">Settings</span>
                    </button>
                </div>
            </nav>

            {/* ===== DESKTOP SIDEBAR (lg+) ===== */}
            <aside className="hidden lg:flex fixed left-4 top-4 bottom-4 w-64 rounded-3xl bg-blue-700/95 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.2)] flex-col p-6 z-50 overflow-hidden">
                {/* Logo Section */}
                <div className="mb-10 flex items-center gap-3">
                    <div className="relative h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center overflow-hidden">
                        <Zap className="h-6 w-6 text-white" fill="currentColor" />
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent"
                            animate={{
                                x: ['-100%', '100%'],
                            }}
                            transition={{
                                repeat: Infinity,
                                duration: 2,
                                ease: "linear",
                                repeatDelay: 3
                            }}
                        />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">CreatorFlow</h1>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-2">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link key={item.name} href={item.href}>
                                <div className={cn(
                                    "relative flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group",
                                    isActive ? "text-blue-700" : "text-white/70 hover:text-white hover:bg-white/10"
                                )}>
                                    {isActive && (
                                        <motion.div
                                            layoutId="sidebar-active"
                                            className="absolute inset-0 bg-white rounded-2xl"
                                            initial={false}
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    <item.icon className={cn("h-5 w-5 relative z-10", isActive && "text-blue-700")} />
                                    <span className={cn("font-medium relative z-10", isActive && "font-bold")}>
                                        {item.name}
                                    </span>
                                </div>
                            </Link>
                        )
                    })}
                </nav>

                {/* User Profile / Footer — Clickable to open Settings */}
                <div className="mt-auto pt-6 border-t border-white/10">
                    <button
                        onClick={() => setSettingsOpen(true)}
                        className="w-full flex items-center gap-3 px-2 py-2 rounded-2xl hover:bg-white/10 transition-colors group"
                    >
                        <div className="h-10 w-10 rounded-full border-2 border-white/20 overflow-hidden flex items-center justify-center bg-gradient-to-br from-indigo-400 to-purple-400 flex-shrink-0">
                            {userAvatar ? (
                                <img src={userAvatar} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-xs font-bold text-white">{initials}</span>
                            )}
                        </div>
                        <div className="flex-1 text-left">
                            <p className="text-sm font-medium text-white truncate">{userName}</p>
                            <p className="text-xs text-blue-200">{userPlan}</p>
                        </div>
                        <Settings className="w-4 h-4 text-white/30 group-hover:text-white/60 transition-colors" />
                    </button>
                </div>
            </aside>

            {/* Settings Modal */}
            <UserSettingsModal
                isOpen={settingsOpen}
                onClose={() => setSettingsOpen(false)}
            />
        </>
    )
}
