import { forwardRef } from 'react'

interface PrintableBriefProps {
    title: string
    platform: string
    talentNames: string[]
    productionDate: string | null
    uploadDate: string | null
    referenceLink: string | null
    script: string | null
}

export const PrintableBrief = forwardRef<HTMLDivElement, PrintableBriefProps>(
    function PrintableBrief(
        { title, platform, talentNames, productionDate, uploadDate, referenceLink, script },
        ref
    ) {
        return (
            <div ref={ref} className="print-brief">
                <style>{`
                    .print-brief {
                        font-family: 'Segoe UI', system-ui, sans-serif;
                        padding: 48px;
                        color: #1a1a1a;
                        max-width: 720px;
                        margin: 0 auto;
                    }
                    .print-brief .header {
                        text-align: center;
                        border-bottom: 3px solid #1a1a1a;
                        padding-bottom: 16px;
                        margin-bottom: 32px;
                    }
                    .print-brief .header h1 {
                        font-size: 14px;
                        letter-spacing: 6px;
                        text-transform: uppercase;
                        color: #666;
                        margin: 0 0 4px 0;
                    }
                    .print-brief .header h2 {
                        font-size: 22px;
                        font-weight: 800;
                        letter-spacing: 2px;
                        text-transform: uppercase;
                        margin: 0;
                    }
                    .print-brief .info-grid {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 16px;
                        margin-bottom: 24px;
                    }
                    .print-brief .info-item {
                        padding: 12px 16px;
                        background: #f8f8f8;
                        border-radius: 8px;
                    }
                    .print-brief .info-item .label {
                        font-size: 10px;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                        color: #888;
                        margin-bottom: 4px;
                    }
                    .print-brief .info-item .value {
                        font-size: 15px;
                        font-weight: 600;
                    }
                    .print-brief .info-full {
                        grid-column: 1 / -1;
                    }
                    .print-brief .section {
                        margin-bottom: 24px;
                    }
                    .print-brief .section-title {
                        font-size: 11px;
                        text-transform: uppercase;
                        letter-spacing: 2px;
                        color: #888;
                        margin-bottom: 8px;
                        padding-bottom: 4px;
                        border-bottom: 1px solid #eee;
                    }
                    .print-brief .ref-box {
                        padding: 12px 16px;
                        background: #f0f7ff;
                        border: 1px solid #d0e3ff;
                        border-radius: 8px;
                        word-break: break-all;
                        font-size: 13px;
                        color: #2563eb;
                    }
                    .print-brief .script-box {
                        padding: 20px;
                        background: #fafafa;
                        border: 1px solid #e5e5e5;
                        border-radius: 8px;
                        font-size: 14px;
                        line-height: 1.8;
                        white-space: pre-wrap;
                        min-height: 200px;
                    }
                    .print-brief .footer {
                        margin-top: 48px;
                        padding-top: 16px;
                        border-top: 1px solid #e5e5e5;
                        text-align: right;
                        font-size: 13px;
                        color: #888;
                    }
                    .print-brief .footer strong {
                        display: block;
                        font-size: 15px;
                        color: #1a1a1a;
                        margin-top: 4px;
                    }
                    @media print {
                        .print-brief {
                            padding: 24px;
                        }
                    }
                `}</style>

                {/* Header */}
                <div className="header">
                    <h1>CreatorFlow</h1>
                    <h2>Production Brief</h2>
                </div>

                {/* Info Grid */}
                <div className="info-grid">
                    <div className="info-item info-full">
                        <div className="label">Content Title</div>
                        <div className="value">{title}</div>
                    </div>
                    <div className="info-item">
                        <div className="label">Platform</div>
                        <div className="value">{platform}</div>
                    </div>
                    <div className="info-item">
                        <div className="label">Talent</div>
                        <div className="value">
                            {talentNames.length > 0 ? talentNames.join(', ') : '—'}
                        </div>
                    </div>
                    <div className="info-item">
                        <div className="label">Production Date</div>
                        <div className="value">
                            {productionDate ? new Date(productionDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
                        </div>
                    </div>
                    <div className="info-item">
                        <div className="label">Target Upload</div>
                        <div className="value">
                            {uploadDate ? new Date(uploadDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
                        </div>
                    </div>
                    <div className="info-item info-full">
                        <div className="label">Location</div>
                        <div className="value">CWorld Arena</div>
                    </div>
                </div>

                {/* Reference Link */}
                {referenceLink && (
                    <div className="section">
                        <div className="section-title">Reference Link</div>
                        <div className="ref-box">{referenceLink}</div>
                    </div>
                )}

                {/* Script */}
                <div className="section">
                    <div className="section-title">Script / Naskah</div>
                    <div className="script-box">
                        {script || '(No script written yet)'}
                    </div>
                </div>

                {/* Footer */}
                <div className="footer">
                    Best Regards,
                    <strong>Krisnanda</strong>
                </div>
            </div>
        )
    }
)
