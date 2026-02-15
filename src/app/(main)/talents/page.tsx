
import { getTalents } from '@/actions/talent-actions'
import { TalentForm } from '@/components/features/talents/TalentForm'
import { TalentList } from '@/components/features/talents/TalentList'

export default async function TalentsPage() {
    const talents = await getTalents()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Talents</h1>
                    <p className="text-muted-foreground">Manage your talent roster.</p>
                </div>
                <TalentForm />
            </div>

            <TalentList talents={talents} />
        </div>
    )
}
