'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Check, Trash2, Instagram, Video, Youtube } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TodoItemProps {
    id: string
    title: string
    platform?: string
    done?: boolean
    type: 'shooting' | 'upload' | 'general'
    onToggle?: (id: string, done: boolean) => void
    onDelete?: (id: string) => void
}

const PlatformIcon = ({ platform }: { platform?: string }) => {
    switch (platform) {
        case 'Instagram': return <Instagram size={12} className="text-pink-500" />
        case 'TikTok': return <Video size={12} className="text-slate-800" fill="currentColor" />
        case 'YouTube': return <Youtube size={12} className="text-red-500" />
        default: return null
    }
}

export function TodoItem({ id, title, platform, done = false, type, onToggle, onDelete }: TodoItemProps) {
    const colorMap = {
        shooting: {
            check: 'bg-blue-600 border-blue-600',
            unchecked: 'border-blue-300 hover:border-blue-500',
            badge: 'bg-blue-50 text-blue-600',
        },
        upload: {
            check: 'bg-emerald-600 border-emerald-600',
            unchecked: 'border-emerald-300 hover:border-emerald-500',
            badge: 'bg-emerald-50 text-emerald-600',
        },
        general: {
            check: 'bg-amber-600 border-amber-600',
            unchecked: 'border-amber-300 hover:border-amber-500',
            badge: 'bg-amber-50 text-amber-600',
        },
    }
    const colors = colorMap[type]

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn(
                "flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 mb-3 group transition-all hover:shadow-md hover:border-slate-200",
                done && "opacity-60"
            )}
        >
            {/* Checkbox — always clickable */}
            <button
                onClick={() => onToggle?.(id, !done)}
                className={cn(
                    "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 cursor-pointer",
                    done ? `${colors.check} text-white` : colors.unchecked
                )}
            >
                {done && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400 }}>
                        <Check size={14} strokeWidth={3} />
                    </motion.div>
                )}
            </button>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    {platform && <PlatformIcon platform={platform} />}
                    <p className={cn(
                        "font-medium text-sm text-slate-800 truncate",
                        done && "line-through text-slate-400"
                    )}>
                        {title}
                    </p>
                </div>
            </div>

            {/* Delete (only general tasks) */}
            {type === 'general' && onDelete && (
                <button
                    onClick={() => onDelete(id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 text-slate-300 hover:text-red-500 transition-all"
                    title="Delete task"
                >
                    <Trash2 size={14} />
                </button>
            )}

            {/* Success flash when checked */}
            {done && (
                <motion.div
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: 2.5, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className={cn(
                        "absolute right-4 w-4 h-4 rounded-full pointer-events-none",
                        type === 'shooting' && "bg-blue-400",
                        type === 'upload' && "bg-emerald-400",
                        type === 'general' && "bg-amber-400"
                    )}
                />
            )}
        </motion.div>
    )
}
