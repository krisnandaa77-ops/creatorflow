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
import { KanbanCard } from '@/components/KanbanCard'
import { DraggableTalent } from './DraggableTalent'
import { ContentModal } from './ContentModal'
import { updateContentStatus, assignTalentToContent } from '@/actions/content-actions'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Plus } from 'lucide-react'

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

    // Modal State
    const [modalOpen, setModalOpen] = useState(false)
    const [selectedTask, setSelectedTask] = useState<any | null>(null)

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

    // Handlers
    function handleCreateNew() {
        setSelectedTask(null)
        setModalOpen(true)
    }

    function handleEditTask(task: any) {
        setSelectedTask(task)
        setModalOpen(true)
    }

    function handleSaveTask(updatedTask: any) {
        // Optimistic update handled by Next.js revalidatePath usually, 
        // but we can update local state for instant feedback if we wanted.
        // For now, we rely on the server action's revalidate.
        setModalOpen(false)
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
        // Optional sorting logic can go here
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
                // Optimistic Local Update
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
        <div className="flex flex-col h-full">
            {/* Header Integrated into Board Area */}
            <header className="mb-8 flex justify-between items-center px-2">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">
                        Welcome back, Krisnanda! ✨
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium">
                        Here's what's happening with your content today.
                    </p>
                </div>
                <button
                    onClick={handleCreateNew}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-2xl font-semibold transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                >
                    <Plus size={18} />
                    <span>New Idea</span>
                </button>
            </header>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className="flex h-[calc(100vh-200px)] gap-6 overflow-x-auto pb-4 px-2">
                    {/* Kanban Board Area */}
                    <div className="flex gap-6 flex-1 min-w-max">
                        {COLUMNS.map((col) => (
                            <Column
                                key={col.id}
                                id={col.id}
                                title={col.title}
                                tasks={getTasksByStatus(col.id)}
                                talents={talents}
                                onEditTask={handleEditTask}
                            />
                        ))}
                    </div>


                </div>

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
                        <div className="w-[280px] cursor-grabbing rotate-3 scale-105">
                            <KanbanCard task={activeItem} />
                        </div>
                    ) : activeId && activeType === 'Talent' ? (
                        <div className="flex items-center gap-2 p-2 rounded-full bg-white border border-slate-200 shadow-xl cursor-grabbing scale-105 rotate-3 w-max">
                            <Avatar className="h-8 w-8 ring-2 ring-white">
                                <AvatarImage src={activeItem.avatar_url} />
                                <AvatarFallback>{activeItem.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-semibold text-slate-900">{activeItem.name}</span>
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>

            <ContentModal
                task={selectedTask}
                talents={talents}
                open={modalOpen}
                onOpenChange={(open) => {
                    setModalOpen(open)
                    if (!open) setSelectedTask(null)
                }}
                onSave={handleSaveTask}
            />
        </div>
    )
}
