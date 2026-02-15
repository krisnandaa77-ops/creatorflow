'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Lightbulb, MoreHorizontal, Pencil } from 'lucide-react'
import { cn } from '@/lib/utils'

interface IdeaCardProps {
    idea: {
        id: string
        title: string
        description?: string | null
        reference_link?: string | null
        platform?: string
        created_at?: string
    }
    onClick?: () => void
    index?: number
}

export function IdeaCard({ idea, onClick, index = 0 }: IdeaCardProps) {
    // Soft pastel accent colors for visual variety
    const accents = [
        { bg: 'bg-blue-50', icon: 'text-blue-500', border: 'border-blue-100' },
        { bg: 'bg-amber-50', icon: 'text-amber-500', border: 'border-amber-100' },
        { bg: 'bg-emerald-50', icon: 'text-emerald-500', border: 'border-emerald-100' },
        { bg: 'bg-violet-50', icon: 'text-violet-500', border: 'border-violet-100' },
        { bg: 'bg-rose-50', icon: 'text-rose-500', border: 'border-rose-100' },
        { bg: 'bg-cyan-50', icon: 'text-cyan-500', border: 'border-cyan-100' },
    ]
    const accent = accents[index % accents.length]

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, type: 'spring', stiffness: 200 }}
            whileHover={{ y: -6, scale: 1.02 }}
            onClick={onClick}
            className="group relative bg-white rounded-[32px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] border border-slate-100 cursor-pointer transition-all duration-300"
        >
            {/* Top Row: Icon + Edit */}
            <div className="flex justify-between items-start mb-4">
                <div className={cn("p-2.5 rounded-2xl", accent.bg)}>
                    <Lightbulb className={cn("h-5 w-5", accent.icon)} />
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={(e) => { e.stopPropagation(); onClick?.() }}
                        className="p-2 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-blue-600 transition-colors"
                        title="Edit idea"
                    >
                        <Pencil size={14} />
                    </button>
                    {idea.reference_link && (
                        <a
                            href={idea.reference_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 rounded-xl hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors"
                            title="Open reference"
                        >
                            <ExternalLink size={14} />
                        </a>
                    )}
                </div>
            </div>

            {/* Title */}
            <h3 className="font-bold text-slate-900 text-base leading-snug mb-2 line-clamp-2">
                {idea.title}
            </h3>

            {/* Description */}
            {idea.description && (
                <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 mb-4">
                    {idea.description}
                </p>
            )}

            {/* Reference Link Badge */}
            {idea.reference_link && (
                <div className={cn("inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full", accent.bg, accent.icon, accent.border, "border")}>
                    <ExternalLink size={10} />
                    <span className="truncate max-w-[180px]">
                        {idea.reference_link.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}
                    </span>
                </div>
            )}

            {/* Date Footer */}
            {idea.created_at && (
                <div className="mt-4 pt-3 border-t border-slate-50">
                    <p className="text-[11px] text-slate-400 font-medium">
                        Added {new Date(idea.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                </div>
            )}
        </motion.div>
    )
}
