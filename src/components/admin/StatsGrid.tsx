
import React from 'react'
import { Users, UserCheck, DollarSign, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatsGridProps {
    stats: {
        totalUsers: number
        proUsers: number
        totalRevenue: number
        pendingSupport: number
    }
}

export function StatsGrid({ stats }: StatsGridProps) {
    const CARDS = [
        {
            label: 'Total Users',
            value: stats.totalUsers,
            icon: Users,
            color: 'text-blue-400',
            bg: 'bg-blue-400/10',
            border: 'border-blue-400/20'
        },
        {
            label: 'Pro Subscribers',
            value: stats.proUsers,
            icon: UserCheck,
            color: 'text-emerald-400',
            bg: 'bg-emerald-400/10',
            border: 'border-emerald-400/20'
        },
        {
            label: 'Total Revenue',
            value: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(stats.totalRevenue),
            icon: DollarSign,
            color: 'text-amber-400',
            bg: 'bg-amber-400/10',
            border: 'border-amber-400/20'
        },
        {
            label: 'Pending Support',
            value: stats.pendingSupport,
            icon: Clock,
            color: 'text-purple-400',
            bg: 'bg-purple-400/10',
            border: 'border-purple-400/20'
        },
    ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            {CARDS.map((card) => (
                <div
                    key={card.label}
                    className={cn(
                        "relative overflow-hidden rounded-2xl p-5 border backdrop-blur-xl transition-all hover:scale-[1.02]",
                        "bg-white/5",
                        card.border
                    )}
                >
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-slate-400 text-sm font-medium">{card.label}</p>
                            <h3 className="text-2xl md:text-3xl font-bold text-white mt-2">
                                {card.value}
                            </h3>
                        </div>
                        <div className={cn("p-2.5 rounded-xl", card.bg, card.color)}>
                            <card.icon size={22} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
