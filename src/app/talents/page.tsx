'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { Plus, MoreHorizontal, Mail, Send, X, User, Briefcase, AtSign, MessageCircle, Loader2, ChevronDown } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { getTalents, createTalent, updateTalent, deleteTalent } from '@/actions/talent-actions'
import { toast } from 'sonner'

// ============================================================
// Types
// ============================================================
interface Talent {
    id: string
    name: string
    role?: string | null
    avatar_url?: string | null
    email?: string | null
    telegram?: string | null
    status?: string | null
}

// ============================================================
// TalentModal — Shared Add/Edit form
// ============================================================
function TalentModal({
    open,
    onClose,
    talent,
    onSaved,
}: {
    open: boolean
    onClose: () => void
    talent?: Talent | null
    onSaved: (t: Talent) => void
}) {
    const isEdit = !!talent
    const [isLoading, setIsLoading] = useState(false)
    const [name, setName] = useState('')
    const [role, setRole] = useState('')
    const [email, setEmail] = useState('')
    const [telegram, setTelegram] = useState('')

    // Reset form when talent changes
    useEffect(() => {
        if (talent) {
            setName(talent.name || '')
            setRole(talent.role || '')
            setEmail(talent.email || '')
            setTelegram(talent.telegram || '')
        } else {
            setName('')
            setRole('')
            setEmail('')
            setTelegram('')
        }
    }, [talent, open])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!name.trim()) return

        setIsLoading(true)

        const formData = new FormData()
        formData.set('name', name.trim())
        formData.set('role', role.trim())
        formData.set('email', email.trim())
        formData.set('telegram', telegram.trim())

        try {
            if (isEdit && talent) {
                const result = await updateTalent(talent.id, formData)
                if (result.error) {
                    toast.error('Failed to update talent')
                } else {
                    toast.success('Profile updated!')
                    onSaved(result.data as Talent)
                    onClose()
                }
            } else {
                const result = await createTalent(formData)
                if (result.error) {
                    toast.error('Failed to add talent')
                } else {
                    toast.success('Talent added!')
                    onSaved(result.data as Talent)
                    onClose()
                }
            }
        } catch {
            toast.error('Something went wrong')
        } finally {
            setIsLoading(false)
        }
    }

    if (!open) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">
                            {isEdit ? 'Edit Profile' : 'Add Team Member'}
                        </h2>
                        <p className="text-xs text-slate-400 mt-0.5">
                            {isEdit ? 'Update talent information' : 'Add a new collaborator to your team'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-7 space-y-5">
                    {/* Name */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                            <User size={12} /> Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Krisnanda"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
                        />
                    </div>

                    {/* Role */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                            <Briefcase size={12} /> Role / Job Title
                        </label>
                        <input
                            type="text"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            placeholder="e.g. Video Editor"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
                        />
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                            <AtSign size={12} /> Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="e.g. john@example.com"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
                        />
                    </div>

                    {/* Telegram */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                            <MessageCircle size={12} /> Telegram Username
                        </label>
                        <input
                            type="text"
                            value={telegram}
                            onChange={(e) => setTelegram(e.target.value)}
                            placeholder="e.g. @johndoe or +628123456"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isLoading || !name.trim()}
                        className="w-full py-3 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                {isEdit ? 'Updating...' : 'Adding...'}
                            </>
                        ) : (
                            isEdit ? 'Update Profile' : 'Save Team Member'
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}

// ============================================================
// AssignDropdown — Contact actions popup
// ============================================================
function AssignDropdown({
    talent,
    open,
    onClose,
    anchorRef,
}: {
    talent: Talent
    open: boolean
    onClose: () => void
    anchorRef: React.RefObject<HTMLButtonElement | null>
}) {
    // Close on click outside
    useEffect(() => {
        if (!open) return
        function handleClick(e: MouseEvent) {
            if (anchorRef.current && anchorRef.current.contains(e.target as Node)) return
            onClose()
        }
        document.addEventListener('mousedown', handleClick)
        return () => document.removeEventListener('mousedown', handleClick)
    }, [open, onClose, anchorRef])

    if (!open) return null

    const hasEmail = !!talent.email?.trim()
    const hasTelegram = !!talent.telegram?.trim()

    const telegramUrl = (() => {
        const tg = talent.telegram?.trim() || ''
        if (tg.startsWith('@')) return `https://t.me/${tg.slice(1)}`
        if (tg.startsWith('+')) return `https://t.me/${tg}`
        return `https://t.me/${tg}`
    })()

    return (
        <div className="absolute right-0 top-full mt-2 z-50 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 w-56 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="px-4 py-2 border-b border-slate-50">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contact Actions</p>
            </div>

            {hasEmail ? (
                <a
                    href={`mailto:${talent.email}`}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                    onClick={onClose}
                >
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                        <Mail size={15} className="text-blue-600" />
                    </div>
                    <div>
                        <div className="font-semibold text-xs">Send Email</div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[140px]">{talent.email}</div>
                    </div>
                </a>
            ) : (
                <div className="flex items-center gap-3 px-4 py-3 text-sm text-slate-300 cursor-not-allowed">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                        <Mail size={15} className="text-slate-300" />
                    </div>
                    <div>
                        <div className="font-semibold text-xs">Send Email</div>
                        <div className="text-[10px] text-slate-300">No email set</div>
                    </div>
                </div>
            )}

            {hasTelegram ? (
                <a
                    href={telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-700 transition-colors"
                    onClick={onClose}
                >
                    <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center">
                        <Send size={15} className="text-sky-500" />
                    </div>
                    <div>
                        <div className="font-semibold text-xs">Chat on Telegram</div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[140px]">{talent.telegram}</div>
                    </div>
                </a>
            ) : (
                <div className="flex items-center gap-3 px-4 py-3 text-sm text-slate-300 cursor-not-allowed">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                        <Send size={15} className="text-slate-300" />
                    </div>
                    <div>
                        <div className="font-semibold text-xs">Chat on Telegram</div>
                        <div className="text-[10px] text-slate-300">No Telegram set</div>
                    </div>
                </div>
            )}
        </div>
    )
}


// ============================================================
// TalentCard — Individual card with Profile + Assign buttons
// ============================================================
function TalentCard({
    talent,
    onEdit,
}: {
    talent: Talent
    onEdit: (t: Talent) => void
}) {
    const [assignOpen, setAssignOpen] = useState(false)
    const assignRef = React.useRef<HTMLButtonElement>(null)

    return (
        <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] border border-slate-100 transition-all duration-300 group relative">
            <div className="flex flex-col items-center text-center">
                {/* Avatar */}
                <div className="relative mb-4">
                    <Avatar className="h-24 w-24 border-4 border-slate-50 shadow-sm ring-1 ring-slate-100/50">
                        <AvatarImage src={talent.avatar_url || ''} />
                        <AvatarFallback className="text-xl font-bold bg-blue-50 text-blue-600">
                            {talent.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full border-4 border-white bg-green-500" />
                </div>

                {/* Name & Role */}
                <h3 className="text-xl font-bold text-slate-900 mb-1">{talent.name}</h3>
                {talent.role && (
                    <p className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-4">
                        {talent.role}
                    </p>
                )}
                {!talent.role && <div className="mb-4" />}

                {/* Info rows */}
                <div className="w-full space-y-2">
                    {talent.email && (
                        <div className="flex items-center gap-3 text-sm text-slate-500 bg-slate-50 p-3 rounded-2xl border border-slate-100/50">
                            <Mail size={14} className="text-slate-400 shrink-0" />
                            <span className="truncate text-xs">{talent.email}</span>
                        </div>
                    )}
                    {talent.telegram && (
                        <div className="flex items-center gap-3 text-sm text-slate-500 bg-slate-50 p-3 rounded-2xl border border-slate-100/50">
                            <Send size={14} className="text-slate-400 shrink-0" />
                            <span className="truncate text-xs">{talent.telegram}</span>
                        </div>
                    )}
                    {!talent.email && !talent.telegram && (
                        <div className="text-xs text-slate-300 italic py-2">No contact info</div>
                    )}
                </div>
            </div>

            {/* Action buttons */}
            <div className="mt-6 pt-6 border-t border-slate-50 flex gap-3">
                <button
                    onClick={() => onEdit(talent)}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm active:scale-[0.97]"
                >
                    Profile
                </button>
                <div className="flex-1 relative">
                    <button
                        ref={assignRef}
                        onClick={() => setAssignOpen(!assignOpen)}
                        className="w-full py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-blue-500/20 shadow-md active:scale-[0.97] flex items-center justify-center gap-1.5"
                    >
                        Assign
                        <ChevronDown size={14} className={`transition-transform ${assignOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AssignDropdown
                        talent={talent}
                        open={assignOpen}
                        onClose={() => setAssignOpen(false)}
                        anchorRef={assignRef}
                    />
                </div>
            </div>
        </div>
    )
}


// ============================================================
// PAGE — Main Talents Page
// ============================================================
export default function TalentsPage() {
    const [talents, setTalents] = useState<Talent[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)
    const [editingTalent, setEditingTalent] = useState<Talent | null>(null)

    // Fetch talents from Supabase on mount
    const fetchTalents = useCallback(async () => {
        setIsLoading(true)
        try {
            const data = await getTalents()
            setTalents(data as Talent[])
        } catch {
            toast.error('Failed to load talents')
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchTalents()
    }, [fetchTalents])

    // Open Add modal
    function handleAdd() {
        setEditingTalent(null)
        setModalOpen(true)
    }

    // Open Edit modal
    function handleEdit(talent: Talent) {
        setEditingTalent(talent)
        setModalOpen(true)
    }

    // Handle saved talent (add or update)
    function handleSaved(saved: Talent) {
        setTalents((prev) => {
            const existing = prev.findIndex((t) => t.id === saved.id)
            if (existing >= 0) {
                // Update existing talent in-place
                const updated = [...prev]
                updated[existing] = saved
                return updated
            }
            // Add new talent
            return [...prev, saved]
        })
    }

    return (
        <div className="flex min-h-screen bg-white text-slate-900 overflow-x-hidden w-full">
            <Sidebar />
            <main className="flex-1 lg:ml-72 p-4 md:p-6 lg:p-8 pb-24 lg:pb-8">
                {/* Header */}
                <header className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-2">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                            Talents & Team 👥
                        </h1>
                        <p className="text-slate-500 mt-1 font-medium text-sm md:text-base">
                            Manage your creative team and collaborators.
                        </p>
                    </div>
                    <button
                        onClick={handleAdd}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-2xl font-semibold transition-all shadow-lg shadow-blue-500/20 active:scale-95 text-sm md:text-base shrink-0"
                    >
                        <Plus size={18} />
                        <span>Add Talent</span>
                    </button>
                </header>

                {/* Loading state */}
                {isLoading && (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 size={32} className="animate-spin text-blue-500" />
                    </div>
                )}

                {/* Empty state */}
                {!isLoading && talents.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 px-4">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                            <User size={32} className="text-slate-300" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-700 mb-1">No team members yet</h3>
                        <p className="text-sm text-slate-400 mb-6 text-center max-w-xs">
                            Add your first team member to start assigning content and collaborating.
                        </p>
                        <button
                            onClick={handleAdd}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-2xl font-semibold transition-all shadow-lg shadow-blue-500/20 active:scale-95 text-sm"
                        >
                            <Plus size={16} />
                            Add First Talent
                        </button>
                    </div>
                )}

                {/* Grid */}
                {!isLoading && talents.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-2">
                        {talents.map((talent) => (
                            <TalentCard
                                key={talent.id}
                                talent={talent}
                                onEdit={handleEdit}
                            />
                        ))}
                    </div>
                )}
            </main>

            {/* Modal */}
            <TalentModal
                open={modalOpen}
                onClose={() => {
                    setModalOpen(false)
                    setEditingTalent(null)
                }}
                talent={editingTalent}
                onSaved={handleSaved}
            />
        </div>
    )
}
