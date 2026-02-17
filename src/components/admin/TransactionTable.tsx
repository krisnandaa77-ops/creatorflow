
import React from 'react'
import { Badge } from '@/components/ui/badge'
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle } from 'lucide-react'

interface TransactionTableProps {
    payments: any[]
}

export function TransactionTable({ payments }: TransactionTableProps) {
    return (
        <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-slate-400 uppercase font-medium text-xs">
                        <tr>
                            <th className="px-6 py-4">Transaction ID</th>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Plan</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4 text-right">Amount</th>
                            <th className="px-6 py-4 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {payments.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                                    No transactions found.
                                </td>
                            </tr>
                        ) : (
                            payments.map((payment) => (
                                <tr key={payment.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs text-slate-500">
                                        {payment.id.substring(0, 8)}...
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-white">
                                            {payment.profiles?.full_name || 'Unknown User'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-300 capitalize">
                                        {payment.plan_type?.replace('_', ' ') || '-'}
                                    </td>
                                    <td suppressHydrationWarning className="px-6 py-4 text-slate-400">
                                        {new Date(payment.payment_date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right font-medium text-white">
                                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: payment.currency || 'IDR' }).format(payment.amount)}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <Badge
                                            variant="outline"
                                            className={
                                                payment.status === 'succeeded' ? "border-emerald-500/50 text-emerald-400 bg-emerald-500/10" :
                                                    payment.status === 'pending' ? "border-amber-500/50 text-amber-400 bg-amber-500/10" :
                                                        "border-red-500/50 text-red-400 bg-red-500/10"
                                            }
                                        >
                                            {payment.status === 'succeeded' && <CheckCircle className="w-3 h-3 mr-1" />}
                                            {payment.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                                            {payment.status === 'failed' && <XCircle className="w-3 h-3 mr-1" />}
                                            {payment.status}
                                        </Badge>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
