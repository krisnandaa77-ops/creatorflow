'use client'

import { useSortable } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Instagram, Video, Youtube, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TaskCardProps {
    task: any
    talents: any[]
    onEdit?: (task: any) => void
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
            return null
    }
}

export function TaskCard({ task, talents, onEdit }: TaskCardProps) {
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
    })

    // Make the card droppable for talents
    const { setNodeRef: setDroppableRef, isOver } = useDroppable({
        id: `droppable-${task.id}`,
        data: {
            type: 'Content',
            contentId: task.id,
        },
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    // Filter talents assigned to this task
    const assignedTalents = task.content_talents?.map((ct: any) => ct.talent).filter(Boolean) || []

    function handleClick(e: React.MouseEvent) {
        // Only trigger edit if we didn't just finish dragging
        if (!isDragging && onEdit) {
            onEdit(task)
        }
    }

    // Check if today matches production or upload date
    const today = new Date().toISOString().split('T')[0]
    const prodDate = task.production_date ? new Date(task.production_date).toISOString().split('T')[0] : null
    const uploadDate = task.upload_date ? new Date(task.upload_date).toISOString().split('T')[0] : null
    const isTodayAction = prodDate === today || uploadDate === today

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={cn("touch-none", isDragging ? "opacity-50" : "")}
        >
            <div ref={setDroppableRef}>
                <Card
                    onClick={handleClick}
                    className={cn(
                        "cursor-grab active:cursor-grabbing hover:border-indigo-200 transition-all duration-300 rounded-2xl border-zinc-100 shadow-sm",
                        isOver && "ring-2 ring-indigo-500 bg-indigo-50/50",
                        isTodayAction && "ring-2 ring-indigo-500/10 shadow-[0_0_25px_rgba(99,102,241,0.2)] border-indigo-100"
                    )}
                >
                    <CardHeader className="p-3 pb-0 space-y-1">
                        <div className="flex justify-between items-start">
                            <Badge variant="outline" className="flex items-center gap-1 text-[10px] px-2 py-0.5 h-6 rounded-full bg-zinc-50 border-zinc-200 text-zinc-600 font-medium">
                                <PlatformIcon platform={task.platform} />
                                {task.platform}
                            </Badge>
                        </div>
                        <h4 className="font-semibold text-sm line-clamp-2">{task.title}</h4>
                    </CardHeader>
                    <CardContent className="p-3 pt-2">
                        {/* Date indicators */}
                        {(task.production_date || task.upload_date) && (
                            <div className="flex flex-wrap gap-1 mb-2">
                                {task.production_date && (
                                    <span className="text-[9px] bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 px-1.5 py-0.5 rounded">
                                        🎬 {new Date(task.production_date).toLocaleDateString()}
                                    </span>
                                )}
                                {task.upload_date && (
                                    <span className="text-[9px] bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 px-1.5 py-0.5 rounded">
                                        🚀 {new Date(task.upload_date).toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                        )}
                        <div className="flex justify-between items-center">
                            <div className="flex -space-x-2 overflow-hidden">
                                {assignedTalents.map((talent: any) => (
                                    <Avatar key={talent.id} className="h-6 w-6 border-2 border-background">
                                        <AvatarImage src={talent.avatar_url} />
                                        <AvatarFallback className="text-[9px]">{talent.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                ))}
                            </div>
                            {task.due_date && (
                                <div className="flex items-center text-[10px] text-muted-foreground gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(task.due_date).toLocaleDateString()}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
