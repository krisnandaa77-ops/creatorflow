'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Camera, Upload, ClipboardList, Loader2 } from 'lucide-react'
import { TodoItem } from '@/components/TodoItem'
import { addGeneralTask, toggleTaskStatus, deleteTask, toggleShotStatus, toggleUploadStatus } from '@/actions/todo-actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface ContentItem {
    id: string
    title: string
    platform?: string
    status?: string
    is_shot?: boolean
    is_uploaded?: boolean
}

interface TodoItemData {
    id: string
    task_name: string
    is_completed: boolean | null
    due_date?: string | null
    created_at?: string
}

interface DailyFocusClientProps {
    initialShooting: ContentItem[]
    initialUploads: ContentItem[]
    initialTodos: TodoItemData[]
}

export function DailyFocusClient({ initialShooting, initialUploads, initialTodos }: DailyFocusClientProps) {
    const router = useRouter()
    const [newTask, setNewTask] = useState('')
    const [isAdding, setIsAdding] = useState(false)
    const [showInput, setShowInput] = useState(false)

    const today = new Date()
    const dateString = today.toLocaleDateString('en-US', {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })

    // Stats — using is_shot / is_uploaded booleans
    const totalShooting = initialShooting.length
    const doneShooting = initialShooting.filter(s => s.is_shot === true).length
    const totalUploads = initialUploads.length
    const doneUploads = initialUploads.filter(u => u.is_uploaded === true).length
    const totalTodos = initialTodos.length
    const doneTodos = initialTodos.filter(t => t.is_completed).length
    const totalAll = totalShooting + totalUploads + totalTodos
    const doneAll = doneShooting + doneUploads + doneTodos
    const overallPct = totalAll > 0 ? Math.round((doneAll / totalAll) * 100) : 0

    async function handleAddTask(e: React.FormEvent) {
        e.preventDefault()
        if (!newTask.trim() || isAdding) return
        setIsAdding(true)

        try {
            const res = await addGeneralTask(newTask.trim())
            if (res?.error) throw new Error(res.error)
            toast.success('✅ Task added!')
            setNewTask('')
            setShowInput(false)
            router.refresh()
        } catch (err: any) {
            toast.error(`Failed: ${err.message}`)
        } finally {
            setIsAdding(false)
        }
    }

    // Toggle handler for General Tasks
    async function handleToggleGeneral(id: string, done: boolean) {
        try {
            const res = await toggleTaskStatus(id, done)
            if (res?.error) throw new Error(res.error)
            router.refresh()
        } catch (err: any) {
            toast.error(`Toggle failed: ${err.message}`)
        }
    }

    // Toggle handler for Shooting items
    async function handleToggleShot(id: string, done: boolean) {
        try {
            const res = await toggleShotStatus(id, done)
            if (res?.error) throw new Error(res.error)
            toast.success(done ? '🎬 Marked as shot!' : '🎬 Unmarked')
            router.refresh()
        } catch (err: any) {
            toast.error(`Toggle failed: ${err.message}`)
        }
    }

    // Toggle handler for Upload items
    async function handleToggleUpload(id: string, done: boolean) {
        try {
            const res = await toggleUploadStatus(id, done)
            if (res?.error) throw new Error(res.error)
            toast.success(done ? '🚀 Marked as uploaded!' : '🚀 Unmarked')
            router.refresh()
        } catch (err: any) {
            toast.error(`Toggle failed: ${err.message}`)
        }
    }

    async function handleDelete(id: string) {
        try {
            const res = await deleteTask(id)
            if (res?.error) throw new Error(res.error)
            toast.success('🗑️ Task deleted')
            router.refresh()
        } catch (err: any) {
            toast.error(`Delete failed: ${err.message}`)
        }
    }

    // Circular Progress Ring
    const CircleProgress = ({ pct, color, label }: { pct: number; color: string; label: string }) => {
        const circumference = 2 * Math.PI * 36
        const offset = circumference - (pct / 100) * circumference
        return (
            <div className="flex flex-col items-center">
                <div className="relative w-16 h-16 md:w-20 md:h-20">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
                        <circle cx="40" cy="40" r="36" strokeWidth="6" fill="transparent" className="text-slate-100" stroke="currentColor" />
                        <motion.circle
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset: offset }}
                            transition={{ duration: 1.2, ease: 'easeOut' }}
                            cx="40" cy="40" r="36" strokeWidth="6" fill="transparent" stroke={color}
                            strokeLinecap="round"
                            style={{ strokeDasharray: circumference }}
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs md:text-sm font-bold text-slate-800">{pct}%</span>
                    </div>
                </div>
                <span className="text-[10px] md:text-xs font-semibold text-slate-500 mt-1 md:mt-2">{label}</span>
            </div>
        )
    }

    const shootingPct = totalShooting > 0 ? Math.round((doneShooting / totalShooting) * 100) : 0
    const uploadPct = totalUploads > 0 ? Math.round((doneUploads / totalUploads) * 100) : 0
    const todoPct = totalTodos > 0 ? Math.round((doneTodos / totalTodos) * 100) : 0

    return (
        <>
            {/* Header with date */}
            <header className="mb-8 px-2">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                            Daily Focus ⚡
                        </h1>
                        <p className="text-slate-500 mt-1 font-medium text-sm md:text-base">
                            {dateString}
                        </p>
                    </div>
                    <div className="flex items-center gap-4 md:gap-6 flex-wrap">
                        <CircleProgress pct={shootingPct} color="#3b82f6" label="Shooting" />
                        <CircleProgress pct={uploadPct} color="#10b981" label="Uploads" />
                        <CircleProgress pct={todoPct} color="#f59e0b" label="Tasks" />
                    </div>
                </div>

                {/* Overall progress bar */}
                <div className="mt-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-slate-600">Overall Progress</span>
                        <span className="text-sm font-bold text-slate-800">{doneAll}/{totalAll} completed</span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${overallPct}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className="h-full bg-gradient-to-r from-blue-500 via-emerald-500 to-amber-500 rounded-full"
                        />
                    </div>
                </div>
            </header>

            {/* 3-Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-2">
                {/* Column 1: Shooting Today */}
                <div className="bg-white rounded-2xl md:rounded-[32px] p-4 md:p-6 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-blue-50 rounded-2xl">
                                <Camera className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="font-bold text-slate-900">🎬 Shooting Today</h2>
                                <p className="text-xs text-slate-400 mt-0.5">Click to mark as shot</p>
                            </div>
                        </div>
                        <span className="text-xs font-bold bg-blue-50 text-blue-600 px-2.5 py-1 rounded-xl">
                            {doneShooting}/{totalShooting}
                        </span>
                    </div>

                    {initialShooting.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-slate-400 text-sm">No shoots scheduled today</p>
                            <p className="text-slate-300 text-xs mt-1">Set a production date on any content</p>
                        </div>
                    ) : (
                        <div>
                            {initialShooting.map((item) => (
                                <TodoItem
                                    key={item.id}
                                    id={item.id}
                                    title={item.title}
                                    platform={item.platform}
                                    done={item.is_shot === true}
                                    type="shooting"
                                    onToggle={handleToggleShot}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Column 2: Upload Today */}
                <div className="bg-white rounded-2xl md:rounded-[32px] p-4 md:p-6 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-emerald-50 rounded-2xl">
                                <Upload className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div>
                                <h2 className="font-bold text-slate-900">🚀 Upload Today</h2>
                                <p className="text-xs text-slate-400 mt-0.5">Click to mark as uploaded</p>
                            </div>
                        </div>
                        <span className="text-xs font-bold bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-xl">
                            {doneUploads}/{totalUploads}
                        </span>
                    </div>

                    {initialUploads.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-slate-400 text-sm">No uploads due today</p>
                            <p className="text-slate-300 text-xs mt-1">Set an upload date on any content</p>
                        </div>
                    ) : (
                        <div>
                            {initialUploads.map((item) => (
                                <TodoItem
                                    key={item.id}
                                    id={item.id}
                                    title={item.title}
                                    platform={item.platform}
                                    done={item.is_uploaded === true}
                                    type="upload"
                                    onToggle={handleToggleUpload}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Column 3: General Tasks */}
                <div className="bg-white rounded-2xl md:rounded-[32px] p-4 md:p-6 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-amber-50 rounded-2xl">
                                <ClipboardList className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                                <h2 className="font-bold text-slate-900">📝 General Tasks</h2>
                                <p className="text-xs text-slate-400 mt-0.5">Manual tasks for today</p>
                            </div>
                        </div>
                        <span className="text-xs font-bold bg-amber-50 text-amber-600 px-2.5 py-1 rounded-xl">
                            {doneTodos}/{totalTodos}
                        </span>
                    </div>

                    {/* Task List */}
                    {initialTodos.length === 0 && !showInput ? (
                        <div className="text-center py-8">
                            <p className="text-slate-400 text-sm">No tasks yet</p>
                            <p className="text-slate-300 text-xs mt-1">Click below to add one</p>
                        </div>
                    ) : (
                        <div>
                            {initialTodos.map((todo) => (
                                <TodoItem
                                    key={todo.id}
                                    id={todo.id}
                                    title={todo.task_name}
                                    done={todo.is_completed ?? false}
                                    type="general"
                                    onToggle={handleToggleGeneral}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    )}

                    {/* Add Task Input */}
                    {showInput ? (
                        <form onSubmit={handleAddTask} className="mt-3">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newTask}
                                    onChange={(e) => setNewTask(e.target.value)}
                                    placeholder="What do you need to do?"
                                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                                    autoFocus
                                />
                                <button
                                    type="submit"
                                    disabled={isAdding || !newTask.trim()}
                                    className="px-4 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold text-sm transition-all disabled:opacity-50 shadow-lg shadow-amber-500/20"
                                >
                                    {isAdding ? <Loader2 size={16} className="animate-spin" /> : 'Add'}
                                </button>
                            </div>
                            <button
                                type="button"
                                onClick={() => { setShowInput(false); setNewTask('') }}
                                className="text-xs text-slate-400 hover:text-slate-600 mt-2 ml-1"
                            >
                                Cancel
                            </button>
                        </form>
                    ) : (
                        <button
                            onClick={() => setShowInput(true)}
                            className="w-full mt-3 flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 hover:text-amber-600 hover:border-amber-300 hover:bg-amber-50/50 transition-all text-sm font-semibold"
                        >
                            <Plus size={16} />
                            Add Task
                        </button>
                    )}
                </div>
            </div>
        </>
    )
}
