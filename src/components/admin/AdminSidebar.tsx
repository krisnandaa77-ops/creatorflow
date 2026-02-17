
'use client'

import React from 'react'
import Link from 'next/link'
import { LayoutDashboard, Users, CreditCard, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
    { name: 'Overview', id: 'overview', icon: LayoutDashboard },
    { name: 'User Management', id: 'users', icon: Users },
    { name: 'Transactions', id: 'transactions', icon: CreditCard },
]

interface AdminSidebarProps {
    activeTab: string
    setActiveTab: (tab: string) => void
}

export function AdminSidebar({ activeTab, setActiveTab }: AdminSidebarProps) {
    return (
        <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col h-screen sticky top-0">
            <div className="p-6">
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Admin Panel
                </h2>
            </div>

            <nav className="flex-1 px-4 space-y-1">
                {NAV_ITEMS.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={cn(
                            "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group font-medium",
                            activeTab === item.id
                                ? "bg-blue-600/20 text-blue-400"
                                : "text-slate-400 hover:text-white hover:bg-white/5"
                        )}
                    >
                        <item.icon className={cn(
                            "w-5 h-5 transition-colors",
                            activeTab === item.id ? "text-blue-400" : "text-slate-500 group-hover:text-blue-400"
                        )} />
                        {item.name}
                    </button>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <Link
                    href="/dashboard"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to App
                </Link>
            </div>
        </aside>
    )
}
