'use client'

import { useEffect, useRef, useState } from 'react'
import { THEMES } from './themes'

interface Props {
  current: string
  onChange: (id: string) => void
}

export default function ThemeSwitcher({ current, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const currentTheme = THEMES.find(t => t.id === current) ?? THEMES[0]

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} style={{ position: 'fixed', top: '16px', right: '82px', zIndex: 300 }}>

      {/* Botão trigger — swatch + nome + seta */}
      <button
        onClick={() => setOpen(o => !o)}
        title="mudar tema"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '7px',
          background: 'var(--ml)',
          border: '1px solid var(--md)',
          borderRadius: '8px',
          padding: '6px 12px 6px 8px',
          color: 'var(--ink)',
          fontFamily: 'inherit',
          fontSize: '12px',
          letterSpacing: '0.04em',
          cursor: 'pointer',
          boxShadow: 'var(--card-shadow)',
          transition: 'border-color 0.2s',
        }}
      >
        {/* Swatch da cor atual */}
        <span style={{
          display: 'inline-block',
          width: '10px', height: '10px',
          borderRadius: '50%',
          background: currentTheme.swatch,
          flexShrink: 0,
          boxShadow: `0 0 4px ${currentTheme.swatch}66`,
        }} />
        <span>tema</span>
        <span style={{ fontSize: '8px', opacity: 0.6, marginLeft: '1px' }}>
          {open ? '▲' : '▼'}
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          right: 0,
          background: 'var(--ml)',
          border: '1px solid var(--md)',
          borderRadius: '10px',
          overflow: 'hidden',
          minWidth: '148px',
          boxShadow: 'var(--card-shadow)',
        }}>
          {THEMES.map((t, i) => (
            <button
              key={t.id}
              onClick={() => { if (t.ready) { onChange(t.id); setOpen(false) } }}
              disabled={!t.ready}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
                padding: '9px 14px',
                background: t.id === current ? 'var(--md)' : 'transparent',
                border: 'none',
                borderTop: i > 0 ? '1px solid var(--md)' : 'none',
                color: t.ready ? 'var(--ink)' : 'var(--slm)',
                fontFamily: 'inherit',
                fontSize: '12px',
                letterSpacing: '0.04em',
                cursor: t.ready ? 'pointer' : 'default',
                textAlign: 'left',
                opacity: t.ready ? 1 : 0.55,
              }}
            >
              {/* Swatch */}
              <span style={{
                display: 'inline-block',
                width: '9px', height: '9px',
                borderRadius: '50%',
                background: t.swatch,
                flexShrink: 0,
                boxShadow: t.ready ? `0 0 4px ${t.swatch}88` : 'none',
              }} />
              <span style={{ flex: 1 }}>{t.label}</span>
              {!t.ready && (
                <span style={{ fontSize: '9px', opacity: 0.7 }}>em breve</span>
              )}
              {t.id === current && (
                <span style={{ fontSize: '9px', color: 'var(--sl)' }}>✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
