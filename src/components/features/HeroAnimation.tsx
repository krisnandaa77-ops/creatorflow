'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Send, CheckCircle, Sparkles, Plus } from 'lucide-react'

/*──────────────────────────────────────────────────────────────────────────────
  LIQUID-MORPH HERO ANIMATION
  
  Five-phase cinematic sequence:
    0 → The Origin (Profile)
    1 → The Input (Fiber-optic beam)
    2 → The Connection (Telegram glass)
    3 → The Organization (Kanban with vertically scrolling cards)
    4 → The Intelligence (AI convergence)
  
  All phases overlap during transitions (AnimatePresence default mode)
  creating a liquid-morph dissolve effect. 100% transparent background.
──────────────────────────────────────────────────────────────────────────────*/

// ─── Transition presets ─────────────────────────────────────────────────────
const liquidEase = [0.22, 1, 0.36, 1] as const

const morphIn = {
    initial: { scale: 0.5, opacity: 0, filter: 'blur(28px)' },
    animate: { scale: 1, opacity: 1, filter: 'blur(0px)' },
    transition: { duration: 1.4, ease: liquidEase },
}
const morphOut = {
    exit: { scale: 0.45, opacity: 0, filter: 'blur(32px)' },
    transition: { duration: 0.9, ease: liquidEase },
}

const drift = {
    animate: { y: [-5, 5, -5], rotateX: [0.8, -0.8, 0.8], rotateY: [-0.8, 0.8, -0.8] },
    transition: { duration: 8, repeat: Infinity, ease: 'easeInOut' as const },
}

// ─── Glass material helper ──────────────────────────────────────────────────
const glass = (bg: string, blur = 48, border = 'rgba(255,255,255,0.18)') => ({
    background: bg,
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
    border: `1px solid ${border}`,
})

// ─── Scrolling Card Strip ───────────────────────────────────────────────────
// Renders a set of card placeholders that scroll upward in a continuous loop
// with a soft fade-out mask at top and bottom edges.
function ScrollingCards({ count, color, delay }: { count: number; color: string; delay: number }) {
    const cards = useMemo(() =>
        [...Array(count)].map((_, i) => ({
            w1: 45 + Math.round(Math.random() * 25),   // title bar width %
            w2: 70 + Math.round(Math.random() * 30),   // body bar width %
            hasCheck: i % 3 === 0,
        })), [count])

    return (
        <div style={{
            flex: 1, overflow: 'hidden', position: 'relative',
            // Fade mask: transparent at top/bottom edges
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 18%, black 72%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 18%, black 72%, transparent 100%)',
        }}>
            <motion.div
                animate={{ y: ['0%', '-50%'] }}
                transition={{ duration: 14 + delay * 2, repeat: Infinity, ease: 'linear', delay: delay * 0.3 }}
                style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
            >
                {/* Duplicate cards for seamless loop */}
                {[...cards, ...cards].map((card, j) => (
                    <div key={j} style={{
                        padding: '10px 11px', borderRadius: 12,
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.04)',
                        display: 'flex', flexDirection: 'column', gap: 6,
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            {card.hasCheck && (
                                <CheckCircle style={{
                                    width: 11, height: 11, flexShrink: 0,
                                    color: `rgba(${color},0.7)`,
                                    filter: `drop-shadow(0 0 4px rgba(${color},0.4))`,
                                }} />
                            )}
                            <div style={{ height: 5, width: `${card.w1}%`, borderRadius: 999, background: 'rgba(255,255,255,0.14)' }} />
                        </div>
                        <div style={{ height: 4, width: `${card.w2}%`, borderRadius: 999, background: 'rgba(255,255,255,0.04)' }} />
                    </div>
                ))}
            </motion.div>
        </div>
    )
}

// ─── Main Component ─────────────────────────────────────────────────────────
export function HeroAnimation() {
    const [phase, setPhase] = useState(0)
    const [isClient, setIsClient] = useState(false)

    const particles = useMemo(() =>
        typeof window === 'undefined' ? [] :
            [...Array(22)].map(() => ({
                x: Math.random() * 700 - 350,
                y: Math.random() * 500 - 250,
                dy: -(25 + Math.random() * 90),
                dur: 5 + Math.random() * 7,
                delay: Math.random() * 10,
                big: Math.random() > 0.88,
            })), [])

    useEffect(() => { setIsClient(true) }, [])

    useEffect(() => {
        let mounted = true
        const timings = [2800, 1400, 3200, 5800, 5200]
        const run = async () => {
            while (mounted) {
                for (let p = 0; p < 5 && mounted; p++) {
                    setPhase(p)
                    await new Promise(r => setTimeout(r, timings[p]))
                }
            }
        }
        run()
        return () => { mounted = false }
    }, [])

    if (!isClient) return <div style={{ height: 620 }} />

    return (
        <div style={{
            position: 'relative', width: '100%', height: 620,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            perspective: '2000px', overflow: 'visible', userSelect: 'none',
            background: 'transparent',
        }}>

            {/* ── Ambient particles ──────────────────────────────── */}
            {particles.map((p, i) => (
                <motion.div key={i} style={{
                    position: 'absolute', width: p.big ? 2.5 : 1, height: p.big ? 2.5 : 1, borderRadius: '50%',
                    background: p.big
                        ? 'radial-gradient(circle, rgba(139,92,246,0.5) 0%, transparent 70%)'
                        : 'rgba(255,255,255,0.1)',
                }}
                    initial={{ x: p.x, y: p.y, opacity: 0 }}
                    animate={{ y: [p.y, p.y + p.dy], opacity: [0, 0.4, 0] }}
                    transition={{ duration: p.dur, repeat: Infinity, ease: 'linear', delay: p.delay }}
                />
            ))}

            <AnimatePresence>
                {/* ═══════════════════════════════════════════════════
                    PHASE 0 & 1 — THE ORIGIN + THE INPUT
                ═══════════════════════════════════════════════════ */}
                {(phase === 0 || phase === 1) && (
                    <motion.div
                        key="source"
                        {...morphIn} exit={morphOut.exit}
                        style={{ position: 'absolute', zIndex: 30, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                    >
                        <motion.div {...drift} style={{
                            width: 140, height: 140, borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            position: 'relative',
                            ...glass('rgba(255,255,255,0.04)', 44, 'rgba(96,165,250,0.28)'),
                            boxShadow: '0 0 70px rgba(59,130,246,0.18), 0 0 140px rgba(59,130,246,0.06), inset 0 0 35px rgba(59,130,246,0.05)',
                        }}>
                            {/* Rhythmic internal glow */}
                            <motion.div
                                animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.55, 0.3] }}
                                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                style={{
                                    position: 'absolute', inset: 10, borderRadius: '50%',
                                    background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)',
                                    filter: 'blur(16px)', pointerEvents: 'none',
                                }}
                            />

                            <User style={{
                                width: 54, height: 54, color: 'white', position: 'relative', zIndex: 10,
                                filter: 'drop-shadow(0 0 22px rgba(255,255,255,0.5))',
                            }} />

                            {/* Orbital ring */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
                                style={{ position: 'absolute', inset: -12, borderRadius: '50%', border: '1px dashed rgba(255,255,255,0.06)' }}
                            />

                            {/* Breathing aura */}
                            {[0, 1, 2].map(r => (
                                <motion.div key={r}
                                    style={{ position: 'absolute', inset: -3, borderRadius: '50%', border: '1px solid rgba(96,165,250,0.1)' }}
                                    animate={{ scale: [1, 1.5 + r * 0.3], opacity: [0.3, 0] }}
                                    transition={{ duration: 3.5, delay: r * 0.65, repeat: Infinity, ease: 'easeOut' }}
                                />
                            ))}
                        </motion.div>

                        {/* Fiber-optic light beam (phase 1) */}
                        <AnimatePresence>
                            {phase === 1 && (
                                <motion.div key="beam"
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    style={{ marginTop: -2 }}
                                >
                                    <svg width="6" height="180" viewBox="0 0 6 180" style={{ overflow: 'visible', display: 'block' }}>
                                        <defs>
                                            <linearGradient id="bGr" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.85" />
                                                <stop offset="45%" stopColor="#A78BFA" stopOpacity="0.6" />
                                                <stop offset="100%" stopColor="#EC4899" stopOpacity="0" />
                                            </linearGradient>
                                            <filter id="bGl"><feGaussianBlur stdDeviation="3" /><feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                                        </defs>
                                        <motion.rect x="1" width="4" rx="2" fill="url(#bGr)" filter="url(#bGl)"
                                            initial={{ height: 0 }} animate={{ height: 180 }}
                                            transition={{ duration: 0.85, ease: 'circOut' }}
                                        />
                                        <motion.circle cx="3" r="4" fill="#93C5FD" filter="url(#bGl)"
                                            initial={{ cy: 0, opacity: 0 }}
                                            animate={{ cy: [0, 180], opacity: [0, 1, 1, 0] }}
                                            transition={{ duration: 1, ease: 'easeIn' }}
                                        />
                                    </svg>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}

                {/* ═══════════════════════════════════════════════════
                    PHASE 2 — THE CONNECTION (Telegram Glass)
                ═══════════════════════════════════════════════════ */}
                {phase === 2 && (
                    <motion.div key="telegram" {...morphIn} exit={morphOut.exit}
                        style={{ position: 'absolute', zIndex: 30 }}
                    >
                        <motion.div {...drift} className="animate-bioluminescent" style={{
                            width: 184, height: 184, borderRadius: '2.5rem',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            position: 'relative',
                            ...glass('linear-gradient(135deg, rgba(42,171,238,0.28) 0%, rgba(37,99,235,0.07) 100%)', 52, 'rgba(255,255,255,0.2)'),
                            boxShadow: '0 35px 90px rgba(42,171,238,0.2), inset 0 0 0 1px rgba(255,255,255,0.08)',
                        }}>
                            {/* Glass refraction */}
                            <div style={{
                                position: 'absolute', inset: 0, borderRadius: '2.5rem',
                                background: 'linear-gradient(150deg, rgba(255,255,255,0.1) 0%, transparent 45%)',
                                pointerEvents: 'none',
                            }} />

                            <Send style={{
                                width: 78, height: 78, color: 'white', transform: 'translate(-3px, 3px)',
                                filter: 'drop-shadow(0 5px 22px rgba(42,171,238,0.5))',
                            }} strokeWidth={1.2} />

                            {/* Inner energy pulse */}
                            <motion.div
                                animate={{ scale: [1, 1.22, 1], opacity: [0.18, 0.42, 0.18] }}
                                transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                                style={{
                                    position: 'absolute', inset: 18, borderRadius: '50%',
                                    background: 'radial-gradient(circle, rgba(96,165,250,0.3) 0%, transparent 68%)',
                                    filter: 'blur(16px)', pointerEvents: 'none',
                                }}
                            />

                            {/* Neon edge color-cycle */}
                            <motion.div
                                animate={{
                                    boxShadow: [
                                        '0 0 18px rgba(42,171,238,0.25), 0 0 36px rgba(42,171,238,0.08)',
                                        '0 0 24px rgba(139,92,246,0.3), 0 0 48px rgba(168,85,247,0.1)',
                                        '0 0 18px rgba(42,171,238,0.25), 0 0 36px rgba(42,171,238,0.08)',
                                    ]
                                }}
                                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                                style={{ position: 'absolute', inset: 0, borderRadius: '2.5rem', pointerEvents: 'none' }}
                            />
                        </motion.div>
                    </motion.div>
                )}

                {/* ═══════════════════════════════════════════════════
                    PHASE 3 — THE ORGANIZATION
                    Kanban columns with vertically scrolling cards
                ═══════════════════════════════════════════════════ */}
                {phase === 3 && (
                    <motion.div key="kanban" {...morphIn} exit={morphOut.exit}
                        style={{
                            position: 'absolute', zIndex: 30,
                            width: '100%', maxWidth: '52rem', height: '100%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                    >
                        <div style={{
                            display: 'flex', gap: 16, alignItems: 'stretch',
                            transformStyle: 'preserve-3d', transform: 'translateY(-12px)',
                            height: 340,
                        }}>
                            {([
                                { title: 'Idea Bank', color: '59,130,246', cards: 5, delay: 0 },
                                { title: 'In Progress', color: '168,85,247', cards: 4, delay: 1 },
                                { title: 'Ready', color: '34,197,94', cards: 4, delay: 2 },
                            ]).map((col, i) => (
                                <motion.div
                                    key={col.title}
                                    initial={{ opacity: 0, y: 80, rotateY: 16 * (i - 1), scale: 0.85 }}
                                    animate={{ opacity: 1, y: 0, rotateY: 0, scale: 1 }}
                                    transition={{ duration: 1.3, delay: 0.15 + i * 0.14, ease: liquidEase }}
                                    style={{
                                        width: 180, padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 10,
                                        position: 'relative', borderRadius: '1.6rem',
                                        ...glass('rgba(255,255,255,0.02)', 42, 'rgba(255,255,255,0.06)'),
                                        boxShadow: '0 40px 80px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(255,255,255,0.03)',
                                    }}
                                >
                                    {/* Column header */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 2px', flexShrink: 0 }}>
                                        <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>
                                            {col.title}
                                        </span>
                                        <div style={{
                                            width: 7, height: 7, borderRadius: '50%',
                                            background: `rgba(${col.color},0.6)`,
                                            boxShadow: `0 0 10px rgba(${col.color},0.5)`,
                                        }} />
                                    </div>

                                    {/* Scrolling cards strip */}
                                    <ScrollingCards count={col.cards} color={col.color} delay={col.delay} />

                                    {/* Bottom add ghost */}
                                    <div style={{
                                        display: 'flex', justifyContent: 'center', padding: '6px 0',
                                        border: '1px dashed rgba(255,255,255,0.05)', borderRadius: 10,
                                        opacity: 0.22, flexShrink: 0,
                                    }}>
                                        <Plus style={{ width: 12, height: 12, color: 'white' }} />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* ═══════════════════════════════════════════════════
                    PHASE 4 — THE INTELLIGENCE (AI Convergence)
                ═══════════════════════════════════════════════════ */}
                {phase === 4 && (
                    <motion.div key="ai"
                        initial={{ scale: 0.2, opacity: 0, filter: 'blur(36px)' }}
                        animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                        exit={{ scale: 2.8, opacity: 0, filter: 'blur(50px)' }}
                        transition={{ duration: 1.6, ease: liquidEase }}
                        style={{ position: 'absolute', zIndex: 50 }}
                    >
                        <motion.div {...drift} style={{
                            width: 208, height: 208, borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            position: 'relative',
                            ...glass('rgba(0,0,0,0.28)', 52, 'rgba(168,85,247,0.22)'),
                            boxShadow: '0 0 90px rgba(168,85,247,0.2), 0 0 180px rgba(59,130,246,0.07), inset 0 0 55px rgba(168,85,247,0.06)',
                        }}>
                            {/* Spinning orbital */}
                            <div className="animate-spin-slow" style={{
                                position: 'absolute', inset: 0, borderRadius: '50%',
                                borderTop: '2px solid rgba(96,165,250,0.4)',
                                borderRight: '2px solid rgba(236,72,153,0.4)',
                                borderBottom: '2px solid transparent',
                                borderLeft: '2px solid transparent',
                            }} />

                            {/* Counter-rotating inner orbit */}
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
                                style={{
                                    position: 'absolute', inset: 16, borderRadius: '50%',
                                    borderTop: '1px solid rgba(168,85,247,0.18)',
                                    borderLeft: '1px solid rgba(59,130,246,0.13)',
                                    borderBottom: '1px solid transparent',
                                    borderRight: '1px solid transparent',
                                }}
                            />

                            {/* Sparkle icon */}
                            <Sparkles style={{
                                width: 92, height: 92, color: 'white', position: 'relative', zIndex: 10,
                                filter: 'drop-shadow(0 0 38px rgba(255,255,255,0.6)) drop-shadow(0 0 76px rgba(168,85,247,0.4))',
                            }} />

                            {/* Expanding magenta / blue aura rings */}
                            {[0, 1, 2, 3].map(r => (
                                <motion.div key={r}
                                    style={{
                                        position: 'absolute', inset: -2, borderRadius: '50%', zIndex: -1,
                                        border: `1px solid ${r % 2 === 0 ? 'rgba(236,72,153,0.16)' : 'rgba(96,165,250,0.16)'}`,
                                    }}
                                    animate={{ scale: [1, 2.2 + r * 0.35], opacity: [0.42, 0] }}
                                    transition={{ duration: 4.2, delay: r * 0.75, repeat: Infinity, ease: 'easeOut' }}
                                />
                            ))}

                            {/* Radiant aura glow */}
                            <motion.div
                                animate={{ opacity: [0.2, 0.45, 0.2], scale: [0.88, 1.12, 0.88] }}
                                transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
                                style={{
                                    position: 'absolute', width: 310, height: 310, borderRadius: '50%', zIndex: -2,
                                    background: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, rgba(59,130,246,0.05) 38%, transparent 68%)',
                                    filter: 'blur(22px)', pointerEvents: 'none',
                                }}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
