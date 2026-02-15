'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, Instagram, Youtube, Video, CheckCircle2, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TaskCardProps {
    id: string
    title: string
    platform?: 'Instagram' | 'TikTok' | 'YouTube'
    time?: string
    priority?: 'High' | 'Medium' | 'Low'
    isCompleted: boolean
    onToggle: () => void
    type: 'content' | 'manual'
}

const PlatformIcon = ({ platform }: { platform?: string }) => {
    switch (platform) {
        case 'Instagram': return <Instagram className="h-3.5 w-3.5 text-pink-600" />
        case 'TikTok': return <Video className="h-3.5 w-3.5 text-black" />
        case 'YouTube': return <Youtube className="h-3.5 w-3.5 text-red-600" />
        default: return null
    }
}

export function TaskCard({ title, platform, time, priority, isCompleted, onToggle, type }: TaskCardProps) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ scale: 1.02, translateY: -2 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
            <Card
                className={cn(
                    "p-4 rounded-3xl border-transparent shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 cursor-pointer group",
                    isCompleted ? "bg-slate-50/50" : "bg-white"
                )}
                onClick={onToggle}
            >
                <div className="flex items-start gap-3">
                    {/* Bouncy Checkbox */}
                    <motion.div
                        whileTap={{ scale: 0.8 }}
                        className={cn(
                            "mt-1 flex-shrink-0 cursor-pointer transition-colors",
                            isCompleted ? "text-emerald-500" : "text-slate-300 group-hover:text-indigo-400"
                        )}
                    >
                        {isCompleted ? <CheckCircle2 size={24} /> : <Circle size={24} strokeWidth={1.5} />}
                    </motion.div>

                    <div className="flex-1 space-y-2">
                        <div className="flex justify-between items-start">
                            <h3 className={cn(
                                "font-semibold text-slate-800 text-sm leading-snug transition-all",
                                isCompleted && "text-slate-400 line-through decoration-slate-300"
                            )}>
                                {title}
                            </h3>
                            {type === 'content' && (
                                <Badge variant="secondary" className="rounded-full px-2 py-0.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 ml-2 shadow-sm border border-indigo-100 flex items-center gap-1">
                                    <PlatformIcon platform={platform} />
                                    <span className="text-[10px]">{platform}</span>
                                </Badge>
                            )}
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                            {time && (
                                <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-full border border-slate-100">
                                    <Clock size={12} className="text-slate-400" />
                                    <span>{time}</span>
                                </div>
                            )}
                            {priority && (
                                <span className={cn(
                                    "px-2 py-1 rounded-full text-[10px] border",
                                    priority === 'High' ? "bg-red-50 text-red-600 border-red-100" :
                                        priority === 'Medium' ? "bg-amber-50 text-amber-600 border-amber-100" :
                                            "bg-emerald-50 text-emerald-600 border-emerald-100"
                                )}>
                                    {priority}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </Card>
        </motion.div>
    )
}
