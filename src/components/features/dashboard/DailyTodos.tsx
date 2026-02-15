'use client'

import { useState } from 'react'
import { createTodo, toggleTodo, type UnifiedTodoItem } from '@/actions/todo-actions'
import { advanceContentStatus } from '@/actions/content-actions'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, CheckCircle2, Clapperboard, Rocket } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface DailyTodosProps {
    initialItems: UnifiedTodoItem[]
    onContentClick?: (contentId: string) => void
}

export function DailyTodos({ initialItems, onContentClick }: DailyTodosProps) {
    const [items, setItems] = useState(initialItems)
    const [newTask, setNewTask] = useState('')

    async function handleAdd() {
        if (!newTask.trim()) return

        const tempId = Math.random().toString()
        const newItem: UnifiedTodoItem = {
            id: tempId,
            label: newTask,
            is_completed: false,
            source: 'manual',
        }

        setItems([...items, newItem])
        const taskName = newTask
        setNewTask('')

        const formData = new FormData()
        formData.append('task_name', taskName)

        const result = await createTodo(formData)
        if (result.error) {
            toast.error('Failed to create todo')
        }
    }

    async function handleToggle(item: UnifiedTodoItem) {
        if (item.source === 'manual') {
            // Toggle manual todo
            setItems(prev => prev.map(i =>
                i.id === item.id ? { ...i, is_completed: !i.is_completed } : i
            ))
            const result = await toggleTodo(item.id, !item.is_completed)
            if (result.error) toast.error('Failed to update todo')
        } else if (item.source === 'content' && item.content_id && item.content_status) {
            // Advance content status
            setItems(prev => prev.map(i =>
                i.id === item.id ? { ...i, is_completed: true } : i
            ))
            toast.promise(
                advanceContentStatus(item.content_id, item.content_status),
                {
                    loading: 'Advancing status...',
                    success: 'Content moved to next stage!',
                    error: 'Failed to advance status',
                }
            )
        }
    }

    function handleContentClick(item: UnifiedTodoItem) {
        if (item.source === 'content' && item.content_id && onContentClick) {
            onContentClick(item.content_id)
        }
    }

    const completedCount = items.filter(i => i.is_completed).length
    const progress = items.length > 0 ? (completedCount / items.length) * 100 : 0

    return (
        <div className="bg-card rounded-xl border p-4 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Daily Focus
                </h3>
                <span className="text-xs text-muted-foreground">{completedCount}/{items.length} Done</span>
            </div>

            {/* Progress Bar */}
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div
                    className="h-full bg-primary transition-all duration-500 rounded-full"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="space-y-1.5">
                {items.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-2">
                        Nothing scheduled for today ✨
                    </p>
                )}
                {items.map(item => (
                    <div
                        key={item.id}
                        className={cn(
                            "flex items-center gap-2 group rounded-md px-2 py-1.5 -mx-2 transition-colors",
                            item.source === 'content' && "hover:bg-muted/50 cursor-pointer"
                        )}
                    >
                        <Checkbox
                            checked={item.is_completed}
                            onCheckedChange={() => handleToggle(item)}
                            className="rounded-full shrink-0"
                        />
                        <span
                            onClick={() => handleContentClick(item)}
                            className={cn(
                                "text-sm transition-all flex-1",
                                item.is_completed && "text-muted-foreground line-through decoration-muted-foreground/50",
                                item.source === 'content' && !item.is_completed && "font-medium"
                            )}
                        >
                            {item.label}
                        </span>
                        {item.source === 'content' && (
                            <span className="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                                click to edit
                            </span>
                        )}
                    </div>
                ))}
            </div>

            <div className="flex gap-2 pt-2 border-t">
                <Input
                    placeholder="Add a task..."
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                    className="h-8 text-sm"
                />
                <Button size="sm" onClick={handleAdd} className="h-8 px-2">
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
