'use client'

import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BriefTemplate } from '@/components/pdf/BriefTemplate'

// ============================================================
// Robust PDF pipeline — isolates template from page CSS
// to prevent lab()/oklch() color function errors
// ============================================================

interface ContentData {
    id?: string
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

export async function exportContentToPDF(content: ContentData): Promise<void> {
    // ---- 1. Create an isolated container ----
    // Use an iframe to completely isolate from page CSS (lab(), oklch(), etc.)
    const iframe = document.createElement('iframe')
    iframe.style.position = 'fixed'
    iframe.style.left = '-10000px'
    iframe.style.top = '0'
    iframe.style.width = '900px'
    iframe.style.height = '1200px'
    iframe.style.border = 'none'
    iframe.style.opacity = '0'
    iframe.style.pointerEvents = 'none'
    document.body.appendChild(iframe)

    // Wait for iframe to load
    await new Promise<void>((resolve) => {
        iframe.onload = () => resolve()
        // Trigger load for about:blank
        iframe.src = 'about:blank'
    })

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
    if (!iframeDoc) {
        console.error('[exportContentToPDF] Cannot access iframe document')
        document.body.removeChild(iframe)
        return
    }

    // ---- 2. Write minimal CSS reset into iframe (hex colors only) ----
    iframeDoc.open()
    iframeDoc.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                body {
                    font-family: Helvetica, Arial, sans-serif;
                    color: #0f172a;
                    background: #ffffff;
                    -webkit-font-smoothing: antialiased;
                }
            </style>
        </head>
        <body>
            <div id="pdf-mount"></div>
        </body>
        </html>
    `)
    iframeDoc.close()

    // ---- 3. Mount React component inside iframe ----
    const mountPoint = iframeDoc.getElementById('pdf-mount')
    if (!mountPoint) {
        console.error('[exportContentToPDF] Cannot find mount point in iframe')
        document.body.removeChild(iframe)
        return
    }

    const root = ReactDOM.createRoot(mountPoint)
    root.render(React.createElement(BriefTemplate, { content }))

    // ---- 4. Wait for render + fonts ----
    await new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
            const fontsReady = iframeDoc.fonts?.ready || Promise.resolve()
            fontsReady.then(() => {
                // Extra paint delay
                setTimeout(resolve, 300)
            })
        })
    })

    // ---- 5. Capture with html2canvas ----
    const captureEl = iframeDoc.getElementById('pdf-brief-root')
    if (!captureEl) {
        console.error('[exportContentToPDF] Cannot find #pdf-brief-root in iframe')
        root.unmount()
        document.body.removeChild(iframe)
        return
    }

    let canvas: HTMLCanvasElement
    try {
        canvas = await html2canvas(captureEl, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: false,
            allowTaint: true,
            width: 794,
            height: captureEl.scrollHeight,
            // Force the canvas to use the iframe's window context
            windowWidth: 900,
            windowHeight: 1200,
        })
    } catch (err) {
        console.error('[exportContentToPDF] html2canvas error:', err)
        root.unmount()
        document.body.removeChild(iframe)
        return
    }

    // ---- 6. Generate PDF ----
    const imgData = canvas.toDataURL('image/png')
    const pdfWidth = 210 // A4 mm
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width
    const pageHeight = 297 // A4 mm

    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
    })

    let remainingHeight = pdfHeight
    let yOffset = 0

    pdf.addImage(imgData, 'PNG', 0, yOffset, pdfWidth, pdfHeight)
    remainingHeight -= pageHeight

    while (remainingHeight > 0) {
        yOffset -= pageHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, yOffset, pdfWidth, pdfHeight)
        remainingHeight -= pageHeight
    }

    // ---- 7. Save ----
    const safeName = content.title
        ?.replace(/[^a-zA-Z0-9\s]/g, '')
        .replace(/\s+/g, '_')
        .slice(0, 40) || 'Content'
    pdf.save(`${safeName}_Brief.pdf`)

    // ---- 8. Cleanup ----
    root.unmount()
    document.body.removeChild(iframe)

    console.log('[exportContentToPDF] SUCCESS:', `${safeName}_Brief.pdf`)
}
