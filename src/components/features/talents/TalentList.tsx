
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

interface Talent {
    id: string
    name: string
    avatar_url: string | null
}

export function TalentList({ talents }: { talents: Talent[] }) {
    if (talents.length === 0) {
        return (
            <div className="text-center p-8 border rounded-lg border-dashed text-muted-foreground">
                No talents found. Add one to get started.
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {talents.map((talent) => (
                <Card key={talent.id} className="flex items-center p-4 gap-4">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={talent.avatar_url || ''} />
                        <AvatarFallback>{talent.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="font-medium">{talent.name}</div>
                </Card>
            ))}
        </div>
    )
}
