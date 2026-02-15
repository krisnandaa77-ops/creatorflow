import React from 'react'
import { Sidebar } from '@/components/Sidebar'
import { getCalendarEvents } from '@/actions/todo-actions'
import { CalendarClient } from '@/components/features/calendar/CalendarClient'

export default async function CalendarPage() {
    const contents = await getCalendarEvents()

    return (
        <div className="flex min-h-screen bg-white text-slate-900 overflow-x-hidden w-full">
            <Sidebar />
            <main className="flex-1 lg:ml-72 p-4 md:p-6 lg:p-8 pb-24 lg:pb-8">
                <CalendarClient contents={contents} />
            </main>
        </div>
    )
}
