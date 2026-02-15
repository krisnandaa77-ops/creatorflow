
import { getContents } from '@/actions/content-actions'
import { IdeaFormV2 } from '@/components/features/ideas/IdeaFormV2'
import { IdeaList } from '@/components/features/ideas/IdeaList'

export default async function IdeasPage() {
    const contents = await getContents()
    // Filter for only 'Idea' status usually, but for now show all to demonstrate thumbnails
    const ideas = contents.filter(c => c.status === 'Idea')

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Idea Bank</h1>
                    <p className="text-muted-foreground">Brainstorm and capture your next viral hit.</p>
                </div>
                <IdeaFormV2 />
            </div>

            <IdeaList ideas={ideas} />
        </div>
    )
}
