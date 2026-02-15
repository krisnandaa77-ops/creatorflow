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
        <aside className="fixed left-4 top-4 bottom-4 w-64 rounded-3xl bg-blue-700/95 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.2)] flex flex-col p-6 z-50 overflow-hidden">
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

            {/* User Profile / Footer (Optional placeholder) */}
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
    )
}
