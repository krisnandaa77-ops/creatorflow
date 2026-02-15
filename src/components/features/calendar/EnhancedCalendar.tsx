'use client'

import { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { format, isSameDay, parseISO } from 'date-fns'
import { cn } from '@/lib/utils'

interface ContentEvent {
    id: string
    title: string
    date: Date
    type: 'production' | 'upload'
}

interface EnhancedCalendarProps {
    events: ContentEvent[]
}

export function EnhancedCalendar({ events }: EnhancedCalendarProps) {
    const [date, setDate] = useState<Date | undefined>(new Date())

    return (
        <Card className="rounded-3xl border-slate-100 shadow-sm overflow-hidden bg-white">
            <CardContent className="p-0">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="p-6 w-full"
                    classNames={{
                        month: "space-y-6",
                        caption: "flex justify-center pt-1 relative items-center mb-4",
                        caption_label: "text-lg font-bold text-zinc-800",
                        nav: "space-x-1 flex items-center",
                        nav_button: cn(
                            "h-9 w-9 bg-transparent p-0 opacity-50 hover:opacity-100 transition-opacity rounded-full hover:bg-zinc-100"
                        ),
                        table: "w-full border-collapse space-y-1",
                        head_row: "flex",
                        head_cell: "text-zinc-400 rounded-md w-full font-medium text-[0.8rem] uppercase tracking-wider h-10",
                        row: "flex w-full mt-2",
                        cell: cn(
                            "relative h-24 w-full p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-transparent"
                        ),
                        day: cn(
                            "h-full w-full p-2 font-normal aria-selected:opacity-100 hover:bg-zinc-50 rounded-2xl transition-all duration-200 hover:scale-[1.02] flex flex-col items-start justify-start gap-1 group border border-transparent hover:border-zinc-100 hover:shadow-sm"
                        ),
                        day_selected:
                            "bg-zinc-900 text-white hover:bg-zinc-800 hover:text-white focus:bg-zinc-900 focus:text-white shadow-md",
                        day_today: "bg-zinc-50 text-zinc-900 font-semibold ring-1 ring-zinc-200",
                        day_outside: "text-zinc-300 opacity-50",
                        day_disabled: "text-zinc-300 opacity-50",
                        day_hidden: "invisible",
                    }}
                    components={{
                        DayContent: (props: any) => {
                            const { date: dayDate } = props
                            const dayEvents = events.filter(e => {
                                const eventDate = e.date instanceof Date ? e.date : new Date(e.date)
                                return isSameDay(eventDate, dayDate)
                            })

                            return (
                                <div className="w-full h-full flex flex-col items-start text-left">
                                    <span className="text-sm font-medium ml-1 mb-1">{format(dayDate, 'd')}</span>

                                    <div className="flex flex-col gap-1 w-full overflow-y-auto max-h-[calc(100%-24px)] pr-1 custom-scrollbar">
                                        {dayEvents.map(event => (
                                            <div
                                                key={event.id}
                                                className={cn(
                                                    "text-[10px] px-2 py-1 rounded-full truncate w-full font-medium transition-colors",
                                                    event.type === 'production'
                                                        ? "bg-blue-50 text-blue-700 border border-blue-100"
                                                        : "bg-green-50 text-green-700 border border-green-100"
                                                )}
                                                title={event.title}
                                            >
                                                {event.type === 'production' ? '🎬' : '🚀'} {event.title}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        }
                    } as any}
                />
            </CardContent>
        </Card>
    )
}
