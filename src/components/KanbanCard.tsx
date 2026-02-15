'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Clapperboard, Instagram, Video, MoreHorizontal, Youtube, FileDown } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { exportContentToPDF } from '@/lib/pdf-generator'

interface KanbanCardProps {
    task: {
        id: string
        title: string
        description?: string | null
        platform?: string
        reference_link?: string | null
        production_date?: string | null
        upload_date?: string | null
        script?: string | null
        status?: string
        content_talents?: any[]
        [key: string]: any
    }
    onClick?: () => void
}

export function KanbanCard({ task, onClick }: KanbanCardProps) {
    const platform = task.platform || 'TikTok'

    const assignedTalents = task.content_talents
        ?.map((ct: any) => ct.talent)
        .filter(Boolean) || []

    return (
        <motion.div
            onClick={onClick}
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="group relative bg-white rounded-[32px] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] border border-slate-100 cursor-grab active:cursor-grabbing transition-all duration-300"
        >
            {/* Header: Platform & Options */}
            <div className="flex justify-between items-start mb-4">
                <motion.div
                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                >
                    <Badge variant="secondary" className={cn(
                        "rounded-full px-3 py-1 text-[10px] font-bold flex items-center gap-1.5 border-none",
                        platform === 'Instagram' ? "bg-pink-50 text-pink-600" :
                            platform === 'TikTok' ? "bg-slate-900 text-white" :
                                "bg-red-50 text-red-600"
                    )}>
                        {platform === 'Instagram' && <Instagram size={10} />}
                        {platform === 'TikTok' && <Video size={10} fill="currentColor" />}
                        {platform === 'YouTube' && <Youtube size={10} />}
                        {platform}
                    </Badge>
                </motion.div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            exportContentToPDF(task)
                        }}
                        className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-blue-600 transition-all p-1 hover:bg-blue-50 rounded-lg"
                        title="Download PDF Brief"
                    >
                        <FileDown size={16} />
                    </button>
                    <button className="text-slate-300 hover:text-slate-500 transition-colors p-1 hover:bg-slate-50 rounded-full">
                        <MoreHorizontal size={18} />
                    </button>
                </div>
            </div>

            {/* Title Section */}
            <div className="mb-4">
                <div className="flex items-start gap-2 mb-2">
                    <div className="mt-0.5 p-1 bg-blue-50 rounded-lg shrink-0">
                        <Clapperboard className="text-blue-600" size={14} />
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm leading-snug pt-0.5">
                        {task.title}
                    </h3>
                </div>
                {task.description && (
                    <p className="text-xs text-slate-500 font-medium line-clamp-2 pl-9">
                        {task.description}
                    </p>
                )}
            </div>

            {/* Footer: Dates & Talents */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
                <div className="flex flex-wrap gap-1.5">
                    {task.production_date && (
                        <div className="flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-1 rounded-full">
                            <span>🎬</span>
                            <span>{new Date(task.production_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                        </div>
                    )}
                    {task.upload_date && (
                        <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-full">
                            <span>🚀</span>
                            <span>{new Date(task.upload_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                        </div>
                    )}
                </div>

                <div className="flex -space-x-2 pl-2">
                    {assignedTalents.map((talent: any, i: number) => (
                        <Avatar key={talent?.id || i} className="h-7 w-7 border-2 border-white ring-1 ring-slate-100 shadow-sm">
                            <AvatarImage src={talent?.avatar_url} />
                            <AvatarFallback className="text-[9px] font-bold bg-blue-50 text-blue-600">
                                {talent?.name ? talent.name.slice(0, 2).toUpperCase() : '??'}
                            </AvatarFallback>
                        </Avatar>
                    ))}
                </div>
            </div>
        </motion.div>
    )
}
