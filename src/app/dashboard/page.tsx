
import React from 'react'
import { Sidebar } from '@/components/Sidebar'
import { Board } from '@/components/features/kanban/Board'
import { getContents } from '@/actions/content-actions'
import { getTalents } from '@/actions/talent-actions'

export default async function Dashboard() {
    const contents = await getContents()
    const talents = await getTalents() || []

    return (
        <div className="flex min-h-screen bg-white text-slate-900 overflow-x-hidden w-full">
            <Sidebar />
            <main className="flex-1 lg:ml-72 p-4 md:p-6 lg:p-8 pb-24 lg:pb-8">
                <Board initialTasks={contents || []} talents={talents} />
            </main>
        </div>
    )
}
