
'use client'

import { useState } from 'react'
import { createIdeaWithMetadata } from '@/actions/content-v2-actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Plus, Link as LinkIcon, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export function IdeaFormV2() {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        const result = await createIdeaWithMetadata(formData)
        setIsLoading(false)

        if (result.error) {
            toast.error('Failed to add idea')
        } else {
            toast.success('Idea added successfully!')
            setOpen(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    New Idea
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Content Idea</DialogTitle>
                </DialogHeader>
                <form action={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" name="title" placeholder="e.g., Viral Dance Challenge" required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="platform">Platform</Label>
                        <Select name="platform" defaultValue="Instagram">
                            <SelectTrigger>
                                <SelectValue placeholder="Select platform" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Instagram">Instagram</SelectItem>
                                <SelectItem value="TikTok">TikTok</SelectItem>
                                <SelectItem value="YouTube">YouTube</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="reference_link" className="flex items-center gap-2">
                            <LinkIcon className="h-3 w-3" />
                            Reference URL (Auto-Thumbnail)
                        </Label>
                        <Input
                            id="reference_link"
                            name="reference_link"
                            placeholder="https://instagram.com/p/..."
                        />
                        <p className="text-[10px] text-muted-foreground">
                            We'll try to fetch the thumbnail automatically.
                        </p>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Fetching Metadata & Saving...
                            </>
                        ) : 'Save Idea'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
