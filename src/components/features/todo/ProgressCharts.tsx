'use client'

import { motion } from 'framer-motion'

interface ProgressChartsProps {
    shootingPercentage: number
    uploadPercentage: number
    tasksPercentage: number
}

const CircleChart = ({ percentage, color, label, icon }: { percentage: number, color: string, label: string, icon: string }) => {
    const radius = 30
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (percentage / 100) * circumference

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="relative w-24 h-24 flex items-center justify-center">
                {/* Background Circle */}
                <svg className="transform -rotate-90 w-24 h-24">
                    <circle
                        cx="48"
                        cy="48"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-slate-100"
                    />
                    {/* Animated Circle */}
                    <motion.circle
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        cx="48"
                        cy="48"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeLinecap="round"
                        className={color}
                    />
                </svg>
                {/* Inner Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-700">
                    <span className="text-xl font-bold">{Math.round(percentage)}%</span>
                    <span className="text-xs">{icon}</span>
                </div>
            </div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</span>
        </div>
    )
}

export function ProgressCharts({ shootingPercentage, uploadPercentage, tasksPercentage }: ProgressChartsProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-around items-center bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 w-full"
        >
            <CircleChart percentage={shootingPercentage} color="text-indigo-500" label="Shooting" icon="🎬" />
            <div className="h-12 w-px bg-slate-100" />
            <CircleChart percentage={uploadPercentage} color="text-emerald-500" label="Uploads" icon="🚀" />
            <div className="h-12 w-px bg-slate-100" />
            <CircleChart percentage={tasksPercentage} color="text-amber-500" label="Tasks" icon="📝" />
        </motion.div>
    )
}
