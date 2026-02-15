
'use client'

import { useState } from 'react'
import dayjs from 'dayjs'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { mapContentsToCalendar, groupEventsByDate } from '@/lib/calendar-utils'
import { Badge } from '@/components/ui/badge'

interface ContentCalendarProps {
    contents: any[]
}

export function ContentCalendar({ contents }: ContentCalendarProps) {
    const [currentDate, setCurrentDate] = useState(dayjs())

    const events = mapContentsToCalendar(contents)
    const groupedEvents = groupEventsByDate(events)

    const startOfMonth = currentDate.startOf('month')
    const endOfMonth = currentDate.endOf('month')
    const startDay = startOfMonth.day() // 0 = Sunday
    const daysInMonth = currentDate.daysInMonth()

    // Generate calendar grid
    const days = []
    // Previous month filler
    for (let i = 0; i < startDay; i++) {
        days.push(null)
    }
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(currentDate.date(i).format('YYYY-MM-DD'))
    }

    return (
        <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
            <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-semibold text-lg">
                    {currentDate.format('MMMM YYYY')}
                </h3>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => setCurrentDate(currentDate.subtract(1, 'month'))}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => setCurrentDate(dayjs())}>
                        Today
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => setCurrentDate(currentDate.add(1, 'month'))}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-7 text-center text-sm font-medium py-2 border-b bg-muted/50">
                <div>Sun</div>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
            </div>

            <div className="grid grid-cols-7 auto-rows-fr">
                {days.map((dateStr, index) => {
                    if (!dateStr) return <div key={`empty-${index}`} className="border-b border-r p-2 bg-muted/10 min-h-[100px]" />

                    const dayEvents = groupedEvents[dateStr] || []
                    const isToday = dayjs().format('YYYY-MM-DD') === dateStr

                    return (
                        <div key={dateStr} className={cn("border-b border-r p-2 bg-background min-h-[100px] hover:bg-muted/5 transition-colors", isToday && "bg-primary/5")}>
                            <div className="flex justify-between items-start mb-1">
                                <span className={cn("text-xs font-semibold h-6 w-6 flex items-center justify-center rounded-full", isToday && "bg-primary text-primary-foreground")}>
                                    {dayjs(dateStr).date()}
                                </span>
                            </div>

                            <div className="space-y-1">
                                {dayEvents.map(event => (
                                    <div
                                        key={event.id}
                                        className={cn(
                                            "text-[10px] truncate px-1.5 py-0.5 rounded border font-medium",
                                            event.type === 'Production'
                                                ? "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800"
                                                : "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
                                        )}
                                        title={event.title}
                                    >
                                        {event.title}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
