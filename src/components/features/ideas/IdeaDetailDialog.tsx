'use client'

import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, Instagram, Video, Youtube, Clapperboard } from 'lucide-react'
import { setProductionDate } from '@/actions/content-actions'
import { toast } from 'sonner'
import dayjs from 'dayjs'

interface Idea {
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

interface IdeaDetailDialogProps {
    idea: Idea | null
    open: boolean
    onOpenChange: (open: boolean) => void
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

export function IdeaDetailDialog({ idea, open, onOpenChange }: IdeaDetailDialogProps) {
    const [isMoving, setIsMoving] = useState(false)

    if (!idea) return null

    async function handleMoveToProduction() {
        if (!idea) return
        setIsMoving(true)
        const today = dayjs().format('YYYY-MM-DD')

        const result = await setProductionDate(idea.id, today)
        setIsMoving(false)

        if (result.error) {
            toast.error(`Failed: ${result.error}`)
        } else {
            toast.success(`"${idea.title}" moved to production!`)
            onOpenChange(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden">
                {/* Large Thumbnail */}
                {idea.thumbnail_url ? (
                    <div className="w-full h-56 bg-muted overflow-hidden">
                        <img
                            src={idea.thumbnail_url}
                            alt={idea.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ) : (
                    <div className="w-full h-32 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                        <PlatformIcon platform={idea.platform} />
                    </div>
                )}

                <div className="p-6 space-y-4">
                    <DialogHeader className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="flex items-center gap-1">
                                <PlatformIcon platform={idea.platform} />
                                {idea.platform}
                            </Badge>
                            <Badge>{idea.status}</Badge>
                        </div>
                        <DialogTitle className="text-xl">{idea.title}</DialogTitle>
                    </DialogHeader>

                    {idea.description && (
                        <p className="text-sm text-muted-foreground">{idea.description}</p>
                    )}

                    {/* Date info */}
                    {(idea.production_date || idea.upload_date) && (
                        <div className="flex gap-3 text-xs text-muted-foreground">
                            {idea.production_date && (
                                <span>🎬 Production: {new Date(idea.production_date).toLocaleDateString()}</span>
                            )}
                            {idea.upload_date && (
                                <span>🚀 Upload: {new Date(idea.upload_date).toLocaleDateString()}</span>
                            )}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                        {idea.reference_link && (
                            <Button variant="outline" className="flex-1 gap-2" asChild>
                                <a href={idea.reference_link} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-4 w-4" />
                                    Open Reference
                                </a>
                            </Button>
                        )}

                        {idea.status === 'Idea' && (
                            <Button
                                className="flex-1 gap-2"
                                onClick={handleMoveToProduction}
                                disabled={isMoving}
                            >
                                <Clapperboard className="h-4 w-4" />
                                {isMoving ? 'Moving...' : 'Move to Production'}
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
