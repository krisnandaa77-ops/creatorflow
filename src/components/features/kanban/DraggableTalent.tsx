
'use client'

import { useDraggable } from '@dnd-kit/core'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface DraggableTalentProps {
    talent: any
}

export function DraggableTalent({ talent }: DraggableTalentProps) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: `talent-${talent.id}`,
        data: {
            type: 'Talent',
            talent,
        },
    })

    // Helper to remove 'translate3d' which can cause blurriness or positioning issues in some overlays
    // But for simple dragging, CSS.Translate.toString(transform) is usually fine.
    // We'll just use inline styles for the drag preview or rely on the overlay.
    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={cn(
                "flex items-center gap-2 p-2 rounded-md hover:bg-muted cursor-grab active:cursor-grabbing",
                isDragging && "opacity-50"
            )}
            style={style}
        >
            <Avatar className="h-8 w-8">
                <AvatarImage src={talent.avatar_url} />
                <AvatarFallback>{talent.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{talent.name}</span>
        </div>
    )
}
