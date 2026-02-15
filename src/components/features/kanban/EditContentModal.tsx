'use client'

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format } from 'date-fns'
import { useReactToPrint } from 'react-to-print'
import { updateContentFull } from '@/actions/content-v2-actions'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command'
import { Separator } from '@/components/ui/separator'
import { CalendarIcon, ChevronsUpDown, X, Loader2, FileDown, MessageCircle, Send } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { PrintableBrief } from './PrintableBrief'
import { buildShareMessage, getWhatsAppUrl, getTelegramUrl } from '@/lib/share-utils'

const formSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    reference_link: z.string().optional(),
    production_date: z.date().nullable().optional(),
    upload_date: z.date().nullable().optional(),
    script: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface Talent {
    id: string
    name: string
    avatar_url?: string | null
}

interface EditContentModalProps {
    task: any
    talents: Talent[]
    open: boolean
    onOpenChange: (open: boolean) => void
    onSave: (updatedTask: any) => void
}

export function EditContentModal({
    task,
    talents,
    open,
    onOpenChange,
    onSave,
}: EditContentModalProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [selectedTalentIds, setSelectedTalentIds] = useState<string[]>(
        task?.content_talents?.map((ct: any) => ct.talent?.id).filter(Boolean) || []
    )
    const [talentPopoverOpen, setTalentPopoverOpen] = useState(false)
    const printRef = useRef<HTMLDivElement>(null)

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: task?.title || '',
            reference_link: task?.reference_link || '',
            production_date: task?.production_date ? new Date(task.production_date) : null,
            upload_date: task?.upload_date ? new Date(task.upload_date) : null,
            script: task?.script || '',
        },
    })

    const handlePrint = useReactToPrint({ contentRef: printRef })

    function toggleTalent(talentId: string) {
        setSelectedTalentIds(prev =>
            prev.includes(talentId)
                ? prev.filter(id => id !== talentId)
                : [...prev, talentId]
        )
    }

    function removeTalent(talentId: string) {
        setSelectedTalentIds(prev => prev.filter(id => id !== talentId))
    }

    function handleShare(channel: 'whatsapp' | 'telegram') {
        const msg = buildShareMessage(
            form.getValues('title'),
            form.getValues('production_date')
                ? format(form.getValues('production_date')!, 'yyyy-MM-dd')
                : null
        )
        const url = channel === 'whatsapp' ? getWhatsAppUrl(msg) : getTelegramUrl(msg)
        window.open(url, '_blank')
    }

    async function onSubmit(values: FormValues) {
        if (!task) return
        setIsLoading(true)

        const payload = {
            title: values.title,
            reference_link: values.reference_link || null,
            production_date: values.production_date
                ? format(values.production_date, 'yyyy-MM-dd')
                : null,
            upload_date: values.upload_date
                ? format(values.upload_date, 'yyyy-MM-dd')
                : null,
            script: values.script || null,
            talent_ids: selectedTalentIds,
        }

        const updatedTask = {
            ...task,
            title: payload.title,
            reference_link: payload.reference_link,
            production_date: payload.production_date,
            upload_date: payload.upload_date,
            script: payload.script,
            content_talents: selectedTalentIds.map(id => ({
                talent: talents.find(t => t.id === id),
            })),
        }

        onSave(updatedTask)
        onOpenChange(false)

        const result = await updateContentFull(task.id, payload)
        setIsLoading(false)

        if (result.error) {
            toast.error(`Failed to update: ${result.error}`)
        } else {
            toast.success('Content updated!')
        }
    }

    if (!task) return null

    const selectedTalents = talents.filter(t => selectedTalentIds.includes(t.id))

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Content</DialogTitle>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            {...form.register('title')}
                            placeholder="Content title"
                        />
                        {form.formState.errors.title && (
                            <p className="text-xs text-destructive">
                                {form.formState.errors.title.message}
                            </p>
                        )}
                    </div>

                    {/* Reference Link */}
                    <div className="space-y-2">
                        <Label htmlFor="reference_link">Reference Link</Label>
                        <Input
                            id="reference_link"
                            {...form.register('reference_link')}
                            placeholder="https://..."
                        />
                    </div>

                    {/* Date Pickers Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Production Date 🎬</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            'w-full justify-start text-left font-normal',
                                            !form.watch('production_date') && 'text-muted-foreground'
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {form.watch('production_date')
                                            ? format(form.watch('production_date')!, 'PPP')
                                            : 'Pick a date'}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={form.watch('production_date') ?? undefined}
                                        onSelect={(date) => form.setValue('production_date', date ?? null)}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="space-y-2">
                            <Label>Upload Date 🚀</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            'w-full justify-start text-left font-normal',
                                            !form.watch('upload_date') && 'text-muted-foreground'
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {form.watch('upload_date')
                                            ? format(form.watch('upload_date')!, 'PPP')
                                            : 'Pick a date'}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={form.watch('upload_date') ?? undefined}
                                        onSelect={(date) => form.setValue('upload_date', date ?? null)}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    {/* Multi-select Talents */}
                    <div className="space-y-2">
                        <Label>Assign Talents</Label>
                        {selectedTalents.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-2">
                                {selectedTalents.map(talent => (
                                    <Badge key={talent.id} variant="secondary" className="gap-1 pr-1">
                                        {talent.name}
                                        <button
                                            type="button"
                                            onClick={() => removeTalent(talent.id)}
                                            className="ml-1 rounded-full hover:bg-muted p-0.5"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        )}
                        <Popover open={talentPopoverOpen} onOpenChange={setTalentPopoverOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={talentPopoverOpen}
                                    className="w-full justify-between font-normal"
                                >
                                    <span className="text-muted-foreground">Search talents...</span>
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                                <Command>
                                    <CommandInput placeholder="Search talent..." />
                                    <CommandList>
                                        <CommandEmpty>No talents found.</CommandEmpty>
                                        <CommandGroup>
                                            {talents.map(talent => {
                                                const isSelected = selectedTalentIds.includes(talent.id)
                                                return (
                                                    <CommandItem
                                                        key={talent.id}
                                                        value={talent.name}
                                                        onSelect={() => toggleTalent(talent.id)}
                                                        className="cursor-pointer"
                                                    >
                                                        <div className={cn(
                                                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                            isSelected ? "bg-primary text-primary-foreground" : "opacity-50"
                                                        )}>
                                                            {isSelected && (
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                                                                    <polyline points="20 6 9 17 4 12" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                        {talent.name}
                                                    </CommandItem>
                                                )
                                            })}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Script */}
                    <div className="space-y-2">
                        <Label htmlFor="script">Script / Naskah 📝</Label>
                        <Textarea
                            id="script"
                            {...form.register('script')}
                            placeholder="Write your script here..."
                            rows={8}
                            className="resize-y font-mono text-sm"
                        />
                    </div>

                    <Separator />

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3">
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : 'Save Changes'}
                        </Button>

                        <div className="grid grid-cols-3 gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handlePrint()}
                                className="gap-1.5"
                            >
                                <FileDown className="h-4 w-4" />
                                PDF
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleShare('whatsapp')}
                                className="gap-1.5 text-green-600 hover:text-green-700 hover:bg-green-50"
                            >
                                <MessageCircle className="h-4 w-4" />
                                WA
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleShare('telegram')}
                                className="gap-1.5 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                            >
                                <Send className="h-4 w-4" />
                                TG
                            </Button>
                        </div>
                    </div>
                </form>
            </DialogContent>

            {/* Hidden printable brief */}
            <div className="hidden">
                <PrintableBrief
                    ref={printRef}
                    title={form.watch('title')}
                    platform={task?.platform || ''}
                    talentNames={selectedTalents.map(t => t.name)}
                    productionDate={form.watch('production_date') ? format(form.watch('production_date')!, 'yyyy-MM-dd') : null}
                    uploadDate={form.watch('upload_date') ? format(form.watch('upload_date')!, 'yyyy-MM-dd') : null}
                    referenceLink={form.watch('reference_link') || null}
                    script={form.watch('script') || null}
                />
            </div>
        </Dialog>
    )
}
