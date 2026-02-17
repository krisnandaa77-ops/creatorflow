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

    // ---- 5. Capture Header & Body separately ----
    const headerEl = iframeDoc.getElementById('pdf-brief-header')
    const bodyEl = iframeDoc.getElementById('pdf-brief-body')

    if (!headerEl || !bodyEl) {
        console.error('[exportContentToPDF] Cannot find #pdf-brief-header or #pdf-brief-body')
        root.unmount()
        document.body.removeChild(iframe)
        return
    }

    let headerCanvas: HTMLCanvasElement
    let bodyCanvas: HTMLCanvasElement

    try {
        // Capture Header
        headerCanvas = await html2canvas(headerEl, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: false,
            width: 794,
            windowWidth: 900,
        })
        // Capture Body
        bodyCanvas = await html2canvas(bodyEl, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: false,
            width: 794,
            windowWidth: 900,
            height: bodyEl.scrollHeight + 100, // Ensure no cutoff
        })
    } catch (err) {
        console.error('[exportContentToPDF] html2canvas error:', err)
        root.unmount()
        document.body.removeChild(iframe)
        return
    }

    // ---- 6. Generate PDF with Repeating Header ----
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
    })

    const pdfWidth = 210 // A4 mm
    const pageHeight = 297 // A4 mm

    // Pixel to mm scale factor
    // Canvas width is 794px * 2 (scale) = 1588px usually
    // But html2canvas width option sets the viewport width. 
    // We use the resulting canvas.width to determine scale.
    const scaleFactor = pdfWidth / headerCanvas.width

    const headerHeightMm = headerCanvas.height * scaleFactor
    const bodyHeightMm = bodyCanvas.height * scaleFactor

    // Space available for body on each page
    const availableHeightMm = pageHeight - headerHeightMm - 10 // 10mm margin bottom buffer

    if (availableHeightMm <= 0) {
        console.error('[exportContentToPDF] Header is too tall for page')
        headerCanvas.width = 1 // dummy to avoid crash
        // Fallback? or just continue
    }

    const headerImgData = headerCanvas.toDataURL('image/png')

    let remainingBodyMm = bodyHeightMm
    let currentBodyYMm = 0

    // Helper to slice the body canvas
    const getBodySliceUrl = (yMm: number, hMm: number): string => {
        // Convert mm back to pixels
        const yPx = yMm / scaleFactor
        const hPx = hMm / scaleFactor

        const sliceCanvas = document.createElement('canvas')
        sliceCanvas.width = bodyCanvas.width
        sliceCanvas.height = hPx

        const ctx = sliceCanvas.getContext('2d')
        if (!ctx) return ''

        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height)

        // Draw the specific slice
        // sourceX, sourceY, sourceW, sourceH, destX, destY, destW, destH
        ctx.drawImage(
            bodyCanvas,
            0, yPx, bodyCanvas.width, hPx,
            0, 0, sliceCanvas.width, sliceCanvas.height
        )

        return sliceCanvas.toDataURL('image/png')
    }

    let pageIndex = 0

    while (remainingBodyMm > 0) {
        if (pageIndex > 0) pdf.addPage()

        // 1. Draw Header
        pdf.addImage(headerImgData, 'PNG', 0, 0, pdfWidth, headerHeightMm)

        // 2. Determine slice height
        const sliceHeightMm = Math.min(remainingBodyMm, availableHeightMm)

        if (sliceHeightMm > 0) {
            const sliceImgData = getBodySliceUrl(currentBodyYMm, sliceHeightMm)
            // 3. Draw Body Slice
            pdf.addImage(sliceImgData, 'PNG', 0, headerHeightMm, pdfWidth, sliceHeightMm)
        }

        remainingBodyMm -= sliceHeightMm
        currentBodyYMm += sliceHeightMm
        pageIndex++
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
    // Canvas elements are GC'd

    console.log('[exportContentToPDF] SUCCESS:', `${safeName}_Brief.pdf`)
}
