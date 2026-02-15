'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, Lightbulb, CheckSquare, Calendar, Users, Settings, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: Lightbulb, label: 'Idea Bank', href: '/ideas' },
    { icon: CheckSquare, label: 'Daily Focus', href: '/todo' },
    { icon: Calendar, label: 'Calendar', href: '/calendar' },
    { icon: Users, label: 'Talents', href: '/talents' },
]

export function AnimatedSidebar() {
    const pathname = usePathname()

    return (
        <motion.div
            initial={{ x: -250, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="hidden md:flex flex-col h-screen w-72 bg-blue-700/95 backdrop-blur-xl text-white shadow-2xl relative overflow-hidden"
        >
            {/* Decorative Gradients */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/50 to-transparent pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-500/30 rounded-full blur-3xl pointer-events-none" />

            {/* Logo Section */}
            <div className="p-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="relative group cursor-default"
                >
                    <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-white bg-[length:200%_auto] animate-shimmer">
                        CreatorFlow
                    </h1>
                    <div className="absolute -bottom-1 left-0 w-12 h-1 bg-white/30 rounded-full group-hover:w-full transition-all duration-500 ease-out" />
                </motion.div>
                <p className="text-blue-200 text-xs mt-2 font-medium tracking-wide">PREMIUM CONTENT SUITE</p>
            </div>

            {/* Navigation */}
            <div className="flex-1 px-4 py-6 relative z-10">
                <nav className="space-y-2">
                    {navItems.map((item, index) => {
                        const isActive = pathname === item.href

                        return (
                            <motion.div
                                key={item.href}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                            >
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-4 px-6 py-3.5 rounded-full transition-all duration-300 group relative overflow-hidden",
                                        isActive
                                            ? "bg-white text-blue-700 shadow-lg shadow-blue-900/20 font-semibold scale-105"
                                            : "text-blue-100 hover:bg-white/10 hover:text-white"
                                    )}
                                >
                                    <item.icon
                                        className={cn(
                                            "h-5 w-5 transition-transform duration-300",
                                            isActive ? "scale-110" : "group-hover:scale-110"
                                        )}
                                        strokeWidth={isActive ? 2.5 : 2}
                                    />
                                    <span className="relative z-10">{item.label}</span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="activePill"
                                            className="absolute inset-0 bg-white rounded-full z-0"
                                            initial={false}
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                </Link>
                            </motion.div>
                        )
                    })}
                </nav>
            </div>

            {/* Bottom Actions */}
            <div className="p-6 relative z-10 space-y-3">
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="w-full flex items-center gap-3 px-6 py-3 text-blue-200 hover:text-white hover:bg-white/10 rounded-full transition-colors text-sm font-medium"
                >
                    <Settings className="h-4 w-4" />
                    Settings
                </motion.button>
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="w-full flex items-center gap-3 px-6 py-3 text-red-300 hover:text-red-100 hover:bg-red-500/20 rounded-full transition-colors text-sm font-medium"
                >
                    <LogOut className="h-4 w-4" />
                    Logout
                </motion.button>
            </div>
        </motion.div>
    )
}
