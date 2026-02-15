
import React from 'react'
import { Sidebar } from '@/components/Sidebar'
import { Board } from '@/components/features/kanban/Board'
import { getContents } from '@/actions/content-actions'
import { getTalents } from '@/actions/talent-actions'

export default async function Dashboard() {
    const contents = await getContents()
    const talents = await getTalents() || []

    return (
        <div className="flex min-h-screen bg-white text-slate-900">
            <Sidebar />
            <main className="flex-1 ml-72 p-8">
                <Board initialTasks={contents || []} talents={talents} />
            </main>
        </div>
    )
}
