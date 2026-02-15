import React from 'react'
import { Sidebar } from '@/components/Sidebar'
import { getIdeas } from '@/actions/content-actions'
import { IdeaBankClient } from '@/components/features/ideas/IdeaBankClient'

export default async function IdeaBankPage() {
    const ideas = await getIdeas()

    return (
        <div className="flex min-h-screen bg-white text-slate-900">
            <Sidebar />
            <main className="flex-1 ml-72 p-8">
                <IdeaBankClient initialIdeas={ideas || []} />
            </main>
        </div>
    )
}
