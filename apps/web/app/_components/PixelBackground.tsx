'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function PixelBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const pathname = usePathname()
    const isHome = pathname === '/'
    const [mode, setMode] = useState<'splash' | 'soft' | 'hidden' | 'fullscreen'>(isHome ? 'soft' : 'hidden')
    const [showSplash, setShowSplash] = useState(false)

    // Verifica se já mostrou o splash nessa sessão
    useEffect(() => {
        const seen = sessionStorage.getItem('splash-seen')
        if (!seen) {
            setShowSplash(true)
            setMode('splash')
            sessionStorage.setItem('splash-seen', 'true')

            const timer = setTimeout(() => {
                setMode('soft')
                setTimeout(() => setShowSplash(false), 800) // espera o fade
            }, 3000)

            return () => clearTimeout(timer)
        }
    }, [])

    useEffect(() => {
        const cv = canvasRef.current
        if (!cv) return
        drawHero(cv)
    }, [])

    const opacityValue = mode === 'splash' || mode === 'fullscreen' ? 1 : 0.25

    return (
        <>
            {/* Background fixo */}
            <div style={{
                position: 'fixed', inset: 0, zIndex: mode === 'fullscreen' ? 200 : 0,
                pointerEvents: 'none',
                opacity: opacityValue,
                transition: 'opacity 0.8s ease',
                overflow: 'hidden',
                background: 'var(--mb)',
            }}>
                <canvas ref={canvasRef} width={280} height={158} style={{
                    width: '100%', height: '100%',
                    imageRendering: 'pixelated',
                    objectFit: 'cover',
                }} />
            </div>

            {/* Botão "ver arte" — esconde durante splash */}
            {!showSplash && (
                <button
                    onClick={() => setMode(mode === 'fullscreen' ? (isHome ? 'soft' : 'hidden') : 'fullscreen')}
                    title={mode === 'fullscreen' ? 'fechar arte' : 'ver arte'}
                    style={{
                        position: 'fixed',
                        top: '20px',
                        right: '20px',
                        zIndex: 300,
                        background: 'var(--sl)',
                        border: 'none',
                        borderRadius: '999px',
                        padding: '6px',
                        width: '52px',
                        height: '28px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: mode === 'fullscreen' ? 'flex-end' : 'flex-start',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    }}
                >
                    <div style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        background: mode === 'fullscreen' ? 'var(--cr)' : 'var(--mb)',
                        transition: 'background 0.3s ease',
                    }} />
                </button>
            )}
        </>
    )
}

function drawHero(cv: HTMLCanvasElement) {
    const W = cv.width, H = cv.height
    const ctx = cv.getContext('2d')!
    ctx.clearRect(0, 0, W, H)
    ctx.imageSmoothingEnabled = false

    const RED = '#921821', INK = '#3a3a3a', PAPER = '#d8d1c6'

    let s = 20260624
    const rng = () => { s |= 0; s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = (t + Math.imul(t ^ t >>> 7, 61 | t)) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296 }
    const px = (x: number, y: number, c: string) => { x |= 0; y |= 0; if (x < 0 || y < 0 || x >= W || y >= H) return; ctx.fillStyle = c; ctx.fillRect(x, y, 1, 1) }
    const rect = (x: number, y: number, w: number, h: number, c: string) => { ctx.fillStyle = c; ctx.fillRect(x | 0, y | 0, Math.max(0, w | 0), Math.max(0, h | 0)) }
    const clr = (x: number, y: number, w: number, h: number) => ctx.clearRect(x | 0, y | 0, Math.max(0, w | 0), Math.max(0, h | 0))
    const ellFn = (cx: number, cy: number, rx: number, ry: number, cb: (x: number, y: number, w: number) => void) => { for (let y = -ry; y <= ry; y++) { const hw = Math.floor(rx * Math.sqrt(Math.max(0, 1 - (y * y) / (ry * ry))) + 1e-4); cb(cx - hw, cy + y, hw * 2 + 1) } }
    const fillEll = (cx: number, cy: number, rx: number, ry: number, c: string) => ellFn(cx, cy, rx, ry, (x, y, w) => { ctx.fillStyle = c; ctx.fillRect(x | 0, y | 0, w, 1) })
    const clrEll = (cx: number, cy: number, rx: number, ry: number) => ellFn(cx, cy, rx, ry, (x, y, w) => ctx.clearRect(x | 0, y | 0, w, 1))
    const line = (x0: number, y0: number, x1: number, y1: number, c: string) => { x0 |= 0; y0 |= 0; x1 |= 0; y1 |= 0; const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1; let e = dx + dy; for (; ;) { px(x0, y0, c); if (x0 === x1 && y0 === y1) break; const e2 = 2 * e; if (e2 >= dy) { e += dy; x0 += sx } if (e2 <= dx) { e += dx; y0 += sy } } }
    const poly = (pts: number[][], c: string) => { let mn = 1e9, mx = -1e9; for (const q of pts) { mn = Math.min(mn, q[1]); mx = Math.max(mx, q[1]) } for (let y = Math.floor(mn); y <= Math.ceil(mx); y++) { const xs: number[] = []; for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; if ((a[1] <= y && b[1] > y) || (b[1] <= y && a[1] > y)) xs.push(a[0] + (y - a[1]) / (b[1] - a[1]) * (b[0] - a[0])) } xs.sort((u, v) => u - v); for (let i = 0; i + 1 < xs.length; i += 2) { const xa = Math.round(xs[i]), xb = Math.round(xs[i + 1]); rect(xa, y, Math.max(1, xb - xa), 1, c) } } }
    const polyline = (pts: number[][], c: string) => { for (let i = 0; i + 1 < pts.length; i++) line(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], c) }
    const ringO = (cx: number, cy: number, r: number, c: string) => { let x = r, y = 0, e = 1 - r; while (x >= y) { for (const [a, b] of [[x, y], [y, x], [-x, y], [-y, x], [x, -y], [y, -x], [-x, -y], [-y, -x]]) px(cx + a, cy + b, c); y++; if (e < 0) e += 2 * y + 1; else { x--; e += 2 * (y - x) + 1 } } }
    const star4 = (cx: number, cy: number, r: number, c: string) => { for (let i = -r; i <= r; i++) { px(cx + i, cy, c); px(cx, cy + i, c) } px(cx + 1, cy + 1, c); px(cx - 1, cy - 1, c); px(cx + 1, cy - 1, c); px(cx - 1, cy + 1, c) }
    const d20 = (cx: number, cy: number, r: number, c: string, thick: boolean) => { const P: number[][] = []; for (let i = 0; i < 6; i++) { const a = Math.PI / 2 + i * Math.PI / 3; P.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]) } const seg = (A: number[], B: number[]) => { line(A[0], A[1], B[0], B[1], c); if (thick) line(A[0] + 1, A[1], B[0] + 1, B[1], c) }; for (let i = 0; i < 6; i++) seg(P[i], P[(i + 1) % 6]); seg(P[0], P[2]); seg(P[2], P[4]); seg(P[4], P[0]); line(P[1][0], P[1][1], cx, cy, c); line(P[3][0], P[3][1], cx, cy, c); line(P[5][0], P[5][1], cx, cy, c) }
    const flower = (cx: number, cy: number, r: number, pc: string, cc: string) => { for (let i = 0; i < 5; i++) { const a = i * 2 * Math.PI / 5 - Math.PI / 2; fillEll(Math.round(cx + Math.cos(a) * r), Math.round(cy + Math.sin(a) * r), 2, 2, pc) } fillEll(cx, cy, 1, 1, cc) }

    // sol
    { const sx = 40, sy = 32; fillEll(sx, sy, 8, 8, RED); ringO(sx, sy, 11, INK); const rays = [[0, -1], [1, 0], [0, 1], [-1, 0], [1, -1], [1, 1], [-1, 1], [-1, -1]]; for (const [dx, dy] of rays) { const L = Math.abs(dx) + Math.abs(dy) > 1 ? 6 : 8; for (let t = 14; t < 14 + L; t++) { const k = (Math.abs(dx) && Math.abs(dy)) ? 0.7 : 1; px(sx + Math.round(dx * t * k), sy + Math.round(dy * t * k), INK) } } }
    // círculo mágico
    { const mcx = 236, mcy = 58; ringO(mcx, mcy, 16, INK); ringO(mcx, mcy, 11, RED); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; px(mcx + Math.round(Math.cos(a) * 16), mcy + Math.round(Math.sin(a) * 16), RED) } star4(mcx, mcy, 3, INK) }
    // runas
    const rune = (x: number, y: number, c: string) => { line(x, y, x, y + 8, c); line(x, y, x + 4, y + 4, c); line(x + 4, y + 4, x, y + 5, c); line(x, y + 5, x + 4, y + 9, c) }
    rune(20, 86, INK); rune(258, 98, RED); rune(206, 120, INK); rune(60, 128, RED)
    // estrelas
    star4(70, 20, 3, RED); star4(250, 28, 2, INK); star4(22, 116, 2, RED); star4(262, 132, 3, INK); star4(90, 134, 2, INK); star4(214, 18, 2, RED); star4(170, 16, 2, INK)
    // d20
    d20(40, 124, 17, RED, true); d20(40, 124, 17, RED, false); rect(37, 121, 7, 7, RED); rect(38, 122, 5, 1, INK); rect(38, 124, 5, 1, INK); rect(38, 126, 5, 1, INK)
    // d6
    { const d6x = 236, d6y = 120, sz = 15; rect(d6x, d6y, sz, sz, INK); for (let i = 0; i < sz; i++) { px(d6x + i, d6y, RED); px(d6x + i, d6y + sz - 1, RED); px(d6x, d6y + i, RED); px(d6x + sz - 1, d6y + i, RED) } const pip = (ox: number, oy: number) => { rect(d6x + ox, d6y + oy, 2, 2, RED) }; pip(3, 3); pip(10, 3); pip(3, 10); pip(10, 10); pip(6, 6) }
    // vela
    { const cx2 = 200, cy2 = 92; rect(cx2 - 2, cy2, 5, 12, INK); line(cx2, cy2 - 3, cx2, cy2, INK); fillEll(cx2, cy2 - 6, 2, 3, RED); px(cx2, cy2 - 9, RED); rect(cx2 - 3, cy2 + 11, 7, 2, INK); for (let i = 0; i < 5; i++) px(cx2 + Math.round(Math.sin(i) * 2), cy2 - 12 - i * 2, INK) }
    // dragão
    { const dx = 250, dy = 14; polyline([[dx, dy + 10], [dx + 6, dy + 6], [dx + 12, dy + 8], [dx + 18, dy + 4], [dx + 22, dy + 8], [dx + 18, dy + 11], [dx + 12, dy + 12]], INK); poly([[dx + 18, dy + 4], [dx + 24, dy - 2], [dx + 22, dy + 6]], INK); line(dx + 9, dy + 8, dx + 5, dy + 2, INK); line(dx + 12, dy + 8, dx + 16, dy + 1, INK); px(dx + 21, dy + 5, RED) }

    // ROSTO
    const CL = 140, FCY = 80
    fillEll(CL, FCY - 10, 36, 40, INK)
    poly([[CL - 34, FCY - 2], [CL - 38, FCY + 18], [CL - 32, FCY + 42], [CL - 22, FCY + 48], [CL - 22, FCY + 28], [CL - 26, FCY + 8]], INK)
    poly([[CL + 34, FCY - 4], [CL + 38, FCY + 18], [CL + 32, FCY + 42], [CL + 22, FCY + 48], [CL + 22, FCY + 28], [CL + 26, FCY + 8]], INK)
    clrEll(CL, FCY + 2, 26, 34)
    poly([[CL - 26, FCY + 22], [CL - 12, FCY + 38], [CL - 26, FCY + 38]], INK)
    poly([[CL + 26, FCY + 22], [CL + 12, FCY + 38], [CL + 26, FCY + 38]], INK)
    poly([[CL - 10, FCY + 34], [CL, FCY + 38], [CL + 10, FCY + 34], [CL, FCY + 36]], INK)
    clr(CL - 2, FCY + 34, 4, 2)
    clr(CL - 9, FCY + 34, 18, 22)
    poly([[58, 158], [58, FCY + 78], [CL - 22, FCY + 58], [CL - 9, FCY + 52], [CL + 9, FCY + 52], [CL + 22, FCY + 58], [222, FCY + 78], [222, 158]], INK)
    clr(CL - 8, FCY + 34, 16, 18)
    poly([[CL - 8, FCY + 50], [CL + 8, FCY + 50], [CL + 13, FCY + 57], [CL - 13, FCY + 57]], INK)
    line(CL - 7, FCY + 45, CL - 6, FCY + 52, INK); line(CL + 7, FCY + 45, CL + 6, FCY + 52, INK)
    px(CL, FCY + 54, RED)
    poly([[CL - 28, FCY - 32], [CL - 16, FCY - 36], [CL - 2, FCY - 34], [CL + 14, FCY - 32], [CL + 24, FCY - 26], [CL + 26, FCY - 14], [CL + 22, FCY - 8], [CL + 14, FCY - 12], [CL + 6, FCY - 8], [CL - 4, FCY - 12], [CL - 14, FCY - 8], [CL - 22, FCY - 12], [CL - 28, FCY - 18]], INK)
    poly([[CL + 8, FCY - 30], [CL + 16, FCY - 28], [CL + 20, FCY - 22], [CL + 14, FCY - 20], [CL + 10, FCY - 24]], INK)
    poly([[CL + 24, FCY - 10], [CL + 30, FCY + 6], [CL + 28, FCY + 26], [CL + 22, FCY + 22], [CL + 22, FCY + 4]], INK)
    poly([[CL - 24, FCY - 10], [CL - 30, FCY + 6], [CL - 28, FCY + 26], [CL - 22, FCY + 22], [CL - 22, FCY + 4]], INK)
    polyline([[CL - 30, FCY - 22], [CL - 18, FCY - 32], [CL, FCY - 38], [CL + 18, FCY - 32], [CL + 30, FCY - 20]], RED)
    line(CL - 22, FCY - 18, CL - 6, FCY - 16, RED); line(CL + 10, FCY - 16, CL + 20, FCY - 12, RED)
    line(CL + 28, FCY + 0, CL + 27, FCY + 22, RED); line(CL - 28, FCY + 0, CL - 27, FCY + 22, RED)
    line(CL - 36, FCY + 22, CL - 32, FCY + 42, RED); line(CL + 36, FCY + 22, CL + 32, FCY + 42, RED)
    clr(CL - 4, FCY - 34, 3, 2); clr(CL + 10, FCY - 32, 2, 1); clr(CL - 14, FCY - 28, 2, 1)
    clr(CL + 22, FCY + 2, 2, 2); clr(CL - 34, FCY + 12, 1, 2)
    poly([[CL + 22, FCY + 6], [CL + 28, FCY + 8], [CL + 27, FCY + 16], [CL + 22, FCY + 15]], INK)
    px(CL + 24, FCY + 10, RED); px(CL + 24, FCY + 12, RED); px(CL + 25, FCY + 18, RED); px(CL + 25, FCY + 19, RED)
    px(CL + 20, FCY + 8, RED); px(CL + 21, FCY + 12, RED); px(CL + 20, FCY + 16, RED); px(CL + 21, FCY + 20, RED)
    line(CL + 6, FCY - 6, CL + 12, FCY - 8, INK); line(CL + 12, FCY - 8, CL + 18, FCY - 7, INK); px(CL + 18, FCY - 6, INK)
    line(CL - 18, FCY - 7, CL - 12, FCY - 8, INK); line(CL - 12, FCY - 8, CL - 6, FCY - 6, INK); px(CL - 18, FCY - 6, INK)
    rect(CL + 5, FCY + 2, 14, 2, INK); px(CL + 4, FCY + 3, INK); px(CL + 19, FCY + 2, INK); px(CL + 20, FCY + 3, INK); px(CL + 20, FCY + 4, INK); px(CL + 21, FCY + 4, INK)
    clr(CL + 6, FCY + 4, 13, 7); rect(CL + 9, FCY + 4, 7, 7, RED); rect(CL + 11, FCY + 6, 3, 4, INK)
    clr(CL + 10, FCY + 5, 2, 2); px(CL + 14, FCY + 9, PAPER)
    px(CL + 7, FCY + 11, INK); px(CL + 11, FCY + 11, INK); px(CL + 15, FCY + 11, INK); px(CL + 18, FCY + 11, INK)
    px(CL + 8, FCY + 13, RED); px(CL + 16, FCY + 13, RED)
    rect(CL - 18, FCY + 2, 14, 2, INK); px(CL - 19, FCY + 3, INK); px(CL - 4, FCY + 2, INK); px(CL - 3, FCY + 3, INK); px(CL - 20, FCY + 4, INK); px(CL - 21, FCY + 4, INK)
    clr(CL - 18, FCY + 4, 13, 7); rect(CL - 15, FCY + 4, 7, 7, RED); rect(CL - 13, FCY + 6, 3, 4, INK)
    clr(CL - 11, FCY + 5, 2, 2); px(CL - 13, FCY + 9, PAPER)
    px(CL - 7, FCY + 11, INK); px(CL - 11, FCY + 11, INK); px(CL - 15, FCY + 11, INK); px(CL - 18, FCY + 11, INK)
    px(CL - 8, FCY + 13, RED); px(CL - 16, FCY + 13, RED)
    px(CL, FCY + 17, RED); px(CL + 1, FCY + 19, RED); px(CL - 1, FCY + 19, RED)
    px(CL - 1, FCY + 26, INK); px(CL + 1, FCY + 26, INK)
    line(CL - 4, FCY + 27, CL + 4, FCY + 27, INK)
    px(CL - 5, FCY + 27, INK); px(CL + 5, FCY + 27, INK); px(CL - 5, FCY + 28, INK); px(CL + 5, FCY + 28, INK)
    rect(CL - 4, FCY + 28, 9, 2, RED); px(CL + 1, FCY + 28, PAPER)
    for (const [bx, by] of [[CL + 14, FCY + 15], [CL + 16, FCY + 16], [CL + 18, FCY + 15], [CL + 15, FCY + 17]]) px(bx, by, RED)
    for (const [bx, by] of [[CL - 14, FCY + 15], [CL - 16, FCY + 16], [CL - 18, FCY + 15], [CL - 15, FCY + 17]]) px(bx, by, RED)
    flower(CL - 26, FCY - 22, 4, RED, INK); flower(CL - 22, FCY - 10, 3, RED, INK)
    line(CL - 24, FCY - 18, CL - 21, FCY - 12, INK)

    for (let i = 0; i < 260; i++) {
        const x = Math.floor(rng() * W), y = Math.floor(rng() * H)
        if (rng() < 0.55) continue
        const a = ctx.getImageData(x, y, 1, 1).data[3]
        if (a < 10) px(x, y, rng() < 0.5 ? RED : INK)
    }
}