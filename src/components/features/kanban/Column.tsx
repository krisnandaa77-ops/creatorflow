'use client'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { TaskCard } from './TaskCard'
import { ScrollArea } from '@/components/ui/scroll-area'

interface ColumnProps {
    id: string
    title: string
    tasks: any[]
    talents: any[]
    onEditTask?: (task: any) => void
}

export function Column({ id, title, tasks, talents, onEditTask }: ColumnProps) {
    const { setNodeRef } = useDroppable({
        id,
        data: {
            type: 'Column',
            status: id,
        },
    })

    return (
        <div className="flex flex-col h-full bg-muted/50 rounded-lg border p-2 w-[280px] shrink-0">
            <div className="flex items-center justify-between p-2 mb-2 font-semibold text-sm">
                <h3>{title}</h3>
                <span className="bg-muted-foreground/10 text-muted-foreground px-2 py-0.5 rounded-full text-xs">
                    {tasks.length}
                </span>
            </div>

            <ScrollArea className="flex-1">
                <div ref={setNodeRef} className="flex flex-col gap-2 min-h-[150px] p-1">
                    <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                        {tasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                talents={talents}
                                onEdit={onEditTask}
                            />
                        ))}
                    </SortableContext>
                </div>
            </ScrollArea>
        </div>
    )
}
