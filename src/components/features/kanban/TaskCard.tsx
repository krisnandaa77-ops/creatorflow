'use client'

import { useSortable } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { KanbanCard } from '@/components/KanbanCard'
import { cn } from '@/lib/utils'

interface TaskCardProps {
    task: any
    talents: any[]
    onEdit?: (task: any) => void
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

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={cn("touch-none w-full min-w-0 max-w-full", isDragging ? "opacity-30" : "")}
            suppressHydrationWarning
        >
            <div ref={setDroppableRef} className={cn("rounded-[32px] transition-all w-full min-w-0 max-w-full overflow-hidden", isOver && "ring-2 ring-blue-500 ring-offset-2")}>
                <KanbanCard
                    task={task}
                    onClick={() => onEdit && onEdit(task)}
                />
            </div>
        </div>
    )
}
