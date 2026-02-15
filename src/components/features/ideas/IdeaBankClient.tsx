'use client'

import React, { useState } from 'react'
import { Plus, Search, Lightbulb, X, Loader2 } from 'lucide-react'
import { IdeaCard } from '@/components/IdeaCard'
import { createIdea, updateIdea } from '@/actions/content-actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface Idea {
    id: string
    title: string
    description?: string | null
    reference_link?: string | null
    platform?: string
    status?: string
    created_at?: string
}

interface IdeaBankClientProps {
    initialIdeas: Idea[]
}

export function IdeaBankClient({ initialIdeas }: IdeaBankClientProps) {
    const router = useRouter()
    const [search, setSearch] = useState('')
    const [modalOpen, setModalOpen] = useState(false)
    const [editingIdea, setEditingIdea] = useState<Idea | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    // Form state
    const [title, setTitle] = useState('')
    const [referenceLink, setReferenceLink] = useState('')
    const [description, setDescription] = useState('')

    const filteredIdeas = initialIdeas.filter(idea =>
        idea.title.toLowerCase().includes(search.toLowerCase()) ||
        idea.description?.toLowerCase().includes(search.toLowerCase())
    )

    function openCreateModal() {
        setEditingIdea(null)
        setTitle('')
        setReferenceLink('')
        setDescription('')
        setModalOpen(true)
    }

    function openEditModal(idea: Idea) {
        setEditingIdea(idea)
        setTitle(idea.title || '')
        setReferenceLink(idea.reference_link || '')
        setDescription(idea.description || '')
        setModalOpen(true)
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (isLoading || !title.trim()) return
        setIsLoading(true)

        const formData = new FormData()
        formData.append('title', title.trim())
        formData.append('reference_link', referenceLink.trim())
        formData.append('description', description.trim())

        console.log('[IdeaBankClient] Submitting:', {
            mode: editingIdea ? 'EDIT' : 'CREATE',
            title, referenceLink, description
        })

        try {
            let res: any
            if (editingIdea) {
                res = await updateIdea(editingIdea.id, formData)
            } else {
                res = await createIdea(formData)
            }

            console.log('[IdeaBankClient] Response:', res)

            if (res?.error) {
                throw new Error(res.error)
            }

            toast.success(editingIdea ? '✏️ Idea updated!' : '💡 Idea saved!')
            setModalOpen(false)
            router.refresh()
        } catch (err: any) {
            console.error('[IdeaBankClient] Save failed:', err)
            toast.error(`Failed: ${err.message}`)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            {/* Header */}
            <header className="mb-10 flex justify-between items-center px-2">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">
                        Idea Bank 💡
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium">
                        Brainstorm and capture your next viral hit.
                    </p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-2xl font-semibold transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                >
                    <Plus size={18} />
                    <span>Add New Idea</span>
                </button>
            </header>

            {/* Search Bar */}
            <div className="mb-8 px-2 relative">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400">
                    <Search size={20} />
                </div>
                <input
                    type="text"
                    placeholder="Search your ideas..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-white rounded-[24px] border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-700 shadow-sm"
                />
            </div>

            {/* Ideas Grid */}
            <div className="px-2">
                {filteredIdeas.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center py-20 text-center"
                    >
                        <div className="p-6 bg-blue-50 rounded-3xl mb-6">
                            <Lightbulb className="h-12 w-12 text-blue-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">
                            {search ? 'No ideas match your search' : 'No ideas yet'}
                        </h3>
                        <p className="text-slate-500 mb-6 max-w-sm">
                            {search
                                ? 'Try a different search term.'
                                : 'Start capturing your creative ideas. Click the button above to add your first one!'}
                        </p>
                        {!search && (
                            <button
                                onClick={openCreateModal}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-semibold transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                            >
                                <Plus size={18} />
                                Add Your First Idea
                            </button>
                        )}
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredIdeas.map((idea, i) => (
                            <IdeaCard
                                key={idea.id}
                                idea={idea}
                                index={i}
                                onClick={() => openEditModal(idea)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Add / Edit Idea Modal */}
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent className="sm:max-w-[520px] bg-white text-slate-900 rounded-[32px] border-none shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                            <div className="p-2 bg-blue-50 rounded-xl">
                                <Lightbulb className="h-5 w-5 text-blue-600" />
                            </div>
                            {editingIdea ? 'Edit Idea' : 'New Idea'}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-5 pt-4">
                        {/* Judul Ide */}
                        <div className="space-y-2">
                            <Label htmlFor="idea-title" className="text-slate-700 font-semibold text-sm">
                                Judul Ide <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="idea-title"
                                required
                                placeholder="e.g. Day in the life of a developer..."
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="rounded-xl border-slate-200 focus:ring-blue-500 py-3"
                                autoFocus
                            />
                        </div>

                        {/* Link Referensi */}
                        <div className="space-y-2">
                            <Label htmlFor="idea-ref" className="text-slate-700 font-semibold text-sm">
                                Link Referensi
                            </Label>
                            <Input
                                id="idea-ref"
                                type="url"
                                placeholder="https://instagram.com/reel/..."
                                value={referenceLink}
                                onChange={(e) => setReferenceLink(e.target.value)}
                                className="rounded-xl border-slate-200 focus:ring-blue-500 py-3"
                            />
                        </div>

                        {/* Deskripsi Singkat */}
                        <div className="space-y-2">
                            <Label htmlFor="idea-desc" className="text-slate-700 font-semibold text-sm">
                                Deskripsi Singkat
                            </Label>
                            <Textarea
                                id="idea-desc"
                                placeholder="Key hooks, visual ideas, talking points..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="rounded-xl border-slate-200 focus:ring-blue-500 min-h-[100px] resize-none"
                            />
                        </div>

                        <DialogFooter className="pt-2">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setModalOpen(false)}
                                className="rounded-xl"
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isLoading || !title.trim()}
                                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 shadow-lg shadow-blue-500/20"
                            >
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {editingIdea ? 'Save Changes' : 'Save Idea'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}
