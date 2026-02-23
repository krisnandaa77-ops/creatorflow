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
import { cn } from '@/lib/utils'

interface BoardProps {
    initialTasks: any[]
    talents: any[]
    userProfile?: any
}

const COLUMNS = [
    { id: 'Idea', title: 'Idea' },
    { id: 'To-Do', title: 'To-Do' },
    { id: 'Filming', title: 'Filming' },
    { id: 'Editing', title: 'Editing' },
    { id: 'Done', title: 'Done' },
]

export function Board({ initialTasks, talents, userProfile }: BoardProps) {
    const [tasks, setTasks] = useState(initialTasks)
    const [activeId, setActiveId] = useState<string | null>(null)
    const [activeType, setActiveType] = useState<'Task' | 'Talent' | null>(null)
    const [activeItem, setActiveItem] = useState<any>(null)
    const [mobileTab, setMobileTab] = useState('Idea')

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
        // Optional sorting logic
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
        <div className="flex flex-col h-full">
            {/* Header */}
            <header className="mb-6 md:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-2">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                        Welcome back, {userProfile?.full_name || 'Creator'}! ✨
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium text-sm md:text-base">
                        Here&apos;s what&apos;s happening with your content today.
                    </p>
                </div>
                <button
                    onClick={handleCreateNew}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-2xl font-semibold transition-all shadow-lg shadow-blue-500/20 active:scale-95 text-sm md:text-base shrink-0"
                >
                    <Plus size={18} />
                    <span>New Idea</span>
                </button>
            </header>

            {/* ===== MOBILE TABBED VIEW (< md) ===== */}
            <div className="md:hidden flex flex-col flex-1 w-full max-w-[100vw] overflow-hidden">
                {/* Tab Pills */}
                <div className="flex gap-2 overflow-x-auto px-4 pb-4 no-scrollbar w-full">
                    {COLUMNS.map((col) => {
                        const count = getTasksByStatus(col.id).length
                        const isActive = mobileTab === col.id
                        return (
                            <button
                                key={col.id}
                                onClick={() => setMobileTab(col.id)}
                                className={cn(
                                    "relative shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200",
                                    isActive
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                                )}
                            >
                                {col.title}
                                {count > 0 && (
                                    <span className={cn(
                                        "ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold",
                                        isActive ? "bg-white/20 text-white" : "bg-slate-200 text-slate-500"
                                    )}>
                                        {count}
                                    </span>
                                )}
                            </button>
                        )
                    })}
                </div>

                {/* Active Column Cards */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden w-full">
                    <motion.div
                        key={mobileTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col items-center justify-start w-full px-4 gap-4 pb-4"
                    >
                        {getTasksByStatus(mobileTab).length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center w-full">
                                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                                    <span className="text-2xl">📋</span>
                                </div>
                                <p className="text-slate-400 text-sm font-medium">
                                    No items in {mobileTab}
                                </p>
                            </div>
                        ) : (
                            getTasksByStatus(mobileTab).map(task => (
                                <div key={task.id} onClick={() => handleEditTask(task)} className="cursor-pointer w-[calc(100vw-32px)] max-w-[400px] box-border">
                                    <KanbanCard task={task} />
                                </div>
                            ))
                        )}
                    </motion.div>
                </div>
            </div>

            {/* ===== DESKTOP DND COLUMNS (md+) ===== */}
            <div className="hidden md:block overflow-hidden">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                >
                    <div className="flex h-[calc(100vh-220px)] gap-4 lg:gap-5 overflow-hidden pb-4 px-2 w-full">
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
            </div>

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
