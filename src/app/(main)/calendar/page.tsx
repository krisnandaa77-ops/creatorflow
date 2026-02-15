
import { getContents } from '@/actions/content-actions'
import { ContentCalendar } from '@/components/features/calendar/ContentCalendar'

export default async function CalendarPage() {
    const contents = await getContents()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
                <p className="text-muted-foreground">Visualize your production and upload schedule.</p>
            </div>

            <ContentCalendar contents={contents} />
        </div>
    )
}
