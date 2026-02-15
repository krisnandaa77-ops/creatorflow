'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Instagram, Video, Youtube } from 'lucide-react'
import { IdeaDetailDialog } from './IdeaDetailDialog'

interface Content {
    id: string
    title: string
    description?: string | null
    platform: 'Instagram' | 'TikTok' | 'YouTube'
    status: string
    thumbnail_url?: string | null
    reference_link?: string | null
    production_date?: string | null
    upload_date?: string | null
}

const PlatformIcon = ({ platform }: { platform: string }) => {
    switch (platform) {
        case 'Instagram':
            return <Instagram className="h-4 w-4 text-pink-500" />
        case 'TikTok':
            return <Video className="h-4 w-4 text-black dark:text-white" />
        case 'YouTube':
            return <Youtube className="h-4 w-4 text-red-500" />
        default:
            return null
    }
}

export function IdeaList({ ideas }: { ideas: Content[] }) {
    const [selectedIdea, setSelectedIdea] = useState<Content | null>(null)
    const [dialogOpen, setDialogOpen] = useState(false)

    function handleCardClick(idea: Content) {
        setSelectedIdea(idea)
        setDialogOpen(true)
    }

    if (ideas.length === 0) {
        return (
            <div className="text-center p-8 border rounded-lg border-dashed text-muted-foreground">
                No ideas found. Start brainstorming!
            </div>
        )
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ideas.map((idea) => (
                    <Card
                        key={idea.id}
                        onClick={() => handleCardClick(idea)}
                        className="cursor-pointer hover:border-primary/50 transition-colors overflow-hidden group"
                    >
                        {idea.thumbnail_url ? (
                            <div className="h-32 w-full overflow-hidden bg-muted">
                                <img
                                    src={idea.thumbnail_url}
                                    alt={idea.title}
                                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                />
                            </div>
                        ) : (
                            <div className="h-20 w-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                                <PlatformIcon platform={idea.platform} />
                            </div>
                        )}
                        <CardHeader className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <Badge variant="outline" className="flex items-center gap-1">
                                    <PlatformIcon platform={idea.platform} />
                                    {idea.platform}
                                </Badge>
                                <Badge>{idea.status}</Badge>
                            </div>
                            <CardTitle className="text-lg line-clamp-2">{idea.title}</CardTitle>
                        </CardHeader>
                    </Card>
                ))}
            </div>

            <IdeaDetailDialog
                idea={selectedIdea}
                open={dialogOpen}
                onOpenChange={(open) => {
                    setDialogOpen(open)
                    if (!open) setSelectedIdea(null)
                }}
            />
        </>
    )
}
