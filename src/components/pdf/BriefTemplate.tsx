import React from 'react'

// ============================================================
// BriefTemplate v6 — Minimal, Text-Only, Clean Field Style
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
            month: 'long', day: 'numeric', year: 'numeric',
        })
    } catch { return d }
}

// ---- Styles ----
const base: React.CSSProperties = {
    fontFamily: 'Helvetica, Arial, sans-serif',
    color: '#0f172a',
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
    lineHeight: 1.4,
}

const sectionLabel: React.CSSProperties = {
    fontSize: '10px',
    fontWeight: 700,
    color: '#94a3b8', // Slate-400 (Grey)
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '4px',
    display: 'block',
}

const valueText: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 700, // Bold
    color: '#0f172a', // Slate-900 (Dark)
}

const card: React.CSSProperties = {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '24px',
    marginBottom: '20px',
}

// ============================================================
// COMPONENT
// ============================================================
export function BriefTemplate({ content }: { content: ContentData }) {
    const talents = content.content_talents?.map(ct => ct.talent?.name).filter(Boolean) || []
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

    // Format helpers
    const platformDisplay = content.platform || 'General'
    const statusDisplay = content.status || 'Draft'
    const teamDisplay = talents.length > 0 ? talents.join(', ') : 'Unassigned'

    return (
        <div
            id="pdf-brief-root"
            style={{
                ...base,
                width: '794px', // A4 width at 96 DPI (approx)
                backgroundColor: '#ffffff',
                position: 'relative',
            }}
        >
            {/* ===== HEADER (Captured Separately) ===== */}
            <div id="pdf-brief-header" style={{
                backgroundColor: '#ffffff',
                borderBottom: '2px solid #0f172a',
                padding: '40px 48px 24px',
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                        <div style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '-0.5px', color: '#0f172a' }}>
                            PRODUCTION BRIEF
                        </div>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            {content.title}
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
                            CreatorFlow
                        </div>
                        <div style={{ fontSize: '11px', fontWeight: 500, color: '#64748b', marginTop: '2px' }}>
                            {dateStr}
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== BODY (Captured Separately) ===== */}
            <div id="pdf-brief-body" style={{ padding: '32px 48px 60px' }}>

                {/* 1. METADATA GRID */}
                <div style={{ ...card, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    {/* Left Col: Platform, Status, Team */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                        <div>
                            <span style={sectionLabel}>Platform & Status</span>
                            <div style={valueText}>
                                {platformDisplay} • {statusDisplay}
                            </div>
                        </div>
                        <div>
                            <span style={sectionLabel}>Assigned Team</span>
                            <div style={valueText}>
                                {teamDisplay}
                            </div>
                        </div>
                    </div>

                    {/* Right Col: Dates & Link */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <span style={sectionLabel}>Production</span>
                            <div style={valueText}>{fmtDate(content.production_date)}</div>
                        </div>
                        <div>
                            <span style={sectionLabel}>Target Upload</span>
                            <div style={valueText}>{fmtDate(content.upload_date)}</div>
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                            <span style={sectionLabel}>Reference</span>
                            <a
                                href={content.reference_link || '#'}
                                style={{
                                    ...valueText,
                                    color: '#2563eb',
                                    textDecoration: 'underline',
                                    wordBreak: 'break-all',
                                    display: 'block' // Ensure it behaves like a block for spacing
                                }}
                            >
                                {content.reference_link || 'None'}
                            </a>
                        </div>
                    </div>
                </div>

                {/* 2. DESCRIPTION */}
                {content.description && (
                    <div style={card}>
                        <span style={sectionLabel}>Description</span>
                        <div style={{ ...valueText, fontWeight: 500, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                            {content.description}
                        </div>
                    </div>
                )}

                {/* 3. SCRIPT */}
                {content.script && (
                    <div style={{ ...card, borderLeft: '4px solid #0f172a' }}>
                        <span style={sectionLabel}>Script & Notes</span>
                        <div style={{
                            ...valueText, fontWeight: 500, lineHeight: 1.6, whiteSpace: 'pre-wrap',
                            fontFamily: 'Courier New, monospace', fontSize: '13px'
                        }}>
                            {content.script}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer used by PDF logic if needed, but we'll stick to simple page numbers if possible */}
            <div style={{
                position: 'absolute', bottom: 10, left: 48, right: 48,
                borderTop: '1px solid #e2e8f0', paddingTop: '10px',
                display: 'flex', justifyContent: 'space-between',
                fontSize: '9px', color: '#94a3b8'
            }}>
                <span>creatorflow.app</span>
                <span>Production Brief</span>
            </div>
        </div>
    )
}
