import React from 'react'

// ============================================================
// BriefTemplate v4 — Precision-aligned, inline SVG icons,
// grid-based dates, fixed-width labels
// ALL inline styles | hex-only colors | Arial font | no emojis
// ============================================================

interface ContentData {
    title: string
    description?: string | null
    platform?: string
    status?: string
    production_date?: string | null
    upload_date?: string | null
    script?: string | null
    reference_link?: string | null
    content_talents?: Array<{ talent?: { name?: string } }>
}

// ---- Helpers ----
function fmtDate(d: string | null | undefined): string {
    if (!d) return 'Not scheduled'
    try {
        return new Date(d).toLocaleDateString('en-US', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
        })
    } catch { return d }
}

function statusChip(s?: string): { bg: string; fg: string; border: string } {
    switch (s) {
        case 'Idea': return { bg: '#dbeafe', fg: '#1e40af', border: '#93c5fd' }
        case 'To-Do': return { bg: '#fef3c7', fg: '#92400e', border: '#fcd34d' }
        case 'Filming': return { bg: '#fce7f3', fg: '#9d174d', border: '#f9a8d4' }
        case 'Editing': return { bg: '#f3e8ff', fg: '#6b21a8', border: '#c4b5fd' }
        case 'Done': return { bg: '#dcfce7', fg: '#166534', border: '#86efac' }
        default: return { bg: '#f1f5f9', fg: '#475569', border: '#cbd5e1' }
    }
}

function platChip(p?: string): { bg: string; fg: string; border: string; label: string } {
    switch (p) {
        case 'Instagram': return { bg: '#fce7f3', fg: '#9d174d', border: '#f9a8d4', label: 'Instagram' }
        case 'TikTok': return { bg: '#0f172a', fg: '#ffffff', border: '#334155', label: 'TikTok' }
        case 'YouTube': return { bg: '#fee2e2', fg: '#991b1b', border: '#fca5a5', label: 'YouTube' }
        default: return { bg: '#f1f5f9', fg: '#475569', border: '#cbd5e1', label: p || 'Unknown' }
    }
}

// ---- Inline SVG Icons (20x20, stroke-based) ----
const IconClapper = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3f68e4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 20H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2z" />
        <path d="m2 10 5-4 5 4 5-4 5 4" />
        <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
)

const IconCalendar = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3f68e4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
)

const IconPeople = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3f68e4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
)

const IconLink = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3f68e4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
)

const IconScript = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3f68e4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
    </svg>
)

const IconDesc = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3f68e4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="17" y1="10" x2="3" y2="10" />
        <line x1="21" y1="6" x2="3" y2="6" />
        <line x1="21" y1="14" x2="3" y2="14" />
        <line x1="17" y1="18" x2="3" y2="18" />
    </svg>
)

// ---- Shared Style Objects ----
const base: React.CSSProperties = {
    fontFamily: 'Arial, sans-serif',
    color: '#0f172a',
    margin: 0,
    padding: 0,
    boxSizing: 'border-box' as const,
    lineHeight: 1.5,
}

const card: React.CSSProperties = {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    padding: '24px',
    marginBottom: '14px',
}

const sectionHeader: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '14px',
}

const sectionLabel: React.CSSProperties = {
    fontSize: '10px',
    fontWeight: 700,
    color: '#3f68e4',
    letterSpacing: '2px',
    textTransform: 'uppercase' as const,
    lineHeight: '20px', // match icon height for baseline alignment
}

// ============================================================
// COMPONENT
// ============================================================
export function BriefTemplate({ content }: { content: ContentData }) {
    const plat = platChip(content.platform)
    const stat = statusChip(content.status)
    const talents = content.content_talents?.map(ct => ct.talent?.name).filter(Boolean) || []
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

    return (
        <div
            id="pdf-brief-root"
            style={{
                ...base,
                width: '794px',
                minHeight: '1123px',
                backgroundColor: '#f8fafc',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* ===== GRADIENT ACCENT ===== */}
            <div style={{ height: '4px', background: 'linear-gradient(90deg, #3f68e4 0%, #6366f1 50%, #8b5cf6 100%)' }} />

            {/* ===== HEADER ===== */}
            <div style={{
                ...base,
                backgroundColor: '#ffffff',
                padding: '32px 48px',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                {/* Left — Title Block */}
                <div>
                    <div style={{
                        fontSize: '30px', fontWeight: 800, color: '#0f172a',
                        letterSpacing: '-0.5px', lineHeight: 1.2,
                    }}>
                        PRODUCTION BRIEF
                    </div>
                    <div style={{
                        fontSize: '12px', fontWeight: 500, color: '#94a3b8',
                        marginTop: '4px', letterSpacing: '0.3px',
                    }}>
                        Content planning document
                    </div>
                </div>
                {/* Right — Brand + Date */}
                <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'flex-end', gap: '8px' }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                        backgroundColor: '#3f68e4', color: '#ffffff',
                        padding: '6px 18px', borderRadius: '20px',
                        fontSize: '12px', fontWeight: 700,
                    }}>
                        {/* Inline stream icon */}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                        </svg>
                        CreatorFlow
                    </div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 500 }}>
                        {dateStr}
                    </div>
                </div>
            </div>

            {/* ===== BODY ===== */}
            <div style={{ ...base, padding: '28px 48px 80px', backgroundColor: '#f8fafc' }}>

                {/* ---- CONTENT TITLE CARD ---- */}
                <div style={card}>
                    <div style={sectionHeader}>
                        <IconClapper />
                        <span style={sectionLabel}>CONTENT TITLE</span>
                    </div>
                    <div style={{
                        fontSize: '22px', fontWeight: 800, color: '#0f172a',
                        lineHeight: 1.35, letterSpacing: '-0.3px',
                    }}>
                        {content.title}
                    </div>
                </div>

                {/* ---- PLATFORM & STATUS CARD ---- */}
                <div style={card}>
                    <div style={sectionHeader}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3f68e4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                        </svg>
                        <span style={sectionLabel}>PLATFORM & STATUS</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' as const }}>
                        <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            backgroundColor: plat.bg, color: plat.fg,
                            border: `1.5px solid ${plat.border}`,
                            padding: '8px 18px', borderRadius: '20px',
                            fontSize: '13px', fontWeight: 700, lineHeight: '20px',
                        }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: plat.fg, display: 'inline-block', flexShrink: 0 }} />
                            {plat.label}
                        </span>
                        <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            backgroundColor: stat.bg, color: stat.fg,
                            border: `1.5px solid ${stat.border}`,
                            padding: '8px 18px', borderRadius: '20px',
                            fontSize: '13px', fontWeight: 700, lineHeight: '20px',
                        }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: stat.fg, display: 'inline-block', flexShrink: 0 }} />
                            {content.status || 'Unknown'}
                        </span>
                    </div>
                </div>

                {/* ---- DATES CARD — CSS Grid 2-col ---- */}
                <div style={{
                    ...card,
                    padding: '0',
                    overflow: 'hidden',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                }}>
                    {/* Production Date */}
                    <div style={{ padding: '24px', borderRight: '1px solid #e2e8f0' }}>
                        <div style={sectionHeader}>
                            <IconCalendar />
                            <span style={sectionLabel}>PRODUCTION DATE</span>
                        </div>
                        <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                            {fmtDate(content.production_date)}
                        </div>
                    </div>
                    {/* Upload Date */}
                    <div style={{ padding: '24px' }}>
                        <div style={sectionHeader}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="17 8 12 3 7 8" />
                                <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                            <span style={{ ...sectionLabel, color: '#10b981' }}>TARGET UPLOAD</span>
                        </div>
                        <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                            {fmtDate(content.upload_date)}
                        </div>
                    </div>
                </div>

                {/* ---- ASSIGNED TEAM CARD ---- */}
                {talents.length > 0 && (
                    <div style={card}>
                        <div style={sectionHeader}>
                            <IconPeople />
                            <span style={sectionLabel}>ASSIGNED TEAM</span>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' as const, alignItems: 'center' }}>
                            {talents.map((name, i) => (
                                <span key={i} style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                                    backgroundColor: '#eff6ff', color: '#1e40af',
                                    border: '1.5px solid #93c5fd',
                                    padding: '7px 16px', borderRadius: '20px',
                                    fontSize: '12px', fontWeight: 600, lineHeight: '22px',
                                }}>
                                    <span style={{
                                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                        width: '22px', height: '22px', borderRadius: '50%',
                                        backgroundColor: '#3f68e4', color: '#ffffff',
                                        fontSize: '9px', fontWeight: 800, flexShrink: 0,
                                    }}>
                                        {(name as string).slice(0, 2).toUpperCase()}
                                    </span>
                                    {name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* ---- REFERENCE LINK CARD ---- */}
                {content.reference_link && (
                    <div style={card}>
                        <div style={sectionHeader}>
                            <IconLink />
                            <span style={sectionLabel}>REFERENCE LINK</span>
                        </div>
                        <div style={{
                            fontSize: '13px', color: '#3f68e4', fontWeight: 600,
                            wordBreak: 'break-all' as const,
                            padding: '12px 16px',
                            backgroundColor: '#f8fafc', borderRadius: '10px',
                            border: '1px solid #e2e8f0',
                        }}>
                            {content.reference_link}
                        </div>
                    </div>
                )}

                {/* ---- DESCRIPTION CARD ---- */}
                {content.description && (
                    <div style={card}>
                        <div style={sectionHeader}>
                            <IconDesc />
                            <span style={sectionLabel}>DESCRIPTION</span>
                        </div>
                        <div style={{ fontSize: '13px', lineHeight: 1.8, color: '#334155' }}>
                            {content.description}
                        </div>
                    </div>
                )}

                {/* ---- SCRIPT / NOTES CARD ---- */}
                {content.script && (
                    <div style={{ ...card, borderLeft: '4px solid #3f68e4' }}>
                        <div style={sectionHeader}>
                            <IconScript />
                            <span style={sectionLabel}>SCRIPT / NOTES</span>
                        </div>
                        <div style={{
                            fontSize: '13px', lineHeight: 1.85, color: '#334155',
                            whiteSpace: 'pre-wrap' as const,
                            padding: '16px 20px',
                            backgroundColor: '#f8fafc', borderRadius: '10px',
                        }}>
                            {content.script}
                        </div>
                    </div>
                )}
            </div>

            {/* ===== FOOTER ===== */}
            <div style={{
                ...base,
                position: 'absolute',
                bottom: 0, left: 0, right: 0,
                padding: '14px 48px',
                backgroundColor: '#ffffff',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <span style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 500 }}>
                    Generated by CreatorFlow
                </span>
                <span style={{
                    fontSize: '8px', color: '#94a3b8', fontWeight: 600,
                    backgroundColor: '#f1f5f9',
                    padding: '3px 10px', borderRadius: '10px',
                }}>
                    Page 1
                </span>
                <span style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 500 }}>
                    creatorflow.app
                </span>
            </div>
        </div>
    )
}
