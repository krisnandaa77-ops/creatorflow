
'use client'

import React, { useState } from 'react'
import { MoreHorizontal, Shield, User, Power, Copy, Check } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { EditUserModal } from './EditUserModal'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'sonner'

interface UserTableProps {
    users: any[]
}

export function UserTable({ users }: UserTableProps) {
    const router = useRouter()
    const [selectedUser, setSelectedUser] = useState<any | null>(null)
    const [modalOpen, setModalOpen] = useState(false)
    const [copiedId, setCopiedId] = useState<string | null>(null)

    const handleEdit = (user: any) => {
        setSelectedUser(user)
        setModalOpen(true)
    }

    const handleSuccess = () => {
        router.refresh()
    }

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text)
        setCopiedId(id)
        toast.success('ID copied to clipboard')
        setTimeout(() => setCopiedId(null), 2000)
    }

    return (
        <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-slate-400 uppercase font-medium text-xs">
                        <tr>
                            <th className="px-6 py-4">User Info</th>
                            <th className="px-6 py-4">User ID</th>
                            <th className="px-6 py-4">Company</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Plan</th>
                            <th className="px-6 py-4">Last Online</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9 ring-2 ring-white/10">
                                            <AvatarImage src={user.avatar_url} />
                                            <AvatarFallback className="bg-slate-700 text-slate-300">
                                                {user.full_name?.substring(0, 2).toUpperCase() || 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-semibold text-white">
                                                {user.full_name || 'No Name'}
                                            </div>
                                            <div className="text-xs text-slate-500">
                                                {user.email || 'Email Hidden'}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <code className="text-xs bg-black/30 px-1.5 py-0.5 rounded text-slate-400 font-mono">
                                            {user.id.substring(0, 8)}...
                                        </code>
                                        <button
                                            onClick={() => copyToClipboard(user.id, user.id)}
                                            className="text-slate-500 hover:text-white transition-colors"
                                        >
                                            {copiedId === user.id ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                                        </button>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-400">
                                    {user.company_name || '-'}
                                </td>
                                <td className="px-6 py-4">
                                    <Badge
                                        variant="outline"
                                        className={user.role === 'admin'
                                            ? "border-purple-500/50 text-purple-400 bg-purple-500/10"
                                            : "border-slate-700 text-slate-400"}
                                    >
                                        {user.role === 'admin' ? <Shield className="w-3 h-3 mr-1" /> : <User className="w-3 h-3 mr-1" />}
                                        {user.role}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4">
                                    <Badge
                                        variant="outline"
                                        className={user.subscription_tier === 'pro'
                                            ? "border-emerald-500/50 text-emerald-400 bg-emerald-500/10"
                                            : "border-slate-700 text-slate-400"}
                                    >
                                        {user.subscription_tier === 'pro' && <Power className="w-3 h-3 mr-1" />}
                                        {user.subscription_tier || 'free'}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 text-slate-400 text-xs">
                                    {user.last_seen ? (
                                        <span suppressHydrationWarning>
                                            {formatDistanceToNow(new Date(user.last_seen), { addSuffix: true })}
                                        </span>
                                    ) : (
                                        'Never'
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-white">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem
                                                onClick={() => handleEdit(user)}
                                                className="hover:bg-slate-800 cursor-pointer"
                                            >
                                                Edit User
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <EditUserModal
                user={selectedUser}
                open={modalOpen}
                onOpenChange={setModalOpen}
                onSuccess={handleSuccess}
            />
        </div>
    )
}
