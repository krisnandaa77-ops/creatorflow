import React from 'react'
import { Sidebar } from '@/components/Sidebar'
import { getDailyFocusData } from '@/actions/todo-actions'
import { DailyFocusClient } from '@/components/features/todo/DailyFocusClient'

export default async function TodoPage() {
    const { shooting, uploads, todos } = await getDailyFocusData()

    return (
        <div className="flex min-h-screen bg-white text-slate-900 overflow-x-hidden w-full">
            <Sidebar />
            <main className="flex-1 lg:ml-72 p-4 md:p-6 lg:p-8 pb-24 lg:pb-8">
                <DailyFocusClient
                    initialShooting={shooting}
                    initialUploads={uploads}
                    initialTodos={todos}
                />
            </main>
        </div>
    )
}
