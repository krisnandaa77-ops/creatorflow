'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { LayoutDashboard, Lightbulb, CheckSquare, Calendar, Users, Settings, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Lightbulb, label: 'Idea Bank', href: '/ideas' },
  { icon: CheckSquare, label: 'Daily Focus', href: '/todo' },
  { icon: Calendar, label: 'Calendar', href: '/calendar' },
  { icon: Users, label: 'Talents', href: '/talents' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <motion.div
      initial={{ x: -250, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="hidden md:flex flex-col h-screen w-72 bg-blue-700/95 backdrop-blur-xl text-white shadow-[0_20px_50px_-12px_rgba(79,70,229,0.3)] relative overflow-hidden z-20"
    >
      {/* Decorative Gradients */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/50 to-transparent pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-500/30 rounded-full blur-3xl pointer-events-none" />

      {/* Logo Section */}
      <div className="p-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative group cursor-default"
        >
          <div className="flex items-center gap-2">
            {/* Logo Icon */}
            <div className="h-8 w-8 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
              <div className="h-4 w-4 bg-blue-600 rounded-md rotate-45 transform group-hover:rotate-90 transition-transform duration-500" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-white bg-[length:200%_auto] animate-shimmer">
              CreatorFlow
            </h1>
          </div>
          <div className="absolute -bottom-1 left-0 w-12 h-1 bg-white/30 rounded-full group-hover:w-full transition-all duration-500 ease-out" />
        </motion.div>
        <p className="text-blue-200 text-[10px] mt-2 font-medium tracking-widest uppercase pl-1">Premium Content Suite</p>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-6 relative z-10">
        <nav className="space-y-2">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href

            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-4 px-6 py-3.5 rounded-full transition-all duration-300 group relative overflow-hidden",
                    isActive
                      ? "bg-white text-blue-700 shadow-lg shadow-blue-900/20 font-bold scale-105"
                      : "text-blue-100 hover:bg-white/10 hover:text-white font-medium"
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 transition-transform duration-300",
                      isActive ? "scale-110" : "group-hover:scale-110"
                    )}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span className="relative z-10">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activePill"
                      className="absolute inset-0 bg-white rounded-full z-0"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              </motion.div>
            )
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="p-6 relative z-10 space-y-3">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="w-full flex items-center gap-3 px-6 py-3 text-blue-200 hover:text-white hover:bg-white/10 rounded-full transition-colors text-xs font-semibold uppercase tracking-wider"
        >
          <Settings className="h-4 w-4" />
          Settings
        </motion.button>
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="w-full flex items-center gap-3 px-6 py-3 text-red-300 hover:text-red-100 hover:bg-red-500/20 rounded-full transition-colors text-xs font-semibold uppercase tracking-wider"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </motion.button>
      </div>
    </motion.div>
  )
}

export function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-blue-700/95 backdrop-blur-xl border-t border-white/10 pb-safe">
      <nav className="flex justify-around items-center p-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 relative",
                isActive ? "text-white" : "text-blue-200 hover:text-white"
              )}
            >
              <div className={cn(
                "p-1.5 rounded-full transition-all duration-300",
                isActive ? "bg-white text-blue-700 shadow-lg scale-110" : ""
              )}>
                <item.icon
                  className={cn("h-5 w-5", isActive && "stroke-[2.5px]")}
                />
              </div>
              {isActive && (
                <span className="text-[10px] font-bold tracking-wide">
                  {item.label === 'Daily Focus' ? 'Focus' : item.label}
                </span>
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
