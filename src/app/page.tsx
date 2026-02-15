'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

// Utility for class concatenation if not using a library, 
// using simple template literal here as allowed by the persona.
const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ')

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden relative selection:bg-[#3f68e4]/30 dark bg-[#111521] text-white">
      {/* Background Gradients */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#3f68e4]/20 blur-[120px] rounded-full point-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#3f68e4]/10 blur-[120px] rounded-full point-events-none"></div>
        <div className="absolute top-[30%] right-[10%] w-[30%] h-[30%] bg-blue-600/10 blur-[100px] rounded-full point-events-none"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-7xl z-50">
        <div className="bg-[#111521]/60 backdrop-blur-[40px] border border-[#3f68e4]/20 rounded-full px-8 py-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#3f68e4] rounded-lg flex items-center justify-center">
              <span className="material-icons text-white text-xl">stream</span>
            </div>
            <span className="text-xl font-extrabold tracking-tight">CreatorFlow</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link className="text-sm font-medium hover:text-[#3f68e4] transition-colors" href="#">Platform</Link>
            <Link className="text-sm font-medium hover:text-[#3f68e4] transition-colors" href="#">Idea Bank</Link>
            <Link className="text-sm font-medium hover:text-[#3f68e4] transition-colors" href="#">Resources</Link>
            <Link className="text-sm font-medium hover:text-[#3f68e4] transition-colors" href="#pricing">Pricing</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <button className="text-sm font-semibold px-6 py-2 hover:bg-white/5 rounded-full transition-colors">Login</button>
            </Link>
            <Link href="/dashboard">
              <button className="bg-[#3f68e4] hover:bg-[#3f68e4]/90 text-white text-sm font-bold px-8 py-3 rounded-full shadow-[0_0_40px_-10px_rgba(63,104,228,0.5)] transition-all">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#3f68e4]/10 border border-[#3f68e4]/20 rounded-full"
            >
              <span className="w-2 h-2 bg-[#3f68e4] rounded-full animate-pulse"></span>
              <span className="text-xs font-bold text-[#3f68e4] tracking-widest uppercase">Version 2.0 Now Live</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-6xl md:text-7xl lg:text-8xl font-extrabold leading-[1.1] tracking-tight"
            >
              Beresin <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3f68e4] to-blue-400">Jadwalnya</span>, Bikin Kontennya
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-slate-400 max-w-xl leading-relaxed"
            >
              Manage your creative chaos. From an integrated <span className="text-white font-semibold underline decoration-[#3f68e4]">Idea Bank</span> to professional PDF exports for brand deals. All in one futuristic workspace.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-6 pt-4"
            >
              <Link href="/dashboard" className="w-full sm:w-auto">
                <button className="w-full bg-[#3f68e4] hover:bg-[#3f68e4]/90 text-white text-lg font-extrabold px-12 py-5 rounded-full shadow-[0_0_40px_-10px_rgba(63,104,228,0.5)] transition-all transform hover:scale-105">
                  Try Now
                </button>
              </Link>
              <button className="flex items-center gap-3 text-lg font-bold hover:text-[#3f68e4] transition-colors group">
                <span className="w-12 h-12 flex items-center justify-center border border-white/20 rounded-full group-hover:border-[#3f68e4] transition-colors">
                  <span className="material-icons">play_arrow</span>
                </span>
                Watch Demo
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="pt-8 flex items-center gap-6 hover:grayscale-0 grayscale transition-all duration-700"
            >
              <img alt="TikTok" className="h-6" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZfdXyHcYnotnL8HTVWh3v74ZUwidGWdWhklqZbC3euFEzGlbIae_6y74zMUhWjJVjpM8pKg_NVM6bGgXh9q8bL5FjWEio-tL553N2RC-JKl9-73K3gLBebex4vBsR0BCsnQFXABENb8HvxLK4cRLFwIbd9DPf0dWNrbCVH_1yNBP4oqueLlb851hosV9F3ir9_CGO3P8Agn4LFFURhAasjyZgv4xkcPfI23f43ESxHSeHzR06W5bXQFwIOx7Gt5A2Yp6_enqkI7lD" />
              <img alt="Instagram" className="h-6" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzNrxBAeFycRtaIAQyOnl5BCQ12vssbVXR5bmb3xohRdlPbwehQ7w-FazMho0PO-Z6wZT81h_2j25-WUYSVs5mfW8O_f5uDn8sIy_wVyRJ6LsakAjXCBsme31-V7Fq8H9Kynn5ougMDCP8Fy-LCRwU98v5UdXW45YRfWvOHtcwZy2DWa-i0K9vBkuUkBmmUCRFIOONYBsDnwEex0PoO3W8YbPxyOnvu4N5atm1PyRWtvGveA3A-nVCzOc5g41t2ZY54nFGotQUjO_W" />
              <img alt="YouTube" className="h-6" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDk6fBSDyBJVb0eV1tlwx_Q_ADu7nKd6sP0MKcackt_46iH3Fy73LOSQoqHWgnmTEkO0s8MqbdnhXgt9LE3bPrmXrK-kWB9HxV-y7LHy7iaOBQrw0FrIyd8rfhjSFfCesrWryV3KSASAIaotivITOdhBtD-SglYvdDEdHoG778XQjofNI_DVPekXtXbOYe79XsrAXq6QloGy0Bhsx1kC5ZbB0RCEc_FyuxeKH8V_NooMnB10_xIwsYZln-2-H7kThs2s7oDEa_TMNwp" />
              <span className="text-xs font-bold uppercase tracking-widest">+12 Platforms</span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Dashboard Preview */}
            <div className="bg-[#111521]/60 backdrop-blur-[40px] border border-[#3f68e4]/20 rounded-xl p-6 relative z-10 overflow-hidden min-h-[500px] flex shadow-2xl">
              {/* Sidebar Mini */}
              <div className="w-16 h-full flex flex-col items-center gap-6 border-r border-white/10 pr-4">
                <div className="w-10 h-10 bg-[#3f68e4]/20 rounded-full flex items-center justify-center text-[#3f68e4]">
                  <span className="material-icons">dashboard</span>
                </div>
                <div className="w-10 h-10 hover:bg-white/10 rounded-full flex items-center justify-center text-slate-500 cursor-pointer transition-colors">
                  <span className="material-icons">lightbulb</span>
                </div>
                <div className="w-10 h-10 hover:bg-white/10 rounded-full flex items-center justify-center text-slate-500 cursor-pointer transition-colors">
                  <span className="material-icons">calendar_today</span>
                </div>
                <div className="w-10 h-10 hover:bg-white/10 rounded-full flex items-center justify-center text-slate-500 cursor-pointer transition-colors">
                  <span className="material-icons">folder</span>
                </div>
                <div className="mt-auto w-10 h-10 hover:bg-white/10 rounded-full flex items-center justify-center text-slate-500 cursor-pointer transition-colors">
                  <span className="material-icons">settings</span>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="flex-1 pl-8 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold">Content Workspace</h3>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-500/50 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500/50 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500/50 rounded-full"></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/5">
                    <div className="h-2 w-1/2 bg-white/20 rounded-full mb-3"></div>
                    <div className="h-12 w-full bg-white/5 rounded-lg"></div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/5">
                    <div className="h-2 w-1/3 bg-white/20 rounded-full mb-3"></div>
                    <div className="h-12 w-full bg-white/5 rounded-lg"></div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-[#3f68e4]/5 border border-[#3f68e4]/20 flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#3f68e4] rounded-lg flex items-center justify-center">
                      <span className="material-icons text-white">description</span>
                    </div>
                    <div>
                      <div className="text-sm font-bold">Brand_Report_2026.pdf</div>
                      <div className="text-xs text-slate-500 italic">Ready for Export</div>
                    </div>
                    <button className="ml-auto text-[#3f68e4]">
                      <span className="material-icons">download</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Card 1 */}
            <motion.div
              whileHover={{ y: -10, rotateX: 5, rotateY: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="absolute -top-12 -right-8 w-64 z-20 cursor-pointer"
            >
              <div className="bg-white/[0.03] backdrop-blur-[20px] border border-white/10 p-6 rounded-xl shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <span className="material-icons text-yellow-400">tips_and_updates</span>
                  <span className="text-sm font-bold tracking-tight">Idea Bank</span>
                </div>
                <div className="space-y-3">
                  <div className="h-2 w-full bg-white/10 rounded-full"></div>
                  <div className="h-2 w-4/5 bg-white/10 rounded-full"></div>
                  <div className="h-2 w-2/3 bg-white/10 rounded-full"></div>
                </div>
              </div>
            </motion.div>

            {/* Floating Card 2 */}
            <motion.div
              whileHover={{ y: -10, rotateX: 5, rotateY: 5 }}
              transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
              className="absolute -bottom-8 -left-12 w-56 z-20 cursor-pointer"
            >
              <div className="bg-white/[0.03] backdrop-blur-[20px] border border-white/10 p-6 rounded-xl shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <span className="material-icons text-green-400">check_circle</span>
                  <span className="text-sm font-bold tracking-tight">Task Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#3f68e4]/20"></div>
                  <div className="h-2 w-1/2 bg-white/10 rounded-full"></div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold mb-6"
          >
            Designed for the Next Era
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 max-w-2xl mx-auto"
          >
            The productivity gap for creators is finally closed. CreatorFlow brings studio-grade management to your browser.
          </motion.p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: 'bolt', title: 'Hyper-Fast Idea Bank', desc: 'Instantly capture sparks of inspiration across any device. Categorize with AI-powered tagging for 2026 workflows.' },
            { icon: 'auto_awesome', title: 'Studio Scheduling', desc: 'Visual calendars that sync across TikTok, Reels, and YouTube. One dashboard to rule your posting frequency.' },
            { icon: 'picture_as_pdf', title: 'Pro PDF Exports', desc: 'Generate stunning media kits and project reports in seconds. Impress brands with professional transparency.' }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-white/[0.03] backdrop-blur-[20px] border border-white/5 p-10 rounded-xl hover:border-[#3f68e4]/50 transition-colors group"
            >
              <div className="w-16 h-16 bg-[#3f68e4]/20 rounded-full flex items-center justify-center mb-8 group-hover:bg-[#3f68e4] transition-colors">
                <span className="material-icons text-[#3f68e4] group-hover:text-white transition-colors">{feature.icon}</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-32 px-6 max-w-7xl mx-auto" id="pricing">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-extrabold mb-6"
          >
            Choose Your Flow
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 max-w-2xl mx-auto text-lg"
          >
            Transparent pricing for every stage of your creative journey. No hidden fees, just pure productivity.
          </motion.p>
        </div>
        <div className="grid lg:grid-cols-3 gap-8 items-stretch">
          {/* Trial Flow */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white/[0.03] backdrop-blur-[20px] p-10 rounded-[2.5rem] border border-white/5 flex flex-col hover:border-[#3f68e4]/30 transition-all duration-500"
          >
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-2">Trial Flow</h3>
              <p className="text-slate-400">Perfect for exploration</p>
            </div>
            <div className="mb-10">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-extrabold">0k</span>
                <span className="text-slate-400 font-medium">/first month</span>
              </div>
            </div>
            <ul className="space-y-4 mb-12 flex-1">
              {[
                'Limited Idea Bank',
                '1 Social Platform Sync',
                'Standard PDF Export'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300">
                  <span className="material-icons text-[#3f68e4] text-xl">check_circle</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link href="/dashboard">
              <button className="w-full py-4 px-8 rounded-full border border-white/20 font-bold hover:bg-white/5 transition-all">Start Trial</button>
            </Link>
          </motion.div>

          {/* Creator Annual */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            className="bg-[#111521]/60 backdrop-blur-[40px] px-10 py-12 rounded-[2.5rem] border-2 border-[#3f68e4] relative flex flex-col shadow-[0_0_40px_-10px_rgba(63,104,228,0.5)] z-10"
          >
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#3f68e4] px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest text-white shadow-xl">
              Best Deal
            </div>
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-2 text-white">Creator Annual</h3>
              <p className="text-blue-200/60">The ultimate workspace</p>
            </div>
            <div className="mb-10">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-extrabold text-white">799k</span>
                <span className="text-blue-200/60 font-medium">/year</span>
              </div>
              <div className="mt-2 text-[#3f68e4] font-bold text-sm">Save 400k per year</div>
            </div>
            <ul className="space-y-4 mb-12 flex-1">
              {[
                'Unlimited Idea Bank',
                'All Platform Syncing',
                'Custom Agency PDF Templates',
                'Priority 24/7 Support'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-white">
                  <span className="material-icons text-[#3f68e4] text-xl">check_circle</span>
                  <span className="font-semibold">{item}</span>
                </li>
              ))}
            </ul>
            <Link href="/dashboard">
              <button className="w-full py-5 px-8 rounded-full bg-[#3f68e4] text-white font-extrabold text-lg shadow-xl hover:bg-[#3f68e4]/90 transition-all">Get Started Now</button>
            </Link>
          </motion.div>

          {/* Monthly Pro */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white/[0.03] backdrop-blur-[20px] p-10 rounded-[2.5rem] border border-white/5 flex flex-col hover:border-[#3f68e4]/30 transition-all duration-500"
          >
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-2">Monthly Pro</h3>
              <p className="text-slate-400">Flexibility for professionals</p>
            </div>
            <div className="mb-10">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-extrabold">100k</span>
                <span className="text-slate-400 font-medium">/month</span>
              </div>
              <p className="mt-2 text-slate-500 text-sm italic">After initial trial</p>
            </div>
            <ul className="space-y-4 mb-12 flex-1">
              {[
                'Advanced Idea Bank',
                '3 Social Platform Syncs',
                'Pro PDF Watermark removal'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300">
                  <span className="material-icons text-[#3f68e4] text-xl">check_circle</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link href="/dashboard">
              <button className="w-full py-4 px-8 rounded-full border border-white/20 font-bold hover:bg-white/5 transition-all">Go Pro</button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Q&A Section */}
      <section className="py-32 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold mb-6"
          >
            Curious about the flow?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 max-w-2xl mx-auto"
          >
            Everything you need to know about the next generation of creative productivity.
          </motion.p>
        </div>
        <div className="space-y-6">
          {[
            {
              q: "What is Idea Bank?",
              a: "Idea Bank is our proprietary conceptual engine designed for the 2026 creator workflow. It's a high-speed repository for your raw inspirations, allowing you to instantly tag, categorize, and transform fleeting thoughts into actionable content pipelines using AI assistance."
            },
            {
              q: "Can I export to PDF?",
              a: "Absolutely. CreatorFlow features professional-grade PDF generation tools. You can export brand reports, media kits, and content analytics into beautifully designed, high-resolution documents that look like they were made by a top-tier agency."
            },
            {
              q: "Is there a mobile app?",
              a: "Yes, the CreatorFlow companion app is available on both iOS and Android. It syncs in real-time with your desktop workspace, ensuring your Idea Bank is always accessible whether you're in the studio or capturing inspiration on the go."
            },
            {
              q: "How does the 2026 scheduling work?",
              a: "Our scheduling engine uses predictive analytics to suggest optimal posting times across all major platforms. It visualizes your entire month across TikTok, YouTube, and Reels in a single glassmorphism dashboard, removing the guesswork from your posting consistency."
            }
          ].map((item, i) => (
            <details key={i} className="group">
              <summary className="list-none cursor-pointer bg-white/[0.03] backdrop-blur-[20px] p-8 md:p-10 rounded-3xl border border-white/5 hover:border-[#3f68e4]/30 transition-all">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl md:text-2xl font-bold text-white pr-8">{item.q}</h3>
                  <div className="w-12 h-12 flex-shrink-0 bg-[#3f68e4]/10 rounded-full flex items-center justify-center transition-all group-open:bg-[#3f68e4] group-open:text-white text-[#3f68e4]">
                    <span className="material-icons transform transition-transform duration-300 group-open:rotate-180">expand_more</span>
                  </div>
                </div>
                <div className="grid grid-rows-[0fr] transition-all duration-300 group-open:grid-rows-[1fr]">
                  <div className="overflow-hidden">
                    <div className="pt-8">
                      <p className="text-slate-400 text-lg leading-relaxed">{item.a}</p>
                    </div>
                  </div>
                </div>
              </summary>
            </details>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-32 px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden p-12 md:p-24 text-center"
        >
          <div className="absolute inset-0 bg-[#3f68e4] -z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/40 -z-10"></div>
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-6xl font-extrabold text-white">Ready to flow?</h2>
            <p className="text-white/80 text-xl">Join 10,000+ creators who upgraded their workflow to the future.</p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-6">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <button className="w-full h-full bg-white text-[#3f68e4] text-lg font-extrabold px-12 py-5 rounded-full shadow-2xl hover:bg-slate-100 transition-all transform hover:scale-105">
                  Start Free Trial
                </button>
              </Link>
              <span className="text-white/60 text-sm font-medium">No credit card required.</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#3f68e4] rounded-md flex items-center justify-center">
              <span className="material-icons text-white text-sm">stream</span>
            </div>
            <span className="font-bold tracking-tight">CreatorFlow</span>
          </div>
          <div className="flex gap-12 text-sm text-slate-500">
            <Link className="hover:text-white transition-colors" href="#">Privacy</Link>
            <Link className="hover:text-white transition-colors" href="#">Terms</Link>
            <Link className="hover:text-white transition-colors" href="#">Twitter</Link>
            <Link className="hover:text-white transition-colors" href="#">LinkedIn</Link>
          </div>
          <div className="text-sm text-slate-600">
            © 2026 CreatorFlow. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  )
}
