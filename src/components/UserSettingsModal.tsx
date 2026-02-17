'use client'

import React, { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { X, Camera, LogOut, Loader2, User, Building2, FileText, Save } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface UserSettingsModalProps {
    isOpen: boolean
    onClose: () => void
}

export function UserSettingsModal({ isOpen, onClose }: UserSettingsModalProps) {
    const router = useRouter()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const supabase = createClient()

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [uploading, setUploading] = useState(false)

    // Form state
    const [fullName, setFullName] = useState('')
    const [bio, setBio] = useState('')
    const [companyName, setCompanyName] = useState('')
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [userId, setUserId] = useState<string | null>(null)

    // Fetch profile data when modal opens
    useEffect(() => {
        if (!isOpen) return

        async function fetchProfile() {
            setLoading(true)
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            setUserId(user.id)

            const { data: profile } = await supabase
                .from('profiles')
                .select('full_name, avatar_url, bio, company_name')
                .eq('id', user.id)
                .single()

            if (profile) {
                setFullName(profile.full_name || '')
                setBio(profile.bio || '')
                setCompanyName(profile.company_name || '')
                setAvatarUrl(profile.avatar_url)
                setPreviewUrl(profile.avatar_url)
            }
            setLoading(false)
        }

        fetchProfile()
    }, [isOpen])

    // Handle avatar file selection
    async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file || !userId) return

        // Show local preview immediately
        const localPreview = URL.createObjectURL(file)
        setPreviewUrl(localPreview)

        setUploading(true)
        try {
            const fileExt = file.name.split('.').pop()
            const filePath = `${userId}/avatar.${fileExt}`

            // Upload to supabase storage
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, { cacheControl: '3600', upsert: true })

            if (uploadError) throw uploadError

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath)

            setAvatarUrl(publicUrl + '?t=' + Date.now()) // Cache bust
            setPreviewUrl(publicUrl + '?t=' + Date.now())
            toast.success('Photo uploaded!')
        } catch (err: any) {
            toast.error('Upload failed: ' + err.message)
            setPreviewUrl(avatarUrl) // Revert preview
        } finally {
            setUploading(false)
        }
    }

    // Save profile changes
    async function handleSave() {
        console.log('[SAVE] Button clicked!')

        // Get fresh user ID
        let uid = userId
        if (!uid) {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                alert('Not logged in. Please refresh.')
                return
            }
            uid = user.id
            setUserId(uid)
        }

        setSaving(true)
        console.log('[SAVE] Saving for user:', uid)

        try {
            // Step 1: Update basic fields (these columns always exist)
            const { data: basicResult, error: basicError } = await supabase
                .from('profiles')
                .update({
                    full_name: fullName,
                    avatar_url: avatarUrl,
                })
                .eq('id', uid)
                .select()

            console.log('[SAVE] Basic update:', JSON.stringify({ data: basicResult, error: basicError }))

            if (basicError) {
                throw new Error('Basic update failed: ' + (basicError.message || JSON.stringify(basicError)))
            }

            if (!basicResult || basicResult.length === 0) {
                throw new Error('Update returned no rows. RLS might be blocking. Check Supabase policies.')
            }

            // Step 2: Try updating bio & company_name (may not exist yet)
            if (bio || companyName) {
                const { error: extraError } = await supabase
                    .from('profiles')
                    .update({
                        bio: bio || null,
                        company_name: companyName || null,
                    } as any)
                    .eq('id', uid)

                if (extraError) {
                    console.warn('[SAVE] Extra fields (bio/company) update failed:', JSON.stringify(extraError))
                    console.warn('[SAVE] You need to run: ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio text; ALTER TABLE profiles ADD COLUMN IF NOT EXISTS company_name text;')
                    toast.success('Name & avatar saved! (bio/company requires DB column migration)')
                } else {
                    toast.success('Profile updated successfully!')
                }
            } else {
                toast.success('Profile updated successfully!')
            }

            onClose()
        } catch (err: any) {
            console.error('[SAVE] Error:', err)
            const msg = err?.message || JSON.stringify(err) || 'Unknown error'
            toast.error(msg)
            alert('Save failed:\n' + msg)
        } finally {
            setSaving(false)
        }
    }

    // Logout
    async function handleLogout() {
        await supabase.auth.signOut()
        router.push('/login')
    }

    // Get initials for avatar fallback
    const initials = fullName
        ? fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : '?'

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        className="relative w-full max-w-lg mx-4 bg-[#141829] border border-white/10 rounded-3xl shadow-2xl shadow-black/40 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-7 py-5 border-b border-white/5">
                            <div>
                                <h2 className="text-lg font-extrabold text-white">Profile Settings</h2>
                                <p className="text-xs text-slate-400 mt-0.5">Manage your account details</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                            </div>
                        ) : (
                            <>
                                {/* Content */}
                                <div className="p-7 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                                    {/* Avatar Section */}
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="relative group">
                                            <div className="w-24 h-24 rounded-full border-3 border-blue-500/30 overflow-hidden bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                                                {previewUrl ? (
                                                    <img
                                                        src={previewUrl}
                                                        alt="Avatar"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-2xl font-bold text-blue-300">{initials}</span>
                                                )}
                                            </div>
                                            {uploading && (
                                                <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center">
                                                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                                                </div>
                                            )}
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                className="absolute -bottom-1 -right-1 p-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-colors"
                                            >
                                                <Camera className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                                        >
                                            Change Photo
                                        </button>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleAvatarChange}
                                        />
                                    </div>

                                    {/* Form Fields */}
                                    <div className="space-y-4">
                                        {/* Full Name */}
                                        <div className="space-y-1.5">
                                            <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                                <User className="w-3.5 h-3.5" />
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                placeholder="Your full name"
                                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/30 transition-all"
                                            />
                                        </div>

                                        {/* Company / Institution */}
                                        <div className="space-y-1.5">
                                            <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                                <Building2 className="w-3.5 h-3.5" />
                                                Company / Institution
                                            </label>
                                            <input
                                                type="text"
                                                value={companyName}
                                                onChange={(e) => setCompanyName(e.target.value)}
                                                placeholder="Where do you work?"
                                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/30 transition-all"
                                            />
                                        </div>

                                        {/* Bio */}
                                        <div className="space-y-1.5">
                                            <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                                <FileText className="w-3.5 h-3.5" />
                                                About Me
                                            </label>
                                            <textarea
                                                value={bio}
                                                onChange={(e) => setBio(e.target.value)}
                                                placeholder="Tell us about yourself..."
                                                rows={3}
                                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/30 transition-all resize-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Footer Actions */}
                                <div className="px-7 py-5 border-t border-white/5 space-y-3">
                                    <div className="flex gap-3">
                                        <button
                                            onClick={onClose}
                                            className="flex-1 py-3 rounded-xl text-sm font-bold text-slate-300 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            disabled={saving}
                                            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-extrabold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/25 transition-all disabled:opacity-50 active:scale-[0.98]"
                                        >
                                            {saving ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Save className="w-4 h-4" />
                                            )}
                                            {saving ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>

                                    {/* Logout divider + button */}
                                    <div className="pt-3 border-t border-white/5">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Log Out
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
