
import dayjs from 'dayjs'

interface Content {
    id: string
    title: string
    platform: 'Instagram' | 'TikTok' | 'YouTube'
    status: string
    production_date?: string | null
    upload_date?: string | null
}

interface CalendarEvent {
    id: string
    title: string
    date: string // YYYY-MM-DD
    type: 'Production' | 'Upload'
    platform: 'Instagram' | 'TikTok' | 'YouTube'
    originalContent: Content
}

export function mapContentsToCalendar(contents: Content[]): CalendarEvent[] {
    const events: CalendarEvent[] = []

    contents.forEach(content => {
        // 1. Production Event
        if (content.production_date) {
            events.push({
                id: `${content.id}-prod`,
                title: `🎬 ${content.title}`,
                date: dayjs(content.production_date).format('YYYY-MM-DD'),
                type: 'Production',
                platform: content.platform,
                originalContent: content
            })
        }

        // 2. Upload Event
        if (content.upload_date) {
            events.push({
                id: `${content.id}-upload`,
                title: `🚀 ${content.title}`,
                date: dayjs(content.upload_date).format('YYYY-MM-DD'),
                type: 'Upload',
                platform: content.platform,
                originalContent: content
            })
        }
    })

    return events.sort((a, b) => dayjs(a.date).diff(dayjs(b.date)))
}

export function groupEventsByDate(events: CalendarEvent[]) {
    const grouped: Record<string, CalendarEvent[]> = {}

    events.forEach(event => {
        if (!grouped[event.date]) {
            grouped[event.date] = []
        }
        grouped[event.date].push(event)
    })

    return grouped
}
