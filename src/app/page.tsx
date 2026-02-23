'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { HeroAnimation } from '@/components/features/HeroAnimation'

const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ')

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)

  // Kanban Board Animation State
  const INITIAL_COLUMNS = [
    {
      id: 'idea', title: 'Idea Bank', color: 'bg-slate-500', count: 12, cards: [
        { id: 'card-1', title: 'Review Galaxy S26', tag: 'Tech', platform: 'YouTube', date: 'Jan 20' },
        { id: 'card-2', title: 'Day in Life: Bali', tag: 'Vlog', platform: 'TikTok', date: 'Feb 02' }
      ]
    },
    {
      id: 'todo', title: 'To-Do', color: 'bg-blue-500', count: 5, cards: [
        { id: 'card-3', title: 'Scripting: Apple Event', tag: 'Script', platform: 'Docs', date: 'Today' }
      ]
    },
    {
      id: 'filming', title: 'Filming', color: 'bg-yellow-500', count: 2, cards: [
        { id: 'card-4', title: 'Al Ronaldo pas libur', tag: 'Vlog', platform: 'Instagram', date: 'In Progress' }
      ]
    },
    {
      id: 'editing', title: 'Editing', color: 'bg-purple-500', count: 3, cards: [
        { id: 'card-5', title: 'Tutorial CapCut', tag: 'Edu', platform: 'TikTok', date: 'Due Tomorrow' }
      ]
    },
    {
      id: 'done', title: 'Done', color: 'bg-green-500', count: 48, cards: [
        { id: 'card-6', title: 'Podcast Episode 4', tag: 'Audio', platform: 'Spotify', date: 'Posted' }
      ]
    }
  ]

  const [kanbanColumns, setKanbanColumns] = useState(INITIAL_COLUMNS)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)
  const [currentFlowPhase, setCurrentFlowPhase] = useState(0) // 0: Logo, 1: Expand, 2: Sync, 3: Kanban, 4: Done

  // Animation Loop - Single Hero Card Focus
  React.useEffect(() => {
    const toggleHeroCard = () => {
      setKanbanColumns(prev => {
        const newCols = JSON.parse(JSON.stringify(prev))
        const ideaCol = newCols.find((c: any) => c.id === 'idea')
        const filmingCol = newCols.find((c: any) => c.id === 'filming')

        // Find where the hero card is
        const heroInIdea = ideaCol.cards.findIndex((c: any) => c.id === 'card-1')
        const heroInFilming = filmingCol.cards.findIndex((c: any) => c.id === 'card-1')

        if (heroInIdea > -1) {
          // Move from Idea -> Filming
          const [card] = ideaCol.cards.splice(heroInIdea, 1)
          filmingCol.cards.unshift(card)
        } else if (heroInFilming > -1) {
          // Move from Filming -> Idea (Loop back)
          const [card] = filmingCol.cards.splice(heroInFilming, 1)
          ideaCol.cards.unshift(card)
        }
        return newCols
      })
    }

    // Run every 4 seconds for a smooth loop
    const interval = setInterval(toggleHeroCard, 4000)
    return () => clearInterval(interval)
  }, [])

  // Flow Phase Animation Loop with Custom Durations
  React.useEffect(() => {
    const phaseDurations = [2000, 2000, 3000, 3000, 2000] // 0: 2s, 1: 2s, 2: 3s, 3: 3s, 4: 2s
    let timeoutId: NodeJS.Timeout

    const runPhase = (phase: number) => {
      setCurrentFlowPhase(phase)
      const nextPhase = (phase + 1) % 5
      timeoutId = setTimeout(() => runPhase(nextPhase), phaseDurations[phase])
    }

    runPhase(0)
    return () => clearTimeout(timeoutId)
  }, [])

  return (
    <main className="min-h-screen overflow-x-hidden max-w-[100vw] relative selection:bg-[#3f68e4]/30 dark bg-[#111521] text-white">
      {/* Background Gradients */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#3f68e4]/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#3f68e4]/10 blur-[120px] rounded-full"></div>
        <div className="absolute top-[30%] right-[10%] w-[30%] h-[30%] bg-blue-600/10 blur-[100px] rounded-full"></div>
      </div>

      {/* ============ NAVIGATION ============ */}
      <nav className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-7xl z-50">
        <div className="bg-[#111521]/60 backdrop-blur-[40px] border border-[#3f68e4]/20 rounded-full px-5 md:px-8 py-3 md:py-4 flex items-center justify-between shadow-lg">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#3f68e4] rounded-lg flex items-center justify-center">
              <span className="material-icons text-white text-xl">stream</span>
            </div>
            <span className="font-bold text-lg md:text-xl tracking-tight">CreatorFlow</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link className="text-sm font-medium hover:text-[#3f68e4] transition-colors" href="#">Platform</Link>
            <Link className="text-sm font-medium hover:text-[#3f68e4] transition-colors" href="#">Idea Bank</Link>
            <Link className="text-sm font-medium hover:text-[#3f68e4] transition-colors" href="#">Resources</Link>
            <Link className="text-sm font-medium hover:text-[#3f68e4] transition-colors" href="#pricing">Pricing</Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login">
              <button className="text-sm font-semibold px-6 py-2 hover:bg-white/5 rounded-full transition-colors">Login</button>
            </Link>
            <Link href="/register">
              <button className="bg-[#3f68e4] hover:bg-[#3f68e4]/90 text-white text-sm font-bold px-8 py-3 rounded-full shadow-[0_0_40px_-10px_rgba(63,104,228,0.5)] transition-all">
                Get Started
              </button>
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2 rounded-xl active:bg-white/10 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <motion.span
              animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              className="block w-5 h-[2px] bg-white rounded-full origin-center"
            />
            <motion.span
              animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
              className="block w-5 h-[2px] bg-white rounded-full"
            />
            <motion.span
              animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              className="block w-5 h-[2px] bg-white rounded-full origin-center"
            />
          </button>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="md:hidden mt-3 bg-[#111521]/90 backdrop-blur-[40px] border border-[#3f68e4]/20 rounded-3xl p-6 shadow-2xl"
            >
              <div className="flex flex-col gap-4">
                <Link href="#" className="text-base font-medium text-white/80 hover:text-[#3f68e4] py-2 transition-colors" onClick={() => setMenuOpen(false)}>Platform</Link>
                <Link href="#" className="text-base font-medium text-white/80 hover:text-[#3f68e4] py-2 transition-colors" onClick={() => setMenuOpen(false)}>Idea Bank</Link>
                <Link href="#" className="text-base font-medium text-white/80 hover:text-[#3f68e4] py-2 transition-colors" onClick={() => setMenuOpen(false)}>Resources</Link>
                <Link href="#pricing" className="text-base font-medium text-white/80 hover:text-[#3f68e4] py-2 transition-colors" onClick={() => setMenuOpen(false)}>Pricing</Link>
                <div className="border-t border-white/10 pt-4 mt-2 flex flex-col gap-3">
                  <Link href="/login" onClick={() => setMenuOpen(false)}>
                    <button className="w-full text-center text-base font-semibold py-3 rounded-2xl border border-white/20 hover:bg-white/5 transition-colors">
                      Login
                    </button>
                  </Link>
                  <Link href="/register" onClick={() => setMenuOpen(false)}>
                    <button className="w-full text-center bg-[#3f68e4] hover:bg-[#3f68e4]/90 text-white text-base font-bold py-3 rounded-2xl shadow-[0_0_40px_-10px_rgba(63,104,228,0.5)] transition-all">
                      Coba Sekarang
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ============ HERO SECTION ============ */}
      <section className="pt-32 md:pt-48 pb-20 px-6 max-w-[100vw] overflow-hidden relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-[#3f68e4]/10 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#3f68e4]/10 border border-[#3f68e4]/20 rounded-full mb-8"
          >
            <span className="w-2 h-2 bg-[#3f68e4] rounded-full animate-pulse"></span>
            <span className="text-xs font-bold text-[#3f68e4] tracking-widest uppercase">Version 2.0 Now Live</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0 }}
            className="max-w-5xl text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold leading-[1.1] tracking-tight mb-8"
          >
            Beresin <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3f68e4] to-blue-400">Jadwalnya</span>,<br className="hidden md:block" /> Bikin Kontennya
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed mb-10"
          >
            Manage your creative chaos. From an integrated <span className="text-white font-semibold underline decoration-[#3f68e4]">Idea Bank</span> to professional PDF exports for brand deals. All in one futuristic workspace.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 mb-20 md:mb-32 w-full sm:w-auto"
          >
            <Link href="/register" className="w-full sm:w-auto">
              <button className="w-full bg-[#3f68e4] hover:bg-[#3f68e4]/90 text-white text-lg font-extrabold px-10 py-4 rounded-full shadow-[0_0_40px_-10px_rgba(63,104,228,0.5)] transition-all transform hover:scale-105 active:scale-95">
                Coba Sekarang
              </button>
            </Link>
            <button className="flex items-center justify-center gap-3 text-lg font-bold hover:text-[#3f68e4] transition-colors group py-3 px-6 rounded-full hover:bg-white/5">
              <span className="w-10 h-10 flex items-center justify-center border border-white/20 rounded-full group-hover:border-[#3f68e4] transition-colors shrink-0">
                <span className="material-icons text-base">play_arrow</span>
              </span>
              Watch Demo
            </button>
          </motion.div>

          {/* ========== 3D DASHBOARD MOCKUP ========== */}
          <motion.div
            initial={{ opacity: 0, y: 100, rotateX: 10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1.2, delay: 0.4, type: "spring" }}
            className="w-full relative perspective-1000"
          >
            {/* Floating Card 1: Telegram Integration (Top Right) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.5 } }}
              className="absolute -top-12 -right-4 md:-right-12 z-20 cursor-pointer hidden md:block"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="bg-slate-800/90 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-xl w-64"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#0088cc]/20 flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#0088cc]" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 11.944 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.638z" /></svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Telegram Bot</h4>
                      <p className="text-[10px] text-green-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        Connected
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 bg-black/20 p-2 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400">Bot:</span>
                    <span className="text-xs text-white">"New video idea saved!"</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Floating Card 2: Auto To-Do List (Bottom Left) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.6 } }}
              className="absolute -bottom-8 -left-4 md:-left-12 z-20 cursor-pointer hidden md:block"
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="bg-slate-800/90 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-xl w-60"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <span className="material-icons text-green-500 text-sm">check_circle</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">To-Do Otomatis</h4>
                    <p className="text-[10px] text-slate-400">Synced from Chat</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border border-green-500 rounded flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-[1px]"></div>
                    </div>
                    <div className="h-1.5 w-24 bg-slate-600 rounded-full"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border border-slate-600 rounded"></div>
                    <div className="h-1.5 w-16 bg-slate-600 rounded-full"></div>
                  </div>
                  <div className="mt-2 text-[10px] text-slate-500 text-right">3 tasks pending</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Floating Card 3: Content Bank (Bottom Right) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.7 } }}
              className="absolute -bottom-12 -right-4 md:-right-8 z-20 cursor-pointer hidden md:block"
            >
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="bg-slate-800/90 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-xl w-56"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <span className="material-icons text-yellow-500 text-sm">lightbulb</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Bank Konten</h4>
                    <p className="text-[10px] text-slate-400">Captured via Bot</p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="h-1.5 w-full bg-slate-600/50 rounded-full"></div>
                  <div className="h-1.5 w-3/4 bg-slate-600/50 rounded-full"></div>
                  <div className="h-1.5 w-5/6 bg-slate-600/50 rounded-full"></div>
                </div>
              </motion.div>
            </motion.div>
            {/* Glow Underneath */}
            <div className="absolute -inset-10 bg-[#3f68e4]/20 blur-[100px] -z-10 rounded-full opacity-0 animate-pulse-slow"></div>

            <div className="relative bg-[#0f1219]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-4 md:p-6 shadow-2xl xl:mx-auto max-w-[1400px] overflow-hidden group hover:border-[#3f68e4]/30 transition-colors duration-500 ring-1 ring-white/5">

              {/* Fake UI Header */}
              <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                  </div>
                  <div className="h-6 w-px bg-white/10 mx-2"></div>
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-400">
                    <span className="material-icons text-base">dashboard</span>
                    <span>Content Pipeline</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 border-2 border-[#111521]"></div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 border-2 border-[#111521]"></div>
                  </div>
                  <button className="bg-[#3f68e4] text-white text-xs font-bold px-3 py-1.5 rounded-lg">+ New Content</button>
                </div>
              </div>

              {/* Kanban Columns */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6 text-left overflow-x-auto pb-4 md:overflow-visible custom-scrollbar">
                {kanbanColumns.map((col) => (
                  <div key={col.id} className="min-w-[260px] md:min-w-0 bg-[#161b28]/50 rounded-xl border border-white/5 flex flex-col h-full">
                    <div className="p-4 flex items-center justify-between border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${col.color}`}></div>
                        <span className="text-sm font-bold text-slate-200">{col.title}</span>
                      </div>
                      <span className="text-xs font-mono text-slate-500 bg-white/5 px-2 py-0.5 rounded-md">{col.count}</span>
                    </div>
                    <motion.div
                      layout
                      className="p-3 space-y-3 flex-1 bg-gradient-to-b from-transparent to-black/20 relative"
                    >
                      <AnimatePresence mode='popLayout'>
                        {col.cards.map((card) => (
                          <motion.div
                            layout
                            layoutId={card.id === 'card-1' ? 'hero-card-s26' : undefined}
                            key={card.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 30,
                              mass: 1
                            }}
                            className="bg-[#1e2332] p-3 rounded-lg border border-white/5 shadow-sm hover:border-[#3f68e4]/50 hover:shadow-lg hover:shadow-[#3f68e4]/5 transition-colors cursor-pointer group/card relative z-10"
                            whileHover={{ scale: 1.02, zIndex: 20 }}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-xs font-medium text-slate-500 bg-black/30 px-2 py-1 rounded inline-block">{card.tag}</span>
                              <span className="material-icons text-[14px] text-slate-600 group-hover/card:text-[#3f68e4] transition-colors">more_horiz</span>
                            </div>
                            <h4 className="text-sm font-semibold text-white mb-3 line-clamp-2 leading-snug">{card.title}</h4>
                            <div className="flex items-center justify-between text-xs text-slate-500">
                              <div className="flex items-center gap-1.5">
                                <span className="material-icons text-[14px]">{card.platform === 'YouTube' ? 'play_circle' : card.platform === 'TikTok' ? 'music_note' : 'description'}</span>
                                <span>{card.platform}</span>
                              </div>
                              <span className={`${card.date === 'Due Tomorrow' ? 'text-red-400' : ''}`}>{card.date}</span>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      {/* Add Card Ghost */}
                      <button className="w-full py-2 rounded-lg border border-dashed border-white/10 text-xs text-slate-500 hover:text-white hover:border-white/20 transition-colors opacity-0 group-hover:opacity-100">+ Add Task</button>
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ ECOSYSTEM EXPLAINER ============ */}
      <section className="py-24 md:py-32 px-6 max-w-7xl mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column: Text */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight"
            >
              <span className={currentFlowPhase <= 1 ? "text-blue-400 transition-colors duration-500" : "text-white transition-colors duration-500"}>Dari Chat</span> Menjadi <br />
              <span className={currentFlowPhase >= 3 ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500" : "text-white"}>Konten Jadi.</span> <br />
              Seamless.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-lg"
            >
              Lupakan catatan yang berantakan. CreatorFlow menyatukan ide dari Telegram langsung ke papan kerja visual Anda, hingga siap dipublikasikan. Satu alur, kontrol penuh.
            </motion.p>
          </div>

          {/* Right Column: The Full Flow Animation */}
          <div className="w-full relative flex items-center justify-center min-h-[400px] md:min-h-[500px]">
            <HeroAnimation />
          </div>
        </div>
      </section>

      {/* ============ FEATURES SECTION ============ */}
      <section className="py-20 md:py-32 px-6 max-w-7xl mx-auto overflow-hidden">
        <div className="text-center mb-16 md:mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight"
          >
            Scale Your Content with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">Smart Tools</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto"
          >
            Streamline your workflow from initial spark to final export.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1: Kanban - The Journey */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0, duration: 0.5 }}
            className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 p-8 rounded-3xl hover:border-[#3f68e4]/30 transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#3f68e4]/10 blur-[80px] rounded-full pointer-events-none -z-10 group-hover:bg-[#3f68e4]/20 transition-all duration-500" />

            <div className="h-64 mb-8 flex items-center justify-center relative w-full">
              <div className="w-full h-full bg-slate-800/40 rounded-xl border border-white/5 p-3 grid grid-cols-3 gap-3 relative overflow-hidden">
                {/* Columns */}
                {['Idea', 'In Progress', 'Done'].map((col, i) => (
                  <div key={i} className="bg-white/5 rounded-lg h-full flex flex-col p-2">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-slate-500' : i === 1 ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                      <div className="h-1.5 w-12 bg-white/10 rounded-full"></div>
                    </div>
                    {/* Placeholder cards */}
                    <div className="w-full h-10 mb-2 rounded bg-white/5 opacity-30"></div>
                    <div className="w-full h-10 rounded bg-white/5 opacity-30"></div>
                  </div>
                ))}

                {/* The Hero Task Card */}
                <motion.div
                  className="absolute top-12 left-5 w-[calc(33%-20px)] h-12 bg-slate-700/90 backdrop-blur-md rounded-lg shadow-xl border border-white/10 z-20 flex items-center justify-center gap-2"
                  animate={{
                    x: ['0%', '110%', '220%', '220%', '0%'], // Move across columns
                    y: ['0%', '0%', '0%', '0%', '0%'],
                    scale: [1, 1.05, 1, 1.05, 1],
                    backgroundColor: ['rgba(51, 65, 85, 0.9)', 'rgba(51, 65, 85, 0.9)', 'rgba(34, 197, 94, 0.9)', 'rgba(34, 197, 94, 0.9)', 'rgba(51, 65, 85, 0.9)'],
                    borderColor: ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.1)', 'rgba(34, 197, 94, 0.5)', 'rgba(34, 197, 94, 0.5)', 'rgba(255, 255, 255, 0.1)']
                  }}
                  transition={{
                    duration: 6,
                    times: [0, 0.3, 0.6, 0.9, 1],
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                >
                  <motion.div
                    className="w-16 h-1.5 bg-white/20 rounded-full"
                    animate={{ width: ['4rem', '4rem', '0rem', '0rem', '4rem'] }}
                  />
                  <motion.span
                    className="material-icons text-white text-lg absolute"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: [0, 0, 1, 1, 0],
                      scale: [0, 0, 1.2, 1, 0]
                    }}
                    transition={{ duration: 6, times: [0, 0.55, 0.6, 0.9, 1] }}
                  >
                    check_circle
                  </motion.span>
                </motion.div>
              </div>
            </div>

            <h3 className="text-2xl font-bold mb-3 text-white">Intuitive Kanban & To-Do</h3>
            <p className="text-slate-400 leading-relaxed">Manage your content pipeline from idea to completion using a smart system that adapts to your workflow.</p>
          </motion.div>

          {/* Feature 2: Telegram - Speed Sync */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 p-8 rounded-3xl hover:border-blue-400/30 transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-400/10 blur-[80px] rounded-full pointer-events-none -z-10 group-hover:bg-blue-400/20 transition-all duration-500" />

            <div className="h-64 mb-8 flex items-center justify-center relative w-full gap-4">
              {/* Phone UI */}
              <div className="w-1/3 h-full bg-black/40 border border-white/10 rounded-2xl p-2 flex flex-col items-center justify-end relative overflow-hidden translate-y-4">
                <div className="absolute top-2 w-8 h-1 bg-white/10 rounded-full"></div>
                {/* Chat Bubble Animation */}
                <motion.div
                  className="w-full bg-[#2AABEE] p-2 rounded-2xl rounded-tr-none mb-8 relative"
                  initial={{ opacity: 0, scale: 0, y: 20 }}
                  animate={{
                    opacity: [0, 1, 0, 0],
                    scale: [0, 1, 0, 0],
                    y: [20, 0, -20, 20]
                  }}
                  transition={{ duration: 4, repeat: Infinity, times: [0, 0.2, 0.4, 1] }}
                >
                  <div className="h-1.5 w-12 bg-white/50 rounded-full mb-1"></div>
                  <div className="h-1.5 w-8 bg-white/50 rounded-full"></div>
                </motion.div>
              </div>

              {/* Energy Orb */}
              <motion.div
                className="absolute z-30 w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.8)]"
                animate={{
                  x: ['-60px', '60px'], // From Phone to Dashboard
                  scale: [0, 1.5, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 4,
                  times: [0.2, 0.5, 0.6], // Sync with bubble disappear and card appear
                  ease: "easeInOut",
                  repeat: Infinity
                }}
              />

              {/* Dashboard UI */}
              <div className="w-2/3 h-full bg-[#111521] border border-white/10 rounded-xl p-3 relative overflow-hidden -translate-y-2">
                <div className="w-full h-4 border-b border-white/5 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500/20"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-500/20"></div>
                </div>
                {/* Popping Card */}
                <motion.div
                  className="w-full bg-slate-800 border-l-4 border-cyan-400 p-2 rounded shadow-lg"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: [0, 0, 1, 1, 0],
                    scale: [0.8, 0.8, 1, 1, 0.8],
                    y: [0, 0, 0, 0, 0]
                  }}
                  transition={{ duration: 4, repeat: Infinity, times: [0, 0.5, 0.6, 0.9, 1] }}
                >
                  <div className="h-2 w-20 bg-white/20 rounded-full mb-2"></div>
                  <div className="flex gap-1">
                    <div className="h-1.5 w-8 bg-cyan-500/30 rounded-full"></div>
                    <div className="h-1.5 w-4 bg-white/10 rounded-full"></div>
                  </div>
                </motion.div>
                <div className="mt-2 space-y-2 opacity-30">
                  <div className="w-full h-8 bg-white/5 rounded"></div>
                  <div className="w-full h-8 bg-white/5 rounded"></div>
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-bold mb-3 text-white">Instant Telegram Capture</h3>
            <p className="text-slate-400 leading-relaxed">Send ideas and tasks to your bot on the go. Watch them appear instantly on your dashboard, ready for action.</p>
          </motion.div>

          {/* Feature 3: PDF Export - Polished Transformation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 p-8 rounded-3xl hover:border-pink-400/30 transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-pink-400/10 blur-[80px] rounded-full pointer-events-none -z-10 group-hover:bg-pink-400/20 transition-all duration-500" />

            <div className="h-64 mb-8 flex items-center justify-center relative w-full">
              <div className="relative w-32 h-44 bg-slate-800 border border-white/10 rounded-xl flex flex-col items-center justify-start pt-6 overflow-hidden shadow-2xl">

                {/* Raw Text Lines (Fading Out) */}
                <motion.div
                  className="w-20 space-y-2 absolute top-12"
                  animate={{ opacity: [1, 1, 0, 0, 1] }}
                  transition={{ duration: 5, repeat: Infinity, times: [0, 0.3, 0.5, 0.9, 1] }}
                >
                  <div className="w-full h-1.5 bg-slate-600 rounded-full"></div>
                  <div className="w-3/4 h-1.5 bg-slate-600 rounded-full"></div>
                  <div className="w-5/6 h-1.5 bg-slate-600 rounded-full"></div>
                  <div className="w-full h-1.5 bg-slate-600 rounded-full"></div>
                </motion.div>

                {/* PDF Content (Fading In) */}
                <motion.div
                  className="w-full h-full flex flex-col items-center pt-8 absolute top-0"
                  animate={{ opacity: [0, 0, 1, 1, 0] }}
                  transition={{ duration: 5, repeat: Infinity, times: [0, 0.3, 0.5, 0.9, 1] }}
                >
                  <div className="w-8 h-8 bg-[#3f68e4] rounded-md flex items-center justify-center mb-3 shadow-lg">
                    <span className="material-icons text-white text-lg">stream</span>
                  </div>
                  <div className="w-16 h-2 bg-slate-400 rounded-full mb-1"></div>
                  <div className="w-10 h-1.5 bg-slate-600 rounded-full mb-6"></div>
                  <div className="w-20 h-16 bg-white/5 rounded border border-white/5"></div>
                </motion.div>

                {/* Scanning Light */}
                <motion.div
                  className="absolute top-0 w-full h-[4px] bg-gradient-to-r from-transparent via-pink-400 to-transparent shadow-[0_0_15px_rgba(244,114,182,0.8)] z-20"
                  animate={{ top: ['-10%', '110%'] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, ease: "linear" }}
                />

                {/* Bouncing Download Button */}
                <motion.div
                  className="absolute bottom-4 w-10 h-10 bg-[#3f68e4] rounded-full flex items-center justify-center shadow-lg z-30 ring-2 ring-[#111521]"
                  animate={{
                    scale: [0, 0, 1, 1.1, 1, 0],
                    y: [10, 10, 0, -2, 0, 10]
                  }}
                  transition={{ duration: 5, repeat: Infinity, times: [0, 0.5, 0.6, 0.7, 0.8, 1] }}
                >
                  <span className="material-icons text-white text-lg">download</span>
                </motion.div>
              </div>
            </div>

            <h3 className="text-2xl font-bold mb-3 text-white">Professional PDF Export</h3>
            <p className="text-slate-400 leading-relaxed">Turn your messy notes into production-ready scripts and brand reports with a single click.</p>
          </motion.div>

          {/* Feature 4: Daily Planning - Sun Rise */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 p-8 rounded-3xl hover:border-yellow-400/30 transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-400/10 blur-[80px] rounded-full pointer-events-none -z-10 group-hover:bg-yellow-400/20 transition-all duration-500" />

            <div className="h-64 mb-8 flex items-center justify-center relative w-full">
              <div className="relative w-full max-w-[200px] h-48 flex flex-col items-center justify-end">
                {/* Sun Rising */}
                <motion.div
                  className="absolute bottom-32 w-16 h-16 bg-gradient-to-t from-yellow-400 to-orange-500 rounded-full blur-[2px] shadow-[0_0_30px_rgba(250,204,21,0.6)] z-0"
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 2, ease: "easeOut" }}
                />

                {/* List Container */}
                <div className="w-full bg-slate-800/80 backdrop-blur-md border border-white/10 rounded-xl p-3 z-10 relative overflow-hidden">
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/5">
                    <div className="w-4 h-4 rounded-full bg-yellow-500/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                    </div>
                    <div className="w-20 h-2 bg-slate-400 rounded-full"></div>
                  </div>

                  {/* Task Items */}
                  {[1, 2, 3].map((item, i) => (
                    <motion.div
                      key={i}
                      className="flex items-center gap-2 mb-2 last:mb-0 p-1.5 rounded bg-white/5"
                      initial={{ x: -20, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ delay: 1 + (i * 0.2), duration: 0.5 }}
                    >
                      <div className="w-3 h-3 border border-slate-500 rounded-sm flex items-center justify-center relative">
                        {i === 0 && (
                          <motion.span
                            className="material-icons text-green-400 text-[10px] absolute -top-[1px] -left-[1px]"
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            transition={{ delay: 2.5, type: "spring" }}
                          >
                            check
                          </motion.span>
                        )}
                      </div>
                      <div className={`h-1.5 rounded-full bg-slate-500 ${i === 0 ? 'w-16 line-through opacity-50' : 'w-24'}`}></div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-bold mb-3 text-white">Effortless Daily Planning</h3>
            <p className="text-slate-400 leading-relaxed">Start your day aligned. We automatically organize your tasks based on priority, so you know exactly what to tackle first.</p>
          </motion.div>

          {/* Feature 5: Content Calendar - Visual Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 p-8 rounded-3xl hover:border-purple-400/30 transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-purple-400/10 blur-[80px] rounded-full pointer-events-none -z-10 group-hover:bg-purple-400/20 transition-all duration-500" />

            <div className="h-64 mb-8 flex items-center justify-center relative w-full">
              <div className="w-full max-w-[240px] h-40 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/5 p-3 grid grid-cols-7 gap-1 relative z-10">
                {/* Days Gradient Line */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible">
                  <motion.path
                    d="M 35 60 Q 70 30 105 80 T 175 50"
                    fill="none"
                    stroke="#c084fc"
                    strokeWidth="2"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 2, delay: 1, ease: "easeInOut" }}
                  />
                </svg>

                {/* Calendar Grid */}
                {Array.from({ length: 14 }).map((_, i) => (
                  <div key={i} className={`rounded-md ${i < 7 ? 'bg-white/5' : 'bg-white/10'} relative flex items-center justify-center`}>
                    {/* Icons flying in */}
                    {(i === 1 || i === 3 || i === 5) && (
                      <motion.div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shadow-lg z-30 ${i === 1 ? 'bg-gradient-to-tr from-yellow-400 to-orange-500' : i === 3 ? 'bg-black text-white' : 'bg-red-600'}`}
                        initial={{ scale: 0, y: -20 }}
                        whileInView={{ scale: 1, y: 0 }}
                        transition={{ delay: 1 + (i * 0.1), type: "spring" }}
                      >
                        <span className="text-[10px] font-bold text-white">{i === 1 ? 'IG' : i === 3 ? 'TT' : 'YT'}</span>
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <h3 className="text-2xl font-bold mb-3 text-white">Visual Content Timeline</h3>
            <p className="text-slate-400 leading-relaxed">Never miss a post. Visualize your entire schedule across platforms and spot content gaps instantly.</p>
          </motion.div>

          {/* Feature 6: Idea Vault - Magnet Effect */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 p-8 rounded-3xl hover:border-cyan-400/30 transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-400/10 blur-[80px] rounded-full pointer-events-none -z-10 group-hover:bg-cyan-400/20 transition-all duration-500" />

            <div className="h-64 mb-8 flex items-center justify-center relative w-full">
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Floating Bulbs (Particles) */}
                {[1, 2, 3, 4].map((bulb, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-yellow-300 material-icons"
                    initial={{
                      x: i % 2 === 0 ? -60 : 60,
                      y: i < 2 ? -60 : 60,
                      opacity: 0,
                      scale: 0
                    }}
                    whileInView={{
                      x: [i % 2 === 0 ? -60 : 60, 0],
                      y: [i < 2 ? -60 : 60, 0],
                      opacity: [0, 1, 0, 0],
                      scale: [0, 1, 0.5, 0]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.5,
                      times: [0, 0.2, 0.8, 1]
                    }}
                  >
                    lightbulb
                  </motion.div>
                ))}

                {/* Central Vault Folder */}
                <motion.div
                  className="w-24 h-20 bg-cyan-600/20 border border-cyan-400/50 rounded-lg flex flex-col items-center justify-center relative z-20 backdrop-blur-sm"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="absolute -top-3 left-0 w-10 h-4 bg-cyan-600/20 border border-b-0 border-cyan-400/50 rounded-t-lg"></div>
                  <span className="material-icons text-cyan-400 text-3xl">folder_open</span>
                </motion.div>
              </div>
            </div>

            <h3 className="text-2xl font-bold mb-3 text-white">Your Creative Vault</h3>
            <p className="text-slate-400 leading-relaxed">A central hub for every spark. Store and categorize ideas so you never run out of content inspiration.</p>
          </motion.div>
        </div>
      </section>

      {/* ============ FAQ SECTION ============ */}
      <section className="py-20 md:py-32 px-6 max-w-7xl mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20">
          {/* Left Column: Heading & Contact */}
          <div>
            <div className="inline-block px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs font-bold tracking-wide mb-6">
              FAQ
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">
              Frequently asked<br />questions
            </h2>
            <p className="text-slate-400 text-lg mb-8 max-w-md">
              Got any Questions? Let us know! Reach out and our team will get right back to you.
            </p>
            <button className="px-6 py-3 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 transition-colors font-medium text-sm md:text-base">
              Contact us
            </button>
          </div>

          {/* Right Column: Accordion */}
          <div className="space-y-4">
            {[
              { q: 'What is CreatorFlow and how does it work?', a: 'CreatorFlow is an all-in-one content management ecosystem that syncs your ideas from Telegram directly to a professional Kanban dashboard.' },
              { q: 'How do I link my Telegram account?', a: 'Simply go to your Profile Settings, click \'Connect Telegram\' to get your token, and send it to our bot. It\'s that easy!' },
              { q: 'Is my data secure with CreatorFlow?', a: 'Absolutely. We use industry-standard encryption to ensure your content ideas and personal data are always protected.' },
              { q: 'Can I export my scripts to PDF?', a: 'Yes, CreatorFlow allows you to generate professional PDF exports for brand deals and production scripts with a single click.' },
              { q: 'What kind of support do you offer?', a: 'Our team at Mandala Enterprise provides 24/7 technical support for all our users.' }
            ].map((faq, i) => (
              <div key={i} className="border-b border-white/10">
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                  className="w-full py-6 flex items-center justify-between text-left group"
                >
                  <span className="text-lg font-medium group-hover:text-white transition-colors">{faq.q}</span>
                  <span className="material-icons text-slate-400 group-hover:text-white transition-colors transform duration-300">
                    {openFaqIndex === i ? 'remove' : 'add'}
                  </span>
                </button>
                <AnimatePresence>
                  {openFaqIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 text-slate-400 leading-relaxed">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PRICING SECTION ============ */}
      <section className="py-20 md:py-32 px-6 max-w-7xl mx-auto overflow-hidden" id="pricing">
        <div className="text-center mb-12 md:mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-6xl font-extrabold mb-4 md:mb-6"
          >
            Choose Your Flow
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-sm md:text-lg text-slate-400 max-w-2xl mx-auto"
          >
            Transparent pricing for every stage of your creative journey. No hidden fees, just pure productivity.
          </motion.p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-stretch">
          {/* Trial Flow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/[0.03] backdrop-blur-[20px] p-8 md:p-10 rounded-3xl md:rounded-[2.5rem] border border-white/5 flex flex-col hover:border-[#3f68e4]/30 transition-all duration-500"
          >
            <div className="mb-6 md:mb-8">
              <h3 className="text-xl md:text-2xl font-bold mb-2">Trial Flow</h3>
              <p className="text-slate-400 text-sm md:text-base">Perfect for exploration</p>
            </div>
            <div className="mb-8 md:mb-10">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl md:text-5xl font-extrabold">0k</span>
                <span className="text-slate-400 font-medium text-sm">/first month</span>
              </div>
            </div>
            <ul className="space-y-3 md:space-y-4 mb-8 md:mb-12 flex-1">
              {['Limited Idea Bank', '1 Social Platform Sync', 'Standard PDF Export'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300 text-sm md:text-base">
                  <span className="material-icons text-[#3f68e4] text-lg md:text-xl">check_circle</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link href="/register">
              <button className="w-full py-3.5 md:py-4 px-8 rounded-full border border-white/20 font-bold hover:bg-white/5 transition-all text-sm md:text-base">Start Trial</button>
            </Link>
          </motion.div>

          {/* Creator Annual */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            className="bg-[#111521]/60 backdrop-blur-[40px] px-8 py-10 md:px-10 md:py-12 rounded-3xl md:rounded-[2.5rem] border-2 border-[#3f68e4] relative flex flex-col shadow-[0_0_40px_-10px_rgba(63,104,228,0.5)] z-10"
          >
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#3f68e4] px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest text-white shadow-xl">
              Best Deal
            </div>
            <div className="mb-6 md:mb-8">
              <h3 className="text-xl md:text-2xl font-bold mb-2 text-white">Creator Annual</h3>
              <p className="text-blue-200/60 text-sm md:text-base">The ultimate workspace</p>
            </div>
            <div className="mb-8 md:mb-10">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl md:text-5xl font-extrabold text-white">799k</span>
                <span className="text-blue-200/60 font-medium text-sm">/year</span>
              </div>
              <div className="mt-2 text-[#3f68e4] font-bold text-sm">Save 400k per year</div>
            </div>
            <ul className="space-y-3 md:space-y-4 mb-8 md:mb-12 flex-1">
              {['Unlimited Idea Bank', 'All Platform Syncing', 'Custom Agency PDF Templates', 'Priority 24/7 Support'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-white text-sm md:text-base">
                  <span className="material-icons text-[#3f68e4] text-lg md:text-xl">check_circle</span>
                  <span className="font-semibold">{item}</span>
                </li>
              ))}
            </ul>
            <Link href="/register">
              <button className="w-full py-4 md:py-5 px-8 rounded-full bg-[#3f68e4] text-white font-extrabold text-base md:text-lg shadow-xl hover:bg-[#3f68e4]/90 transition-all">Get Started Now</button>
            </Link>
          </motion.div>

          {/* Monthly Pro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/[0.03] backdrop-blur-[20px] p-8 md:p-10 rounded-3xl md:rounded-[2.5rem] border border-white/5 flex flex-col hover:border-[#3f68e4]/30 transition-all duration-500"
          >
            <div className="mb-6 md:mb-8">
              <h3 className="text-xl md:text-2xl font-bold mb-2">Monthly Pro</h3>
              <p className="text-slate-400 text-sm md:text-base">Flexibility for professionals</p>
            </div>
            <div className="mb-8 md:mb-10">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl md:text-5xl font-extrabold">100k</span>
                <span className="text-slate-400 font-medium text-sm">/month</span>
              </div>
              <p className="mt-2 text-slate-500 text-sm italic">After initial trial</p>
            </div>
            <ul className="space-y-3 md:space-y-4 mb-8 md:mb-12 flex-1">
              {['Advanced Idea Bank', '3 Social Platform Syncs', 'Pro PDF Watermark removal'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300 text-sm md:text-base">
                  <span className="material-icons text-[#3f68e4] text-lg md:text-xl">check_circle</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link href="/register">
              <button className="w-full py-3.5 md:py-4 px-8 rounded-full border border-white/20 font-bold hover:bg-white/5 transition-all text-sm md:text-base">Go Pro</button>
            </Link>
          </motion.div>
        </div>
      </section>



      {/* ============ CTA SECTION ============ */}
      <section className="pb-20 md:pb-32 px-6 max-w-7xl mx-auto overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden p-8 md:p-12 lg:p-24 text-center group"
        >
          {/* Animated Gradient Background */}
          <motion.div
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{ backgroundSize: "200% 200%" }}
            className="absolute inset-0 bg-gradient-to-br from-[#3f68e4] via-[#7c3aed] to-[#3f68e4] -z-10"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/20 -z-10"></div>

          {/* Subtle moving glow */}
          <motion.div
            animate={{
              x: [-100, 100, -100],
              y: [-50, 50, -50],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 left-0 w-96 h-96 bg-white/10 blur-[120px] rounded-full pointer-events-none -z-10"
          />
          <div className="max-w-3xl mx-auto space-y-6 md:space-y-8">
            <h2 className="text-3xl md:text-4xl lg:text-6xl font-extrabold text-white">Ready to flow?</h2>
            <p className="text-white/80 text-base md:text-xl">Join 10,000+ creators who upgraded their workflow to the future.</p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-6 pt-4 md:pt-6">
              <Link href="/register" className="w-full sm:w-auto">
                <button className="w-full h-full bg-white text-[#3f68e4] text-base md:text-lg font-extrabold px-8 md:px-12 py-4 md:py-5 rounded-full shadow-2xl hover:bg-slate-100 transition-all transform hover:scale-105 active:scale-95">
                  Coba Sekarang
                </button>
              </Link>
              <span className="text-white/60 text-xs md:text-sm font-medium">No credit card required.</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="py-8 md:py-12 border-t border-white/5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#3f68e4] rounded-md flex items-center justify-center">
              <span className="material-icons text-white text-sm">stream</span>
            </div>
            <span className="font-bold tracking-tight">CreatorFlow</span>
          </div>
          <div className="flex gap-8 md:gap-12 text-sm text-slate-500">
            <Link className="hover:text-white transition-colors" href="#">Privacy</Link>
            <Link className="hover:text-white transition-colors" href="#">Terms</Link>
            <Link className="hover:text-white transition-colors" href="#">Twitter</Link>
            <Link className="hover:text-white transition-colors" href="#">LinkedIn</Link>
          </div>
          <div className="text-xs md:text-sm text-slate-600">
            © 2026 CreatorFlow. All rights reserved.
          </div>
        </div>
      </footer>
    </main >
  )
}
