'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Lightbulb, CheckSquare, Calendar, Users, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const sidebarItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Idea Bank', href: '/ideabank', icon: Lightbulb },
    { name: 'Daily Focus', href: '/todo', icon: CheckSquare },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
    { name: 'Talents', href: '/talents', icon: Users },
]

export function Sidebar() {
    const pathname = usePathname()

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

                {/* User Profile / Footer */}
                <div className="mt-auto pt-6 border-t border-white/10">
                    <div className="flex items-center gap-3 px-2">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 border-2 border-white/20" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-white">Krisnanda</p>
                            <p className="text-xs text-blue-200">Pro Plan</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    )
}
