'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createContent, updateContent } from '@/actions/content-actions'
import { toast } from 'sonner'
import { Loader2, Calendar as CalendarIcon, FileDown } from 'lucide-react'
import { exportContentToPDF } from '@/lib/pdf-generator'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { Checkbox } from '@/components/ui/checkbox'

// ============================================================
// FIELD → SUPABASE COLUMN MAP (from src/types/supabase.ts):
//   title           → title
//   description     → description
//   platform        → platform  (single string)
//   status          → status
//   referenceLink   → reference_link
//   script          → script
//   productionDate  → production_date
//   uploadDate      → upload_date
// ============================================================

interface ContentModalProps {
    task?: any | null
    talents: any[]
    open: boolean
    onOpenChange: (open: boolean) => void
    onSave?: (task: any) => void
}

export function ContentModal({ task, talents, open, onOpenChange, onSave }: ContentModalProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [title, setTitle] = useState('')
    const [platform, setPlatform] = useState('TikTok')
    const [status, setStatus] = useState('Idea')
    const [description, setDescription] = useState('')
    const [referenceLink, setReferenceLink] = useState('')
    const [script, setScript] = useState('')
    const [productionDate, setProductionDate] = useState<Date | undefined>(undefined)
    const [uploadDate, setUploadDate] = useState<Date | undefined>(undefined)
    const [selectedTalentIds, setSelectedTalentIds] = useState<string[]>([])

    // Hydrate form when modal opens
    useEffect(() => {
        if (open) {
            if (task) {
                console.log('[ContentModal] EDIT MODE — hydrating:', { id: task.id, title: task.title })
                setTitle(task.title || '')
                setPlatform(task.platform || 'TikTok')
                setStatus(task.status || 'Idea')
                setDescription(task.description || '')
                setReferenceLink(task.reference_link || '')
                setScript(task.script || '')
                setProductionDate(task.production_date ? new Date(task.production_date) : undefined)
                setUploadDate(task.upload_date ? new Date(task.upload_date) : undefined)
                setSelectedTalentIds(
                    task.content_talents?.map((ct: any) => ct.talent?.id).filter(Boolean) || []
                )
            } else {
                console.log('[ContentModal] CREATE MODE — blank form')
                setTitle('')
                setPlatform('TikTok')
                setStatus('Idea')
                setDescription('')
                setReferenceLink('')
                setScript('')
                setProductionDate(undefined)
                setUploadDate(undefined)
                setSelectedTalentIds([])
            }
        }
    }, [open, task])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (isLoading) return
        setIsLoading(true)

        // Build FormData with EXACT Supabase column names
        const formData = new FormData()
        formData.append('title', title)
        formData.append('platform', platform)
        formData.append('status', status)
        formData.append('description', description)
        formData.append('reference_link', referenceLink)
        formData.append('script', script)
        if (productionDate) formData.append('production_date', format(productionDate, 'yyyy-MM-dd'))
        if (uploadDate) formData.append('upload_date', format(uploadDate, 'yyyy-MM-dd'))
        selectedTalentIds.forEach(id => formData.append('talent_ids', id))

        const debugPayload = {
            mode: task ? 'UPDATE' : 'CREATE',
            id: task?.id ?? '(new)',
            title, platform, status, description, referenceLink, script,
            productionDate: productionDate ? format(productionDate, 'yyyy-MM-dd') : null,
            uploadDate: uploadDate ? format(uploadDate, 'yyyy-MM-dd') : null,
            selectedTalentIds,
        }
        console.log('[ContentModal] Submitting:', JSON.stringify(debugPayload, null, 2))

        try {
            let res: any

            if (task) {
                if (!task.id) {
                    console.error('[ContentModal] CRITICAL: task.id is missing!', task)
                    toast.error('Cannot update: Content ID is missing.')
                    setIsLoading(false)
                    return
                }
                res = await updateContent(task.id, formData)
            } else {
                res = await createContent(formData)
            }

            console.log('[ContentModal] Server response:', JSON.stringify(res, null, 2))

            if (res?.error) {
                throw new Error(res.error)
            }

            toast.success(task ? '✅ Content updated!' : '✅ New idea created!')
            onOpenChange(false)
            if (onSave) onSave({ ...task, title, platform, status })
        } catch (error: any) {
            console.error('[ContentModal] SAVE FAILED:', error)
            toast.error(`Save failed: ${error.message}`)
        } finally {
            setIsLoading(false)
        }
    }

    const toggleTalent = (talentId: string) => {
        setSelectedTalentIds(prev =>
            prev.includes(talentId) ? prev.filter(id => id !== talentId) : [...prev, talentId]
        )
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[100vw] sm:max-w-[600px] w-full h-[100dvh] sm:h-auto sm:max-h-[90vh] bg-white text-slate-900 rounded-none sm:rounded-[32px] border-none shadow-2xl overflow-hidden flex flex-col p-0">
                <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-8 sm:py-6">
                    <DialogHeader>
                        <DialogTitle className="text-xl sm:text-2xl font-bold">
                            {task ? 'Edit Content' : 'New Idea'}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                        {/* Title */}
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-slate-700 font-semibold">Title</Label>
                            <Input
                                id="title"
                                required
                                placeholder="e.g. Day in the life..."
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="rounded-xl border-slate-200 focus:ring-blue-500"
                            />
                        </div>

                        {/* Platform + Status */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-slate-700 font-semibold">Platform</Label>
                                <Select value={platform} onValueChange={setPlatform}>
                                    <SelectTrigger className="rounded-xl border-slate-200">
                                        <SelectValue placeholder="Select platform" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white rounded-xl">
                                        <SelectItem value="TikTok">TikTok</SelectItem>
                                        <SelectItem value="Instagram">Instagram</SelectItem>
                                        <SelectItem value="YouTube">YouTube</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-700 font-semibold">Status</Label>
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger className="rounded-xl border-slate-200">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white rounded-xl">
                                        <SelectItem value="Idea">Idea</SelectItem>
                                        <SelectItem value="To-Do">To-Do</SelectItem>
                                        <SelectItem value="Filming">Filming</SelectItem>
                                        <SelectItem value="Editing">Editing</SelectItem>
                                        <SelectItem value="Done">Done</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-slate-700 font-semibold">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Short description of this content idea..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="rounded-xl border-slate-200 min-h-[80px] focus:ring-blue-500"
                            />
                        </div>

                        {/* Script / Notes */}
                        <div className="space-y-2">
                            <Label htmlFor="script" className="text-slate-700 font-semibold">Script / Notes</Label>
                            <Textarea
                                id="script"
                                placeholder="Key hooks, visual ideas, talking points..."
                                value={script}
                                onChange={(e) => setScript(e.target.value)}
                                className="rounded-xl border-slate-200 min-h-[80px] focus:ring-blue-500"
                            />
                        </div>

                        {/* Reference Link */}
                        <div className="space-y-2">
                            <Label htmlFor="ref-link" className="text-slate-700 font-semibold">Reference Link</Label>
                            <Input
                                id="ref-link"
                                placeholder="https://..."
                                value={referenceLink}
                                onChange={(e) => setReferenceLink(e.target.value)}
                                className="rounded-xl border-slate-200 focus:ring-blue-500"
                            />
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 flex flex-col">
                                <Label className="text-slate-700 font-semibold">Production Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant={"outline"} className={cn("rounded-xl justify-start text-left font-normal border-slate-200", !productionDate && "text-muted-foreground")}>
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {productionDate ? format(productionDate, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 bg-white rounded-xl" align="start">
                                        <Calendar mode="single" selected={productionDate} onSelect={setProductionDate} initialFocus />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="space-y-2 flex flex-col">
                                <Label className="text-slate-700 font-semibold">Upload Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant={"outline"} className={cn("rounded-xl justify-start text-left font-normal border-slate-200", !uploadDate && "text-muted-foreground")}>
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {uploadDate ? format(uploadDate, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 bg-white rounded-xl" align="start">
                                        <Calendar mode="single" selected={uploadDate} onSelect={setUploadDate} initialFocus />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        {/* Talent Checkboxes */}
                        {talents.length > 0 && (
                            <div className="space-y-2">
                                <Label className="text-slate-700 font-semibold">Assign Talents</Label>
                                <div className="grid grid-cols-2 gap-2 border border-slate-100 p-4 rounded-xl max-h-32 overflow-y-auto">
                                    {talents.map(talent => (
                                        <div key={talent.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`talent-${talent.id}`}
                                                checked={selectedTalentIds.includes(talent.id)}
                                                onCheckedChange={() => toggleTalent(talent.id)}
                                            />
                                            <Label htmlFor={`talent-${talent.id}`} className="text-sm cursor-pointer">{talent.name}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </form>
                </div>

                {/* Sticky Footer — fixed at bottom with blur */}
                <div className="sticky bottom-0 bg-white/80 backdrop-blur-xl border-t border-slate-100 px-4 py-4 sm:px-8 sm:py-4 flex gap-2 justify-end"
                    style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 16px)' }}
                >
                    <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl" disabled={isLoading}>
                        Cancel
                    </Button>
                    {task && (
                        <Button
                            type="button"
                            variant="outline"
                            className="rounded-xl border-blue-200 text-blue-600 hover:bg-blue-50 gap-2"
                            onClick={() => {
                                exportContentToPDF({
                                    ...task,
                                    title, platform, status, description,
                                    script,
                                    reference_link: referenceLink,
                                    production_date: productionDate ? productionDate.toISOString().split('T')[0] : task.production_date,
                                    upload_date: uploadDate ? uploadDate.toISOString().split('T')[0] : task.upload_date,
                                })
                                toast.success('📄 PDF downloaded!')
                            }}
                        >
                            <FileDown size={16} />
                            Export PDF
                        </Button>
                    )}
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 flex-1 sm:flex-none"
                        onClick={handleSubmit}
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {task ? 'Save Changes' : 'Create Idea'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
