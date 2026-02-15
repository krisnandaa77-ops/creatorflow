'use client'

import React from 'react'
import { Sidebar } from '@/components/Sidebar'
import { Plus, MoreHorizontal, Mail, Phone } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

interface Talent {
    id: string
    name: string
    role: string
    avatar_url?: string
    email: string
    status: 'Active' | 'On Leave'
    platforms: string[]
}

export default function TalentsPage() {
    const talents: Talent[] = [
        {
            id: '1',
            name: 'Krisnanda',
            role: 'Creator & Host',
            email: 'kris@creatorflow.app',
            status: 'Active',
            platforms: ['YouTube', 'TikTok', 'Instagram']
        },
        {
            id: '2',
            name: 'Sarah Editor',
            role: 'Lead Editor',
            email: 'sarah@creatorflow.app',
            status: 'Active',
            platforms: ['Premiere', 'After Effects']
        },
        {
            id: '3',
            name: 'Mike Design',
            role: 'Thumbnail Artist',
            email: 'mike@creatorflow.app',
            status: 'On Leave',
            platforms: ['Photoshop', 'Figma']
        },
        {
            id: '4',
            name: 'Alex Manager',
            role: 'Talent Manager',
            email: 'alex@creatorflow.app',
            status: 'Active',
            platforms: ['Notion', 'Email']
        }
    ]

    return (
        <div className="flex min-h-screen bg-white text-slate-900">
            <Sidebar />
            <main className="flex-1 ml-72 p-8">
                <header className="mb-10 flex justify-between items-center px-2">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">
                            Talents & Team 👥
                        </h1>
                        <p className="text-slate-500 mt-1 font-medium">
                            Manage your creative team and collaborators.
                        </p>
                    </div>
                    <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-2xl font-semibold transition-all shadow-lg shadow-blue-500/20 active:scale-95">
                        <Plus size={18} />
                        <span>Add Talent</span>
                    </button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-2">
                    {talents.map((talent) => (
                        <div
                            key={talent.id}
                            className="bg-white rounded-[32px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] border border-slate-100 transition-all duration-300 group relative"
                        >
                            <button className="absolute top-6 right-6 text-slate-300 hover:text-slate-500 transition-colors">
                                <MoreHorizontal size={20} />
                            </button>

                            <div className="flex flex-col items-center text-center">
                                <div className="relative mb-4">
                                    <Avatar className="h-24 w-24 border-4 border-slate-50 shadow-sm ring-1 ring-slate-100/50">
                                        <AvatarImage src={talent.avatar_url} />
                                        <AvatarFallback className="text-xl font-bold bg-blue-50 text-blue-600">
                                            {talent.name.slice(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-4 border-white ${talent.status === 'Active' ? 'bg-green-500' : 'bg-amber-500'}`} />
                                </div>

                                <h3 className="text-xl font-bold text-slate-900 mb-1">{talent.name}</h3>
                                <p className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-6">
                                    {talent.role}
                                </p>

                                <div className="w-full space-y-3">
                                    <div className="flex items-center gap-3 text-sm text-slate-500 bg-slate-50 p-3 rounded-2xl border border-slate-100/50">
                                        <Mail size={16} className="text-slate-400" />
                                        <span className="truncate">{talent.email}</span>
                                    </div>

                                    <div className="flex flex-wrap gap-2 justify-center pt-2">
                                        {talent.platforms.map((platform) => (
                                            <Badge key={platform} variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200 border-none font-medium px-2.5">
                                                {platform}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-slate-50 flex gap-3">
                                <button className="flex-1 py-2.5 rounded-xl text-sm font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm">
                                    Profile
                                </button>
                                <button className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-blue-500/20 shadow-md">
                                    Assign
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    )
}
