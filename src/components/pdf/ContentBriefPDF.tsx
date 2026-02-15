import React from 'react'

// ============================================================
// Offline PDF render component — styled with inline styles only
// so html2canvas captures everything reliably. No Tailwind, no
// CSS modules, no animations.
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

function formatDate(dateStr: string | null | undefined): string {
    if (!dateStr) return '—'
    try {
        const d = new Date(dateStr)
        return d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
    } catch {
        return dateStr
    }
}

function getPlatformLabel(platform?: string): { emoji: string; label: string } {
    switch (platform) {
        case 'Instagram': return { emoji: 'IG', label: 'Instagram' }
        case 'TikTok': return { emoji: 'TT', label: 'TikTok' }
        case 'YouTube': return { emoji: 'YT', label: 'YouTube' }
        default: return { emoji: '--', label: platform || 'Unknown' }
    }
}

function getStatusStyle(status?: string): { bg: string; color: string } {
    switch (status) {
        case 'Idea': return { bg: '#eff6ff', color: '#2563eb' }
        case 'To-Do': return { bg: '#fef3c7', color: '#d97706' }
        case 'Filming': return { bg: '#fce7f3', color: '#db2777' }
        case 'Editing': return { bg: '#f3e8ff', color: '#9333ea' }
        case 'Done': return { bg: '#dcfce7', color: '#16a34a' }
        default: return { bg: '#f1f5f9', color: '#475569' }
    }
}

export function ContentBriefPDF({ content }: { content: ContentData }) {
    const platform = getPlatformLabel(content.platform)
    const statusStyle = getStatusStyle(content.status)
    const talents = content.content_talents?.map(ct => ct.talent?.name).filter(Boolean) || []
    const generatedDate = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })

    return (
        <div
            id="pdf-capture-root"
            style={{
                width: '794px', // A4 width at 96 DPI
                minHeight: '1123px', // A4 height
                backgroundColor: '#ffffff',
                fontFamily: 'Helvetica, Arial, sans-serif',
                color: '#1e293b',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* ===== ROYAL BLUE HEADER ===== */}
            <div style={{
                background: 'linear-gradient(135deg, #3f68e4 0%, #2d4fb8 100%)',
                padding: '40px 48px 32px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
            }}>
                <div>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.5px' }}>
                        CreatorFlow
                    </div>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginTop: '4px', letterSpacing: '2px', textTransform: 'uppercase' as const }}>
                        Content Production Brief
                    </div>
                </div>
                <div style={{ textAlign: 'right' as const }}>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
                        Generated
                    </div>
                    <div style={{ fontSize: '14px', color: '#ffffff', fontWeight: 700, marginTop: '2px' }}>
                        {generatedDate}
                    </div>
                </div>
            </div>

            {/* ===== BODY ===== */}
            <div style={{ padding: '36px 48px 48px' }}>
                {/* Title */}
                <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', margin: '0 0 16px', lineHeight: 1.3 }}>
                    {content.title}
                </h1>

                {/* Platform + Status badges */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '28px', flexWrap: 'wrap' as const }}>
                    <span style={{
                        background: '#f1f5f9',
                        color: '#475569',
                        padding: '6px 16px',
                        borderRadius: '20px',
                        fontSize: '13px',
                        fontWeight: 700,
                    }}>
                        {platform.emoji} {platform.label}
                    </span>
                    <span style={{
                        background: statusStyle.bg,
                        color: statusStyle.color,
                        padding: '6px 16px',
                        borderRadius: '20px',
                        fontSize: '13px',
                        fontWeight: 700,
                    }}>
                        {content.status || 'Unknown'}
                    </span>
                </div>

                {/* ===== DATES — Two Columns ===== */}
                <div style={{
                    display: 'flex',
                    gap: '24px',
                    marginBottom: '28px',
                    padding: '20px 24px',
                    background: '#f8fafc',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                }}>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', letterSpacing: '1.5px', textTransform: 'uppercase' as const, marginBottom: '6px' }}>
                            PRODUCTION DATE
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b' }}>
                            {formatDate(content.production_date)}
                        </div>
                    </div>
                    <div style={{ width: '1px', background: '#e2e8f0' }} />
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', letterSpacing: '1.5px', textTransform: 'uppercase' as const, marginBottom: '6px' }}>
                            UPLOAD DATE
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b' }}>
                            {formatDate(content.upload_date)}
                        </div>
                    </div>
                </div>

                {/* ===== DESCRIPTION ===== */}
                {content.description && (
                    <div style={{ marginBottom: '28px' }}>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#3f68e4', letterSpacing: '1px', textTransform: 'uppercase' as const, marginBottom: '10px' }}>
                            Description
                        </div>
                        <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#475569', margin: 0 }}>
                            {content.description}
                        </p>
                    </div>
                )}

                {/* ===== SCRIPT / NOTES ===== */}
                {content.script && (
                    <div style={{ marginBottom: '28px' }}>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#3f68e4', letterSpacing: '1px', textTransform: 'uppercase' as const, marginBottom: '10px' }}>
                            Script / Notes
                        </div>
                        <div style={{
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            borderRadius: '12px',
                            padding: '20px 24px',
                        }}>
                            <p style={{ fontSize: '14px', lineHeight: 1.8, color: '#334155', margin: 0, whiteSpace: 'pre-wrap' as const }}>
                                {content.script}
                            </p>
                        </div>
                    </div>
                )}

                {/* ===== TEAM ===== */}
                {talents.length > 0 && (
                    <div style={{ marginBottom: '28px' }}>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#3f68e4', letterSpacing: '1px', textTransform: 'uppercase' as const, marginBottom: '10px' }}>
                            Assigned Team
                        </div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' as const }}>
                            {talents.map((name, i) => (
                                <span key={i} style={{
                                    background: '#eff6ff',
                                    color: '#2563eb',
                                    border: '1px solid #bfdbfe',
                                    padding: '6px 16px',
                                    borderRadius: '20px',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                }}>
                                    {name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* ===== REFERENCE LINK ===== */}
                {content.reference_link && (
                    <div style={{ marginBottom: '28px' }}>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#3f68e4', letterSpacing: '1px', textTransform: 'uppercase' as const, marginBottom: '10px' }}>
                            Reference Link
                        </div>
                        <div style={{
                            fontSize: '13px',
                            color: '#2563eb',
                            wordBreak: 'break-all' as const,
                        }}>
                            {content.reference_link}
                        </div>
                    </div>
                )}
            </div>

            {/* ===== FOOTER ===== */}
            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '16px 48px',
                borderTop: '2px solid #3f68e4',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 500 }}>
                    Generated via CreatorFlow - 2026
                </span>
                <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 500 }}>
                    creatorflow.app
                </span>
            </div>
        </div>
    )
}
