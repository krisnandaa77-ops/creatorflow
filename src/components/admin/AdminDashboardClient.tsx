
'use client'

import React, { useState } from 'react'
import { AdminSidebar } from './AdminSidebar'
import { StatsGrid } from './StatsGrid'
import { UserTable } from './UserTable'
import { TransactionTable } from './TransactionTable'

interface AdminDashboardClientProps {
    stats: any
    users: any[]
    payments: any[]
}

export function AdminDashboardClient({ stats, users, payments }: AdminDashboardClientProps) {
    const [activeTab, setActiveTab] = useState('overview')

    return (
        <div className="flex min-h-screen bg-slate-950 text-white selection:bg-blue-500/30">
            <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-x-hidden">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Admin Dashboard
                    </h1>
                    <p className="text-slate-400 mt-2">
                        Welcome back, Admin. Here's your platform overview.
                    </p>
                </header>

                <div className={activeTab === 'overview' ? 'block' : 'hidden'}>
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <StatsGrid stats={stats} />

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold text-slate-200">Recent Users</h2>
                                </div>
                                <UserTable users={users?.slice(0, 5) || []} />
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold text-slate-200">Recent Transactions</h2>
                                </div>
                                <TransactionTable payments={payments?.slice(0, 5) || []} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className={activeTab === 'users' ? 'block animate-in fade-in slide-in-from-bottom-4 duration-500' : 'hidden'}>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-slate-200">User Management</h2>
                        </div>
                        {/* Pass all users here */}
                        <UserTable users={users || []} />
                    </div>
                </div>

                <div className={activeTab === 'transactions' ? 'block animate-in fade-in slide-in-from-bottom-4 duration-500' : 'hidden'}>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-slate-200">Transaction History</h2>
                        </div>
                        <TransactionTable payments={payments || []} />
                    </div>
                </div>
            </main>
        </div>
    )
}
