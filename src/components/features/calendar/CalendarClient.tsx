'use client'

import React, { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Camera, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ContentEvent {
    id: string
    title: string
    platform?: string
    status?: string
    production_date?: string | null
    upload_date?: string | null
}

interface CalendarClientProps {
    contents: ContentEvent[]
}

export function CalendarClient({ contents }: CalendarClientProps) {
    const [currentDate, setCurrentDate] = useState(new Date())

    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const monthName = currentDate.toLocaleString('default', { month: 'long' })
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    // Build events map: { 'YYYY-MM-DD': CalendarEvent[] }
    const eventsMap = useMemo(() => {
        const map: Record<string, { id: string; title: string; type: 'shooting' | 'upload'; platform?: string }[]> = {}

        contents.forEach(content => {
            if (content.production_date) {
                const key = content.production_date
                if (!map[key]) map[key] = []
                map[key].push({
                    id: `shoot-${content.id}`,
                    title: content.title,
                    type: 'shooting',
                    platform: content.platform,
                })
            }
            if (content.upload_date) {
                const key = content.upload_date
                if (!map[key]) map[key] = []
                map[key].push({
                    id: `upload-${content.id}`,
                    title: content.title,
                    type: 'upload',
                    platform: content.platform,
                })
            }
        })

        return map
    }, [contents])

    // Calendar grid calculation
    const firstDayOfMonth = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const daysInPrevMonth = new Date(year, month, 0).getDate()

    const today = new Date()
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month
    const todayDate = today.getDate()

    function prevMonth() {
        setCurrentDate(new Date(year, month - 1, 1))
    }
    function nextMonth() {
        setCurrentDate(new Date(year, month + 1, 1))
    }
    function goToToday() {
        setCurrentDate(new Date())
    }

    // Build date key from day number
    function dateKey(day: number): string {
        const mm = String(month + 1).padStart(2, '0')
        const dd = String(day).padStart(2, '0')
        return `${year}-${mm}-${dd}`
    }

    // Count events this month
    const totalShooting = contents.filter(c => {
        if (!c.production_date) return false
        const d = new Date(c.production_date)
        return d.getFullYear() === year && d.getMonth() === month
    }).length

    const totalUploads = contents.filter(c => {
        if (!c.upload_date) return false
        const d = new Date(c.upload_date)
        return d.getFullYear() === year && d.getMonth() === month
    }).length

    return (
        <>
            {/* Header */}
            <header className="mb-8 flex justify-between items-center px-2">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                        Calendar 📅
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium text-sm md:text-base">
                        Your filming and upload schedule, synced from content.
                    </p>
                </div>
            </header>

            {/* Calendar Card */}
            <div className="bg-white rounded-2xl md:rounded-[32px] p-4 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                {/* Month Navigation */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
                    <div className="flex items-center gap-3 md:gap-4 flex-wrap">
                        <h2 className="text-xl md:text-2xl font-bold text-slate-900">{monthName} {year}</h2>
                        <div className="flex gap-1">
                            <button onClick={prevMonth} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                                <ChevronLeft size={20} />
                            </button>
                            <button onClick={nextMonth} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                                <ChevronRight size={20} />
                            </button>
                        </div>
                        <button onClick={goToToday} className="text-sm font-semibold text-blue-600 hover:text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors">
                            Today
                        </button>
                    </div>
                    <div className="flex gap-4 md:gap-6 text-xs md:text-sm font-medium text-slate-500">
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50" />
                            <span>🎬 Shooting ({totalShooting})</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                            <span>🚀 Upload ({totalUploads})</span>
                        </div>
                    </div>
                </div>

                {/* Days Header */}
                <div className="grid grid-cols-7 mb-2 md:mb-4">
                    {days.map(day => (
                        <div key={day} className="text-center text-[10px] md:text-sm font-bold text-slate-400 uppercase tracking-wider py-1 md:py-2">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 md:gap-2">
                    {/* Previous month padding */}
                    {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                        <div key={`prev-${i}`} className="min-h-[60px] md:min-h-[120px] bg-slate-50/30 border border-slate-50 rounded-xl md:rounded-[20px] p-1.5 md:p-3">
                            <span className="text-[10px] md:text-sm font-medium text-slate-200">
                                {daysInPrevMonth - firstDayOfMonth + 1 + i}
                            </span>
                        </div>
                    ))}

                    {/* Current month days */}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1
                        const key = dateKey(day)
                        const dayEvents = eventsMap[key] || []
                        const isToday = isCurrentMonth && day === todayDate

                        return (
                            <div
                                key={day}
                                className={cn(
                                    "min-h-[60px] md:min-h-[120px] border p-1.5 md:p-3 rounded-xl md:rounded-[20px] transition-all hover:shadow-md group relative",
                                    isToday
                                        ? "bg-blue-50/50 border-blue-200 shadow-sm"
                                        : "bg-white border-slate-100 hover:border-slate-200"
                                )}
                            >
                                <span className={cn(
                                    "text-[10px] md:text-sm font-semibold w-5 h-5 md:w-7 md:h-7 flex items-center justify-center rounded-full mb-1 md:mb-2",
                                    isToday
                                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                                        : "text-slate-400 group-hover:text-slate-600"
                                )}>
                                    {day}
                                </span>

                                <div className="space-y-1 md:space-y-1.5 hidden md:block">
                                    {dayEvents.slice(0, 3).map(event => (
                                        <div
                                            key={event.id}
                                            className={cn(
                                                "text-[11px] px-2 py-1.5 rounded-xl font-semibold truncate flex items-center gap-1.5",
                                                event.type === 'shooting'
                                                    ? "bg-blue-50 text-blue-700 border border-blue-100"
                                                    : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-1.5 h-1.5 rounded-full shrink-0",
                                                event.type === 'shooting' ? "bg-blue-500" : "bg-emerald-500"
                                            )} />
                                            <span className="truncate">
                                                {event.type === 'shooting' ? '🎬' : '🚀'} {event.title}
                                            </span>
                                        </div>
                                    ))}
                                    {dayEvents.length > 3 && (
                                        <div className="text-[10px] text-slate-400 font-semibold pl-1">
                                            +{dayEvents.length - 3} more
                                        </div>
                                    )}
                                </div>
                                {/* Mobile dot indicators */}
                                {dayEvents.length > 0 && (
                                    <div className="flex gap-0.5 md:hidden mt-0.5">
                                        {dayEvents.slice(0, 3).map(event => (
                                            <span
                                                key={event.id}
                                                className={cn(
                                                    "w-1.5 h-1.5 rounded-full",
                                                    event.type === 'shooting' ? "bg-blue-500" : "bg-emerald-500"
                                                )}
                                            />
                                        ))}
                                        {dayEvents.length > 3 && (
                                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                        )}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    )
}
