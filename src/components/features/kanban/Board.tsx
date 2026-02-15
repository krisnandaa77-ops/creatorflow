'use client'

import { useState, useEffect } from 'react'
import {
    DndContext,
    DragOverlay,
    useSensor,
    useSensors,
    PointerSensor,
    KeyboardSensor,
    closestCorners,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
    defaultDropAnimationSideEffects,
} from '@dnd-kit/core'
import { motion } from 'framer-motion'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { Column } from './Column'
import { KanbanCard } from './KanbanCard'
import { DraggableTalent } from './DraggableTalent'
import { EditContentModal } from './EditContentModal'
import { updateContentStatus, assignTalentToContent } from '@/actions/content-actions'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface BoardProps {
    initialTasks: any[]
    talents: any[]
}

const COLUMNS = [
    { id: 'Idea', title: 'Idea' },
    { id: 'To-Do', title: 'To-Do' },
    { id: 'Filming', title: 'Filming' },
    { id: 'Editing', title: 'Editing' },
    { id: 'Done', title: 'Done' },
]

export function Board({ initialTasks, talents }: BoardProps) {
    const [tasks, setTasks] = useState(initialTasks)
    const [activeId, setActiveId] = useState<string | null>(null)
    const [activeType, setActiveType] = useState<'Task' | 'Talent' | null>(null)
    const [activeItem, setActiveItem] = useState<any>(null)

    // Edit modal state
    const [editingTask, setEditingTask] = useState<any | null>(null)
    const [editModalOpen, setEditModalOpen] = useState(false)

    useEffect(() => {
        setTasks(initialTasks)
    }, [initialTasks])

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    function handleEditTask(task: any) {
        setEditingTask(task)
        setEditModalOpen(true)
    }

    function handleSaveTask(updatedTask: any) {
        // Optimistic update
        setTasks(prev =>
            prev.map(t => (t.id === updatedTask.id ? updatedTask : t))
        )
    }

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event
        setActiveId(active.id as string)

        if (active.data.current?.type === 'Talent') {
            setActiveType('Talent')
            setActiveItem(active.data.current.talent)
        } else {
            setActiveType('Task')
            setActiveItem(active.data.current?.task)
        }
    }

    const handleDragOver = (event: DragOverEvent) => {
        // Only needed for sorting logic
    }

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event
        setActiveId(null)
        setActiveType(null)
        setActiveItem(null)

        if (!over) return

        // Scenario 1: Dragging a Talent onto a Card
        if (active.data.current?.type === 'Talent' && over.data.current?.type === 'Content') {
            const talentId = active.data.current.talent.id
            const contentId = over.data.current.contentId
            const talentName = active.data.current.talent.name

            setTasks((prevTasks) => {
                return prevTasks.map(t => {
                    if (t.id === contentId) {
                        const exists = t.content_talents?.some((ct: any) => ct.talent?.id === talentId)
                        if (exists) return t;

                        return {
                            ...t,
                            content_talents: [
                                ...(t.content_talents || []),
                                { talent: active.data.current?.talent }
                            ]
                        }
                    }
                    return t
                })
            })

            toast.promise(assignTalentToContent(contentId, talentId), {
                loading: `Assigning ${talentName}...`,
                success: `Assigned ${talentName}`,
                error: `Failed to assign ${talentName}`
            })
            return
        }

        // Scenario 2: Dragging a Task to a Column (Status Change)
        if (active.data.current?.type === 'Task') {
            const taskId = active.id as string
            const overId = over.id
            const overData = over.data.current

            let newStatus = ''

            if (overData?.type === 'Column') {
                newStatus = overData.status
            } else if (overData?.type === 'Task') {
                const overTask = tasks.find(t => t.id === overId)
                if (overTask) newStatus = overTask.status
            }

            if (newStatus && newStatus !== active.data.current.task.status) {
                setTasks((prev) =>
                    prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t)
                )

                toast.promise(updateContentStatus(taskId, newStatus as any), {
                    loading: 'Updating status...',
                    success: `Moved to ${newStatus}`,
                    error: 'Failed to update status'
                })
            }
        }
    }

    const getTasksByStatus = (status: string) => {
        return tasks.filter(task => task.status === status)
    }

    return (
        <>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ staggerChildren: 0.1 }}
                    className="flex h-[calc(100vh-200px)] gap-6 overflow-x-auto pb-4 px-2"
                >
                    {/* Kanban Board Area */}
                    <div className="flex gap-6 flex-1 min-w-max">
                        {COLUMNS.map((col) => (
                            <motion.div
                                key={col.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                            >
                                <Column
                                    id={col.id}
                                    title={col.title}
                                    tasks={getTasksByStatus(col.id)}
                                    talents={talents}
                                    onEditTask={handleEditTask}
                                />
                            </motion.div>
                        ))}
                    </div>

                    {/* Right Sidebar: Talents */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5, duration: 0.4 }}
                        className="w-64 border-l pl-6 flex flex-col gap-4 bg-transparent"
                    >
                        <h3 className="font-semibold text-zinc-900">Talents</h3>
                        <div className="flex flex-col gap-3">
                            {talents.map(talent => (
                                <DraggableTalent key={talent.id} talent={talent} />
                            ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
                            Drag talents onto cards to assign them to specific tasks.
                        </p>
                    </motion.div>
                </motion.div>

                <DragOverlay dropAnimation={{
                    sideEffects: defaultDropAnimationSideEffects({
                        styles: {
                            active: {
                                opacity: '0.5',
                            },
                        },
                    }),
                }}>
                    {activeId && activeType === 'Task' ? (
                        <motion.div
                            initial={{ rotate: 0, scale: 1 }}
                            animate={{ rotate: 3, scale: 1.05 }}
                            className="w-[280px] cursor-grabbing"
                            style={{ transformOrigin: "50% 50%" }}
                        >
                            <KanbanCard task={activeItem} talents={talents} overlay />
                        </motion.div>
                    ) : activeId && activeType === 'Talent' ? (
                        <div className="flex items-center gap-2 p-2 rounded-full bg-white border border-zinc-200 shadow-xl cursor-grabbing scale-105 rotate-3 w-max">
                            <Avatar className="h-8 w-8 ring-2 ring-white">
                                <AvatarImage src={activeItem.avatar_url} />
                                <AvatarFallback>{activeItem.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-semibold text-zinc-900">{activeItem.name}</span>
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>

            {/* Edit Content Modal */}
            {editingTask && (
                <EditContentModal
                    task={editingTask}
                    talents={talents}
                    open={editModalOpen}
                    onOpenChange={(open) => {
                        setEditModalOpen(open)
                        if (!open) setEditingTask(null)
                    }}
                    onSave={handleSaveTask}
                />
            )}
        </>
    )
}
