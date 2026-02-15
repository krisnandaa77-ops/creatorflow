import React from 'react'
import { Sidebar } from '@/components/Sidebar'
import { getDailyFocusData } from '@/actions/todo-actions'
import { DailyFocusClient } from '@/components/features/todo/DailyFocusClient'

export default async function TodoPage() {
    const { shooting, uploads, todos } = await getDailyFocusData()

    return (
        <div className="flex min-h-screen bg-white text-slate-900">
            <Sidebar />
            <main className="flex-1 ml-72 p-8">
                <DailyFocusClient
                    initialShooting={shooting}
                    initialUploads={uploads}
                    initialTodos={todos}
                />
            </main>
        </div>
    )
}
