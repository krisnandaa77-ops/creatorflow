'use client'

import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { motion } from 'framer-motion'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Instagram, Video, Youtube, Clapperboard, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

interface KanbanCardProps {
    task: any
    talents: any[]
    onEdit?: (task: any) => void
    overlay?: boolean
}

const PlatformIcon = ({ platform }: { platform: string }) => {
    switch (platform) {
        case 'Instagram':
            return <Instagram className="h-3 w-3 text-pink-500" />
        case 'TikTok':
            return <Video className="h-3 w-3 text-black dark:text-white" />
        case 'YouTube':
            return <Youtube className="h-3 w-3 text-red-500" />
        default:
            return <Video className="h-3 w-3 text-zinc-500" />
    }
}

export function KanbanCard({ task, talents, onEdit, overlay }: KanbanCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
        data: {
            type: 'Task',
            task,
        },
        disabled: overlay
    })

    const { setNodeRef: setDroppableRef, isOver } = useDroppable({
        id: `droppable-${task.id}`,
        data: {
            type: 'Content',
            contentId: task.id,
        },
        disabled: overlay
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    const assignedTalents = task.content_talents?.map((ct: any) => ct.talent).filter(Boolean) || []

    const today = new Date().toISOString().split('T')[0]
    const prodDate = task.production_date ? new Date(task.production_date).toISOString().split('T')[0] : null
    const uploadDate = task.upload_date ? new Date(task.upload_date).toISOString().split('T')[0] : null
    const isTodayAction = prodDate === today || uploadDate === today

    const handleClick = (e: React.MouseEvent) => {
        if (!isDragging && onEdit && !overlay) {
            onEdit(task)
        }
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={cn("touch-none", isDragging ? "opacity-30" : "")}
        >
            <div ref={setDroppableRef}>
                <motion.div
                    whileHover={{ scale: 1.02, translateY: -2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                    <Card
                        onClick={handleClick}
                        className={cn(
                            "cursor-grab active:cursor-grabbing hover:shadow-[0_20px_50px_-12px_rgba(79,70,229,0.1)] transition-all duration-300 rounded-2xl md:rounded-[32px] border-zinc-100 shadow-sm bg-white overflow-hidden w-full max-w-full box-border",
                            isOver && "ring-2 ring-indigo-500 bg-indigo-50/50",
                            isTodayAction && "ring-2 ring-indigo-500/10 shadow-[0_0_25px_rgba(99,102,241,0.2)] border-indigo-100"
                        )}
                    >
                        <CardHeader className="p-4 pb-0 space-y-2">
                            <div className="flex justify-between items-start">
                                {/* Animated Platform Badge */}
                                <motion.div whileHover={{ rotate: [0, -5, 5, -5, 5, 0] }}>
                                    <Badge variant="outline" className="flex items-center gap-1.5 text-[10px] px-2.5 py-1 h-7 rounded-full bg-zinc-50 border-zinc-200 text-zinc-600 font-medium hover:bg-zinc-100 transition-colors">
                                        <PlatformIcon platform={task.platform} />
                                        {task.platform}
                                    </Badge>
                                </motion.div>

                                {isTodayAction && (
                                    <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-indigo-200 rounded-full text-[10px] px-2 h-5">Today</Badge>
                                )}
                            </div>

                            <div className="flex items-start gap-2">
                                <motion.div
                                    className="mt-0.5 text-indigo-500 bg-indigo-50 p-1 rounded-lg"
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                                >
                                    <Clapperboard size={14} />
                                </motion.div>
                                <h4 className="font-semibold text-sm leading-snug text-zinc-800 line-clamp-2">{task.title}</h4>
                            </div>
                        </CardHeader>

                        <CardContent className="p-4 pt-3 space-y-3">
                            {/* Script Preview */}
                            {task.script && (
                                <div className="text-xs text-zinc-500 bg-zinc-50/80 p-2 rounded-xl italic line-clamp-2 border border-zinc-100/50">
                                    "{task.script}"
                                </div>
                            )}

                            {/* Date Indicators */}
                            {(task.production_date || task.upload_date) && (
                                <div className="flex flex-wrap gap-1.5">
                                    {task.production_date && (
                                        <span className="text-[10px] flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-100 px-2 py-1 rounded-full font-medium">
                                            🎬 {new Date(task.production_date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                        </span>
                                    )}
                                    {task.upload_date && (
                                        <span className="text-[10px] flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-1 rounded-full font-medium">
                                            🚀 {new Date(task.upload_date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                        </span>
                                    )}
                                </div>
                            )}

                            <div className="flex justify-between items-center pt-1">
                                {/* Stacked Avatars */}
                                <div className="flex -space-x-2 overflow-hidden pl-1">
                                    {assignedTalents.length > 0 ? (
                                        assignedTalents.map((talent: any) => (
                                            <Avatar key={talent.id} className="h-7 w-7 border-2 border-white ring-1 ring-zinc-100">
                                                <AvatarImage src={talent.avatar_url} />
                                                <AvatarFallback className="text-[9px] bg-zinc-100 text-zinc-600 font-bold">
                                                    {talent.name.substring(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                        ))
                                    ) : (
                                        <div className="h-7 w-7 rounded-full border-2 border-dashed border-zinc-200 flex items-center justify-center bg-zinc-50">
                                            <span className="text-[9px] text-zinc-300">+</span>
                                        </div>
                                    )}
                                </div>

                                {task.due_date && (
                                    <div className="flex items-center text-[10px] text-zinc-400 gap-1 font-medium bg-zinc-50 px-2 py-1 rounded-full">
                                        <Calendar className="h-3 w-3" />
                                        {new Date(task.due_date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    )
}
