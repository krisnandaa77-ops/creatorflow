
'use client'

import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { updateUserProfile } from '@/actions/admin-actions'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface EditUserModalProps {
    user: any | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: () => void
}

export function EditUserModal({ user, open, onOpenChange, onSuccess }: EditUserModalProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [role, setRole] = useState(user?.role || 'user')
    const [tier, setTier] = useState(user?.subscription_tier || 'free')

    // Reset state when user changes
    React.useEffect(() => {
        if (user) {
            setRole(user.role || 'user')
            setTier(user.subscription_tier || 'free')
        }
    }, [user])

    const handleSave = async () => {
        if (!user) return
        setIsLoading(true)

        try {
            const res = await updateUserProfile(user.id, {
                role,
                subscription_tier: tier,
            })

            if (res.error) {
                toast.error(res.error)
                return
            }

            toast.success('User updated successfully')
            onSuccess()
            onOpenChange(false)
        } catch (error) {
            toast.error('Failed to update user')
        } finally {
            setIsLoading(false)
        }
    }

    if (!user) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-slate-900 border border-slate-800 text-white sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    <div className="space-y-2">
                        <Label className="text-slate-400">Full Name</Label>
                        <div className="p-3 rounded-md bg-slate-800 border border-slate-700 text-sm">
                            {user.full_name || 'No Name'}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Role</Label>
                        <Select value={role} onValueChange={setRole}>
                            <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700 text-white">
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Subscription Tier</Label>
                        <Select value={tier} onValueChange={setTier}>
                            <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700 text-white">
                                <SelectItem value="free">Free</SelectItem>
                                <SelectItem value="pro">Pro</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        className="text-slate-400 hover:text-white"
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
