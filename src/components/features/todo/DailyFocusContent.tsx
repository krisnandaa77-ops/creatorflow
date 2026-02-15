'use client'

import React, { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ProgressCharts } from '@/components/features/todo/ProgressCharts'
import { TaskCard } from '@/components/features/todo/TaskCard'
import { UnifiedTodoItem } from '@/actions/todo-actions'
import { toggleTodo } from '@/actions/todo-actions'
import { advanceContentStatus } from '@/actions/content-actions'
import { toast } from 'sonner'
import { Clock } from 'lucide-react'

interface DailyFocusContentProps {
    initialTodos: UnifiedTodoItem[]
}

export default function DailyFocusContent({ initialTodos }: DailyFocusContentProps) {
    const [todos, setTodos] = React.useState(initialTodos)

    // Calculate stats
    const stats = useMemo(() => {
        const shooting = todos.filter(t => t.id.startsWith('prod-'))
        const upload = todos.filter(t => t.id.startsWith('upload-'))
        const manual = todos.filter(t => t.source === 'manual')

        const calcPercent = (items: UnifiedTodoItem[]) => {
            if (items.length === 0) return 0
            const completed = items.filter(i => i.is_completed).length
            return (completed / items.length) * 100
        }

        return {
            shooting: calcPercent(shooting),
            upload: calcPercent(upload),
            manual: calcPercent(manual)
        }
    }, [todos])

    const handleToggle = async (todo: UnifiedTodoItem) => {
        // Optimistic update
        const newStatus = !todo.is_completed
        setTodos(prev => prev.map(t => t.id === todo.id ? { ...t, is_completed: newStatus } : t))

        try {
            if (todo.source === 'manual') {
                await toggleTodo(todo.id, newStatus)
            } else if (todo.source === 'content' && todo.content_id) {
                // For content, "toggling" might mean moving to next stage or just marking done.
                // Reusing logic from DailyTodos.tsx: advance status.
                // However, user might just want to check it off. 
                // Implementation in DailyTodos.tsx calls advanceContentStatus.
                // We'll stick to that for consistency, but maybe we should confirm if "checking off" means "done".
                // For now, let's assume it advances status.
                if (todo.content_status) {
                    await advanceContentStatus(todo.content_id, todo.content_status)
                }
            }
        } catch (error) {
            toast.error('Failed to update task')
            // Revert
            setTodos(prev => prev.map(t => t.id === todo.id ? { ...t, is_completed: !newStatus } : t))
        }
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const renderColumn = (title: string, items: UnifiedTodoItem[], type: 'content' | 'manual', platform?: string) => (
        <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                {title}
                <span className="bg-slate-100 text-slate-500 text-xs px-2 py-0.5 rounded-full">{items.length}</span>
            </h2>
            <div className="space-y-3">
                <AnimatePresence mode='popLayout'>
                    {items.map(item => (
                        <TaskCard
                            key={item.id}
                            id={item.id}
                            title={item.label.replace('🎬 Shooting: ', '').replace('🚀 Upload: ', '')}
                            platform={item.label.includes('Shooting') || item.label.includes('Upload') ? 'Instagram' : undefined} // Mock platform for now as UnifiedTodoItem doesn't have it explicitly separate
                            isCompleted={item.is_completed}
                            onToggle={() => handleToggle(item)}
                            type={type}
                            time="Today" // Mock time
                            priority="High" // Mock priority
                        />
                    ))}
                </AnimatePresence>
                {items.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-slate-400 text-sm italic p-4 text-center border border-dashed border-slate-200 rounded-2xl"
                    >
                        No tasks yet
                    </motion.div>
                )}
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-slate-50/50 p-8 space-y-8">
            {/* Header */}
            <header className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-4xl font-bold text-slate-800 tracking-tight">
                        Good Afternoon, Krisnanda! ✨
                    </h1>
                    <p className="text-slate-500 mt-2 text-lg">Here's your production focus for today.</p>
                </div>

                <div className="flex items-center gap-6 bg-white p-2 pr-6 rounded-full shadow-sm border border-slate-100">
                    <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                        <Clock size={20} />
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-bold text-slate-700">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        <p className="text-xs text-slate-400">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                    </div>
                </div>
            </header>

            {/* Progress Charts */}
            <ProgressCharts
                shootingPercentage={stats.shooting}
                uploadPercentage={stats.upload}
                tasksPercentage={stats.manual}
            />

            {/* 3-Column Grid */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8"
            >
                {renderColumn('🎬 Shooting Focus', todos.filter(t => t.id.startsWith('prod-')), 'content', 'Instagram')}
                {renderColumn('🚀 Upload Schedule', todos.filter(t => t.id.startsWith('upload-')), 'content')}
                {renderColumn('📝 Personal Tasks', todos.filter(t => t.source === 'manual'), 'manual')}
            </motion.div>
        </div>
    )
}
