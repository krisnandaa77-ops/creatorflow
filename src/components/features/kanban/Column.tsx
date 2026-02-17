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
        <div className="flex flex-col w-80 flex-shrink-0 h-full">
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="font-bold text-slate-600 flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${id === 'Idea' ? 'bg-blue-500' :
                        id === 'To-Do' ? 'bg-amber-500' :
                            id === 'Filming' ? 'bg-purple-500' :
                                id === 'Editing' ? 'bg-pink-500' : 'bg-green-500'
                        }`}></span>
                    {title}
                </h3>
                <span className="text-xs font-medium text-slate-500 bg-white px-2 py-1 rounded-full border border-slate-200">
                    {tasks.length}
                </span>
            </div>

            {/* Drop Zone */}
            <div ref={setNodeRef} className="flex-1 bg-slate-100/50 rounded-[32px] border border-dashed border-slate-200 p-2 overflow-hidden flex flex-col">
                <ScrollArea className="flex-1 -mr-3 pr-3">
                    <div className="flex flex-col gap-3 pb-4 min-h-[50px]">
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

                {tasks.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2 opacity-60 min-h-[150px]">
                        <p className="text-xs font-medium">Drop items here</p>
                    </div>
                )}
            </div>
        </div>
    )
}
