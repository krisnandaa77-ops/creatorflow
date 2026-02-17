'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { registerUser } from '@/actions/auth-actions'

export default function RegisterPage() {
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError(null)

        const formData = new FormData(e.currentTarget)
        const password = formData.get('password') as string
        const confirmPassword = formData.get('confirmPassword') as string

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters')
            return
        }

        setIsLoading(true)
        const result = await registerUser(formData)

        if (result?.error) {
            setError(result.error)
            setIsLoading(false)
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#111521] text-white selection:bg-[#3f68e4]/30">
            {/* Background gradients */}
            <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#3f68e4]/15 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[120px] rounded-full" />
            </div>

            <div className="w-full max-w-md mx-4 py-8">
                {/* Logo */}
                <div className="flex items-center gap-2.5 justify-center mb-10">
                    <div className="w-10 h-10 bg-[#3f68e4] rounded-xl flex items-center justify-center shadow-lg shadow-[#3f68e4]/30">
                        <span className="material-icons text-white text-2xl">stream</span>
                    </div>
                    <span className="text-2xl font-extrabold tracking-tight">CreatorFlow</span>
                </div>

                {/* Glassmorphism Card */}
                <div className="bg-white/[0.04] backdrop-blur-[40px] border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-extrabold mb-2">Create Account</h1>
                        <p className="text-sm text-slate-400">Join the next generation of creators</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3 text-sm text-red-400 font-medium">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                required
                                placeholder="John Doe"
                                className="w-full px-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white text-sm font-medium placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3f68e4]/50 focus:border-[#3f68e4]/50 transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                required
                                placeholder="you@example.com"
                                className="w-full px-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white text-sm font-medium placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3f68e4]/50 focus:border-[#3f68e4]/50 transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                required
                                placeholder="Min. 6 characters"
                                className="w-full px-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white text-sm font-medium placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3f68e4]/50 focus:border-[#3f68e4]/50 transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                required
                                placeholder="••••••••"
                                className="w-full px-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white text-sm font-medium placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3f68e4]/50 focus:border-[#3f68e4]/50 transition-all"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 rounded-2xl bg-[#3f68e4] hover:bg-[#3f68e4]/90 text-white text-sm font-extrabold shadow-lg shadow-[#3f68e4]/25 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Creating account...
                                </span>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-slate-400">
                            Already have an account?{' '}
                            <Link href="/login" className="text-[#3f68e4] font-bold hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Back to home */}
                <div className="mt-6 text-center">
                    <Link href="/" className="text-xs text-slate-500 hover:text-slate-300 transition-colors font-medium">
                        ← Back to homepage
                    </Link>
                </div>
            </div>
        </main>
    )
}
