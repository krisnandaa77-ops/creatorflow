
'use client'

import { useState } from 'react'
import { createTalent } from '@/actions/talent-actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Plus, Users } from 'lucide-react'
import { toast } from 'sonner'

export function TalentForm() {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        const result = await createTalent(formData)
        setIsLoading(false)

        if (result.error) {
            toast.error('Failed to add talent')
        } else {
            toast.success('Talent added successfully')
            setOpen(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Talent
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Talent</DialogTitle>
                </DialogHeader>
                <form action={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" name="name" placeholder="Enter talent name" required />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Adding...' : 'Add Talent'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
