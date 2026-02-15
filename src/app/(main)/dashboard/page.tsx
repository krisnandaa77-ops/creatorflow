import { getContents } from '@/actions/content-actions'
import { getTalents } from '@/actions/talent-actions'
import { Board } from '@/components/features/kanban/Board'

export default async function DashboardPage() {
    const [contents, talents] = await Promise.all([
        getContents(),
        getTalents(),
    ]);

    return (
        <div className="h-full flex flex-col gap-8">
            {/* Premium Header */}
            <div className="flex flex-col gap-2 pt-2">
                <h2 className="text-zinc-500 font-medium text-lg tracking-wide">
                    Welcome back, Krisnanda! ✨
                </h2>
                <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
                    Production Board
                </h1>
            </div>

            {/* Kanban Board - Centered & Spacious */}
            <div className="flex-1 w-full max-w-[1600px]">
                <Board initialTasks={contents} talents={talents} />
            </div>
        </div>
    )
}
